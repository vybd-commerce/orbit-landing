import { useState, type FormEvent } from "react";
import { track } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/links";
import "./FinalCtaSection.css";

export default function FinalCtaSection() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("cta_click", { location: "final" });
    const url = email ? `${CALENDLY_URL}?email=${encodeURIComponent(email)}` : CALENDLY_URL;
    window.location.href = url;
  }

  return (
    <section className="lp-final-cta" id="final-cta">
      <div className="lp-final-cta-light">
        <h2>Start scaling without scaling your ops team.</h2>
        <p className="lp-final-cta-subhead">Talk to us about your operations.</p>

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
          <button type="submit" className="lp-btn lp-btn-primary">Contact sales</button>
        </form>
      </div>
    </section>
  );
}
