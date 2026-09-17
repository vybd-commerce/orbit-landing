# Vybd landing page rebuild: implementation brief

## Context

Vybd builds AI-native operating systems for consumer brands scaling from $10M to $100M. Most brands add headcount and point tools at every growth stage. Vybd installs workflows that absorb the volume instead, delivered as a system the client's team runs or run by Vybd's operators.

This brief restructures the existing landing page around a single argument: **between $10M and $100M, your people become the integration layer between your tools, and that is what forces you to triple your ops headcount.** Every section either sets up that argument, proves it, or resolves it.

The centrepiece is a new interactive chart component that lets a visitor drag revenue from $10M to $100M and watch two operating cost curves diverge. Build that first and build it well. It is the page.

---

## Step 0: audit before writing anything

Do not assume file paths. Start by reading the repo and reporting back:

- Framework version, router (App vs Pages), styling setup, and existing component conventions
- The current hero component: file path, props, layout structure, typography scale, spacing tokens, and how its CTA is wired
- Existing section components and how they compose into the page
- Whether an animation library, chart library, or icon set is already installed
- How Plausible is initialised and whether a custom event helper already exists
- Existing colour and type tokens (Tailwind config or CSS variables)

Then propose a file plan before implementing. Do not install new dependencies without flagging them first.

---

## Hard constraints

1. **Keep the existing hero.** Layout, visual treatment, and animation stay as they are. Only the copy strings change, and only where specified below. Do not restyle it, do not swap the CTA component, do not "improve" it.
2. **No em dashes anywhere in copy.** Use commas, colons, or full stops. This applies to every string you write.
3. **Sentence case for all headings.** No Title Case, no all caps.
4. **Reuse existing tokens.** Every colour, font size, and spacing value must come from the existing config. No one-off hex values, no arbitrary Tailwind values unless the token genuinely does not exist, in which case add it to the config properly.
5. **No new heavy dependencies.** The chart is two polylines and a slider. Hand-roll it in SVG. Do not install Recharts, Chart.js, D3, or Framer Motion for this. If you believe a dependency is genuinely necessary, stop and make the case first.
6. **Quality floor, unannounced.** Responsive to 360px, visible keyboard focus on every interactive element, `prefers-reduced-motion` respected, semantic headings in order.

---

## Section 1: Hero (copy changes only)

Replace the headline, subhead, and qualifier. Leave everything else untouched.

- **Headline:** Scale to $100M without scaling your ops team.
- **Subhead:** Between $10M and $100M, most consumer brands triple their operations headcount because their people become the integration layer between a dozen tools. We build the operating systems that absorb that work, then train your team to run them or run them for you.
- **Qualifier** (small, muted, above the headline or directly under the CTA depending on which the existing layout supports without restructuring): For consumer brands between $10M and $100M.
- **Primary CTA:** Book an operations working session
- **Secondary CTA** (only if one already exists, do not add one): See how the system works, anchoring to the operating functions section.

Keep the CTA count at one primary. If the current hero has multiple competing CTAs, collapse to one and tell me what you removed.

---

## Section 2: The cost curve (new, highest priority)

This sits immediately below the hero and is the first scroll payoff.

### Component: `OpsCostCurve`

**Layout, top to bottom:**

1. Section heading: `Two ways to get to $100M.`
2. Sub-line, muted, one sentence: `Drag to see what operations costs at each stage of growth.`
3. Revenue slider, full width, labelled, with a live readout showing the current value formatted as `$50M`
4. A row of three metric tiles, responsive grid, `minmax(160px, 1fr)`:
   - `Hire and bolt on` → `19 people`
   - `Build native` → `9 people`
   - `Annual difference` → `$1.0M`
5. A custom HTML legend above the chart. Small squares plus label, not dots.
6. The SVG chart, roughly 280px tall on desktop, `viewBox` based so it scales.
7. A small muted text link below: `How we calculated this` → opens a disclosure panel or modal with the assumptions. Do not skip this. The numbers are the credibility of the whole page and an unsourced chart reads as marketing.

### The model

Put these in a single exported constants object so they are tunable in one place without touching component logic:

