import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "../data/testimonials";
import "./TestimonialsSection.css";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);
  const hasMultiple = TESTIMONIALS.length > 1;
  const active = TESTIMONIALS[activeIndex];
  const quoteParagraphs = active.quote.split("\n\n");

  function goPrev() {
    setLogoFailed(false);
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  function goNext() {
    setLogoFailed(false);
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }

  return (
    <section className="lp-testimonials" id="testimonials">
      <div className="lp-testimonials-inner">
        <h2 className="lp-testimonials-heading">What changes once <em>systems</em> cover the handoffs.</h2>

        <div className="lp-testimonials-row">
          {hasMultiple && (
            <button
              type="button"
              className="lp-testimonials-nav lp-testimonials-nav--prev"
              onClick={goPrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="lp-testimonials-card-wrap">
            <span className="lp-testimonials-quote-mark lp-testimonials-quote-mark--open" aria-hidden="true">&ldquo;</span>
            <span className="lp-testimonials-quote-mark lp-testimonials-quote-mark--close" aria-hidden="true">&rdquo;</span>

            {/* Keyed on the index so React remounts the card and the CSS
                cross-fade replays on every change. */}
            <div className="lp-testimonials-card" key={activeIndex}>
              {active.logoImage && !logoFailed ? (
                <img
                  className="lp-testimonials-avatar-img"
                  src={active.logoImage}
                  alt={`${active.name} logo`}
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="lp-testimonials-avatar">{active.logoLabel}</div>
              )}

              <div className="lp-testimonials-quote">
                {quoteParagraphs.map((paragraph, i) => (
                  <p key={i}>
                    {i === 0 && "“"}
                    {paragraph}
                    {i === quoteParagraphs.length - 1 && "”"}
                  </p>
                ))}
              </div>

              <div className="lp-testimonials-name">{active.name}</div>
              <div className="lp-testimonials-title">{active.title}</div>
            </div>
          </div>

          {hasMultiple && (
            <button
              type="button"
              className="lp-testimonials-nav lp-testimonials-nav--next"
              onClick={goNext}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {hasMultiple && (
          <div className="lp-testimonials-dots" role="tablist" aria-label="Choose testimonial">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show ${t.name}'s testimonial`}
                className={`lp-testimonials-dot ${i === activeIndex ? "is-active" : ""}`}
                onClick={() => {
                  setLogoFailed(false);
                  setActiveIndex(i);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
