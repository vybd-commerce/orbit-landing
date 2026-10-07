import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useT } from "../i18n/context";
import { clamp01, easeInOut, lerp, linkShapes, pathFrom, seeded, type Pt } from "./complexityShared";
import "./ComplexityRing.css";

/* ── Content (edit here) ─────────────────────────────────────────────── */

type Group = "Decide" | "Land" | "Run";
const GROUPS: Group[] = ["Decide", "Land", "Run"];

/* Indices into complexity.tasks for each arc, clockwise from the top.
   Balanced 6 / 7 / 6 so the arcs read even: Entity setup and Finding
   financing sit under Decide, Sales tax (an ongoing filing) under Run. */
const ARCS: number[][] = [
    [0, 1, 2, 3, 4, 13],
    [6, 7, 8, 9, 10, 11, 12],
    [5, 14, 15, 16, 17, 18],
];
const N = 19;

/* Timeline, in ms from the moment the section is 40% in view. */
const FADE_STAGGER = 25; // chaos: pills fade in top to bottom
const FADE_DUR = 250;
const MOVE_START = 1100; // chaos → ring, clockwise sweep
const MOVE_STAGGER = 30;
const MOVE_DUR = 700;
const CHECK_DUR = 250;
const CAPTION_SWAP = 1300;
const RING_IN: [number, number] = [1150, 2350];
const LABELS_IN: [number, number] = [2100, 2600];
const TOTAL = MOVE_START + (N - 1) * MOVE_STAGGER + MOVE_DUR + CHECK_DUR + 100;

/* Spacing on the ring (px): between pills, and around each arc. */
const PILL_GAP = 6;
const ARC_GAP = 18;

/* ── Geometry ────────────────────────────────────────────────────────── */

type Box = { w: number; h: number };
type Geo = {
    w: number;
    h: number;
    c: Pt;
    rx: number;
    ry: number;
    s: number; // pill scale, below 1 only if the ring can't fit them at full size
    chaos: (Pt & { r: number })[]; // by task
    ring: Pt[]; // by task
    sweep: number[]; // by task: position in clockwise order
    reveal: number[]; // by task: chaos fade-in rank
    loose: Pt[][];
    spoke: Pt[][];
    labels: Pt[]; // by group
};

const clear = (p: Pt, a: Box, q: Pt, b: Box, gap: number) =>
    Math.abs(p.x - q.x) >= (a.w + b.w) / 2 + gap || Math.abs(p.y - q.y) >= (a.h + b.h) / 2 + gap;

/* Walk clockwise from the Vybd tag at 12 o'clock, setting each item down
   at the first angle where it clears the one before (so wide pills take
   more of the ring at the top and bottom, where it runs horizontal). The
   spare ring becomes the widest even gap that still closes the lap, doubled
   between arcs so the three groups read apart. With heads (narrow stages)
   each arc opens with its group label as a tag on the ring. Shrinks the
   pills if the ring can't hold them. */
function placeOnRing(w: number, h: number, sizes: Box[], tag: Box, heads: Box[] | null) {
    const c = { x: w / 2, y: h / 2 };
    const start = -Math.PI / 2;
    const full = start + Math.PI * 2;
    const step = Math.PI / 900;
    let out: { s: number; rx: number; ry: number; ring: Pt[]; theta: number[]; heads: Pt[] } | null = null;
    for (let k = 0; k <= 6 && !out; k++) {
        const s = 1 - k * 0.04;
        const maxW = Math.max(...sizes.map((b) => b.w)) * s;
        const ph = sizes[0].h * s;
        const rx = Math.min(w * 0.36, w / 2 - maxW / 2 - 8);
        const ry = Math.min(h * (heads ? 0.47 : 0.42), h / 2 - ph / 2 - 10);
        const at = (t: number) => ({ x: c.x + rx * Math.cos(t), y: c.y + ry * Math.sin(t) });

        type Item = { task: number; head: number; box: Box; gap: number; opens: boolean };
        const items: Item[] = ARCS.flatMap((arc, g) => [
            ...(heads ? [{ task: -1, head: g, box: heads[g], gap: ARC_GAP, opens: true }] : []),
            ...arc.map((task, j) => ({
                task,
                head: -1,
                box: { w: sizes[task].w * s, h: sizes[task].h * s },
                gap: j === 0 && !heads ? ARC_GAP : PILL_GAP,
                opens: j === 0 && !heads,
            })),
        ]);
        /* One greedy lap with every gap widened by extra px; returns each
           item's angle and where the lap closes back on the tag. */
        const lap = (extra: number) => {
            const thetas: number[] = [];
            let t = start;
            /* Checked against everything placed, not just the last item:
               where a narrow ring turns, a pill can reach two places back. */
            const placed = [{ p: at(start), b: tag }];
            for (const it of items) {
                const gap = it.gap + extra * (it.opens ? 2 : 1);
                const fits = (q: Pt) => placed.every((o, i) => clear(q, it.box, o.p, o.b, i === placed.length - 1 ? gap : PILL_GAP));
                while (t < full && !fits(at(t))) t += step;
                thetas.push(t);
                placed.push({ p: at(t), b: it.box });
            }
            const last = placed[placed.length - 1];
            while (!clear(at(t), tag, last.p, last.b, ARC_GAP + extra * 2) && t < full + 1) t += step;
            return { thetas, end: t };
        };
        if (lap(0).end > full && k < 6) continue;

        let lo = 0;
        let hi = 240;
        for (let n = 0; n < 14; n++) {
            const mid = (lo + hi) / 2;
            if (lap(mid).end <= full) lo = mid;
            else hi = mid;
        }
        const { thetas } = lap(lo);
        const ring: Pt[] = [];
        const theta: number[] = [];
        const headPts: Pt[] = [];
        items.forEach((it, i) => {
            if (it.head >= 0) headPts[it.head] = at(thetas[i]);
            else {
                theta[it.task] = thetas[i];
                ring[it.task] = at(thetas[i]);
            }
        });
        out = { s, rx, ry, ring, theta, heads: headPts };
    }
    return { c, ...out! };
}

