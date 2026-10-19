"use client";

import { motion } from "framer-motion";

import { useLocale } from "@/components/i18n/locale-provider";
import { metodologiaCopy } from "@/i18n/pages/metodologia";
import { formatNumber } from "@/i18n/locale";

export function VennDiagram() {
	const locale = useLocale();
	const copy = metodologiaCopy[locale].venn;

	return (
		<div className="relative h-[400px] w-full">
			<svg className="h-full w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
				<motion.circle
					animate={{ opacity: 0.58, scale: 1 }}
					cx="130"
					cy="150"
					fill="#ef4444"
					initial={{ opacity: 0, scale: 0.92 }}
					r="110"
					transform-origin="130px 150px"
					transition={{ duration: 0.45 }}
				/>
				<motion.circle
					animate={{ opacity: 0.58, scale: 1 }}
					cx="270"
					cy="150"
					fill="#10b981"
					initial={{ opacity: 0, scale: 0.92 }}
					r="110"
					transform-origin="270px 150px"
					transition={{ delay: 0.08, duration: 0.45 }}
				/>

				<motion.text
					animate={{ opacity: 1 }}
					fill="#dc2626"
					fontSize="18"
					fontWeight="700"
					initial={{ opacity: 0 }}
					textAnchor="middle"
					transition={{ delay: 0.12, duration: 0.25 }}
					x="130"
					y="30"
				>
					OpenAlex
				</motion.text>
				<motion.text
					animate={{ opacity: 1 }}
					fill="#059669"
					fontSize="18"
					fontWeight="700"
					initial={{ opacity: 0 }}
					textAnchor="middle"
					transition={{ delay: 0.16, duration: 0.25 }}
					x="270"
					y="30"
				>
					Scopus
				</motion.text>

				<text
					fill="#7f1d1d"
					fontFamily="monospace"
					fontSize="26"
					fontWeight="700"
					textAnchor="middle"
					x="70"
					y="155"
				>
					{formatNumber(locale, 6393)}
				</text>
				<text
					fill="#065f46"
					fontFamily="monospace"
					fontSize="30"
					fontWeight="700"
					textAnchor="middle"
					x="200"
					y="155"
				>
					{formatNumber(locale, 5880)}
				</text>
				<text
					fill="#14532d"
					fontFamily="monospace"
					fontSize="26"
					fontWeight="700"
					textAnchor="middle"
					x="330"
					y="155"
				>
					{formatNumber(locale, 4384)}
				</text>

				<text fill="#475569" fontSize="14" fontWeight="600" textAnchor="middle" x="200" y="280">
					{copy.total(formatNumber(locale, 16657))}
				</text>
			</svg>
		</div>
	);
}
