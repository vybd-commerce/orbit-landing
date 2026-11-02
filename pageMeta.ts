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
        "Vybd plans, launches and runs operations for consumer brands: Vybd Plan from $33 a month, US launch and scale services, and AI operations for enterprise.",
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
            "Plan your US entry with Vybd Plan, launch with sourcing, compliance and store setup, then scale with AI agents and an operator. From abroad or already here.",
        ogTitle: "The US is ready for your brand.",
        image: "/og-us-v2.png",
        imageAlt: "Vybd. The US is ready for your brand.",
    },
    "/enterprise": {
        name: "enterprise",
        title: "AI operations for $50M+ CPG brands | Vybd",
        description:
            "Vybd connects NetSuite, SAP, Microsoft Dynamics 365 or Odoo with your WMS, 3PLs and channels, then puts AI agents and an operator on reorders, deductions and reporting.",
        ogTitle: "Already at scale. Now run tighter.",
        image: "/og-enterprise.png",
        imageAlt: "Vybd for enterprise. Already at scale. Now run tighter.",
    },
    "/signup": {
        name: "signup",
        title: "Start Vybd Plan free | Vybd",
        description: "Plan your brand: research your market, find your customer and positioning, and leave with a plan. Free for a week, then $33 a month.",
        ogTitle: "Plan your brand. Free for a week.",
        image: "/og-home.png",
        imageAlt: "Vybd. Borderless. Supply chain intelligence.",
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
