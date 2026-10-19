import Link from "next/link";
import { getLocale } from "@/i18n/get-locale";
import { sumarizacaoCopy } from "@/i18n/pages/sumarizacao";
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

export async function KddBoard({
	stages,
	rows,
}: {
	stages: KddStageHeader[];
	rows: KddTechRow[];
}) {
	const copy = sumarizacaoCopy[await getLocale()].kdd;
	// Cabeçalho ocupa a linha 1, tecnologias ocupam `rowIndex + 2`; a faixa de
	// governança vem logo abaixo da última barra.
	const lastTechRow = rows.reduce((max, row) => Math.max(max, row.rowIndex), 0);
	const governanceRow = lastTechRow + 3;

	return (
		<section
			aria-label={copy.aria}
			className="overflow-hidden rounded-3xl border border-[#d0ddd5] bg-white shadow-[0_20px_50px_-16px_rgba(6,71,34,0.1)]"
		>
			{/* Faixa de cabeçalho: rótulo da seção */}
			<div className="border-b border-[#e4ede7] bg-gradient-to-br from-white via-white to-[#f1f7f3] px-6 py-7 sm:px-10 sm:py-9">
				<div className="max-w-2xl">
					<p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-[#446554]">
						<span
							aria-hidden
							className="material-symbols-outlined text-[16px] leading-none text-[#0a6b34]"
						>
							schema
						</span>
						{copy.kicker}
					</p>
					<h2 className="mt-2 text-3xl font-bold tracking-[-0.5px] text-[#00261a]">
						{copy.title}
					</h2>
					<p className="mt-2 text-[#446554]">{copy.body}</p>
				</div>
			</div>

			{/* Tela do diagrama: superfície tipo papel-milimetrado para as barras */}
			<div className="px-6 py-7 sm:px-10 sm:py-9">
				<div
					className="rounded-2xl border border-[#dde7e0] bg-[#fbfdfb]"
					style={{
						backgroundImage:
							"radial-gradient(circle, rgba(10,107,52,0.07) 1px, transparent 1.4px)",
						backgroundSize: "24px 24px",
					}}
				>
					{/* Trilho com scroll horizontal no mobile, preservando as 6 colunas */}
					<div className="overflow-x-auto p-5 sm:p-7">
						<div
							className="grid min-w-[1120px] items-stretch gap-x-6 gap-y-5"
							style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
						>
							{/* Cabeçalho das etapas, com seta de fluxo entre colunas */}
							{stages.map((stage, index) => (
								<div
									key={stage.stage}
									tabIndex={0}
									role="button"
									aria-label={`${stage.label}: ${copy.stages[stage.stage]}`}
									className="group relative mb-1 flex min-h-[60px] cursor-help items-center justify-center gap-2 rounded-[3px] border-[1.5px] border-[#b9cdc1] bg-white px-3 py-3 text-center transition-colors hover:border-[#0a6b34] focus-visible:border-[#0a6b34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a6b34] focus-visible:ring-offset-2"
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
											className="material-symbols-outlined absolute -right-[22px] top-1/2 z-10 -translate-y-1/2 text-[20px] leading-none text-[#9bc9af]"
										>
											chevron_right
										</span>
									) : null}

									{/* Tooltip: explicação da etapa (aparece abaixo, no hover/foco) */}
									<span
										role="tooltip"
										className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-30 w-52 -translate-x-1/2 rounded-xl bg-[#00261a] px-3.5 py-2.5 text-left text-xs font-medium leading-relaxed text-white opacity-0 shadow-[0_16px_36px_-12px_rgba(6,71,34,0.5)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
									>
										<span
											aria-hidden
											className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-[#00261a] bg-[#00261a]"
										/>
										{copy.stages[stage.stage]}
									</span>
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
										}}
										className="group flex flex-col items-start gap-1 rounded-[3px] border-[1.5px] px-4 py-3 text-left transition duration-200 hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a6b34] focus-visible:ring-offset-2"
									>
										<span className="text-sm font-bold leading-snug text-[#191c1a] group-hover:underline">
											{row.term}
										</span>
										<span className="text-xs font-semibold text-[#5b675f]">
											{copy.articles(row.count)}
										</span>
									</Link>
								));
							})}

							{/* Camada de fundação que sustenta todas as etapas */}
							<div
								className="flex items-center justify-center gap-2 rounded-[3px] border-[1.5px] border-[#e0ab1f] bg-[#f6be28] px-4 py-3.5 text-center"
								style={{ gridColumn: "1 / -1", gridRow: governanceRow }}
							>
								<span className="material-symbols-outlined text-[20px] leading-none text-[#3f2e07]">
									account_balance
								</span>
								<span className="text-sm font-bold tracking-[0.2px] text-[#3f2e07]">
									{copy.governance}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
