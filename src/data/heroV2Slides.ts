/* Slides for the root hero (HeroSectionV2). Each image pairs with an example
   prompt shown in the search box while it is on screen; the prompts and alt
   text are per language, in src/i18n/messages (hero.slides). Images live in
   public/images/hero-v2 as AVIF + WebP. */

export const HERO_V2_IMAGE_BASE = "/images/hero-v2";

export const HERO_V2_SLIDES = [
    "spices-india",
    "skincare-korea",
    "battery-china",
    "plates-bangladesh",
    "french-brand",
    "retailer-order",
    "port-dawn",
    "robots-china",
] as const;

export type HeroV2SlideId = (typeof HERO_V2_SLIDES)[number];

/* Each locale opens on its closest slide (Korean on the Seoul studio, and so
   on); the others follow in their usual order. */
export function orderedSlides(first: string): HeroV2SlideId[] {
    return [...HERO_V2_SLIDES].sort((a, b) => Number(b === first) - Number(a === first));
}
