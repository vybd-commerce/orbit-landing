import { useState } from "react";
import SectionTop from "./SectionTop";

/* 06: the executive cockpit. Three views (sales, inventory,
   profitability) over the same numbers. Every figure is made up. */

const VIEWS = [
    {
        name: "Sales",
        title: "Revenue by month",
        metrics: [
            ["Total revenue", "$2.48M"],
            ["Sales vs. plan", "+8.2%"],
            ["Active SKUs", "312"],
        ],
        bars: [48, 59, 57, 69, 79, 94],
        rows: [
            ["Amazon", "$940K", "↑ 12%"],
            ["Walmart", "$680K", "↑ 7%"],
            ["Retail / wholesale", "$520K", "↑ 4%"],
            ["DTC", "$340K", "↑ 9%"],
        ],
    },
    {
        name: "Inventory",
        title: "Stock health",
        metrics: [
            ["Inventory value", "$1.52M"],
            ["Weeks of supply", "8.4"],
            ["At-risk SKUs", "18"],
        ],
        bars: [88, 81, 76, 69, 65, 61],
        rows: [
            ["Healthy SKUs", "248", "Stable"],
            ["Stockout risk", "18", "Review"],
            ["Excess stock", "31", "Act"],
            ["Inbound POs", "24", "Tracking"],
        ],
    },
    {
        name: "Profitability",
        title: "Margin trend",
        metrics: [
            ["Gross margin", "43.2%"],
            ["Contribution margin", "21.8%"],
            ["Deductions flagged", "$42K"],
        ],
        bars: [43, 49, 58, 55, 67, 73],
        rows: [
            ["Amazon", "23.1%", "↑ 1.4pt"],
            ["Walmart", "19.6%", "↓ 0.8pt"],
            ["Wholesale", "18.4%", "Stable"],
            ["DTC", "28.3%", "↑ 2.1pt"],
        ],
    },
];

export default function Cockpit() {
    const [on, setOn] = useState(0);
    const v = VIEWS[on];
    return (
        <section id="reports" className="wrap ent-sec">
            <SectionTop
                kicker="Executive intelligence"
                title={
                    <>
                        Every channel.
                        <br />
                        <em>One clear picture.</em>
                    </>
                }
            >
                Switch views to see how one connected sales and operations cockpit puts leadership on the same numbers. Every figure here is made up for the demo.
            </SectionTop>

            <div className="ck-panel rv">
                <div className="ck-head">
                    <div>
                        <small className="ent-k">Vybd / Business pulse</small>
                        <h3>Executive cockpit</h3>
                    </div>
                    <span className="ent-pill">
                        <i /> Sample dashboard
                    </span>
                </div>
                <div className="ck-tabs" role="group" aria-label="Dashboard view">
                    {VIEWS.map((x, i) => (
                        <button key={x.name} type="button" className={i === on ? "on" : undefined} aria-pressed={i === on} onClick={() => setOn(i)}>
                            {x.name}
                        </button>
                    ))}
                </div>
                <div className="ck-metrics" aria-live="polite">
                    {v.metrics.map(([k, n]) => (
                        <div key={k}>
                            <span>{k}</span>
                            <b>{n}</b>
                        </div>
                    ))}
                </div>
                <div className="ck-body">
                    <div>
                        <div className="ck-row">
                            <strong>{v.title}</strong>
                            <span className="ent-muted">Last 6 months</span>
                        </div>
                        <div className="ck-chart" aria-hidden="true">
                            {v.bars.map((h, i) => (
                                <i key={i} style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>
                    <div className="ck-table">
                        <div className="ck-tr ck-th">
                            <span>Channel / segment</span>
                            <span>Value</span>
                            <span>Signal</span>
                        </div>
                        {v.rows.map(([a, b, c]) => (
                            <div key={a} className="ck-tr">
                                <span>{a}</span>
                                <strong>{b}</strong>
                                <span className={c.startsWith("↓") ? "dn" : "up"}>{c}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
