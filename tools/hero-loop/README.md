# Hero loops — `/consulting`

Silent, seamlessly looping background video for the `/consulting` hero. Three concepts live
here. None is wired into the page yet — nothing in `src/` references `public/media/`.

| Concept | Master | Ships to | Length |
|---|---|---|---|
| **One Order, End to End** — one order traced through seven supply-chain stations, with the three handoffs that stay human marked in amber | `one-order.html` | `public/media/consulting-hero/` | 8.000s |
| **The Control Room** — a dense operational instrument panel that gets resolved, not simplified | `control-room.html` | `public/media/consulting-hero-d/` | 9.000s |
| **The Load** — the same chain and the same headcount carrying several times the throughput, at the same channel width | `the-load.html` | `public/media/consulting-hero-load/` | 9.000s |

The `.html` file is the master in both cases. Every future revision starts from it, never
from the mp4.

## Re-rendering

```bash
npm i                                              # playwright is a devDependency
npx playwright install chromium                    # once, if the browser build is missing

node tools/hero-loop/render.mjs                    # one-order: verify, render, encode
node tools/hero-loop/render.mjs --verify           # gates only, ~30s, no encode

node tools/hero-loop/render.mjs control-room       # the control room
node tools/hero-loop/render.mjs control-room --verify

node tools/hero-loop/render.mjs the-load           # the load
node tools/hero-loop/render.mjs the-load --verify
```

The 2560×1440 master mp4 stays in this directory (`hero-master-2560.mp4`,
`hero-d-master-2560.mp4`, `hero-load-master-2560.mp4`) and is not shipped.

Use `--verify` while iterating on an animation — it runs the loop-closure gates in well
under a minute without paying for the encode.

## The gates

`render.mjs` proves the loop closes rather than trusting it. Gates 5 and 6 belong to The
Control Room and The Load; they are skipped, not silently passed, for a concept that declares
no use for them. Gates 5 and 6 measure a loaded moment and a resolved one, which do not fall
at the same time in every concept — each names its own pair in `probe`.

| | Asserts |
|---|---|
| 1 | `__computeState(0)` and `__computeState(DURATION)` match field by field to 1e-9 |
| 2 | Frame 0 and frame DURATION are pixel-identical — a renderer can still read something outside the state |
| 3 | The wrap step is an ordinary frame step, ranked against the distribution of every in-loop step |
| 4 | The 1080p mp4 is under the concept's byte budget |
| 5 | Tile count and total tile area are identical loaded and resolved |
| 6 | The amber-to-green shift still reads at quarter size |
| 7 | The master's own `__assert()` holds — whatever a concept must prove about itself that is not visible from outside it |

Gate 3 is ranked against a distribution rather than compared to a mean. A loop whose motion
is uneven by design — a digit rolling over, a busy beat and a calm one — has frame steps that
are strongly bimodal, so "1.2× the median" describes nothing. A real discontinuity does not
sit mid-distribution; it lands at or past the top of it.

## How it works

All three animations are a pure function of time. `window.__renderFrame(t)` paints a complete
frame for any `t` in `0..DURATION` with no dependence on previous frames — no
`requestAnimationFrame`, no CSS animation, no accumulated state. `render.mjs` steps
Playwright through every frame and stitches with ffmpeg.

Do not screen-capture this in real time. It drops frames and will not loop cleanly.

All three masters expose the same contract, which is why one renderer drives all of them:

```js
window.__DURATION   window.__FPS
window.__setSize(w, h)     window.__renderFrame(t)
window.__computeState(t)   window.__exportWebp(q)   window.__ready
window.__assert()          // optional — gate 7
```

To inspect a single beat, open the master directly and call `__renderFrame(3.75)` from the
console. `__computeState(t)` returns the same frame as plain data.

**The last frame is never encoded.** Frame `DURATION * FPS` IS frame 0; including it produces
a duplicate-frame stutter at the wrap.

---

# One Order, End to End

## Why the loop closes

The order moves at a constant rate and the spawn period is exactly 8s, so the order sitting at
`u=0.12` in frame 0 is the same distance along as the *next* order at `t=8.000`. Everything
else is built to return to its frame-0 value:

- **Station resolves** are transient overlays drawn on top of static base geometry. They draw
  nothing at `p=0` and nothing at `p=1`, so a station always returns to exactly its base form.
- **Human markers** live 1.2s. The last one fires at CASH (6.600s) and is gone by 7.800s.
- **The heat trail** is the subtle one. A flat 2.5s trail *cannot* close an 8s loop: the last
  segment goes hot at 6.8s and would not cool until 9.3s. So the decay front accelerates across
  6.8 → 7.4s, clearing the tail. It is continuous at 6.8 because the sweep starts from the value
  the trail had already reached.

