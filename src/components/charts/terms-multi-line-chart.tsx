"use client";

import { LineChart } from "@mui/x-charts/LineChart";

import {
	getToneColorByIndex,
	type ChartTone,
} from "@/components/charts/chart-palettes";
import type { TermsSearchTrendSeries } from "@/lib/terms-search";

type TermsMultiLineChartProps = {
	series: TermsSearchTrendSeries[];
	tone: ChartTone;
	emptyMessage: string;
};

export function TermsMultiLineChart({
	series,
	tone,
	emptyMessage,
}: TermsMultiLineChartProps) {
	if (series.length === 0 || series.every((item) => item.items.length === 0)) {
		return <p className="text-sm text-[#64748b]">{emptyMessage}</p>;
	}

	const years = series[0]?.items.map((item) => item.year) ?? [];

	return (
		<div className="rounded-[10px] border border-[#e2e8f0] bg-white p-3">
			<LineChart
				grid={{ horizontal: true, vertical: true }}
				height={320}
				margin={{ bottom: 24, left: 18, right: 24, top: 16 }}
				series={series.map((item, index) => ({
					color: getToneColorByIndex(tone, index),
					curve: "linear",
					data: item.items.map((point) => point.total),
					label: item.label,
					showMark: false,
				}))}
				slotProps={{
					legend: {
						direction: "horizontal",
						position: { horizontal: "middle", vertical: "bottom" },
					},
				}}
				sx={{
					"& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
						stroke: "#94a3b8",
					},
					"& .MuiChartsGrid-line": {
						stroke: "#cbd5e1",
						strokeDasharray: "4 4",
					},
					"& .MuiLineElement-root": {
						strokeWidth: 2.2,
					},
					"& .MuiChartsLegend-root text": {
						fontSize: 11,
					},
				}}
				xAxis={[
					{
						data: years,
						scaleType: "point",
						tickLabelStyle: { fontSize: 12 },
						label: "Ano",
					},
				]}
				yAxis={[
					{
						label: "Quantidade de artigos",
						tickLabelStyle: { fontSize: 12 },
						width: 56,
					},
				]}
			/>
		</div>
	);
}
