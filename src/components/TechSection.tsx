import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";
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
                <ellipse key={r} className={i === 1 ? "ts-line ts-dash" : "ts-line"} cx={x} cy={y} rx={r} ry={r * SCOUT_SQUASH} />
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
                    <rect className="ts-line" x="24" y={y} width="44" height="20" rx="5" fill="rgba(255,255,255,0.08)" />
                    <line x1="30" y1={y + 7} x2="58" y2={y + 7} stroke="rgba(255,255,255,0.32)" />
                    <line x1="30" y1={y + 13} x2="50" y2={y + 13} stroke="rgba(255,255,255,0.2)" />
                </g>
            ))}
            <g className="ts-check">
                <circle cx="156" cy="68" r="15" fill="rgba(29,158,117,0.25)" stroke="#5DCAA5" />
                <path d="M149 68.5l4.6 4.6 9-9.2" fill="none" stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

/* Descriptions are per language, in the copy's tech.tiles. */
const TILES: { name: "Scout" | "Muse" | "Prism" | "Helm" | "Harbor"; Visual: () => ReactNode }[] = [
    { name: "Scout", Visual: Scout },
    { name: "Muse", Visual: Muse },
    { name: "Prism", Visual: Prism },
    { name: "Helm", Visual: Helm },
    { name: "Harbor", Visual: Harbor },
];

/* ── Section ─────────────────────────────────────────────────────────── */

/* The page's one dark band: our in-house tools, each a tile with a slowly
   moving abstract object. Loops pause off-screen; reduced motion shows each
   object in a still, readable pose. */
export default function TechSection() {
    const t = useT();
    const { ref: gridRef, revealed } = useReveal<HTMLDivElement>(0.12);
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
                <h2 id="ts-title" className="ts-title">{t.tech.title}</h2>
                <p className="ts-sub">{t.tech.sub}</p>
            </header>

            <div ref={gridRef} className={`ts-grid${revealed ? " is-revealed" : ""}`}>
                {TILES.map(({ name, Visual }, i) => (
                    <article key={name} className="ts-tile" style={{ "--i": i } as CSSProperties}>
                        <h3 className="ts-name">{name}</h3>
                        <p className="ts-desc">{t.tech.tiles[name]}</p>
                        <div className={`ts-object ts-object--${name.toLowerCase()}`}>
                            <Visual />
                        </div>
                    </article>
                ))}
            </div>

            <p className="ts-more">{t.tech.more}</p>
        </section>
    );
}
