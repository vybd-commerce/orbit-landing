import { useEffect, useState } from "react";
import FinalCtaParticleCanvas from "../components/FinalCtaParticleCanvas";
import {
    Zap,
    ShieldCheck,
    MessageSquare,
    Layers,
    ArrowRight,
    Wrench,
    TrendingDown,
    ChevronDown
} from "lucide-react";
import "./LandingPage.css";
import "./MockLandingPage.css";

// Every CTA on this page books an intro call.
const CALENDLY_URL = "https://calendly.com/hello-vybd/introductory-call";

const goTo = () => {
    window.location.href = CALENDLY_URL;
};

const bentoModules = [
  {
    id: "01",
    label: "Demand & Inventory",
    problemHook: "Four channels, one production calendar.",
    problemBody: "DTC, Amazon, retail, and wholesale each pull differently — and your manufacturer needs a number eight weeks out. Guess wrong and it's cash or sales; you lose either way.",
    solutionDetail: "We deploy forecasting and replenishment agents that read demand per channel and trigger orders against real lead times — so stock follows what's actually selling, where.",
    tags: ["Forecasting", "Replenishment", "Multi-channel"],
    category: "USUALLY A DEMAND PLANNER",
    result: "↓28% excess inventory · Bayangrom",
  },
  {
    id: "02",
    label: "Retail & Wholesale Ops",
    problemHook: "The money you earned and never collected.",
    problemBody: "Deductions, chargebacks, and trade spend get reconciled by hand — or not at all. Mid-market brands write off 1–2% of gross to deductions nobody had time to dispute.",
    solutionDetail: "We deploy agents that ingest remittances and portal data, sort valid deductions from disputable ones, and draft the recovery paperwork — so the money you earned actually lands.",
    tags: ["Deductions", "Trade spend", "Retailer portals"],
    category: "USUALLY A TRADE SPEND MANAGER",
  },
  {
    id: "03",
    label: "Item Data & Content",
    problemHook: "Your product exists forty slightly different ways.",
    problemBody: "Every new retailer, distributor, and marketplace means another portal, another form, another chance for your item data to drift — and drift becomes chargebacks and lost search.",
    solutionDetail: "We deploy agents that hold one master record and push clean, consistent item data and content everywhere it needs to live — new-item forms included.",
    tags: ["Item setup", "Syndication", "Compliance docs"],
    category: "USUALLY A CATALOG COORDINATOR",
  },
  {
    id: "04",
    label: "Logistics & Fulfillment",
    problemHook: "Cost drift compounds quietly.",
    problemBody: "Freight, 3PL fees, and carrier performance move every month. Without someone auditing per-shipment, you find out at the quarterly P&L review.",
    solutionDetail: "We deploy routing, carrier-selection, and freight-audit agents that check every shipment against expected cost and transit — and flag drift before it compounds.",
    tags: ["Routing", "Freight audit", "3PL"],
    category: "USUALLY AN OPS MANAGER",
    result: "↓22% shipping cost · Bayangrom",
  },
  {
    id: "05",
    label: "Market & Channel Intelligence",
    problemHook: "The data exists. Nobody reads it.",
    problemBody: "Velocity reports, retailer portals, competitor moves — the signal is all there, arriving faster than any team can digest it. So decisions run on last quarter's picture.",
    solutionDetail: "We deploy agents that read the feeds weekly and surface only what changed and what to do about it — competitor pricing, sell-through, assortment shifts.",
    tags: ["Velocity data", "Competitor tracking", "Pricing signals"],
    category: "USUALLY AN ANALYST",
  },
  {
    id: "06",
    label: "Growth & Revenue Ops",
    problemHook: "Leads and reorders fall through the same crack.",
    problemBody: "Sample requests sit, wholesale accounts quietly stop reordering, campaigns run on day-one assumptions — all follow-up problems, all headcount problems until now.",
    solutionDetail: "We deploy agents that chase the funnel, flag lapsed accounts, and feed live performance signal back into targeting and spend.",
    tags: ["Lead follow-up", "Reorders", "Performance"],
    category: "USUALLY A SALES OPS HIRE",
    result: "$100K+ pre-orders · Emsworth & Karama",
  },
];

