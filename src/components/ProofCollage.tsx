import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { Check, Ship } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useReveal } from "../hooks/useReveal";
import { useT } from "../i18n/context";
import type { Messages } from "../i18n/messages";
import "./ProofCollage.css";

/* ── Data (edit numbers here) ────────────────────────────────────────── */

/* TODO(proof): fill in Ollobot's live Kickstarter numbers. While these are
   null the card shows an obvious "$—" / "As of —" placeholder. */
const OLLOBOT_PLEDGED: number | null = null; // e.g. 42350 (USD pledged so far)
const OLLOBOT_AS_OF_DATE: string | null = null; // e.g. "Oct 4, 2026"
const OLLOBOT_GOAL = 100_000;

type Size = "large" | "medium" | "small";

type Visual =
    | { kind: "bars"; rows: { label: string; before: number; after: number; delta: string }[] }
    | { kind: "steps"; steps: { label: string; state: "done" | "active" }[] }
    | { kind: "route"; from: string; to: string }
    | { kind: "kickstarter"; pledged: number | null; goal: number; asOf: string | null }
    | { kind: "counter"; amount: number }
    | { kind: "image"; src?: string; alt?: string };

type ProofCard = {
    id: string;
    name: string;
    country: string;
    category: string;
    size: Size;
    label: string;
    headline?: string;
    visual: Visual;
    detail?: string;
};

/* "pre-orders" should never split across lines; swap in U+2011 at render. */
const noBreakHyphens = (text: string) => text.replace(/(\w)-(\w)/g, "$1\u2011$2");

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/* Card copy comes from the current locale; ids, sizes and numbers live here. */
function proofCards(t: Messages): ProofCard[] {
    const c = t.proof.cards;
    return [
        {
            id: "bayangrom",
            name: "Bayangrom",
            country: t.countries.in,
            category: c.bayangrom.category,
            size: "large",
            label: c.bayangrom.label,
            headline: c.bayangrom.headline,
            visual: {
                kind: "bars",
                rows: [
                    { label: c.bayangrom.excess, before: 100, after: 72, delta: "−28%" },
                    { label: c.bayangrom.shipping, before: 100, after: 78, delta: "−22%" },
                ],
            },
            detail: c.bayangrom.detail,
        },
        {
            id: "emsworth",
            name: "Emsworth",
            country: t.countries.in,
            category: c.emsworth.category,
            size: "large",
            label: c.emsworth.label,
            headline: c.emsworth.headline,
            visual: {
                kind: "steps",
                steps: [
                    { label: c.emsworth.wholesale, state: "done" },
                    { label: c.emsworth.dtc, state: "active" },
                ],
            },
            detail: c.emsworth.detail,
        },
        {
            id: "sugat",
            name: "Sugat Traders",
            country: t.countries.in,
            category: c.sugat.category,
            size: "medium",
            label: c.sugat.label,
            headline: c.sugat.headline,
            visual: { kind: "route", from: t.countries.in, to: t.countries.us },
        },
        {
            id: "ollobot",
            name: "Ollobot",
            country: t.countries.cn,
            category: c.ollobot.category,
            size: "medium",
            label: c.ollobot.label,
            headline: t.proof.pledged(OLLOBOT_PLEDGED === null ? "$—" : usd(OLLOBOT_PLEDGED)),
            visual: { kind: "kickstarter", pledged: OLLOBOT_PLEDGED, goal: OLLOBOT_GOAL, asOf: OLLOBOT_AS_OF_DATE },
            detail: c.ollobot.detail,
        },
        {
            id: "karama",
            name: "Karama",
            country: t.countries.usa,
            category: c.karama.category,
            size: "medium",
            label: c.karama.label,
            headline: c.karama.headline,
            visual: { kind: "counter", amount: 10_000 },
        },
        {
            id: "ouwr",
            name: "Ouwr",
            country: t.countries.kr,
            category: c.ouwr.category,
            size: "small",
            label: c.ouwr.label,
            visual: { kind: "image" }, // TODO(proof): add src (and alt) for an Ouwr image
        },
        {
            id: "cellre",
            name: "Cellre",
            country: t.countries.kr,
            category: c.cellre.category,
            size: "small",
            label: c.cellre.label,
            visual: { kind: "image" }, // TODO(proof): add src (and alt) for a Cellre image
        },
    ];
}

