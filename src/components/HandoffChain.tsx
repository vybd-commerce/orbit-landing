import {
    NODE_HEIGHT,
    NODE_RX,
    NODE_WIDTH,
    chainLayout,
    type ChainNode,
} from "../data/handoffChainModel";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useReveal } from "../hooks/useReveal";
import { useScrollProgress } from "../hooks/useScrollProgress";
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
    /* Stacked layout only: the chain fills in as it scrolls past, and each
       leak is marked as the scan reaches it. On a phone the stacked chain is
       taller than the screen, so a one-shot reveal plays mostly offscreen. */
    scanOnScroll?: boolean;
    className?: string;
}

export default function HandoffChain({
    nodes,
    leakIndices = [],
    absorbedIndices = [],
    ariaLabel,
    showLabels = true,
    allowStack = true,
    scanOnScroll = false,
    className = "",
}: HandoffChainProps) {
    const { ref, revealed } = useReveal<HTMLDivElement>(0.3);
    const narrow = useMediaQuery("(max-width: 640px)");
    const orientation = allowStack && narrow ? "vertical" : "horizontal";
    const layout = chainLayout(nodes.length, orientation);
    const nodeWidth = NODE_WIDTH;

    const scanning = scanOnScroll && orientation === "vertical";
    const { ref: scanRef, progress } = useScrollProgress<SVGSVGElement>(scanning);
    /* Where the scan head is, in viewBox units. Past the last node at 1. */
    const scanY = progress * layout.viewHeight;
    const nodeCenterY = (i: number) => layout.nodes[i].y + NODE_HEIGHT / 2;
    const isScanned = (i: number) => !scanning || scanY >= nodeCenterY(i);
    const scanX = layout.nodes[0] ? layout.nodes[0].x + nodeWidth / 2 : 0;
    const scanLive = scanning && progress > 0 && progress < 1;

    return (
        <div
            ref={ref}
            className={`hc ${revealed ? "is-revealed" : ""} hc--${orientation}${scanning ? " hc--scan" : ""} ${className}`}
        >
            <svg
                ref={scanRef}
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

                {/* Scan overlay: each link fills in accent as the head passes
                    through it. pathLength=1 so the offset is the fraction. */}
                {scanning &&
                    layout.links.map((d, i) => {
                        const y1 = layout.nodes[i].y + NODE_HEIGHT;
                        const y2 = layout.nodes[i + 1].y;
                        const fill = Math.min(1, Math.max(0, (scanY - y1) / (y2 - y1)));
                        return (
                            <path
                                key={`scan-${i}`}
                                className="hc-scan-link"
                                d={d}
                                pathLength={1}
                                fill="none"
                                style={{ strokeDashoffset: 1 - fill }}
                            />
                        );
                    })}

                {layout.nodes.map((placed, i) => {
                    const isLeak = leakIndices.includes(i);
                    const isAbsorbed = absorbedIndices.includes(i);
                    const state = isAbsorbed ? "absorbed" : isLeak ? "leak" : "clean";
                    return (
                        <g
                            key={nodes[i].id}
                            className={`hc-node is-${state}${isScanned(i) ? " is-scanned" : ""}`}
                        >
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
                                    y={scanning && isLeak ? placed.labelY - 6 : placed.labelY}
                                    textAnchor={placed.labelAnchor}
                                >
                                    {orientation === "vertical" ? nodes[i].label : nodes[i].short}
                                </text>
                            )}
                            {showLabels && scanning && isLeak && (
                                <text
                                    className="hc-node-tag"
                                    x={placed.labelX}
                                    y={placed.labelY + 9}
                                    textAnchor={placed.labelAnchor}
                                    aria-hidden="true"
                                >
                                    LEAK FOUND
                                </text>
                            )}
                        </g>
                    );
                })}

                {scanLive && (
                    <circle className="hc-scan-head" cx={scanX} cy={scanY} r={3.5} />
                )}
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
