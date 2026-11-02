import { TESTIMONIALS } from "../../../data/testimonials";
import { RdLink } from "../chrome";
import SectionTop from "./SectionTop";

/* The /enterprise sections without much state: 04 revenue intelligence,
   05 how it fits, 08 proof and 09 what happens next. */

export function Growth() {
    return (
        <section id="growth" className="wrap ent-sec">
            <SectionTop
                kicker="04 / Revenue intelligence"
                title={
                    <>
                        Not just less cost.
                        <br />
                        <em>More profitable growth.</em>
                    </>
                }
            >
                Sales reports should do more than tell you what happened. Vybd ties sales signals to the inventory, purchasing and fulfillment decisions that protect
                revenue.
            </SectionTop>
            <div className="gr-grid">
                <article className="gr-card rv">
                    <small className="ent-k">01 / See the opportunity</small>
                    <h3>Find what's working.</h3>
                    <p>
                        Put Amazon, Walmart, Target, Shopify, retail and distributor numbers in one view. Compare sell-through, forecast, promotions, channel margin and
                        what each SKU contributes.
                    </p>
                    <div className="gr-vis">
                        <span className="ent-k">Sales signal · Sample</span>
                        <div className="gr-bars" aria-hidden="true">
                            {[38, 54, 48, 70, 83, 96].map((h, i) => (
                                <i key={i} style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <strong>Demand picking up ↗</strong>
                    </div>
                </article>
                <article className="gr-card rv">
                    <small className="ent-k">02 / Act on the signal</small>
                    <h3>Keep winners in stock.</h3>
                    <p>
                        When sales run ahead of plan, an agent flags the stock risk, suggests a reorder, drafts a PO for the buyer to approve and follows up with the
                        supplier.
                    </p>
                    <div className="gr-vis">
                        <span className="ent-k">Connected response</span>
                        <div className="gr-chain">
                            <span>Sales spike</span>
                            <b>→</b>
                            <span>Stock risk</span>
                            <b>→</b>
                            <span>Draft PO</span>
                        </div>
                        <strong>Fewer lost sales</strong>
                    </div>
                </article>
                <article className="gr-card rv">
                    <small className="ent-k">03 / Grow the right revenue</small>
                    <h3>Protect the margin.</h3>
                    <p>
                        See which customers, channels, products and promotions actually make money, not just sales. Catch deductions, freight changes and margin slips
                        before they become routine.
                    </p>
                    <div className="gr-vis">
                        <span className="ent-k">Profitable growth</span>
                        <div className="gr-chain">
                            <span>Revenue</span>
                            <b>+</b>
                            <span>Margin</span>
                            <b>+</b>
                            <span>Cash</span>
                        </div>
                        <strong>Better commercial calls</strong>
                    </div>
                </article>
            </div>
            <p className="ent-fine ent-fine--c">Sample use cases. Results depend on demand, stock, channel conditions and the decisions your team makes.</p>
        </section>
    );
}

const MILESTONES = [
    ["Discover", "Understand the operation", "Start with a free conversation. We map the workflows, bottlenecks and systems that matter most."],
    ["Connect", "Connect the tools you have", "ERP, WMS, commerce, EDI, spreadsheets and inboxes stay where they are wherever we can. We check access and data quality first."],
    ["Activate", "Start with one high-value workflow", "Agree on the first use case, how success is measured, who owns it and what needs approval."],
    ["Scale", "Expand with confidence", "Review results, train the team, watch the exceptions and move to the next workflow when you're ready."],
];

export function HowItFits() {
    return (
        <section id="transition" className="wrap ent-sec ent-soft bleed">
            <SectionTop
                kicker="05 / How it fits"
                title={
                    <>
                        Your systems stay.
                        <br />
                        <em>Your team gets stronger.</em>
                    </>
                }
            >
                No rip-and-replace. Vybd starts with the operation you already run, connects the data that matters and brings in agents around clear workflows and
                approvals.
            </SectionTop>
            <div className="hf2-grid">
                <ol className="hf2-path rv">
                    {MILESTONES.map(([k, h, p], i) => (
                        <li key={k} className="hf2-ms">
                            <div className="hf2-rail" aria-hidden="true">
                                <span className="hf2-ic">{String(i + 1).padStart(2, "0")}</span>
                                <span className="hf2-line">
                                    <i />
                                </span>
                            </div>
                            <div className="hf2-body">
                                <small className="ent-k">
                                    {k} / {String(i + 1).padStart(2, "0")}
                                </small>
                                <h3>{h}</h3>
                                <p>{p}</p>
                                <div className="hf2-prog" aria-hidden="true">
                                    {[0, 1, 2, 3].map((n) => (
                                        <span key={n} className={n <= i ? "on" : undefined} />
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
                <aside className="hf2-aside rv">
                    <small className="ent-k">People stay in control</small>
                    <h3>
                        Agents do the legwork.
                        <br />
                        <em>Your team makes the calls.</em>
                    </h3>
                    <div className="hf2-hand">
                        <span>AI prepares</span>
                        <b>→</b>
                        <span>A person approves</span>
                        <b>→</b>
                        <span>The system records</span>
                    </div>
                    <p>
                        Purchase commitments and other sensitive actions can require a person's review. Access, integration and rollout effort are worked out in the
                        assessment, never assumed.
                    </p>
                    <RdLink className="btn btn-mint" href="/book">
                        Talk through your setup
                    </RdLink>
                </aside>
            </div>
        </section>
    );
}

/* Short excerpts of the real testimonials in src/data/testimonials.ts. */
const QUOTES = [
    {
        who: "Mahathesh",
        text: "What impressed us most was how they combined hands on supply chain expertise with AI driven analysis to evaluate shipment volumes, container utilization, and consolidation opportunities.",
        tag: "Freight",
    },
    {
        who: "Bronson Coletrane",
        text: "If a product started selling faster than expected, the system could flag it early, tell us when we might run out, and recommend what we needed to order next.",
        tag: "Inventory",
    },
];

export function Proof() {
    return (
        <section id="proof" className="wrap ent-sec">
            <SectionTop
                kicker="08 / Proof, not promises"
                title={
                    <>
                        Built for
                        <br />
                        <em>real operators.</em>
                    </>
                }
                center
            >
                Vybd pairs hands-on operations experience with AI analysis. Here's what the brands we work with say.
            </SectionTop>
            <div className="pf-grid">
                {QUOTES.map((q, i) => {
                    const t = TESTIMONIALS.find((x) => x.name === q.who);
                    return (
                        <figure key={q.who} className={`pf-card rv${i % 2 ? " alt" : ""}`}>
                            <div className="pf-top">
                                <span>VYBD POST</span>
                                <span>{q.tag}</span>
                            </div>
                            <blockquote>“{q.text}”</blockquote>
                            <figcaption>
                                <div>
                                    <strong>{q.who}</strong>
                                    <span>{t?.title}</span>
                                </div>
                                <span className="pf-stamp" aria-hidden="true">
                                    VYBD
                                    <small>DELIVERED</small>
                                </span>
                            </figcaption>
                        </figure>
                    );
                })}
            </div>
            <div className="pf-more rv">
                <RdLink className="btn btn-text" href="/case-studies">
                    Read the case studies
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </RdLink>
            </div>
        </section>
    );
}

const NEXT = [
    [
        "Free · 30 minutes",
        "Talk with an operator.",
        "Tell us where sales reporting, purchasing, inventory, fulfillment or margin visibility breaks down. We'll ask about your systems and priorities.",
        "You leave with",
        "A clearer view of which problems are worth solving, and whether we can help.",
    ],
    [
        "If there's a fit",
        "Scope a focused audit.",
        "We agree on the workflows, systems and data to look at. The audit maps bottlenecks, risks and ways to grow revenue, cut cost or free up cash.",
        "The aim",
        "A ranked, costed plan with clear owners and expected payback.",
    ],
    [
        "Agreed next step",
        "Start where the value is clearest.",
        "We pick a practical first use case, like automated sales reporting, reorder POs or deduction recovery, with success measures and the right approvals.",
        "The principle",
        "Build on what you already run. Expand only where results earn it.",
    ],
];

export function NextSteps() {
    return (
        <section id="after-call" className="wrap ent-sec ent-soft bleed">
            <SectionTop
                kicker="09 / What happens next"
                title={
                    <>
                        A conversation first.
                        <br />
                        <em>A clear path forward.</em>
                    </>
                }
            >
                No generic AI pitch. We start by learning how your business runs, where it loses time or money, and whether Vybd is the right fit.
            </SectionTop>
            <div className="nx-grid">
                {NEXT.map(([tag, h, p, k, out], i) => (
                    <article key={h} className="nx-card rv">
                        <div className="nx-num">
                            {String(i + 1).padStart(2, "0")} <span>{tag}</span>
                        </div>
                        <h3>{h}</h3>
                        <p>{p}</p>
                        <div className="nx-out">
                            <small className="ent-k">{k}</small>
                            <span>{out}</span>
                        </div>
                    </article>
                ))}
            </div>
            <ul className="nx-note rv">
                <li>No obligation from the free call</li>
                <li>Your current systems considered</li>
                <li>People stay in control of decisions</li>
            </ul>
        </section>
    );
}
