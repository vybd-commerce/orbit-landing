import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, Check, Fingerprint, Stamp } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useLocale, useT } from "../i18n/context";
import type { Locale } from "../i18n/locales";
import "./StatementSection.css";

/* ── Country sets (edit here) ────────────────────────────────────────── */

/* Shown three at a time, in this order, looping. The first set is always the
   one on page load. Each code matches a file in public/images/flags
   (circle-flags, MIT, bundled locally) and a name in the copy's countries. */
const FLAG_SETS: (keyof ReturnType<typeof useT>["countries"])[][] = [
    [
        "in",
        "kr",
        "cn",
    ],
    [
        "fr",
        "bd",
        "jp",
    ],
    [
        "vn",
        "it",
        "mx",
    ],
    [
        "th",
        "de",
        "tr",
    ],
    [
        "id",
        "es",
        "gb",
    ],
    [
        "ph",
        "br",
        "pk",
    ],
];

const FLAG_SRC = (code: string) => `/images/flags/${code}.svg`;
const CYCLE_MS = 2500;
const SWAP_STAGGER_MS = 90;
const SWAP_OUT_MS = 250;

/* TODO(statement): point at the real "How it works" section once it exists.
   Until then the arrow scrolls to whatever section follows this one. */
const HOW_IT_WORKS_ID = "how-it-works";

/* ── Flags chip ──────────────────────────────────────────────────────── */

/* Each of the three slots swaps on its own, 90ms after the one before:
   it turns sideways and fades (250ms), takes the new country, turns back. */
