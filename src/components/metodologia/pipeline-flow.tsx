"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PIPELINE_STAGES } from "./data";

function iconLabel(id: number) {
	switch (id) {
		case 1:
			return "DB";
		case 2:
			return "IX";
		case 3:
			return "FW";
		case 4:
			return "ML";
		default:
			return "OK";
	}
}

export function PipelineFlow() {
	const [activeStage, setActiveStage] = useState<number | null>(null);

	return (
		<section className="bg-[#f8fafc] px-6 py-16 md:py-24">
			<div className="mx-auto max-w-7xl">
				<motion.h2
					className="mb-4 text-center text-3xl tracking-[-0.8px] text-[#0f172a]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Pipeline de filtragem
				</motion.h2>
				<motion.p
					className="mb-12 text-center text-[#475569]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ delay: 0.08, duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Processo de redução progressiva de 16.657 para 118 registros
				</motion.p>

				<div className="hidden md:block">
					<div className="flex items-center justify-center gap-4">
						{PIPELINE_STAGES.map((stage, index) => {
							const isActive = activeStage === stage.id;

							return (
								<div className="flex items-center" key={stage.id}>
									<motion.button
										className={`flex w-48 flex-col items-center rounded-xl border-2 ${stage.borderClass} ${stage.bgClass} p-6 text-left shadow-[0_10px_25px_-18px_rgba(15,23,42,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(15,23,42,0.7)] ${isActive ? "ring-2 ring-[#0f172a]/15" : ""}`}
										initial={{ opacity: 0, scale: 0.9 }}
										onMouseLeave={() => setActiveStage(null)}
										onMouseMove={() => setActiveStage(stage.id)}
										transition={{ delay: index * 0.08, duration: 0.35 }}
										type="button"
										viewport={{ once: true }}
										whileInView={{ opacity: 1, scale: 1 }}
									>
										<div
											className={`mb-3 rounded-lg bg-gradient-to-br ${stage.colorClass} px-3 py-2 font-mono text-sm font-bold text-white shadow-md`}
										>
											{iconLabel(stage.id)}
										</div>
										<h3 className="mb-2 text-center text-sm font-semibold text-[#0f172a]">
											{stage.shortTitle}
										</h3>
										<div
											className={`bg-gradient-to-r ${stage.colorClass} bg-clip-text font-mono text-3xl tracking-[-0.6px] text-transparent`}
										>
											{stage.output.split(" ")[0]}
										</div>
									</motion.button>

									{index < PIPELINE_STAGES.length - 1 ? (
										<div className="mx-2 text-xl text-[#94a3b8]">→</div>
									) : null}
								</div>
							);
						})}
					</div>
				</div>

				<div className="md:hidden">
					<div className="mx-auto flex max-w-sm flex-col items-center gap-4">
						{PIPELINE_STAGES.map((stage, index) => (
							<div className="flex w-full flex-col items-center" key={stage.id}>
								<motion.div
									className={`flex w-full flex-col items-center rounded-xl border-2 ${stage.borderClass} ${stage.bgClass} p-6 shadow-[0_10px_25px_-18px_rgba(15,23,42,0.55)]`}
									initial={{ opacity: 0, y: 20 }}
									transition={{ delay: index * 0.08, duration: 0.35 }}
									viewport={{ once: true }}
									whileInView={{ opacity: 1, y: 0 }}
								>
									<div
										className={`mb-3 rounded-lg bg-gradient-to-br ${stage.colorClass} px-3 py-2 font-mono text-sm font-bold text-white`}
									>
										{iconLabel(stage.id)}
									</div>
									<h3 className="mb-2 text-center text-sm font-semibold text-[#0f172a]">
										{stage.shortTitle}
									</h3>
									<div
										className={`bg-gradient-to-r ${stage.colorClass} bg-clip-text font-mono text-3xl tracking-[-0.6px] text-transparent`}
									>
										{stage.output.split(" ")[0]}
									</div>
								</motion.div>
								{index < PIPELINE_STAGES.length - 1 ? (
									<div className="my-2 rotate-90 text-xl text-[#94a3b8]">→</div>
								) : null}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
