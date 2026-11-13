export type Plan = {
  name: string
  price: string
  desc: string
  icon: 'plan' | 'chain' | 'us' | 'ent'
  iconBg: string
  iconFg: string
  features: { text: string; no?: boolean }[]
  cta: { href: string; label: string; style: 'fill' | 'out' }
  /** Optional text link under the CTA. */
  aside?: { href: string; label: string }
}

/* The offer map (PRODUCT.md): Vybd Plan (self-serve, early access) → Test
   Drop → US Launch → US Scale → Enterprise. Prices must match /us
   (src/pages/redesign/home/Pricing.tsx) and /test-drop (testDrop.ts). */
export const PLANS: Plan[] = [
  {
    name: 'Vybd Plan', price: '$33/mo · early access', desc: 'For makers working out whether, and how, to sell in the US.',
    icon: 'plan', iconBg: '#E8F7F3', iconFg: '#0E7C68',
    features: [{ text: 'US demand and competitors' }, { text: 'Positioning and pricing' }, { text: 'Which channels to start on' }, { text: 'A US go-to-market plan' }, { text: 'Our team does the work', no: true }],
    cta: { href: '/waitlist?from=compare', label: 'Get early access', style: 'out' },
  },
  {
    name: 'Vybd for the US', price: '$20K launch · then $3K/mo + 12%', desc: 'For makers outside the US ready to sell here.',
    icon: 'us', iconBg: '#0f1b33', iconFg: '#1BB59B',
    features: [{ text: 'Market research' }, { text: 'Compliance & importer of record' }, { text: 'Freight, customs, US warehouse' }, { text: 'Listings & marketing' }, { text: 'Run day to day on US Scale' }],
    cta: { href: '/us', label: 'Plan my launch', style: 'fill' },
    aside: { href: '/test-drop', label: 'Not ready? Start with a $3,000 Test Drop' },
  },
  {
    name: 'US Scale', price: 'From $3K/mo + 12%', desc: 'For brands already selling in the US who want it to cost less.',
    icon: 'chain', iconBg: '#E8F7F3', iconFg: '#17A088',
    features: [{ text: 'Inventory & purchasing' }, { text: 'Landed cost per SKU' }, { text: 'Deductions & invoice reconciliation' }, { text: 'Partner scoring' }, { text: 'A senior operator' }],
    cta: { href: '/us#pricing', label: 'See US Scale', style: 'fill' },
    aside: { href: '/book?for=scale', label: 'Talk to an operator' },
  },
  {
    name: 'Vybd Enterprise', price: 'Custom', desc: 'For $50M+ operators running many lanes.',
    icon: 'ent', iconBg: '#0b1326', iconFg: '#fff',
    features: [{ text: 'AI agents across the operation' }, { text: 'Dedicated senior operators' }, { text: 'Partner network on your terms' }, { text: 'NetSuite, SAP, Dynamics 365, Odoo' }, { text: 'Everything in US Scale' }],
    cta: { href: '/enterprise', label: 'See Enterprise', style: 'out' },
    aside: { href: '/book?for=enterprise', label: 'Talk to an operator' },
  },
]
