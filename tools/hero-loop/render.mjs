#!/usr/bin/env node
/* ---------------------------------------------------------------------------
 * Deterministic renderer for the /consulting hero loop.
 *
 * Drives one-order.html frame by frame through Playwright, verifies the loop
 * closes, then stitches with ffmpeg. Never screen-captures in real time —
 * that drops frames and will not loop cleanly.
 *
 *   node tools/hero-loop/render.mjs                        one-order, full run
 *   node tools/hero-loop/render.mjs control-room           concept D, full run
 *   node tools/hero-loop/render.mjs the-load               the load, full run
 *   node tools/hero-loop/render.mjs the-load --verify      gates only, no encode
 * --------------------------------------------------------------------------- */

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../..');
/* Three concepts share this renderer. All expose the same contract —
 * __renderFrame / __computeState / __setSize / __exportWebp / __ready, plus
 * an optional __assert — so nothing below needs to know which one it is
 * driving. `probe` names the two moments gates 5 and 6 measure: the loaded
 * beat and the resolved one, which do not fall at the same time in every
 * concept. */
const CONCEPTS = {
    'one-order': {
        title: 'one order, end to end',
        master: 'one-order.html',
        ship: 'public/media/consulting-hero',
        archive: 'hero-master-2560.mp4',
        budget: 2.0 * 1024 * 1024,
        // Gates 5 and 6 are Concept D's, not this one's: one order has no
        // tile grid to measure and its amber is a transient marker rather
        // than a panel-wide state.
        density: false,
        warmthDrop: 0,
        probe: { loaded: 1.0, resolved: 7.0 },
    },
    'control-room': {
        title: 'the control room',
        master: 'control-room.html',
        ship: 'public/media/consulting-hero-d',
        archive: 'hero-d-master-2560.mp4',
        // Far more per-frame motion than one-order, so the brief allows more
        // room. Still a hard gate.
        budget: 2.5 * 1024 * 1024,
        density: true,
        warmthDrop: 0.35,
        probe: { loaded: 1.0, resolved: 7.0 },
    },
    "the-load": {
        title: "the load",
        master: "the-load.html",
        ship: "public/media/consulting-hero-load",
        archive: "hero-load-master-2560.mp4",
        budget: 2.0 * 1024 * 1024,
        // No tile grid, so gate 5 does not apply. Gate 6 very much does:
        // amber-to-green across the turn is the entire message at small size.
        density: false,
        warmthDrop: 0.30,
        // Its load peaks late and its payoff holds from 5.8, so the two
        // moments worth measuring are not 1.0 and 7.0.
        probe: { loaded: 3.2, resolved: 6.8 },
    },
};

const VERIFY_ONLY = process.argv.includes('--verify');
const NAME = process.argv.slice(2).find(a => !a.startsWith('--')) || 'one-order';
const CONCEPT = CONCEPTS[NAME];
if (!CONCEPT) {
    console.error(`\n  FAIL  unknown concept "${NAME}" — try: ${Object.keys(CONCEPTS).join(', ')}\n`);
    process.exit(1);
}

const MASTER = path.join(HERE, CONCEPT.master);
const SHIP = path.join(REPO, CONCEPT.ship);
const WORK = process.env.HERO_WORK || path.join(HERE, '.work', NAME);

const SIZES = [
    { w: 2560, h: 1440, tag: '2560', ship: false },  // master archive
    { w: 1920, h: 1080, tag: '1920', ship: true },
    { w: 1280, h: 720, tag: '1280', ship: true },
];

const MP4_BUDGET = CONCEPT.budget;    // hard ceiling on the 1080p mp4
const PROBE = CONCEPT.probe || { loaded: 1.0, resolved: 7.0 };

const say = (...a) => console.log(...a);
const fail = (m) => { console.error(`\n  FAIL  ${m}\n`); process.exit(1); };
const ffmpeg = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

fs.mkdirSync(WORK, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2560, height: 1440 }, deviceScaleFactor: 1 });
await page.goto('file://' + MASTER);
await page.evaluate(() => window.__ready);

const DURATION = await page.evaluate(() => window.__DURATION);
const FPS = await page.evaluate(() => window.__FPS);
// Frame TOTAL IS frame 0, so it is never encoded — including it produces a
// duplicate-frame stutter at the wrap.
const TOTAL = Math.round(DURATION * FPS);

