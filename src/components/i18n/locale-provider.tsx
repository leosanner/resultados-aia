"use client";

import { createContext, useContext } from "react";

import { landingCopy, type LandingCopy } from "@/i18n/landing";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/locale";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
	locale,
	children,
}: {
	locale: Locale;
	children: React.ReactNode;
}) {
	return (
		<LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
	);
}

export function useLocale() {
	return useContext(LocaleContext);
}

export function useLandingCopy(): LandingCopy {
	return landingCopy[useLocale()];
}
