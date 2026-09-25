/* Every user-facing string on /consulting.
 *
 * The page file stays layout-only so copy can be edited without reading JSX.
 * Anything still unconfirmed is a const prefixed TODO_ — `grep -rn "TODO_"
 * src/data/consultingCopy.ts` is the full punch list before this page goes
 * into the nav and the sitemap.
 */

/* ── Open items ─────────────────────────────────────────────────────────── */

/* TODO_CREDIBILITY_FIGURES — highest-leverage unknown on the page. Real
   operational scale for the three operators we lead with, no names. Revenue
   band, category and country count all need confirming before this ships. */
export const TODO_CREDIBILITY_FIGURES = {
    first: "a $[XXX]M national frozen foods brand",
    second: "a [category] manufacturer shipping to [X] countries",
    third: "[THIRD OPERATOR — one clause, same shape as the first two]",
};

/* TODO_OPERATOR_COUNTS — how many operators we can actually field per sector.
   Set to null to hide the count for a sector rather than printing a guess. */
export const TODO_OPERATOR_COUNTS: Record<string, number | null> = {
    cpg: null,
    food: null,
    fashion: null,
    batteries: null,
    manufacturing: null,
};

/* TODO_BAYANGROM_CONTEXT — one line of setup: what Bayangrom is and what state
   the operation was in. Without it the three numbers read as unsupported. */
export const TODO_BAYANGROM_CONTEXT =
    "[ONE LINE: category, SKU count, channels, and how many systems the inventory and fulfillment decisions were split across.]";

/* TODO_BAYANGROM_MECHANISM — one or two sentences on which handoffs were
   addressed and what got built. This is what separates a case study from a
   stat block. */
export const TODO_BAYANGROM_MECHANISM =
    "[ONE OR TWO SENTENCES: which handoffs we took, what we built against them, what a person stopped doing by hand.]";

/* TODO_NGO_APPLY_HREF — form, mailto or Typeform for the no-cost diagnostic.
   Until it exists the link points at the booking call. */
export const TODO_NGO_APPLY_HREF: string | null = null;

/* TODO_BELOW_COST_LINE — deferred by decision, not cut. Drop this line into
   the sprint card under the price if and when it is signed off:

   "We price the diagnostic below what it costs us to run. It's the fastest way
    to find out whether we're useful to you, and the work that follows is where
    we make our money."
*/

/* TODO_OG_IMAGE — a dedicated card (the handoff chain with the headline set
   over it). Until then /consulting shares the site card. */
export const OG_IMAGE = "/og-card.png";

/* ── SEO ─────────────────────────────────────────────────────────────────── */

export const SEO = {
    title: "Vybd Consulting — Operators who build the agents",
    socialTitle: "Most operations AI fails before a single agent ships",
    description:
        "Supply chain operators across CPG, F&B, fashion, batteries, and manufacturing. We map your operation, find the leaks, and build the agents that close them. Three-week diagnostic, $5,000.",
};

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

export const HERO = {
    eyebrow: "Vybd Consulting",
    headline: "Most operations AI fails before a single agent ships.",
    subhead:
        "It fails because it was deployed by people who'd never run the operation. We're supply chain operators who build the agents ourselves — across CPG, food and beverage, fashion, batteries, and manufacturing.",
    primaryCta: "See how we'd map your operation",
    secondaryCta: "How the three-week diagnostic works",
    diagramCaption: "Every surface your team works in, running on one operating layer.",
};

/* ── 2. The diagnosis ────────────────────────────────────────────────────── */

export interface FailureMode {
    id: string;
    title: string;
    body: string;
    /* Which nodes of the five-node mini chain are marked, and what the mark
       is called. The diagram has to illustrate this specific failure rather
       than decorate the card. */
    leakIndices: number[];
    absorbedIndices: number[];
    chainAria: string;
}

