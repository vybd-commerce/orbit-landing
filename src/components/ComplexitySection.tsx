import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import "./ComplexitySection.css";

/* ── Content (edit here) ─────────────────────────────────────────────── */

type Group = "Decide" | "Land" | "Run";

const TASKS: { label: string; group: Group }[] = [
    { label: "Channel strategy", group: "Decide" },
    { label: "US pricing", group: "Decide" },
    { label: "Marketing", group: "Decide" },
    { label: "Retail buyers", group: "Decide" },
    { label: "Entity setup", group: "Land" },
    { label: "Sales tax", group: "Land" },
    { label: "FDA / FCC rules", group: "Land" },
    { label: "Labeling", group: "Land" },
    { label: "Customs broker", group: "Land" },
    { label: "Importer of record", group: "Land" },
    { label: "Tariffs and duties", group: "Land" },
    { label: "Freight", group: "Land" },
    { label: "Cargo insurance", group: "Land" },
    { label: "Finding financing", group: "Land" },
    { label: "3PL warehouse", group: "Run" },
    { label: "Returns", group: "Run" },
    { label: "Retailer chargebacks", group: "Run" },
    { label: "Amazon account", group: "Run" },
    { label: "Customer service", group: "Run" },
];

const CAPTIONS = [
    "Selling in the US means managing all of this.",
    "Or one relationship instead of nineteen.",
    "You make great products. We handle the rest.",
];

const STAGE_LABEL =
    "Nineteen tasks for selling in the US, from customs and freight to returns and financing, handled by Vybd under three steps: Decide, Land and Run.";

const GROUPS: Group[] = ["Decide", "Land", "Run"];

/* Beat windows on the 0..1 progress line. */
const BEAT1: [number, number] = [0, 0.3];
const BEAT2: [number, number] = [0.3, 0.56];
/* Beat 3, chaos into order: the card fades in as the thread completes, the
   per-pill lines fade, then the pills stream into their columns. Timings
   are the brief's 40ms stagger / 600ms move / 250ms check, mapped onto the
   0.6..0.85 stretch of the line (1320ms of motion in all). */
const CARD_IN: [number, number] = [0.54, 0.6];
const LINKS_OUT: [number, number] = [0.55, 0.6];
const MOVE_START = 0.6;
const MOVE_SPAN = 0.25;
const MOVE_MS = 40 * 18 + 600;
const STAGGER = (MOVE_SPAN * 40) / MOVE_MS;
const MOVE_DUR = (MOVE_SPAN * 600) / MOVE_MS;
const CHECK_DUR = (MOVE_SPAN * 250) / MOVE_MS;
const AUTOPLAY_MS = 4000; // under 1024px: all three beats, played once
const CROSSING_COUNT = 12;
/* Room a landed pill grows on its left for the check (px). */
const CHECK_ROOM = 20;

/* ── Geometry ────────────────────────────────────────────────────────── */

type Pt = { x: number; y: number };
type Layout = { w: number; h: number; you: Pt; hub: Pt; pills: (Pt & { task: number })[] };

/* Deterministic shuffle, so the scatter is the same on every load and
   groups end up mixed across rows rather than sorted. */
function seeded(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}

