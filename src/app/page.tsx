import { LandingTermsGraphClient } from "@/components/home/landing-terms-graph-client";
import { graphContent } from "@/infra/build-graphs";
import { formatStageTitle, stageKeyToSlug } from "@/lib/area-utils";
import { EiaModel } from "@/model/eia-stages";

const STAGE_ICONS: Record<string, string> = {
	risk_analysis: "analytics",
	screening: "filter_list",
	impact_identification: "troubleshoot",
	environmental_baseline: "eco",
	scoping: "zoom_out_map",
	decision_making: "gavel",
	environmental_management_plan: "assignment",
	impact_significance_evaluation: "priority_high",
	impact_prediction: "trending_up",
	public_participation: "groups",
	follow_up: "monitoring",
	technical_review: "rate_review",
};

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
		<div className="min-h-screen bg-[#f7faf5] text-[#191c1a]">
			{/* Hero — full width */}
			<section className="relative flex min-h-[460px] items-center overflow-hidden bg-[#0f3d2e]">
				<div
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage:
							"radial-gradient(circle at 2px 2px, #beedd7 1px, transparent 0)",
						backgroundSize: "40px 40px",
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-[#00261a] via-[#0f3d2e]/80 to-transparent" />
				<div className="relative z-10 mx-auto w-full max-w-screen-2xl px-8 py-20">
					<div className="max-w-3xl">
						<h1 className="text-5xl font-black leading-tight tracking-tighter text-white md:text-7xl">
							Visão Geral das{" "}
							<br />
							<span className="text-[#f6be28]">Etapas da AIA</span>
						</h1>
						<p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[#7ba894] md:text-xl">
							Explore pesquisas em Avaliação de Impacto Ambiental:
						</p>
					</div>
				</div>
			</section>

			{/* Content container */}
			<main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-8 pb-14 pt-24 lg:gap-16">
				{loadError ? (
					<section className="rounded-xl border border-[#c0c8c3] bg-white p-8">
						<h2 className="text-xl font-bold text-[#00261a]">
							Não foi possível carregar os dados
						</h2>
						<p className="mt-2 text-sm text-[#414944]">
							Ocorreu um erro ao buscar os artigos. Tente novamente em
							instantes.
						</p>
					</section>
				) : (
					<section aria-label="Áreas de pesquisa">
						<div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
							<div className="max-w-xl">
								<h2 className="text-3xl font-bold text-[#00261a]">
									Arquivos por Categoria
								</h2>
								<p className="mt-2 text-[#446554]">
									Selecione uma etapa para acessar as publicações
									específicas e análises detalhadas.
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{Object.entries(summary ?? {}).map(
								([stageKey, total]) => {
									const stageTitle = formatStageTitle(stageKey);
									const description = `Artigos relacionados à etapa "${stageTitle}" no processo de AIA.`;
									const stageSlug = stageKeyToSlug(stageKey);
									const iconName =
										STAGE_ICONS[stageKey] ?? "description";

									return (
										<article
											className="flex min-h-[320px] flex-col justify-between rounded-xl bg-white p-8 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)] transition-all duration-300 hover:-translate-y-2"
											key={stageKey}
										>
											<div>
												<div className="mb-6 flex items-start justify-between">
													<span className="material-symbols-outlined text-4xl text-[#446554]">
														{iconName}
													</span>
													<span className="rounded-full bg-[#f6be28] px-3 py-1 text-xs font-bold text-[#251a00]">
														{formatTotal(total)}{" "}
														Artigos
													</span>
												</div>
												<h3 className="mb-3 text-xl font-bold text-[#00261a]">
													{stageTitle}
												</h3>
												<p className="line-clamp-3 text-sm leading-relaxed text-[#414944]">
													{description}
												</p>
											</div>
											<div className="mt-8 flex gap-3">
												<a
													href={`/areas/${stageSlug}/artigos`}
													className="group/btn relative flex flex-1 items-center justify-center overflow-hidden rounded bg-[#00261a] px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-white"
												>
													<span className="absolute inset-0 origin-left scale-x-0 bg-[#3b6756] transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />
													<span className="relative z-10">Ver artigos</span>
												</a>
												<a
													href={`/areas/${stageSlug}/estatisticas`}
													className="group/stat relative flex items-center justify-center overflow-hidden rounded border border-[#c0c8c3] p-2 text-[#446554] transition-colors duration-300 hover:border-[#00261a] hover:text-white"
												>
													<span className="absolute inset-0 origin-left scale-x-0 bg-[#00261a] transition-transform duration-300 ease-out group-hover/stat:scale-x-100" />
													<span className="relative z-10">
														<span className="material-symbols-outlined text-sm">
															bar_chart
														</span>
													</span>
												</a>
											</div>
										</article>
									);
								},
							)}
						</div>
					</section>
				)}

				{!loadError &&
				summary &&
				Object.values(summary).every((count) => count === 0) ? (
					<section className="rounded-xl border border-[#c0c8c3] bg-white p-8">
						<h2 className="text-xl font-bold text-[#00261a]">
							Nenhum resultado encontrado
						</h2>
						<p className="mt-2 text-sm text-[#414944]">
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
		</div>
	);
}
