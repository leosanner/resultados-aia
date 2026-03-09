"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PIPELINE_STAGES } from "./data";

function stageIcon(id: number) {
	switch (id) {
		case 1:
			return "DB";
		case 2:
			return "IX";
		case 3:
			return "FW";
		case 4:
			return "ML";
		case 5:
			return "AG";
		default:
			return "OK";
	}
}

export function StageDetails() {
	const [expandedStage, setExpandedStage] = useState<number | null>(null);

	return (
		<section className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-16 md:py-24">
			<div className="mx-auto max-w-5xl">
				<motion.h2
					className="mb-12 text-center text-3xl tracking-[-0.8px] text-[#0f172a]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Detalhamento das etapas
				</motion.h2>

				<div className="space-y-4">
					{PIPELINE_STAGES.map((stage) => {
						const expanded = expandedStage === stage.id;
						return (
							<motion.article
								className={`overflow-hidden rounded-xl border ${stage.borderClass} ${stage.bgClass} shadow-[0_12px_26px_-20px_rgba(15,23,42,0.75)]`}
								initial={{ opacity: 0, y: 20 }}
								key={stage.id}
								transition={{ delay: stage.id * 0.05, duration: 0.35 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, y: 0 }}
							>
								<button
									className="w-full px-6 py-5 text-left transition-colors hover:bg-white/50"
									onClick={() => setExpandedStage(expanded ? null : stage.id)}
									type="button"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex flex-1 items-start gap-4">
											<div
												className={`rounded-lg bg-gradient-to-br ${stage.colorClass} px-3 py-2 font-mono text-sm font-bold text-white shadow-md`}
											>
												{stageIcon(stage.id)}
											</div>
											<div className="flex-1">
												<h3 className="mb-1 text-xl font-semibold text-[#0f172a]">{stage.title}</h3>
												<p className="mb-3 text-sm text-[#475569]">{stage.subtitle}</p>
												<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
													{stage.input ? (
														<div>
															<span className="text-[#64748b]">Entrada: </span>
															<span className="font-mono text-[#334155]">{stage.input}</span>
														</div>
													) : null}
													<div>
														<span className="text-[#64748b]">Saída: </span>
														<span className="font-mono font-semibold text-[#059669]">
															{stage.output}
														</span>
													</div>
												</div>
											</div>
										</div>
										<motion.div
											animate={{ rotate: expanded ? 180 : 0 }}
											className="mt-1 text-lg text-[#64748b]"
											transition={{ duration: 0.2 }}
										>
											▾
										</motion.div>
									</div>
								</button>

								{expanded ? (
									<div className="border-t border-[#e2e8f0] bg-white px-6 py-6">
										<div className="space-y-6">
											<div>
												<h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.8px] text-[#64748b]">
													O que foi feito
												</h4>
												<p className="leading-relaxed text-[#334155]">{stage.what}</p>
											</div>
											<div>
												<h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.8px] text-[#64748b]">
													Por que foi feito
												</h4>
												<p className="leading-relaxed text-[#334155]">{stage.why}</p>
											</div>
											<div>
												<h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.8px] text-[#64748b]">
													Critérios de filtragem
												</h4>
												<ul className="space-y-2">
													{stage.criteria.map((item) => (
														<li className="flex items-start gap-3" key={item}>
															<span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#94a3b8]" />
															<span className="text-[#334155]">{item}</span>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								) : null}
							</motion.article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
