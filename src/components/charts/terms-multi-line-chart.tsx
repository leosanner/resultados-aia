"use client";

import { useMemo, useRef, useState } from "react";
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
	const chartWrapperRef = useRef<HTMLDivElement | null>(null);
	const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
		series.map((item) => item.key),
	);
	const [isDownloading, setIsDownloading] = useState(false);
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

	const downloadChart = async () => {
		const chartWrapper = chartWrapperRef.current;
		const svgElement = chartWrapper
			? Array.from(chartWrapper.querySelectorAll("svg")).reduce<SVGSVGElement | null>(
					(currentLargest, candidate) => {
						const candidateBounds = candidate.getBoundingClientRect();
						const candidateArea = candidateBounds.width * candidateBounds.height;
						if (candidateArea <= 0) return currentLargest;

						if (!currentLargest) return candidate;

						const currentBounds = currentLargest.getBoundingClientRect();
						const currentArea = currentBounds.width * currentBounds.height;
						return candidateArea > currentArea ? candidate : currentLargest;
					},
					null,
				)
			: null;
		if (!chartWrapper || !svgElement) return;

		setIsDownloading(true);

		try {
			const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
			const sourceElements = [svgElement, ...Array.from(svgElement.querySelectorAll("*"))];
			const clonedElements = [clonedSvg, ...Array.from(clonedSvg.querySelectorAll("*"))];

			for (let index = 0; index < sourceElements.length; index += 1) {
				const sourceElement = sourceElements[index];
				const clonedElement = clonedElements[index];
				if (!sourceElement || !clonedElement) continue;

				const computedStyle = window.getComputedStyle(sourceElement);
				const inlineStyle = Array.from(computedStyle).map(
					(property) => `${property}:${computedStyle.getPropertyValue(property)};`,
				);
				clonedElement.setAttribute("style", inlineStyle.join(""));
			}

			const bounds = svgElement.getBoundingClientRect();
			const width = Math.max(1, Math.round(bounds.width));
			const height = Math.max(1, Math.round(bounds.height));
			clonedSvg.setAttribute("width", String(width));
			clonedSvg.setAttribute("height", String(height));
			clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
			clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

			const serializer = new XMLSerializer();
			const svgMarkup = serializer.serializeToString(clonedSvg);
			const svgBlob = new Blob([svgMarkup], {
				type: "image/svg+xml;charset=utf-8",
			});
			const svgUrl = URL.createObjectURL(svgBlob);
			const image = new Image();

			await new Promise<void>((resolve, reject) => {
				image.onload = () => resolve();
				image.onerror = () => reject(new Error("Falha ao carregar o SVG."));
				image.src = svgUrl;
			});

			const canvas = document.createElement("canvas");
			canvas.width = width * 2;
			canvas.height = height * 2;

			const context = canvas.getContext("2d");
			if (!context) {
				URL.revokeObjectURL(svgUrl);
				throw new Error("Falha ao criar contexto do canvas.");
			}

			context.scale(2, 2);
			context.fillStyle = "#ffffff";
			context.fillRect(0, 0, width, height);
			context.drawImage(image, 0, 0, width, height);
			URL.revokeObjectURL(svgUrl);

			const activeLabels = filteredSeries.map((item) => item.label).join("-");
			const filenameBase =
				activeLabels
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "")
					.slice(0, 80) || "grafico";

			const pngUrl = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = pngUrl;
			link.download = `${filenameBase}.png`;
			link.click();
		} finally {
			setIsDownloading(false);
		}
	};

	if (!hasData) {
		return <p className="text-sm text-[#64748b]">{emptyMessage}</p>;
	}

	return (
		<div className="space-y-4 rounded-[10px] border border-[#e2e8f0] bg-white p-3">
			<div className="flex flex-wrap items-center justify-between gap-3">
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

				<button
					className="rounded-full border border-[#bfdbfe] bg-white px-3 py-1.5 text-xs font-semibold text-[#1d4ed8] transition-colors hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:opacity-60"
					disabled={filteredSeries.length === 0 || isDownloading}
					onClick={downloadChart}
					type="button"
				>
					{isDownloading ? "Baixando..." : "Baixar gráfico"}
				</button>
			</div>

			<div ref={chartWrapperRef}>
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
		</div>
	);
}
