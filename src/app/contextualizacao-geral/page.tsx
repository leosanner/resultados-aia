import { ArticlesYearLineChart } from "@/components/charts/articles-year-line-chart";
import { getToneColorByIndex } from "@/components/charts/chart-palettes";
import { TermsBarChart } from "@/components/charts/terms-bar-chart";
import { TermsInstitutionsMapClient } from "@/components/termos/terms-institutions-map-client";
import institutionInformationData from "@/data/instituition_information.json";
import { formatStageTitle } from "@/lib/area-utils";
import { ArticleModel } from "@/model/article";
import { EiaModel, type StageArticle } from "@/model/eia-stages";
import { filterOcurrencies } from "@/utils/ocurrencies";
import type {
	AreaLegendItem,
	InstitutionMapPoint,
} from "@/components/termos/terms-institutions-map";

type ExtendedArticleRecord = {
	title?: string;
	json_title?: string;
	publication_year?: number | string | null;
	["authorships.institutions.id"]?: string | string[] | null;
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

type BarChartItem = {
	label: string;
	value: number;
};

type AreaNarrativeCard = {
	stageKey: string;
	stageTitle: string;
	totalArticles: number;
	narrative: string;
	yearlyTrend: Array<{ year: number; total: number }>;
	topTechnologyTerms: BarChartItem[];
	topEnvironmentalTerms: BarChartItem[];
};

function formatTotal(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

function formatTermLabel(text: string) {
	return text
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function mapTermsToChart(terms: Record<string, number> | undefined): BarChartItem[] {
	return Object.entries(terms ?? {})
		.map(([label, value]) => ({ label: formatTermLabel(label), value }))
		.sort((a, b) => b.value - a.value)
		.filter((item) => item.value > 0);
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

function summarizeTerms(terms: string[], maxItems: number = 3) {
	if (terms.length <= maxItems) return terms;
	return [...terms.slice(0, maxItems), `+${terms.length - maxItems}`];
}

function buildYearlyTrend(articleIds: Iterable<number>, records: Record<string, ExtendedArticleRecord>) {
	const yearlyCountByPublicationYear = new Map<number, number>();
	for (const articleId of articleIds) {
		const publicationYearRaw = records[String(articleId)]?.publication_year;
		const publicationYear =
			typeof publicationYearRaw === "number"
				? publicationYearRaw
				: Number(publicationYearRaw);

		if (
			!Number.isInteger(publicationYear) ||
			publicationYear < 1900 ||
			publicationYear > 2100
		) {
			continue;
		}

		yearlyCountByPublicationYear.set(
			publicationYear,
			(yearlyCountByPublicationYear.get(publicationYear) ?? 0) + 1,
		);
	}

	return Array.from(yearlyCountByPublicationYear.entries())
		.sort((a, b) => a[0] - b[0])
		.map(([year, total]) => ({ year, total }));
}

function buildNarrative(stageTitle: string, total: number, totalArticles: number, topTec: BarChartItem[], topEnv: BarChartItem[]) {
	const share = totalArticles > 0 ? (total / totalArticles) * 100 : 0;
	const topTecLabel = topTec[0]?.label ?? "sem destaque";
	const topEnvLabel = topEnv[0]?.label ?? "sem destaque";
	return `${stageTitle} concentra ${share.toFixed(1)}% da base (${formatTotal(total)} artigos), com maior presença de ${topTecLabel} e ${topEnvLabel}.`;
}

export default async function ContextualizacaoGeralPage() {
	const eiaModel = new EiaModel();
	const articleModel = new ArticleModel();

	const [articlesByStage, articlesExtendedRaw] = await Promise.all([
		eiaModel.getArticlesByStage(),
		articleModel.getArticlesExtended(),
	]);

	const articlesExtended =
		articlesExtendedRaw as unknown as Record<string, ExtendedArticleRecord>;
	const institutionsById =
		institutionInformationData as Record<string, InstitutionInformationRecord>;

	const sortedStageEntries = Object.entries(articlesByStage).sort(
		(a, b) => b[1].length - a[1].length,
	);
	const totalArticles = sortedStageEntries.reduce(
		(sum, [, articles]) => sum + articles.length,
		0,
	);
	const totalAreas = sortedStageEntries.length;

	const allStageArticles: StageArticle[] = sortedStageEntries.flatMap(
		([, articles]) => articles,
	);
	const allArticleIds = new Set(allStageArticles.map((article) => article.id));

	const stageColorByKey = new Map(
		sortedStageEntries.map(([stageKey], index) => [
			stageKey,
			getToneColorByIndex("blue", index),
		]),
	);
	const areaLegend: AreaLegendItem[] = sortedStageEntries.map(
		([stageKey, articles]) => ({
			stageKey,
			label: formatStageTitle(stageKey),
			color: stageColorByKey.get(stageKey) ?? "#0ea5e9",
			count: articles.length,
		}),
	);

	const articleStagesById = new Map<number, string[]>();
	for (const [stageKey, articles] of sortedStageEntries) {
		for (const article of articles) {
			const current = articleStagesById.get(article.id) ?? [];
			current.push(stageKey);
			articleStagesById.set(article.id, current);
		}
	}

	const institutionAccumulator = new Map<
		string,
		{
			institution: InstitutionInformationRecord;
			articleIds: Set<number>;
			articleDetails: Map<
				number,
				{
					title: string;
					stageLabels: string[];
					technologyTerms: string[];
					environmentalTerms: string[];
				}
			>;
			stageCounts: Map<string, number>;
		}
	>();
	const articlesWithMappedInstitutions = new Set<number>();
	type ArticleTermsSummary = {
		technologyTerms: string[];
		environmentalTerms: string[];
	};
	const articleTermsEntries: Array<[number, ArticleTermsSummary]> =
		await Promise.all(
			Array.from(allArticleIds).map(async (articleId) => {
				const articleFt = await articleModel.getArticleFrequencyTerms(articleId);
				if (!articleFt) {
					return [
						articleId,
						{
							technologyTerms: [] as string[],
							environmentalTerms: [] as string[],
						},
					];
				}

				const technologyTerms = summarizeTerms(
					Object.keys(filterOcurrencies(articleFt.tec)).map(formatTermLabel),
				);
				const environmentalTerms = summarizeTerms(
					Object.keys(filterOcurrencies(articleFt.env)).map(formatTermLabel),
				);

				return [articleId, { technologyTerms, environmentalTerms }];
			}),
		);
	const articleTermsById = new Map<number, ArticleTermsSummary>(
		articleTermsEntries,
	);

	for (const articleId of allArticleIds) {
		const record = articlesExtended[String(articleId)];
		if (!record) continue;

		const institutionIds = toStringArray(record["authorships.institutions.id"]);
		let hasInstitutionForCurrentArticle = false;

		for (const rawInstitutionId of institutionIds) {
			const institutionId = rawInstitutionId.trim();
			if (!isValidOpenAlexInstitutionId(institutionId)) continue;

			const institution = institutionsById[institutionId];
			if (!institution || !institution.geo) continue;
			const { latitude, longitude } = institution.geo;
			if (typeof latitude !== "number" || typeof longitude !== "number") {
				continue;
			}

			hasInstitutionForCurrentArticle = true;
			const current = institutionAccumulator.get(institutionId);
			const articleTitle = record.title ?? record.json_title ?? `Artigo ${articleId}`;
			const stageLabels =
				(articleStagesById.get(articleId) ?? []).map((stageKey) =>
					formatStageTitle(stageKey),
				) ?? [];
			const normalizedStageLabels =
				stageLabels.length > 0 ? stageLabels : ["Área não classificada"];
			const articleTerms = articleTermsById.get(articleId) ?? {
				technologyTerms: [],
				environmentalTerms: [],
			};

			if (!current) {
				const stageCounts = new Map<string, number>();
				for (const stageKey of articleStagesById.get(articleId) ?? []) {
					stageCounts.set(stageKey, (stageCounts.get(stageKey) ?? 0) + 1);
				}

				institutionAccumulator.set(institutionId, {
					institution,
					articleIds: new Set([articleId]),
					articleDetails: new Map([
						[
							articleId,
							{
								title: articleTitle,
								stageLabels: normalizedStageLabels,
								technologyTerms: articleTerms.technologyTerms,
								environmentalTerms: articleTerms.environmentalTerms,
							},
						],
					]),
					stageCounts,
				});
				continue;
			}

			current.articleIds.add(articleId);
			if (!current.articleDetails.has(articleId)) {
				current.articleDetails.set(articleId, {
					title: articleTitle,
					stageLabels: normalizedStageLabels,
					technologyTerms: articleTerms.technologyTerms,
					environmentalTerms: articleTerms.environmentalTerms,
				});
			}
			for (const stageKey of articleStagesById.get(articleId) ?? []) {
				current.stageCounts.set(
					stageKey,
					(current.stageCounts.get(stageKey) ?? 0) + 1,
				);
			}
		}

		if (hasInstitutionForCurrentArticle) {
			articlesWithMappedInstitutions.add(articleId);
		}
	}

	const institutionMapPoints: InstitutionMapPoint[] = Array.from(
		institutionAccumulator.entries(),
	).map(([institutionId, { institution, articleIds, articleDetails, stageCounts }]) => {
		const dominantStageKey = Array.from(stageCounts.entries()).sort(
			(a, b) => b[1] - a[1],
		)[0]?.[0];

		return {
			id: institutionId,
			name: institution.display_name,
			city: institution.geo?.city ?? null,
			region: institution.geo?.region ?? null,
			country: institution.geo?.country ?? institution.country_code ?? null,
			latitude: institution.geo?.latitude ?? 0,
			longitude: institution.geo?.longitude ?? 0,
			articleCount: articleIds.size,
			articles: Array.from(articleDetails.entries())
				.map(([id, detail]) => ({
					id,
					title: detail.title,
					stageLabel: detail.stageLabels.join(" / "),
					technologyTerms: detail.technologyTerms,
					environmentalTerms: detail.environmentalTerms,
				}))
				.slice(0, 6),
			dominantAreaLabel: dominantStageKey
				? formatStageTitle(dominantStageKey)
				: "Área não classificada",
			color: dominantStageKey
				? (stageColorByKey.get(dominantStageKey) ?? "#0ea5e9")
				: "#0ea5e9",
		};
	});
	institutionMapPoints.sort((a, b) => b.articleCount - a.articleCount);

	const overallYearlyTrend = buildYearlyTrend(allArticleIds, articlesExtended);
	const coveredYears = overallYearlyTrend.map((item) => item.year);
	const minYear = coveredYears.length > 0 ? Math.min(...coveredYears) : null;
	const maxYear = coveredYears.length > 0 ? Math.max(...coveredYears) : null;

	const overallTerms = await eiaModel.filterTermsFrequency(allStageArticles);
	const overallTechnologyTerms = mapTermsToChart(overallTerms.tec).slice(0, 10);
	const overallEnvironmentalTerms = mapTermsToChart(overallTerms.env).slice(0, 10);

	const areaNarratives: AreaNarrativeCard[] = await Promise.all(
		sortedStageEntries.map(async ([stageKey, articles]) => {
			const stageTitle = formatStageTitle(stageKey);
			const termsSummary = await eiaModel.filterTermsFrequency(articles);
			const topTechnologyTerms = mapTermsToChart(termsSummary.tec).slice(0, 6);
			const topEnvironmentalTerms = mapTermsToChart(termsSummary.env).slice(0, 6);
			const yearlyTrend = buildYearlyTrend(
				articles.map((article) => article.id),
				articlesExtended,
			);

			return {
				stageKey,
				stageTitle,
				totalArticles: articles.length,
				narrative: buildNarrative(
					stageTitle,
					articles.length,
					totalArticles,
					topTechnologyTerms,
					topEnvironmentalTerms,
				),
				yearlyTrend,
				topTechnologyTerms,
				topEnvironmentalTerms,
			};
		}),
	);

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
						publicações e temas mais frequentes em cada área da AIA.
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
							value={formatTotal(institutionMapPoints.length)}
						/>
					</div>
				</section>

				<section className="mt-8">
					<TermsInstitutionsMapClient
						areas={areaLegend}
						articlesWithMappedInstitutions={articlesWithMappedInstitutions.size}
						points={institutionMapPoints}
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
						<ArticlesYearLineChart items={overallYearlyTrend} />
					</div>
				</section>

				<section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
					<article className="rounded-2xl border border-[#dbe6df] bg-white p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#1d4ed8]">
							Termos Tecnológicos Mais Frequentes
						</h2>
						<div className="mt-4">
							<TermsBarChart items={overallTechnologyTerms} tone="blue" />
						</div>
					</article>
					<article className="rounded-2xl border border-[#dbe6df] bg-white p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#15803d]">
							Termos Ambientais Mais Frequentes
						</h2>
						<div className="mt-4">
							<TermsBarChart items={overallEnvironmentalTerms} tone="green" />
						</div>
					</article>
				</section>

				<section className="mt-8 space-y-6">
					<h2 className="text-2xl font-black tracking-[-0.5px] text-[#111111]">
						Narrativa por Área
					</h2>
					{areaNarratives.map((area) => (
						<article
							className="rounded-2xl border border-[#dbe6df] bg-white p-5 shadow-[0px_8px_20px_-18px_rgba(15,23,42,0.35)]"
							key={area.stageKey}
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<h3 className="text-xl font-black tracking-[-0.4px] text-[#0f172a]">
										{area.stageTitle}
									</h3>
									<p className="mt-1 text-sm text-[#64748b]">{area.narrative}</p>
								</div>
								<span className="rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.6px] text-[#256f4f]">
									{formatTotal(area.totalArticles)} artigos
								</span>
							</div>

							<div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
								<div className="xl:col-span-2">
									<p className="mb-2 text-xs font-bold uppercase tracking-[0.9px] text-[#475569]">
										Evolução temporal da área
									</p>
									<ArticlesYearLineChart items={area.yearlyTrend} />
								</div>
								<div className="space-y-4">
									<div>
										<p className="mb-2 text-xs font-bold uppercase tracking-[0.9px] text-[#1d4ed8]">
											Principais termos de tecnologia
										</p>
										<div className="flex flex-wrap gap-2">
											{area.topTechnologyTerms.map((term) => (
												<span
													className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-2.5 py-1 text-[11px] font-semibold text-[#1e3a8a]"
													key={`${area.stageKey}-tec-${term.label}`}
												>
													{term.label} ({term.value})
												</span>
											))}
										</div>
									</div>
									<div>
										<p className="mb-2 text-xs font-bold uppercase tracking-[0.9px] text-[#15803d]">
											Principais termos ambientais
										</p>
										<div className="flex flex-wrap gap-2">
											{area.topEnvironmentalTerms.map((term) => (
												<span
													className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-semibold text-[#166534]"
													key={`${area.stageKey}-env-${term.label}`}
												>
													{term.label} ({term.value})
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
						</article>
					))}
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
