import { ArticlesYearLineChart } from "@/components/charts/articles-year-line-chart";
import { getToneColorByIndex } from "@/components/charts/chart-palettes";
import { TermsMultiLineChartClient } from "@/components/charts/terms-multi-line-chart-client";
import { TermsArticlesMapClient } from "@/components/termos/terms-articles-map-client";
import institutionInformationData from "@/data/instituition_information.json";
import { formatTermLabel, getTermsSearchResults } from "@/lib/terms-search";
import type {
	ArticleMapPoint,
	TechnologyLegendItem,
} from "@/components/termos/terms-articles-map";

type ExtendedArticleRecord = {
	["authorships.institutions.id"]?: string | string[] | null;
	corresponding_institution_ids?: string | string[] | null;
	publication_year?: number | string | null;
	title?: string;
	json_title?: string;
};

type InstitutionInformationRecord = {
	display_name: string;
	country_code?: string | null;
	geo?: {
		city?: string | null;
		region?: string | null;
		country?: string | null;
		latitude: number;
		longitude: number;
	};
};

const MULTI_TECH_COLOR = "#ec4899";
const NO_TECH_COLOR = "#94a3b8";
const MULTI_TECH_KEY = "__multi__";
const NO_TECH_KEY = "__none__";

function formatTotal(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

function toStringArray(value: string | string[] | null | undefined) {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) {
		return value.filter((entry): entry is string => typeof entry === "string");
	}
	return [];
}

function isValidOpenAlexInstitutionId(value: string) {
	return /^https:\/\/openalex\.org\/I\d+$/i.test(value.trim());
}