/* Chaos: pills strewn around You, tilted, kept off the centre. Each pill
   takes the best of a few seeded tries (least overlap with those placed). */
function scatter(w: number, h: number, sizes: Box[], s: number, c: Pt) {
    const rand = seeded(11);
    const placed: (Pt & Box)[] = [];
    const out: (Pt & { r: number })[] = [];
    for (let i = 0; i < N; i++) {
        const bw = sizes[i].w * s;
        const bh = sizes[i].h * s;
        let best: Pt | null = null;
        let bestScore = Infinity;
        for (let k = 0; k < 40; k++) {
            const x = bw / 2 + 6 + rand() * (w - bw - 12);
            const y = bh / 2 + 6 + rand() * (h - bh - 12);
            if (Math.hypot((x - c.x) / 1.6, y - c.y) < 70) continue;
            const score = placed.reduce((sum, q) => {
                const ox = Math.max(0, (bw + q.w) / 2 + 8 - Math.abs(x - q.x));
                const oy = Math.max(0, (bh + q.h) / 2 + 8 - Math.abs(y - q.y));
                return sum + ox * oy;
            }, 0);
            if (score < bestScore) {
                bestScore = score;
                best = { x, y };
            }
        }
        const p = best ?? { x: c.x, y: c.y + 100 };
        placed.push({ ...p, w: bw, h: bh });
        out.push({ ...p, r: (rand() - 0.5) * 20 });
    }
    return out;
}

function buildGeo(w: number, h: number, sizes: Box[], tag: Box, heads: Box[] | null): Geo {
    const { c, s, rx, ry, ring, theta, heads: headPts } = placeOnRing(w, h, sizes, tag, heads);
    const chaos = scatter(w, h, sizes, s, c);
    const sweep: number[] = [];
    ARCS.flat().forEach((task, k) => (sweep[task] = k));
    const reveal: number[] = [];
    chaos
        .map((_, i) => i)
        .sort((a, b) => chaos[a].y - chaos[b].y || chaos[a].x - chaos[b].x)
        .forEach((task, k) => (reveal[task] = k));
    /* Group labels: tags on the ring when narrow, else inside the ring
       towards each arc's middle. */
    const labels = heads ? headPts : ARCS.map((arc) => {
        const mid = arc.reduce((sum, task) => sum + theta[task], 0) / arc.length;
        return { x: c.x + rx * 0.52 * Math.cos(mid), y: c.y + ry * 0.52 * Math.sin(mid) };
    });
    return {
        w,
        h,
        c,
        rx,
        ry,
        s,
        chaos,
        ring,
        sweep,
        reveal,
        loose: chaos.map((p) => linkShapes(c, c, p).loose),
        spoke: ring.map((p) => Array.from({ length: 7 }, (_, k) => ({ x: lerp(c.x, p.x, k / 6), y: lerp(c.y, p.y, k / 6) }))),
        labels,
    };
}

/* ── Section ─────────────────────────────────────────────────────────── */

