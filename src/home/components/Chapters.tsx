import { useEffect, useRef, useState } from 'react'
import { CHAPTERS } from '@/home/data/chapters'

const STEP = 392
const partLabel = (i: number) => 'PART ' + String(i + 1).padStart(2, '0')

export function Chapters() {
  const scroller = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [overflows, setOverflows] = useState(true)

  // Only show prev/next when the cards don't all fit.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (active === null) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active])

  const scrollBy = (dx: number) => scroller.current?.scrollBy({ left: dx, behavior: 'smooth' })
  const ch = active === null ? null : CHAPTERS[active]

  return (
    <>
      <section className="chap" id="chapters">
        <div className="hd"><h2>The essay, in five parts. <span>Why Vybd exists.</span></h2><a className="readfull" href="/essay">Read full →</a></div>
        <div className="scroller" ref={scroller}>
          {CHAPTERS.map((c, i) => (
            <button key={c.title} type="button" className={'cc' + (c.dark ? ' dk' : '')} onClick={() => setActive(i)}>
              <span className="num">{partLabel(i)}</span>
              <h3>{c.title}</h3>
              <p>{c.preview}</p>
              <div className="q">{c.quote}</div>
              <span className="plus" aria-hidden="true">+</span>
            </button>
          ))}
        </div>
        <div className="nav" hidden={!overflows}>
          <button type="button" aria-label="Previous" onClick={() => scrollBy(-STEP)}>‹</button>
          <button type="button" aria-label="Next" onClick={() => scrollBy(STEP)}>›</button>
        </div>
      </section>

      <div
        className={'modal' + (ch ? ' open' : '')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mh"
        onClick={(e) => e.target === e.currentTarget && setActive(null)}
      >
        <div className="mbox">
          <button className="x" type="button" aria-label="Close" ref={closeBtn} onClick={() => setActive(null)}>×</button>
          {ch && active !== null && (
            <>
              <div className="num">{partLabel(active)}</div>
              <h3 id="mh">{ch.title}</h3>
              <div>{ch.body}</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
