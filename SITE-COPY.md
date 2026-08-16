# Vybd — Full Site Copy Export

Every user-facing string on the site, by route. Source file noted per section.
Nav/footer are repeated on every page — listed once under **Global**.

---

## Global

### Browser / SEO (`index.html`)
- **Title:** Vybd — US Market Entry for International Brands
- **Meta description / og:description / twitter:description:** Vybd runs the full US launch for international consumer brands — demand, storefront, and supply chain — as one accountable partner. No US footprint required.
- **Author:** Vybd

### Header (all pages)
- Logo: **Vybd** (Lab page adds badge: **Lab**)
- Nav: How it works · Results · Pricing · Lab
- CTA button: **Book an entry call**
- Mobile sticky CTA: **Book an entry call**
- Screen-reader: Toggle Menu

> Note: nav "Pricing" links to `#pricing`, which does not exist anywhere on the site.

### Footer (all pages)
- Tagline: **Commerce, Coordinated.**
- Ethos: *enabling commerce, disabling borders*
- Column 1: How It Works · Solutions
- Column 2: Case Study · Pricing
- Column 3: Lab
- Brand mark: Vybd
- Legal: Privacy · Terms

---

## `/` — Landing Page (Mock)
*(src/pages/MockLandingPage.tsx — live at `/`. Old landing page moved to `/mock`, not `/` — route note below.)*

> Route swap: `/` now renders `MockLandingPage`. The previous landing page (documented in prior version of this file — US-market-entry positioning) moved to `/mock`, kept for reference. Positioning has changed from "US market entry" to "AI agents for e-commerce operations."

### SEO (page-level, overrides index.html)
- Title: Vybd — AI agents that run e-commerce operations
- Description: Vybd builds and runs AI agents inside your e-commerce operation — classification, inventory, listings, market intel — with senior operators accountable for the output.

### Header (this page only — differs from Global)
- Nav: What we build · Results · How it works · Lab
- CTA button: **Book a working session** (replaces "Book an entry call" everywhere on this page)

### Hero
- Eyebrow: Your business is different. Your AI should be too.
- H1: **AI agents built around your business**
- Sub: Vybd builds custom AI agents around the problems your business needs solved.
- Link CTA: See what we build →
- Note line: We're building agents free for 25 e-commerce brands this quarter. **See if you qualify →**

### Logo Row
- Header: Brands running on Vybd
- Brands: Bayangrom · Emsworth · Karama · The Indian Tapas · Flavor Atlas · Kashida Layone · TanRom Lifesciences
- No empty placeholder slots (clean row of 7, no longer padded to 10)

### 01 / WHAT WE BUILD
- H2: **Six agents. One operating layer.**
- Intro: Most brands your size aren't short on strategy. They're short on hands. The same forty decisions get made manually every week — what to reorder, how to classify it, what to write, what a competitor just changed — and every one of them is a place where a person is doing work a system should be doing. We build the agents that take those decisions, and we stay accountable for the ones they get wrong.

Each tile: index · category · title · problem hook · problem body · (tap) solution · optional result chip · tags · status.

**01 — Market Intelligence Agent** (Core, Active)
- Hook: You're guessing. Your competitors aren't.
- Problem: Most brands find out their assumptions about customer segments, competitors, and positioning were wrong only after they've spent the budget proving it.
- Solution: The agent watches competitor pricing, assortment, and positioning continuously and flags what changed — so you're reacting in days instead of finding out at the end of the quarter.
- Tags: Competitor tracking · Pricing signals · Demand mapping

**02 — Classification & Compliance Agent** (Core, Active)
- Hook: One wrong filing and your shipment doesn't move.
- Problem: Documentation gaps surface after a shipment is already delayed, fined, or held — when fixing it costs the most.
- Solution: The agent classifies SKUs, validates documentation, and checks filings before anything ships. Nothing sits at the border because a field was missed.
- Tags: HTS codes · Customs · FDA

