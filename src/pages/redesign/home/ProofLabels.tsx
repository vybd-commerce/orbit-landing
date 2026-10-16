import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Tx } from "../i18n";

/* "Already in the US.": a stack of shipping labels, one per brand. The top
   label counts up its result and gets a DELIVERED stamp; drag it away or
   use the arrows / dots. Advances on its own every 4.2s. */

type Brand = {
    name: string;
    from: string;
    pre: string;
    target: number;
    comma: boolean;
    suf: string;
    label: string;
    logo: string;
};

const BRANDS: Brand[] = [
    { name: "Bayangrom", from: "India", pre: "$", target: 180, comma: false, suf: "K/yr recovered", label: "Inventory and shipping · India · Art and apparel", logo: "bayangrom" },
    { name: "MIB Industries", from: "India", pre: "$", target: 30000, comma: true, suf: " in B2B pre‑orders", label: "Wholesale · Luxury terry cotton products", logo: "mib" },
    { name: "Ouwr", from: "South Korea", pre: "$", target: 15000, comma: true, suf: " raised for US entry", label: "Funding · K-fashion, womenswear", logo: "ouwr" },
    { name: "Ollobot", from: "China", pre: "", target: 5000, comma: true, suf: " robots delivered", label: "Delivery and support · Companion robots", logo: "ollobot" },
    { name: "Sugat Traders", from: "India", pre: "$", target: 25000, comma: true, suf: " in B2B revenue", label: "B2B revenue · Herbal powders and packaging", logo: "sugat" },
    { name: "Cellre", from: "South Korea", pre: "$", target: 15000, comma: true, suf: " raised for US entry", label: "Funding · K-beauty", logo: "cellre" },
    { name: "Karama", from: "USA", pre: "$", target: 10000, comma: true, suf: " in pre‑orders before launch", label: "Pre-launch · Premium underwear", logo: "karama" },
];

const N = BRANDS.length;
const AUTO_MS = 4200;
const PAUSE_MS = 9000;

function pose(k: number, dx: number) {
    if (k === 0) return { t: `translate(${dx}px,0) rotate(${-1.5 + dx / 30}deg)`, o: 1, z: 10 };
    if (k === 1) return { t: "translate(26px,18px) rotate(3deg) scale(.97)", o: 1, z: 9 };
    if (k === 2) return { t: "translate(-22px,34px) rotate(-5deg) scale(.94)", o: 1, z: 8 };
    if (k === N - 1) return { t: "translate(-135%,-30px) rotate(-16deg)", o: 0, z: 11 };
    return { t: "translate(0,46px) rotate(1deg) scale(.9)", o: 0, z: 1 };
}

