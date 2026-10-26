import { Fragment, useEffect, useRef, useState } from "react";
import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { useTx, type Tx } from "./i18n";
import "./LabPage.css";

/* The Lab (Brand Brain), ported from redesign/pages/Lab.dc.html. */

const AGENTS = ["Market Intelligence", "Compliance", "Logistics", "Warehousing", "E-commerce", "Marketing"];

const LAYERS = [
    {
        name: "Voice",
        what: "Your brand guidelines, how you want to be seen, and what to say and not say.",
        so: "So listings, ads and customer replies all sound like you, without anyone re-explaining your brand each time.",
    },
    {
        name: "Operations",
        what: "Your products, margins, customs codes, supplier terms, sales-channel rules and compliance limits.",
        so: "So agents make the right call (what to reorder, how to classify a product, where to ship it) without stopping to ask.",
    },
    {
        name: "Market",
        what: "What our research agents learn about the US market and your customers.",
        so: "So your plan changes when the market does, instead of sticking to day-one guesses.",
    },
];

const PLATES = [
    { name: "Market", tag: "03", z: 150, layer: 2 },
    { name: "Operations", tag: "02", z: 75, layer: 1 },
    { name: "Voice", tag: "01", z: 0, layer: 0 },
];

// write-back examples: which agent writes, which agents read the result
const EX = [
    { from: 0, to: [5], text: "Market research changes who the marketing agent targets." },
    { from: 1, to: [2], text: "A customs decision changes how the next shipment gets cleared." },
    { from: 5, to: [0, 1, 2, 3, 4], text: "A campaign result updates the plan." },
];

const LOG = [
    ["Marketing", "reads voice", "Read"],
    ["Compliance", "reads HTS codes", "Read"],
    ["Market Intel", "writes finding", "Write"],
    ["Logistics", "reads routing", "Read"],
    ["Marketing", "writes result", "Write"],
];

const BrainIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 18V5" />
        <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
        <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
        <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
        <path d="M18 18a4 4 0 0 0 2-7.464" />
        <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
        <path d="M6 18a4 4 0 0 1-2-7.464" />
        <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
    </svg>
);

