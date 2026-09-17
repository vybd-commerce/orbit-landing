import { useEffect, useRef, useState } from "react";
import {
  CHART_DATA_POINTS,
  MOBILE_STEPS,
  OPS_MODEL,
  REVENUE_DEFAULT,
  REVENUE_MAX,
  REVENUE_MIN,
  REVENUE_STEP,
  ASSUMPTIONS_COPY,
  annualDeltaMillions,
  conventionalHeadcount,
  nativeHeadcount,
} from "../data/opsModel";
import { track } from "../lib/analytics";
import "./OpsCostCurve.css";

// ── Chart geometry ──
// A fixed logical viewBox; CSS shrinks the rendered box on mobile, the
// coordinate math never changes.
const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 280;
const PADDING = { top: 16, right: 16, bottom: 32, left: 40 };
const PLOT_WIDTH = VIEW_WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = VIEW_HEIGHT - PADDING.top - PADDING.bottom;
const Y_MAX = 40; // clean headroom above the 34-person conventional endpoint

function xForRevenue(revenue: number): number {
  return PADDING.left + ((revenue - REVENUE_MIN) / (REVENUE_MAX - REVENUE_MIN)) * PLOT_WIDTH;
}

function yForHeadcount(headcount: number): number {
  return PADDING.top + PLOT_HEIGHT - (headcount / Y_MAX) * PLOT_HEIGHT;
}

const Y_TICKS = [0, 10, 20, 30, 40];
const X_TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function formatRevenue(revenue: number): string {
  return `$${revenue}M`;
}

function valueText(revenue: number): string {
  const conventional = Math.round(conventionalHeadcount(revenue));
  const native = Math.round(nativeHeadcount(revenue));
  return `${revenue} million dollars revenue, ${conventional} ops people conventional, ${native} native`;
}

