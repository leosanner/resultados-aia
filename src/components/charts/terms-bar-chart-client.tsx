"use client";

import dynamic from "next/dynamic";

export const TermsBarChartClient = dynamic(
	() =>
		import("@/components/charts/terms-bar-chart").then(
			(module) => module.TermsBarChart,
		),
	{ ssr: false },
);
