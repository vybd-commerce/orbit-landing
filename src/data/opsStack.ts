/* Mirror of the Spline document "Vybd operating stack".
 *
 * The Spline file is the source of truth for geometry. These numbers exist so
 * the page can render the stack before (or without) the GLB, and so the rail
 * copy has somewhere to live. If the slab table changes in Spline, change it
 * here in the same commit — the scene brief says the same thing in reverse.
 *
 * Units are Spline units. Y+ is up. Every slab shares the same X/Z centre and
 * the same width; the uniform width is deliberate, it reads as a stack rather
 * than a pyramid.
 */

export const SLAB_WIDTH = 520;
export const SLAB_DEPTH = 340;
export const SLAB_CORNER_RADIUS = 4;

export interface OpsStackSlab {
  /** Matches the object name in the Spline document exactly. */
  name: string;
  /** The rail layer this slab belongs to. */
  layerId: string;
  height: number;
  y: number;
  color: string;
  /** Source is inert and physical; everything below it is a lens. */
  glass: boolean;
}

export const OPS_STACK_SLABS: OpsStackSlab[] = [
  { name: "00 Source", layerId: "source", height: 42, y: 300, color: "#B4B2A9", glass: false },
  { name: "01a Projection", layerId: "context", height: 30, y: 120, color: "#5DCAA5", glass: true },
  { name: "01b Context funnel", layerId: "context", height: 30, y: 85, color: "#1D9E75", glass: true },
  { name: "01c Agent workflows", layerId: "context", height: 30, y: 50, color: "#0F6E56", glass: true },
  { name: "02 Governance", layerId: "governance", height: 42, y: -130, color: "#AFA9EC", glass: true },
  { name: "03 Review", layerId: "review", height: 42, y: -320, color: "#F0997B", glass: true },
];

export interface OpsStackLayer {
  id: string;
  index: string;
  title: string;
  summary: string;
  /** Shown when the layer is active. */
  detail: string;
  color: string;
}

export const OPS_STACK_LAYERS: OpsStackLayer[] = [
  {
    id: "source",
    index: "00",
    title: "Systems of record",
    summary: "ERP, WMS, 3PL, retailer portals, marketplaces.",
    detail:
      "Read where the data already lives. Nothing is migrated and nothing is replaced — the systems you run on stay the systems you run on.",
    color: "#8A887F",
  },
  {
    id: "context",
    index: "01",
    title: "Context",
    summary: "Projection, context funnel, agent workflows.",
    detail:
      "Orders, inventory, cost, and channel resolved into one view, narrowed to what a given decision actually needs, then worked by agents scoped to a single function.",
    color: "#1D9E75",
  },
  {
    id: "governance",
    index: "02",
    title: "Governance",
    summary: "Policy, limits, and a full audit trail.",
    detail:
      "Every proposed write passes a rule set you own. What an agent may touch, up to what value, under whose authority — recorded whether it is approved or not.",
    color: "#8F86E0",
  },
  {
    id: "review",
    index: "03",
    title: "Review",
    summary: "An operator approves, then the write goes back up.",
    detail:
      "Nothing reaches a system of record without a person accountable for it. Approved writes flow back up the stack to the source.",
    color: "#E07A55",
  },
];
