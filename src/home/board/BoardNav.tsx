import { useEffect, useState } from 'react'
import { Logo } from '@/home/components/Logo'

/* Hick's law: five destinations in the bar, one action; the rest live in
   the footer and the mobile menu. */
const LINKS = [
  { href: '#chain', label: 'Supply chain' },
  { href: '/us', label: 'Enter the US' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '#compare', label: 'Pricing' },
]

/** base: '' on the home page; '/' elsewhere so #anchors point back home. */
export function BoardNav({ base = '', notice = true }: { base?: string; notice?: boolean }) {
  const to = (href: string) => (href.startsWith('#') ? base + href : href)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="bnav">
        <div className="wrap">
          <a className="lg" href={base || '#top'} aria-label="Vybd home"><Logo onNavy />Vybd</a>
          <nav className="links" aria-label="Main">
            {LINKS.map((l) => <a key={l.href} href={to(l.href)}>{l.label}</a>)}
          </nav>
          <div className="end">
            <a className="plate go" href="/book">Book a call</a>
            <button className="menu" type="button" aria-label="Menu" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((o) => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 8h18M3 16h18" />}
              </svg>
            </button>
          </div>
        </div>
      </header>
      {notice && (
        <div className="notice"><div className="wrap">
          <span className="cap">New</span>
          <span>Test the US with one drop of up to 500 units. <a href="/test-drop">See the Test Drop</a></span>
        </div></div>
      )}
      <nav className={'mnav' + (open ? ' open' : '')} id="mnav" aria-label="Menu" onClick={() => setOpen(false)}>
        {LINKS.map((l) => <a key={l.href} href={to(l.href)}>{l.label}</a>)}
        <a href="/ecosystem">Partners</a>
        <a href={base ? '/essay' : '#chapters'}>Read the essay</a>
      </nav>
    </>
  )
}
