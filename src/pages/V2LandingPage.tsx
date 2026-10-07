import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, Plus, X } from "lucide-react";
import FinalCtaSection from "../components/FinalCtaSection";
import OpsComparisonSection from "../components/OpsComparisonSection";
import OpsStackDiagram from "../components/OpsStackDiagram";
import TestimonialsSection from "../components/TestimonialsSection";
import WhatWeBuildSection from "../components/WhatWeBuildSection";
import "./LandingPage.css";
import "./MockLandingPage.css";
import "./V2LandingPage.css";

// Every CTA on this page books a working session.
const CALENDLY_URL = "https://calendly.com/hello-vybd/vybd-discovery-call";
const goTo = () => {
    window.location.href = CALENDLY_URL;
};

const INTEGRATION_LAYER_ITEMS = [
    {
        trigger: "The Monday demand meeting runs on a spreadsheet someone rebuilds by hand.",
        detail: "Three systems hold the inputs. One person reconciles them every week, and the meeting is only as good as how much time they had.",
    },
    {
        trigger: "The chargeback shows up ninety days after the shipment.",
        detail: "By the time a deduction surfaces in the recon, the paperwork that would have disputed it is scattered across an inbox, a portal, and a 3PL export.",
    },
    {
        trigger: "The wholesale launch waits on product copy.",
        detail: "Item data lives in four places and none of them agree. Every new channel means someone retypes the catalogue.",
    },
    {
        trigger: "The answer to \"how much did we make on that SKU\" takes two days.",
        detail: "Not because it is hard, but because nobody owns the join between the ad platform, the order data, and landed cost.",
    },
];

const HOW_IT_RUNS_STEPS = [
    {
        num: "1",
        tag: "STEP 1",
        title: "Integrate",
        body: "Connect your systems and data.",
    },
    {
        num: "2",
        tag: "STEP 2",
        title: "Intelligence",
        body: "Turn fragmented data into operational intelligence.",
    },
    {
        num: "3",
        tag: "STEP 3",
        title: "Automate",
        body: "Put AI agents to work across your business.",
    },
];

// Rate-based metrics pulled from BayangromCaseStudyPage.tsx. $180K+/year is
// excluded from the headline tiles: it's a raw dollar figure without a
// stated denominator, the brief asks for rate metrics only.
const PROOF_METRICS = [
    { value: "$7.15", label: "Shipping cost / order, down from $9.20" },
    { value: "↓35%", label: "Fulfilment time, order to dock" },
    { value: "↓12%", label: "Landed cost per unit" },
];

const LOGO_ROW_BRANDS = [
    "Bayangrom",
    "Emsworth",
    "Karama",
    "The Indian Tapas",
    "Flavor Atlas",
    "Kashida Layone",
    "TanRom Lifesciences",
];
const LOGO_ROW_PLACEHOLDER_SLOTS = [0, 1, 2];

