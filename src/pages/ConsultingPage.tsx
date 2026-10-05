import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Bot, Check, Menu, X } from "lucide-react";
import HandoffChain from "../components/HandoffChain";
import OpsOsDiagram from "../components/OpsOsDiagram";
import ConsultingHeroVisual from "../components/ConsultingHeroVisual";
import ScaleStory from "../components/ScaleStory";

/* Story variants under review on /consulting/journey and /consulting/flow. */
const JourneyStory = lazy(() => import("../components/journey/JourneyStory"));
const FlowStory = lazy(() => import("../components/flow/FlowStory"));
import FinalCtaSection from "../components/FinalCtaSection";
import {
    ACCESS,
    AUDIT,
    DATA_LAYER,
    FINAL_CTA,
    HERO,
    HOW_IT_STARTS,
    MANAGED_OPS,
    OPERATOR_LINK,
    OUTCOMES_INTRO,
    PROOF,
    SEO,
    START_STEPS,
    TEAM,
    TEAM_ROLES,
    TESTIMONIALS_SHORT,
    TODO_NGO_APPLY_HREF,
    TODO_OPERATOR_HREF,
} from "../data/consultingCopy";
import { CHAIN_NODES, DEFAULT_LEAK_INDICES } from "../data/handoffChainModel";
import { useReveal } from "../hooks/useReveal";
import { track } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/links";
import "./LandingPage.css";
import "../components/LandingHero.css";
import "./ConsultingPage.css";

/* A section that fades its children up, staggered, the first time it scrolls
   in. Styles in ConsultingPage.css (.cons-reveal); useReveal handles reduced
   motion by starting revealed. */
function RevealSection({ className, id, children }: { className: string; id?: string; children: ReactNode }) {
    const { ref, revealed } = useReveal<HTMLElement>();
    return (
        <section ref={ref} id={id} className={`${className} cons-reveal${revealed ? " is-revealed" : ""}`}>
            {children}
        </section>
    );
}

/* Counts the number inside a metric string ("−28%", "$180K/yr") up from zero
   once `run` flips true, keeping the prefix and suffix as written. */
function CountUp({ value, run }: { value: string; run: boolean }) {
    const match = value.match(/^(\D*)([\d.]+)(.*)$/);
    const target = match ? parseFloat(match[2]) : 0;
    const [shown, setShown] = useState(run ? target : 0);

    useEffect(() => {
        if (!run || !match) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(target);
            return;
        }
        const start = performance.now();
        const duration = 1100;
        let frame = requestAnimationFrame(function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            setShown(target * (1 - Math.pow(1 - t, 3)));
            if (t < 1) frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run, target]);

    if (!match) return <>{value}</>;
    return (
        <>
            {match[1]}
            {Math.round(shown)}
            {match[3]}
        </>
    );
}

function ProofMetrics() {
    const { ref, revealed } = useReveal<HTMLDListElement>(0.4);
    return (
        <dl ref={ref} className="cons-metrics" aria-label={PROOF.caseName}>
            {PROOF.metrics.map((metric) => (
                <div key={metric.label}>
                    {/* The final figure for screen readers; the count is visual only. */}
                    <dt aria-label={metric.value}>
                        <span aria-hidden="true"><CountUp value={metric.value} run={revealed} /></span>
                    </dt>
                    <dd>{metric.label}</dd>
                </div>
            ))}
        </dl>
    );
}

