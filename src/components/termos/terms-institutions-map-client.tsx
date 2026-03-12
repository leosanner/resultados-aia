"use client";

import dynamic from "next/dynamic";

import type {
	AreaLegendItem,
	InstitutionMapPoint,
} from "@/components/termos/terms-institutions-map";

const TermsInstitutionsMap = dynamic(
	() =>
		import("@/components/termos/terms-institutions-map").then(
			(module) => module.TermsInstitutionsMap,
		),
	{ ssr: false },
);

type TermsInstitutionsMapClientProps = {
	points: InstitutionMapPoint[];
	areas: AreaLegendItem[];
	totalArticles: number;
	articlesWithMappedInstitutions: number;
};

export function TermsInstitutionsMapClient(
	props: TermsInstitutionsMapClientProps,
) {
	return <TermsInstitutionsMap {...props} />;
}
