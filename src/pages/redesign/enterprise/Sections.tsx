import { TESTIMONIALS } from "../../../data/testimonials";
import { RdLink } from "../chrome";
import SectionTop from "./SectionTop";
import { SYSTEMS } from "./systems";

/* The /enterprise sections without much state: proof (right under the
   hero), the offer and how we start, and the FAQ. */

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
                kicker="Proof, not promises"
                title={
                    <>
                        Built for
                        <br />
                        <em>real operators.</em>
                    </>
                }
                center
            >
                Hands-on operations experience, paired with AI analysis. Here's what the brands we work with say.
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

const INCLUDES = [
    "Agents across warehouses, stores and DCs",
    `${SYSTEMS.slice(0, -1).join(", ")} and ${SYSTEMS[SYSTEMS.length - 1]} connected`,
    "Forecasting across large SKU counts",
    "Deductions and chargeback recovery",
    "A dedicated operator, team and SLAs",
    "Security review before anything connects",
];

const NEXT = [
    [
        "Free · 30 minutes",
        "Talk to an operator.",
        "Walk us through where reporting, purchasing, inventory, fulfillment or margin visibility breaks down, and which systems you run.",
        "You leave with",
        "A rough plan, an honest reality check, and whether we can help.",
    ],
    [
        "If there's a fit",
        "Scope a focused audit.",
        "We agree the workflows, systems and data to look at, then map the bottlenecks and cost every fix.",
        "You get",
        "A ranked, costed plan with owners and expected payback.",
    ],
    [
        "Agreed next step",
        "Start where the value is clearest.",
        "One first workflow, like automated sales reporting, reorder POs or deduction recovery, with success measures and approvals agreed.",
        "The principle",
        "Build on what you run. Expand only where results earn it.",
    ],
];

export function NextSteps() {
    return (
        <section id="start" className="wrap ent-sec ent-soft bleed">
            <SectionTop
                kicker="Pricing and how we start"
                title={
                    <>
                        A conversation first.
                        <br />
                        <em>A costed plan next.</em>
                    </>
                }
            >
                No rip-and-replace and no generic AI pitch. We learn how your operation runs, where it loses time or money, and whether Vybd is the right fit.
            </SectionTop>

            <div className="of-grid rv">
                <article className="of-card">
                    <div className="of-head">
                        <small className="ent-k">Enterprise</small>
                        <h3>Custom pricing</h3>
                        <p>For $50M+ brands, grocers, retailers and distributors with their own warehouses, DCs and stores. Priced on the systems, sites and workflows in scope.</p>
                        <RdLink className="btn btn-dark" href="/book">
                            Talk to an operator
                        </RdLink>
                    </div>
                    <ul className="ent-ticks of-list">
                        {INCLUDES.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                </article>
                <aside className="of-alt">
                    <small className="ent-k">Doing $10M to $50M on 3PLs?</small>
                    <p>Scale starts at $3K a month plus 12% of US sales, with the same agents and an operator on your account.</p>
                    <RdLink className="btn btn-text" href="/us">
                        See Scale
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </RdLink>
                </aside>
            </div>

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
        </section>
    );
}

const FAQ: [string, string][] = [
    [
        "Do we have to replace our ERP or WMS?",
        `No. Vybd works with the systems you already run, including ${SYSTEMS.join(", ")}, with more coming. We read from them, and write back only where you approve it.`,
    ],
    [
        "How long until the first workflow is live?",
        "Most of the time goes to access and data checks, so it depends on your systems. We agree a date for the first workflow during the audit, before you commit to anything.",
    ],
    [
        "How is our data secured?",
        "Access is limited to what each workflow needs, sensitive actions like purchase orders need a person's approval, and agent actions are logged. We go through your security review before connecting anything.",
    ],
    [
        "How is pricing set?",
        "Enterprise pricing is custom, based on the systems, sites and workflows in scope. The audit gives you a costed plan with expected payback before you sign. Brands doing $10M to $50M on 3PLs can start on Scale from $3K a month plus 12% of US sales.",
    ],
];

export function Faq() {
    return (
        <section id="faq" className="wrap ent-sec">
            <SectionTop
                kicker="FAQ"
                title={
                    <>
                        Questions operators
                        <br />
                        <em>ask us first.</em>
                    </>
                }
                center
            />
            <div className="fq-list rv">
                {FAQ.map(([q, a]) => (
                    <details key={q} className="fq-item">
                        <summary>{q}</summary>
                        <p>{a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
