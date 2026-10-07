/* Slides for the root hero (HeroSectionV2). Each image pairs with an example
   prompt shown in the search box while it is on screen; the prompts and alt
   text are per language, in src/i18n/messages (hero.slides). Images live in
   public/images/hero-v2 as AVIF + WebP. */

export const HERO_V2_IMAGE_BASE = "/images/hero-v2";

/* In the order of a product's journey through the US, from studying the
   market to the doorstep. */
export const HERO_V2_SLIDES = [
    "spices-india",
    "skincare-korea",
    "plates-bangladesh",
    "retailer-order",
    "battery-china",
    "port-dawn",
    "french-brand",
    "robots-china",
] as const;

export type HeroV2SlideId = (typeof HERO_V2_SLIDES)[number];

/* The photo shown with each prompt. Slide ids name the prompt (whose copy
   lives in every locale); the photos are the "us-" set from
   generate_hero.py, each matched to the step its prompt asks about. */
export const HERO_V2_IMAGES: Record<HeroV2SlideId, string> = {
    "spices-india": "us-research",
    "skincare-korea": "us-voice",
    "plates-bangladesh": "us-buyer",
    "retailer-order": "us-order",
    "battery-china": "us-label",
    "port-dawn": "us-port",
    "french-brand": "us-warehouse",
    "robots-china": "us-doorstep",
};

/* Each locale opens on its closest slide (Korean on the Seoul studio, and so
   on); the others follow in their usual order. */
export function orderedSlides(first: string): HeroV2SlideId[] {
    return [...HERO_V2_SLIDES].sort((a, b) => Number(b === first) - Number(a === first));
}
