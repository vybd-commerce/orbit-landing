import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SupplierParticleCanvas from "../components/SupplierParticleCanvas";
import LlmLogos from "../components/LlmLogos";
import FinalCtaParticleCanvas from "../components/FinalCtaParticleCanvas";
import LanguageSwitcher from "../components/LanguageSwitcher";
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
    Calendar,
    CreditCard,
    Search,
    Sparkles,
    TrendingUp,
    Rocket,
    Check
} from "lucide-react";
import HeroVisual from "../components/HeroVisual";
import TestimonialGlobe from "../components/TestimonialGlobe";
import "./LandingPage.css";

const enterOrbit = () => { window.location.href = "/onboard"; };

const bentoClasses: Record<string, string> = {
    "01": "lp-fn-intelligence",
    "02": "lp-fn-compliance",
    "03": "lp-fn-logistics",
    "04": "lp-fn-warehousing",
    "05": "lp-fn-ecommerce",
    "06": "lp-fn-marketing",
};

const iconList = [
    Package, Truck, Warehouse, ShieldCheck, ShoppingCart,
    ChartColumn, Globe, Boxes, Settings, Zap,
    Code, FileText, Terminal, RefreshCw, Upload,
    Layers, GitBranch, MessageSquare, Share2, ArrowRight,
    Package, Truck, Warehouse, ShieldCheck,
];

const tierIcons = [
    <Sparkles size={28} strokeWidth={1.5} />,
    <TrendingUp size={28} strokeWidth={1.5} />,
    <Rocket size={28} strokeWidth={1.5} />,
];

const tierIconColors = ["#4CAF50", "#FF7043", "#42A5F5"];

