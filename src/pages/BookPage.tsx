import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck, UserRound, Video } from "lucide-react";
import { track } from "../lib/analytics";
import { useBookShell } from "../hooks/useBookShell";
import { localePath } from "../i18n/locales";
import { useLocale, useLocalePath, useT } from "../i18n/context";
import "./BookPage.css";

/* ── Booking config (edit here) ──────────────────────────────────────────
   The Calendly event for the US entry call. Its booking form should carry
   the questions in docs/booking-questions.md, in that order, for the
   prefill keys below to line up. While empty, /book shows a placeholder
   instead of the scheduler. */
const BOOKING_URL: string = "https://calendly.com/hello-vybd/vybd-discovery-call";

/* Brand colours passed to the embed (hex without #). */
const EMBED_COLORS = { primary_color: "0f1b33", text_color: "0f1b33", background_color: "ffffff" };

/* Calendly prefill keys for the custom questions, in the order they are
   set up on the event (Name and Email are Calendly's built-in fields).
   Any of these present on /book's own URL are passed through, e.g.
   /book?email=jo@brand.com&a1=Brand%20Co. */
const PREFILL_KEYS = ["name", "email", "a1", "a2", "a3", "a4", "a5", "a6"] as const;

/* Shown under the scheduler for anyone it fails for: Calendly is slow or
   blocked in some countries, mainland China among them. */
const BOOKING_EMAIL = "hello@vybd.ai";

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

/* Text for each, in order, is the copy's book.points. */
const POINT_ICONS = [Video, UserRound, CircleCheck];

const FLAGS = ["in", "kr", "cn"] as const;

declare global {
    interface Window {
        Calendly?: {
            initInlineWidget: (opts: {
                url: string;
                parentElement: HTMLElement;
                prefill?: { name?: string; email?: string; customAnswers?: Record<string, string> };
            }) => void;
        };
    }
}

/* One script tag for the whole app, however often /book mounts. */
let calendlyLoad: Promise<void> | null = null;
function loadCalendly() {
    if (window.Calendly) return Promise.resolve();
    calendlyLoad ??= new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = CALENDLY_SCRIPT;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => {
            calendlyLoad = null;
            reject(new Error("Calendly failed to load"));
        };
        document.head.appendChild(s);
    });
    return calendlyLoad;
}

function embedUrl() {
    const u = new URL(BOOKING_URL);
    /* Our left column carries the details, so hide Calendly's own pane. */
    u.searchParams.set("hide_landing_page_details", "1");
    u.searchParams.set("hide_event_type_details", "1");
    Object.entries(EMBED_COLORS).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
}

function prefillFromQuery() {
    const q = new URLSearchParams(window.location.search);
    const customAnswers: Record<string, string> = {};
    let name: string | undefined;
    let email: string | undefined;
    PREFILL_KEYS.forEach((k) => {
        const v = q.get(k);
        if (!v) return;
        if (k === "name") name = v;
        else if (k === "email") email = v;
        else customAnswers[k] = v;
    });
    return { name, email, customAnswers };
}

/* /book: details on the left, Calendly's inline scheduler on the right.
   Calendly detects the visitor's time zone and shows it with a picker. A
   booking fires "booking_completed" and moves on to /book/thanks. */
export default function BookPage() {
    const t = useT();
    const locale = useLocale();
    const to = useLocalePath();
    useBookShell(t.meta.bookTitle);
    const navigate = useNavigate();
    const embedRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        if (!BOOKING_URL) return;
        let alive = true;
        loadCalendly()
            .then(() => {
                const el = embedRef.current;
                if (!alive || !el || !window.Calendly) return;
                el.innerHTML = "";
                window.Calendly.initInlineWidget({ url: embedUrl(), parentElement: el, prefill: prefillFromQuery() });
                setStatus("ready");
            })
            .catch(() => alive && setStatus("error"));
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.origin !== "https://calendly.com") return;
            if (e.data?.event === "calendly.event_scheduled") {
                track("booking_completed", { lang: locale });
                navigate(localePath(locale, "/book/thanks"));
            }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [navigate, locale]);

    return (
        <main className="bk-page">
            <div className="bk-panel">
                <section className="bk-info">
                    <a href={to("/")} className="bk-back">
                        <ArrowLeft aria-hidden="true" />
                        {t.book.back}
                    </a>
                    <h1 className="bk-title">{t.book.title}</h1>
                    <ul className="bk-points">
                        {POINT_ICONS.map((Icon, i) => (
                            <li key={i}>
                                <Icon aria-hidden="true" />
                                <span>{t.book.points[i]}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="bk-proof">
                        <span className="bk-flags">
                            {FLAGS.map((code) => (
                                <img key={code} src={`/images/flags/${code}.svg`} alt={t.countries[code]} width={28} height={28} />
                            ))}
                        </span>
                        <p>{t.book.proof}</p>
                    </div>
                </section>

                <section className="bk-scheduler" aria-label={t.book.pickTime}>
                    {BOOKING_URL ? (
                        <div className="bk-embed-wrap">
                            {status !== "ready" && (
                                <p className="bk-status" role="status">
                                    {status === "error" ? (
                                        <>
                                            {t.book.failed}{" "}
                                            <a href={BOOKING_URL} target="_blank" rel="noreferrer">
                                                {t.book.openTab}
                                            </a>
                                        </>
                                    ) : (
                                        t.book.loading
                                    )}
                                </p>
                            )}
                            <div ref={embedRef} className="bk-embed" />
                        </div>
                    ) : (
                        <p className="bk-status bk-status--solo">{t.book.notConfigured}</p>
                    )}
                    <p className="bk-fallback">
                        {t.book.emailFallback} <a href={`mailto:${BOOKING_EMAIL}`}>{BOOKING_EMAIL}</a>
                        {t.book.emailFallbackAfter}
                    </p>
                </section>
            </div>
        </main>
    );
}
