/* Copy for the English /us page (UsApp.tsx): "Build your business in America",
   ported from a shared design. Prices follow the offer map in PRODUCT.md and
   must match data/pricing.ts, data/testDrop.ts and the SPA /us pricing
   (src/pages/redesign/home/Pricing.tsx). */
import { DROP_FEE, DROP_MAX_UNITS, DROP_SHARE } from './testDrop'

export const BOOK_LAUNCH = '/book?for=launch'

/* "Alone, that's a different partner for every job": job, who you'd hire. */
export const WORKSTREAMS: [string, string][] = [
  ['Market research', 'Agency'], ['Compliance', 'Consultant'], ['Import & customs', 'Broker'], ['Warehousing', '3PL'],
  ['Distribution', 'Carrier'], ['Sales channels', 'Marketplace'], ['Marketing', 'Ad agency'], ['Customer support', 'Outsourcer'],
]

export type Capability = { q: string; t: string; p: string; tags: string[]; short: string; icon: string; dark?: boolean }

/* Six things a US business needs (SVG path data for a 24px stroke icon). */
export const CAPABILITIES: Capability[] = [
  { q: 'Where is the opportunity?', t: 'Understand your market', p: 'Demand, competitors and pricing, researched before you spend.', tags: ['Demand research', 'Competitor analysis', 'US pricing'], short: 'Market', icon: 'M4 19V9M10 19V5M16 19v-7M22 19H2' },
  { q: 'How do I get ready?', t: 'Get your business ready', p: 'US rules, labels and paperwork, handled so your products can come in.', tags: ['Regulatory compliance', 'Documentation', 'Import readiness'], short: 'Compliance', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5', dark: true },
  { q: 'How do products get here?', t: 'Get your products here', p: 'Freight, customs and warehousing, so stock is where you need it.', tags: ['Freight', 'Customs coordination', 'Warehousing', 'Inventory'], short: 'Logistics', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M5.2 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0M15.2 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0' },
  { q: 'How do I sell?', t: 'Build your sales channels', p: 'Your stores, listings and marketplaces, set up and managed.', tags: ['Marketplace setup', 'Product listings', 'Channel management'], short: 'Sales', icon: 'M3 4h2l2.4 11h11L21 8H7M8.1 19a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0M15.6 19a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0', dark: true },
  { q: 'How do I find customers?', t: 'Find your customers', p: 'Targeted campaigns that reach the right American buyers.', tags: ['Paid advertising', 'Audience targeting', 'Campaign management'], short: 'Marketing', icon: 'M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1zM17 8.5a5 5 0 0 1 0 7' },
  { q: 'How do I keep it running?', t: 'Run your day-to-day operations', p: 'Customer questions, returns and daily support, kept running.', tags: ['Customer support', 'Returns', 'Operational management'], short: 'Operations', icon: 'M4 13v-1a8 8 0 0 1 16 0v1M4.5 13h1A1.5 1.5 0 0 1 7 14.5v3A1.5 1.5 0 0 1 5.5 19h-1A1.5 1.5 0 0 1 3 17.5v-3A1.5 1.5 0 0 1 4.5 13zM18.5 13h1a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z', dark: true },
]

/* Who we help: each kind of business gets its own next step. */
export type Audience = {
  kicker: string
  name: string
  body: string
  cta: { href: string; label: string }
  aside?: { href: string; label: string }
  art: 'factory' | 'flags' | 'growth' | 'store'
  tone: 'dark' | 'gray' | 'mint'
}

export const AUDIENCES: Audience[] = [
  {
    kicker: 'Enter the US', name: 'Manufacturers', art: 'factory', tone: 'dark',
    body: 'You make it. We set up the US presence to sell it. No American office needed.',
    cta: { href: '/test-drop', label: 'Start with a Test Drop' },
    aside: { href: '#pricing', label: 'Or plan a full US Launch' },
  },
  {
    kicker: 'Expand your market', name: 'Growing international brands', art: 'flags', tone: 'gray',
    body: 'A hit at home. Ready for American customers.',
    cta: { href: BOOK_LAUNCH, label: 'Plan my US launch' },
    aside: { href: '#pricing', label: 'See US Launch pricing' },
  },
  {
    kicker: 'Scale your operations', name: 'US-based brands', art: 'growth', tone: 'mint',
    body: 'Already here. Ready to grow without the extra complexity.',
    cta: { href: '#pricing', label: 'See US Scale' },
    aside: { href: '/enterprise', label: '$50M+? See Enterprise' },
  },
  {
    kicker: 'Grow your US sales', name: 'Online sellers', art: 'store', tone: 'gray',
    body: 'US inventory, faster fulfillment, more American customers.',
    cta: { href: '/test-drop', label: 'Test the US with one drop' },
    aside: { href: '#pricing', label: 'See every option' },
  },
]

export type UsTier = {
  badge: string
  name: string
  price: string
  terms: string
  line: string
  points: string[]
  cta: { href: string; label: string }
  style: 'drop' | 'plain' | 'partner'
}

/* The US ladder, cheapest first. Same names and prices as everywhere else. */
export const US_TIERS: UsTier[] = [
  {
    badge: 'Early access', name: 'Vybd Plan', price: '$33/mo', terms: 'first week free · opening soon', style: 'partner',
    line: 'Work out whether, and how, to sell in the US.',
    points: ['US demand and competitors', 'Positioning and pricing', 'Which channels to start on', 'A US go-to-market plan'],
    cta: { href: '/waitlist?from=us', label: 'Get early access' },
  },
  {
    badge: `Up to ${DROP_MAX_UNITS} units`, name: 'Test Drop', price: `$${DROP_FEE.toLocaleString('en-US')}`, terms: `one time + ${Math.round(DROP_SHARE * 100)}% of US sales`, style: 'drop',
    line: 'One limited drop to test the US market.',
    points: [`Freight to the US for up to ${DROP_MAX_UNITS} units`, 'Customs clearance handled', '90 days of US warehousing', 'End-of-drop sales report'],
    cta: { href: '/test-drop', label: 'See the Test Drop' },
  },
  {
    badge: 'New to the US', name: 'US Launch', price: '$20,000', terms: 'paid once', style: 'plain',
    line: 'Landed, listed and selling 90 days from first stock.',
    points: ['Sourcing and manufacturer matching', 'FDA and compliance support, label review', 'Amazon, Walmart and Shopify set up', 'Listings, copy, images and video'],
    cta: { href: BOOK_LAUNCH, label: 'Start your launch' },
  },
  {
    badge: 'Already selling', name: 'US Scale', price: 'From $3,000/mo', terms: '+ 12% of US sales, plus shipping and warehousing', style: 'plain',
    line: 'Our agents and an operator run it with you.',
    points: ['Inventory, purchase orders, deductions and reporting', 'A senior operator, 8 hours a month', 'Ongoing content and listing updates', 'Monthly market and buyer research'],
    cta: { href: '/book?for=scale', label: 'Talk about US Scale' },
  },
]

export const FOOTNOTES = [
  'Results shown are from named Vybd customers. Results vary by business, and Vybd does not guarantee market entry, sales or growth.',
  'Vybd handles some work directly and coordinates other services through vetted partners; your plan shows who handles what. Vybd does not give legal, tax, immigration or financial advice.',
  'The Control Tower shown is an illustrative interface. Dollar figures in the calculator are illustrative examples, not quotes.',
]
