import { useEffect } from "react";
import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { useTx } from "./i18n";
import ClosingCta from "./home/ClosingCta";
import AgentDesk from "./enterprise/AgentDesk";
import Cockpit from "./enterprise/Cockpit";
import OpsMap from "./enterprise/OpsMap";
import OrderToCash from "./enterprise/OrderToCash";
import { Faq, NextSteps, Proof } from "./enterprise/Sections";
import { SYSTEMS } from "./enterprise/systems";
import "./HomePage.css";
import "./EnterprisePage.css";

/* /enterprise: for $50M+ brands, grocers, retailers and distributors with
   their own warehouses, DCs and stores. Brands doing $10M to $50M on 3PLs
   (Scale) go to /us instead. Order: hero (with the systems we work with),
   proof, the data layer, where margin leaks, agents at work, the
   executive cockpit, the offer and how we start, FAQ, closing call.
   Borrows HomePage.css (tokens, buttons, closing call, header, footer)
   and adds .rd-ent rules in EnterprisePage.css. English only for now. */

const LINKS = [
    { label: "Proof", href: "#proof" },
    { label: "Your systems", href: "#systems" },
    { label: "AI agents", href: "#agents" },
    { label: "Pricing", href: "#start" },
    { label: "FAQ", href: "#faq" },
];

const BOOK = "/book?for=enterprise";

export default function EnterprisePage() {
    const tx = useTx();

    useEffect(() => {
        const prevTitle = document.title;
        document.title = "AI operations for $50M+ CPG brands | Vybd";
        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute(
            "content",
            "Vybd connects NetSuite, SAP, Microsoft Dynamics 365 or Odoo with your WMS, 3PLs and channels, then puts AI agents and an operator on reorders, deductions and reporting.",
        );
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const prevOg = ogTitle?.getAttribute("content") ?? null;
        ogTitle?.setAttribute("content", "Already at scale. Now run tighter.");
        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
            if (ogTitle && prevOg !== null) ogTitle.setAttribute("content", prevOg);
        };
    }, []);

    return (
        <RdPage name="home" className="rd-ent">
            <RdHeader logoHref="/" links={LINKS} mobileLinks={LINKS} ctaHref={BOOK} />

            <section id="top" className="ent-hero">
                <div className="hx-bg" aria-hidden="true" />
                <div className="ent-orbit" aria-hidden="true">
                    <i />
                </div>
                <div className="wrap ent-hero-in">
                    <span className="ent-chip ent-in">
                        <i /> For $50M+ brands, grocers, retailers and distributors
                    </span>
                    <h1 className="ent-h1 ent-in ent-d1">
                        Already at scale.
                        <br />
                        <em>Now run tighter.</em>
                    </h1>
                    <p className="lead ent-in ent-d2">
                        Vybd connects your ERP, WMS, 3PLs and sales channels, then puts AI agents and a dedicated operator on reorders, deductions and reporting. Your
                        systems stay. Your team approves every call.
                    </p>
                    <div className="ent-cta ent-in ent-d3">
                        <RdLink className="btn btn-dark" href={BOOK}>
                            Book a call
                        </RdLink>
                        <RdLink className="btn btn-text" href="#systems">
                            See how it works
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </RdLink>
                    </div>
                    <div className="ent-works ent-in ent-d3" aria-label="Systems Vybd works with">
                        <small>Works with</small>
                        <ul>
                            {SYSTEMS.map((s) => (
                                <li key={s}>{s}</li>
                            ))}
                            <li className="more">More coming</li>
                        </ul>
                    </div>
                </div>
            </section>

            <Proof />
            <OpsMap />
            <OrderToCash />
            <AgentDesk />
            <Cockpit />
            <NextSteps />
            <Faq />

            <ClosingCta
                tx={tx}
                heading={
                    <>
                        Find the margin
                        <br />
                        <em style={{ color: "var(--mint)" }}>your operation is leaking.</em>
                    </>
                }
                text="Meet one of our operators. Walk through your systems and your biggest operating headaches, and leave the call with a rough plan and an honest reality check."
                button="Book a call"
            />

            <RdFooter />
        </RdPage>
    );
}
