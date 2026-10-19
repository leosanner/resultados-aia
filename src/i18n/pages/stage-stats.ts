import type { Locale } from "@/i18n/locale";

export type StageStatsCopy = {
	kicker: string;
	title: (stageName: string) => string;
	description: string;
	timelineTitle: string;
	timelineDescription: string;
	technologyTerms: string;
	environmentalTerms: string;
	untitledArticle: (articleId: number) => string;
};

export const stageStatsCopy: Record<Locale, StageStatsCopy> = {
	pt: {
		kicker: "Painel da etapa",
		title: (stageName) => `Estatísticas de ${stageName}`,
		description:
			"Gráfico de barras com frequência dos termos encontrados na etapa.",
		timelineTitle: "Evolução temporal dos artigos",
		timelineDescription: "Publicações por ano para esta área de AIA.",
		technologyTerms: "Termos de tecnologia",
		environmentalTerms: "Termos ambientais",
		untitledArticle: (articleId) => `Artigo ${articleId}`,
	},
	en: {
		kicker: "Stage dashboard",
		title: (stageName) => `Statistics for ${stageName}`,
		description:
			"Bar chart of the frequency of terms found in this stage.",
		timelineTitle: "Articles over time",
		timelineDescription: "Publications per year for this EIA area.",
		technologyTerms: "Technology terms",
		environmentalTerms: "Environmental terms",
		untitledArticle: (articleId) => `Article ${articleId}`,
	},
};
