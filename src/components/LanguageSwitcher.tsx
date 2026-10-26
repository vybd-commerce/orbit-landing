import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useT } from "../i18n/context";
import { LOCALES, NATIVE_NAMES } from "../i18n/locales";
import { useChangeLocale } from "../i18n/useChangeLocale";
import "./LanguageSwitcher.css";

/* Native select, so it works with any keyboard, screen reader and phone
   picker. */
export default function LanguageSwitcher() {
    const locale = useLocale();
    const t = useT();
    const changeLocale = useChangeLocale();

    return (
        <label className="ls">
            <Globe className="ls-globe" aria-hidden="true" />
            <span className="ls-sr">{t.header.language}</span>
            <select
                className="ls-select"
                value={locale}
                onChange={(e) => changeLocale(e.target.value)}
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
