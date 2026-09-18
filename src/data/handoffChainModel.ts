/* Geometry for the handoff-chain diagram on /consulting.
 *
 * Layout constants live here rather than in the component, the same split
 * opsComparisonModel.ts uses: the component reads coordinates, it never
 * computes them. Node size is fixed across variants and the viewBox grows
 * with the node count, so a five-node mini chain and the ten-node hero
 * chain draw at the same stroke weight once CSS scales them.
 */

export interface ChainNode {
    id: string;
    /* Full stage name. Used by the screen-reader table and the stacked
       layout, which has room for it. */
    label: string;
    /* One word, printed under the node in the horizontal layout. A 74px box
       cannot hold "Warehouse receipt" at a legible size, and unlabelled
       boxes are exactly the abstract node-graph this page is arguing
       against. */
    short: string;
}

/* One real order-to-cash chain for a consumer goods operation. The point of
   the visual is that these are stages an operator recognises, not abstract
   nodes, so the labels are the ones they would use themselves. */
export const CHAIN_NODES: ChainNode[] = [
    { id: "demand", label: "Demand plan", short: "Plan" },
    { id: "po", label: "PO issued", short: "PO" },
    { id: "supplier", label: "Supplier confirm", short: "Confirm" },
    { id: "production", label: "Production", short: "Produce" },
    { id: "freight", label: "Freight booked", short: "Freight" },
    { id: "customs", label: "Customs", short: "Customs" },
    { id: "receipt", label: "Warehouse receipt", short: "Receive" },
    { id: "inventory", label: "Inventory record", short: "Stock" },
    { id: "order", label: "Retailer order", short: "Order" },
    { id: "settlement", label: "Deduction settled", short: "Settle" },
];

export const TOTAL_NODES = CHAIN_NODES.length;
export const TOTAL_HANDOFFS = CHAIN_NODES.length - 1;

/* The three places the money actually falls out of the chain above. Cited in
   the hero and reused as the default everywhere the chain appears greyed. */
export const DEFAULT_LEAK_INDICES = [2, 5, 9];

export const NODE_WIDTH = 84;
export const NODE_HEIGHT = 40;
export const NODE_RX = 4;

const PAD = 12;
const GAP_X = 26;
const LABEL_BAND = 26; // room under the row for the stage label
const ROW_Y = 10;

const V_NODE_WIDTH = 84;
const V_GAP_Y = 16;
const V_VIEW_WIDTH = 320;

export interface PlacedNode {
    x: number;
    y: number;
    labelX: number;
    labelY: number;
    labelAnchor: "middle" | "start";
}

export interface ChainLayout {
    viewWidth: number;
    viewHeight: number;
    nodes: PlacedNode[];
    /* One path per handoff, already in SVG `d` form. */
    links: string[];
}

function horizontal(count: number): ChainLayout {
    const viewWidth = PAD * 2 + count * NODE_WIDTH + Math.max(count - 1, 0) * GAP_X;
    const viewHeight = ROW_Y + NODE_HEIGHT + LABEL_BAND;

    const nodes: PlacedNode[] = Array.from({ length: count }, (_, i) => {
        const x = PAD + i * (NODE_WIDTH + GAP_X);
        return {
            x,
            y: ROW_Y,
            labelX: x + NODE_WIDTH / 2,
            labelY: ROW_Y + NODE_HEIGHT + 16,
            labelAnchor: "middle",
        };
    });

    const links = nodes.slice(0, -1).map((node) => {
        const y = ROW_Y + NODE_HEIGHT / 2;
        const x1 = node.x + NODE_WIDTH;
        const x2 = x1 + GAP_X;
        return `M ${x1} ${y} L ${x2} ${y}`;
    });

    return { viewWidth, viewHeight, nodes, links };
}

function vertical(count: number): ChainLayout {
    const viewHeight = PAD * 2 + count * NODE_HEIGHT + Math.max(count - 1, 0) * V_GAP_Y;

    const nodes: PlacedNode[] = Array.from({ length: count }, (_, i) => {
        const y = PAD + i * (NODE_HEIGHT + V_GAP_Y);
        return {
            x: PAD,
            y,
            labelX: PAD + V_NODE_WIDTH + 14,
            labelY: y + NODE_HEIGHT / 2 + 4,
            labelAnchor: "start",
        };
    });

    const links = nodes.slice(0, -1).map((node) => {
        const x = PAD + V_NODE_WIDTH / 2;
        const y1 = node.y + NODE_HEIGHT;
        const y2 = y1 + V_GAP_Y;
        return `M ${x} ${y1} L ${x} ${y2}`;
    });

    return { viewWidth: V_VIEW_WIDTH, viewHeight, nodes, links };
}

export function chainLayout(count: number, orientation: "horizontal" | "vertical"): ChainLayout {
    return orientation === "vertical" ? vertical(count) : horizontal(count);
}
