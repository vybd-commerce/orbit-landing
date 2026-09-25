// Copy for /waitlist. Kept out of the page file so the page stays layout-only,
// same split as consultingCopy.ts. The page itself shows only the wordmark and
// the form, so the pitch lives in the title and meta tags.

export const SEO = {
    title: "Vybd — Waitlist for solo e-commerce founders",
    socialTitle: "Your brand agent, running 24/7",
    description:
        "For solo founders scaling from zero to $15M+. A brand agent that runs your operations around the clock. Join the waitlist.",
};

export const FORM = {
    placeholder: "you@yourbrand.com",
    button: "Join the waitlist",
    success: "You're on the list. We'll email you when your spot opens.",
    error: "Something went wrong. Try again in a moment.",
};

/* Top and bottom link rows, set in small caps like block.xyz's. Destinations
   are the closest existing routes; Careers has no page yet. */
export const NAV_TOP = [
    { label: "Impact", href: "/case-studies" },
    { label: "Careers", href: "/" }, // TODO: no careers page yet
    { label: "Privacy", href: "/privacy" },
];

export const NAV_BOTTOM = [
    { label: "Orbit", href: "/product" },
    { label: "Operations", href: "/consulting" },
    { label: "Vybd", href: "/" },
];