/* Ids only, for the reduced-motion "already seen" set. */
const CARD_IDS = ["bayangrom", "emsworth", "sugat", "ollobot", "karama", "ouwr", "cellre"];

/* ── Motion settings ─────────────────────────────────────────────────── */

const COUNT_MS = 1200;

/* Per card: scroll-drift amplitude (px at one viewport away from centre)
   and idle float (amplitude, cycle, phase). Different for every card so
   nothing moves in step. */
const MOTION: Record<string, { drift: number; amp: number; dur: number; delay: number }> = {
    bayangrom: { drift: -14, amp: 5, dur: 7.4, delay: -1.2 },
    emsworth: { drift: 18, amp: 4, dur: 8.6, delay: -4.1 },
    ouwr: { drift: 24, amp: 6, dur: 6.3, delay: -2.6 },
    cellre: { drift: -24, amp: 5, dur: 8.1, delay: -0.4 },
    sugat: { drift: -20, amp: 4, dur: 6.8, delay: -3.3 },
    ollobot: { drift: 12, amp: 6, dur: 8.9, delay: -5.5 },
    karama: { drift: 22, amp: 5, dur: 7.1, delay: -1.9 },
};

const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);

/* Counts 0 → target once `run` turns true. `instant` (reduced motion)
   returns the target straight away. */
function useCountUp(target: number, run: boolean, instant: boolean) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!run || instant) return;
        let raf = 0;
        const t0 = performance.now();
        const tick = (t: number) => {
            const k = Math.min(1, (t - t0) / COUNT_MS);
            setValue(Math.round(target * easeOutCubic(k)));
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [run, instant, target]);
    return instant ? target : value;
}

/* Headline with its first number counting up. The final number sits
   invisibly in the same grid cell, so the line is already its final width
   and nothing reflows while the digits change. */
function CountUpText({ text, run, instant }: { text: string; run: boolean; instant: boolean }) {
    const match = /\d[\d,]*/.exec(text);
    const raw = match?.[0] ?? "";
    const value = useCountUp(Number(raw.replace(/,/g, "")) || 0, run && Boolean(match), instant);
    if (!match) return <>{noBreakHyphens(text)}</>;

    const shown = raw.includes(",") ? value.toLocaleString("en-US") : String(value);
    return (
        <>
            <span className="pc-sr">{text}</span>
            <span aria-hidden="true">
                {noBreakHyphens(text.slice(0, match.index))}
                <span className="pc-count">
                    <span className="pc-count-ghost">{raw}</span>
                    <span>{shown}</span>
                </span>
                {noBreakHyphens(text.slice(match.index + raw.length))}
            </span>
        </>
    );
}

/* ── Visuals ─────────────────────────────────────────────────────────── */

type Run = { run: boolean; instant: boolean };

