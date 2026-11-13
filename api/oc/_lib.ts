/* Shared helpers for the Outside Context API (/api/oc/*). Files starting with "_" are
   not deployed as routes by Vercel. */
import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL ?? "");

export function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
}

/* Trim, collapse whitespace, cap length. Non-strings become null. */
export function clean(v: unknown, max = 200): string | null {
    if (typeof v !== "string") return null;
    const s = v.replace(/\s+/g, " ").trim().slice(0, max);
    return s || null;
}

export function oneOf<T extends string>(v: unknown, allowed: readonly T[]): T | null {
    return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
    try {
        const text = await request.text();
        if (text.length > 8000) return null;
        const body = JSON.parse(text);
        return body && typeof body === "object" && !Array.isArray(body) ? body : null;
    } catch {
        return null;
    }
}

export async function sha256(s: string) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/* Post one message to a Discord webhook. Never throws and gives up after 3s, so a slow or
   missing webhook can't break the request that triggered it. Mentions are disabled. */
export async function notifyDiscord(webhook: string | undefined, username: string, content: string) {
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
