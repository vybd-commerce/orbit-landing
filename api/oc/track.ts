/* POST /api/oc/track  (navigator.sendBeacon from /outside-context)
   Body: { event, path?, referrer?, utm_source? }
   Stores no IP: visitor_hash = sha256(ip + user agent + UTC day + HASH_SALT), so a visitor
   is countable within a day but not traceable across days. */
import { clean, oneOf, readJson, sha256, sql } from "./_lib.js";

const EVENTS = ["view", "cta", "register", "onboard", "skip_onboard", "calendar", "community"] as const;

export async function POST(request: Request) {
    const body = await readJson(request);
    const event = body && oneOf(body.event, EVENTS);
    if (!body || !event) return new Response(null, { status: 204 });

    const h = request.headers;
    const ua = h.get("user-agent") ?? "";
    if (/bot|crawl|spider|preview|headless|lighthouse/i.test(ua)) return new Response(null, { status: 204 });

    let referrer: string | null = null;
    try {
        const r = clean(body.referrer, 500);
        if (r) referrer = new URL(r).hostname.replace(/^www\./, "");
    } catch { /* not a URL */ }

    const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim();
    const day = new Date().toISOString().slice(0, 10);
    const visitor = await sha256(`${ip}|${ua}|${day}|${process.env.HASH_SALT ?? ""}`);

    try {
        await sql`
            insert into oc_events (event, path, referrer, utm_source, country, visitor_hash)
            values (${event}, ${clean(body.path, 200)}, ${referrer}, ${clean(body.utm_source, 60)},
                    ${clean(h.get("x-vercel-ip-country"), 4)}, ${visitor})`;
    } catch (err) {
        console.error("oc track failed", err);
    }
    return new Response(null, { status: 204 });
}
