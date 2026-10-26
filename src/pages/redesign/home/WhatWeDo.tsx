import { useEffect, useRef, useState, type ReactNode } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";

/* "What we do" as a delivery route: a parcel rides down the rail as you
   scroll, lighting each of the six jobs, while the sticky control tower
   ticks them off. */

type Job = { key: string; name: string; title: string; body: string; chips: string[]; icon: ReactNode };

const icon = (children: ReactNode) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const JOBS: Job[] = [
    {
        key: "01 · Market research",
        name: "Market research",
        title: "Find your buyers",
        body: "We study US demand, competitors and prices, so you launch the right products at the right price.",
        chips: ["Demand forecasts", "Competitor checks", "Pricing"],
        icon: icon(<path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />),
    },
    {
        key: "02 · Compliance",
        name: "Compliance",
        title: "Clear the rules",
        body: "We check labels, regulations and paperwork before anything ships, so nothing gets stuck at the border.",
        chips: ["US regulations", "Risk checks", "Documents"],
        icon: icon(
            <>
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
                <path d="M8.5 12l2.5 2.5 4.5-5" />
            </>
        ),
    },
    {
        key: "03 · Logistics",
        name: "Logistics",
        title: "Ship it in",
        body: "We choose the routes and carriers, and check every freight bill, so stock arrives on time and on budget.",
        chips: ["Routing", "Carriers", "Freight audits"],
        icon: icon(
            <>
                <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
                <circle cx="7" cy="17.5" r="1.8" />
                <circle cx="17" cy="17.5" r="1.8" />
            </>
        ),
    },
    {
        key: "04 · Online sales",
        name: "Online sales",
        title: "Sell online",
        body: "We list your products on the right US marketplaces and keep every listing up to date.",
        chips: ["Catalog sync", "Marketplaces", "Search ranking"],
        icon: icon(
            <>
                <path d="M3 4h2l2.4 11h11L21 8H7" />
                <circle cx="9.5" cy="19" r="1.4" />
                <circle cx="17" cy="19" r="1.4" />
            </>
        ),
    },
    {
        key: "05 · Marketing",
        name: "Marketing",
        title: "Get noticed",
        body: "We run your ads and tune them as we go, so your budget reaches people who actually buy.",
        chips: ["Ad spend", "Campaign reports", "Audiences"],
        icon: icon(
            <>
                <path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z" />
                <path d="M17 8.5a5 5 0 0 1 0 7" />
            </>
        ),
    },
    {
        key: "06 · Customer support",
        name: "Customer support",
        title: "Look after customers",
        body: "We answer customer questions fast and spot unhappy customers early.",
        chips: ["Ticket routing", "Sentiment", "Auto-replies"],
        icon: icon(
            <>
                <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                <rect x="3" y="13" width="4" height="6" rx="1.5" />
                <rect x="17" y="13" width="4" height="6" rx="1.5" />
            </>
        ),
    },
];

const Arrow = () => (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

export default function WhatWeDo({ tx }: { tx: Tx }) {
    const routeRef = useRef<HTMLOListElement>(null);
    const fillRef = useRef<HTMLElement>(null);
    const parcelRef = useRef<HTMLSpanElement>(null);
    const [on, setOn] = useState(-1);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const el = routeRef.current;
                if (!el) return;
                const r = el.getBoundingClientRect(),
                    line = window.innerHeight * 0.55;
                const p = Math.max(0, Math.min(1, (line - r.top - 24) / Math.max(1, r.height - 48)));
                if (fillRef.current) fillRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
                if (parcelRef.current) parcelRef.current.style.top = `${(p * 100).toFixed(2)}%`;
                let a = -1;
                el.querySelectorAll(".wd-step").forEach((li, i) => {
                    if (li.getBoundingClientRect().top < line) a = i;
                });
                setOn(a);
            });
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => {
            window.removeEventListener("scroll", update);
            cancelAnimationFrame(raf);
        };
    }, []);

    const state = (i: number) => (i < on ? " is-done" : i === on ? " is-on" : "");

    return (
        <section id="services" className="wrap bleed" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }}>
            <div
                className="rv"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, margin: "0 auto 48px", maxWidth: 820 }}
            >
                <span className="eyebrow">{tx("What we do")}</span>
                <h2 className="h2 wd-h2">
                    {tx("Everything it takes to sell in the US.")} <em>{tx("Handled.")}</em>
                </h2>
                <p className="lead" style={{ maxWidth: 640 }}>
                    {tx(
                        "Selling in the US usually means hiring six different companies. We do all six jobs for you, and one control tower keeps them working together."
                    )}
                </p>
            </div>
            <div className="wd-grid">
                <ol className="wd-route" ref={routeRef}>
                    <li className="wd-rail" aria-hidden="true">
                        <i className="wd-fill" ref={fillRef}></i>
                        <span className="wd-parcel" ref={parcelRef}></span>
                    </li>
                    {JOBS.map((j, i) => (
                        <li key={j.key} className={"wd-step" + state(i)}>
                            <span className="wd-dot" aria-hidden="true">
                                {j.icon}
                            </span>
                            <div className="wd-card">
                                <span className="wd-k">{tx(j.key)}</span>
                                <h3>{tx(j.title)}</h3>
                                <p>{tx(j.body)}</p>
                                <ul className="wd-chips">
                                    {j.chips.map((c) => (
                                        <li key={c}>{tx(c)}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ol>
                <aside className="wd-tower" aria-label={tx("Vybd control tower")}>
                    <div className="wd-tower-top">
                        <span>{tx("Vybd control tower")}</span>
                        <span className="wd-live">
                            <i></i>
                            {tx("Live")}
                        </span>
                    </div>
                    <p className="wd-big">
                        {tx("Six jobs.")}
                        <br />
                        <em>{tx("One team.")}</em>
                    </p>
                    <ol className="wd-list">
                        {JOBS.map((j, i) => (
                            <li key={j.key} className={"wd-row" + state(i)}>
                                <span className="wd-tick">✓</span>
                                <b>{tx(j.name)}</b>
                                <small>{i < on ? tx("Done") : i === on ? tx("In progress") : ""}</small>
                            </li>
                        ))}
                    </ol>
                    <p className="wd-now">
                        {tx("Now handling:")} <b>{tx(on >= 0 ? JOBS[on].name : "Waiting for your product")}</b>
                    </p>
                    <RdLink className="wd-link" href="/product">
                        {tx("See how it all connects")} <Arrow />
                    </RdLink>
                </aside>
            </div>
            <RdLink className="wd-link wd-more" href="/product" style={{ color: "#0f1b33" }}>
                {tx("See how it all connects")} <Arrow />
            </RdLink>
        </section>
    );
}
