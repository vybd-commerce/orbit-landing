import { ArrowRight, Check } from "lucide-react";
import { track } from "../lib/analytics";
import { useLocale, useLocalePath, useT } from "../i18n/context";
import type { Messages } from "../i18n/messages";
import "./OfferSection.css";

type Step = Messages["offer"]["plan"];

function StepCard({ step, lead }: { step: Step; lead?: boolean }) {
    return (
        <article className={`of-card${lead ? " of-card--lead" : ""}`}>
            <p className="of-step">{step.step}</p>
            <h3 className="of-name">{step.name}</h3>
            <p className="of-price">{step.price}</p>
            <p className="of-time">{step.time}</p>
            <ul className="of-items">
                {step.items.map((item) => (
                    <li key={item}>
                        <Check aria-hidden="true" strokeWidth={2.5} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}

/* The offer on the root: a fixed-price US Entry Plan, then the build-out
   billed by the work, with the plan's fee credited if they go ahead. */
export default function OfferSection() {
    const t = useT();
    const locale = useLocale();
    const to = useLocalePath();
    const o = t.offer;
    return (
        <section className="of-section" aria-labelledby="of-title">
            <p className="of-label">{o.label}</p>
            <h2 id="of-title" className="of-title">
                {o.title}
            </h2>
            <p className="of-sub">{o.sub}</p>

            <div className="of-steps">
                <StepCard step={o.plan} lead />
                <span className="of-arrow" aria-hidden="true">
                    <ArrowRight strokeWidth={2} />
                </span>
                <StepCard step={o.build} />
            </div>

            <p className="of-credit">{o.credit}</p>
            <a
                className="of-btn"
                href={to("/book")}
                onClick={() => track("book_call_clicked", { location: "hello_offer", lang: locale })}
            >
                {t.contact.cta}
                <ArrowRight aria-hidden="true" strokeWidth={2.25} />
            </a>
        </section>
    );
}
