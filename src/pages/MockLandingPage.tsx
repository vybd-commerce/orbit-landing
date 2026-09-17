import { useEffect, useState, type CSSProperties } from "react";
import FinalCtaSection from "../components/FinalCtaSection";
import OpsComparisonSection from "../components/OpsComparisonSection";
import TestimonialsSection from "../components/TestimonialsSection";
import WhatWeBuildSection from "../components/WhatWeBuildSection";
import FaqSection from "../components/FaqSection";
import { ArrowRight, Menu, X } from "lucide-react";
import { track } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/links";
import { useReveal } from "../hooks/useReveal";
import "./LandingPage.css";
import "./MockLandingPage.css";
import "./V2LandingPage.css";

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

export default function MockLandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const problem = useReveal<HTMLElement>();
    const midCta = useReveal<HTMLElement>();

    // Page-level SEO copy. Matches index.html's static baseline (what
    // crawlers/link-shares see before JS runs) — this effect is a safety
    // net for client-side route changes within the SPA, where index.html
    // itself never reloads. Restored on unmount so navigating away doesn't
    // leave another page stuck with this copy.
    useEffect(() => {
        const TITLE = "Ecommerce ops systems for $10M to $100M brands | Vybd";
        const SOCIAL_TITLE = "Scale the operation, not the org chart";
        const DESCRIPTION = "Between $10M and $100M, ops headcount triples because your people become the integration layer. We build the systems that absorb that work.";

        const prevTitle = document.title;
        document.title = TITLE;

        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute("content", DESCRIPTION);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        const prevOgTitle = ogTitle?.getAttribute("content") ?? null;
        ogTitle?.setAttribute("content", SOCIAL_TITLE);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        const prevOgDesc = ogDesc?.getAttribute("content") ?? null;
        ogDesc?.setAttribute("content", DESCRIPTION);

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const prevTwitterTitle = twitterTitle?.getAttribute("content") ?? null;
        twitterTitle?.setAttribute("content", SOCIAL_TITLE);

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
        <div className="landing-page lp-page-mock">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
                        <span className="lp-logo-text">Vybd</span>
                    </a>

                    <input
                        className="lp-menu-toggle"
                        type="checkbox"
                        id="lp-menu-toggle"
                        checked={menuOpen}
                        onChange={() => setMenuOpen(!menuOpen)}
                    />
                    <label className="lp-menu-btn" htmlFor="lp-menu-toggle">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        <span className="lp-sr-only">Toggle menu</span>
                    </label>

                    <nav className="lp-nav">
                        <ul>
                            <li><a href="#functions" onClick={() => setMenuOpen(false)}>What we build</a></li>
                            <li><a href="/work">Work</a></li>
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <a
                            className="lp-btn lp-btn-primary"
                            href={CALENDLY_URL}
                            onClick={() => track("cta_click", { location: "header" })}
                        >
                            Contact sales
                        </a>
                    </div>
                </header>
            </div>

            {/* ── Sticky mobile CTA (header CTA is hidden below 930px) ── */}
            <div className="lp-mobile-sticky-cta">
                <a
                    className="lp-btn lp-btn-primary"
                    href={CALENDLY_URL}
                    onClick={() => track("cta_click", { location: "mobile_sticky" })}
                >Contact sales</a>
            </div>

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
                    <p className="lp-hero-subtitle lp-mock-hero-subtitle">
                        Between $10M and $100M, most consumer brands triple their ops headcount because
                        their people become the integration layer between a dozen tools. We build the
                        systems that absorb that work, then run them with you until your team can.
                    </p>

                    <div className="lp-hero-cta">
                        <a
                            className="lp-btn lp-btn-primary lp-mock-hero-btn"
                            href={CALENDLY_URL}
                            onClick={() => track("cta_click", { location: "hero" })}
                        >
                            Contact sales
                        </a>
                        <a href="#functions" className="lp-btn-link lp-mock-hero-link">
                            See what we build <ArrowRight size={18} />
                        </a>
                    </div>

                    <p className="lp-mock-hero-trust">
                        <strong>First function live inside a month.</strong> Built by operators, backed by
                        founders, CPG executives, and angel investors who have scaled consumer businesses.
                    </p>
                </div>
            </section>

            {/* ── Cost curve ── */}
            <section className="lp-curve-section" id="cost-curve">
                <div style={{ maxWidth: "1140px", margin: "0 auto 1.5rem" }}>
                    <div className="lp-section-tag">01 / THE OPPORTUNITY</div>
                </div>
                <OpsComparisonSection />
            </section>

            {/* ── Your people are the integration layer ── */}
            <section
                className={`lp-v2-integration-section lp-reveal ${problem.revealed ? "is-revealed" : ""}`}
                id="integration-layer"
                ref={problem.ref}
            >
                <div className="lp-process-inner">
                    <div className="lp-section-tag">02 / THE PROBLEM</div>
                    <h2 className="lp-process-h2">Your people are the integration layer.</h2>
                    <p className="lp-v2-integration-intro">The tools are not the problem. The gaps between them are, and right now a person is filling every one.</p>

                    <ul className="lp-v2-integration-list">
                        {INTEGRATION_LAYER_ITEMS.map((item, i) => (
                            <li
                                key={item.trigger}
                                className={`lp-reveal ${problem.revealed ? "is-revealed" : ""}`}
                                style={{ "--reveal-i": i + 1 } as CSSProperties}
                            >
                                <p className="lp-v2-integration-trigger">{item.trigger}</p>
                                <p className="lp-v2-integration-detail">{item.detail}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Operating functions ── */}
            <WhatWeBuildSection sectionNumber="03" />

            {/* ── Testimonials ── */}
            <TestimonialsSection />

            {/* ── Mid-page CTA: highest-intent moment on the page, right
                 after the proof and before the objections. ── */}
            <section
                className={`lp-mid-cta lp-reveal ${midCta.revealed ? "is-revealed" : ""}`}
                id="mid-cta"
                ref={midCta.ref}
            >
                <p className="lp-mid-cta-line">Bring your own numbers. We will run them against your handoffs, and the first function is live inside a month.</p>
                <a
                    className="lp-btn lp-btn-primary lp-mock-hero-btn"
                    href={CALENDLY_URL}
                    onClick={() => track("cta_click", { location: "mid" })}
                >Contact sales</a>
            </section>

            {/* ── Objections ── */}
            <FaqSection sectionNumber="04" />

            {/* ── Final CTA ── */}
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
