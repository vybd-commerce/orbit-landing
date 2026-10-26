import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";

/* Four audience cards. One is "on" (navy, art animating, stamp thumps
   down); it cycles every 3.6s while the section is on screen. Hover, focus
   or tap picks a card and pauses the cycle until the pointer leaves. */

const CYCLE_MS = 3600;

const Stamp = ({ tx, word }: { tx: Tx; word: string }) => (
    <div className="wh-stamp" aria-hidden="true">
        <div>
            {tx("US")}
            <small>{tx(word)}</small>
        </div>
    </div>
);

const Factory = () => (
    <>
        <div className="wa-chim"></div>
        <span className="wa-puff"></span>
        <span className="wa-puff p2"></span>
        <div className="wa-fac"></div>
        <div className="wa-belt"></div>
        <span className="wa-box"></span>
        <span className="wa-box b2"></span>
        <span className="wa-box b3"></span>
    </>
);

const Growth = () => (
    <>
        <div className="wa-bars">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
        </div>
        <span className="wa-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M9 7h8v8" />
            </svg>
        </span>
    </>
);

const Route = ({ tx }: { tx: Tx }) => (
    <>
        <svg className="wa-route" viewBox="0 0 290 190" preserveAspectRatio="none">
            <path d="M 52 140 C 90 30, 200 30, 238 140"></path>
        </svg>
        <span className="wa-pin from">{tx("NOW")}</span>
        <span className="wa-pin to">{tx("NEXT")}</span>
        <span className="wa-parcel"></span>
    </>
);

const Store = ({ tx }: { tx: Tx }) => (
    <>
        <div className="wa-win">
            <div className="wa-bar">
                <i></i>
                <i></i>
                <i></i>
            </div>
            <div className="wa-tiles">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </div>
        </div>
        <div className="wa-toast">
            <b>✓</b>
            {tx("New US order")}
        </div>
    </>
);

const CARDS: { title: string; body: string; stamp: string; art: (tx: Tx) => ReactNode }[] = [
    { title: "Manufacturers", body: "Based outside the US? Open a US sales channel without opening a US office.", stamp: "CLEARED", art: () => <Factory /> },
    { title: "Growing brands", body: "Doing well in your home market and ready for US customers.", stamp: "CLEARED", art: () => <Growth /> },
    { title: "US brands", body: "Already selling in the US and ready to grow faster, with less to manage.", stamp: "SCALED", art: (tx) => <Route tx={tx} /> },
    { title: "Online sellers", body: "Selling online, from anywhere, and want US stock, faster delivery and more buyers.", stamp: "CLEARED", art: (tx) => <Store tx={tx} /> },
];

function tilt(e: MouseEvent<HTMLElement>) {
    const el = e.currentTarget,
        r = el.getBoundingClientRect();
    el.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + "deg");
    el.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(2) + "deg");
}

export default function WhoWeHelp({ tx }: { tx: Tx }) {
    const secRef = useRef<HTMLElement>(null);
    const [on, setOn] = useState(0);
    const [paused, setPaused] = useState(false);
    // without IntersectionObserver, just keep cycling
    const [visible, setVisible] = useState(() => !("IntersectionObserver" in window));

    useEffect(() => {
        const el = secRef.current;
        if (!el || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver((en) => setVisible(en[0].isIntersecting), { threshold: 0.3 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!visible || paused) return;
        const t = window.setTimeout(() => setOn((o) => (o + 1) % CARDS.length), CYCLE_MS);
        return () => clearTimeout(t);
    }, [visible, paused, on]);

    const pick = (i: number) => {
        setOn(i);
        setPaused(true);
    };
    const leave = (e: MouseEvent<HTMLElement>) => {
        e.currentTarget.style.setProperty("--ry", "0deg");
        e.currentTarget.style.setProperty("--rx", "0deg");
        setPaused(false);
    };

    return (
        <section id="who" className="wrap wh bleed" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }} ref={secRef}>
            <div className="rv" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, marginBottom: 48 }}>
                <span className="eyebrow">{tx("Who we help")}</span>
                <h2 className="h2 wh-h2">
                    {tx("Built for brands coming to the US,")} <em>{tx("and those already here.")}</em>
                </h2>
                <p className="wh-sub">{tx("Launching in the US for the first time or already selling here, we take care of the work that slows growth down.")}</p>
            </div>
            <div className="wh-grid">
                {CARDS.map((c, i) => (
                    <div key={c.title} className="rv wh-cell">
                        <article
                            className={on === i ? "wh-card is-on" : "wh-card"}
                            tabIndex={0}
                            onMouseEnter={() => pick(i)}
                            onFocus={() => pick(i)}
                            onClick={() => pick(i)}
                            onMouseMove={tilt}
                            onMouseLeave={leave}
                        >
                            <div className="wh-art" aria-hidden="true">
                                <span className="wh-idx">{String(i + 1).padStart(2, "0")}</span>
                                {c.art(tx)}
                                <Stamp tx={tx} word={c.stamp} />
                            </div>
                            <div className="wh-body">
                                <h3>{tx(c.title)}</h3>
                                <p>{tx(c.body)}</p>
                                <RdLink className="wh-cta" href="#contact">
                                    {tx("That's me")}{" "}
                                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </RdLink>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
            <div className={paused ? "wh-prog is-paused" : "wh-prog"} role="group" aria-label={tx("Who we help")}>
                {CARDS.map((c, i) => (
                    <button
                        key={c.title}
                        type="button"
                        className={on === i ? "on" : i < on ? "done" : ""}
                        aria-label={tx("Show " + c.title)}
                        onClick={() => pick(i)}
                    >
                        <i></i>
                    </button>
                ))}
            </div>
        </section>
    );
}
