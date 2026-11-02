import { useState } from "react";
import { RdFooter, RdHeader, RdPage } from "./chrome";
import { useTx } from "./i18n";
import BoxesToTick from "./home/BoxesToTick";
import ClosingCta from "./home/ClosingCta";
import Hero from "./home/Hero";
import HowItWorks from "./home/HowItWorks";
import IdeaSection from "./home/IdeaSection";
import Loader from "./home/Loader";
import { shouldShowLoader } from "./home/loaderSession";
import Pricing from "./home/Pricing";
import ProfitCalc from "./home/ProfitCalc";
import ProofLabels from "./home/ProofLabels";
import StartPicker from "./home/StartPicker";
import Ticker from "./home/Ticker";
import WhatWeDo from "./home/WhatWeDo";
import WhoWeHelp from "./home/WhoWeHelp";
import "./HomePage.css";

/* The US page at /us, for anyone launching or growing in the US: from
   abroad, new US brands and brands already selling here. Ported from
   redesign/source/Main.src.html; the "Where are you today?" picker under
   the hero sends each to Vybd Plan, US Launch or US Scale. The Borderless home at / (HomePage)
   reuses its hero, idea and closing sections and links here. */

const TICKER: [string, string][] = [
    ["Made in", "India"],
    ["Made in", "South Korea"],
    ["Made in", "China"],
    ["Made", "anywhere"],
    ["Sold in the", "USA"],
];

export default function UsPage() {
    const tx = useTx();
    const [showLoader] = useState(shouldShowLoader);

    return (
        <RdPage name="home" className={showLoader ? undefined : "no-loader"}>
            {showLoader && <Loader tx={tx} />}

            <RdHeader
                logoHref="/"
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
            <StartPicker tx={tx} />
            <Ticker tx={tx} items={TICKER} label="Brands from India, South Korea, China and anywhere else, sold in the USA" />
            <BoxesToTick tx={tx} />
            <ProofLabels tx={tx} />

            <IdeaSection tx={tx} />

            <WhatWeDo tx={tx} />
            <HowItWorks tx={tx} />
            <WhoWeHelp tx={tx} />
            <Pricing tx={tx} />
            <ProfitCalc tx={tx} />

            <ClosingCta tx={tx} />

            <RdFooter />
        </RdPage>
    );
}
