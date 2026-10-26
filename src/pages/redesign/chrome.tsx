import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import TrustpilotWidget from "../../components/TrustpilotWidget";
import { useLocalePath } from "../../i18n/context";
import { LOCALES, NATIVE_NAMES, isLocalizedPath, type Locale } from "../../i18n/locales";
import { useChangeLocale } from "../../i18n/useChangeLocale";
import { prefersReducedMotion } from "./motion";
import { useTx } from "./i18n";
import "./fonts.css";
import "./base.css";

/* Shared shell for the redesign pages (redesign/pages/*.dc.html): the page
   root that scopes each page's CSS, the sticky header and the footer. The
   header and footer carry no CSS of their own; every page's stylesheet has
   the designer's copy of those rules under its own root class. */

export type NavLink = { label: string; href: string; current?: boolean };

/* Internal route ("/lab", "/#services") through the router, in the current
   locale; in-page anchors and external links as plain <a>. */
export function RdLink({
    href,
    className,
    style,
    onClick,
    onPointerEnter,
    ariaLabel,
    children,
    current,
}: {
    href: string;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
    onPointerEnter?: () => void;
    ariaLabel?: string;
    children: ReactNode;
    current?: boolean;
}) {
    const lp = useLocalePath();
    const aria = current ? ("page" as const) : undefined;
    if (href.startsWith("/")) {
        const [path, hash] = href.split("#");
        const to = isLocalizedPath(path) ? lp(path) : path;
        return (
            <Link
                to={to + (hash ? `#${hash}` : "")}
                className={className}
                style={style}
                onClick={onClick}
                onPointerEnter={onPointerEnter}
                aria-label={ariaLabel}
                aria-current={aria}
            >
                {children}
            </Link>
        );
    }
    return (
        <a href={href} className={className} style={style} onClick={onClick} onPointerEnter={onPointerEnter} aria-label={ariaLabel} aria-current={aria}>
            {children}
        </a>
    );
}

/* Page root: scoping class, the designer's root variables, the locale for
   [data-lang] rules, smooth in-page scrolling, and jumping to #hash after a
   route change (the router does not). */
export function RdPage({ name, className, children }: { name: string; className?: string; children: ReactNode }) {
    const tx = useTx();
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = "smooth";
        return () => {
            html.style.scrollBehavior = prev;
        };
    }, []);

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: "instant" });
            return;
        }
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) requestAnimationFrame(() => el.scrollIntoView());
    }, [pathname, hash]);

    return (
        <div className={`rd rd-${name}${className ? " " + className : ""}`} data-lang={tx.locale}>
            {children}
        </div>
    );
}

const MenuIcon = ({ open }: { open: boolean }) =>
    open ? (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    ) : (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );

/* Folded V logo: five facets that fold in once on load (after `delay`
   seconds) and again on hover, at most every 1.6s. Web Animations with
   fill: backwards, so the mark can never be left hidden. */
const FACETS: [string, string][] = [
    ["M4 4 L36 4 L50 46 Z", "#5FD6BF"],
    ["M4 4 L50 46 L38 88 Z", "#1BB59B"],
    ["M96 4 L64 4 L50 46 Z", "#25324d"],
    ["M96 4 L50 46 L62 88 Z", "#0f1b33"],
    ["M38 88 L50 46 L62 88 Z", "#13987F"],
];
const FACET_LAG = [0, 100, 200, 300, 450];

