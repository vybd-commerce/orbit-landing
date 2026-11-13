import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { SIGNUP_URL } from "./pricingTiers";

/* The three sizes on the Borderless home (/), under the idea: Plan
   (the self-serve Vybd Plan app, early access, with Test Drop, US Launch
   and US Scale as services on top), US Scale (already selling in the US) and Enterprise
   ($50M+ with their own warehouses). Each card has its CTA (sign up or
   contact sales) at the bottom, and a link in the top row to the page
   that goes deeper (/us or /enterprise). Styles: .tc-* in HomePage.css. */

type Tier = {
    id: string;
    name: string;
    who: string;
    price: string;
    priceNote: string | null;
    includes: string[];
    addOns?: { title: string; items: string[] };
    cta: { label: string; href: string };
    more: { label: string; href: string };
    featured?: boolean;
};

const TIERS: Tier[] = [
    {
        id: "plan",
        name: "Plan",
        who: "For makers and young brands working out whether, and how, to sell in the US.",
        price: "Early access",
        priceNote: "then $33 / month, first week free",
        includes: [
            "US demand and competitors in your category",
            "Who buys it in the US, and how to position it",
            "US pricing and margins",
            "Which channels to start on: Amazon, Walmart, DTC or retail",
            "Leave with a US go-to-market plan",
        ],
        addOns: {
            title: "Ready to make it real? Our team builds it",
            items: [
                "Test the US first: one Test Drop of up to 500 units, $3,000 + 15% of US sales",
                "Sourcing and manufacturer matching",
                "FDA and compliance support, label review",
                "Amazon, Walmart and Shopify store set up",
                "Listings, product copy, images and video",
                "US buyer list and launch plan",
                "Our agents run inventory, purchase orders, deductions and reporting",
                "A senior operator, 8 hours a month",
            ],
        },
        cta: { label: "Get early access", href: SIGNUP_URL },
        more: { label: "See pricing", href: "/us#pricing" },
        featured: true,
    },
    {
        id: "scale",
        name: "US Scale",
        who: "For brands already selling in the US, up to $50M, running on 3PLs.",
        price: "Starts at $3K",
        priceNote: "per month, plus 12% of US sales",
        includes: [
            "Our agents run inventory, purchase orders, deductions and reporting",
            "Multi-3PL, multi-channel orchestration",
            "Deductions and chargeback recovery",
            "Supplier management",
            "ERP and EDI integrations",
            "A dedicated operator",
        ],
        cta: { label: "Talk to us about US Scale", href: "/book?for=scale" },
        more: { label: "See pricing", href: "/us#pricing" },
    },
    {
        id: "enterprise",
        name: "Enterprise",
        who: "For $50M+ brands, grocers and retailers with their own warehouses and stores.",
        price: "Custom",
        priceNote: null,
        includes: [
            "Everything in US Scale",
            "Agents across warehouses, stores and DCs",
            "NetSuite, SAP, Dynamics 365 and Odoo connected",
            "Forecasting across large SKU counts",
            "A dedicated team and SLAs",
            "Security review",
        ],
        cta: { label: "Talk to an operator", href: "/book?for=enterprise" },
        more: { label: "How it works", href: "/enterprise" },
    },
];

const Arrow = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const Check = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
);

export default function TierCards({ tx }: { tx: Tx }) {
    return (
        <section id="start" className="wrap tc" aria-label={tx("Plans")}>
            <h2 className="tc-h rv">{tx("Pick your size.")}</h2>
            <div className="tc-grid">
                {TIERS.map((t) => (
                    <article key={t.id} className={t.featured ? "tc-card tc-card--featured rv" : "tc-card rv"}>
                        <div className="tc-top">
                            <span className="tc-name">
                                {tx(t.name)}
                                {t.featured && <span className="tc-tag">{tx("Start here")}</span>}
                            </span>
                            <RdLink className="tc-more" href={t.more.href} ariaLabel={`${tx(t.name)}: ${tx(t.more.label)}`}>
                                {tx(t.more.label)} <Arrow />
                            </RdLink>
                        </div>
                        <p className="tc-who">{tx(t.who)}</p>
                        <div className="tc-price">
                            <b>{tx(t.price)}</b>
                            {t.priceNote && <span>{tx(t.priceNote)}</span>}
                        </div>
                        <ul className="tc-list">
                            {t.includes.map((item) => (
                                <li key={item}>
                                    <Check />
                                    {tx(item)}
                                </li>
                            ))}
                        </ul>
                        {t.addOns && (
                            <div className="tc-add">
                                <span className="tc-add-k">{tx(t.addOns.title)}</span>
                                <ul className="tc-list tc-list--add">
                                    {t.addOns.items.map((item) => (
                                        <li key={item}>
                                            <span className="tc-plus" aria-hidden="true">+</span>
                                            {tx(item)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="tc-actions">
                            <RdLink className={t.featured ? "btn btn-mint" : "btn btn-ghost"} href={t.cta.href}>
                                {tx(t.cta.label)}
                            </RdLink>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
