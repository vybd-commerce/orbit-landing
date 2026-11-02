import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { useTx } from "./i18n";
import ClosingCta from "./home/ClosingCta";
import Ticker from "./home/Ticker";
import AgentDesk from "./enterprise/AgentDesk";
import Cockpit from "./enterprise/Cockpit";
import ImpactCalc from "./enterprise/ImpactCalc";
import OpsMap from "./enterprise/OpsMap";
import OrderToCash from "./enterprise/OrderToCash";
import { Growth, HowItFits, NextSteps, Proof } from "./enterprise/Sections";
import "./HomePage.css";
import "./EnterprisePage.css";

/* /enterprise: for established US CPG brands that already sell and want
   their operation to run better (data layer, agents, reporting). Ported
   from the vybd_us_cpg_interactive_preview_v6 concept onto the home page's
   design system: it borrows HomePage.css (tokens, buttons, ticker, closing
   call, header and footer) and adds .rd-ent rules in EnterprisePage.css.
   The Borderless home (/) links here. English only for now. */

const LINKS = [
    { label: "What we improve", href: "#what" },
    { label: "AI agents", href: "#agents" },
    { label: "Intelligence", href: "#reports" },
    { label: "Impact", href: "#impact" },
    { label: "Proof", href: "#proof" },
];

const TICKER: [string, string][] = [
    ["", "Sales intelligence"],
    ["", "Inventory planning"],
    ["", "Automated POs"],
    ["", "Logistics"],
    ["", "Margin protection"],
];

export default function EnterprisePage() {
    const tx = useTx();
    return (
        <RdPage name="home" className="rd-ent">
            <RdHeader logoHref="/" links={LINKS} mobileLinks={LINKS} ctaHref="/book" ctaLabel="Book an assessment" />

            <section id="top" className="ent-hero">
                <div className="hx-bg" aria-hidden="true" />
                <div className="ent-orbit" aria-hidden="true">
                    <i />
                </div>
                <div className="wrap ent-hero-in">
                    <span className="ent-chip ent-in">
                        <i /> For established US CPG brands
                    </span>
                    <h1 className="ent-h1 ent-in ent-d1">
                        Already selling.
                        <br />
                        <em>Now run better.</em>
                    </h1>
                    <p className="lead ent-in ent-d2">Your sales, supply chain and finance are moving. We connect the dots, find the leaks and put AI agents to work.</p>
                    <div className="ent-cta ent-in ent-d3">
                        <RdLink className="btn btn-dark" href="/book">
                            Book a free assessment
                        </RdLink>
                        <RdLink className="btn btn-text" href="#what">
                            See how it works
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </RdLink>
                    </div>
                </div>
            </section>

            <Ticker tx={tx} items={TICKER} label="Sales intelligence, inventory planning, automated POs, logistics and margin protection" />

            <OpsMap />
            <OrderToCash />
            <AgentDesk />
            <Growth />
            <HowItFits />
            <Cockpit />
            <ImpactCalc />
            <Proof />
            <NextSteps />

            <ClosingCta
                tx={tx}
                heading={
                    <>
                        Let's find what your
                        <br />
                        <em style={{ color: "var(--mint)" }}>business is missing.</em>
                    </>
                }
                text="In 30 minutes we'll talk through your biggest sales and operations headaches, your current systems and where a focused assessment could pay off."
                button="Book your free assessment"
            />

            <RdFooter />
        </RdPage>
    );
}
