# Build brief — Vybd operating stack (React / R3F)

## Goal

A scroll-driven 3D narrative explaining the seven-stage operating stack, embedded
as a route or section in the Vybd site. Must be genuinely good on mobile — not a
desktop experience with a media query bolted on.

Reference for *craft level* (not visual style): theinternetcompany.one/branding.
Note that its impact comes from scroll timing, type animation, marquees and audio,
not from 3D. Match the craft, not the aesthetic.

## Non-goals

- No orbit controls or free camera. The camera is authored, not driven by the user.
- No physics, no character models, no gaussian splats.
- No hosted Spline embed. If a GLB is used it is loaded and controlled by us.
- Do not add a CMS. Content is a typed TS file.

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Whatever the Vybd site already uses (Next.js assumed) | Do NOT introduce a second framework |
| 3D | `three` + `@react-three/fiber` v9 | Mutate via refs, never setState per frame |
| Helpers | `@react-three/drei` | `PerformanceMonitor`, `AdaptiveDpr`, `Instances`, `Html`, `useGLTF` |
| Post FX | `@react-three/postprocessing` | Desktop only. Bloom + subtle vignette. Nothing else. |
| Scroll/anim | `gsap` + `ScrollTrigger` | Free incl. all plugins since 2025 |
| Smooth scroll | `lenis` | `autoRaf:false`, driven from `gsap.ticker`, `lenis.on('scroll', ScrollTrigger.update)` |
| State | `zustand` | Shared 3D state. Not React context, not props drilling. |

Stay on WebGL2. Structure the renderer setup so WebGPU can be swapped in later
(three r171+ has a production WebGPU renderer, TSL compiles to both), but do not
adopt it in v1 — R3F's WebGPU support is still stabilising and this scene does not
need compute shaders.

## Architecture

```
/stack
  StackScene.tsx        # <Canvas>, renderer config, perf monitors
  useStackTimeline.ts   # GSAP master timeline -> zustand store
  useStackStore.ts      # zustand: progress + per-layer 0..1 values
  layers/
    Sources.tsx         # 9 instanced blocks, chaos -> grid
    ContextLayer.tsx    # 3 bands + entity nodes
    AgentLayer.tsx      # plate + 5 worker units
    ApplicationLayer.tsx# plate + queue rows
    GovernanceLayer.tsx # slab + threshold gate
    ReviewLayer.tsx     # slab + proposal cards
    Packets.tsx         # instanced flow particles
  Annotations.tsx       # projected HTML labels (desktop only)
  Narrative.tsx         # the seven text panels
  content.ts            # ALL copy, typed. Single source of truth.
```

The timeline writes normalized 0..1 values into zustand. Layer components read
those values in `useFrame` and mutate refs. No component re-renders on scroll.

## Scene spec

Seven stages: `sources → context → agent → application → governance → review → loop`.
Layers accumulate — nothing is removed once introduced.

Geometry (units are scene units, W x H x D), stacked top to bottom:

| Layer | Object | Size | Y |
|---|---|---|---|
| Sources | 9 blocks | ~0.8 x 0.15 x 0.6 | 3.9 (grid), chaotic before |
| Context | 3 bands | 5.4 x 0.28 x 3.5 | 1.90 / 1.56 / 1.22 |
| Agent | plate + 5 units | plate 5.4 x 0.16 x 3.5; units 0.62³ | 0.35 / 0.61 |
| Application | plate + 10 rows | plate 5.4 x 0.16 x 3.5 | -1.30 / -1.18 |
| Governance | slab + gate plane | 5.4 x 0.42 x 3.5 | -2.90 |
| Review | slab + 3 cards | 5.4 x 0.42 x 3.5 | -4.60 |

Colors: sources `#B4B2A9`, context `#5DCAA5`, agent `#61B2E4`,
application `#E8D48A`, governance `#AFA9EC`, review `#F0997B`.
Page ink `#0D1014`, rule `#232B35`, text `#E9EBEE` / `#98A1AD` / `#5D6773`.

### Required micro-moments

