import {
	ArticleCard,
	type ArticleMetadata,
} from "@/components/articles/article-card";
import { MainNavbar } from "@/components/layout/main-navbar";
import { formatStageTitle, slugToStageKey } from "@/lib/area-utils";
import {
	ArticleModel,
	type ArticleExtend,
	EnvTerm,
	TecTerm,
	Term,
} from "@/model/article";
import { EiaModel } from "@/model/eia-stages";
import { filterOcurrencies } from "@/utils/ocurrencies";
import { Leaf, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		areaSlug: string;
	}>;
	searchParams: Promise<{
		term?: string | string[];
		page?: string | string[];
		pageSize?: string | string[];
	}>;
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50] as const;
type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

function formatTermLabel(text: string) {
	return text
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function buildTermHref(areaSlug: string, termLabel: string) {
	return {
		pathname: `/areas/${areaSlug}/artigos`,
		query: { term: termLabel },
	};
}

function buildPaginationHref(
	areaSlug: string,
	selectedTerms: string[],
	page: number,
	pageSize: number,
) {
	const query: Record<string, string | string[]> = {
		page: String(page),
		pageSize: String(pageSize),
	};

	if (selectedTerms.length > 0) {
		query.term = selectedTerms;
	}

	return {
		pathname: `/areas/${areaSlug}/artigos`,
		query,
	};
}

function buildArticleMetadata(record: {
	publish_date: string;
	authors: { name: string }[];
	technologyTerms: string[];
	environmentalTerms: string[];
}): ArticleMetadata[] {
	const publicationDate =
		typeof record.publish_date === "string" ? record.publish_date.trim() : "";
	const authors = Array.isArray(record.authors)
		? record.authors
				.map((author) => author?.name?.trim())
				.filter((name): name is string => Boolean(name))
		: [];
	const authorLabel =
		authors.length > 0
			? authors.slice(0, 3).join(", ") + (authors.length > 3 ? " et al." : "")
			: "";
	const technologyLabel =
		record.technologyTerms.length > 0 ? record.technologyTerms.join(", ") : "";
	const environmentalLabel =
		record.environmentalTerms.length > 0
			? record.environmentalTerms.join(", ")
			: "";

	return [
		publicationDate ? { label: "Data", value: publicationDate } : null,
		authorLabel ? { label: "Autores", value: authorLabel } : null,
		technologyLabel ? { label: "Tecnologia", value: technologyLabel } : null,
		environmentalLabel
			? { label: "Ambientais", value: environmentalLabel }
			: null,
	].filter((item): item is ArticleMetadata => Boolean(item));
}

function summarizeTerms(terms: string[], maxItems: number = 4) {
	if (terms.length <= maxItems) return terms;
	return [...terms.slice(0, maxItems), `+${terms.length - maxItems}`];
}

function buildPreferredArticleHref(
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

export default async function AreaArticlesPage({
	params,
	searchParams,
}: PageProps) {
	const { areaSlug } = await params;
	const { term, page, pageSize } = await searchParams;
	const stageKey = slugToStageKey(areaSlug);
	const eiaModel = new EiaModel();
	const articleModel = new ArticleModel();

	let articlesByStage: Awaited<ReturnType<EiaModel["getArticlesByStage"]>>;
	try {
		articlesByStage = await eiaModel.getArticlesByStage();
	} catch {
		throw new Error("Falha ao carregar os artigos.");
	}

	if (!(stageKey in articlesByStage)) {
		notFound();
	}

	const stageName = formatStageTitle(stageKey);
	const allArticles = articlesByStage[stageKey] ?? [];
	const termsByStage = await eiaModel.filterTermsFrequency(allArticles);
	const availableTechnologyTerms = Object.entries(termsByStage.tec).sort(
		(a, b) => b[1] - a[1],
	);
	const availableEnvironmentalTerms = Object.entries(termsByStage.env).sort(
		(a, b) => b[1] - a[1],
	);
	const availableTechnologyTermsSet = new Set(
		availableTechnologyTerms.map(([termKey]) => termKey),
	);
	const availableEnvironmentalTermsSet = new Set(
		availableEnvironmentalTerms.map(([termKey]) => termKey),
	);
	const selectedTermsRaw = Array.isArray(term) ? term : term ? [term] : [];
	const selectedTechnologyTerms = selectedTermsRaw.filter(
		(value): value is TecTerm => availableTechnologyTermsSet.has(value),
	);
	const selectedEnvironmentalTerms = selectedTermsRaw.filter(
		(value): value is EnvTerm => availableEnvironmentalTermsSet.has(value),
	);
	const selectedTerms: Term[] = [
		...selectedTechnologyTerms,
		...selectedEnvironmentalTerms,
	];
	const pageSizeRaw = Array.isArray(pageSize) ? pageSize[0] : pageSize;
	const requestedPageSize = Number(pageSizeRaw);
	const selectedPageSize: PageSizeOption = PAGE_SIZE_OPTIONS.includes(
		requestedPageSize as PageSizeOption,
	)
		? (requestedPageSize as PageSizeOption)
		: 10;
	const pageRaw = Array.isArray(page) ? page[0] : page;
	const requestedPage = Number(pageRaw);
	const articles = await eiaModel.filterArticlesByTerms(allArticles, {
		envTerm: selectedEnvironmentalTerms,
		tecTerm: selectedTechnologyTerms,
	});
	const totalPages = Math.max(1, Math.ceil(articles.length / selectedPageSize));
	const currentPage =
		Number.isInteger(requestedPage) && requestedPage > 0
			? Math.min(requestedPage, totalPages)
			: 1;
	const pageStart = (currentPage - 1) * selectedPageSize;
	const paginatedArticles = articles.slice(pageStart, pageStart + selectedPageSize);
	const currentStartArticle = articles.length === 0 ? 0 : pageStart + 1;
	const currentEndArticle = Math.min(pageStart + selectedPageSize, articles.length);
	const articlesExtended = await articleModel.getArticlesExtended();
	type ArticleTermsSummary = { technology: string[]; environmental: string[] };
	const articleTermsEntries: Array<[number, ArticleTermsSummary]> = await Promise.all(
		articles.map(async (article) => {
			const articleFt = await articleModel.getArticleFrequencyTerms(article.id);
			if (!articleFt) {
				return [
					article.id,
					{ technology: [] as string[], environmental: [] as string[] },
				];
			}

			const technology = summarizeTerms(
				Object.keys(filterOcurrencies(articleFt.tec)).map(formatTermLabel),
			);
			const environmental = summarizeTerms(
				Object.keys(filterOcurrencies(articleFt.env)).map(formatTermLabel),
			);

			return [article.id, { technology, environmental }];
		}),
	);
	const articleTermsById = new Map<number, ArticleTermsSummary>(
		articleTermsEntries,
	);

	return (
		<div className="min-h-screen bg-[#e4ece7] text-[#1f2937]">
			<MainNavbar showEntrarButton />
			<main className="mx-auto w-full max-w-[992px] px-6 py-8 md:px-12">
				<div className="rounded-2xl border border-[#d7e4dc] bg-white p-6 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#64748b]">
						Área selecionada
					</p>
					<div className="mt-2 flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9f5ed] ring-1 ring-[#b3d7c1]">
							<Leaf aria-hidden className="h-4 w-4 text-[#0C7C3C]" />
						</div>
						<h1 className="text-4xl font-black tracking-[-0.9px] text-[#1f2937]">
							{stageName}
						</h1>
					</div>
					<p className="mt-2 text-base font-medium text-[#556070]">
						Exibindo {articles.length} artigos e pesquisas acadêmicas{" "}
						{selectedTerms.length > 0
							? "(com filtros de termos aplicados)"
							: ""}
					</p>
				</div>

				<section className="mt-6 rounded-[12px] border border-[#cfe0d6] bg-white p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
					<form className="space-y-5" method="GET">
						<div className="flex items-center justify-between gap-3">
							<h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[1px] text-[#085E2E]">
								<SlidersHorizontal aria-hidden className="h-4 w-4" />
								Filtrar por termos
							</h2>
							<Link
								className="text-xs font-bold uppercase tracking-[1px] text-[#0C7C3C] hover:text-[#085E2E]"
								href={`/areas/${areaSlug}/artigos`}
							>
								Limpar filtros
							</Link>
						</div>
						<input name="page" type="hidden" value="1" />

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<article className="rounded-[10px] border border-[#bfdbfe] bg-[#f8fbff] p-4">
								<h3 className="text-xs font-bold uppercase tracking-[0.9px] text-[#1d4ed8]">
									Termos de tecnologia
								</h3>
								<div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
									{availableTechnologyTerms.length > 0 ? (
										availableTechnologyTerms.map(([termLabel]) => (
											<div
												className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-2.5 py-1 text-[11px] font-semibold text-[#1e3a8a]"
												key={termLabel}
											>
												<label className="inline-flex cursor-pointer items-center gap-1.5">
													<input
														className="h-3.5 w-3.5 accent-[#2563eb]"
														defaultChecked={selectedTerms.includes(
															termLabel as Term,
														)}
														name="term"
														type="checkbox"
														value={termLabel}
													/>
													<span>{formatTermLabel(termLabel)}</span>
												</label>
												<Link
													className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.6px] text-[#1d4ed8] hover:bg-[#dbeafe]"
													href={buildTermHref(areaSlug, termLabel)}
												>
													Ver artigos
												</Link>
											</div>
										))
									) : (
										<p className="text-xs text-[#64748b]">
											Não há termos de tecnologia nesta área.
										</p>
									)}
								</div>
							</article>

							<article className="rounded-[10px] border border-[#bbf7d0] bg-[#f8fff9] p-4">
								<h3 className="text-xs font-bold uppercase tracking-[0.9px] text-[#085E2E]">
									Termos ambientais
								</h3>
								<div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
									{availableEnvironmentalTerms.length > 0 ? (
										availableEnvironmentalTerms.map(([termLabel]) => (
											<div
												className="inline-flex items-center gap-2 rounded-full border border-[#cfe0d6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#085E2E]"
												key={termLabel}
											>
												<label className="inline-flex cursor-pointer items-center gap-1.5">
													<input
														className="h-3.5 w-3.5 accent-[#0C7C3C]"
														defaultChecked={selectedTerms.includes(
															termLabel as Term,
														)}
														name="term"
														type="checkbox"
														value={termLabel}
													/>
													<span>{formatTermLabel(termLabel)}</span>
												</label>
												<Link
													className="rounded-full bg-[#f2c94c] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.6px] text-[#3f320c] hover:bg-[#e4bc45]"
													href={buildTermHref(areaSlug, termLabel)}
												>
													Ver artigos
												</Link>
											</div>
										))
									) : (
										<p className="text-xs text-[#64748b]">
											Não há termos ambientais nesta área.
										</p>
									)}
								</div>
							</article>
						</div>
						<div className="flex flex-wrap items-end justify-between gap-3">
							<label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.8px] text-[#64748b]">
								Artigos por página
								<select
									className="h-10 min-w-28 rounded-md border border-[#cfe0d6] bg-white px-2.5 text-sm font-semibold text-[#1f2937] outline-none focus:border-[#0C7C3C]"
									defaultValue={String(selectedPageSize)}
									name="pageSize"
								>
									{PAGE_SIZE_OPTIONS.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</label>

							<button
								className="inline-flex rounded-md bg-[#0C7C3C] px-4 py-2 text-xs font-bold uppercase tracking-[0.8px] text-white transition-colors hover:bg-[#085E2E]"
								type="submit"
							>
								Aplicar filtros
							</button>
						</div>
					</form>
				</section>

				<section
					aria-label={`Lista de artigos da área ${stageName}`}
					className="mt-8 space-y-4"
				>
					{articles.length > 0 ? (
						<p className="text-sm font-semibold text-[#556070]">
							Mostrando {currentStartArticle}–{currentEndArticle} de{" "}
							{articles.length} artigos
						</p>
					) : null}
					{articles.length > 0 ? (
						paginatedArticles.map((article) => (
							<ArticleCard
								abstract={article.abstract}
								href={`/areas/${areaSlug}/artigos/${article.id}`}
								key={`${article.id}`}
								keywords={article.keywords ?? []}
								metadata={buildArticleMetadata({
									publish_date:
										articlesExtended[article.id]?.publish_date ?? "",
									authors: articlesExtended[article.id]?.authors ?? [],
									technologyTerms:
										articleTermsById.get(article.id)?.technology ?? [],
									environmentalTerms:
										articleTermsById.get(article.id)?.environmental ?? [],
								})}
								showAbstract={false}
								titleHref={buildPreferredArticleHref(
									articlesExtended[article.id],
									`/areas/${areaSlug}/artigos/${article.id}`,
								)}
								title={article.title}
							/>
						))
					) : (
						<div className="rounded-[12px] border border-[#d7e4dc] bg-white p-6">
							<h2 className="text-lg font-bold text-[#1f2937]">
								Nenhum artigo encontrado
							</h2>
							<p className="mt-2 text-sm text-[#556070]">
								Não há artigos disponíveis para esta área no momento.
							</p>
						</div>
					)}
				</section>
				{articles.length > 0 ? (
					<nav
						aria-label="Paginação de artigos"
						className="mt-6 flex flex-wrap items-center justify-between gap-3"
					>
						<Link
							aria-disabled={currentPage <= 1}
							className={`inline-flex rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.8px] ${
								currentPage <= 1
									? "pointer-events-none border border-[#d1d5db] bg-[#f3f4f6] text-[#9ca3af]"
									: "border border-[#cfe0d6] bg-white text-[#085E2E] hover:border-[#9bc9af]"
							}`}
							href={buildPaginationHref(
								areaSlug,
								selectedTerms,
								Math.max(1, currentPage - 1),
								selectedPageSize,
							)}
						>
							Anterior
						</Link>
						<p className="text-sm font-semibold text-[#556070]">
							Página {currentPage} de {totalPages}
						</p>
						<Link
							aria-disabled={currentPage >= totalPages}
							className={`inline-flex rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.8px] ${
								currentPage >= totalPages
									? "pointer-events-none border border-[#d1d5db] bg-[#f3f4f6] text-[#9ca3af]"
									: "border border-[#cfe0d6] bg-white text-[#085E2E] hover:border-[#9bc9af]"
							}`}
							href={buildPaginationHref(
								areaSlug,
								selectedTerms,
								Math.min(totalPages, currentPage + 1),
								selectedPageSize,
							)}
						>
							Próxima
						</Link>
					</nav>
				) : null}
			</main>
		</div>
	);
}
