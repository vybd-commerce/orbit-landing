import { useState, type CSSProperties } from "react";
import { RdLink } from "../chrome";
import type { Tx } from "../i18n";

/* Two plans drawn as shipping labels: a one-time US Launch and the monthly
   US Scale, whose card carries a calculator for the yearly cost at a given
   level of US sales ($3,000 a month plus 12% of sales). */

const Tick = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
);

const LAUNCH = [
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
    const fee = Math.round((36_000 + sales * 0.12) / 1000) * 1000;

    return (
        <section id="pricing" className="wrap pr bleed" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)" }}>
            <div className="pr-top rv">
                <div className="hw2-k">{tx("Pricing")}</div>
                <h2 className="pr-h">
                    {tx("Pick your")} <em>{tx("postage.")}</em>
                </h2>
                <p className="pr-sub">{tx("A one-time fee gets you selling in the US. After that, one monthly plan keeps it running and growing.")}</p>
            </div>
            <div className="pr-grid">
                <article className="lb rv">
                    <div className="lb-top">
                        <span>{tx("VYBD POST")}</span>
                        <span>{tx("ONE-TIME")}</span>
                    </div>
                    <Route tx={tx} from="Your factory" to="US shelves in 90 days" />
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
                    <Contents tx={tx} items={LAUNCH} last="Landed, listed and selling in 90 days" />
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
                            $3,000<small>{tx("/ month")}</small>
                        </div>
                        <div className="lb-plus">
                            <b>+ 12%</b>
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
                        <p className="lb-calc-n">{tx("Plus shipping and warehousing fees.")}</p>
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
