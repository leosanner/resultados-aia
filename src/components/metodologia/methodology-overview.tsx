"use client";

import { motion } from "framer-motion";

export function MethodologyOverview() {
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
					Visão geral do processo
				</h2>
				<p className="text-lg leading-relaxed text-[#414944]">
					O processo metodológico combinou buscas estruturadas em duas bases
					acadêmicas (Scopus e OpenAlex) com termos de tecnologia e termos
					ambientais relacionados ao contexto aplicado. A partir de um conjunto
					inicial de{" "}
					<span className="font-mono font-semibold text-[#1F6F8B]">16.657</span>{" "}
					registros, aplicamos filtros sucessivos de intersecção, impacto de
					citação (FWCI), classificação por aprendizado de máquina, fluxo de
					agentes com consenso entre três LLMs e filtragem por domínio
					específico, resultando em{" "}
					<span className="font-mono font-semibold text-[#b88706]">118</span>{" "}
					registros altamente relevantes.
				</p>
			</motion.div>
		</section>
	);
}