**03 — Logistics Agent** (Core, Active)
- Hook: You ship, but you're flying blind.
- Problem: Disconnected carriers and systems leave brands without real-time visibility, predictable delivery, or cost control.
- Solution: The agent evaluates routing and carrier options per shipment, tracks against expected transit, and surfaces cost drift before it compounds.
- Result: ↓22% shipping cost · Bayangrom
- Tags: Routing · Carrier selection · Freight audit

**04 — Inventory Agent** (Core, Active)
- Hook: Guess wrong and it's cash or sales — you lose either way.
- Problem: Thin demand visibility forces reactive planning, so you're either tying up capital in stock that won't move or losing sales on stock you don't have.
- Solution: The agent forecasts against real demand signal and triggers replenishment at the SKU level, keeping stock aligned to what's actually selling where.
- Result: ↓28% excess inventory · Bayangrom
- Tags: Forecasting · Replenishment · Multi-location

**05 — Catalog & Listings Agent** (Revenue, Active)
- Hook: Your team writes the same product page forty times a year.
- Problem: Listings, variants, and marketplace content get written by hand, drift out of sync across channels, and eat days that should go to product.
- Solution: The agent writes and syncs listings across Shopify and marketplaces in your brand voice, and keeps them consistent as the catalog changes.
- Tags: Shopify · Amazon · SEO

**06 — Growth Agent** (Revenue, Active)
- Hook: Spend without insight burns budget.
- Problem: Campaigns run on day-one assumptions — weak targeting, generic messaging, spend pointed at the wrong geography.
- Solution: The agent feeds live market and performance signal back into targeting, creative, and geographic allocation, so the strategy moves when the market does.
- Result: $100K+ pre-orders · Emsworth & Karama
- Tags: Performance · Content · D2C

- Mobile hint on every tile: Tap to see what it does →
- Footer status on every tile: Active

### 02 / WHERE TO START
- H2: **You don't need all six. Start with one.**
- Intro: Most brands start with the one job that's costing them the most, prove it works, then add the next. You're not signing up for a platform migration. You're putting one agent into one workflow and watching what it does for a month.

1. **Start with the job you hate most** — Tell us the workflow eating the most hours. We scope one agent against it and ship it into your stack. → Start here
2. **Start with the number that's bleeding** — Landed cost, excess inventory, shipping spend. We baseline it, build against it, and report the delta. → Start here
3. **Start with the whole operating layer** — Some brands hand us the full stack from day one. Six agents, one operating cadence, one team accountable. → Start here

- Closing: One team behind all of it, whichever door you enter through.

### 03 / HOW WE RUN IT
- H3: **Autonomous where it's safe. Supervised where it isn't.**
- Body: An agent that runs unsupervised on a high-stakes decision is a liability, not a feature. Every workflow we deploy gets sorted into one of three modes on day one, and you decide which is which.

Autonomy modes:
- **Autonomous** — Routine, high-confidence, low-blast-radius. Runs and reports.
- **Supervised** — Complex or ambiguous. The agent proposes, an operator checks, and the correction trains the next call.
- **Your approval** — Anything with real money or real risk attached. Nothing moves without you.

- Closing line: Agents carry the volume. Senior operators carry the judgment — and stay accountable for the outcome.
- CTA: Book a working session

### Case Studies carousel
*(src/components/mock/MockLandingCaseStudies.tsx — cards from src/data/mockCaseStudies.ts, same content as Case Study Data below but with "Karma" corrected to "Karama" throughout)*
- Eyebrow: TRACK RECORD
- H2: **Brands we've operated for.**
- Sub: Before the agents, we ran this work by hand for brands across apparel, food, home, and health. That's what the agents are built from.
- Filter pills: All · Food & Beverage · Retail / Home Textiles · Fashion / Apparel · Art / E-commerce · Health / Nutraceuticals
- Scroll hint: Scroll horizontally to explore more case studies

### Testimonials / Globe
*(src/components/mock/MockTestimonialGlobe.tsx)*
- Label: Global Impact ↗
- H2: **Built around brands that move fast**
- Sub: Spin the world. Our clients left something for you.
- Counter format: #01 / 08

**1. Kashida Layone** — Visual Artist & Founder, Fine Art Brand — USA
> There's a particular kind of silence when your work is good and no one who can afford it knows you exist. Vybd broke that silence. Not with noise — with precision. The right eyes found me. The rest followed.
- Metric: → First international collector sales, week three

