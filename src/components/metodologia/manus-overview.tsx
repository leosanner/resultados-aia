"use client";

import { motion } from "framer-motion";

import { useLocale } from "@/components/i18n/locale-provider";
import { metodologiaCopy } from "@/i18n/pages/metodologia";
import { formatNumber } from "@/i18n/locale";

const METRIC_VALUES = ["31", "5", "5"];

export function ManusOverview() {
	const locale = useLocale();
	const copy = metodologiaCopy[locale].manus;

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
							{copy.kicker}
						</div>
						<h2 className="mb-5 text-3xl font-bold text-[#00261a] md:text-4xl">
							{copy.title}
						</h2>
						<p className="mb-4 text-lg leading-relaxed text-[#414944]">
							{copy.p1Before}{" "}
							<span className="font-semibold text-[#00261a]">Manus</span>{copy.p1Middle}{" "}
							<span className="font-mono font-semibold text-[#b88706]">
								{formatNumber(locale, 31)}
							</span>{" "}
							{copy.p1After}
						</p>
						<p className="text-base leading-relaxed text-[#556070]">
							{copy.p2Before}{" "}
							<span className="font-semibold text-[#00261a]">
								{copy.p2Strong}
							</span>{" "}
							{copy.p2Mid}{" "}
							<span className="italic">{copy.p2Italic}</span>{copy.p2After}
						</p>
					</div>

					<div className="flex flex-col justify-center gap-5 md:border-l md:border-[#d0ddd5] md:pl-10">
						{METRIC_VALUES.map((value, index) => (
							<motion.div
								className="flex items-baseline gap-4"
								initial={{ opacity: 0, x: 12 }}
								key={copy.metrics[index]}
								transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, x: 0 }}
							>
								<span className="font-mono text-4xl font-bold leading-none tracking-tighter text-[#0C7C3C]">
									{value}
								</span>
								<span className="text-sm leading-tight text-[#556070]">
									{copy.metrics[index]}
								</span>
							</motion.div>
						))}
					</div>
				</div>
			</motion.div>
		</section>
	);
}
