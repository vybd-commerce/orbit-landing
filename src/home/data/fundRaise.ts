/* /fund-raise: every word and number on the investor page. Edit here;
   layout lives in FundRaiseApp.tsx and styles/fund-raise.css.
   In headlines, wrap one word in *asterisks* to set it in italic. */

export const BOOK = '/book'
export const EMAIL = 'hello@vybd.ai'
export const ESSAY_URL = '/essay#middleman'

export const hero = {
  lines: ['Make it anywhere.', '*Sell it everywhere.*'],
  sub: 'Market entry and operations for consumer brands, with equity in the winners.',
  round: 'Seed round · $3M',
  cta: 'Book a call',
}

export const problem = {
  eyebrow: 'The problem',
  title: 'Selling in a new country comes with a long list of boxes to tick.',
  boxes: [
    'Inventory planning', 'Cargo insurance', 'Funding', '3PL warehouse', 'Returns',
    'Freight', 'Retailer chargebacks', 'Tariffs and duties', 'Amazon account', 'Importer of record',
    'Customer service', 'Customs broker', 'Channel strategy', 'Labeling', 'US pricing',
    'FDA / FCC rules', 'Sales tax', 'Entity setup', 'Retail buyers', 'Marketing',
  ],
  footer: '20 boxes · 10+ vendors · 9–12 months to a first sale (est.)',
}

export const solution = {
  eyebrow: 'The solution',
  title: 'A new market means a dozen partners. Or one: Vybd.',
  brandLabel: 'The brand makes three decisions',
  decisions: [
    { n: 1, title: 'Talk to us', body: '3-week diagnostic' },
    { n: 2, title: 'Pick a strategy', body: 'Channels, pricing, launch plan' },
    { n: 3, title: 'Set a budget', body: 'Launch fee, monthly plan, stock' },
  ],
  stat: { value: '90 days', label: 'to first sale' },
  layersLabel: 'Vybd runs the rest in four layers',
  layers: [
    { name: 'Data + agent layer', items: ['Amazon account', 'Marketing', 'Retail buyers', 'Retailer chargebacks', 'Inventory planning'] },
    { name: 'Senior operators', items: ['Channel strategy', 'US pricing', 'Customer service', 'FDA / FCC rules', 'Labeling', 'Sales tax'] },
    { name: 'Landing hubs', items: ['Entity setup', 'Importer of record', 'Customs broker', 'Tariffs and duties', 'Freight', 'Cargo insurance', '3PL warehouse', 'Returns'] },
    { name: 'Capital', items: ['Funding'] },
  ],
}

export const thesis = {
  eyebrow: 'Our thesis',
  title: 'AI is the *only* middleman we need',
  line: 'Strip out the rent, keep the service, and drive the cost of coordination toward zero.',
  flow: {
    producer: 'Producer',
    vybd: 'Vybd',
    vybdLines: ['AI agents do the coordination work', 'Senior operators make the judgment calls'],
    customer: 'Customer',
  },
  partners: ['Customs brokers', 'Compliance experts', 'Freight + 3PLs', 'Marketing agencies', 'Financiers'],
  partnersCaption: 'Partners do the physical work and earn for what they add.',
  commitmentsLabel: 'Four commitments',
  commitments: ['The producer owns their customer', 'Fees are visible', 'Leaving is easy', 'Value is verifiable'],
  stagesLabel: 'Three stages',
  nowLabel: 'Now',
  stages: [
    { n: 1, name: 'Operator', body: 'We run market entry end to end.', now: true },
    { n: 2, name: 'Orchestrator', body: 'Partners receive work through Vybd, and Vybd becomes the system of record.' },
    { n: 3, name: 'Network and capital', body: 'An open ledger, plus financing for inventory and freight from our operating data.' },
  ],
  essayLink: 'Read the essay',
}

export const model = {
  eyebrow: 'Business model',
  title: 'Five revenue streams per brand',
  columns: ['Step', 'Stream', 'Price', 'Detail'],
  rows: [
    { step: '1 · Weeks 0–3', stream: 'Diagnostic sprint', price: '$5K', detail: 'Market and ops map, costed launch plan' },
    { step: '2 · Launch', stream: 'Set-up fee', price: '~$10K', detail: 'IOR, customs, compliance, paperwork; scoped per project' },
    { step: '3 · Monthly', stream: 'Platform fee', price: '$3–15K/mo', detail: 'Operating system: agents, data layer, operators' },
    { step: '4 · As they sell', stream: 'Revenue share', price: '12%', detail: 'Of revenue in the markets and channels we run' },
    { step: '5 · After 6+ months', stream: 'Minority stake', price: '10–20%', detail: 'Cash plus services; follow-on up to 49%' },
  ],
  band: { title: 'Warehousing + logistics', body: 'billed monthly through our network at a 20% margin; grows with every shipment.' },
}

