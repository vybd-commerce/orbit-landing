/* Geometry for OpsOsDiagram: the /consulting hero's layered stack.
 *
 * Three surfaces on top (Analytics, Workflows, Integrations), one operating
 * layer in the middle (Ops OS), two sources underneath (Data, Models). Data
 * and models flow up into Ops OS; Ops OS flows up into the surfaces. Every
 * wire is drawn in that direction so the travelling pulse reads as flow.
 *
 * Two layouts, same split as handoffChainModel.ts: a wide one and a narrow
 * one for phones, each in its own viewBox so text never scales below
 * legibility.
 */

export type LayerId = "analytics" | "workflows" | "integrations" | "ops" | "data" | "models";
export type EntityId = "customer" | "order" | "carrier" | "supplier" | "sku" | "warehouse";

export const LAYER_LABELS: Record<LayerId, string> = {
    analytics: "Analytics",
    workflows: "Workflows",
    integrations: "Integrations",
    ops: "Ops OS",
    data: "Data",
    models: "Models",
};

/* What each layer is, for the sr-only table. */
export const LAYER_ROLES: Record<LayerId, string> = {
    analytics: "Reads from Ops OS: forecasts, margins, stock health.",
    workflows: "Runs on Ops OS: the agent playbooks that act on the operation.",
    integrations: "Syncs through Ops OS: storefront, 3PL, carrier and supplier APIs.",
    ops: "The operating layer. One model of customers, orders, SKUs, suppliers, warehouses and carriers.",
    data: "Feeds Ops OS: orders, inventory, shipments and supplier records.",
    models: "Feeds Ops OS: forecasting, routing and classification models.",
};

export const ENTITY_LABELS: Record<EntityId, string> = {
    customer: "Customer",
    order: "Order",
    carrier: "Carrier",
    supplier: "Supplier",
    sku: "SKU",
    warehouse: "Warehouse",
};

/* The ops model inside the middle slab: an e-commerce version of an ontology.
   Order and SKU are the two hubs everything else hangs off. */
export const RELATIONS: { from: EntityId; to: EntityId; label: string }[] = [
    { from: "customer", to: "order", label: "Places" },
    { from: "carrier", to: "order", label: "Ships" },
    { from: "order", to: "sku", label: "Contains" },
    { from: "supplier", to: "sku", label: "Supplies" },
    { from: "warehouse", to: "sku", label: "Stocks" },
];

export interface Platform {
    id: LayerId;
    /* Bottom edge of the top face spans x1..x2; the far (top) edge is pulled
       in by `inset` on each side for a hint of perspective. */
    x1: number;
    x2: number;
    top: number;
    bottom: number;
    inset: number;
    /* Thickness of the slab edge drawn under the face. */
    edge: number;
    labelY: number;
}

export interface EntityPos {
    x: number;
    y: number;
    /* Where the entity's name sits relative to its circle. */
    labelSide: "above" | "below" | "left" | "right";
}

export interface Wire {
    d: string;
    delay: number;
}

export interface OpsOsLayout {
    viewWidth: number;
    viewHeight: number;
    labelSize: number;
    platforms: Platform[];
    entities: Record<EntityId, EntityPos>;
    wires: Wire[];
}

/* Upward S-curve from (x0, y0) to (x1, y1). */
function curve(x0: number, y0: number, x1: number, y1: number): string {
    const ym = (y0 + y1) / 2;
    return `M${x0},${y0} C${x0},${ym} ${x1},${ym} ${x1},${y1}`;
}

/* A bundle of `n` wires fanned evenly between two edge ranges. */
function bundle(
    n: number,
    from: [number, number],
    fromY: number,
    to: [number, number],
    toY: number,
): string[] {
    return Array.from({ length: n }, (_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const x0 = from[0] + (from[1] - from[0]) * t;
        const x1 = to[0] + (to[1] - to[0]) * t;
        return curve(x0, fromY, x1, toY);
    });
}

/* Deterministic stagger, so pulses don't march in lockstep and don't jump
   on re-render the way Math.random() would. 3s matches flowPulse. */
function withDelays(paths: string[]): Wire[] {
    return paths.map((d, i) => ({ d, delay: (i * 0.37) % 3 }));
}

function platformBottom(p: Platform): number {
    return p.bottom + p.edge;
}

/* ── Wide ─────────────────────────────────────────────────────────────────── */