export default function ConsultingPage({ story = "scale" }: { story?: "scale" | "journey" | "flow" }) {
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

        // The story variants are for review, not for search.
        let robots: HTMLMetaElement | null = null;
        if (story !== "scale") {
            robots = document.createElement("meta");
            robots.name = "robots";
            robots.content = "noindex";
            document.head.appendChild(robots);
        }

        return () => {
            robots?.remove();
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
            if (ogTitle && prevOgTitle !== null) ogTitle.setAttribute("content", prevOgTitle);
            if (ogDesc && prevOgDesc !== null) ogDesc.setAttribute("content", prevOgDesc);
            if (twitterTitle && prevTwitterTitle !== null) twitterTitle.setAttribute("content", prevTwitterTitle);
            if (twitterDesc && prevTwitterDesc !== null) twitterDesc.setAttribute("content", prevTwitterDesc);
        };
    }, [story]);

    const ngoHref = TODO_NGO_APPLY_HREF ?? CALENDLY_URL;
    const operatorHref = TODO_OPERATOR_HREF ?? CALENDLY_URL;

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
                            <li><a href="#managed-ops">Managed ops</a></li>
                        </ul>
                    </nav>

                    <a
                        className="lp-btn lp-btn-accent cons-header-cta"
                        href={CALENDLY_URL}
                        onClick={() => track("cta_click", { location: "consulting_header" })}
                    >
                        {HERO.cta}
                    </a>
                </header>
            </div>

            {/* ── 1. Hero ── */}
            <section className="v3-hero cons-hero" id="hero">
                <span className="v3-pill v3-pill--static">
                    <span className="v3-pill-text">{HERO.pill}</span>
                </span>

                <h1 className="v3-hero-title">{HERO.title}</h1>
                <p className="v3-hero-subtitle">{HERO.subtitle}</p>

                <div className="v3-hero-actions">
                    <a
                        className="v3-btn v3-btn-primary"
                        href={CALENDLY_URL}
                        onClick={() => track("cta_click", { location: "consulting_hero" })}
                    >
                        {HERO.cta}
                        <ArrowRight size={16} />
                    </a>
                    <a className="v3-btn v3-btn-soft" href="#outcomes">
                        {HERO.secondary}
                    </a>
                </div>

                <ConsultingHeroVisual />
            </section>

            {/* ── 1b. The short version ── pinned 3D scrub */}
            {story === "journey" ? (
                <Suspense fallback={<div className="scale journey" />}>
                    <JourneyStory />
                </Suspense>
            ) : story === "flow" ? (
                <Suspense fallback={<div className="scale flow" />}>
                    <FlowStory />
                </Suspense>
            ) : (
                <ScaleStory />
            )}

            {/* ── 2–4. Outcomes ── */}
            <RevealSection className="cons-section cons-outcomes-intro" id="outcomes">
                <div className="lp-section-tag">{OUTCOMES_INTRO.tag}</div>
                <h2 className="cons-h2">{OUTCOMES_INTRO.heading}</h2>
            </RevealSection>

            <RevealSection className="cons-section cons-outcome cons-outcome--wide" id="audit">
                <div className="cons-outcome-text">
                    <div className="lp-section-tag">{AUDIT.tag}</div>
                    <h2 className="cons-h2">{AUDIT.heading}</h2>
                    <p className="cons-lede">{AUDIT.body}</p>
                    <ul className="cons-points">
                        {AUDIT.points.map((point) => (
                            <li key={point}><Check size={16} />{point}</li>
                        ))}
                    </ul>
                </div>
                <figure className="cons-outcome-figure">
                    <HandoffChain
                        nodes={CHAIN_NODES}
                        leakIndices={DEFAULT_LEAK_INDICES}
                        ariaLabel={AUDIT.chainAria}
                        scanOnScroll
                    />
                </figure>
            </RevealSection>

            <RevealSection className="cons-section cons-outcome" id="data-layer">
                <div className="cons-outcome-text">
                    <div className="lp-section-tag">{DATA_LAYER.tag}</div>
                    <h2 className="cons-h2">{DATA_LAYER.heading}</h2>
                    <p className="cons-lede">{DATA_LAYER.body}</p>
                    <ul className="cons-points">
                        {DATA_LAYER.points.map((point) => (
                            <li key={point}><Check size={16} />{point}</li>
                        ))}
                    </ul>
                </div>
                <figure className="cons-outcome-figure">
                    <OpsOsDiagram />
                </figure>
            </RevealSection>

            <RevealSection className="cons-section cons-outcome" id="team">
                <div className="cons-outcome-text">
                    <div className="lp-section-tag">{TEAM.tag}</div>
                    <h2 className="cons-h2">{TEAM.heading}</h2>
                    <p className="cons-lede">{TEAM.body}</p>
                </div>
                <ul className="cons-roles">
                    {TEAM_ROLES.map((item) => (
                        <li className="cons-role" key={item.role}>
                            <span className="cons-role-name">{item.role}</span>
                            <span className="cons-role-agent">
                                <Bot size={15} strokeWidth={1.75} aria-hidden="true" />
                                {item.agent}
                            </span>
                        </li>
                    ))}
                </ul>
            </RevealSection>

            {/* ── 5. Proof ── */}
            <RevealSection className="cons-section cons-proof" id="proof">
                <div className="lp-section-tag">{PROOF.tag}</div>
                <h2 className="cons-h2">{PROOF.heading}</h2>

                <ProofMetrics />

                <a className="cons-text-link" href={PROOF.caseHref}>
                    {PROOF.caseLink} <ArrowRight size={14} />
                </a>

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
            </RevealSection>

            {/* ── 6. How it starts + 7. Access ── */}
            <RevealSection className="cons-section cons-start" id="how-it-starts">
                <div className="lp-section-tag">{HOW_IT_STARTS.tag}</div>
                <h2 className="cons-h2">{HOW_IT_STARTS.heading}</h2>

                <ol className="cons-steps">
                    {START_STEPS.map((step) => (
                        <li className="cons-step" key={step.num}>
                            <span className="cons-step-num">{step.num}</span>
                            <h3>{step.title}</h3>
                            <p>{step.body}</p>
                        </li>
                    ))}
                </ol>

                <a
                    className="lp-btn lp-btn-accent cons-start-cta"
                    href={CALENDLY_URL}
                    onClick={() => track("cta_click", { location: "consulting_start" })}
                >
                    {HOW_IT_STARTS.cta}
                    <ArrowRight size={16} />
                </a>

                {/* Access. Small on purpose: it is a door, not a section. */}
                <p className="cons-access">
                    {ACCESS.body}{" "}
                    <a href={ngoHref}>
                        {ACCESS.cta} <ArrowRight size={13} />
                    </a>
                </p>
            </RevealSection>

            {/* ── 8. Managed ops ── a separate offer, so a separate band. Type
                only: the roster is the visual. */}
            <RevealSection className="cons-managed" id="managed-ops">
                <div className="cons-managed-inner">
                    <div className="lp-section-tag">{MANAGED_OPS.tag}</div>
                    <h2 className="cons-h2">{MANAGED_OPS.heading}</h2>
                    <p className="cons-lede">{MANAGED_OPS.body}</p>
                    <ul className="cons-managed-roles">
                        {MANAGED_OPS.roles.map((role) => (
                            <li key={role}>{role}</li>
                        ))}
                    </ul>
                    <a
                        className="cons-text-link"
                        href={CALENDLY_URL}
                        onClick={() => track("cta_click", { location: "consulting_managed" })}
                    >
                        {MANAGED_OPS.cta} <ArrowRight size={14} />
                    </a>
                </div>
            </RevealSection>

            {/* ── 9. CTA ── */}
            <FinalCtaSection
                heading={FINAL_CTA.heading}
                subhead={FINAL_CTA.subhead}
                buttonLabel={FINAL_CTA.button}
                location="consulting_final"
            />

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
                            <a href={operatorHref}>{OPERATOR_LINK}</a>
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
