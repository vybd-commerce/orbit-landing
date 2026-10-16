import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Tx } from "../i18n";

/* Six modules around the Operations Control Tower, joined by dashed lines
   with a pulse running along them. Hovering or focusing a module lights its
   line; the status line under the core cycles through what each module is
   doing. Line paths are measured from the laid-out cards. */

type Mod = { name: string; items: string[]; icon: ReactNode };

const ic = (children: ReactNode) => (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const MODS: Mod[] = [
    { name: "Market Intelligence", items: ["Demand Forecasting", "Competitor Analysis", "Price Optimization"], icon: ic(<path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />) },
    {
        name: "Compliance",
        items: ["Regulatory Monitoring", "Risk Detection", "Document Validation"],
        icon: ic(
            <>
                <path d="M12 3l7 3v5.5c0 4.3-2.9 7.6-7 9.5-4.1-1.9-7-5.2-7-9.5V6l7-3z" />
                <path d="M9 12l2.2 2.2L15 10" />
            </>
        ),
    },
    {
        name: "E-Commerce",
        items: ["Catalog Sync", "Channel Management", "SEO Automation"],
        icon: ic(
            <>
                <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 8H6.2" />
                <circle cx="9.5" cy="20" r="1.2" />
                <circle cx="17" cy="20" r="1.2" />
            </>
        ),
    },
    {
        name: "Marketing",
        items: ["Ad Spend Optimization", "Campaign Analytics", "Audience Segmentation"],
        icon: ic(
            <>
                <path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z" />
                <path d="M17 8.5a5 5 0 0 1 0 7" />
            </>
        ),
    },
    {
        name: "Logistics",
        items: ["Smart Routing", "Carrier Selection", "Freight Audit"],
        icon: ic(
            <>
                <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" />
                <circle cx="7" cy="17.5" r="1.8" />
                <circle cx="17.5" cy="17.5" r="1.8" />
            </>
        ),
    },
    {
        name: "Support",
        items: ["Ticket Routing", "Sentiment Analysis", "Auto-Responses"],
        icon: ic(
            <>
                <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
                <path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4zM20 14h-3v5h2a1 1 0 0 0 1-1v-4z" />
            </>
        ),
    },
];

const MSG = [
    "Demand signal updated",
    "New labeling rule applied",
    "Catalog synced to 3 channels",
    "Ad spend rebalanced",
    "Carrier switched to faster route",
    "Ticket answered in 4 min",
];

export default function CommerceStack({ tx, tick }: { tx: Tx; tick: number }) {
    const secRef = useRef<HTMLElement>(null);
    const [on, setOn] = useState(false);
    const [hot, setHot] = useState(-1);

    const layout = useCallback(() => {
        const sec = secRef.current;
        if (!sec) return;
        const grid = sec.querySelector(".sk"),
            core = sec.querySelector(".sk-core");
        if (!grid || !core) return;
        const g = grid.getBoundingClientRect(),
            c = core.getBoundingClientRect();
        sec.querySelectorAll(".sk-mod").forEach((mEl) => {
            const i = Number(mEl.getAttribute("data-mod")),
                r = mEl.getBoundingClientRect(),
                left = i < 3;
            const x1 = (left ? r.right : r.left) - g.left,
                y1 = r.top + r.height / 2 - g.top;
            const x2 = (left ? c.left : c.right) - g.left,
                y2 = c.top - g.top + c.height * (0.32 + 0.18 * (i % 3));
            const mx = (x1 + x2) / 2;
            const d = `M${x1.toFixed(1)},${y1.toFixed(1)} C${mx.toFixed(1)},${y1.toFixed(1)} ${mx.toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
            sec.querySelector(`[data-p="${i}"]`)?.setAttribute("d", d);
            sec.querySelector(`[data-q="${i}"]`)?.setAttribute("d", d);
            const end = sec.querySelector(`[data-e="${i}"]`);
            end?.setAttribute("cx", x1.toFixed(1));
            end?.setAttribute("cy", y1.toFixed(1));
        });
    }, []);

    useEffect(() => {
        layout();
        document.fonts?.ready.then(layout);
        window.addEventListener("resize", layout);
        return () => window.removeEventListener("resize", layout);
    }, [layout]);

    // Relayout when the copy changes language (card heights change).
    useEffect(() => {
        layout();
    }, [tx, layout]);

    useEffect(() => {
        const el = secRef.current;
        if (!el) return;
        let t = 0;
        const reveal = () => {
            setOn(true);
            requestAnimationFrame(layout);
            // the cards slide into place over .6s; measure again once they land
            t = window.setTimeout(layout, 750);
        };
        if (!("IntersectionObserver" in window)) {
            reveal();
            return () => clearTimeout(t);
        }
        const io = new IntersectionObserver(
            (en) => {
                if (!en[0].isIntersecting) return;
                io.disconnect();
                reveal();
            },
            { threshold: 0.2 }
        );
        io.observe(el);
        return () => {
            io.disconnect();
            clearTimeout(t);
        };
    }, [layout]);

    const k = hot >= 0 ? hot : tick % 6;
    const card = (i: number) => {
        const m = MODS[i];
        return (
            <article
                key={m.name}
                className={hot === i ? "sk-mod hot" : "sk-mod"}
                data-mod={i}
                onMouseEnter={() => setHot(i)}
                onMouseLeave={() => setHot(-1)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(-1)}
                tabIndex={0}
            >
                <div className="sk-top">
                    <span className="sk-ic">{m.icon}</span>
                    <h3>{tx(m.name)}</h3>
                    <span className="sk-badge">{tx("Module")}</span>
                </div>
                <ul>
                    {m.items.map((it) => (
                        <li key={it}>
                            <span aria-hidden="true">+</span>
                            {tx(it)}
                        </li>
                    ))}
                </ul>
            </article>
        );
    };

    return (
        <section className="hw-sec hw-stack-sec" aria-labelledby="hw-h2b" ref={secRef}>
            <div className="wrap">
                <div className="hw-head rv">
                    <div>
                        <div className="hw-kicker mono">
                            <b>02</b> {tx("/ The modules")}
                        </div>
                        <h2 id="hw-h2b" className="hw-h2">
                            {tx("A full commerce stack,")} <em>{tx("coordinated.")}</em>
                        </h2>
                    </div>
                    <p className="hw-p">
                        {tx(
                            "Six modules each run their own part of your US business. All of them connect through one control tower, so every part knows what the others are doing. Hover over a module to see its line."
                        )}
                    </p>
                </div>
                <div className={on ? "sk on" : "sk"}>
                    <svg className="sk-lines" aria-hidden="true">
                        {MODS.map((m, i) => (
                            <g key={m.name}>
                                <path className="sk-base" data-p={i} d="M0 0"></path>
                                <path className={hot === i ? "sk-pulse hot" : "sk-pulse"} data-q={i} d="M0 0" style={{ animationDelay: `${(i * 0.35).toFixed(2)}s` }}></path>
                                <circle className="sk-end" data-e={i} r="3" cx="0" cy="0"></circle>
                            </g>
                        ))}
                    </svg>
                    <div className="sk-col">{[0, 1, 2].map(card)}</div>
                    <div className="sk-core" data-core="1">
                        <div className="sk-orb" aria-hidden="true"></div>
                        <div className="sk-top">
                            <span className="sk-ic sk-ic-core">
                                {ic(
                                    <>
                                        <path d="M12 3l9 5-9 5-9-5 9-5z" />
                                        <path d="M3 13l9 5 9-5" />
                                    </>
                                )}
                            </span>
                            <h3>{tx("Operations Control Tower")}</h3>
                            <span className="sk-badge sk-badge-core">{tx("Core")}</span>
                        </div>
                        <ul className="sk-core-list">
                            {["Orchestration Engine", "Unified Data Layer", "Role-Based Access"].map((s) => (
                                <li key={s}>
                                    <i aria-hidden="true"></i>
                                    {tx(s)}
                                </li>
                            ))}
                        </ul>
                        <p className="sk-live">
                            <span className="sk-dot" aria-hidden="true"></span>
                            {tx(`${MODS[k].name}: ${MSG[k]}`)}
                        </p>
                    </div>
                    <div className="sk-col">{[3, 4, 5].map(card)}</div>
                </div>
            </div>
        </section>
    );
}
