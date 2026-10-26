/* The six case studies as the redesign shows them in its index (from
   redesign/pages/CaseStudies.dc.html). The detail pages have their own copy
   in ./caseDetails. Slugs match src/data/caseStudies.ts. */

export type CaseGroup = "food" | "retail" | "fashion" | "art" | "health";

export type CaseSummary = {
    slug: string;
    brand: string;
    short: string;
    group: CaseGroup;
    category: string;
    icon: string;
    title: string;
    desc: string;
    metrics: [string, string][];
};

export const CASES: CaseSummary[] = [
    {
        slug: "the-indian-tapas",
        brand: "The Indian Tapas",
        short: "Food & Bev",
        group: "food",
        category: "Food & Beverage",
        icon: "M3 11h18a9 9 0 0 1-18 0zM8 7.5c0-1.5 1-2 1-3.5M12 7.5c0-1.5 1-2 1-3.5M16 7.5c0-1.5 1-2 1-3.5",
        title: "A US growth plan for an Indian quick-service restaurant brand",
        desc: "We got The Indian Tapas ready for the US: how to present the brand, which dishes to lead with, and a growth plan based on what US shoppers actually look for.",
        metrics: [
            ["3", "Core menu categories chosen"],
            ["High Intent", "Plan to reach ready-to-buy diners"],
            ["Direct", "Sells straight to customers"],
        ],
    },
    {
        slug: "emsworth",
        brand: "Emsworth",
        short: "Home Textiles",
        group: "retail",
        category: "Retail / Home Textiles",
        icon: "M4 6h16v12H4zM4 10h16M4 14h16M9 6v12M15 6v12",
        title: "A US entry plan for home textiles in a crowded market",
        desc: "We helped Emsworth enter the US by making the brand stand out, picking which products to lead with, and growing through two sales channels at once.",
        metrics: [
            ["Focused", "Product range narrowed"],
            ["Dual Channel", "Two sales channels running"],
            ["Search Led", "Found through search"],
        ],
    },
    {
        slug: "flavor-atlas",
        brand: "Flavor Atlas",
        short: "Premium Produce",
        group: "food",
        category: "Food & Beverage / Premium Produce",
        icon: "M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l8-8",
        title: "A US entry plan for a premium produce brand",
        desc: "We got Flavor Atlas ready for the US with premium positioning, a focus on the categories buyers want most, and a step-by-step plan to sell through several channels.",
        metrics: [
            ["4", "In-demand categories found"],
            ["3", "Sales channels opened"],
            ["2-Phase", "Launch plan"],
        ],
    },
    {
        slug: "karma",
        brand: "Karma",
        short: "Apparel",
        group: "fashion",
        category: "Fashion / Apparel",
        icon: "M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z",
        title: "Growing US sales for a fashion-forward clothing brand",
        desc: "We helped Karma grow online in the US with clearer positioning, better Google rankings and a repeatable way to win new customers.",
        metrics: [
            ["$12K", "More revenue"],
            ["24%", "More growth"],
            ["100+", "Buying searches ranked"],
        ],
    },
    {
        slug: "kashida-layone",
        brand: "Kashida Layone",
        short: "Art",
        group: "art",
        category: "Art / E-commerce",
        icon: "M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6M15.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3z",
        title: "A US online store for a modern art brand",
        desc: "We set up a US-ready Shopify store for Kashida Layone, researched the market and planned the launch for its high-value art.",
        metrics: [
            ["$10K+", "Revenue generated"],
            ["30%", "More site visitors"],
            ["100+", "Searches ranked in the top 5"],
        ],
    },
    {
        slug: "tanrom-lifesciences",
        brand: "TanRom Lifesciences",
        short: "Nutraceuticals",
        group: "health",
        category: "Health / Nutraceuticals",
        icon: "M6.3 17.7a3.5 3.5 0 0 1 0-5L12.7 6.3a3.5 3.5 0 0 1 5 5L11.3 17.7a3.5 3.5 0 0 1-5 0zM9.5 9.5l5 5",
        title: "A US entry plan for a wellness supplement brand",
        desc: "We helped TanRom Lifesciences enter the US with a store that meets US rules, a short list of the right products, and growth through two sales channels.",
        metrics: [
            ["3", "Best-fit products picked"],
            ["100%", "Meets US rules"],
            ["2", "Sales channels running"],
        ],
    },
];
