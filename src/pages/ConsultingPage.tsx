import { useEffect, useState } from "react";
import {
    ArrowRight,
    BatteryCharging,
    Check,
    Factory,
    Menu,
    Package,
    Shirt,
    Snowflake,
    X,
    type LucideIcon,
} from "lucide-react";
import HandoffChain from "../components/HandoffChain";
import FinalCtaSection from "../components/FinalCtaSection";
import {
    ACCESS,
    DIAGNOSIS,
    FAILURE_MODES,
    FINAL_CTA,
    HERO,
    HOW_WE_WORK,
    NETWORK,
    OPERATOR_DOOR,
    PROOF,
    SECTORS,
    SEO,
    SPRINT,
    TESTIMONIALS_SHORT,
    TODO_BAYANGROM_CONTEXT,
    TODO_BAYANGROM_MECHANISM,
    TODO_CREDIBILITY_FIGURES,
    TODO_NGO_APPLY_HREF,
    TODO_OPERATOR_COUNTS,
    WORK_STEPS,
} from "../data/consultingCopy";
import { CHAIN_NODES, DEFAULT_LEAK_INDICES, TOTAL_HANDOFFS, TOTAL_NODES } from "../data/handoffChainModel";
import { track } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/links";
import "./LandingPage.css";
import "./ConsultingPage.css";

/* The mini chains inside the failure cards are a five-stage slice of the same
   chain the hero draws, so the two read as the same operation at two zoom
   levels rather than as two different diagrams. */
const MINI_CHAIN = CHAIN_NODES.slice(2, 7);

const SECTOR_ICONS: Record<string, LucideIcon> = {
    cpg: Package,
    food: Snowflake,
    fashion: Shirt,
    batteries: BatteryCharging,
    manufacturing: Factory,
};

function operatorCountLabel(key: keyof typeof TODO_OPERATOR_COUNTS): string | null {
    const count = TODO_OPERATOR_COUNTS[key];
    if (count === null) return null;
    return `${count} ${count === 1 ? "operator" : "operators"}`;
}

