import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck, Mail, UserRound } from "lucide-react";
import { track } from "../lib/analytics";
import { useBookShell } from "../hooks/useBookShell";
import { localePath } from "../i18n/locales";
import { useLocale, useLocalePath, useT } from "../i18n/context";
import "./BookPage.css";

/* ── Contact config (edit here) ──────────────────────────────────────────
   /book used to embed a Calendly scheduler. It is now a short form: email,
   name, brand, one question. api/site/contact.ts stores each request in
   vybd_contacts (Neon) and posts it to the site's Discord channel, and we
   reply by email. Every "Talk to us" link on the site points here, with
   ?for= saying which offer sent them. */
const CONTACT_ENDPOINT = "/api/site/contact";

/* Shown under the form for anyone who would rather write. */
const CONTACT_EMAIL = "hello@vybd.ai";

/* Text for each, in order, is the copy's book.points. */
const POINT_ICONS = [Mail, UserRound, CircleCheck];

const FLAGS = ["in", "kr", "cn"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Which CTA sent them: /book?for=drop|launch|scale|enterprise|partner.
   Picks the copy variant and is stored with the request. */
type Route = keyof ReturnType<typeof useT>["book"]["variants"];
const ROUTES = ["launch", "drop", "scale", "enterprise", "partner"] as const satisfies readonly Route[];
function routeFromQuery(): Route | null {
    const v = new URLSearchParams(window.location.search).get("for");
    return (ROUTES as readonly string[]).includes(v ?? "") ? (v as Route) : null;
}

/* Older links carried ?email= and ?name= for Calendly; keep prefilling from them. */
function prefill(key: "email" | "name") {
    return new URLSearchParams(window.location.search).get(key)?.slice(0, 200) ?? "";
}

/* /book: details on the left, the contact form on the right. Sending fires
   "contact_sent" and moves on to /book/thanks. */
export default function BookPage() {
    const t = useT();
    const locale = useLocale();
    const to = useLocalePath();
    useBookShell(t.meta.bookTitle);
    const navigate = useNavigate();
    const [route] = useState(routeFromQuery);
    const variant = route ? t.book.variants[route] : null;
    const points = variant ? [t.book.points[0], variant.operator, t.book.points[2]] : t.book.points;
    const showFlags = variant ? variant.flags : true;
    /* Back to the page that sent them when it is one of ours; home otherwise. */
    const cameFromSite = typeof document !== "undefined" && document.referrer.startsWith(window.location.origin);
    const fromPage = useRef(cameFromSite ? new URL(document.referrer).pathname : null);

    const [email, setEmail] = useState(() => prefill("email"));
    const [name, setName] = useState(() => prefill("name"));
    const [company, setCompany] = useState("");
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [formError, setFormError] = useState("");
    const [sending, setSending] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const honeypot = useRef<HTMLInputElement>(null);

    useEffect(() => {
        track("contact_view", { lang: locale, route: route ?? "none" });
    }, [locale, route]);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (sending) return;
        const clean = email.trim();
        if (!EMAIL.test(clean)) {
            setEmailError(t.book.form.errorEmail);
            emailRef.current?.focus();
            return;
        }
        setEmailError("");
        setFormError("");
        setSending(true);
        try {
            const utm = new URLSearchParams(window.location.search).get("utm_source");
            const res = await fetch(CONTACT_ENDPOINT, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    email: clean, name, company, message, route, lang: locale,
                    page: fromPage.current, utm_source: utm, website: honeypot.current?.value ?? "",
                }),
            });
            const data = (await res.json().catch(() => ({}))) as { ok?: boolean; field?: string };
            if (!res.ok || !data.ok) {
                if (data.field === "email") {
                    setEmailError(t.book.form.errorEmail);
                    emailRef.current?.focus();
                } else setFormError(t.book.form.errorGeneric);
                return;
            }
            track("contact_sent", { lang: locale, route: route ?? "none" });
            navigate(localePath(locale, "/book/thanks"));
        } catch {
            setFormError(t.book.form.errorGeneric);
        } finally {
            setSending(false);
        }
    }

    return (
        <main className="bk-page">
            <div className="bk-panel">
                <section className="bk-info">
                    <a
                        href={to("/")}
                        className="bk-back"
                        onClick={(e) => {
                            if (!cameFromSite) return;
                            e.preventDefault();
                            window.history.back();
                        }}
                    >
                        <ArrowLeft aria-hidden="true" />
                        {t.book.back}
                    </a>
                    <h1 className="bk-title">{variant ? variant.title : t.book.title}</h1>
                    <ul className="bk-points">
                        {POINT_ICONS.map((Icon, i) => (
                            <li key={i}>
                                <Icon aria-hidden="true" />
                                <span>{points[i]}</span>
                            </li>
                        ))}
                    </ul>
                    {showFlags && (
                        <div className="bk-proof">
                            <span className="bk-flags">
                                {FLAGS.map((code) => (
                                    <img key={code} src={`/images/flags/${code}.svg`} alt={t.countries[code]} width={28} height={28} />
                                ))}
                            </span>
                            <p>{t.book.proof}</p>
                        </div>
                    )}
                </section>

                <section className="bk-scheduler" aria-label={t.book.form.label}>
                    <form className="bk-form" onSubmit={onSubmit} noValidate>
                        <div className="bk-field">
                            <label htmlFor="bk-email">{t.book.form.email}</label>
                            <input
                                ref={emailRef}
                                id="bk-email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                maxLength={254}
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError("");
                                }}
                                aria-invalid={emailError ? true : undefined}
                                aria-describedby={emailError ? "bk-email-err" : undefined}
                            />
                            {emailError && (
                                <p className="bk-err" id="bk-email-err">
                                    {emailError}
                                </p>
                            )}
                        </div>
                        <div className="bk-row">
                            <div className="bk-field">
                                <label htmlFor="bk-name">{t.book.form.name}</label>
                                <input id="bk-name" type="text" autoComplete="name" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="bk-field">
                                <label htmlFor="bk-company">{t.book.form.company}</label>
                                <input id="bk-company" type="text" autoComplete="organization" maxLength={200} value={company} onChange={(e) => setCompany(e.target.value)} />
                            </div>
                        </div>
                        <div className="bk-field">
                            <label htmlFor="bk-message">{t.book.form.message}</label>
                            <textarea
                                id="bk-message"
                                rows={5}
                                maxLength={2000}
                                placeholder={t.book.form.messagePlaceholder}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="bk-hp" aria-hidden="true">
                            <label htmlFor="bk-website">Leave this empty</label>
                            <input ref={honeypot} id="bk-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                        </div>
                        <div className="bk-actions">
                            <button type="submit" className="bk-send" disabled={sending}>
                                {sending ? t.book.form.sending : t.book.form.send}
                            </button>
                            <p className="bk-note">{t.book.form.note}</p>
                        </div>
                        {formError && (
                            <p className="bk-err bk-err--form" role="alert">
                                {formError}
                            </p>
                        )}
                    </form>
                    <p className="bk-fallback">
                        {t.book.emailFallback} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                        {t.book.emailFallbackAfter}
                    </p>
                </section>
            </div>
        </main>
    );
}
