import { TecTerm, tecTerms } from "@/model/article";

export function tecTermToSlug(term: TecTerm): string {
	return term.toLowerCase().replace(/\s+/g, "-");
}

export function slugToTecTerm(slug: string): TecTerm | undefined {
	const normalized = slug.toLowerCase();
	return tecTerms.find((term) => tecTermToSlug(term) === normalized);
}

export function formatTecTermLabel(term: TecTerm): string {
	return term;
}