export const DIAGNOSIS = {
    tag: "01 / WHY IT FAILS",
    heading: "Why it fails",
    intro:
        "Every operations AI project we've been asked to rescue failed in one of four ways. None of them were model problems.",
    closing:
        "The common thread: none of these are solved by a better model. They're solved by someone who has run the operation sitting next to the person building the agent. That's the whole company.",
};

export const FAILURE_MODES: FailureMode[] = [
    {
        id: "broken-process",
        title: "It automated a process that was already broken.",
        body: "Nobody mapped the operation first. The agent faithfully executes a workflow that three people had been quietly working around for two years, and now the workaround is gone too. The process debt was the problem. The automation just made it load-bearing.",
        leakIndices: [1, 2, 3],
        absorbedIndices: [],
        chainAria:
            "A chain where the broken middle stages are marked, and automation has been built straight on top of them.",
    },
    {
        id: "easy-handoffs",
        title: "It automated the handoffs that were already fine.",
        body: "The easy nodes get automated because they're the easy nodes — clean data, clear rules, no politics. Meanwhile the three handoffs where the money actually falls out of the chain are untouched, because those are the messy ones. The demo looks great. The P&L doesn't move.",
        leakIndices: [2],
        absorbedIndices: [0, 4],
        chainAria:
            "A chain with the clean stages at each end absorbed by a system, while the leaking stage in the middle is untouched.",
    },
    {
        id: "no-exceptions",
        title: "It had no theory of exceptions.",
        body: "Operations are exceptions. The short ship, the substituted component, the deduction nobody can source, the pallet that arrived damaged and got received anyway. A system built by someone who hasn't lived in that operation treats exceptions as edge cases to handle later. They are not edge cases. They are the job.",
        leakIndices: [1, 3, 4],
        absorbedIndices: [0, 2],
        chainAria:
            "A chain where the stages carrying exceptions are marked and the stages absorbed by the system are only the predictable ones.",
    },
    {
        id: "wrong-decision",
        title: "It automated a decision that should never have been automated.",
        body: "Some calls need a human with context and accountability. Knowing which ones is not a technical judgment — it's an operating judgment, and you only have it if you've been the one signing off.",
        leakIndices: [3],
        absorbedIndices: [0, 1, 2, 4],
        chainAria:
            "A chain almost entirely absorbed by a system, with the one stage that needed a human still marked.",
    },
];

/* ── 3. The network ──────────────────────────────────────────────────────── */

export interface Sector {
    key: keyof typeof TODO_OPERATOR_COUNTS;
    name: string;
    depth: string;
}

export const NETWORK = {
    tag: "02 / THE NETWORK",
    heading: "A network of operators, not a bench of consultants",
    body: "A frozen foods brand, a battery manufacturer, and a fashion label have almost nothing in common operationally. A firm with six people has to pretend otherwise. We don't — we match you with operators who have run your category, and they work alongside the team that builds the agents.",
    /* Option 2 from the brief: concrete without naming, with the discretion
       made deliberate rather than evasive. The closing clause is fixed copy
       and does real work — do not cut it when the figures land. */
    credibilityLead: "Our operators have run supply chain for",
    credibilityTail: "Named on your first call.",
};

export const SECTORS: Sector[] = [
    { key: "cpg", name: "CPG", depth: "National brands through mass, club, and specialty retail" },
    { key: "food", name: "Food & Beverage", depth: "Cold chain, short shelf life, co-man networks" },
    { key: "fashion", name: "Fashion", depth: "Seasonal buys, size and colour SKU explosion, returns" },
    { key: "batteries", name: "Batteries", depth: "Regulated transport, cell sourcing, compliance documentation" },
    {
        key: "manufacturing",
        name: "Manufacturing",
        depth: "Multi-tier BOMs, capacity planning, supplier quality",
    },
];

/* ── 4. How we work ──────────────────────────────────────────────────────── */

export interface WorkStep {
    num: string;
    tag: string;
    title: string;
    body: string;
    emphasis: boolean;
}

export const HOW_WE_WORK = {
    tag: "03 / HOW WE WORK",
    heading: "Diagnose. Build. Run.",
};

