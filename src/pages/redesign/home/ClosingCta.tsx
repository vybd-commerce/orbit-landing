import { RdLink } from "../chrome";
import type { Tx } from "../i18n";

/* Closing call to book, on navy with shipping routes. */

export default function ClosingCta({ tx }: { tx: Tx }) {
    return (
        <section id="contact" style={{ position: "relative", padding: "0 clamp(12px, 2vw, 24px) clamp(12px, 2vw, 24px)" }}>
            <div className="cta-routes" style={{ background: "#111827", color: "#FFFFFF", borderRadius: 36 }}>
                <div className="wrap" style={{ paddingTop: "calc(var(--sec) * 1.25)", paddingBottom: 8 }}>
                    <div
                        className="rv"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            gap: 24,
                            paddingBottom: "calc(var(--sec) * 1.25)",
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: "clamp(52px, 8.4vw, 120px)", lineHeight: 0.98 }}>
                            {tx("Your next market")}
                            <br />
                            <em style={{ color: "var(--mint)" }}>{tx("is waiting.")}</em>
                        </h2>
                        <p style={{ margin: 0, maxWidth: 480, fontSize: 20, lineHeight: 1.45, color: "#9CA3AF" }}>
                            {tx("Tell us what you make. We'll show you what it takes to sell it in the US.")}
                        </p>
                        <RdLink className="btn btn-mint" href="/book">
                            {tx("Book a free call")}
                        </RdLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
