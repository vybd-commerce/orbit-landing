export const NAV_LINKS = [
  { href: '#why', label: 'Why Vybd' },
  { href: '#chain', label: 'Supply Chain' },
  { href: '/us', label: 'Enter the US' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '#compare', label: 'Pricing' },
  { href: '/ecosystem', label: 'Partners' },
  { href: '/case-studies', label: 'Case Studies' },
]

export const FOOTER_GROUPS = [
  { title: 'Products', links: [['/product', 'Vybd Supply Chain'], ['/us', 'Vybd for the US'], ['/test-drop', 'Test Drop'], ['/enterprise', 'Vybd Enterprise'], ['#compare', 'Pricing']] },
  { title: 'Why Vybd', links: [['/essay', 'The essays'], ['#open', 'Our promises'], ['#plan', 'The plan'], ['#why', 'Where a price goes']] },
  { title: 'Customers', links: [['/case-studies', 'Case studies'], ['#calc', 'Profit calculator'], ['/us', 'Launch in the US']] },
  { title: 'Partners', links: [['/ecosystem', 'Join the network'], ['/ecosystem', 'Customs & compliance'], ['/ecosystem', '3PLs & freight']] },
  { title: 'Company', links: [['/essay', 'About'], ['/lab', 'Lab'], ['/book', 'Contact']] },
] as const
