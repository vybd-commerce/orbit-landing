import { useState } from "react";
import { RdFooter, RdHeader, RdPage } from "./chrome";
import { useTx, type Tx } from "./i18n";
import BoxesToTick from "./home/BoxesToTick";
import ClosingCta from "./home/ClosingCta";
import Hero from "./home/Hero";
import HowItWorks from "./home/HowItWorks";
import IdeaSection from "./home/IdeaSection";
import Loader from "./home/Loader";
import { shouldShowLoader } from "./home/loaderSession";
import Pricing from "./home/Pricing";
import ProofLabels from "./home/ProofLabels";
import WhatWeDo from "./home/WhatWeDo";
import WhoWeHelp from "./home/WhoWeHelp";
import "./HomePage.css";

/* The US page, the home at /, ported from redesign/source/Main.src.html.
   The global preview at /vybd (HomePage) reuses its hero, idea and closing
   sections. */

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

export default function UsPage() {
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

            <IdeaSection tx={tx} />

            <WhatWeDo tx={tx} />
            <HowItWorks tx={tx} />
            <WhoWeHelp tx={tx} />
            <Pricing tx={tx} />

            <ClosingCta tx={tx} />

            <RdFooter />
        </RdPage>
    );
}
