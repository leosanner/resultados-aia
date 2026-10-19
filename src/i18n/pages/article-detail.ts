import type { Locale } from "@/i18n/locale";

export type ArticleDetailCopy = {
	backToArticles: string;
	abstract: string;
	keywords: string;
	noKeywords: string;
	technologyTerms: string;
	noTechnologyTerms: string;
	environmentalTerms: string;
	noEnvironmentalTerms: string;
};

export const articleDetailCopy: Record<Locale, ArticleDetailCopy> = {
	pt: {
		backToArticles: "Voltar para artigos da área",
		abstract: "Resumo",
		keywords: "Palavras-chave",
		noKeywords: "Sem palavras-chave",
		technologyTerms: "Termos de tecnologia",
		noTechnologyTerms: "Sem termos de tecnologia destacados.",
		environmentalTerms: "Termos ambientais",
		noEnvironmentalTerms: "Sem termos ambientais destacados.",
	},
	en: {
		backToArticles: "Back to articles in this area",
		abstract: "Abstract",
		keywords: "Keywords",
		noKeywords: "No keywords",
		technologyTerms: "Technology terms",
		noTechnologyTerms: "No highlighted technology terms.",
		environmentalTerms: "Environmental terms",
		noEnvironmentalTerms: "No highlighted environmental terms.",
	},
};
