import { useState } from "react";
import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { useTx, type Tx } from "./i18n";
import BoxesToTick from "./home/BoxesToTick";
import Hero from "./home/Hero";
import HowItWorks from "./home/HowItWorks";
import Loader from "./home/Loader";
import { shouldShowLoader } from "./home/loaderSession";
import Pricing from "./home/Pricing";
import ProofLabels from "./home/ProofLabels";
import WhatWeDo from "./home/WhatWeDo";
import WhoWeHelp from "./home/WhoWeHelp";
import "./HomePage.css";

/* The redesigned home page, ported from redesign/source/Main.src.html. */

const TICKER: [string, string][] = [
    ["Made in", "India"],
    ["Made in", "South Korea"],
    ["Made in", "China"],
    ["Made", "anywhere"],
    ["Sold in the", "USA"],
];

function Ticker({ tx }: { tx: Tx }) {
    // four copies so the -50% marquee loop never shows a gap
    const run = [0, 1, 2, 3].flatMap((r) => TICKER.map(([a, b], i) => ({ key: `${r}-${i}`, a, b })));
    return (
        <div className="tk" aria-label={tx("Brands from India, South Korea, China and anywhere else, sold in the USA")}>
            <div className="tk-run" aria-hidden="true">
                {run.map(({ key, a, b }) => (
                    <span key={key}>
                        {tx(a)} <b>{tx(b)}</b>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function HomePage() {
    const tx = useTx();
    const [showLoader] = useState(shouldShowLoader);

    return (
        <RdPage name="home" className={showLoader ? undefined : "no-loader"}>
            {showLoader && <Loader tx={tx} />}

            <RdHeader
                logoHref="#top"
                logoDelay={showLoader ? 3.35 : 0.15}
                links={[
                    { label: "What we do", href: "#services" },
                    { label: "How it works", href: "#how" },
                    { label: "Who we help", href: "#who" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "Lab", href: "/lab" },
                ]}
                mobileLinks={[
                    { label: "What we do", href: "#services" },
                    { label: "How it works", href: "#how" },
                    { label: "Who we help", href: "#who" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "Lab", href: "/lab" },
                ]}
            />

            <Hero tx={tx} />
            <Ticker tx={tx} />
            <BoxesToTick tx={tx} />
            <ProofLabels tx={tx} />

            <section id="problem" className="wrap bleed" style={{ position: "relative", paddingTop: "var(--sec)", paddingBottom: "var(--sec)", textAlign: "center" }}>
                <div className="rv" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, maxWidth: 860, margin: "0 auto" }}>
                    <span className="eyebrow">{tx("The idea")}</span>
                    <h2 className="h2" style={{ fontSize: "clamp(32px, 4.2vw, 54px)" }}>
                        {tx("You don't need to move to the US to sell there.")}
                    </h2>
                    <p className="lead" style={{ maxWidth: 640 }}>
                        {tx(
                            "You need a team that's already here. Vybd is that team. We handle the rules, the stock, the shipping and the customers, so selling in the US feels as easy as selling at home."
                        )}
                    </p>
                </div>
            </section>

            <WhatWeDo tx={tx} />
            <HowItWorks tx={tx} />
            <WhoWeHelp tx={tx} />
            <Pricing tx={tx} />

            <section id="contact" style={{ position: "relative", padding: "0 clamp(12px, 2vw, 24px) clamp(12px, 2vw, 24px)" }}>
                <div className="cta-routes" style={{ background: "#111827", color: "#FFFFFF", borderRadius: 36 }}>
                    <div className="wrap" style={{ paddingTop: "calc(var(--sec) * 1.25)", paddingBottom: 8 }}>
                        <div
                            className="rv"
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24, paddingBottom: "calc(var(--sec) * 1.25)" }}
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

            <RdFooter />
        </RdPage>
    );
}
