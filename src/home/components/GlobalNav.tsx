import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/home/data/nav'
import { Logo } from './Logo'

/** base: '' on the home page; '/' elsewhere so #anchors point back to the home page. */
export function GlobalNav({ base = '', ribbon = true }: { base?: string; ribbon?: boolean }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="gnav">
        <div className="in">
          <a className="lg" href={base ? base : '#top'} aria-label="Vybd"><Logo />Vybd</a>
          {NAV_LINKS.map((l) => (
            <a key={l.href} className="lk" href={base + l.href}>{l.label}</a>
          ))}
          <span className="ic">
            <a href={base ? '/essay' : '#chapters'} aria-label="Read the essay">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 2.5h7l3 3v8H3z" /><path d="M5.5 7.5h5M5.5 10h5" /></svg>
            </a>
            <a href={base + '#compare'} aria-label="Language">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" /></svg>
            </a>
            <button className="menu" type="button" aria-label="Menu" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((o) => !o)}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 5.5h12M2 10.5h12" /></svg>
            </button>
          </span>
        </div>
      </header>
      <nav className={'mnav' + (open ? ' open' : '')} id="mnav" aria-label="Menu" onClick={() => setOpen(false)}>
        {NAV_LINKS.slice(0, 6).map((l, i) => (
          <span key={l.href}>{i > 0 && <br />}<a href={base + l.href}>{l.label}</a></span>
        ))}
      </nav>
      {ribbon && <div className="ribbon">New: why we built Vybd, in our own words. <a href="#chapters">Read the essay</a></div>}
    </>
  )
}
