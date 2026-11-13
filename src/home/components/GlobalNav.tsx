import { useEffect, useState } from 'react'
import { BOOK, LANGUAGES, NAV_LINKS, pickLanguage } from '@/home/data/nav'
import { Lockup } from './Logo'

/** base: '' on the home page; '/' elsewhere so #anchors point back to the home page. */
export function GlobalNav({ base = '', ribbon = true }: { base?: string; ribbon?: boolean }) {
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
      <header className="gnav">
        <div className="in">
          <a className="lg" href={base ? base : '#top'} aria-label="Vybd home"><Lockup /></a>
          <nav className="lks" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <a key={l.href} className="lk" href={to(l.href)}>{l.label}</a>
            ))}
          </nav>
          <span className="ic">
            <label className="lang" title="Language">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" /></svg>
              <span>EN</span>
              <select aria-label="Language" value="en" onChange={(e) => pickLanguage(e.target.value)}>
                {LANGUAGES.map(([code, name]) => <option key={code} value={code} lang={code}>{name}</option>)}
              </select>
            </label>
            <a className="pill fill book" href={BOOK.href}>{BOOK.label}</a>
            <button className="menu" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((o) => !o)}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">{open ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /> : <path d="M2 5.5h12M2 10.5h12" />}</svg>
            </button>
          </span>
        </div>
      </header>
      <nav className={'mnav' + (open ? ' open' : '')} id="mnav" aria-label="Menu" onClick={() => setOpen(false)}>
        {NAV_LINKS.map((l) => <a key={l.href} href={to(l.href)}>{l.label}</a>)}
        <a className="pill fill" href={BOOK.href}>{BOOK.label}</a>
      </nav>
      {ribbon && <div className="ribbon">New: test the US with one drop of up to 500 units. <a href="/test-drop">See the Test Drop</a></div>}
    </>
  )
}
