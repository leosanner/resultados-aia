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
		case 5:
			return "AG";
		default:
			return "OK";
	}
}

export function PipelineFlow() {
	const [activeStage, setActiveStage] = useState<number | null>(null);

	return (
		<section className="px-8 pt-24 pb-14">
			<div className="mx-auto max-w-screen-2xl">
				<motion.h2
					className="mb-4 text-center text-3xl font-bold text-[#00261a]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Pipeline de filtragem
				</motion.h2>
				<motion.p
					className="mb-12 text-center text-[#414944]"
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
							const stageValue =
								stage.id === 5 ? "483/122" : stage.output.split(" ")[0];

							return (
								<div className="flex items-center" key={stage.id}>
									<motion.button
										className={`flex w-48 flex-col items-center rounded-xl border-2 ${stage.borderClass} ${stage.bgClass} p-6 text-left shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-4px_rgba(25,28,26,0.12)] ${isActive ? "ring-2 ring-[#0C7C3C]/25" : ""}`}
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
										<h3 className="mb-2 text-center text-sm font-semibold text-[#00261a]">
											{stage.shortTitle}
										</h3>
										<div
											className={`bg-gradient-to-r ${stage.colorClass} bg-clip-text font-mono text-3xl tracking-[-0.6px] text-transparent`}
										>
											{stageValue}
										</div>
									</motion.button>

									{index < PIPELINE_STAGES.length - 1 ? (
										<div className="mx-2 text-xl text-[#d4a414]">→</div>
									) : null}
								</div>
							);
						})}
					</div>
				</div>

				<div className="md:hidden">
					<div className="mx-auto flex max-w-sm flex-col items-center gap-4">
						{PIPELINE_STAGES.map((stage, index) => {
							const stageValue =
								stage.id === 5
									? "483 rel / 122 nao rel"
									: stage.output.split(" ")[0];

							return (
								<div
									className="flex w-full flex-col items-center"
									key={stage.id}
								>
									<motion.div
										className={`flex w-full flex-col items-center rounded-xl border-2 ${stage.borderClass} ${stage.bgClass} p-6 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)]`}
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
										<h3 className="mb-2 text-center text-sm font-semibold text-[#00261a]">
											{stage.shortTitle}
										</h3>
										<div
											className={`bg-gradient-to-r ${stage.colorClass} bg-clip-text font-mono text-3xl tracking-[-0.6px] text-transparent`}
										>
											{stageValue}
										</div>
									</motion.div>
									{index < PIPELINE_STAGES.length - 1 ? (
										<div className="my-2 rotate-90 text-xl text-[#d4a414]">
											→
										</div>
									) : null}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
