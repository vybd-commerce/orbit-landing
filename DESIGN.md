---
name: Vybd
description: Borderless. Supply chain intelligence for consumer brands.
colors:
  navy: "#0F1B33"
  navy-raised: "#18264A"
  ink: "#111827"
  mint: "#1BB59B"
  mint-hover: "#17A088"
  mint-deep: "#13987F"
  mint-text: "#0E7C68"
  mint-light: "#5FD6BF"
  mint-wash: "#E8F7F3"
  body: "#4B5563"
  mute: "#6B7280"
  line: "#E5E7EB"
  surface: "#F3F4F6"
  canvas: "#FFFFFF"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(52px, 8.4vw, 96px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(40px, 5.2vw, 72px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 56px)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(18px, 1.7vw, 22px)"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
  data:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  chip: "6px"
  card-sm: "12px"
  card: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 5vw, 48px)"
  section: "clamp(72px, 8vw, 132px)"
  container: "1120px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "50px"
  button-mint:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "50px"
  button-mint-hover:
    backgroundColor: "{colors.mint-hover}"
  button-nav:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "36px"
  card-dark:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "36px"
---

# Design System: Vybd

## Overview

**Creative North Star: "The Open Ledger"**

Vybd shows where every dollar goes. The system is calm white and navy, with mint reserved for whatever the visitor should notice: the maker's share, the action to take, the line that changed. Editorial serif headlines carry the voice, a clean sans carries the facts, and small illustrated objects (parcels, post labels, receipts, boards) make an abstract supply chain feel like something you can hold.

Density is generous on marketing surfaces: one idea per section, large type, plenty of white space. Sections alternate between white, a light gray surface and full navy, one canvas per section.

**Key Characteristics:**
- Navy and mint on white; mint is an accent, not a background color for long text.
- Instrument Serif for headlines, with an italic mint phrase as the emphasis ("Sold in the *US.*").
- DM Sans for everything a visitor reads or clicks.
- Pill buttons, large rounded cards, hairline dividers.
- Illustrative numbers are always labelled as illustrative.

## Colors

A two-color brand (navy and mint) on white, with cool grays for text and surfaces.

### Primary
- **Vybd Navy** (navy): primary buttons, dark sections, headline ink on light pages, the footer.
- **Vybd Mint** (mint): fills (bars, buttons on dark, status dots, progress), and text on navy only.
- **Ledger Mint** (mint-text): mint used as text on white or light-gray backgrounds: eyebrows, links, italic accents. Passes 4.5:1 on white.

### Neutral
- **Ink** (ink): headings and strong text on white.
- **Body Gray** (body): paragraph text.
- **Mute Gray** (mute): secondary text and captions. Do not go lighter for anything a visitor needs to read.
- **Hairline** (line): dividers and card borders.
- **Surface** (surface): gray section and card backgrounds.

### Named Rules
**The Mint Ink Rule.** Mint text on a light background is always Ledger Mint (#0E7C68). Bright mint (#1BB59B) as text is allowed only on navy.

**The One Action Rule.** One mint or navy filled button per view is the main action; everything else is an outline pill or a text link.

## Typography

**Display Font:** Instrument Serif (with Georgia)
**Body Font:** DM Sans (with system-ui)
**Data Font:** DM Mono, for figures, codes and board labels only

**Character:** A literary serif for the argument, a plain grotesque for the facts.

### Hierarchy
- **Display** (400, clamp(52px, 8.4vw, 96px), 0.98): one per page, in the hero.
- **Headline** (400, clamp(40px, 5.2vw, 72px), 1.02): section headings; the second phrase may be italic mint.
- **Title** (600 DM Sans, up to 56px): product names on the home tiles ("Vybd Supply Chain").
- **Lead** (400, clamp(18px, 1.7vw, 22px), 1.45): the paragraph under a heading, max ~620px.
- **Body** (400, 17px, 1.47): running text, 65 to 75 characters a line.
- **Label** (600, 14px): eyebrows and small headings.
- **Data** (500 DM Mono, 11px minimum, tracked caps): board and card labels.

### Named Rules
**The 11px Floor.** No text a visitor reads or taps is smaller than 11px, including mono labels.

## Layout

Content sits in a 1120px container with a fluid gutter (clamp(20px, 5vw, 48px)). Section rhythm is clamp(72px, 8vw, 132px). Headings center in story sections and left-align in feature sections. Below 760px, grids collapse to one column and nav links fold into the menu.

The header is a 56px sticky bar, white at 78% with a blur, the same on every page: logo, global links, language, one action ("Book a call").

## Elevation & Depth

Mostly flat. Depth comes from tonal layers (white on gray, gray on white, navy blocks) and from the illustrated objects, which carry long soft shadows tinted navy.

### Shadow Vocabulary
- **Object lift** (`box-shadow: 0 30px 60px -44px rgba(15,27,51,.35)`): parcels, labels and floating cards.
- **Card hover** (`box-shadow: 0 26px 50px -30px rgba(15,27,51,.45)`): interactive cards on hover.
- **Hairline ring** (`box-shadow: inset 0 0 0 1px rgba(17,24,39,.08)`): quiet outlines on white.

## Shapes

Round and soft: pills for every button and chip, 28px corners for large cards, 12px for small cards and inputs, circles for status dots and icon buttons.

## Components

### Buttons
- **Shape:** full pill (999px).
- **Primary:** navy fill, white text, 50px tall (44px in the header).
- **On dark:** mint fill with navy text.
- **Secondary:** outline pill (1px inset navy, or white at 30% on dark).
- **Text link:** ink text with a trailing arrow that moves 4px on hover.

### Cards / Containers
- **Corner Style:** 28px (large), 12px (small).
- **Background:** surface gray or navy.
- **Border:** none, or a 1px hairline on white.
- **Internal Padding:** 36px.

### Navigation
- One global nav on every page: the logo with "Borderless" beside it, then Where are you today?, How it works, Pricing, Enterprise, Case studies, Partners, then language and "Book a call". `NAV_LINKS` (src/home/data/nav.ts) and `GLOBAL_NAV` (src/pages/redesign/chrome.tsx) hold the same list.
- Links are 14px body gray, ink on hover, with the current page in ink.
- Mobile: a menu button opens a full-width list with the same links and the action.

### Logo lockup
- The folded V mark plus "ybd" in Instrument Serif; under it, "Borderless" in DM Sans, letterspaced, in mint (Ledger Mint on light).
- In the header: the mark and "Vybd", then a hairline divider and "BORDERLESS" in 11px DM Sans, letterspaced, Ledger Mint (`.lg-tag`). Hidden below 400px.

## Do's and Don'ts

### Do:
- **Do** use Ledger Mint (#0E7C68) for mint text on white or gray.
- **Do** send every "talk to us" action to /book. The header and generic closing calls say "Book a call"; a CTA for one offer may name it ("Talk about US Scale", "Plan my launch") and carries its route (`/book?for=drop|launch|scale|enterprise|partner`).
- **Do** keep illustrative figures labelled as illustrative.

### Don't:
- **Don't** use link blue (#0066cc); links are ink or Ledger Mint.
- **Don't** set functional text below 11px.
- **Don't** give a page its own top navigation; page sections go in a sub-nav under the global one.