say(`\n  ${CONCEPT.title} — ${DURATION}s @ ${FPS}fps — ${TOTAL} frames — budget ${(MP4_BUDGET / 1048576).toFixed(1)} MB\n`);

/* ── Gate 1: state identity ───────────────────────────────────────────────
 * The numeric assertion the brief asks for. Every float in the state at t=0
 * must match t=DURATION, or the loop cannot close no matter how it looks. */
{
    const bad = await page.evaluate((D) => {
        const walk = (a, b, at, out) => {
            if (typeof a === 'number') {
                if (!(Math.abs(a - b) < 1e-9)) out.push(`${at}: ${a} vs ${b}`);
                return;
            }
            if (Array.isArray(a)) {
                if (!Array.isArray(b) || a.length !== b.length) { out.push(`${at}: length ${a?.length} vs ${b?.length}`); return; }
                a.forEach((v, i) => walk(v, b[i], `${at}[${i}]`, out));
                return;
            }
            if (a && typeof a === 'object') {
                for (const k of Object.keys(a)) walk(a[k], b?.[k], `${at}.${k}`, out);
                return;
            }
            if (a !== b) out.push(`${at}: ${a} vs ${b}`);
        };
        const s0 = window.__computeState(0), s1 = window.__computeState(D);
        const out = [];
        // t itself is expected to differ; everything else must not.
        walk({ ...s0, t: 0 }, { ...s1, t: 0 }, 'state', out);
        return out;
    }, DURATION);

    if (bad.length) fail(`state at t=0 and t=${DURATION} differ:\n        ` + bad.slice(0, 12).join('\n        '));
    say(`  ✓ gate 1  state at t=0 and t=${DURATION} identical to 1e-9`);
}

/* ── Gate 2: pixel identity ───────────────────────────────────────────────
 * State identity is necessary but not sufficient — a renderer can still read
 * something outside the state. Compare the actual painted pixels. */
{
    const hashAt = async (t) => {
        const b = await page.evaluate((tt) => {
            window.__setSize(2560, 1440);
            window.__renderFrame(tt);
            return window.__exportWebp(1);
        }, t);
        return createHash('sha256').update(b).digest('hex');
    };
    const a = await hashAt(0), b = await hashAt(DURATION);
    if (a !== b) fail(`frame 0 and frame ${DURATION} are not pixel-identical\n        ${a}\n        ${b}`);
    say(`  ✓ gate 2  frame 0 and frame ${DURATION} pixel-identical`);
}

/* ── Gate 3: no pop at the wrap ───────────────────────────────────────────
 * Measured at reduced size — the metric is relative, so resolution only costs
 * time.
 *
 * Ranked against the distribution of every in-loop frame step rather than
 * against the mean of one. A loop whose motion is uneven by design — a digit
 * rolling over, a busy beat and a calm one — has frame steps that are strongly
 * bimodal, so "1.2x the median" describes nothing. The question that matters is
 * whether the wrap step is an ORDINARY step for this loop. A real
 * discontinuity does not sit mid-distribution; it lands at or past the top of
 * it. */
{
    const stats = await page.evaluate(({ TOTAL, FPS }) => {
        const W = 640, H = 360;
        window.__setSize(W, H);
        const cv = document.getElementById('c');
        const g = cv.getContext('2d');
        const grab = (i) => { window.__renderFrame(i / FPS); return g.getImageData(0, 0, W, H).data; };
        const diff = (a, b) => {
            let s = 0;
            for (let i = 0; i < a.length; i += 4) s += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
            return s / (a.length / 4 * 3);
        };
        const deltas = [];
        let prev = grab(0);
        const first = prev;
        for (let i = 1; i < TOTAL; i++) { const cur = grab(i); deltas.push(diff(prev, cur)); prev = cur; }
        const wrap = diff(prev, first);           // last frame -> frame 0
        const sorted = [...deltas].sort((a, b) => a - b);
        const pc = (q) => sorted[Math.floor(q * (sorted.length - 1))];
        return {
            wrap, p50: pc(0.5), p95: pc(0.95), max: sorted[sorted.length - 1],
            rank: deltas.filter(d => d < wrap).length / deltas.length,
        };
    }, { TOTAL, FPS });

    say(`         wrap delta ${stats.wrap.toFixed(4)}  —  loop steps p50 ${stats.p50.toFixed(4)}  p95 ${stats.p95.toFixed(4)}  max ${stats.max.toFixed(4)}`);
    say(`         the wrap is a larger step than ${(stats.rank * 100).toFixed(0)}% of in-loop steps`);
    if (stats.wrap > stats.p95)
        fail(`visible pop at the wrap — frame ${TOTAL - 1}->0 moves ${stats.wrap.toFixed(4)}, ` +
             `past the 95th percentile of in-loop frame steps (${stats.p95.toFixed(4)})`);
    say('  ✓ gate 3  no pop at the loop wrap');
}

