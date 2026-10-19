export const LOCALES = ["pt", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
	return value === "pt" || value === "en";
}

export function localeTag(locale: Locale): string {
	return locale === "pt" ? "pt-BR" : "en";
}

export function formatNumber(locale: Locale, value: number): string {
	return new Intl.NumberFormat(localeTag(locale)).format(value);
}
