/* US Scale fees, shared by the Pricing labels and the profitability
   calculator: a yearly software fee tiered by US sales (capped from $500K
   on) plus a share of sales. Keep both sections reading from here. */

export const REVENUE_SHARE = 0.12;

export type SoftwareTier = { upTo: number; fee: number; label: string };

/* `upTo` is inclusive: $100,000 of sales is still Launch. */
export const SOFTWARE_TIERS: SoftwareTier[] = [
    { upTo: 100_000, fee: 12_000, label: "Launch" },
    { upTo: 250_000, fee: 24_000, label: "Growth" },
    { upTo: 499_999.99, fee: 36_000, label: "Expansion" },
    { upTo: Infinity, fee: 45_000, label: "Capped" },
];

export const softwareTier = (sales: number): SoftwareTier => SOFTWARE_TIERS.find((t) => sales <= t.upTo) ?? SOFTWARE_TIERS[SOFTWARE_TIERS.length - 1];

/* Lowest monthly software fee, for the "from $1,000 / month" headline. */
export const MIN_MONTHLY_FEE = SOFTWARE_TIERS[0].fee / 12;
export const SOFTWARE_CAP = SOFTWARE_TIERS[SOFTWARE_TIERS.length - 1].fee;

/* The self-serve Vybd app: first week free, then a flat monthly price.
   Signed up for on the product, not here. */
export const SIGNUP_URL = "https://app.vybd.ai/signup";
export const APP_MONTHLY = 33;