export const traction = {
  eyebrow: 'Traction',
  title: '11 brands, 5 countries, $450K trailing revenue',
  stats: [
    { value: '−28%', label: 'excess inventory' },
    { value: '−22%', label: 'shipping cost' },
    { value: '$180K', label: 'recovered per year' },
    { value: '$450K', label: 'Vybd revenue, last 12 months' },
  ],
  customersLabel: 'Customers by origin',
  origins: [
    { region: 'South Asia', brands: ['Bayangrom', 'Emsworth', 'Sugat Traders', 'MIB Industries'] },
    { region: 'South Korea and China', brands: ['Ouwr', 'Cellre', 'Ollobot'] },
    { region: 'US', brands: ['Keshida Layone', 'Jack of All', 'The Indian Tapas', 'Masala Cafe'] },
  ],
  caseStudy: {
    label: 'Case study',
    brand: 'Emsworth',
    about: 'Luxury terry cotton from India, now selling direct to US homes.',
    quote:
      "Operations run automatically now, I use Vybd's agent to understand what's going on, it suggests opportunities for expansion and brand building that we discuss periodically and then it also executes automatically.",
    by: 'Jagan, Founder, Emsworth',
    results: ['DTC live', '~10,000 US orders', 'A proposed 50/50 US joint venture'],
  },
}

export const market = {
  eyebrow: 'Market',
  title: 'From $450K today to a $118B global market',
  rings: [
    { key: 'tam', label: 'TAM', value: '$118B', detail: 'Worldwide, all channels' },
    { key: 'sam', label: 'SAM', value: '$1.2B', detail: 'The US today' },
    { key: 'som', label: 'SOM', value: '$22.1M', detail: '3 years, 153 brands' },
  ],
  today: { label: 'Today', value: '$450K', detail: 'revenue, 11 brands live' },
  scaleNote: 'Circles not to scale.',
  note: '$168K a year per brand, the year-2 value of a brand on the US Launch + Operate package.',
  sizing: {
    summary: 'How we sized it',
    rows: [
      { label: 'TAM', body: '240,535 US importers (Census 2024) ÷ ~13% US share of world imports ≈ 1.8M worldwide; ~40% trade consumer goods → ~700K × $168K ≈ $118B' },
      { label: 'Online floor', body: '100K+ sellers doing $1M+ a year on Amazon worldwide (Marketplace Pulse, 2025) → $16.8B' },
      { label: 'SAM', body: '5,244 US consumer brands at $5–100M + ~2,000 international entrants a year → ~7,250 × $168K ≈ $1.2B' },
      { label: 'SOM', body: '153 brands at Q12 × $144K average run-rate → $22.1M' },
    ],
  },
}

/* Positioning map. x = breadth across the chain, y = how much value the
   brand keeps, both 0–100. label: which side of the dot the name sits. */
export type Side = 'right' | 'left' | 'top' | 'bottom'
export const competition = {
  eyebrow: 'Competition',
  title: 'End to end, and the brand *keeps* the customer',
  xAxis: { title: 'Breadth across the chain', low: 'Single layer', high: 'End to end' },
  yAxis: { title: 'Who keeps the value', low: 'Platform owns customer, takes rent', high: 'Brand owns customer, sees fees' },
  players: [
    { name: 'Global-e', x: 35, y: 70, label: 'left' as Side },
    { name: 'Shopify', x: 58, y: 75, label: 'right' as Side },
    { name: 'Whop', x: 40, y: 61, label: 'right' as Side },
    { name: 'Faire', x: 40, y: 44, label: 'right' as Side },
    { name: 'Pattern', x: 70, y: 39, label: 'right' as Side },
    { name: 'TikTok Shop', x: 60, y: 29, label: 'right' as Side },
    { name: 'Amazon', x: 90, y: 17, label: 'left' as Side },
  ],
  vybd: { name: 'Vybd today', x: 65, y: 87, label: 'left' as Side },
  target: { name: 'Stage 3', x: 94, y: 94 },
  points: [
    { title: 'We run the whole chain', body: 'Research, compliance, freight, customs, channels and support through one team. Amazon and Pattern are broad too, but they own the customer.' },
    { title: 'The brand keeps the customer', body: "Customer data, storefronts and channel accounts stay in the brand's name, and every fee is visible." },
    { title: 'Built for physical goods', body: 'Whop and Shopify are software for selling. We land the goods, clear customs and fill the shelves.' },
  ],
}

/* Moats: draft copy, being rewritten. Keep it consistent with the four
   commitments: never say the entity, importer of record or accounts "sit
   with us", or that leaving means rebuilding from scratch. */
