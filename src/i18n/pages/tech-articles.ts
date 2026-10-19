import { formatNumber, type Locale } from "@/i18n/locale";

export type TechArticlesCopy = {
	selected: string;
	showing: (count: number, techName: string, filtered: boolean) => string;
	filterByTerms: string;
	clearFilters: string;
	technologyTerms: string;
	environmentalTerms: string;
	viewArticles: string;
	noTechnologyTerms: string;
	noEnvironmentalTerms: string;
	articlesPerPage: string;
	applyFilters: string;
	articleListAria: (techName: string) => string;
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
};

export const techArticlesCopy: Record<Locale, TechArticlesCopy> = {
	pt: {
		selected: "Tecnologia selecionada",
		showing: (count, techName, filtered) =>
			`Exibindo ${formatNumber("pt", count)} artigos que mencionam ${techName}${
				filtered ? " (com filtros de termos aplicados)" : ""
			}`,
		filterByTerms: "Filtrar por termos",
		clearFilters: "Limpar filtros",
		technologyTerms: "Termos de tecnologia",
		environmentalTerms: "Termos ambientais",
		viewArticles: "Ver artigos",
		noTechnologyTerms: "Não há termos de tecnologia nesta seleção.",
		noEnvironmentalTerms: "Não há termos ambientais nesta seleção.",
		articlesPerPage: "Artigos por página",
		applyFilters: "Aplicar filtros",
		articleListAria: (techName) => `Lista de artigos da tecnologia ${techName}`,
		showingRange: (start, end, total) =>
			`Mostrando ${formatNumber("pt", start)}–${formatNumber("pt", end)} de ${formatNumber("pt", total)} artigos`,
		emptyTitle: "Nenhum artigo encontrado",
		emptyBody: "Não há artigos disponíveis para esta tecnologia no momento.",
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
	},
	en: {
		selected: "Selected technology",
		showing: (count, techName, filtered) => {
			const noun = count === 1 ? "article" : "articles";
			const verb = count === 1 ? "mentions" : "mention";
			return `Showing ${formatNumber("en", count)} ${noun} that ${verb} ${techName}${
				filtered ? " (with term filters applied)" : ""
			}`;
		},
		filterByTerms: "Filter by terms",
		clearFilters: "Clear filters",
		technologyTerms: "Technology terms",
		environmentalTerms: "Environmental terms",
		viewArticles: "View articles",
		noTechnologyTerms: "There are no technology terms in this selection.",
		noEnvironmentalTerms: "There are no environmental terms in this selection.",
		articlesPerPage: "Articles per page",
		applyFilters: "Apply filters",
		articleListAria: (techName) => `Article list for ${techName}`,
		showingRange: (start, end, total) =>
			`Showing ${formatNumber("en", start)}–${formatNumber("en", end)} of ${formatNumber("en", total)} ${total === 1 ? "article" : "articles"}`,
		emptyTitle: "No articles found",
		emptyBody: "No articles are available for this technology right now.",
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
	},
};
