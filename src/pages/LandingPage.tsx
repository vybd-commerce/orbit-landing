import { useEffect, useRef, useState } from "react";
import SupplierParticleCanvas from "../components/SupplierParticleCanvas";
import ParticleField from "../components/ParticleField";
import WhatWeBuildSection from "../components/WhatWeBuildSection";
import HeroShowcaseGrid from "../components/HeroShowcaseGrid";
import {
    Zap,
    ShieldCheck,
    MessageSquare,
    Menu,
    X,
    Package,
    Truck,
    Warehouse,
    ShoppingCart,
    ChartColumn,
    Globe,
    Boxes,
    Settings,
    Code,
    FileText,
    Terminal,
    RefreshCw,
    Upload,
    Layers,
    GitBranch,
    Share2,
    ArrowRight,
    Rocket,
    Plus
} from "lucide-react";
import LandingCaseStudies from "../components/LandingCaseStudies";
import TestimonialGlobe from "../components/TestimonialGlobe";
import "./LandingPage.css";

/**
 * Set this to your main platform URL for CTA buttons.
 * For example: "https://app.orbitplatform.com"
 */
const PLATFORM_URL = "#";

const goTo = (path: string) => {
    window.location.href = `${PLATFORM_URL}${path}`;
};

// Confirmed real, permission-cleared clients. 3 slots left open below —
// need 3 more brand names/logos to complete the row of ten.
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

