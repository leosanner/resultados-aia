"use client";

import dynamic from "next/dynamic";

import type {
	ArticleMapPoint,
	TechnologyLegendItem,
} from "@/components/termos/terms-articles-map";

const TermsArticlesMap = dynamic(
	() =>
		import("@/components/termos/terms-articles-map").then(
			(module) => module.TermsArticlesMap,
		),
	{ ssr: false },
);

type TermsArticlesMapClientProps = {
	points: ArticleMapPoint[];
	technologyLegend: TechnologyLegendItem[];
	totalArticles: number;
	articlesWithMappedInstitutions: number;
};

export function TermsArticlesMapClient(props: TermsArticlesMapClientProps) {
	return <TermsArticlesMap {...props} />;
}
