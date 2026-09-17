export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  logoLabel: string; // short text fallback shown in the avatar circle if no logoImage
  logoImage?: string; // path under /public, e.g. "/assets/mib-industries-logo.png"
}

// Add more entries here, carousel controls only appear once there's more
// than one.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Vybd helped us simplify what had become a complicated import process from India to Atlanta. Instead of managing multiple shipments independently, they identified opportunities to consolidate products into fewer, better utilized containers, significantly reducing our freight and logistics costs.\n\nWhat impressed us most was how they combined hands on supply chain expertise with AI driven analysis to evaluate shipment volumes, container utilization, and consolidation opportunities. The result was a more efficient, cost effective, and scalable way for us to move food products from India to the U.S.",
    name: "Mahathesh",
    title: "MIB Industries",
    logoLabel: "MIB",
    logoImage: "/assets/mib-industries-logo.png",
  },
  {
    quote:
      "When we launched Emsworth in the U.S., my focus was on building the brand and getting our products in front of customers, not becoming an expert in inventory and supply chain. Vybd took a lot of that complexity off my plate.\n\nOne thing I really liked was how their AI agents worked in the background. If a product started selling faster than expected, the system could flag it early, tell us when we might run out, and recommend what we needed to order next. Instead of me digging through spreadsheets or constantly asking someone for an update, I could see what needed my attention and make a decision. For a founder, that saves a tremendous amount of time and lets you focus on actually growing the business.",
    name: "Bronson Coletrane",
    title: "Founder, Emsworth",
    logoLabel: "Emsworth",
  },
  {
    // Attributed by role, not name, and consistent with the Bayangrom case
    // study page, which cites the same way. Swap in the real name once the
    // founder has cleared it.
    quote:
      "Selling on Amazon and Shopify gives us a lot of data, but I honestly didn't know what to do with most of it. Vybd made that much simpler.\n\nThe marketing agent noticed that some of our products were getting plenty of traffic but weren't converting as well as similar styles. It pulled together the sales and product data and highlighted things we could actually change: pricing, promotions and even which products we should be pushing harder on each channel.\n\nWhat I like most is that I don't have to sit there analyzing reports. Vybd tells me what's happening, why it matters, and what I should do about it. As a founder, that's the part I care about.",
    name: "Founder",
    title: "Bayangrom, DTC streetwear",
    logoLabel: "Bayangrom",
  },
];
