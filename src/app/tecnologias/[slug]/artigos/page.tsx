import {
	ArticleCard,
	type ArticleMetadata,
} from "@/components/articles/article-card";
import { formatTecTermLabel, slugToTecTerm } from "@/lib/tech-utils";
import { getTechArticlesSummary } from "@/lib/tech-summary";
import {
	Article,
	ArticleExtend,
	ArticleModel,
	EnvTerm,
	TecTerm,
	Term,
	envTerms,
	resolveArticleTerms,
	tecTerms,
} from "@/model/article";
import { Cpu, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		slug: string;
	}>;
	searchParams: Promise<{
		term?: string | string[];
		page?: string | string[];
		pageSize?: string | string[];
	}>;
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50] as const;
type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

type ArticleWithId = Article & { id: number };

function formatTermLabel(text: string) {
	return text
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function buildTermHref(slug: string, termLabel: string) {
	return {
		pathname: `/tecnologias/${slug}/artigos`,
		query: { term: termLabel },
	};
}

function buildPaginationHref(
	slug: string,
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
		pathname: `/tecnologias/${slug}/artigos`,
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

async function filterArticlesByTerms(
	articles: ArticleWithId[],
	articlesFt: Awaited<ReturnType<ArticleModel["loadFrequencyTerms"]>>,
	terms: { envTerm: EnvTerm[]; tecTerm: TecTerm[] },
) {
	const selectedEnvTerms = terms.envTerm ?? [];
	const selectedTecTerms = terms.tecTerm ?? [];

	if (selectedEnvTerms.length === 0 && selectedTecTerms.length === 0) {
		return articles;
	}

	const effectiveEnvTerms =
		selectedEnvTerms.length > 0 ? selectedEnvTerms : [...envTerms];
	const effectiveTecTerms =
		selectedTecTerms.length > 0 ? selectedTecTerms : [...tecTerms];

	return articles.filter((article) => {
		const resolved = resolveArticleTerms(article, articlesFt[article.id]);
		const envHit = resolved.environmental.some((val) =>
			effectiveEnvTerms.includes(val),
		);
		const tecHit = resolved.technology.some((val) =>
			effectiveTecTerms.includes(val),
		);
		return envHit && tecHit;
	});
}

function buildTermsFrequency(
	articles: ArticleWithId[],
	articlesFt: Awaited<ReturnType<ArticleModel["loadFrequencyTerms"]>>,
) {
	const frequency = { env: {}, tec: {} } as {
		env: Record<string, number>;
		tec: Record<string, number>;
	};

	for (const article of articles) {
		const resolved = resolveArticleTerms(article, articlesFt[article.id]);
		for (const key of resolved.environmental) {
			frequency.env[key] = (frequency.env[key] ?? 0) + 1;
		}
		for (const key of resolved.technology) {
			frequency.tec[key] = (frequency.tec[key] ?? 0) + 1;
		}
	}

	return frequency;
}

export default async function TechArticlesPage({
	params,
	searchParams,
}: PageProps) {
	const { slug } = await params;
	const { term, page, pageSize } = await searchParams;
	const tecTerm = slugToTecTerm(slug);

	if (!tecTerm) {
		notFound();
	}

	const articleModel = new ArticleModel();
	const [summary, allArticlesMap, articlesFt, articlesExtended] =
		await Promise.all([
			getTechArticlesSummary(),
			articleModel.getArticles(),
			articleModel.loadFrequencyTerms(),
			articleModel.getArticlesExtended(),
		]);

	const techArticleIds = summary[tecTerm] ?? [];
	const allArticles: ArticleWithId[] = techArticleIds
		.map((id) => {
			const article = allArticlesMap[id];
			if (!article) return null;
			return { ...article, id };
		})
		.filter((article): article is ArticleWithId => Boolean(article));

	const termsFrequency = buildTermsFrequency(allArticles, articlesFt);
	const availableTechnologyTerms = Object.entries(termsFrequency.tec).sort(
		(a, b) => b[1] - a[1],
	);
	const availableEnvironmentalTerms = Object.entries(termsFrequency.env).sort(
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

	const articles = await filterArticlesByTerms(allArticles, articlesFt, {
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

	type ArticleTermsSummary = { technology: string[]; environmental: string[] };
	const articleTermsEntries: Array<[number, ArticleTermsSummary]> = await Promise.all(
		articles.map(async (article) => {
			const resolvedTerms = await articleModel.getResolvedArticleTerms(article.id);
			const technology = summarizeTerms(
				resolvedTerms.technology.map(formatTermLabel),
			);
			const environmental = summarizeTerms(
				resolvedTerms.environmental.map(formatTermLabel),
			);

			return [article.id, { technology, environmental }];
		}),
	);
	const articleTermsById = new Map<number, ArticleTermsSummary>(
		articleTermsEntries,
	);

	const techName = formatTecTermLabel(tecTerm);

	return (
		<div className="min-h-screen bg-[#e4ece7] text-[#1f2937]">
			<main className="mx-auto w-full max-w-[992px] px-6 py-8 md:px-12">
				<div className="rounded-2xl border border-[#d7e4dc] bg-white p-6 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#64748b]">
						Tecnologia selecionada
					</p>
					<div className="mt-2 flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9f1f5] ring-1 ring-[#b3c8d7]">
							<Cpu aria-hidden className="h-4 w-4 text-[#1F6F8B]" />
						</div>
						<h1 className="text-4xl font-black tracking-[-0.9px] text-[#1f2937]">
							{techName}
						</h1>
					</div>
					<p className="mt-2 text-base font-medium text-[#556070]">
						Exibindo {articles.length} artigos que mencionam {techName}{" "}
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
								href={`/tecnologias/${slug}/artigos`}
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
													href={buildTermHref(slug, termLabel)}
												>
													Ver artigos
												</Link>
											</div>
										))
									) : (
										<p className="text-xs text-[#64748b]">
											Não há termos de tecnologia nesta seleção.
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
													href={buildTermHref(slug, termLabel)}
												>
													Ver artigos
												</Link>
											</div>
										))
									) : (
										<p className="text-xs text-[#64748b]">
											Não há termos ambientais nesta seleção.
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
					aria-label={`Lista de artigos da tecnologia ${techName}`}
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
								href={`/tecnologias/${slug}/artigos/${article.id}`}
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
									`/tecnologias/${slug}/artigos/${article.id}`,
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
								Não há artigos disponíveis para esta tecnologia no momento.
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
								slug,
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
								slug,
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
