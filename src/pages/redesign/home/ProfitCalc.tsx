import { useMemo, useState } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { MIN_MONTHLY_FEE, REVENUE_SHARE, softwareTier } from "./pricingTiers";

/* "Run your numbers": the US profitability calculator, after Pricing on
   the US page. Two equal-height cards: sliders for sales, order value,
   costs and weight on the left (box size under "Shipping details"), and on
   the right what the brand keeps a year, with a split bar of where each
   dollar of sales goes. Same model as vybd_profitability_calculator.html;
   the fees come from pricingTiers.ts so they match the Pricing labels.
   Styles: .pc4-* in HomePage.css. */

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

type Slider = { id: Field; label: string; min: number; max: number; step: number; show: (n: number) => string };

const SLIDERS: Slider[] = [
    { id: "revenue", label: "Yearly US sales", min: 50000, max: 3000000, step: 10000, show: money },
    { id: "aov", label: "Average order value", min: 5, max: 250, step: 1, show: dollars },
    { id: "cogs", label: "Product cost + international shipping", min: 0, max: 90, step: 1, show: (n) => `${n}%` },
    { id: "marketing", label: "Marketing spend (% of sales)", min: 0, max: 60, step: 1, show: (n) => `${n}%` },
    { id: "weight", label: "Packed weight per order", min: 0.1, max: 30, step: 0.1, show: (n) => `${n} lb` },
];