export default function V2LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const TITLE = "Vybd: scale to $100M without scaling your ops team";
        const DESCRIPTION = "Between $10M and $100M, most consumer brands triple their operations headcount. Vybd builds the operating systems that absorb that work instead.";

        const prevTitle = document.title;
        document.title = TITLE;
        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute("content", DESCRIPTION);

        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
        };
    }, []);

    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                setTimeout(() => {
                    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        };
        scrollToHash();
        window.addEventListener("hashchange", scrollToHash);
        return () => window.removeEventListener("hashchange", scrollToHash);
    }, []);

    return (
        <div className="landing-page lp-page-mock">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/v2" className="lp-logo">
                        <span className="lp-logo-text">Vybd</span>
                    </a>

                    <input
                        className="lp-menu-toggle"
                        type="checkbox"
                        id="lp-v2-menu-toggle"
                        checked={menuOpen}
                        onChange={() => setMenuOpen((v) => !v)}
                    />
                    <label className="lp-menu-btn" htmlFor="lp-v2-menu-toggle">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        <span className="lp-sr-only">Toggle menu</span>
                    </label>

                    <nav className="lp-nav">
                        <ul>
                            <li><a href="#how-it-runs">How it runs</a></li>
                            <li><a href="#functions">Functions</a></li>
                            <li><a href="#proof">Proof</a></li>
                            <li><a href="/lab">Lab</a></li>
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <button className="lp-btn lp-btn-primary" onClick={() => goTo()}>
                            Contact sales
                        </button>
                    </div>
                </header>
            </div>

            <div className="lp-mobile-sticky-cta">
                <button className="lp-btn lp-btn-primary" onClick={() => goTo()}>Contact sales</button>
            </div>

            {/* ── Hero (copy changes only, layout/animation untouched) ── */}
            <section className="lp-hero" id="hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-trust">
                        <h2 className="lp-trust-strip-heading">Built by operators. Backed by industry leaders.</h2>
                        <p className="lp-trust-strip-body">Vybd is supported by experienced founders, CPG executives, and angel investors who understand what it takes to scale complex consumer businesses.</p>
                    </div>
                    <div className="lp-hero-supporting lp-mock-hero-eyebrow">
                        For consumer brands between $10M and $100M.
                    </div>
                    <h1 className="lp-hero-title lp-mock-hero-title">
                        Scale to $100M without scaling your ops team.
                    </h1>
                    <p className="lp-hero-subtitle">
                        Between $10M and $100M, most consumer brands triple their operations headcount because their people become the integration layer between a dozen tools. We build the operating systems that absorb that work, then train your team to run them or run them for you.
                    </p>

                    <div className="lp-hero-cta">
                        <a href="#functions" className="lp-btn-link" style={{ fontWeight: 600, fontSize: '1.08rem', color: 'var(--lp-on-surface)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            See how the system works <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── The cost curve ── */}
            <section className="lp-curve-section" id="cost-curve">
                <div style={{ maxWidth: "1140px", margin: "0 auto 1.5rem" }}>
                    <div className="lp-section-tag">01 / THE OPPORTUNITY</div>
                </div>
                <OpsComparisonSection />
            </section>

            {/* ── Your people are the integration layer ── */}
            <section className="lp-v2-integration-section" id="integration-layer">
                <div className="lp-process-inner">
                    <div className="lp-section-tag">02 / THE PROBLEM</div>
                    <h2 className="lp-process-h2">Your people are the integration layer.</h2>
                    <p className="lp-v2-integration-intro">The tools are not the problem. The gaps between them are, and right now a person is filling every one.</p>

                    <ul className="lp-v2-integration-list">
                        {INTEGRATION_LAYER_ITEMS.map((item) => (
                            <li key={item.trigger}>
                                <p className="lp-v2-integration-trigger">{item.trigger}</p>
                                <p className="lp-v2-integration-detail">{item.detail}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Operating functions ── */}
            <WhatWeBuildSection sectionNumber="03" />

            {/* ── The operating stack ── */}
            <OpsStackDiagram sectionNumber="04" />

            {/* ── How it runs ── */}
            <section className="lp-process-section" id="how-it-runs">
                <div className="lp-process-inner">
                    <div className="lp-section-tag">05 / HOW IT RUNS</div>
                    <h2 className="lp-process-h2">We run it, then you do.</h2>

                    <div className="lp-process-track">
                        {HOW_IT_RUNS_STEPS.map((step) => (
                            <div className="lp-process-step" key={step.num}>
                                <div className="lp-step-num-display">{step.num}</div>
                                <div className="lp-process-step-tag">{step.tag}</div>
                                <h4>{step.title}</h4>
                                <p>{step.body}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── Proof ── */}
            <section className="lp-mock-proof-section" id="proof">
                <div className="lp-mock-proof-card">
                    <span className="lp-mock-proof-eyebrow">One brand, three workflows, ninety days.</span>

                    <div className="lp-mock-proof-stats">
                        {PROOF_METRICS.map((metric) => (
                            <div key={metric.label}>
                                <div className="lp-mock-proof-value">{metric.value}</div>
                                <div className="lp-mock-proof-label">{metric.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="lp-mock-proof-divider" />

                    <p className="lp-mock-proof-quote">
                        "Not a consultant. Not a tool. A full stack operating partner."
                    </p>
                    <p className="lp-mock-proof-attribution">Bayangrom, DTC streetwear</p>

                    <Link to="/work/bayangrom" className="lp-mock-proof-link">
                        Read the full case study <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ── Logo row ── */}
            <section className="lp-logo-row-section">
                <div className="lp-logo-row-header">Brands running on Vybd</div>
                <div className="lp-logo-row-grid">
                    {LOGO_ROW_BRANDS.map((brand) => (
                        <div className="lp-logo-chip" key={brand}>{brand}</div>
                    ))}
                    {LOGO_ROW_PLACEHOLDER_SLOTS.map((_, i) => (
                        <div className="lp-logo-chip lp-logo-chip-placeholder" key={`logo-slot-${i}`}>
                            <Plus size={14} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <TestimonialsSection />

            {/* ── Close ── */}
            <FinalCtaSection />

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
