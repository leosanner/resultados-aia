import { RAG_ASSISTANT_URL } from "@/lib/links";

const EXAMPLE_QUESTIONS = [
	"Quais tecnologias dão suporte à etapa de screening?",
	"Como o sensoriamento remoto é aplicado em AIA?",
	"Quais artigos abordam gêmeos digitais ambientais?",
];

export function AskAiSection() {
	return (
		<section
			aria-label="Assistente de pesquisa"
			className="relative overflow-hidden rounded-3xl bg-[#0b2c20] shadow-[0_30px_70px_-30px_rgba(6,71,34,0.5)]"
		>
			{/* Dot-grid motif, echoing the hero — kept faint */}
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 2px 2px, #beedd7 1px, transparent 0)",
					backgroundSize: "38px 38px",
				}}
			/>
			<div
				aria-hidden
				className="absolute inset-0 bg-gradient-to-br from-[#00261a] via-[#0b2c20]/60 to-transparent"
			/>

			<div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:p-16">
				{/* Pitch */}
				<div className="max-w-xl">
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
						<span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7fb79d]">
							<span className="material-symbols-outlined text-[16px] leading-none">
								forum
							</span>
							Assistente de pesquisa · Inteligência artificial
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-[#f6be28]/40 bg-[#f6be28]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f6be28]">
							<span className="material-symbols-outlined text-[14px] leading-none">
								science
							</span>
							Protótipo experimental
						</span>
					</div>

					<h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl">
						Consulte a base de artigos de AIA
					</h2>

					<div className="mt-5 h-[3px] w-16 rounded-full bg-[#f6be28]" />

					<p className="mt-5 max-w-md text-base leading-relaxed text-[#9fc4b3]">
						Formule perguntas em linguagem natural e obtenha respostas
						fundamentadas nos artigos analisados, com indicação das fontes
						consultadas.
					</p>

					<div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#88a596]">
						<span className="inline-flex items-center gap-1.5">
							<span className="material-symbols-outlined text-[18px] leading-none text-[#2ECC71]">
								menu_book
							</span>
							Respostas fundamentadas nos artigos
						</span>
						<span className="inline-flex items-center gap-1.5">
							<span className="material-symbols-outlined text-[18px] leading-none text-[#2ECC71]">
								format_quote
							</span>
							Fontes citadas
						</span>
					</div>
				</div>

				{/* Query field — the bar itself is the entry point */}
				<div className="w-full">
					<a
						href={RAG_ASSISTANT_URL}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Abrir o assistente de pesquisa AIA em nova aba"
						className="group flex items-center gap-3 rounded-2xl border border-[#2c5a47] bg-[#06231a] p-2.5 pl-5 transition-colors duration-300 hover:border-[#2ECC71]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6be28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2c20]"
					>
						<span className="min-w-0 flex-1 truncate text-[15px] text-[#6f9384]">
							Pergunte sobre tecnologias digitais aplicadas à AIA
						</span>
						<span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#f6be28] px-5 py-3 text-sm font-bold text-[#3f2e07] transition-shadow duration-300 group-hover:shadow-[0_10px_24px_-12px_rgba(246,190,40,0.7)]">
							Consultar
							<span
								aria-hidden
								className="material-symbols-outlined text-[20px] leading-none transition-transform duration-300 group-hover:translate-x-0.5"
							>
								arrow_outward
							</span>
						</span>
					</a>

					<div className="mt-5">
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f8473]">
							Exemplos de perguntas
						</p>
						<div className="mt-3 flex flex-col gap-2">
							{EXAMPLE_QUESTIONS.map((question) => (
								<a
									key={question}
									href={RAG_ASSISTANT_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="group/q flex items-center gap-2.5 rounded-xl border border-[#234539] bg-[#0f3d2e]/40 px-4 py-2.5 text-sm text-[#c3dccf] transition-colors duration-200 hover:border-[#2ECC71]/50 hover:bg-[#0f3d2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6be28]"
								>
									<span
										aria-hidden
										className="material-symbols-outlined text-[18px] leading-none text-[#5f8473] transition-colors group-hover/q:text-[#2ECC71]"
									>
										help
									</span>
									<span className="min-w-0 flex-1">{question}</span>
									<span
										aria-hidden
										className="material-symbols-outlined text-[16px] leading-none text-[#3f6353] opacity-0 transition-opacity group-hover/q:opacity-100"
									>
										arrow_outward
									</span>
								</a>
							))}
						</div>
					</div>

					<p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-[#5f8473]">
						<span
							aria-hidden
							className="material-symbols-outlined mt-px text-[15px] leading-none"
						>
							info
						</span>
						<span>
							Projeto em fase de protótipo experimental. As respostas podem
							conter imprecisões e devem ser verificadas nas fontes citadas.
						</span>
					</p>
				</div>
			</div>
		</section>
	);
}