export const WORK_STEPS: WorkStep[] = [
    {
        num: "1",
        tag: "THREE WEEKS · $5,000",
        title: "Diagnose",
        body: "An operator who knows your category maps your current operation end to end: every handoff, every system, every place data gets re-keyed or a decision waits on a person. You get the map, the leaks with numbers attached, and a costed roadmap of what we'd build.",
        emphasis: false,
    },
    {
        num: "2",
        tag: "THE BUILD",
        title: "Build",
        body: "We build the recommendations. Agents sit in the reconciliation and coordination layer — the work that currently consumes people — with the decisions that need human accountability routed to a human. You own what we build.",
        emphasis: true,
    },
    {
        num: "3",
        tag: "ONGOING",
        title: "Run",
        body: "Systems degrade when the operation changes and nobody updates them. We stay on to run and adapt what we built, or hand it over cleanly if you'd rather own it outright.",
        emphasis: false,
    },
];

/* ── 5. Proof ────────────────────────────────────────────────────────────── */

export const PROOF = {
    tag: "04 / PROOF",
    heading: "What it's worth when it works",
    caseName: "Bayangrom",
    /* Pulled from BayangromCaseStudyPage.tsx so there is one source of truth
       for the numbers. */
    metrics: [
        { value: "−28%", label: "Excess inventory" },
        { value: "−22%", label: "Shipping cost per order" },
        { value: "$180K/yr", label: "Recovered" },
    ],
    beforeLabel: "The chain we found",
    afterLabel: "The chain we left",
    caseLink: "Read the full case study",
    caseHref: "/work/bayangrom",
    testimonialHeading: "In their words",
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
            "My focus was on building the brand, not becoming an expert in inventory and supply chain. If a product started selling faster than expected, the system flagged it early and told us what we needed to order next. Instead of digging through spreadsheets, I could see what needed my attention and make a decision.",
        name: "Bronson Coletrane",
        title: "Founder, Emsworth",
        logoImage: null,
    },
];

/* ── 6. The sprint ───────────────────────────────────────────────────────── */

export const SPRINT = {
    tag: "05 / THE SPRINT",
    heading: "The three-week diagnostic",
    price: "$5,000",
    priceMeta: "fixed fee · three weeks",
    deliverablesHeading: "What you get",
    deliverables: [
        "A complete map of your current operations and supply chain — every handoff, system, and decision point",
        "A prioritized list of where the operation is leaking, with dollar figures attached",
        "A costed roadmap and quote for what we'd build, and in what order",
    ],
    /* Sits in the same card as the price on purpose. The reader runs the
       math themselves and $5,000 stops reading as cheap. */
    anchor:
        "The Bayangrom engagement recovered $180K a year. The diagnostic that found it cost less than most operations teams spend on software in a month.",
    afterHeading: "What happens after",
    after:
        "If the roadmap is worth building, we build it. If it isn't, you keep the map and the analysis and we part as friends. No retainer, no obligation attached to the sprint.",
    cta: "Book the diagnostic",
};

/* ── 7. Access ───────────────────────────────────────────────────────────── */

export const ACCESS = {
    body: "Nonprofits, NGOs, and public benefit corporations can apply for the diagnostic at no cost. We run a limited number each quarter.",
    cta: "Tell us about your organization",
};

/* ── 8. Final CTA ────────────────────────────────────────────────────────── */

export const FINAL_CTA = {
    heading: "Start with the map",
    subhead:
        "Thirty minutes with an operator who knows your category. If we're not the right fit, we'll say so on the call.",
    button: "Book a call",
};

/* ── 9. Operator door ────────────────────────────────────────────────────── */

export const OPERATOR_DOOR = {
    heading: "For operators",
    body: "We're expanding the network. If you've spent a career running supply chain or operations — in any of our sectors or one we don't cover yet — we work with operators on revenue share, matched to engagements in your category. You bring the operating judgment; we bring the deal flow and the team that builds.",
    cta: "Get in touch",
};
