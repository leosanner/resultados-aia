"use client";

import dynamic from "next/dynamic";

export const TermsMultiLineChartClient = dynamic(
	() =>
		import("@/components/charts/terms-multi-line-chart").then(
			(module) => module.TermsMultiLineChart,
		),
	{ ssr: false },
);
