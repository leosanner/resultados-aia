"use client";

import { motion } from "framer-motion";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden border-b border-[#bdd6c5] bg-[linear-gradient(180deg,_#0a5e30_0%,_#0C7C3C_100%)] px-6 py-20 md:py-28">
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="mx-auto max-w-5xl"
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.55 }}
			>
				<motion.h1
					animate={{ opacity: 1, y: 0 }}
					className="mb-6 text-5xl tracking-[-1.2px] text-white md:text-6xl"
					initial={{ opacity: 0, y: 20 }}
					transition={{ delay: 0.08, duration: 0.55 }}
				>
					Metodologia
				</motion.h1>
				<motion.p
					animate={{ opacity: 1, y: 0 }}
					className="max-w-3xl text-lg leading-relaxed text-[#d7ebdd] md:text-xl"
					initial={{ opacity: 0, y: 20 }}
					transition={{ delay: 0.16, duration: 0.55 }}
				>
					Pipeline de pesquisa utilizado para transformar um conjunto massivo de
					publicações acadêmicas em uma seleção refinada e relevante para Avaliação de
					Impacto Ambiental (AIA).
				</motion.p>
			</motion.div>
		</section>
	);
}
