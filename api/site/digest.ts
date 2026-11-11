/* GET /api/site/digest  (daily, from .github/workflows/site-digest.yml)
   Auth: "Authorization: Bearer $CRON_SECRET".
   Pulls yesterday's vybd.ai analytics from the Plausible Stats API and posts them to the
   #website Discord channel. ?date=YYYY-MM-DD reports a specific day instead.
   Env: PLAUSIBLE_API_KEY, SITE_DISCORD_WEBHOOK_URL, CRON_SECRET (PLAUSIBLE_SITE_ID optional). */

const SITE = process.env.PLAUSIBLE_SITE_ID || "vybd.ai";
const TZ = "America/New_York";

type Result = { metrics: number[]; dimensions: string[] };

function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
}

async function query(key: string, day: string, metrics: string[], dimensions: string[] = [], limit = 5): Promise<Result[]> {
    const res = await fetch("https://plausible.io/api/v2/query", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
            site_id: SITE,
            metrics,
            date_range: [day, day],
            dimensions,
            ...(dimensions.length ? { order_by: [[metrics[0], "desc"]], pagination: { limit } } : {}),
        }),
    });
    if (!res.ok) throw new Error(`plausible ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return ((await res.json()) as { results: Result[] }).results;
}

/* YYYY-MM-DD for "today minus n days" in the site's timezone. */
function dayInTz(offsetDays: number, from?: string) {
    const base = from ? new Date(`${from}T12:00:00Z`) : new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
    base.setDate(base.getDate() - offsetDays);
    return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
}

const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
const dur = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`);
function delta(cur: number, prev: number) {
    if (!prev) return cur ? " (new)" : "";
    const pct = Math.round(((cur - prev) / prev) * 100);
    return ` (${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct)}%)`;
}
const list = (rows: Result[], empty = "—") =>
    rows.length ? rows.map((r) => `${fmt(r.metrics[0])} · ${r.dimensions[0] || "(none)"}`).join("\n").slice(0, 1024) : empty;

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
        return json({ ok: false, error: "unauthorized" }, 401);
    }
    const key = process.env.PLAUSIBLE_API_KEY;
    const webhook = process.env.SITE_DISCORD_WEBHOOK_URL;
    if (!key || !webhook) return json({ ok: false, error: "PLAUSIBLE_API_KEY or SITE_DISCORD_WEBHOOK_URL not set" }, 500);

    const param = new URL(request.url).searchParams.get("date");
    const day = param && /^\d{4}-\d{2}-\d{2}$/.test(param) ? param : dayInTz(1);
    const weekBefore = dayInTz(7, day);

    const M = ["visitors", "visits", "pageviews", "bounce_rate", "visit_duration"];
    let cur: Result[], prev: Result[], pages: Result[], sources: Result[], countries: Result[], devices: Result[], goals: Result[];
    try {
        [cur, prev, pages, sources, countries, devices, goals] = await Promise.all([
            query(key, day, M),
            query(key, weekBefore, M),
            query(key, day, ["visitors"], ["event:page"], 8),
            query(key, day, ["visitors"], ["visit:source"], 6),
            query(key, day, ["visitors"], ["visit:country_name"], 5),
            query(key, day, ["visitors"], ["visit:device"], 4),
            query(key, day, ["events"], ["event:goal"], 6).catch(() => [] as Result[]),
        ]);
    } catch (e) {
        return json({ ok: false, error: String(e) }, 502);
    }

    const [visitors, visits, pageviews, bounce, duration] = cur[0]?.metrics ?? [0, 0, 0, 0, 0];
    const p = prev[0]?.metrics ?? [0, 0, 0, 0, 0];
    const label = new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

    const embed = {
        title: `vybd.ai · ${label}`,
        url: `https://plausible.io/${encodeURIComponent(SITE)}?period=day&date=${day}`,
        description: "vs same day last week",
        color: 0x2d6cdf,
        fields: [
            { name: "Visitors", value: `**${fmt(visitors)}**${delta(visitors, p[0])}`, inline: true },
            { name: "Visits", value: `**${fmt(visits)}**${delta(visits, p[1])}`, inline: true },
            { name: "Pageviews", value: `**${fmt(pageviews)}**${delta(pageviews, p[2])}`, inline: true },
            { name: "Bounce rate", value: `${Math.round(bounce)}%`, inline: true },
            { name: "Avg visit", value: dur(duration), inline: true },
            { name: "Devices", value: list(devices), inline: true },
            { name: "Top pages", value: list(pages, "No traffic"), inline: false },
            { name: "Sources", value: list(sources), inline: true },
            { name: "Countries", value: list(countries), inline: true },
            ...(goals.length ? [{ name: "Goals", value: list(goals), inline: false }] : []),
        ],
        footer: { text: "Plausible" },
        timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "vybd.ai analytics", embeds: [embed], allowed_mentions: { parse: [] } }),
    });
    if (!res.ok) return json({ ok: false, error: `discord ${res.status}` }, 502);
    return json({ ok: true, posted: true, day });
}
