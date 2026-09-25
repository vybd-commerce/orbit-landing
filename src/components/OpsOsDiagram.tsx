import type { ReactNode } from "react";
import { Factory, Package, ShoppingCart, Truck, User, Warehouse, type LucideIcon } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import {
    ENTITY_LABELS,
    LAYER_LABELS,
    LAYER_ROLES,
    NARROW,
    RELATIONS,
    WIDE,
    type EntityId,
    type EntityPos,
    type LayerId,
    type OpsOsLayout,
    type Platform,
} from "../data/opsOsModel";
/* Wires reuse the /product graph's travelling pulse (.ang-connection-pulse,
   @keyframes flowPulse) rather than redefining it. */
import "./ArchitectureNodeGraph.css";
import "./OpsOsDiagram.css";

const ENTITY_ICONS: Record<EntityId, LucideIcon> = {
    customer: User,
    order: ShoppingCart,
    carrier: Truck,
    supplier: Factory,
    sku: Package,
    warehouse: Warehouse,
};

/* Glyphs are drawn once in a local box and scaled into each platform face. */
const SURFACE_BOX = { w: 260, h: 110 };
const SOURCE_BOX = { w: 320, h: 80 };

function facePoints(p: Platform): string {
    return [
        `${p.x1 + p.inset},${p.top}`,
        `${p.x2 - p.inset},${p.top}`,
        `${p.x2},${p.bottom}`,
        `${p.x1},${p.bottom}`,
    ].join(" ");
}

function fitGlyph(p: Platform, box: { w: number; h: number }): string {
    const w = p.x2 - p.x1;
    const h = p.bottom - p.top;
    const s = Math.min(w / box.w, h / box.h);
    const dx = p.x1 + (w - box.w * s) / 2;
    const dy = p.top + (h - box.h * s) / 2;
    return `translate(${dx} ${dy}) scale(${s})`;
}

/* ── Surface glyphs (local 260×110) ── */

function AnalyticsGlyph() {
    return (
        <g>
            <rect className="ops-os-window" x="44" y="14" width="124" height="74" rx="3" />
            <polyline className="ops-os-ink" points="56,74 78,56 100,64 122,40 150,48" />
            {[[78, 56], [122, 40], [150, 48]].map(([cx, cy]) => (
                <circle key={cx} className="ops-os-accent" cx={cx} cy={cy} r="3.5" />
            ))}
            <rect className="ops-os-window" x="148" y="30" width="72" height="62" rx="3" />
            {[18, 30, 22, 40, 28].map((h, i) => (
                <line key={i} className="ops-os-ink" x1={160 + i * 12} y1="84" x2={160 + i * 12} y2={84 - h} />
            ))}
        </g>
    );
}

function WorkflowsGlyph() {
    return (
        <g>
            <rect className="ops-os-window" x="48" y="10" width="164" height="90" rx="3" />
            <rect className="ops-os-accent" x="115" y="20" width="30" height="13" rx="2" />
            <path className="ops-os-ink" d="M130,33 V42 M90,42 H170 M90,42 V50 M170,42 V50" />
            <rect className="ops-os-window" x="75" y="50" width="30" height="13" rx="2" />
            <rect className="ops-os-window" x="155" y="50" width="30" height="13" rx="2" />
            <rect className="ops-os-accent ops-os-accent-fill" x="96" y="74" width="68" height="16" rx="8" />
            <text className="ops-os-glyph-text ops-os-glyph-text--accent" x="130" y="85.5">ACTION</text>
        </g>
    );
}

function IntegrationsGlyph() {
    return (
        <g>
            {[44, 104, 164].map((x) => (
                <g key={x}>
                    <rect className="ops-os-window" x={x} y="12" width="52" height="44" rx="3" />
                    <path className="ops-os-ink" d={`M${x + 26},${26} V${42} M${x + 19},${34} H${x + 33}`} />
                </g>
            ))}
            {[40, 90, 140, 190].map((x) => (
                <g key={x}>
                    <rect className="ops-os-pill" x={x} y="70" width="34" height="15" rx="7.5" />
                    <text className="ops-os-glyph-text" x={x + 17} y="81">API</text>
                </g>
            ))}
        </g>
    );
}

