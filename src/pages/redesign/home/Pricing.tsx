import { useState, type CSSProperties } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { APP_MONTHLY, MIN_MONTHLY_FEE, REVENUE_SHARE, SIGNUP_URL, softwareTier } from "./pricingTiers";

/* Plans drawn as shipping labels, in order: Vybd Plan (the self-serve app
   for a US market plan: research, positioning, pricing; flat monthly,
   first week free), then the services where our team does the work: a
   one-time US Launch (sourcing to shelves, for new brands and new
   entries) and the monthly US Scale (where anyone already selling in the
   US starts), whose card carries a slider for the yearly cost at a given
   level of US sales (the flat software fee plus 12% of sales, see
   pricingTiers.ts). A Plan / Launch / Scale comparison sits under the
   labels; the full profitability calculator follows (#calculator). */

const Tick = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
);

const APP = [
    "US demand and competitors in your category",
    "Who buys it in the US, and how to position it",
    "US pricing and margins",
    "Which channels to start on: Amazon, Walmart, DTC or retail",
];

/* Plan / Launch / Scale side by side. true = included, a string = included
   with that note, false = not included. */
const COMPARE: [string, boolean | string, boolean | string, boolean | string][] = [
    ["Who does the work", "You, with the app", "Our team", "Our team"],
    ["US market research and positioning", true, true, "Monthly"],
    ["Sourcing and manufacturer matching", false, true, false],
    ["FDA and compliance support", false, true, false],
    ["Store set up and listings", false, true, "Ongoing updates"],
    ["Agents run inventory, POs and deductions", false, false, true],
    ["A senior operator", false, false, "8 hours a month"],
];
const LAUNCH = [
    "Sourcing and manufacturer matching",
    "Diagnostic sprint included ($5K value)",
    "FDA and compliance support, label review",
    "Amazon, Walmart and Shopify store set up",
    "Listings, product copy, images and video",
    "US buyer list and launch plan",
];
const SCALE = [
    "Our agents run inventory, purchase orders, deductions and reporting",
    "A senior operator, 8 hours a month",
    "Ongoing content and listing updates",
    "Monthly market and buyer research",
];

const MIN = 100_000,
    MAX = 10_000_000;
