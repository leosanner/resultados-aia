"use client";

import dynamic from "next/dynamic";

export const ArticlesYearLineChartClient = dynamic(
	() =>
		import("@/components/charts/articles-year-line-chart").then(
			(module) => module.ArticlesYearLineChart,
		),
	{ ssr: false },
);
