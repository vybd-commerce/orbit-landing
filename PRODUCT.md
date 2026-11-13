# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two primary audiences, weighted equally (confirmed):
- **Makers outside the US ready to sell there.** Manufacturers and online sellers doing well at home, often in Asia or Europe, who want US customers without opening a US office. Their job: understand the US market, clear regulations and customs, and launch without hiring six separate vendors.
- **Brands already selling in the US who want it to cost less.** Growing brands that want inventory, purchasing, landed cost and partner performance under control, plus $50M+ CPG operators (/enterprise) running many lanes on NetSuite, SAP, Dynamics 365 or Odoo.

Secondary audiences: US market-entry service partners (customs brokers, freight, 3PLs, agencies) on /ecosystem, local representatives (/rainmaker), investors and press. Communities, companies and carriers reached through Ask In Kind (/askinkind).

## Product Purpose
Vybd brings the cost of getting a product from the person who makes it to the person who uses it as close to zero as possible. Every cost that's left is visible, justified and earned. Success: makers keep more of each sale, and brands can see and approve every cost in their chain.

## Positioning
**Borderless / zero rent in the chain** (confirmed lead). The usual chain hands much of the price to importer markup, payment delays, marketplace margin and ad platforms ("rent"). Vybd replaces that with services that are priced openly, plus a disclosed Vybd fee (12% in the illustrative $40 example). Mechanism: AI agents and specialists work through one control tower that shares one view of stock, shipping, compliance and orders. The brand approves every big decision.

## Operating Context
Visitors evaluate Vybd before a sales call. They read pricing, use the profit calculator and the Test Drop calculator, check case studies, read the founder essays, then book a call (/book) or start Vybd Plan (/signup). Pages are shared by link in Slack, WhatsApp, LinkedIn and iMessage, so link-preview meta per page matters (`pageMeta.ts`). Many visitors are non-native English speakers. The redesign SPA pages are localized into zh, ko, ja, fr and es.

## Capabilities and Constraints
- Offer map (single source of truth for copy; confirmed 2026-11-12). Every page names and prices these the same way:

  | Visitor | Route | Offer | Primary CTA |
  |---|---|---|---|
  | Exploring the US, self-serve | /waitlist, /signup | Vybd Plan: US research + go-to-market app, $33/mo, first week free. **Not live: early access only** | Get early access |
  | Maker abroad, wants to test | /test-drop | Test Drop: $3,000 + 15% of US sales, up to 500 units | Book a Test Drop intro (/book?for=drop) |
  | Maker abroad or new brand, ready | /us | US Launch: $20,000 once | Plan my launch (/book?for=launch) |
  | Already selling in the US, under $50M | /us#pricing | US Scale: from $3,000/mo + 12% of US sales | Talk to us about US Scale (/book?for=scale) |
  | $50M+ operator | /enterprise | Vybd Enterprise: custom | Talk to an operator (/book?for=enterprise) |
  | Service partner (broker, 3PL, agency) | /ecosystem | Network listing | Join the network |
  | Local rep outside the US | /rainmaker | Commission / share | Apply |

  Prices live in `src/home/data/pricing.ts`, `src/home/data/testDrop.ts` and `src/pages/redesign/home/Pricing.tsx` + `pricingTiers.ts`; change them together. "Vybd Supply Chain" is retired as a product name. The English landing page at `/` (and `/us`) is "Build your business in America" (`src/home/UsApp.tsx`, served from `us-en.html`); right after its hero, "Where are you today?" (`src/home/components/StartRoutes.tsx`, data in `src/home/data/routes.ts`) routes every visitor type, including Enterprise and partners. The earlier borderless home is at `/borderless`. One header on every page: `NAV_LINKS` in `src/home/data/nav.ts` and `GLOBAL_NAV` in `src/pages/redesign/chrome.tsx`, kept in step.
- Stack: Vite + React 19 + TypeScript on Vercel. `/` is `us-en.html` (src/home/UsApp.tsx); `/borderless` is `home.html` (src/home/App.tsx). `/test-drop`, `/essay` and `/fundraise` are separate entries. Other routes use the SPA in `index.html`. Routes, i18n and pageMeta must keep working.
- Ask In Kind (askinkind.org) is Vybd's social impact logistics lab: communities post needs as items, companies pledge goods, carriers move them. It is free and holds no cash.

## Brand Commitments
- Name: Vybd. Tagline on the home page: "borderless."
- Voice: plain, direct, short declarative sentences. Numbers shown openly, and illustrative figures are labelled as illustrative.
- Visual identity is fixed: keep the current design system (colors, fonts, components). Redesign work is refinement, improving UX and adjusting UI, not a replacement world (confirmed 2026-11-11).

## Evidence on Hand
- Six case studies with real outcomes (`src/pages/redesign/cases.ts`, `caseDetails.ts`): Karma, Kashida Layone, TanRom Lifesciences, Flavor Atlas, Emsworth, The Indian Tapas.
- Founder essays (`src/home/essays/`).
- Trustpilot widget (`src/components/TrustpilotWidget.tsx`).
- Dollar figures on the home page are illustrative examples, not quotes. Partner scores are examples. Ask In Kind has no platform statistics yet. Do not invent numbers, logos or testimonials.

## Product Principles
1. Show the cost. Every number is visible, and illustrative numbers say so.
2. The brand decides. Vybd automates and advises, but approval stays with the brand.
3. One team, one view. Present the offer as one connected system, not a list of separate services.
4. Plain words for a global reader. Write short and literal, with no idioms.
