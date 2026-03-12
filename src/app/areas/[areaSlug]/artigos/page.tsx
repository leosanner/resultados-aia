import {
	ArticleCard,
	type ArticleMetadata,
} from "@/components/articles/article-card";
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
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		areaSlug: string;
	}>;
	searchParams: Promise<{
		term?: string | string[];
	}>;
};

const logoIcon =
	"https://www.figma.com/api/mcp/asset/eb37f0db-6b60-4c9e-b2f0-6144dc10d9a5";
const searchIcon =
	"https://www.figma.com/api/mcp/asset/896216f6-cda3-48c5-8b7f-a0125e312cca";
const areaIcon =
	"https://www.figma.com/api/mcp/asset/278f0d50-2b33-4c45-b884-a09c58a8f5bc";

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
	const { term } = await searchParams;
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
	const articles = await eiaModel.filterArticlesByTerms(allArticles, {
		envTerm: selectedEnvironmentalTerms,
		tecTerm: selectedTechnologyTerms,
	});
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
		<div className="min-h-screen bg-[#f6f8f6] text-[#0f172a]">
			<main className="mx-auto w-full max-w-[992px] px-6 py-8 md:px-12">
				<div className="border-b border-[#e2e8f0] pb-8">
					<Link
						className="text-xs font-bold uppercase tracking-[1.2px] text-[#94a3b8] hover:text-[#64748b]"
						href="/"
					>
						Voltar para áreas
					</Link>
					<p className="mt-6 text-xs font-bold uppercase tracking-[1.2px] text-[#94a3b8]">
						Área selecionada
					</p>
					<div className="mt-2 flex items-center gap-3">
						<img alt="" className="h-[21px] w-[21px]" src={areaIcon} />
						<h1 className="text-4xl font-black tracking-[-0.9px] text-[#0f172a]">
							{stageName}
						</h1>
					</div>
					<p className="mt-2 text-base font-medium text-[#64748b]">
						Exibindo {articles.length} artigos e pesquisas acadêmicas{" "}
						{selectedTerms.length > 0
							? "(com filtros de termos aplicados)"
							: ""}
					</p>
				</div>

				<section className="mt-6 rounded-[12px] border border-[#dbeafe] bg-[#f8fbff] p-5">
					<form className="space-y-5" method="GET">
						<div className="flex items-center justify-between gap-3">
							<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#1e3a8a]">
								Filtrar por termos
							</h2>
							<Link
								className="text-xs font-bold uppercase tracking-[1px] text-[#1d4ed8] hover:text-[#1e40af]"
								href={`/areas/${areaSlug}/artigos`}
							>
								Limpar filtros
							</Link>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<article className="rounded-[10px] border border-[#bfdbfe] bg-white p-4">
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

							<article className="rounded-[10px] border border-[#bbf7d0] bg-white p-4">
								<h3 className="text-xs font-bold uppercase tracking-[0.9px] text-[#15803d]">
									Termos ambientais
								</h3>
								<div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
									{availableEnvironmentalTerms.length > 0 ? (
										availableEnvironmentalTerms.map(([termLabel]) => (
											<div
												className="inline-flex items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-semibold text-[#166534]"
												key={termLabel}
											>
												<label className="inline-flex cursor-pointer items-center gap-1.5">
													<input
														className="h-3.5 w-3.5 accent-[#16a34a]"
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
													className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.6px] text-[#15803d] hover:bg-[#dcfce7]"
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

						<button
							className="inline-flex rounded-full bg-[#2563eb] px-4 py-2 text-xs font-bold uppercase tracking-[0.8px] text-white hover:bg-[#1d4ed8]"
							type="submit"
						>
							Aplicar filtros
						</button>
					</form>
				</section>

				<section
					aria-label={`Lista de artigos da área ${stageName}`}
					className="mt-8 space-y-4"
				>
					{articles.length > 0 ? (
						articles.map((article, index) => (
							<ArticleCard
								abstract={article.abstract}
								href={`/areas/${areaSlug}/artigos/${article.id}`}
								key={`${article.title}-${index}`}
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
						<div className="rounded-[12px] border border-[#e2e8f0] bg-white p-6">
							<h2 className="text-lg font-bold text-[#0f172a]">
								Nenhum artigo encontrado
							</h2>
							<p className="mt-2 text-sm text-[#64748b]">
								Não há artigos disponíveis para esta área no momento.
							</p>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