function Hero({ tx }: { tx: Tx }) {
    const monRef = useRef<HTMLDivElement>(null);
    const [log, setLog] = useState(0);
    useEffect(() => {
        const id = window.setInterval(() => setLog((l) => l + 1), 2200);
        return () => clearInterval(id);
    }, []);
    const words = tx.seg("labh1", ["What", " ", "we're", " ", "building", " ", "behind", " ", "the", " ", "agency."]);
    const delays = ["0s", ".06s", ".12s", ".18s", ".24s", ".3s"];

    return (
        <section
            id="top"
            className="lb-hero"
            aria-labelledby="lb-h1"
            onMouseMove={(e) => {
                const m = monRef.current;
                if (!m) return;
                const r = m.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
                const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
                m.style.setProperty("--ry", (dx * 14).toFixed(2) + "deg");
                m.style.setProperty("--rx", (-dy * 10).toFixed(2) + "deg");
            }}
            onMouseLeave={() => {
                monRef.current?.style.setProperty("--ry", "0deg");
                monRef.current?.style.setProperty("--rx", "0deg");
            }}
        >
            <div className="wrap lb-hero-grid">
                <div>
                    <span className="lb-eyebrow mono">
                        <i className="lb-dot"></i>
                        {tx("Vybd Lab · In development")}
                    </span>
                    <h1 id="lb-h1" className="lb-h1">
                        {[0, 1, 2, 3, 4, 5].map((w) => {
                            const word = words[w * 2];
                            return (
                                <Fragment key={w}>
                                    {w > 0 && words[w * 2 - 1]}
                                    <span className="w">
                                        <span style={w > 0 ? { animationDelay: delays[w] } : undefined}>{w >= 3 ? <em>{word}</em> : word}</span>
                                    </span>
                                </Fragment>
                            );
                        })}
                    </h1>
                    <p className="lb-lead">
                        {tx(
                            "Vybd runs complete US launches today. Behind that work, we're building tools that make each launch smarter than the one before. The Lab is where we share them, openly, while they're still being built."
                        )}
                    </p>
                    <div className="lb-hero-cta">
                        <RdLink className="btn btn-dark" href="#brain">
                            {tx("See Brand Brain")}{" "}
                            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M6 13l6 6 6-6" />
                            </svg>
                        </RdLink>
                    </div>
                </div>
                <div className="lb-mon-wrap" aria-hidden="true">
                    <div className="lb-mon" ref={monRef}>
                        <div className="lb-mon-top mono">
                            <span>
                                <b>{tx("Brand Brain")}</b> {tx("· prototype")}
                            </span>
                            <span className="lb-mon-live">
                                <i className="lb-dot"></i>
                                {tx("Live")}
                            </span>
                        </div>
                        <div className="lb-mon-stage">
                            <span className="lb-ring r1">
                                <i></i>
                            </span>
                            <span className="lb-ring r2">
                                <i></i>
                            </span>
                            <span className="lb-chipf" style={{ left: "8%", top: "14%" }}>
                                <b>01</b>
                                {tx("Voice")}
                            </span>
                            <span className="lb-chipf" style={{ right: "7%", top: "30%", animationDelay: "-1.5s" }}>
                                <b>02</b>
                                {tx("Operations")}
                            </span>
                            <span className="lb-chipf" style={{ left: "14%", bottom: "14%", animationDelay: "-3s" }}>
                                <b>03</b>
                                {tx("Market")}
                            </span>
                            <div className="lb-orb">
                                <BrainIcon size={44} />
                            </div>
                        </div>
                        <div className="lb-log">
                            {[0, 1, 2].map((j) => {
                                const [agent, text, dir] = LOG[(log + j) % LOG.length];
                                return (
                                    <div key={j} className="lb-log-row">
                                        <span>
                                            <span className="mono">{tx(agent)}</span> — {tx(text)}
                                        </span>
                                        <span className="mono">{tx(dir)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Layers({ tx }: { tx: Tx }) {
    const [layer, setLayer] = useState(0);
    return (
        <section id="brain" className="lb-sec" aria-labelledby="lb-h2a">
            <div className="wrap">
                <div className="lb-sec-head rv">
                    <div>
                        <div className="lb-kicker mono">
                            <b>01</b> {tx("/ Brand Brain")}
                        </div>
                        <h2 id="lb-h2a" className="lb-h2">
                            {tx("One brain per brand.")}
                            <br />
                            <em>{tx("Every agent acts on it.")}</em>
                        </h2>
                    </div>
                    <p className="lb-p">
                        {tx(
                            "Brand Brain is one shared memory for each brand. Every Vybd AI agent reads from it and adds to it, so they all work from the same facts about your brand, and get smarter with every launch."
                        )}
                    </p>
                </div>
                <div className="lb-layers">
                    <div className="lb-stack" aria-hidden="true">
                        {PLATES.map((p, j) => (
                            <div
                                key={p.name}
                                className={"lb-plate" + (layer === p.layer ? " is-on" : "")}
                                style={{ ["--z" as string]: `${p.z}px`, zIndex: 3 - j }}
                            >
                                <small className="mono">{p.tag}</small>
                                <span>{tx(p.name)}</span>
                            </div>
                        ))}
                        <div className="lb-plate core" style={{ ["--z" as string]: "-75px", zIndex: 0 }}>
                            <small className="mono">core</small>
                            <span>{tx("Brand Brain")}</span>
                        </div>
                    </div>
                    <div className="lb-cards">
                        {LAYERS.map((l, i) => (
                            <article
                                key={l.name}
                                className={"lb-card rv" + (layer === i ? " is-on" : "")}
                                tabIndex={0}
                                onMouseEnter={() => setLayer(i)}
                                onFocus={() => setLayer(i)}
                                onClick={() => setLayer(i)}
                            >
                                <span className="lb-num">0{i + 1}</span>
                                <h3>{tx(l.name)}</h3>
                                <p>{tx(l.what)}</p>
                                <div className="lb-so">
                                    <div>
                                        <p>{tx(l.so)}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* Six agents around the brain. Each example: one agent writes a finding
   (phase 0), then the agents it affects read it (phase 1). Autoplays while
   visible; picking an example pauses the loop for 9s. */
function WriteBack({ tx }: { tx: Tx }) {
    const secRef = useRef<HTMLElement>(null);
    const [ex, setEx] = useState(0);
    const [phase, setPhase] = useState(0);
    const [visible, setVisible] = useState(() => !("IntersectionObserver" in window));
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const el = secRef.current;
        if (!el || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver((en) => setVisible(en[0].isIntersecting), { threshold: 0.25 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // the loop: read at 1.7s, next example at 4.6s
    useEffect(() => {
        if (!visible || paused) return;
        const a = window.setTimeout(() => setPhase(1), 1700);
        const b = window.setTimeout(() => {
            setPhase(0);
            setEx((e) => (e + 1) % EX.length);
        }, 4600);
        return () => {
            clearTimeout(a);
            clearTimeout(b);
        };
    }, [visible, paused, ex]);

    // a picked example: read at 1.5s, resume the loop after 9s
    useEffect(() => {
        if (!paused) return;
        const a = window.setTimeout(() => setPhase(1), 1500);
        const b = window.setTimeout(() => setPaused(false), 9000);
        return () => {
            clearTimeout(a);
            clearTimeout(b);
        };
    }, [paused, ex]);

    const pick = (i: number) => {
        setEx(i);
        setPhase(0);
        setPaused(true);
    };

    const cur = EX[ex];
    const cx = 300,
        cy = 300,
        R = 220,
        rIn = 84;
    const spokes = AGENTS.map((_, i) => {
        const ang = ((-90 + i * 60) * Math.PI) / 180,
            c = Math.cos(ang),
            s = Math.sin(ang);
        const write = cur.from === i && phase === 0,
            read = phase === 1 && cur.to.includes(i);
        return {
            x1: (cx + c * rIn).toFixed(1),
            y1: (cy + s * rIn).toFixed(1),
            x2: (cx + c * (R - 52)).toFixed(1),
            y2: (cy + s * (R - 52)).toFixed(1),
            state: (write ? " is-write" : "") + (read ? " is-read" : ""),
            left: 50 + (c * R) / 6,
            top: 50 + (s * R) / 6,
        };
    });

    return (
        <section className="lb-sec lb-loop-sec" aria-labelledby="lb-h2b" ref={secRef}>
            <div className="wrap">
                <div className="lb-sec-head rv">
                    <div>
                        <div className="lb-kicker mono">
                            <b>02</b> {tx("/ Why it's a brain, not a config file")}
                        </div>
                        <h2 id="lb-h2b" className="lb-h2">
                            {tx("Agents don't just read it.")}
                            <br />
                            <em>{tx("They write back to it.")}</em>
                        </h2>
                    </div>
                    <p className="lb-p">
                        {tx("If agents could only read it, it would just be a settings page. Brand Brain is different: agents also write what they learn back into it.")}
                    </p>
                </div>
                <div className="lb-loop">
                    <div
                        className="lb-dia"
                        role="img"
                        aria-label={tx(
                            "Brand Brain at the centre, connected both ways to six agents: Market Intelligence, Compliance, Logistics, Warehousing, E-commerce and Marketing."
                        )}
                    >
                        <svg viewBox="0 0 600 600" aria-hidden="true">
                            <circle className="lb-orbit" cx="300" cy="300" r="220"></circle>
                            {spokes.map((s, i) => (
                                <Fragment key={i}>
                                    <line className="lb-spoke" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}></line>
                                    <line className={"lb-flow" + s.state} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}></line>
                                </Fragment>
                            ))}
                        </svg>
                        <div className={phase === 1 ? "lb-core is-pulse" : "lb-core"}>
                            <BrainIcon size={24} />
                            {tx("Brand Brain")}
                        </div>
                        {AGENTS.map((a, i) => {
                            const exIdx = EX.findIndex((e) => e.from === i);
                            return (
                                <button
                                    key={a}
                                    type="button"
                                    className={"lb-node" + spokes[i].state}
                                    style={{ left: `${spokes[i].left.toFixed(2)}%`, top: `${spokes[i].top.toFixed(2)}%` }}
                                    onClick={() => exIdx >= 0 && pick(exIdx)}
                                    aria-label={tx(a) + (exIdx >= 0 ? ": " + tx("show its write-back example") : "")}
                                >
                                    <i></i>
                                    {tx(a)}
                                </button>
                            );
                        })}
                    </div>
                    <div className="rv">
                        <div className="lb-legend">
                            <span>
                                <i></i>
                                {tx("Writes a finding back")}
                            </span>
                            <span>
                                <i className="r"></i>
                                {tx("Reads the updated brain")}
                            </span>
                        </div>
                        <div className="lb-ex" aria-live="polite">
                            <div className="lb-ex-top mono">
                                <span>{tx(`Write-back ${ex + 1} / 3`)}</span>
                                <span className="lb-ex-dots">
                                    {EX.map((_, i) => (
                                        <button key={i} type="button" aria-label={tx(`Show write-back ${i + 1}`)} aria-pressed={i === ex} onClick={() => pick(i)}></button>
                                    ))}
                                </span>
                            </div>
                            <p className="lb-ex-text">{tx(cur.text)}</p>
                            <div className="lb-ex-flow">
                                <b>{tx(AGENTS[cur.from])}</b> {tx("writes → Brand Brain →")}{" "}
                                <b className="r">{tx(cur.to.length > 1 ? "Every agent" : AGENTS[cur.to[0]])}</b> {tx("reads")}
                            </div>
                        </div>
                        <div className="lb-months">
                            <p className="lb-p" style={{ fontSize: 16 }}>
                                {tx(
                                    "Each launch makes the brain sharper for the next one. By month five it knows far more than it did in month one, and a brand's second market starts ahead of its first."
                                )}
                            </p>
                            <div className="lb-months-row" aria-hidden="true">
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                            </div>
                            <div className="lb-months-lbl mono" aria-hidden="true">
                                <span>{tx("Month 1")}</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>{tx("Month 5")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function LabPage() {
    const tx = useTx();
    return (
        <RdPage name="lab">
            <RdHeader
                logoHref="/"
                links={[
                    { label: "What we do", href: "/us#services" },
                    { label: "Case studies", href: "/case-studies" },
                    { label: "Lab", href: "#top", current: true },
                ]}
                mobileLinks={[
                    { label: "Home", href: "/" },
                    { label: "Case studies", href: "/case-studies" },
                    { label: "Brand Brain", href: "#brain" },
                ]}
                ctaHref="#status"
                ctaLabel="Talk to us"
            />

            <Hero tx={tx} />
            <Layers tx={tx} />
            <WriteBack tx={tx} />

            <section id="status" className="lb-status" aria-labelledby="lb-h2c">
                <div className="lb-status-in">
                    <div className="lb-status-grid">
                        <div className="rv">
                            <span className="lb-eyebrow mono">
                                <i className="lb-dot"></i>
                                {tx("Status")}
                            </span>
                            <h2 id="lb-h2c">
                                {tx("Where this")}
                                <br />
                                <em>{tx("actually is.")}</em>
                            </h2>
                            <p>
                                {tx(
                                    "Brand Brain is still being built, so you can't buy it yet. It's where Vybd is heading, shaped by the real launches we run today. We're sharing it early because the people who find this interesting are often the people we want to talk to."
                                )}
                            </p>
                            <div className="lb-status-row">
                                <RdLink className="btn btn-mint" href="/book">
                                    {tx("Talk to us")}
                                </RdLink>
                                <a className="btn btn-ghost" href="mailto:hello@vybd.ai">
                                    {tx("Build it with us")}
                                </a>
                            </div>
                        </div>
                        <div className="lb-track rv" aria-label={tx("Where Brand Brain is today")}>
                            <div className="lb-step done">
                                <span className="lb-step-dot">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M5 12l5 5 9-10" />
                                    </svg>
                                </span>
                                <div>
                                    <b>{tx("Full US launches")}</b>
                                    <span>{tx("Running today")}</span>
                                </div>
                            </div>
                            <div className="lb-step now">
                                <span className="lb-step-dot"></span>
                                <div>
                                    <b>{tx("Brand Brain")}</b>
                                    <span>{tx("In active development")}</span>
                                </div>
                            </div>
                            <div className="lb-step later">
                                <span className="lb-step-dot"></span>
                                <div>
                                    <b>{tx("Available to buy")}</b>
                                    <span>{tx("Not yet")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RdFooter current="lab" />
        </RdPage>
    );
}
