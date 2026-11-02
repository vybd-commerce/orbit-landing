import { useState, type CSSProperties } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { APP_MONTHLY, MIN_MONTHLY_FEE, REVENUE_SHARE, SIGNUP_URL, SOFTWARE_CAP, softwareTier } from "./pricingTiers";

/* Plans drawn as shipping labels, in order: Vybd Plan (the self-serve app
   that helps plan a brand: research, positioning, pricing; flat monthly,
   first week free), then the services where our team does the work: a
   one-time US Launch (sourcing to shelves) and the monthly US Scale, whose card carries a slider for the yearly cost at a given
   level of US sales (the software tier for those sales plus 12% of them,
   see pricingTiers.ts). The full profitability calculator follows this
   section (#calculator). */

const Tick = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
);

const APP = [
    "Learn how brands are built, step by step",
    "Research your market and competitors",
    "Find your customer and your positioning",
    "Work out your name, story and pricing",
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
    MAX = 3_000_000;
const CHIPS: [number, string][] = [
    [250_000, "$250K"],
    [500_000, "$500K"],
    [1_000_000, "$1M"],
    [2_000_000, "$2M"],
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
                <p className="pr-sub">{tx("Plan your brand with Vybd Plan for $33 a month. When you're ready to make it real, our team launches it, then scales it.")}</p>
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
                        </div>
                    </div>
                    <div>
                        <Contents tx={tx} items={APP} last="Leave with a brand plan you can act on" />
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
                        <span>{tx("ONE-TIME")}</span>
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
                        <span>{tx("RECOMMENDED NEXT")}</span>
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
                            step={50_000}
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
                            {tx("Software is tiered by sales and capped at {n} a year.").replace("{n}", usd(SOFTWARE_CAP))} {tx("Plus shipping and warehousing fees.")}
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
            <div className="lb-part rv">
                <b>{tx("PARTNER")}</b>
                <span>{tx("By invitation, after six months of real numbers: lower fees, a higher revenue share and an equity stake.")}</span>
            </div>
            <p className="pr-fine">{tx("All prices in US dollars. Shipping and warehousing fees are charged separately, based on what you ship and store.")}</p>
        </section>
    );
}
