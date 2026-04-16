"use client";

import { motion } from "framer-motion";

export function TriagemManual() {
	return (
		<section className="px-8 pt-16 pb-8">
			<motion.div
				className="mx-auto max-w-screen-2xl rounded-xl border border-[#d0ddd5] bg-white p-8 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)] md:p-12"
				initial={{ opacity: 0, y: 24 }}
				transition={{ duration: 0.55 }}
				viewport={{ margin: "-80px", once: true }}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className="grid items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-12">
					<div className="text-center md:text-right">
						<div className="font-mono text-6xl font-bold leading-none tracking-tighter text-[#0C7C3C] md:text-7xl">
							118
						</div>
						<div className="mt-3 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#64748b]">
							Conjunto final da Macroetapa I
						</div>
					</div>

					<div className="flex flex-col items-center gap-3">
						<div className="hidden md:block">
							<motion.svg
								fill="none"
								height="28"
								initial={{ opacity: 0 }}
								transition={{ delay: 0.3, duration: 0.4 }}
								viewBox="0 0 160 28"
								viewport={{ once: true }}
								whileInView={{ opacity: 1 }}
								width="160"
							>
								<motion.path
									d="M4 14 L144 14"
									initial={{ pathLength: 0 }}
									stroke="#f6be28"
									strokeLinecap="round"
									strokeWidth="2"
									transition={{ delay: 0.25, duration: 0.8, ease: "easeInOut" }}
									viewport={{ once: true }}
									whileInView={{ pathLength: 1 }}
								/>
								<motion.path
									d="M136 6 L152 14 L136 22"
									fill="none"
									initial={{ opacity: 0 }}
									stroke="#f6be28"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									transition={{ delay: 0.9, duration: 0.3 }}
									viewport={{ once: true }}
									whileInView={{ opacity: 1 }}
								/>
							</motion.svg>
						</div>
						<div className="md:hidden">
							<span className="text-3xl text-[#f6be28]">↓</span>
						</div>
						<span className="rounded-full border border-[#f6be28]/50 bg-[#fff8e1] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[1.6px] text-[#8a6a0f]">
							Triagem manual
						</span>
					</div>

					<div className="text-center md:text-left">
						<div className="font-mono text-6xl font-bold leading-none tracking-tighter text-[#b88706] md:text-7xl">
							31
						</div>
						<div className="mt-3 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#64748b]">
							Selecionados para síntese
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
