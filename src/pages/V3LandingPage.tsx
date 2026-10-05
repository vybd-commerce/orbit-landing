import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import ParticleField from "../components/ParticleField";
import LandingHero from "../components/LandingHero";
import HeroShowcaseGrid from "../components/HeroShowcaseGrid";
import WhatWeBuildSection from "../components/WhatWeBuildSection";
import LandingCaseStudies from "../components/LandingCaseStudies";
import TestimonialsSection from "../components/TestimonialsSection";
import FaqSection from "../components/FaqSection";
import FinalCtaSection from "../components/FinalCtaSection";
import "./LandingPage.css";
import "./V3LandingPage.css";

const CALENDLY_URL = "https://calendly.com/hello-vybd/introductory-call";

/* The run log stands in for a product screenshot: it is what an operator
   actually sees when a function is running, rather than a picture of an app
   that does not exist yet. */
const RUN_LOG = [
    { kind: "cmd", text: "close out the retailer week" },
    { kind: "think", text: "Reading 4 portals, 2 remittance files" },
    { kind: "step", text: "Matched 214 line items to the trade plan", state: "done" },
    { kind: "step", text: "Flagged 3 deductions outside terms", state: "done" },
    { kind: "step", text: "Drafted disputes · $18,400 at stake", state: "running" },
    { kind: "ask", text: "Stonewell billed the same freight twice in week 34. Dispute both, or one?" },
    { kind: "human", text: "one — the second was a split shipment" },
    { kind: "done", text: "Filed. 2 disputes out, $12,900 recoverable, nothing else outstanding." },
];

const STATS = [
    { value: "24/7", label: "Functions running" },
    { value: "< 30 days", label: "First function live" },
    { value: "1", label: "Connected data layer" },
];

export default function V3LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="landing-page lp-theme-dark lp-page-v3">
            <ParticleField mode="page" particleCount={900} opacity={0.35} />

            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
                        <span className="lp-logo-text">Vybd</span>
                    </a>

                    <input
                        className="lp-menu-toggle"
                        type="checkbox"
                        id="v3-menu-toggle"
                        checked={menuOpen}
                        onChange={() => setMenuOpen(!menuOpen)}
                    />
                    <label className="lp-menu-btn" htmlFor="v3-menu-toggle">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        <span className="lp-sr-only">Toggle Menu</span>
                    </label>

                    <nav className="lp-nav">
                        <ul>
                            <li><a href="/product">Product</a></li>
                            <li><a href="#functions">Solutions</a></li>
                            <li><a href="/work">Work</a></li>
                            <li><a href="/lab">Lab</a></li>
                        </ul>
                    </nav>

                    <a className="lp-btn lp-btn-accent v3-header-cta" href={CALENDLY_URL}>Contact sales</a>
                </header>
            </div>

            {/* ── Hero ── */}
            <LandingHero />

            <HeroShowcaseGrid />

            {/* ── How it runs ── */}
            <section className="v3-split" id="proof">
                <div className="v3-split-copy">
                    <div className="lp-section-tag">01 / HOW IT RUNS</div>
                    <h2>
                        One layer.<br />
                        Every function.
                    </h2>
                    <p>
                        Orders, inventory, cost and channel land in one place first. Agents
                        work on top of that layer, and every run is visible: what it read,
                        what it decided, what it escalated, and what it is still holding.
                    </p>
                    <p>
                        Autonomy moves one notch at a time. A function starts under review,
                        earns its way to supervised, then runs on its own — and never
                        without a person who owns the number.
                    </p>
                    <div className="v3-hero-actions">
                        <a className="v3-btn v3-btn-primary" href={CALENDLY_URL}>Contact sales<ArrowRight size={16} />
                        </a>
                        <a className="v3-btn v3-btn-soft" href="/work">
                            Read the case studies
                        </a>
                    </div>

                    <dl className="v3-stats">
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <dt>{stat.value}</dt>
                                <dd>{stat.label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="v3-log" aria-label="Example run">
                    <div className="v3-log-bar">
                        <span className="v3-log-dot" />
                        <span className="v3-log-dot" />
                        <span className="v3-log-dot" />
                        <span className="v3-log-title">retail-ops · week 34</span>
                    </div>
                    <ol className="v3-log-body">
                        {RUN_LOG.map((line, i) => (
                            <li key={i} className={`v3-log-line is-${line.kind}`}>
                                {line.kind === "step" && (
                                    <span className={`v3-log-state is-${line.state}`}>
                                        {line.state === "done" ? "done" : "running"}
                                    </span>
                                )}
                                <span className="v3-log-text">{line.text}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <WhatWeBuildSection
                sectionNumber="02"
                intro={[
                    "Brands stall between $10M and $100M because their data doesn't move. Orders in one portal, inventory in another, a retailer deduction that arrives as a PDF and gets re keyed on Friday afternoon.",
                    "We build that layer first, then run agents on top of it across six functions, deployed in your stack, with senior operators accountable for the outcome until the system holds it on its own.",
                ]}
                handover={null}
            />

            <LandingCaseStudies />
            <TestimonialsSection />
            <FaqSection sectionNumber="03" />
            <FinalCtaSection />

            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <div className="lp-footer-tagline-group">
                        <h3 className="lp-footer-tagline">Commerce, Coordinated.</h3>
                    </div>
                    {/* One row rather than three columns: four short links read
                        as a nav, not as a sitemap. */}
                    <div className="lp-footer-nav">
                        <div className="lp-footer-col">
                            <a href="/product">How It Works</a>
                            <a href="#functions">Solutions</a>
                            <a href="/case-studies">Case Studies</a>
                            <a href="/lab">Lab</a>
                        </div>
                    </div>
                </div>

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
                    </div>
                    <div className="lp-footer-legal">
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
