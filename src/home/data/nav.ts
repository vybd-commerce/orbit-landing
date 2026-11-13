import { rememberLocale, type Locale } from '@/i18n/locales'

/* Same links, same order as the SPA header (GLOBAL_NAV in
   src/pages/redesign/chrome.tsx). Keep the two in step. */
export const NAV_LINKS = [
  { href: '/#start', label: 'Where are you today?' },
  { href: '/#how', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/ecosystem', label: 'Partners' },
]

export const BOOK = { href: '/book', label: 'Talk to us' }

export const LANGUAGES = [
  ['en', 'English'], ['zh', '中文'], ['ko', '한국어'], ['ja', '日本語'], ['fr', 'Français'], ['es', 'Español'],
] as const

export const FOOTER_GROUPS = [
  { title: 'Products', links: [['/waitlist?from=footer', 'Vybd Plan (early access)'], ['/test-drop', 'Test Drop'], ['/#pricing', 'US Launch'], ['/#pricing', 'US Scale'], ['/enterprise', 'Vybd Enterprise'], ['/#pricing', 'Pricing']] },
  { title: 'Why Vybd', links: [['/borderless', 'Borderless'], ['/essay', 'The essays'], ['/borderless#open', 'Our promises'], ['/borderless#plan', 'The plan'], ['/borderless#why', 'Where a price goes']] },
  { title: 'Customers', links: [['/case-studies', 'Case studies'], ['/#calc', 'Profit calculator'], ['/product', 'How the system works']] },
  { title: 'Partners', links: [['/ecosystem', 'Join the network'], ['/ecosystem#who', 'Customs, 3PLs & agencies'], ['/rainmaker', 'Rainmaker program']] },
  { title: 'Company', links: [['/essay', 'About'], ['/lab', 'Lab'], ['/askinkind', 'Ask In Kind'], ['/book', 'Contact']] },
] as const

/* Picking a language remembers it (the middleware reads the cookie) and
   opens that locale's home. English stays on this page. */
export function pickLanguage(code: string) {
  rememberLocale(code as Locale)
  if (code !== 'en') window.location.href = `/${code}`
}
