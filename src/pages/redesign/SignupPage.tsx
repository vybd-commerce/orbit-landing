import { useState, type ChangeEvent, type FormEvent } from "react";
import { track } from "../../lib/analytics";
import { WAITLIST_ENDPOINT } from "../../lib/links";
import { RdFooter, RdHeader, RdPage } from "./chrome";
import { useTx } from "./i18n";
import { APP_MONTHLY } from "./home/pricingTiers";
import "./HomePage.css";

/* /signup: the stand-in sign-up for Vybd Plan until the product's own
   sign-up is live. Name, email and an optional brand idea. Posts JSON to
   WAITLIST_ENDPOINT (src/lib/links.ts) when one is set; until then it
   opens a prefilled email to SIGNUP_EMAIL, so no sign-up is dropped.
   English only for now. Styles: .su-* in HomePage.css. */

const SIGNUP_EMAIL = "hello@vybd.ai";

const LINKS = [
    { label: "Home", href: "/" },
    { label: "Enter the US", href: "/us" },
    { label: "Enterprise", href: "/enterprise" },
];

type Fields = { name: string; email: string; idea: string };
type Status = "idle" | "sending" | "done" | "mailed" | "error";

function mailtoFor(f: Fields) {
    const body = [`Name: ${f.name}`, `Email: ${f.email}`, `Brand idea: ${f.idea || "-"}`].join("\n");
    return `mailto:${SIGNUP_EMAIL}?subject=${encodeURIComponent("Vybd Plan sign-up")}&body=${encodeURIComponent(body)}`;
}

export default function SignupPage() {
    const tx = useTx();
    const [fields, setFields] = useState<Fields>({ name: "", email: "", idea: "" });
    const [status, setStatus] = useState<Status>("idle");
    const set = (k: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields((f) => ({ ...f, [k]: e.target.value }));

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === "sending") return;
        track("plan_signup", { has_idea: fields.idea ? "yes" : "no" });
        if (!WAITLIST_ENDPOINT) {
            window.location.href = mailtoFor(fields);
            setStatus("mailed");
            return;
        }
        setStatus("sending");
        try {
            const res = await fetch(WAITLIST_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ ...fields, source: "plan_signup" }),
            });
            if (!res.ok) throw new Error(`Sign-up POST failed: ${res.status}`);
            setStatus("done");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <RdPage name="home" className="rd-global no-loader">
            <RdHeader logoHref="/" links={LINKS} mobileLinks={LINKS} />

            <main className="wrap su">
                <div className="su-card">
                    <span className="su-k">{tx("Vybd Plan")}</span>
                    <h1 className="su-h">{tx("Plan your brand.")}</h1>
                    <p className="su-p">
                        {tx("Research your market, find your customer and positioning, and leave with a brand plan you can act on.")}{" "}
                        <b>{tx("Free for a week, then ${n} a month.").replace("{n}", String(APP_MONTHLY))}</b>
                    </p>

                    {status === "done" || status === "mailed" ? (
                        <p className="su-done" role="status">
                            {status === "done" ? (
                                tx("You're in. We'll email you your access.")
                            ) : (
                                <>
                                    {tx("Your email app should open with your sign-up. If it didn't, send it to")}{" "}
                                    <a href={mailtoFor(fields)}>{SIGNUP_EMAIL}</a>.
                                </>
                            )}
                        </p>
                    ) : (
                        <form className="su-form" onSubmit={handleSubmit}>
                            <label>
                                <span>{tx("Your name")}</span>
                                <input required autoComplete="name" value={fields.name} onChange={set("name")} />
                            </label>
                            <label>
                                <span>{tx("Email")}</span>
                                <input required type="email" autoComplete="email" value={fields.email} onChange={set("email")} />
                            </label>
                            <label>
                                <span>
                                    {tx("Your brand idea")} <em>{tx("(optional)")}</em>
                                </span>
                                <textarea rows={3} value={fields.idea} onChange={set("idea")} />
                            </label>
                            <button type="submit" className="btn btn-mint" disabled={status === "sending"}>
                                {status === "sending" ? tx("Signing you up…") : tx("Start your free week")}
                            </button>
                            {status === "error" && (
                                <p className="su-err" role="alert">
                                    {tx("That didn't go through. Try again, or email")} <a href={mailtoFor(fields)}>{SIGNUP_EMAIL}</a>.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </main>

            <RdFooter />
        </RdPage>
    );
}
