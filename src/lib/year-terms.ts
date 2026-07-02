import { tecTermToSlug } from "@/lib/tech-utils";
import { ArticleModel, resolveArticleTerms, tecTerms, type TecTerm } from "@/model/article";

/** Ano de corte da comparação: publicações antes vs. a partir deste ano. */
export const YEAR_THRESHOLD = 2021;

export type YearTermRow = {
	term: TecTerm;
	slug: string;
	/** Publicações com ano < YEAR_THRESHOLD. */
	before: number;
	/** Publicações com ano >= YEAR_THRESHOLD. */
	after: number;
	/** before + after. */
	total: number;
};

/**
 * Monta as linhas do gráfico comparativo de /sumarizacao: cada tecnologia vira
 * uma linha com a quantidade de publicações antes e a partir de {@link YEAR_THRESHOLD}.
 *
 * A associação artigo→tecnologia usa {@link resolveArticleTerms} (mesma regra do
 * restante do app) e o ano vem de `publication_year` dos artigos estendidos.
 * Linhas sem publicações são descartadas; a ordenação é pela soma decrescente.
 */
export async function getYearTermRows(): Promise<YearTermRow[]> {
	const model = new ArticleModel();
	const [extended, frequencyTerms] = await Promise.all([
		model.getArticlesExtended(),
		model.loadFrequencyTerms(),
	]);

	const counts = new Map<TecTerm, { before: number; after: number }>(
		tecTerms.map((term) => [term, { before: 0, after: 0 }]),
	);

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

		for (const term of technology) {
			const bucket = counts.get(term);
			if (!bucket) continue;
			if (year < YEAR_THRESHOLD) bucket.before += 1;
			else bucket.after += 1;
		}
	}

	return tecTerms
		.map((term) => {
			const { before, after } = counts.get(term) ?? { before: 0, after: 0 };
			return { term, slug: tecTermToSlug(term), before, after, total: before + after };
		})
		.filter((row) => row.total > 0)
		.sort((a, b) => b.total - a.total || b.after - a.after || a.term.localeCompare(b.term));
}
