/* Every user-facing string on /consulting.
 *
 * The page file stays layout-only so copy can be edited without reading JSX.
 * Anything still unconfirmed is a const prefixed TODO_ — `grep -rn "TODO_"
 * src/data/consultingCopy.ts` is the full punch list.
 *
 * House rule for this file: no em dashes in anything a visitor reads.
 */

/* ── Open items ─────────────────────────────────────────────────────────── */

/* TODO_NGO_APPLY_HREF — form, mailto or Typeform for the no-cost diagnostic.
   Until it exists the link points at the booking call. */
export const TODO_NGO_APPLY_HREF: string | null = null;

/* TODO_OPERATOR_HREF — where operators who want to join the network go.
   Until it exists the footer link points at the booking call. */
export const TODO_OPERATOR_HREF: string | null = null;

/* TODO_OG_IMAGE — a dedicated card (a frame of the one-order hero loop with
   the headline set over it). Until then /consulting shares the site card. */
export const OG_IMAGE = "/og-card.png";

/* ── SEO ─────────────────────────────────────────────────────────────────── */

export const SEO = {
    title: "Supply Chain & Operations Consulting | Vybd",
    socialTitle: "Secure and scale your operations",
    description:
        "Operators who secure and scale sourcing, manufacturing, warehousing and logistics. An expert audit, an AI-ready data layer, and agents for your team.",
};

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

export const HERO = {
    pill: "Supply chain and operations consulting",
    title: "Secure and scale your operations.",
    subtitle:
        "From sourcing and manufacturing to warehousing and logistics. Operators who have run supply chains find what slows you down, connect your data, and put agents to work next to your team.",
    cta: "Book a free call",
    secondary: "See what you get",
};

/* ── 1b. The short version (pinned 3D scrub) ─────────────────────────────── */

export interface StoryChapter {
    title: string;
    body: string;
}

export const SCALE_STORY = {
    tag: "THE SHORT VERSION",
    skip: "Skip",
    chapters: [
        {
            title: "Your supply chain.",
            body: "Suppliers, factories, ports and distribution centres across continents. Orders and inventory always in motion.",
        },
        {
            title: "One unified data layer.",
            body: "Every node on the lane reads and writes the same numbers, underneath the systems you already run.",
        },
        {
            title: "Agents deployed across it.",
            body: "Agents work on that shared context next to your team, moving orders and inventory faster.",
        },
        {
            title: "Built to scale.",
            body: "Every lane, every site, one operating layer.",
        },
    ] as StoryChapter[],
};

/* ── 2–4. The three outcomes ─────────────────────────────────────────────── */

export const OUTCOMES_INTRO = {
    tag: "WHAT YOU GET",
    heading: "Three outcomes. Each one stands on its own.",
};

export const AUDIT = {
    tag: "01 / AUDIT",
    heading: "An expert audit of your operation.",
    body: "An operator who has run your category maps the operation end to end. You see every bottleneck and every risk, with a dollar figure and a fix attached.",
    points: [
        "Bottlenecks and leaks, costed",
        "Supplier concentration and stockout risk",
        "A prioritized plan, in order of payback",
    ],
    chainAria:
        "An order-to-cash chain from demand plan to settlement, with the three stages where money leaks marked.",
};

export const DATA_LAYER = {
    tag: "02 / DATA LAYER",
    heading: "One clean data layer, ready for AI.",
    body: "Your ERP, WMS, spreadsheets and inboxes each hold part of the truth. We standardize them into one context layer, so every report, decision and agent works from the same numbers.",
    points: [
        "Suppliers, SKUs, orders and stock in one model",
        "Your systems stay. The layer connects them.",
        "Ready for the agents you add next",
    ],
};

export interface TeamRole {
    role: string;
    agent: string;
}

export const TEAM = {
    tag: "03 / YOUR TEAM",
    heading: "Every person on your team, supercharged.",
    body: "With shared context underneath, each person gets agents that do the chasing, reconciling and re-keying. Your people make the calls. The agents do the legwork.",
};