const iconList = [
    Package, Truck, Warehouse, ShieldCheck, ShoppingCart,
    ChartColumn, Globe, Boxes, Settings, Zap,
    Code, FileText, Terminal, RefreshCw, Upload,
    Layers, GitBranch, MessageSquare, Share2, ArrowRight,
    Package, Truck, Warehouse, ShieldCheck,
];

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [iconsVisible, setIconsVisible] = useState(false);
    const [supplierHovered, setSupplierHovered] = useState(false);
    const iconsRef = useRef<HTMLDivElement>(null);

    // Intersection observer to slide-in icons
    useEffect(() => {
        const el = iconsRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIconsVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        obs.observe(el);
        return () => obs.disconnect();
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
        <div className="landing-page lp-theme-dark">
            {/* Sits behind every section, including the header. Dimmer than a
                per-section field would be, since it now runs the full page. */}
            <ParticleField mode="page" particleCount={900} opacity={0.35} />
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
                        {/* <span className="lp-logo-icon">O</span> */}
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
                        <span className="lp-sr-only">Toggle Menu</span>
                    </label>

                    <nav className="lp-nav">
                        <ul>
                            <li><a href="#functions">How it works</a></li>
                            <li><a href="/lab">Lab</a></li>
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <button
                            className="lp-btn lp-btn-primary"
                            onClick={() => goTo("/auth")}
                        >
                            Contact sales
                        </button>
                    </div>
                </header>
            </div>

            {/* ── Sticky mobile CTA (header's CTA is hidden below 930px) ── */}
            <div className="lp-mobile-sticky-cta">
                <button className="lp-btn lp-btn-primary" onClick={() => goTo("/auth")}>Contact sales</button>
            </div>

            {/* ── Hero ── */}
            <section className="lp-hero" id="hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-supporting">
                        US market entry for international brands
                    </div>
                    <h2 className="lp-hero-title">
                        Your brand, established in America.
                    </h2>
                    <p className="lp-hero-subtitle">
                        Vybd runs your entire US launch — demand, storefront, and supply chain — so you enter a market you don't know without building a team you don't have.
                    </p>

                    <div className="lp-hero-cta">
                        <a href="/product" className="lp-btn-link" style={{ fontWeight: 600, color: 'var(--lp-on-surface)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            See what we run <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Capability tiles, straight under the hero ── */}
            <HeroShowcaseGrid />

            {/* ── Logo Row ── */}
            <section className="lp-logo-row-section">
                <div className="lp-logo-row-header">Brands entering the US with Vybd</div>
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

            <div
                className={`lp-icons ${iconsVisible ? "lp-icons-animate" : ""}`}
                ref={iconsRef}
            >
                {iconList.map((Icon, i) => (
                    <div
                        className="lp-icon-bubble"
                        key={i}
                        style={{ "--i": i } as React.CSSProperties}
                    >
                        <Icon size={28} strokeWidth={1.5} />
                    </div>
                ))}
            </div>














            {/* ── What We Build ── */}
            <WhatWeBuildSection
                sectionNumber="01"
                intro={[
                    "Brands stall between $10M and $100M because their data doesn't move. Orders in one portal, inventory in another, a retailer deduction that arrives as a PDF and gets re keyed on Friday afternoon. People become the integration layer, and that's what you're actually paying for when ops headcount triples.",
                    "We build that layer first: one connected view of orders, inventory, cost, and channel. Then we run agents on top of it across six functions, deployed in your stack, with senior operators accountable for the outcome until the system holds it on its own.",
                ]}
                handover={null}
            />

            {/* ── Where to Start ── */}
            <section className="lp-process-section" id="where-to-start">
                <div className="lp-process-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">02 / WHERE TO START</div>
                        <h2 className="lp-process-h2">You don't need all six.<br />Start where you need us.</h2>
                        <p className="pp-section-intro">
                            Most brands hand us the whole US entry. Some come for one piece — a store, a campaign, a warehouse — and add the rest as they grow. You only pay for what you need.
                        </p>
                    </div>

                    <div className="lp-agent-steps-container">
                        <div className="lp-agent-steps">
                            {/* Storefront */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap doorway">
                                    <div className="lp-agent-step-icon">
                                        <ShoppingCart size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Get your US storefront live</h3>
                                </div>
                                <div className="lp-agent-step-card">
                                    <p>Shopify store, website, payments, US entity, merchant-of-record — the whole digital storefront, built to convert American buyers.</p>
                                    <a href="#" className="lp-doorway-link" onClick={(e) => { e.preventDefault(); goTo("/auth"); }}>Start here <ArrowRight size={14} /></a>
                                </div>
                            </div>

                            {/* Crowdfunding */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap doorway">
                                    <div className="lp-agent-step-icon">
                                        <Rocket size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Run your Kickstarter or crowdfunding launch</h3>
                                </div>
                                <div className="lp-agent-step-card">
                                    <p>Validate US demand before you commit. We build and run the campaign end to end.</p>
                                    <a href="#" className="lp-doorway-link" onClick={(e) => { e.preventDefault(); goTo("/auth"); }}>Start here <ArrowRight size={14} /></a>
                                </div>
                            </div>

                            {/* Warehousing */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap doorway">
                                    <div className="lp-agent-step-icon">
                                        <Warehouse size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Set up US warehousing & fulfillment</h3>
                                </div>
                                <div className="lp-agent-step-card">
                                    <p>Stock on US soil with fast, tracked last-mile — without signing a 3PL you don't understand.</p>
                                    <a href="#" className="lp-doorway-link" onClick={(e) => { e.preventDefault(); goTo("/auth"); }}>Start here <ArrowRight size={14} /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="lp-doorway-closing">One partner, whichever door you enter through.</p>
                </div>
            </section>

            {/* ── Mechanism Section (How We Run It) ── */}
            <section className="lp-who" id="who">
                <div
                    className="lp-who-card lp-who-card--suppliers"
                    onMouseEnter={() => setSupplierHovered(true)}
                    onMouseLeave={() => setSupplierHovered(false)}
                >
                    <SupplierParticleCanvas hovered={supplierHovered} />
                    <div className="lp-section-tag" style={{ justifyContent: 'center' }}>03 / HOW WE RUN IT</div>
                    <h3>
                        Operate at the speed of culture
                    </h3>
                    <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--lp-on-surface-variant)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Agents carry the volume — monitoring, classifying, routing, optimizing, around the clock. Senior operators carry the judgment and own the outcome.
                    </p>

                    <button
                        className="lp-btn lp-btn-accent"
                        onClick={() => goTo("/auth")}
                    >Contact sales</button>
                </div>
            </section>



            {/* ── Case Studies ── */}
            <LandingCaseStudies />

            {/* ── Testimonial Globe (Interactive 3D) ── */}
            <TestimonialGlobe />

            {/* ── Horizon Band (routes to the Lab) ── */}
            <section className="lp-horizon-section" id="horizon">
                <div className="lp-horizon-inner">
                    <div className="lp-section-tag" style={{ justifyContent: 'center' }}>THE HORIZON</div>
                    <h3 className="lp-horizon-headline">The agency is what we run today. Here's what we're building next.</h3>
                    <p className="lp-horizon-body">
                        Every entry we run feeds a per-brand knowledge layer we call Brand Brain — so each launch makes the next one smarter. It's early, and it's in development. But it's where Vybd is headed.
                    </p>
                    <a href="/lab" className="lp-horizon-link">
                        See the Lab <ArrowRight size={16} />
                    </a>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="lp-final-cta" id="final-cta">
                <div className="lp-final-cta-card lp-dark" id="final-cta-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <ParticleField particleCount={800} opacity={0.8} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2>
                            Ready to enter the US?<br />
                            Let's map your launch.
                        </h2>

                        <div className="lp-final-cta-buttons">
                            <button
                                className="lp-btn lp-btn-primary"
                                onClick={() => goTo("/auth")}
                            >Contact sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <div className="lp-footer-tagline-group">
                        <h3 className="lp-footer-tagline">Commerce, Coordinated.</h3>
                        <p className="lp-footer-ethos">enabling commerce, disabling borders</p>
                    </div>
                    <div className="lp-footer-nav">
                        <div className="lp-footer-col">
                            <a href="/product">How It Works</a>
                            <a href="/#functions">Solutions</a>
                        </div>
                        <div className="lp-footer-col">
                            <a href="/case-studies">Case Study</a>
                        </div>
                        <div className="lp-footer-col">
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
                    <div className="lp-footer-logo-small">Vybd</div>
                    <div className="lp-footer-legal">
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
