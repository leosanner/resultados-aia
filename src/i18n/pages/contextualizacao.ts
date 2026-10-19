import type { Locale } from "@/i18n/locale";

export type ContextualizacaoCopy = {
	kicker: string;
	title: string;
	description: string;
	summary: {
		totalArticles: string;
		totalAreas: string;
		timeRange: string;
		unavailable: string;
		mappedLocations: string;
	};
	timeline: {
		title: string;
		description: string;
	};
	series: {
		title: string;
		description: string;
		technologyTitle: string;
		technologyDescription: string;
		technologyEmpty: string;
		environmentalTitle: string;
		environmentalDescription: string;
		environmentalEmpty: string;
	};
	legend: {
		multipleTechnologies: string;
		noTechnology: string;
	};
};

export const contextualizacaoCopy: Record<Locale, ContextualizacaoCopy> = {
	pt: {
		kicker: "Visão Executiva",
		title: "Contextualização Geral dos Resultados",
		description:
			"Esta seção resume os principais resultados do experimento, com foco na distribuição espacial dos artigos, evolução temporal das publicações e temas mais frequentes.",
		summary: {
			totalArticles: "Total de Artigos",
			totalAreas: "Total de Áreas",
			timeRange: "Intervalo Temporal",
			unavailable: "Não disponível",
			mappedLocations: "Localizações Mapeadas",
		},
		timeline: {
			title: "Evolução Temporal das Publicações",
			description:
				"Visão consolidada do comportamento das publicações ao longo dos anos.",
		},
		series: {
			title: "Séries temporais por categoria",
			description:
				"Cada linha representa um termo dentro do conjunto completo de artigos.",
			technologyTitle: "Termos de tecnologia",
			technologyDescription:
				"Evolução anual dos termos tecnológicos identificados nos artigos.",
			technologyEmpty:
				"Não há termos tecnológicos com ano de publicação válido nos artigos.",
			environmentalTitle: "Termos ambientais",
			environmentalDescription:
				"Evolução anual dos termos ambientais identificados nos artigos.",
			environmentalEmpty:
				"Não há termos ambientais com ano de publicação válido nos artigos.",
		},
		legend: {
			multipleTechnologies: "Múltiplas tecnologias",
			noTechnology: "Sem tecnologia",
		},
	},
	en: {
		kicker: "Executive Overview",
		title: "General Context of the Results",
		description:
			"This section summarizes the main results of the experiment, focusing on the spatial distribution of articles, how publications changed over time, and the most frequent topics.",
		summary: {
			totalArticles: "Total Articles",
			totalAreas: "Total Areas",
			timeRange: "Time Span",
			unavailable: "Not available",
			mappedLocations: "Mapped Locations",
		},
		timeline: {
			title: "Publication Timeline",
			description:
				"A consolidated view of how publications changed over the years.",
		},
		series: {
			title: "Time series by category",
			description:
				"Each line represents a term across the full set of articles.",
			technologyTitle: "Technology terms",
			technologyDescription:
				"Yearly trend of the technology terms identified in the articles.",
			technologyEmpty:
				"There are no technology terms with a valid publication year in the articles.",
			environmentalTitle: "Environmental terms",
			environmentalDescription:
				"Yearly trend of the environmental terms identified in the articles.",
			environmentalEmpty:
				"There are no environmental terms with a valid publication year in the articles.",
		},
		legend: {
			multipleTechnologies: "Multiple technologies",
			noTechnology: "No technology",
		},
	},
};
