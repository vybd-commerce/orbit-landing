import type { CSSProperties } from 'react'
import { ProfitCalc } from './ProfitCalc'

const ENT_CELLS: (string | null)[] = [
  null, '0s', null, null, '1s', null, null, null, '2s', null, null, null, '.5s', null, null, null, null, '3s',
]
const LEDGER: [string, string][] = [
  ['Freight + customs', '−$3.40'], ['3PL + delivery', '−$9.40'], ['Ads + payments', '−$5.20'], ['Vybd, 12%', '−$4.80'],
]
const STAGES = [
  { n: 1, title: 'Operator', sub: 'Now · running launches end to end', now: true },
  { n: 2, title: 'Orchestrator', sub: 'Partners work on one shared record' },
  { n: 3, title: 'Network & capital', sub: 'Our data funds stock and freight' },
]
const PARTNER_SCORES: [string, number][] = [
  ['Customs brokers', 97], ['3PLs', 94], ['Freight', 88], ['Compliance', 99], ['Agencies', 81], ['Financiers', 100],
]
const VOWS: [string, string][] = [
  ['●', 'You own your customer.'], ['$', 'Every fee is visible.'], ['↗', 'Leaving is easy.'], ['✓', 'Value is checkable.'],
]
const mint: CSSProperties = { color: 'var(--mint)' }

export function TileGrid() {
  return (
    <div className="grid2">
      <section className="tile dark ent" id="ent">
        <div className="copy">
          <div className="eyebrow rv" style={mint}>For $50M+ operators</div>
          <h2 className="prod rv">Vybd Enterprise</h2>
          <p className="tag rv">AI agents for the whole operation.</p>
          <div className="links rv"><a className="more" href="/enterprise">Learn more</a><a className="more" href="/book">Talk to sales</a></div>
        </div>
        <div className="art"><div className="ent-art rv" aria-hidden="true">
          {ENT_CELLS.map((d, i) =>
            d === null ? <i key={i} /> : <i key={i} className="on" style={d !== '0s' ? { animationDelay: d } : undefined} />,
          )}
        </div></div>
      </section>

      <ProfitCalc />

      <section className="tile gray" id="open">
        <div className="copy">
          <div className="eyebrow rv">In the open</div>
          <h2 className="prod rv">Four promises.</h2>
          <p className="tag rv">If we work, we become the middleman. Here's what kind.</p>
          <div className="links rv"><a className="more" href="#chapters">Read why</a></div>
        </div>
        <div className="art"><div className="vows-art rv">
          {VOWS.map(([sym, text]) => <div className="vw" key={text}><span className="st">{sym}</span><b>{text}</b></div>)}
        </div></div>
      </section>

      <section className="tile" style={{ background: 'linear-gradient(180deg,#f2faf7,#e3f4ee)' }}>
        <div className="copy">
          <div className="eyebrow rv">The Vybd ledger</div>
          <h2 className="prod rv">Every cost, on the record.</h2>
          <p className="tag rv">See what each partner, and we, charged on every order.</p>
          <div className="links rv"><a className="more" href="#open">How it works</a></div>
        </div>
        <div className="art"><div className="ledger-art rv">
          <div className="h">EXAMPLE ORDER · ILLUSTRATIVE</div><hr />
          <div className="r"><span>Order total</span><b>$40.00</b></div><hr />
          {LEDGER.map(([k, v]) => <div className="r" key={k}><span>{k}</span><b>{v}</b></div>)}
          <hr />
          <div className="r t"><span>To the maker</span><b>$17.20</b></div>
        </div></div>
      </section>

      <section className="tile dark" id="plan">
        <div className="copy">
          <div className="eyebrow rv" style={mint}>The plan</div>
          <h2 className="prod rv">Three stages.</h2>
          <p className="tag rv">One lane at a time.</p>
          <div className="links rv"><a className="more" href="#chapters">See the gates</a></div>
        </div>
        <div className="art"><div className="plan-art rv">
          {STAGES.map((s) => (
            <div className={'st3' + (s.now ? ' now' : '')} key={s.n}><span className="n">{s.n}</span><div><b>{s.title}</b><span>{s.sub}</span></div></div>
          ))}
        </div></div>
      </section>

      <section className="tile gray" id="partners">
        <div className="copy">
          <div className="eyebrow rv">For partners</div>
          <h2 className="prod rv">Earn your place.</h2>
          <p className="tag rv">Real work, paid visibly, scored openly.</p>
          <div className="links rv"><a className="more" href="/ecosystem">Join the network</a></div>
        </div>
        <div className="art"><div className="partner-art rv">
          {PARTNER_SCORES.map(([k, v]) => <span key={k}>{k} <i>{v}</i></span>)}
        </div></div>
      </section>
    </div>
  )
}
