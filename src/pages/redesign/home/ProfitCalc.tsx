import { useMemo, useState } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { REVENUE_SHARE, SOFTWARE_CAP, softwareTier } from "./pricingTiers";

/* "Run your numbers": the US profitability calculator, after Pricing on
   the US page. A brand enters its projected US sales, order value, costs
   and box, and sees its yearly contribution after Vybd's fees. Ported from
   vybd_profitability_calculator.html with the same model; the fees come
   from pricingTiers.ts so they match the Pricing labels. Styles: .pc2-* in
   HomePage.css. */

/* Illustrative domestic logistics rates, per order. Replace with approved
   rates before quoting from them. */
const RATES = {
    dimDivisor: 139,
    shippingBase: 5.5,
    shippingAdditionalPound: 1.2,
    pickPack: 2.5,
    packaging: 0.5,
    warehousingPerOrder: 0.5,
    returnsPerOrder: 0.6,
};

type Field = "revenue" | "aov" | "cogs" | "marketing" | "weight" | "length" | "width" | "height";

const DEFAULTS: Record<Field, string> = {
    revenue: "250000",
    aov: "40",
    cogs: "15",
    marketing: "10",
    weight: "1.5",
    length: "12",
    width: "9",
    height: "5",
};

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const dollars = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const signed = (n: number) => (n < 0 ? "−" : "") + money(Math.abs(n));

function compute(raw: Record<Field, string>) {
    const v = Object.fromEntries(Object.entries(raw).map(([k, x]) => [k, Number(x)])) as Record<Field, number>;
    const valid =
        Object.values(raw).every((x) => x.trim() !== "") &&
        Object.values(v).every(Number.isFinite) &&
        v.revenue >= 0 &&
        v.aov > 0 &&
        v.weight > 0 &&
        v.length > 0 &&
        v.width > 0 &&
        v.height > 0 &&
        v.cogs >= 0 &&
        v.cogs <= 100 &&
        v.marketing >= 0 &&
        v.marketing <= 100;
    if (!valid) return null;

    const tier = softwareTier(v.revenue);
    const dim = (v.length * v.width * v.height) / RATES.dimDivisor;
    const billable = Math.max(v.weight, dim);
    const shipping = RATES.shippingBase + RATES.shippingAdditionalPound * Math.max(0, Math.ceil(billable) - 1);
    const logisticsUnit = shipping + RATES.pickPack + RATES.packaging + RATES.warehousingPerOrder + RATES.returnsPerOrder;
    const shipments = v.revenue / v.aov;
    const logistics = shipments * logisticsUnit;
    const cogs = (v.revenue * v.cogs) / 100;
    const marketing = (v.revenue * v.marketing) / 100;
    const share = v.revenue * REVENUE_SHARE;
    const profit = v.revenue - cogs - marketing - logistics - share - tier.fee;
    const margin = v.revenue > 0 ? (profit / v.revenue) * 100 : 0;
    const denom = 1 - v.cogs / 100 - v.marketing / 100 - REVENUE_SHARE - (v.revenue > 0 ? tier.fee / v.revenue : Infinity);
    const breakevenAov = denom > 0 ? logisticsUnit / denom : null;
    return { v, tier, billable, shipments, logisticsUnit, logistics, cogs, marketing, share, profit, margin, breakevenAov };
}

function Input({
    tx,
    id,
    label,
    value,
    onChange,
    prefix,
    suffix,
    step,
    min,
    max,
    ariaLabel,
}: {
    tx: Tx;
    id: Field;
    label?: string;
    value: string;
    onChange: (id: Field, v: string) => void;
    prefix?: string;
    suffix?: string;
    step: number;
    min: number;
    max?: number;
    ariaLabel?: string;
}) {
    return (
        <div className="pc2-field">
            {label && <label htmlFor={`pc2-${id}`}>{tx(label)}</label>}
            <div className="pc2-in">
                {prefix && <span className="pc2-pre">{prefix}</span>}
                <input
                    id={`pc2-${id}`}
                    type="number"
                    inputMode="decimal"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    aria-label={ariaLabel ? tx(ariaLabel) : undefined}
                    onChange={(e) => onChange(id, e.target.value)}
                />
                {suffix && <span className="pc2-suf">{suffix}</span>}
            </div>
        </div>
    );
}

