import institutionInformationData from "@/data/instituition_information.json";
import type {
	AreaLegendItem,
	InstitutionMapPoint,
} from "@/components/termos/terms-institutions-map";
import { getTechArticlesSummary } from "@/lib/tech-summary";
import {
	formatTermLabel,
	type TermsSearchTrendSeries,
} from "@/lib/terms-search";
import { ArticleModel, type TecTerm } from "@/model/article";

export type TechStats = {
	totalArticles: number;
	articlesWithMappedInstitutions: number;
	institutionMapPoints: InstitutionMapPoint[];
	areaLegend: AreaLegendItem[];
	technologyTermsTrend: TermsSearchTrendSeries[];
	environmentalTermsTrend: TermsSearchTrendSeries[];
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

type ExtendedArticleRecord = {
	title?: string;
	json_title?: string;
	publication_year?: number | string | null;
	["authorships.institutions.id"]?: string | string[] | null;
};

const TOP_SERIES_LIMIT = 15;
export const TECH_STATS_COLOR = "#1F6F8B";

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

function summarizeTerms(terms: string[], maxItems = 3) {
	if (terms.length <= maxItems) return terms;
	return [...terms.slice(0, maxItems), `+${terms.length - maxItems}`];
}

function getValidPublicationYear(
	value: number | string | null | undefined,
): number | null {
	const year = typeof value === "number" ? value : Number(value);
	if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
	return year;
}

export async function getTechStats(tecTerm: TecTerm): Promise<TechStats | null> {
	const articleModel = new ArticleModel();
	const [summary, articlesExtendedRaw] = await Promise.all([
		getTechArticlesSummary(),
		articleModel.getArticlesExtended(),
	]);

	const articleIds = summary[tecTerm] ?? [];
	if (articleIds.length === 0) return null;

	const articlesExtended = articlesExtendedRaw as unknown as Record<
		string,
		ExtendedArticleRecord
	>;
	const institutionsById = institutionInformationData as Record<
		string,
		InstitutionInformationRecord
	>;

	const resolvedTermsByArticle = new Map<
		number,
		{ technology: string[]; environmental: string[] }
	>();
	await Promise.all(
		articleIds.map(async (articleId) => {
			const resolved = await articleModel.getResolvedArticleTerms(articleId);
			resolvedTermsByArticle.set(articleId, {
				technology: [...resolved.technology],
				environmental: [...resolved.environmental],
			});
		}),
	);

	const yearsSet = new Set<number>();
	const techFreq = new Map<string, number>();
	const envFreq = new Map<string, number>();
	const yearlyTechCounts = new Map<string, Map<number, number>>();
	const yearlyEnvCounts = new Map<string, Map<number, number>>();

	const institutionAccumulator = new Map<
		string,
		{
			institution: InstitutionInformationRecord;
			articleIds: Set<number>;
			articleDetails: Map<
				number,
				{
					title: string;
					technologyTerms: string[];
					environmentalTerms: string[];
				}
			>;
		}
	>();
	const mappedArticleIds = new Set<number>();

	for (const articleId of articleIds) {
		const record = articlesExtended[String(articleId)];
		if (!record) continue;

		const terms = resolvedTermsByArticle.get(articleId) ?? {
			technology: [],
			environmental: [],
		};
		const publicationYear = getValidPublicationYear(record.publication_year);

		if (publicationYear !== null) {
			yearsSet.add(publicationYear);

			for (const term of terms.technology) {
				techFreq.set(term, (techFreq.get(term) ?? 0) + 1);
				const byYear =
					yearlyTechCounts.get(term) ?? new Map<number, number>();
				byYear.set(publicationYear, (byYear.get(publicationYear) ?? 0) + 1);
				yearlyTechCounts.set(term, byYear);
			}

			for (const term of terms.environmental) {
				envFreq.set(term, (envFreq.get(term) ?? 0) + 1);
				const byYear =
					yearlyEnvCounts.get(term) ?? new Map<number, number>();
				byYear.set(publicationYear, (byYear.get(publicationYear) ?? 0) + 1);
				yearlyEnvCounts.set(term, byYear);
			}
		}

		const institutionIds = toStringArray(record["authorships.institutions.id"]);
		let hasInstitutionForArticle = false;

		for (const rawInstitutionId of institutionIds) {
			const institutionId = rawInstitutionId.trim();
			if (!isValidOpenAlexInstitutionId(institutionId)) continue;

			const institution = institutionsById[institutionId];
			if (!institution || !institution.geo) continue;
			const { latitude, longitude } = institution.geo;
			if (typeof latitude !== "number" || typeof longitude !== "number") continue;

			hasInstitutionForArticle = true;
			const articleTitle =
				record.title ?? record.json_title ?? `Artigo ${articleId}`;
			const techTermsSummary = summarizeTerms(
				terms.technology.map(formatTermLabel),
			);
			const envTermsSummary = summarizeTerms(
				terms.environmental.map(formatTermLabel),
			);

			const current = institutionAccumulator.get(institutionId);
			if (!current) {
				institutionAccumulator.set(institutionId, {
					institution,
					articleIds: new Set([articleId]),
					articleDetails: new Map([
						[
							articleId,
							{
								title: articleTitle,
								technologyTerms: techTermsSummary,
								environmentalTerms: envTermsSummary,
							},
						],
					]),
				});
			} else {
				current.articleIds.add(articleId);
				if (!current.articleDetails.has(articleId)) {
					current.articleDetails.set(articleId, {
						title: articleTitle,
						technologyTerms: techTermsSummary,
						environmentalTerms: envTermsSummary,
					});
				}
			}
		}

		if (hasInstitutionForArticle) mappedArticleIds.add(articleId);
	}

	const years = Array.from(yearsSet).sort((a, b) => a - b);

	const buildSeries = (
		freqMap: Map<string, number>,
		yearlyCounts: Map<string, Map<number, number>>,
	): TermsSearchTrendSeries[] => {
		const topKeys = Array.from(freqMap.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, TOP_SERIES_LIMIT)
			.map(([key]) => key);
		return topKeys.map((key) => {
			const byYear = yearlyCounts.get(key) ?? new Map<number, number>();
			return {
				key,
				label: formatTermLabel(key),
				items: years.map((year) => ({
					year,
					total: byYear.get(year) ?? 0,
				})),
			};
		});
	};

	const technologyTermsTrend = buildSeries(techFreq, yearlyTechCounts);
	const environmentalTermsTrend = buildSeries(envFreq, yearlyEnvCounts);

	const institutionMapPoints: InstitutionMapPoint[] = Array.from(
		institutionAccumulator.entries(),
	)
		.map(([institutionId, { institution, articleIds: ids, articleDetails }]) => ({
			id: institutionId,
			name: institution.display_name,
			city: institution.geo?.city ?? null,
			region: institution.geo?.region ?? null,
			country: institution.geo?.country ?? institution.country_code ?? null,
			latitude: institution.geo?.latitude ?? 0,
			longitude: institution.geo?.longitude ?? 0,
			articleCount: ids.size,
			articles: Array.from(articleDetails.entries())
				.map(([detailArticleId, detail]) => ({
					id: detailArticleId,
					title: detail.title,
					stageLabel: tecTerm,
					technologyTerms: detail.technologyTerms,
					environmentalTerms: detail.environmentalTerms,
				}))
				.slice(0, 6),
			dominantAreaLabel: tecTerm,
			color: TECH_STATS_COLOR,
		}))
		.sort((a, b) => b.articleCount - a.articleCount);

	const areaLegend: AreaLegendItem[] = [
		{
			stageKey: tecTerm,
			label: tecTerm,
			color: TECH_STATS_COLOR,
			count: articleIds.length,
		},
	];

	return {
		totalArticles: articleIds.length,
		articlesWithMappedInstitutions: mappedArticleIds.size,
		institutionMapPoints,
		areaLegend,
		technologyTermsTrend,
		environmentalTermsTrend,
	};
}
