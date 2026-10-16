import { useEffect, useRef, useState } from "react";
import type { Tx } from "../i18n";
import { PIN_MAX_VH, prefersReducedMotion } from "../motion";

/* The one pinned moment: nineteen "boxes to tick" fly into a single Vybd
   parcel, which closes and gets stamped. Scroll-driven while pinned; on
   very tall screens it plays once when it comes into view. The animation
   writes straight to the DOM every frame, as in the prototype. */

// [label, ax, ay, delay]: start offset from the centre (fraction of the
// stage) and how late the pill sets off.
const PILLS: [string, number, number, number][] = [
    ["Channel strategy", 0.4212, 0.073, 0.005],
    ["US pricing", 0.3858, 0.126, 0.048],
    ["Marketing", 0.2276, 0.2827, 0.105],
    ["Retail buyers", 0.0975, 0.3141, 0.117],
    ["Entity setup", 0.0375, 0.3192, 0.166],
    ["Sales tax", -0.0522, 0.3008, 0.173],
    ["FDA / FCC rules", -0.2168, 0.2931, 0.221],
    ["Labeling", -0.3282, 0.1979, 0.002],
    ["Customs broker", -0.3493, 0.1686, 0.036],
    ["Importer of record", -0.4086, -0.0397, 0.082],
    ["Tariffs and duties", -0.3839, -0.1463, 0.128],
    ["Freight", -0.3551, -0.2048, 0.167],
    ["Cargo insurance", -0.1979, -0.3119, 0.171],
    ["Funding", -0.1341, -0.2993, 0.207],
    ["3PL warehouse", 0.0408, -0.3313, 0.009],
    ["Returns", 0.1953, -0.3308, 0.033],
    ["Retailer chargebacks", 0.2761, -0.2218, 0.104],
    ["Amazon account", 0.3129, -0.1737, 0.136],
    ["Customer service", 0.3599, -0.0392, 0.141],
];

