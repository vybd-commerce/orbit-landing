import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale, useT } from "../i18n/context";
import type { Locale } from "../i18n/locales";
import type { Messages } from "../i18n/messages";
import "./HelloFooter.css";

/* ── Content (edit here) ─────────────────────────────────────────────────
   Anything in [brackets] is a placeholder: no real address, handle or
   registration detail exists in the codebase yet, so none is invented. */

type Link = { label: string; href: string };

/* Labels are per language (the copy's footer section); brand names in
   FOLLOW stay as they are. */
const explore = (f: Messages["footer"]): Link[] => [
    { label: f.howItWorks, href: "/product" },
    { label: f.solutions, href: "/#functions" },
    { label: f.caseStudies, href: "/case-studies" },
    { label: f.lab, href: "/lab" },
];

/* /rainmaker exists in English, Chinese and Korean; other languages get the
   English page. */
const rainmakerPath = (locale: Locale) => (locale === "zh" || locale === "ko" ? `/${locale}/rainmaker` : "/rainmaker");

const company = (f: Messages["footer"], locale: Locale): Link[] => [
    { label: f.about, href: "#" }, // TODO(footer): real routes
    { label: f.careers, href: "#" },
    { label: f.events, href: "#" },
    { label: f.rainmaker, href: rainmakerPath(locale) },
];

const FOLLOW: Link[] = [
    { label: "LinkedIn", href: "#" }, // TODO(footer): profile URLs
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
];

/* One inbox for partnership and press alike. */
const PARTNERSHIP_EMAIL = "hello@vybd.ai";
const PRESS_EMAIL = "hello@vybd.ai";
const MEDIA_KIT_HREF = "#"; // TODO(footer): media kit file

/* TODO(footer): swap in the exact registered entity name (e.g. "Vybd, Inc."). */
const COPYRIGHT = `© ${new Date().getFullYear()} Vybd`;

const legal = (f: Messages["footer"]): Link[] => [
    { label: f.privacy, href: "/privacy" },
    { label: f.terms, href: "/terms" },
];

/* ── Footer ──────────────────────────────────────────────────────────── */

/* /hello footer: a dark band with the link columns up top, the orbiting
   Vybd wordmark from the main site's footer in the middle, and the tagline
   with the legal links along the bottom. */
export default function HelloFooter() {
    const f = useT().footer;
    const locale = useLocale();
    return (
        <footer className="hf-band">
            <nav className="hf-cols" aria-label={f.nav}>
                <div className="hf-col">
                    <h2 className="hf-head">{f.explore}</h2>
                    <ul>
                        {explore(f).map((l) => (
                            <li key={l.label}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">{f.company}</h2>
                    <ul>
                        {company(f, locale).map((l) => (
                            <li key={l.label}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">{f.follow}</h2>
                    <ul>
                        {FOLLOW.map((l) => (
                            <li key={l.label}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">{f.partnership}</h2>
                    <ul>
                        <li>
                            <a href={`mailto:${PARTNERSHIP_EMAIL}`}>{PARTNERSHIP_EMAIL}</a>
                        </li>
                    </ul>
                    <h2 className="hf-head hf-head--gap">{f.press}</h2>
                    <ul>
                        <li>
                            <a href={`mailto:${PRESS_EMAIL}`}>{PRESS_EMAIL}</a>
                        </li>
                        <li>
                            <a href={MEDIA_KIT_HREF}>{f.mediaKit}</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="hf-brand" aria-hidden="true">
                <div className="hf-orbit">
                    <div className="hf-ring hf-ring--thin">
                        <div className="hf-planet" />
                    </div>
                    <div className="hf-ring hf-ring--thick" />
                    <span className="hf-word">Vybd</span>
                </div>
            </div>

            <div className="hf-bottom">
                <div className="hf-tagline">
                    <p className="hf-tagline-main">{f.tagline}</p>
                    <p className="hf-copy">{COPYRIGHT}</p>
                </div>
                <div className="hf-legal">
                    <LanguageSwitcher />
                    <div className="hf-legal-links">
                        {legal(f).map((l) => (
                            <a key={l.label} href={l.href}>
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
