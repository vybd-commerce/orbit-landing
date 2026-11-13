/* POST /api/site/contact
   Body: { email, name?, company?, message?, route?, lang?, page?, utm_source?, website? }
   The /book form (it replaced the Calendly scheduler): stores the request in vybd_contacts (Neon)
   and posts it to SITE_DISCORD_WEBHOOK_URL so someone can reply by email. `website` is a honeypot. */
import { clean, json, notifyDiscord, oneOf, readJson, sql } from "../oc/_lib.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROUTES = ["launch", "drop", "scale", "enterprise", "partner"] as const;
const LANGS = ["en", "zh", "ko", "ja", "fr", "es"] as const;
const ROUTE_LABEL: Record<string, string> = {
    launch: "US Launch", drop: "Test Drop", scale: "US Scale", enterprise: "Enterprise", partner: "Partner",
};

export async function POST(request: Request) {
    const body = await readJson(request);
    if (!body) return json({ ok: false, error: "Could not read that. Please try again." }, 400);
    if (clean(body.website)) return json({ ok: true }); // honeypot: pretend success

    const email = clean(body.email, 254)?.toLowerCase() ?? null;
    if (!email || !EMAIL.test(email)) return json({ ok: false, field: "email", error: "Enter a valid email address." }, 400);

    const row = {
        name: clean(body.name, 120),
        company: clean(body.company, 200),
        message: clean(body.message, 2000),
        route: oneOf(body.route, ROUTES),
        lang: oneOf(body.lang, LANGS),
        page: clean(body.page, 200),
        utm: clean(body.utm_source, 60),
    };
    try {
        await sql`
            insert into vybd_contacts (email, name, company, message, route, lang, page, utm_source)
            values (${email}, ${row.name}, ${row.company}, ${row.message}, ${row.route}, ${row.lang}, ${row.page}, ${row.utm})`;
    } catch (err) {
        console.error("contact request failed", err);
        return json({ ok: false, error: "Something broke on our side. Please try again in a minute." }, 500);
    }

    const lines = [
        `**New contact request${row.route ? ` · ${ROUTE_LABEL[row.route]}` : ""}**`,
        `${row.name ?? "(no name)"} · ${email}${row.company ? ` · ${row.company}` : ""}`,
        row.message ? `> ${row.message.replace(/\n/g, "\n> ")}` : null,
        [row.lang && row.lang !== "en" ? `lang ${row.lang}` : null, row.page ? `from ${row.page}` : null, row.utm ? `utm ${row.utm}` : null]
            .filter(Boolean).join(" · ") || null,
    ].filter(Boolean);
    await notifyDiscord(process.env.SITE_DISCORD_WEBHOOK_URL, "Vybd contact", lines.join("\n"));
    return json({ ok: true });
}
