export interface FunctionItem {
  id: string;
  title: string;
  does: string;
  reads: string[];
}

export const FUNCTIONS: FunctionItem[] = [
  {
    id: "demand-inventory",
    title: "Demand & Inventory",
    does: "Forecasts by SKU and channel, flags replenishment before you're short, and catches the slow moving inventory eating your cash.",
    reads: ["ERP", "3PL", "Shopify", "Amazon", "POS"],
  },
  {
    id: "retail-wholesale-ops",
    title: "Retail & Wholesale Ops",
    does: "Ingests POs from PDFs and email, validates deductions against your trade plan, and files disputes.",
    reads: ["Retailer portals", "Remittance files", "Trade calendar"],
  },
  {
    id: "item-data-content",
    title: "Item Data & Content",
    does: "Keeps catalog, specs, and listings consistent across every channel that sells you.",
    reads: ["PIM", "Marketplace listings", "Retailer item setup"],
  },
  {
    id: "logistics-fulfillment",
    title: "Logistics & Fulfillment",
    does: "Tracks shipments and exceptions, and reconciles freight invoices against quoted rates.",
    reads: ["3PL", "Carriers", "Freight invoices"],
  },
  {
    id: "market-channel-intelligence",
    title: "Market & Channel Intelligence",
    does: "Turns syndicated and POS data into velocity, distribution, and competitive movement you can act on.",
    reads: ["Syndicated data", "POS", "Marketplace"],
  },
  {
    id: "growth-revenue-ops",
    title: "Growth & Revenue Ops",
    does: "True margin by channel and customer, promotion ROI, and where trade spend actually went.",
    reads: ["Everything above"],
  },
];

export const SUBSTRATE_LABEL = "Connected operational data";
export const SUBSTRATE_SYSTEMS = ["ERP", "3PL", "Retailer portals", "Shopify", "Amazon", "POS", "Freight invoices"];
export const SUBSTRATE_CAPTION = "Nothing works until this does. It's also the part nobody wants to own.";