**2. Karama** — Creative Director, Fashion Brand — USA
> Every market has a language. Ours didn't translate — not because the brand wasn't strong, but because we were speaking to people who didn't have the context yet. Vybd built that bridge. Same brand, new conversation.
- Metric: → First international stockist secured, week six

**3. Elena S.** — Founder, Sustainable Decor Brand — Mexico City, Mexico
> Scaling into North America felt like a gamble until we found Vybd. They didn't just provide a platform; they provided a roadmap. The level of operational detail they handle allowed us to focus entirely on the creative side of the brand.
- Metric: → 3x growth in North American reach, quarter one

**4. Emsworth Terry Cotton** — Founder, Premium Cotton Goods Brand — UK
> We didn't need someone to just sell for us. We needed to understand the room — who was already in it, what they were charging, where the gap was. Vybd came back with answers we hadn't thought to ask for. We positioned around them and it landed exactly right.
- Metric: → Wholesale enquiries up 4x, month two

**5. Lucas M.** — Director of Ops, HealthTech Brand — Berlin, Germany
> Compliance in the US is a massive roadblock for European health tech. We anticipated six months of deep legal review before even seeing a customer. Vybd's native infrastructure bypassed the friction completely—we were fully compliant and selling in under three weeks.
- Metric: → US market entry accelerated by 5 months

**6. Bayangrom** — Founder, Cultural Streetwear Brand — India
> The brand was alive. The orders were coming. But the backend was swallowing us whole. Vybd took the weight — literally. Warehousing, shipping, fulfilment — handled. We got back to building, not firefighting.
- Metric: → Fulfilment time cut from 12 days to 3

**7. Priya M.** — CEO, Home Goods Brand — Bangalore, India
> We went from zero US presence to $40K in revenue in our first month. I didn't have to think about warehousing or Amazon once.
- Metric: → $40K US revenue, month one

**8. Ji-Hoon K.** — Founder, Premium Skincare Brand — Seoul, Korea
> We'd been trying to crack the US market for eighteen months. We had a great product, a team that believed in it, and no idea how to navigate FDA requirements at the same time as an Amazon launch. Vybd had us live in twelve days. I still don't fully understand how they moved that fast.
- Metric: → $82K US revenue, month one

Globe marker labels: Vybd Operations (NY) · Los Angeles, USA · Chicago, USA · Mexico City, Mexico · London, UK · Berlin, Germany · Mumbai, India · Bangalore, India · Seoul, Korea

> Naming fix vs. old `/mock` version: testimonial #1 now says **Kashida Layone** (was "Keshida Layone"), matching the case study spelling. Karama now consistent everywhere on this page.

### THE HORIZON
- H3: **Every agent reads from the same brain.**
- Body: Generic agents give generic output. Ours read from Brand Brain — a per-brand knowledge layer holding your voice, your SKUs, your margins, your supplier terms, your compliance constraints — and they write findings back into it. A classification decision sharpens the next shipment. A campaign result sharpens the next campaign. Your fifth month runs smarter than your first.
- Link: See the Lab →

### Final CTA
- H2: **Tell us the workflow<br />that's costing you most.**
- Body: Thirty minutes. We'll tell you whether an agent is the right answer or whether you just need to fix a process — and we'll say so if it's the second one.
- Button: Book a working session

### Footer (this page)
Same Global footer content — tagline, ethos, nav columns, legal — unchanged from Global section above.

---

## `/lab` — Vybd Lab
*(src/pages/LabPage.tsx)*

### SEO
- Title: Vybd Lab — What we're building behind the agency
- Description: Vybd Lab is where we build the infrastructure our agency runs on — starting with Brand Brain, a per-brand knowledge layer our agents read from and write back to. In development, in the open.

### Hero
- Eyebrow: Vybd Lab · In development
- H1: **What we're building behind the agency.**
- Sub: Vybd runs full US launches today. Underneath that work, we're building the infrastructure that makes each launch smarter than the last. The Lab is where that lives — in the open, before it's finished.
- CTA: See Brand Brain

