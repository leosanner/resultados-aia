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
	const selectedTermsCount = selectedTecTerms.length + selectedEnvTerms.length;

	return (
		<div className="min-h-screen bg-[#e4ece7] text-[#1f2937]">
			<main className="mx-auto w-full max-w-[992px] px-6 py-8 md:px-12">
				<section className="rounded-2xl border border-[#d7e4dc] bg-white p-6 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#64748b]">
						Filtro por termos
					</p>
					<h1 className="mt-2 text-4xl font-black tracking-[-0.9px] text-[#1f2937]">
						{isShowingAllResults
							? "Todos os resultados do grafo"
							: hasSelectedTerms
							? "Resultados por termos selecionados"
							: "Resultados por termos"}
					</h1>
					<p className="mt-2 text-base font-medium text-[#556070]">
						{isShowingAllResults
							? `${totalResults} artigos encontrados sem filtros aplicados.`
							: hasSelectedTerms
							? `${totalResults} artigos encontrados.`
							: "Resultados carregados."}
					</p>

					{totalResults > 0 ? (
						<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="rounded-xl border border-[#cfe0d6] bg-[#f8fbf9] px-4 py-3">
								<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#556070]">
									Total
								</p>
								<p className="mt-1 text-2xl font-black text-[#1f2937]">
									{totalResults}
								</p>
							</div>
							<div className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3">
								<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#1d4ed8]">
									Termos Tec
								</p>
								<p className="mt-1 text-2xl font-black text-[#1e3a8a]">
									{selectedTecTerms.length}
								</p>
							</div>
							<div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
								<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#15803d]">
									Termos Env
								</p>
								<p className="mt-1 text-2xl font-black text-[#14532d]">
									{selectedEnvTerms.length}
								</p>
							</div>
						</div>
					) : null}
				</section>

				{selectedTermsCount > 0 ? (
					<section className="mt-6 rounded-[12px] border border-[#cfe0d6] bg-white p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#085E2E]">
									Termos selecionados
								</h2>
								<p className="mt-1 text-sm text-[#556070]">
									{selectedTermsCount} filtros ativos nos resultados do grafo.
								</p>
							</div>
							<Link
								scroll={false}
								className="text-xs font-bold uppercase tracking-[1px] text-[#0C7C3C] hover:text-[#085E2E]"
								href={buildFiltersHref(
									[],
									[],
									selectedPageSize,
									selectedSortBy,
									selectedSortOrder,
								)}
							>
								Limpar filtros
							</Link>
						</div>

						{selectedTecTerms.length > 0 ? (
							<div className="mt-4">
								<h3 className="text-xs font-bold uppercase tracking-[0.9px] text-[#1d4ed8]">
									Termos de tecnologia
								</h3>
								<ul className="mt-3 flex flex-wrap gap-2">
									{selectedTecTerms.map((term) => (
										<li key={`tec-${term}`}>
											<span className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-[11px] font-semibold text-[#1e3a8a]">
												<span>Tec: {formatTermLabel(term)}</span>
												<Link
													scroll={false}
													aria-label={`Remover filtro ${formatTermLabel(term)}`}
													className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
													href={buildFiltersHref(
														selectedTecTerms.filter(
															(selectedTerm) => selectedTerm !== term,
														),
														selectedEnvTerms,
														selectedPageSize,
														selectedSortBy,
														selectedSortOrder,
													)}
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
									))}
								</ul>
							</div>
						) : null}

						{selectedEnvTerms.length > 0 ? (
							<div className="mt-4">
								<h3 className="text-xs font-bold uppercase tracking-[0.9px] text-[#15803d]">
									Termos ambientais
								</h3>
								<ul className="mt-3 flex flex-wrap gap-2">
									{selectedEnvTerms.map((term) => (
										<li key={`env-${term}`}>
											<span className="inline-flex items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-[11px] font-semibold text-[#166534]">
												<span>Env: {formatTermLabel(term)}</span>
												<Link
													scroll={false}
													aria-label={`Remover filtro ${formatTermLabel(term)}`}
													className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#15803d] transition-colors hover:bg-[#dcfce7]"
													href={buildFiltersHref(
														selectedTecTerms,
														selectedEnvTerms.filter(
															(selectedTerm) => selectedTerm !== term,
														),
														selectedPageSize,
														selectedSortBy,
														selectedSortOrder,
													)}
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
									))}
								</ul>
							</div>
						) : null}
					</section>
				) : null}

				{totalResults > 0 ? (
					<section className="mt-6 rounded-[12px] border border-[#cfe0d6] bg-white p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#085E2E]">
									Exportar resultados
								</h2>
								<p className="mt-1 text-sm text-[#556070]">
									Baixe a seleção atual em formato tabular ou relatório.
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								<Link
									className="inline-flex items-center rounded-md border border-[#cfe0d6] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.8px] text-[#085E2E] transition-colors hover:border-[#9bc9af] hover:bg-[#f8fbf9]"
									href={buildDownloadHref("csv", downloadQuery)}
								>
									Baixar CSV
								</Link>
								<Link
									className="inline-flex items-center rounded-md bg-[#0C7C3C] px-4 py-2 text-xs font-bold uppercase tracking-[0.8px] text-white transition-colors hover:bg-[#085E2E]"
									href={buildDownloadHref("docx", downloadQuery)}
								>
									Baixar DOCX
								</Link>
							</div>
						</div>
					</section>
				) : null}

				{totalResults > 0 ? (
					<section className="mt-8 space-y-4">
						<div className="rounded-[12px] border border-[#cfe0d6] bg-white p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
							<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
								Tendências temporais
							</h2>
							<p className="mt-1 text-sm text-[#556070]">
								Cada linha representa um termo dentro do conjunto de artigos já
								filtrado no grafo.
							</p>
						</div>

						<section className="rounded-[12px] border border-[#bfdbfe] bg-[#f8fbff] p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
							<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#1d4ed8]">
								Termos de tecnologia
							</h3>
							<p className="mt-1 text-sm text-[#556070]">
								{selectedTecTerms.length > 0
									? "Linhas geradas apenas para os termos tecnológicos selecionados."
									: "Nenhum termo tecnológico foi selecionado; o gráfico considera todos os termos tecnológicos presentes nos artigos filtrados."}
							</p>
							<div className="mt-4">
								<TermsMultiLineChartClient
									emptyMessage="Não há termos tecnológicos com ano de publicação válido nos artigos filtrados."
									key={`technology-${technologyTermsTrend.map((item) => item.key).join("|")}`}
									series={technologyTermsTrend}
									tone="blue"
								/>
							</div>
						</section>

						<section className="rounded-[12px] border border-[#bbf7d0] bg-[#f8fff9] p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
							<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#15803d]">
								Termos ambientais
							</h3>
							<p className="mt-1 text-sm text-[#556070]">
								{selectedEnvTerms.length > 0
									? "Linhas geradas apenas para os termos ambientais selecionados."
									: "Nenhum termo ambiental foi selecionado; o gráfico considera todos os termos ambientais presentes nos artigos filtrados."}
							</p>
							<div className="mt-4">
								<TermsMultiLineChartClient
									emptyMessage="Não há termos ambientais com ano de publicação válido nos artigos filtrados."
									key={`environmental-${environmentalTermsTrend.map((item) => item.key).join("|")}`}
									series={environmentalTermsTrend}
									tone="green"
								/>
							</div>
						</section>
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
					<>
						<section className="mt-8 rounded-[12px] border border-[#cfe0d6] bg-white p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
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
								<p className="text-sm font-semibold text-[#556070]">
									Mostrando {currentStartArticle}–{currentEndArticle} de{" "}
									{totalResults} artigos
								</p>
							</div>
						</section>

						<section
							aria-label="Lista de artigos filtrados por termos"
							className="mt-4 max-h-[70vh] min-h-[260px] space-y-4 overflow-y-auto pr-2"
						>
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
						</section>
					</>
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
									? "pointer-events-none border border-[#d1d5db] bg-[#f3f4f6] text-[#9ca3af]"
									: "border border-[#cfe0d6] bg-white text-[#085E2E] hover:border-[#9bc9af]"
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
						<p className="text-sm font-semibold text-[#556070]">
							Página {currentPage} de {totalPages}
						</p>
						<Link
							scroll={false}
							aria-disabled={currentPage >= totalPages}
							className={`inline-flex rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.8px] ${
								currentPage >= totalPages
									? "pointer-events-none border border-[#d1d5db] bg-[#f3f4f6] text-[#9ca3af]"
									: "border border-[#cfe0d6] bg-white text-[#085E2E] hover:border-[#9bc9af]"
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
					<section className="mt-8 rounded-[12px] border border-[#d7e4dc] bg-white p-6 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
						<h2 className="text-lg font-bold text-[#1f2937]">
							Nenhum artigo encontrado
						</h2>
						<p className="mt-2 text-sm text-[#556070]">
							Não encontramos artigos para a combinação de termos selecionada.
						</p>
					</section>
				) : null}
			</main>
		</div>
	);
}
