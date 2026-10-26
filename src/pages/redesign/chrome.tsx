import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import TrustpilotWidget from "../../components/TrustpilotWidget";
import { useLocalePath } from "../../i18n/context";
import { isLocalizedPath } from "../../i18n/locales";
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
    children,
    current,
}: {
    href: string;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
    children: ReactNode;
    current?: boolean;
}) {
    const lp = useLocalePath();
    const aria = current ? ("page" as const) : undefined;
    if (href.startsWith("/")) {
        const [path, hash] = href.split("#");
        const to = isLocalizedPath(path) ? lp(path) : path;
        return (
            <Link to={to + (hash ? `#${hash}` : "")} className={className} style={style} onClick={onClick} aria-current={aria}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} className={className} style={style} onClick={onClick} aria-current={aria}>
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

export function RdHeader({
    logoHref,
    links,
    mobileLinks,
    ctaHref = "#contact",
    ctaLabel = "Get started",
}: {
    logoHref: string;
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
                <RdLink href={logoHref} className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.04em" }}>
                    Vybd
                </RdLink>
                <nav className="nav-links" style={{ display: "flex", gap: 36 }}>
                    {links.map((l) => (
                        <RdLink key={l.href} className="nav-link" href={l.href} current={l.current}>
                            {tx(l.label)}
                        </RdLink>
                    ))}
                </nav>
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
