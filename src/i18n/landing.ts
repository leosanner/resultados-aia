import { formatNumber, type Locale } from "@/i18n/locale";

export type LandingCopy = {
	meta: {
		title: string;
		description: string;
	};
	switcher: {
		label: string;
		pt: string;
		en: string;
	};
	nav: {
		aria: string;
		brand: string;
		context: string;
		methodology: string;
		authors: string;
		summary: string;
		assistant: string;
		results: string;
		signIn: string;
		signInAria: string;
	};
	footer: {
		aria: string;
		home: string;
		context: string;
		methodology: string;
		authors: string;
		terms: string;
		supportedBy: string;
		copyright: string;
	};
	hero: {
		titleLine1: string;
		titleLine2: string;
		subtitle: string;
	};
	technologies: {
		aria: string;
		title: string;
		subtitle: string;
		description: (term: string) => string;
		count: (count: number) => string;
		viewArticles: string;
		statsAria: (term: string) => string;
		loadErrorTitle: string;
		loadErrorBody: string;
		emptyTitle: string;
		emptyBody: string;
	};
	askAi: {
		aria: string;
		kicker: string;
		badge: string;
		title: string;
		body: string;
		grounded: string;
		sources: string;
		openAria: string;
		placeholder: string;
		submit: string;
		examplesLabel: string;
		examples: string[];
		disclaimer: string;
	};
	graph: {
		kicker: string;
		title: string;
		subtitle: string;
		filterByTopics: string;
		clearFilters: string;
		searchPlaceholder: string;
		technologies: string;
		environmentalTopics: string;
		technology: string;
		environmental: string;
		articles: string;
		decreaseFont: string;
		increaseFont: string;
		showResults: string;
		nodeArticles: (count: number) => string;
	};
};

function articleCount(locale: Locale, count: number, one: string, many: string) {
	return `${formatNumber(locale, count)} ${count === 1 ? one : many}`;
}