export const moats = {
  title: 'Moats',
  items: [
    {
      n: '01',
      name: 'The Vybd launch model',
      body: 'Trained on every cross-border launch. It predicts demand in a new country before launch, plus landed cost and lead time by corridor, from home-market and US operating data no one else holds (11 brands today).',
    },
    {
      n: '02',
      name: 'Performance, not lock-in',
      body: 'Brands stay because we land goods cheaper and sell them faster, and they can leave with their data any time.',
      todo: 'Final copy from Ashwin.',
    },
    {
      n: '03',
      name: 'Corridor scale',
      body: "More brands per country, lower cost per brand. Pooled containers, shared hubs and partner rates single brands can't get.",
    },
  ] as { n: string; name: string; body: string; todo?: string }[],
}

export const projections = {
  eyebrow: 'Projections',
  title: '$22.1M run-rate by Q12',
  brandsLabel: 'Brands at end of year',
  brands: [
    { year: 'Y1', value: '23' },
    { year: 'Y2', value: '75' },
    { year: 'Y3', value: '153' },
  ],
  brandsNote: 'Launches ramp 3 → 25 per quarter; 2.5% quarterly churn.',
  perBrandLabel: 'Revenue per brand',
  perBrand: [
    { year: 'Y1', value: '$96K', calc: '$3K/mo + 12% × $500K' },
    { year: 'Y2', value: '$168K', calc: '$4K/mo + 12% × $1M' },
    { year: 'Y3', value: '$300K', calc: '$5K/mo + 12% × $2M' },
  ],
  arrLabel: 'ARR milestones',
  /* Only these four points are plotted; no interpolation. m = $ millions. */
  arr: [
    { q: 4, label: '$2.2M', m: 2.2 },
    { q: 8, label: '$8.8M', m: 8.8 },
    { q: 10, label: '$14.5M', m: 14.5 },
    { q: 12, label: '$22.1M', m: 22.1 },
  ],
  quarters: 12,
  footnote: 'Excludes current 11 brands, logistics margin and equity.',
}

export const equity = {
  eyebrow: 'Equity upside',
  title: 'Only a few need to win',
  scenario: 'If 5 of 60 brands reach $10M a year:',
  /* m = $ millions; all four bars are drawn to one scale. */
  steps: [
    { label: 'Combined revenue', value: '$50M', m: 50 },
    { label: 'EBITDA at 15%', value: '$7.5M', m: 7.5 },
    { label: 'Enterprise value at 8×', value: '$60M', m: 60 },
    { label: "Vybd's 50% stake", value: '≈ $30M', m: 30, highlight: true },
  ],
  caption: 'Illustrative 8× multiple; before debt and transaction costs.',
}

export const team = {
  title: 'Team',
  /* photo: path under public/, e.g. '/images/team/ashwin.jpg'. Initials show until then. */
  founders: [
    {
      name: 'Ashwin Dhanasamy', initials: 'AD', role: 'CEO', focus: 'Product, tech, strategy', photo: '',
      bio: 'Built products from 0 to 1 across three teams. MS in Machine Learning (Stevens). Open-source contributor.',
    },
    {
      name: 'Abhijit Shetty', initials: 'AS', role: 'COO', focus: 'Supply chain, ops, finance', photo: '',
      bio: "20+ years transforming global CPG (The Body Shop, L'Oréal), retail and e-commerce operations.",
    },
    {
      name: 'Ken Chester Jr', initials: 'KC', role: 'CMO', focus: 'Marketing, outreach', photo: '',
      bio: 'Antler Entrepreneur-in-Residence (2022). Raised NSF grant funding. Tech analyst, published in Yahoo News.',
    },
  ],
  behindLabel: 'Behind them',
  behind: [
    '3 senior operators (CPG, food and beverage, fashion, batteries, manufacturing)',
    'A 7-person product team (4 full-stack AI engineers, 3 product designers)',
  ],
}

export const raise = {
  eyebrow: 'The raise',
  title: '$3M seed: hubs, product, first brand stakes',
  fundsLabel: 'Use of funds',
  funds: [
    { label: 'Minority brand stakes', value: '$1.20M', pct: 40 },
    { label: 'Landing hubs + infrastructure', value: '$0.75M', pct: 25 },
    { label: 'Product', value: '$0.75M', pct: 25 },
    { label: 'GTM', value: '$0.30M', pct: 10 },
  ],
  milestonesLabel: '24-month milestones',
  milestones: [
    '40 brands on Vybd, en route to $12M',
    '4–6 minority brand stakes',
    'First US landing hub live',
    '−50% operator hours per customer',
  ],
  closing: 'The US is market one. Then every major trade corridor in the world.',
  cta: 'Book a call',
}
