import { ArticleCard } from "@/components/articles/article-card";
import { formatStageTitle, slugToStageKey } from "@/lib/area-utils";
import { EiaModel } from "@/model/eia-stages";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		areaSlug: string;
	}>;
};

const logoIcon =
	"https://www.figma.com/api/mcp/asset/eb37f0db-6b60-4c9e-b2f0-6144dc10d9a5";
const searchIcon =
	"https://www.figma.com/api/mcp/asset/896216f6-cda3-48c5-8b7f-a0125e312cca";
const areaIcon =
	"https://www.figma.com/api/mcp/asset/278f0d50-2b33-4c45-b884-a09c58a8f5bc";

export default async function AreaArticlesPage({ params }: PageProps) {
	const { areaSlug } = await params;
	const stageKey = slugToStageKey(areaSlug);

	let articlesByStage: Awaited<ReturnType<EiaModel["getArticlesByStage"]>>;
	try {
		const eiaModel = new EiaModel();
		articlesByStage = await eiaModel.getArticlesByStage();
	} catch {
		throw new Error("Falha ao carregar os artigos.");
	}

	if (!(stageKey in articlesByStage)) {
		notFound();
	}

	const stageName = formatStageTitle(stageKey);
	const articles = (articlesByStage[stageKey] ?? []).filter((article) =>
		Boolean(article),
	);

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
						Exibindo {articles.length} artigos e pesquisas acadêmicas
					</p>
				</div>

				<section
					aria-label={`Lista de artigos da área ${stageName}`}
					className="mt-8 space-y-4"
				>
					{articles.length > 0 ? (
						articles.map((article, index) => (
							<ArticleCard
								abstract={article.abstract}
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