/* ── Gate 5: same density before and after ────────────────────────────────
 * Concept D only — see CONCEPTS.
 * The concept's load-bearing constraint. When the layer engages the panel must
 * not get emptier — same tile count, same total tile area, loaded and
 * resolved. It passes trivially while geometry is static, which is exactly why
 * it is asserted: it fails loudly the day a tile animates its own size. */
if (!CONCEPT.density) say('  –  gate 5  density — not applicable to this concept');
else {
    const d = await page.evaluate(({ loaded, resolved }) => {
        const m = (t) => {
            const s = window.__computeState(t);
            return { n: s.tiles.length, area: s.tiles.reduce((a, x) => a + x.w * x.h, 0) };
        };
        return { loaded: m(loaded), resolved: m(resolved) };
    }, PROBE);

    if (d.loaded.n !== d.resolved.n)
        fail(`tile count changes across the turn — ${d.loaded.n} at t=${PROBE.loaded}, ${d.resolved.n} at t=${PROBE.resolved}`);
    if (Math.abs(d.loaded.area - d.resolved.area) > 1e-6)
        fail(`total tile area changes across the turn — ${d.loaded.area} vs ${d.resolved.area}. ` +
             `The resolved panel must be exactly as dense as the loaded one.`);
    say(`  ✓ gate 5  same density at t=${PROBE.loaded} and t=${PROBE.resolved} — ${d.loaded.n} tiles, ${Math.round(d.loaded.area)} px² of tile`);
}

/* ── Gate 6: it still reads at 25% ────────────────────────────────────────
 * At small sizes the individual tiles are gone and the amber-to-green shift is
 * the entire message. Measured as mean (R-G) across the frame at quarter size:
 * amber pushes it up, flow pulls it down. */
if (!(CONCEPT.warmthDrop > 0)) say('  –  gate 6  warmth shift — not applicable to this concept');
else {
    const warmth = await page.evaluate(({ loaded, resolved }) => {
        const W = 640, H = 360;
        window.__setSize(W, H);
        const g = document.getElementById('c').getContext('2d');
        const at = (t) => {
            window.__renderFrame(t);
            const d = g.getImageData(0, 0, W, H).data;
            let s = 0;
            for (let i = 0; i < d.length; i += 4) s += d[i] - d[i + 1];
            return s / (d.length / 4);
        };
        return { loaded: at(loaded), resolved: at(resolved) };
    }, PROBE);

    const drop = warmth.loaded - warmth.resolved;
    say(`         warmth ${warmth.loaded.toFixed(3)} loaded -> ${warmth.resolved.toFixed(3)} resolved  (drop ${drop.toFixed(3)})`);
    if (!(drop > CONCEPT.warmthDrop))
        fail(`the amber-to-green shift does not read at 25% — mean (R-G) only moves ${drop.toFixed(3)}. ` +
             `That shift is the whole message at small sizes.`);
    say('  ✓ gate 6  amber-to-green shift reads at quarter size');
}

/* ── Gate 7: the master's own assertions ─────────────────────────────────
 * Anything a concept must prove about itself that is not visible from out
 * here — a channel that never widens, a queue that never goes negative, a
 * density ratio that has to read. A master opts in by exposing __assert();
 * one that does not is not silently passed, it is reported as having none. */
{
    const has = await page.evaluate(() => typeof window.__assert === 'function');
    if (!has) say('  –  gate 7  self-assertions — this master declares none');
    else {
        const r = await page.evaluate(() => window.__assert());
        for (const l of r.info || []) say(`         ${l}`);
        if ((r.fail || []).length) fail(`the master's own assertions:\n        ` + r.fail.join('\n        '));
        say('  ✓ gate 7  the master\'s own assertions hold');
    }
}

if (VERIFY_ONLY) { await browser.close(); say('\n  verify only — nothing encoded\n'); process.exit(0); }

/* ── Render + encode ──────────────────────────────────────────────────────── */
fs.mkdirSync(SHIP, { recursive: true });
const results = [];

