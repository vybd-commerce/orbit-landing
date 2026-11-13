import type { ReactNode } from 'react'
import { useReveal } from './hooks/useReveal'
import { GlobalNav } from './components/GlobalNav'
import { Footer } from './components/Footer'
import DropCalc from './components/testdrop/DropCalc'
import {
  BOOK, DROP_MAX_UNITS, FAQ, FLOW, FREIGHT_NOTE, GO_LIVE, INCLUDED, NEXT, ORIGINS,
  PILLARS, PROOF, TIERS, WE_OWN, YOU_COVER, YOU_OWN,
} from './data/testDrop'
import { CASE_STUDIES_URL } from './data/cases'
import './styles/test-drop.css'

/* /test-drop: the "Sell in the US" deck as a page we can send to brands
   outside the US instead of a PDF. Ported from orbit-landing and restyled
   in this site's tiles and type. Order follows the deck: hero, how it works,
   who does what, the offer, a calculator, pricing ladder, proof, next steps,
   FAQ, closing call. Copy lives in data/testDrop.ts; styles in
   styles/test-drop.css under .td. Served at /test-drop from test-drop.html (vercel.json). */

const LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'The Test Drop', href: '#drop' },
  { label: 'Your numbers', href: '#numbers' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const Ticks = ({ items, plain }: { items: string[]; plain?: boolean }) => (
  <ul className={'td-ticks' + (plain ? ' plain' : '')}>{items.map((x) => <li key={x}>{x}</li>)}</ul>
)

function Head({ kicker, children, sub }: { kicker: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <header className="td-head">
      <div className="eyebrow rv">{kicker}</div>
      <h2 className="rv">{children}</h2>
      {sub && <p className="rv">{sub}</p>}
    </header>
  )
}

function Sec({ id, gray, children }: { id: string; gray?: boolean; children: ReactNode }) {
  return <section id={id} className={'td-sec' + (gray ? ' gray' : '')}><div className="td-in">{children}</div></section>
}

export default function TestDropApp() {
  useReveal()
  return (
    <div className="td">
      <GlobalNav base="/" ribbon={false} />
      <nav className="snav" aria-label="Test Drop">
        <div className="in">
          <b>Test Drop</b>
          {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <a className="buy" href={BOOK}>Talk to us</a>
        </div>
      </nav>

      <main id="top">
        <section className="tile td-hero">
          <div className="copy">
            <div className="eyebrow rv">For brands outside the US</div>
            <h1 className="rv">Sell in the US.<br />Start with <em>one</em> drop.</h1>
            <p className="tag rv">From import and storage to fulfillment, reporting and AI-enabled operations, without building your own US team.</p>
            <div className="links rv">
              <a className="pill fill" href={BOOK}>Tell us about your brand</a>
              <a className="pill out" href="#numbers">Run your numbers</a>
            </div>
            <ul className="td-facts rv" aria-label="Test Drop at a glance">
              <li><b>$3,000</b> one time + 15% of US sales</li>
              <li><b>Up to {DROP_MAX_UNITS} units</b> with freight on us*</li>
              <li><b>{GO_LIVE}</b> to go live</li>
            </ul>
          </div>
        </section>

        <Sec id="how" gray>
          <Head kicker="How it works" sub="You make it and sell it. We handle everything in between.">
            From your factory to a US <em>doorstep.</em>
          </Head>
          <ol className="td-flow">
            {FLOW.map((s, n) => (
              <li key={s.title} className={'rv ' + s.who}>
                <span className="n">{n + 1}</span>
                <small>{s.who === 'you' ? 'You' : 'Vybd'}</small>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="td-pillars">
            {PILLARS.map(([h, p]) => <div key={h} className="rv"><b>{h}</b><p>{p}</p></div>)}
          </div>
        </Sec>

        <Sec id="split">
          <Head kicker="Who does what">You own the <em>brand.</em><br />We own the operations.</Head>
          <div className="td-split rv">
            <div className="you"><h3>You</h3><Ticks items={YOU_OWN} /></div>
            <div className="us"><h3>Vybd</h3><Ticks items={WE_OWN} /></div>
          </div>
          <p className="td-fine">*On the Test Drop, Vybd covers freight to the US for up to {DROP_MAX_UNITS} units, depending on dimensions and weight.</p>
        </Sec>

        <Sec id="drop" gray>
          <Head kicker="The Test Drop">One limited drop to <em>test</em> the US market.</Head>
          <div className="td-offer rv">
            <div className="price">
              <b>$3,000</b><span>one time</span><em>+ 15% of US sales</em>
              <a className="pill fill" href={BOOK}>Tell us about your brand</a>
            </div>
            <div><h3>Included</h3><Ticks items={INCLUDED} /></div>
            <div><h3>You cover</h3><Ticks items={YOU_COVER} plain /></div>
          </div>
          <p className="td-fine">*{FREIGHT_NOTE}</p>
        </Sec>

        <Sec id="numbers">
          <Head
            kicker="Your numbers"
            sub="Start from our example, a sold-out drop of 500 tees at $38, then put in your own product. You also leave with real data: which designs sold, at what price, in which cities, and what it costs to serve a US customer."
          >
            What a drop <em>leaves you.</em>
          </Head>
          <DropCalc />
          <p className="td-fine">Illustrative. Duty rates vary by product; postage and card fees are estimates. Not a quote.</p>
        </Sec>

        <Sec id="pricing" gray>
          <Head kicker="Pricing" sub="Grow at the pace your sales justify.">Start with one drop.<br />Then <em>scale.</em></Head>
          <div className="td-tiers">
            {TIERS.map((t) => (
              <article key={t.name} className={'rv ' + t.style}>
                <span className="badge">{t.badge}</span>
                <h3>{t.name}</h3>
                <div className="amt">{t.price}</div>
                <p className="terms">{t.terms}</p>
                {t.line && <p className="line">{t.line}</p>}
                <Ticks items={t.points} />
                <a className={'pill ' + (t.style === 'plain' ? 'out' : 'fill')} href={t.href ?? BOOK}>{t.cta}</a>
              </article>
            ))}
          </div>
          <p className="td-fine">*{FREIGHT_NOTE}</p>
        </Sec>

        <Sec id="proof">
          <Head kicker={`Proof: ${PROOF.brand}`} sub={PROOF.about}>Real operating results.<br /><em>Not just a promise.</em></Head>
          <div className="td-stats">
            {PROOF.stats.map(([n, l], k) => <div key={l} className={'rv' + (k === 2 ? ' hi' : '')}><b>{n}</b><span>{l}</span></div>)}
          </div>
          <div className="td-story rv">
            {PROOF.story.map(([k, p]) => <div key={k}><small>{k}</small><p>{p}</p></div>)}
          </div>
          <p className="td-fine">{PROOF.note}</p>
          <div className="td-origins rv">
            <span>We work with brands and manufacturers from</span>
            <ul>{ORIGINS.map((o) => <li key={o}>{o}</li>)}</ul>
            <a className="more" href="/work/bayangrom">Read the Bayangrom story</a>
            <a className="more" href={CASE_STUDIES_URL}>More case studies</a>
          </div>
        </Sec>

        <Sec id="steps" gray>
          <Head kicker="Next steps">Your first US drop,<br />in <em>four</em> steps.</Head>
          <div className="td-next">
            {NEXT.map(([tag, h, p], n) => (
              <article key={h} className="rv">
                <div className="num">{String(n + 1).padStart(2, '0')} <span>{tag}</span></div>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </Sec>

        <Sec id="faq">
          <Head kicker="FAQ">Questions brands<br /><em>ask us first.</em></Head>
          <div className="td-faq rv">
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </Sec>

        <section className="tile dark td-close">
          <div className="copy">
            <h2 className="rv">Your first US drop<br /><em>starts with one call.</em></h2>
            <p className="tag rv">Two short questions about your brand, your audience and your goals. We reply by email with what a Test Drop would look like for you.</p>
            <div className="links rv"><a className="pill fill" href={BOOK}>Tell us about your brand</a></div>
          </div>
        </section>
      </main>
      <Footer base="/" />
    </div>
  )
}