function Bars({ rows }: Extract<Visual, { kind: "bars" }>) {
    const t = useT();
    return (
        <div className="pc-bars">
            {rows.map((r) => (
                <div key={r.label} className="pc-bar-group">
                    <div className="pc-bar-head">
                        <span>{r.label}</span>
                        <span className="pc-delta">{r.delta}</span>
                    </div>
                    <div className="pc-bar-row">
                        <span className="pc-bar-tag">{t.proof.before}</span>
                        <span className="pc-bar-track">
                            <span className="pc-bar pc-bar--before" style={{ width: `${r.before}%` }} />
                        </span>
                    </div>
                    <div className="pc-bar-row">
                        <span className="pc-bar-tag">{t.proof.after}</span>
                        <span className="pc-bar-track">
                            {/* Drawn at its real width; starts scaled up to the
                                "before" length and shrinks into place. */}
                            <span
                                className="pc-bar pc-bar--after"
                                style={{ width: `${r.after}%`, "--from": r.before / r.after } as CSSProperties}
                            />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Steps({ steps }: Extract<Visual, { kind: "steps" }>) {
    const t = useT();
    return (
        <ol className="pc-steps">
            {steps.map((s) => (
                <li key={s.label} className={`pc-step pc-step--${s.state}`}>
                    <span className="pc-step-dot" aria-hidden="true">
                        {s.state === "done" && <Check strokeWidth={3} />}
                    </span>
                    <span className="pc-step-text">
                        <span className="pc-step-label">{s.label}</span>
                        <span className="pc-step-state">{s.state === "done" ? t.proof.done : t.proof.inProgress}</span>
                    </span>
                </li>
            ))}
        </ol>
    );
}

function Route({ from, to }: Extract<Visual, { kind: "route" }>) {
    return (
        <div className="pc-route">
            <div className="pc-route-line" aria-hidden="true">
                <span className="pc-route-end" />
                <span className="pc-route-track">
                    {/* Full-width runner: translating it by 0→100% of its own
                        width carries the ship from one end of the line to the other. */}
                    <span className="pc-route-runner">
                        <span className="pc-route-ship">
                            <Ship />
                        </span>
                    </span>
                </span>
                <span className="pc-route-end pc-route-end--to" />
            </div>
            <div className="pc-route-labels">
                <span>{from}</span>
                <span>{to}</span>
            </div>
        </div>
    );
}

function Kickstarter({ pledged, goal, asOf }: Extract<Visual, { kind: "kickstarter" }>) {
    const t = useT();
    const pct = pledged === null ? 0 : Math.min(100, (pledged / goal) * 100);
    return (
        <div className="pc-ks">
            <span className="pc-live">
                <span className="pc-live-dot" aria-hidden="true" />
                {t.proof.live}
            </span>
            <div
                className="pc-ks-track"
                role="progressbar"
                aria-label={t.proof.pledgedLabel}
                aria-valuemin={0}
                aria-valuemax={goal}
                aria-valuenow={pledged ?? undefined}
                aria-valuetext={pledged === null ? t.proof.notFilled : t.proof.ofGoal(usd(pledged), usd(goal))}
            >
                <span className="pc-ks-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="pc-ks-meta">
                <span>{t.proof.asOf(asOf ?? "—")}</span>
                <span>{t.proof.goal(usd(goal))}</span>
            </div>
        </div>
    );
}

/* Odometer: the tiles are fixed to the final amount's digits, so counting
   up only changes characters (leading zeros), never the number of tiles. */
function Counter({ amount, run, instant }: Extract<Visual, { kind: "counter" }> & Run) {
    const t = useT();
    const value = useCountUp(amount, run, instant);
    const template = usd(amount);
    const digitCount = template.replace(/\D/g, "").length;
    const digits = String(value).padStart(digitCount, "0").split("");
    let d = 0;
    return (
        <div className="pc-counter" role="img" aria-label={t.proof.inPreorders(template)}>
            {template.split("").map((ch, i) =>
                /\d/.test(ch) ? (
                    <span key={i} className="pc-digit" aria-hidden="true">
                        {digits[d++]}
                    </span>
                ) : (
                    <span key={i} className="pc-sep" aria-hidden="true">
                        {ch}
                    </span>
                )
            )}
        </div>
    );
}

function ImageSlot({ src, alt, name }: Extract<Visual, { kind: "image" }> & { name: string }) {
    if (src) return <img className="pc-image" src={src} alt={alt ?? name} loading="lazy" decoding="async" />;
    return (
        <div className="pc-image pc-image--fallback" role="img" aria-label={name}>
            {name}
        </div>
    );
}

function renderVisual(card: ProofCard, motion: Run): ReactNode {
    const v = card.visual;
    switch (v.kind) {
        case "bars":
            return <Bars {...v} />;
        case "steps":
            return <Steps {...v} />;
        case "route":
            return <Route {...v} />;
        case "kickstarter":
            return <Kickstarter {...v} />;
        case "counter":
            return <Counter {...v} {...motion} />;
        case "image":
            return <ImageSlot {...v} name={card.name} />;
    }
}

/* ── Section ─────────────────────────────────────────────────────────── */

/* Proof section for /hello: scattered white cards, large ones in the middle.
   Headline numbers and visuals are always visible; the optional detail line
   slides up on hover, keyboard focus, or tap.

   Motion, all transform/opacity:
   - each card's inner animation runs once, the first time it is in view
     (`seen`), driven by CSS classes plus a rAF count-up for numbers;
   - idle float is a CSS animation on the card's `translate` property, so it
     stacks on the card's own `transform` (offset, entrance, hover lift);
   - scroll drift is a `transform` on the wrapping cell, written by one
     passive scroll listener through rAF;
   - loops pause while the section is off-screen. */
export default function ProofCollage() {
    const t = useT();
    const cards = useMemo(() => proofCards(t), [t]);
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const mobile = useMediaQuery("(max-width: 639px)");
    const { ref: gridRef, revealed } = useReveal<HTMLDivElement>(0.1);
    const sectionRef = useRef<HTMLElement>(null);
    const cellRefs = useRef(new Map<string, HTMLDivElement>());

    const [openId, setOpenId] = useState<string | null>(null);
    const [onScreen, setOnScreen] = useState(false);
    /* Reduced motion: everything starts "seen", so final values show at once. */
    const [seen, setSeen] = useState<Set<string>>(() =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ? new Set(CARD_IDS) : new Set()
    );

    /* Section visibility: pauses the loops off-screen. */
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* Per-card first sighting: starts that card's inner animation once. */
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                const ids = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset.id!);
                if (!ids.length) return;
                ids.forEach((id) => io.unobserve(cellRefs.current.get(id)!));
                setSeen((prev) => new Set([...prev, ...ids]));
            },
            { threshold: 0.2 }
        );
        cellRefs.current.forEach((el, id) => {
            if (!seen.has(id)) io.observe(el);
        });
        return () => io.disconnect();
        // Observers are set up once; `seen` only grows and seen cells unobserve themselves.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Scroll drift: one passive listener, one rAF per frame at most. The
       section's offset from the viewport centre, in viewport heights, scales
       each card's amplitude; at the centre every card is back at 0. */
    useEffect(() => {
        const cells = cellRefs.current;
        if (reducedMotion || mobile) {
            cells.forEach((el) => el.style.removeProperty("--drift"));
            return;
        }
        let raf = 0;
        const update = () => {
            raf = 0;
            const section = sectionRef.current;
            if (!section) return;
            const r = section.getBoundingClientRect();
            const vh = window.innerHeight;
            if (r.bottom < 0 || r.top > vh) return;
            const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
            cells.forEach((el, id) => el.style.setProperty("--drift", `${(p * MOTION[id].drift).toFixed(2)}px`));
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
    }, [reducedMotion, mobile]);

    const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));
    const onKey = (e: KeyboardEvent, id: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle(id);
        }
    };

    return (
        <section
            ref={sectionRef}
            className={`pc-section${onScreen ? "" : " is-paused"}`}
            aria-labelledby="pc-title"
        >
            <h2 id="pc-title" className="pc-title">{t.proof.title}</h2>
            <p className="pc-sub">{t.proof.sub}</p>

            <div ref={gridRef} className={`pc-grid${revealed ? " is-revealed" : ""}`}>
                {cards.map((card, i) => {
                    const hasDetail = Boolean(card.detail);
                    const open = openId === card.id;
                    const isSeen = seen.has(card.id);
                    const m = MOTION[card.id];
                    const motion = { run: isSeen, instant: reducedMotion };
                    return (
                        <div
                            key={card.id}
                            ref={(el) => {
                                if (el) cellRefs.current.set(card.id, el);
                                else cellRefs.current.delete(card.id);
                            }}
                            data-id={card.id}
                            className={`pc-cell pc-cell--${card.id}`}
                        >
                            <article
                                className={`pc-card pc-card--${card.size} pc-card--${card.id}${hasDetail ? " has-detail" : ""}${open ? " is-open" : ""}${isSeen ? " is-seen" : ""}`}
                                style={
                                    {
                                        "--i": i,
                                        "--float-amp": `${m.amp}px`,
                                        "--float-dur": `${m.dur}s`,
                                        "--float-delay": `${m.delay}s`,
                                    } as CSSProperties
                                }
                                aria-labelledby={`pc-${card.id}-name`}
                                {...(hasDetail && {
                                    tabIndex: 0,
                                    "aria-describedby": `pc-${card.id}-detail`,
                                    onClick: () => toggle(card.id),
                                    onKeyDown: (e: KeyboardEvent) => onKey(e, card.id),
                                })}
                            >
                                <p className="pc-label">{card.label}</p>
                                {card.headline && (
                                    <p className="pc-headline">
                                        <CountUpText text={card.headline} {...motion} />
                                    </p>
                                )}

                                <div className="pc-visual">{renderVisual(card, motion)}</div>

                                {hasDetail && (
                                    <div className="pc-detail-slot">
                                        <p id={`pc-${card.id}-detail`} className="pc-detail">
                                            {card.detail}
                                        </p>
                                    </div>
                                )}

                                <footer className="pc-foot">
                                    <span id={`pc-${card.id}-name`} className="pc-name">
                                        {card.name}
                                    </span>
                                    <span className="pc-meta">
                                        {card.country} · {card.category}
                                    </span>
                                </footer>
                            </article>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
