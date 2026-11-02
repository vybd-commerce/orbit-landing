import { useState } from "react";
import SectionTop from "./SectionTop";

/* 07: the business case. Yearly savings from freight and admin work, and
   the one-time cash freed from leaner inventory, from the brand's own
   numbers and the reductions it wants to test. */

type Field = "inv" | "freight" | "labor" | "ir" | "fr" | "lr";

const FIELDS: { id: Field; label: string; pre?: string; suf?: string; max?: number }[] = [
    { id: "inv", label: "Average inventory on hand", pre: "$" },
    { id: "freight", label: "Yearly freight and fulfillment spend", pre: "$" },
    { id: "labor", label: "Yearly cost of repetitive admin work", pre: "$" },
    { id: "ir", label: "Inventory reduction to test", suf: "%", max: 100 },
    { id: "fr", label: "Freight cost reduction to test", suf: "%", max: 100 },
    { id: "lr", label: "Admin cost reduction to test", suf: "%", max: 100 },
];

const DEFAULTS: Record<Field, string> = { inv: "1500000", freight: "800000", labor: "120000", ir: "10", fr: "8", lr: "25" };

const cash = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export default function ImpactCalc() {
    const [v, setV] = useState(DEFAULTS);
    const num = (id: Field) => Math.max(0, Number(v[id]) || 0);
    const pct = (id: Field) => Math.min(100, num(id)) / 100;
    const freight = num("freight") * pct("fr");
    const labor = num("labor") * pct("lr");
    const inventory = num("inv") * pct("ir");

    return (
        <section id="impact" className="wrap ent-sec ent-soft bleed">
            <SectionTop
                kicker="07 / The business case"
                title={
                    <>
                        What could better
                        <br />
                        operations <em>unlock?</em>
                    </>
                }
            >
                See what you could save each year and how much cash leaner inventory could free up. Change the numbers to match your business.
            </SectionTop>

            <div className="ic-grid">
                <div className="pc2-panel rv" role="group" aria-label="Your numbers">
                    <div className="ic-fields">
                        {FIELDS.map((f) => (
                            <div key={f.id} className="pc2-field">
                                <label htmlFor={`ic-${f.id}`}>{f.label}</label>
                                <div className="pc2-in">
                                    {f.pre && <span className="pc2-pre">{f.pre}</span>}
                                    <input
                                        id={`ic-${f.id}`}
                                        type="number"
                                        inputMode="decimal"
                                        min={0}
                                        max={f.max}
                                        value={v[f.id]}
                                        onChange={(e) => setV((s) => ({ ...s, [f.id]: e.target.value }))}
                                    />
                                    {f.suf && <span className="pc2-suf">{f.suf}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pc2-out ic-out rv" aria-live="polite">
                    <h3 className="pc2-k">What it could be worth</h3>
                    <div className="ic-big">
                        <span>Yearly cost savings</span>
                        <b className="pos">{cash(freight + labor)}</b>
                    </div>
                    <div className="ic-big">
                        <span>Cash freed from inventory, once</span>
                        <b>{cash(inventory)}</b>
                    </div>
                    <div className="pc2-fees">
                        <div className="pc2-row">
                            <span>Freight savings</span>
                            <b>{cash(freight)}</b>
                        </div>
                        <div className="pc2-row">
                            <span>Admin savings</span>
                            <b>{cash(labor)}</b>
                        </div>
                        <div className="pc2-row">
                            <span>Inventory cash released</span>
                            <b>{cash(inventory)}</b>
                        </div>
                    </div>
                    <p className="pc2-fine">
                        Not a quote or a promise. Cash freed from inventory is not yearly profit. Admin savings count only when the cost actually goes away, and setup costs
                        aren't included.
                    </p>
                </div>
            </div>
        </section>
    );
}