/* ── Source glyphs (local 320×80), 2 rows × 5 tiles ── */

const TILE = 26;
const TILE_GAP = 14;
const TILE_X0 = (SOURCE_BOX.w - (5 * TILE + 4 * TILE_GAP)) / 2;

function tiles(draw: (kind: number, x: number, y: number) => ReactNode) {
    const out: ReactNode[] = [];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 5; col++) {
            const x = TILE_X0 + col * (TILE + TILE_GAP);
            const y = 8 + row * (TILE + 12);
            out.push(
                <g key={`${row}-${col}`}>
                    <rect className="ops-os-window" x={x} y={y} width={TILE} height={TILE} rx="3" />
                    {draw((row * 5 + col + row) % 3, x, y)}
                </g>,
            );
        }
    }
    return out;
}

function DataGlyph() {
    return (
        <g>
            {tiles((kind, x, y) => {
                const cx = x + TILE / 2;
                if (kind === 0) {
                    return (
                        <g>
                            <ellipse className="ops-os-accent" cx={cx} cy={y + 8} rx="7" ry="2.5" />
                            <path className="ops-os-ink" d={`M${cx - 7},${y + 8} V${y + 18} A7,2.5 0 0 0 ${cx + 7},${y + 18} V${y + 8}`} />
                        </g>
                    );
                }
                if (kind === 1) {
                    return <path className="ops-os-ink" d={`M${x + 6},${y + 9} H${x + 20} M${x + 6},${y + 13} H${x + 20} M${x + 6},${y + 17} H${x + 16}`} />;
                }
                return (
                    <g>
                        {[0, 1, 2].flatMap((r) =>
                            [0, 1, 2].map((c) => (
                                <circle key={`${r}${c}`} className="ops-os-dot" cx={x + 8 + c * 5} cy={y + 8 + r * 5} r="1.2" />
                            )),
                        )}
                    </g>
                );
            })}
        </g>
    );
}

function ModelsGlyph() {
    return (
        <g>
            {tiles((kind, x, y) => {
                if (kind === 0) {
                    return (
                        <g>
                            <path className="ops-os-ink" d={`M${x + 8},${y + 9} L${x + 18},${y + 13} L${x + 9},${y + 19} Z`} />
                            <circle className="ops-os-accent" cx={x + 8} cy={y + 9} r="2.2" />
                            <circle className="ops-os-accent" cx={x + 18} cy={y + 13} r="2.2" />
                            <circle className="ops-os-accent" cx={x + 9} cy={y + 19} r="2.2" />
                        </g>
                    );
                }
                if (kind === 1) {
                    return <path className="ops-os-ink" d={`M${x + 6},${y + 20} L${x + 11},${y + 14} L${x + 15},${y + 16} L${x + 20},${y + 7}`} />;
                }
                return (
                    <g>
                        <circle className="ops-os-ink" cx={x + 13} cy={y + 13} r="5" />
                        <path className="ops-os-ink" d={`M${x + 13},${y + 5} V${y + 8} M${x + 13},${y + 18} V${y + 21} M${x + 5},${y + 13} H${x + 8} M${x + 18},${y + 13} H${x + 21}`} />
                    </g>
                );
            })}
        </g>
    );
}

const GLYPHS: Partial<Record<LayerId, { el: ReactNode; box: { w: number; h: number } }>> = {
    analytics: { el: <AnalyticsGlyph />, box: SURFACE_BOX },
    workflows: { el: <WorkflowsGlyph />, box: SURFACE_BOX },
    integrations: { el: <IntegrationsGlyph />, box: SURFACE_BOX },
    data: { el: <DataGlyph />, box: SOURCE_BOX },
    models: { el: <ModelsGlyph />, box: SOURCE_BOX },
};

/* ── Ops OS entity graph ── */

function entityLabel(pos: EntityPos, r: number) {
    switch (pos.labelSide) {
        case "above":
            return { x: pos.x, y: pos.y - r - 8, anchor: "middle" as const };
        case "below":
            return { x: pos.x, y: pos.y + r + 16, anchor: "middle" as const };
        case "left":
            return { x: pos.x - r - 8, y: pos.y + 4, anchor: "end" as const };
        case "right":
            return { x: pos.x + r + 8, y: pos.y + 4, anchor: "start" as const };
    }
}

