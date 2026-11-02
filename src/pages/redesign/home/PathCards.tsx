import { RdLink } from "../chrome";
import type { Tx } from "../i18n";

/* The two roads on the Borderless home, under the idea: brands coming to
   the US (the US page, /us) and brands already selling there
   (/enterprise). Each card is one link, drawn as a route ticket like the
   pricing labels (FROM / TO). Styles: .pc-* in HomePage.css. */

const PATHS = [
    {
        href: "/us",
        kicker: "Entering the US",
        title: "Bring your brand to the US.",
        body: "Compliance, stores, stock and shipping handled. Selling in 90 days.",
        from: "Your factory",
        to: "US shelves",
        cta: "Launch in the US",
    },
    {
        href: "/enterprise",
        kicker: "Already selling in the US",
        title: "Run your operation better.",
        body: "Connect your systems, find the leaks and put AI agents to work.",
        from: "Selling in the US",
        to: "Selling better",
        cta: "Vybd for enterprise",
    },
];

const Arrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

export default function PathCards({ tx }: { tx: Tx }) {
    return (
        <section id="paths" className="wrap pc" aria-label={tx("Choose your path")}>
            <div className="pc-grid">
                {PATHS.map((p) => (
                    <RdLink key={p.href} href={p.href} className="pc-card rv">
                        <span className="pc-kicker">{tx(p.kicker)}</span>
                        <span className="pc-title">{tx(p.title)}</span>
                        <span className="pc-body">{tx(p.body)}</span>
                        <span className="pc-route" aria-hidden="true">
                            <span>
                                <small>{tx("FROM")}</small>
                                {tx(p.from)}
                            </span>
                            <i />
                            <span>
                                <small>{tx("TO")}</small>
                                {tx(p.to)}
                            </span>
                        </span>
                        <span className="pc-cta">
                            {tx(p.cta)} <Arrow />
                        </span>
                    </RdLink>
                ))}
            </div>
        </section>
    );
}
