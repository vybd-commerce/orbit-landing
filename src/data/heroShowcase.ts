/* Tiles under the hero. Each one is a capability with a live preview rather
   than a screenshot, so nothing here waits on assets being cleared for use.
   `preview` picks which of the three mock renderers the tile draws. */

export type ShowcasePreview = "signal" | "ledger" | "route";

export interface ShowcaseTile {
  id: string;
  label: string;
  href: string;
  preview: ShowcasePreview;
  /* Lines the preview renders. The renderer decides how to read them. */
  lines: string[];
  /* Wide tiles take half the row: three narrow, then two wide. */
  wide?: boolean;
}

export const SHOWCASE_TILES: ShowcaseTile[] = [
  {
    id: "demand",
    label: "Demand",
    href: "/#functions",
    preview: "signal",
    lines: ["SKU 4471 · 12 days cover", "Reorder now", "SKU 9902 · 61 days cover", "Slow mover, $18K tied up"],
  },
  {
    id: "retail-ops",
    label: "Retail Ops",
    href: "/#functions",
    preview: "ledger",
    lines: [
      "PO 88214 · received",
      "Deduction $2,340 · unmatched",
      "Checked against trade plan",
      "Dispute filed · 9 receipts attached",
    ],
  },
  {
    id: "logistics",
    label: "Logistics",
    href: "/#functions",
    preview: "route",
    lines: ["Nhava Sheva", "Colombo", "Newark", "3PL · Edison NJ"],
  },
  {
    id: "market",
    label: "Market",
    href: "/#functions",
    preview: "signal",
    wide: true,
    lines: ["Velocity +14% · Northeast", "Distribution flat · 612 doors", "Competitor promo · week 34", "Act on the gap"],
  },
  {
    id: "growth",
    label: "Growth",
    href: "/#functions",
    preview: "route",
    wide: true,
    lines: ["Paid", "Marketplace", "Wholesale", "Contribution margin"],
  },
];