const WIDE_PLATFORMS: Platform[] = [
    { id: "analytics", x1: 60, x2: 300, top: 44, bottom: 150, inset: 18, edge: 8, labelY: 28 },
    { id: "workflows", x1: 380, x2: 620, top: 44, bottom: 150, inset: 18, edge: 8, labelY: 28 },
    { id: "integrations", x1: 700, x2: 940, top: 44, bottom: 150, inset: 18, edge: 8, labelY: 28 },
    { id: "ops", x1: 100, x2: 900, top: 280, bottom: 462, inset: 50, edge: 12, labelY: 500 },
    { id: "data", x1: 110, x2: 430, top: 562, bottom: 646, inset: 22, edge: 8, labelY: 680 },
    { id: "models", x1: 570, x2: 890, top: 562, bottom: 646, inset: 22, edge: 8, labelY: 680 },
];

function wideWires(): Wire[] {
    const [analytics, workflows, integrations, ops, data, models] = WIDE_PLATFORMS;
    const opsBottom = platformBottom(ops);
    return withDelays([
        ...bundle(6, [190, 360], ops.top, [100, 260], platformBottom(analytics)),
        ...bundle(6, [415, 585], ops.top, [420, 580], platformBottom(workflows)),
        ...bundle(6, [640, 810], ops.top, [740, 900], platformBottom(integrations)),
        ...bundle(6, [160, 380], data.top, [210, 440], opsBottom),
        ...bundle(6, [620, 840], models.top, [560, 790], opsBottom),
    ]);
}

export const WIDE: OpsOsLayout = {
    viewWidth: 1000,
    viewHeight: 700,
    labelSize: 14,
    platforms: WIDE_PLATFORMS,
    entities: {
        customer: { x: 250, y: 335, labelSide: "above" },
        order: { x: 500, y: 335, labelSide: "above" },
        carrier: { x: 750, y: 335, labelSide: "above" },
        supplier: { x: 300, y: 415, labelSide: "below" },
        sku: { x: 500, y: 415, labelSide: "below" },
        warehouse: { x: 700, y: 415, labelSide: "below" },
    },
    wires: wideWires(),
};

/* ── Narrow ───────────────────────────────────────────────────────────────── */

const NARROW_PLATFORMS: Platform[] = [
    { id: "analytics", x1: 8, x2: 128, top: 40, bottom: 118, inset: 8, edge: 6, labelY: 26 },
    { id: "workflows", x1: 140, x2: 260, top: 40, bottom: 118, inset: 8, edge: 6, labelY: 26 },
    { id: "integrations", x1: 272, x2: 392, top: 40, bottom: 118, inset: 8, edge: 6, labelY: 26 },
    { id: "ops", x1: 12, x2: 388, top: 220, bottom: 500, inset: 16, edge: 8, labelY: 532 },
    { id: "data", x1: 12, x2: 192, top: 610, bottom: 680, inset: 10, edge: 6, labelY: 708 },
    { id: "models", x1: 208, x2: 388, top: 610, bottom: 680, inset: 10, edge: 6, labelY: 708 },
];

function narrowWires(): Wire[] {
    const [analytics, workflows, integrations, ops, data, models] = NARROW_PLATFORMS;
    const opsBottom = platformBottom(ops);
    return withDelays([
        ...bundle(3, [44, 124], ops.top, [36, 100], platformBottom(analytics)),
        ...bundle(3, [165, 235], ops.top, [168, 232], platformBottom(workflows)),
        ...bundle(3, [276, 356], ops.top, [300, 364], platformBottom(integrations)),
        ...bundle(4, [40, 164], data.top, [56, 176], opsBottom),
        ...bundle(4, [236, 360], models.top, [224, 344], opsBottom),
    ]);
}

export const NARROW: OpsOsLayout = {
    viewWidth: 400,
    viewHeight: 724,
    labelSize: 11,
    platforms: NARROW_PLATFORMS,
    entities: {
        customer: { x: 110, y: 280, labelSide: "left" },
        supplier: { x: 290, y: 280, labelSide: "right" },
        order: { x: 110, y: 370, labelSide: "left" },
        sku: { x: 290, y: 370, labelSide: "right" },
        carrier: { x: 110, y: 455, labelSide: "left" },
        warehouse: { x: 290, y: 455, labelSide: "right" },
    },
    wires: narrowWires(),
};