export default function ProofLabels({ tx }: { tx: Tx }) {
    const [active, setActive] = useState(0);
    const [count, setCount] = useState(0);
    const [dx, setDx] = useState(0);
    const [seen, setSeen] = useState<Record<number, boolean>>({ 0: true });
    const [dragging, setDragging] = useState(false);
    const drag = useRef<{ x: number; moved: boolean } | null>(null);
    const pauseUntil = useRef(0);
    const activeRef = useRef(active);
    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    const go = useCallback((i: number) => {
        const a = ((i % N) + N) % N;
        setSeen((s) => ({ ...s, [a]: true }));
        setActive(a);
        setCount(0);
        setDx(0);
    }, []);

    // Count the top label's number up, after its stamp lands.
    useEffect(() => {
        const target = BRANDS[active].target,
            t0 = performance.now() + 450;
        let raf = 0;
        const step = (now: number) => {
            const p = Math.max(0, Math.min(1, (now - t0) / 1100));
            setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [active]);

    useEffect(() => {
        const id = window.setInterval(() => {
            if (Date.now() < pauseUntil.current || drag.current) return;
            go(activeRef.current + 1);
        }, AUTO_MS);
        return () => clearInterval(id);
    }, [go]);

    const pick = (i: number) => {
        pauseUntil.current = Date.now() + PAUSE_MS;
        go(i);
    };

    const down = (e: PointerEvent<HTMLDivElement>) => {
        if ((e.target as Element).closest?.(".plb-dot")) return;
        drag.current = { x: e.clientX, moved: false };
        setDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent<HTMLDivElement>) => {
        if (!drag.current) return;
        const d = e.clientX - drag.current.x;
        if (Math.abs(d) > 4) drag.current.moved = true;
        setDx(d);
    };
    const up = () => {
        if (!drag.current) return;
        const moved = drag.current.moved;
        drag.current = null;
        setDragging(false);
        pauseUntil.current = Date.now() + PAUSE_MS;
        if (!moved || dx < -90) go(active + 1);
        else if (dx > 90) go(active - 1);
        else setDx(0);
    };

    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        <section className="pl" aria-labelledby="pl-title" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }}>
            <div className="pl-wrap">
                <div className="pl-copy">
                    <h2 id="pl-title" className="pl-title">
                        {tx("Already in the US.")}
                    </h2>
                    <p className="pl-sub">{tx("Real brands already selling in the US, and what they achieved with us.")}</p>
                    <div className="pl-idx">
                        {pad(active + 1)} / {pad(N)}
                    </div>
                    <div className="pl-name">{BRANDS[active].name}</div>
                    <div className="pl-ctrl">
                        <button type="button" className="pl-btn" aria-label={tx("Previous brand")} onClick={() => pick(active - 1)}>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 6l-6 6 6 6" />
                            </svg>
                        </button>
                        <button type="button" className="pl-btn" aria-label={tx("Next brand")} onClick={() => pick(active + 1)}>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                    <div className="pl-hint">{tx("Drag or tap the top label to see the next brand.")}</div>
                </div>
                <div className="pl-stage" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
                    {BRANDS.map((b, i) => {
                        const k = (i - active + N) % N,
                            p = pose(k, dx),
                            val = k === 0 ? count : b.target;
                        const style: CSSProperties = { transform: p.t, opacity: p.o, zIndex: p.z };
                        if (k === 0 && dragging) style.transition = "none";
                        const headline = b.pre + (b.comma ? val.toLocaleString("en-US") : String(val)) + b.suf;
                        return (
                            <div
                                key={b.name}
                                className={"plb" + (k === 0 ? " is-top" : seen[i] ? " is-done" : "")}
                                style={style}
                                aria-hidden={k !== 0}
                            >
                                <div className="plb-top">
                                    <span>{tx("VYBD POST")}</span>
                                    <span className="plb-prio">{tx("PRIORITY")}</span>
                                </div>
                                <hr />
                                <img src={`/images/proof-logos/${b.logo}.webp`} alt={b.name} draggable={false} />
                                <div className="plb-rt">
                                    <div>
                                        <small>{tx("FROM")}</small>
                                        <b>{tx(b.from)}</b>
                                    </div>
                                    <div>
                                        <small>{tx("TO")}</small>
                                        <b>{tx("United States")}</b>
                                    </div>
                                </div>
                                <div className="plb-res">
                                    <small>{tx(b.label)}</small>
                                    <p>{tx(headline)}</p>
                                </div>
                                <div className="plb-foot">
                                    <div className="plb-bars"></div>
                                    <div className="plb-trk">VYBD-{String(i + 1).padStart(3, "0")}-US</div>
                                </div>
                                <div className="plb-stamp">
                                    <div>
                                        {tx("DELIVERED")}
                                        <small>{tx("US · VYBD")}</small>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="plb-dots">
                        {BRANDS.map((b, i) => (
                            <button
                                key={b.name}
                                type="button"
                                className={i === active ? "plb-dot on" : "plb-dot"}
                                aria-label={tx("Show") + " " + b.name}
                                onClick={() => pick(i)}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