```ts
export const OPS_MODEL = {
  baselineRevenue: 10,        // $M
  baselineHeadcount: 4,       // ops FTEs at baseline, both paths
  conventionalSlope: 0.3333,  // additional FTEs per $1M of revenue
  nativeLogCoefficient: 9,    // FTEs added per 10x revenue
  fullyLoadedCost: 95_000,    // USD per ops FTE per year
} as const;
```

Derivation:

```
conventional(rev) = baselineHeadcount + (rev - baselineRevenue) * conventionalSlope
native(rev)       = baselineHeadcount + nativeLogCoefficient * log10(rev / baselineRevenue)
annualDelta(rev)  = (conventional(rev) - native(rev)) * fullyLoadedCost
```

At $10M both paths sit at 4 people. At $100M conventional reaches 34 and native reaches 13. That is the thesis stated mathematically: **conventional ops scales linearly with revenue, native ops scales logarithmically.** Say exactly that in the assumptions panel.

Assumptions panel content:

> Ops headcount covers demand planning, inventory, order and fulfilment operations, item data, and channel administration. It excludes marketing, finance, and design. Conventional scaling assumes roughly one additional ops hire per $3M of incremental revenue, which is the pattern we see across brands in this band. Native scaling assumes each new workflow absorbs volume rather than adding a person, so headcount grows with the log of revenue rather than in line with it. Fully loaded cost per ops FTE is set at $95,000 including benefits, tooling, and management overhead. Adjust these for your own numbers on a working session.

### Interaction

- Slider: `min=10`, `max=100`, `step=5`, default `50`. Native `<input type="range">`, styled, not a custom drag implementation.
- Values update on `input`, not `change`, so the chart moves live under the thumb.
- **Round every displayed number.** Headcount to integers via `Math.round`. Dollar delta to one decimal in millions via `toFixed(1)`.
- A vertical marker line on the chart tracks the slider position, with a filled dot on each curve at that x, each dot ringed 2px in the surface colour so it reads clearly over the gridlines.
- Curve styling: conventional is a solid 2px line, native is a dashed 2px line. Both also differ in colour, but the dash pattern means the chart still works in greyscale and for colourblind visitors. Show both the colour swatch and the dash pattern in the legend.
- Axes: x labelled `$10M` through `$100M`, y labelled `ops headcount`, both in muted text at 11px minimum. Horizontal gridlines only, hairline weight. No vertical gridlines.
- Animate the curve draw once on scroll into view, then never again. Skip entirely under `prefers-reduced-motion`.

### Mobile

Below the `sm` breakpoint, replace the slider with four stepped buttons: `$10M`, `$25M`, `$50M`, `$100M`. Same component, same state, different control. Metric tiles stack to two columns. Chart drops to 220px tall.

### Accessibility

- Slider needs a real `<label>`, plus `aria-valuetext` reading like `50 million dollars revenue, 19 ops people conventional, 9 native`
- SVG gets `role="img"` and an `aria-label` summarising the endpoint comparison
- A visually hidden table of the underlying data points for screen readers

### Tracking

Fire a Plausible custom event `ops_curve_interacted` on first interaction only, with the final revenue value as a prop. Someone who drags this slider is qualifying themselves. Do not fire on every input event, debounce and send once per session.

---

## Section 3: Your people are the integration layer (new)

Section heading: `Your people are the integration layer.`

Intro line: `The tools are not the problem. The gaps between them are, and right now a person is filling every one.`

Then three or four vignettes. **Do not use cards.** Cards flatten specificity into slogans. Use a left-aligned list, each item with a bold trigger line and one sentence of detail below it, generous vertical rhythm, a hairline rule between items.

Copy:

- **The Monday demand meeting runs on a spreadsheet someone rebuilds by hand.**
  Three systems hold the inputs. One person reconciles them every week, and the meeting is only as good as how much time they had.
- **The chargeback shows up ninety days after the shipment.**
  By the time a deduction surfaces in the recon, the paperwork that would have disputed it is scattered across an inbox, a portal, and a 3PL export.
- **The wholesale launch waits on product copy.**
  Item data lives in four places and none of them agree. Every new channel means someone retypes the catalogue.
