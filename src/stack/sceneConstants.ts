import { STAGES } from "./content";

/** Shared slab footprint. Every layer is the same width and depth — that
 *  uniformity is what makes it read as a stack rather than a pyramid. */
export const W = 5.4;
export const D = 3.5;

/** Layer accents, taken from the narrative copy so there is one palette. */
export const COLORS = Object.fromEntries(
  STAGES.map((stage) => [stage.id, stage.accent]),
) as Record<string, string>;

/** Y positions, top to bottom. */
export const Y = {
  sources: 3.9,
  contextTop: 1.9,
  contextStep: 0.34,
  agentPlate: 0.35,
  agentWorkers: 0.61,
  appPlate: -1.3,
  appRows: -1.18,
  governance: -2.9,
  gate: -2.62,
  review: -4.6,
  cards: -4.2,
} as const;

/** How far a layer rises into place as it reveals. */
export const RISE = 1.2;

/** Packet travel range. */
export const PACKET_TOP = 3.7;
export const PACKET_BOTTOM = -4.9;

export const PACKETS_DESKTOP = 34;
export const PACKETS_MOBILE = 12;

/** Clamp helper used by every staggered reveal. */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
