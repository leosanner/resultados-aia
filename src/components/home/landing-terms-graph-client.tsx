"use client";

import dynamic from "next/dynamic";

import type { LandingTermsGraphProps } from "@/components/home/landing-terms-graph";

const LandingTermsGraph = dynamic(
	() =>
		import("@/components/home/landing-terms-graph").then(
			(module) => module.LandingTermsGraph,
		),
	{ ssr: false },
);

export function LandingTermsGraphClient(props: LandingTermsGraphProps) {
	return <LandingTermsGraph {...props} />;
}

