import { ChevronDown } from "lucide-react";
import { FAQS } from "../data/faqs";
import { useReveal } from "../hooks/useReveal";
import "./FaqSection.css";

interface FaqSectionProps {
  sectionNumber: string;
}

/* Native <details>/<summary>: keyboard and screen reader behaviour is free,
   and the section costs no JS. The chevron is the only thing that needs
   state, and CSS reads it off [open]. */
export default function FaqSection({ sectionNumber }: FaqSectionProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section className={`lp-faq-section lp-reveal ${revealed ? "is-revealed" : ""}`} id="faq" ref={ref}>
      <div className="lp-faq-inner">
        <div className="lp-section-tag">{sectionNumber} / QUESTIONS</div>
        <h2 className="lp-process-h2">The four we get asked first.</h2>

        <div className="lp-faq-list">
          {FAQS.map((faq) => (
            <details className="lp-faq-item" key={faq.q}>
              <summary className="lp-faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={18} className="lp-faq-chevron" aria-hidden="true" />
              </summary>
              <div className="lp-faq-answer">
                {faq.a.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
