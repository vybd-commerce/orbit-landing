// Ops headcount model for the OpsCostCurve chart.
// All chart logic reads from here; the component contains no math of its
// own. Tune these five numbers to move the whole chart and every derived
// label on the page.

export const OPS_MODEL = {
  baselineRevenue: 10, // $M
  baselineHeadcount: 4, // ops FTEs at baseline, both paths
  conventionalSlope: 0.3333, // additional FTEs per $1M of revenue
  nativeLogCoefficient: 9, // FTEs added per 10x revenue
  fullyLoadedCost: 95_000, // USD per ops FTE per year
} as const;

export const REVENUE_MIN = 10;
export const REVENUE_MAX = 100;
export const REVENUE_STEP = 5;
export const REVENUE_DEFAULT = 50;
export const MOBILE_STEPS = [10, 25, 50, 100] as const;

export function conventionalHeadcount(revenue: number): number {
  return (
    OPS_MODEL.baselineHeadcount +
    (revenue - OPS_MODEL.baselineRevenue) * OPS_MODEL.conventionalSlope
  );
}

export function nativeHeadcount(revenue: number): number {
  return (
    OPS_MODEL.baselineHeadcount +
    OPS_MODEL.nativeLogCoefficient * Math.log10(revenue / OPS_MODEL.baselineRevenue)
  );
}

export function annualDeltaMillions(revenue: number): number {
  const delta = conventionalHeadcount(revenue) - nativeHeadcount(revenue);
  return (delta * OPS_MODEL.fullyLoadedCost) / 1_000_000;
}

// Precomputed at every slider step so the polylines and the screen-reader
// data table read off the same points instead of two separate derivations.
export const CHART_DATA_POINTS = Array.from(
  { length: (REVENUE_MAX - REVENUE_MIN) / REVENUE_STEP + 1 },
  (_, i) => {
    const revenue = REVENUE_MIN + i * REVENUE_STEP;
    return {
      revenue,
      conventional: conventionalHeadcount(revenue),
      native: nativeHeadcount(revenue),
    };
  }
);

export const ASSUMPTIONS_COPY =
  "Ops headcount covers demand planning, inventory, order and fulfilment operations, item data, and channel administration. It excludes marketing, finance, and design. Conventional scaling assumes roughly one additional ops hire per $3M of incremental revenue, which is the pattern we see across brands in this band. Native scaling assumes each new workflow absorbs volume rather than adding a person, so headcount grows with the log of revenue rather than in line with it. Fully loaded cost per ops FTE is set at $95,000 including benefits, tooling, and management overhead. Adjust these for your own numbers on a working session.";
