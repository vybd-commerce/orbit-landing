import { useEffect, useRef, useState, type ReactNode } from "react";
import { markLoaderSeen } from "./loaderSession";

/* Opening animation: a top-down parcel drops in, its tape peels off, the
   flaps open and the camera dives in. Spring physics stepped at 240 Hz,
   ported from the prototype's lxEngine. The CSS keeps a safe static state
   and a fallback fade at 4.6s. */

type Spring = { x: number; v: number; k: number; c: number; t: number };

function lxEngine(root: HTMLElement) {
    const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
    const rig = q(".lx-rig"),
        tape = q(".lx-tape"),
        ft = q(".lx-flt"),
        fb = q(".lx-flb"),
        sl = q(".lx-sfl"),
        sr = q(".lx-sfr"),
        white = q(".lx-floor b");
    const segs: HTMLElement[] = [];
    let n = tape.firstElementChild as HTMLElement | null;
    while (n) {
        segs.push(n);
        n = n.firstElementChild as HTMLElement | null;
    }
    const N = segs.length;
    const spring = (x: number, k: number, c: number): Spring => ({ x, v: 0, k, c, t: x });
    const S = {
        cam: spring(320, 110, 12),
        ft: spring(0, 70, 10.5),
        fb: spring(0, 70, 10.5),
        sl: spring(0, 120, 13),
        sr: spring(0, 120, 13),
        seg: segs.map(() => spring(0, 380, 15)),
        fly: null as null | { x: number; y: number; z: number; r: number; vx: number; vy: number; vz: number; vr: number },
        t: 0,
        out: false,
        jolt: false,
    };
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const eio = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const sstep = (u: number) => u * u * (3 - 2 * u);
    const integrate = (sp: Spring, dt: number) => {
        const a = sp.k * (sp.t - sp.x) - sp.c * sp.v;
        sp.v += a * dt;
        sp.x += sp.v * dt;
    };
    // peel front: slow grab, then a steady rip, easing out at the end
    const peel = (t: number) => {
        const u = clamp((t - 0.62) / 0.8, 0, 1);
        const e = u < 0.18 ? 0.5 * (u / 0.18) * (u / 0.18) * 0.18 : 0.09 + (u - 0.18) * 1.1;
        return clamp(e, 0, 1) * N;
    };
    const targets = (t: number) => {
        S.cam.t = 0;
        const s = peel(t),
            released = t >= 1.42;
        segs.forEach((_, j) => {
            const i = N - 1 - j,
                k = s - i;
            let a = 0;
            if (k > 0) a = Math.min(k, 1) * (12 + 1.15 * Math.min(k, 14));
            else if (k > -1.2 && t > 0.5) a = 7 * (1 + k / 1.2);
            if (i === 0 && t > 0.45 && t < 0.66) a = Math.max(a, 24);
            if (released) a += 9;
            S.seg[j].t = a;
        });
        S.ft.t = t < 1.66 ? 0 : t < 1.78 ? 11 : 206;
        S.fb.t = t < 1.78 ? 0 : t < 1.9 ? -11 : -206;
        S.sl.t = t < 2.1 ? 0 : -122;
        S.sr.t = t < 2.17 ? 0 : 122;
        if (released && !S.fly) S.fly = { x: 0, y: 0, z: 0.8, r: 0, vx: 360, vy: -150, vz: 470, vr: 260 };
        if (released && !S.jolt) {
            S.jolt = true;
            S.cam.v -= 110;
        }
    };
    const stepTo = (t: number) => {
        const dt = 1 / 240;
        while (S.t < t) {
            targets(S.t);
            integrate(S.cam, dt);
            integrate(S.ft, dt);
            integrate(S.fb, dt);
            integrate(S.sl, dt);
            integrate(S.sr, dt);
            S.seg.forEach((sp) => integrate(sp, dt));
            if (S.fly) {
                const f = S.fly;
                f.x += f.vx * dt;
                f.y += f.vy * dt;
                f.z += f.vz * dt;
                f.r += f.vr * dt;
                f.vz -= 420 * dt;
                f.vx *= 0.999;
            }
            S.t += dt;
        }
    };
    /* Draws time t (seconds); false once the animation is over. */
    return (t: number) => {
        stepTo(t);
        const u = clamp((t - 2.62) / 1.05, 0, 1),
            d = u * u * u,
            w = eio(u);
        rig.style.transform = `translateZ(${(S.cam.x + 975 * d).toFixed(2)}px) rotateX(${(24 * (1 - w)).toFixed(3)}deg) rotateZ(${(-4 + 12 * w).toFixed(3)}deg)`;
        ft.style.transform = `rotateX(${S.ft.x.toFixed(2)}deg)`;
        fb.style.transform = `rotateX(${S.fb.x.toFixed(2)}deg)`;
        sl.style.transform = `translateZ(-.5px) rotateY(${S.sl.x.toFixed(2)}deg)`;
        sr.style.transform = `translateZ(-.5px) rotateY(${S.sr.x.toFixed(2)}deg)`;
        segs.forEach((el, j) => {
            const a = S.seg[j].x;
            el.style.transform = `rotateY(${a.toFixed(2)}deg)`;
            el.style.setProperty("--sh", clamp(a / 160, 0, 0.28).toFixed(3));
        });
        if (S.fly) {
            const f = S.fly;
            tape.style.transform = `translate3d(${f.x.toFixed(1)}px,${f.y.toFixed(1)}px,${f.z.toFixed(1)}px) rotateY(${f.r.toFixed(1)}deg)`;
            tape.style.visibility = t > 2.05 ? "hidden" : "visible";
        }
        white.style.opacity = sstep(clamp((t - 2.92) / 0.55, 0, 1)).toFixed(3);
        if (t >= 3.42 && !S.out) {
            S.out = true;
            root.classList.add("lx-out");
        }
        return t < 3.9;
    };
}

