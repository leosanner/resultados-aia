"use client";

import { motion } from "framer-motion";

function AnimatedDotGrid() {
	return (
		<div className="absolute inset-0 overflow-hidden">
			<div
				className="absolute inset-0 opacity-15"
				style={{
					backgroundImage:
						"radial-gradient(circle at 2px 2px, #beedd7 1px, transparent 0)",
					backgroundSize: "40px 40px",
				}}
			/>
			<motion.div
				className="absolute -inset-[50%] opacity-25"
				style={{
					background:
						"radial-gradient(ellipse 600px 400px at center, #2ECC71, transparent 70%)",
				}}
				animate={{
					x: ["0%", "40%", "10%", "0%"],
					y: ["0%", "20%", "-15%", "0%"],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}

function AccentBar() {
	return (
		<motion.div
			className="h-[3px] rounded-full bg-[#f6be28]"
			initial={{ width: 0 }}
			animate={{ width: 80 }}
			transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
		/>
	);
}

export function HeroSection() {
	return (
		<section className="relative flex min-h-[460px] items-center overflow-hidden bg-[#0f3d2e]">
			<AnimatedDotGrid />

			<div className="absolute inset-0 bg-gradient-to-br from-[#00261a] via-[#0f3d2e]/80 to-transparent" />

			<div className="relative z-10 mx-auto w-full max-w-screen-2xl px-8 py-20">
				<div className="max-w-3xl">
					<motion.h1
						className="text-5xl font-black leading-tight tracking-tighter text-white md:text-7xl"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						Metodologia
					</motion.h1>

					<motion.div
						className="mt-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.45, duration: 0.5 }}
					>
						<AccentBar />
					</motion.div>

					<motion.p
						className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-[#7ba894] md:text-xl"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
					>
						Pipeline em duas macroetapas: filtragem científica de um corpus massivo
						para um conjunto refinado, seguida de síntese estruturada do conteúdo com
						agente de IA supervisionado.
					</motion.p>

					<motion.div
						className="mt-8 flex flex-wrap gap-3"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
					>
						<span className="rounded-full border border-[#2ECC71]/40 bg-[#0C7C3C]/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#beedd7]">
							I · Filtragem Científica
						</span>
						<span className="rounded-full border border-[#f6be28]/50 bg-[#f6be28]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#f6be28]">
							II · Síntese Assistida por IA
						</span>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