function FlagsChip({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
    const t = useT();
    const [setIndex, setSetIndex] = useState(0);
    const [slots, setSlots] = useState([0, 0, 0]);
    const [out, setOut] = useState([false, false, false]);
    const timers = useRef<number[]>([]);

    useEffect(() => {
        FLAG_SETS.flat().forEach((code) => {
            const img = new Image();
            img.src = FLAG_SRC(code);
        });
    }, []);

    const clearTimers = () => {
        timers.current.forEach((t) => window.clearTimeout(t));
        timers.current = [];
    };
    useEffect(() => clearTimers, []);

    const advance = useCallback(() => {
        const next = (setIndex + 1) % FLAG_SETS.length;
        setSetIndex(next);
        clearTimers();
        if (reducedMotion) {
            setSlots([next, next, next]);
            setOut([false, false, false]);
            return;
        }
        [0, 1, 2].forEach((i) => {
            const start = i * SWAP_STAGGER_MS;
            timers.current.push(
                window.setTimeout(() => setOut((o) => o.map((v, j) => (j === i ? true : v))), start),
                window.setTimeout(() => {
                    setSlots((s) => s.map((v, j) => (j === i ? next : v)));
                    setOut((o) => o.map((v, j) => (j === i ? false : v)));
                }, start + SWAP_OUT_MS)
            );
        });
    }, [setIndex, reducedMotion]);

    /* Keyed on setIndex, so a click restarts the full 2.5s. */
    useEffect(() => {
        if (!active || reducedMotion) return;
        const t = window.setTimeout(advance, CYCLE_MS);
        return () => window.clearTimeout(t);
    }, [active, reducedMotion, advance]);

    return (
        <button type="button" className="st-flags st-w" aria-label={t.statement.moreCountries} onClick={advance}>
            {slots.map((s, i) => {
                const code = FLAG_SETS[s][i];
                return (
                    <span key={i} className={`st-flag st-flag--${i + 1}`}>
                        <img
                            className={out[i] ? "is-out" : undefined}
                            src={FLAG_SRC(code)}
                            alt={t.countries[code]}
                            width={64}
                            height={64}
                            draggable={false}
                        />
                    </span>
                );
            })}
        </button>
    );
}

/* ── Scroll reveal ───────────────────────────────────────────────────── */

/* The section is taller than the screen and its stage is sticky, so the
   statement pins full-screen while the page scrolls past it. Each word (and
   chip) is its own `.st-w` span; across the pinned stretch a reading-order
   wave brings them from faint to full, Vybd first and brand last.
   Scroll-linked, so it reverses too. Section height lives in the CSS
   (--st-pin); these tune how the reveal maps onto it. */
const REVEAL_FLOOR = 0.25; // opacity of a word before its turn: faint, but clearly text
const REVEAL_SOFTNESS = 2.5; // how many words are mid-fade at once (lower = crisper edge)
const REVEAL_LEAD = 0.25; // starts when the section top is 25% of a screen from the top, just before it pins
const REVEAL_DONE = 0.8; // finished 80% of the way through the pin; the last 20% holds it complete

/* Chinese and Japanese are written without spaces, so their words come
   from Intl.Segmenter (falling back to single characters), with punctuation
   kept on the word before it so a line never starts with "。" or "、". */
const UNSPACED: Locale[] = ["zh", "ja"];

function unspacedWords(text: string, locale: Locale) {
    if (typeof Intl.Segmenter !== "function") return Array.from(text);
    const out: string[] = [];
    for (const { segment, isWordLike } of new Intl.Segmenter(locale, { granularity: "word" }).segment(text)) {
        if (!isWordLike && out.length) out[out.length - 1] += segment;
        else out.push(segment);
    }
    return out;
}

function words(text: string, locale: Locale) {
    const parts = UNSPACED.includes(locale) ? unspacedWords(text, locale) : text.split(/(\s+)/);
    return parts.map((part, i) =>
        /^\s+$/.test(part) || !part ? part : (
            <span key={i} className="st-w">
                {part}
            </span>
        )
    );
}

/* ── Section ─────────────────────────────────────────────────────────── */

/* One large serif statement with four animated icon chips set inline.
   Every chip is glued to its neighbouring word (white-space: nowrap) so a
   chip never starts or ends a line on its own. All loops are CSS and pause
   off-screen or in a hidden tab; the flag timer stops with them. */
export default function StatementSection() {
    const t = useT();
    const locale = useLocale();
    /* Between a run of text and the chip group next to it. */
    const gap = UNSPACED.includes(locale) ? "" : " ";
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const sectionRef = useRef<HTMLElement>(null);
    const [onScreen, setOnScreen] = useState(false);
    const [tabVisible, setTabVisible] = useState(() => document.visibilityState === "visible");

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        io.observe(el);
        const onVis = () => setTabVisible(document.visibilityState === "visible");
        document.addEventListener("visibilitychange", onVis);
        return () => {
            io.disconnect();
            document.removeEventListener("visibilitychange", onVis);
        };
    }, []);

    const active = onScreen && tabVisible;

    const textRef = useRef<HTMLParagraphElement>(null);
    useEffect(() => {
        const text = textRef.current;
        const section = sectionRef.current;
        if (!text || !section) return;
        const items = [...text.querySelectorAll<HTMLElement>(".st-w")];
        if (reducedMotion) {
            items.forEach((el) => el.style.removeProperty("opacity"));
            return;
        }
        const n = items.length;
        let raf = 0;
        const update = () => {
            raf = 0;
            const r = section.getBoundingClientRect();
            const vh = window.innerHeight;
            if (r.top > vh || r.bottom < 0) return;
            const pinRange = Math.max(1, r.height - vh);
            const p = Math.max(0, Math.min(1, (vh * REVEAL_LEAD - r.top) / (vh * REVEAL_LEAD + pinRange * REVEAL_DONE)));
            const head = p * (n + REVEAL_SOFTNESS);
            items.forEach((el, i) => {
                const k = Math.max(0, Math.min(1, (head - i) / REVEAL_SOFTNESS));
                el.style.opacity = String(REVEAL_FLOOR + (1 - REVEAL_FLOOR) * k);
            });
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(raf);
        };
    }, [reducedMotion, locale]);

    const goToHowItWorks = (e: MouseEvent<HTMLAnchorElement>) => {
        const target = document.getElementById(HOW_IT_WORKS_ID) ?? sectionRef.current?.nextElementSibling;
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    };

    return (
        <section ref={sectionRef} className={`st-section${active ? "" : " is-paused"}`} aria-label={t.statement.label}>
            <div className="st-stage">
                {/* Keyed on locale: the reveal effect collects the word spans
                    once, so a language switch needs a fresh paragraph. */}
                <p key={locale} ref={textRef} className="st-text">
                    <span className="st-nw">
                        <span className="st-w">Vybd</span>{" "}
                        <a
                            href={`#${HOW_IT_WORKS_ID}`}
                            className="st-chip st-chip--arrow st-w"
                            aria-label={t.statement.seeHow}
                            onClick={goToHowItWorks}
                        >
                            <ArrowRight aria-hidden="true" strokeWidth={2.5} />
                        </a>
                    </span>{" "}
                    {words(t.statement.lead, locale)}
                    {gap}
                    <span className="st-nw">
                        <FlagsChip active={active} reducedMotion={reducedMotion} /> {words(t.statement.anywhere, locale)}
                    </span>
                    {gap}
                    {words(t.statement.mid, locale)}
                    {gap}
                    <span className="st-nw">
                        <span className="st-chip st-chip--stamp st-w" aria-hidden="true">
                            <span className="st-stamp">
                                <Stamp strokeWidth={2} />
                            </span>
                            <span className="st-check">
                                <Check strokeWidth={3.5} />
                            </span>
                        </span>{" "}
                        {words(t.statement.redTape, locale)}
                    </span>
                    {gap}
                    {words(t.statement.rest, locale)}
                    {gap}
                    <span className="st-nw">
                        <span className="st-chip st-chip--print st-w" aria-hidden="true">
                            <Fingerprint strokeWidth={1.75} />
                            <span className="st-scan" />
                        </span>{" "}
                        {words(t.statement.control, locale)}
                    </span>
                    {gap}
                    {words(t.statement.end, locale)}
                </p>
            </div>
        </section>
    );
}
