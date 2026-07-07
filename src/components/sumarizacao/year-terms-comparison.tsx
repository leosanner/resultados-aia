"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { getTechColor } from "@/lib/tech-colors";
import type { YearTermRow } from "@/lib/year-terms";
import type { TecTerm } from "@/model/article";

/** Desaceleração suave (easeOutQuint-like), boa para o crescimento das barras. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Transição das barras ao entrar em tela e ao trocar o ano de corte. */
const BAR_TRANSITION = { duration: 0.55, ease: EASE };

/** Orquestra a entrada em cascata das linhas quando o gráfico entra em tela. */
const rowsContainer: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

/** Linha: sobe e revela junto com o crescimento das suas barras. */
const rowReveal: Variants = {
	hidden: { opacity: 0, y: 10 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/** Ícone (Material Symbols) por tecnologia, exibido ao lado do rótulo. */
const TERM_ICONS: Record<TecTerm, string> = {
	"Remote Sensing": "satellite_alt",
	Geoprocessing: "public",
	"Internet of Things": "sensors",
	"Data Science": "database",
	"Natural Language Processing": "translate",
	"Data Visualization": "monitoring",
	"Machine Learning": "network_intelligence",
	"Reinforcement Learning": "trophy",
	"Artificial Intelligence": "smart_toy",
	"Deep Learning": "neurology",
	"Prediction Analytics": "query_stats",
	"Digital Twins": "content_copy",
	"Digital Technologies": "devices",
	"Technological Innovation": "lightbulb",
	"Digital Transformation": "sync_alt",
	"Augmented Reality": "view_in_ar",
};

function formatCount(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

/**
 * Valor numérico que faz um fade curto sempre que muda (a `key` força o remount).
 * Usado nas contagens/percentuais para acompanharem a troca do ano de corte.
 */
function AnimatedValue({
	value,
	className,
	animate,
}: {
	value: string;
	className?: string;
	animate: boolean;
}) {
	return (
		<motion.span
			key={value}
			initial={animate ? { opacity: 0, y: 3 } : false}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: EASE }}
			className={className}
		>
			{value}
		</motion.span>
	);
}

/**
 * Reparte 100% entre os dois lados de uma linha, garantindo que a soma feche em
 * 100 (o lado direito recebe o resto do arredondamento do esquerdo).
 */
function splitPercent(before: number, after: number) {
	const total = before + after;
	if (total === 0) return { before: 0, after: 0 };
	const beforePct = Math.round((before / total) * 100);
	return { before: beforePct, after: 100 - beforePct };
}

/** Reparte as publicações de uma linha em antes (< corte) e a partir (≥ corte). */
function splitByThreshold(byYear: Record<number, number>, threshold: number) {
	let before = 0;
	let after = 0;
	for (const [year, count] of Object.entries(byYear)) {
		if (Number(year) < threshold) before += count;
		else after += count;
	}
	return { before, after };
}

/**
 * Gráfico comparativo (tipo pirâmide) de publicações por tecnologia, divergindo
 * a partir de uma linha vertical no ano de corte: à esquerda o total anterior ao
 * ano, à direita o total a partir dele. As barras usam a identidade de cor da
 * tecnologia e são escaladas pelo maior valor de qualquer lado.
 *
 * O ano de corte é ajustável pelo seletor: ao trocá-lo, apenas as larguras das
 * barras, as contagens e os percentuais mudam — a figura permanece a mesma.
 */
export function YearTermsComparison({
	rows,
	years,
	defaultThreshold,
}: {
	rows: YearTermRow[];
	years: number[];
	defaultThreshold: number;
}) {
	const reduce = useReducedMotion();
	const [threshold, setThreshold] = useState(defaultThreshold);
	const rowsRef = useRef<HTMLDivElement>(null);
	// Dispara o crescimento das barras só quando o gráfico entra em tela.
	const inView = useInView(rowsRef, { once: true, amount: 0.2 });

	// Recalcula antes/depois por linha e a maior barra para o corte selecionado.
	const { splits, maxSide } = useMemo(() => {
		const splits = new Map<TecTerm, { before: number; after: number }>();
		let maxSide = 1;
		for (const row of rows) {
			const split = splitByThreshold(row.byYear, threshold);
			splits.set(row.term, split);
			maxSide = Math.max(maxSide, split.before, split.after);
		}
		return { splits, maxSide };
	}, [rows, threshold]);

	return (
		<section
			aria-label={`Publicações por tecnologia antes e a partir de ${threshold}`}
			className="overflow-hidden rounded-3xl border border-[#d0ddd5] bg-white shadow-[0_20px_50px_-16px_rgba(6,71,34,0.1)]"
		>
			{/* Faixa de cabeçalho */}
			<div className="border-b border-[#e4ede7] bg-gradient-to-br from-white via-white to-[#f1f7f3] px-6 py-7 sm:px-10 sm:py-9">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
					<div className="max-w-2xl">
						<p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-[#446554]">
							<span
								aria-hidden
								className="material-symbols-outlined text-[16px] leading-none text-[#0a6b34]"
							>
								balance
							</span>
							Evolução temporal
						</p>
						<h2 className="mt-2 text-3xl font-bold tracking-[-0.5px] text-[#00261a]">
							Publicações por tecnologia
						</h2>
						<p className="mt-3 text-[15px] leading-relaxed text-[#446554]">
							Quantas publicações aplicam cada tecnologia digital, separadas por um
							ano de corte: à esquerda, os trabalhos anteriores; à direita, os
							publicados a partir dele. O corte padrão é{" "}
							<span className="font-semibold text-[#00261a]">2021</span> — a linha
							de base do levantamento global de Fothergill e Murphy sobre a adoção
							de tecnologias digitais na AIA. Mova o seletor para reposicionar a
							divisão e ver como cada tecnologia evolui ao redor dela.
						</p>
					</div>

					{/* Seletor do ano de corte, com estado relativo à linha de base */}
					{years.length > 0 ? (
						<div className="flex shrink-0 flex-col gap-1.5 sm:w-[184px] sm:items-end">
							<label className="flex w-full flex-col gap-1.5 text-xs font-bold uppercase tracking-[1px] text-[#446554] sm:items-end">
								Ano de corte
								<select
									value={threshold}
									onChange={(event) => setThreshold(Number(event.target.value))}
									className="w-full cursor-pointer rounded-xl border border-[#c8d6ce] bg-white px-3.5 py-2.5 text-sm font-bold tracking-normal text-[#00261a] shadow-sm transition-colors hover:border-[#0a6b34] focus-visible:border-[#0a6b34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a6b34] focus-visible:ring-offset-2"
								>
									{years.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</select>
							</label>
							<span
								className="flex items-center gap-1 text-[11px] font-medium leading-tight text-[#6b7d73] sm:justify-end sm:text-right"
								aria-live="polite"
							>
								<span
									aria-hidden
									className="material-symbols-outlined text-[13px] leading-none text-[#0a6b34]"
								>
									{threshold === defaultThreshold ? "verified" : "tune"}
								</span>
								{threshold === defaultThreshold
									? "Linha de base do estudo"
									: `Ajustado · padrão ${defaultThreshold}`}
							</span>
						</div>
					) : null}
				</div>

				{/* Referência da linha de base: fundamenta o corte padrão de 2021 */}
				<figure className="mt-6 flex items-start gap-3 rounded-2xl border border-[#dbe7e0] bg-[#f4f9f5] px-4 py-3.5 sm:px-5 sm:py-4">
					<span
						aria-hidden
						className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] leading-none text-[#0a6b34]"
					>
						auto_stories
					</span>
					<div className="min-w-0">
						<figcaption className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#0a6b34]">
							Referência
						</figcaption>
						<p className="mt-1 text-sm leading-relaxed text-[#3f5449]">
							Fothergill, J.; Murphy, J.{" "}
							<cite className="font-medium italic text-[#264b3a]">
								The state of digital impact assessment practice: a global review
								of the uptake of digital technologies and approaches within impact
								assessment practice
							</cite>
							. Fargo: International Association for Impact Assessment, 2021.
						</p>
					</div>
				</figure>
			</div>

			{/* Corpo do gráfico */}
			<div className="overflow-x-auto px-4 py-6 sm:px-8 sm:py-8">
				<div className="min-w-[560px]">
					{/* Cabeçalho de colunas */}
					<div className="grid grid-cols-[minmax(150px,220px)_56px_minmax(0,1fr)_56px] items-end gap-x-2 pb-3 sm:gap-x-3">
						<div />
						<div />
						<div className="relative flex items-end">
							<span className="flex-1 text-center text-sm font-bold text-[#446554]">
								{"< "}
								{threshold}
							</span>
							<span className="flex-1 text-center text-sm font-bold text-[#446554]">
								{"≥ "}
								{threshold}
							</span>
							<span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#00261a] px-2 py-0.5 text-xs font-bold text-white">
								{threshold}
							</span>
						</div>
						<div />
					</div>

					{/* Linhas */}
					<motion.div
						ref={rowsRef}
						className="divide-y divide-[#eef3ef]"
						variants={rowsContainer}
						initial={reduce ? false : "hidden"}
						whileInView="show"
						viewport={{ once: true, amount: 0.2 }}
					>
						{rows.map((row) => {
							const color = getTechColor(row.term);
							const { before, after } = splits.get(row.term) ?? {
								before: 0,
								after: 0,
							};
							const leftPct = (before / maxSide) * 100;
							const rightPct = (after / maxSide) * 100;
							const share = splitPercent(before, after);

							return (
								<motion.div
									key={row.term}
									variants={rowReveal}
									className="grid grid-cols-[minmax(150px,220px)_56px_minmax(0,1fr)_56px] items-center gap-x-2 py-2.5 sm:gap-x-3"
								>
									{/* Rótulo + ícone */}
									<div className="flex min-w-0 items-center gap-2">
										<span
											aria-hidden
											className="material-symbols-outlined shrink-0 text-[20px] leading-none"
											style={{ color: color.base }}
										>
											{TERM_ICONS[row.term]}
										</span>
										<span className="truncate text-sm font-semibold text-[#00261a]">
											{row.term}
										</span>
									</div>

									{/* Contagem esquerda */}
									<span
										className="flex flex-col items-end leading-tight"
										style={{ color: before > 0 ? color.text : "#9aa8a0" }}
									>
										<AnimatedValue
											animate={!reduce}
											className="text-sm font-bold tabular-nums"
											value={formatCount(before)}
										/>
										<AnimatedValue
											animate={!reduce}
											className="text-[11px] font-medium tabular-nums opacity-70"
											value={`${share.before}%`}
										/>
									</span>

									{/* Barras divergentes: a largura tween ao entrar em tela e ao trocar o ano */}
									<div className="relative flex h-6 items-center">
										{/* Metade esquerda */}
										<div className="flex flex-1 justify-end">
											<motion.div
												className="h-6 rounded-l-md"
												style={{ backgroundColor: color.base }}
												initial={reduce ? false : { width: 0 }}
												animate={{ width: `${inView ? leftPct : 0}%` }}
												transition={reduce ? { duration: 0 } : BAR_TRANSITION}
											/>
										</div>
										{/* Metade direita */}
										<div className="flex flex-1 justify-start">
											<motion.div
												className="h-6 rounded-r-md"
												style={{ backgroundColor: color.base }}
												initial={reduce ? false : { width: 0 }}
												animate={{ width: `${inView ? rightPct : 0}%` }}
												transition={reduce ? { duration: 0 } : BAR_TRANSITION}
											/>
										</div>
										{/* Linha central do ano de corte */}
										<span
											aria-hidden
											className="absolute inset-y-[-10px] left-1/2 w-px -translate-x-1/2 bg-[#00261a]/70"
										/>
									</div>

									{/* Contagem direita */}
									<span
										className="flex flex-col items-start leading-tight"
										style={{ color: after > 0 ? color.text : "#9aa8a0" }}
									>
										<AnimatedValue
											animate={!reduce}
											className="text-sm font-bold tabular-nums"
											value={formatCount(after)}
										/>
										<AnimatedValue
											animate={!reduce}
											className="text-[11px] font-medium tabular-nums opacity-70"
											value={`${share.after}%`}
										/>
									</span>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
