import { formatStageTitle } from "@/lib/area-utils";
import { EiaModel } from "@/model/eia-stages";
import { StageAuthorsCard } from "@/components/autores/stage-authors-card";
import Link from "next/link";

type AuthorByStage = {
	authorId: string;
	authorName: string;
	publications: number[];
};

const logoIcon =
	"https://www.figma.com/api/mcp/asset/5991a927-15ee-4ad4-a626-237193d1b42d";

export default async function AuthorsPage() {
	const eiaModel = new EiaModel();
	const authorsByStage = await eiaModel.getAuthorsByStage();

	const stages = Object.entries(authorsByStage)
		.map(([stageKey, authors]) => {
			const sortedAuthors = Object.entries(authors)
				.map(([authorId, author]) => {
					const uniquePublications = new Set(author.publications);
					return {
						authorId,
						authorName: author.authorName,
						publications: Array.from(uniquePublications),
					} as AuthorByStage;
				})
				.sort((a, b) => b.publications.length - a.publications.length);

			return {
				stageKey,
				stageTitle: formatStageTitle(stageKey),
				authors: sortedAuthors,
			};
		})
		.sort((a, b) => b.authors.length - a.authors.length);

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#edf8f2_0%,_#f4f8f6_40%,_#ffffff_100%)] text-[#111111]">
			<header className="w-full border-b border-[#173f2f] bg-[#0f1f19]/95 px-6 py-6 backdrop-blur-sm sm:px-10 lg:px-20 lg:py-8">
				<div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2ecc71]/20 ring-1 ring-[#28a745]/30">
							<img alt="" className="h-4 w-4" src={logoIcon} />
						</div>
						<div className="leading-tight">
							<p className="text-xl font-extrabold tracking-[-0.5px] text-white">
								Explorador AIA
							</p>
							<p className="text-[10px] font-bold uppercase tracking-[1px] text-[#7dd3a8]">
								Base de Pesquisa
							</p>
						</div>
					</div>
					<nav
						aria-label="Navegação principal"
						className="hidden items-center gap-8 md:flex"
					>
						<Link
							className="text-sm font-medium text-[#d6e5dd] transition-colors hover:text-white"
							href="/contextualizacao-geral"
						>
							Contextualização Geral
						</Link>
						<Link
							className="text-sm font-medium text-[#d6e5dd] transition-colors hover:text-white"
							href="/metodologia"
						>
							Metodologia
						</Link>
						<Link
							className="text-sm font-medium text-white"
							href="/autores"
						>
							Autores
						</Link>
					</nav>
				</div>
			</header>

			<main className="mx-auto w-full max-w-[1280px] px-6 py-8 sm:px-10 lg:px-20">
				<section className="max-w-[760px]">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#256f4f]">
						Novo Painel
					</p>
					<h1 className="mt-2 text-4xl font-black tracking-[-1px] text-[#111111] md:text-5xl">
						Autores por Área da AIA
					</h1>
					<p className="mt-3 text-base text-[#4a5568]">
						Ranking de autores por etapa, com total de publicações associadas.
					</p>
				</section>

				<section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
					{stages.map((stage) => (
						<StageAuthorsCard
							authors={stage.authors}
							key={stage.stageKey}
							stageKey={stage.stageKey}
							stageTitle={stage.stageTitle}
						/>
					))}
				</section>
			</main>
		</div>
	);
}
