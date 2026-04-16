"use client";

import { motion } from "framer-motion";
import { MANUS_PHASES } from "./manus-data";

export function ManusTimeline() {
	return (
		<section className="px-8 pt-10 pb-8">
			<div className="mx-auto max-w-screen-2xl">
				<motion.h2
					className="mb-4 text-center text-3xl font-bold text-[#00261a] md:text-4xl"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Cadeia de ações na plataforma Manus
				</motion.h2>
				<motion.p
					className="mx-auto mb-14 max-w-3xl text-center text-[#414944]"
					initial={{ opacity: 0, y: 16 }}
					transition={{ delay: 0.08, duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Cinco fases sequenciais que estruturaram a extração, o enriquecimento e
					a consolidação dos dados dos 31 artigos.
				</motion.p>

				<div className="relative mx-auto max-w-4xl">
					<div
						aria-hidden="true"
						className="absolute top-6 bottom-6 left-6 w-[2px] bg-gradient-to-b from-[#f6be28]/50 via-[#f6be28]/30 to-[#0C7C3C]/30 md:left-12"
					/>

					<ol className="space-y-8 md:space-y-10">
						{MANUS_PHASES.map((phase, index) => (
							<motion.li
								className="relative grid grid-cols-[48px_1fr] gap-5 md:grid-cols-[96px_1fr] md:gap-8"
								initial={{ opacity: 0, y: 24 }}
								key={phase.id}
								transition={{ delay: index * 0.08, duration: 0.5 }}
								viewport={{ margin: "-60px", once: true }}
								whileInView={{ opacity: 1, y: 0 }}
							>
								<div className="flex flex-col items-center">
									<div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#0C7C3C] font-black text-white shadow-[0_8px_24px_-4px_rgba(12,124,60,0.45)] ring-4 ring-[#f7faf5]">
										{phase.id}
									</div>
									<div className="mt-2 rounded-md bg-[#00261a] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[1.2px] text-[#f6be28]">
										{phase.code}
									</div>
								</div>

								<article className="rounded-xl border border-[#d0ddd5] bg-white p-6 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)] md:p-8">
									<h3 className="mb-1 text-xl font-semibold text-[#00261a] md:text-2xl">
										{phase.title}
									</h3>
									<p className="mb-5 text-sm font-medium text-[#556070]">
										{phase.subtitle}
									</p>

									<p className="mb-6 leading-relaxed text-[#414944]">
										{phase.summary}
									</p>

									{phase.parameters.length > 0 ? (
										<div className="mb-5">
											<div className="mb-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#64748b]">
												{phase.parametersLabel}
											</div>
											<div className="flex flex-wrap gap-2">
												{phase.parameters.map((param) => (
													<span
														className="rounded-md border border-[#f6be28]/50 bg-[#fff8e1] px-3 py-1 font-mono text-xs text-[#8a6a0f]"
														key={param}
													>
														{param}
													</span>
												))}
											</div>
										</div>
									) : null}

									{phase.extras ? (
										<div className="mt-5 rounded-lg border border-[#d0ddd5] bg-[#f7faf5] p-5">
											<div className="mb-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#0C7C3C]">
												{phase.extras.heading}
											</div>
											<ul className="grid gap-2 sm:grid-cols-2">
												{phase.extras.items.map((item) => (
													<li
														className="flex items-start gap-2.5 text-sm text-[#414944]"
														key={item}
													>
														<span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0C7C3C]" />
														<span>{item}</span>
													</li>
												))}
											</ul>
										</div>
									) : null}

									{phase.output ? (
										<div className="mt-5 flex items-center gap-3 rounded-lg border border-[#86efac] bg-[#ecfdf5] px-4 py-3">
											<span className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#047857]">
												Output
											</span>
											<span className="font-mono text-sm font-semibold text-[#065f46]">
												{phase.output}
											</span>
										</div>
									) : null}
								</article>
							</motion.li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
