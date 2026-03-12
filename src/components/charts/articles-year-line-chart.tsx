"use client";

import { LineChart } from "@mui/x-charts/LineChart";

type YearlyArticlesItem = {
	year: number;
	total: number;
};

type ArticlesYearLineChartProps = {
	items: YearlyArticlesItem[];
};

export function ArticlesYearLineChart({ items }: ArticlesYearLineChartProps) {
	if (items.length === 0) {
		return (
			<p className="text-sm text-[#64748b]">
				Não há dados de ano de publicação para os artigos filtrados.
			</p>
		);
	}

	return (
		<div className="rounded-[10px] border border-[#e2e8f0] bg-white p-3">
			<LineChart
				dataset={items}
				grid={{ horizontal: true, vertical: true }}
				height={280}
				margin={{ bottom: 20, left: 12, right: 24, top: 12 }}
				series={[
					{
						color: "#0ea5e9",
						curve: "linear",
						dataKey: "total",
						label: "Artigos",
						showMark: true,
					},
				]}
				sx={{
					"& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
						stroke: "#94a3b8",
					},
					"& .MuiChartsGrid-line": {
						stroke: "#cbd5e1",
						strokeDasharray: "4 4",
					},
					"& .MuiLineElement-root": {
						strokeWidth: 2.5,
					},
					"& .MuiMarkElement-root": {
						fill: "#0ea5e9",
						stroke: "#ffffff",
						strokeWidth: 1.5,
					},
				}}
				xAxis={[
					{
						dataKey: "year",
						scaleType: "point",
						tickLabelStyle: { fontSize: 12 },
					},
				]}
				yAxis={[
					{
						label: "Quantidade de artigos",
						tickLabelStyle: { fontSize: 12 },
						width: 54,
					},
				]}
			/>
		</div>
	);
}