export default function LandingPage() {
    const { t } = useTranslation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [iconsVisible, setIconsVisible] = useState(false);
    const [supplierHovered, setSupplierHovered] = useState(false);
    const iconsRef = useRef<HTMLDivElement>(null);

    const modules = t("functions.modules", { returnObjects: true }) as Array<{
        label: string; problemHook: string; problemBody: string;
        stat: string; statLabel: string; solutionDetail: string;
        tags: string[]; status: string; category: string;
    }>;

    const processSteps = t("process.steps", { returnObjects: true }) as Array<{
        title: string; subtitle: string; bullets: string[];
    }>;

    const pricingTiers = t("pricing.tiers", { returnObjects: true }) as Array<{
        name: string; price: string; per: string; gmv: string;
        desc: string; cta: string; features: string[];
    }>;

    // Paint Worklet Registration
    useEffect(() => {
        if ("paintWorklet" in CSS) {
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

    // Handle hash navigation
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }, 100);
            }
        };

        scrollToHash();
        window.addEventListener("hashchange", scrollToHash);
        return () => window.removeEventListener("hashchange", scrollToHash);
    }, []);

    return (
        <div className="landing-page">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
                        <span className="lp-logo-text">Orbit</span>
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
                            <li><a href="#functions">{t("nav.solution")}</a></li>
                            <li><a href="#testimonials">{t("nav.testimonials")}</a></li>
                            <li><a href="#pricing">{t("nav.pricing")}</a></li>
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <LanguageSwitcher />
                        <button className="lp-btn lp-btn-primary" onClick={enterOrbit}>
                            {t("nav.enterOrbit")}
                        </button>
                    </div>
                </header>
            </div>

            {/* ── Hero ── */}
            <section className="lp-hero" id="hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-supporting">
                        {t("hero.supporting")}
                    </div>
                    <h2 className="lp-hero-title">
                        {t("hero.title1")}<br />
                        <span>{t("hero.title2")}</span>
                    </h2>
                    <p className="lp-hero-subtitle">
                        {t("hero.subtitle")}
                    </p>

                    <div className="lp-hero-cta">
                        <button className="lp-btn lp-btn-accent" onClick={enterOrbit}>
                            {t("nav.enterOrbit")} <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="lp-hero-visual-wrapper">
                    <HeroVisual />
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

            {/* ── Functions Bento ── */}
            <section className="lp-functions-section" id="functions">
                <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
                    <div className="lp-section-tag">{t("functions.sectionTag")}</div>
                </div>
                <div className="lp-functions-header" style={{ alignItems: "flex-start" }}>
                    <div>
                        <h2>{t("functions.heading")}</h2>
                    </div>
                    <div className="lp-functions-header-right">
                        <p>{t("functions.description")}</p>
                    </div>
                </div>

                <div className="lp-fn-bento">
                    {modules.map((module, idx) => {
                        const id = String(idx + 1).padStart(2, "0");
                        return (
                            <div key={id} className={`lp-fn-tile lp-fn-bento-tile ${bentoClasses[id]}`}>
                                <div>
                                    <div className="lp-fn-tile-header">
                                        <span className="lp-fn-index">{id}</span>
                                        {module.category && <span className="lp-fn-category">{module.category}</span>}
                                    </div>
                                    <div className="lp-fn-title">{module.label}</div>

                                    <div className="lp-fn-bento-content-stack">
                                        <div className="lp-fn-bento-problem-state">
                                            <div className="lp-fn-tile-problem-hook">{module.problemHook}</div>
                                            <div className="lp-fn-tile-problem-body">{module.problemBody}</div>
                                        </div>
                                        <div className="lp-fn-desc-full lp-fn-bento-solution-state">{module.solutionDetail}</div>
                                    </div>
                                </div>
                                <div className="lp-fn-bento-solution-footer">
                                    <div className="lp-fn-large-stat">{module.stat}</div>
                                    <div className="lp-fn-large-stat-label">{module.statLabel}</div>
                                    <div className="lp-fn-footer mt-auto">
                                        <span className="lp-fn-footer-label">{module.tags.join(" · ")}</span>
                                        <span className="lp-fn-footer-status">{module.status}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                    <a href="/product" className="lp-product-tech-link" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--lp-primary)", textDecoration: "none" }}>
                        {t("functions.technicalLink")}
                    </a>
                </div>
            </section>

            {/* ── Process Section ── */}
            <section className="lp-process-section" id="process">
                <div className="lp-process-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">{t("process.sectionTag")}</div>
                        <h2 className="lp-process-h2">
                            {t("process.heading1")}<br />{t("process.heading2")}
                        </h2>
                    </div>

                    <div className="lp-agent-steps-container">
                        <div className="lp-agent-steps-line"></div>
                        <div className="lp-agent-steps">
                            {processSteps.map((step, idx) => {
                                const iconWrapClass = ["autonomous", "supervised", "approval"][idx];
                                const StepIcon = [Zap, ShieldCheck, MessageSquare][idx];
                                return (
                                    <div className="lp-agent-step" key={idx}>
                                        <div className={`lp-agent-step-icon-wrap ${iconWrapClass}`}>
                                            <div className="lp-agent-step-icon">
                                                <StepIcon size={24} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <div className="lp-agent-step-content">
                                            <h3>{step.title}</h3>
                                            <p>{step.subtitle}</p>
                                        </div>
                                        <div className="lp-agent-step-card">
                                            <ul>
                                                {step.bullets.map((b, bi) => (
                                                    <li key={bi}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Two-Column CTA (For Brands) ── */}
            <section className="lp-who" id="who">
                <div
                    className="lp-who-card lp-who-card--suppliers"
                    onMouseEnter={() => setSupplierHovered(true)}
                    onMouseLeave={() => setSupplierHovered(false)}
                >
                    <SupplierParticleCanvas hovered={supplierHovered} />
                    <h3>
                        {t("who.forBrands")}
                        <span>{t("who.manageBrand")}</span>
                    </h3>

                    <button className="lp-btn lp-btn-accent" onClick={enterOrbit}>
                        {t("nav.enterOrbit")}
                    </button>
                </div>
            </section>

            {/* ── Testimonial Globe ── */}
            <TestimonialGlobe />

            {/* ── Pricing Section ── */}
            <section className="lp-pricing-section" id="pricing">
                <div className="lp-pricing-header">
                    <h2>{t("pricing.heading")}</h2>
                </div>

                <LlmLogos />

                <div className="lp-pricing-features">
                    <div className="lp-feature-pill"><Calendar size={14} className="lp-pricing-feat-icon" /> {t("pricing.pills.noContracts")}</div>
                    <div className="lp-feature-pill"><CreditCard size={14} className="lp-pricing-feat-icon" /> {t("pricing.pills.cancelAnytime")}</div>
                    <div className="lp-feature-pill"><Search size={14} className="lp-pricing-feat-icon" /> {t("pricing.pills.transparency")}</div>
                </div>

                <div className="lp-pricing-roi-banner" style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--lp-on-surface-variant)" }}>
                    <span style={{ display: "inline-block", padding: "0.3rem 1.2rem", background: "var(--lp-surface-variant)", borderRadius: "999px" }}>
                        <strong>ROI:</strong> {t("pricing.roiBanner")}
                    </span>
                </div>

                <div className="lp-pricing-grid">
                    {pricingTiers.map((tier, idx) => (
                        <div className="lp-pricing-card" key={idx}>
                            <div className="lp-pricing-card-top">
                                <div className="lp-pricing-icon" style={{ color: tierIconColors[idx] }}>
                                    {tierIcons[idx]}
                                </div>
                                <h3>{tier.name}</h3>
                                <div className="lp-pricing-price">{tier.price}<span>{tier.per}</span></div>
                                <div className="lp-pricing-gmv">{tier.gmv}</div>
                                <p className="lp-pricing-desc">{tier.desc}</p>
                                <button
                                    className="lp-btn-dark lp-btn-pricing"
                                    style={{ width: "100%", justifyContent: "center" }}
                                    onClick={enterOrbit}
                                >
                                    {tier.cta}
                                </button>
                            </div>
                            <div className="lp-pricing-card-bottom">
                                <ul className="lp-pricing-list">
                                    {tier.features.map((f, fi) => (
                                        <li key={fi}><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> {f}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lp-custom-plan-banner">
                    <div className="lp-custom-banner-left">
                        <div className="lp-custom-banner-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="#FF4D4D" />
                            </svg>
                        </div>
                        <div className="lp-custom-banner-texts">
                            <h3>{t("pricing.custom.title")}</h3>
                            <p>{t("pricing.custom.desc")}</p>
                        </div>
                    </div>
                    <div className="lp-custom-banner-right">
                        <form className="lp-pricing-email-form" onSubmit={(e) => {
                            e.preventDefault();
                            const btn = e.currentTarget.querySelector("button") as HTMLButtonElement;
                            if (btn) { btn.textContent = "✓ Received"; btn.style.background = "#158d75"; btn.disabled = true; }
                        }}>
                            <div className="lp-pricing-form-wrapper">
                                <input type="email" placeholder={t("pricing.custom.placeholder")} required className="lp-pricing-form-input" />
                                <button type="submit" className="lp-btn-purple">{t("pricing.custom.cta")}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="lp-final-cta" id="final-cta">
                <div className="lp-final-cta-card lp-dark" id="final-cta-card" style={{ position: "relative", overflow: "hidden" }}>
                    <FinalCtaParticleCanvas />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <h2>
                            {t("finalCta.line1")}<br />
                            {t("finalCta.line2")}
                        </h2>

                        <div className="lp-final-cta-buttons">
                            <button className="lp-btn lp-btn-primary" onClick={enterOrbit}>
                                {t("nav.enterOrbit")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <h3 className="lp-footer-tagline">{t("footer.tagline")}</h3>
                    <div className="lp-footer-nav">
                        <div className="lp-footer-col">
                            <a href="/product">{t("footer.howItWorks")}</a>
                            <a href="/#functions">{t("footer.solutions")}</a>
                        </div>
                        <div className="lp-footer-col">
                            <a href="/case-studies">{t("footer.caseStudy")}</a>
                            <a href="/#pricing">{t("footer.pricing")}</a>
                        </div>
                    </div>
                </div>

                <div className="lp-footer-brand">
                    <div className="lp-footer-orbit-container">
                        <div className="lp-footer-ellipses lp-footer-ellipses--thin">
                            <div className="lp-footer-ellipses lp-footer-ellipses--planet"></div>
                        </div>
                        <div className="lp-footer-ellipses lp-footer-ellipses--thick"></div>
                        <span>Orbit</span>
                    </div>
                </div>

                <div className="lp-footer-bottom">
                    <div className="lp-footer-logo-small">Orbit</div>
                    <div className="lp-footer-legal">
                        <a href="/privacy">{t("footer.privacy")}</a>
                        <a href="/terms">{t("footer.terms")}</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
