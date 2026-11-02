/* US Scale fees, shared by the Pricing labels, the profitability
   calculator and the home Scale card: a flat software fee ($3K a month)
   plus a share of US sales. Kept as a one-tier list so a sales-based tier
   can come back without touching the readers. */

export const REVENUE_SHARE = 0.12;

export type SoftwareTier = { upTo: number; fee: number; label: string };

/* `upTo` is inclusive. */
export const SOFTWARE_TIERS: SoftwareTier[] = [{ upTo: Infinity, fee: 36_000, label: "Scale" }];

export const softwareTier = (sales: number): SoftwareTier => SOFTWARE_TIERS.find((t) => sales <= t.upTo) ?? SOFTWARE_TIERS[SOFTWARE_TIERS.length - 1];

/* Lowest monthly software fee, for the "from $3,000 / month" headlines. */
export const MIN_MONTHLY_FEE = SOFTWARE_TIERS[0].fee / 12;

/* Vybd Plan, the self-serve app: first week free, then a flat monthly
   price. Sign-up is the simple /signup page (SignupPage.tsx) until the
   product's own sign-up is live; then point this at it. */
export const SIGNUP_URL = "/signup";
export const APP_MONTHLY = 33;
