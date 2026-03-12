"use client";

import { motion } from "framer-motion";

export function MethodologyOverview() {
	return (
		<section className="bg-[#f3f8f4] px-6 py-16 md:py-20">
			<motion.div
				className="mx-auto max-w-4xl rounded-2xl border border-[#cfe0d6] bg-white p-6 shadow-[0px_14px_28px_-24px_rgba(17,24,39,0.6)] md:p-8"
				initial={{ opacity: 0, y: 24 }}
				transition={{ duration: 0.55 }}
				viewport={{ margin: "-80px", once: true }}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<h2 className="mb-8 text-3xl tracking-[-0.8px] text-[#1f2937]">
					Visão geral do processo
				</h2>
				<p className="text-lg leading-relaxed text-[#334155]">
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
