import { useBookShell } from "../hooks/useBookShell";
import "./BookPage.css";

/* /book/thanks: where /book sends people once Calendly reports a booking. */
export default function BookThanksPage() {
    useBookShell("You're booked | Vybd");
    return (
        <main className="bk-page">
            <div className="bk-panel bk-panel--thanks">
                <h1 className="bk-title">You're booked.</h1>
                <p className="bk-thanks">
                    A calendar invite is on its way. Reply to it with anything you want us to look at before the call
                    (product photos, a price list, your current US channels).
                </p>
                <a href="/" className="bk-back bk-back--center">
                    Back to Vybd
                </a>
            </div>
        </main>
    );
}
