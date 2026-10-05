import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, localePath, type Locale } from "./locales";
import { MESSAGES } from "./messages";

export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function useLocale() {
    return useContext(LocaleContext);
}

/* The current locale's copy. */
export function useT() {
    return MESSAGES[useLocale()];
}

/* Maps an English path to the current locale's: "/book" → "/zh/book". */
export function useLocalePath() {
    const locale = useLocale();
    return (path: string) => localePath(locale, path);
}
