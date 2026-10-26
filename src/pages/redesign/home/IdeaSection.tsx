import type { ReactNode } from "react";
import type { Tx } from "../i18n";

/* "The idea": a navy band with one headline and a short paragraph. The /us
   page uses the US copy below; the global home passes its own. */

const US_BODY =
    "You need a team that's already here. Vybd is that team. We handle the rules, the stock, the shipping and the customers, so selling in the US feels as easy as selling at home.";

export default function IdeaSection({ tx, heading, body = US_BODY }: { tx: Tx; heading?: ReactNode; body?: string }) {
    return (
        <section
            id="problem"
            className="wrap bleed"
            style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)", textAlign: "center" }}
        >
            <div className="rv" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, maxWidth: 860, margin: "0 auto" }}>
                <span className="eyebrow">{tx("The idea")}</span>
                <h2 className="h2" style={{ fontSize: "clamp(32px, 4.2vw, 54px)" }}>
                    {heading ?? tx("You don't need to move to the US to sell there.")}
                </h2>
                <p className="lead" style={{ maxWidth: 640 }}>
                    {tx(body)}
                </p>
            </div>
        </section>
    );
}
