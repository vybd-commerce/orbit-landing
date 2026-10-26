import { useState } from "react";
import { RdFooter, RdHeader, RdPage } from "./chrome";
import { useTx } from "./i18n";
import ClosingCta from "./home/ClosingCta";
import Hero, { HeroWord } from "./home/Hero";
import IdeaSection from "./home/IdeaSection";
import Loader from "./home/Loader";
import { shouldShowLoader } from "./home/loaderSession";
import "./HomePage.css";

/* The global home at /: "Borderless.", the idea and the closing call, all
   on one navy canvas (.rd-global in HomePage.css). The full US story lives
   at /us (UsPage); the header link and the parcel itself lead there. Shares the /us page's stylesheet and intro, which
   plays once per session on whichever of the two is opened first. */

const LINKS = [
    { label: "The US", href: "/us" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Lab", href: "/lab" },
];

const IDEA_BODY =
    "Customers everywhere are one tap away. Everything in between is slow, and that's about to change. Vybd is rebuilding the road from maker to customer, so the brands on it reach the world first.";

export default function HomePage() {
    const tx = useTx();
    const [showLoader] = useState(shouldShowLoader);

    return (
        <RdPage name="home" className={showLoader ? "rd-global" : "rd-global no-loader"}>
            {showLoader && <Loader tx={tx} />}

            <RdHeader logoHref="#top" logoDelay={showLoader ? 3.35 : 0.15} links={LINKS} mobileLinks={LINKS} />

            <Hero tx={tx} line={tx("Made anywhere. Sold everywhere.")} sub={null} primary={null} secondary={null} boxHref="/us" />
            <div className="g-routes">
                <IdeaSection
                    tx={tx}
                    heading={
                        <>
                            {tx("The world is ready for your")} <HeroWord key={tx.locale} locale={tx.locale} />
                        </>
                    }
                    body={IDEA_BODY}
                />
                <ClosingCta tx={tx} />
            </div>

            <RdFooter />
        </RdPage>
    );
}
