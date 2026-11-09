import type { ReactNode } from 'react'
import { useReveal } from './hooks/useReveal'
import { BoardNav } from './board/BoardNav'
import { BoardFooter } from './board/BoardFooter'
import { Flap } from './board/Flap'
import DropCalc from './components/testdrop/DropCalc'
import {
  BOOK, DROP_MAX_UNITS, FAQ, FLOW, FREIGHT_NOTE, GO_LIVE, INCLUDED, NEXT, ORIGINS,
  PILLARS, PROOF, TIERS, WE_OWN, YOU_COVER, YOU_OWN,
} from './data/testDrop'
import { CASE_STUDIES_URL } from './data/cases'
import './styles/testdrop.css'

/* /test-drop: the "Sell in the US" deck as a page we can send to brands
   outside the US instead of a PDF, in the board world (DESIGN.md). Order
   follows the deck: hero, how it works, who does what, the offer, a
   calculator, pricing ladder, proof, next steps, FAQ, closing call. Copy
   lives in data/testDrop.ts; page styles in styles/testdrop.css under .td.
   Served at /test-drop from test-drop.html (vercel.json). */

const LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'The Test Drop', href: '#drop' },
  { label: 'Your numbers', href: '#numbers' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const Check = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
const Dot = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="3.5" /></svg>
const Ticks = ({ items, plain }: { items: string[]; plain?: boolean }) => (
  <ul className={'td-ticks' + (plain ? ' plain' : '')}>{items.map((x) => <li key={x}>{plain ? <Dot /> : <Check />}{x}</li>)}</ul>
)

function Head({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="head">
      <h2 className="h2 rv">{children}</h2>
      {sub && <p className="lede rv">{sub}</p>}
    </div>
  )
}

export default function TestDropApp() {
  useReveal()
  return (
    <div className="td">
      <BoardNav base="/" notice={false} />
      <nav className="snav" aria-label="Test Drop">
        <div className="wrap">
          <b>Test Drop</b>
          <span className="lk">{LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</span>
        </div>
      </nav>

      <main id="top">
        <section className="hero td-hero">
          <div className="wrap">
            <h1 className="disp">Sell in the US. Start with one drop<span>.</span></h1>
            <div className="copy">
              <span className="who">For brands outside the US</span>
              <p className="lede">From import and storage to fulfillment, reporting and AI-enabled operations, without building your own US team.</p>
              <div className="acts">
                <a className="plate go" href={BOOK}>Book a 30-minute intro</a>
                <a className="plate line" href="#numbers">Run your numbers</a>
              </div>
            </div>
            <div className="board td-facts" aria-label="Test Drop at a glance">
              <div className="top"><span className="cap">Test Drop · <b>at a glance</b></span></div>
              {[
                ['One time', '$3,000', 'go'],
                ['US sales share', '15%', ''],
                ['Units', `Up to ${DROP_MAX_UNITS}`, ''],
                ['Freight to US', 'On us*', 'go'],
                ['Go live', GO_LIVE.replace('–', '-'), ''],
              ].map(([k, v, t], i) => (
                <div className="frow" key={k}>
                  <span className="cap">{k}</span>
                  <Flap text={v} len={10} align="right" delay={i * 120} className={'mid ' + t} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec dark" id="how">
          <div className="wrap">
            <Head sub="You make it and sell it. We handle everything in between.">From your factory to a US doorstep.</Head>
            <ol className="td-flow">
              {FLOW.map((s, n) => (
                <li key={s.title} className="rv">
                  <span className="n">{n + 1}</span>
                  <Flap text={s.who === 'you' ? 'You' : 'Vybd'} len={4} className={s.who === 'you' ? '' : 'go'} />
                  <b>{s.title}</b>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="td-pillars">
              {PILLARS.map(([h, p]) => <div key={h} className="rv"><h3 className="h3">{h}</h3><p>{p}</p></div>)}
            </div>
          </div>
        </section>

        <section className="sec" id="split">
          <div className="wrap">
            <Head>You own the brand. We own the operations.</Head>
            <div className="td-split rv">
              <div className="panel"><div className="ttl cap"><span>You</span><b>Brand</b></div><Ticks items={YOU_OWN} /></div>
              <div className="panel"><div className="ttl cap"><span>Vybd</span><b>Operations</b></div><Ticks items={WE_OWN} /></div>
            </div>
            <p className="note">*On the Test Drop, Vybd covers freight to the US for up to {DROP_MAX_UNITS} units, depending on dimensions and weight.</p>
          </div>
        </section>

        <section className="sec tight" id="drop">
          <div className="wrap">
            <Head>One limited drop to test the US market.</Head>
            <div className="td-offer rv">
              <div className="board price">
                <span className="cap">Test Drop</span>
                <Flap text="$3,000" len={6} className="big go" />
                <span className="terms">one time + 15% of US sales</span>
                <a className="plate go" href={BOOK}>Book a 30-minute intro</a>
              </div>
              <div><h3 className="h3">Included</h3><Ticks items={INCLUDED} /></div>
              <div><h3 className="h3">You cover</h3><Ticks items={YOU_COVER} plain /></div>
            </div>
            <p className="note">*{FREIGHT_NOTE}</p>
          </div>
        </section>

        <section className="sec hall2" id="numbers">
          <div className="wrap">
            <Head sub="Start from our example, a sold-out drop of 500 tees at $38, then put in your own product. You also leave with real data: which designs sold, at what price, in which cities, and what it costs to serve a US customer.">
              What a drop leaves you.
            </Head>
            <DropCalc />
            <p className="note">Illustrative. Duty rates vary by product; postage and card fees are estimates. Not a quote.</p>
          </div>
        </section>

        <section className="sec" id="pricing">
          <div className="wrap">
            <Head sub="Grow at the pace your sales justify.">Start with one drop. Then scale.</Head>
            <div className="td-tiers">
              {TIERS.map((t) => (
                <article key={t.name} className={'fare rv' + (t.style === 'drop' ? ' feat' : '')}>
                  <span className="cap badge">{t.badge}</span>
                  <h3 className="h3">{t.name}</h3>
                  <div className="pr">{t.price}</div>
                  <p className="ds">{t.terms}</p>
                  {t.line && <p className="line">{t.line}</p>}
                  <ul>{t.points.map((p) => <li key={p}><Check />{p}</li>)}</ul>
                  <div className="acts"><a className={'plate ' + (t.style === 'drop' ? 'go' : 'line')} href={BOOK}>{t.cta}</a></div>
                </article>
              ))}
            </div>
            <p className="note">*{FREIGHT_NOTE}</p>
          </div>
        </section>

        <section className="sec dark" id="proof">
          <div className="wrap">
            <Head sub={PROOF.about}>Real operating results. Not just a promise.</Head>
            <div className="td-stats">
              <div className="board">
                <div className="top"><span className="cap">Proof · <b>{PROOF.brand}</b></span></div>
                {PROOF.stats.map(([n, l], k) => (
                  <div className="frow" key={l}><span className="cap">{l}</span><Flap text={n} len={8} align="right" delay={k * 140} className={'mid ' + (k === 2 ? 'go' : '')} /></div>
                ))}
              </div>
              <div className="td-story">
                {PROOF.story.map(([k, p]) => <div key={k} className="rv"><span className="cap">{k}</span><p>{p}</p></div>)}
              </div>
            </div>
            <p className="note">{PROOF.note}</p>
            <div className="td-origins rv">
              <span>We work with brands and manufacturers from</span>
              <ul>{ORIGINS.map((o) => <li key={o}><Flap text={o} len={o.length} /></li>)}</ul>
              <a className="textlink" href={CASE_STUDIES_URL}>Read the case studies</a>
            </div>
          </div>
        </section>

        <section className="sec" id="steps">
          <div className="wrap">
            <Head>Your first US drop, in four steps.</Head>
            <ol className="td-next">
              {NEXT.map(([tag, h, p], n) => (
                <li key={h} className="rv">
                  <span className="n">{n + 1}</span>
                  <h3 className="h3">{h}</h3>
                  <span className="cap tag">{tag}</span>
                  <p>{p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec tight" id="faq">
          <div className="wrap">
            <Head>Questions brands ask us first.</Head>
            <div className="essay td-faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary><span className="h3">{q}</span><span className="pm" aria-hidden="true" /></summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="dark td-close">
          <div className="wrap">
            <h2 className="h2 rv">Your first US drop starts with one call.</h2>
            <p className="lede rv">30 minutes on your brand, your audience and your goals. Leave with a clear view of what a Test Drop would look like for you.</p>
            <div className="acts rv"><a className="plate go" href={BOOK}>Book a 30-minute intro</a></div>
          </div>
        </section>
      </main>
      <BoardFooter base="/" notes={false} />
    </div>
  )
}
