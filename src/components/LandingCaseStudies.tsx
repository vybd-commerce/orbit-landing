import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    DollarSign,
    TrendingUp,
    Search,
    Share2,
    ShieldCheck,
    Layers,
    Target,
    CheckCircle2,
    Hand,
} from "lucide-react";
import { caseStudies } from "../data/caseStudies";

// Groups compound categories (e.g. "Food & Beverage / Premium Produce")
// under their simpler sibling ("Food & Beverage") so the filter row shows
// one pill per real grouping instead of one per exact string.
function normalizeCategory(category: string): string {
    if (category.startsWith("Food & Beverage")) return "Food & Beverage";
    return category;
}

const FILTER_CATEGORIES = [
    "All",
    ...Array.from(new Set(caseStudies.map((cs) => normalizeCategory(cs.category)))),
];

// Metric labels aren't tagged with an icon in the data model, so pick one
// by keyword match on the label — keeps each card's three stats visually
// distinct without inventing a per-card icon assignment.
function iconForMetric(label: string) {
    const l = label.toLowerCase();
    if (l.includes("revenue") || l.includes("$")) return DollarSign;
    if (l.includes("growth") || l.includes("traffic") || l.includes("increase")) return TrendingUp;
    if (l.includes("keyword") || l.includes("queries") || l.includes("ranked") || l.includes("discovery")) return Search;
    if (l.includes("compliance")) return ShieldCheck;
    if (l.includes("categories") || l.includes("menu") || l.includes("sku")) return Layers;
    if (l.includes("channel") || l.includes("distribution") || l.includes("model")) return Share2;
    if (l.includes("acquisition") || l.includes("strategy") || l.includes("entry")) return Target;
    return CheckCircle2;
}

export default function LandingCaseStudies() {
    const [activeCategory, setActiveCategory] = useState("All");
    const rowRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const filtered = caseStudies.filter(
        (cs) => activeCategory === "All" || normalizeCategory(cs.category) === activeCategory
    );

    const selectCategory = (cat: string) => {
        setActiveCategory(cat);
        setActiveCardIndex(0);
        rowRef.current?.scrollTo({ left: 0 });
    };

    const scrollByCard = (direction: 1 | -1) => {
        const row = rowRef.current;
        if (!row) return;
        const card = row.querySelector<HTMLElement>(".lcs-card");
        const step = card ? card.offsetWidth + 20 : row.clientWidth * 0.8;
        row.scrollBy({ left: step * direction, behavior: "smooth" });
    };

    const handleScroll = () => {
        const row = rowRef.current;
        if (!row) return;
        const card = row.querySelector<HTMLElement>(".lcs-card");
        const step = card ? card.offsetWidth + 20 : row.clientWidth;
        setActiveCardIndex(Math.round(row.scrollLeft / step));
    };

    const scrollToCard = (index: number) => {
        const row = rowRef.current;
        if (!row) return;
        const card = row.querySelector<HTMLElement>(".lcs-card");
        const step = card ? card.offsetWidth + 20 : row.clientWidth;
        row.scrollTo({ left: step * index, behavior: "smooth" });
    };

    return (
        <section className="lcs-section" id="case-studies">
            <div className="lcs-header">
                <span className="lp-section-tag" style={{ marginBottom: "0.5rem" }}>CASE STUDIES</span>
                <h2>Case Studies</h2>
                <p>See how we help organizations build and scale with data-driven market entry strategies.</p>
            </div>

            <div className="lcs-controls">
                <div className="lcs-filters">
                    {FILTER_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`lcs-filter-pill ${activeCategory === cat ? "active" : ""}`}
                            onClick={() => selectCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="lcs-arrows">
                    <button className="lcs-arrow" onClick={() => scrollByCard(-1)} aria-label="Previous case study">
                        <ChevronLeft size={18} />
                    </button>
                    <button className="lcs-arrow" onClick={() => scrollByCard(1)} aria-label="Next case study">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="lcs-row" ref={rowRef} onScroll={handleScroll}>
                {filtered.map((cs) => (
                    <Link to={`/case-studies/${cs.slug}`} className="lcs-card" key={cs.slug}>
                        <div className="lcs-card-image-wrap">
                            <img src={cs.image} alt={cs.title} className="lcs-card-image" loading="lazy" />
                        </div>
                        <div className="lcs-card-body">
                            <span className="lcs-card-category">{cs.category}</span>
                            <h3>{cs.title}</h3>
                            <p>{cs.summary}</p>
                            <div className="lcs-card-metrics">
                                {cs.metrics.map((metric) => {
                                    const Icon = iconForMetric(metric.label);
                                    return (
                                        <div className="lcs-metric" key={`${cs.slug}-${metric.label}`}>
                                            <span className="lcs-metric-icon"><Icon size={16} /></span>
                                            <div>
                                                <div className="lcs-metric-value">{metric.value}</div>
                                                <div className="lcs-metric-label">{metric.label}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="lcs-dots">
                {filtered.map((cs, i) => (
                    <button
                        key={cs.slug}
                        className={`lcs-dot ${i === activeCardIndex ? "active" : ""}`}
                        onClick={() => scrollToCard(i)}
                        aria-label={`Go to ${cs.title}`}
                    />
                ))}
            </div>

            <div className="lcs-scroll-hint">
                <Hand size={14} />
                <span>Scroll horizontally to explore more case studies</span>
            </div>
        </section>
    );
}