Each layer must *demonstrate* its job, not just appear:

1. **Sources → context:** blocks rotate flat and snap from chaotic positions into a
   3x3 grid as the context layer rises. This is the most important moment on the
   page. Time it so alignment completes before the slab finishes rising.
2. **Agent:** five worker units pulse in sequence — separate workers, separate jobs.
3. **Application:** ten queue rows stagger in on the plate surface.
4. **Governance:** a packet descends, hits the gate, turns coral and dies while the
   gate flashes. Loops slowly.
5. **Review:** a card lifts off the queue and fires upward out of frame.
6. **Loop:** camera pulls back, coral packets stream from bottom back up to sources.

## Mobile

This is the part that decides whether the build succeeds. Mobile is a **different
choreography**, not a scaled one.

- Canvas is sticky at ~58vh pinned to the top; text panels scroll beneath it in a
  single column. Do not overlay text on the canvas.
- Author a **separate camera track** for portrait: tighter framing, less orbit, more
  vertical dolly. Use `gsap.matchMedia()` for the two tracks.
- Annotations off below 900px. The metrics strip carries that information instead.
- Packet count: 34 desktop, 12 mobile. Instanced either way.
- `dpr={[1, 2]}` with `PerformanceMonitor` adjusting between; `antialias: false` on
  mobile; `powerPreference: 'high-performance'`.
- No postprocessing on mobile at all.
- Test on a real mid-range Android, not the iOS simulator. If it can't hold 45fps,
  cut geometry, not resolution.

## Performance rules

- Instance anything appearing more than 3 times (`<Instances>` from drei).
- `PerformanceMonitor` with `onDecline` reducing dpr, then packet count, then
  disabling post FX. Define a floor via `onFallback`.
- Only render while the section is within one viewport of the screen. Warm the
  scene — compile shaders, upload textures — before it first becomes visible, so
  there is no hitch on first scroll.
- Memoize geometries and materials with `useMemo`. A parent re-render must not
  recreate them.
- If a GLB is ever introduced: Draco compression, `useGLTF.preload`.
- Budget: < 250KB JS for the 3D bundle (gzipped, excluding three), 60fps desktop,
  45fps mobile floor.

## Accessibility and fallback

- `prefers-reduced-motion`: no scrub, no packets, no auto-motion. Show each layer
  statically as its section enters. The content must remain fully readable.
- If WebGL is unavailable or the perf floor is breached, render a static SVG
  version of the stack in place of the canvas. The page must work with the
  canvas removed entirely.
- All narrative copy lives in real DOM text, never in the canvas. It must be
  selectable, translatable, and indexable.
- Section rail is real `<button>`s with labels and visible focus.

## Content

All copy in `content.ts`, typed as:

```ts
type Stage = {
  id: string; index: string; accent: string;
  headline: string; lede: string;
  metrics: string[];          // rendered as a mono strip, joined by ·
  points: { label: string; body: string }[];
  annotations: { text: string; at: [number, number, number]; side: 'left'|'right' }[];
}
```

Copy is in the existing prototype (`vybd-stack-v3.html`) — port it verbatim, then
flag the agent-layer bullets for review. Those are placeholders and need Ashwin's
actual agent roster.

## Build order

Work in this sequence, stopping after each for review:

1. Scaffold: Canvas, renderer config, zustand store, seven empty sections, Lenis +
   ScrollTrigger wired, camera moving between seven authored shots. No geometry.
2. Layers as plain boxes appearing on cue. Verify the accumulation reads correctly.
3. The sources chaos→grid moment. Get this one right before anything else.
4. Remaining micro-moments, one component at a time.
5. Annotations and metrics strips.
6. Mobile camera track and layout.
7. Performance pass, reduced-motion path, static fallback.

## Acceptance criteria

- Scrolls at 60fps desktop / 45fps mobile on mid-range hardware.
- Reads correctly with JS animation disabled (reduced-motion path).
- No layout shift when the canvas mounts.
- Copy is editable in one file without touching scene code.
- Lighthouse performance score does not drop more than 5 points versus the page
  without the section.