export default async function ContextualizacaoGeralPage() {
	const termsResults = await getTermsSearchResults({});

	const {
		flatArticles,
		articlesExtended,
		totalResults,
		yearlyArticlesTrend,
		technologyTermsTrend,
		environmentalTermsTrend,
		groups,
	} = termsResults;

	const totalArticles = totalResults;
	const totalAreas = groups.length;

	const availableTechnologyTerms = Array.from(
		new Set(flatArticles.flatMap((record) => record.technologyTermsFull)),
	).sort((a, b) => a.localeCompare(b, "pt-BR"));
	const technologyColorByKey = new Map<string, string>();
	availableTechnologyTerms.forEach((term, index) => {
		technologyColorByKey.set(term, getToneColorByIndex("blue", index));
	});

	const institutionsById =
		institutionInformationData as Record<string, InstitutionInformationRecord>;
	const mapPoints: ArticleMapPoint[] = [];
	const articlesWithMappedInstitutions = new Set<number>();
	const mappedInstitutionIds = new Set<string>();
	const technologyCountsByKey = new Map<string, number>();

	for (const record of flatArticles) {
		const extended = articlesExtended[String(record.article.id)] as
			| ExtendedArticleRecord
			| undefined;
		if (!extended) continue;

		const institutionIds = toStringArray(extended.corresponding_institution_ids);
		let hasMapped = false;

		const techFull = record.technologyTermsFull;
		let pointColor: string;
		let pointKey: string;
		if (techFull.length === 0) {
			pointColor = NO_TECH_COLOR;
			pointKey = NO_TECH_KEY;
		} else if (techFull.length === 1) {
			pointKey = techFull[0];
			pointColor = technologyColorByKey.get(techFull[0]) ?? NO_TECH_COLOR;
		} else {
			pointColor = MULTI_TECH_COLOR;
			pointKey = MULTI_TECH_KEY;
		}

		const seenInstitutionIds = new Set<string>();
		for (const rawInstitutionId of institutionIds) {
			const institutionId = rawInstitutionId.trim();
			if (!isValidOpenAlexInstitutionId(institutionId)) continue;
			if (seenInstitutionIds.has(institutionId)) continue;
			seenInstitutionIds.add(institutionId);

			const institution = institutionsById[institutionId];
			if (!institution || !institution.geo) continue;

			const { latitude, longitude } = institution.geo;
			if (typeof latitude !== "number" || typeof longitude !== "number") {
				continue;
			}

			hasMapped = true;
			mappedInstitutionIds.add(institutionId);
			mapPoints.push({
				id: `${record.article.id}-${institutionId}`,
				articleId: record.article.id,
				title: record.article.title,
				institutionName: institution.display_name,
				city: institution.geo?.city ?? null,
				region: institution.geo?.region ?? null,
				country: institution.geo?.country ?? institution.country_code ?? null,
				latitude,
				longitude,
				technologyTerms: record.technologyTermsFull.map(formatTermLabel),
				environmentalTerms: record.environmentalTermsFull.map(formatTermLabel),
				color: pointColor,
			});
		}

		if (hasMapped) {
			articlesWithMappedInstitutions.add(record.article.id);
			technologyCountsByKey.set(
				pointKey,
				(technologyCountsByKey.get(pointKey) ?? 0) + 1,
			);
		}
	}

	const technologyLegend: TechnologyLegendItem[] = [];
	for (const term of availableTechnologyTerms) {
		const count = technologyCountsByKey.get(term) ?? 0;
		if (count === 0) continue;
		technologyLegend.push({
			key: term,
			label: formatTermLabel(term),
			color: technologyColorByKey.get(term) ?? NO_TECH_COLOR,
			count,
		});
	}
	const multiCount = technologyCountsByKey.get(MULTI_TECH_KEY) ?? 0;
	if (multiCount > 0) {
		technologyLegend.push({
			key: MULTI_TECH_KEY,
			label: "Múltiplas tecnologias",
			color: MULTI_TECH_COLOR,
			count: multiCount,
		});
	}
	const noTechCount = technologyCountsByKey.get(NO_TECH_KEY) ?? 0;
	if (noTechCount > 0) {
		technologyLegend.push({
			key: NO_TECH_KEY,
			label: "Sem tecnologia",
			color: NO_TECH_COLOR,
			count: noTechCount,
		});
	}

	const coveredYears = yearlyArticlesTrend.map((item) => item.year);
	const minYear = coveredYears.length > 0 ? Math.min(...coveredYears) : null;
	const maxYear = coveredYears.length > 0 ? Math.max(...coveredYears) : null;

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e8f5ee_0%,_#f5f8f6_42%,_#ffffff_100%)] text-[#0f172a]">
			<main className="mx-auto w-full max-w-[1280px] px-6 py-8 sm:px-10 lg:px-20">
				<section className="rounded-3xl border border-[#dbe6df] bg-white/90 p-6 shadow-[0px_12px_28px_-22px_rgba(15,23,42,0.4)]">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#256f4f]">
						Visão Executiva
					</p>
					<h1 className="mt-2 text-3xl font-black tracking-[-0.9px] text-[#111111] md:text-4xl">
						Contextualização Geral dos Resultados
					</h1>
					<p className="mt-2 max-w-[820px] text-sm leading-6 text-[#4a5568]">
						Esta seção resume os principais resultados do experimento, com foco
						na distribuição espacial dos artigos, evolução temporal das
						publicações e temas mais frequentes.
					</p>
					<div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
						<SummaryCard label="Total de Artigos" value={formatTotal(totalArticles)} />
						<SummaryCard label="Total de Áreas" value={formatTotal(totalAreas)} />
						<SummaryCard
							label="Intervalo Temporal"
							value={
								minYear && maxYear
									? `${minYear} - ${maxYear}`
									: "Não disponível"
							}
						/>
						<SummaryCard
							label="Localizações Mapeadas"
							value={formatTotal(mappedInstitutionIds.size)}
						/>
					</div>
				</section>

				<section className="mt-8">
					<TermsArticlesMapClient
						articlesWithMappedInstitutions={articlesWithMappedInstitutions.size}
						points={mapPoints}
						technologyLegend={technologyLegend}
						totalArticles={totalArticles}
					/>
				</section>

				<section className="mt-8 rounded-3xl border border-[#dbe6df] bg-white p-6">
					<h2 className="text-xl font-black tracking-[-0.5px] text-[#111111]">
						Evolução Temporal das Publicações
					</h2>
					<p className="mt-1 text-sm text-[#64748b]">
						Visão consolidada do comportamento das publicações ao longo dos
						anos.
					</p>
					<div className="mt-4">
						<ArticlesYearLineChart items={yearlyArticlesTrend} />
					</div>
				</section>

				<section className="mt-8 space-y-6">
					<div className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
							Séries temporais por categoria
						</h2>
						<p className="mt-1 text-sm text-[#64748b]">
							Cada linha representa um termo dentro do conjunto completo de
							artigos.
						</p>
					</div>

					<section className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#0f4c81]">
							Termos de tecnologia
						</h3>
						<p className="mt-1 text-sm text-[#64748b]">
							Evolução anual dos termos tecnológicos identificados nos
							artigos.
						</p>
						<div className="mt-4">
							<TermsMultiLineChartClient
								emptyMessage="Não há termos tecnológicos com ano de publicação válido nos artigos."
								key={`technology-${technologyTermsTrend.map((item) => item.key).join("|")}`}
								series={technologyTermsTrend}
								tone="blue"
							/>
						</div>
					</section>

					<section className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
							Termos ambientais
						</h3>
						<p className="mt-1 text-sm text-[#64748b]">
							Evolução anual dos termos ambientais identificados nos artigos.
						</p>
						<div className="mt-4">
							<TermsMultiLineChartClient
								emptyMessage="Não há termos ambientais com ano de publicação válido nos artigos."
								key={`environmental-${environmentalTermsTrend.map((item) => item.key).join("|")}`}
								series={environmentalTermsTrend}
								tone="green"
							/>
						</div>
					</section>
				</section>
			</main>
		</div>
	);
}

function SummaryCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-[#dbe7df] bg-[#f8fafc] px-4 py-3">
			<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#64748b]">
				{label}
			</p>
			<p className="mt-1 text-2xl font-black text-[#0f172a]">{value}</p>
		</div>
	);
}
