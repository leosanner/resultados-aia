import {
	ArticleCard,
	type ArticleMetadata,
} from "@/components/articles/article-card";
import { getToneColorByIndex } from "@/components/charts/chart-palettes";
import { TermsMultiLineChartClient } from "@/components/charts/terms-multi-line-chart-client";
import { TermsArticlesMapClient } from "@/components/termos/terms-articles-map-client";
import { TermsPageSizeSelect } from "@/components/termos/terms-page-size-select";
import {
	TermsSortSelect,
	type TermsSortBy,
	type TermsSortOrder,
} from "@/components/termos/terms-sort-select";
import institutionInformationData from "@/data/instituition_information.json";
import {
	buildTermsDownloadQuery,
	formatTermLabel,
	getTermsSearchResults,
	type TermsSearchArticleRecord,
} from "@/lib/terms-search";
import type {
	ArticleMapPoint,
	TechnologyLegendItem,
} from "@/components/termos/terms-articles-map";
import Link from "next/link";

type PageProps = {
	searchParams: Promise<{
		term?: string | string[];
		type?: string | string[];
		tec?: string | string[];
		env?: string | string[];
		page?: string | string[];
		pageSize?: string | string[];
		sortBy?: string | string[];
		sortOrder?: string | string[];
	}>;
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50] as const;
type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];
const DEFAULT_SORT_BY: TermsSortBy = "publicationDate";
const DEFAULT_SORT_ORDER: TermsSortOrder = "desc";

