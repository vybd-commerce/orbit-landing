export const NAV_LINKS = [
  { href: '#why', label: 'Why Vybd' },
  { href: '#chain', label: 'Supply Chain' },
  { href: '#us', label: 'Enter the US' },
  { href: '#ent', label: 'Enterprise' },
  { href: '#compare', label: 'Pricing' },
  { href: '#partners', label: 'Partners' },
  { href: '#cases', label: 'Case Studies' },
]

export const FOOTER_GROUPS = [
  { title: 'Products', links: [['#chain', 'Vybd Supply Chain'], ['#us', 'Vybd for the US'], ['#ent', 'Vybd Enterprise'], ['#compare', 'Pricing']] },
  { title: 'Why Vybd', links: [['/essay', 'The essays'], ['#open', 'Our promises'], ['#plan', 'The plan'], ['#why', 'Where a price goes']] },
  { title: 'Customers', links: [['/case-studies', 'Case studies'], ['#calc', 'Profit calculator'], ['#us', 'Launch in the US']] },
  { title: 'Partners', links: [['#partners', 'Join the network'], ['#partners', 'Customs & compliance'], ['#partners', '3PLs & freight']] },
  { title: 'Company', links: [['#top', 'About'], ['#top', 'Lab'], ['#top', 'Contact']] },
] as const
