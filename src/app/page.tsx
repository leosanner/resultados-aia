import { LandingTermsGraphClient } from "@/components/home/landing-terms-graph-client";
import { MainNavbar } from "@/components/layout/main-navbar";
import { AnimatedButton } from "@/components/ui/animated-button";
import { graphContent } from "@/infra/build-graphs";
import { formatStageTitle, stageKeyToSlug } from "@/lib/area-utils";
import { EiaModel } from "@/model/eia-stages";
import Link from "next/link";

type AreaCardStyle = {
	badgeClass: string;
	cardToneClass: string;
};

const CARD_STYLES: AreaCardStyle[] = [
	{
		badgeClass: "bg-[#F2C94C] text-[#3f320c]",
		cardToneClass: "bg-white",
	},
	{
		badgeClass: "bg-[#F2C94C] text-[#3f320c]",
		cardToneClass: "bg-white",
	},
	{
		badgeClass: "bg-[#F2C94C] text-[#3f320c]",
		cardToneClass: "bg-white",
	},
	{
		badgeClass: "bg-[#F2C94C] text-[#3f320c]",
		cardToneClass: "bg-white",
	},
	{
		badgeClass: "bg-[#F2C94C] text-[#3f320c]",
		cardToneClass: "bg-white",
	},
	{
		badgeClass: "bg-[#F2C94C] text-[#3f320c]",
		cardToneClass: "bg-white",
	},
];

function formatTotal(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

export default async function Home() {
	let summary: Record<string, number> | null = null;
	let graphData: Awaited<ReturnType<typeof graphContent>> | null = null;
	let loadError = false;

	try {
		const eiaModel = new EiaModel();
		summary = await eiaModel.getArticlesSummary();
	} catch {
		loadError = true;
	}

	try {
		graphData = await graphContent();
	} catch {
		graphData = null;
	}

	return (
		<div className="min-h-screen bg-[#f5f7f6] text-[#2B2B2B]">
			<MainNavbar showEntrarButton />

			<main className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 pb-14 pt-6 sm:px-10 lg:gap-16 lg:px-20 lg:pt-12">
				<section className="relative overflow-hidden rounded-[28px] border border-[#cde0d4] bg-[#064722] p-8 text-white shadow-[0px_24px_50px_-36px_rgba(8,94,46,0.85)] sm:p-10 lg:p-12">
					<div className="relative max-w-[760px]">
						<h1 className="text-4xl font-black leading-[1.05] tracking-[-1.1px] md:text-5xl">
							Visão Geral das Etapas da AIA
						</h1>
						<p className="mt-4 text-lg leading-[1.6] text-[#dbefdf]">
							Explore pesquisas em Avaliação de Impacto Ambiental:
						</p>
					</div>
				</section>

				{loadError ? (
					<section className="rounded-3xl border border-[#e0e6e2] bg-white p-8">
						<h2 className="text-xl font-bold text-[#2B2B2B]">
							Não foi possível carregar os dados
						</h2>
						<p className="mt-2 text-sm text-[#556070]">
							Ocorreu um erro ao buscar os artigos. Tente novamente em
							instantes.
						</p>
					</section>
				) : (
					<section
						aria-label="Áreas de pesquisa"
						className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
					>
						{Object.entries(summary ?? {}).map(([stageKey, total], index) => {
							const style = CARD_STYLES[index % CARD_STYLES.length];
							const stageTitle = formatStageTitle(stageKey);
							const description = `Artigos relacionados à etapa "${stageTitle}" no processo de AIA.`;
							const stageSlug = stageKeyToSlug(stageKey);

							return (
								<article
									className={`flex min-h-[292px] flex-col rounded-3xl border border-[#7bbf96] ${style.cardToneClass} p-[32px] shadow-[0px_14px_32px_-24px_rgba(17,17,17,0.28)] transition-all hover:-translate-y-1 hover:border-[#27AE60] hover:shadow-[0px_22px_40px_-24px_rgba(12,124,60,0.35)]`}
									key={stageKey}
								>
									<h2 className="text-[34px]/8 font-bold text-[#2B2B2B] sm:text-4xl lg:text-3xl">
										{stageTitle}
									</h2>
									<p className="mt-2 line-clamp-2 text-sm leading-[22px] text-[#556070]">
										{description}
									</p>
									<div className="mt-6">
										<span
											className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.6px] ${style.badgeClass}`}
										>
											{formatTotal(total)} artigos
										</span>
									</div>
									<div className="mt-6 flex flex-wrap gap-3">
										<AnimatedButton
											href={`/areas/${stageSlug}/artigos`}
											label="Ver artigos"
											inverted
										/>
										<AnimatedButton
											href={`/areas/${stageSlug}/estatisticas`}
											label="Ver estatísticas"
											tone="blue"
										/>
									</div>
								</article>
							);
						})}
					</section>
				)}

				{!loadError &&
				summary &&
				Object.values(summary).every((count) => count === 0) ? (
					<section className="rounded-3xl border border-[#e0e6e2] bg-white p-8">
						<h2 className="text-xl font-bold text-[#2B2B2B]">
							Nenhum resultado encontrado
						</h2>
						<p className="mt-2 text-sm text-[#556070]">
							Ainda não há artigos classificados para estas áreas.
						</p>
					</section>
				) : null}

				{graphData ? (
					<section className="rounded-3xl border border-[#cfe0e9] bg-white p-6 shadow-[0px_16px_35px_-28px_rgba(17,17,17,0.3)] sm:p-8">
						<h2 className="text-2xl font-extrabold tracking-[-0.4px] text-[#2B2B2B]">
							Grafo de Artigos e Termos
						</h2>
						<p className="mt-2 text-sm text-[#31596c]">
							Use a legenda abaixo do filtro para identificar as cores dos nós.
						</p>
						<div className="mt-6">
							<LandingTermsGraphClient graph={graphData} />
						</div>
					</section>
				) : null}
			</main>

			<footer className="border-t border-[#123629] bg-[#0b281f] px-6 py-12 sm:px-10 lg:px-20">
				<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 text-sm text-[#d4e3da] md:flex-row md:items-start md:justify-between">
					<div>
						<nav
							aria-label="Mapa do site"
							className="flex flex-wrap items-center gap-x-6 gap-y-2"
						>
							<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/">
								Início
							</Link>
							<Link
								className="text-white transition-colors hover:text-[#d4e3da]"
								href="/contextualizacao-geral"
							>
								Contextualização Geral
							</Link>
							<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/metodologia">
								Metodologia
							</Link>
							<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/autores">
								Autores
							</Link>
							<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/termos">
								Termos
							</Link>
						</nav>
					</div>
					<p>© 2026 Projeto Base de Pesquisa AIA.</p>
				</div>
			</footer>
		</div>
	);
}
