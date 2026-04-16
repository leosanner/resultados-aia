"use client";

import { motion } from "framer-motion";

type Props = {
	numeral: "I" | "II";
	label: string;
	subtitle: string;
	accent: "green" | "amber";
};

export function MacroDivider({ numeral, label, subtitle, accent }: Props) {
	const isAmber = accent === "amber";
	const accentColor = isAmber ? "#f6be28" : "#0C7C3C";
	const accentDark = isAmber ? "#8a6a0f" : "#085E2E";
	const softBg = isAmber ? "#fff8e1" : "#edf8f2";

	return (
		<section className="px-8 pt-24 pb-6">
			<motion.div
				className="mx-auto max-w-screen-2xl overflow-hidden rounded-2xl border border-[#d0ddd5]/60 bg-white"
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.55 }}
				viewport={{ margin: "-80px", once: true }}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div
					className="relative flex items-center gap-6 px-6 py-6 md:gap-10 md:px-10 md:py-8"
					style={{
						backgroundImage: `linear-gradient(to right, ${softBg}aa, rgba(255,255,255,0) 60%)`,
					}}
				>
					<motion.div
						className="flex shrink-0 items-baseline gap-3 md:gap-5"
						initial={{ opacity: 0, y: 24 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, y: 0 }}
					>
						<span
							className="hidden text-[10px] font-semibold uppercase tracking-[2.4px] md:inline"
							style={{ color: accentDark }}
						>
							Macroetapa
						</span>
						<span
							className="font-black leading-none tracking-tighter"
							style={{
								color: accentColor,
								fontSize: "clamp(3.5rem, 8vw, 6rem)",
							}}
						>
							{numeral}
						</span>
					</motion.div>

					<div className="min-w-0 flex-1">
						<div
							className="mb-1 text-[10px] font-semibold uppercase tracking-[2px] md:hidden"
							style={{ color: accentDark }}
						>
							Macroetapa {numeral}
						</div>
						<motion.h2
							className="text-xl font-bold uppercase tracking-[1.2px] text-[#00261a] md:text-3xl md:tracking-[1.8px]"
							initial={{ opacity: 0, y: 12 }}
							transition={{ delay: 0.12, duration: 0.4 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							{label}
						</motion.h2>
						<motion.p
							className="mt-2 max-w-2xl text-sm text-[#556070] md:text-base"
							initial={{ opacity: 0 }}
							transition={{ delay: 0.2, duration: 0.4 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1 }}
						>
							{subtitle}
						</motion.p>
					</div>

					<motion.div
						className="hidden h-[3px] shrink-0 rounded-full md:block"
						initial={{ width: 0 }}
						style={{ backgroundColor: accentColor }}
						transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
						viewport={{ once: true }}
						whileInView={{ width: 96 }}
					/>
				</div>
			</motion.div>
		</section>
	);
}
