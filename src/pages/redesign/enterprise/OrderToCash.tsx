import { useState } from "react";
import SectionTop from "./SectionTop";

/* 02: the order-to-cash chain as six stops. Picking one opens a navy panel
   with where money or time leaks there and what Vybd does about it. */

const STAGES = [
    {
        stage: "Demand plan",
        tag: "Sales",
        risk: false,
        issue: "Forecasts miss shifts in demand across retail, marketplace and DTC.",
        fix: ["Sales reporting across every channel", "Forecast vs. actual by SKU and channel", "Promotion and margin variance alerts"],
        outcome: "See demand change before it turns into stockouts or excess stock.",
    },
    {
        stage: "PO issued",
        tag: "Buying",
        risk: false,
        issue: "Reorder spreadsheets and hand-built purchase orders slow buyers down.",
        fix: ["Draft POs written by an agent", "MOQ, lead-time and safety-stock checks", "Buyer approval before anything is sent"],
        outcome: "Turn reorder suggestions into controlled purchase orders.",
    },
    {
        stage: "Supplier confirm",
        tag: "Leak point",
        risk: true,
        issue: "Unconfirmed POs, shifting lead times and supplier delays go unnoticed.",
        fix: ["Automatic supplier follow-ups", "Confirmation and ETA tracking", "Escalation when quantity or price changes"],
        outcome: "Spot supply risk early, without chasing anyone by hand.",
    },
    {
        stage: "Freight & receipt",
        tag: "Leak point",
        risk: true,
        issue: "Surprise freight charges, late arrivals and receiving mismatches push costs up.",
        fix: ["Freight cost and exception reporting", "PO vs. receipt reconciliation", "3PL and carrier performance in view"],
        outcome: "Keep deliveries reliable and cut avoidable fulfillment costs.",
    },
    {
        stage: "Inventory & sales",
        tag: "Cash",
        risk: false,
        issue: "Stock, sales and margin live in separate places, hiding slow movers and winners.",
        fix: ["Stock health and weeks-of-supply reporting", "Profit by channel and customer", "Executive sales packs, built automatically"],
        outcome: "Tie sales performance to inventory and cash decisions.",
    },
    {
        stage: "Deduction settled",
        tag: "Leak point",
        risk: true,
        issue: "Retailer deductions, chargebacks and invoice mismatches eat into margin.",
        fix: ["Deductions sorted automatically", "PO, receipt and invoice matching", "Recovery opportunities ranked"],
        outcome: "Find and recover leakage, with clear owners and an audit trail.",
    },
];

const OUTCOMES = [
    ["01 / Audit", "Find the leaks.", "An operator maps your business end to end, costs the bottlenecks and ranks the fixes by payback."],
    ["02 / Data layer", "Connect the truth.", "Your systems stay. Ops OS brings sales, inventory, orders, suppliers and finance into one picture."],
    ["03 / Your team", "Supercharge the people.", "Agents chase, reconcile, flag and prepare. Your people focus on the calls that matter."],
];

export default function OrderToCash() {
    const [on, setOn] = useState(0);
    const x = STAGES[on];
    return (
        <section id="capabilities" className="wrap ent-sec">
            <SectionTop
                kicker="02 / Where money leaks"
                title={
                    <>
                        Follow the money.
                        <br />
                        <em>Fix the work.</em>
                    </>
                }
            >
                From the first demand signal to the final retailer settlement, see where time, cash and margin slip away. Pick a stop to see the fix.
            </SectionTop>

            <div className="ent-shell rv">
                <div className="ent-shell-top">
                    <span className="ent-pill">
                        <i /> Order to cash
                    </span>
                    <span className="ent-muted">Six chances to win back time and money</span>
                </div>
                <div className="oc-track">
                    {STAGES.map((s, i) => (
                        <button key={s.stage} type="button" className={`oc-step${i === on ? " on" : ""}`} aria-pressed={i === on} onClick={() => setOn(i)}>
                            <small>
                                {String(i + 1).padStart(2, "0")} / {s.tag}
                            </small>
                            <strong>{s.stage}</strong>
                            <span className={`oc-sig${s.risk ? " risk" : ""}`}>{s.risk ? "● Margin risk" : "↗ Improve"}</span>
                        </button>
                    ))}
                </div>
                <div className="oc-detail" aria-live="polite">
                    <div>
                        <small className="ent-k">Where money or time leaks</small>
                        <h3>{x.stage}</h3>
                        <p>{x.issue}</p>
                        <small className="ent-k">The outcome</small>
                        <p>{x.outcome}</p>
                    </div>
                    <div>
                        <small className="ent-k">What Vybd does</small>
                        <ul className="ent-ticks">
                            {x.fix.map((f) => (
                                <li key={f}>{f}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="oc-three">
                {OUTCOMES.map(([k, h, p]) => (
                    <article key={k} className="rv">
                        <small className="ent-k">{k}</small>
                        <h3>{h}</h3>
                        <p>{p}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