### 01 / BRAND BRAIN
- H2: **One brain per brand. Every agent acts on it.**
- Intro: Brand Brain is the per-brand knowledge layer every Vybd agent reads from and writes back to — so the whole stack acts on one brand's context, and gets sharper about it with every entry.

**01 Voice**
- Lead: Brand guidelines, positioning, the dos and don'ts.
- Body: So every agent's output — listings, campaigns, customer replies — comes out on-brand without a human re-briefing each one.

**02 Operations**
- Lead: This brand's SKUs, margins, HTS codes, supplier terms, channel rules, compliance constraints.
- Body: So agents make the correct call — what to reorder, how to classify, where to route — without stopping to ask.

**03 Market**
- Lead: What our intelligence agents learn about the US market and this brand's customers.
- Body: So strategy adapts as the signal changes, instead of running on day-one assumptions.

### 02 / WHY IT'S A BRAIN, NOT A CONFIG FILE
- H2: **Agents don't just read it. They write back to it.**
- Body: A knowledge layer agents only read from is a settings page. Brand Brain is different: agents write findings back into it. Market intelligence updates what the marketing agent targets. A classification decision updates how the next shipment clears. A campaign result updates the strategy. Every entry Vybd runs makes the brain sharper for the next one — so a brand's fifth month is smarter than its first, and its second market starts ahead of where its first did.

Diagram labels: Brand Brain (center) · Market Intelligence · Compliance · Logistics · Warehousing · E-commerce · Marketing

### STATUS
- H2: **Where this actually is.**
- Body: Brand Brain is in active development. It's not something you can buy today — it's the direction the agency is building toward, grounded in the real entries we run now. We're sharing it early because the people who find this interesting are usually the people we want to talk to.
- Buttons: Talk to us · Build it with us

---

## `/product` — How Vybd Works
*(src/pages/ProductPage.tsx)*

### Hero
- Tag: How Vybd Works
- H1: **How Vybd Works**
- Sub: Vybd runs as a layered operations system. Each operation runs autonomously and synchronises through a central orchestration layer — so nothing falls through the gaps between vendors.

### 01 / ARCHITECTURE
- H2: **Three layers. One outcome.**

**Layer 1 — Intelligence:** Market data, compliance monitoring, and competitive signals processed in real time by AI agents. *(Real-time · AI-powered)*

**Layer 2 — Orchestration:** A central coordination layer that synchronises inventory, logistics, compliance status, and order data across all operations. *(Always in sync · Zero gaps)*

**Layer 3 — Execution:** Warehousing, fulfilment, e-commerce channels, and marketing campaigns — operating from a shared operational state. *(Fully integrated · Shared state)*

- Body: No operation runs in isolation. When a compliance rule changes, the execution layer is updated automatically. When inventory drops below threshold, logistics is notified before you notice.

### Architecture diagram section
- H2: **A Full Commerce Stack, Coordinated.**
- Intro: Vybd runs as a layered operations system. Each module operates autonomously while synchronizing through a central orchestration layer.

Node graph labels *(src/components/ArchitectureNodeGraph.tsx)*:
- **Operations Control Tower** — Orchestration Engine · Unified Data Layer · Role-Based Access
- **Market Intelligence** — Demand Forecasting · Competitor Analysis · Price Optimization
- **Compliance** — Regulatory Monitoring · Risk Detection · Document Validation
- **E-Commerce** — Catalog Sync · Channel Management · SEO Automation
- **Marketing** — Ad Spend Optimization · Campaign Analytics · Audience Segmentation
- **Logistics** — Smart Routing · Carrier Selection · Freight Audit
- **Support** — Ticket Routing · Sentiment Analysis · Auto-Responses

### 02 / AGENT MODEL
- H2: **Autonomous. Supervised. Accountable.**
- Intro: Vybd automates what's safe, reviews what's complex, and lets you decide what matters most.

1. **Autonomous** — Routine tasks run automatically. *(Routine workflows · Low-risk decisions · High confidence)*
2. **Supervised** — Complex situations are checked by specialists. *(Complex exceptions · Medium risk · Learning phase)*
3. **Your Approval** — Critical actions require your decision. *(Critical decisions · High financial impact · SLA overrides)*

