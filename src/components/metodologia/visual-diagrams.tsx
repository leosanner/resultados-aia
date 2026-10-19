"use client";

import { motion } from "framer-motion";

import { useLocale } from "@/components/i18n/locale-provider";
import { metodologiaCopy } from "@/i18n/pages/metodologia";
import { formatNumber } from "@/i18n/locale";

import { FlowchartDiagram } from "./flowchart-diagram";
import { VennDiagram } from "./venn-diagram";

export function VisualDiagrams() {
	const locale = useLocale();
	const copy = metodologiaCopy[locale].diagrams;

	return (
		<section className="px-8 pt-24 pb-14">
			<div className="mx-auto max-w-screen-2xl">
				<motion.h2
					className="mb-12 text-center text-3xl font-bold text-[#00261a]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					{copy.title}
				</motion.h2>

				<div className="grid gap-8 lg:grid-cols-2">
					<motion.article
						className="overflow-hidden rounded-xl border border-[#d0ddd5] bg-white p-8 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)]"
						initial={{ opacity: 0, x: -24 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, x: 0 }}
					>
						<h3 className="mb-4 text-xl font-semibold text-[#00261a]">
							{copy.vennTitle}
						</h3>
						<p className="mb-6 text-sm leading-relaxed text-[#556070]">
							{copy.vennBody}
						</p>
						<div className="overflow-hidden rounded-lg border border-[#d0ddd5] bg-[#f7fbf8] p-4">
							<VennDiagram />
						</div>
						<div className="mt-4 grid grid-cols-3 gap-4 text-center">
							<div>
								<div className="font-mono text-2xl font-semibold text-[#1F6F8B]">
									{formatNumber(locale, 6393)}
								</div>
								<div className="text-xs text-[#475569]">{copy.openAlexOnly}</div>
							</div>
							<div>
								<div className="font-mono text-2xl font-semibold text-[#b88706]">
									{formatNumber(locale, 5880)}
								</div>
								<div className="text-xs text-[#475569]">{copy.intersection}</div>
							</div>
							<div>
								<div className="font-mono text-2xl font-semibold text-[#16a34a]">
									{formatNumber(locale, 4384)}
								</div>
								<div className="text-xs text-[#475569]">{copy.scopusOnly}</div>
							</div>
						</div>
					</motion.article>

					<motion.article
						className="overflow-hidden rounded-xl border border-[#d0ddd5] bg-white p-8 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)]"
						initial={{ opacity: 0, x: 24 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, x: 0 }}
					>
						<h3 className="mb-4 text-xl font-semibold text-[#00261a]">
							{copy.flowTitle}
						</h3>
						<p className="mb-6 text-sm leading-relaxed text-[#556070]">
							{copy.flowBody}
						</p>
						<FlowchartDiagram />
						<div className="mt-4 rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4">
							<p className="text-sm leading-relaxed text-[#334155]">
								<span className="font-semibold text-[#b45309]">
									{copy.searchExampleLabel}{" "}
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
