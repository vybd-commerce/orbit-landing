/* Link-preview and search meta for the pages people share. Crawlers and
   chat apps (Slack, WhatsApp, iMessage, LinkedIn, X) read the raw HTML
   and don't run JavaScript, so every route would otherwise show the
   home page's text from index.html. At build time, vite.config.ts writes
   dist/<name>.html for each entry below, with these tags swapped in, and
   vercel.json serves it on that path. "/" stays index.html, whose tags
   should match HOME. Images live in public/ at 1200x630. */

export type PageMeta = { title: string; description: string; ogTitle: string; image: string; imageAlt: string };

const ORIGIN = "https://www.vybd.ai";

export const HOME: PageMeta = {
    title: "Vybd | Supply chain intelligence for consumer brands",
    description:
        "Vybd brings brands to the US and runs them there: test with a Test Drop, launch with US Launch, run it on US Scale, or bring AI operations to a $50M+ business. Vybd Plan, the self-serve app, is in early access.",
    ogTitle: "Borderless. Supply chain intelligence.",
    image: "/og-home.png",
    imageAlt: "Vybd. Borderless. Supply chain intelligence.",
};

/* Route path (no locale) -> meta. The file is written as dist/<name>.html. */
export const PAGES: Record<string, PageMeta & { name: string }> = {
    "/us": {
        name: "us",
        title: "Launch and scale your brand in the US | Vybd",
        description:
            "Test the US with one drop, launch with sourcing, compliance and store setup, then run it with AI agents and an operator. From abroad or already selling here.",
        ogTitle: "The US is ready for your brand.",
        image: "/og-us-v2.png",
        imageAlt: "Vybd. The US is ready for your brand.",
    },
    "/enterprise": {
        name: "enterprise",
        title: "AI operations for $50M+ CPG brands | Vybd",
        description:
            "Vybd connects NetSuite, SAP, Microsoft Dynamics 365 Supply Chain or Odoo with your WMS, 3PLs and channels, then puts AI agents and an operator on reorders, deductions and reporting.",
        ogTitle: "Already at scale. Now run tighter.",
        image: "/og-enterprise.png",
        imageAlt: "Vybd for enterprise. Already at scale. Now run tighter.",
    },
    "/signup": {
        name: "signup",
        title: "Vybd Plan early access | Vybd",
        description: "Vybd Plan researches US demand, competitors, pricing and channels for your product, then leaves you with a US go-to-market plan. Opening soon: first week free, then $33 a month.",
        ogTitle: "Plan your US launch. Early access.",
        image: "/og-home.png",
        imageAlt: "Vybd. Borderless. Supply chain intelligence.",
    },
    "/product": {
        name: "product",
        title: "How Vybd works | One system, every part in sync",
        description: "AI agents, one control tower and real partners run your US business as one connected system. Vybd automates what's safe, a specialist reviews what's complex, and you approve the big calls.",
        ogTitle: "One system. Every part in sync.",
        image: "/og-home.png",
        imageAlt: "Vybd. Borderless. Supply chain intelligence.",
    },
    "/case-studies": {
        name: "case-studies",
        title: "Case studies | Vybd",
        description: "Real brands that came to the US with Vybd: what we did for them, and what changed.",
        ogTitle: "Brands we've brought to the US.",
        image: "/og-us-v2.png",
        imageAlt: "Vybd. The US is ready for your brand.",
    },
    "/lab": {
        name: "lab",
        title: "Vybd Lab | What we're building behind the launches",
        description: "Brand Brain: one shared memory per brand that every Vybd AI agent reads from and writes back to. In active development, shared early.",
        ogTitle: "One brain per brand. Every agent acts on it.",
        image: "/og-home.png",
        imageAlt: "Vybd. Borderless. Supply chain intelligence.",
    },
    "/ecosystem": {
        name: "ecosystem",
        title: "Join the Vybd Ecosystem | US market-entry partners",
        description: "Customs brokers, freight and 3PLs, agencies, distributors and other US market-entry partners: join the Vybd ecosystem and get found by brands coming to the US.",
        ogTitle: "Grow with the brands coming to America.",
        image: "/og-us-v2.png",
        imageAlt: "Vybd. The US is ready for your brand.",
    },
    "/rainmaker": {
        name: "rainmaker",
        title: "Rainmaker program | Vybd",
        description: "Local representatives in China, South Korea, India and beyond: bring brands from your country to the US with Vybd, and earn as they grow.",
        ogTitle: "Bring brands from your country to the US. Earn as they grow.",
        image: "/og-us-v2.png",
        imageAlt: "Vybd. The US is ready for your brand.",
    },
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/* Swap the page-specific tags in index.html's head. Throws if a tag is
   missing, so a renamed tag in index.html fails the build instead of
   silently shipping the home preview. */
export function applyMeta(html: string, path: string, m: PageMeta): string {
    const url = ORIGIN + path;
    const swaps: [RegExp, string][] = [
        [/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`],
        [/<meta name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(m.description)}" />`],
        [/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`],
        [/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(m.ogTitle)}" />`],
        [/<meta property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(m.description)}" />`],
        [/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`],
        [/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${ORIGIN}${m.image}" />`],
        [/<meta property="og:image:alt" content="[^"]*"\s*\/>/, `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`],
        [/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${esc(m.ogTitle)}" />`],
        [/<meta name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(m.description)}" />`],
        [/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${ORIGIN}${m.image}" />`],
    ];
    return swaps.reduce((out, [re, tag]) => {
        if (!re.test(out)) throw new Error(`pageMeta: no match for ${re} in index.html`);
        return out.replace(re, tag);
    }, html);
}
