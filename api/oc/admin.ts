/* GET /api/oc/admin  (served at /outside-context/admin via vercel.json)
   Password-protected view of Outside Context registrations, onboarding answers and volunteer/topic
   requests. Sign-in form; password = OC_ADMIN_PASSWORD (Vercel env var), kept as an HttpOnly session cookie for 14 days.
   ?format=csv downloads all signups as CSV. */
import { sql } from "./_lib.js";

type Row = Record<string, unknown>;

const FIELD_LABEL: Record<string, string> = {
    professional: "Works for a company", freelancer: "Works for themselves", student: "Studying",
    builder: "Works in tech", other: "Something else",
};

const COOKIE = "oc_admin";
const page = (title: string, body: string, status = 200, headers: Record<string, string> = {}) =>
    new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>${title}</title><style>
:root { --paper:#F4F1EA; --ink:#111; --gray:#5F5F5F; --line:rgba(17,17,17,.2); --accent:#C4552D; --error:#A3311A; }
* { box-sizing:border-box; margin:0; }
body { background:var(--paper); color:var(--ink); font:17px/1.45 Georgia, "Times New Roman", serif; padding:clamp(48px,12vh,120px) 24px; }
form { max-width:22rem; margin:0 auto; } h1 { font-weight:400; font-size:34px; }
label { display:block; margin-top:28px; } input { width:100%; font:inherit; font-size:20px; padding:8px 0 10px; border:0;
  border-bottom:1px solid var(--line); background:transparent; color:var(--ink); }
input:focus { outline:none; border-color:var(--ink); }
button { margin-top:28px; font:inherit; font-size:18px; padding:13px 28px; border-radius:999px; border:1px solid var(--ink);
  background:var(--ink); color:var(--paper); cursor:pointer; } button:hover { background:var(--accent); border-color:var(--accent); }
.err { margin-top:14px; color:var(--error); }
.field { position:relative; } .field input { padding-right:48px; }
.eye { position:absolute; right:0; bottom:4px; margin:0; padding:0; width:44px; height:44px; display:grid; place-items:center;
  background:transparent; border:0; border-radius:999px; color:var(--gray); }
.eye:hover { background:transparent; color:var(--ink); } .eye:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.eye svg { width:22px; height:22px; } .eye .off, .eye[aria-pressed="true"] .on { display:none; } .eye[aria-pressed="true"] .off { display:block; }
</style></head><body>${body}</body></html>`,
        { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex", ...headers } });

const loginPage = (message = "", status = 200) => page("Outside Context | Sign in", `<form method="post" action="/outside-context/admin">
<h1>Outside Context admin</h1>
<label for="pw">Password</label>
<div class="field"><input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
<button class="eye" type="button" id="eye" aria-pressed="false" aria-label="Show password" aria-controls="pw">
<svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.7 17.7 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
</button></div>
${message ? `<p class="err" role="alert">${message}</p>` : ""}
<button type="submit">Sign in</button></form>
<script>
document.getElementById("eye").addEventListener("click", function () {
  var pw = document.getElementById("pw"), show = pw.type === "password";
  pw.type = show ? "text" : "password";
  this.setAttribute("aria-pressed", String(show));
  this.setAttribute("aria-label", show ? "Hide password" : "Show password");
  pw.focus();
});
</script>`, status);

/* Constant-time string compare, so response timing doesn't leak the password. */
function same(a: string, b: string) {
    const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
    let diff = x.length ^ y.length;
    for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
    return diff === 0;
}

/* Session token: HMAC of a fixed label under the password. Changing the password signs everyone out. */
async function token(secret: string) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("oc-admin-session-v1"));
    return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

const secret = () => (process.env.OC_ADMIN_PASSWORD ?? "").trim();

async function signedIn(request: Request) {
    const expected = secret();
    if (!expected) return false;
    const cookie = (request.headers.get("cookie") ?? "").split(/;\s*/).find((c) => c.startsWith(COOKIE + "="));
    return !!cookie && same(cookie.slice(COOKIE.length + 1), await token(expected));
}

/* POST: check the password from the sign-in form, set a session cookie, go back to the page. */
export async function POST(request: Request) {
    const expected = secret();
    if (!expected) return loginPage("The admin password isn't set on the server (OC_ADMIN_PASSWORD).", 500);
    let given = "";
    try { given = String((await request.formData()).get("password") ?? "").trim(); } catch { /* empty */ }
    if (!same(given, expected)) return loginPage("That password didn't match. Check for typos and try again.", 401);
    return new Response(null, {
        status: 303,
        headers: {
            location: "/outside-context/admin",
            "set-cookie": `${COOKIE}=${await token(expected)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`,
            "cache-control": "no-store",
        },
    });
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
    if (!(await signedIn(request))) return loginPage();

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
