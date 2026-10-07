/* Helpers shared by ComplexitySection (the web) and ComplexityRing (the
   360° ring variant on /ring). */

export type Pt = { x: number; y: number };

/* Deterministic random, so scatters are the same on every load. */
export function seeded(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Every You→pill line is two cubic segments meeting at a midpoint. In
   beat 1 the midpoint sits halfway along a soft S-curve; in beat 2 it is the
   hub, with vertical tangents there so all lines pass through it together.
   Same structure in both shapes, so the morph is a plain point lerp. */
export function linkShapes(you: Pt, hub: Pt, p: Pt) {
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

export function pathFrom(pts: Pt[]) {
    const f = (q: Pt) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    return `M${f(pts[0])}C${f(pts[1])} ${f(pts[2])} ${f(pts[3])}C${f(pts[4])} ${f(pts[5])} ${f(pts[6])}`;
}
