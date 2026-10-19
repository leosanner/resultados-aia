import { formatNumber, type Locale } from "@/i18n/locale";

export type TermosCopy = {
	kicker: string;
	titleAll: string;
	titleSelected: string;
	titleDefault: string;
	subtitleAll: (count: number) => string;
	subtitleSelected: (count: number) => string;
	subtitleDefault: string;
	total: string;
	techTerms: string;
	envTerms: string;
	selectedHeading: string;
	activeFilters: (count: number) => string;
	clearFilters: string;
	technologyTerms: string;
	environmentalTerms: string;
	techBadge: (term: string) => string;
	envBadge: (term: string) => string;
	removeFilter: (label: string) => string;
	exportHeading: string;
	exportBody: string;
	downloadCsv: string;
	downloadDocx: string;
	trendsHeading: string;
	trendsBody: string;
	technologyLinesSelected: string;
	technologyLinesAll: string;
	environmentalLinesSelected: string;
	environmentalLinesAll: string;
	technologyEmpty: string;
	environmentalEmpty: string;
	multipleTechnologies: string;
	noTechnology: string;
	showing: (start: number, end: number, total: number) => string;
	articleListAria: string;
	metaDate: string;
	metaAuthors: string;
	metaTechnology: string;
	metaEnvironmental: string;
	paginationAria: string;
	previous: string;
	pageOf: (page: number, total: number) => string;
	next: string;
	emptyTitle: string;
	emptyBody: string;
};

function countLabel(locale: Locale, count: number, one: string, many: string) {
	return `${formatNumber(locale, count)} ${count === 1 ? one : many}`;
}

export const termosCopy: Record<Locale, TermosCopy> = {
	pt: {
		kicker: "Filtro por termos",
		titleAll: "Todos os resultados do grafo",
		titleSelected: "Resultados por termos selecionados",
		titleDefault: "Resultados por termos",
		subtitleAll: (count) =>
			`${formatNumber("pt", count)} artigos encontrados sem filtros aplicados.`,
		subtitleSelected: (count) =>
			`${formatNumber("pt", count)} artigos encontrados.`,
		subtitleDefault: "Resultados carregados.",
		total: "Total",
		techTerms: "Termos Tec",
		envTerms: "Termos Env",
		selectedHeading: "Termos selecionados",
		activeFilters: (count) =>
			`${formatNumber("pt", count)} filtros ativos nos resultados do grafo.`,
		clearFilters: "Limpar filtros",
		technologyTerms: "Termos de tecnologia",
		environmentalTerms: "Termos ambientais",
		techBadge: (term) => `Tec: ${term}`,
		envBadge: (term) => `Env: ${term}`,
		removeFilter: (label) => `Remover filtro ${label}`,
		exportHeading: "Exportar resultados",
		exportBody: "Baixe a seleção atual em formato tabular ou relatório.",
		downloadCsv: "Baixar CSV",
		downloadDocx: "Baixar DOCX",
		trendsHeading: "Tendências temporais",
		trendsBody:
			"Cada linha representa um termo dentro do conjunto de artigos já filtrado no grafo.",
		technologyLinesSelected:
			"Linhas geradas apenas para os termos tecnológicos selecionados.",
		technologyLinesAll:
			"Nenhum termo tecnológico foi selecionado; o gráfico considera todos os termos tecnológicos presentes nos artigos filtrados.",
		environmentalLinesSelected:
			"Linhas geradas apenas para os termos ambientais selecionados.",
		environmentalLinesAll:
			"Nenhum termo ambiental foi selecionado; o gráfico considera todos os termos ambientais presentes nos artigos filtrados.",
		technologyEmpty:
			"Não há termos tecnológicos com ano de publicação válido nos artigos filtrados.",
		environmentalEmpty:
			"Não há termos ambientais com ano de publicação válido nos artigos filtrados.",
		multipleTechnologies: "Múltiplas tecnologias",
		noTechnology: "Sem tecnologia",
		showing: (start, end, total) =>
			`Mostrando ${formatNumber("pt", start)}–${formatNumber("pt", end)} de ${formatNumber("pt", total)} artigos`,
		articleListAria: "Lista de artigos filtrados por termos",
		metaDate: "Data",
		metaAuthors: "Autores",
		metaTechnology: "Tecnologia",
		metaEnvironmental: "Ambientais",
		paginationAria: "Paginação de artigos",
		previous: "Anterior",
		pageOf: (page, total) =>
			`Página ${formatNumber("pt", page)} de ${formatNumber("pt", total)}`,
		next: "Próxima",
		emptyTitle: "Nenhum artigo encontrado",
		emptyBody:
			"Não encontramos artigos para a combinação de termos selecionada.",
	},
	en: {
		kicker: "Filter by terms",
		titleAll: "All graph results",
		titleSelected: "Results for the selected terms",
		titleDefault: "Results by terms",
		subtitleAll: (count) =>
			`${countLabel("en", count, "article", "articles")} found with no filters applied.`,
		subtitleSelected: (count) =>
			`${countLabel("en", count, "article", "articles")} found.`,
		subtitleDefault: "Results loaded.",
		total: "Total",
		techTerms: "Tech terms",
		envTerms: "Env terms",
		selectedHeading: "Selected terms",
		activeFilters: (count) =>
			`${countLabel("en", count, "active filter", "active filters")} in the graph results.`,
		clearFilters: "Clear filters",
		technologyTerms: "Technology terms",
		environmentalTerms: "Environmental terms",
		techBadge: (term) => `Tech: ${term}`,
		envBadge: (term) => `Env: ${term}`,
		removeFilter: (label) => `Remove filter ${label}`,
		exportHeading: "Export results",
		exportBody: "Download the current selection as a table or a report.",
		downloadCsv: "Download CSV",
		downloadDocx: "Download DOCX",
		trendsHeading: "Trends over time",
		trendsBody:
			"Each line is one term within the set of articles already filtered in the graph.",
		technologyLinesSelected:
			"Lines are drawn only for the selected technology terms.",
		technologyLinesAll:
			"No technology term was selected; the chart includes every technology term present in the filtered articles.",
		environmentalLinesSelected:
			"Lines are drawn only for the selected environmental terms.",
		environmentalLinesAll:
			"No environmental term was selected; the chart includes every environmental term present in the filtered articles.",
		technologyEmpty:
			"The filtered articles have no technology terms with a valid publication year.",
		environmentalEmpty:
			"The filtered articles have no environmental terms with a valid publication year.",
		multipleTechnologies: "Multiple technologies",
		noTechnology: "No technology",
		showing: (start, end, total) =>
			`Showing ${formatNumber("en", start)}–${formatNumber("en", end)} of ${countLabel("en", total, "article", "articles")}`,
		articleListAria: "List of articles filtered by terms",
		metaDate: "Date",
		metaAuthors: "Authors",
		metaTechnology: "Technology",
		metaEnvironmental: "Environmental",
		paginationAria: "Article pagination",
		previous: "Previous",
		pageOf: (page, total) =>
			`Page ${formatNumber("en", page)} of ${formatNumber("en", total)}`,
		next: "Next",
		emptyTitle: "No articles found",
		emptyBody: "No articles matched the selected combination of terms.",
	},
};
