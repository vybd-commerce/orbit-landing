/* Detail copy for each case study page, from redesign/source/cases_data.py. */

export type CaseDetail = {
    sector: string;
    overview: string;
    role: string;
    challenges: string[];
    solutions: string[];
    impact: string;
};

export const CASE_DETAILS: Record<string, CaseDetail> = {
    "the-indian-tapas": {
        sector: "Food & Beverage",
        overview: "The Indian Tapas is a modern Indian street food brand that people already love. To expand into the US, it needed new positioning, a clear picture of demand, and a step-by-step plan for going to market.",
        role: "We were the brand's US expansion and growth partner, building the foundation it needed to enter the market and scale.",
        challenges: [
            "No clear positioning for American customers",
            "No clear sense of which dishes to lead with",
            "Few people found the brand unless they already knew it",
            "Too dependent on delivery apps",
            "No step-by-step plan for launching",
        ],
        solutions: [
            "Repositioned the brand as quick, craveable street food",
            "Mapped demand and chose which menu items to lead with",
            "Built a plan for being found through search",
            "Designed a way to win customers directly, not only through delivery apps",
            "Planned a pilot-first launch to test before scaling",
        ],
        impact: "The Indian Tapas went from a business tied to one location to a demand-driven brand ready to grow in the US.",
    },
    "emsworth": {
        sector: "Home textiles",
        overview: "Emsworth makes terry cotton essentials like towels and bath linens. In the US this is a crowded category where most products look alike, so winning depends on positioning, trust and being easy to find.",
        role: "We were Emsworth's US market entry and growth partner, building a foundation for growth both on its own website and on marketplaces.",
        challenges: [
            "A crowded market where products barely differ",
            "No positioning beyond price",
            "Marketplaces dominate, so the brand owned few customer relationships",
            "Hard to find for shoppers who search without a brand name",
            "No plan for which products and channels to start with",
        ],
        solutions: [
            "Positioned the brand on quality: absorbency, durability and comfort",
            "Chose the products with the most US demand to lead with",
            "Set up growth through two channels at once: marketplaces and its own store",
            "Mapped what ready-to-buy shoppers search for",
            "Improved product content and presentation to build trust and lift sales",
        ],
        impact: "Emsworth went from a product-led business to a market-ready brand that can compete in a crowded US category.",
    },
    "flavor-atlas": {
        sector: "Premium produce",
        overview: "Flavor Atlas is a premium brand selling exotic fruits and vegetables sourced from around the world. To enter the US it needed more than great produce: clear positioning, a focus on the right categories, and a distribution plan for a competitive, logistics-heavy market.",
        role: "We were Flavor Atlas's US market entry and growth partner, building a foundation for its products, positioning and distribution.",
        challenges: [
            "A competitive produce market where quality is everything",
            "No clear positioning for exotic produce",
            "Complex distribution across stores and online",
            "Little brand awareness in the US",
            "No plan for what to prioritize and how to scale",
        ],
        solutions: [
            "Positioned the brand as premium and health-led",
            "Focused on high-demand categories like avocados, berries and specialty greens",
            "Built distribution across retail, online grocery and its own store",
            "Mapped what health-minded shoppers are looking for",
            "Planned a phased launch, from a pilot to full scale",
        ],
        impact: "Flavor Atlas went from a global sourcing brand to a premium produce player ready for the US, with a clear entry plan and room to grow.",
    },
    "karma": {
        sector: "Fashion and apparel",
        overview: "Karma is a fashion-forward clothing brand that manufactures in Bangladesh and sells mainly in the US. It already produced efficiently and had an emerging brand. The goal was to grow in a very competitive US fashion market without giving up quality or margin.",
        role: "We were Karma's growth advisor: helping more people find the brand beyond those already searching for it, and building a way to win customers that keeps working as it scales.",
        challenges: [
            "No clear positioning for the competitive US fashion market",
            "Most visitors already knew the brand or came from low-intent channels",
            "Heavy reliance on paid ads made each new customer expensive",
            "Hard to find for shoppers who search without a brand name",
            "Product strengths weren't coming through in US-focused messaging",
        ],
        solutions: [
            "Analyzed the market and competitors to find gaps in pricing, positioning and categories",
            "Sharpened messaging around quality, affordability and style",
            "Built a search strategy around what ready-to-buy shoppers type into Google",
            "Improved product and collection pages, and launched new pages built for search",
            "Used customer and social insights to create content that earns more clicks and sales",
            "Tailored search work to how and where Americans shop",
        ],
        impact: "Karma now has a stronger base for US growth: more people find it, it relies less on paid ads, and its production strengths now show up as clear value for customers.",
    },
    "kashida-layone": {
        sector: "Art and e-commerce",
        overview: "Kashida Layone is a modern art brand led by a single artist who wants to make original artwork accessible beyond traditional collectors. The work already had a loyal audience. The opportunity was to build the right setup to grow in the US.",
        role: "We were the artist's US market entry and growth partner, taking care of the business side so the artist could stay focused on making art.",
        challenges: [
            "No online store for US buyers",
            "Little knowledge of US art buyers and competitors",
            "Needed a clear plan for selling high-value pieces ($1,800 to $2,925)",
        ],
        solutions: [
            "Built a Shopify store for US buyers, with well-organized listings, collections and checkout",
            "Researched the market and competitors to map pricing, positioning and gaps",
            "Created a clear US launch plan aimed at the right buyers and channels",
        ],
        impact: "Kashida Layone went from a creator-led project to a market-ready business with a strong US online store and a plan to grow.",
    },
    "tanrom-lifesciences": {
        sector: "Health supplements",
        overview: "TanRom Lifesciences makes gummy supplements for sleep, immunity and daily health. The brand was doing well in India, but entering the US meant building for a market where trust matters and the rules are strict.",
        role: "We were the brand's US expansion partner, handling the operational, strategic and commercial groundwork it needed to launch and grow.",
        challenges: [
            "No US presence, store or setup",
            "Few people found the brand unless they already knew it",
            "A crowded supplement category where trust decides sales",
            "No plan for launching and scaling",
            "Gaps in compliance, messaging and marketplace readiness",
        ],
        solutions: [
            "Built a US-ready store with local pricing, messaging and checkout",
            "Mapped the US supplement market to find demand and positioning gaps",
            "Focused the launch on the best-performing products",
            "Rewrote product messaging around what people look for: sleep, immunity and wellness",
            "Made product claims and pages meet US rules and marketplace standards",
            "Set up two sales channels: its own store, plus readiness for marketplaces",
        ],
        impact: "TanRom Lifesciences went from a regional brand to a US-ready supplement company, with a compliant setup, a focused product line and channels to grow.",
    },
};