const SEGS = [
    { id: "cogs", label: "Product + shipping", color: "#0f1b33" },
    { id: "logistics", label: "US logistics", color: "#475569" },
    { id: "marketing", label: "Marketing", color: "#94A3B8" },
    { id: "vybd", label: "Vybd fees", color: "#9FE3D4" },
    { id: "keep", label: "You keep", color: "#1BB59B" },
] as const;

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
    const parts = r
        ? { cogs: r.cogs, logistics: r.logistics, marketing: r.marketing, vybd: r.share + r.tier.fee, keep: Math.max(0, r.profit) }
        : null;
    const total = parts ? Object.values(parts).reduce((a, b) => a + b, 0) : 0;

    return (
        <section id="calculator" className="wrap pc4 bleed" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }}>
            <div className="pr-top rv">
                <div className="hw2-k">{tx("Profitability calculator")}</div>
                <h2 className="pr-h">
                    {tx("Run your")} <em>{tx("numbers.")}</em>
                </h2>
                <p className="pr-sub">{tx("See what selling in the US could earn you after costs, shipping and our fees. Change any number to match your brand.")}</p>
            </div>

            <div className="pc4-grid">
                <div className="pc4-card pc4-in rv" role="group" aria-label={tx("Your assumptions")}>
                    <h3 className="pc4-k">{tx("Your business")}</h3>
                    {SLIDERS.map((sl) => {
                        const n = Number(vals[sl.id]);
                        const pct = Math.max(0, Math.min(100, ((n - sl.min) / (sl.max - sl.min)) * 100));
                        return (
                            <div className="pc4-sl" key={sl.id}>
                                <div className="pc4-sl-top">
                                    <label htmlFor={`pc4-${sl.id}`}>{tx(sl.label)}</label>
                                    <b>{Number.isFinite(n) ? sl.show(n) : "—"}</b>
                                </div>
                                <input
                                    id={`pc4-${sl.id}`}
                                    type="range"
                                    min={sl.min}
                                    max={sl.max}
                                    step={sl.step}
                                    value={vals[sl.id]}
                                    style={{ "--p": `${pct}%` } as React.CSSProperties}
                                    onChange={(e) => set(sl.id, e.target.value)}
                                />
                            </div>
                        );
                    })}
                    <details className="pc4-more">
                        <summary>{tx("Shipping details: box size and billable weight")}</summary>
                        <div className="pc4-three">
                            {(["length", "width", "height"] as Field[]).map((id) => (
                                <div className="pc4-box" key={id}>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        min={0}
                                        step={0.5}
                                        value={vals[id]}
                                        aria-label={tx(id === "length" ? "Length in inches" : id === "width" ? "Width in inches" : "Height in inches")}
                                        onChange={(e) => set(id, e.target.value)}
                                    />
                                    <span>{id[0].toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pc4-row">
                            <span>{tx("Billable weight")}</span>
                            <b>{r ? `${r.billable.toFixed(2)} lb` : "—"}</b>
                        </div>
                        <p className="pc4-hint">{tx("The larger of the actual weight and the box's dimensional weight.")}</p>
                    </details>
                </div>

                <div className="pc4-card pc4-out rv" aria-live="polite">
                    <h3 className="pc4-k">{tx("You'd keep about")}</h3>
                    {!r || !parts ? (
                        <p className="pc4-warn">{tx("Enter positive values for order value, weight and box size, and percentages from 0 to 100.")}</p>
                    ) : (
                        <>
                            <div className={neg ? "pc4-big neg" : "pc4-big"}>{signed(r.profit)}</div>
                            <p className="pc4-lead">
                                {tx("a year, or {n} of every dollar you sell in the US.").split("{n}")[0]}
                                <b>{r.margin.toFixed(1)}%</b>
                                {tx("a year, or {n} of every dollar you sell in the US.").split("{n}")[1]}
                            </p>
                            <div className="pc4-stack" aria-hidden="true">
                                {SEGS.map((sg) => (
                                    <i key={sg.id} style={{ flexBasis: `${total ? (parts[sg.id] / total) * 100 : 0}%`, background: sg.color }} />
                                ))}
                            </div>
                            <div className="pc4-leg">
                                {SEGS.map((sg) => (
                                    <div key={sg.id}>
                                        <span>
                                            <i style={{ background: sg.color }} />
                                            {tx(sg.label)}
                                        </span>
                                        <b>{sg.id === "keep" ? signed(r.profit) : signed(-parts[sg.id])}</b>
                                    </div>
                                ))}
                            </div>
                            <div className="pc4-facts">
                                <span>
                                    {tx("Logistics per order")} <b>{dollars(r.logisticsUnit)}</b>
                                </span>
                                <span>
                                    {tx("Orders a year")} <b>{Math.round(r.shipments).toLocaleString("en-US")}</b>
                                </span>
                                <span>
                                    {tx("Vybd fees")}{" "}
                                    <b>
                                        {Math.round(REVENUE_SHARE * 100)}% + {money(MIN_MONTHLY_FEE)}
                                        {tx("/mo")}
                                    </b>
                                </span>
                            </div>
                            {neg && (
                                <p className="pc4-warn">
                                    {r.breakevenAov !== null
                                        ? tx("Contribution is negative at these numbers. You'd break even at an average order value of about {n}.").replace(
                                              "{n}",
                                              dollars(r.breakevenAov),
                                          )
                                        : tx("Contribution is negative at these numbers, and a higher order value alone won't fix it. Look at product, marketing and fixed costs.")}
                                </p>
                            )}
                        </>
                    )}
                    <div className="pc4-actions">
                        <button type="button" className="btn btn-mint" onClick={copy} disabled={!r}>
                            {tx(copied ? "Copied to clipboard" : "Copy my estimate")}
                        </button>
                        <RdLink className="btn pc4-ghost" href="#contact">
                            {tx("Talk it through with us")}
                        </RdLink>
                    </div>
                </div>
            </div>

            <p className="pr-fine">
                {tx("An illustrative estimate, not a quote or a promise of profit. It leaves out overheads, income tax and anything not listed here.")}{" "}
                {tx(
                    "How it works: one US shipment per order, so yearly shipments are sales divided by order value. Shipping is a simple weight-based estimate, not a live carrier rate. Per order we assume $2.50 pick and pack, $0.50 packaging, $0.50 storage and $0.60 returns; real storage depends on how much you keep and for how long, and returns on your category.",
                )}
            </p>
        </section>
    );
}
