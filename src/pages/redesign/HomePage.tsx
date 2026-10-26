import { useEffect, useState } from "react";
import { RdFooter, RdHeader, RdPage } from "./chrome";
import { useTx } from "./i18n";
import ClosingCta from "./home/ClosingCta";
import Hero, { HeroWord } from "./home/Hero";
import IdeaSection from "./home/IdeaSection";
import Loader from "./home/Loader";
import { shouldShowLoader } from "./home/loaderSession";
import "./HomePage.css";

/* The global "Borderless." page, previewed at /vybd for feedback before it
   replaces the home: the hero, the idea and the closing call ("The world is
   ready for your <typed word>"), all on one navy canvas (.rd-global in
   HomePage.css). The US page (UsPage) is still the home at /; the header
   link and the parcel itself lead there. Shares its stylesheet and intro,
   which plays once per session on whichever of the two is opened first. */

const LINKS = [
    { label: "The US", href: "/" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Lab", href: "/lab" },
];

const IDEA_BODY =
    "Customers everywhere are one tap away. Everything in between is slow, and that's about to change. Vybd is rebuilding the road from maker to customer, so the brands on it reach the world first.";

export default function HomePage() {
    const tx = useTx();
    const [showLoader] = useState(shouldShowLoader);

    // A preview for feedback, not for search.
    useEffect(() => {
        const robots = document.createElement("meta");
        robots.name = "robots";
        robots.content = "noindex";
        document.head.appendChild(robots);
        return () => robots.remove();
    }, []);

    return (
        <RdPage name="home" className={showLoader ? "rd-global" : "rd-global no-loader"}>
            {showLoader && <Loader tx={tx} />}

            <RdHeader logoHref="#top" logoDelay={showLoader ? 3.35 : 0.15} links={LINKS} mobileLinks={LINKS} />

            <Hero tx={tx} line={tx("Made anywhere. Sold everywhere.")} sub={null} primary={null} secondary={null} boxHref="/" />
            <div className="g-routes">
                <IdeaSection tx={tx} heading={null} body={IDEA_BODY} />
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
                />
            </div>

            <RdFooter />
        </RdPage>
    );
}
