import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck, UserRound, Video } from "lucide-react";
import { track } from "../lib/analytics";
import { useBookShell } from "../hooks/useBookShell";
import "./BookPage.css";

/* ── Booking config (edit here) ──────────────────────────────────────────
   TODO(booking): the Calendly event link for the US entry call, e.g.
   "https://calendly.com/hello-vybd/us-entry-call". Set up the event with the
   questions in docs/booking-questions.md first. While empty, /book shows a
   placeholder instead of the scheduler. (The site's old CALENDLY_URL,
   hello-vybd/introductory-call, no longer exists on Calendly.) */
const BOOKING_URL: string = "";

/* Brand colours passed to the embed (hex without #). */
const EMBED_COLORS = { primary_color: "0f1b33", text_color: "0f1b33", background_color: "ffffff" };

/* Calendly prefill keys for the custom questions, in the order they are
   set up on the event (Name and Email are Calendly's built-in fields).
   Any of these present on /book's own URL are passed through, e.g.
   /book?email=jo@brand.com&a1=Brand%20Co. */
const PREFILL_KEYS = ["name", "email", "a1", "a2", "a3", "a4", "a5", "a6"] as const;

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

const POINTS = [
    { Icon: Video, text: "30 minutes on video" },
    { Icon: UserRound, text: "With an operator who has brought products into the US" },
    { Icon: CircleCheck, text: "You'll leave with a clear next step, whether or not you work with us" },
];

const FLAGS = [
    { code: "in", name: "India" },
    { code: "kr", name: "South Korea" },
    { code: "cn", name: "China" },
];

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
    useBookShell("Book a US entry call | Vybd");
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
                track("booking_completed");
                navigate("/book/thanks");
            }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [navigate]);

    return (
        <main className="bk-page">
            <div className="bk-panel">
                <section className="bk-info">
                    <a href="/" className="bk-back">
                        <ArrowLeft aria-hidden="true" />
                        Back
                    </a>
                    <h1 className="bk-title">Book a US entry call</h1>
                    <ul className="bk-points">
                        {POINTS.map(({ Icon, text }) => (
                            <li key={text}>
                                <Icon aria-hidden="true" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="bk-proof">
                        <span className="bk-flags">
                            {FLAGS.map((f) => (
                                <img key={f.code} src={`/images/flags/${f.code}.svg`} alt={f.name} width={28} height={28} />
                            ))}
                        </span>
                        <p>Brands from these countries already sell in the US with us.</p>
                    </div>
                </section>

                <section className="bk-scheduler" aria-label="Pick a time">
                    {BOOKING_URL ? (
                        <>
                            {status !== "ready" && (
                                <p className="bk-status" role="status">
                                    {status === "error" ? (
                                        <>
                                            The calendar didn't load.{" "}
                                            <a href={BOOKING_URL} target="_blank" rel="noreferrer">
                                                Open it in a new tab
                                            </a>
                                        </>
                                    ) : (
                                        "Loading available times…"
                                    )}
                                </p>
                            )}
                            <div ref={embedRef} className="bk-embed" />
                        </>
                    ) : (
                        <p className="bk-status">Scheduler not configured yet: set BOOKING_URL in src/pages/BookPage.tsx.</p>
                    )}
                </section>
            </div>
        </main>
    );
}
