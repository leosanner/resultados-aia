export type ChartTone = "green" | "blue";

const GREEN_PALETTE = [
	"#22c55e",
	"#10b981",
	"#84cc16",
	"#14b8a6",
	"#f59e0b",
	"#f97316",
	"#ef4444",
	"#8b5cf6",
];

const BLUE_PALETTE = [
	"#0ea5e9",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#ec4899",
	"#f43f5e",
	"#f97316",
	"#22c55e",
];

export function getTonePalette(tone: ChartTone) {
	return tone === "green" ? GREEN_PALETTE : BLUE_PALETTE;
}

export function getToneColorByIndex(tone: ChartTone, index: number) {
	const palette = getTonePalette(tone);
	return palette[index % palette.length];
}
