import { ArticleCard } from "@/components/articles/article-card";
import { formatStageTitle, slugToStageKey } from "@/lib/area-utils";
import { EnvTerm, TecTerm, Term } from "@/model/article";
import { EiaModel } from "@/model/eia-stages";
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

export default async function AreaArticlesPage({
	params,
	searchParams,
}: PageProps) {
	const { areaSlug } = await params;
	const { term } = await searchParams;
	const stageKey = slugToStageKey(areaSlug);
	const eiaModel = new EiaModel();

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
	const selectedTermsRaw = Array.isArray(term)
		? term
		: term
			? [term]
			: [];
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

	return (
		<div className="min-h-screen bg-[#f6f8f6] text-[#0f172a]">
			<header className="border-b border-[#e2e8f0] bg-white px-6 py-3">
				<div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
					<div className="flex items-center gap-8">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2bee4b]">
								<img alt="" className="h-[18px] w-[18px]" src={logoIcon} />
							</div>
							<p className="text-[18px]/7 font-bold tracking-[-0.45px] text-[#0f172a]">
								<Link href={"/"}>Ferramenta de Pesquisa AIA</Link>
							</p>
						</div>
						<div className="hidden w-[320px] items-center rounded-[8px] bg-[#f1f5f9] px-3 py-1.5 md:flex">
							<img alt="" className="h-[18px] w-[18px]" src={searchIcon} />
							<span className="px-3 text-sm text-[#64748b]">
								Buscar dentro da área...
							</span>
						</div>
					</div>
					<nav
						aria-label="Navegação principal"
						className="hidden items-center gap-6 text-sm font-medium md:flex"
					>
						<span className="text-[#0f172a]">Painel</span>
						<span className="text-[#16a34a]">Explorar Áreas</span>
						<span className="text-[#0f172a]">Salvos</span>
					</nav>
				</div>
			</header>

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
