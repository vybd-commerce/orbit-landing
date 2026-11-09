/* GET /api/oc/join -> 302 to the WhatsApp community invite (COMMUNITY_URL env), so the
   link can change without a redeploy. Until it is set, send people to the community hub. */
export function GET(request: Request) {
    const url = process.env.COMMUNITY_URL || new URL("/outside-context/community", request.url).toString();
    return new Response(null, { status: 302, headers: { location: url, "cache-control": "no-store" } });
}
