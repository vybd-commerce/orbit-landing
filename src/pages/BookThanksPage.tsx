import { useBookShell } from "../hooks/useBookShell";
import { useLocalePath, useT } from "../i18n/context";
import "./BookPage.css";

/* /book/thanks: where /book sends people once Calendly reports a booking. */
export default function BookThanksPage() {
    const t = useT();
    const to = useLocalePath();
    useBookShell(t.meta.thanksTitle);
    return (
        <main className="bk-page">
            <div className="bk-panel bk-panel--thanks">
                <h1 className="bk-title">{t.thanks.title}</h1>
                <p className="bk-thanks">{t.thanks.body}</p>
                <a href={to("/")} className="bk-back bk-back--center">
                    {t.thanks.back}
                </a>
            </div>
        </main>
    );
}
