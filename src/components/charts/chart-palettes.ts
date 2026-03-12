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
	"#1d4ed8",
	"#b91c1c",
	"#0f766e",
	"#a16207",
	"#7c3aed",
	"#be185d",
	"#0369a1",
	"#166534",
];

export function getTonePalette(tone: ChartTone) {
	return tone === "green" ? GREEN_PALETTE : BLUE_PALETTE;
}

export function getToneColorByIndex(tone: ChartTone, index: number) {
	const palette = getTonePalette(tone);
	return palette[index % palette.length];
}
