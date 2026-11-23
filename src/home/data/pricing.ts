export type Plan = {
  name: string
  price: string
  desc: string
  icon: 'chain' | 'us' | 'ent'
  iconBg: string
  iconFg: string
  features: { text: string; no?: boolean }[]
  cta: { href: string; label: string; style: 'fill' | 'out' }
  /** Optional text link under the CTA. */
  aside?: { href: string; label: string }
}

export const PLANS: Plan[] = [
  {
    name: 'Vybd Supply Chain', price: 'From $33/mo', desc: 'For brands already selling who want it to cost less.',
    icon: 'chain', iconBg: '#0f1b33', iconFg: '#1BB59B',
    features: [{ text: 'Inventory & purchasing' }, { text: 'Partner scoring' }, { text: 'Landed cost per SKU' }, { text: 'Invoice reconciliation' }, { text: 'US launch services', no: true }],
    cta: { href: '/signup', label: 'Start free for a week', style: 'fill' },
  },
  {
    name: 'Vybd for the US', price: '$20K launch · $3K/mo + 12%', desc: 'For makers outside the US ready to sell here.',
    icon: 'us', iconBg: '#E8F7F3', iconFg: '#17A088',
    features: [{ text: 'Market research' }, { text: 'Compliance & importer of record' }, { text: 'Freight, customs, US warehouse' }, { text: 'Listings & marketing' }, { text: 'Everything in Supply Chain' }],
    cta: { href: '/us', label: 'Plan my launch', style: 'fill' },
    aside: { href: '/test-drop', label: 'Not ready? Start with a $3,000 Test Drop' },
  },
  {
    name: 'Vybd Enterprise', price: 'Custom', desc: 'For $50M+ operators running many lanes.',
    icon: 'ent', iconBg: '#0b1326', iconFg: '#fff',
    features: [{ text: 'AI agents across the operation' }, { text: 'Dedicated senior operators' }, { text: 'Partner network on your terms' }, { text: 'Custom integrations' }, { text: 'Everything in Vybd for the US' }],
    cta: { href: '/book', label: 'Talk to sales', style: 'out' },
  },
]
