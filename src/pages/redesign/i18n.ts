import { use, useMemo } from "react";
import { useLocale } from "../../i18n/context";
import type { Locale } from "../../i18n/locales";

/* Translations for the redesign pages, keyed by the English text exactly as
   the designer's prototype keys them (redesign/i18n/tr*.py, built into
   ./i18n/<locale>.json by tools/import_redesign_i18n.py). Lookup mirrors the
   prototype's runtime: exact match, then "{n}" number patterns, then
   "A (B)" and "A: B" built from translated parts. Anything missing stays in
   English. */

type Entry = string | string[] | Record<string, string>;
type Dict = Record<string, Entry>;

const loaders = import.meta.glob<Dict>("./i18n/*.json", { import: "default" });
const pending = new Map<Locale, Promise<Dict>>();

function loadDict(locale: Locale): Promise<Dict> {
    let p = pending.get(locale);
    if (!p) {
        const load = loaders[`./i18n/${locale}.json`];
        p = load ? load() : Promise.resolve({});
        pending.set(locale, p);
    }
    return p;
}

export type Tx = ((en: string) => string) & {
    /* A rich block (a heading with <em> parts, say): one string per text
       segment of the English markup. */
    seg: (key: string, en: string[]) => string[];
    locale: Locale;
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function makeTx(locale: Locale, dict: Dict | null): Tx {
    const cjk = locale === "zh" || locale === "ja";
    let patterns: [RegExp, string][] | null = null;

    const lookup = (t: string): string | null => {
        if (!dict) return null;
        const hit = dict[t];
        if (typeof hit === "string") return hit;
        if (!patterns) {
            patterns = Object.keys(dict)
                .filter((k) => k.includes("{n}") && typeof dict[k] === "string")
                .map((k) => [new RegExp("^" + escape(k).replace(/\\\{n\\\}/g, "([\\d,.]+)") + "$"), dict[k] as string]);
        }
        for (const [re, out] of patterns) {
            const m = t.match(re);
            if (m) {
                let i = 1;
                return out.replace(/\{n\}/g, () => m[i++]);
            }
        }
        const paren = t.match(/^(.+?) \(([^)]+)\)$/);
        if (paren) {
            const a = lookup(paren[1]);
            const b = lookup(paren[2]);
            if (a || b) return `${a || paren[1]} (${b || paren[2]})`;
        }
        const k = t.indexOf(": ");
        if (k > 0) {
            const a = lookup(t.slice(0, k));
            const b = lookup(t.slice(k + 2));
            if (a || b) return (a || t.slice(0, k)) + (cjk ? "：" : ": ") + (b || t.slice(k + 2));
        }
        return null;
    };

    const tx = ((en: string) => {
        if (!dict || !/[A-Za-z]/.test(en)) return en;
        const out = lookup(en.replace(/\s+/g, " ").trim());
        return out == null ? en : en.match(/^\s*/)![0] + out + en.match(/\s*$/)![0];
    }) as Tx;

    tx.seg = (key, en) => {
        const v = dict?.["#" + key];
        if (v == null || (typeof v !== "string" && !Array.isArray(v))) return en;
        let j = 0;
        return en.map((part) => {
            if (!/\S/.test(part)) return cjk ? "" : part;
            const out = typeof v === "string" ? (j === 0 ? v : "") : (v[j] ?? "");
            j++;
            return out;
        });
    };
    tx.locale = locale;
    return tx;
}

/* Suspends (once per locale) while that locale's dictionary loads; English
   needs none. Needs a <Suspense> above it, which the lazy routes provide. */
export function useTx(): Tx {
    const locale = useLocale();
    const dict = locale === "en" ? null : use(loadDict(locale));
    return useMemo(() => makeTx(locale, dict), [locale, dict]);
}
