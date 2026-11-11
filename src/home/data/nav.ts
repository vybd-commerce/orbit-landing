import { rememberLocale, type Locale } from '@/i18n/locales'

/* Same links, same order as the SPA header (GLOBAL_NAV in
   src/pages/redesign/chrome.tsx). Keep the two in step. */
export const NAV_LINKS = [
  { href: '#chain', label: 'Supply Chain' },
  { href: '/us', label: 'Enter the US' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/product', label: 'How it works' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '#compare', label: 'Pricing' },
]

export const BOOK = { href: '/book', label: 'Book a call' }

export const LANGUAGES = [
  ['en', 'English'], ['zh', '中文'], ['ko', '한국어'], ['ja', '日本語'], ['fr', 'Français'], ['es', 'Español'],
] as const

export const FOOTER_GROUPS = [
  { title: 'Products', links: [['/product', 'Vybd Supply Chain'], ['/us', 'Vybd for the US'], ['/test-drop', 'Test Drop'], ['/enterprise', 'Vybd Enterprise'], ['#compare', 'Pricing']] },
  { title: 'Why Vybd', links: [['/essay', 'The essays'], ['#open', 'Our promises'], ['#plan', 'The plan'], ['#why', 'Where a price goes']] },
  { title: 'Customers', links: [['/case-studies', 'Case studies'], ['#calc', 'Profit calculator'], ['/us', 'Launch in the US']] },
  { title: 'Partners', links: [['/ecosystem', 'Join the network'], ['/ecosystem', 'Customs & compliance'], ['/ecosystem', '3PLs & freight']] },
  { title: 'Company', links: [['/essay', 'About'], ['/lab', 'Lab'], ['/book', 'Contact']] },
] as const

/* Picking a language remembers it (the middleware reads the cookie) and
   opens that locale's home. English stays on this page. */
export function pickLanguage(code: string) {
  rememberLocale(code as Locale)
  if (code !== 'en') window.location.href = `/${code}`
}
