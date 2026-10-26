import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalePath } from "../../../i18n/context";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { prefersReducedMotion } from "../motion";

/* Centred "Borderless." hero with a typing line under it ("The US is ready
   for your <word>", the word typed and retyped through a list of products),
   above a 3D parcel that spins on its own, follows the mouse a little, and
   can be dragged around with momentum.
   Behind it, a drifting dot grid with a mint spotlight that follows the
   pointer, or wanders when the pointer is still. */

const HERO_WORDS: Record<Tx["locale"], string[]> = {
    en: ["snacks.", "skincare.", "spices.", "towels.", "supplements.", "coffee.", "fashion.", "art."],
    fr: ["snacks.", "soins de beauté.", "épices.", "serviettes.", "compléments.", "cafés.", "vêtements.", "œuvres."],
    es: ["snacks.", "cosmética.", "especias.", "toallas.", "suplementos.", "café.", "moda.", "arte."],
    zh: ["零食。", "护肤品。", "香料。", "毛巾。", "保健品。", "咖啡。", "服装。", "艺术品。"],
    ja: ["スナックを。", "スキンケアを。", "スパイスを。", "タオルを。", "サプリを。", "コーヒーを。", "ファッションを。", "アートを。"],
    ko: ["스낵을.", "스킨케어를.", "향신료를.", "수건을.", "보충제를.", "커피를.", "패션을.", "작품을."],
};

/* Holds each word, deletes it, types the next. Writes the text node
   directly so the hero doesn't re-render per keystroke. */
export function HeroWord({ locale }: { locale: Tx["locale"] }) {
    const words = HERO_WORDS[locale];
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion()) return;
        let i = 0,
            cur = words[0],
            t = 0;
        const put = (text: string, typing: boolean) => {
            cur = text;
            el.textContent = text;
            el.classList.toggle("typing", typing);
        };
        const del = () => {
            if (cur.length > 0) {
                put(cur.slice(0, -1), true);
                t = window.setTimeout(del, 42);
                return;
            }
            i = (i + 1) % words.length;
            t = window.setTimeout(type, 260);
        };
        const type = () => {
            const next = words[i];
            if (cur.length < next.length) {
                put(next.slice(0, cur.length + 1), true);
                t = window.setTimeout(type, 70 + Math.random() * 50);
                return;
            }
            put(next, false);
            t = window.setTimeout(del, 1900);
        };
        t = window.setTimeout(del, 2600);
        return () => {
            clearTimeout(t);
            el.textContent = words[0];
            el.classList.remove("typing");
        };
    }, [words]);

    return (
        <span className="hx-w" ref={ref}>
            {words[0]}
        </span>
    );
}

function useSpotlight() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const bg = ref.current;
        if (!bg) return;
        const set = (x: number, y: number) => {
            bg.style.setProperty("--hxmx", x + "px");
            bg.style.setProperty("--hxmy", y + "px");
        };
        let last = 0;
        const move = (e: globalThis.PointerEvent) => {
            const r = bg.getBoundingClientRect();
            if (e.clientY < r.top || e.clientY > r.bottom) return;
            last = performance.now();
            set(e.clientX - r.left, e.clientY - r.top);
        };
        window.addEventListener("pointermove", move, { passive: true });
        if (prefersReducedMotion()) return () => window.removeEventListener("pointermove", move);
        let raf = 0,
            idle = 0;
        const loop = (t: number) => {
            const r = bg.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) {
                // off screen: check back now and then instead of every frame
                idle = window.setTimeout(() => (raf = requestAnimationFrame(loop)), 400);
                return;
            }
            if (performance.now() - last > 1500) {
                const a = (t / 1000) * 0.35;
                set(r.width * (0.66 + 0.24 * Math.sin(a)), r.height * (0.52 + 0.28 * Math.sin(a * 1.7 + 1)));
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            window.removeEventListener("pointermove", move);
            cancelAnimationFrame(raf);
            clearTimeout(idle);
        };
    }, []);
    return ref;
}

const Chevron = () => (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 6l6 6-6 6" />
    </svg>
);

const UpArrows = () => (
    <div className="up">
        {[0, 1].map((i) => (
            <svg key={i} aria-hidden="true" width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M11 24V3M4 10l7-7 7 7" />
            </svg>
        ))}
    </div>
);

const Postage = () => (
    <div className="postage">
        <div>
            <b>V</b>
            <span>VYBD</span>
        </div>
    </div>
);

