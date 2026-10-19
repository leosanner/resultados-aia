import { formatNumber, type Locale } from "@/i18n/locale";

export type AutoresCopy = {
	kicker: string;
	title: string;
	subtitle: string;
	authorCount: (count: number) => string;
	publicationCount: (count: number) => string;
	pageStatus: (current: number, total: number) => string;
	previous: string;
	next: string;
};

function fixedCount(locale: Locale, count: number, label: string) {
	return `${formatNumber(locale, count)} ${label}`;
}

function pluralCount(locale: Locale, count: number, one: string, many: string) {
	return `${formatNumber(locale, count)} ${count === 1 ? one : many}`;
}

export const autoresCopy: Record<Locale, AutoresCopy> = {
	pt: {
		kicker: "Novo Painel",
		title: "Autores por Tecnologia",
		subtitle:
			"Ranking de autores por tecnologia da string de busca, ordenados por total de publicações.",
		authorCount: (count) => fixedCount("pt", count, "autores"),
		publicationCount: (count) => fixedCount("pt", count, "publicações"),
		pageStatus: (current, total) => `Página ${current} de ${total}`,
		previous: "Anterior",
		next: "Próxima",
	},
	en: {
		kicker: "New panel",
		title: "Authors by Technology",
		subtitle:
			"Ranking of authors by technology from the search string, ordered by total publications.",
		authorCount: (count) => pluralCount("en", count, "author", "authors"),
		publicationCount: (count) =>
			pluralCount("en", count, "publication", "publications"),
		pageStatus: (current, total) => `Page ${current} of ${total}`,
		previous: "Previous",
		next: "Next",
	},
};