- **The answer to "how much did we make on that SKU" takes two days.**
  Not because it is hard, but because nobody owns the join between the ad platform, the order data, and landed cost.

If the repo has real client detail that makes any of these more specific, use it. Specificity is the whole point of this section.

---

## Section 4: Operating functions (adapt existing)

The accordion of six operating functions already exists. Keep the component and its agent chips. Two changes:

1. **Default the first row open on mount.** A closed accordion reads as a menu and gets skipped. An open one teaches the pattern without requiring a click.
2. **Each panel gets three labelled parts**, in this order: what the workflow does, what it replaces, and a rate metric. If the current panels only have prose, restructure them into these three slots. Flag any panel where the rate metric is missing rather than inventing one.

Section heading: `Six functions, built as systems.`

---

## Section 5: How it runs (new)

This is where the train-or-run message lives. It is a ladder, not a fork. A fork creates decision paralysis on a homepage. A ladder creates a sense of inevitability and a natural expansion path.

Horizontal three-step layout on desktop, stacked on mobile. Numbered markers are appropriate here because this genuinely is a sequence.

Section heading: `We run it, then you do.`

1. **We run it.** Weeks 1 to 12. Our operators run the workflows while your team watches. You get output from day one and nobody has to learn anything yet.
2. **We run it together.** Your team takes primary on the routine path. We cover the exceptions and the edge cases, and we document as we go.
3. **You run it.** The system is yours. We maintain it, tune it, and add the next workflow when you are ready.

Below the ladder, one muted line: `Every engagement starts at step one. How fast you move through it is your call.`

---

## Section 6: Proof (adapt existing)

Bayangrom case study. Framing line already agreed: `One brand, three workflows, ninety days.`

Rate-based metrics only. No vanity numbers, no percentages without a denominator. Pull whatever is already in the repo. If there is a second case study that is weak, remove it from the page entirely rather than padding. One strong proof point beats two mediocre ones.

**Remove any logo wall with fewer than six logos.** Two logos under a "trusted by" heading reads as thin and actively costs credibility.

---

## Section 7: Close (adapt existing)

Repeat the hero's primary CTA. Nothing new, nothing competing.

Add three short bullets under it on what actually happens in the working session, which lowers the barrier to booking:

- We map your current ops workflows and where the handoffs break
- We size the headcount curve against your actual revenue plan
- You leave with a written diagnosis whether or not you work with us

Nav caps at four items. If it currently has more, cut to four and tell me what you removed.

---

## Order of work

Commit in this sequence so each step is reviewable on its own:

1. Audit and file plan, no code
2. `OpsCostCurve` component built in isolation with the model, tested at multiple revenue values, both breakpoints
3. Hero copy swap
4. Curve section wired into the page below the hero
5. Integration layer section
6. Accordion adaptations
7. How it runs ladder
8. Proof and close cleanup, logo wall and nav pruning

---

## Acceptance checklist

- [ ] Hero visual treatment is byte-for-byte unchanged apart from copy strings
- [ ] Zero em dashes in any copy string across the whole page
- [ ] No new runtime dependencies added
- [ ] Curve renders correctly at 360px, 768px, and 1440px
- [ ] Slider works with keyboard alone, arrow keys move it, focus is visible
- [ ] Mobile stepped buttons produce identical values to the equivalent slider positions
- [ ] Every displayed number is explicitly rounded, no floating point artifacts
- [ ] Chart is legible in greyscale
- [ ] Assumptions panel is reachable and its content matches `OPS_MODEL`
- [ ] `prefers-reduced-motion` disables the curve draw animation
- [ ] Lighthouse accessibility score does not regress from current
- [ ] `ops_curve_interacted` fires once per session, not per input event

---

## Non-goals

Do not redesign the hero. Do not introduce a new colour or type system. Do not add testimonials, an FAQ, a pricing table, or a blog feed. Do not add scroll-jacking, parallax, or a page-load animation sequence. Do not write new case study content. If a section's source content does not exist in the repo, stub it clearly and flag it rather than generating plausible-sounding filler.
