import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";

/* "Borderless." hero with a 3D parcel that spins on its own, follows the
   mouse a little, and can be dragged around with momentum. */

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

export default function Hero({ tx }: { tx: Tx }) {
    const [mouse, setMouseState] = useState({ mx: 0, my: 0 });
    const mouseRef = useRef(mouse);
    const setMouse = (m: { mx: number; my: number }) => {
        mouseRef.current = m;
        setMouseState(m);
    };
    const rigRef = useRef<HTMLDivElement>(null);
    const p = useRef({ rx: -20, ry: -30, vx: 0, vy: 0.25, tx: 0, ty: 0, dragging: false, lx: 0, ly: 0 });

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
            if (rigRef.current)
                rigRef.current.style.transform = `rotateX(${(s.rx + s.ty).toFixed(2)}deg) rotateY(${(s.ry + s.tx).toFixed(2)}deg)`;
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
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };
    const drag = (e: PointerEvent<HTMLDivElement>) => {
        const s = p.current;
        if (!s.dragging) return;
        const dx = e.clientX - s.lx,
            dy = e.clientY - s.ly;
        s.lx = e.clientX;
        s.ly = e.clientY;
        s.ry += dx * 0.5;
        s.rx = Math.max(-80, Math.min(80, s.rx - dy * 0.5));
        s.vy = dx * 0.5;
        s.vx = -dy * 0.25;
    };
    const drop = () => {
        p.current.dragging = false;
    };

    return (
        <section
            id="top"
            style={{ position: "relative" }}
            onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setMouse({ mx: (e.clientX - r.left) / r.width - 0.5, my: (e.clientY - r.top) / r.height - 0.5 });
            }}
            onMouseLeave={() => setMouse({ mx: 0, my: 0 })}
        >
            <div
                className="wrap"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 22, paddingTop: "var(--sec)", paddingBottom: 32 }}
            >
                <div className="in d1 eyebrow">Vybd</div>
                <h1 className="in d2" style={{ margin: 0, fontSize: "clamp(76px, 14vw, 200px)", lineHeight: 0.92 }}>
                    {tx("Borderless.")}
                </h1>
                <p className="in d3" style={{ margin: 0, maxWidth: 620, fontSize: "clamp(20px, 2.1vw, 28px)", lineHeight: 1.3, color: "#6B7280" }}>
                    {tx("You know your product. We know the American market.")}
                    <br />
                    {tx("Together, that's a launch.")}
                </p>
                <div className="in d4" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 8 }}>
                    <RdLink className="btn btn-dark" href="#contact">
                        {tx("Launch in the US")}
                    </RdLink>
                    <RdLink className="btn btn-text" href="#how">
                        {tx("See how it works")}
                        <Chevron />
                    </RdLink>
                </div>
            </div>
            <div className="in d5">
                <div
                    className="stage"
                    role="img"
                    aria-label={tx("A Vybd parcel you can drag to turn in 3D")}
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
        </section>
    );
}
