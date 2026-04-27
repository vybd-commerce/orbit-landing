export type CaseStudyMetric = {
  value: string;
  label: string;
};

export type CaseStudyDetails = {
  overview: string;
  role: string;
  challenges: string[];
  solutions: string[];
  impact: string;
  ctaTitle?: string;
  ctaText?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  metrics: CaseStudyMetric[];
  details: CaseStudyDetails;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "the-indian-tapas",
    title: "Building a U.S.-Ready Growth Model for an Indian QSR Brand",
    category: "Food & Beverage",
    summary:
      "Helped The Indian Tapas prepare for U.S. expansion through positioning, menu prioritization, and a demand-led growth strategy.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    metrics: [
      { value: "3", label: "Core Menu Categories Identified" },
      { value: "High Intent", label: "Discovery Framework Built" },
      { value: "Direct", label: "Acquisition Model Established" },
    ],
    details: {
      overview:
        "The Indian Tapas is a modern Indian street food brand with strong product-market fit. Expansion into the U.S. required repositioning, demand mapping, and a structured go-to-market approach.",
      role:
        "We partnered as the brand's U.S. expansion and growth strategy partner, building a scalable foundation for market entry.",
      challenges: [
        "No clear U.S. market positioning",
        "Unclear demand prioritization",
        "Limited discovery beyond brand awareness",
        "Dependency on delivery platforms",
        "No structured go-to-market plan",
      ],
      solutions: [
        "Reframed positioning to quick, craveable street food",
        "Mapped demand and prioritized menu items",
        "Built search-led discovery strategy",
        "Designed direct acquisition framework",
        "Defined pilot-first go-to-market approach",
      ],
      impact:
        "Transformed from a location-based food business into a scalable, demand-driven brand ready for U.S. expansion.",
    },
  },
  {
    slug: "emsworth",
    title: "Structuring a U.S. Entry Strategy for a Commodity-Driven Category",
    category: "Retail / Home Textiles",
    summary:
      "Helped Emsworth enter the U.S. market by defining positioning, prioritizing SKUs, and building a dual-channel growth strategy.",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1600",
    metrics: [
      { value: "Focused", label: "SKU Strategy Defined" },
      { value: "Dual Channel", label: "Growth Model Activated" },
      { value: "Search Led", label: "Discovery Framework Built" },
    ],
    details: {
      overview:
        "Emsworth is a terry cotton products brand specializing in everyday essentials like towels and bath linens. Expanding into the U.S. required navigating a highly competitive and commoditized category where success depends on positioning, trust, and discoverability.",
      role:
        "We partnered as Emsworth's U.S. market entry and growth strategy partner, building a scalable foundation for both direct-to-consumer and marketplace-driven growth.",
      challenges: [
        "Highly commoditized market with minimal differentiation",
        "No clear market positioning beyond price",
        "Marketplace-dominated ecosystem limiting brand ownership",
        "Low visibility for high-intent non-branded searches",
        "No structured entry strategy for SKUs and channels",
      ],
      solutions: [
        "Defined positioning around quality-led essentials (absorbency, durability, comfort)",
        "Prioritized high-impact SKUs aligned with U.S. demand",
        "Built a dual-channel growth model (marketplaces + DTC)",
        "Mapped high-intent search demand for discovery",
        "Strengthened conversion and trust signals through better content and presentation",
      ],
      impact:
        "Emsworth evolved from a product-led business into a structured, market-ready brand positioned to compete effectively in a commoditized U.S. category.",
    },
  },
  {
    slug: "flavor-atlas",
    title: "Structuring a U.S. Entry Strategy for a Premium Produce Brand",
    category: "Food & Beverage / Premium Produce",
    summary:
      "Helped Flavor Atlas prepare for U.S. expansion through premium positioning, category prioritization, and a structured multi-channel distribution strategy.",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
    metrics: [
      { value: "4", label: "High-Demand Product Categories Identified" },
      { value: "3", label: "Distribution Channels Activated" },
      { value: "2-Phase", label: "Market Entry Strategy Defined" },
    ],
    details: {
      overview:
        "Flavor Atlas is a premium brand specializing in exotic fruits and vegetables sourced globally. Entering the U.S. market required more than product strength. It required clear positioning, demand prioritization, and a structured distribution strategy in a highly competitive, logistics-driven category.",
      role:
        "We partnered as Flavor Atlas's U.S. market entry and growth strategy partner, focused on building a scalable foundation for expansion across product, positioning, and distribution.",
      challenges: [
        "Highly competitive and quality-driven produce market",
        "No clear category positioning for exotic produce",
        "Distribution complexity across retail and digital channels",
        "Low brand awareness in the U.S. market",
        "No structured go-to-market plan for prioritization and scale",
      ],
      solutions: [
        "Defined a premium, health-led positioning strategy",
        "Prioritized high-demand categories like avocados, berries, and specialty greens",
        "Built a multi-channel distribution model across retail, online grocery, and DTC",
        "Mapped high-intent consumer demand around health, organic consumption, and nutrition",
        "Designed a phased market entry plan from pilot launch to scalable expansion",
      ],
      impact:
        "Flavor Atlas transitioned from a global sourcing brand into a U.S.-ready premium produce player with a structured entry strategy and scalable growth model.",
    },
  },
  {
    slug: "karma",
    title: "Scaling U.S. Growth for a Fashion-Forward Apparel Brand",
    category: "Fashion / Apparel",
    summary:
      "Helped Karma strengthen its U.S. digital presence through sharper positioning, SEO-led discoverability, and a scalable acquisition strategy.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    metrics: [
      { value: "$12K", label: "Increase in Revenue" },
      { value: "24%", label: "Increase in Growth" },
      { value: "100+", label: "High-Intent Keywords Ranked" },
    ],
    details: {
      overview:
        "Karma is a fashion-forward apparel brand manufacturing in Bangladesh and distributing primarily in the United States. With a strong foundation in cost-efficient production and an emerging brand identity, Karma aimed to scale in the highly competitive U.S. fashion market while maintaining quality and margin efficiency.",
      role:
        "We partnered as strategic growth advisors to strengthen Karma's digital presence, improve discoverability beyond branded searches, and build a scalable acquisition engine that could drive both online revenue and long-term brand equity.",
      challenges: [
        "Lacked clear U.S. market-specific positioning in a competitive fashion landscape",
        "A large share of traffic came from branded or low-intent channels",
        "High dependency on paid acquisition increased CAC and hurt profitability",
        "Low visibility for non-branded, high-intent keywords",
        "Product value was not being translated into compelling U.S.-focused messaging",
      ],
      solutions: [
        "Conducted market and competitor analysis to identify whitespace opportunities in pricing, positioning, and category gaps",
        "Refined brand positioning and messaging around quality, affordability, and style relevance",
        "Developed a data-backed SEO strategy focused on high-intent, non-branded keywords",
        "Optimized product and collection pages and launched new search-optimized landing pages",
        "Used customer and social insights to create content that improved engagement and conversion",
        "Implemented localized SEO strategies aligned with U.S. search behavior and regional demand",
      ],
      impact:
        "Karma built a stronger foundation for scalable U.S. growth by improving discoverability, reducing dependence on paid acquisition, and translating supply-side strengths into clearer market-facing value.",
      ctaTitle: "Let's build your next growth chapter.",
      ctaText:
        "Book a consultation to explore how data-driven expansion strategies can unlock new markets for your brand.",
    },
  },
  {
    slug: "kashida-layone",
    title: "Building a U.S. Growth Foundation for a Modern Art Brand",
    category: "Art / E-commerce",
    summary:
      "Helped Kashida Layone establish a U.S.-ready e-commerce presence through Shopify setup, market research, and a structured go-to-market strategy for a high-AOV art brand.",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
    metrics: [
      { value: "$10K+", label: "Revenue Generated" },
      { value: "30%", label: "Traffic Growth" },
      { value: "100+", label: "Non-Brand Queries Ranked ≤5" },
    ],
    details: {
      overview:
        "Kashida Layone is a modern art brand led by a single artist focused on making original artwork accessible beyond traditional collectors. With strong product-market fit and a loyal audience, the opportunity was to build the right infrastructure to scale in the U.S. market.",
      role:
        "We partnered as the client's U.S. market entry and growth partner, handling the operational and commercial foundation while enabling the artist to stay focused on creative work.",
      challenges: [
        "No U.S.-focused e-commerce presence or Shopify storefront",
        "Limited visibility into the U.S. art buyer landscape and competitors",
        "Need for a structured strategy in a high-AOV ($1,800-$2,925) category",
      ],
      solutions: [
        "Built and configured a U.S.-facing Shopify storefront with optimized product listings, collections, and checkout flow",
        "Conducted market and competitor research to map pricing, positioning, and whitespace opportunities",
        "Developed a clear U.S. go-to-market strategy targeting the right buyer segments and channels",
      ],
      impact:
        "Kashida Layone successfully transitioned from a creator-led brand into a structured, market-ready business with a strong U.S. e-commerce foundation and scalable growth strategy.",
      ctaTitle: "Let's build your next growth chapter.",
      ctaText:
        "Book a consultation to explore how data-driven expansion strategies can unlock new markets for your brand.",
    },
  },
  {
    slug: "tanrom-lifesciences",
    title: "Building a U.S. Entry Strategy for a Nutraceutical Wellness Brand",
    category: "Health / Nutraceuticals",
    summary:
      "Helped TanRom Lifesciences enter the U.S. market through a compliance-ready storefront, focused SKU strategy, and a dual-channel growth model.",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843",
    metrics: [
      { value: "3", label: "High-Intent SKUs Selected" },
      { value: "100%", label: "Compliance-Ready Setup" },
      { value: "2", label: "Growth Channels Activated" },
    ],
    details: {
      overview:
        "TanRom Lifesciences is a modern nutraceutical brand focused on gummy-based wellness products across sleep, immunity, and daily health. While the brand had strong traction in India, entering the U.S. required building a system that could compete in a highly trust-driven and regulated market.",
      role:
        "We partnered as the client's U.S. expansion partner, owning the operational, strategic, and commercial groundwork required to successfully enter and scale in the U.S. market.",
      challenges: [
        "No U.S. presence, storefront, or infrastructure",
        "Low discoverability beyond brand-driven traffic",
        "Highly competitive, trust-driven supplement category",
        "No structured go-to-market strategy for launch and scaling",
        "Gaps in compliance, messaging, and marketplace readiness",
      ],
      solutions: [
        "Built a U.S.-ready storefront with localized pricing, messaging, and conversion flows",
        "Mapped the U.S. supplement landscape to identify demand pockets and positioning opportunities",
        "Defined a focused launch strategy around high-performing SKUs",
        "Reframed product messaging around high-intent use cases like sleep, immunity, and wellness",
        "Aligned product claims and pages with U.S. regulatory and marketplace standards",
        "Activated a dual-channel model (DTC + marketplace readiness)",
      ],
      impact:
        "TanRom Lifesciences transformed from a regionally focused brand into a U.S.-ready nutraceutical player with compliant infrastructure, focused product strategy, and scalable growth channels.",
    },
  },
];
