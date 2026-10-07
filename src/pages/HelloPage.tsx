import { useEffect } from "react";
import HeroSectionV2 from "../components/HeroSectionV2";
import ComplexitySection from "../components/ComplexitySection";
import ComplexityRing from "../components/ComplexityRing";
import ProofCollage from "../components/ProofCollage";
import StatementSection from "../components/StatementSection";
import TechSection from "../components/TechSection";
import HelloFooter from "../components/HelloFooter";
import ContactSection from "../components/ContactSection";
import LanguageSwitcher from "../components/LanguageSwitcher";
import SiteMenu from "../components/SiteMenu";
import { HERO_V2_IMAGE_BASE, HERO_V2_IMAGES, orderedSlides } from "../data/heroV2Slides";
import { useLocalePath, useT } from "../i18n/context";
import "./HelloPage.css";

/* The site root (formerly /hello), in every locale (/zh, /ko, ...).
   The first-slide preload is added to <head> here, so no other route pays
   for it, and removed again on the way out. */

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

/* complexity: "ring" swaps in the 360° variant of the "why it's hard"
   section, for review on /ring. */
export default function HelloPage({ complexity = "web" }: { complexity?: "web" | "ring" }) {
    const t = useT();
    const to = useLocalePath();
    const firstSlide = HERO_V2_IMAGES[orderedSlides(t.hero.firstSlide)[0]];

    useEffect(() => {
        const prevTitle = document.title;
        document.title = t.meta.homeTitle;

        /* One per breakpoint, matching the hero's <picture> sources, so a
           phone never fetches the wide photo it won't show. */
        const preloads = [
            { media: "(max-width: 639px)", file: `${firstSlide}-portrait.avif` },
            { media: "(min-width: 640px)", file: `${firstSlide}.avif` },
        ].map(({ media, file }) =>
            addHeadLink({
                rel: "preload",
                as: "image",
                type: "image/avif",
                media,
                href: `${HERO_V2_IMAGE_BASE}/${file}`,
                fetchpriority: "high",
            })
        );

        return () => {
            document.title = prevTitle;
            preloads.forEach((l) => l.remove());
        };
    }, [t, firstSlide]);

    return (
        <main className="hello-page">
            <div className="hello-panel">
                <header className="hello-header">
                    <a href={to("/")} className="hello-brand" aria-label={t.header.home}>
                        <VybdMark />
                        <span>vybd</span>
                    </a>
                    <div className="hello-actions">
                        <LanguageSwitcher />
                        <SiteMenu />
                    </div>
                </header>
                <HeroSectionV2 />
            </div>
            {/* Below the hero the page sits on plain white. */}
            <StatementSection />
            <ProofCollage />
            {complexity === "ring" ? <ComplexityRing /> : <ComplexitySection />}
            <TechSection />
            <ContactSection />
            <HelloFooter />
        </main>
    );
}