const bentoClasses: Record<string, string> = {
    "01": "lp-fn-intelligence",
    "02": "lp-fn-compliance",
    "03": "lp-fn-logistics",
    "04": "lp-fn-warehousing",
    "05": "lp-fn-ecommerce",
    "06": "lp-fn-marketing",
};

// Doorway steps — tap to reveal the body copy (matches the bento tiles'
// tap-to-expand pattern, keeps mobile from showing all three paragraphs
// at once).
const DOORWAY_STEPS = [
    {
        icon: Wrench,
        title: "Start with the job you hate most",
        body: "Tell us the workflow eating the most hours. We scope one agent against it and ship it into your stack.",
    },
    {
        icon: TrendingDown,
        title: "Start with the number that's bleeding",
        body: "Landed cost, excess inventory, shipping spend. We baseline it, build against it, and report the delta.",
    },
    {
        icon: Layers,
        title: "Start with the whole operating layer",
        body: "Some brands hand us the full stack from day one. Six workstreams, one operating cadence, one team accountable.",
    },
];

// Autonomy modes — every workflow we deploy gets sorted into one of these
// on day one, and the client picks which is which.
const AUTONOMY_MODES = [
    {
        icon: Zap,
        title: "Autonomous",
        body: "Routine, high-confidence, low-blast-radius. Runs and reports.",
    },
    {
        icon: ShieldCheck,
        title: "Supervised",
        body: "Complex or ambiguous. The agent proposes, an operator checks, and the correction trains the next call.",
    },
    {
        icon: MessageSquare,
        title: "Your approval",
        body: "Anything with real money or real risk attached. Nothing moves without you.",
    },
];