function scatterOrder(n: number) {
    const rand = seeded(7);
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

/* Wide: four staggered rows in a 1000×760 space; the card fills from the
   hub to the bottom edge in beat 3. */
function wideLayout(n: number): Layout {
    const order = scatterOrder(n);
    const perRow = Math.ceil(n / 4);
    const rowsY = [300, 390, 480, 570];
    const pills: Layout["pills"] = [];
    rowsY.forEach((y, r) => {
        const row = order.slice(r * perRow, (r + 1) * perRow);
        const stagger = r % 2 === 0 ? -28 : 28;
        row.forEach((task, i) => {
            const x = row.length === 1 ? 500 : 165 + (670 * i) / (row.length - 1) + stagger;
            pills.push({ x, y, task });
        });
    });
    return { w: 1000, h: 760, you: { x: 500, y: 52 }, hub: { x: 500, y: 222 }, pills };
}

/* Compact: two per row, alternating offsets, in a 400-wide space. */
function compactLayout(n: number): Layout {
    const order = scatterOrder(n);
    const rows = Math.ceil(n / 2);
    const top = 250;
    const step = 50;
    const pills: Layout["pills"] = [];
    for (let r = 0; r < rows; r++) {
        const row = order.slice(r * 2, r * 2 + 2);
        const y = top + r * step;
        const xs = row.length === 1 ? [200] : r % 2 === 0 ? [112, 276] : [124, 288];
        row.forEach((task, i) => pills.push({ x: xs[i], y, task }));
    }
    /* Taller than the scatter needs, so the stacked card fits all three groups. */
    return { w: 400, h: Math.max(top + (rows - 1) * step + 46, 760), you: { x: 200, y: 40 }, hub: { x: 200, y: 172 }, pills };
}

/* Where each pill lands, in stage px: centre point and scale. */
type Target = { x: number; y: number; s: number };

type Measured = {
    stageW: number;
    stageH: number;
    card: { l: number; t: number; w: number; h: number };
    pillW: number[]; // by layout index
    pillH: number;
    headH: number;
};

/* Layout indices of each group's pills, in task-array order. */
function groupIndices(layout: Layout) {
    return GROUPS.map((g) =>
        layout.pills
            .map((_, i) => i)
            .filter((i) => TASKS[layout.pills[i].task].group === g)
            .sort((a, b) => layout.pills[a].task - layout.pills[b].task)
    );
}

/* Wide: three columns, headings at fixed height, pills listed below each
   heading left-aligned in a block centred on the column. Pitch shrinks to
   fit the tallest column (Land); pills scale down only as far as 13px text. */
function wideTargets(m: Measured, layout: Layout) {
    const { card, pillW, pillH, headH } = m;
    const headTop = 46;
    const firstTop = card.t + headTop + headH + 18;
    const groups = groupIndices(layout);
    const maxN = Math.max(...groups.map((g) => g.length));
    const avail = card.t + card.h - 26 - firstTop;
    const pitch = Math.min(pillH + 10, (avail - pillH) / (maxN - 1));
    const s = Math.max(13 / 14, Math.min(1, pitch / (pillH + 4)));
    const targets: Target[] = [];
    const heads = GROUPS.map((_, g) => ({ x: (card.w * (2 * g + 1)) / 6, y: headTop }));
    groups.forEach((idx, g) => {
        const block = s * Math.max(...idx.map((i) => pillW[i] + CHECK_ROOM));
        const left = card.l + heads[g].x - block / 2;
        idx.forEach((i, k) => {
            targets[i] = { x: left + s * (CHECK_ROOM + pillW[i] / 2), y: firstTop + (s * pillH) / 2 + k * pitch, s };
        });
    });
    return { targets, heads };
}

/* Compact: groups stacked, each heading above its pills, the pills wrapped
   into centred rows. Shrinks a little if the card would overflow; returns
   the height the stack needs so the card can end just below it. */
function compactTargets(m: Measured, layout: Layout) {
    const { card, pillW, pillH, headH } = m;
    const groups = groupIndices(layout);
    const gap = 6;
    let result = { targets: [] as Target[], heads: [] as Pt[], height: card.h };
    for (let s = 1; s >= 0.8; s -= 0.04) {
        const targets: Target[] = [];
        const heads: Pt[] = [];
        let y = 40;
        const rowH = s * pillH + gap;
        groups.forEach((idx) => {
            heads.push({ x: card.w / 2, y });
            y += headH + 10;
            const rows: number[][] = [[]];
            let used = 0;
            idx.forEach((i) => {
                const vw = s * (pillW[i] + CHECK_ROOM);
                const row = rows[rows.length - 1];
                if (row.length && used + gap + vw > card.w - 28) {
                    rows.push([i]);
                    used = vw;
                } else {
                    row.push(i);
                    used += (row.length > 1 ? gap : 0) + vw;
                }
            });
            rows.forEach((row) => {
                const total = row.reduce((sum, i) => sum + s * (pillW[i] + CHECK_ROOM), 0) + gap * (row.length - 1);
                let x = card.l + (card.w - total) / 2;
                row.forEach((i) => {
                    targets[i] = { x: x + s * (CHECK_ROOM + pillW[i] / 2), y: card.t + y + (s * pillH) / 2, s };
                    x += s * (pillW[i] + CHECK_ROOM) + gap;
                });
                y += rowH;
            });
            y += 14;
        });
        result = { targets, heads, height: y + 10 };
        if (y <= card.h) break;
    }
    return result;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const window01 = (p: number, [a, b]: [number, number]) => clamp01((p - a) / (b - a));

/* Every You→pill line is two cubic segments meeting at a midpoint. In
   beat 1 the midpoint sits halfway along a soft S-curve; in beat 2 it is the
   hub, with vertical tangents there so all lines pass through it together.
   Same structure in both shapes, so the morph is a plain point lerp. */
function linkShapes(you: Pt, hub: Pt, p: Pt) {
    const dx = p.x - you.x;
    const dy = p.y - you.y;
    const mid = { x: you.x + dx / 2, y: you.y + dy / 2 };
    const loose = [
        you,
        { x: you.x, y: you.y + dy * 0.3 },
        { x: mid.x - dx * 0.2, y: mid.y - dy * 0.12 },
        mid,
        { x: mid.x + dx * 0.2, y: mid.y + dy * 0.12 },
        { x: p.x, y: p.y - dy * 0.3 },
        p,
    ];
    const below = p.y - hub.y;
    const tight = [
        you,
        { x: you.x, y: you.y + (hub.y - you.y) * 0.4 },
        { x: hub.x, y: hub.y - (hub.y - you.y) * 0.35 },
        hub,
        { x: hub.x, y: hub.y + below * 0.45 },
        { x: p.x, y: p.y - below * 0.45 },
        p,
    ];
    return { loose, tight };
}

function pathFrom(pts: Pt[]) {
    const f = (q: Pt) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    return `M${f(pts[0])}C${f(pts[1])} ${f(pts[2])} ${f(pts[3])}C${f(pts[4])} ${f(pts[5])} ${f(pts[6])}`;
}

function crossingPairs(n: number, count: number) {
    const rand = seeded(42);
    const pairs: [number, number][] = [];
    while (pairs.length < count) {
        const a = Math.floor(rand() * n);
        const b = Math.floor(rand() * n);
        if (a !== b && !pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) pairs.push([a, b]);
    }
    return pairs;
}

/* ── Section ─────────────────────────────────────────────────────────── */

/* "Why it's hard": You, nineteen tasks, and three beats.
     1. the web: pills fade in, each tied to You, plus crossing lines;
     2. one thread: every line bends through a hub, the top merges into one
        navy line;
     3. chaos into order: a light Vybd card fades in where the thread ends,
        the per-pill lines fade, and each pill streams into its column
        under Decide / Land / Run, picking up a teal check as it lands.
   Wide screens pin the stage and drive the beats from scroll (smoothed);
   narrower screens play them once when the section is 40% in view. All
   per-frame work writes straight to the DOM: opacity, transforms, path d. */
export default function ComplexitySection() {
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const wide = useMediaQuery("(min-width: 1024px)");
    const pinned = wide && !reducedMotion;

    const layout = useMemo(() => (wide ? wideLayout(TASKS.length) : compactLayout(TASKS.length)), [wide]);
    const shapes = useMemo(
        () => layout.pills.map((p) => linkShapes(layout.you, layout.hub, p)),
        [layout]
    );
    const crossings = useMemo(() => crossingPairs(TASKS.length, CROSSING_COUNT), []);
    /* Reveal order: top to bottom, then left to right. */
    const revealRank = useMemo(() => {
        const idx = layout.pills.map((_, i) => i).sort((a, b) => layout.pills[a].y - layout.pills[b].y || layout.pills[a].x - layout.pills[b].x);
        const rank: number[] = [];
        idx.forEach((pillIndex, r) => (rank[pillIndex] = r));
        return rank;
    }, [layout]);

    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const linkRefs = useRef<(SVGPathElement | null)[]>([]);
    const crossRefs = useRef<(SVGPathElement | null)[]>([]);
    const trunkRef = useRef<SVGPathElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const headRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const checkRefs = useRef<(HTMLSpanElement | null)[]>([]);
    /* Beat 3 needs real pixel sizes (pill widths, card box); measured on
       mount, resize and font load, then reused every frame. */
    const measured = useRef<{ m: Measured; targets: Target[] } | null>(null);
    const lastP = useRef(0);

    const captionRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [onScreen, setOnScreen] = useState(false);

    /* Paint one frame of the sequence at progress p (0..1). */
    const paint = useCallback((p: number) => {
        lastP.current = p;
        const b1 = window01(p, BEAT1);
        const b2 = easeInOut(window01(p, BEAT2));
        const n = layout.pills.length;
        const fade = 1.6;
        const linksO = 1 - window01(p, LINKS_OUT);
        const meas = measured.current;

        layout.pills.forEach((q, i) => {
            const o = clamp01((b1 * (n + fade) - revealRank[i]) / fade);
            const pill = pillRefs.current[i];
            const link = linkRefs.current[i];
            if (link) {
                const { loose, tight } = shapes[i];
                link.setAttribute("d", pathFrom(loose.map((pt, k) => ({ x: lerp(pt.x, tight[k].x, b2), y: lerp(pt.y, tight[k].y, b2) }))));
                link.style.opacity = String(o * linksO);
            }
            if (!pill) return;
            pill.style.opacity = String(o);

            /* Beat 3: move into the column, then the check. */
            const start = MOVE_START + q.task * STAGGER;
            const mv = easeInOut(window01(p, [start, start + MOVE_DUR]));
            const ck = window01(p, [start + MOVE_DUR, start + MOVE_DUR + CHECK_DUR]);
            const t = meas?.targets[i];
            if (t && mv > 0) {
                const dx = (t.x - (q.x / layout.w) * meas.m.stageW) * mv;
                const dy = (t.y - (q.y / layout.h) * meas.m.stageH) * mv;
                pill.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${lerp(1, t.s, mv).toFixed(4)})`;
            } else {
                pill.style.transform = "";
            }
            const inner = innerRefs.current[i];
            if (inner) {
                /* Drift eases out as the pill travels; still once landed. */
                inner.style.setProperty("--cx-k", (1 - mv).toFixed(3));
                const w = meas?.m.pillW[i] || 100;
                inner.style.setProperty("--cx-sx", (1 + (CHECK_ROOM / w) * easeInOut(ck)).toFixed(4));
            }
            const check = checkRefs.current[i];
            if (check) {
                /* 0 → 1.1 → 1 */
                const sc = ck < 0.6 ? lerp(0, 1.1, ck / 0.6) : lerp(1.1, 1, (ck - 0.6) / 0.4);
                check.style.opacity = ck > 0 ? "1" : "0";
                check.style.transform = `translateY(-50%) scale(${sc.toFixed(3)})`;
            }
        });

        const crossO = clamp01(b1 * 1.25 - 0.25) * (1 - b2);
        crossRefs.current.forEach((c) => c && (c.style.opacity = String(crossO)));

        const trunk = trunkRef.current;
        if (trunk) {
            trunk.style.opacity = String(b2);
            trunk.setAttribute("stroke-width", (1 + 3 * b2).toFixed(2));
        }

        const card = cardRef.current;
        if (card) card.style.opacity = String(window01(p, CARD_IN));

        /* Caption swaps by class; the 300ms crossfade is in the CSS. */
        const beat = p < 0.3 ? 0 : p < 0.56 ? 1 : 2;
        captionRefs.current.forEach((el, i) => {
            if (!el) return;
            el.classList.toggle("is-active", i === beat);
            el.setAttribute("aria-hidden", String(i !== beat));
        });
    }, [layout, shapes, revealRank]);

    /* Visibility: pauses the drift, and (compact) triggers the one-shot play. */
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* Reduced motion: straight to the end state. */
    useEffect(() => {
        if (reducedMotion) paint(1);
    }, [reducedMotion, paint]);

    /* Wide: scroll through the pinned wrapper → progress, eased toward the
       target each frame so scrubbing (both ways) stays smooth. */
    useEffect(() => {
        if (!pinned) return;
        const section = sectionRef.current;
        if (!section) return;
        let current = 0;
        let target = 0;
        let raf = 0;
        const readTarget = () => {
            const r = section.getBoundingClientRect();
            const range = Math.max(1, r.height - window.innerHeight);
            target = clamp01(-r.top / range);
        };
        const tick = () => {
            current += (target - current) * 0.14;
            if (Math.abs(target - current) < 0.0005) current = target;
            paint(current);
            raf = current === target ? 0 : requestAnimationFrame(tick);
        };
        const onScroll = () => {
            readTarget();
            if (!raf) raf = requestAnimationFrame(tick);
        };
        readTarget();
        current = target;
        paint(current);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(raf);
        };
    }, [pinned, paint]);

    /* Compact: play once at 40% in view, ending on beat 3. */
    useEffect(() => {
        if (pinned || reducedMotion) return;
        const stage = stageRef.current;
        if (!stage) return;
        paint(0);
        let raf = 0;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                const t0 = performance.now();
                const tick = (t: number) => {
                    const p = clamp01((t - t0) / AUTOPLAY_MS);
                    paint(p);
                    if (p < 1) raf = requestAnimationFrame(tick);
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
    }, [pinned, reducedMotion, paint]);

    /* Measure the card and pills, place the headings, work out where every
       pill lands. Runs on mount, on stage resize and once fonts are in. */
    useEffect(() => {
        const stage = stageRef.current;
        const card = cardRef.current;
        if (!stage || !card) return;
        let alive = true;
        const measure = () => {
            if (!alive) return;
            const inners = innerRefs.current;
            card.style.height = ""; // back to the CSS box before measuring
            const m: Measured = {
                stageW: stage.clientWidth,
                stageH: stage.clientHeight,
                card: { l: card.offsetLeft, t: card.offsetTop, w: card.offsetWidth, h: card.offsetHeight },
                pillW: layout.pills.map((_, i) => inners[i]?.offsetWidth ?? 100),
                pillH: inners[0]?.offsetHeight ?? 32,
                headH: headRefs.current[0]?.offsetHeight ?? 36,
            };
            const { targets, heads, height } = wide ? { ...wideTargets(m, layout), height: 0 } : compactTargets(m, layout);
            /* Compact: the card hugs its stack rather than the stage bottom. */
            if (height) card.style.height = `${Math.min(height, m.card.h)}px`;
            heads.forEach((pt, g) => {
                const el = headRefs.current[g];
                if (!el) return;
                el.style.left = `${pt.x}px`;
                el.style.top = `${pt.y}px`;
            });
            measured.current = { m, targets };
            paint(lastP.current);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(stage);
        document.fonts?.ready.then(measure);
        return () => {
            alive = false;
            ro.disconnect();
        };
    }, [layout, wide, paint]);

    const pct = (v: number, of: number) => `${(v / of) * 100}%`;
    const { w, h, you, hub } = layout;

    return (
        <section
            ref={sectionRef}
            className={`cx-section${pinned ? " is-pinned" : ""}${onScreen ? "" : " is-paused"}`}
            aria-labelledby="cx-caption"
        >
            <div className="cx-sticky">
                <h2 id="cx-caption" className="cx-caption" aria-live="polite">
                    {CAPTIONS.map((c, i) => (
                        <span
                            key={i}
                            ref={(el) => {
                                captionRefs.current[i] = el;
                            }}
                            className={`cx-caption-line${i === 0 ? " is-active" : ""}`}
                            aria-hidden={i !== 0}
                        >
                            {c}
                        </span>
                    ))}
                </h2>

                <div
                    ref={stageRef}
                    className="cx-stage"
                    role="img"
                    aria-label={STAGE_LABEL}
                    style={{ aspectRatio: `${w} / ${h}`, "--cx-ar": w / h, "--cx-hub": pct(hub.y, h) } as CSSProperties}
                >
                    <svg className="cx-lines" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
                        {crossings.map(([a, b], i) => {
                            const pa = layout.pills.find((q) => q.task === a)!;
                            const pb = layout.pills.find((q) => q.task === b)!;
                            const bend = (i % 2 ? 1 : -1) * 40;
                            return (
                                <path
                                    key={`x${i}`}
                                    ref={(el) => {
                                        crossRefs.current[i] = el;
                                    }}
                                    className="cx-cross"
                                    d={`M${pa.x} ${pa.y}Q${(pa.x + pb.x) / 2} ${(pa.y + pb.y) / 2 + bend} ${pb.x} ${pb.y}`}
                                />
                            );
                        })}
                        {layout.pills.map((_, i) => (
                            <path
                                key={`l${i}`}
                                ref={(el) => {
                                    linkRefs.current[i] = el;
                                }}
                                className="cx-link"
                                d={pathFrom(shapes[i].loose)}
                            />
                        ))}
                        <path
                            ref={trunkRef}
                            className="cx-trunk"
                            d={`M${you.x} ${you.y}C${you.x} ${you.y + (hub.y - you.y) * 0.4} ${hub.x} ${hub.y - (hub.y - you.y) * 0.35} ${hub.x} ${hub.y}`}
                            strokeWidth={1}
                        />
                    </svg>

                    {layout.pills.map((p, i) => (
                        <span
                            key={TASKS[p.task].label}
                            ref={(el) => {
                                pillRefs.current[i] = el;
                            }}
                            className="cx-pill"
                            style={
                                {
                                    left: pct(p.x, w),
                                    top: pct(p.y, h),
                                    "--drift-dur": `${6 + ((p.task * 37) % 40) / 10}s`,
                                    "--drift-delay": `${-((p.task * 53) % 90) / 10}s`,
                                    "--drift-x": `${p.task % 3 === 0 ? 2.5 : -2}px`,
                                } as CSSProperties
                            }
                            aria-hidden="true"
                        >
                            <span
                                ref={(el) => {
                                    innerRefs.current[i] = el;
                                }}
                                className="cx-pill-inner"
                            >
                                <span
                                    ref={(el) => {
                                        checkRefs.current[i] = el;
                                    }}
                                    className="cx-check"
                                >
                                    <svg viewBox="0 0 14 14">
                                        <circle cx="7" cy="7" r="7" />
                                        <path d="M4.2 7.2l1.9 1.9 3.7-3.8" />
                                    </svg>
                                </span>
                                {TASKS[p.task].label}
                            </span>
                        </span>
                    ))}

                    <span className="cx-you" style={{ left: pct(you.x, w), top: pct(you.y, h) }} aria-hidden="true">
                        You
                    </span>

                    <div ref={cardRef} className="cx-card" aria-hidden="true">
                        <span className="cx-card-brand">Vybd</span>
                        {GROUPS.map((g, i) => (
                            <span
                                key={g}
                                ref={(el) => {
                                    headRefs.current[i] = el;
                                }}
                                className="cx-card-head"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                </div>

                <ul className="cx-sr">
                    {TASKS.map((t) => (
                        <li key={t.label}>
                            {t.label} ({t.group})
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
