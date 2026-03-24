"use client";

import { motion } from "framer-motion";

const RESULT_CARDS = [
	{
		label: "Artigos após classificação",
		value: "605",
		description: "Conjunto submetido ao fluxo de agentes",
		colorClass: "from-[#f43f5e] to-[#ec4899]",
		borderClass: "border-[#fda4af]",
		bgClass: "bg-[#fff1f2]",
	},
	{
		label: "Relacionados à AIA",
		value: "483",
		description: "Consenso do agente agregador com três LLMs",
		colorClass: "from-[#22c55e] to-[#10b981]",
		borderClass: "border-[#86efac]",
		bgClass: "bg-[#ecfdf5]",
	},
	{
		label: "Não relacionados à AIA",
		value: "122",
		description: "Excluídos após avaliação de pertinência temática",
		colorClass: "from-[#ef4444] to-[#f97316]",
		borderClass: "border-[#fca5a5]",
		bgClass: "bg-[#fef2f2]",
	},
	{
		label: "Conjunto final",
		value: "118",
		description: "Refinamento final com termos ambientais específicos",
		colorClass: "from-[#0ea5e9] to-[#14b8a6]",
		borderClass: "border-[#67e8f9]",
		bgClass: "bg-[#ecfeff]",
	},
];

export function AgentRefinementSection() {
	return (
		<section className="px-8 pt-24 pb-14">
			<div className="mx-auto max-w-screen-2xl">
				<motion.h2
					className="mb-6 text-center text-3xl font-bold text-[#00261a]"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Etapa complementar de validação e refinamento
				</motion.h2>

				<motion.p
					className="mx-auto mb-10 max-w-4xl text-center text-base leading-relaxed text-[#414944]"
					initial={{ opacity: 0, y: 16 }}
					transition={{ delay: 0.08, duration: 0.45 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Após a etapa de classificação, os 605 artigos resultantes foram submetidos a
					um fluxo de agentes composto pela avaliação de três LLMs, com o objetivo de
					verificar se os estudos apresentavam relação com áreas de Avaliação de
					Impacto Ambiental. Nessa etapa, 483 artigos foram considerados relacionados,
					enquanto 122 foram classificados como não relacionados. Posteriormente,
					apenas os artigos classificados como relacionados passaram por um
					refinamento adicional com base em termos ambientais previamente utilizados
					na string de busca, resultando em um conjunto final de 118 artigos.
				</motion.p>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{RESULT_CARDS.map((card, index) => (
						<motion.article
							className={`rounded-xl border ${card.borderClass} ${card.bgClass} p-6 shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)]`}
							initial={{ opacity: 0, y: 18 }}
							key={card.label}
							transition={{ delay: index * 0.07, duration: 0.4 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							<h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.8px] text-[#64748b]">
								{card.label}
							</h3>
							<div
								className={`mb-2 bg-gradient-to-r ${card.colorClass} bg-clip-text font-mono text-4xl tracking-[-0.8px] text-transparent`}
							>
								{card.value}
							</div>
							<p className="text-sm leading-relaxed text-[#475569]">{card.description}</p>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