### 03 / DASHBOARD
- H2: **One view across everything.**
- Body: Every part of your US operation — inventory, compliance, orders, logistics — runs in sync. You see the status. We handle the execution.
- Image alt: Vybd Dashboard Interface showing SKU performance and stock analytics

### CTA
- H2: **Want to go deeper?**
- Body: Book a technical walkthrough with the Vybd team. We'll show you exactly how the orchestration layer handles your product category.
- Button: Request a Technical Walkthrough →

---

## `/case-studies` — Case Studies Index
*(src/pages/CaseStudiesPage.tsx + components/case-studies/CaseStudiesSection.tsx)*
- Eyebrow: Case Studies
- H1: **Case Studies**
- Intro: See how we help organizations build and scale with data-driven market entry strategies.
- Cards from Case Study Data (below).

## `/case-studies/:slug` — Detail template
*(src/pages/CaseStudyDetailPage.tsx)*
- Back link: ← Back to case studies
- Section headings: Overview · Role · Challenges · Solutions · Impact
- Optional CTA card (per case study).

---

## Case Study Data
*(src/data/caseStudies.ts — powers landing carousel, index, and detail pages)*

### 1. The Indian Tapas — `the-indian-tapas` — Food & Beverage
- **Title:** Building a U.S.-Ready Growth Model for an Indian QSR Brand
- **Summary:** Helped The Indian Tapas prepare for U.S. expansion through positioning, menu prioritization, and a demand-led growth strategy.
- **Metrics:** 3 — Core Menu Categories Identified · High Intent — Discovery Framework Built · Direct — Acquisition Model Established
- **Overview:** The Indian Tapas is a modern Indian street food brand with strong product-market fit. Expansion into the U.S. required repositioning, demand mapping, and a structured go-to-market approach.
- **Role:** We partnered as the brand's U.S. expansion and growth strategy partner, building a scalable foundation for market entry.
- **Challenges:** No clear U.S. market positioning · Unclear demand prioritization · Limited discovery beyond brand awareness · Dependency on delivery platforms · No structured go-to-market plan
- **Solutions:** Reframed positioning to quick, craveable street food · Mapped demand and prioritized menu items · Built search-led discovery strategy · Designed direct acquisition framework · Defined pilot-first go-to-market approach
- **Impact:** Transformed from a location-based food business into a scalable, demand-driven brand ready for U.S. expansion.

### 2. Emsworth — `emsworth` — Retail / Home Textiles
- **Title:** Structuring a U.S. Entry Strategy for a Commodity-Driven Category
- **Summary:** Helped Emsworth enter the U.S. market by defining positioning, prioritizing SKUs, and building a dual-channel growth strategy.
- **Metrics:** Focused — SKU Strategy Defined · Dual Channel — Growth Model Activated · Search Led — Discovery Framework Built
- **Overview:** Emsworth is a terry cotton products brand specializing in everyday essentials like towels and bath linens. Expanding into the U.S. required navigating a highly competitive and commoditized category where success depends on positioning, trust, and discoverability.
- **Role:** We partnered as Emsworth's U.S. market entry and growth strategy partner, building a scalable foundation for both direct-to-consumer and marketplace-driven growth.
- **Challenges:** Highly commoditized market with minimal differentiation · No clear market positioning beyond price · Marketplace-dominated ecosystem limiting brand ownership · Low visibility for high-intent non-branded searches · No structured entry strategy for SKUs and channels
- **Solutions:** Defined positioning around quality-led essentials (absorbency, durability, comfort) · Prioritized high-impact SKUs aligned with U.S. demand · Built a dual-channel growth model (marketplaces + DTC) · Mapped high-intent search demand for discovery · Strengthened conversion and trust signals through better content and presentation
- **Impact:** Emsworth evolved from a product-led business into a structured, market-ready brand positioned to compete effectively in a commoditized U.S. category.

