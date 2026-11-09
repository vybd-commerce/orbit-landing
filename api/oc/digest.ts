/* GET /api/oc/digest  (hourly, from .github/workflows/oc-digest.yml)
   Auth: "Authorization: Bearer $CRON_SECRET".
   Posts last-hour activity plus running totals for Outside Context to the Discord webhook.
   Quiet hours (no views, no signups) post nothing unless ?force=1. */
import { json, sql } from "./_lib.js";

type Row = Record<string, unknown>;
const n = (v: unknown) => Number(v ?? 0);

const FIELD_LABEL: Record<string, string> = {
    freelancer: "Freelancer", builder: "Builder", professional: "Professional", student: "Student", other: "Other",
};

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
        return json({ ok: false, error: "unauthorized" }, 401);
    }
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) return json({ ok: false, error: "DISCORD_WEBHOOK_URL not set" }, 500);
    const force = new URL(request.url).searchParams.get("force") === "1";

    const [hour] = (await sql`
        select
          count(*) filter (where event = 'view')                       as views,
          count(distinct visitor_hash) filter (where event = 'view')   as visitors,
          count(*) filter (where event = 'cta')                        as ctas,
          count(*) filter (where event = 'community')                  as community,
          count(*) filter (where event = 'hub_view')                   as hub
        from oc_events where at > now() - interval '1 hour'`) as Row[];

    const [total] = (await sql`
        select
          (select count(*) from oc_events where event = 'view')                                  as views,
          (select count(distinct (visitor_hash, at::date)) from oc_events where event = 'view')  as visitors,
          (select count(*) from oc_events where event = 'community')                             as community,
          (select count(*) from oc_signups)                                                      as signups,
          (select count(*) from oc_signups where onboarded)                                      as onboarded,
          (select count(*) from oc_interest where kind = 'volunteer')                            as volunteers,
          (select count(*) from oc_interest where kind = 'topic')                                as topics`) as Row[];

    const newInterest = (await sql`
        select kind, role, name, message from oc_interest
        where created_at > now() - interval '1 hour' order by created_at limit 10`) as Row[];

    const newSignups = (await sql`
        select name, field, field_other, sunday, source from oc_signups
        where created_at > now() - interval '1 hour' order by created_at`) as Row[];

    const sundays = (await sql`
        select sunday, count(*) as c from oc_signups
        where sunday >= (now() at time zone 'America/New_York')::date
        group by sunday order by sunday limit 4`) as Row[];

    const sources = (await sql`
        select coalesce(source, 'unknown') as s, count(*) as c from oc_signups
        group by 1 order by c desc limit 5`) as Row[];

    const quiet = n(hour.views) === 0 && n(hour.hub) === 0 && newSignups.length === 0 && newInterest.length === 0;
    if (quiet && !force) return json({ ok: true, posted: false, reason: "quiet hour" });

    const fmtDate = (d: unknown) =>
        new Date(`${String(d).slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

    const signupLines = newSignups.length
        ? newSignups
              .slice(0, 15)
              .map((s) => {
                  const field = s.field === "other" && s.field_other ? String(s.field_other) : FIELD_LABEL[String(s.field)] ?? "—";
                  return `• **${String(s.name)}** · ${field}${s.sunday ? ` · ${fmtDate(s.sunday)}` : ""}${s.source ? ` · via ${String(s.source)}` : ""}`;
              })
              .join("\n") + (newSignups.length > 15 ? `\n…and ${newSignups.length - 15} more` : "")
        : "None this hour";

    const ROLE_LABEL: Record<string, string> = {
        host: "Host a table", speaker: "Lead a conversation", spread: "Spread the word", photos: "Take photos", venue: "Know a venue", other: "Something else",
    };
    const clip = (v: unknown, max: number) => { const t = String(v ?? ""); return t.length > max ? `${t.slice(0, max - 1)}…` : t; };
    const interestLines = newInterest
        .map((r) => r.kind === "topic"
            ? `• Topic from **${clip(r.name, 60)}**: ${clip(r.message, 160)}`
            : `• **${clip(r.name, 60)}** offered: ${ROLE_LABEL[String(r.role)] ?? "help"}${r.message ? ` (${clip(r.message, 100)})` : ""}`)
        .join("\n");

    const embed = {
        title: "Outside Context · hourly",
        url: "https://www.vybd.ai/outside-context",
        color: 0xc4552d,
        fields: [
            { name: "Last hour", value: `${n(hour.views)} visits · ${n(hour.visitors)} people\n${n(hour.ctas)} CTA clicks · ${newSignups.length} signups · ${n(hour.community)} community joins · ${n(hour.hub)} hub views`, inline: false },
            { name: `New signups (${newSignups.length})`, value: signupLines.slice(0, 1024), inline: false },
            ...(newInterest.length ? [{ name: `Hands raised & topics (${newInterest.length})`, value: interestLines.slice(0, 1024), inline: false }] : []),
            { name: "All time", value: `${n(total.signups)} registered · ${n(total.onboarded)} onboarded · ${n(total.volunteers)} volunteers · ${n(total.topics)} topic ideas\n${n(total.views)} visits · ${n(total.visitors)} visitor-days · ${n(total.community)} community clicks`, inline: false },
            { name: "Upcoming Sundays", value: sundays.length ? sundays.map((r) => `${fmtDate(r.sunday)}: ${n(r.c)}`).join("\n") : "No RSVPs yet", inline: true },
            { name: "Heard via", value: sources.length ? sources.map((r) => `${String(r.s)}: ${n(r.c)}`).join("\n") : "—", inline: true },
        ],
        timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "Outside Context", embeds: [embed], allowed_mentions: { parse: [] } }),
    });
    if (!res.ok) return json({ ok: false, error: `discord ${res.status}` }, 502);
    return json({ ok: true, posted: true });
}
