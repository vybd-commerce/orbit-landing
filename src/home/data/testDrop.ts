/* Copy and numbers for /test-drop (TestDropApp.tsx), ported from
   src/pages/redesign/testdrop (the "Sell in the US" deck). The ladder after
   the Test Drop (US Launch, US Scale, Partner) is the one on /us
   (src/pages/redesign/home/Pricing.tsx) and the home page (data/pricing.ts);
   change all three together. */

/* Test Drop terms, shared by the offer, the calculator and the FAQ. */
export const DROP_FEE = 3_000;
export const DROP_SHARE = 0.15;
export const DROP_MAX_UNITS = 500;
export const STORAGE_DAYS = 90;
export const GO_LIVE = "4–6 weeks";

export const BOOK = "/book?for=drop";

export const FREIGHT_NOTE = `Free freight covers up to ${DROP_MAX_UNITS} units, depending on dimensions and weight. Customs fees and import duties are not included.`;

/* "You" steps get the mint tint, as in the deck. */
export const FLOW: { who: "you" | "us"; title: string; body: string }[] = [
    { who: "you", title: "You ship", body: "Send inventory to the US in one consolidated shipment." },
    { who: "us", title: "We clear", body: "US import, customs and compliance checks." },
    { who: "us", title: "We store", body: "Stock is received, counted and ready to sell." },
    { who: "you", title: "You sell", body: "You drive demand. Customers order from your US store." },
    { who: "us", title: "We fulfill", body: "Pick, pack, ship and handle returns." },
    { who: "us", title: "We pay out", body: "Monthly payout with a clear sales statement." },
];

export const PILLARS: [string, string][] = [
    ["One accountable partner", "One team coordinating your US operations."],
    ["Connected visibility", "Inventory, orders and performance in one place."],
    ["AI-enabled execution", "Routine tasks automated, issues surfaced earlier."],
];

export const YOU_OWN = ["Product, inventory and pricing", "Import duties, and freight beyond the Test Drop*", "Marketing and your audience", "Drop timing and creative"];
export const WE_OWN = ["US import and customs clearance", "US compliance and admin", "Warehousing, fulfillment and returns", "Sales reporting and payouts"];

export const INCLUDED = [
    `Freight to the US, up to ${DROP_MAX_UNITS} units*`,
    "Customs clearance handled for you",
    `${STORAGE_DAYS} days of US warehousing`,
    "Pick, pack and returns for every order",
    "US checkout set up on your store",
    "End-of-drop sales report",
];
export const YOU_COVER = ["Product", "Customs fees and import duties", "US postage, often paid by customers at checkout", "Marketing your drop"];

export type Tier = {
    badge: string;
    name: string;
    price: string;
    terms: string;
    line?: string;
    points: string[];
    cta: string;
    /** Where the CTA goes; BOOK when unset. */
    href?: string;
    style: "drop" | "plain" | "partner";
};

/* Slides 4 and 7 merged: the price card plus what each stage does. */
export const TIERS: Tier[] = [
    {
        badge: `Up to ${DROP_MAX_UNITS} units*`,
        name: "Test Drop",
        price: "$3,000",
        terms: "one time + 15% of US sales",
        line: "One limited drop to test the US market.",
        points: ["Freight to the US on us*", "Storage and fulfillment included", "End-of-drop sales report"],
        cta: "Start with a Test Drop",
        style: "drop",
    },
    {
        badge: "When the drop proves demand",
        name: "US Launch",
        price: "$20,000",
        terms: "paid once",
        line: "Landed, listed and selling 90 days from first stock.",
        points: ["Sourcing and manufacturer matching", "FDA and compliance support, label review", "Amazon, Walmart and Shopify store set up", "Listings, product copy, images and video", "US buyer list and launch plan"],
        cta: "Talk about US Launch",
        href: "/book?for=launch",
        style: "plain",
    },
    {
        badge: "Selling every month",
        name: "US Scale",
        price: "From $3,000/mo",
        terms: "+ 12% of US sales + shipping and warehousing as used",
        line: "AI agents do the work, you approve the big calls.",
        points: [
            "Our agents run inventory, purchase orders, deductions and reporting",
            "A senior operator, 8 hours a month",
            "Ongoing content and listing updates",
            "Monthly market and buyer research",
        ],
        cta: "Talk about US Scale",
        href: "/book?for=scale",
        style: "plain",
    },
    {
        badge: "Proven US demand",
        name: "Partner",
        price: "Custom",
        terms: "Shared ownership of your US business",
        points: ["We co-invest in inventory and operations", "Joint venture or exclusive license", "Profit share on US results"],
        cta: "Talk to us",
        style: "partner",
    },
];

export const PROOF = {
    brand: "Bayangrom",
    about: "An Indian art and apparel brand we help run in the US.",
    stats: [
        ["−28%", "Excess inventory"],
        ["−22%", "Shipping cost"],
        ["$180K/yr", "Recovered value"],
    ] as [string, string][],
    story: [
        ["The challenge", "Inventory and shipping costs were eroding US profitability."],
        ["The Vybd approach", "Connected operations: inventory visibility, logistics coordination and reporting."],
        ["The outcome", "Lower inventory and shipping costs, measured."],
    ] as [string, string][],
    note: "Reported results; baselines and measurement periods available on request.",
};

export const ORIGINS = ["India", "South Korea", "China", "France"];

export const NEXT: [string, string, string][] = [
    ["Free · 30 minutes", "Intro call", "Your brand, your audience and your goals for the US."],
    ["You choose", "Pick the drop", `Choose designs and quantities, up to ${DROP_MAX_UNITS} units.`],
    ["We handle it", "Ship to us", "We bring it in, clear customs and stock it."],
    [`Typically ${GO_LIVE}`, "Go live", "Your drop goes on sale to US customers."],
];

/* Only questions the deck answers. Still open, and worth adding once
   decided: what happens to unsold stock after the 90 days, whether the 15%
   is on gross or net sales and when the Test Drop pays out, who is the
   importer of record, and which categories (food, cosmetics, batteries)
   the Test Drop takes. */
export const FAQ: [string, string][] = [
    [
        "What does the Test Drop cost?",
        `$3,000 one time, plus 15% of your US sales. That covers freight to the US for up to ${DROP_MAX_UNITS} units, customs clearance, ${STORAGE_DAYS} days of warehousing, pick, pack and returns for every order, US checkout on your store, and an end-of-drop sales report.`,
    ],
    [
        "What isn't included?",
        "Your product, customs fees and import duties, US postage (often paid by your customers at checkout), and marketing your drop. Duty rates depend on your product.",
    ],
    [
        `Is freight really free for ${DROP_MAX_UNITS} units?`,
        `On the Test Drop, Vybd covers freight from your country to the US for up to ${DROP_MAX_UNITS} units. Very large or heavy products may need a smaller quantity; we confirm it from your dimensions and weights before you ship.`,
    ],
    ["How long until we're selling?", `Typically ${GO_LIVE} from kickoff to your drop going live.`],
    [
        "Who brings the customers?",
        "You do. You own the brand, the audience and the creative, and you choose when the drop goes live. We run everything after the order: stock, fulfillment, returns and reporting.",
    ],
    [
        "What happens if the drop sells well?",
        "Move to US Launch for a full launch: sourcing, compliance, stores and listings, landed and selling 90 days from first stock. Then US Scale runs it month to month. You grow at the pace your sales justify.",
    ],
];
