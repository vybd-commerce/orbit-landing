/* GET /api/oc/sessions -> RSVP counts for upcoming Sundays (aggregate only, no names). */
import { json, sql } from "./_lib.js";

export async function GET() {
    try {
        const rows = (await sql`
            select to_char(sunday, 'YYYY-MM-DD') as sunday, count(*)::int as going from oc_signups
            where sunday >= (now() at time zone 'America/New_York')::date
            group by sunday order by sunday limit 8`) as { sunday: string; going: number }[];
        const [t] = (await sql`select count(*)::int as members from oc_signups`) as { members: number }[];
        return new Response(JSON.stringify({ ok: true, sessions: rows, members: t.members }), {
            headers: { "content-type": "application/json", "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
        });
    } catch (err) {
        console.error("oc sessions failed", err);
        return json({ ok: false, sessions: [], members: 0 }, 500);
    }
}
