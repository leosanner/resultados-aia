import { ArticlesYearLineChart } from "@/components/charts/articles-year-line-chart";
import { TermsBarChart } from "@/components/charts/terms-bar-chart";
import { TermsInstitutionsMapClient } from "@/components/termos/terms-institutions-map-client";
import institutionInformationData from "@/data/instituition_information.json";
import { formatStageTitle, slugToStageKey } from "@/lib/area-utils";
import { ArticleModel } from "@/model/article";
import { EiaModel } from "@/model/eia-stages";
import { filterOcurrencies } from "@/utils/ocurrencies";
import Link from "next/link";
import { notFound } from "next/navigation";
import type {
	AreaLegendItem,
	InstitutionMapPoint,
} from "@/components/termos/terms-institutions-map";

type PageProps = {
	params: Promise<{
		areaSlug: string;
	}>;
};

type BarChartItem = {
	label: string;
	value: number;
};

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
	if (typeof value === "string") {
		return [value];
	}
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

export default async function AreaStatisticsPage({ params }: PageProps) {
	const { areaSlug } = await params;
	const stageKey = slugToStageKey(areaSlug);
	const eiaModel = new EiaModel();
	const articleModel = new ArticleModel();
	const [articlesByStage, summary, articlesExtendedRaw] = await Promise.all([
		eiaModel.getArticlesByStage(),
		eiaModel.getArticlesSummary(),
		articleModel.getArticlesExtended(),
	]);

	if (!(stageKey in summary) || !(stageKey in articlesByStage)) {
		notFound();
	}

	const stageName = formatStageTitle(stageKey);
	const areaArticles = articlesByStage[stageKey] ?? [];
	const summaryByStage = await eiaModel.filterTermsFrequency(areaArticles);
	const technologyTerms = mapTermsToChart(summaryByStage.tec).slice(0, 12);
	const environmentalTerms = mapTermsToChart(summaryByStage.env).slice(0, 12);
	const articlesExtended =
		articlesExtendedRaw as unknown as Record<string, ExtendedArticleRecord>;
	const institutionsById =
		institutionInformationData as Record<string, InstitutionInformationRecord>;

	const areaColor = "#1d4ed8";
	const areaLegend: AreaLegendItem[] = [
		{
			stageKey,
			label: stageName,
			color: areaColor,
			count: areaArticles.length,
		},
	];

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
		}
	>();
	const articlesWithMappedInstitutions = new Set<number>();
	const yearlyCountByPublicationYear = new Map<number, number>();
	type ArticleTermsSummary = {
		technologyTerms: string[];
		environmentalTerms: string[];
	};
	const articleTermsEntries: Array<[number, ArticleTermsSummary]> =
		await Promise.all(
			areaArticles.map(async (article) => {
				const articleFt = await articleModel.getArticleFrequencyTerms(article.id);
				if (!articleFt) {
					return [
						article.id,
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

				return [article.id, { technologyTerms, environmentalTerms }];
			}),
		);
	const articleTermsById = new Map<number, ArticleTermsSummary>(
		articleTermsEntries,
	);

	for (const article of areaArticles) {
		const articleId = article.id;
		const record = articlesExtended[String(articleId)];
		if (!record) continue;

		const publicationYearRaw = record.publication_year;
		const publicationYear =
			typeof publicationYearRaw === "number"
				? publicationYearRaw
				: Number(publicationYearRaw);
		if (
			Number.isInteger(publicationYear) &&
			publicationYear >= 1900 &&
			publicationYear <= 2100
		) {
			yearlyCountByPublicationYear.set(
				publicationYear,
				(yearlyCountByPublicationYear.get(publicationYear) ?? 0) + 1,
			);
		}

		const institutionIds = toStringArray(record["authorships.institutions.id"]);
		let hasInstitutionForCurrentArticle = false;

		for (const rawInstitutionId of institutionIds) {
			const institutionId = rawInstitutionId.trim();
			if (!isValidOpenAlexInstitutionId(institutionId)) continue;

			const institution = institutionsById[institutionId];
			if (!institution || !institution.geo) continue;
			const { latitude, longitude } = institution.geo;
			if (typeof latitude !== "number" || typeof longitude !== "number") continue;

			hasInstitutionForCurrentArticle = true;
			const current = institutionAccumulator.get(institutionId);
			const articleTitle = record.title ?? record.json_title ?? `Artigo ${articleId}`;
			const articleTerms = articleTermsById.get(articleId) ?? {
				technologyTerms: [],
				environmentalTerms: [],
			};

			if (!current) {
				institutionAccumulator.set(institutionId, {
					institution,
					articleIds: new Set([articleId]),
					articleDetails: new Map([
						[
							articleId,
							{
								title: articleTitle,
								stageLabels: [stageName],
								technologyTerms: articleTerms.technologyTerms,
								environmentalTerms: articleTerms.environmentalTerms,
							},
						],
					]),
				});
				continue;
			}

			current.articleIds.add(articleId);
			if (!current.articleDetails.has(articleId)) {
				current.articleDetails.set(articleId, {
					title: articleTitle,
					stageLabels: [stageName],
					technologyTerms: articleTerms.technologyTerms,
					environmentalTerms: articleTerms.environmentalTerms,
				});
			}
		}

		if (hasInstitutionForCurrentArticle) {
			articlesWithMappedInstitutions.add(articleId);
		}
	}

	const yearlyArticlesTrend = Array.from(yearlyCountByPublicationYear.entries())
		.sort((a, b) => a[0] - b[0])
		.map(([year, total]) => ({ year, total }));

	const institutionMapPoints: InstitutionMapPoint[] = Array.from(
		institutionAccumulator.entries(),
	).map(([institutionId, { institution, articleIds, articleDetails }]) => ({
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
		dominantAreaLabel: stageName,
		color: areaColor,
	}));
	institutionMapPoints.sort((a, b) => b.articleCount - a.articleCount);

	return (
		<div className="min-h-screen bg-[#e9f5ee] text-[#0f172a]">
			<main className="mx-auto w-full max-w-[1100px] px-6 py-8 md:px-12">
				<Link
					className="text-xs font-bold uppercase tracking-[1.2px] text-[#94a3b8] hover:text-[#64748b]"
					href="/"
				>
					Voltar para áreas
				</Link>

				<h1 className="mt-4 text-4xl font-black tracking-[-0.9px] text-[#0f172a]">
					Estatísticas de {stageName}
				</h1>
				<p className="mt-2 text-base text-[#64748b]">
					Gráfico de barras com frequência dos termos encontrados na etapa.
				</p>

				<section className="mt-8">
					<TermsInstitutionsMapClient
						areas={areaLegend}
						articlesWithMappedInstitutions={articlesWithMappedInstitutions.size}
						points={institutionMapPoints}
						totalArticles={areaArticles.length}
					/>
				</section>

				<section className="mt-8 rounded-[12px] border border-[#dbeafe] bg-white p-5">
					<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#1d4ed8]">
						Evolução temporal dos artigos
					</h2>
					<p className="mt-1 text-sm text-[#64748b]">
						Publicações por ano para esta área de AIA.
					</p>
					<div className="mt-4">
						<ArticlesYearLineChart items={yearlyArticlesTrend} />
					</div>
				</section>

				<section className="mt-8 space-y-6">
					<article className="rounded-[12px] border border-[#7dd3fc] bg-[#cffafe] p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#0e7490]">
							Termos de tecnologia
						</h2>
						<div className="mt-4">
							<TermsBarChart items={technologyTerms} tone="blue" />
						</div>
					</article>

					<article className="rounded-[12px] border border-[#86efac] bg-[#dcfce7] p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
							Termos ambientais
						</h2>
						<div className="mt-4">
							<TermsBarChart items={environmentalTerms} tone="green" />
						</div>
					</article>
				</section>
			</main>
		</div>
	);
}
