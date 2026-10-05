import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { FLOW } from "../../data/flowCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { sectionEntry, sectionProgress } from "../../lib/sectionProgress";
import "../ScaleStory.css";
import "./FlowStory.css";

/* "From factory to customer", the simple version: one line-art panorama,
 * six scenes, one route. Scroll pans the camera along the route, a parcel
 * rides it, and each scene comes alive as the parcel arrives. Pure SVG and
 * CSS: no video, no WebGL.
 *
 * World: 3600 × 400 user units, six 600-wide scenes, ground at y = 300.
 */

const WORLD_W = 3600;
const VIEW_W = 640;
/* Phones get a narrower camera window so each scene fills the screen; the
   camera follows the parcel, so nothing important is lost off the edges. */
const VIEW_W_PHONE = 380;
const VIEW_H = 400;
const BEATS = FLOW.beats.length;

/* Where the parcel stands in each scene. It holds there for the first part
   of each beat (so the caption can be read), then travels to the next. */
const ANCHORS = [300, 1000, 1440, 2100, 2700, 3330];
const HOLD = 0.4;

/* Ship: docked at the origin quay, sails with the parcel, docks at the
   destination. */
const SHIP_FROM = 1120;
const SHIP_TO = 1760;
const SEA_Y = 312;

const ROUTE = `M 150 300 H 1010 L 1040 ${SEA_Y} H 1830 L 1860 300 H 3290 Q 3315 300 3330 268`;

const smooth = (t: number) => {
    const c = Math.min(1, Math.max(0, t));
    return c * c * (3 - 2 * c);
};
const pad = (n: number) => String(n).padStart(2, "0");

function wavePath(x0: number, x1: number, y: number) {
    let d = `M ${x0} ${y}`;
    for (let x = x0; x < x1; x += 40) d += ` q 10 -4 20 0 q 10 4 20 0`;
    return d;
}

/* Product glyphs, drawn around (0, 0), ~18 units. */
const Tee = () => <path className="fl-l" d="M-9 -5 L-4 -9 L4 -9 L9 -5 L6 -1 L4 -2.5 L4 9 L-4 9 L-4 -2.5 L-6 -1 Z" />;
const Bag = () => (
    <g className="fl-l">
        <path d="M-6 -8 H6 V9 H-6 Z" />
        <path d="M-6 -4 H6" />
    </g>
);
const Jar = () => (
    <g className="fl-l">
        <rect x={-6} y={-3} width={12} height={12} rx={2} />
        <rect x={-7} y={-8} width={14} height={5} rx={1} />
    </g>
);
const GLYPHS = [Tee, Bag, Jar];

function Person({ x, facing }: { x: number; facing: 1 | -1 }) {
    return (
        <g className="fl-l" transform={`translate(${x} 0)`}>
            <circle cx={0} cy={172} r={13} />
            <path d="M-20 270 V214 Q-20 196 0 196 Q20 196 20 214 V270" />
            <path className={`fl-arm fl-arm--${facing > 0 ? "r" : "l"}`} d={`M${facing * 14} 214 L${facing * 44} 246`} />
        </g>
    );
}