/* "Why it's hard", the 360° variant (on /ring). Plays once, about three
   seconds, when the section is 40% in view; no pinning.
     1. chaos: nineteen pills strewn around You, each on a loose line;
     2. order: the pills sweep clockwise onto a ring around You, the lines
        straighten into spokes, the Vybd ring draws itself in, and each pill
        picks up a teal check as it lands, in three arcs: Decide, Land, Run.
   Per-frame work writes straight to the DOM: opacity, transforms, path d. */
export default function ComplexityRing() {
    const t = useT();
    const { tasks: labels, groups: groupLabels, captions, stageLabel, you: youLabel } = t.complexity;
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const ringRef = useRef<SVGPathElement>(null);
    const tagRef = useRef<HTMLSpanElement>(null);
    const youRef = useRef<HTMLSpanElement>(null);
    const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const checkRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const lineRefs = useRef<(SVGPathElement | null)[]>([]);
    const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const captionRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const geo = useRef<Geo | null>(null);
    const lastMs = useRef(reducedMotion ? TOTAL : 0);
    const [onScreen, setOnScreen] = useState(false);

    /* Paint the frame at ms into the timeline. */
    const paint = useCallback((ms: number) => {
        lastMs.current = ms;
        const g = geo.current;
        if (!g) return;

        for (let i = 0; i < N; i++) {
            const fade = clamp01((ms - g.reveal[i] * FADE_STAGGER) / FADE_DUR);
            const m0 = MOVE_START + g.sweep[i] * MOVE_STAGGER;
            const mv = easeInOut(clamp01((ms - m0) / MOVE_DUR));
            const ck = clamp01((ms - m0 - MOVE_DUR) / CHECK_DUR);
            const from = g.chaos[i];
            const to = g.ring[i];

            const pill = pillRefs.current[i];
            if (pill) {
                pill.style.opacity = String(fade);
                pill.style.transform =
                    `translate(${lerp(from.x, to.x, mv).toFixed(2)}px, ${lerp(from.y, to.y, mv).toFixed(2)}px) ` +
                    `translate(-50%, -50%) rotate(${lerp(from.r, 0, mv).toFixed(2)}deg) scale(${g.s})`;
            }
            innerRefs.current[i]?.style.setProperty("--cr-k", (1 - mv).toFixed(3));

            const check = checkRefs.current[i];
            if (check) {
                /* 0 → 1.1 → 1 */
                const sc = ck < 0.6 ? lerp(0, 1.1, ck / 0.6) : lerp(1.1, 1, (ck - 0.6) / 0.4);
                check.style.opacity = ck > 0 ? "1" : "0";
                check.style.transform = `scale(${sc.toFixed(3)})`;
            }

            const line = lineRefs.current[i];
            if (line) {
                const a = g.loose[i];
                const b = g.spoke[i];
                line.setAttribute("d", pathFrom(a.map((pt, k) => ({ x: lerp(pt.x, b[k].x, mv), y: lerp(pt.y, b[k].y, mv) }))));
                line.style.opacity = String(fade * lerp(1, 0.45, mv));
            }
        }

        const ringIn = easeInOut(clamp01((ms - RING_IN[0]) / (RING_IN[1] - RING_IN[0])));
        if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - ringIn);
        if (tagRef.current) tagRef.current.style.opacity = String(clamp01((ms - RING_IN[0]) / 300));
        const labelsO = String(clamp01((ms - LABELS_IN[0]) / (LABELS_IN[1] - LABELS_IN[0])));
        labelRefs.current.forEach((el) => el && (el.style.opacity = labelsO));

        const beat = ms < CAPTION_SWAP ? 0 : 1;
        captionRefs.current.forEach((el, i) => {
            if (!el) return;
            el.classList.toggle("is-active", i === beat);
            el.setAttribute("aria-hidden", String(i !== beat));
        });
    }, []);

    /* Measure pills and stage, lay out ring and scatter. Runs on mount, on
       stage resize, once fonts are in, and when the language changes. */
    useEffect(() => {
        const stage = stageRef.current;
        const tagEl = tagRef.current;
        if (!stage || !tagEl) return;
        let alive = true;
        const measure = () => {
            if (!alive) return;
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            const sizes = innerRefs.current.map((el) => ({ w: el?.offsetWidth ?? 120, h: el?.offsetHeight ?? 30 }));
            /* Narrow: no room inside the ring, so the group labels ride on it. */
            const onRing = w < 700;
            const heads = labelRefs.current.map((el) => {
                el?.classList.toggle("is-on-ring", onRing);
                return { w: el?.offsetWidth ?? 60, h: el?.offsetHeight ?? 20 };
            });
            const g = buildGeo(w, h, sizes, { w: tagEl.offsetWidth, h: tagEl.offsetHeight }, onRing ? heads : null);
            geo.current = g;

            svgRef.current?.setAttribute("viewBox", `0 0 ${w} ${h}`);
            const { c, rx, ry } = g;
            ringRef.current?.setAttribute(
                "d",
                `M${c.x} ${c.y - ry}A${rx} ${ry} 0 1 1 ${c.x} ${c.y + ry}A${rx} ${ry} 0 1 1 ${c.x} ${c.y - ry}`
            );
            tagEl.style.left = `${c.x}px`;
            tagEl.style.top = `${c.y - ry}px`;
            if (youRef.current) {
                youRef.current.style.left = `${c.x}px`;
                youRef.current.style.top = `${c.y}px`;
            }
            g.labels.forEach((pt, i) => {
                const el = labelRefs.current[i];
                if (!el) return;
                el.style.left = `${pt.x}px`;
                el.style.top = `${pt.y}px`;
            });
            paint(lastMs.current);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(stage);
        document.fonts?.ready.then(measure);
        return () => {
            alive = false;
            ro.disconnect();
        };
    }, [paint, labels]);

    /* Visibility: pauses the drift while off screen. */
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* Play once at 40% in view; reduced motion goes straight to the end. */
    useEffect(() => {
        if (reducedMotion) {
            paint(TOTAL);
            return;
        }
        const stage = stageRef.current;
        if (!stage || lastMs.current >= TOTAL) return;
        let raf = 0;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                const t0 = performance.now();
                const tick = (now: number) => {
                    const ms = Math.min(TOTAL, now - t0);
                    paint(ms);
                    if (ms < TOTAL) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.4 }
        );
        io.observe(stage);
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [reducedMotion, paint]);

    const shown = [captions[0], captions[2]];

    return (
        <section ref={sectionRef} className={`cr-section${onScreen ? "" : " is-paused"}`} aria-labelledby="cr-caption">
            <h2 id="cr-caption" className="cr-caption" aria-live="polite">
                {shown.map((c, i) => (
                    <span
                        key={i}
                        ref={(el) => {
                            captionRefs.current[i] = el;
                        }}
                        className={`cr-caption-line${i === 0 ? " is-active" : ""}`}
                        aria-hidden={i !== 0}
                    >
                        {c}
                    </span>
                ))}
            </h2>

            <div ref={stageRef} className="cr-stage" role="img" aria-label={stageLabel}>
                <svg ref={svgRef} className="cr-lines" aria-hidden="true">
                    {labels.map((_, i) => (
                        <path
                            key={i}
                            ref={(el) => {
                                lineRefs.current[i] = el;
                            }}
                            className="cr-line"
                        />
                    ))}
                    <path ref={ringRef} className="cr-ring" pathLength={1} />
                </svg>

                {GROUPS.map((g, i) => (
                    <span
                        key={g}
                        ref={(el) => {
                            labelRefs.current[i] = el;
                        }}
                        className="cr-group"
                        aria-hidden="true"
                    >
                        {groupLabels[g]}
                    </span>
                ))}

                <span ref={tagRef} className="cr-tag" aria-hidden="true">
                    Vybd
                </span>

                {labels.slice(0, N).map((label, i) => (
                    <span
                        key={i}
                        ref={(el) => {
                            pillRefs.current[i] = el;
                        }}
                        className="cr-pill"
                        aria-hidden="true"
                    >
                        <span
                            ref={(el) => {
                                innerRefs.current[i] = el;
                            }}
                            className="cr-pill-inner"
                            style={
                                {
                                    "--drift-dur": `${6 + ((i * 37) % 40) / 10}s`,
                                    "--drift-delay": `${-((i * 53) % 90) / 10}s`,
                                    "--drift-x": `${i % 3 === 0 ? 2.5 : -2}px`,
                                } as CSSProperties
                            }
                        >
                            <span
                                ref={(el) => {
                                    checkRefs.current[i] = el;
                                }}
                                className="cr-check"
                            >
                                <svg viewBox="0 0 14 14">
                                    <circle cx="7" cy="7" r="7" />
                                    <path d="M4.2 7.2l1.9 1.9 3.7-3.8" />
                                </svg>
                            </span>
                            {label}
                        </span>
                    </span>
                ))}

                <span ref={youRef} className="cr-you" aria-hidden="true">
                    {youLabel}
                </span>
            </div>

            <ul className="cr-sr">
                {ARCS.map((arc, g) =>
                    arc.map((task) => (
                        <li key={task}>
                            {labels[task]} ({groupLabels[GROUPS[g]]})
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}
