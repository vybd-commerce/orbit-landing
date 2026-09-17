import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FUNCTIONS, SUBSTRATE_CAPTION, SUBSTRATE_LABEL, SUBSTRATE_SYSTEMS } from "../data/functions";
import { useReveal } from "../hooks/useReveal";
import "./WhatWeBuildSection.css";

const DEFAULT_INTRO = [
  "None of that is a tooling problem. It is a data problem: orders in one portal, inventory in another, a retailer deduction that arrives as a PDF and gets re keyed on Friday afternoon.",
  "We build that layer first: one connected view of orders, inventory, cost, and channel. Then we run agents on top of it across six functions, deployed in your stack, with senior operators accountable for the outcome until the system holds it on its own.",
];

interface WhatWeBuildSectionProps {
  sectionNumber: string;
  /* The default intro reads as a follow-on from the section above it. A page
     that mounts this section straight under the hero passes standalone copy. */
  intro?: string[];
  /* Closing line. Pass null where the section is not the handover beat. */
  handover?: string | null;
}

export default function WhatWeBuildSection({
  sectionNumber,
  intro = DEFAULT_INTRO,
  handover = "We run it, then you do.",
}: WhatWeBuildSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(FUNCTIONS[0]?.id ?? null);
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      className={`lp-functions-section lp-reveal ${revealed ? "is-revealed" : ""}`}
      id="functions"
      ref={ref}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div className="lp-section-tag">{sectionNumber} / WHAT WE BUILD</div>
      </div>
      <div className="lp-functions-header" style={{ alignItems: "flex-start" }}>
        <div>
          <h2>Six functions. One system underneath.</h2>
        </div>
        <div className="lp-functions-header-right">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {handover && <p className="wwb-handover">{handover}</p>}
        </div>
      </div>

      <div className="lp-fn-accordion wwb-accordion">
        {FUNCTIONS.map((fn) => {
          const isOpen = expandedId === fn.id;
          return (
            <div key={fn.id} className={`lp-fn-accordion-item ${isOpen ? "is-expanded" : ""}`}>
              <h3>
                <button
                  type="button"
                  className="lp-fn-accordion-header"
                  onClick={() => setExpandedId((prev) => (prev === fn.id ? null : fn.id))}
                  aria-expanded={isOpen}
                  aria-controls={`wwb-panel-${fn.id}`}
                  id={`wwb-header-${fn.id}`}
                >
                  <span className="lp-fn-accordion-heading">
                    <span className="lp-fn-title">{fn.title}</span>
                  </span>
                  <ChevronDown size={18} className="lp-fn-accordion-chevron" />
                </button>
              </h3>

              <div
                className="lp-fn-accordion-panel-outer"
                id={`wwb-panel-${fn.id}`}
                role="region"
                aria-labelledby={`wwb-header-${fn.id}`}
              >
                <div className="lp-fn-accordion-panel-inner">
                  <div className="lp-fn-accordion-panel">
                    <p className="wwb-does">{fn.does}</p>
                    <p className="wwb-reads">
                      <span className="wwb-reads-label">Reads</span> {fn.reads.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="wwb-substrate">
        <div className="wwb-substrate-label">{SUBSTRATE_LABEL}</div>
        <div className="wwb-substrate-systems">{SUBSTRATE_SYSTEMS.join(" · ")}</div>
        <p className="wwb-substrate-caption">{SUBSTRATE_CAPTION}</p>
      </div>
    </section>
  );
}
