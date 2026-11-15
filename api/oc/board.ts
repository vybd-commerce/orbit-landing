/* GET  /api/oc/board -> newest visible posts for /outside-context/board.
   POST /api/oc/board  { body, name?, email?, website? }
   Open posting, no login. `email` comes from the visitor's saved sign-up (localStorage) and is only
   used to link the post to oc_signups for moderation; it is never returned. `website` is a honeypot.
   Rate limit: 5 posts per 10 minutes per visitor, keyed on sha256(ip + HASH_SALT), never the raw IP.
   Hide a post: update oc_board_posts set hidden = true where id = <id>;  (see db/README.md) */
import { clean, json, readJson, sha256, sql } from "./_lib.js";

const MAX_BODY = 1000;
const LIMIT = 5;
const WINDOW_MINUTES = 10;

type Post = { id: string; body: string; display_name: string; created_at: string };

/* Post one message to Discord. Never throws, gives up after 3s, mentions disabled. */
async function notifyDiscord(webhook: string | undefined, username: string, content: string) {
    if (!webhook) return;
    try {
        await fetch(webhook, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, content: content.slice(0, 1900), allowed_mentions: { parse: [] } }),
            signal: AbortSignal.timeout(3000),
        });
    } catch (err) {
        console.error("discord notify failed", err);
    }
}

/* Keep line breaks (unlike clean()), drop control characters, cap blank lines. */
function cleanBody(v: unknown): string {
    if (typeof v !== "string") return "";
    return v
        .replace(/\r\n?/g, "\n")
        .replace(/[\u0000-\u0008\u000B-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "")
        .replace(/[ \t]+$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export async function GET() {
    try {
        const posts = (await sql`
            select id::text, body, display_name, created_at from oc_board_posts
            where not hidden order by created_at desc limit 100`) as Post[];
        return json({ ok: true, posts });
    } catch (err) {
        console.error("oc board list failed", err);
        return json({ ok: false, posts: [] }, 500);
    }
}

export async function POST(request: Request) {
    const data = await readJson(request);
    if (!data) return json({ ok: false, error: "Could not read that. Please try again." }, 400);
    if (clean(data.website)) return json({ ok: true, post: null }); // honeypot: pretend success

    const body = cleanBody(data.body);
    if (!body) return json({ ok: false, field: "body", error: "Write something first." }, 400);
    if (body.length > MAX_BODY) return json({ ok: false, field: "body", error: `Keep it to ${MAX_BODY} characters or fewer.` }, 400);
    const name = clean(data.name, 60) ?? "Anonymous";
    const email = clean(data.email, 254)?.toLowerCase() ?? null;

    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
    const ipHash = await sha256(`board|${ip}|${process.env.HASH_SALT ?? ""}`);

    try {
        const [recent] = (await sql`
            select count(*)::int as n from oc_board_posts
            where ip_hash = ${ipHash} and created_at > now() - make_interval(mins => ${WINDOW_MINUTES})`) as { n: number }[];
        if (recent.n >= LIMIT) return json({ ok: false, error: "You're posting a lot. Try again in a few minutes." }, 429);

        const [post] = (await sql`
            insert into oc_board_posts (body, display_name, signup_id, ip_hash)
            values (${body}, ${name}, (select id from oc_signups where email = ${email}), ${ipHash})
            returning id::text, body, display_name, created_at`) as Post[];

        await notifyDiscord(process.env.DISCORD_WEBHOOK_URL, "Outside Context",
            `**Board post #${post.id}** by ${name}:\n> ${body.replace(/\n/g, "\n> ")}`);
        return json({ ok: true, post });
    } catch (err) {
        console.error("oc board post failed", err);
        return json({ ok: false, error: "Something broke on our side. Please try again in a minute." }, 500);
    }
}