Gate 1 compares `__computeState(0)` against
`__computeState(8)` field by field to 1e-9. Gate 2 compares the actual painted pixels, since a
renderer can still read something outside the state. Gate 3 catches a pop that state identity
alone would miss.

## Tuning

Most things worth changing are constants near the top of the script block.

| Want to change | Touch |
|---|---|
| Colours | `C` |
| Station size | `STATION_W` / `STATION_H` — vignettes are drawn in normalised box coordinates, so they scale |
| Path shape | `pathY()`, `PATH_Y` |
| Element sizes | `LABEL_SIZE`, `ORDER_SIZE`, `QUEUE_SIZE`, `RING_R` |
| Trail length | `TRAIL`, `SWEEP_IN`, `SWEEP_OUT` |
| Station artwork | `BASE[name]` (at rest) and `RESOLVES[name]` (the 0.4s micro-animation) |

If you change `TRAIL` or the station cadence, re-run `--verify`. The loop closure is load-bearing
and the gates will tell you immediately if it breaks.

A new resolve must draw nothing at `p=0` and nothing at `p=1`, or it will pop.

## Deviations from its brief

Recorded so they are choices, not drift.

- **Palette.** The brief's eight hexes appear nowhere in the repo. These are the live
  `.lp-theme-dark` tokens from `src/pages/LandingPage.css:65-107`, with `--lp-outline` and
  `--lp-outline-variant` lifted from ~0.08/0.16 alpha to ~0.18/0.36. Those tokens are authored
  for small borders beside brighter content; composited flat across a whole frame of hairlines
  they measure 34–46 out of 255 and vanish. The lifted values give a 2× dormant-to-hot contrast.
- **Frame 0.** The brief asks for an order at 12% *and* one entering at the left edge. A single
  order on an 8s period cannot be in both places. Frame 0 shows the order at 12% plus a static,
  dimmed queue tick at the entry — the next order waiting.
- **Sizes.** The brief's literal 8px order, 6px ring and 10–11px labels were authored for a
  smaller canvas; at 2560 they disappear at playback size. Raised to 13 / 11 / 24, the smallest
  values that survive both 1280 playback and the brief's own "reads at 25%" check.
- **Stations** are 190×136 rather than "roughly 120×90", for the same reason.
- **Veo atmospheric plate** was dropped. It conflicts with the brief's own "no gradient washes"
  rule and would reintroduce banding risk on a flat near-black ground.

---

# The Control Room

A dense operational instrument panel that gets **resolved, not simplified**.

The central idea, and the thing that makes it different from every dashboard animation ever
made: when the layer engages, the panel does not get emptier or calmer or more minimal. It
stays exactly as dense. What changes is that the noise resolves into the small number of
things that genuinely need a person. Density is the honest picture of an operation. Emptiness
would be a lie.

Five zones — SOURCING, MANUFACTURING, WAREHOUSING, DISTRIBUTION, TRANSPORT — holding 61 tiles
of five kinds: sparkline, counter, status chip, bar row, gauge. One counter above them,
`OPEN EXCEPTIONS`, is the only number in the piece the viewer is meant to actually read.

## Beats

| Time | What happens |
|---|---|
| 0.000 | At rest and loaded. ~30% of tiles amber, sparklines jittering, the counter high. A working panel under load, not an empty shell. This frame is also the poster. |
| 0.0–3.2 | Load builds to ~45% amber, jitter amplitude rises, the counter climbs. |
| 3.2–4.6 | The layer engages. One 62px band of `lineHi` crosses the panel at a constant rate. No glow, no pulse, no leading edge. Each tile resolves on contact: amber → `flow`, jitter damps, 0.25s ease-out. |
| 4.6–6.4 | Same density, no whitespace gained. The counter falls and settles. Exactly three tiles stay amber — one each in SOURCING, DISTRIBUTION and TRANSPORT — their border lifts to `human` and a ring appears at the top-right corner. |
| 6.4–8.2 | Held. Three amber among fifty-eight resolved. |
| 8.2–9.000 | New work arrives at the edges and spreads, converging exactly on frame 0. |

That final beat is the loop's justification: the work never stops arriving. The layer does not
end the pressure, it absorbs it. Looping is therefore honest rather than a technical
compromise — the reset is the point.

## Why the loop closes

Every time-varying quantity is periodic in `t` with period exactly 9 — as arithmetic, not as
a modulo. Four mechanisms:

- **Tile load.** One onset time `b` per tile drives the whole story. `b <= 0` means the tile
  went amber during the *previous* loop's tail and is already amber at frame 0; `0 < b` means
  it arrives during the build; `b = Infinity` means it never goes amber this loop. A tile
  turns amber again at `b + 9`, which for the first group lands inside the tail beat, and at
  `t = 9` its amber age is exactly `-b` — its amber age at `t = 0`. See `amberAt()`.
- **Jitter.** Every harmonic in `wob()` is an integer multiple of the loop frequency, so both
  the value and its rate of change match at the ends. A per-frame RNG could never close the
  loop, which is why there isn't one.
- **The counter.** `exceptionsAt()` returns to exactly its frame-0 value, and the tail uses a
  smootherstep so its *rate* is zero at the wrap too — the number does not appear to jump the
  seam.
- **Transients.** The sweep band and the ring markers are absent at both ends by construction:
  `bump()` draws nothing at `age <= 0` and nothing at `age >= d`.

The tail onsets are deliberately scheduled to *complete* before the wrap rather than straddle
it. They would close either way, but finishing early leaves the seam free of residual motion
and gives the poster a frame where the amber has fully arrived.

## The three that stay human

`open` and `human` are the same amber on purpose. The argument is not that the layer
eliminates the amber — it is that the layer reduces it to the amber that should be there.

They get a ring marker: not a filled dot, not an alert triangle, not an exclamation mark.
Calm, not urgent. There are no people, silhouettes, avatars or figure glyphs anywhere.

## Tuning

Constants near the top of the script block.

| Want to change | Touch |
|---|---|
| Colours | `C` |
| Beat timings | `T_BUILD_END`, `T_SWEEP_IN`, `T_SWEEP_OUT`, `T_SETTLE`, `T_TAIL` |
| Transition speeds | `RISE`, `FALL`, `CONTACT` |
| How loaded it gets | the `nEarly` / `nBuild` fractions in `LOAD` |
| The counter's arc | `EX_LOW`, `EX_BASE`, `EX_PEAK` |
| Panel geometry | `PAD_X`, `ZONE_GAP`, `PANEL_TOP`, `PANEL_BOT`, `ROW_GAP`, `COL_GAP` |
| Tile mix and count | `ZONE_SPEC` |
| Element sizes | `LABEL_*`, `FIG_SIZE`, `HERO_FIG`, `CHIP`, `RING_R`, `SWEEP_W` |
| The optional breathe | `BREATHE` — off by default, see below |

Layout is generated once from a fixed seed and then frozen; geometry never varies with `t`.
That is what makes gate 5 true by construction. Changing anything in `ZONE_SPEC` reshuffles
the whole panel, including which tiles are the human ones.

## Deviations from its brief

- **Frame 0 has no dormant state.** The brief implies three tones — dormant, open, resolved.
  Two closes the loop and three does not: if unloaded tiles were dormant at frame 0 they would
  have to decay from resolved back to dormant inside the 0.8s tail, on top of everything else
  happening there. So `flow` green is the resting tone and amber is the exception, which also
  makes frame 0 read as a working panel rather than a cold one.
- **Sizes.** The brief's literal 9–10px labels, 6px ring, 6px chip and 40px band were authored
  for a smaller canvas. Scaled by ~1.7× to 17–24px / 11 / 11 / 62 — the smallest values that
  survive 1280 playback and the brief's own "reads at 25%" check.
- **The sweep band is 50% alpha,** not opaque. An opaque band briefly hides the tiles it is
  crossing, which reads as an object moving over the panel rather than a state change passing
  through it.
- **The breathe is off.** `BREATHE = 0`. At 1.015 it makes every snapped hairline crawl by a
  fraction of a pixel for nine seconds, which shimmers on flat near-black and costs real
  bitrate for motion nobody consciously sees. The curve has zero value *and* zero derivative
  at both ends, so enabling it does not break the wrap.
- **No denoise before encode.** The brief allows one. This content is synthetic and has no
  noise to remove; `hqdn3d` would only smear the hairlines the whole piece is made of. The mp4
  lands at 1.17 MB against a 2.5 MB budget, so there was nothing to buy.
- **Palette.** The brief's eight hexes, used literally — the opposite call from the one made
  for *One Order*, and deliberate. Note that `ground` `#0A0C0B` is not the live page surface
  `#0a0a0a` (`src/pages/LandingPage.css:68`). Nothing is wired up, so there is no seam today;
  resolve it before this ever goes behind the hero.

---

# Notes — both concepts

