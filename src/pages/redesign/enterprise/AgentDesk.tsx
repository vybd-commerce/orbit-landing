import { useState } from "react";
import SectionTop from "./SectionTop";

/* 03: a purchasing agent walking one SKU from a stock alert to a confirmed
   PO, four steps on a stamped paper slip. Demo records, not a live system. */

const STEPS = [
    {
        title: "Spot the reorder",
        desc: "The agent flags SKU CPG-1042: it will drop below safety stock in 18 days.",
        label: "Inventory alert",
        detail: "Hits safety stock in 18 days.",
        stamp: "Flagged",
    },
    {
        title: "Draft the purchase order",
        desc: "The agent drafts a PO from your approved supplier terms, lead time, stock policy and minimum order quantities.",
        label: "Draft purchase order",
        detail: "PO draft ready for the buyer.",
        stamp: "Draft",
    },
    {
        title: "Ask the buyer",
        desc: "Your purchasing manager checks quantity, price and delivery date, then approves it.",
        label: "Approval request",
        detail: "Nothing goes out without a person's OK.",
        stamp: "Review",
    },
    {
        title: "Follow up with the supplier",
        desc: "Once approved, the agent tracks the supplier's confirmation and raises any delay or mismatch.",
        label: "Supplier confirmation",
        detail: "Watching for confirmation and exceptions.",
        stamp: "Watching",
    },
];

export default function AgentDesk() {
    const [i, setI] = useState(0);
    const s = STEPS[i];
    const last = i === STEPS.length - 1;
    return (
        <section id="agents" className="wrap ent-sec ent-soft bleed">
            <SectionTop
                kicker="AI agents at work"
                title={
                    <>
                        Less chasing.
                        <br />
                        <em>More doing.</em>
                    </>
                }
            >
                Step through a sample purchase-order workflow. The records are made up for the demo.
            </SectionTop>

            <div className="ad-grid">
                <div className="ad-copy rv">
                    <span className="ent-pill">
                        <i /> Purchasing agent · Walkthrough
                    </span>
                    <h3 aria-live="polite">{s.title}</h3>
                    <p>{s.desc}</p>
                    <div className="ad-steps" role="group" aria-label="Steps">
                        {STEPS.map((x, n) => (
                            <button
                                key={x.title}
                                type="button"
                                className={n <= i ? "on" : undefined}
                                aria-label={`Step ${n + 1}: ${x.title}`}
                                aria-current={n === i ? "step" : undefined}
                                onClick={() => setI(n)}
                            />
                        ))}
                    </div>
                    <button type="button" className="btn btn-dark" onClick={() => setI((n) => (n + 1) % STEPS.length)}>
                        {last ? "Start again ↻" : "Next step →"}
                    </button>
                    <p className="ent-fine">A person approves every purchase order before it goes out.</p>
                </div>

                <div className="ad-desk rv">
                    <div className="ad-desk-top">
                        <strong>Vybd agent desk</strong>
                        <span className="ent-pill ent-pill--sm">
                            <i /> Demo
                        </span>
                    </div>
                    <div className="ad-slip">
                        <div className="ad-row ad-head">
                            <b>{s.label}</b>
                            <span>VYBD / 1042</span>
                        </div>
                        <div className="ad-row">
                            <span>SKU</span>
                            <strong>CPG-1042</strong>
                        </div>
                        <div className="ad-row">
                            <span>Quantity</span>
                            <strong>2,400 units</strong>
                        </div>
                        <div className="ad-row">
                            <span>Supplier</span>
                            <strong>Vendor A</strong>
                        </div>
                        <p className="ad-detail">{s.detail}</p>
                        <span key={s.stamp} className="ad-stamp" aria-label={`Status: ${s.stamp}`}>
                            {s.stamp}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
