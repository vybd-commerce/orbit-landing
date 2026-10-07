import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { HERO_V2_IMAGE_BASE, HERO_V2_IMAGES, HERO_V2_SLIDES, orderedSlides } from "../data/heroV2Slides";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { track } from "../lib/analytics";
import { useLocale, useLocalePath, useT } from "../i18n/context";
import "./HeroSectionV2.css";

const AUTOPLAY_MS = 4000;
const COUNT = HERO_V2_SLIDES.length;
/* Matches the mobile breakpoint in HeroSectionV2.css. */
const MOBILE = "(max-width: 639px)";

/* /hello hero: headline, then a photo card whose search box cycles through
   example prompts in step with the photo. Autoplay holds while the card is
   hovered or the input is focused, and stops for good once anything is typed.
   Under reduced motion nothing advances on its own and swaps are instant. */
export default function HeroSectionV2() {
    const t = useT();
    const locale = useLocale();
    const to = useLocalePath();
    const slides = useMemo(
        () => orderedSlides(t.hero.firstSlide).map((id) => ({ id, image: HERO_V2_IMAGES[id], ...t.hero.slides[id] })),
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
    /* Slides whose photo has arrived. Autoplay waits for the next one, so a
       slow connection never fades into an empty card. */
    const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set());
    const markLoaded = (i: number) => setLoaded((s) => (s.has(i) ? s : new Set(s).add(i)));
    const nextIndex = (index + 1) % COUNT;

    /* Reduced motion overrides the toggle: no autoplay at all. */
    const isPlaying = playing && !reducedMotion && !userTyped;
    const advancing = isPlaying && !hovered && !inputFocused;

    /* Keyed on index, so a manual prev/next restarts the full interval. */
    const nextReady = loaded.has(nextIndex);
    useEffect(() => {
        if (!advancing || !nextReady) return;
        const timer = window.setTimeout(() => setIndex((i) => (i + 1) % COUNT), AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
    }, [advancing, index, nextReady]);

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
            {/* The page's one action, above the fold on every screen size,
                until the search box is wired to the intake flow. */}
            <a
                className="h2-cta"
                href={to("/book")}
                onClick={() => track("book_call_clicked", { location: "hello_hero", lang: locale })}
            >
                {t.contact.cta}
                <ArrowRight aria-hidden="true" strokeWidth={2.25} />
            </a>

            <div
                className="h2-card"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Slides stack inside the visible card, so loading="lazy"
                    would fetch all of them at once. Instead only the current
                    and next photos are requested; the rest render empty until
                    their turn, keeping a slow connection on one photo at a time. */}
                {slides.map((slide, i) => (
                    <picture key={slide.id} className={`h2-slide${i === index ? " is-active" : ""}`} aria-hidden={i !== index}>
                        {(i === index || i === nextIndex || loaded.has(i)) && (
                            <>
                                {/* Phones show the card portrait (4:5), so they get the
                                    centre crop at the same sharpness, about half the bytes. */}
                                <source media={MOBILE} srcSet={`${HERO_V2_IMAGE_BASE}/${slide.image}-portrait.avif`} type="image/avif" />
                                <source media={MOBILE} srcSet={`${HERO_V2_IMAGE_BASE}/${slide.image}-portrait.webp`} type="image/webp" />
                                <source srcSet={`${HERO_V2_IMAGE_BASE}/${slide.image}.avif`} type="image/avif" />
                                <img
                                    src={`${HERO_V2_IMAGE_BASE}/${slide.image}.webp`}
                                    alt={slide.alt}
                                    width={1264}
                                    height={848}
                                    fetchPriority={i === index ? "high" : "low"}
                                    decoding="async"
                                    onLoad={() => markLoaded(i)}
                                />
                            </>
                        )}
                    </picture>
                ))}

                {/* Display only until submit is wired to the intake flow: inert
                    takes the box out of clicks, focus and typing, while the
                    example prompts keep cycling. */}
                <form className="h2-search" onSubmit={handleSubmit} role="search" inert>
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

            <div className="h2-sr" aria-live="polite">
                {announcement}
            </div>
        </section>
    );
}