export const landingCopy: Record<Locale, LandingCopy> = {
	pt: {
		meta: {
			title: "Explorador AIA",
			description:
				"Visão geral de áreas e pesquisas em Avaliação de Impacto Ambiental",
		},
		switcher: {
			label: "Idioma",
			pt: "Português",
			en: "Inglês",
		},
		nav: {
			aria: "Navegação principal",
			brand: "Explorador AIA",
			context: "Contextualização",
			methodology: "Metodologia",
			authors: "Autores",
			summary: "Sumarização",
			assistant: "Assistente IA",
			results: "Resultados",
			signIn: "Entrar",
			signInAria: "Entrar na plataforma",
		},
		footer: {
			aria: "Mapa do site",
			home: "Início",
			context: "Contextualização Geral",
			methodology: "Metodologia",
			authors: "Autores",
			terms: "Termos",
			supportedBy: "Projeto apoiado por",
			copyright: "© 2026 Projeto Base de Pesquisa AIA.",
		},
		hero: {
			titleLine1: "Tecnologias digitais",
			titleLine2: "associadas a AIA",
			subtitle:
				"Explore artigos que utilizam tecnologias integradas no contexto de avaliação de impacto ambiental",
		},
		technologies: {
			aria: "Artigos por tecnologia",
			title: "Artigos por Tecnologia",
			subtitle:
				"Selecione uma tecnologia para acessar as publicações que a aplicam no contexto de AIA.",
			description: (term) =>
				`Artigos que aplicam ${term} no contexto de AIA.`,
			count: (count) => articleCount("pt", count, "Artigo", "Artigos"),
			viewArticles: "Ver artigos",
			statsAria: (term) => `Estatísticas de ${term}`,
			loadErrorTitle: "Não foi possível carregar os dados",
			loadErrorBody:
				"Ocorreu um erro ao buscar os artigos. Tente novamente em instantes.",
			emptyTitle: "Nenhum resultado encontrado",
			emptyBody: "Ainda não há artigos classificados para estas tecnologias.",
		},
		askAi: {
			aria: "Assistente de pesquisa",
			kicker: "Assistente de pesquisa · Inteligência artificial",
			badge: "Protótipo experimental",
			title: "Consulte a base de artigos de AIA",
			body: "Formule perguntas em linguagem natural e obtenha respostas fundamentadas nos artigos analisados, com indicação das fontes consultadas.",
			grounded: "Respostas fundamentadas nos artigos",
			sources: "Fontes citadas",
			openAria: "Abrir o assistente de pesquisa AIA em nova aba",
			placeholder: "Pergunte sobre tecnologias digitais aplicadas à AIA",
			submit: "Consultar",
			examplesLabel: "Exemplos de perguntas",
			examples: [
				"Quais tecnologias dão suporte à etapa de screening?",
				"Como o sensoriamento remoto é aplicado em AIA?",
				"Quais artigos abordam gêmeos digitais ambientais?",
			],
			disclaimer:
				"Projeto em fase de protótipo experimental. As respostas podem conter imprecisões e devem ser verificadas nas fontes citadas.",
		},
		graph: {
			kicker: "Visualização interativa",
			title: "Grafo de Artigos e Termos",
			subtitle:
				"Selecione tópicos para filtrar conexões. Arraste os nós para reorganizar o layout.",
			filterByTopics: "Filtrar por tópicos",
			clearFilters: "Limpar filtros",
			searchPlaceholder: "Buscar tópico...",
			technologies: "Tecnologias",
			environmentalTopics: "Ambientais",
			technology: "Tecnologia",
			environmental: "Ambiental",
			articles: "Artigos",
			decreaseFont: "Diminuir fonte dos nós",
			increaseFont: "Aumentar fonte dos nós",
			showResults: "Mostrar resultados",
			nodeArticles: (count) =>
				articleCount("pt", count, "artigo", "artigos"),
		},
	},
	en: {
		meta: {
			title: "EIA Explorer",
			description:
				"Overview of research areas in Environmental Impact Assessment",
		},
		switcher: {
			label: "Language",
			pt: "Portuguese",
			en: "English",
		},
		nav: {
			aria: "Main navigation",
			brand: "EIA Explorer",
			context: "Context",
			methodology: "Methodology",
			authors: "Authors",
			summary: "Summary",
			assistant: "AI Assistant",
			results: "Results",
			signIn: "Sign in",
			signInAria: "Sign in to the platform",
		},
		footer: {
			aria: "Site map",
			home: "Home",
			context: "General Context",
			methodology: "Methodology",
			authors: "Authors",
			terms: "Terms",
			supportedBy: "Supported by",
			copyright: "© 2026 EIA Research Database Project.",
		},
		hero: {
			titleLine1: "Digital technologies",
			titleLine2: "linked to EIA",
			subtitle:
				"Explore articles that use integrated technologies in the context of environmental impact assessment",
		},
		technologies: {
			aria: "Articles by technology",
			title: "Articles by Technology",
			subtitle:
				"Select a technology to open the publications that apply it in the EIA context.",
			description: (term) =>
				`Articles that apply ${term} in the EIA context.`,
			count: (count) => articleCount("en", count, "Article", "Articles"),
			viewArticles: "View articles",
			statsAria: (term) => `Statistics for ${term}`,
			loadErrorTitle: "Could not load the data",
			loadErrorBody:
				"An error occurred while loading the articles. Try again in a moment.",
			emptyTitle: "No results found",
			emptyBody: "There are no articles classified for these technologies yet.",
		},
		askAi: {
			aria: "Research assistant",
			kicker: "Research assistant · Artificial intelligence",
			badge: "Experimental prototype",
			title: "Query the EIA article database",
			body: "Ask questions in natural language and get answers grounded in the analyzed articles, with the sources that were consulted.",
			grounded: "Answers grounded in the articles",
			sources: "Cited sources",
			openAria: "Open the EIA research assistant in a new tab",
			placeholder: "Ask about digital technologies applied to EIA",
			submit: "Ask",
			examplesLabel: "Example questions",
			examples: [
				"Which technologies support the screening stage?",
				"How is remote sensing applied in EIA?",
				"Which articles discuss environmental digital twins?",
			],
			disclaimer:
				"This project is an experimental prototype. Answers may contain inaccuracies and should be checked against the cited sources.",
		},
		graph: {
			kicker: "Interactive visualization",
			title: "Article and Term Graph",
			subtitle:
				"Select topics to filter connections. Drag the nodes to rearrange the layout.",
			filterByTopics: "Filter by topics",
			clearFilters: "Clear filters",
			searchPlaceholder: "Search topics...",
			technologies: "Technologies",
			environmentalTopics: "Environmental",
			technology: "Technology",
			environmental: "Environmental",
			articles: "Articles",
			decreaseFont: "Decrease node font size",
			increaseFont: "Increase node font size",
			showResults: "Show results",
			nodeArticles: (count) =>
				articleCount("en", count, "article", "articles"),
		},
	},
};
