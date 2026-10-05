import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { HERO_V2_IMAGE_BASE, HERO_V2_SLIDES, orderedSlides } from "../data/heroV2Slides";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useT } from "../i18n/context";
import "./HeroSectionV2.css";

const AUTOPLAY_MS = 4000;
const COUNT = HERO_V2_SLIDES.length;

/* /hello hero: headline, then a photo card whose search box cycles through
   example prompts in step with the photo. Autoplay holds while the card is
   hovered or the input is focused, and stops for good once anything is typed.
   Under reduced motion nothing advances on its own and swaps are instant. */
export default function HeroSectionV2() {
    const t = useT();
    const slides = useMemo(
        () => orderedSlides(t.hero.firstSlide).map((id) => ({ id, ...t.hero.slides[id] })),
        [t]
    );
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [value, setValue] = useState("");
    const [userTyped, setUserTyped] = useState(false);
    /* Only manual moves are announced; autoplay stays quiet. */
    const [announcement, setAnnouncement] = useState("");

    /* Reduced motion overrides the toggle: no autoplay at all. */
    const isPlaying = playing && !reducedMotion && !userTyped;
    const advancing = isPlaying && !hovered && !inputFocused;

    /* Keyed on index, so a manual prev/next restarts the full interval. */
    useEffect(() => {
        if (!advancing) return;
        const timer = window.setTimeout(() => setIndex((i) => (i + 1) % COUNT), AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
    }, [advancing, index]);

    const go = (delta: number) => {
        const next = (index + delta + COUNT) % COUNT;
        setIndex(next);
        setAnnouncement(slides[next].prompt);
    };

    const handleChange = (text: string) => {
        setValue(text);
        if (text) setUserTyped(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // TODO(hero-v2): wire submit — send `value` to the intake flow. Intentionally a no-op for now.
    };

    return (
        <section className={`h2-hero${reducedMotion ? " h2-hero--still" : ""}`} aria-labelledby="h2-title">
            <h1 id="h2-title" className="h2-title">{t.hero.title}</h1>
            <p className="h2-sub">{t.hero.sub}</p>

            <div
                className="h2-card"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {slides.map((slide, i) => (
                    <picture key={slide.id} className={`h2-slide${i === index ? " is-active" : ""}`} aria-hidden={i !== index}>
                        <source srcSet={`${HERO_V2_IMAGE_BASE}/${slide.id}.avif`} type="image/avif" />
                        <img
                            src={`${HERO_V2_IMAGE_BASE}/${slide.id}.webp`}
                            alt={slide.alt}
                            width={1264}
                            height={848}
                            loading={i === 0 ? "eager" : "lazy"}
                            fetchPriority={i === 0 ? "high" : "auto"}
                            decoding="async"
                        />
                    </picture>
                ))}

                <form className="h2-search" onSubmit={handleSubmit} role="search">
                    <div className="h2-field">
                        {slides.map((slide, i) => (
                            <span
                                key={slide.id}
                                className={`h2-placeholder${i === index && !value ? " is-active" : ""}`}
                                aria-hidden="true"
                            >
                                {slide.prompt}
                            </span>
                        ))}
                        <input
                            className="h2-input"
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(e.target.value)}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            aria-label={t.hero.inputLabel}
                            aria-describedby="h2-current-prompt"
                            autoComplete="off"
                        />
                        <span id="h2-current-prompt" className="h2-sr">
                            {slides[index].prompt}
                        </span>
                    </div>
                    <button type="submit" className="h2-submit" aria-label={t.hero.submit}>
                        <ArrowRight aria-hidden="true" strokeWidth={2.25} />
                    </button>
                </form>
            </div>

            <div className="h2-controls">
                <button type="button" className="h2-ctrl" onClick={() => go(-1)} aria-label={t.hero.prev}>
                    <ChevronLeft aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="h2-ctrl"
                    onClick={() => setPlaying(!isPlaying)}
                    aria-pressed={isPlaying}
                    aria-label={isPlaying ? t.hero.pause : t.hero.play}
                    disabled={reducedMotion || userTyped}
                >
                    {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                </button>
                <button type="button" className="h2-ctrl" onClick={() => go(1)} aria-label={t.hero.next}>
                    <ChevronRight aria-hidden="true" />
                </button>
            </div>

            <p className="h2-note">{t.hero.note}</p>

            <div className="h2-sr" aria-live="polite">
                {announcement}
            </div>
        </section>
    );
}