export default function MockLandingPage() {
    const [expandedTile, setExpandedTile] = useState<string | null>(null);
    const [expandedDoorway, setExpandedDoorway] = useState<number | null>(null);
    const [expandedMode, setExpandedMode] = useState<number | null>(null);

    // Page-level SEO copy. Matches index.html's static baseline (what
    // crawlers/link-shares see before JS runs) — this effect is a safety
    // net for client-side route changes within the SPA, where index.html
    // itself never reloads. Restored on unmount so navigating away doesn't
    // leave another page stuck with this copy.
    useEffect(() => {
        const TITLE = "Vybd — AI agents that run e-commerce operations";
        const DESCRIPTION = "Vybd builds and runs AI agents inside your e-commerce operation — classification, inventory, listings, market intel — with senior operators accountable for the output.";

        const prevTitle = document.title;
        document.title = TITLE;

        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute("content", DESCRIPTION);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        const prevOgTitle = ogTitle?.getAttribute("content") ?? null;
        ogTitle?.setAttribute("content", TITLE);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        const prevOgDesc = ogDesc?.getAttribute("content") ?? null;
        ogDesc?.setAttribute("content", DESCRIPTION);

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const prevTwitterTitle = twitterTitle?.getAttribute("content") ?? null;
        twitterTitle?.setAttribute("content", TITLE);

        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        const prevTwitterDesc = twitterDesc?.getAttribute("content") ?? null;
        twitterDesc?.setAttribute("content", DESCRIPTION);

        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
            if (ogTitle && prevOgTitle !== null) ogTitle.setAttribute("content", prevOgTitle);
            if (ogDesc && prevOgDesc !== null) ogDesc.setAttribute("content", prevOgDesc);
            if (twitterTitle && prevTwitterTitle !== null) twitterTitle.setAttribute("content", prevTwitterTitle);
            if (twitterDesc && prevTwitterDesc !== null) twitterDesc.setAttribute("content", prevTwitterDesc);
        };
    }, []);

    // Paint Worklet Registration
    useEffect(() => {
        if ("paintWorklet" in CSS) {
            // @ts-ignore
            (CSS as any).paintWorklet.addModule(
                "https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js"
            );
        }
    }, []);

    // Mouse Interaction for particle sections
    useEffect(() => {
        const sections = [
            document.getElementById("hero"),
            document.getElementById("final-cta-card"),
        ].filter(Boolean) as HTMLElement[];

        if (sections.length === 0) return;

        const stateMap = new Map<HTMLElement, boolean>();
        sections.forEach((el) => stateMap.set(el, false));

        const handlePointerMove = (el: HTMLElement) => (e: PointerEvent) => {
            if (!stateMap.get(el)) {
                el.classList.add("interactive");
                stateMap.set(el, true);
            }
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            el.style.setProperty("--ring-x", `${x}`);
            el.style.setProperty("--ring-y", `${y}`);
            el.style.setProperty("--ring-interactive", "1");
        };

        const handlePointerLeave = (el: HTMLElement) => () => {
            el.classList.remove("interactive");
            stateMap.set(el, false);
            el.style.setProperty("--ring-x", "50");
            el.style.setProperty("--ring-y", "50");
            el.style.setProperty("--ring-interactive", "0");
        };

        const cleanups: (() => void)[] = [];
        sections.forEach((el) => {
            const move = handlePointerMove(el);
            const leave = handlePointerLeave(el);
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
                el.removeEventListener("pointermove", move);
                el.removeEventListener("pointerleave", leave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, []);

    // Handle hash navigation - scroll to element when hash changes
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.slice(1); // Remove '#'
            if (hash) {
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        };

        // Scroll on initial load
        scrollToHash();

        // Listen for hash changes
        window.addEventListener('hashchange', scrollToHash);
        return () => window.removeEventListener('hashchange', scrollToHash);
    }, []);



    return (
        <div className="landing-page">
            {/* ── Sticky mobile CTA ── */}
            {/* ── Hero ── */}
            <section className="lp-hero" id="hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-supporting lp-mock-hero-eyebrow">
                        For consumer brands scaling past $10M
                    </div>
                    <h1 className="lp-hero-title lp-mock-hero-title">
                        Scale the operation<br />
                        Not the org chart
                    </h1>

                    <div className="lp-hero-cta">
                        <a href="#functions" className="lp-btn-link" style={{ fontWeight: 600, fontSize: '1.08rem', color: 'var(--lp-on-surface)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            See what we build <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Functions Bento ── */}
            <section className="lp-functions-section" id="functions">
                <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
                    <div className="lp-section-tag">01 / WHAT WE BUILD</div>
                </div>
                <div className="lp-functions-header" style={{ alignItems: "flex-start" }}>
                    <div>
                        <h2>Every brand past $10M runs the same six workstreams.</h2>
                    </div>
                    <div className="lp-functions-header-right">
                        <p>Brands stall between $10M and $100M because they hire too slowly and drown, or hire ahead of revenue and bleed. We've built agents for the highest-impact ops workflows — and we deploy them in your stack, with senior operators accountable for the outcome.</p>
                    </div>
                </div>

                <div className="lp-fn-bento">
                    {bentoModules.map((module) => (
                        <div
                            key={module.id}
                            className={`lp-fn-tile lp-fn-bento-tile ${bentoClasses[module.id]} ${expandedTile === module.id ? "is-expanded" : ""}`}
                            onClick={() => setExpandedTile((prev) => (prev === module.id ? null : module.id))}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setExpandedTile((prev) => (prev === module.id ? null : module.id));
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-expanded={expandedTile === module.id}
                        >
                            <div>
                                <div className="lp-fn-tile-header">
                                    <span className="lp-fn-index">{module.id}</span>
                                    {module.category && <span className="lp-fn-category">{module.category}</span>}
                                </div>
                                <div className="lp-fn-title">{module.label}</div>

                                <div className="lp-fn-bento-content-stack">
                                    <div className="lp-fn-bento-problem-state">
                                        <div className="lp-fn-tile-problem-hook">{module.problemHook}</div>
                                        <div className="lp-fn-tile-problem-body">{module.problemBody}</div>
                                        <div className="lp-fn-mobile-hint">Tap to see what it does →</div>
                                    </div>
                                    <div className="lp-fn-desc-full lp-fn-bento-solution-state">{module.solutionDetail}</div>
                                </div>
                            </div>
                            <div className="lp-fn-bento-solution-footer">
                                {module.result && (
                                    <div className="lp-fn-result-chip">
                                        <span className="lp-fn-result-label">RESULT</span>
                                        <span className="lp-fn-result-value">{module.result}</span>
                                    </div>
                                )}
                                <div className="lp-fn-footer mt-auto">
                                    <span className="lp-fn-footer-label">{module.tags.join(" · ")}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Where to Start ── */}
            <section className="lp-process-section" id="where-to-start">
                <div className="lp-process-inner">
                    <div className="lp-section-tag">02 / WHERE TO START</div>
                    <div className="lp-functions-header" style={{ alignItems: "flex-start" }}>
                        <div>
                            <h2 className="lp-process-h2">You don't need all six.<br />Start with one.</h2>
                        </div>
                        <div className="lp-functions-header-right">
                            <p>Most brands start with the one job that's costing them the most, prove it works, then add the next. You're not signing up for a platform migration. You're putting one agent into one workflow and watching what it does for a month.</p>
                        </div>
                    </div>

                    <div className="lp-agent-steps-container">
                        <div className="lp-agent-steps">
                            {DOORWAY_STEPS.map((step, i) => {
                                const Icon = step.icon;
                                const isOpen = expandedDoorway === i;
                                return (
                                    <div
                                        className={`lp-agent-step ${isOpen ? "is-expanded" : ""}`}
                                        key={step.title}
                                        onClick={() => setExpandedDoorway((prev) => (prev === i ? null : i))}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setExpandedDoorway((prev) => (prev === i ? null : i));
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-expanded={isOpen}
                                    >
                                        <div className="lp-agent-step-icon-wrap doorway">
                                            <div className="lp-agent-step-icon">
                                                <Icon size={24} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <div className="lp-agent-step-content">
                                            <h3>{step.title}</h3>
                                            <ChevronDown size={16} className="lp-agent-step-chevron" />
                                        </div>
                                        <div className="lp-agent-step-card">
                                            <p>{step.body}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Mechanism Section (How We Run It) ── */}
            <section className="lp-process-section" id="who">
                <div className="lp-process-inner">
                    <div className="lp-section-tag">03 / HOW WE RUN IT</div>
                    <div className="lp-functions-header" style={{ alignItems: "flex-start" }}>
                        <div>
                            <h2 className="lp-process-h2">Autonomous where it's safe.<br />Supervised where it isn't.</h2>
                        </div>
                        <div className="lp-functions-header-right">
                            <p>An agent that runs unsupervised on a high-stakes decision is a liability, not a feature. Every workflow we deploy gets sorted into one of three modes on day one, and you decide which is which.</p>
                        </div>
                    </div>

                    <div className="lp-mock-modes">
                        {AUTONOMY_MODES.map((mode, i) => {
                            const Icon = mode.icon;
                            const isOpen = expandedMode === i;
                            return (
                                <div
                                    className={`lp-mock-mode ${isOpen ? "is-expanded" : ""}`}
                                    key={mode.title}
                                    onClick={() => setExpandedMode((prev) => (prev === i ? null : i))}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setExpandedMode((prev) => (prev === i ? null : i));
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={isOpen}
                                >
                                    <span className="lp-mock-mode-icon">
                                        <Icon size={18} strokeWidth={2} />
                                    </span>
                                    <div>
                                        <div className="lp-mock-mode-title">
                                            {mode.title}
                                            <ChevronDown size={14} className="lp-agent-step-chevron" />
                                        </div>
                                        <div className="lp-mock-mode-body">{mode.body}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="lp-final-cta" id="final-cta">
                <div className="lp-final-cta-card lp-dark" id="final-cta-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <FinalCtaParticleCanvas />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2>
                            Tell us the bottleneck<br />
                            that's costing you most.
                        </h2>


                        <div className="lp-final-cta-buttons">
                            <button
                                className="lp-btn lp-btn-primary"
                                onClick={() => goTo()}
                            >
                                Map your first agent
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-brand">
                    <div className="lp-footer-orbit-container">
                        <div className="lp-footer-ellipses lp-footer-ellipses--thin">
                            <div className="lp-footer-ellipses lp-footer-ellipses--planet"></div>
                        </div>
                        <div className="lp-footer-ellipses lp-footer-ellipses--thick"></div>
                        <span>Vybd</span>
                    </div>
                </div>

                <div className="lp-footer-bottom">
                    <div className="lp-footer-legal">
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
