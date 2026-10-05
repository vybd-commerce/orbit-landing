/* Slides for the /hello hero (HeroSectionV2). Each image pairs with the
   example prompt shown in the search box while it is on screen. Images live
   in public/images/hero-v2 as AVIF + WebP. */

export type HeroV2Slide = {
    id: string;
    alt: string;
    prompt: string;
};

export const HERO_V2_IMAGE_BASE = "/images/hero-v2";

export const HERO_V2_SLIDES: HeroV2Slide[] = [
    {
        id: "spices-india",
        alt: "Worker scooping black peppercorns onto a scale beside sacks of spices in a Kerala processing unit",
        prompt: "Try 'We make spices in India. How do we get into US grocery stores?'",
    },
    {
        id: "skincare-korea",
        alt: "Founder filling small serum bottles at a wooden worktable in a sunlit Seoul skincare studio",
        prompt: "Try 'Our skincare brand is big in Korea. Where should we start in the US?'",
    },
    {
        id: "battery-china",
        alt: "Worker inspecting a battery cell in a Shenzhen factory",
        prompt: "Try 'We build batteries in China. What do we need to ship them to the US?'",
    },
    {
        id: "plates-bangladesh",
        alt: "Worker checking a stack of compostable plant-fiber plates in a tableware factory near Dhaka",
        prompt: "Try 'We make compostable plates in Bangladesh. Who in the US will buy them?'",
    },
    {
        id: "french-brand",
        alt: "Man taping a shipping box shut in a stone-walled packing room in Lyon",
        prompt: "Try 'Our French brand sells on Amazon US, but sales are flat. What next?'",
    },
    {
        id: "retailer-order",
        alt: "Warehouse worker guiding a forklift loading a pallet of cartons into a shipping container",
        prompt: "Try 'A US retailer wants our product. Can we handle the order?'",
    },
    {
        id: "port-dawn",
        alt: "Port worker with a tablet on the quay of a container port at dawn, cranes and a docked ship beyond",
        prompt: "Try 'What will it really cost to land our product in the US?'",
    },
    {
        id: "robots-china",
        alt: "Engineer adjusting a white robot arm on a test bench in a Shenzhen robotics workshop",
        prompt: "Try 'We build robots in China. How do we sell and support them in the US?'",
    },
];