### 3. Flavor Atlas — `flavor-atlas` — Food & Beverage / Premium Produce
- **Title:** Structuring a U.S. Entry Strategy for a Premium Produce Brand
- **Summary:** Helped Flavor Atlas prepare for U.S. expansion through premium positioning, category prioritization, and a structured multi-channel distribution strategy.
- **Metrics:** 4 — High-Demand Product Categories Identified · 3 — Distribution Channels Activated · 2-Phase — Market Entry Strategy Defined
- **Overview:** Flavor Atlas is a premium brand specializing in exotic fruits and vegetables sourced globally. Entering the U.S. market required more than product strength. It required clear positioning, demand prioritization, and a structured distribution strategy in a highly competitive, logistics-driven category.
- **Role:** We partnered as Flavor Atlas's U.S. market entry and growth strategy partner, focused on building a scalable foundation for expansion across product, positioning, and distribution.
- **Challenges:** Highly competitive and quality-driven produce market · No clear category positioning for exotic produce · Distribution complexity across retail and digital channels · Low brand awareness in the U.S. market · No structured go-to-market plan for prioritization and scale
- **Solutions:** Defined a premium, health-led positioning strategy · Prioritized high-demand categories like avocados, berries, and specialty greens · Built a multi-channel distribution model across retail, online grocery, and DTC · Mapped high-intent consumer demand around health, organic consumption, and nutrition · Designed a phased market entry plan from pilot launch to scalable expansion
- **Impact:** Flavor Atlas transitioned from a global sourcing brand into a U.S.-ready premium produce player with a structured entry strategy and scalable growth model.

### 4. Karma — `karma` — Fashion / Apparel
> Naming inconsistency: logo row and testimonial say **Karama**; this case study says **Karma**.
- **Title:** Scaling U.S. Growth for a Fashion-Forward Apparel Brand
- **Summary:** Helped Karma strengthen its U.S. digital presence through sharper positioning, SEO-led discoverability, and a scalable acquisition strategy.
- **Metrics:** $12K — Increase in Revenue · 24% — Increase in Growth · 100+ — High-Intent Keywords Ranked
- **Overview:** Karma is a fashion-forward apparel brand manufacturing in Bangladesh and distributing primarily in the United States. With a strong foundation in cost-efficient production and an emerging brand identity, Karma aimed to scale in the highly competitive U.S. fashion market while maintaining quality and margin efficiency.
- **Role:** We partnered as strategic growth advisors to strengthen Karma's digital presence, improve discoverability beyond branded searches, and build a scalable acquisition engine that could drive both online revenue and long-term brand equity.
- **Challenges:** Lacked clear U.S. market-specific positioning in a competitive fashion landscape · A large share of traffic came from branded or low-intent channels · High dependency on paid acquisition increased CAC and hurt profitability · Low visibility for non-branded, high-intent keywords · Product value was not being translated into compelling U.S.-focused messaging
- **Solutions:** Conducted market and competitor analysis to identify whitespace opportunities in pricing, positioning, and category gaps · Refined brand positioning and messaging around quality, affordability, and style relevance · Developed a data-backed SEO strategy focused on high-intent, non-branded keywords · Optimized product and collection pages and launched new search-optimized landing pages · Used customer and social insights to create content that improved engagement and conversion · Implemented localized SEO strategies aligned with U.S. search behavior and regional demand
- **Impact:** Karma built a stronger foundation for scalable U.S. growth by improving discoverability, reducing dependence on paid acquisition, and translating supply-side strengths into clearer market-facing value.
- **CTA:** Let's build your next growth chapter. / Book a consultation to explore how data-driven expansion strategies can unlock new markets for your brand.

