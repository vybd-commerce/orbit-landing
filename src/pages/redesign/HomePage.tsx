import { useState } from "react";
import { RdFooter, RdHeader, RdPage } from "./chrome";
import { useTx } from "./i18n";
import ClosingCta from "./home/ClosingCta";
import Hero, { HeroWord } from "./home/Hero";
import IdeaSection from "./home/IdeaSection";
import Loader from "./home/Loader";
import { shouldShowLoader } from "./home/loaderSession";
import TierCards from "./home/TierCards";
import { SIGNUP_URL } from "./home/pricingTiers";
import "./HomePage.css";

/* The home at /: the global "Borderless." page. The hero, the idea, three
   sizes (Launch signs up; Scale and Enterprise contact sales; each links on
   to /us or /enterprise) and the closing call ("The world is
   ready for your <typed word>"), all on one navy canvas (.rd-global in
   HomePage.css). Shares its stylesheet and intro with the US page; the
   intro plays once per session on whichever of the two is opened first. */

const LINKS = [
    { label: "Pricing", href: "#tiers" },
    { label: "Enter the US", href: "/us" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Lab", href: "/lab" },
];

const IDEA_BODY =
    "Vybd runs the day-to-day of your supply chain: stock, orders, suppliers, 3PLs and channels, so you can build the brand. Start on your own in minutes, or bring us your whole operation.";

export default function HomePage() {
    const tx = useTx();
    const [showLoader] = useState(shouldShowLoader);

    return (
        <RdPage name="home" className={showLoader ? "rd-global" : "rd-global no-loader"}>
            {showLoader && <Loader tx={tx} />}

            <RdHeader logoHref="#top" logoDelay={showLoader ? 3.35 : 0.15} links={LINKS} mobileLinks={LINKS} />

            <Hero tx={tx} line={tx("Supply chain intelligence.")} sub={null} primary={null} secondary={null} boxHref="/us" />
            <div className="g-routes">
                <IdeaSection tx={tx} heading={null} body={IDEA_BODY} />
                <TierCards tx={tx} />
                <ClosingCta
                    tx={tx}
                    heading={
                        <>
                            {tx("The world is ready for your")}
                            <br />
                            <HeroWord key={tx.locale} locale={tx.locale} />
                        </>
                    }
                    text={null}
                    button="Get Vybd"
                    href={SIGNUP_URL}
                />
            </div>

            <RdFooter />
        </RdPage>
    );
}