type ExtendedArticleRecord = {
	authors?: { name?: string | null }[];
	["authorships.institutions.id"]?: string | string[] | null;
	corresponding_institution_ids?: string | string[] | null;
	publish_date?: string | null;
	publication_year?: number | string | null;
	fwci?: number | string | null;
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

const MULTI_TECH_COLOR = "#ec4899";
const NO_TECH_COLOR = "#94a3b8";
const MULTI_TECH_KEY = "__multi__";
const NO_TECH_KEY = "__none__";

function buildDownloadHref(format: "csv" | "docx", query: string) {
	return query ? `/termos/download?${query}&format=${format}` : `/termos/download?format=${format}`;
}

function buildPaginationHref(
	selectedTecTerms: string[],
	selectedEnvTerms: string[],
	page: number,
	pageSize: number,
	sortBy: TermsSortBy,
	sortOrder: TermsSortOrder,
) {
	const query: Record<string, string | string[]> = {
		page: String(page),
		pageSize: String(pageSize),
		sortBy,
		sortOrder,
	};
	if (selectedTecTerms.length > 0) query.tec = selectedTecTerms;
	if (selectedEnvTerms.length > 0) query.env = selectedEnvTerms;
	return { pathname: "/termos", query };
}

function buildFiltersHref(
	selectedTecTerms: string[],
	selectedEnvTerms: string[],
	pageSize: number,
	sortBy: TermsSortBy,
	sortOrder: TermsSortOrder,
) {
	const query: Record<string, string | string[]> = {
		pageSize: String(pageSize),
		sortBy,
		sortOrder,
	};
	if (selectedTecTerms.length > 0) query.tec = selectedTecTerms;
	if (selectedEnvTerms.length > 0) query.env = selectedEnvTerms;
	return { pathname: "/termos", query };
}

function getSearchParamValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

function parseSortBy(value: string | string[] | undefined): TermsSortBy {
	const sortBy = getSearchParamValue(value);
	return sortBy === "fwci" || sortBy === "publicationDate"
		? sortBy
		: DEFAULT_SORT_BY;
}

function parseSortOrder(value: string | string[] | undefined): TermsSortOrder {
	const sortOrder = getSearchParamValue(value);
	return sortOrder === "asc" || sortOrder === "desc"
		? sortOrder
		: DEFAULT_SORT_ORDER;
}

function getArticleSortValue(
	record: TermsSearchArticleRecord,
	sortBy: TermsSortBy,
) {
	if (sortBy === "fwci") {
		const fwci = Number(record.fwci);
		return Number.isFinite(fwci) ? fwci : null;
	}

	const publicationTime = Date.parse(record.publicationDate);
	return Number.isFinite(publicationTime) ? publicationTime : null;
}

function sortArticles(
	articles: TermsSearchArticleRecord[],
	sortBy: TermsSortBy,
	sortOrder: TermsSortOrder,
) {
	const direction = sortOrder === "asc" ? 1 : -1;

	return [...articles].sort((a, b) => {
		const valueA = getArticleSortValue(a, sortBy);
		const valueB = getArticleSortValue(b, sortBy);

		if (valueA !== null && valueB !== null && valueA !== valueB) {
			return (valueA - valueB) * direction;
		}
		if (valueA !== null && valueB === null) return -1;
		if (valueA === null && valueB !== null) return 1;

		return a.article.title.localeCompare(b.article.title, "pt-BR");
	});
}

function buildArticleMetadata(record: TermsSearchArticleRecord): ArticleMetadata[] {
	return [
		record.publicationDate ? { label: "Data", value: record.publicationDate } : null,
		record.authorsLabel ? { label: "Autores", value: record.authorsLabel } : null,
		record.technologyTerms.length > 0
			? { label: "Tecnologia", value: record.technologyTerms.join(", ") }
			: null,
		record.environmentalTerms.length > 0
			? { label: "Ambientais", value: record.environmentalTerms.join(", ") }
			: null,
		record.fwci ? { label: "FWCI", value: record.fwci } : null,
	].filter((item): item is ArticleMetadata => Boolean(item));
}

export default async function TermArticlesPage({ searchParams }: PageProps) {
	const currentSearchParams = await searchParams;
	const {
		selectedTecTerms,
		selectedEnvTerms,
		hasSelectedTerms,
		isShowingAllResults,
		totalResults,
		flatArticles,
		technologyTermsTrend,
		environmentalTermsTrend,
		articlesExtended,
	} = await getTermsSearchResults(currentSearchParams);

	const pageSizeRaw = Array.isArray(currentSearchParams.pageSize)
		? currentSearchParams.pageSize[0]
		: currentSearchParams.pageSize;
	const requestedPageSize = Number(pageSizeRaw);
	const selectedPageSize: PageSizeOption = PAGE_SIZE_OPTIONS.includes(
		requestedPageSize as PageSizeOption,
	)
		? (requestedPageSize as PageSizeOption)
		: 10;
	const pageRaw = Array.isArray(currentSearchParams.page)
		? currentSearchParams.page[0]
		: currentSearchParams.page;
	const requestedPage = Number(pageRaw);
	const selectedSortBy = parseSortBy(currentSearchParams.sortBy);
	const selectedSortOrder = parseSortOrder(currentSearchParams.sortOrder);
	const sortedArticles = sortArticles(
		flatArticles,
		selectedSortBy,
		selectedSortOrder,
	);
	const totalPages = Math.max(1, Math.ceil(totalResults / selectedPageSize));
	const currentPage =
		Number.isInteger(requestedPage) && requestedPage > 0
			? Math.min(requestedPage, totalPages)
			: 1;
	const pageStart = (currentPage - 1) * selectedPageSize;
	const paginatedArticles = sortedArticles.slice(
		pageStart,
		pageStart + selectedPageSize,
	);
	const currentStartArticle = totalResults === 0 ? 0 : pageStart + 1;
	const currentEndArticle = Math.min(pageStart + selectedPageSize, totalResults);

	const availableTechnologyTerms = Array.from(
		new Set(flatArticles.flatMap((record) => record.technologyTermsFull)),
	).sort((a, b) => a.localeCompare(b, "pt-BR"));
	const technologyColorByKey = new Map<string, string>();
	availableTechnologyTerms.forEach((term, index) => {
		technologyColorByKey.set(term, getToneColorByIndex("blue", index));
	});

	const tecChipColorByTerm = new Map<string, string>();
	technologyTermsTrend.forEach((item, index) => {
		tecChipColorByTerm.set(item.key, getToneColorByIndex("blue", index));
	});
	const envChipColorByTerm = new Map<string, string>();
	environmentalTermsTrend.forEach((item, index) => {
		envChipColorByTerm.set(item.key, getToneColorByIndex("green", index));
	});

	const downloadQuery = buildTermsDownloadQuery({
		tec: selectedTecTerms,
		env: selectedEnvTerms,
	});

	const institutionsById =
		institutionInformationData as Record<string, InstitutionInformationRecord>;
	const mapPoints: ArticleMapPoint[] = [];
	const articlesWithMappedInstitutions = new Set<number>();
	const technologyCountsByKey = new Map<string, number>();

	for (const record of flatArticles) {
		const extended = articlesExtended[String(record.article.id)] as
			| ExtendedArticleRecord
			| undefined;
		if (!extended) continue;

		const institutionIds = toStringArray(
			extended.corresponding_institution_ids,
		);
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

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e8f5ee_0%,_#f5f8f6_42%,_#ffffff_100%)] text-[#0f172a]">
			<main className="mx-auto w-full max-w-[992px] px-6 py-10 md:px-12">

				<section className="mt-4">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#7a8a9d]">
						Filtro por termos
					</p>
					<h1 className="mt-2 text-3xl font-black tracking-[-0.8px] text-[#0f172a] md:text-4xl">
						{isShowingAllResults
							? "Todos os resultados do grafo"
							: hasSelectedTerms
							? "Resultados por termos selecionados"
							: "Resultados por termos"}
					</h1>
					<p className="mt-2 text-base text-[#64748b]">
						{isShowingAllResults
							? `${totalResults} artigos encontrados sem filtros aplicados.`
							: hasSelectedTerms
							? `${totalResults} artigos encontrados.`
							: "Resultados carregados."}
					</p>

					{totalResults > 0 ? (
						<dl className="mt-8 grid grid-cols-3 gap-4 md:gap-10">
							<div className="border-l-[3px] border-[#0f172a] pl-4">
								<dt className="text-[11px] font-bold uppercase tracking-[1px] text-[#7a8a9d]">
									Total
								</dt>
								<dd className="mt-1 font-black tabular-nums tracking-[-1px] text-[#0f172a] text-4xl md:text-5xl">
									{totalResults}
								</dd>
							</div>
							<div className="border-l-[3px] border-[#1d4ed8] pl-4">
								<dt className="text-[11px] font-bold uppercase tracking-[1px] text-[#1d4ed8]">
									Termos Tec
								</dt>
								<dd className="mt-1 font-black tabular-nums tracking-[-1px] text-[#1e3a8a] text-4xl md:text-5xl">
									{selectedTecTerms.length}
								</dd>
							</div>
							<div className="border-l-[3px] border-[#15803d] pl-4">
								<dt className="text-[11px] font-bold uppercase tracking-[1px] text-[#15803d]">
									Termos Env
								</dt>
								<dd className="mt-1 font-black tabular-nums tracking-[-1px] text-[#14532d] text-4xl md:text-5xl">
									{selectedEnvTerms.length}
								</dd>
							</div>
						</dl>
					) : null}

					{selectedTecTerms.length > 0 || selectedEnvTerms.length > 0 ? (
						<div className="mt-8 rounded-[14px] border border-[#e2e8f0] bg-white/70 px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.03)] backdrop-blur-sm">
							<div className="flex items-center justify-between gap-3">
								<p className="flex items-baseline gap-2 text-[11px] font-bold uppercase tracking-[1.4px] text-[#334155]">
									Termos selecionados
									<span className="tabular-nums text-[#94a3b8]">
										{selectedTecTerms.length + selectedEnvTerms.length}
									</span>
								</p>
								<Link
									scroll={false}
									href={buildFiltersHref(
										[],
										[],
										selectedPageSize,
										selectedSortBy,
										selectedSortOrder,
									)}
									className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-[#64748b] transition-colors hover:text-[#0f172a]"
								>
									<svg
										aria-hidden="true"
										className="h-3 w-3 transition-transform group-hover:rotate-90"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeWidth="2.5"
										viewBox="0 0 24 24"
									>
										<path d="M6 6l12 12M18 6L6 18" />
									</svg>
									Limpar tudo
								</Link>
							</div>

							{selectedTecTerms.length > 0 ? (
								<div className="mt-4">
									<p className="text-[10px] font-bold uppercase tracking-[1.3px] text-[#1d4ed8]">
										Tecnologia
									</p>
									<ul className="mt-2 flex flex-wrap gap-2">
										{selectedTecTerms.map((term) => {
											const color = tecChipColorByTerm.get(term) ?? "#1d4ed8";
											return (
												<li key={`tec-${term}`}>
													<span
														className="inline-flex items-stretch overflow-hidden rounded-[10px] border shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-shadow hover:shadow-[0_2px_6px_rgba(15,23,42,0.08)]"
														style={{
															borderColor: `${color}55`,
															backgroundColor: `${color}10`,
														}}
													>
														<span
															aria-hidden="true"
															className="w-[4px] shrink-0"
															style={{ backgroundColor: color }}
														/>
														<span
															className="flex items-center px-3 py-1.5 text-[13px] font-semibold tracking-[-0.1px] text-[#0f172a]"
														>
															{formatTermLabel(term)}
														</span>
														<Link
															scroll={false}
															aria-label={`Remover filtro ${formatTermLabel(term)}`}
															href={buildFiltersHref(
																selectedTecTerms.filter((t) => t !== term),
																selectedEnvTerms,
																selectedPageSize,
																selectedSortBy,
																selectedSortOrder,
															)}
															className="flex items-center justify-center border-l border-[#0f172a]/5 px-2.5 text-[#94a3b8] transition-colors hover:bg-[rgba(15,23,42,0.05)] hover:text-[#0f172a]"
														>
															<svg
																aria-hidden="true"
																className="h-3 w-3"
																fill="none"
																stroke="currentColor"
																strokeLinecap="round"
																strokeWidth="2.5"
																viewBox="0 0 24 24"
															>
																<path d="M6 6l12 12M18 6L6 18" />
															</svg>
														</Link>
													</span>
												</li>
											);
										})}
									</ul>
								</div>
							) : null}

							{selectedEnvTerms.length > 0 ? (
								<div className="mt-4">
									<p className="text-[10px] font-bold uppercase tracking-[1.3px] text-[#15803d]">
										Ambiental
									</p>
									<ul className="mt-2 flex flex-wrap gap-2">
										{selectedEnvTerms.map((term) => {
											const color = envChipColorByTerm.get(term) ?? "#15803d";
											return (
												<li key={`env-${term}`}>
													<span
														className="inline-flex items-stretch overflow-hidden rounded-[10px] border shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-shadow hover:shadow-[0_2px_6px_rgba(15,23,42,0.08)]"
														style={{
															borderColor: `${color}55`,
															backgroundColor: `${color}10`,
														}}
													>
														<span
															aria-hidden="true"
															className="w-[4px] shrink-0"
															style={{ backgroundColor: color }}
														/>
														<span
															className="flex items-center px-3 py-1.5 text-[13px] font-semibold tracking-[-0.1px] text-[#0f172a]"
														>
															{formatTermLabel(term)}
														</span>
														<Link
															scroll={false}
															aria-label={`Remover filtro ${formatTermLabel(term)}`}
															href={buildFiltersHref(
																selectedTecTerms,
																selectedEnvTerms.filter((t) => t !== term),
																selectedPageSize,
																selectedSortBy,
																selectedSortOrder,
															)}
															className="flex items-center justify-center border-l border-[#0f172a]/5 px-2.5 text-[#94a3b8] transition-colors hover:bg-[rgba(15,23,42,0.05)] hover:text-[#0f172a]"
														>
															<svg
																aria-hidden="true"
																className="h-3 w-3"
																fill="none"
																stroke="currentColor"
																strokeLinecap="round"
																strokeWidth="2.5"
																viewBox="0 0 24 24"
															>
																<path d="M6 6l12 12M18 6L6 18" />
															</svg>
														</Link>
													</span>
												</li>
											);
										})}
									</ul>
								</div>
							) : null}
						</div>
					) : null}

					{totalResults > 0 ? (
						<div className="mt-8 flex flex-wrap items-center gap-3">
							<span className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#064722]">
								Exportar
							</span>
							<Link
								className="group inline-flex items-center gap-2 rounded-[4px] border border-[#0C7C3C] bg-white px-4 py-2 text-sm font-bold tracking-[0.2px] text-[#064722] transition-colors hover:bg-[#0C7C3C] hover:text-white"
								href={buildDownloadHref("csv", downloadQuery)}
							>
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.25"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
									/>
								</svg>
								CSV
							</Link>
							<Link
								className="group inline-flex items-center gap-2 rounded-[4px] border border-[#064722] bg-[#0C7C3C] px-4 py-2 text-sm font-bold tracking-[0.2px] text-white transition-colors hover:bg-[#064722]"
								href={buildDownloadHref("docx", downloadQuery)}
							>
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.25"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
									/>
								</svg>
								DOCX
							</Link>
						</div>
					) : null}
				</section>

				{totalResults > 0 ? (
					<section className="mt-12 border-t border-[#e2e8f0] pt-8">
						<div className="flex flex-wrap items-baseline justify-between gap-3">
							<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
								Tendências temporais
							</h2>
							<p className="text-xs text-[#64748b]">
								Linhas por termo dentro do conjunto filtrado no grafo.
							</p>
						</div>

						<div className="mt-8">
							<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#0f4c81]">
								Termos de tecnologia
							</h3>
							<p className="mt-1 text-xs text-[#64748b]">
								{selectedTecTerms.length > 0
									? "Apenas os termos tec selecionados."
									: "Todos os termos tec dos artigos filtrados."}
							</p>
							<div className="mt-4">
								<TermsMultiLineChartClient
									emptyMessage="Não há termos tecnológicos com ano de publicação válido nos artigos filtrados."
									key={`technology-${technologyTermsTrend.map((item) => item.key).join("|")}`}
									series={technologyTermsTrend}
									tone="blue"
								/>
							</div>
						</div>

						<div className="mt-10">
							<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
								Termos ambientais
							</h3>
							<p className="mt-1 text-xs text-[#64748b]">
								{selectedEnvTerms.length > 0
									? "Apenas os termos ambientais selecionados."
									: "Todos os termos ambientais dos artigos filtrados."}
							</p>
							<div className="mt-4">
								<TermsMultiLineChartClient
									emptyMessage="Não há termos ambientais com ano de publicação válido nos artigos filtrados."
									key={`environmental-${environmentalTermsTrend.map((item) => item.key).join("|")}`}
									series={environmentalTermsTrend}
									tone="green"
								/>
							</div>
						</div>
					</section>
				) : null}

				{totalResults > 0 ? (
					<TermsArticlesMapClient
						articlesWithMappedInstitutions={articlesWithMappedInstitutions.size}
						points={mapPoints}
						technologyLegend={technologyLegend}
						totalArticles={totalResults}
					/>
				) : null}

				{totalResults > 0 ? (
					<section className="mt-12 border-t border-[#e2e8f0] pt-8">
						<div className="flex flex-wrap items-end justify-between gap-4">
							<div className="flex flex-wrap items-end gap-4">
								<TermsPageSizeSelect
									pageSizeOptions={PAGE_SIZE_OPTIONS}
									selectedPageSize={selectedPageSize}
								/>
								<TermsSortSelect
									selectedSortBy={selectedSortBy}
									selectedSortOrder={selectedSortOrder}
								/>
							</div>
							<p className="text-sm font-semibold text-[#64748b]">
								Mostrando{" "}
								<span className="text-[#0f172a]">
									{currentStartArticle}–{currentEndArticle}
								</span>{" "}
								de {totalResults} artigos
							</p>
						</div>

						<div className="mt-5 max-h-[70vh] min-h-[260px] space-y-4 overflow-y-auto pr-2">
							{paginatedArticles.map((article) => (
								<ArticleCard
									abstract={article.article.abstract}
									href={article.articleUrl}
									key={article.article.id}
									keywords={article.article.keywords ?? []}
									metadata={buildArticleMetadata(article)}
									showAbstract={false}
									titleHref={article.preferredLink}
									title={article.article.title}
								/>
							))}
						</div>
					</section>
				) : null}

				{totalResults > 0 ? (
					<nav
						aria-label="Paginação de artigos"
						className="mt-6 flex flex-wrap items-center justify-between gap-3"
					>
						<Link
							scroll={false}
							aria-disabled={currentPage <= 1}
							className={`inline-flex rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.8px] ${
								currentPage <= 1
									? "pointer-events-none border border-[#e2e8f0] bg-[#f1f5f9] text-[#94a3b8]"
									: "border border-[#dbe7df] bg-white text-[#1d4ed8] hover:border-[#bfdbfe]"
							}`}
							href={buildPaginationHref(
								selectedTecTerms,
								selectedEnvTerms,
								Math.max(1, currentPage - 1),
								selectedPageSize,
								selectedSortBy,
								selectedSortOrder,
							)}
						>
							Anterior
						</Link>
						<p className="text-sm font-semibold text-[#64748b]">
							Página {currentPage} de {totalPages}
						</p>
						<Link
							scroll={false}
							aria-disabled={currentPage >= totalPages}
							className={`inline-flex rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.8px] ${
								currentPage >= totalPages
									? "pointer-events-none border border-[#e2e8f0] bg-[#f1f5f9] text-[#94a3b8]"
									: "border border-[#dbe7df] bg-white text-[#1d4ed8] hover:border-[#bfdbfe]"
							}`}
							href={buildPaginationHref(
								selectedTecTerms,
								selectedEnvTerms,
								Math.min(totalPages, currentPage + 1),
								selectedPageSize,
								selectedSortBy,
								selectedSortOrder,
							)}
						>
							Próxima
						</Link>
					</nav>
				) : null}

				{totalResults === 0 ? (
					<section className="mt-8 rounded-[12px] border border-[#e2e8f0] bg-white p-6">
						<h2 className="text-lg font-bold text-[#0f172a]">
							Nenhum artigo encontrado
						</h2>
						<p className="mt-2 text-sm text-[#64748b]">
							Não encontramos artigos para a combinação de termos selecionada.
						</p>
					</section>
				) : null}
			</main>
		</div>
	);
}
