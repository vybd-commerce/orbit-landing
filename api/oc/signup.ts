/* POST /api/oc/signup
   Step 1 (register): { name, email, field, field_other?, sunday, source, utm_source?, website? }
   Step 2 (onboard):  { email, ai_use }  updates the existing row.
   `website` is a honeypot: humans never see it, bots fill it. */
import { clean, json, notifyDiscord, oneOf, readJson, sql } from "./_lib.js";

const FIELDS = ["freelancer", "builder", "professional", "student", "other"] as const;
const SOURCES = ["poster", "friend", "linkedin", "instagram", "other"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
    const body = await readJson(request);
    if (!body) return json({ ok: false, error: "Could not read that. Please try again." }, 400);
    if (clean(body.website)) return json({ ok: true }); // honeypot: pretend success

    const email = clean(body.email, 254)?.toLowerCase() ?? null;
    if (!email || !EMAIL.test(email)) return json({ ok: false, field: "email", error: "Enter a valid email address." }, 400);

    try {
        // Step 2: onboarding answer for an existing signup.
        if (body.step === "onboard") {
            const aiUse = clean(body.ai_use, 1000);
            const rows = await sql`
                update oc_signups set ai_use = ${aiUse}, onboarded = true, updated_at = now()
                where email = ${email} returning id`;
            if (!rows.length) return json({ ok: false, error: "We couldn't find your signup. Register first." }, 404);
            if (aiUse) await notifyDiscord(process.env.DISCORD_WEBHOOK_URL, "Outside Context", `**${email}** on AI and their work:\n> ${aiUse}`);
            return json({ ok: true });
        }

        const name = clean(body.name, 120);
        if (!name) return json({ ok: false, field: "name", error: "Tell us your name." }, 400);
        const sunday = typeof body.sunday === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.sunday) ? body.sunday : null;

        await sql`
            insert into oc_signups (name, email, field, field_other, sunday, source, utm_source)
            values (${name}, ${email}, ${oneOf(body.field, FIELDS)}, ${clean(body.field_other, 120)},
                    ${sunday}, ${oneOf(body.source, SOURCES)}, ${clean(body.utm_source, 60)})
            on conflict (email) do update set
                name = excluded.name, field = excluded.field, field_other = excluded.field_other,
                sunday = excluded.sunday, source = coalesce(excluded.source, oc_signups.source),
                updated_at = now()`;
        const field = oneOf(body.field, FIELDS);
        const does = field === "other" ? clean(body.field_other, 120) ?? "other" : field;
        await notifyDiscord(process.env.DISCORD_WEBHOOK_URL, "Outside Context",
            `**New sign-up:** ${name} · ${email}${does ? ` · ${does}` : ""} · Sunday ${sunday ?? "?"}${body.source ? ` · via ${clean(body.source, 20)}` : ""}`);
        return json({ ok: true });
    } catch (err) {
        console.error("oc signup failed", err);
        return json({ ok: false, error: "Something broke on our side. Please try again in a minute." }, 500);
    }
}
