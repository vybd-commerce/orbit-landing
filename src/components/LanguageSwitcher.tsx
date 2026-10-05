import { ChevronDown, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocale, useT } from "../i18n/context";
import { LOCALES, NATIVE_NAMES, isLocale, localePath, rememberLocale, stripLocale } from "../i18n/locales";
import { track } from "../lib/analytics";
import "./LanguageSwitcher.css";

/* Native select, so it works with any keyboard, screen reader and phone
   picker. Picking a language remembers it (middleware.ts stops guessing)
   and moves to the same page in that language. */
export default function LanguageSwitcher() {
    const locale = useLocale();
    const t = useT();
    const navigate = useNavigate();
    const { pathname, search, hash } = useLocation();

    return (
        <label className="ls">
            <Globe className="ls-globe" aria-hidden="true" />
            <span className="ls-sr">{t.header.language}</span>
            <select
                className="ls-select"
                value={locale}
                onChange={(e) => {
                    const next = e.target.value;
                    if (!isLocale(next)) return;
                    rememberLocale(next);
                    track("language_changed", { from: locale, to: next });
                    navigate(localePath(next, stripLocale(pathname)) + search + hash);
                }}
            >
                {LOCALES.map((l) => (
                    <option key={l} value={l} lang={l}>
                        {NATIVE_NAMES[l]}
                    </option>
                ))}
            </select>
            <ChevronDown className="ls-chevron" aria-hidden="true" />
        </label>
    );
}