function EntityGraph({ layout }: { layout: OpsOsLayout }) {
    const r = layout === WIDE ? 20 : 17;
    const icon = layout === WIDE ? 18 : 15;
    const pillH = 18;

    return (
        <g>
            {RELATIONS.map((rel) => {
                const a = layout.entities[rel.from];
                const b = layout.entities[rel.to];
                return <line key={`${rel.from}-${rel.to}`} className="ops-os-relation" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
            })}

            {RELATIONS.map((rel) => {
                const a = layout.entities[rel.from];
                const b = layout.entities[rel.to];
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const w = rel.label.length * 6.4 + 18;
                return (
                    <g key={`pill-${rel.from}-${rel.to}`}>
                        <rect className="ops-os-relation-pill" x={mx - w / 2} y={my - pillH / 2} width={w} height={pillH} rx={pillH / 2} />
                        <text className="ops-os-relation-text" x={mx} y={my + 3.8}>{rel.label}</text>
                    </g>
                );
            })}

            {(Object.keys(layout.entities) as EntityId[]).map((id) => {
                const pos = layout.entities[id];
                const Icon = ENTITY_ICONS[id];
                const label = entityLabel(pos, r);
                return (
                    <g key={id}>
                        <circle className="ops-os-entity" cx={pos.x} cy={pos.y} r={r} />
                        <Icon
                            className="ops-os-entity-icon"
                            x={pos.x - icon / 2}
                            y={pos.y - icon / 2}
                            width={icon}
                            height={icon}
                            strokeWidth={1.6}
                        />
                        <text className="ops-os-entity-label" x={label.x} y={label.y} textAnchor={label.anchor}>
                            {ENTITY_LABELS[id]}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

export default function OpsOsDiagram() {
    const narrow = useMediaQuery("(max-width: 640px)");
    const layout = narrow ? NARROW : WIDE;

    return (
        <div className="ops-os">
            <svg
                className="ops-os-svg"
                viewBox={`0 0 ${layout.viewWidth} ${layout.viewHeight}`}
                role="img"
                aria-label="Vybd's operations stack. Data and models feed one operating layer, Ops OS, which models customers, orders, SKUs, suppliers, warehouses and carriers. Analytics, workflows and integrations all run on top of it."
            >
                <g className="ops-os-wires">
                    {layout.wires.map((w, i) => (
                        <g key={i}>
                            <path className="ops-os-wire" d={w.d} />
                            <path
                                className="ops-os-wire-pulse ang-connection-pulse"
                                d={w.d}
                                style={{ strokeDasharray: "10, 100", animationDelay: `${w.delay}s` }}
                            />
                        </g>
                    ))}
                </g>

                {layout.platforms.map((p) => {
                    const glyph = GLYPHS[p.id];
                    return (
                        <g key={p.id} className={`ops-os-platform ops-os-platform--${p.id}`}>
                            <rect className="ops-os-edge" x={p.x1} y={p.bottom} width={p.x2 - p.x1} height={p.edge} />
                            <polygon className="ops-os-face" points={facePoints(p)} />
                            {glyph && <g transform={fitGlyph(p, glyph.box)}>{glyph.el}</g>}
                            <text
                                className="ops-os-label"
                                x={(p.x1 + p.x2) / 2}
                                y={p.labelY}
                                style={{ fontSize: layout.labelSize }}
                            >
                                {LAYER_LABELS[p.id].toUpperCase()}
                            </text>
                        </g>
                    );
                })}

                <EntityGraph layout={layout} />
            </svg>

            <table className="lp-sr-only">
                <caption>Layers of the operations stack, top to bottom</caption>
                <tbody>
                    {(["analytics", "workflows", "integrations", "ops", "data", "models"] as LayerId[]).map((id) => (
                        <tr key={id}>
                            <th scope="row">{LAYER_LABELS[id]}</th>
                            <td>{LAYER_ROLES[id]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
