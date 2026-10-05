import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { HTML_LANG, LOCALES, SITE_ORIGIN, localePath, stripLocale, type Locale } from "./locales";
import { LocaleContext } from "./context";
import { MESSAGES } from "./messages";

function setHeadTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
    let el = document.head.querySelector<HTMLElement>(selector);
    const created = !el;
    el ??= document.head.appendChild(create());
    const prev = el.getAttribute(attr);
    el.setAttribute(attr, value);
    return () => {
        if (created) el.remove();
        else if (prev !== null) el.setAttribute(attr, prev);
    };
}

/* Wraps a localized route: provides the locale to everything inside and,
   while mounted, sets <html lang>, the canonical URL, the meta description
   and hreflang links to the page's other languages. Everything is put back
   on the way out, so unlocalized routes keep index.html's head. */
export default function LocaleScope({ locale, children }: { locale: Locale; children: ReactNode }) {
    const { pathname } = useLocation();
    const basePath = stripLocale(pathname);

    useEffect(() => {
        const html = document.documentElement;
        const prevLang = html.lang;
        html.lang = HTML_LANG[locale];

        const undo = [
            setHeadTag(
                'link[rel="canonical"]',
                () => Object.assign(document.createElement("link"), { rel: "canonical" }),
                "href",
                SITE_ORIGIN + localePath(locale, basePath)
            ),
            setHeadTag(
                'meta[name="description"]',
                () => Object.assign(document.createElement("meta"), { name: "description" }),
                "content",
                MESSAGES[locale].meta.homeDescription
            ),
        ];

        const alternates = [...LOCALES.map((l) => [HTML_LANG[l], l] as const), ["x-default", "en"] as const].map(
            ([hreflang, l]) => {
                const link = document.createElement("link");
                link.rel = "alternate";
                link.hreflang = hreflang;
                link.href = SITE_ORIGIN + localePath(l, basePath);
                return document.head.appendChild(link);
            }
        );

        return () => {
            html.lang = prevLang;
            undo.forEach((fn) => fn());
            alternates.forEach((l) => l.remove());
        };
    }, [locale, basePath]);

    return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
