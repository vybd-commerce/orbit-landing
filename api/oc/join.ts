/* GET /api/oc/join -> 302 to the community invite (COMMUNITY_URL env), so the link can
   change without a redeploy of the page. The click is logged by the page's beacon. */
export function GET() {
    const url = process.env.COMMUNITY_URL;
    if (!url) {
        return new Response("The community link is coming soon. Check back after Sunday.", {
            status: 503,
            headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
        });
    }
    return new Response(null, { status: 302, headers: { location: url, "cache-control": "no-store" } });
}