/* The whole panorama. Scene groups get `is-on` as the parcel reaches them. */
function World({ on, done, cleared }: { on: boolean[]; done: boolean; cleared: boolean }) {
    const cls = (i: number) => `fl-scene${on[i] ? " is-on" : ""}`;
    return (
        <>
            {/* Ground and water */}
            <path className="fl-ground" d="M 0 300 H 1040 V 330 M 1840 330 V 300 H 3600" />
            <clipPath id="fl-sea">
                <rect x={1040} y={300} width={800} height={40} />
            </clipPath>
            <g clipPath="url(#fl-sea)">
                <path className="fl-wave" d={wavePath(1000, 1900, 322)} />
                <path className="fl-wave fl-wave--2" d={wavePath(1000, 1900, 332)} />
            </g>

            {/* 01 Factory */}
            <g className={cls(0)}>
                <path className="fl-l" d="M80 300 V170 L125 135 V170 L170 135 V170 L215 135 V170 L260 135 V170 L340 170 V300" />
                <rect className="fl-l" x={300} y={112} width={18} height={58} />
                {[0, 1, 2].map((i) => (
                    <circle key={i} className="fl-smoke" cx={309} cy={100} r={6 + i * 2} style={{ animationDelay: `${-i * 1.1}s` }} />
                ))}
                {[0, 1, 2, 3].map((i) => (
                    <rect key={i} className="fl-l fl-lo" x={96 + i * 36} y={200} width={22} height={16} />
                ))}
                <rect className="fl-l" x={262} y={248} width={46} height={52} />
                <path className="fl-l" d="M285 300 H525" />
                {Array.from({ length: 9 }, (_, i) => (
                    <circle key={i} className="fl-l fl-lo" cx={292 + i * 28} cy={305} r={3} />
                ))}
                {GLYPHS.map((G, i) => (
                    <g key={i} className="fl-belt" style={{ animationDelay: `${-i * 2}s` }}>
                        <g transform="translate(290 288)">
                            <G />
                        </g>
                    </g>
                ))}
                <path className="fl-l" d="M528 300 V276 H564 V300 M528 276 L520 266 M564 276 L572 266" />
            </g>

            {/* 02 Port */}
            <g className={cls(1)}>
                {Array.from({ length: 8 }, (_, i) => (
                    <rect
                        key={i}
                        className="fl-l fl-lo"
                        x={650 + (i % 4) * 40}
                        y={i < 4 ? 282 : 264}
                        width={36}
                        height={18}
                    />
                ))}
                <path className="fl-l" d="M950 300 V150 M1000 300 V150 M920 150 H1180 M920 162 H1000 M950 190 H1000" />
                <g className="fl-trolley">
                    <rect className="fl-l" x={952} y={146} width={16} height={8} />
                    <g transform="translate(960 154)">
                        <rect className="fl-cable" x={-0.5} y={0} width={1} height={1} />
                    </g>
                    <g className="fl-hook">
                        <rect className="fl-l fl-box" x={942} y={154} width={36} height={16} />
                    </g>
                </g>
            </g>

            {/* 03 Ocean and air */}
            <g className={cls(2)}>
                <path id="fl-air" className="fl-l fl-dash" d="M 1230 170 Q 1500 60 1780 150" />
                <g className="fl-plane">
                    <path className="fl-l" d="M-9 0 H9 M1 -6 L4 0 L1 6 M-6 -3 L-4 0 L-6 3" />
                    <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#fl-air" />
                    </animateMotion>
                </g>
                <g className="fl-far-ship">
                    <path className="fl-l fl-lo" d="M-26 0 H26 L20 7 H-22 Z M8 -8 H18 V0" />
                </g>
            </g>

            {/* The ship (moved by scroll) */}
            <g id="fl-ship" className={`fl-ship${on[1] ? " is-on" : ""}`} transform={`translate(${SHIP_FROM} ${SEA_Y})`}>
                <path className="fl-l" d="M-80 0 H80 L66 18 H-70 Z" />
                <rect className="fl-l" x={50} y={-24} width={20} height={24} />
                {[0, 1, 2, 3].map((i) => (
                    <rect key={i} className="fl-l fl-lo" x={-62 + i * 24} y={-11} width={20} height={11} />
                ))}
            </g>

            {/* 04 Customs */}
            <g className={`${cls(3)}${cleared ? " is-cleared" : ""}`}>
                <path className="fl-l" d="M2060 300 V196 H2140 V300 M2052 196 H2148" />
                <rect className="fl-beam" x={2064} y={204} width={72} height={2} />
                <rect className="fl-l" x={2176} y={246} width={28} height={54} />
                <path className="fl-barrier fl-l" d="M2204 262 H2268" />
                <g className="fl-check">
                    <circle className="fl-acc" cx={2100} cy={168} r={12} />
                    <path className="fl-acc" d="M2094 168 L2099 173 L2107 163" />
                </g>
            </g>

            {/* 05 Store */}
            <g className={cls(4)}>
                <path className="fl-l" d="M2560 300 V190 H2840 V300" />
                <path className="fl-l" d="M2550 190 L2566 170 H2834 L2850 190 M2590 170 L2584 190 M2620 170 L2618 190 M2650 170 L2652 190 M2680 170 L2686 190 M2710 170 L2720 190 M2740 170 L2754 190 M2770 170 L2788 190 M2800 170 L2822 190" />
                <rect className="fl-l" x={2680} y={236} width={40} height={64} />
                <path className="fl-l fl-lo" d="M2580 236 H2660 M2580 266 H2660 M2740 236 H2820 M2740 266 H2820" />
                {[0, 1, 2, 3, 4, 5].map((i) => {
                    const G = GLYPHS[i % 3];
                    const x = i < 3 ? 2596 + i * 24 : 2756 + (i - 3) * 24;
                    return (
                        <g key={i} className="fl-stock" style={{ transitionDelay: `${0.25 + i * 0.12}s` }}>
                            <g transform={`translate(${x} ${i % 2 ? 254 : 224}) scale(0.8)`}>
                                <G />
                            </g>
                        </g>
                    );
                })}
            </g>

            {/* 06 Customer */}
            <g className={`${cls(5)}${done ? " is-done" : ""}`}>
                <rect className="fl-l" x={3270} y={270} width={120} height={30} />
                <Person x={3240} facing={1} />
                <Person x={3430} facing={-1} />
                {GLYPHS.map((G, i) => (
                    <g key={i} className="fl-rise" style={{ transitionDelay: `${0.2 + i * 0.18}s` }}>
                        <g transform={`translate(${3264 + i * 66} 120)`}>
                            <G />
                            <text className="fl-city" x={0} y={30} textAnchor="middle">
                                {FLOW.cities[i]}
                            </text>
                        </g>
                    </g>
                ))}
            </g>

            {/* Scene labels */}
            {FLOW.beats.map((b, i) => (
                <text key={b.scene} className={`fl-label${on[i] ? " is-on" : ""}`} x={i * 600 + 300} y={372} textAnchor="middle">
                    {pad(i + 1)} · {b.scene}
                </text>
            ))}
        </>
    );
}

