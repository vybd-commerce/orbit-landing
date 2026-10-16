import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useLocalePath } from "../../i18n/context";
import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { CASES, type CaseGroup } from "./cases";
import { useTx, type Tx } from "./i18n";
import { prefersReducedMotion } from "./motion";
import "./CaseStudiesPage.css";

/* Case study index, ported from redesign/pages/CaseStudies.dc.html. */

const FILTERS: [CaseGroup | "all", string][] = [
    ["all", "All"],
    ["food", "Food & Beverage"],
    ["retail", "Retail"],
    ["fashion", "Fashion"],
    ["art", "Art"],
    ["health", "Health"],
];

const TICKS = [
    ["$12K", "more revenue", "Karma"],
    ["$10K+", "revenue generated", "Kashida Layone"],
    ["24%", "more growth", "Karma"],
    ["30%", "more site visitors", "Kashida Layone"],
    ["100%", "meets US rules", "TanRom Lifesciences"],
    ["3", "sales channels opened", "Flavor Atlas"],
    ["100+", "buying searches ranked", "Karma"],
];

const TAG_ROT = [-4, 3, -2, 5, -3, 2];
const TAG_K = [10, -14, 18, -8, 14, -12];

/* Counts every number on the cards up from 0, card by card. */
function countUp(grid: HTMLElement | null) {
    if (!grid) return;
    const reduce = prefersReducedMotion();
    grid.querySelectorAll(".cs-card").forEach((card, ci) => {
        card.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
            const full = el.getAttribute("data-count") ?? "";
            const m = full.match(/^(\D*)(\d+)(.*)$/);
            if (!m || reduce) {
                el.textContent = full;
                return;
            }
            const target = parseInt(m[2], 10),
                start = performance.now() + 250 + ci * 110,
                dur = 1200;
            el.textContent = m[1] + "0" + m[3];
            const step = (now: number) => {
                const t = Math.min(1, Math.max(0, (now - start) / dur));
                const e = 1 - Math.pow(1 - t, 3);
                el.textContent = m[1] + Math.round(target * e) + m[3];
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    });
}

function Hero({ tx, onJump }: { tx: Tx; onJump: (slug: string, e: MouseEvent) => void }) {
    const heroRef = useRef<HTMLElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const raf = useRef(0);
    const ticks = [...TICKS, ...TICKS];

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    return (
        <section
            className="cs-hero"
            aria-labelledby="cs-h1"
            ref={heroRef}
            onMouseMove={(e) => {
                const hero = heroRef.current,
                    tags = tagsRef.current;
                if (!hero || !tags) return;
                const r = hero.getBoundingClientRect();
                const mx = ((e.clientX - r.left) / r.width - 0.5) * 2,
                    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
                cancelAnimationFrame(raf.current);
                raf.current = requestAnimationFrame(() => {
                    tags.style.setProperty("--mx", mx.toFixed(3));
                    tags.style.setProperty("--my", my.toFixed(3));
                });
            }}
            onMouseLeave={() => {
                tagsRef.current?.style.setProperty("--mx", "0");
                tagsRef.current?.style.setProperty("--my", "0");
            }}
        >
            <div className="wrap">
                <span className="cs-eyebrow">
                    <i></i>
                    {tx("Case studies · 6 brands")}
                </span>
                <h1 id="cs-h1" className="cs-h1">
                    <span className="w">
                        <span>{tx("Case")}</span>
                    </span>{" "}
                    <span className="w">
                        <span>
                            <em>{tx("Studies")}</em>
                        </span>
                    </span>
                </h1>
                <p className="cs-sub">{tx("Real brands that came to the US with Vybd: what we did for them, and what changed.")}</p>
            </div>
            <div className="cs-tags" ref={tagsRef}>
                {CASES.map((c, i) => (
                    <div key={c.slug} className="cs-tagwrap" style={{ ["--k" as string]: TAG_K[i] }}>
                        <a
                            className="cs-tag"
                            href={`#cs-${c.slug}`}
                            onClick={(e) => onJump(c.slug, e)}
                            style={{
                                ["--r" as string]: `${TAG_ROT[i]}deg`,
                                ["--r0" as string]: `${TAG_ROT[i] * 4}deg`,
                                animationDelay: `${(0.55 + i * 0.09).toFixed(2)}s, ${(i * -0.8).toFixed(1)}s`,
                            }}
                        >
                            <small>{tx(c.short)}</small>
                            <b>{c.brand}</b>
                        </a>
                    </div>
                ))}
            </div>
            <div className="cs-ticker" aria-label={tx("Results across our case studies")}>
                <div className="cs-track">
                    {ticks.map(([v, l, brand], i) => (
                        <div key={i} className="cs-tick" aria-hidden={i >= TICKS.length}>
                            <b>{v}</b>
                            <span>
                                {tx(l)}
                                <em> · {brand}</em>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function CaseStudiesPage() {
    const tx = useTx();
    const lp = useLocalePath();
    const [filter, setFilterState] = useState<CaseGroup | "all">("all");
    const [anim, setAnim] = useState<"A" | "B">("A");
    const [gridIn, setGridIn] = useState(() => !("IntersectionObserver" in window));
    const gridRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const pillRef = useRef<HTMLSpanElement>(null);
    const pendingJump = useRef<string | null>(null);
    // bumped whenever the cards should count up again (grid reveal, new filter)
    const [countKey, setCountKey] = useState(() => ("IntersectionObserver" in window ? 0 : 1));

    const movePill = useCallback(() => {
        const pill = pillRef.current,
            b = filtersRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
        if (!pill || !b) return;
        pill.style.width = b.offsetWidth + "px";
        pill.style.transform = `translateX(${b.offsetLeft}px)`;
    }, []);

    useEffect(() => {
        movePill();
        const t = window.setTimeout(movePill, 400);
        document.fonts?.ready.then(movePill);
        window.addEventListener("resize", movePill);
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", movePill);
        };
    }, [movePill]);

    useLayoutEffect(() => {
        movePill();
    }, [filter, tx, movePill]);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (!entries.some((en) => en.isIntersecting)) return;
                io.disconnect();
                setGridIn(true);
                setCountKey((k) => k + 1);
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
        );
        io.observe(grid);
        return () => io.disconnect();
    }, []);

    // After the cards (re)render: count up, then finish any pending jump.
    useEffect(() => {
        if (countKey === 0) return;
        countUp(gridRef.current);
        const slug = pendingJump.current;
        pendingJump.current = null;
        if (!slug) return;
        const el = document.getElementById(`cs-${slug}`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("is-flash");
        const t = window.setTimeout(() => el.classList.remove("is-flash"), 1600);
        return () => clearTimeout(t);
    }, [countKey]);

    const setFilter = (key: CaseGroup | "all") => {
        if (key === filter) return;
        setFilterState(key);
        setAnim((a) => (a === "A" ? "B" : "A"));
        setCountKey((k) => k + 1);
    };

    const jumpTo = (slug: string, e: MouseEvent) => {
        e.preventDefault();
        const c = CASES.find((x) => x.slug === slug)!;
        pendingJump.current = slug;
        if (filter !== "all" && c.group !== filter) {
            setFilterState("all");
            setAnim((a) => (a === "A" ? "B" : "A"));
        }
        setGridIn(true);
        setCountKey((k) => k + 1);
    };

    const list = CASES.map((c, i) => ({ ...c, i })).filter((c) => filter === "all" || c.group === filter);
    const n = list.length;

    return (
        <RdPage name="cases">
            <RdHeader
                logoHref="/"
                links={[
                    { label: "What we do", href: "/#services" },
                    { label: "How it works", href: "/#how" },
                    { label: "Case studies", href: "#cases", current: true },
                    { label: "Lab", href: "/lab" },
                ]}
                mobileLinks={[
                    { label: "Home", href: "/" },
                    { label: "What we do", href: "/#services" },
                    { label: "Case studies", href: "#cases" },
                    { label: "Lab", href: "/lab" },
                ]}
            />

            <Hero tx={tx} onJump={jumpTo} />

            <section id="cases" className="cs-list" aria-labelledby="cs-h2" style={{ position: "relative" }}>
                <div className="wrap">
                    <div className="cs-listhead">
                        <div>
                            <h2 id="cs-h2" className="cs-h2">
                                {tx("Built for the")} <em>{tx("US.")}</em>
                            </h2>
                            <span className="cs-count" aria-live="polite">
                                {n === CASES.length ? tx("Six brands. One market.") : tx(`Showing ${n} of ${CASES.length} case studies`)}
                            </span>
                        </div>
                        <div className="cs-filters" role="group" aria-label={tx("Filter by category")} ref={filtersRef}>
                            <span className="cs-pill" ref={pillRef} aria-hidden="true"></span>
                            {FILTERS.map(([k, label]) => (
                                <button key={k} type="button" className="cs-fbtn" aria-pressed={filter === k} onClick={() => setFilter(k)}>
                                    {tx(label)}
                                    <sup>{k === "all" ? CASES.length : CASES.filter((c) => c.group === k).length}</sup>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={gridIn ? "cs-grid is-in" : "cs-grid"} ref={gridRef}>
                        {list.map((c, j) => (
                            <Link
                                key={c.slug}
                                className="cs-card"
                                id={`cs-${c.slug}`}
                                to={lp(`/case-studies/${c.slug}`)}
                                style={{ ["--anim" as string]: `rd-cases-csUp${anim}`, ["--d" as string]: `${(j * 0.11).toFixed(2)}s` }}
                            >
                                <div className="cs-label">
                                    <div className="cs-ltop">
                                        <span>
                                            {tx("Case")} <b>{String(c.i + 1).padStart(2, "0")}</b>
                                        </span>
                                        <span className="cs-ico" aria-hidden="true">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                                <path d={c.icon}></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="cs-brand">{c.brand}</div>
                                    <div className="cs-lbot">
                                        <span className="cs-cat">{tx(c.category)}</span>
                                        <span className="cs-bars" aria-hidden="true"></span>
                                    </div>
                                    <div className="cs-stamp" aria-hidden="true">
                                        <div>
                                            {tx("US")}
                                            <small>{tx("LAUNCHED")}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="cs-body">
                                    <h3 className="cs-title">{tx(c.title)}</h3>
                                    <p className="cs-desc">{tx(c.desc)}</p>
                                    <div className="cs-metrics">
                                        {c.metrics.map(([v, l]) => (
                                            <div key={l} className="cs-m">
                                                <b data-count={tx(v)}>{tx(v)}</b>
                                                <span>{tx(l)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="cs-more">
                                        {tx("Read case study")}{" "}
                                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="cs-cta" style={{ position: "relative" }}>
                <div className="cs-cta-in">
                    <span className="cs-orbit" aria-hidden="true"></span>
                    <span className="cs-orbit o2" aria-hidden="true"></span>
                    <h2 className="rv">
                        {tx("Your next market")}
                        <br />
                        <em>{tx("is waiting.")}</em>
                    </h2>
                    <p className="rv">{tx("Tell us what you make. We'll show you what it takes to sell it in the US.")}</p>
                    <div className="cs-cta-row">
                        <RdLink className="btn btn-mint" href="/book">
                            {tx("Book a free call")}
                        </RdLink>
                        <RdLink className="btn btn-ghost" href="/">
                            {tx("Back to home")}
                        </RdLink>
                    </div>
                </div>
            </section>

            <RdFooter current="cases" />
        </RdPage>
    );
}
