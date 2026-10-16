import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { useTx, type Tx } from "./i18n";
import CommerceStack from "./product/CommerceStack";
import "./ProductPage.css";

/* "How it works", ported from redesign/pages/Product.dc.html. */

const LAYERS = [
    { tag: "Layer 1", name: "Intelligence", text: "AI agents watch market data, rule changes and competitors around the clock.", tags: ["Real-time", "AI-powered"] },
    {
        tag: "Layer 2",
        name: "Orchestration",
        text: "One central layer keeps stock, shipping, compliance and orders in sync across the whole operation.",
        tags: ["Always in sync", "No gaps"],
    },
    {
        tag: "Layer 3",
        name: "Execution",
        text: "Warehousing, delivery, online stores and marketing all work from the same up-to-date information.",
        tags: ["Fully connected", "One shared picture"],
    },
];
const PLATE_Y = [-120, 0, 120];

const CHAINS = [
    {
        label: "A rule changes",
        steps: [
            ["Intelligence", "A US compliance rule changes"],
            ["Orchestration", "The change is shared with every module"],
            ["Execution", "Listings and shipments update automatically"],
            ["You", "Nothing to chase. You just see it done"],
        ],
    },
    {
        label: "Stock runs low",
        steps: [
            ["Execution", "Stock drops below the safe level"],
            ["Orchestration", "The control tower flags it"],
            ["Execution", "Logistics is told to restock"],
            ["You", "It happens before you notice"],
        ],
    },
];

const LANES = [
    { name: "Autonomous", text: "Routine tasks run automatically.", items: ["Routine workflows", "Low-risk decisions", "High confidence"] },
    { name: "Supervised", text: "Complex situations are checked by our specialists.", items: ["Complex exceptions", "Medium risk", "Learning phase"] },
    { name: "Your approval", text: "Critical actions wait for your decision.", items: ["Critical decisions", "High financial impact", "Service-level overrides"] },
];
const LANE_X = ["16.66%", "50%", "83.33%"];
const TASKS: [string, number][] = [
    ["Restock a best-seller", 0],
    ["Unusual customs hold", 1],
    ["Cut prices by 20%", 2],
    ["Answer a delivery question", 0],
    ["New product category", 1],
    ["Switch to a new warehouse", 2],
];

const FEED = [
    ["Labels approved for Product D", "2m ago"],
    ["Shipment cleared customs", "18m ago"],
    ["Product C restock ordered", "1h ago"],
    ["Ad budget moved to best campaign", "3h ago"],
];

const TICK_MS = 2600;