export default function FlowStory() {
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const phone = useMediaQuery("(max-width: 640px)");
    const viewW = phone ? VIEW_W_PHONE : VIEW_W;
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const routeRef = useRef<SVGPathElement>(null);
    const [beat, setBeat] = useState(0);
    const [reach, setReach] = useState(0); // parcel x, coarse, for scene states
    const on = useMemo(() => ANCHORS.map((a) => reach >= a - 160), [reach]);

    useEffect(() => {
        if (reducedMotion) return;
        const section = sectionRef.current;
        const stage = stageRef.current;
        const svg = svgRef.current;
        const route = routeRef.current;
        if (!section || !stage || !svg || !route) return;

        const total = route.getTotalLength();
        const parcel = svg.querySelector<SVGGElement>("#fl-parcel");
        const ship = svg.querySelector<SVGGElement>("#fl-ship");
        const reveal = svg.querySelector<SVGRectElement>("#fl-route-reveal");

        // Arc length for a given x along the (monotonic in x) route.
        const lengthAt = (x: number) => {
            let lo = 0;
            let hi = total;
            for (let i = 0; i < 22; i++) {
                const mid = (lo + hi) / 2;
                if (route.getPointAtLength(mid).x < x) lo = mid;
                else hi = mid;
            }
            return lo;
        };

        let targetX = ANCHORS[0];
        let shownX = targetX;
        let camX = Math.max(0, shownX - viewW / 2);
        let raf = 0;
        let last = performance.now();
        let visible = false;

        const read = () => {
            const p = sectionProgress(section);
            stage.style.setProperty("--enter", sectionEntry(section).toFixed(3));
            const b = Math.min(BEATS - 1, Math.floor(p * BEATS));
            const f = p * BEATS - b;
            targetX =
                b >= BEATS - 1 || f < HOLD
                    ? ANCHORS[b]
                    : ANCHORS[b] + (ANCHORS[b + 1] - ANCHORS[b]) * smooth((f - HOLD) / (1 - HOLD));
            // The caption changes when the parcel arrives, not when it leaves.
            const arrived = targetX >= ANCHORS[Math.min(b + 1, BEATS - 1)] - 1 ? Math.min(b + 1, BEATS - 1) : b;
            setBeat((prev) => (prev === arrived ? prev : arrived));
        };

        const draw = (now: number) => {
            const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
            last = now;
            shownX += (targetX - shownX) * (1 - Math.exp(-dt * 7));
            const pt = route.getPointAtLength(lengthAt(shownX));
            parcel?.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
            reveal?.setAttribute("width", String(Math.max(0, pt.x - 140)));
            const shipX = Math.min(SHIP_TO, Math.max(SHIP_FROM, pt.x));
            ship?.setAttribute("transform", `translate(${shipX.toFixed(1)} ${SEA_Y})`);
            const wantCam = Math.min(WORLD_W - viewW, Math.max(0, pt.x - viewW * 0.5));
            camX += (wantCam - camX) * (1 - Math.exp(-dt * 5));
            svg.setAttribute("viewBox", `${camX.toFixed(1)} 0 ${viewW} ${VIEW_H}`);
            setReach((prev) => (Math.abs(prev - pt.x) > 20 ? Math.round(pt.x) : prev));
            raf = visible ? requestAnimationFrame(draw) : 0;
        };

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && !raf) {
                last = performance.now();
                raf = requestAnimationFrame(draw);
            }
        });
        io.observe(stage);
        read();
        window.addEventListener("scroll", read, { passive: true });
        window.addEventListener("resize", read);
        return () => {
            io.disconnect();
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", read);
            window.removeEventListener("resize", read);
        };
    }, [reducedMotion, viewW]);

    const jumpTo = (i: number) => {
        const section = sectionRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const travel = section.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + (travel * (i + HOLD / 2)) / BEATS, behavior: "smooth" });
    };

    /* Reduced motion: every scene drawn and still, one panel per beat. */
    if (reducedMotion) {
        return (
            <section className="scale scale--static" id="flow" aria-labelledby="flow-tag">
                <div className="scale-static-inner">
                    <div className="lp-section-tag" id="flow-tag">{FLOW.tag}</div>
                    <ol className="scale-static-list">
                        {FLOW.beats.map((b, i) => (
                            <li key={b.scene}>
                                <svg className="fl-svg fl-svg--static" viewBox={`${i * 600} 60 600 330`} aria-hidden="true">
                                    <World on={ANCHORS.map(() => true)} done cleared />
                                </svg>
                                <span className="scale-index">{pad(i + 1)} / {pad(BEATS)}</span>
                                <h3>{b.title}</h3>
                                <p>{b.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="scale flow" id="flow" aria-labelledby="flow-tag">
            <div ref={stageRef} className="scale-stage">
                <div className="scale-canvas fl-canvas" aria-hidden="true">
                    <svg
                        ref={svgRef}
                        className="fl-svg"
                        viewBox={`0 0 ${viewW} ${VIEW_H}`}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <clipPath id="fl-route-clip">
                            <rect id="fl-route-reveal" x={140} y={0} width={0} height={VIEW_H} />
                        </clipPath>
                        <path className="fl-route-ghost" d={ROUTE} />
                        <World
                            on={on}
                            done={beat === BEATS - 1 && reach >= ANCHORS[BEATS - 1] - 30}
                            cleared={reach >= ANCHORS[3] - 30}
                        />
                        <path ref={routeRef} className="fl-route" d={ROUTE} clipPath="url(#fl-route-clip)" />
                        <g id="fl-parcel">
                            <rect className="fl-parcel" x={-7} y={-12} width={14} height={12} rx={1.5} />
                        </g>
                    </svg>
                </div>

                <div className="scale-top">
                    <div className="lp-section-tag" id="flow-tag">{FLOW.tag}</div>
                    <a className="scale-skip" href="#audit">
                        {FLOW.skip} <ArrowDown size={13} />
                    </a>
                </div>

                <ol className="scale-captions">
                    {FLOW.beats.map((b, i) => (
                        <li key={b.scene} className={i === beat ? "is-active" : ""} aria-current={i === beat ? "step" : undefined}>
                            <span className="scale-index">{pad(i + 1)} / {pad(BEATS)}</span>
                            <h3>{b.title}</h3>
                            <p>{b.body}</p>
                        </li>
                    ))}
                </ol>

                <nav className="scale-rail" aria-label="Chapters">
                    {FLOW.beats.map((b, i) => (
                        <button
                            key={b.scene}
                            type="button"
                            className={i === beat ? "is-active" : ""}
                            aria-label={`${pad(i + 1)}: ${b.title}`}
                            aria-current={i === beat ? "step" : undefined}
                            onClick={() => jumpTo(i)}
                        >
                            <span>{pad(i + 1)}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </section>
    );
}