export default function ProfitCalc({ tx }: { tx: Tx }) {
    const [vals, setVals] = useState(DEFAULTS);
    const [copied, setCopied] = useState(false);
    const set = (id: Field, v: string) => setVals((s) => ({ ...s, [id]: v }));
    const r = useMemo(() => compute(vals), [vals]);

    const copy = async () => {
        if (!r) return;
        const x = r;
        const report = [
            "Vybd US profitability estimate",
            `Annual revenue: ${money(x.v.revenue)}`,
            `Average order value: ${dollars(x.v.aov)}`,
            `COGS + international shipping: ${x.v.cogs}%`,
            `Marketing: ${x.v.marketing}%`,
            `Packed weight: ${x.v.weight} lb`,
            `Box: ${x.v.length} × ${x.v.width} × ${x.v.height} in`,
            `Billable weight: ${x.billable.toFixed(2)} lb`,
            `Estimated annual shipments: ${Math.round(x.shipments).toLocaleString("en-US")}`,
            `Logistics per order: ${dollars(x.logisticsUnit)}`,
            `Annual logistics: ${money(x.logistics)}`,
            `Software tier: ${x.tier.label} (${money(x.tier.fee)}/year)`,
            `Vybd revenue share: ${Math.round(REVENUE_SHARE * 100)}%`,
            `Contribution profit: ${money(x.profit)}`,
            `Contribution margin: ${x.margin.toFixed(1)}%`,
            "Illustrative estimate, not a binding quote.",
        ].join("\n");
        try {
            await navigator.clipboard.writeText(report);
        } catch {
            const t = document.createElement("textarea");
            t.value = report;
            document.body.appendChild(t);
            t.select();
            document.execCommand("copy");
            t.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    const neg = r ? r.profit < 0 : false;

    return (
        <section id="calculator" className="wrap pc2 bleed" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }}>
            <div className="pr-top rv">
                <div className="hw2-k">{tx("Profitability calculator")}</div>
                <h2 className="pr-h">
                    {tx("Run your")} <em>{tx("numbers.")}</em>
                </h2>
                <p className="pr-sub">{tx("See what selling in the US could earn you after costs, shipping and our fees. Change any number to match your brand.")}</p>
            </div>

            <div className="pc2-grid">
                <div className="pc2-panel rv" aria-label={tx("Your assumptions")} role="group">
                    <h3 className="pc2-k">{tx("01 / Your business")}</h3>
                    <Input tx={tx} id="revenue" label="Projected yearly US sales" prefix="$" step={10000} min={0} value={vals.revenue} onChange={set} />
                    <div className="pc2-two">
                        <Input tx={tx} id="aov" label="Average order value" prefix="$" step={1} min={0.01} value={vals.aov} onChange={set} />
                        <Input tx={tx} id="cogs" label="Product cost + international shipping" suffix="%" step={1} min={0} max={100} value={vals.cogs} onChange={set} />
                    </div>
                    <Input tx={tx} id="marketing" label="Marketing spend (% of sales)" suffix="%" step={1} min={0} max={100} value={vals.marketing} onChange={set} />

                    <h3 className="pc2-k pc2-k--gap">{tx("02 / Your shipping")}</h3>
                    <Input tx={tx} id="weight" label="Packed weight per order" suffix="lb" step={0.1} min={0} value={vals.weight} onChange={set} />
                    <p className="pc2-hint">{tx("The product and its packaging together.")}</p>
                    <div className="pc2-lbl">{tx("Box size (inches)")}</div>
                    <div className="pc2-three">
                        <Input tx={tx} id="length" ariaLabel="Length in inches" suffix="L" step={0.5} min={0} value={vals.length} onChange={set} />
                        <Input tx={tx} id="width" ariaLabel="Width in inches" suffix="W" step={0.5} min={0} value={vals.width} onChange={set} />
                        <Input tx={tx} id="height" ariaLabel="Height in inches" suffix="H" step={0.5} min={0} value={vals.height} onChange={set} />
                    </div>
                    <div className="pc2-row pc2-billable">
                        <span>{tx("Billable weight")}</span>
                        <b>{r ? `${r.billable.toFixed(2)} lb` : "—"}</b>
                    </div>
                    <p className="pc2-hint">{tx("The larger of the actual weight and the box's dimensional weight.")}</p>
                </div>

                <div className="pc2-out rv" aria-live="polite">
                    <div className="pc2-out-top">
                        <h3 className="pc2-k">{tx("03 / Your US outlook")}</h3>
                        <span className="pc2-live">
                            <i /> {tx("Live estimate")}
                        </span>
                    </div>

                    {!r ? (
                        <p className="pc2-warn">{tx("Enter positive values for order value, weight and box size, and percentages from 0 to 100.")}</p>
                    ) : (
                        <>
                            <div className="pc2-kpis">
                                <div>
                                    <span>{tx("Contribution margin")}</span>
                                    <b className={neg ? "neg" : "pos"}>{r.margin.toFixed(1)}%</b>
                                </div>
                                <div>
                                    <span>{tx("Yearly contribution")}</span>
                                    <b className={neg ? "neg" : undefined}>{money(r.profit)}</b>
                                </div>
                            </div>
                            <div className="pc2-meter" aria-hidden="true">
                                <i style={{ width: `${Math.max(0, Math.min(100, r.margin))}%` }} />
                            </div>
                            <div className="pc2-minis">
                                <div>
                                    <span>{tx("Logistics per order")}</span>
                                    <b>{dollars(r.logisticsUnit)}</b>
                                </div>
                                <div>
                                    <span>{tx("Yearly logistics")}</span>
                                    <b>{money(r.logistics)}</b>
                                </div>
                            </div>
                            <div className="pc2-fees">
                                <div className="pc2-row">
                                    <span>{tx("Vybd software")}</span>
                                    <span className="pc2-tag">{tx(r.tier.label)}</span>
                                </div>
                                <div className="pc2-row">
                                    <span>{tx("Yearly software fee")}</span>
                                    <b>
                                        {money(r.tier.fee)}
                                        {tx("/yr")}
                                    </b>
                                </div>
                                <div className="pc2-row">
                                    <span>{tx("Revenue share")}</span>
                                    <b>{Math.round(REVENUE_SHARE * 100)}%</b>
                                </div>
                                <p className="pc2-hint">
                                    {tx("Software is tiered below $500K of sales and capped at {n} a year from $500K on.").replace("{n}", money(SOFTWARE_CAP))}
                                </p>
                            </div>
                            {neg && (
                                <p className="pc2-warn">
                                    {r.breakevenAov !== null
                                        ? tx("Contribution is negative at these numbers. You'd break even at an average order value of about {n}.").replace(
                                              "{n}",
                                              dollars(r.breakevenAov),
                                          )
                                        : tx("Contribution is negative at these numbers, and a higher order value alone won't fix it. Look at product, marketing and fixed costs.")}
                                </p>
                            )}
                            <details className="pc2-bd" open>
                                <summary>{tx("Full breakdown")}</summary>
                                {(
                                    [
                                        ["Yearly US sales", r.v.revenue],
                                        ["Product cost + international shipping", -r.cogs],
                                        ["US logistics (shipping, pick and pack, packaging, storage, returns)", -r.logistics],
                                        ["Marketing", -r.marketing],
                                        ["Vybd revenue share", -r.share],
                                        ["Vybd software", -r.tier.fee],
                                    ] as [string, number][]
                                ).map(([label, n]) => (
                                    <div className="pc2-row" key={label}>
                                        <span>{tx(label)}</span>
                                        <b>{signed(n)}</b>
                                    </div>
                                ))}
                                <div className="pc2-row pc2-total">
                                    <b>{tx("Yearly contribution")}</b>
                                    <b className={neg ? "neg" : "pos"}>{signed(r.profit)}</b>
                                </div>
                            </details>
                        </>
                    )}

                    <div className="pc2-actions">
                        <button type="button" className="btn btn-mint" onClick={copy} disabled={!r}>
                            {tx(copied ? "Copied to clipboard" : "Copy my estimate")}
                        </button>
                        <RdLink className="btn pc2-ghost" href="#contact">
                            {tx("Talk it through with us")}
                        </RdLink>
                    </div>
                    <p className="pc2-fine">
                        {tx("An illustrative estimate, not a quote or a promise of profit. It leaves out overheads, income tax and anything not listed here.")}
                    </p>
                </div>
            </div>

            <p className="pr-fine">
                {tx(
                    "How it works: one US shipment per order, so yearly shipments are sales divided by order value. Shipping is a simple weight-based estimate, not a live carrier rate. Per order we assume $2.50 pick and pack, $0.50 packaging, $0.50 storage and $0.60 returns; real storage depends on how much you keep and for how long, and returns on your category.",
                )}
            </p>
        </section>
    );
}