### 5. Kashida Layone — `kashida-layone` — Art / E-commerce
> Naming inconsistency: testimonial says **Keshida Layone**; logo row and case study say **Kashida Layone**.
- **Title:** Building a U.S. Growth Foundation for a Modern Art Brand
- **Summary:** Helped Kashida Layone establish a U.S.-ready e-commerce presence through Shopify setup, market research, and a structured go-to-market strategy for a high-AOV art brand.
- **Metrics:** $10K+ — Revenue Generated · 30% — Traffic Growth · 100+ — Non-Brand Queries Ranked ≤5
- **Overview:** Kashida Layone is a modern art brand led by a single artist focused on making original artwork accessible beyond traditional collectors. With strong product-market fit and a loyal audience, the opportunity was to build the right infrastructure to scale in the U.S. market.
- **Role:** We partnered as the client's U.S. market entry and growth partner, handling the operational and commercial foundation while enabling the artist to stay focused on creative work.
- **Challenges:** No U.S.-focused e-commerce presence or Shopify storefront · Limited visibility into the U.S. art buyer landscape and competitors · Need for a structured strategy in a high-AOV ($1,800-$2,925) category
- **Solutions:** Built and configured a U.S.-facing Shopify storefront with optimized product listings, collections, and checkout flow · Conducted market and competitor research to map pricing, positioning, and whitespace opportunities · Developed a clear U.S. go-to-market strategy targeting the right buyer segments and channels
- **Impact:** Kashida Layone successfully transitioned from a creator-led brand into a structured, market-ready business with a strong U.S. e-commerce foundation and scalable growth strategy.
- **CTA:** Let's build your next growth chapter. / Book a consultation to explore how data-driven expansion strategies can unlock new markets for your brand.

### 6. TanRom Lifesciences — `tanrom-lifesciences` — Health / Nutraceuticals
- **Title:** Building a U.S. Entry Strategy for a Nutraceutical Wellness Brand
- **Summary:** Helped TanRom Lifesciences enter the U.S. market through a compliance-ready storefront, focused SKU strategy, and a dual-channel growth model.
- **Metrics:** 3 — High-Intent SKUs Selected · 100% — Compliance-Ready Setup · 2 — Growth Channels Activated
- **Overview:** TanRom Lifesciences is a modern nutraceutical brand focused on gummy-based wellness products across sleep, immunity, and daily health. While the brand had strong traction in India, entering the U.S. required building a system that could compete in a highly trust-driven and regulated market.
- **Role:** We partnered as the client's U.S. expansion partner, owning the operational, strategic, and commercial groundwork required to successfully enter and scale in the U.S. market.
- **Challenges:** No U.S. presence, storefront, or infrastructure · Low discoverability beyond brand-driven traffic · Highly competitive, trust-driven supplement category · No structured go-to-market strategy for launch and scaling · Gaps in compliance, messaging, and marketplace readiness
- **Solutions:** Built a U.S.-ready storefront with localized pricing, messaging, and conversion flows · Mapped the U.S. supplement landscape to identify demand pockets and positioning opportunities · Defined a focused launch strategy around high-performing SKUs · Reframed product messaging around high-intent use cases like sleep, immunity, and wellness · Aligned product claims and pages with U.S. regulatory and marketplace standards · Activated a dual-channel model (DTC + marketplace readiness)
- **Impact:** TanRom Lifesciences transformed from a regionally focused brand into a U.S.-ready nutraceutical player with compliant infrastructure, focused product strategy, and scalable growth channels.

---

## `/work` — Work Index
*(src/pages/WorkIndexPage.tsx)*
- H1: **Real entries. Real numbers.**
- Sub: The permanent home for Vybd case studies — measured results from brands we've taken into the US.
- Listing: **Bayangrom** — How a <$1M DTC streetwear brand cut landed cost 12% and built a US supply chain that scales. — $180K+ saved / year

> Note: `/work` and `/case-studies` are two separate, unlinked case-study systems with different content and design.

---

## `/work/bayangrom` — Bayangrom Case Study
*(src/pages/BayangromCaseStudyPage.tsx)*

### SEO
- Title: How Bayangrom built a scalable US supply chain with Vybd
- Description: A <$1M DTC streetwear brand cut landed cost 12%, sped fulfillment 35%, and unlocked $180K+ in annual savings in 90 days.

### Hero
- Back link: ← Back to case studies
- H1: **How Bayangrom cut costs 12% and built a US supply chain that scales.**
- Sub: A <$1M DTC streetwear brand, from operational losses to a real operating engine — in 90 days.
- Chips: DTC Streetwear · <$1M revenue · Shopify → Amazon · Premium graphic tees & hoodies
- Stats: ↓12% Landed cost · ↓35% Fulfillment time · ↓28% Excess inventory · $180K+ Saved / year

