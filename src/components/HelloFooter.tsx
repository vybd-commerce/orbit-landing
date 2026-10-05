import "./HelloFooter.css";

/* ── Content (edit here) ─────────────────────────────────────────────────
   Anything in [brackets] is a placeholder: no real address, handle or
   registration detail exists in the codebase yet, so none is invented. */

type Link = { label: string; href: string };

const EXPLORE: Link[] = [
    { label: "How It Works", href: "/product" },
    { label: "Solutions", href: "/#functions" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Lab", href: "/lab" },
];

const COMPANY: Link[] = [
    { label: "About us", href: "#" }, // TODO(footer): real routes
    { label: "Careers", href: "#" },
    { label: "Jobs", href: "#" },
    { label: "Events", href: "#" },
    { label: "Compliance", href: "#" },
    { label: "Support center", href: "#" },
    { label: "Investors", href: "#" },
];

const FOLLOW: Link[] = [
    { label: "LinkedIn", href: "#" }, // TODO(footer): profile URLs
    { label: "Instagram", href: "#" },
    { label: "Glassdoor", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Medium", href: "#" },
    { label: "X", href: "#" },
];

/* TODO(footer): confirm these inboxes exist before launch. */
const PARTNERSHIP_EMAIL = "partnerships@vybd.ai";
const PRESS_EMAIL = "press@vybd.ai";
const MEDIA_KIT_HREF = "#"; // TODO(footer): media kit file

const OFFICES = ["888 Main St, New York, New York - 10044"];
const LEGAL_NOTE = "© Vybd [legal entity name] | [Registered address] | [Company registration and tax numbers]";

const LEGAL: Link[] = [
    { label: "Privacy and cookie policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
];

/* ── Footer ──────────────────────────────────────────────────────────── */

/* /hello footer: a dark band with the link columns up top, the orbiting
   Vybd wordmark from the main site's footer in the middle, and the tagline
   with the legal links along the bottom. */
export default function HelloFooter() {
    return (
        <footer className="hf-band">
            <nav className="hf-cols" aria-label="Footer">
                <div className="hf-col">
                    <h2 className="hf-head">Explore</h2>
                    <ul>
                        {EXPLORE.map((l) => (
                            <li key={l.label}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">Company</h2>
                    <ul>
                        {COMPANY.map((l) => (
                            <li key={l.label}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">Follow us</h2>
                    <ul>
                        {FOLLOW.map((l) => (
                            <li key={l.label}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hf-col">
                    <h2 className="hf-head">Partnership inquiries</h2>
                    <ul>
                        <li>
                            <a href={`mailto:${PARTNERSHIP_EMAIL}`}>{PARTNERSHIP_EMAIL}</a>
                        </li>
                    </ul>
                    <h2 className="hf-head hf-head--gap">Press inquiries</h2>
                    <ul>
                        <li>
                            <a href={`mailto:${PRESS_EMAIL}`}>{PRESS_EMAIL}</a>
                        </li>
                        <li>
                            <a href={MEDIA_KIT_HREF}>Download media kit</a>
                        </li>
                    </ul>
                </div>
                <div className="hf-col hf-col--wide">
                    <h2 className="hf-head">Offices</h2>
                    <ul>
                        {OFFICES.map((o) => (
                            <li key={o} className="hf-text">
                                {o}
                            </li>
                        ))}
                    </ul>
                    <p className="hf-note">{LEGAL_NOTE}</p>
                </div>
            </nav>

            <div className="hf-brand" aria-hidden="true">
                <div className="hf-orbit">
                    <div className="hf-ring hf-ring--thin">
                        <div className="hf-planet" />
                    </div>
                    <div className="hf-ring hf-ring--thick" />
                    <span className="hf-word">Vybd</span>
                </div>
            </div>

            <div className="hf-bottom">
                <div className="hf-tagline">
                    <p className="hf-tagline-main">Commerce, Coordinated.</p>
                    <p className="hf-tagline-sub">enabling commerce, disabling borders</p>
                </div>
                <div className="hf-legal">
                    {LEGAL.map((l) => (
                        <a key={l.label} href={l.href}>
                            {l.label}
                        </a>
                    ))}
                    {/* TODO(footer): open the cookie consent panel once one exists. */}
                    <button type="button" className="hf-legal-btn">
                        Your cookie preferences
                    </button>
                </div>
            </div>
        </footer>
    );
}
