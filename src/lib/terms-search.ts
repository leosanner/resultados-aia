import { formatStageTitle, stageKeyToSlug } from "@/lib/area-utils";
import {
	ArticleModel,
	type Article,
	type ArticleExtend,
	type EnvTerm,
	type TecTerm,
} from "@/model/article";
import { EiaModel, type StageArticle } from "@/model/eia-stages";
import { filterOcurrencies } from "@/utils/ocurrencies";

export type TermsSearchParams = {
	tec?: string | string[];
	env?: string | string[];
	term?: string | string[];
	type?: string | string[];
};

export type TermsSearchExportRow = {
	area_aia_relacionada: string;
	termos_busca_tecnologia: string;
	termos_busca_ambientais: string;
	data: string;
	autores: string;
	titulo: string;
	link: string;
	fwci: string;
};

export type TermsSearchArticleRecord = {
	stageKey: string;
	areaSlug: string;
	stageTitle: string;
	article: StageArticle;
	articleUrl: string;
	preferredLink: string;
	publicationDate: string;
	authorsLabel: string;
	technologyTerms: string[];
	environmentalTerms: string[];
	fwci: string;
};

export type TermsSearchGroup = {
	stageKey: string;
	stageTitle: string;
	areaSlug: string;
	articles: TermsSearchArticleRecord[];
};

export type TermsSearchResults = {
	selectedTecTerms: string[];
	selectedEnvTerms: string[];
	hasSelectedTerms: boolean;
	isShowingAllResults: boolean;
	totalResults: number;
	matchingArticleIds: Set<number>;
	groups: TermsSearchGroup[];
	exportRows: TermsSearchExportRow[];
	yearlyArticlesTrend: Array<{ year: number; total: number }>;
	articlesExtended: Record<string, TermsExtendedArticleRecord>;
};

type TermsExtendedArticleRecord = ArticleExtend & {
	fwci?: number | string | null;
	publication_year?: number | string | null;
};

function toArray(value: string | string[] | undefined) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}

export function normalizeTerms(values: string[]) {
	return Array.from(
		new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)),
	);
}

export function formatTermLabel(text: string) {
	return text
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function capitalizeFirstLetter(text: string) {
	const trimmedStart = text.trimStart();
	if (!trimmedStart) return text;
	return `${trimmedStart.charAt(0).toUpperCase()}${trimmedStart.slice(1)}`;
}

function buildArticleFingerprint(article: Article) {
	return JSON.stringify({
		title: article.title,
		abstract: article.abstract,
		keywords: article.keywords,
	});
}

export function summarizeTerms(terms: string[], maxItems: number = 3) {
	if (terms.length <= maxItems) return terms;
	return [...terms.slice(0, maxItems), `+${terms.length - maxItems}`];
}

export function buildAuthorsLabel(
	authors: Array<{ name?: string | null }> | undefined,
) {
	const authorNames = Array.isArray(authors)
		? authors
				.map((author) => author?.name?.trim())
				.filter((name): name is string => Boolean(name))
		: [];

	if (authorNames.length === 0) return "";
	if (authorNames.length <= 3) return authorNames.join(", ");
	return `${authorNames.slice(0, 3).join(", ")} et al.`;
}

export function buildPreferredArticleHref(
	record: Partial<Pick<ArticleExtend, "doi_x" | "doi_y" | "id">> | undefined,
	internalHref: string,
) {
	const doiY = typeof record?.doi_y === "string" ? record.doi_y.trim() : "";
	if (doiY) return doiY;

	const doiX = typeof record?.doi_x === "string" ? record.doi_x.trim() : "";
	if (doiX) return `https://doi.org/${doiX}`;

	const openAlexId = typeof record?.id === "string" ? record.id.trim() : "";
	if (openAlexId) {
		return /^https?:\/\//i.test(openAlexId)
			? openAlexId
			: `https://openalex.org/${openAlexId}`;
	}

	return internalHref;
}

export function formatFwci(value: number | string | null | undefined) {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value.toFixed(2);
	}

	if (typeof value === "string") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed.toFixed(2);
		}
	}

	return "";
}

function formatFwciForExport(value: string) {
	return value.replace(".", ",");
}

export function buildTermsDownloadQuery({
	tec,
	env,
}: {
	tec: string[];
	env: string[];
}) {
	const query = new URLSearchParams();
	for (const term of tec) query.append("tec", term);
	for (const term of env) query.append("env", term);
	return query.toString();
}

function escapeCsvCell(value: string) {
	const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	return `"${normalized.replace(/"/g, '""')}"`;
}

export function serializeTermsSearchRowsToCsv(rows: TermsSearchExportRow[]) {
	const header: Array<{
		key: keyof TermsSearchExportRow;
		label: string;
	}> = [
		{ key: "area_aia_relacionada", label: "Área de AIA relacionada" },
		{ key: "termos_busca_tecnologia", label: "termos_busca_tecnologia" },
		{ key: "termos_busca_ambientais", label: "termos_busca_ambientais" },
		{ key: "data", label: "data" },
		{ key: "autores", label: "autores" },
		{ key: "titulo", label: "titulo" },
		{ key: "link", label: "link" },
		{ key: "fwci", label: "fwci" },
	];
	const lines = [
		header.map((item) => item.label).join(","),
		...rows.map((row) =>
			header.map((item) => escapeCsvCell(row[item.key] ?? "")).join(","),
		),
	];

	return `\uFEFF${lines.join("\n")}`;
}

