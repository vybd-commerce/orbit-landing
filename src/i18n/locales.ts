/* Languages the site speaks. English lives at the bare paths (/ and /book);
   every other locale is a path prefix (/zh, /zh/book). middleware.ts mirrors
   LOCALES and LANG_COOKIE, so keep the two in step. */

export const LOCALES = ["en", "zh", "ko", "ja", "fr", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/* Value for <html lang> and hreflang. */
export const HTML_LANG: Record<Locale, string> = {
    en: "en",
    zh: "zh-CN",
    ko: "ko",
    ja: "ja",
    fr: "fr",
    es: "es",
};

/* Each language named in itself, for the switcher. */
export const NATIVE_NAMES: Record<Locale, string> = {
    en: "English",
    zh: "简体中文",
    ko: "한국어",
    ja: "日本語",
    fr: "Français",
    es: "Español",
};

/* Pages that exist in every locale, as their English paths. */
export const LOCALIZED_PATHS = ["/", "/book", "/book/thanks"] as const;

/* Set when someone picks a language; middleware.ts then stops guessing. */
export const LANG_COOKIE = "vybd_lang";

export const SITE_ORIGIN = "https://www.vybd.ai";

export function isLocale(v: string | undefined): v is Locale {
    return (LOCALES as readonly string[]).includes(v ?? "");
}

/* "/book" in "zh" → "/zh/book"; "/" in "zh" → "/zh". */
export function localePath(locale: Locale, path: string) {
    if (locale === DEFAULT_LOCALE) return path;
    return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/* "/zh/book" → "/book"; "/zh" → "/". */
export function stripLocale(pathname: string) {
    const [, first, ...rest] = pathname.split("/");
    if (!isLocale(first) || first === DEFAULT_LOCALE) return pathname;
    return `/${rest.join("/")}`;
}

export function rememberLocale(locale: Locale) {
    document.cookie = `${LANG_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
