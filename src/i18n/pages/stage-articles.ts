import { formatNumber, type Locale } from "@/i18n/locale";

export type StageArticlesCopy = {
	selectedArea: string;
	showingSummary: (count: number, filtered: boolean) => string;
	filterByTerms: string;
	clearFilters: string;
	technologyTerms: string;
	environmentalTerms: string;
	viewArticles: string;
	noTechnologyTerms: string;
	noEnvironmentalTerms: string;
	articlesPerPage: string;
	applyFilters: string;
	articleListAria: (stageName: string) => string;
	showingRange: (start: number, end: number, total: number) => string;
	emptyTitle: string;
	emptyBody: string;
	paginationAria: string;
	previous: string;
	pageStatus: (current: number, total: number) => string;
	next: string;
	metadata: {
		date: string;
		authors: string;
		technology: string;
		environmental: string;
	};
	loadError: string;
	errorTitle: string;
	unexpectedError: string;
	tryAgain: string;
};

export const stageArticlesCopy: Record<Locale, StageArticlesCopy> = {
	pt: {
		selectedArea: "Área selecionada",
		showingSummary: (count, filtered) =>
			`Exibindo ${formatNumber("pt", count)} artigos e pesquisas acadêmicas${
				filtered ? " (com filtros de termos aplicados)" : ""
			}`,
		filterByTerms: "Filtrar por termos",
		clearFilters: "Limpar filtros",
		technologyTerms: "Termos de tecnologia",
		environmentalTerms: "Termos ambientais",
		viewArticles: "Ver artigos",
		noTechnologyTerms: "Não há termos de tecnologia nesta área.",
		noEnvironmentalTerms: "Não há termos ambientais nesta área.",
		articlesPerPage: "Artigos por página",
		applyFilters: "Aplicar filtros",
		articleListAria: (stageName) => `Lista de artigos da área ${stageName}`,
		showingRange: (start, end, total) =>
			`Mostrando ${formatNumber("pt", start)}–${formatNumber("pt", end)} de ${formatNumber("pt", total)} artigos`,
		emptyTitle: "Nenhum artigo encontrado",
		emptyBody: "Não há artigos disponíveis para esta área no momento.",
		paginationAria: "Paginação de artigos",
		previous: "Anterior",
		pageStatus: (current, total) =>
			`Página ${formatNumber("pt", current)} de ${formatNumber("pt", total)}`,
		next: "Próxima",
		metadata: {
			date: "Data",
			authors: "Autores",
			technology: "Tecnologia",
			environmental: "Ambientais",
		},
		loadError: "Falha ao carregar os artigos.",
		errorTitle: "Não foi possível carregar os artigos",
		unexpectedError: "Ocorreu um erro inesperado.",
		tryAgain: "Tentar novamente",
	},
	en: {
		selectedArea: "Selected area",
		showingSummary: (count, filtered) => {
			const noun =
				count === 1
					? "article and academic study"
					: "articles and academic studies";
			return `Showing ${formatNumber("en", count)} ${noun}${
				filtered ? " (with term filters applied)" : ""
			}`;
		},
		filterByTerms: "Filter by terms",
		clearFilters: "Clear filters",
		technologyTerms: "Technology terms",
		environmentalTerms: "Environmental terms",
		viewArticles: "View articles",
		noTechnologyTerms: "There are no technology terms in this area.",
		noEnvironmentalTerms: "There are no environmental terms in this area.",
		articlesPerPage: "Articles per page",
		applyFilters: "Apply filters",
		articleListAria: (stageName) => `Article list for ${stageName}`,
		showingRange: (start, end, total) =>
			`Showing ${formatNumber("en", start)}–${formatNumber("en", end)} of ${formatNumber("en", total)} ${total === 1 ? "article" : "articles"}`,
		emptyTitle: "No articles found",
		emptyBody: "No articles are available for this area right now.",
		paginationAria: "Article pagination",
		previous: "Previous",
		pageStatus: (current, total) =>
			`Page ${formatNumber("en", current)} of ${formatNumber("en", total)}`,
		next: "Next",
		metadata: {
			date: "Date",
			authors: "Authors",
			technology: "Technology",
			environmental: "Environmental",
		},
		loadError: "Failed to load the articles.",
		errorTitle: "Could not load the articles",
		unexpectedError: "An unexpected error occurred.",
		tryAgain: "Try again",
	},
};
