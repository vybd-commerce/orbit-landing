---
name: Vybd
description: Departures board. Every cost in the chain gets its own row.
colors:
  board: "#111316"
  cell: "#1d2026"
  cell-hi: "#262a31"
  flap: "#f2efe6"
  flap-dim: "#a9aca8"
  hall: "#e6e8eb"
  paper: "#f4f5f7"
  ink: "#111316"
  body: "#363b42"
  mute: "#575d66"
  line: "#c3c7cd"
  rent: "#f6c445"
  go: "#1bb59b"
  go-ink: "#0e7d6a"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(84px, 15vw, 232px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(40px, 5.4vw, 76px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  subheading:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(26px, 2.6vw, 36px)"
    fontWeight: 750
    lineHeight: 1.05
  lede:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.7vw, 23px)"
    fontWeight: 400
    lineHeight: 1.38
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 600
    letterSpacing: "0.06em"
rounded:
  cell: "2px"
  plate: "4px"
  sign: "6px"
  board: "8px"
spacing:
  cell-gap: "2px"
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(64px, 8vw, 120px)"
  wrap: "1240px"
components:
  plate-go:
    backgroundColor: "{colors.go}"
    textColor: "{colors.board}"
    rounded: "{rounded.plate}"
    height: "46px"
    padding: "0 20px"
  plate-ink:
    backgroundColor: "{colors.board}"
    textColor: "{colors.flap}"
    rounded: "{rounded.plate}"
    height: "46px"
    padding: "0 20px"
  flap-cell:
    backgroundColor: "{colors.cell}"
    textColor: "{colors.flap}"
    rounded: "{rounded.cell}"
  board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.flap}"
    rounded: "{rounded.board}"
---

# Design System: Vybd

## Overview

vybd.ai is built as a station departures board. Vybd's claim is that every cost between maker and customer should be visible, so the site sets costs as rows on a split-flap board. "The usual chain" and "With Vybd" are the same board in two states, and switching flips the rent rows to REMOVED one after another. Board-black panels sit on a cool concourse-gray hall, and everything else is signage: plain, condensed, legible from across a room.

Source: `src/home/styles/board.css`, `src/home/board/`. Pages on the system so far: `/` and `/askinkind`.

## Colors

### Primary
- **Board** `#111316`: board panels, the nav, dark bands, primary ink plates.
- **Flap** `#f2efe6`: characters on the board and text on dark grounds.

### Signal
- **Go** `#1bb59b`: the maker, Vybd, done and arrived states, and the main call-to-action plate. Use **go-ink** `#0e7d6a` for green text on the light hall.
- **Rent** `#f6c445`: rent, and things still pending or flagged.

### Neutral
- **Hall** `#e6e8eb` page ground; **paper** `#f4f5f7` for a quieter band; **line** `#c3c7cd` rules on the hall.
- Text on the hall: **ink**, **body** `#363b42`, **mute** `#575d66` (at least 4.5:1).
- Inside a board: **cell** `#1d2026` with **cell-hi** `#262a31` for the top half of each flap, and **flap-dim** `#a9aca8` for secondary text.

### Named Rules
- **Colour marks what changes.** Only yellow (rent) and green (maker, Vybd, done) carry colour. Everything else stays black, gray and off-white.
- **Two colorways, one board.** A before/after state keeps the same layout and swaps tone, never structure.

## Typography

Archivo variable (Google Fonts, `wdth 62–125`, `wght 100–900`) is the only family, and its width axis does the work:
- **Display / heading:** weight 800 at `font-stretch: 72–74%`, tight leading. Only the display line ends in a green period.
- **Flap characters:** weight 700 at 82% width, uppercase, sized from the cell width (`--cw * 1.18`).
- **Labels:** weight 600 at 85% width, uppercase with 0.06em tracking. Use them only for data labels inside boards and tables, never as a kicker above a heading.
- **Reading text:** 100% width, 17px body, 19–23px lede, measure ≤ 36ch for ledes and ≤ 62ch for long copy.
- Numbers are tabular everywhere.

## Layout

- 1240px wrap with a fluid gutter (16–40px). Sections run 64–120px vertically.
- Spreads are asymmetric two-column (5/7 or 4/8). A path section alternates copy left/right between dark and hall bands.
- Board rows sit on a cell grid: each column is N cells wide (`N × (cw + 2px)`), so header labels and rows line up. The cell width comes from the board's own width through container queries.
- On phones (≤640px), board rows split into two lines: the label across the top, then amount and status. Columns stack at ≤1060px.

## Elevation & Depth

None. There are no drop shadows or gradients. Depth comes only from stacking: each flap cell has a lighter top half and a 1px board-black split line across the middle. On the hall, a board gets a 1px black outline at most.

## Shapes

Small, square radii: 2px cells, 4px plates, 6px signs, 8px boards. Nothing is pill-shaped.

## Components

### Plates (buttons)
46px tall, 4px radius, weight 700 at 88% width.
- `go`: green with black text. The primary action.
- `ink`: black with off-white text. Primary on the hall.
- `line`: a 1.5px inset outline in currentColor. Secondary.
- Hover darkens or tints; focus is a 2px green outline.

### Flap (`src/home/board/Flap.tsx`)
Fixed-length cells. A Flap starts blank, flips in the first time it scrolls into view, and re-flips whenever its text changes. Characters settle left to right; pass `delay` to stagger rows top to bottom. The real text goes to screen readers once. Under reduced motion it renders static.

### Board / panel
Black, 8px radius, 14–22px padding.
- **Header strip:** an uppercase label with the bold value on the right, separated by a 1px `#2a2e35` rule.
- **Rows:** 1px `#22262c` rules between them.
- **Status:** a 7-cell Flap.
- **Scores:** 10 small cells lit flap-dim, or yellow when low.

### Navigation
- **Desktop:** a sticky black 58px strip with the logo, wayfinding links, a `line` plate for the essay and a `go` plate for booking, plus a separate notice strip.
- **Phones:** links collapse into a full-screen black menu set in 34px condensed type.

### Expanding rows
Long content opens in place: `<details>` rows with a "PART n" label, title and preview, and a drawn plus that turns to minus. No pop-ups.

## Do's and Don'ts

### Do
- Label illustrative numbers and example data as such, every time.
- Give each value a was/now pair when there is a before and after.
- Snap board content to whole cells.

### Don't
- Add a kicker or eyebrow above a heading. Put the audience in a line under the heading instead.
- Use colour for decoration, or give a third hue to anything.
- Use emoji or Unicode glyphs as icons. Draw them as SVG with one stroke weight.
- Use drop shadows, gradients or glass.