function buildUniqueExportRows(
	groups: TermsSearchGroup[],
	selectedTecTerms: string[],
	selectedEnvTerms: string[],
) {
	const exportMap = new Map<
		number,
		{
			record: TermsSearchArticleRecord;
			stageTitles: string[];
		}
	>();

	for (const group of groups) {
		for (const articleRecord of group.articles) {
			const current = exportMap.get(articleRecord.article.id);

			if (!current) {
				exportMap.set(articleRecord.article.id, {
					record: articleRecord,
					stageTitles: [group.stageTitle],
				});
				continue;
			}

			if (!current.stageTitles.includes(group.stageTitle)) {
				current.stageTitles.push(group.stageTitle);
			}
		}
	}

	return Array.from(exportMap.values()).map(
		({ record, stageTitles }): TermsSearchExportRow => ({
			area_aia_relacionada: stageTitles.join("\n"),
			termos_busca_tecnologia: selectedTecTerms
				.map(formatTermLabel)
				.join("; "),
			termos_busca_ambientais: selectedEnvTerms
				.map(formatTermLabel)
				.join("; "),
			data: record.publicationDate,
			autores: record.authorsLabel,
			titulo: capitalizeFirstLetter(record.article.title),
			link: record.preferredLink,
			fwci: formatFwciForExport(record.fwci),
		}),
	);
}

export async function getTermsSearchResults(
	searchParams: TermsSearchParams,
): Promise<TermsSearchResults> {
	const selectedTecTerms = normalizeTerms(toArray(searchParams.tec));
	const selectedEnvTerms = normalizeTerms(toArray(searchParams.env));

	if (selectedTecTerms.length === 0 && selectedEnvTerms.length === 0) {
		const legacyTerm = toArray(searchParams.term)[0]?.trim().toLowerCase();
		const legacyType = toArray(searchParams.type)[0];
		if (legacyTerm) {
			if (legacyType === "env") {
				selectedEnvTerms.push(legacyTerm);
			} else {
				selectedTecTerms.push(legacyTerm);
			}
		}
	}

	const hasSelectedTerms =
		selectedTecTerms.length > 0 || selectedEnvTerms.length > 0;
	const isShowingAllResults = !hasSelectedTerms;
	const eiaModel = new EiaModel();
	const articleModel = new ArticleModel();
	const articlesByStage = await eiaModel.getArticlesByStage();
	const allArticles = await articleModel.getArticles();
	const articlesExtended =
		(await articleModel.getArticlesExtended()) as Record<
			string,
			TermsExtendedArticleRecord
		>;
	const matchingArticleIds = new Set<number>();
	let totalResults = 0;

	if (hasSelectedTerms) {
		const filteredArticles = await articleModel.filterArticlesByTerms({
			env: selectedEnvTerms as EnvTerm[],
			tec: selectedTecTerms as TecTerm[],
		});
		totalResults = filteredArticles.length;
		const filteredByFingerprint = filteredArticles.reduce<
			Record<string, number>
		>((current, article) => {
			const fingerprint = buildArticleFingerprint(article);
			current[fingerprint] = (current[fingerprint] ?? 0) + 1;
			return current;
		}, {});
		for (const [articleId, article] of Object.entries(allArticles)) {
			const fingerprint = buildArticleFingerprint(article);
			if ((filteredByFingerprint[fingerprint] ?? 0) > 0) {
				matchingArticleIds.add(Number(articleId));
				filteredByFingerprint[fingerprint] -= 1;
			}
		}
	} else {
		for (const articleId of Object.keys(allArticles)) {
			matchingArticleIds.add(Number(articleId));
		}
		totalResults = matchingArticleIds.size;
	}

	const articleTermsEntries: Array<
		[number, { technologyTerms: string[]; environmentalTerms: string[] }]
	> = await Promise.all(
		Array.from(matchingArticleIds).map(async (articleId) => {
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
	const articleTermsById = new Map(articleTermsEntries);

	const groups = Object.entries(articlesByStage)
		.map(([stageKey, articles]) => {
			const stageArticles = articles.filter((article) =>
				matchingArticleIds.has(article.id),
			);

			const areaSlug = stageKeyToSlug(stageKey);
			const stageTitle = formatStageTitle(stageKey);
			const records = stageArticles.map((article) => {
				const articleUrl = `/areas/${areaSlug}/artigos/${article.id}`;
				const extended = articlesExtended[String(article.id)];
				const terms = articleTermsById.get(article.id) ?? {
					technologyTerms: [],
					environmentalTerms: [],
				};

				return {
					stageKey,
					areaSlug,
					stageTitle,
					article,
					articleUrl,
					preferredLink: buildPreferredArticleHref(extended, articleUrl),
					publicationDate: extended?.publish_date?.trim?.() ?? "",
					authorsLabel: buildAuthorsLabel(extended?.authors),
					technologyTerms: terms.technologyTerms,
					environmentalTerms: terms.environmentalTerms,
					fwci: formatFwci(extended?.fwci),
				} satisfies TermsSearchArticleRecord;
			});

			return {
				stageKey,
				stageTitle,
				areaSlug,
				articles: records,
			} satisfies TermsSearchGroup;
		})
		.filter((group) => group.articles.length > 0)
		.sort((a, b) => b.articles.length - a.articles.length);

	const exportRows = buildUniqueExportRows(
		groups,
		selectedTecTerms,
		selectedEnvTerms,
	);

	const yearlyCountByPublicationYear = new Map<number, number>();
	for (const articleId of matchingArticleIds) {
		const publicationYearRaw = articlesExtended[String(articleId)]?.publication_year;
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

	const yearlyArticlesTrend = Array.from(yearlyCountByPublicationYear.entries())
		.sort((a, b) => a[0] - b[0])
		.map(([year, total]) => ({ year, total }));

	return {
		selectedTecTerms,
		selectedEnvTerms,
		hasSelectedTerms,
		isShowingAllResults,
		totalResults,
		matchingArticleIds,
		groups,
		exportRows,
		yearlyArticlesTrend,
		articlesExtended,
	};
}
