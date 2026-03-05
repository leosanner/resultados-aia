"use client";

import { type ChartTone, getTonePalette } from "@/components/charts/chart-palettes";
import { BarChart } from "@mui/x-charts/BarChart";

type BarChartItem = {
	label: string;
	value: number;
};

type TermsBarChartProps = {
	items: BarChartItem[];
	tone: ChartTone;
};

export function TermsBarChart({ items, tone }: TermsBarChartProps) {
	if (items.length === 0) {
		return (
			<p className="text-sm text-[#64748b]">
				Não há termos com ocorrência para esta área.
			</p>
		);
	}

	const palette = getTonePalette(tone);

	const barPaletteStyles = palette.reduce<Record<string, { fill: string }>>(
		(currentStyles, color, index) => {
			currentStyles[
				`& .MuiBarElement-root:nth-of-type(${palette.length}n+${index + 1})`
			] = { fill: color };
			return currentStyles;
		},
		{},
	);

	return (
		<div className="rounded-[10px] border border-[#e2e8f0] bg-white p-3">
			<BarChart
				dataset={items}
				grid={{ horizontal: true, vertical: true }}
				height={Math.max(280, items.length * 42)}
				layout="horizontal"
				margin={{ bottom: 20, left: 12, right: 24, top: 12 }}
				series={[{ dataKey: "value", label: "Ocorrências" }]}
				sx={{
					"& .MuiBarElement-root": {
						stroke: "#0f172a",
						strokeWidth: 1.1,
					},
					"& .MuiChartsGrid-line": {
						stroke: "#cbd5e1",
						strokeDasharray: "4 4",
					},
					"& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
						stroke: "#94a3b8",
					},
					...barPaletteStyles,
				}}
				xAxis={[{ min: 0 }]}
				yAxis={[
					{
						dataKey: "label",
						scaleType: "band",
						tickLabelStyle: { fontSize: 12 },
						width: 220,
					},
				]}
			/>
		</div>
	);
}
