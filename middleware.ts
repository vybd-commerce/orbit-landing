/* Vercel Routing Middleware: sends a first-time visitor on / or /book to the
   same page in their language (/zh, /ko/book, ...).

   The browser's language comes first: a VPN changes the visitor's IP, not
   the language their phone or laptop is set to, so a founder in Shenzhen on
   a US VPN still gets Chinese. Only when the browser asks for English (or
   nothing we speak) does the IP country decide, e.g. an English laptop in
   Seoul gets Korean.

   It never overrides a choice: once someone picks a language in the
   switcher (the vybd_lang cookie), or for crawlers, the URL is served as is.
   Keep LOCALES and LANG_COOKIE in step with src/i18n/locales.ts. */

const LOCALES = ["en", "zh", "ko", "ja", "fr", "es"];
const LANG_COOKIE = "vybd_lang";

/* Countries whose visitors get a locale when their browser says English. */
const COUNTRY_LOCALE: Record<string, string> = {
    CN: "zh",
    TW: "zh",
    HK: "zh",
    MO: "zh",
    SG: "zh",
    KR: "ko",
    JP: "ja",
    FR: "fr",
    BE: "fr",
    LU: "fr",
    MC: "fr",
    ES: "es",
    MX: "es",
    AR: "es",
    CO: "es",
    CL: "es",
    PE: "es",
    VE: "es",
    EC: "es",
    GT: "es",
    CU: "es",
    BO: "es",
    DO: "es",
    HN: "es",
    PY: "es",
    SV: "es",
    NI: "es",
    CR: "es",
    PA: "es",
    UY: "es",
};

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|headless/i;

export const config = {
    matcher: ["/", "/book"],
};

/* First language in Accept-Language (by q-value) that we speak. */
function fromAcceptLanguage(header: string | null) {
    if (!header) return null;
    const ranked = header
        .split(",")
        .map((part, i) => {
            const [tag, ...params] = part.trim().toLowerCase().split(";");
            const q = params.find((p) => p.trim().startsWith("q="));
            return { lang: tag.split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1, i };
        })
        .filter((r) => r.q > 0)
        .sort((a, b) => b.q - a.q || a.i - b.i);
    return ranked.find((r) => LOCALES.includes(r.lang))?.lang ?? null;
}

function cookie(header: string | null, name: string) {
    return header
        ?.split(";")
        .map((c) => c.trim().split("="))
        .find(([k]) => k === name)?.[1];
}

export default function middleware(request: Request) {
    const headers = request.headers;
    if (cookie(headers.get("cookie"), LANG_COOKIE)) return;
    if (BOT.test(headers.get("user-agent") ?? "")) return;

    const browser = fromAcceptLanguage(headers.get("accept-language"));
    const locale =
        browser && browser !== "en" ? browser : COUNTRY_LOCALE[headers.get("x-vercel-ip-country") ?? ""] ?? "en";
    if (locale === "en") return;

    const url = new URL(request.url);
    url.pathname = url.pathname === "/" ? `/${locale}` : `/${locale}${url.pathname}`;
    return new Response(null, {
        status: 307,
        headers: {
            Location: url.toString(),
            /* The answer depends on these, so caches must not share it. */
            Vary: "Accept-Language, Cookie",
        },
    });
}