/* Illustrative agent jobs, one per role. Each is a task an operator would
   recognise as real, not a capability claim about a shipped product. */
export const TEAM_ROLES: TeamRole[] = [
    { role: "Demand planner", agent: "Flags SKUs selling ahead of forecast" },
    { role: "Buyer", agent: "Chases supplier confirmations and delays" },
    { role: "Warehouse lead", agent: "Reconciles receipts against POs" },
    { role: "Logistics coordinator", agent: "Tracks shipments and surfaces exceptions" },
];

/* ── 5. Proof ────────────────────────────────────────────────────────────── */

export const PROOF = {
    tag: "PROOF",
    heading: "What it's worth when it works",
    caseName: "Bayangrom",
    /* Pulled from BayangromCaseStudyPage.tsx so there is one source of truth
       for the numbers. */
    metrics: [
        { value: "−28%", label: "Excess inventory" },
        { value: "−22%", label: "Shipping cost per order" },
        { value: "$180K/yr", label: "Recovered" },
    ],
    caseLink: "Read the Bayangrom case study",
    caseHref: "/work/bayangrom",
};

/* Both quotes are trimmed from src/data/testimonials.ts. Attribution is
   verbatim from that file — an unattributed testimonial is worth less than
   none, so these three fields travel together. */
export const TESTIMONIALS_SHORT = [
    {
        quote:
            "They identified opportunities to consolidate products into fewer, better utilized containers, significantly reducing our freight and logistics costs. What impressed us most was how they combined hands on supply chain expertise with AI driven analysis.",
        name: "Mahathesh",
        title: "MIB Industries",
        logoImage: "/assets/mib-industries-logo.png",
    },
    {
        quote:
            "If a product started selling faster than expected, the system flagged it early and told us what we needed to order next. Instead of digging through spreadsheets, I could see what needed my attention and make a decision.",
        name: "Bronson Coletrane",
        title: "Founder, Emsworth",
        logoImage: null,
    },
];

/* ── 6. How it starts ────────────────────────────────────────────────────── */

export interface StartStep {
    num: string;
    title: string;
    body: string;
}

export const HOW_IT_STARTS = {
    tag: "HOW IT STARTS",
    heading: "Start with a conversation.",
    cta: "Book a free call",
};

export const START_STEPS: StartStep[] = [
    {
        num: "1",
        title: "Free call",
        body: "Thirty minutes with an operator. We learn how you run today and tell you straight if we can help.",
    },
    {
        num: "2",
        title: "Audit",
        body: "We map the operation and hand you a costed plan. You keep it either way.",
    },
    {
        num: "3",
        title: "Build and run",
        body: "We build the data layer and the agents, then run them with you or hand them over.",
    },
];

/* ── 7. Access ───────────────────────────────────────────────────────────── */

export const ACCESS = {
    body: "Nonprofits, NGOs, and public benefit corporations can apply for the audit at no cost. We run a limited number each quarter.",
    cta: "Tell us about your organization",
};

/* ── 8. Managed ops ──────────────────────────────────────────────────────── */

export const MANAGED_OPS = {
    tag: "MANAGED OPERATIONS",
    heading: "Or hand us the whole thing.",
    body: "Some teams would rather not run supply chain at all. Our operators run it for you on the same data layer and agents, accountable for the outcome.",
    roles: ["Demand planners", "Inventory managers", "Buyers", "Logistics coordinators"],
    cta: "Talk about managed ops",
};

/* ── 9. Final CTA ────────────────────────────────────────────────────────── */

export const FINAL_CTA = {
    heading: "Find out where your operation stands",
    subhead:
        "Thirty minutes with an operator who has run supply chains. If we're not the right fit, we'll say so on the call.",
    button: "Book a free call",
};

/* ── Footer ──────────────────────────────────────────────────────────────── */

export const OPERATOR_LINK = "Operators: join the network";
