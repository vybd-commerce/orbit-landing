/* GET /api/oc/admin  (served at /outside-context/admin via vercel.json)
   Password-protected view of Outside Context registrations, onboarding answers and volunteer/topic
   requests. HTTP Basic auth: any username, password = OC_ADMIN_PASSWORD (Vercel env var).
   ?format=csv downloads all signups as CSV. */
import { sql } from "./_lib.js";

type Row = Record<string, unknown>;

const FIELD_LABEL: Record<string, string> = {
    professional: "Works for a company", freelancer: "Works for themselves", student: "Studying",
    builder: "Works in tech", other: "Something else",
};

function unauthorized() {
    return new Response("Password required.", {
        status: 401,
        headers: {
            "www-authenticate": 'Basic realm="Outside Context admin", charset="UTF-8"',
            "cache-control": "no-store",
        },
    });
}

/* Constant-time string compare, so response timing doesn't leak the password. */
function same(a: string, b: string) {
    const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
    let diff = x.length ^ y.length;
    for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
    return diff === 0;
}

function authorized(request: Request) {
    const expected = process.env.OC_ADMIN_PASSWORD;
    if (!expected) return false; // fail closed when the password isn't configured
    const header = request.headers.get("authorization") ?? "";
    if (!header.startsWith("Basic ")) return false;
    let decoded = "";
    try { decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0))); }
    catch { return false; }
    const password = decoded.slice(decoded.indexOf(":") + 1);
    return same(password, expected);
}

const esc = (v: unknown) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const csvCell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const day = (v: unknown) =>
    v ? new Date(String(v)).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) : "";
const stamp = (v: unknown) =>
    v ? new Date(String(v)).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) : "";

export async function GET(request: Request) {
    if (!authorized(request)) return unauthorized();

    const signups = (await sql`
        select name, email, field, field_other, to_char(sunday, 'YYYY-MM-DD') as sunday, source, utm_source,
               ai_use, onboarded, created_at
        from oc_signups order by created_at desc`) as Row[];

    if (new URL(request.url).searchParams.get("format") === "csv") {
        const cols = ["name", "email", "field", "field_other", "sunday", "source", "utm_source", "ai_use", "onboarded", "created_at"];
        const body = [cols.join(","), ...signups.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
        return new Response(body, {
            headers: {
                "content-type": "text/csv; charset=utf-8",
                "content-disposition": `attachment; filename="outside-context-signups.csv"`,
                "cache-control": "no-store",
            },
        });
    }

    const interest = (await sql`
        select kind, role, name, email, message, created_at from oc_interest order by created_at desc limit 200`) as Row[];
    const [views] = (await sql`
        select count(*) filter (where event = 'view') as views,
               count(distinct visitor_hash) filter (where event = 'view') as visitors
        from oc_events where at > now() - interval '7 days'`) as Row[];

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const bySunday = new Map<string, number>();
    for (const r of signups) if (r.sunday && String(r.sunday) >= today) bySunday.set(String(r.sunday), (bySunday.get(String(r.sunday)) ?? 0) + 1);
    const upcoming = [...bySunday].sort(([a], [b]) => a.localeCompare(b));
    const onboarded = signups.filter((r) => r.onboarded).length;

    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Outside Context | Admin</title>
<style>
:root { --paper:#F4F1EA; --ink:#111; --gray:#5F5F5F; --line:rgba(17,17,17,.15); --accent:#C4552D; }
* { box-sizing:border-box; margin:0; }
body { background:var(--paper); color:var(--ink); font:16px/1.45 Georgia, "Times New Roman", serif; padding:32px clamp(16px,4vw,48px) 64px; }
h1 { font-weight:400; font-size:36px; } h2 { font-weight:400; font-size:24px; margin:48px 0 12px; }
.stats { display:flex; flex-wrap:wrap; gap:12px 40px; margin-top:20px; }
.stats b { display:block; font-size:32px; font-weight:400; } .stats span { color:var(--gray); }
.bar { display:flex; gap:16px; align-items:baseline; margin-top:24px; flex-wrap:wrap; }
a { color:var(--ink); text-underline-offset:.2em; } a:hover { text-decoration-color:var(--accent); }
input[type=search] { font:inherit; padding:8px 12px; border:1px solid var(--line); border-radius:999px; background:#fff8; min-width:min(320px,100%); }
.wrap { overflow-x:auto; border-top:1px solid var(--ink); }
table { border-collapse:collapse; width:100%; font-size:15px; }
th, td { text-align:left; vertical-align:top; padding:10px 12px 10px 0; border-bottom:1px solid var(--line); }
th { font-weight:400; color:var(--gray); white-space:nowrap; }
td.long { min-width:260px; max-width:420px; } .muted { color:var(--gray); } .nowrap { white-space:nowrap; }
</style></head><body>
<h1>Outside Context</h1>
<div class="stats">
  <div><b>${signups.length}</b><span>registered</span></div>
  <div><b>${onboarded}</b><span>answered the AI question</span></div>
  ${upcoming.map(([d, c]) => `<div><b>${c}</b><span>for ${esc(day(d))}</span></div>`).join("")}
  <div><b>${Number(views?.visitors ?? 0)}</b><span>visitors, last 7 days</span></div>
</div>
<div class="bar"><input type="search" id="q" placeholder="Filter by name, email, field…" aria-label="Filter registrations">
<a href="?format=csv">Download CSV</a></div>

<h2>Registrations</h2>
<div class="wrap"><table id="signups"><thead><tr><th>Name</th><th>Email</th><th>Does</th><th>Sunday</th><th>Heard via</th><th>On AI and their work</th><th>Signed up</th></tr></thead><tbody>
${signups.map((r) => `<tr><td>${esc(r.name)}</td><td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td>
<td>${esc(FIELD_LABEL[String(r.field)] ?? "")}${r.field_other ? ` <span class="muted">(${esc(r.field_other)})</span>` : ""}</td>
<td class="nowrap">${esc(day(r.sunday))}</td><td>${esc(r.source ?? "")}${r.utm_source ? ` <span class="muted">${esc(r.utm_source)}</span>` : ""}</td>
<td class="long">${esc(r.ai_use ?? "")}</td><td class="nowrap muted">${esc(stamp(r.created_at))}</td></tr>`).join("") || `<tr><td colspan="7" class="muted">No registrations yet.</td></tr>`}
</tbody></table></div>

<h2>Volunteers and topic ideas</h2>
<div class="wrap"><table><thead><tr><th>Kind</th><th>Name</th><th>Email</th><th>Role</th><th>Message</th><th>When</th></tr></thead><tbody>
${interest.map((r) => `<tr><td>${esc(r.kind)}</td><td>${esc(r.name)}</td><td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td>
<td>${esc(r.role ?? "")}</td><td class="long">${esc(r.message ?? "")}</td><td class="nowrap muted">${esc(stamp(r.created_at))}</td></tr>`).join("") || `<tr><td colspan="6" class="muted">Nothing yet.</td></tr>`}
</tbody></table></div>
<script>
document.getElementById("q").addEventListener("input", function (e) {
  var q = e.target.value.toLowerCase();
  document.querySelectorAll("#signups tbody tr").forEach(function (tr) { tr.hidden = q && tr.textContent.toLowerCase().indexOf(q) < 0; });
});
</script>
</body></html>`;

    return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
    });
}
