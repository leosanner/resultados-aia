"use client";

import { motion } from "framer-motion";

import { useLocale } from "@/components/i18n/locale-provider";
import { metodologiaCopy } from "@/i18n/pages/metodologia";
import { formatNumber } from "@/i18n/locale";

export function MethodologyOverview() {
	const locale = useLocale();
	const copy = metodologiaCopy[locale].overview;

	return (
		<section className="px-8 pt-24 pb-14">
			<motion.div
				className="mx-auto max-w-screen-2xl rounded-xl border border-[#d0ddd5] bg-white p-8 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)]"
				initial={{ opacity: 0, y: 24 }}
				transition={{ duration: 0.55 }}
				viewport={{ margin: "-80px", once: true }}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<h2 className="mb-8 text-3xl font-bold text-[#00261a]">
					{copy.title}
				</h2>
				<p className="text-lg leading-relaxed text-[#414944]">
					{copy.lead}{" "}
					<span className="font-mono font-semibold text-[#1F6F8B]">
						{formatNumber(locale, 16657)}
					</span>{" "}
					{copy.mid}{" "}
					<span className="font-mono font-semibold text-[#b88706]">
						{formatNumber(locale, 118)}
					</span>{" "}
					{copy.tail}
				</p>
			</motion.div>
		</section>
	);
}
