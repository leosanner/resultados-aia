import { HeroSection } from "@/components/home/hero-section";
import { LandingTermsGraphClient } from "@/components/home/landing-terms-graph-client";
import { graphContent } from "@/infra/build-graphs";
import { getTechArticlesSummary } from "@/lib/tech-summary";
import { tecTermToSlug } from "@/lib/tech-utils";
import { TecTerm, tecTerms } from "@/model/article";

const TECH_ICONS: Record<TecTerm, string> = {
	"Technological Innovation": "auto_awesome",
	"Natural Language Processing": "translate",
	Geoprocessing: "public",
	"Internet of Things": "sensors",
	"Remote Sensing": "satellite_alt",
	"Data Science": "analytics",
	"Machine Learning": "model_training",
	"Digital Technologies": "devices",
	"Reinforcement Learning": "smart_toy",
	"Data Visualization": "insights",
	"Prediction Analytics": "trending_up",
	"Augmented Reality": "view_in_ar",
	"Artificial Intelligence": "psychology",
	"Deep Learning": "neurology",
	"Digital Transformation": "sync_alt",
	"Digital Twins": "hub",
};

function formatTotal(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

export default async function Home() {
	let summary: Record<TecTerm, number[]> | null = null;
	let graphData: Awaited<ReturnType<typeof graphContent>> | null = null;
	let loadError = false;

	try {
		summary = await getTechArticlesSummary();
	} catch {
		loadError = true;
	}

	try {
		graphData = await graphContent();
	} catch {
		graphData = null;
	}

	const techEntries = summary
		? tecTerms
				.map((term) => [term, summary![term]?.length ?? 0] as const)
				.filter(([, total]) => total > 0)
		: [];

	return (
		<div className="min-h-screen bg-[#f7faf5] text-[#191c1a]">
			<HeroSection />

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
					<section aria-label="Artigos por tecnologia">
						<div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
							<div className="max-w-xl">
								<h2 className="text-3xl font-bold text-[#00261a]">
									Artigos por Tecnologia
								</h2>
								<p className="mt-2 text-[#446554]">
									Selecione uma tecnologia para acessar as publicações
									que a aplicam no contexto de AIA.
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{techEntries.map(([tecTerm, total]) => {
								const description = `Artigos que aplicam ${tecTerm} no contexto de AIA.`;
								const techSlug = tecTermToSlug(tecTerm);
								const iconName = TECH_ICONS[tecTerm] ?? "science";

								return (
									<article
										className="flex min-h-[320px] flex-col justify-between rounded-xl bg-white p-8 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)] transition-all duration-300 hover:-translate-y-2"
										key={tecTerm}
									>
										<div>
											<div className="mb-6 flex items-start justify-between">
												<span className="material-symbols-outlined text-4xl text-[#446554]">
													{iconName}
												</span>
												<span className="rounded-full bg-[#f6be28] px-3 py-1 text-xs font-bold text-[#251a00]">
													{formatTotal(total)} Artigos
												</span>
											</div>
											<h3 className="mb-3 text-xl font-bold text-[#00261a]">
												{tecTerm}
											</h3>
											<p className="line-clamp-3 text-sm leading-relaxed text-[#414944]">
												{description}
											</p>
										</div>
										<div className="mt-8 flex gap-3">
											<a
												href={`/tecnologias/${techSlug}/artigos`}
												className="group/btn relative flex flex-1 items-center justify-center overflow-hidden rounded bg-[#00261a] px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-white"
											>
												<span className="absolute inset-0 origin-left scale-x-0 bg-[#3b6756] transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />
												<span className="relative z-10">Ver artigos</span>
											</a>
										</div>
									</article>
								);
							})}
						</div>
					</section>
				)}

				{!loadError && summary && techEntries.length === 0 ? (
					<section className="rounded-xl border border-[#c0c8c3] bg-white p-8">
						<h2 className="text-xl font-bold text-[#00261a]">
							Nenhum resultado encontrado
						</h2>
						<p className="mt-2 text-sm text-[#414944]">
							Ainda não há artigos classificados para estas tecnologias.
						</p>
					</section>
				) : null}

				{graphData ? (
					<section className="relative overflow-hidden rounded-3xl border border-[#d0ddd5] bg-gradient-to-br from-white via-white to-[#f0f7f2] p-6 shadow-[0_20px_50px_-16px_rgba(6,71,34,0.1)] sm:p-10">
						<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2ECC71]/[0.04] blur-3xl" />
						<div className="relative">
							<div className="mb-8 flex items-end justify-between">
								<div>
									<p className="text-xs font-bold uppercase tracking-[1.5px] text-[#446554]">
										Visualização interativa
									</p>
									<h2 className="mt-2 text-3xl font-extrabold tracking-[-0.5px] text-[#00261a]">
										Grafo de Artigos e Termos
									</h2>
									<p className="mt-2 max-w-lg text-sm leading-relaxed text-[#556070]">
										Selecione tópicos para filtrar conexões. Arraste os nós para reorganizar o layout.
									</p>
								</div>
							</div>
							<LandingTermsGraphClient graph={graphData} />
						</div>
					</section>
				) : null}
			</main>
		</div>
	);
}
