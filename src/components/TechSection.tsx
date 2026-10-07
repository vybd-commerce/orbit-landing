import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useT } from "../i18n/context";
import "./TechSection.css";

/* ── Objects ─────────────────────────────────────────────────────────────
   Each is an inline SVG in a 200×120 box. All motion is CSS (transform,
   opacity, stroke-dashoffset) keyed off the classes below, so pausing and
   reduced motion are handled in one place in the stylesheet. */

/* Radar in perspective: rings are ellipses (ry = 0.38 rx). The sweep turns
   inside a group scaled the same way, so it traces the flattened ring. */
const SCOUT_C = { x: 100, y: 64 };
const SCOUT_SQUASH = 0.38;
const SCOUT_RINGS = [84, 58, 32];
/* Dots: ring radius + angle (deg, clockwise from 3 o'clock). Each pulses as
   the sweep passes, so its delay is its angle as a share of the 6s turn. */
const SCOUT_DOTS = [
    { r: 58, a: 40 },
    { r: 84, a: 135 },
    { r: 32, a: 215 },
    { r: 84, a: 300 },
];

function Scout() {
    const { x, y } = SCOUT_C;
    return (
        <svg viewBox="0 0 200 120" aria-hidden="true">
            {SCOUT_RINGS.map((r, i) => (
                <ellipse
                    key={r}
                    className={i === 1 ? "ts-line ts-dash" : "ts-line"}
                    cx={x}
                    cy={y}
                    rx={r}
                    ry={r * SCOUT_SQUASH}
                />
            ))}
            <g transform={`translate(${x} ${y}) scale(1 ${SCOUT_SQUASH})`}>
                {/* The transparent disc makes the group's box centred on the
                    origin, so the CSS rotation pivots on the radar centre. */}
                <g className="ts-sweep">
                    <circle r={SCOUT_RINGS[0]} fill="none" stroke="none" />
                    <line x1="0" y1="0" x2={SCOUT_RINGS[0]} y2="0" className="ts-accent-line" />
                </g>
            </g>
            {SCOUT_DOTS.map((d, i) => {
                const rad = (d.a * Math.PI) / 180;
                return (
                    <circle
                        key={i}
                        className="ts-blip"
                        cx={x + d.r * Math.cos(rad)}
                        cy={y + d.r * SCOUT_SQUASH * Math.sin(rad)}
                        r="2.4"
                        style={{ animationDelay: `${(d.a / 360) * 6}s` }}
                    />
                );
            })}
            <circle cx={x} cy={y} r="1.6" className="ts-accent-fill" />
        </svg>
    );
}

/* Cone of discs, base to top. */
const MUSE_DISCS = [
    { y: 100, rx: 72 },
    { y: 82, rx: 58 },
    { y: 64, rx: 44 },
    { y: 47, rx: 31 },
    { y: 31, rx: 18 },
];

function Muse() {
    return (
        <svg viewBox="0 0 200 120" aria-hidden="true">
            {MUSE_DISCS.map((d, i) => {
                const top = i === MUSE_DISCS.length - 1;
                const mid = i === 2;
                return (
                    <ellipse
                        key={i}
                        className={`ts-line${top ? " ts-dash" : ""}${i > 0 ? " ts-float" : ""}`}
                        cx="100"
                        cy={d.y}
                        rx={d.rx}
                        ry={d.rx * 0.3}
                        fill={top ? "none" : mid ? "rgba(133,183,235,0.14)" : `rgba(255,255,255,${0.04 + i * 0.01})`}
                        style={i > 0 ? { animationDelay: `${(i - 1) * 0.4}s` } : undefined}
                    />
                );
            })}
        </svg>
    );
}