/* 24 tape strips, each nested in the previous so they curl as a chain. */
function Tape({ n }: { n: number }): ReactNode {
    return n === 0 ? null : (
        <div className="lx-seg">
            <Tape n={n - 1} />
        </div>
    );
}

const UpArrow = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
);

export default function Loader({ tx }: { tx: (s: string) => string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [gone, setGone] = useState(false);

    useEffect(() => {
        markLoaderSeen();
        const root = ref.current;
        let raf = 0;
        if (root) {
            try {
                const render = lxEngine(root);
                const t0 = performance.now();
                const f = (now: number) => {
                    if (render((now - t0) / 1000)) raf = requestAnimationFrame(f);
                };
                raf = requestAnimationFrame(f);
            } catch {
                /* the CSS fallback fade still clears the loader */
            }
        }
        const done = window.setTimeout(() => setGone(true), 5000);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(done);
        };
    }, []);

    if (gone) return null;
    return (
        <div className="loader" aria-hidden="true" ref={ref}>
            <div className="lx-stage">
                <div className="lx-rig">
                    <div className="lx-face lx-floor">
                        <b></b>
                    </div>
                    <div className="lx-face lx-wn"></div>
                    <div className="lx-face lx-ws">
                        <div className="lbl">
                            {tx("TO: THE US")}
                            <strong>Vybd</strong>
                        </div>
                    </div>
                    <div className="lx-face lx-ww"></div>
                    <div className="lx-face lx-we"></div>
                    <div className="lx-face lx-sf lx-sfl"></div>
                    <div className="lx-face lx-sf lx-sfr"></div>
                    <div className="lx-face lx-fl lx-flt">
                        <span className="lx-stamp">{tx("PRIORITY")}</span>
                        <span className="lx-arrow">
                            <UpArrow />
                            <UpArrow />
                        </span>
                    </div>
                    <div className="lx-face lx-fl lx-flb"></div>
                    <div className="lx-tape">
                        <Tape n={24} />
                    </div>
                </div>
            </div>
            <div className="lfoot">
                <div>
                    <strong>Vybd</strong>
                    <span>{tx("Opening your next market")}</span>
                </div>
                <div className="lbar">
                    <i></i>
                </div>
            </div>
        </div>
    );
}
