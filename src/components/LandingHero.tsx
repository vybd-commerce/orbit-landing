import { ArrowRight } from "lucide-react";
import RotatingWord from "./RotatingWord";
import { CALENDLY_URL } from "../lib/links";
import "./LandingHero.css";

/* The last word of the headline cycles. Each one has to finish "Operations
   that run ___" as a claim we can defend on the rest of the page. */
const HERO_WORDS = ["themselves", "autonomously", "end to end", "at scale"];

interface LandingHeroProps {
    /* Where "See what we run" points. Defaults to the functions section on /. */
    secondaryHref?: string;
}

/* The / hero, shared with /consulting. */
export default function LandingHero({ secondaryHref = "#functions" }: LandingHeroProps) {
    return (
        <section className="v3-hero" id="hero">
            <span className="v3-pill v3-pill--static">
                <span className="v3-pill-text">
                    Built by operators. Backed by industry leaders.
                </span>
            </span>

            <h1 className="v3-hero-title">
                Operations that run<br />
                <span className="v3-hero-underlined">
                    <RotatingWord words={HERO_WORDS} interval={4600} />
                </span>.
            </h1>

            <p className="v3-hero-subtitle">
                Demand, retail ops, item data, logistics, market and growth — on one
                connected layer, run by agents with senior operators accountable for
                the outcome.
            </p>

            <div className="v3-hero-actions">
                <a className="v3-btn v3-btn-primary" href={CALENDLY_URL}>Contact sales<ArrowRight size={16} />
                </a>
                <a className="v3-btn v3-btn-soft" href={secondaryHref}>
                    See what we run
                </a>
            </div>
        </section>
    );
}
