export const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/* The prototype pins its scroll scenes only on screens shorter than this. */
export const PIN_MAX_VH = 1600;
