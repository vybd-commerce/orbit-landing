import { useState } from "react";
import { Menu, X } from "lucide-react";
import CaseStudiesSection from "../components/case-studies/CaseStudiesSection";
import { caseStudies } from "../data/caseStudies";
import "./LandingPage.css";
import "./CaseStudies.css";

export default function CaseStudiesPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      <div className="lp-header-wrapper">
        <header className="lp-header">
          <a href="/" className="lp-logo">
            <span className="lp-logo-text">Orbit</span>
          </a>

          <input
            className="lp-menu-toggle"
            type="checkbox"
            id="lp-menu-toggle"
            checked={menuOpen}
            onChange={() => setMenuOpen(!menuOpen)}
          />
          <label className="lp-menu-btn" htmlFor="lp-menu-toggle">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="lp-sr-only">Toggle Menu</span>
          </label>

          <nav className="lp-nav">
            <ul>
              <li><a href="/#functions">Solution</a></li>
              <li><a href="/#testimonials">Testimonials</a></li>
              <li><a href="/#pricing">Pricing</a></li>
            </ul>
          </nav>

          <div className="lp-header-cta">
            <button
              className="lp-btn lp-btn-primary"
              onClick={() => (window.location.href = "/auth")}
            >
              Get Started
            </button>
          </div>
        </header>
      </div>

      <main className="case-page-shell">
        <CaseStudiesSection items={caseStudies} />
      </main>

      <footer className="lp-footer" id="footer">
        <div className="lp-footer-top">
          <h3 className="lp-footer-tagline">Commerce, Coordinated.</h3>
          <div className="lp-footer-nav">
            <div className="lp-footer-col">
              <a href="/product">How It Works</a>
              <a href="/#functions">Solutions</a>
            </div>
            <div className="lp-footer-col">
              <a href="/case-studies">Case Study</a>
              <a href="/#pricing">Pricing</a>
            </div>
          </div>
        </div>

        <div className="lp-footer-brand">
          <div className="lp-footer-orbit-container">
            <div className="lp-footer-ellipses lp-footer-ellipses--thin">
              <div className="lp-footer-ellipses lp-footer-ellipses--planet"></div>
            </div>
            <div className="lp-footer-ellipses lp-footer-ellipses--thick"></div>
            <span>Orbit</span>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <div className="lp-footer-logo-small">Orbit</div>
          <div className="lp-footer-legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
