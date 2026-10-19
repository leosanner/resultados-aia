import type { Locale } from "@/i18n/locale";

export type TechStatsCopy = {
	kicker: string;
	title: (techName: string) => string;
	description: string;
	technologyOverTime: {
		title: string;
		description: (techName: string) => string;
		empty: string;
	};
	environmentalOverTime: {
		title: string;
		description: (techName: string) => string;
		empty: string;
	};
};

export const techStatsCopy: Record<Locale, TechStatsCopy> = {
	pt: {
		kicker: "Painel da tecnologia",
		title: (techName) => `Estatísticas de ${techName}`,
		description:
			"Distribuição geográfica das afiliações e evolução dos termos coocorrentes ao longo do tempo.",
		technologyOverTime: {
			title: "Termos de tecnologia ao longo do tempo",
			description: (techName) =>
				`Coocorrência de outras tecnologias nos artigos de ${techName}, por ano de publicação.`,
			empty: "Não há termos de tecnologia coocorrentes para esta seleção.",
		},
		environmentalOverTime: {
			title: "Termos ambientais ao longo do tempo",
			description: (techName) =>
				`Evolução dos termos ambientais nos artigos de ${techName}, por ano de publicação.`,
			empty: "Não há termos ambientais para esta seleção.",
		},
	},
	en: {
		kicker: "Technology dashboard",
		title: (techName) => `Statistics for ${techName}`,
		description:
			"Geographic distribution of affiliations and how co-occurring terms change over time.",
		technologyOverTime: {
			title: "Technology terms over time",
			description: (techName) =>
				`Co-occurrence of other technologies in ${techName} articles, by publication year.`,
			empty: "There are no co-occurring technology terms for this selection.",
		},
		environmentalOverTime: {
			title: "Environmental terms over time",
			description: (techName) =>
				`How environmental terms change in ${techName} articles, by publication year.`,
			empty: "There are no environmental terms for this selection.",
		},
	},
};
