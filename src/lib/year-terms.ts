import { tecTermToSlug } from "@/lib/tech-utils";
import { ArticleModel, resolveArticleTerms, tecTerms, type TecTerm } from "@/model/article";

/** Ano de corte padrão da comparação: publicações antes vs. a partir dele. */
export const YEAR_THRESHOLD = 2021;

export type YearTermRow = {
	term: TecTerm;
	slug: string;
	/** Publicações por ano de publicação. */
	byYear: Record<number, number>;
	/** Total de publicações (todos os anos). */
	total: number;
};

export type YearTermsData = {
	rows: YearTermRow[];
	/** Anos de corte selecionáveis (crescente), derivados do intervalo dos dados. */
	years: number[];
	/** Corte inicial, dentro de {@link YearTermsData.years}. */
	defaultThreshold: number;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

/**
 * Monta os dados do gráfico comparativo de /sumarizacao: cada tecnologia vira uma
 * linha com a contagem de publicações por ano. A partição em "antes" e "a partir
 * de" um ano de corte é feita no cliente, permitindo o seletor de ano dinâmico.
 *
 * A associação artigo→tecnologia usa {@link resolveArticleTerms} (mesma regra do
 * restante do app) e o ano vem de `publication_year` dos artigos estendidos.
 * Linhas sem publicações são descartadas; a ordenação é pela soma decrescente
 * (fixa, independente do corte, para as linhas não reordenarem ao trocar o ano).
 */
export async function getYearTermsData(): Promise<YearTermsData> {
	const model = new ArticleModel();
	const [extended, frequencyTerms] = await Promise.all([
		model.getArticlesExtended(),
		model.loadFrequencyTerms(),
	]);

	const counts = new Map<TecTerm, Record<number, number>>(
		tecTerms.map((term) => [term, {}]),
	);

	let minYear = Infinity;
	let maxYear = -Infinity;

	for (const [idKey, content] of Object.entries(extended)) {
		const articleId = Number(idKey);
		const year = Number(content.publication_year);
		if (!Number.isFinite(year)) continue;

		const article = {
			title: content.title,
			abstract: content.abstract,
			keywords: content.keywords,
		};
		const { technology } = resolveArticleTerms(article, frequencyTerms[articleId]);
		if (technology.length === 0) continue;

		minYear = Math.min(minYear, year);
		maxYear = Math.max(maxYear, year);

		for (const term of technology) {
			const bucket = counts.get(term);
			if (!bucket) continue;
			bucket[year] = (bucket[year] ?? 0) + 1;
		}
	}

	const rows = tecTerms
		.map((term) => {
			const byYear = counts.get(term) ?? {};
			const total = Object.values(byYear).reduce((sum, n) => sum + n, 0);
			return { term, slug: tecTermToSlug(term), byYear, total };
		})
		.filter((row) => row.total > 0)
		.sort((a, b) => b.total - a.total || a.term.localeCompare(b.term));

	// Cortes úteis: min+1..max, para que ambos os lados possam ter publicações.
	const years: number[] = [];
	if (Number.isFinite(minYear) && Number.isFinite(maxYear) && maxYear > minYear) {
		for (let y = minYear + 1; y <= maxYear; y++) years.push(y);
	}

	const defaultThreshold =
		years.length > 0
			? clamp(YEAR_THRESHOLD, years[0], years[years.length - 1])
			: YEAR_THRESHOLD;

	return { rows, years, defaultThreshold };
}
