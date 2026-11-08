import { useEffect, useRef, useState } from 'react'
import { STACK_TOTAL, USUAL_CHAIN, WITH_VYBD, money, type Seg } from '@/home/data/stack'
import { Flap } from './Flap'

type View = 'a' | 'b'
const CYCLE_MS = 6500
const PAUSE_AFTER_CLICK_MS = 12000
const ROW_STAGGER = 140
const SHARE_CELLS = 20 // one cell per $2 of the $40

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const STATUS: Record<Seg['kind'], string> = { mk: 'Maker', sv: 'Service', rn: 'Rent', vb: 'Vybd' }
const label = (d: Seg) => (d.amount ? d.label : 'Rent in chain')
const status = (d: Seg) => (d.amount ? STATUS[d.kind] : 'Removed')
const tone = (d: Seg) => (d.kind === 'rn' ? (d.amount ? 'rent' : 'go') : d.kind === 'sv' ? '' : 'go')
const rentOf = (c: Seg[]) => c.filter((d) => d.kind === 'rn').reduce((a, d) => a + d.amount, 0)

export function Hero() {
  const [view, setView] = useState<View>(() => (prefersReducedMotion() ? 'b' : 'a'))
  const section = useRef<HTMLElement>(null)
  const pausedUntil = useRef(0)

  // Keep alternating between the two chains while the board is on screen.
  useEffect(() => {
    if (prefersReducedMotion()) return
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    if (section.current) io.observe(section.current)
    const id = window.setInterval(() => {
      if (!visible || document.hidden || Date.now() < pausedUntil.current) return
      setView((v) => (v === 'a' ? 'b' : 'a'))
    }, CYCLE_MS)
    return () => { io.disconnect(); window.clearInterval(id) }
  }, [])

  const pick = (v: View) => { pausedUntil.current = Date.now() + PAUSE_AFTER_CLICK_MS; setView(v) }
  const data = view === 'a' ? USUAL_CHAIN : WITH_VYBD
  const other = view === 'a' ? WITH_VYBD : USUAL_CHAIN

  return (
    <section className="hero" id="why" ref={section}>
      <div className="wrap">
        <h1 className="disp">borderless<span>.</span></h1>
        <div className="copy">
          <p className="lede">We're bringing the cost of getting a product from the person who makes it to the person who uses it as close to zero as possible. <b>Every cost that's left is visible, justified and earned.</b></p>
          <div className="acts">
            <a className="plate ink" href="#compare">Find your Vybd</a>
            <a className="plate line" href="#chapters">Read the essay</a>
          </div>
        </div>

        <div className="board" data-view={view}>
          <div className="top">
            <span className="cap">Where a <b>$40</b> price goes · illustrative</span>
            <div className="switch" role="group" aria-label="Compare chains">
              <button type="button" aria-pressed={view === 'a'} onClick={() => pick('a')}>The usual chain</button>
              <button type="button" aria-pressed={view === 'b'} onClick={() => pick('b')}>With Vybd</button>
            </div>
          </div>
          <div className="heads" aria-hidden="true">
            <span className="cap">Cost</span><span className="cap">Amount</span><span className="cap c-share">Share of $40</span><span className="cap">Status</span>
          </div>
          <div className="rows" aria-live="polite">
            {data.map((d, i) => {
              const on = Math.round((d.amount / STACK_TOTAL) * SHARE_CELLS)
              const delay = i * ROW_STAGGER
              return (
                <div className={'row ' + d.kind} key={i}>
                  <Flap text={label(d)} len={18} delay={delay} className="c-l" />
                  <Flap text={money(d.amount)} len={6} delay={delay + 60} align="right" className={'c-a' + (d.kind === 'mk' ? ' go' : '')} />
                  <span className="share" aria-hidden="true">
                    {Array.from({ length: SHARE_CELLS }, (_, k) => <s key={k} className={k < on ? 'on' : undefined} style={{ transitionDelay: `${delay + k * 18}ms` }} />)}
                  </span>
                  <Flap text={status(d)} len={7} delay={delay + 120} className={'c-s ' + tone(d)} />
                </div>
              )
            })}
          </div>
          <div className="foot">
            <div>
              <span className="cap">Maker keeps</span>
              <Flap text={money(data[0].amount)} len={6} className="mid go" delay={900} />
              <small>{view === 'a' ? 'With Vybd' : 'Usual chain'}: <b>{money(other[0].amount)}</b></small>
            </div>
            <div>
              <span className="cap">Rent in the chain</span>
              <Flap text={money(rentOf(data))} len={6} className={'mid ' + (rentOf(data) ? 'rent' : 'go')} delay={1000} />
              <small>{view === 'a' ? 'With Vybd' : 'Usual chain'}: <b>{money(rentOf(other))}</b></small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
