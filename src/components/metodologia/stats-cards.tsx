"use client";

import { motion } from "framer-motion";

import { useLocale } from "@/components/i18n/locale-provider";
import { metodologiaCopy } from "@/i18n/pages/metodologia";

const STAT_STYLES = [
	{
		colorClass: "from-[#3b82f6] to-[#06b6d4]",
		icon: "↓",
	},
	{
		colorClass: "from-[#8b5cf6] to-[#a855f7]",
		icon: "◎",
	},
	{
		colorClass: "from-[#10b981] to-[#22c55e]",
		icon: "✓",
	},
];

export function StatsCards() {
	const copy = metodologiaCopy[useLocale()].stats;

	return (
		<section className="border-t border-[#e2e8f0] bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-6 py-16 md:py-24">
			<div className="mx-auto max-w-6xl">
				<motion.h2
					className="mb-12 text-center text-3xl tracking-[-0.8px] text-[#0f172a]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					{copy.title}
				</motion.h2>

				<div className="grid gap-6 md:grid-cols-3">
					{STAT_STYLES.map((stat, index) => {
						const text = copy.cards[index];
						return (
							<motion.article
								className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-[0_14px_28px_-20px_rgba(15,23,42,0.75)] transition-all hover:border-[#cbd5e1] hover:shadow-[0_18px_32px_-20px_rgba(15,23,42,0.85)]"
								initial={{ opacity: 0, y: 20 }}
								key={text.label}
								transition={{ delay: index * 0.08, duration: 0.4 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, y: 0 }}
							>
								<div
									className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${stat.colorClass} px-3 py-1.5 text-xl text-white shadow-md`}
								>
									{stat.icon}
								</div>
								<h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.8px] text-[#64748b]">
									{text.label}
								</h3>
								<div
									className={`mb-2 bg-gradient-to-r ${stat.colorClass} bg-clip-text text-4xl tracking-[-0.8px] text-transparent`}
								>
									{text.value}
								</div>
								<p className="text-sm text-[#475569]">{text.description}</p>
							</motion.article>
						);
					})}
				</div>

				<motion.div
					className="mt-12 rounded-xl border border-[#bbf7d0] bg-[#ecfdf5] p-8 text-center shadow-[0_14px_28px_-20px_rgba(15,23,42,0.65)]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ delay: 0.25, duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					<h3 className="mb-4 text-2xl font-semibold text-[#0f172a]">{copy.finalTitle}</h3>
					<div className="mb-2 font-mono text-6xl tracking-[-1px] text-[#059669]">118</div>
					<p className="text-lg text-[#334155]">
						{copy.finalBody}
					</p>
				</motion.div>

				<motion.div
					className="mt-12 text-center"
					initial={{ opacity: 0 }}
					transition={{ delay: 0.35, duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1 }}
				>
					<p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#475569]">
						{copy.note}
					</p>
				</motion.div>
			</div>
		</section>
	);
}
