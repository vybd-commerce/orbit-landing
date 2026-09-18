import {
    NODE_HEIGHT,
    NODE_RX,
    NODE_WIDTH,
    chainLayout,
    type ChainNode,
} from "../data/handoffChainModel";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useReveal } from "../hooks/useReveal";
import "./HandoffChain.css";

export interface HandoffChainProps {
    nodes: ChainNode[];
    /* Nodes where the money falls out. Drawn in the accent colour. */
    leakIndices?: number[];
    /* Nodes a system has taken over. Drawn dimmed and dashed. */
    absorbedIndices?: number[];
    ariaLabel: string;
    /* Off for the mini chains inside cards, where the type would be 5px. */
    showLabels?: boolean;
    /* Vertical below 640px. Off for mini chains, which already fit. */
    allowStack?: boolean;
    className?: string;
}

export default function HandoffChain({
    nodes,
    leakIndices = [],
    absorbedIndices = [],
    ariaLabel,
    showLabels = true,
    allowStack = true,
    className = "",
}: HandoffChainProps) {
    const { ref, revealed } = useReveal<HTMLDivElement>(0.3);
    const narrow = useMediaQuery("(max-width: 640px)");
    const orientation = allowStack && narrow ? "vertical" : "horizontal";
    const layout = chainLayout(nodes.length, orientation);
    const nodeWidth = NODE_WIDTH;

    return (
        <div
            ref={ref}
            className={`hc ${revealed ? "is-revealed" : ""} hc--${orientation} ${className}`}
        >
            <svg
                className="hc-svg"
                viewBox={`0 0 ${layout.viewWidth} ${layout.viewHeight}`}
                role="img"
                aria-label={ariaLabel}
                preserveAspectRatio="xMidYMid meet"
            >
                {layout.links.map((d, i) => (
                    <path
                        key={`link-${i}`}
                        className="hc-link"
                        d={d}
                        pathLength={1}
                        fill="none"
                        style={{ animationDelay: `${120 + i * 70}ms` }}
                    />
                ))}

                {layout.nodes.map((placed, i) => {
                    const isLeak = leakIndices.includes(i);
                    const isAbsorbed = absorbedIndices.includes(i);
                    const state = isAbsorbed ? "absorbed" : isLeak ? "leak" : "clean";
                    return (
                        <g key={nodes[i].id} className={`hc-node is-${state}`}>
                            <rect
                                className="hc-node-box"
                                x={placed.x}
                                y={placed.y}
                                width={nodeWidth}
                                height={NODE_HEIGHT}
                                rx={NODE_RX}
                            />
                            {isLeak && (
                                <circle
                                    className="hc-node-dot"
                                    cx={placed.x + nodeWidth / 2}
                                    cy={placed.y + NODE_HEIGHT / 2}
                                    r={4}
                                    style={{ animationDelay: `${420 + i * 90}ms` }}
                                />
                            )}
                            {showLabels && (
                                <text
                                    className="hc-node-label"
                                    x={placed.labelX}
                                    y={placed.labelY}
                                    textAnchor={placed.labelAnchor}
                                >
                                    {orientation === "vertical" ? nodes[i].label : nodes[i].short}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Same facts, in reading order, for anyone who cannot see the chart. */}
            <table className="lp-sr-only">
                <caption>{ariaLabel}</caption>
                <thead>
                    <tr>
                        <th scope="col">Stage</th>
                        <th scope="col">State</th>
                    </tr>
                </thead>
                <tbody>
                    {nodes.map((node, i) => (
                        <tr key={node.id}>
                            <td>{node.label}</td>
                            <td>
                                {absorbedIndices.includes(i)
                                    ? "Absorbed by a system"
                                    : leakIndices.includes(i)
                                        ? "Leak point"
                                        : "Unchanged"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