/* Whether el is on screen (threshold as IntersectionObserver's). */
function useVisible(ref: RefObject<Element | null>, threshold: number) {
    const [visible, setVisible] = useState(() => !("IntersectionObserver" in window));
    useEffect(() => {
        const el = ref.current;
        if (!el || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver((en) => setVisible(en[0].isIntersecting), { threshold });
        io.observe(el);
        return () => io.disconnect();
    }, [ref, threshold]);
    return visible;
}

const Arrow = ({ d = "M5 12h14M13 6l6 6-6 6" }: { d?: string }) => (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

function Hero({ tx, layer }: { tx: Tx; layer: number }) {
    const stackRef = useRef<HTMLDivElement>(null);
    const words = tx.seg("hwh1", ["One", " ", "system.", " ", "Every", " ", "part", " ", "in", " ", "sync."]);
    const delays = ["0s", ".06s", ".14s", ".2s", ".26s", ".32s"];
    return (
        <section
            id="top"
            className="hw-hero"
            aria-labelledby="hw-h1"
            onMouseMove={(e) => {
                const s = stackRef.current;
                if (!s) return;
                const dx = e.clientX / window.innerWidth - 0.5,
                    dy = e.clientY / window.innerHeight - 0.5;
                s.style.setProperty("--ry", (dx * 12).toFixed(2) + "deg");
                s.style.setProperty("--rx", (-dy * 8).toFixed(2) + "deg");
            }}
            onMouseLeave={() => {
                stackRef.current?.style.setProperty("--ry", "0deg");
                stackRef.current?.style.setProperty("--rx", "0deg");
            }}
        >
            <div className="wrap hw-hero-grid">
                <div>
                    <span className="hw-eyebrow mono">
                        <i className="hw-dot"></i>
                        {tx("How Vybd works")}
                    </span>
                    <h1 id="hw-h1" className="hw-h1">
                        {[0, 1, 2, 3, 4, 5].map((w) => {
                            const word = words[w * 2];
                            return (
                                <Fragment key={w}>
                                    {w > 0 && words[w * 2 - 1]}
                                    <span className="w">
                                        <span style={w > 0 ? { animationDelay: delays[w] } : undefined}>{w >= 2 ? <em>{word}</em> : word}</span>
                                    </span>
                                </Fragment>
                            );
                        })}
                    </h1>
                    <p className="hw-lead">
                        {tx(
                            "We run your US business as one connected system. Each part does its own job, and a central layer keeps them all in step, so nothing gets lost between suppliers."
                        )}
                    </p>
                    <div className="hw-cta">
                        <RdLink className="btn btn-dark" href="#layers">
                            {tx("See the three layers")} <Arrow d="M12 5v14M6 13l6 6 6-6" />
                        </RdLink>
                    </div>
                </div>
                <div className="hw-stack" ref={stackRef} aria-hidden="true">
                    {LAYERS.map((l, i) => (
                        <div
                            key={l.tag}
                            className={"hw-plate" + (i === 1 ? " mid" : "") + (layer === i ? " is-on" : "")}
                            style={{ ["--y" as string]: `${PLATE_Y[i]}px`, zIndex: 3 - i }}
                        ></div>
                    ))}
                    <span className="hw-beam"></span>
                    <span className="hw-pulse"></span>
                    <span className="hw-pulse up"></span>
                    {LAYERS.map((l, i) => (
                        <div key={l.tag} className={"hw-pl-lbl" + (layer === i ? " is-on" : "")} style={{ top: `calc(50% + ${PLATE_Y[i]}px)` }}>
                            <small className="mono">{tx(l.tag)}</small>
                            <b>{tx(l.name)}</b>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* "Watch what happens when…": the steps of one example light up in turn,
   then the next example plays. Picking a tab keeps to that example. */
function Chain({ tx }: { tx: Tx }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useVisible(ref, 0.4);
    const [ex, setEx] = useState(0);
    const [step, setStep] = useState(-1);
    const [pinned, setPinned] = useState(false);
    const [startDelay, setStartDelay] = useState(0);

    useEffect(() => {
        if (!visible) return;
        if (step < 3) {
            const t = window.setTimeout(() => setStep((s) => s + 1), step === -1 ? startDelay : 1100);
            return () => clearTimeout(t);
        }
        const t = window.setTimeout(() => {
            if (!pinned) setEx((e) => (e + 1) % CHAINS.length);
            setStartDelay(400);
            setStep(-1);
        }, 2400);
        return () => clearTimeout(t);
    }, [visible, step, pinned, startDelay]);

    const ch = CHAINS[ex];
    return (
        <div className="hw-chain rv" ref={ref}>
            <div className="hw-chain-top">
                <p>{tx("Nothing runs on its own. Watch what happens when…")}</p>
                <div className="hw-chain-tabs" role="group" aria-label={tx("Choose an example")}>
                    {CHAINS.map((c, i) => (
                        <button
                            key={c.label}
                            type="button"
                            aria-pressed={i === ex}
                            onClick={() => {
                                setPinned(true);
                                setStartDelay(200);
                                setEx(i);
                                setStep(-1);
                            }}
                        >
                            {tx(c.label)}
                        </button>
                    ))}
                </div>
            </div>
            <ol className="hw-steps" aria-live="polite">
                {ch.steps.map(([who, text], i) => (
                    <li key={`${ex}-${i}`} className={"hw-step" + (i < step ? " is-done" : i === step ? " is-on" : "")}>
                        <small className="mono">{tx(who)}</small>
                        <b>{tx(text)}</b>
                    </li>
                ))}
            </ol>
        </div>
    );
}

/* Example tasks drop into the lane that would handle them. */
function Sorter({ tx }: { tx: Tx }) {
    const ref = useRef<HTMLElement>(null);
    const visible = useVisible(ref, 0.3);
    // phase: 0 waiting in the middle, 1 dropping into its lane, 2 landed
    const [s, setS] = useState({ k: 0, phase: 0, n: [0, 0, 0], first: true });

    useEffect(() => {
        if (!visible) return;
        const wait = s.phase === 0 ? (s.first ? 0 : 700) : s.phase === 1 ? 1300 : 1100;
        const t = window.setTimeout(
            () =>
                setS((p) => {
                    if (p.phase === 0) return { ...p, phase: 1, first: false };
                    if (p.phase === 1) {
                        const n = p.n.slice();
                        n[TASKS[p.k][1]]++;
                        return { ...p, phase: 2, n };
                    }
                    return { ...p, phase: 0, k: (p.k + 1) % TASKS.length };
                }),
            wait
        );
        return () => clearTimeout(t);
    }, [visible, s.phase, s.first]);

    const [task, lane] = TASKS[s.k];
    const drop = s.phase >= 1,
        hit = s.phase === 2 ? lane : -1;

    return (
        <section className="hw-sec" aria-labelledby="hw-h2c" ref={ref}>
            <div className="wrap">
                <div className="hw-head rv">
                    <div>
                        <div className="hw-kicker mono">
                            <b>03</b> {tx("/ Who decides")}
                        </div>
                        <h2 id="hw-h2c" className="hw-h2">
                            {tx("Autonomous. Supervised.")} <em>{tx("Accountable.")}</em>
                        </h2>
                    </div>
                    <p className="hw-p">{tx("Vybd automates what's safe, has a specialist review what's complex, and leaves the big decisions to you.")}</p>
                </div>
                <div className="ag-sorter" aria-hidden="true">
                    <span className={drop ? "ag-chip is-drop" : "ag-chip"} style={{ left: drop ? LANE_X[lane] : "50%" }}>
                        <i></i>
                        {tx(task)}
                    </span>
                </div>
                <div className="ag-lanes">
                    {LANES.map((l, i) => (
                        <article key={l.name} className={"ag-lane rv" + (hit === i ? " is-hit" : "")}>
                            <div className="ag-meter" aria-hidden="true">
                                <i className="on"></i>
                                <i className={i >= 1 ? "on" : ""}></i>
                                <i className={i >= 2 ? "on" : ""}></i>
                            </div>
                            <h3>{tx(l.name)}</h3>
                            <p>{tx(l.text)}</p>
                            <ul>
                                {l.items.map((it) => (
                                    <li key={it}>{tx(it)}</li>
                                ))}
                            </ul>
                            <div className="ag-count">
                                {tx("Example tasks sorted here:")} <b>{s.n[i]}</b>
                            </div>
                        </article>
                    ))}
                </div>
                <p className="ag-note">{tx("The moving tasks are examples to show how sorting works.")}</p>
            </div>
        </section>
    );
}

function Dashboard({ tx, tick }: { tx: Tx; tick: number }) {
    const skus: [string, string, boolean][] = [
        ["Product A", "86%", false],
        ["Product B", "72%", false],
        ["Product C", "18%", true],
        ["Product D", "64%", false],
    ];
    return (
        <section className="hw-sec" aria-labelledby="hw-h2d" style={{ paddingTop: 0 }}>
            <div className="wrap">
                <div className="hw-head rv">
                    <div>
                        <div className="hw-kicker mono">
                            <b>04</b> {tx("/ Dashboard")}
                        </div>
                        <h2 id="hw-h2d" className="hw-h2">
                            {tx("One view across")} <em>{tx("everything.")}</em>
                        </h2>
                    </div>
                    <p className="hw-p">{tx("Stock, compliance, orders and shipping all in one place. You see what's happening. We do the work.")}</p>
                </div>
                <div className="db rv" aria-label={tx("Example of the Vybd dashboard, with sample data")}>
                    <div className="db-side">
                        <b>Vybd</b>
                        {["Overview", "Inventory", "Compliance", "Orders", "Logistics", "Marketing"].map((s, i) => (
                            <span key={s} className={i === 0 ? "on" : undefined}>
                                <i></i>
                                {tx(s)}
                            </span>
                        ))}
                    </div>
                    <div className="db-main">
                        <div className="db-top">
                            <h3>{tx("US operation overview")}</h3>
                            <span className="db-tag">
                                <i className="hw-dot"></i>
                                {tx("Sample data")}
                            </span>
                        </div>
                        <div className="db-kpis">
                            <div className="db-kpi">
                                <small>{tx("Orders this week")}</small>
                                <b>{1240 + (tick % 7) * 3}</b>
                                <em>▲ 12%</em>
                            </div>
                            <div className="db-kpi">
                                <small>{tx("Stock health")}</small>
                                <b>94%</b>
                                <em>{tx("2 SKUs low")}</em>
                            </div>
                            <div className="db-kpi">
                                <small>{tx("Compliance")}</small>
                                <b>{tx("All clear")}</b>
                                <em>{tx("0 open issues")}</em>
                            </div>
                            <div className="db-kpi">
                                <small>{tx("In transit")}</small>
                                <b>3</b>
                                <em>{tx("On schedule")}</em>
                            </div>
                        </div>
                        <div className="db-row">
                            <div className="db-card">
                                <h4>{tx("Weekly sales")}</h4>
                                <svg className="db-chart" viewBox="0 0 400 150" preserveAspectRatio="none" aria-hidden="true">
                                    <g className="db-grid">
                                        <line x1="0" y1="37" x2="400" y2="37"></line>
                                        <line x1="0" y1="75" x2="400" y2="75"></line>
                                        <line x1="0" y1="112" x2="400" y2="112"></line>
                                    </g>
                                    <path className="db-area" d="M0 130 L50 118 L100 122 L150 96 L200 100 L250 70 L300 76 L350 44 L400 30 L400 150 L0 150 Z"></path>
                                    <path className="db-line" d="M0 130 L50 118 L100 122 L150 96 L200 100 L250 70 L300 76 L350 44 L400 30"></path>
                                </svg>
                            </div>
                            <div className="db-card">
                                <h4>{tx("Stock by product")}</h4>
                                <div className="db-sku">
                                    {skus.map(([name, w, low]) => (
                                        <div key={name}>
                                            <span>{tx(name)}</span>
                                            <span className="db-bar">
                                                <i className={low ? "low" : undefined} style={{ ["--w" as string]: w }}></i>
                                            </span>
                                            <em>{w}</em>
                                        </div>
                                    ))}
                                </div>
                                <div className="db-feed">
                                    {[0, 1].map((j) => {
                                        const [text, when] = FEED[(tick + j) % FEED.length];
                                        return (
                                            <div key={j}>
                                                <i></i>
                                                {tx(text)}
                                                <span>{tx(when)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function ProductPage() {
    const tx = useTx();
    const [tick, setTick] = useState(0);
    const [layer, setLayer] = useState(1);
    const layerPinned = useRef(false);

    // One clock for the page: status line, dashboard numbers and, until a
    // layer is picked, the highlighted layer.
    useEffect(() => {
        const id = window.setInterval(() => {
            setTick((t) => t + 1);
            if (!layerPinned.current) setLayer((l) => (l + 1) % 3);
        }, TICK_MS);
        return () => clearInterval(id);
    }, []);

    const pickLayer = (i: number) => {
        layerPinned.current = true;
        setLayer(i);
    };

    return (
        <RdPage name="product">
            <RdHeader
                logoHref="/"
                links={[
                    { label: "How it works", href: "#top", current: true },
                    { label: "Case studies", href: "/case-studies" },
                    { label: "Lab", href: "/lab" },
                ]}
                mobileLinks={[
                    { label: "Home", href: "/" },
                    { label: "Case studies", href: "/case-studies" },
                    { label: "Lab", href: "/lab" },
                ]}
            />

            <Hero tx={tx} layer={layer} />

            <section id="layers" className="hw-sec" aria-labelledby="hw-h2a">
                <div className="wrap">
                    <div className="hw-head rv">
                        <div>
                            <div className="hw-kicker mono">
                                <b>01</b> {tx("/ Architecture")}
                            </div>
                            <h2 id="hw-h2a" className="hw-h2">
                                {tx("Three layers.")}
                                <br />
                                <em>{tx("One outcome.")}</em>
                            </h2>
                        </div>
                        <p className="hw-p">{tx("Every Vybd launch runs on the same three layers. One watches, one coordinates and one does the work.")}</p>
                    </div>
                    <div className="hw-layers">
                        {LAYERS.map((l, i) => (
                            <article
                                key={l.tag}
                                className={"hw-layer rv" + (i === 1 ? " mid" : "") + (layer === i ? " is-on" : "")}
                                tabIndex={0}
                                onMouseEnter={() => pickLayer(i)}
                                onFocus={() => pickLayer(i)}
                                onClick={() => pickLayer(i)}
                            >
                                <span className="mono">{tx(l.tag)}</span>
                                <h3>{tx(l.name)}</h3>
                                <p>{tx(l.text)}</p>
                                <div className="hw-tags">
                                    {l.tags.map((t) => (
                                        <span key={t}>{tx(t)}</span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                    <Chain tx={tx} />
                </div>
            </section>

            <CommerceStack tx={tx} tick={tick} />
            <Sorter tx={tx} />
            <Dashboard tx={tx} tick={tick} />

            <section id="contact" className="hw-end">
                <div className="hw-end-in">
                    <h2 className="rv">
                        {tx("Want to go")} <em>{tx("deeper?")}</em>
                    </h2>
                    <p className="rv">{tx("Book a technical walkthrough with the Vybd team. We'll show you exactly how it would work for your kind of product.")}</p>
                    <div className="hw-end-row rv">
                        <RdLink className="btn btn-mint" href="/book">
                            {tx("Request a walkthrough")}
                        </RdLink>
                        <RdLink className="btn btn-ghost" href="/">
                            {tx("Back to home")}
                        </RdLink>
                    </div>
                </div>
            </section>

            <RdFooter current="product" />
        </RdPage>
    );
}
