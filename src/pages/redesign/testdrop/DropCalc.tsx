import { useId, useState } from "react";
import { DROP_FEE, DROP_MAX_UNITS, DROP_SHARE } from "./data";

/* "Run your drop" on /test-drop: the deck's sold-out-tees example (slide 6)
   as a calculator. Defaults reproduce the deck: 500 tees at $38, $5 each,
   35% duty, 1.3 items per order, $6 postage, 3% card fees, full sell-through,
   leaving $6,895 before marketing. Freight, storage, pick/pack and packaging
   are inside the Test Drop fee, so they show as $0. Styles: .dc-* in
   TestDropPage.css. */

const PAYMENT_FEE = 0.03;

type Inputs = {
    units: number;
    price: number;
    cost: number;
    duty: number; // percent of product cost
    sellThrough: number; // percent
    perOrder: number; // items per order
    postage: number; // per order
    customerPaysPostage: boolean;
};

const DEFAULTS: Inputs = { units: 500, price: 38, cost: 5, duty: 35, sellThrough: 100, perOrder: 1.3, postage: 6, customerPaysPostage: false };

const usd = (n: number) => (n < 0 ? "−" : "") + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");

function dropMath(i: Inputs) {
    const sold = Math.round(i.units * (i.sellThrough / 100));
    const orders = Math.round(sold / Math.max(1, i.perOrder));
    const sales = sold * i.price;
    const share = sales * DROP_SHARE;
    const product = i.units * i.cost;
    const duty = product * (i.duty / 100);
    const postage = i.customerPaysPostage ? 0 : orders * i.postage;
    const payments = sales * PAYMENT_FEE;
    const left = sales - share - DROP_FEE - product - duty - postage - payments;
    /* Units sold to cover every cost: fixed costs over what each sold unit keeps. */
    const perUnit = i.price * (1 - DROP_SHARE - PAYMENT_FEE) - (i.customerPaysPostage ? 0 : i.postage / Math.max(1, i.perOrder));
    const breakEven = perUnit > 0 ? Math.ceil((DROP_FEE + product + duty) / perUnit) : Infinity;
    const rows: [string, number][] = [
        [`US sales (${sold.toLocaleString("en-US")} × $${i.price})`, sales],
        [`Vybd revenue share (${DROP_SHARE * 100}%)`, -share],
        ["Test Drop fee", -DROP_FEE],
        [`Product cost (${i.units} × $${i.cost})`, -product],
        [`Import duties (${i.duty}% of product cost)`, -duty],
        [i.customerPaysPostage ? "US postage (paid by customers)" : `US postage (${orders} orders × $${i.postage})`, -postage],
        [`Payment processing (${PAYMENT_FEE * 100}%)`, -payments],
        ["Freight to the US", 0],
        ["Warehousing, pick, pack and packaging", 0],
    ];
    return { sold, orders, rows, left, breakEven };
}

function Field({ label, value, onChange, min, max, step, prefix, suffix }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step: number;
    prefix?: string;
    suffix?: string;
}) {
    const id = useId();
    return (
        <div className="dc-field">
            <label htmlFor={id}>{label}</label>
            <div className="dc-input">
                {prefix && <span>{prefix}</span>}
                <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    min={min}
                    max={max}
                    step={step}
                    value={Number.isFinite(value) ? value : ""}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        onChange(Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : 0);
                    }}
                />
                {suffix && <span>{suffix}</span>}
            </div>
        </div>
    );
}

export default function DropCalc() {
    const [i, setI] = useState<Inputs>(DEFAULTS);
    const set = (k: keyof Inputs) => (v: number | boolean) => setI((p) => ({ ...p, [k]: v }));
    const m = dropMath(i);
    const stId = useId();

    return (
        <div className="dc rv">
            <div className="dc-controls">
                <button type="button" className="dc-reset" onClick={() => setI(DEFAULTS)}>
                    Reset to the example
                </button>
                <div className="dc-fields">
                    <Field label="Units in the drop" value={i.units} onChange={set("units")} min={1} max={DROP_MAX_UNITS} step={10} />
                    <Field label="US retail price" value={i.price} onChange={set("price")} min={0} max={10000} step={1} prefix="$" />
                    <Field label="Product cost per unit" value={i.cost} onChange={set("cost")} min={0} max={10000} step={0.5} prefix="$" />
                    <Field label="Import duty" value={i.duty} onChange={set("duty")} min={0} max={200} step={1} suffix="%" />
                    <Field label="Items per order" value={i.perOrder} onChange={set("perOrder")} min={1} max={20} step={0.1} />
                    <Field label="US postage per order" value={i.postage} onChange={set("postage")} min={0} max={500} step={0.5} prefix="$" />
                </div>
                <div className="dc-range">
                    <label htmlFor={stId}>
                        Sell-through <b>{i.sellThrough}%</b>
                    </label>
                    <input id={stId} type="range" min={0} max={100} step={5} value={i.sellThrough} onChange={(e) => set("sellThrough")(Number(e.target.value))} />
                </div>
                <label className="dc-check">
                    <input type="checkbox" checked={i.customerPaysPostage} onChange={(e) => set("customerPaysPostage")(e.target.checked)} />
                    Customers pay postage at checkout
                </label>
            </div>

            <div className="dc-out" aria-live="polite">
                <table>
                    <caption className="sr-only">Test Drop profit estimate</caption>
                    <tbody>
                        {m.rows.map(([label, amt]) => (
                            <tr key={label}>
                                <th scope="row">{label}</th>
                                <td className={amt === 0 ? "zero" : undefined}>{amt === 0 ? "$0" : usd(amt)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row">Left before marketing</th>
                            <td className={m.left < 0 ? "neg" : undefined}>{usd(m.left)}</td>
                        </tr>
                    </tfoot>
                </table>
                <p className="dc-be">
                    {Number.isFinite(m.breakEven) && m.breakEven <= i.units ? (
                        <>
                            Break-even at <b>{m.breakEven.toLocaleString("en-US")} units sold</b> ({Math.ceil((m.breakEven / i.units) * 100)}% sell-through).
                        </>
                    ) : (
                        <>At this price and cost, the drop doesn't break even. Try a higher price or a lower product cost.</>
                    )}
                </p>
            </div>
        </div>
    );
}
