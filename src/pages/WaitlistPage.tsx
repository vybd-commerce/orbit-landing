import { useEffect, useState, type FormEvent } from "react";
import { FORM, NAV_BOTTOM, NAV_TOP, SEO } from "../data/waitlistCopy";
import { track } from "../lib/analytics";
import { WAITLIST_ENDPOINT } from "../lib/links";
import "./LandingPage.css";
import "./WaitlistPage.css";

type Status = "idle" | "sending" | "done" | "error";

function NavRow({ links, label }: { links: { label: string; href: string }[]; label: string }) {
    return (
        <nav className="wl-nav" aria-label={label}>
            <ul>
                {links.map((link) => (
                    <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    /* Same pattern as the other pages: index.html carries the crawler-visible
       baseline, this effect covers client-side route changes and restores the
       previous copy on the way out. */
    useEffect(() => {
        const prevTitle = document.title;
        document.title = SEO.title;

        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute("content", SEO.description);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        const prevOgTitle = ogTitle?.getAttribute("content") ?? null;
        ogTitle?.setAttribute("content", SEO.socialTitle);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        const prevOgDesc = ogDesc?.getAttribute("content") ?? null;
        ogDesc?.setAttribute("content", SEO.description);

        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
            if (ogTitle && prevOgTitle !== null) ogTitle.setAttribute("content", prevOgTitle);
            if (ogDesc && prevOgDesc !== null) ogDesc.setAttribute("content", prevOgDesc);
        };
    }, []);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === "sending") return;
        setStatus("sending");

        try {
            if (!WAITLIST_ENDPOINT) throw new Error("WAITLIST_ENDPOINT is not set in src/lib/links.ts");
            const res = await fetch(WAITLIST_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email, source: "waitlist" }),
            });
            if (!res.ok) throw new Error(`Waitlist POST failed: ${res.status}`);
            track("waitlist_join", { location: "hero" });
            setStatus("done");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <div className="lp-theme-dark wl-page">
            <header className="wl-header">
                <NavRow links={NAV_TOP} label="Primary" />
            </header>

            <main className="wl-hero">
                {/* The footer's orbit rings, closed into a full circle, with the
                    wordmark and form sitting inside it. Ring classes come from
                    LandingPage.css; WaitlistPage.css only resizes them. */}
                <div className="wl-orbit">
                    <div className="lp-footer-ellipses lp-footer-ellipses--thin">
                        <div className="lp-footer-ellipses lp-footer-ellipses--planet"></div>
                    </div>
                    <div className="lp-footer-ellipses lp-footer-ellipses--thick"></div>

                    <h1 className="wl-wordmark">vybd</h1>

                    {status === "done" ? (
                        <p className="wl-success" role="status">{FORM.success}</p>
                    ) : (
                        <form className="wl-form" onSubmit={handleSubmit}>
                            <label htmlFor="wl-email" className="lp-sr-only">Email address</label>
                            <input
                                id="wl-email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder={FORM.placeholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit" className="lp-btn lp-btn-accent" disabled={status === "sending"}>
                                {status === "sending" ? "Joining…" : FORM.button}
                            </button>
                        </form>
                    )}

                    {/* Reserved height so an error appearing doesn't shift the form. */}
                    <p className="wl-message" role="alert">
                        {status === "error" ? FORM.error : ""}
                    </p>
                </div>
            </main>

            <footer className="wl-footer">
                <NavRow links={NAV_BOTTOM} label="Products" />
            </footer>
        </div>
    );
}
