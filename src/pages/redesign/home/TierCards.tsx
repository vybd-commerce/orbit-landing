import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { SIGNUP_URL } from "./pricingTiers";

/* The three sizes on the Borderless home (/), under the idea: Plan
   (the self-serve Vybd Plan app, up to $10M, with US Launch and US Scale
   as services on top), Scale ($10M-$50M on 3PLs) and Enterprise
   ($50M+ with their own warehouses). Each card has its CTA (sign up or
   contact sales) and a text link to the page that goes deeper (/us or
   /enterprise). Styles: .tc-* in HomePage.css. */

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
        who: "For anyone with a brand idea, or a young brand finding its feet.",
        price: "Free for a week",
        priceNote: "then $33 / month",
        includes: [
            "Learn how brands are built, step by step",
            "Research your market and competitors",
            "Find your customer and your positioning",
            "Work out your name, story and pricing",
            "Leave with a brand plan you can act on",
        ],
        addOns: {
            title: "Ready to make it real? Our team builds it",
            items: [
                "Sourcing and manufacturer matching",
                "FDA and compliance support, label review",
                "Amazon, Walmart and Shopify store set up",
                "Listings, product copy, images and video",
                "US buyer list and launch plan",
                "Our agents run inventory, purchase orders, deductions and reporting",
                "A senior operator, 8 hours a month",
            ],
        },
        cta: { label: "Start your free week", href: SIGNUP_URL },
        more: { label: "See Launch and Scale pricing", href: "/us#pricing" },
        featured: true,
    },
    {
        id: "scale",
        name: "Scale",
        who: "For brands doing $10M to $50M, running on 3PLs.",
        price: "Starts at $3K",
        priceNote: "per month",
        includes: [
            "Everything in US Launch and US Scale",
            "Multi-3PL, multi-channel orchestration",
            "Deductions and chargeback recovery",
            "Supplier management",
            "ERP and EDI integrations",
            "A dedicated operator",
        ],
        cta: { label: "Contact sales", href: "/book" },
        more: { label: "How it works at scale", href: "/enterprise" },
    },
    {
        id: "enterprise",
        name: "Enterprise",
        who: "For $50M+ brands, grocers and retailers with their own warehouses and stores.",
        price: "Custom",
        priceNote: null,
        includes: [
            "Everything in Scale",
            "Agents across warehouses, stores and DCs",
            "WMS and ERP integration",
            "Forecasting across large SKU counts",
            "A dedicated team and SLAs",
            "Security review",
        ],
        cta: { label: "Contact sales", href: "/book" },
        more: { label: "Vybd for enterprise", href: "/enterprise" },
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
        <section id="tiers" className="wrap tc" aria-label={tx("Plans")}>
            <h2 className="tc-h rv">{tx("Pick your size.")}</h2>
            <div className="tc-grid">
                {TIERS.map((t) => (
                    <article key={t.id} className={t.featured ? "tc-card tc-card--featured rv" : "tc-card rv"}>
                        <div className="tc-top">
                            <span className="tc-name">{tx(t.name)}</span>
                            {t.featured && <span className="tc-tag">{tx("Start here")}</span>}
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
                            <RdLink className="tc-more" href={t.more.href}>
                                {tx(t.more.label)} <Arrow />
                            </RdLink>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
