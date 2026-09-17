// Static model for OpsComparisonSection. One point of comparison, $100M
// revenue, shown two ways. The assumptions panel text derives from
// OPS_MODEL so it can never drift from the displayed numbers.

export const OPS_MODEL = {
  revenue: 100, // $M, the point of comparison
  nodes: { suppliers: 9, production: 3, warehousing: 3, channels: 7 },
  hireHeadcount: 34,
  systemsHeadcount: 13,
  fullyLoadedCost: 95_000, // USD per ops FTE per year
} as const;

// Underlying derivation. Not used for the live numbers above (those are
// fixed at the $100M comparison point) but kept so the assumptions panel
// and anyone defending this on a call can show the formula, not just the
// output.
export function hireHeadcountAt(revenue: number): number {
  return 4 + (revenue - 10) * 0.3333;
}

export function systemsHeadcountAt(revenue: number): number {
  return 4 + 9 * Math.log10(revenue / 10);
}

export function annualCost(headcount: number): number {
  return headcount * OPS_MODEL.fullyLoadedCost;
}

export const hiringAnnualCost = annualCost(OPS_MODEL.hireHeadcount);
export const systemsAnnualCost = annualCost(OPS_MODEL.systemsHeadcount);

// ── Node and edge model ──
// Identical in both panels. Generated once, shared.

export interface NodeCounts {
  suppliers: number;
  production: number;
  warehousing: number;
  channels: number;
}

export const NODE_COUNTS: NodeCounts = OPS_MODEL.nodes;

export const TOTAL_NODES =
  NODE_COUNTS.suppliers + NODE_COUNTS.production + NODE_COUNTS.warehousing + NODE_COUNTS.channels;

export type EdgeStage = "supplier-production" | "production-warehousing" | "warehousing-channel";

export interface Edge {
  id: string;
  stage: EdgeStage;
  fromIndex: number;
  toIndex: number;
}

export function buildEdges(counts: NodeCounts): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < counts.suppliers; i++) {
    edges.push({
      id: `sp-${i}`,
      stage: "supplier-production",
      fromIndex: i,
      toIndex: i % counts.production,
    });
  }

  for (let p = 0; p < counts.production; p++) {
    for (let w = 0; w < counts.warehousing; w++) {
      edges.push({ id: `pw-${p}-${w}`, stage: "production-warehousing", fromIndex: p, toIndex: w });
    }
  }

  for (let w = 0; w < counts.warehousing; w++) {
    for (let c = 0; c < counts.channels; c++) {
      edges.push({ id: `wc-${w}-${c}`, stage: "warehousing-channel", fromIndex: w, toIndex: c });
    }
  }

  return edges;
}

export const EDGES = buildEdges(NODE_COUNTS);
export const TOTAL_EDGES = EDGES.length;

// ── SVG layout ──
export const VIEW_WIDTH = 340;
export const VIEW_HEIGHT = 380;
export const NODE_HEIGHT = 16;
export const NODE_PITCH = 22;
export const BAND_TOP = 40;
export const BAND_HEIGHT = 300; // 340 - 40

export const COLUMNS = [
  { key: "suppliers", x: 12, width: 52 },
  { key: "production", x: 96, width: 60 },
  { key: "warehousing", x: 188, width: 60 },
  { key: "channels", x: 276, width: 52 },
] as const;

export function columnStartY(n: number): number {
  const colHeight = n * NODE_PITCH - 6;
  return BAND_TOP + (BAND_HEIGHT - colHeight) / 2;
}

export function nodeY(n: number, index: number): number {
  return columnStartY(n) + index * NODE_PITCH;
}

export const ASSUMPTIONS_COPY =
  `Ops headcount covers demand planning, inventory, order and fulfilment operations, item data, and channel administration. It excludes marketing, finance, and design. Hiring scales headcount linearly with revenue: conventional ops scales linearly with revenue, systems led ops scales logarithmically. At $${OPS_MODEL.revenue}M in revenue that is ${OPS_MODEL.hireHeadcount} people the default way against ${OPS_MODEL.systemsHeadcount} with systems absorbing the handoffs. Fully loaded cost per ops FTE is set at $${OPS_MODEL.fullyLoadedCost.toLocaleString()} including benefits, tooling, and management overhead. The supply chain nodes and handoffs are identical either way, only who covers each handoff changes. Bring your own numbers to a working session and we will substitute them in.`;
