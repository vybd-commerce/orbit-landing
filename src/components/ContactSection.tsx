import { ArrowRight } from "lucide-react";
import { track } from "../lib/analytics";
import "./ContactSection.css";

/* /hello's last section: one ask, one button to /book. */
export default function ContactSection() {
    return (
        <section className="ct-panel" aria-labelledby="ct-title">
            <h2 id="ct-title" className="ct-title">
                Ready to bring your products to the US?
            </h2>
            <p className="ct-sub">30 minutes with an operator, not a salesperson. Pick a time in your own time zone.</p>
            <a className="ct-btn" href="/book" onClick={() => track("book_call_clicked", { location: "hello_contact" })}>
                Book a call
                <ArrowRight aria-hidden="true" strokeWidth={2.25} />
            </a>
        </section>
    );
}
