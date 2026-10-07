import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLocalePath, useT } from "../i18n/context";
import "./SiteMenu.css";

/* The root header's Menu pill and the panel it opens: a white card in the
   top-right corner over a blurred page, with the site's links stacked in the
   middle. Escape, the close button, a click outside or any link closes it,
   and focus goes back to the pill. Only the root page has it for now, so
   Home is always the current page. */
export default function SiteMenu() {
    const t = useT();
    const to = useLocalePath();
    const [open, setOpen] = useState(false);
    const pillRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const links = [
        { label: t.menu.home, href: to("/"), current: true },
        { label: t.menu.howItWorks, href: "/product" },
        { label: t.menu.caseStudies, href: "/case-studies" },
        { label: t.menu.about, href: "#" }, // TODO(menu): real route, same as the footer's
        { label: t.menu.contact, href: `${to("/")}#contact` },
        { label: t.menu.privacy, href: "/privacy" },
    ];

    useEffect(() => {
        if (!open) return;
        const pill = pillRef.current;
        closeRef.current?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                return;
            }
            /* Keep Tab inside the panel while it is open. */
            if (e.key !== "Tab" || !panelRef.current) return;
            const items = panelRef.current.querySelectorAll<HTMLElement>("a, button");
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            pill?.focus();
        };
    }, [open]);

    return (
        <>
            <button
                ref={pillRef}
                type="button"
                className="hello-menu"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls="site-menu"
                onClick={() => setOpen(true)}
            >
                {t.header.menu}
            </button>

            {open && (
                <div className="sm-backdrop" onClick={() => setOpen(false)}>
                    <div
                        ref={panelRef}
                        id="site-menu"
                        className="sm-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label={t.menu.label}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            ref={closeRef}
                            type="button"
                            className="sm-close"
                            onClick={() => setOpen(false)}
                            aria-label={t.menu.close}
                        >
                            <X aria-hidden="true" strokeWidth={2} />
                        </button>
                        <nav aria-label={t.menu.label}>
                            <ul className="sm-links">
                                {links.map((l) => (
                                    <li key={l.label}>
                                        <a
                                            href={l.href}
                                            aria-current={l.current ? "page" : undefined}
                                            onClick={() => setOpen(false)}
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