for (const size of SIZES) {
    const dir = path.join(WORK, size.tag);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    await page.setViewportSize({ width: size.w, height: size.h });
    await page.evaluate(({ w, h }) => window.__setSize(w, h), size);
    const canvas = page.locator('#c');

    process.stdout.write(`  ${size.tag}  rendering `);
    for (let i = 0; i < TOTAL; i++) {
        await page.evaluate(({ i, FPS }) => window.__renderFrame(i / FPS), { i, FPS });
        await canvas.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.png') });
        if (i % 60 === 0) process.stdout.write('.');
    }
    say(` ${TOTAL} frames`);

    // The poster is frame 0 of the 1080p pass, encoded in-page: this machine
    // has no ffmpeg webp encoder and no cwebp.
    if (size.tag === '1920') {
        const uri = await page.evaluate(() => { window.__renderFrame(0); return window.__exportWebp(0.92); });
        fs.writeFileSync(path.join(SHIP, 'hero-poster.webp'), Buffer.from(uri.split(',')[1], 'base64'));
    }

    const input = ['-framerate', String(FPS), '-start_number', '0', '-i', path.join(dir, '%05d.png')];
    const mp4 = size.ship ? path.join(SHIP, `hero-${size.tag}.mp4`) : path.join(HERE, CONCEPT.archive);

    // Single GOP: smallest for a background loop, and seeking is irrelevant here.
    //
    // CRF starts low on purpose. This content is hairlines on flat near-black,
    // which is where H.264 ringing shows worst, and it compresses so far under
    // the 2 MB budget that there is no reason to spend the headroom anywhere
    // else. The loop below still steps up if a change ever blows the budget.
    let crf = 14;
    for (; crf <= 34; crf += 2) {
        ffmpeg([...input,
            '-c:v', 'libx264', '-preset', 'veryslow', '-crf', String(crf),
            '-pix_fmt', 'yuv420p',
            '-x264-params', `keyint=${TOTAL}:min-keyint=${TOTAL}:scenecut=0`,
            '-movflags', '+faststart', '-an', mp4]);
        if (!size.ship || size.tag !== '1920') break;
        if (fs.statSync(mp4).size <= MP4_BUDGET) break;
        say(`         crf ${crf} -> ${(fs.statSync(mp4).size / 1048576).toFixed(2)} MB, over budget, stepping up`);
    }

    // The webm is an alternate source for the same <video>, so there is no
    // reason to ship one fatter than the mp4 beside it — a browser that picks
    // it would simply pay more for the same picture. Step VP9 up until it is
    // at most the mp4's size.
    if (size.ship) {
        const webm = path.join(SHIP, `hero-${size.tag}.webm`);
        const ceiling = fs.statSync(mp4).size;
        for (let q = 24; q <= 40; q += 4) {
            ffmpeg([...input,
                '-c:v', 'libvpx-vp9', '-crf', String(q), '-b:v', '0',
                '-row-mt', '1', '-cpu-used', '1', '-deadline', 'good',
                '-g', String(TOTAL), '-pix_fmt', 'yuv420p', '-an', webm]);
            if (fs.statSync(webm).size <= ceiling) break;
            say(`         webm crf ${q} -> ${(fs.statSync(webm).size / 1048576).toFixed(2)} MB, fatter than the mp4, stepping up`);
        }
    }

    results.push({ size, mp4, crf });
    fs.rmSync(dir, { recursive: true, force: true });
}

await browser.close();

/* ── Gate 4: size budget ──────────────────────────────────────────────────── */
const hero1080 = path.join(SHIP, 'hero-1920.mp4');
const bytes = fs.statSync(hero1080).size;
if (bytes > MP4_BUDGET) fail(`hero-1920.mp4 is ${(bytes / 1048576).toFixed(2)} MB, over the 2 MB budget`);
say(`  ✓ gate 4  hero-1920.mp4 ${(bytes / 1048576).toFixed(2)} MB, under budget`);

say('\n  delivered');
for (const f of fs.readdirSync(SHIP).sort()) {
    const s = fs.statSync(path.join(SHIP, f)).size;
    say(`    ${CONCEPT.ship}/${f.padEnd(22)} ${(s / 1024).toFixed(0).padStart(6)} KB`);
}
for (const r of results.filter(r => !r.size.ship)) {
    say(`    ${path.relative(REPO, r.mp4).padEnd(48)} ${(fs.statSync(r.mp4).size / 1024).toFixed(0).padStart(6)} KB  (archive)`);
}
say('');