export default function OpsCostCurve() {
  const [revenue, setRevenue] = useState(REVENUE_DEFAULT);
  const [hasAnimated, setHasAnimated] = useState(false);
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const interactedRef = useRef(false);

  const conventional = conventionalHeadcount(revenue);
  const native = nativeHeadcount(revenue);
  const delta = annualDeltaMillions(revenue);

  const conventionalPoints = CHART_DATA_POINTS.map(
    (p) => `${xForRevenue(p.revenue)},${yForHeadcount(p.conventional)}`
  ).join(" ");
  const nativePoints = CHART_DATA_POINTS.map(
    (p) => `${xForRevenue(p.revenue)},${yForHeadcount(p.native)}`
  ).join(" ");

  const markerX = xForRevenue(revenue);

  // Draw the curves once, the first time the chart scrolls into view.
  // prefers-reduced-motion skips the observer entirely, curves render
  // fully drawn from the start (see OpsCostCurve.css).
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setHasAnimated(true);
      return;
    }
    const el = chartWrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleInteraction(nextRevenue: number) {
    if (!interactedRef.current) {
      interactedRef.current = true;
      track("ops_curve_interacted", { revenue: nextRevenue });
    }
  }

  return (
    <div className="occ">
      <div className="occ-heading">
        <h2>Two ways to get to $100M.</h2>
        <p className="occ-subline">Drag to see what operations costs at each stage of growth.</p>
      </div>

      <div className="occ-control">
        <label htmlFor="ops-revenue-slider" className="occ-slider-label">
          Revenue: <span className="occ-slider-readout">{formatRevenue(revenue)}</span>
        </label>
        <input
          id="ops-revenue-slider"
          className="occ-slider"
          type="range"
          min={REVENUE_MIN}
          max={REVENUE_MAX}
          step={REVENUE_STEP}
          value={revenue}
          aria-valuetext={valueText(revenue)}
          onInput={(e) => {
            const next = Number(e.currentTarget.value);
            setRevenue(next);
            handleInteraction(next);
          }}
        />
        <div className="occ-steps" role="group" aria-label="Select revenue">
          {MOBILE_STEPS.map((v) => (
            <button
              key={v}
              type="button"
              className={v === revenue ? "is-active" : ""}
              aria-pressed={v === revenue}
              onClick={() => {
                setRevenue(v);
                handleInteraction(v);
              }}
            >
              {formatRevenue(v)}
            </button>
          ))}
        </div>
      </div>

      <div className="occ-tiles">
        <div className="occ-tile">
          <div className="occ-tile-label">Hire and bolt on</div>
          <div className="occ-tile-value">{Math.round(conventional)} people</div>
        </div>
        <div className="occ-tile">
          <div className="occ-tile-label">Build native</div>
          <div className="occ-tile-value">{Math.round(native)} people</div>
        </div>
        <div className="occ-tile">
          <div className="occ-tile-label">Annual difference</div>
          <div className="occ-tile-value">${delta.toFixed(1)}M</div>
        </div>
      </div>

      <div className="occ-legend">
        <div className="occ-legend-item">
          <span className="occ-swatch occ-swatch-conventional" aria-hidden="true" />
          Hire and bolt on
        </div>
        <div className="occ-legend-item">
          <span className="occ-swatch occ-swatch-native" aria-hidden="true" />
          Build native
        </div>
      </div>

      <div className={`occ-chart-wrap ${hasAnimated ? "occ-draw" : ""}`} ref={chartWrapRef}>
        <svg
          className="occ-svg"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label="Chart comparing operations headcount growth from $10M to $100M revenue. Hiring conventionally reaches 34 people at $100M. Building native workflows reaches 13 people."
        >
          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                className="occ-gridline"
                x1={PADDING.left}
                x2={VIEW_WIDTH - PADDING.right}
                y1={yForHeadcount(tick)}
                y2={yForHeadcount(tick)}
              />
              <text className="occ-axis-text" x={PADDING.left - 8} y={yForHeadcount(tick) + 3} textAnchor="end">
                {tick}
              </text>
            </g>
          ))}

          <text
            className="occ-axis-title"
            x={-(PADDING.top + PLOT_HEIGHT / 2)}
            y={12}
            textAnchor="middle"
            transform="rotate(-90)"
          >
            ops headcount
          </text>

          {X_TICKS.map((tick) => (
            <text
              key={tick}
              className={`occ-axis-text occ-x-tick ${tick % 20 !== 0 ? "occ-x-tick-minor" : ""}`}
              x={xForRevenue(tick)}
              y={VIEW_HEIGHT - PADDING.bottom + 20}
              textAnchor="middle"
            >
              ${tick}M
            </text>
          ))}

          <line
            className="occ-marker-line"
            x1={markerX}
            x2={markerX}
            y1={PADDING.top}
            y2={VIEW_HEIGHT - PADDING.bottom}
          />

          <polyline
            className="occ-polyline occ-polyline-conventional"
            points={conventionalPoints}
            pathLength={1}
          />
          <polyline
            className="occ-polyline occ-polyline-native"
            points={nativePoints}
            pathLength={1}
          />

          <circle className="occ-marker-ring" cx={markerX} cy={yForHeadcount(conventional)} r={7} />
          <circle className="occ-marker-dot occ-marker-conventional" cx={markerX} cy={yForHeadcount(conventional)} r={5} />
          <circle className="occ-marker-ring" cx={markerX} cy={yForHeadcount(native)} r={7} />
          <circle className="occ-marker-dot occ-marker-native" cx={markerX} cy={yForHeadcount(native)} r={5} />
        </svg>
      </div>

      <table className="lp-sr-only">
        <caption>Ops headcount by revenue, conventional versus native scaling</caption>
        <thead>
          <tr>
            <th scope="col">Revenue</th>
            <th scope="col">Conventional headcount</th>
            <th scope="col">Native headcount</th>
          </tr>
        </thead>
        <tbody>
          {CHART_DATA_POINTS.map((p) => (
            <tr key={p.revenue}>
              <td>{formatRevenue(p.revenue)}</td>
              <td>{Math.round(p.conventional)}</td>
              <td>{Math.round(p.native)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <details className="occ-assumptions">
        <summary>How we calculated this</summary>
        <p>{ASSUMPTIONS_COPY}</p>
        <p className="occ-assumptions-figures">
          Baseline: {OPS_MODEL.baselineHeadcount} people at ${OPS_MODEL.baselineRevenue}M revenue. Conventional
          slope: {OPS_MODEL.conventionalSlope} FTE per $1M. Native coefficient: {OPS_MODEL.nativeLogCoefficient} FTE
          per 10x revenue. Fully loaded cost: ${OPS_MODEL.fullyLoadedCost.toLocaleString()} per FTE per year.
        </p>
      </details>
    </div>
  );
}
