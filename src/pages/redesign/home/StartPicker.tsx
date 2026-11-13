import { RdLink } from "../chrome";
import type { Tx } from "../i18n";
import { SIGNUP_URL } from "./pricingTiers";

/* "Where are you today?" on the US page, right under the hero: three
   starting points on the Plan / Launch / Scale ladder, each with its own
   action. Styles: .sp-* in HomePage.css. */

const STARTS: { k: string; title: string; body: string; step: string; cta: { label: string; href: string }; aside?: { label: string; href: string } }[] = [
    {
        k: "Exploring the US",
        title: "Is the US worth it, and how?",
        body: "Research US demand, competitors, positioning and pricing for your product, then leave with a plan.",
        step: "Start with Vybd Plan",
        cta: { label: "Get early access", href: SIGNUP_URL },
    },
    {
        k: "Ready to launch",
        title: "Get selling in the US.",
        body: "New brand or new to the US: sourcing, compliance, stores and listings, done by our team.",
        step: "Start with US Launch",
        cta: { label: "Plan my launch", href: "/book?for=launch" },
        aside: { label: "Not sure yet? Start with a $3,000 Test Drop", href: "/test-drop" },
    },
    {
        k: "Already selling in the US",
        title: "Make it run better.",
        body: "Our agents and an operator run inventory, purchase orders, deductions and reporting with you.",
        step: "Start with US Scale",
        cta: { label: "Talk to us about US Scale", href: "/book?for=scale" },
    },
];

export default function StartPicker({ tx }: { tx: Tx }) {
    return (
        <section id="start" className="wrap sp" aria-labelledby="sp-h">
            <h2 id="sp-h" className="sp-h rv">
                {tx("Where are you")} <em>{tx("today?")}</em>
            </h2>
            <div className="sp-grid">
                {STARTS.map((s) => (
                    <article key={s.k} className="sp-card rv">
                        <span className="sp-k">{tx(s.k)}</span>
                        <h3>{tx(s.title)}</h3>
                        <p>{tx(s.body)}</p>
                        {s.aside && (
                            <RdLink className="sp-aside" href={s.aside.href}>
                                {tx(s.aside.label)}
                            </RdLink>
                        )}
                        <div className="sp-foot">
                            <small>{tx(s.step)}</small>
                            <RdLink className="btn btn-dark" href={s.cta.href}>
                                {tx(s.cta.label)}
                            </RdLink>
                        </div>
                    </article>
                ))}
            </div>
            <RdLink className="sp-more" href="#pricing">
                {tx("Compare Plan, Test Drop, Launch and Scale")} <span aria-hidden="true">↓</span>
            </RdLink>
        </section>
    );
}