function RdLogo({ href, delay }: { href: string; delay: number }) {
    const markRef = useRef<SVGSVGElement>(null);
    const busy = useRef(false);
    const last = useRef(0);

    const play = (ms: number) => {
        const mark = markRef.current;
        if (!mark || busy.current || !mark.animate || prefersReducedMotion()) return;
        busy.current = true;
        const anims = [...mark.querySelectorAll<SVGPathElement>(".lg-f")].map((f, i) =>
            f.animate(
                [
                    { transform: "scale(.2) rotate(-20deg)", opacity: 0 },
                    { transform: "none", opacity: 1 },
                ],
                {
                    duration: 900,
                    delay: ms + FACET_LAG[i],
                    easing: "cubic-bezier(.2,.9,.25,1.15)",
                    fill: "backwards",
                },
            ),
        );
        Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => {
            busy.current = false;
        });
    };

    useEffect(() => {
        play(delay * 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <RdLink
            href={href}
            className="display lg"
            ariaLabel="Vybd home"
            style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.04em" }}
            onPointerEnter={() => {
                const now = performance.now();
                if (now - last.current < 1600) return;
                last.current = now;
                play(0);
            }}
        >
            <svg className="lg-mark" ref={markRef} viewBox="0 0 100 92" width="28" height="26" aria-hidden="true">
                {FACETS.map(([d, fill]) => (
                    <path key={d} className="lg-f" d={d} fill={fill} />
                ))}
            </svg>
            Vybd
        </RdLink>
    );
}

const LANG_CODES: Record<Locale, string> = { en: "EN", zh: "中文", ko: "한국어", ja: "日本語", fr: "FR", es: "ES" };

/* Header language picker: a pill showing the current code over a native
   select, so the phone's own picker opens. */
function HeaderLanguage() {
    const tx = useTx();
    const changeLocale = useChangeLocale();
    return (
        <label className="nls" title={tx("Language")}>
            <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
            </svg>
            <span className="nls-code">{LANG_CODES[tx.locale]}</span>
            <svg
                className="nls-chev"
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
            <select className="nls-select" aria-label={tx("Language")} value={tx.locale} onChange={(e) => changeLocale(e.target.value)}>
                {LOCALES.map((l) => (
                    <option key={l} value={l} lang={l}>
                        {NATIVE_NAMES[l]}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function RdHeader({
    logoHref,
    links,
    mobileLinks,
    ctaHref = "#contact",
    ctaLabel = "Get started",
    logoDelay = 0.15,
}: {
    logoHref: string;
    /* seconds before the logo folds in; the home page waits out its intro */
    logoDelay?: number;
    links: NavLink[];
    mobileLinks: NavLink[];
    ctaHref?: string;
    ctaLabel?: string;
}) {
    const tx = useTx();
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background: "rgba(255,255,255,.78)",
                backdropFilter: "saturate(180%) blur(20px)",
                WebkitBackdropFilter: "saturate(180%) blur(20px)",
            }}
        >
            <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, height: 56 }}>
                <RdLogo href={logoHref} delay={logoDelay} />
                <nav className="nav-links" style={{ display: "flex", gap: 36 }}>
                    {links.map((l) => (
                        <RdLink key={l.href} className="nav-link" href={l.href} current={l.current}>
                            {tx(l.label)}
                        </RdLink>
                    ))}
                </nav>
                <div className="nav-end">
                    <HeaderLanguage />
                    <RdLink className="btn btn-dark nav-cta" href={ctaHref} style={{ minHeight: 44, padding: "0 18px", fontSize: 14 }}>
                        {tx(ctaLabel)}
                    </RdLink>
                    <button
                        type="button"
                        className="menu-btn"
                        aria-label={tx(open ? "Close menu" : "Open menu")}
                        aria-expanded={open}
                        onClick={() => setOpen((o) => !o)}
                    >
                        <MenuIcon open={open} />
                    </button>
                </div>
            </div>
            {open && (
                <nav className="mnav" aria-label={tx("Menu")}>
                    {mobileLinks.map((l) => (
                        <RdLink key={l.href} href={l.href} onClick={close}>
                            {tx(l.label)}
                        </RdLink>
                    ))}
                    <RdLink className="btn btn-dark" href={ctaHref} onClick={close}>
                        {tx(ctaLabel)}
                    </RdLink>
                </nav>
            )}
        </header>
    );
}

const EMAIL = "hello@vybd.ai";

const FOLLOW: [string, string][] = [
    ["LinkedIn", "https://www.linkedin.com/company/vybdcommerce"],
    ["Instagram", "https://www.instagram.com/vybd.ai/"],
    ["X", "https://x.com/vybdai"],
];

export function RdFooter({ current }: { current?: "product" | "cases" | "lab" }) {
    const tx = useTx();
    const explore: [string, string, boolean][] = [
        ["How It Works", "/product", current === "product"],
        ["Case Studies", "/case-studies", current === "cases"],
        ["Lab", "/lab", current === "lab"],
    ];
    return (
        <footer className="hf-band" style={{ position: "relative" }}>
            <nav className="hf-cols" aria-label={tx("Footer")}>
                <div className="hf-col">
                    <h2 className="hf-head">{tx("Explore")}</h2>
                    <ul>
                        {explore.map(([label, href, cur]) => (
                            <li key={href}>
                                <RdLink href={href} current={cur}>
                                    {tx(label)}
                                </RdLink>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">{tx("Company")}</h2>
                    <ul>
                        {/* TODO(footer): real route, as in HelloFooter */}
                        <li>
                            <a href="#">{tx("About us")}</a>
                        </li>
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">{tx("Follow us")}</h2>
                    <ul>
                        {FOLLOW.map(([label, href]) => (
                            <li key={href}>
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">{tx("Partnership inquiries")}</h2>
                    <ul>
                        <li>
                            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        </li>
                    </ul>
                    <h2 className="hf-head hf-head--gap">{tx("Press inquiries")}</h2>
                    <ul>
                        <li>
                            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="hf-brand" aria-hidden="true">
                <div className="hf-orbit">
                    <div className="hf-ring hf-ring--thin">
                        <div className="hf-planet"></div>
                    </div>
                    <div className="hf-ring hf-ring--thick"></div>
                    <span className="hf-word">Vybd</span>
                </div>
            </div>
            <div className="hf-bottom">
                <div className="hf-tagline">
                    <p className="hf-tagline-main">{tx("Commerce, Coordinated.")}</p>
                    <p className="hf-copy">© 2026 Vybd</p>
                </div>
                <div className="hf-trust">
                    <TrustpilotWidget key={tx.locale} locale={tx.locale} />
                </div>
                <div className="hf-legal">
                    <LanguageSwitcher />
                    <div className="hf-legal-links">
                        <RdLink href="/privacy">{tx("Privacy and cookie policy")}</RdLink>
                        <RdLink href="/terms">{tx("Terms")}</RdLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}
