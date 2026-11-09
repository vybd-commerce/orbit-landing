/* POST /api/oc/interest  { kind: "volunteer" | "topic", role?, name, email, message?, website? }
   Volunteer hand-raises and topic suggestions from /outside-context/community. */
import { clean, json, oneOf, readJson, sql } from "./_lib.js";

const KINDS = ["volunteer", "topic"] as const;
const ROLES = ["host", "speaker", "photos", "spread", "venue", "other"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
    const body = await readJson(request);
    if (!body) return json({ ok: false, error: "Could not read that. Please try again." }, 400);
    if (clean(body.website)) return json({ ok: true });

    const kind = oneOf(body.kind, KINDS);
    if (!kind) return json({ ok: false, error: "Unknown request." }, 400);
    const name = clean(body.name, 120);
    const email = clean(body.email, 254)?.toLowerCase() ?? null;
    const message = clean(body.message, 1000);
    if (!name) return json({ ok: false, field: "name", error: "Tell us your name." }, 400);
    if (!email || !EMAIL.test(email)) return json({ ok: false, field: "email", error: "Enter a valid email address." }, 400);
    if (kind === "topic" && !message) return json({ ok: false, field: "message", error: "What should we talk about?" }, 400);

    try {
        await sql`insert into oc_interest (kind, role, name, email, message)
                  values (${kind}, ${oneOf(body.role, ROLES)}, ${name}, ${email}, ${message})`;
        return json({ ok: true });
    } catch (err) {
        console.error("oc interest failed", err);
        return json({ ok: false, error: "Something broke on our side. Please try again in a minute." }, 500);
    }
}