- The font is IBM Plex Mono 500, latin subset, base64-inlined into each master so the render
  is offline and deterministic. `fonts/` keeps the original woff2 for provenance. The site
  itself does not load IBM Plex Mono at all (`index.html` loads Inter); it exists only inside
  these render targets.
- The poster is written in-page via `canvas.toDataURL('image/webp')`. This machine has no
  ffmpeg webp encoder and no `cwebp`.
- mp4s use a single GOP (`keyint` = the whole loop). Smallest for a background loop, and
  seeking is irrelevant.
- H.264 CRF starts at 14. Hairlines on flat near-black are where ringing shows worst, and both
  concepts land under budget with headroom there is nothing else to spend. `render.mjs` steps
  CRF up automatically if a future change blows the budget.
- VP9 starts at CRF 24 and steps up until the webm is no fatter than the mp4 beside it. Both
  are sources for the same `<video>`; shipping a larger webm just means a browser that picks
  it pays more for the same picture.

---

# The Load

The same chain, the same headcount, several times the throughput.

Work arrives continuously from the left. Three constrictions hold it back and the backlog
stacks above the channel in amber while everything downstream starves. The context layer
engages, the constrictions open, the backlog drains, and the channel carries roughly four
times the volume — **at the same width, with the same structure**. Then more work arrives
and it strains again.

The channel never widens. If the fix looked like a bigger pipe the piece would be arguing
"buy more capacity", which is the opposite of the argument. Same width, more through it —
which is why gate 7 asserts the lane height rather than trusting it.

## Beats

| Time | What happens |
|---|---|
| 0.000 | At rest and under load. Three constrictions pinched, amber columns at 40% of full height, every gate already holding work back. This frame is also the poster. |
| 0.0–3.4 | Load builds. Arrival rate holds steady; throughput cannot keep up. Columns grow to full height and the chain thins out left to right — at 3.2s the five segments hold 20 / 18 / 16 / 12 / 8 units, against 58 / 58 / 61 / 64 / 43 at the payoff. |
| 3.4–4.4 | The layer engages. A plain colour state change over 0.25s, then the three ticks complete their descent, left to right, 0.3s apart. No flash, no burst. |
| 4.4–6.4 | The constrictions open — 0.5s ease-out each, staggered — and the columns drain into the channel, converting to green as they enter. |
| 6.4–7.8 | Full throughput. ~285 units in the channel against ~74 at 3.2, at the same channel width. |
| 7.8–9.000 | The constrictions pinch again under the new volume, small amber columns reform, and everything converges on frame 0. |

The last beat is the loop's justification and it is narratively true: more work keeps
arriving, and the chain absorbs more of it before it strains again.

## Why the loop closes

The accumulation is real — a queue that grows, holds and drains — and none of it is
simulated frame to frame. A free-running queue would never land back on frame 0 to 1e-9.

Everything is a **cumulative counter**. `N_j(t)` is the number of units that have passed the
start of span `j` by time `t`:

```
N_0 = A                                  arrivals
N_1 = A(t - 0.6)   - Q_1(t) + Q_1(0)     past the Sourcing/Manufacturing gate
N_2 = N_1(t - 1.2) - Q_2(t) + Q_2(0)     past Warehousing/Distribution
N_3 = N_2(t - 0.6) - Q_3(t) + Q_3(0)     past Distribution/Transport
```

Four consequences, and the loop rests on all of them:

- **Every counter gains exactly `M` across the period.** A shift is a whole number of grid
  cells — every travel time is an exact multiple of `DT = 1/600` — and `Q` is periodic, so
  the gain is `M` to the float, not to three decimal places.
- **`tau_j(n) = N_j^-1(n)` satisfies `tau_j(n + M) = tau_j(n) + 9` by construction.** The
  table covers one period; beyond it the index wraps and 9 is added. So unit `n` at time `t`
  sits exactly where unit `n+M` sits at `t+9`. The renderer draws positions, not identities,
  which is why frame 0 and frame 9 are pixel-identical rather than nearly so. The position
  subtracts the period from `t` rather than adding it to `tau`, so the arithmetic is the same
  arithmetic on both sides of the wrap.
- **Queue closure is free.** `Q_k(0) = Q_k(9)` because `Q` is authored as a periodic shape,
  and the gate's throughput is derived from it — never the other way round. Authoring a
  capacity and integrating `min(capacity, available)` would put a kink in the counters and
  buy nothing.
- **`M` is divisible by `TRACKS`,** so a unit lands in the same track on the other side of
  the wrap.

The queue shapes carry a deliberate non-zero slope through the wrap (`wrap` in `GATES`).
A queue standing still at frame 0 means every gate is passing everything it receives, and
the poster would show a chain with nothing wrong with it.

