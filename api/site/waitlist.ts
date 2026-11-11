/* POST /api/site/waitlist
   Body: { email, source?, utm_source?, name?, idea?, website? }
   Used by /waitlist (the Vybd app waitlist) and /signup (Vybd Plan, which also sends name and idea).
   Stores rows in vybd_waitlist (Neon, same DATABASE_URL as /api/oc). `website` is a honeypot. */
import { clean, json, readJson, sql } from "../oc/_lib.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
    const body = await readJson(request);
    if (!body) return json({ ok: false, error: "Could not read that. Please try again." }, 400);
    if (clean(body.website)) return json({ ok: true }); // honeypot: pretend success

    const email = clean(body.email, 254)?.toLowerCase() ?? null;
    if (!email || !EMAIL.test(email)) return json({ ok: false, field: "email", error: "Enter a valid email address." }, 400);

    const source = clean(body.source, 40);
    try {
        await sql`
            insert into vybd_waitlist (email, name, idea, source, utm_source)
            values (${email}, ${clean(body.name, 120)}, ${clean(body.idea, 1000)}, ${source}, ${clean(body.utm_source, 60)})
            on conflict (email) do update set
                name = coalesce(excluded.name, vybd_waitlist.name),
                idea = coalesce(excluded.idea, vybd_waitlist.idea),
                updated_at = now()`;
        return json({ ok: true });
    } catch (err) {
        console.error("waitlist signup failed", err);
        return json({ ok: false, error: "Something broke on our side. Please try again in a minute." }, 500);
    }
}