type HeroLink = { label: string; href: string };

/* Defaults are the US hero. The /vybd page swaps the line under
   "Borderless.", drops the sub line and the buttons (null), and makes
   the parcel a link (`boxHref`): a tap or Enter follows it, a drag still
   just turns the parcel. */
export default function Hero({
    tx,
    line,
    sub = "One team for everything it takes to sell in the US.",
    primary = { label: "Launch in the US", href: "#contact" },
    secondary = { label: "See how it works", href: "#how" },
    boxHref,
}: {
    tx: Tx;
    line?: ReactNode;
    sub?: string | null;
    primary?: HeroLink | null;
    secondary?: HeroLink | null;
    boxHref?: string;
}) {
    const navigate = useNavigate();
    const lp = useLocalePath();
    const follow = () => {
        if (boxHref) navigate(lp(boxHref));
    };
    const [mouse, setMouseState] = useState({ mx: 0, my: 0 });
    const mouseRef = useRef(mouse);
    const setMouse = (m: { mx: number; my: number }) => {
        mouseRef.current = m;
        setMouseState(m);
    };
    const rigRef = useRef<HTMLDivElement>(null);
    const bgRef = useSpotlight();
    const p = useRef({
        rx: -20,
        ry: -30,
        vx: 0,
        vy: 0.25,
        tx: 0,
        ty: 0,
        dragging: false,
        lx: 0,
        ly: 0,
        moved: 0,
    });

    useEffect(() => {
        let raf = 0;
        const tick = () => {
            const s = p.current;
            if (!s.dragging) {
                s.ry += s.vy;
                s.rx += s.vx;
                s.vy += (0.25 - s.vy) * 0.03;
                s.vx *= 0.94;
                s.rx += (-20 - s.rx) * 0.03;
            }
            s.tx += (mouseRef.current.mx * 24 - s.tx) * 0.08;
            s.ty += (mouseRef.current.my * -18 - s.ty) * 0.08;
            if (rigRef.current) rigRef.current.style.transform = `rotateX(${(s.rx + s.ty).toFixed(2)}deg) rotateY(${(s.ry + s.tx).toFixed(2)}deg)`;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const chip = (k: number) => `translate3d(${(mouse.mx * k).toFixed(1)}px,${(mouse.my * k).toFixed(1)}px,0)`;

    const grab = (e: PointerEvent<HTMLDivElement>) => {
        const s = p.current;
        s.dragging = true;
        s.lx = e.clientX;
        s.ly = e.clientY;
        s.vx = 0;
        s.vy = 0;
        s.moved = 0;
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };
    const drag = (e: PointerEvent<HTMLDivElement>) => {
        const s = p.current;
        if (!s.dragging) return;
        const dx = e.clientX - s.lx,
            dy = e.clientY - s.ly;
        s.moved += Math.abs(dx) + Math.abs(dy);
        s.lx = e.clientX;
        s.ly = e.clientY;
        s.ry += dx * 0.5;
        s.rx = Math.max(-80, Math.min(80, s.rx - dy * 0.5));
        s.vy = dx * 0.5;
        s.vx = -dy * 0.25;
    };
    const drop = (e: PointerEvent<HTMLDivElement>) => {
        const s = p.current;
        // a tap, not a drag: follow the parcel's link
        if (s.dragging && e.type === "pointerup" && s.moved < 6) follow();
        s.dragging = false;
    };

    return (
        <section
            id="top"
            style={{ position: "relative" }}
            onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setMouse({
                    mx: (e.clientX - r.left) / r.width - 0.5,
                    my: (e.clientY - r.top) / r.height - 0.5,
                });
            }}
            onMouseLeave={() => setMouse({ mx: 0, my: 0 })}
        >
            <div className="hx-bg" aria-hidden="true" ref={bgRef}>
                <span className="hx-glow"></span>
            </div>
            <div className="hx-grid">
                <div className="hx-copy">
                    <div className="in d1 eyebrow">Vybd</div>
                    <h1 className="in d2 hx-h">{tx("Borderless.")}</h1>
                    <div className="in d3 hx-tw">
                        {line ?? (
                            <>
                                {tx("The US is ready for your")} <HeroWord key={tx.locale} locale={tx.locale} />
                            </>
                        )}
                    </div>
                    {sub && <p className="in d3 hx-p">{tx(sub)}</p>}
                    {(primary || secondary) && (
                        <div className="in d4 hx-cta">
                            {primary && (
                                <RdLink className="btn btn-dark" href={primary.href}>
                                    {tx(primary.label)}
                                </RdLink>
                            )}
                            {secondary && (
                                <RdLink className="btn btn-text" href={secondary.href}>
                                    {tx(secondary.label)}
                                    <Chevron />
                                </RdLink>
                            )}
                        </div>
                    )}
                </div>
                <div className="in d5 hx-art">
                    <div
                        className="stage"
                        role={boxHref ? "link" : "img"}
                        tabIndex={boxHref ? 0 : undefined}
                        aria-label={tx(boxHref ? "Open the US page" : "A Vybd parcel you can drag to turn in 3D")}
                        onKeyDown={boxHref ? (e: KeyboardEvent) => e.key === "Enter" && follow() : undefined}
                        onPointerDown={grab}
                        onPointerMove={drag}
                        onPointerUp={drop}
                        onPointerCancel={drop}
                    >
                        <div className="float">
                            <div className="rig" ref={rigRef}>
                                <div className="face f1">
                                    <i className="tape"></i>
                                    <Postage />
                                    <svg
                                        className="ink"
                                        aria-hidden="true"
                                        style={{ right: 54, top: 62, transform: "rotate(-14deg)" }}
                                        width="70"
                                        height="70"
                                        viewBox="0 0 70 70"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <defs>
                                            <path id="stampArcA" d="M35 35m-24 0a24 24 0 1 1 48 0a24 24 0 1 1 -48 0" />
                                        </defs>
                                        <circle cx="35" cy="35" r="32" strokeWidth="2" />
                                        <circle cx="35" cy="35" r="17" strokeWidth="1.4" />
                                        <text fill="currentColor" stroke="none" fontSize="7.4" fontWeight="700" letterSpacing="1.6">
                                            <textPath href="#stampArcA">{tx("CUSTOMS CLEARED · CUSTOMS CLEARED ·")}</textPath>
                                        </text>
                                        <path d="M28 35.5l4.5 4.5 9-9" strokeWidth="2.4" />
                                    </svg>
                                    <div className="label">
                                        <small>{tx("To: Everywhere")}</small>
                                        <strong>Vybd</strong>
                                        <div className="bars"></div>
                                    </div>
                                    <UpArrows />
                                </div>
                                <div className="face f2">
                                    <i className="tape"></i>
                                    <div className="label">
                                        <small>{tx("From: Anywhere")}</small>
                                        <strong>Vybd</strong>
                                        <div className="bars"></div>
                                    </div>
                                    <div className="rubber" style={{ right: 22, top: 70, transform: "rotate(9deg)" }}>
                                        {tx("PRIORITY")}
                                    </div>
                                    <Postage />
                                </div>
                                <div className="face f3">
                                    {tx("Made anywhere")}
                                    <div className="rubber" style={{ left: 22, top: 26, transform: "rotate(-7deg)" }}>
                                        {tx("INSPECTED")}
                                    </div>
                                </div>
                                <div className="face f4">
                                    {tx("Sold everywhere")}
                                    <svg
                                        className="ink"
                                        aria-hidden="true"
                                        style={{ right: 22, top: 22, transform: "rotate(12deg)" }}
                                        width="64"
                                        height="64"
                                        viewBox="0 0 70 70"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <defs>
                                            <path id="stampArcB" d="M35 35m-24 0a24 24 0 1 1 48 0a24 24 0 1 1 -48 0" />
                                        </defs>
                                        <circle cx="35" cy="35" r="32" strokeWidth="2" />
                                        <circle cx="35" cy="35" r="17" strokeWidth="1.4" />
                                        <text fill="currentColor" stroke="none" fontSize="7.4" fontWeight="700" letterSpacing="1.6">
                                            <textPath href="#stampArcB">{tx("VYBD POST · HANDLED WITH CARE ·")}</textPath>
                                        </text>
                                        <text x="35" y="39" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" fontWeight="700">
                                            V
                                        </text>
                                    </svg>
                                </div>
                                <div className="face f5">
                                    <i className="tape"></i>
                                </div>
                                <div className="face f6"></div>
                            </div>
                        </div>
                        <div className="chip" style={{ left: "2%", top: "20%", transform: chip(-50) }}>
                            <u></u>
                            {tx("Made Anywhere")}
                        </div>
                        <div className="chip" style={{ right: "3%", bottom: "16%", transform: chip(-64) }}>
                            <u></u>
                            {tx("Sold In USA")}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