### 01 / THE BRAND
Bayangrom is a fast-growing DTC streetwear brand built on bold identity, oversized fits, and premium-feel garments — "luxury streetwear meets cultural identity." Graphic tees and hoodies, Shopify-first, with ambitions to scale into Amazon and the US streetwear mainstream.

### 02 / THE CHALLENGE
Bayangrom was designing products people wanted — and losing money getting them out the door. Early-stage logistics meant high shipping costs, frequent stockouts, excess inventory tying up cash, and no real-time view of any of it. Great brand, no operating engine underneath it.

### 03 / THE OPERATING ENGINE — "What we did."
- **Weeks 1–2 · Diagnostic** — SKU profitability analysis, freight cost breakdown, lead-time mapping.
- **Weeks 3–6 · Infrastructure build** — Forecasting engine deployed, suppliers onboarded, US warehouse network set up.
- **Weeks 6–10 · Execution** — Inventory rebalancing, carrier renegotiation, automated replenishment triggers.
- **Ongoing · Optimization** — Weekly demand tuning, cost tracking, margin expansion.

### 04 / RESULTS — "Before → after."
| Metric | Before | After | Impact |
|---|---|---|---|
| Shipping cost / order | $9.20 | $7.15 | ↓ 22% |
| Lead time | 5.2 days | 3.4 days | ↓ 35% |
| Inventory waste | High | Reduced | ↓ 28% |
| Stockouts | Frequent | Controlled | ↓ 40% |
| Data visibility | None | Real-time | — |
| Gross margin | Baseline | +6 pts | — |

### 05 / IN THEIR WORDS
> "We were designing great products, but losing money operationally. Vybd rebuilt how we run the business — suppliers, shipping, inventory. Within weeks, costs dropped and delivery sped up. It felt like we finally had a real company behind the brand."
> — Founder, Bayangrom

- Video placeholder label: Founder video — coming soon

### Positioning line
Not a consultant. Not a tool. A full-stack operating partner.

### CTA
- H2: **Ready to build yours?**
- Button: Book an entry call

---

## `/privacy`, `/terms` — placeholders
*(public/privacy.md, public/terms.md — also unused public/case-study.md, public/how-it-works.md)*
- Privacy Policy — *This page content will be updated soon.*
- Terms of Service — *This page content will be updated soon.*

---

## Copy issues worth fixing
1. **Karama vs Karma** and **Keshida vs Kashida Layone** — fixed on `/` (mock landing) but still inconsistent on `/mock` (old landing), `/case-studies`, and `caseStudies.ts` (slug still `karma`).
2. **"Pricing" nav link is dead** on `/mock` and every other non-mock page — points to `#pricing`, no such section exists. `/` (mock) sidesteps this by not having a Pricing nav item at all.
3. **Two competing case-study systems** — `/case-studies` (6 strategy write-ups, old data) and `/work` (1 Bayangrom deep-dive). Neither `/` nor `/mock` links to `/work`.
4. **Privacy/Terms are empty placeholders** but linked in every footer.
5. **CTA text is inconsistent site-wide** — "Book a working session" on `/` (mock) vs "Book an entry call" everywhere else (`/mock`, `/product`, `/lab`, `/work`, `/case-studies`). All still go to `#` (PLATFORM_URL unset).
6. **Testimonial mix** — 5 named brands (Kashida, Karama, Emsworth, Bayangrom) vs 4 anonymized (Elena S., Lucas M., Priya M., Ji-Hoon K.); tone is inconsistent between the two groups.
7. **Grammar slips** (still present on `/mock`'s old bento copy) — "assumptions about customers segments," "Limited demand visibility leads to overstocking or stockouts lead to tying up capital," "Nothing was held at the border because someone missed a field" (tense off). `/` (mock) rewrote these tiles and doesn't have the same slips.
8. **Positioning whiplash** — `/` now pitches "AI agents that run e-commerce operations" (agency-as-AI-vendor) while `/product`, `/lab`, `/work`, `/case-studies` still pitch "US market entry for international brands." Two different companies, same site.
