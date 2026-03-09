"use client";

import { motion } from "framer-motion";
import { FlowchartDiagram } from "./flowchart-diagram";
import { VennDiagram } from "./venn-diagram";

export function VisualDiagrams() {
	return (
		<section className="border-t border-[#e2e8f0] bg-white px-6 py-16 md:py-24">
			<div className="mx-auto max-w-6xl">
				<motion.h2
					className="mb-12 text-center text-3xl tracking-[-0.8px] text-[#0f172a]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Diagramas do processo
				</motion.h2>

				<div className="grid gap-8 lg:grid-cols-2">
					<motion.article
						className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-6 shadow-[0_14px_28px_-20px_rgba(15,23,42,0.7)]"
						initial={{ opacity: 0, x: -24 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, x: 0 }}
					>
						<h3 className="mb-4 text-xl font-semibold text-[#0f172a]">
							Intersecção: Scopus vs OpenAlex
						</h3>
						<p className="mb-6 text-sm leading-relaxed text-[#475569]">
							Diagrama de Venn mostrando a intersecção entre as publicações
							encontradas nas bases Scopus e OpenAlex. O overlap de 5.880
							registros representa o conjunto consolidado para análise
							posterior.
						</p>
						<div className="overflow-hidden rounded-lg bg-white p-4">
							<VennDiagram />
						</div>
						<div className="mt-4 grid grid-cols-3 gap-4 text-center">
							<div>
								<div className="font-mono text-2xl font-semibold text-[#ef4444]">
									6.393
								</div>
								<div className="text-xs text-[#475569]">Apenas OpenAlex</div>
							</div>
							<div>
								<div className="font-mono text-2xl font-semibold text-[#059669]">
									5.880
								</div>
								<div className="text-xs text-[#475569]">Intersecção</div>
							</div>
							<div>
								<div className="font-mono text-2xl font-semibold text-[#16a34a]">
									4.384
								</div>
								<div className="text-xs text-[#475569]">Apenas Scopus</div>
							</div>
						</div>
					</motion.article>

					<motion.article
						className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-6 shadow-[0_14px_28px_-20px_rgba(15,23,42,0.7)]"
						initial={{ opacity: 0, x: 24 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, x: 0 }}
					>
						<h3 className="mb-4 text-xl font-semibold text-[#0f172a]">
							Fluxograma do pipeline
						</h3>
						<p className="mb-6 text-sm leading-relaxed text-[#475569]">
							Representação visual completa do fluxo metodológico, desde a busca
							inicial, passando pelo fluxo de agentes com três LLMs e pela
							separação entre estudos relacionados e não relacionados, até a
							filtragem final por termos específicos de AIA.
						</p>
						<FlowchartDiagram />
						<div className="mt-4 rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4">
							<p className="text-sm leading-relaxed text-[#334155]">
								<span className="font-semibold text-[#b45309]">
									String de busca (exemplo):{" "}
								</span>
								(&quot;machine learning&quot; OR &quot;IA&quot;) AND
								(&quot;eia&quot; OR &quot;environment&quot;)
							</p>
						</div>
					</motion.article>
				</div>
			</div>
		</section>
	);
}
