import { useState } from "react";
import SectionTop from "./SectionTop";

/* 01: six systems feeding one navy "Ops OS" core, with packets running
   along the wires. Picking a system fills the readout below. On phones the
   wires hide and the systems sit in a grid under the core. */

const SOURCES = [
    { k: "01 / Commerce", name: "Sales channels", sub: "Orders · Sell-through", desc: "Amazon, Walmart, Shopify, retail and distributor sales feed one view of every SKU and customer." },
    { k: "02 / Systems", name: "ERP", sub: "POs · Finance", desc: "Purchase orders, supplier costs, invoices and financial records line up, without replacing your ERP." },
    { k: "03 / Inventory", name: "WMS / 3PL", sub: "Receipts · Stock", desc: "Receipts, available stock, adjustments and fulfillment show up right next to orders." },
    { k: "04 / Partners", name: "Suppliers", sub: "Confirmations · ETAs", desc: "Confirmations, lead times, price changes and late shipments become exceptions you can track." },
    { k: "05 / Delivery", name: "Carriers", sub: "Tracking · Costs", desc: "Shipment milestones, delivery exceptions and freight charges connect to orders and margins." },
    { k: "06 / Records", name: "Files & inboxes", sub: "Reports · Exceptions", desc: "Spreadsheets, email confirmations and exception records join the same operating picture." },
];

const WIRES = [
    "M170 100 Q350 100 500 285",
    "M500 85 L500 285",
    "M830 100 Q650 100 500 285",
    "M170 465 Q350 465 500 285",
    "M500 485 L500 285",
    "M830 465 Q650 465 500 285",
];
const DURS = ["3.2s", "4s", "3.7s", "4.2s", "3.5s", "4.4s"];

export default function OpsMap() {
    const [on, setOn] = useState(0);
    const s = SOURCES[on];
    return (
        <section id="systems" className="wrap ent-sec ent-soft bleed">
            <SectionTop
                kicker="Your systems stay"
                title={
                    <>
                        Different systems.
                        <br />
                        <em>One operating picture.</em>
                    </>
                }
            >
                Your ERP, WMS, sales channels, spreadsheets and inboxes each hold part of the truth. Your systems stay. Vybd puts their data into one shared picture
                for reporting, decisions and agents.
            </SectionTop>

            <div className="ent-shell rv">
                <div className="ent-shell-top">
                    <span className="ent-pill">
                        <i /> Live operating map
                    </span>
                    <span className="ent-muted">Pick a system to follow its data</span>
                </div>
                <div className="om-canvas">
                    <svg className="om-wires" viewBox="0 0 1000 570" preserveAspectRatio="none" aria-hidden="true">
                        {WIRES.map((d, i) => (
                            <path key={d} d={d} className={i === on ? "on" : undefined} />
                        ))}
                        {WIRES.map((d, i) => (
                            <circle key={`p${i}`} className="om-packet" r="6">
                                <animateMotion dur={DURS[i]} path={d} repeatCount="indefinite" />
                            </circle>
                        ))}
                    </svg>
                    <div className="om-core">
                        <span className="om-halo" aria-hidden="true" />
                        <small>The operating layer</small>
                        <strong>
                            Vybd
                            <br />
                            Ops OS
                        </strong>
                    </div>
                    {SOURCES.map((x, i) => (
                        <button key={x.name} type="button" className={`om-src om-p${i + 1}${i === on ? " on" : ""}`} aria-pressed={i === on} onClick={() => setOn(i)}>
                            <small>{x.k}</small>
                            <strong>{x.name}</strong>
                            <span>{x.sub}</span>
                        </button>
                    ))}
                </div>
                <div className="om-read" aria-live="polite">
                    <div>
                        <small className="ent-k">Selected system</small>
                        <strong>{s.name}</strong>
                        <p>{s.desc}</p>
                    </div>
                    <div>
                        <small className="ent-k">What it powers</small>
                        <div className="ent-chips">
                            <span>Analytics</span>
                            <span>Agent workflows</span>
                            <span>Integrations</span>
                        </div>
                        <p>Forecasts, margins and stock health run on the same data as the purchasing and reconciliation agents.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