/* Beam in from the left, four rays out to the right. */
const PRISM_IN = { x: 80, y: 59 };
const PRISM_OUT = { x: 120, y: 59 };
const PRISM_RAYS = [
    { y: 26, color: "#85B7EB", o: 0.9 },
    { y: 48, color: "#ffffff", o: 0.55 },
    { y: 72, color: "#85B7EB", o: 0.65 },
    { y: 96, color: "#ffffff", o: 0.35 },
];

function Prism() {
    return (
        <svg viewBox="0 0 200 120" aria-hidden="true">
            <line className="ts-flow" x1="8" y1="66" x2={PRISM_IN.x} y2={PRISM_IN.y} stroke="rgba(255,255,255,0.6)" />
            {PRISM_RAYS.map((r, i) => (
                <line
                    key={i}
                    className="ts-flow"
                    x1={PRISM_OUT.x}
                    y1={PRISM_OUT.y}
                    x2="194"
                    y2={r.y}
                    stroke={r.color}
                    strokeOpacity={r.o}
                />
            ))}
            <polygon className="ts-line" points="100,20 142,98 58,98" fill="rgba(255,255,255,0.05)" />
            <line className="ts-line ts-dash" x1="100" y1="20" x2="100" y2="98" />
        </svg>
    );
}

function Helm() {
    const t = useT();
    return (
        <svg viewBox="0 0 200 120" aria-hidden="true">
            <text x="100" y="14" textAnchor="middle" className="ts-svg-label">
                {t.tech.helmLabel}
            </text>
            <rect className="ts-line ts-dash" x="16" y="24" width="168" height="88" rx="12" fill="none" />
            <line className="ts-line" x1="128" y1="34" x2="128" y2="102" strokeOpacity="0.6" />
            {[44, 72].map((y, i) => (
                <g key={y} className="ts-card" style={{ animationDelay: `${i * 1.5}s` }}>
                    <rect
                        className="ts-line"
                        x="24"
                        y={y}
                        width="44"
                        height="20"
                        rx="5"
                        fill="rgba(255,255,255,0.08)"
                    />
                    <line x1="30" y1={y + 7} x2="58" y2={y + 7} stroke="rgba(255,255,255,0.32)" />
                    <line x1="30" y1={y + 13} x2="50" y2={y + 13} stroke="rgba(255,255,255,0.2)" />
                </g>
            ))}
            <g className="ts-check">
                <circle cx="156" cy="68" r="15" fill="rgba(29,158,117,0.25)" stroke="#5DCAA5" />
                <path
                    d="M149 68.5l4.6 4.6 9-9.2"
                    fill="none"
                    stroke="#5DCAA5"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
}

/* Isometric cube over two dashed planes. */
function Harbor() {
    return (
        <svg viewBox="0 0 200 120" aria-hidden="true">
            <g className="ts-planes">
                <polygon className="ts-line ts-dash" points="100,74 156,92 100,110 44,92" fill="none" />
                <polygon className="ts-line ts-dash" points="100,62 150,78 100,94 50,78" fill="none" />
            </g>
            <g className="ts-cube">
                <polygon className="ts-line" points="100,12 124,24 100,36 76,24" fill="rgba(255,255,255,0.22)" />
                <polygon className="ts-line" points="76,24 100,36 100,62 76,50" fill="rgba(255,255,255,0.08)" />
                <polygon className="ts-line" points="124,24 100,36 100,62 124,50" fill="rgba(133,183,235,0.16)" />
            </g>
        </svg>
    );
}

/* ── Tiles (edit here) ─────────────────────────────────────────────────── */

/* Descriptions are per language, in the copy's tech.tiles. `tint` washes
   each card in its own colour so the five read apart at a glance. */
const TILES: { name: "Scout" | "Muse" | "Prism" | "Helm" | "Harbor"; tint: string; Visual: () => ReactNode }[] = [
    { name: "Scout", tint: "#85b7eb", Visual: Scout },
    { name: "Muse", tint: "#b49cf0", Visual: Muse },
    { name: "Prism", tint: "#f0b37e", Visual: Prism },
    { name: "Helm", tint: "#5dcaa5", Visual: Helm },
    { name: "Harbor", tint: "#e8d27a", Visual: Harbor },
];

/* The ring holds the tiles twice over, so it is always full and the loop
   never shows a seam. Only the first copy is exposed to screen readers. */
const COPIES = 2;
const SLOTS = TILES.length * COPIES;

/* ── Arc geometry ─────────────────────────────────────────────────────────

   The cards stand on the inside of a cylinder and the camera sits at its
   centre, so the card ahead is the furthest away and the ones to the sides
   swing in close, larger and angled (the "curved wall" look).

   With CSS perspective P the camera is at z = P. A card at angle θ sits at
   (R·sinθ, 0, P − R·cosθ) turned by −θ to face the centre. R = P / CENTER_SCALE
   makes the card ahead render at CENTER_SCALE. P is chosen so the cards at
   ±edgeAngle land on the stage's edges: P = (W / 2) / tan(edgeAngle).

   A card at θ renders at CENTER_SCALE / cos θ, and the browser draws it at
   1× before scaling, so steep edges blur text and strokes. Edge angles stay
   shallow enough that nothing on screen goes past about 1.2×. */
const CENTER_SCALE = 0.8;
const GAP = 24; // px between neighbouring cards, along the wall
const DRIFT = 0.22; // slots per second
const FADE = 8; // degrees over which a card fades out past the edge

const wrap = (v: number, n: number) => ((((v + n / 2) % n) + n) % n) - n / 2;

function TechArc({ paused }: { paused: boolean }) {
    const t = useT();
    /* The tile nearest the centre; its description is the caption below. */
    const [front, setFront] = useState(0);
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const stageRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLElement | null)[]>([]);
    const pausedRef = useRef(paused);
    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        let offset = 0; // in slots; card k is ahead when offset ≈ k
        let velocity = 0; // slots per second, after a fling
        let hovering = false;
        let drag: { x: number; offset: number; lastX: number; lastT: number } | null = null;
        let geo = { P: 400, R: 500, step: 0.5, edge: 1, px: 200 };

        const measure = () => {
            const W = stage.clientWidth;
            const card = cardRefs.current[0];
            const cw = card?.offsetWidth ?? 220;
            const edge = ((W < 640 ? 38 : 42) * Math.PI) / 180;
            const P = W / 2 / Math.tan(edge);
            const R = P / CENTER_SCALE;
            stage.style.perspective = `${P.toFixed(1)}px`;
            /* Screen pixels per slot at the centre, for dragging. */
            geo = { P, R, step: (cw + GAP) / R, edge, px: (cw + GAP) * CENTER_SCALE };
        };

        let shown = -1;
        const paint = () => {
            const { P, R, step, edge } = geo;
            const nearest = ((Math.round(offset) % TILES.length) + TILES.length) % TILES.length;
            if (nearest !== shown) {
                shown = nearest;
                setFront(nearest);
            }
            const fade = (FADE * Math.PI) / 180;
            cardRefs.current.forEach((el, k) => {
                if (!el) return;
                const theta = wrap(k - offset, SLOTS) * step;
                const a = Math.abs(theta);
                if (a > edge + fade) {
                    el.style.visibility = "hidden";
                    return;
                }
                el.style.visibility = "";
                el.style.opacity = String(Math.min(1, (edge + fade - a) / (fade * 1.6)));
                el.style.transform = `translate3d(${(R * Math.sin(theta)).toFixed(2)}px, 0, ${(P - R * Math.cos(theta)).toFixed(2)}px) rotateY(${(-theta).toFixed(4)}rad)`;
            });
        };

        let raf = 0;
        let last = performance.now();
        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!drag) {
                if (Math.abs(velocity) > 0.01) {
                    offset += velocity * dt;
                    velocity *= Math.pow(0.04, dt); // fling eases out over ~1s
                } else if (!reducedMotion && !pausedRef.current && !hovering) {
                    velocity = 0;
                    offset += DRIFT * dt;
                }
            }
            paint();
            raf = requestAnimationFrame(tick);
        };

        /* Pointer drag / swipe. touch-action: pan-y in the CSS keeps vertical
           page scrolling with the browser; horizontal moves land here. */
        const onDown = (e: PointerEvent) => {
            drag = { x: e.clientX, offset, lastX: e.clientX, lastT: e.timeStamp };
            velocity = 0;
            stage.setPointerCapture(e.pointerId);
        };
        const onMove = (e: PointerEvent) => {
            if (!drag) return;
            const dt = Math.max(1, e.timeStamp - drag.lastT) / 1000;
            velocity = -(e.clientX - drag.lastX) / geo.px / dt;
            drag.lastX = e.clientX;
            drag.lastT = e.timeStamp;
            offset = drag.offset - (e.clientX - drag.x) / geo.px;
        };
        const onUp = () => {
            drag = null;
            velocity = Math.max(-4, Math.min(4, velocity));
        };
        const onEnter = () => (hovering = true);
        const onLeave = () => (hovering = false);

        measure();
        paint();
        const ro = new ResizeObserver(() => {
            measure();
            paint();
        });
        ro.observe(stage);
        stage.addEventListener("pointerdown", onDown);
        stage.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerup", onUp);
        stage.addEventListener("pointercancel", onUp);
        stage.addEventListener("pointerenter", onEnter);
        stage.addEventListener("pointerleave", onLeave);
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            stage.removeEventListener("pointerdown", onDown);
            stage.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerup", onUp);
            stage.removeEventListener("pointercancel", onUp);
            stage.removeEventListener("pointerenter", onEnter);
            stage.removeEventListener("pointerleave", onLeave);
        };
    }, [reducedMotion]);

    return (
        <>
            <div ref={stageRef} className="ts-arc">
                <div className="ts-ring">
                    {Array.from({ length: SLOTS }, (_, k) => {
                        const { name, tint, Visual } = TILES[k % TILES.length];
                        const copy = k >= TILES.length;
                        return (
                            <article
                                key={k}
                                ref={(el) => {
                                    cardRefs.current[k] = el;
                                }}
                                className="ts-tile"
                                style={{ "--ts-tint": tint } as CSSProperties}
                                aria-hidden={copy || undefined}
                            >
                                <h3 className="ts-name">{name}</h3>
                                <div className={`ts-object ts-object--${name.toLowerCase()}`}>
                                    <Visual />
                                </div>
                                {/* Shown as the caption below instead: text on an
                                angled card reads poorly. Kept for screen readers. */}
                                <p className="ts-sr">{t.tech.tiles[name]}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
            <p className="ts-caption" aria-hidden="true">
                {TILES.map(({ name }, i) => (
                    <span key={name} className={i === front ? "is-active" : undefined}>
                        <strong>{name}</strong> {t.tech.tiles[name]}
                    </span>
                ))}
            </p>
        </>
    );
}

/* ── Section ─────────────────────────────────────────────────────────── */

/* The page's one dark band: our in-house tools as cards on a slowly turning
   curved wall, about one screen tall. Drag or swipe to move it; it pauses
   off-screen and on hover, and holds still under reduced motion. */
export default function TechSection() {
    const t = useT();
    const bandRef = useRef<HTMLElement>(null);
    const [onScreen, setOnScreen] = useState(false);

    useEffect(() => {
        const el = bandRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section ref={bandRef} className={`ts-band${onScreen ? "" : " is-paused"}`} aria-labelledby="ts-title">
            <header className="ts-head">
                <h2 id="ts-title" className="ts-title">
                    {t.tech.title}
                </h2>
                <p className="ts-sub">{t.tech.sub}</p>
            </header>

            <TechArc paused={!onScreen} />

            <p className="ts-more">{t.tech.more}</p>
        </section>
    );
}