## The track count is not a styling choice

Units move `V / FPS` per frame and sit `TRACKS * V / rate` apart within a track, so the
per-frame step as a fraction of the track spacing is `rate / (TRACKS * FPS)` — **independent
of speed**. Past 0.5 a uniform stream is ambiguous and can read as drifting backwards, which
for a piece whose entire subject is throughput would be fatal. Four tracks hold the payoff
beat at 0.40 and keep the drain surge under 0.5. That relationship also fixes the ceiling on
`A_HI` and the floor on the drain duration.

## The three that stay human

Three amber rings sit on the context layer, one above each constriction, in every frame —
dormant and lit alike. They never change state. Their persistence through the turn is the
point: the layer absorbed the volume, not the judgment. No people, silhouettes, avatars or
figure glyphs anywhere.

## Tuning

Constants near the top of the script block.

| Want to change | Touch |
|---|---|
| Colours | `C` |
| How much work arrives | `A_LO` / `A_HI`, and the ramp times `UP0` / `UP1` / `DOWN0` |
| How hard a gate holds back | `GATES[k].qmax`, and `wrap` for the frame-0 slope |
| When a gate opens and how fast it drains | `GATES[k].open` / `drain` |
| When it pinches again | `GATES[k].rebuild` |
| Speed and density | `T_SEG` (travel time per segment — keep it a multiple of `DT`), `TRACKS` |
| Unit and lane sizes | `UW` / `UH` / `LANE` / `TRACK_PITCH` |
| Column shape | `COL_COLS` / `COL_GAP` / `COL_PITCH` |
| Vertical composition | `YC`, `Y_LAYER`, `TICK_DORMANT` |

Re-run `--verify` after any of it. `__assert()` reports the density ratio and the column
heights on every run, and fails if a gate's throughput goes negative — which is what
happens when three constrictions in series are each asked to take a bigger bite than the
one above them leaves available.

Gate 3 has the least headroom of the three closure gates here, because the wrap sits in a
busy beat — the channel is full and moving at t=9, so the wrap step is legitimately larger
than the congested beats it is ranked against. It currently lands at the 63rd percentile of
in-loop frame steps. Pushing the payoff later or the tail throttle lighter walks it up; past
the 95th it fails, and the fix is the schedule, not the gate.

## Deviations from its brief

Recorded so they are choices, not drift.

- **Palette.** The brief's eight hexes appear nowhere in the repo; these are the live
  `.lp-theme-dark` tokens, resolved exactly as `one-order.html` resolves them. Same reasoning,
  same lifted outline values.
- **Sizes.** The brief's 48px channel, 7×4 units and 10px labels were authored for a smaller
  canvas. At 2560 they vanish at playback size. Lane 118, units 18×10, labels 24 — the
  smallest values that survive 1280 playback and the brief's own "reads at 25%" check.
- **Frame 0 shows a full channel, not a thin far end.** The brief asks for both, and the
  arithmetic does not allow both: freight crosses the chain in 2.4s and the payoff beat runs
  to 7.8s, so the work in Transport at t=9 entered the chain at 6.6s, mid-payoff. The only
  frame 0 with an empty Transport is one whose payoff ended 2.4s earlier — which costs the
  hold the brief also asks for, and the hold is what makes the payoff register. The starved
  far end is delivered at 1.6–3.4s, where the brief asks for it too and where it carries the
  argument. Frame 0 instead shows a chain running full with the backlog already building,
  which is what "already struggling" looks like at a moment when nothing has given way yet.
- **The arrival rate returns to base across the tail** rather than continuing to climb
  through the wrap. The brief asks for both that and convergence on frame 0; convergence
  wins, since frame 0 shows work arriving at base rate. Value and slope both match at the
  wrap, so the entry is never seen to change gear.
- **The layer stands down with the re-pinch.** The brief does not mention it, but a layer
  that stayed lit could not return to a dormant frame 0. It goes quiet as the volume
  overtakes it — which is the same statement the reforming columns make.
- **The drain ends at 6.0/6.2/6.4 rather than 5.6.** A shorter drain means a higher surge
  rate, and the surge is capped by the strobe limit above. The payoff still holds 1.4s.
- **The density ratio is 3.8×** between t=3.2 and t=6.8, with ~295 units in the channel at
  peak. `__assert()` fails below 3.5×.
- **Veo atmospheric plate** was dropped, for the same reason as the other two concepts: it
  conflicts with the brief's own "no gradient washes" rule and reintroduces banding risk on
  a flat near-black ground.
