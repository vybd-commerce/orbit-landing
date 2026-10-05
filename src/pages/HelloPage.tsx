import { useEffect } from "react";
import HeroSectionV2 from "../components/HeroSectionV2";
import ComplexitySection from "../components/ComplexitySection";
import ProofCollage from "../components/ProofCollage";
import StatementSection from "../components/StatementSection";
import TechSection from "../components/TechSection";
import HelloFooter from "../components/HelloFooter";
import ContactSection from "../components/ContactSection";
import { HERO_V2_IMAGE_BASE, HERO_V2_SLIDES } from "../data/heroV2Slides";
import "./HelloPage.css";

/* The site root (formerly /hello).
   Newsreader and the first-slide preload are added to <head> here, so no
   other route pays for them, and removed again on the way out. */
const NEWSREADER_HREF =
    "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap";

/* Orbit mark: the footer's thin and thick rings with the planet, drawn small. */
function VybdMark() {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" fill="none">
            <ellipse cx="16" cy="16" rx="13.5" ry="7" transform="rotate(-24 16 16)" stroke="currentColor" strokeWidth="1.4" />
            <ellipse cx="16" cy="16" rx="9" ry="9" stroke="currentColor" strokeWidth="2.6" />
            <circle cx="27.2" cy="10.4" r="2.6" fill="currentColor" />
        </svg>
    );
}

function addHeadLink(attrs: Record<string, string>) {
    const link = document.createElement("link");
    for (const [k, v] of Object.entries(attrs)) link.setAttribute(k, v);
    document.head.appendChild(link);
    return link;
}

export default function HelloPage() {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = "Hello, World | Vybd";

        const links = [
            addHeadLink({
                rel: "preload",
                as: "image",
                type: "image/avif",
                href: `${HERO_V2_IMAGE_BASE}/${HERO_V2_SLIDES[0].id}.avif`,
                fetchpriority: "high",
            }),
            addHeadLink({ rel: "stylesheet", href: NEWSREADER_HREF }),
        ];

        return () => {
            document.title = prevTitle;
            links.forEach((l) => l.remove());
        };
    }, []);

    return (
        <main className="hello-page">
            <div className="hello-panel">
                <header className="hello-header">
                    <a href="/" className="hello-brand" aria-label="Vybd home">
                        <VybdMark />
                        <span>vybd</span>
                    </a>
                    {/* TODO(hello): open the site menu. Nothing to show yet. */}
                    <button type="button" className="hello-menu" aria-haspopup="true">
                        Menu
                    </button>
                </header>
                <HeroSectionV2 />
            </div>
            {/* Below the hero the page sits on plain white. */}
            <StatementSection />
            <ProofCollage />
            <ComplexitySection />
            <TechSection />
            <ContactSection />
            <HelloFooter />
        </main>
    );
}
