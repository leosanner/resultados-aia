import { formatNumber, type Locale } from "@/i18n/locale";

export type SumarizacaoCopy = {
	page: {
		title: string;
		subtitle: string;
	};
	yearTerms: {
		aria: (threshold: number) => string;
		kicker: string;
		title: string;
		bodyBefore: string;
		bodyYear: string;
		bodyAfter: string;
		cutoffLabel: string;
		baseline: string;
		adjusted: (defaultThreshold: number) => string;
		reference: string;
	};
	graph: {
		aria: string;
		kicker: string;
		title: string;
		subtitle: string;
		openInNewTab: string;
		loading: string;
		iframeTitle: string;
		fallback: string;
	};
	kdd: {
		aria: string;
		kicker: string;
		title: string;
		body: string;
		articles: (count: number) => string;
		governance: string;
		stages: {
			selection: string;
			preprocessing: string;
			transformation: string;
			data_mining: string;
			interpretation_evaluation: string;
			knowledge: string;
		};
	};
};

function articleCount(locale: Locale, count: number, one: string, many: string) {
	return `${formatNumber(locale, count)} ${count === 1 ? one : many}`;
}

export const sumarizacaoCopy: Record<Locale, SumarizacaoCopy> = {
	pt: {
		page: {
			title: "Sumarização dos resultados",
			subtitle:
				"Uma visão consolidada das tecnologias digitais aplicadas à AIA e o grafo interativo de tecnologias e termos.",
		},
		yearTerms: {
			aria: (threshold) =>
				`Publicações por tecnologia antes e a partir de ${threshold}`,
			kicker: "Evolução temporal",
			title: "Publicações por tecnologia",
			bodyBefore:
				"Quantas publicações aplicam cada tecnologia digital, separadas por um ano de corte: à esquerda, os trabalhos anteriores; à direita, os publicados a partir dele. O corte padrão é ",
			bodyYear: "2021",
			bodyAfter:
				" — a linha de base do levantamento global de Fothergill e Murphy sobre a adoção de tecnologias digitais na AIA. Mova o seletor para reposicionar a divisão e ver como cada tecnologia evolui ao redor dela.",
			cutoffLabel: "Ano de corte",
			baseline: "Linha de base do estudo",
			adjusted: (defaultThreshold) => `Ajustado · padrão ${defaultThreshold}`,
			reference: "Referência",
		},
		graph: {
			aria: "Grafo interativo de tecnologias e termos",
			kicker: "Visualização interativa",
			title: "Grafo de Tecnologias e Termos",
			subtitle:
				"Explore as conexões entre tecnologias e termos diretamente no grafo interativo embutido abaixo.",
			openInNewTab: "Abrir em nova aba",
			loading: "Carregando o grafo…",
			iframeTitle: "Grafo interativo de tecnologias e termos",
			fallback:
				"O grafo é carregado de um serviço externo. Caso não apareça, use o botão “Abrir em nova aba”.",
		},
		kdd: {
			aria: "Tecnologias por etapa do fluxo KDD",
			kicker: "Síntese dos resultados",
			title: "Tecnologias no fluxo KDD",
			body: "Distribuição das tecnologias digitais ao longo das etapas do processo de Knowledge Discovery in Databases (KDD). Uma barra que cruza etapas indica que a tecnologia atua de forma contínua nessas fases; o número é a quantidade de artigos que a aplicam no contexto de AIA.",
			articles: (count) => articleCount("pt", count, "artigo", "artigos"),
			governance: "Governança de dados",
			stages: {
				selection:
					"Seleção dos dados relevantes entre as fontes disponíveis, definindo o recorte que será analisado.",
				preprocessing:
					"Limpeza e tratamento dos dados: remoção de ruído, correção de inconsistências e valores ausentes.",
				transformation:
					"Transformação e redução dos dados para formatos e atributos adequados à mineração.",
				data_mining:
					"Aplicação de algoritmos para descobrir padrões, relações e modelos nos dados preparados.",
				interpretation_evaluation:
					"Interpretação e avaliação dos padrões encontrados, filtrando o que é de fato útil e válido.",
				knowledge:
					"Conhecimento consolidado a partir dos padrões, pronto para apoiar a tomada de decisão.",
			},
		},
	},
	en: {
		page: {
			title: "Summary of results",
			subtitle:
				"A consolidated view of the digital technologies applied to EIA and the interactive graph of technologies and terms.",
		},
		yearTerms: {
			aria: (threshold) =>
				`Publications by technology before and from ${threshold}`,
			kicker: "Change over time",
			title: "Publications by technology",
			bodyBefore:
				"How many publications apply each digital technology, split by a cutoff year: earlier work on the left, and work published from that year on the right. The default cutoff is ",
			bodyYear: "2021",
			bodyAfter:
				" — the baseline of Fothergill and Murphy's global review of the uptake of digital technologies in EIA. Move the selector to reposition the split and see how each technology changes around it.",
			cutoffLabel: "Cutoff year",
			baseline: "Study baseline",
			adjusted: (defaultThreshold) => `Adjusted · default ${defaultThreshold}`,
			reference: "Reference",
		},
		graph: {
			aria: "Interactive graph of technologies and terms",
			kicker: "Interactive visualization",
			title: "Technology and Term Graph",
			subtitle:
				"Explore the connections between technologies and terms in the interactive graph embedded below.",
			openInNewTab: "Open in a new tab",
			loading: "Loading the graph…",
			iframeTitle: "Interactive graph of technologies and terms",
			fallback:
				"The graph is loaded from an external service. If it does not appear, use the “Open in a new tab” button.",
		},
		kdd: {
			aria: "Technologies by KDD process stage",
			kicker: "Results synthesis",
			title: "Technologies in the KDD process",
			body: "Distribution of digital technologies across the stages of the Knowledge Discovery in Databases (KDD) process. A bar that spans stages means the technology is applied continuously through those phases; the number is how many articles apply it in the EIA context.",
			articles: (count) => articleCount("en", count, "article", "articles"),
			governance: "Data governance",
			stages: {
				selection:
					"Selection of the relevant data from the available sources, defining the subset that will be analyzed.",
				preprocessing:
					"Cleaning and preparation of the data: removal of noise, and correction of inconsistencies and missing values.",
				transformation:
					"Transformation and reduction of the data into formats and attributes suited to mining.",
				data_mining:
					"Application of algorithms to discover patterns, relationships, and models in the prepared data.",
				interpretation_evaluation:
					"Interpretation and evaluation of the patterns found, filtering what is actually useful and valid.",
				knowledge:
					"Knowledge consolidated from the patterns, ready to support decision-making.",
			},
		},
	},
};
