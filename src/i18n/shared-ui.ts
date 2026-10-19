import type { Locale } from "@/i18n/locale";

export type SharedUiCopy = {
	charts: {
		articles: string;
		year: string;
		articleQuantity: string;
		occurrences: string;
		noPublicationYearData: string;
		noTermOccurrences: string;
		selectAtLeastOne: string;
		downloadChartAria: string;
		downloadingChartAria: string;
		downloading: string;
		downloadChart: string;
		legend: string;
		chartFilenameFallback: string;
		svgLoadError: string;
		canvasContextError: string;
	};
	maps: {
		title: string;
		articlesDescription: string;
		institutionsDescription: string;
		filteredArticles: string;
		withMappedAffiliation: string;
		uniqueInstitutions: string;
		withoutGeolocation: string;
		mapTheme: string;
		themeSelectorAria: string;
		light: string;
		dark: string;
		visualization: string;
		visualizationSelectorAria: string;
		map: string;
		satellite: string;
		articleAria: (title: string) => string;
		institutionAria: (name: string) => string;
		noGeoreferenced: string;
		colorsByTechnology: string;
		colorsByArea: string;
		techBadge: (term: string) => string;
		envBadge: (term: string) => string;
	};
	sort: {
		sortBy: string;
		order: string;
		publicationDate: string;
		fwci: string;
		descending: string;
		ascending: string;
	};
	pageSize: {
		articlesPerPage: string;
	};
	articleCard: {
		noKeywords: string;
	};
};

export const sharedUiCopy: Record<Locale, SharedUiCopy> = {
	pt: {
		charts: {
			articles: "Artigos",
			year: "Ano",
			articleQuantity: "Quantidade de artigos",
			occurrences: "Ocorrências",
			noPublicationYearData:
				"Não há dados de ano de publicação para os artigos filtrados.",
			noTermOccurrences: "Não há termos com ocorrência para esta área.",
			selectAtLeastOne:
				"Selecione ao menos um termo ou área para exibir no gráfico.",
			downloadChartAria: "Baixar gráfico",
			downloadingChartAria: "Baixando gráfico",
			downloading: "Baixando",
			downloadChart: "Baixar Gráfico",
			legend: "Legenda",
			chartFilenameFallback: "grafico",
			svgLoadError: "Falha ao carregar o SVG.",
			canvasContextError: "Falha ao criar contexto do canvas.",
		},
		maps: {
			title: "Mapa de afiliações",
			articlesDescription:
				"Afiliações dos artigos filtrados por termos, coloridas pela tecnologia do artigo.",
			institutionsDescription:
				"Afiliações dos artigos filtrados por termos, georreferenciadas por instituição.",
			filteredArticles: "Artigos filtrados",
			withMappedAffiliation: "Com afiliação mapeada",
			uniqueInstitutions: "Instituições únicas",
			withoutGeolocation: "Sem geolocalização",
			mapTheme: "Tema do mapa",
			themeSelectorAria: "Seletor de tema do mapa",
			light: "Claro",
			dark: "Escuro",
			visualization: "Visualização",
			visualizationSelectorAria: "Seletor de visualização do mapa",
			map: "Mapa",
			satellite: "Satélite",
			articleAria: (title) => `Artigo ${title}`,
			institutionAria: (name) => `Instituição ${name}`,
			noGeoreferenced:
				"Nenhuma afiliação georreferenciável foi encontrada para os artigos filtrados.",
			colorsByTechnology: "Cores por tecnologia",
			colorsByArea: "Cores por área (mesma paleta do gráfico)",
			techBadge: (term) => `Tec: ${term}`,
			envBadge: (term) => `Env: ${term}`,
		},
		sort: {
			sortBy: "Ordenar por",
			order: "Ordem",
			publicationDate: "Data de publicação",
			fwci: "FWCI",
			descending: "Decrescente",
			ascending: "Crescente",
		},
		pageSize: {
			articlesPerPage: "Artigos por página",
		},
		articleCard: {
			noKeywords: "Sem palavras-chave",
		},
	},
	en: {
		charts: {
			articles: "Articles",
			year: "Year",
			articleQuantity: "Number of articles",
			occurrences: "Occurrences",
			noPublicationYearData:
				"There is no publication-year data for the filtered articles.",
			noTermOccurrences: "There are no terms with occurrences for this area.",
			selectAtLeastOne: "Select at least one term or area to show on the chart.",
			downloadChartAria: "Download chart",
			downloadingChartAria: "Downloading chart",
			downloading: "Downloading",
			downloadChart: "Download chart",
			legend: "Legend",
			chartFilenameFallback: "chart",
			svgLoadError: "Failed to load the SVG.",
			canvasContextError: "Failed to create the canvas context.",
		},
		maps: {
			title: "Affiliation map",
			articlesDescription:
				"Affiliations of the articles filtered by terms, colored by each article's technology.",
			institutionsDescription:
				"Affiliations of the articles filtered by terms, georeferenced by institution.",
			filteredArticles: "Filtered articles",
			withMappedAffiliation: "With mapped affiliation",
			uniqueInstitutions: "Unique institutions",
			withoutGeolocation: "No geolocation",
			mapTheme: "Map theme",
			themeSelectorAria: "Map theme selector",
			light: "Light",
			dark: "Dark",
			visualization: "View",
			visualizationSelectorAria: "Map view selector",
			map: "Map",
			satellite: "Satellite",
			articleAria: (title) => `Article ${title}`,
			institutionAria: (name) => `Institution ${name}`,
			noGeoreferenced:
				"No georeferenced affiliation was found for the filtered articles.",
			colorsByTechnology: "Colors by technology",
			colorsByArea: "Colors by area (same palette as the chart)",
			techBadge: (term) => `Tech: ${term}`,
			envBadge: (term) => `Env: ${term}`,
		},
		sort: {
			sortBy: "Sort by",
			order: "Order",
			publicationDate: "Publication date",
			fwci: "FWCI",
			descending: "Descending",
			ascending: "Ascending",
		},
		pageSize: {
			articlesPerPage: "Articles per page",
		},
		articleCard: {
			noKeywords: "No keywords",
		},
	},
};
