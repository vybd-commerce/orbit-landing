import { useState, type FormEvent } from "react";
import { track } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/links";
import "./FinalCtaSection.css";

/* All four props are optional and default to the landing page's copy, so the
   existing call sites keep rendering exactly what they rendered before. */
interface FinalCtaSectionProps {
  heading?: string;
  subhead?: string;
  buttonLabel?: string;
  /* Goes out with the Plausible event so the two pages can be told apart. */
  location?: string;
}

export default function FinalCtaSection({
  heading = "Start scaling without scaling your ops team.",
  subhead = "Talk to us about your operations.",
  buttonLabel = "Contact sales",
  location = "final",
}: FinalCtaSectionProps = {}) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("cta_click", { location });
    const url = email ? `${CALENDLY_URL}?email=${encodeURIComponent(email)}` : CALENDLY_URL;
    window.location.href = url;
  }

  return (
    <section className="lp-final-cta" id="final-cta">
      <div className="lp-final-cta-light">
        <h2>{heading}</h2>
        <p className="lp-final-cta-subhead">{subhead}</p>

        <form className="lp-final-cta-form" onSubmit={handleSubmit}>
          <label htmlFor="final-cta-email" className="lp-sr-only">Email address</label>
          <input
            id="final-cta-email"
            type="email"
            required
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="lp-btn lp-btn-primary">{buttonLabel}</button>
        </form>
      </div>
    </section>
  );
}
