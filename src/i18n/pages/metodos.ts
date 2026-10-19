import { formatNumber, type Locale } from "@/i18n/locale";

export type MetodosCopy = {
	header: {
		kicker: string;
		title: string;
		backHome: string;
	};
	objective: {
		title: string;
		body: string;
	};
	sources: {
		title: string;
	};
	strategy: {
		title: string;
		technologyLabel: string;
		technologyQuery: string;
		environmentalLabel: string;
		environmentalQuery: string;
	};
	overlap: {
		title: string;
		body: string;
	};
	venn: {
		total: string;
		aria: string;
	};
	funnel: {
		title: string;
		steps: [string, string, string, string, string];
		value: (value: number, approximate?: boolean) => string;
	};
	specialRule: {
		title: string;
		before: string;
		term: string;
		after: string;
	};
	finalResult: {
		title: string;
		before: string;
		highlight: (count: number) => string;
		after: string;
	};
};

function funnelValue(locale: Locale, value: number, approximate = false) {
	const formatted = formatNumber(locale, value);
	return approximate ? `> ${formatted}` : formatted;
}

function articleHighlight(locale: Locale, count: number, one: string, many: string) {
	return `${formatNumber(locale, count)} ${count === 1 ? one : many}`;
}

export const metodosCopy: Record<Locale, MetodosCopy> = {
	pt: {
		header: {
			kicker: "Projeto AIA",
			title: "Métodos e Pipeline",
			backHome: "Voltar para início",
		},
		objective: {
			title: "Objetivo Geral",
			body: "Identificar artigos na interseção entre tecnologia (IA/ML) e temas ambientais de Avaliação de Impacto Ambiental (AIA), gerando um conjunto pequeno e altamente relevante para análise.",
		},
		sources: {
			title: "Fontes de dados",
		},
		strategy: {
			title: "Estratégia de busca",
			technologyLabel: "Tecnologia",
			technologyQuery: "machine learning | deep learning | correlatos.",
			environmentalLabel: "Ambiental/AIA",
			environmentalQuery:
				"environmental impact assessment | risk analysis | correlatos.",
		},
		overlap: {
			title: "Sobreposição entre bases",
			body: "A etapa inicial cruza os resultados das duas fontes bibliográficas para reduzir duplicidades e preservar os estudos compartilhados.",
		},
		venn: {
			total: "Total",
			aria: "Diagrama de Venn entre duas bases",
		},
		funnel: {
			title: "Funil de redução",
			steps: [
				"Busca total nas bases",
				"Interseção Scopus + OpenAlex",
				"Após filtro FWCI",
				"Classificador AIA (relevantes)",
				"Filtro final: environmental monitoring + reforço ambiental",
			],
			value: (value, approximate) => funnelValue("pt", value, approximate),
		},
		specialRule: {
			title: "Regra especial aplicada",
			before: "O termo ",
			term: "environmental monitoring",
			after: " não pode aparecer sozinho. Ele precisa estar acompanhado de pelo menos outro termo ambiental (ou equivalente reforço semântico).",
		},
		finalResult: {
			title: "Resultado final da interface",
			before: "O conjunto final contém ",
			highlight: (count) => articleHighlight("pt", count, "artigo", "artigos"),
			after: ", exibidos com título, resumo e palavras-chave, além de estatísticas agregadas para leitura rápida do corpus.",
		},
	},
	en: {
		header: {
			kicker: "EIA Project",
			title: "Methods and Pipeline",
			backHome: "Back to home",
		},
		objective: {
			title: "Overall Objective",
			body: "Identify articles at the intersection of technology (AI/ML) and environmental themes in Environmental Impact Assessment (EIA), producing a small, highly relevant set for analysis.",
		},
		sources: {
			title: "Data sources",
		},
		strategy: {
			title: "Search strategy",
			technologyLabel: "Technology",
			technologyQuery: "machine learning | deep learning | related terms.",
			environmentalLabel: "Environmental/EIA",
			environmentalQuery:
				"environmental impact assessment | risk analysis | related terms.",
		},
		overlap: {
			title: "Overlap between databases",
			body: "The first stage cross-references the results from the two bibliographic sources to reduce duplicates and keep the studies they share.",
		},
		venn: {
			total: "Total",
			aria: "Venn diagram of the two databases",
		},
		funnel: {
			title: "Reduction funnel",
			steps: [
				"Total search across the databases",
				"Scopus + OpenAlex intersection",
				"After the FWCI filter",
				"EIA classifier (relevant)",
				"Final filter: environmental monitoring + environmental reinforcement",
			],
			value: (value, approximate) => funnelValue("en", value, approximate),
		},
		specialRule: {
			title: "Special rule applied",
			before: "The term ",
			term: "environmental monitoring",
			after: " cannot appear on its own. It must be accompanied by at least one other environmental term (or an equivalent semantic reinforcement).",
		},
		finalResult: {
			title: "Final result in the interface",
			before: "The final set contains ",
			highlight: (count) => articleHighlight("en", count, "article", "articles"),
			after: ", shown with title, abstract, and keywords, plus aggregated statistics for a quick reading of the corpus.",
		},
	},
};