const CHIPS: [number, string][] = [
    [500_000, "$500K"],
    [1_000_000, "$1M"],
    [5_000_000, "$5M"],
    [10_000_000, "$10M"],
];
const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function Contents({ tx, items, last }: { tx: Tx; items: string[]; last?: string }) {
    return (
        <div className="lb-con">
            <span className="lb-k">{tx("CONTENTS")}</span>
            <ul className="lb-list">
                {items.map((t) => (
                    <li key={t}>
                        <Tick />
                        <span>{tx(t)}</span>
                    </li>
                ))}
                {last && (
                    <li>
                        <Tick />
                        <span>
                            <b>{tx(last)}</b>
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
}

function Route({ tx, from, to }: { tx: Tx; from: string; to: string }) {
    return (
        <div className="lb-ft">
            <div>
                <small>{tx("FROM")}</small>
                <b>{tx(from)}</b>
            </div>
            <div>
                <small>{tx("TO")}</small>
                <b>{tx(to)}</b>
            </div>
        </div>
    );
}

export default function Pricing({ tx }: { tx: Tx }) {
    const [sales, setSales] = useState(500_000);
    const fill = (((sales - MIN) / (MAX - MIN)) * 100).toFixed(2) + "%";
    const fee = Math.round((softwareTier(sales).fee + sales * REVENUE_SHARE) / 1000) * 1000;

    return (
        <section id="pricing" className="wrap pr bleed" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }}>
            <div className="pr-top rv">
                <div className="hw2-k">{tx("Pricing")}</div>
                <h2 className="pr-h">
                    {tx("Pick your")} <em>{tx("postage.")}</em>
                </h2>
                <p className="pr-sub">{tx("Work out your US plan with Vybd Plan for $33 a month. When you're ready, our team launches you, then runs it with you. Already selling in the US? Start with US Scale.")}</p>
            </div>
            <article className="lb lb-app rv">
                <div className="lb-top">
                    <span>{tx("VYBD POST")}</span>
                    <span>{tx("START HERE")}</span>
                </div>
                <div className="lb-app-body">
                    <div>
                        <div className="lb-name">
                            <h3>{tx("Vybd Plan")}</h3>
                            <div className="lb-stamp" aria-hidden="true">
                                <div>
                                    {tx("FREE")}
                                    <small>{tx("FIRST WEEK")}</small>
                                </div>
                            </div>
                        </div>
                        <div className="lb-price">
                            <div className="lb-amt">
                                ${APP_MONTHLY}
                                <small>{tx("/ month")}</small>
                            </div>
                            <div className="lb-once">{tx("Free for your first week")}</div>
                            <p className="lb-note">
                                {tx("Plan tells you what to do. Sourcing, compliance, stores, freight and running the operation are US Launch and US Scale, done by our team.")}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Contents tx={tx} items={APP} last="Leave with a US go-to-market plan" />
                        <div className="lb-foot">
                            <div className="lb-bars" aria-hidden="true"></div>
                            <div className="lb-trk">
                                <span>VYBD-PLAN</span>
                                <span>{tx("STEP 00")}</span>
                            </div>
                            <RdLink className="btn btn-mint" href={SIGNUP_URL}>
                                {tx("Start your free week")}
                            </RdLink>
                        </div>
                    </div>
                </div>
            </article>
            <div className="pr-grid">
                <article className="lb rv">
                    <div className="lb-top">
                        <span>{tx("VYBD POST")}</span>
                        <span>{tx("NEW TO THE US")}</span>
                    </div>
                    <Route tx={tx} from="Your plan" to="US shelves, 90 days from first stock" />
                    <div className="lb-name">
                        <h3>{tx("US Launch")}</h3>
                        <div className="lb-stamp" aria-hidden="true">
                            <div>
                                {tx("DAY")}
                                <small>{tx("ZERO")}</small>
                            </div>
                        </div>
                    </div>
                    <div className="lb-price">
                        <div className="lb-amt">$20,000</div>
                        <div className="lb-once">{tx("Paid once")}</div>
                    </div>
                    <Contents tx={tx} items={LAUNCH} last="Landed, listed and selling 90 days from first stock" />
                    <div className="lb-foot">
                        <div className="lb-bars" aria-hidden="true"></div>
                        <div className="lb-trk">
                            <span>VYBD-LAUNCH-US</span>
                            <span>{tx("STEP 01")}</span>
                        </div>
                        <RdLink className="btn btn-dark" href="#contact">
                            {tx("Start your launch")}
                        </RdLink>
                    </div>
                </article>
                <article className="lb alt rv">
                    <div className="lb-top">
                        <span>{tx("VYBD POST")}</span>
                        <span>{tx("ALREADY SELLING")}</span>
                    </div>
                    <Route tx={tx} from="Selling in the US" to="Selling more, with less to run" />
                    <div className="lb-name">
                        <h3>{tx("US Scale")}</h3>
                        <div className="lb-stamp" aria-hidden="true">
                            <div>
                                {tx("EVERY")}
                                <small>{tx("MONTH")}</small>
                            </div>
                        </div>
                    </div>
                    <div className="lb-price">
                        <div className="lb-amt">
                            <small>{tx("from")}</small>
                            {usd(MIN_MONTHLY_FEE)}
                            <small>{tx("/ month")}</small>
                        </div>
                        <div className="lb-plus">
                            <b>+ {Math.round(REVENUE_SHARE * 100)}%</b>
                            <span>{tx("of US sales")}</span>
                        </div>
                    </div>
                    <Contents tx={tx} items={SCALE} />
                    <div className="lb-calc">
                        <div className="lb-calc-l">
                            <span>{tx("Your yearly US sales")}</span>
                            <b>{usd(sales) + (sales >= MAX ? "+" : "")}</b>
                        </div>
                        <input
                            type="range"
                            min={MIN}
                            max={MAX}
                            step={100_000}
                            value={sales}
                            style={{ "--p": fill } as CSSProperties}
                            onChange={(e) => setSales(+e.target.value)}
                            aria-label={tx("Your yearly US sales")}
                        />
                        <div className="pr-chips">
                            {CHIPS.map(([v, label]) => (
                                <button key={v} type="button" className={v === sales ? "on" : ""} onClick={() => setSales(v)}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="lb-calc-o">
                            <span>{tx("US Scale costs about")}</span>
                            <span>
                                <b>{usd(fee)}</b> <span>{tx("a year")}</span>
                            </span>
                        </div>
                        <p className="lb-calc-n">
                            {tx("Software is a flat {n} a month.").replace("{n}", usd(MIN_MONTHLY_FEE))} {tx("Plus shipping and warehousing fees.")}
                        </p>
                        <RdLink className="lb-calc-go" href="#calculator">
                            {tx("Run your full numbers")} <span aria-hidden="true">↓</span>
                        </RdLink>
                    </div>
                    <div className="lb-foot">
                        <div className="lb-bars" aria-hidden="true"></div>
                        <div className="lb-trk">
                            <span>VYBD-SCALE-US</span>
                            <span>{tx("STEP 02")}</span>
                        </div>
                        <RdLink className="btn btn-mint" href="#contact">
                            {tx("Talk to us about US Scale")}
                        </RdLink>
                    </div>
                </article>
            </div>
            <div className="cmp rv" role="region" aria-label={tx("Compare Plan, Launch and Scale")}>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">
                                <span className="cmp-sr">{tx("What you get")}</span>
                            </th>
                            <th scope="col">{tx("Vybd Plan")}</th>
                            <th scope="col">{tx("US Launch")}</th>
                            <th scope="col">{tx("US Scale")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPARE.map(([row, ...cells]) => (
                            <tr key={row}>
                                <th scope="row">{tx(row)}</th>
                                {cells.map((c, i) => (
                                    <td key={i}>
                                        {c === true ? (
                                            <span className="cmp-y" role="img" aria-label={tx("Included")}>
                                                <Tick />
                                            </span>
                                        ) : c === false ? (
                                            <span className="cmp-n" role="img" aria-label={tx("Not included")}>
                                                –
                                            </span>
                                        ) : (
                                            tx(c)
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="lb-part rv">
                <b>{tx("PARTNER")}</b>
                <span>{tx("By invitation, after six months of real numbers: lower fees, a higher revenue share and an equity stake.")}</span>
            </div>
            <p className="pr-fine">{tx("All prices in US dollars. Shipping and warehousing fees are charged separately, based on what you ship and store.")}</p>
        </section>
    );
}
