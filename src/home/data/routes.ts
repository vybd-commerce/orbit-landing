/* One card per kind of visitor on the home page ("Where are you today?").
   The offer map these follow is in PRODUCT.md (Capabilities and Constraints). */
export type Route = {
  k: string
  title: string
  body: string
  offer: string
  cta: { href: string; label: string }
  aside?: { href: string; label: string }
  dark?: boolean
}

export const ROUTES: Route[] = [
  {
    k: 'I make products outside the US',
    title: 'Sell in the US without moving there.',
    body: 'We handle research, compliance, freight, customs, the US warehouse and your listings.',
    offer: 'Test Drop from $3,000 · US Launch $20,000',
    cta: { href: '/#who', label: 'Plan my US launch' },
    aside: { href: '/test-drop', label: 'Not sure yet? Test with one drop' },
  },
  {
    k: 'I already sell in the US',
    title: 'Make it cost less to run.',
    body: 'Our agents and an operator run inventory, purchase orders, deductions and reporting with you.',
    offer: 'US Scale from $3K/mo + 12% of US sales',
    cta: { href: '/#pricing', label: 'See US Scale' },
    aside: { href: '/book?for=scale', label: 'Or talk to an operator' },
  },
  {
    k: 'I run a $50M+ operation',
    title: 'Run many lanes tighter.',
    body: 'AI agents and a dedicated operator on top of NetSuite, SAP, Dynamics 365 or Odoo. Your systems stay.',
    offer: 'Vybd Enterprise · Custom pricing',
    cta: { href: '/enterprise', label: 'See Enterprise' },
    aside: { href: '/book?for=enterprise', label: 'Or talk to an operator' },
    dark: true,
  },
  {
    k: 'I work with brands',
    title: 'Get work from brands coming to the US.',
    body: 'Customs brokers, freight, 3PLs and agencies join the network. Local representatives bring brands from home.',
    offer: 'Vybd Ecosystem · Rainmaker program',
    cta: { href: '/ecosystem', label: 'Join the network' },
    aside: { href: '/rainmaker', label: 'Local rep outside the US? Become a Rainmaker' },
  },
]