export default function ConsultingPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    /* Same pattern as the other pages: index.html carries the crawler-visible
       baseline, this effect covers client-side route changes and restores the
       previous copy on the way out. */
    useEffect(() => {
        const prevTitle = document.title;
        document.title = SEO.title;

        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute("content", SEO.description);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        const prevOgTitle = ogTitle?.getAttribute("content") ?? null;
        ogTitle?.setAttribute("content", SEO.socialTitle);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        const prevOgDesc = ogDesc?.getAttribute("content") ?? null;
        ogDesc?.setAttribute("content", SEO.description);

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const prevTwitterTitle = twitterTitle?.getAttribute("content") ?? null;
        twitterTitle?.setAttribute("content", SEO.socialTitle);

        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        const prevTwitterDesc = twitterDesc?.getAttribute("content") ?? null;
        twitterDesc?.setAttribute("content", SEO.description);

        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
            if (ogTitle && prevOgTitle !== null) ogTitle.setAttribute("content", prevOgTitle);
            if (ogDesc && prevOgDesc !== null) ogDesc.setAttribute("content", prevOgDesc);
            if (twitterTitle && prevTwitterTitle !== null) twitterTitle.setAttribute("content", prevTwitterTitle);
            if (twitterDesc && prevTwitterDesc !== null) twitterDesc.setAttribute("content", prevTwitterDesc);
        };
    }, []);

    const ngoHref = TODO_NGO_APPLY_HREF ?? CALENDLY_URL;

    return (
        <div className="landing-page lp-theme-dark lp-page-consulting">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
                        <span className="lp-logo-text">Vybd</span>
                    </a>

                    <input
                        className="lp-menu-toggle"
                        type="checkbox"
                        id="consulting-menu-toggle"
                        checked={menuOpen}
                        onChange={() => setMenuOpen(!menuOpen)}
                    />
                    <label className="lp-menu-btn" htmlFor="consulting-menu-toggle">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        <span className="lp-sr-only">Toggle Menu</span>
                    </label>

                    <nav className="lp-nav">
                        <ul>
                            <li><a href="/product">Product</a></li>
                            <li><a href="/work">Work</a></li>
                            <li><a href="/consulting" aria-current="page">Consulting</a></li>
                            <li><a href="/lab">Lab</a></li>
                        </ul>
                    </nav>

                    <a
                        className="lp-btn lp-btn-accent cons-header-cta"
                        href={CALENDLY_URL}
                        onClick={() => track("cta_click", { location: "consulting_header" })}
                    >
                        Book a call
                    </a>
                </header>
            </div>

            {/* ── 1. Hero ── */}
            <section className="cons-hero" id="hero">
                <div className="cons-hero-copy">
                    <div className="lp-section-tag">{HERO.eyebrow}</div>
                    <h1 className="cons-hero-title">{HERO.headline}</h1>
                    <p className="cons-hero-subtitle">{HERO.subhead}</p>

                    <div className="cons-hero-actions">
                        <a
                            className="lp-btn lp-btn-primary"
                            href={CALENDLY_URL}
                            onClick={() => track("cta_click", { location: "consulting_hero" })}
                        >
                            {HERO.primaryCta}
                            <ArrowRight size={16} />
                        </a>
                        <a className="cons-text-link" href="#sprint">
                            {HERO.secondaryCta} ↓
                        </a>
                    </div>
                </div>

                <figure className="cons-hero-chain">
                    <HandoffChain
                        nodes={CHAIN_NODES}
                        leakIndices={DEFAULT_LEAK_INDICES}
                        ariaLabel={`An order-to-cash chain of ${TOTAL_NODES} stages and ${TOTAL_HANDOFFS} handoffs, with ${DEFAULT_LEAK_INDICES.length} stages marked as leak points.`}
                    />
                    <figcaption>{HERO.chainCaption}</figcaption>
                </figure>
            </section>

            {/* ── 2. The diagnosis ── */}
            <section className="cons-section cons-diagnosis" id="diagnosis">
                <div className="lp-section-tag">{DIAGNOSIS.tag}</div>
                <h2 className="cons-h2">{DIAGNOSIS.heading}</h2>
                <p className="cons-lede">{DIAGNOSIS.intro}</p>

                <ol className="cons-failure-grid">
                    {FAILURE_MODES.map((mode, i) => (
                        <li className="cons-failure-card" key={mode.id}>
                            <span className="cons-failure-index">{i + 1}</span>
                            <h3>{mode.title}</h3>
                            <p>{mode.body}</p>
                            <HandoffChain
                                className="cons-failure-chain"
                                nodes={MINI_CHAIN}
                                leakIndices={mode.leakIndices}
                                absorbedIndices={mode.absorbedIndices}
                                ariaLabel={mode.chainAria}
                                showLabels={false}
                                allowStack={false}
                            />
                        </li>
                    ))}
                </ol>

                <ul className="cons-chain-legend" aria-hidden="true">
                    <li><span className="cons-legend-swatch" /> untouched</li>
                    <li><span className="cons-legend-swatch cons-legend-swatch--absorbed" /> automated</li>
                    <li><span className="cons-legend-swatch cons-legend-swatch--leak" /> where the money leaks</li>
                </ul>

                <p className="cons-closing">{DIAGNOSIS.closing}</p>
            </section>

            {/* ── 3. The network ── */}
            <section className="cons-section cons-network" id="network">
                <div className="lp-section-tag">{NETWORK.tag}</div>
                <h2 className="cons-h2">{NETWORK.heading}</h2>
                <p className="cons-lede">{NETWORK.body}</p>

                <ul className="cons-sector-grid">
                    {SECTORS.map((sector) => {
                        const Icon = SECTOR_ICONS[sector.key];
                        const count = operatorCountLabel(sector.key);
                        return (
                            <li className="cons-sector" key={sector.key}>
                                <Icon size={20} strokeWidth={1.5} />
                                <h3>{sector.name}</h3>
                                {count && <span className="cons-sector-count">{count}</span>}
                                <p>{sector.depth}</p>
                            </li>
                        );
                    })}
                </ul>

                <p className="cons-credibility">
                    {NETWORK.credibilityLead} {TODO_CREDIBILITY_FIGURES.first},{" "}
                    {TODO_CREDIBILITY_FIGURES.second}, and {TODO_CREDIBILITY_FIGURES.third}.{" "}
                    <strong>{NETWORK.credibilityTail}</strong>
                </p>
            </section>

            {/* ── 4. How we work ── */}
            <section className="lp-process-section cons-how" id="how-we-work">
                <div className="lp-process-inner">
                    <div className="lp-section-tag">{HOW_WE_WORK.tag}</div>
                    <h2 className="lp-process-h2">{HOW_WE_WORK.heading}</h2>

                    <div className="lp-process-track cons-process-track">
                        {WORK_STEPS.map((step) => (
                            <div
                                className={`lp-process-step${step.emphasis ? " cons-process-step--lead" : ""}`}
                                key={step.num}
                            >
                                <div className="lp-step-num-display">{step.num}</div>
                                <div className="lp-process-step-tag">{step.tag}</div>
                                <h4>{step.title}</h4>
                                <p>{step.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. Proof ── */}
            <section className="cons-section cons-proof" id="proof">
                <div className="lp-section-tag">{PROOF.tag}</div>
                <h2 className="cons-h2">{PROOF.heading}</h2>

                <p className="cons-lede">
                    <strong>{PROOF.caseName}.</strong> {TODO_BAYANGROM_CONTEXT}
                </p>

                <dl className="cons-metrics">
                    {PROOF.metrics.map((metric) => (
                        <div key={metric.label}>
                            <dt>{metric.value}</dt>
                            <dd>{metric.label}</dd>
                        </div>
                    ))}
                </dl>

                <p className="cons-mechanism">{TODO_BAYANGROM_MECHANISM}</p>

                <div className="cons-chain-compare">
                    <figure>
                        <figcaption>{PROOF.beforeLabel}</figcaption>
                        <HandoffChain
                            nodes={CHAIN_NODES}
                            leakIndices={DEFAULT_LEAK_INDICES}
                            ariaLabel={`Bayangrom's chain before the build: ${DEFAULT_LEAK_INDICES.length} of ${TOTAL_NODES} stages leaking.`}
                        />
                    </figure>
                    <figure>
                        <figcaption>{PROOF.afterLabel}</figcaption>
                        <HandoffChain
                            nodes={CHAIN_NODES}
                            absorbedIndices={DEFAULT_LEAK_INDICES}
                            ariaLabel={`Bayangrom's chain after the build: the same ${DEFAULT_LEAK_INDICES.length} stages absorbed by agents.`}
                        />
                    </figure>
                </div>

                <a className="cons-text-link" href={PROOF.caseHref}>
                    {PROOF.caseLink} <ArrowRight size={14} />
                </a>

                <h3 className="cons-h3">{PROOF.testimonialHeading}</h3>
                <div className="cons-quotes">
                    {TESTIMONIALS_SHORT.map((item) => (
                        <blockquote className="cons-quote" key={item.name}>
                            <p>{item.quote}</p>
                            <footer>
                                {item.logoImage && (
                                    <img src={item.logoImage} alt="" className="cons-quote-logo" />
                                )}
                                <span>
                                    <strong>{item.name}</strong>
                                    {" · "}
                                    {item.title}
                                </span>
                            </footer>
                        </blockquote>
                    ))}
                </div>
            </section>

            {/* ── 6. The sprint + 7. Access ── */}
            <section className="lp-pricing-section cons-sprint" id="sprint">
                <div className="cons-sprint-inner">
                    <div className="lp-section-tag">{SPRINT.tag}</div>
                    <h2 className="cons-h2">{SPRINT.heading}</h2>

                    {/* One offer, one card. Inventing tiers around it would cost
                        the clarity that makes the price work. */}
                    <div className="lp-pricing-card cons-sprint-card">
                        <div className="lp-pricing-card-top">
                            <div className="lp-pricing-price">
                                {SPRINT.price} <span>{SPRINT.priceMeta}</span>
                            </div>
                            <p className="cons-sprint-anchor">{SPRINT.anchor}</p>
                            <a
                                className="lp-btn lp-btn-accent"
                                href={CALENDLY_URL}
                                onClick={() => track("cta_click", { location: "consulting_sprint" })}
                            >
                                {SPRINT.cta}
                                <ArrowRight size={16} />
                            </a>
                        </div>

                        <div className="lp-pricing-card-bottom">
                            <h3 className="cons-sprint-subhead">{SPRINT.deliverablesHeading}</h3>
                            <ul className="lp-pricing-list">
                                {SPRINT.deliverables.map((item) => (
                                    <li key={item}>
                                        <Check size={16} className="lp-check-icon" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <h3 className="cons-sprint-subhead">{SPRINT.afterHeading}</h3>
                            <p className="cons-sprint-after">{SPRINT.after}</p>
                        </div>
                    </div>

                    {/* Access. Two lines at smaller type, deliberately not its own
                        section: an ungated free offer presented prominently
                        undercuts the price directly above it. */}
                    <p className="cons-access">
                        {ACCESS.body}{" "}
                        <a href={ngoHref}>
                            {ACCESS.cta} <ArrowRight size={13} />
                        </a>
                    </p>
                </div>
            </section>

            {/* ── 8. CTA ── */}
            <FinalCtaSection
                heading={FINAL_CTA.heading}
                subhead={FINAL_CTA.subhead}
                buttonLabel={FINAL_CTA.button}
                location="consulting_final"
            />

            {/* ── 9. Operator door ── */}
            <section className="cons-operators" id="operators">
                <div className="cons-operators-inner">
                    <h2>{OPERATOR_DOOR.heading}</h2>
                    <p>{OPERATOR_DOOR.body}</p>
                    <a className="cons-text-link" href={CALENDLY_URL}>
                        {OPERATOR_DOOR.cta} <ArrowRight size={14} />
                    </a>
                </div>
            </section>

            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <div className="lp-footer-tagline-group">
                        <h3 className="lp-footer-tagline">Commerce, Coordinated.</h3>
                    </div>
                    <div className="lp-footer-nav">
                        <div className="lp-footer-col">
                            <a href="/product">How It Works</a>
                            <a href="/consulting">Consulting</a>
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
