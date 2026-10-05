import { ArrowRight } from "lucide-react";
import { track } from "../lib/analytics";
import { useLocale, useLocalePath, useT } from "../i18n/context";
import "./ContactSection.css";

/* The root's last section: one ask, one button to /book. */
export default function ContactSection() {
    const t = useT();
    const locale = useLocale();
    const to = useLocalePath();
    return (
        <section className="ct-panel" aria-labelledby="ct-title">
            <h2 id="ct-title" className="ct-title">
                {t.contact.title}
            </h2>
            <p className="ct-sub">{t.contact.sub}</p>
            <a
                className="ct-btn"
                href={to("/book")}
                onClick={() => track("book_call_clicked", { location: "hello_contact", lang: locale })}
            >
                {t.contact.cta}
                <ArrowRight aria-hidden="true" strokeWidth={2.25} />
            </a>
        </section>
    );
}
