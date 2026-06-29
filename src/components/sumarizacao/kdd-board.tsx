import Link from "next/link";
import type { KddStageHeader, KddTechRow } from "@/lib/kdd-board";
import { getTechColor } from "@/lib/tech-colors";

/** Ícone (Material Symbols) por etapa do fluxo KDD, exibido no cabeçalho. */
const STAGE_ICONS: Record<string, string> = {
	selection: "search",
	preprocessing: "cleaning_services",
	transformation: "tune",
	data_mining: "manage_search",
	interpretation_evaluation: "insights",
	knowledge: "lightbulb",
};

function formatTotal(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

export function KddBoard({
	stages,
	rows,
}: {
	stages: KddStageHeader[];
	rows: KddTechRow[];
}) {
	// Cabeçalho ocupa a linha 1, tecnologias ocupam `rowIndex + 2`; a faixa de
	// governança vem logo abaixo da última barra.
	const lastTechRow = rows.reduce((max, row) => Math.max(max, row.rowIndex), 0);
	const governanceRow = lastTechRow + 3;

	return (
		<section aria-label="Tecnologias por etapa do fluxo KDD">
			<div className="mb-8 max-w-2xl">
				<p className="text-xs font-bold uppercase tracking-[1.5px] text-[#446554]">
					Síntese dos resultados
				</p>
				<h2 className="mt-2 text-3xl font-bold tracking-[-0.5px] text-[#00261a]">
					Tecnologias no fluxo KDD
				</h2>
				<p className="mt-2 text-[#446554]">
					Distribuição das tecnologias digitais ao longo das etapas do processo de
					Knowledge Discovery in Databases (KDD). Uma barra que cruza etapas indica
					que a tecnologia atua de forma contínua nessas fases; o número é a
					quantidade de artigos que a aplicam no contexto de AIA.
				</p>
			</div>

			{/* Trilho com scroll horizontal no mobile, preservando as 6 colunas */}
			<div className="-mx-8 overflow-x-auto px-8 pb-2">
				<div
					className="grid min-w-[1100px] items-stretch gap-x-4 gap-y-3"
					style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
				>
					{/* Cabeçalho das etapas, com seta de fluxo entre colunas */}
					{stages.map((stage, index) => (
						<div
							key={stage.stage}
							className="relative mb-1 flex min-h-[60px] items-center justify-center gap-2 rounded-xl border border-[#cfe0d6] bg-white px-3 py-3 text-center shadow-[0_10px_24px_-20px_rgba(25,28,26,0.5)]"
							style={{ gridColumn: index + 1, gridRow: 1 }}
						>
							<span className="material-symbols-outlined text-[20px] leading-none text-[#0a6b34]">
								{STAGE_ICONS[stage.stage] ?? "category"}
							</span>
							<span className="text-sm font-bold text-[#00261a]">
								{stage.label}
							</span>
							{index < stages.length - 1 ? (
								<span
									aria-hidden
									className="material-symbols-outlined absolute -right-[18px] top-1/2 z-10 -translate-y-1/2 text-[20px] leading-none text-[#9bc9af]"
								>
									chevron_right
								</span>
							) : null}
						</div>
					))}

					{/* Uma linha por tecnologia; segmentos contíguos viram barras */}
					{rows.map((row) => {
						const color = getTechColor(row.term);
						return row.segments.map((segment) => (
							<Link
								key={`${row.term}-${segment.startIndex}`}
								href={`/tecnologias/${row.slug}/artigos`}
								style={{
									gridColumn: `${segment.startIndex + 1} / span ${segment.span}`,
									gridRow: row.rowIndex + 2,
									backgroundColor: color.tint,
									borderColor: color.base,
									color: color.text,
								}}
								className="group flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-xl border px-4 py-3 text-left shadow-[0_16px_30px_-26px_rgba(25,28,26,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-18px_rgba(25,28,26,0.45)]"
							>
								<span className="flex items-baseline gap-2">
									<span
										aria-hidden
										className="h-2 w-2 translate-y-[-1px] shrink-0 rounded-full"
										style={{ backgroundColor: color.base }}
									/>
									<span className="text-sm font-bold leading-snug">
										{row.term}
									</span>
								</span>
								<span className="text-xs font-semibold opacity-75">
									{formatTotal(row.count)}{" "}
									{row.count === 1 ? "artigo" : "artigos"}
								</span>
							</Link>
						));
					})}

					{/* Camada de fundação que sustenta todas as etapas */}
					<div
						className="flex items-center justify-center gap-2 rounded-xl border border-[#e0ab1f] bg-[#f6be28] px-4 py-3.5 text-center shadow-[0_16px_30px_-24px_rgba(63,46,7,0.55)]"
						style={{ gridColumn: "1 / -1", gridRow: governanceRow }}
					>
						<span className="material-symbols-outlined text-[20px] leading-none text-[#3f2e07]">
							account_balance
						</span>
						<span className="text-sm font-bold tracking-[0.2px] text-[#3f2e07]">
							Governança de dados
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
