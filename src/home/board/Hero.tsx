import { useState } from 'react'
import { STACK_TOTAL, USUAL_CHAIN, WITH_VYBD, money, type Seg } from '@/home/data/stack'
import { Flap } from './Flap'
import { prefersReducedMotion, useInView, useSequence } from './motion'

/* The $40 board tells one story, once, when it comes into view:
   Act 1, the usual chain flips in row by row and the rent lands in pink.
   Act 2, each rent row flips to what replaces it with Vybd, so "Rent in the
   chain" counts down to $0; the maker row changes last, landing on what the
   maker keeps. Then the board holds. The tabs jump straight to either chain
   (cancelling the story) and Replay plays it again. */

type View = 'a' | 'b'
const ROW_STAGGER = 140
const SHARE_CELLS = 20 // one cell per $2 of the $40
const ACT_ONE_MS = 2600 // rows flipped in, plus a beat to read them
const ROW_FLIP_MS = 650
// Act 2 order: the rent rows first, then the services, the maker last.
const FLIP_ORDER = [2, 3, 4, 5, 1, 0]

const STATUS: Record<Seg['kind'], string> = { mk: 'Maker', sv: 'Service', rn: 'Rent', vb: 'Vybd' }
const label = (d: Seg) => (d.amount ? d.label : 'Rent in chain')
const status = (d: Seg) => (d.amount ? STATUS[d.kind] : 'Removed')
const tone = (d: Seg) => (d.kind === 'rn' ? (d.amount ? 'rent' : 'go') : d.kind === 'sv' ? '' : 'go')
const all = (v: View) => USUAL_CHAIN.map(() => v)

export function Hero() {
  const [ref, seen] = useInView<HTMLDivElement>()
  const [rows, setRows] = useState<View[]>(() => all(prefersReducedMotion() ? 'b' : 'a'))
  const [run, setRun] = useState(0)

  const cancel = useSequence(
    [
      [ACT_ONE_MS, () => {}],
      ...FLIP_ORDER.map((i, n): [number, () => void] => [n ? ROW_FLIP_MS : 0, () => setRows((r) => r.map((v, k) => (k === i ? 'b' : v)))]),
    ],
    seen,
    run,
  )

  const jump = (v: View) => { cancel(); setRows(all(v)) }
  const replay = () => { cancel(); setRows(all('a')); setRun((n) => n + 1) }

  const data = rows.map((v, i) => (v === 'a' ? USUAL_CHAIN : WITH_VYBD)[i])
  const rent = data.filter((d) => d.kind === 'rn').reduce((a, d) => a + d.amount, 0)
  const view: View = rows.every((v) => v === 'a') ? 'a' : 'b'
  const settled = rows.every((v) => v === rows[0])

  return (
    <section className="hero" id="why">
      <div className="wrap">
        <h1 className="disp"><em>borderless</em><span>.</span></h1>
        <div className="copy">
          <p className="lede">We're bringing the cost of getting a product from the person who makes it to the person who uses it as close to zero as possible. <b>Every cost that's left is visible, justified and earned.</b></p>
          <div className="acts">
            <a className="plate go" href="#compare">Find your Vybd</a>
            <a className="textlink" href="#chapters">Read the essay</a>
          </div>
        </div>

        <div className="board" data-view={view} ref={ref}>
          <div className="top">
            <span className="cap">Where a <b>$40</b> price goes · illustrative</span>
            <div className="ctl">
              <div className="switch" role="group" aria-label="Compare chains">
                <button type="button" aria-pressed={view === 'a' && settled} onClick={() => jump('a')}>The usual chain</button>
                <button type="button" aria-pressed={view === 'b' && settled} onClick={() => jump('b')}>With Vybd</button>
              </div>
              <button type="button" className="replay" onClick={replay} aria-label="Replay the story">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" /><path d="M2.5 2.5v3h3" /></svg>
                Replay
              </button>
            </div>
          </div>
          <div className="heads" aria-hidden="true">
            <span className="cap">Cost</span><span className="cap">Amount</span><span className="cap c-share">Share of $40</span><span className="cap">Status</span>
          </div>
          <div className="rows">
            {data.map((d, i) => {
              const on = Math.round((d.amount / STACK_TOTAL) * SHARE_CELLS)
              const delay = rows[i] === 'a' ? i * ROW_STAGGER : 0
              return (
                <div className={'row ' + d.kind + (rows[i] === 'b' ? ' flipped' : '')} key={i}>
                  <Flap text={label(d)} len={18} delay={delay} className="c-l" />
                  <span className="c-t">{label(d)}</span>
                  <Flap text={money(d.amount)} len={6} delay={delay + 60} align="right" className={'c-a' + (d.kind === 'mk' ? ' go' : '')} />
                  <span className="share" aria-hidden="true">
                    {Array.from({ length: SHARE_CELLS }, (_, k) => <s key={k} className={k < on ? 'on' : undefined} style={{ transitionDelay: `${delay + k * 18}ms` }} />)}
                  </span>
                  <Flap text={status(d)} len={7} delay={delay + 120} className={'c-s ' + tone(d)} />
                </div>
              )
            })}
          </div>
          <p className="sr" aria-live="polite">{settled ? `${view === 'a' ? 'The usual chain' : 'With Vybd'}: the maker keeps ${money(data[0].amount)} of $40, and ${money(rent)} is rent in the chain.` : ''}</p>
          <div className="foot">
            <div>
              <span className="cap">Maker keeps</span>
              <Flap text={money(data[0].amount)} len={6} className="mid go" delay={200} />
              <small>{data[0] === USUAL_CHAIN[0] ? 'With Vybd' : 'Usual chain'}: <b>{money((data[0] === USUAL_CHAIN[0] ? WITH_VYBD : USUAL_CHAIN)[0].amount)}</b></small>
            </div>
            <div>
              <span className="cap">Rent in the chain</span>
              <Flap text={money(rent)} len={6} className={'mid ' + (rent ? 'rent' : 'go')} delay={200} />
              <small>Usual chain: <b>{money(USUAL_CHAIN.filter((d) => d.kind === 'rn').reduce((a, d) => a + d.amount, 0))}</b></small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
