type VennDiagramProps = {
	total: number;
	leftLabel: string;
	rightLabel: string;
	leftOnly: number;
	intersection: number;
	rightOnly: number;
	leftColor?: string;
	rightColor?: string;
	containerClassName?: string;
};

function formatCount(value: number) {
	return new Intl.NumberFormat("pt-BR").format(value);
}

export function VennDiagram({
	total,
	leftLabel,
	rightLabel,
	leftOnly,
	intersection,
	rightOnly,
	leftColor = "#16a34a",
	rightColor = "#0284c7",
	containerClassName,
}: VennDiagramProps) {
	return (
		<div
			className={`rounded-3xl border border-[#bfdbfe] bg-[linear-gradient(155deg,_#eff6ff_0%,_#ecfeff_40%,_#f0fdf4_100%)] p-5 sm:p-8 ${containerClassName ?? ""}`}
		>
			<p className="text-2xl font-black tracking-[-0.6px] text-[#0f172a] sm:text-4xl">
				Total: {formatCount(total)}
			</p>

			<div className="mt-4 overflow-x-auto">
				<svg
					aria-label="Diagrama de Venn entre duas bases"
					className="h-auto min-w-[760px] w-full"
					role="img"
					viewBox="0 0 980 620"
				>
					<rect
						fill="transparent"
						height="584"
						rx="28"
						stroke="#94a3b8"
						strokeWidth="2"
						width="952"
						x="14"
						y="16"
					/>

					<text
						fill={leftColor}
						fontSize="52"
						fontWeight="700"
						textAnchor="middle"
						x="285"
						y="92"
					>
						{leftLabel}
					</text>
					<text
						fill={rightColor}
						fontSize="52"
						fontWeight="700"
						textAnchor="middle"
						x="695"
						y="92"
					>
						{rightLabel}
					</text>

					<circle
						cx="380"
						cy="345"
						fill={`${leftColor}10`}
						r="235"
						stroke={leftColor}
						strokeWidth="4"
					/>
					<circle
						cx="600"
						cy="345"
						fill={`${rightColor}10`}
						r="235"
						stroke={rightColor}
						strokeWidth="4"
					/>

					<text
						fill={leftColor}
						fontSize="64"
						fontWeight="700"
						textAnchor="middle"
						x="255"
						y="368"
					>
						{formatCount(leftOnly)}
					</text>
					<text
						fill="#334155"
						fontSize="64"
						fontWeight="700"
						textAnchor="middle"
						x="490"
						y="368"
					>
						{formatCount(intersection)}
					</text>
					<text
						fill={rightColor}
						fontSize="64"
						fontWeight="700"
						textAnchor="middle"
						x="725"
						y="368"
					>
						{formatCount(rightOnly)}
					</text>
				</svg>
			</div>
		</div>
	);
}
