import { useEffect, useRef, useState } from "react";
import {
  ASSUMPTIONS_COPY,
  COLUMNS,
  EDGES,
  NODE_COUNTS,
  NODE_HEIGHT,
  OPS_MODEL,
  TOTAL_EDGES,
  TOTAL_NODES,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  hiringAnnualCost,
  nodeY,
  systemsAnnualCost,
} from "../data/opsComparisonModel";
import { track } from "../lib/analytics";
import "./OpsComparisonSection.css";

// One-line change per the brief's open item: swap this to "The default
// path" if "Without the right systems" reads as a judgement on sales
// calls rather than a diagnosis.
const LEFT_LABEL = "Without the right systems";
const RIGHT_LABEL = "With the right systems";

type PanelVariant = "hiring" | "systems";

interface PanelConfig {
  variant: PanelVariant;
  label: string;
  statPeople: string;
  statCost: string;
  dotCount: number;
  dashDuration: string;
  dotStagger: number; // ms between each dot's reveal delay
}

const PANELS: PanelConfig[] = [
  {
    variant: "hiring",
    label: LEFT_LABEL,
    statPeople: `${OPS_MODEL.hireHeadcount} people`,
    statCost: `$${(hiringAnnualCost / 1_000_000).toFixed(1)}M a year in ops payroll`,
    dotCount: OPS_MODEL.hireHeadcount,
    dashDuration: "1.1s",
    dotStagger: 30,
  },
  {
    variant: "systems",
    label: RIGHT_LABEL,
    statPeople: `${OPS_MODEL.systemsHeadcount} people`,
    statCost: `$${(systemsAnnualCost / 1_000_000).toFixed(1)}M a year in ops payroll`,
    dotCount: OPS_MODEL.systemsHeadcount,
    dashDuration: "2.8s",
    dotStagger: 34,
  },
];

function edgeGeometry(edge: (typeof EDGES)[number]) {
  const colIndex = edge.stage === "supplier-production" ? 0 : edge.stage === "production-warehousing" ? 1 : 2;
  const fromCol = COLUMNS[colIndex];
  const toCol = COLUMNS[colIndex + 1];
  const fromN =
    colIndex === 0 ? NODE_COUNTS.suppliers : colIndex === 1 ? NODE_COUNTS.production : NODE_COUNTS.warehousing;
  const toN = colIndex === 0 ? NODE_COUNTS.production : colIndex === 1 ? NODE_COUNTS.warehousing : NODE_COUNTS.channels;

  const x1 = fromCol.x + fromCol.width;
  const y1 = nodeY(fromN, edge.fromIndex) + NODE_HEIGHT / 2;
  const x2 = toCol.x;
  const y2 = nodeY(toN, edge.toIndex) + NODE_HEIGHT / 2;
  const mid = (x1 + x2) / 2;

  return { x1, y1, x2, y2, mid, dotX: mid, dotY: (y1 + y2) / 2 };
}

function Panel({ config, revealed }: { config: PanelConfig; revealed: boolean }) {
  return (
    <div className="ops-cmp-panel">
      <div className={`ops-cmp-panel-label ops-cmp-panel-label--${config.variant}`}>{config.label}</div>
      <div className={`ops-cmp-panel-stat ops-cmp-panel-stat--${config.variant}`}>{config.statPeople}</div>
      <div className="ops-cmp-panel-sub">{config.statCost}</div>

      <svg
        className="ops-cmp-svg"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`Supply chain diagram, ${TOTAL_NODES} nodes and ${TOTAL_EDGES} handoffs, ${config.dotCount} of them covered by ${config.variant === "hiring" ? "a person" : "a system"} at $${OPS_MODEL.revenue}M revenue.`}
      >
        {EDGES.map((edge, i) => {
          const g = edgeGeometry(edge);
          return (
            <path
              key={edge.id}
              className={`ops-cmp-edge ops-cmp-edge--${config.variant}`}
              d={`M ${g.x1} ${g.y1} C ${g.mid} ${g.y1}, ${g.mid} ${g.y2}, ${g.x2} ${g.y2}`}
              fill="none"
              style={{ animationDelay: `${-0.11 * i}s`, animationDuration: config.dashDuration }}
            />
          );
        })}

        {COLUMNS.map((col, colIndex) => {
          const n =
            colIndex === 0
              ? NODE_COUNTS.suppliers
              : colIndex === 1
                ? NODE_COUNTS.production
                : colIndex === 2
                  ? NODE_COUNTS.warehousing
                  : NODE_COUNTS.channels;
          return (
            <g key={col.key}>
              {Array.from({ length: n }, (_, i) => (
                <rect
                  key={i}
                  className="ops-cmp-node"
                  x={col.x}
                  y={nodeY(n, i)}
                  width={col.width}
                  height={NODE_HEIGHT}
                  rx={3}
                />
              ))}
            </g>
          );
        })}

        {EDGES.slice(0, config.dotCount).map((edge, i) => {
          const g = edgeGeometry(edge);
          return (
            <circle
              key={edge.id}
              className={`ops-cmp-dot ops-cmp-dot--${config.variant} ${revealed ? "is-revealed" : "is-static"}`}
              cx={g.dotX}
              cy={g.dotY}
              r={3.6}
              style={revealed ? { animationDelay: `${240 + i * config.dotStagger}ms` } : undefined}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function OpsComparisonSection() {
  const [revealed, setRevealed] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasRevealedRef = useRef(false);
  const assumptionsTrackedRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      hasRevealedRef.current = true;
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealedRef.current) {
          hasRevealedRef.current = true;
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function toggleAssumptions() {
    setAssumptionsOpen((prev) => {
      const next = !prev;
      if (next && !assumptionsTrackedRef.current) {
        assumptionsTrackedRef.current = true;
        track("ops_assumptions_opened");
      }
      return next;
    });
  }

  return (
    <div className="ops-cmp" ref={sectionRef}>
      <div className="ops-cmp-heading">
        <h2>Two ways to run a $100M brand</h2>
      </div>

      <div className="ops-cmp-grid">
        {PANELS.map((config) => (
          <Panel key={config.variant} config={config} revealed={revealed} />
        ))}
      </div>

      <p className="ops-cmp-footer">
        Nothing about the chain gets simpler. The systems absorb the handoffs instead of people.
      </p>

      <table className="lp-sr-only">
        <caption>Ops headcount, cost and handoffs at ${OPS_MODEL.revenue}M revenue, hiring versus systems</caption>
        <thead>
          <tr>
            <th scope="col">Path</th>
            <th scope="col">Headcount</th>
            <th scope="col">Annual cost</th>
            <th scope="col">Handoffs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{LEFT_LABEL}</td>
            <td>{OPS_MODEL.hireHeadcount}</td>
            <td>${(hiringAnnualCost / 1_000_000).toFixed(1)}M</td>
            <td>{TOTAL_EDGES}</td>
          </tr>
          <tr>
            <td>{RIGHT_LABEL}</td>
            <td>{OPS_MODEL.systemsHeadcount}</td>
            <td>${(systemsAnnualCost / 1_000_000).toFixed(1)}M</td>
            <td>{TOTAL_EDGES}</td>
          </tr>
        </tbody>
      </table>

      <div className="ops-cmp-assumptions">
        <button
          type="button"
          className="ops-cmp-assumptions-toggle"
          aria-expanded={assumptionsOpen}
          onClick={toggleAssumptions}
        >
          How we calculated this
        </button>
        {assumptionsOpen && (
          <div className="ops-cmp-assumptions-panel">
            <p>{ASSUMPTIONS_COPY}</p>
          </div>
        )}
      </div>
    </div>
  );
}
