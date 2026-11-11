import { useEffect, useRef, useState } from 'react'
import { Lockup } from './Logo'
import { STACK_TOTAL, USUAL_CHAIN, WITH_VYBD, money } from '@/home/data/stack'

type View = 'a' | 'b'

const CYCLE_MS = 5000
const PAUSE_AFTER_CLICK_MS = 10000

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Hero() {
  const [view, setView] = useState<View>(() => (prefersReducedMotion() ? 'b' : 'a'))
  const section = useRef<HTMLElement>(null)
  const pausedUntil = useRef(0)

  // Keep alternating between the two chains while the hero is visible.
  useEffect(() => {
    if (prefersReducedMotion()) return
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    if (section.current) io.observe(section.current)
    const id = window.setInterval(() => {
      if (!visible || document.hidden || Date.now() < pausedUntil.current) return
      setView((v) => (v === 'a' ? 'b' : 'a'))
    }, CYCLE_MS)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [])

  const pick = (v: View) => {
    pausedUntil.current = Date.now() + PAUSE_AFTER_CLICK_MS
    setView(v)
  }
  const data = view === 'a' ? USUAL_CHAIN : WITH_VYBD
  const rent = data.filter((d) => d.kind === 'rn').reduce((a, d) => a + d.amount, 0)

  return (
    <section className="tile full hero" id="why" ref={section}>
      <div className="copy">
        <div className="rv"><Lockup /></div>
        <h1 className="rv">Make it anywhere.<br /><em>Sell it everywhere.</em></h1>
        <p className="tag rv">We're bringing the cost of getting a product from the person who makes it to the person who uses it as close to zero as possible. Every cost that's left is visible, justified and earned.</p>
        <div className="links rv"><a className="pill fill" href="#chapters">Read the essay</a><a className="pill out" href="#compare">Find your Vybd</a></div>
        <div className="toggle rv" role="group" aria-label="Compare" data-view={view}>
          <button type="button" aria-pressed={view === 'a'} onClick={() => pick('a')}>The usual chain</button>
          <button type="button" aria-pressed={view === 'b'} onClick={() => pick('b')}>With Vybd</button>
        </div>
      </div>
      <div className="art"><div className="stackart rv">
        <div className="sbar" aria-live="polite">
          {data.map((d, i) => (
            <i key={i} className={d.kind + (d.amount ? '' : ' gone')} style={{ flexBasis: `${(d.amount / STACK_TOTAL) * 100}%` }}>
              <b>{d.amount ? money(d.amount) : ''}</b><small>{d.label}</small>
            </i>
          ))}
        </div>
        <div className="scap">
          <span>Maker keeps <b>{money(data[0].amount)}</b> · Rent in the chain <b>{money(rent)}</b></span>
          <span>Illustrative $40 product</span>
        </div>
      </div></div>
    </section>
  )
}
