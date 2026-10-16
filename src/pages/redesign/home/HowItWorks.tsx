import { useEffect, useRef, useState } from "react";
import type { Tx } from "../i18n";

/* Three steps on a line that fills as the section scrolls into view. */

const STEPS = [
    {
        title: "Tell us what you sell",
        body: "A short call about what you make and what you want. We then look at how it would sell in the US.",
        tag: "A short call",
    },
    {
        title: "We build your plan",
        body: "One clear plan for rules, storage, delivery and marketing, with the costs and timeline up front. Nothing starts until you approve it.",
        tag: "Clear costs",
    },
    {
        title: "You start selling",
        body: "Your product goes on sale in the US. We run it day to day while you focus on making it.",
        tag: "We run it",
    },
];

export default function HowItWorks({ tx }: { tx: Tx }) {
    const listRef = useRef<HTMLOListElement>(null);
    const fillRef = useRef<HTMLLIElement>(null);
    // how many steps are lit; a step lights once the fill reaches i / 2.2
    const [lit, setLit] = useState(0);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const ol = listRef.current;
                if (!ol) return;
                const r = ol.getBoundingClientRect(),
                    p = Math.max(0, Math.min(1, (window.innerHeight * 0.7 - r.top) / (r.height * 0.9)));
                if (fillRef.current) fillRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
                setLit(STEPS.filter((_, i) => p >= i / 2.2).length);
            });
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => {
            window.removeEventListener("scroll", update);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section id="how" className="wrap" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }}>
            <div className="hw2-k rv">{tx("How it works")}</div>
            <h2 className="hw2-h rv">
                {tx("Three steps.")} <em>{tx("No guesswork.")}</em>
            </h2>
            <ol className="hw2-steps" ref={listRef}>
                <li className="hw2-fill" aria-hidden="true" ref={fillRef}></li>
                {STEPS.map((s, i) => (
                    <li key={s.title} className={i < lit ? "hw2-step on" : "hw2-step"}>
                        <span className="dot">{i + 1}</span>
                        <h3>{tx(s.title)}</h3>
                        <p>{tx(s.body)}</p>
                        <small>{tx(s.tag)}</small>
                    </li>
                ))}
            </ol>
        </section>
    );
}
