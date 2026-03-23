"use client";

import { useMemo, useState } from "react";
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
	const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
		series.map((item) => item.key),
	);
	const hasData =
		series.length > 0 && !series.every((item) => item.items.length === 0);

	const visibleKeySet = useMemo(() => new Set(visibleKeys), [visibleKeys]);
	const filteredSeries = useMemo(
		() => series.filter((item) => visibleKeySet.has(item.key)),
		[series, visibleKeySet],
	);
	const years = series[0]?.items.map((item) => item.year) ?? [];

	const toggleSeriesVisibility = (key: string) => {
		setVisibleKeys((current) =>
			current.includes(key)
				? current.filter((currentKey) => currentKey !== key)
				: [...current, key],
		);
	};

	if (!hasData) {
		return <p className="text-sm text-[#64748b]">{emptyMessage}</p>;
	}

	return (
		<div className="space-y-4 rounded-[10px] border border-[#e2e8f0] bg-white p-3">
			<div className="flex flex-wrap gap-2">
				{series.map((item, index) => {
					const isVisible = visibleKeySet.has(item.key);
					const color = getToneColorByIndex(tone, index);

					return (
						<button
							aria-pressed={isVisible}
							className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
							key={item.key}
							onClick={() => toggleSeriesVisibility(item.key)}
							style={{
								backgroundColor: isVisible ? `${color}18` : "#ffffff",
								borderColor: isVisible ? color : "#cbd5e1",
								color: isVisible ? color : "#475569",
							}}
							type="button"
						>
							<span
								aria-hidden
								className="h-2.5 w-2.5 rounded-full"
								style={{ backgroundColor: color }}
							/>
							{item.label}
						</button>
					);
				})}
			</div>

			{filteredSeries.length === 0 ? (
				<p className="text-sm text-[#64748b]">
					Selecione ao menos um termo ou área para exibir no gráfico.
				</p>
			) : (
				<LineChart
					grid={{ horizontal: true, vertical: true }}
					height={320}
					margin={{ bottom: 24, left: 18, right: 24, top: 16 }}
					series={filteredSeries.map((item) => {
						const originalIndex = series.findIndex(
							(candidate) => candidate.key === item.key,
						);

						return {
							color: getToneColorByIndex(tone, originalIndex),
							curve: "linear",
							data: item.items.map((point) => point.total),
							label: item.label,
							showMark: false,
						};
					})}
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
			)}
		</div>
	);
}
