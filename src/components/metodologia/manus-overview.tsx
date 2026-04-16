"use client";

import { motion } from "framer-motion";

const MICRO_METRICS = [
	{ value: "31", label: "Artigos selecionados" },
	{ value: "5", label: "Categorias temáticas" },
	{ value: "5", label: "Fases no fluxo" },
];

export function ManusOverview() {
	return (
		<section className="px-8 pt-14 pb-8">
			<motion.div
				className="mx-auto max-w-screen-2xl rounded-xl border border-[#d0ddd5] bg-white p-8 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)] md:p-12"
				initial={{ opacity: 0, y: 24 }}
				transition={{ duration: 0.55 }}
				viewport={{ margin: "-80px", once: true }}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className="grid gap-10 md:grid-cols-[2fr_1fr] md:gap-14">
					<div>
						<div className="mb-3 text-[10px] font-semibold uppercase tracking-[1.6px] text-[#8a6a0f]">
							Plataforma Manus · MANUS, 2026
						</div>
						<h2 className="mb-5 text-3xl font-bold text-[#00261a] md:text-4xl">
							Síntese assistida pela plataforma Manus
						</h2>
						<p className="mb-4 text-lg leading-relaxed text-[#414944]">
							A segunda macroetapa caracterizou-se pela utilização da plataforma{" "}
							<span className="font-semibold text-[#00261a]">Manus</span>, um
							agente de Inteligência Artificial autônomo, para a extração,
							processamento e sumarização dos dados contidos nos{" "}
							<span className="font-mono font-semibold text-[#b88706]">31</span>{" "}
							artigos selecionados.
						</p>
						<p className="text-base leading-relaxed text-[#556070]">
							É importante ressaltar que a adoção desta ferramenta{" "}
							<span className="font-semibold text-[#00261a]">
								não ocorreu de forma passiva nem não supervisionada
							</span>{" "}
							— frequentemente caracterizada por comandos genéricos ou prompts
							não estruturados. Pelo contrário, a interação com a IA foi
							conduzida por meio de uma cadeia de ações{" "}
							<span className="italic">deliberadas, estruturadas e parametrizadas</span>
							, descritas nas cinco fases abaixo.
						</p>
					</div>

					<div className="flex flex-col justify-center gap-5 md:border-l md:border-[#d0ddd5] md:pl-10">
						{MICRO_METRICS.map((m, index) => (
							<motion.div
								className="flex items-baseline gap-4"
								initial={{ opacity: 0, x: 12 }}
								key={m.label}
								transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, x: 0 }}
							>
								<span className="font-mono text-4xl font-bold leading-none tracking-tighter text-[#0C7C3C]">
									{m.value}
								</span>
								<span className="text-sm leading-tight text-[#556070]">
									{m.label}
								</span>
							</motion.div>
						))}
					</div>
				</div>
			</motion.div>
		</section>
	);
}
