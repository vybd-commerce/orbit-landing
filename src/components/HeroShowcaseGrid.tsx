import { ArrowRight } from "lucide-react";
import { SHOWCASE_TILES, type ShowcaseTile } from "../data/heroShowcase";
import "./HeroShowcaseGrid.css";

/* Three preview renderers, shared across six tiles. Each is pure CSS motion —
   no canvas, no media — so the row costs nothing to load and survives
   prefers-reduced-motion by simply standing still. */

function SignalPreview({ lines }: { lines: string[] }) {
    return (
        <div className="hsg-signal">
            <div className="hsg-signal-bars" aria-hidden="true">
                {[38, 64, 47, 82, 56, 91, 72].map((h, i) => (
                    <span key={i} style={{ "--h": `${h}%`, "--d": `${i * 0.12}s` } as React.CSSProperties} />
                ))}
            </div>
            <ul className="hsg-lines">
                {lines.map((line, i) => (
                    <li key={line} className={i % 2 === 1 ? "is-accent" : undefined}>{line}</li>
                ))}
            </ul>
        </div>
    );
}

function LedgerPreview({ lines }: { lines: string[] }) {
    return (
        <ul className="hsg-ledger">
            {lines.map((line, i) => (
                <li key={line} style={{ "--d": `${i * 0.5}s` } as React.CSSProperties}>
                    <span className="hsg-ledger-tick" aria-hidden="true" />
                    {line}
                </li>
            ))}
        </ul>
    );
}

function RoutePreview({ lines }: { lines: string[] }) {
    return (
        <div className="hsg-route">
            <ol>
                {lines.map((line, i) => (
                    <li key={line} style={{ "--d": `${i * 0.45}s` } as React.CSSProperties}>
                        <span className="hsg-route-dot" aria-hidden="true" />
                        {line}
                    </li>
                ))}
            </ol>
        </div>
    );
}

function Preview({ tile }: { tile: ShowcaseTile }) {
    if (tile.preview === "signal") return <SignalPreview lines={tile.lines} />;
    if (tile.preview === "ledger") return <LedgerPreview lines={tile.lines} />;
    return <RoutePreview lines={tile.lines} />;
}

export default function HeroShowcaseGrid() {
    return (
        <section className="hsg-section" aria-label="What the system runs">
            <div className="hsg-grid">
                {SHOWCASE_TILES.map((tile) => (
                    <a
                        key={tile.id}
                        className={`hsg-tile ${tile.wide ? "is-wide" : ""}`}
                        href={tile.href}
                    >
                        <div className="hsg-preview">
                            <Preview tile={tile} />
                        </div>
                        <div className="hsg-footer">
                            <span className="hsg-label">{tile.label}</span>
                            <span className="hsg-explore">
                                Explore <ArrowRight size={14} />
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