function render(sec: HTMLElement, p: number, tx: Tx) {
    const stick = sec.querySelector<HTMLElement>(".co-stick"),
        pk = sec.querySelector<HTMLElement>(".co-pk");
    if (!stick || !pk) return;
    const W = stick.clientWidth,
        H = stick.clientHeight;
    const cl = (v: number) => Math.max(0, Math.min(1, v)),
        sm = (v: number) => {
            v = cl(v);
            return v * v * (3 - 2 * v);
        };
    const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const base = W < 700 ? Math.max(0.62, (W / 700) * 0.9) : 1;
    const appear = sm((p - 0.02) / 0.12),
        grow = sm((p - 0.1) / 0.72),
        bump = Math.sin(Math.PI * cl((p - 0.86) / 0.1));
    const sc = base * (0.58 + 0.42 * grow) * (1 + 0.05 * bump);
    pk.style.opacity = appear.toFixed(3);
    pk.style.transform = `translateY(${((1 - appear) * 70).toFixed(1)}px) scale(${sc.toFixed(4)})`;
    const open = sm((p - 0.05) / 0.1) - sm((p - 0.8) / 0.07),
        ang = 118 * open;
    const fl = pk.querySelector<HTMLElement>(".co-flap.l"),
        fr = pk.querySelector<HTMLElement>(".co-flap.r");
    if (fl) fl.style.transform = `rotateY(${(-ang).toFixed(2)}deg)`;
    if (fr) fr.style.transform = `rotateY(${ang.toFixed(2)}deg)`;
    pk.classList.toggle("is-done", p > 0.88);
    const sr = stick.getBoundingClientRect(),
        f1 = pk.querySelector(".f1");
    let tx0 = W / 2,
        ty0 = H * 0.62;
    if (f1) {
        const r = f1.getBoundingClientRect();
        tx0 = r.left + r.width * 0.62 - sr.left;
        ty0 = r.top - r.height * 0.12 - sr.top;
    }
    let inside = 0;
    sec.querySelectorAll<HTMLElement>(".co-pill").forEach((el, i) => {
        const [, ax, ay, d] = PILLS[i];
        const sx = Math.max(70, Math.min(W - 70, W / 2 + ax * W * 1.08)),
            sy = H * 0.66 + ay * H * 0.78;
        const t = cl((p - 0.14 - d) / 0.42),
            e = eio(t);
        const cx = (sx + tx0) / 2,
            cy = Math.min(sy, ty0) - H * 0.16;
        const x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * tx0,
            y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy + e * e * ty0;
        const s = 1 - 0.7 * e,
            o = 1 - sm((e - 0.82) / 0.18);
        el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%) scale(${s.toFixed(3)})`;
        el.style.opacity = o.toFixed(3);
        if (e > 0.985) inside++;
    });
    const swap = p > 0.84,
        c1 = sec.querySelector(".co-c1"),
        c2 = sec.querySelector(".co-c2");
    if (c1) {
        c1.classList.toggle("off", swap);
        c1.setAttribute("aria-hidden", swap ? "true" : "false");
    }
    if (c2) {
        c2.classList.toggle("off", !swap);
        c2.setAttribute("aria-hidden", swap ? "false" : "true");
    }
    const cnt = sec.querySelector(".co-count");
    if (cnt) {
        const txt = tx(p > 0.88 ? "All ticked" : inside > 0 ? "Ticking them off" : "Boxes to tick");
        if (cnt.textContent !== txt) cnt.textContent = txt;
    }
}

export default function BoxesToTick({ tx }: { tx: Tx }) {
    const secRef = useRef<HTMLElement>(null);
    const [vh, setVh] = useState(() => window.innerHeight);
    const [reduce] = useState(prefersReducedMotion);
    const pinned = !reduce && vh > 0 && vh < PIN_MAX_VH;
    const progress = useRef(0);
    const played = useRef(false);

    // Re-measure only on a real resize, not the mobile URL bar showing/hiding.
    useEffect(() => {
        let w = window.innerWidth,
            h = window.innerHeight;
        const onResize = () => {
            if (Math.abs(window.innerWidth - w) > 2 || Math.abs(window.innerHeight - h) > 160) {
                w = window.innerWidth;
                h = window.innerHeight;
                setVh(window.innerHeight);
            }
        };
        window.addEventListener("resize", onResize, { passive: true });
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const sec = secRef.current;
        if (!sec) return;
        const draw = (p: number) => {
            progress.current = p;
            render(sec, p, tx);
        };
        if (reduce) {
            draw(1);
            return;
        }

        let loop = 0,
            raf = 0,
            anim = 0,
            target = progress.current;
        let io: IntersectionObserver | undefined;

        if (pinned) {
            const tick = () => {
                loop = 0;
                const d = target - progress.current;
                draw(progress.current + (Math.abs(d) < 0.0004 ? d : d * 0.14));
                if (progress.current !== target) loop = requestAnimationFrame(tick);
            };
            const onScroll = () => {
                if (raf) return;
                raf = requestAnimationFrame(() => {
                    raf = 0;
                    const r = sec.getBoundingClientRect();
                    target = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)));
                    if (!loop) loop = requestAnimationFrame(tick);
                });
            };
            draw(progress.current);
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
            return () => {
                window.removeEventListener("scroll", onScroll);
                cancelAnimationFrame(loop);
                cancelAnimationFrame(raf);
            };
        }

        draw(progress.current);
        if (!played.current) {
            if (!("IntersectionObserver" in window)) {
                draw(1);
            } else {
                io = new IntersectionObserver(
                    (en) => {
                        if (!en[0].isIntersecting) return;
                        io?.disconnect();
                        played.current = true;
                        const t0 = performance.now();
                        const run = (now: number) => {
                            const p = Math.min(1, (now - t0) / 4200);
                            draw(p);
                            if (p < 1) anim = requestAnimationFrame(run);
                        };
                        anim = requestAnimationFrame(run);
                    },
                    { threshold: 0.35 }
                );
                io.observe(sec);
            }
        }
        return () => {
            io?.disconnect();
            cancelAnimationFrame(anim);
        };
    }, [pinned, vh, reduce, tx]);

    const [c1a, c1b, c1c] = tx.seg("co1", ["Selling in the US comes with ", "a long list", " of boxes to tick."]);
    const [c2a, c2b] = tx.seg("co2", ["We tick them ", "all."]);

    return (
        <section
            className={pinned ? "co is-pinned" : "co"}
            aria-labelledby="co-1"
            ref={secRef}
            style={pinned ? { height: Math.round(vh * 2.9) } : undefined}
        >
            <div className="co-stick" style={{ height: pinned ? Math.round(vh) : 820 }}>
                <div className="co-cap">
                    <h2 id="co-1" className="co-c1">
                        {c1a}
                        <em>{c1b}</em>
                        {c1c}
                    </h2>
                    <h2 className="co-c2 off" aria-hidden="true">
                        {c2a}
                        <em>{c2b}</em>
                    </h2>
                </div>
                <div className="co-pills" aria-hidden="true">
                    {PILLS.map(([label]) => (
                        <span key={label} className="co-pill">
                            {tx(label)}
                        </span>
                    ))}
                </div>
                <div className="co-pk" aria-hidden="true">
                    <div className="co-rig">
                        <div className="face f1">
                            <i className="tape"></i>
                            <div className="postage">
                                <div>
                                    <b>V</b>
                                    <span>VYBD</span>
                                </div>
                            </div>
                            <div className="label">
                                <small>{tx("To: The US")}</small>
                                <strong>Vybd</strong>
                                <div className="bars"></div>
                            </div>
                            <div className="co-stamp">{tx("HANDLED")}</div>
                        </div>
                        <div className="face f2"></div>
                        <div className="face f3"></div>
                        <div className="face f4"></div>
                        <div className="face f6"></div>
                        <div className="co-lid">
                            <div className="co-in"></div>
                            <div className="co-flap l">
                                <i></i>
                            </div>
                            <div className="co-flap r">
                                <i></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="co-count" aria-hidden="true">
                    {tx("Boxes to tick")}
                </div>
            </div>
            <ul className="cx-sr" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                {PILLS.map(([label]) => (
                    <li key={label}>{tx(label)}</li>
                ))}
            </ul>
        </section>
    );
}
