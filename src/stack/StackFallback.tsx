import { STAGES } from "./content";

/* Shown when WebGL is unavailable. The page must work with the canvas removed
 * entirely, so this carries the same argument statically: six plates, stacked,
 * uniform width, gaps that group the context bands.
 *
 * Decorative — the narrative copy beside it is what actually communicates.
 */

const PLATES = STAGES.filter((stage) => stage.id !== "loop");

const HALF_W = 132;
const HALF_H = 46;
const STEP = 74;
const TOP = 66;

export default function StackFallback() {
  const height = TOP + PLATES.length * STEP + HALF_H * 2 + 40;

  return (
    <svg
      className="stack-fallback"
      viewBox={`0 0 420 ${height}`}
      role="img"
      aria-label="The operating stack: six layers between systems of record and an operator's approval."
    >
      {PLATES.map((plate, i) => {
        const cx = 210;
        const cy = TOP + i * STEP;
        const top = `${cx},${cy} ${cx + HALF_W},${cy + HALF_H} ${cx},${cy + HALF_H * 2} ${
          cx - HALF_W
        },${cy + HALF_H}`;
        /* A shallow side face, so each plate reads as a solid rather than a
           flat diamond. */
        const side = `${cx - HALF_W},${cy + HALF_H} ${cx},${cy + HALF_H * 2} ${cx},${
          cy + HALF_H * 2 + 10
        } ${cx - HALF_W},${cy + HALF_H + 10}`;

        return (
          <g key={plate.id}>
            <polygon points={side} fill={plate.accent} opacity={0.28} />
            <polygon
              points={top}
              fill={plate.accent}
              opacity={0.18}
              stroke={plate.accent}
              strokeWidth={1}
            />
            <text
              x={cx + HALF_W + 14}
              y={cy + HALF_H + 4}
              fill="#98A1AD"
              fontSize="11"
              fontFamily="IBM Plex Mono, JetBrains Mono, monospace"
              letterSpacing="0.08em"
            >
              {plate.index} {plate.name.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
