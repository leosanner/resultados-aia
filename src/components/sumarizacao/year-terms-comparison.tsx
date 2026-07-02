import { getTechColor } from "@/lib/tech-colors";
import type { YearTermRow } from "@/lib/year-terms";
import type { TecTerm } from "@/model/article";

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
 * Reparte 100% entre os dois lados de uma linha, garantindo que a soma feche em
 * 100 (o lado direito recebe o resto do arredondamento do esquerdo).
 */
function splitPercent(before: number, after: number) {
	const total = before + after;
	if (total === 0) return { before: 0, after: 0 };
	const beforePct = Math.round((before / total) * 100);
	return { before: beforePct, after: 100 - beforePct };
}

/**
 * Gráfico comparativo (tipo pirâmide) de publicações por tecnologia, divergindo
 * a partir de uma linha vertical no ano de corte: à esquerda o total anterior ao
 * ano, à direita o total a partir dele. As barras usam a identidade de cor da
 * tecnologia e são escaladas pelo maior valor de qualquer lado.
 */
export function YearTermsComparison({
	rows,
	threshold,
}: {
	rows: YearTermRow[];
	threshold: number;
}) {
	const maxSide = Math.max(1, ...rows.flatMap((row) => [row.before, row.after]));

	return (
		<section
			aria-label={`Publicações por tecnologia antes e a partir de ${threshold}`}
			className="overflow-hidden rounded-3xl border border-[#d0ddd5] bg-white shadow-[0_20px_50px_-16px_rgba(6,71,34,0.1)]"
		>
			{/* Faixa de cabeçalho */}
			<div className="border-b border-[#e4ede7] bg-gradient-to-br from-white via-white to-[#f1f7f3] px-6 py-7 sm:px-10 sm:py-9">
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
					<p className="mt-2 text-[#446554]">
						Comparação da quantidade de publicações que aplicam cada tecnologia
						digital, separando os artigos anteriores a {threshold} dos publicados
						a partir de {threshold}. A barra à direita da linha central revela o
						crescimento recente de cada tecnologia no contexto de AIA.
					</p>
				</div>
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
					<div className="divide-y divide-[#eef3ef]">
						{rows.map((row) => {
							const color = getTechColor(row.term);
							const leftPct = (row.before / maxSide) * 100;
							const rightPct = (row.after / maxSide) * 100;
							const share = splitPercent(row.before, row.after);

							return (
								<div
									key={row.term}
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
										style={{ color: row.before > 0 ? color.text : "#9aa8a0" }}
									>
										<span className="text-sm font-bold tabular-nums">
											{formatCount(row.before)}
										</span>
										<span className="text-[11px] font-medium tabular-nums opacity-70">
											{share.before}%
										</span>
									</span>

									{/* Barras divergentes */}
									<div className="relative flex h-6 items-center">
										{/* Metade esquerda: barra cresce a partir do centro */}
										<div className="flex flex-1 justify-end">
											<div
												className="h-6 rounded-l-md"
												style={{
													width: `${leftPct}%`,
													backgroundColor: color.base,
												}}
											/>
										</div>
										{/* Metade direita */}
										<div className="flex flex-1 justify-start">
											<div
												className="h-6 rounded-r-md"
												style={{
													width: `${rightPct}%`,
													backgroundColor: color.base,
												}}
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
										style={{ color: row.after > 0 ? color.text : "#9aa8a0" }}
									>
										<span className="text-sm font-bold tabular-nums">
											{formatCount(row.after)}
										</span>
										<span className="text-[11px] font-medium tabular-nums opacity-70">
											{share.after}%
										</span>
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
