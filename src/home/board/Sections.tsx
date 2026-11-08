import { useState } from 'react'
import { CHAPTERS } from '@/home/data/chapters'
import { CASE_STUDIES_URL } from '@/home/data/cases'
import { PLANS } from '@/home/data/pricing'
import { Flap } from './Flap'

const Check = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
const Dash = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 8h8" /></svg>
const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>

/* ---------- the two paths ---------- */

const PARTNERS: [string, number, boolean?][] = [
  ['3PL · Reno', 94], ['Customs broker', 97], ['Ocean freight', 88], ['Ads agency', 61, true], ['Supplier · Busan', 91],
]
const AGENTS = [
  { title: 'Reorder 1,200 units, SKU-114', sub: 'Stock runs out in 19 days', st: 'Queued', tone: '' },
  { title: 'Invoice mismatch, $412', sub: '3PL storage, flagged for an operator', st: 'Flagged', tone: 'rent' },
  { title: 'Listings synced, 4 channels', sub: 'Amazon, Shopify, Walmart, TikTok', st: 'Done', tone: 'go' },
]
const cells = (score: number) => Array.from({ length: 10 }, (_, k) => <s key={k} className={k < Math.round(score / 10) ? 'on' : undefined} />)

export function SupplyChain() {
  return (
    <section className="path dark" id="chain">
      <div className="wrap">
        <div className="copy">
          <h2 className="h2 rv">Vybd Supply Chain</h2>
          <span className="who rv">For brands already selling</span>
          <p className="lede rv">Run it better. <b>Pay only for what earns its place.</b></p>
          <div className="acts rv">
            <a className="plate go" href="/signup">Start for $33/mo</a>
            <a className="plate line" href="/product">Learn more</a>
          </div>
        </div>
        <div className="panels rv">
          <div className="panel">
            <div className="ttl cap"><span>Landed cost / unit</span><b>Live</b></div>
            <div className="kpi"><Flap text="$9.42" len={5} className="mid" /><small>−18% vs Q2</small></div>
          </div>
          <div className="panel">
            <div className="ttl cap"><span>Partners, scored</span><b>6</b></div>
            {PARTNERS.slice(0, 3).map(([n, s, lo]) => (
              <div className={'score' + (lo ? ' lo' : '')} key={n}><span>{n}</span><span className="bar">{cells(s)}</span><b>{s}</b></div>
            ))}
          </div>
          <div className="panel wide">
            <div className="ttl cap"><span>Agents today</span><b>3 running</b></div>
            {AGENTS.map((a) => (
              <div className="prow" key={a.title}>
                <span className="lbl">{a.title}</span>
                <span className="st"><Flap text={a.st} len={7} className={a.tone} /></span>
                <span className="sub">{a.sub}</span>
              </div>
            ))}
          </div>
          <p className="note">Example data.</p>
        </div>
      </div>
    </section>
  )
}

const ARRIVALS = [
  { goods: 'Spices', from: 'India', st: 'Cleared', tone: 'go' },
  { goods: 'Skincare', from: 'Korea', st: 'On time', tone: '' },
  { goods: 'Electronics', from: 'China', st: 'Landing', tone: '' },
]

export function ForTheUS() {
  return (
    <section className="path flip hall" id="us">
      <div className="wrap">
        <div className="copy">
          <h2 className="h2 rv">Vybd for the US</h2>
          <span className="who rv">For makers outside the US</span>
          <p className="lede rv">Made anywhere. <b>Sold in the US.</b></p>
          <div className="acts rv">
            <a className="plate ink" href="/us">Plan my launch</a>
            <a className="plate line" href="/test-drop">Start with a Test Drop</a>
          </div>
        </div>
        <div className="rv">
          <div className="panel">
            <div className="ttl cap"><span>Arrivals · USA</span><b>Ship to USA</b></div>
            {ARRIVALS.map((a) => (
              <div className="prow" key={a.goods}>
                <span className="lbl"><Flap text={a.goods} len={11} /></span>
                <span className="st"><Flap text={a.st} len={7} className={a.tone} /></span>
                <span className="sub">From {a.from}</span>
              </div>
            ))}
          </div>
          <p className="note">Illustrative.</p>
        </div>
      </div>
    </section>
  )
}

/* ---------- enterprise + calculator ---------- */

const AOV = 40
const BILLABLE_LB = Math.ceil(Math.max(1.5, (12 * 9 * 5) / 139))
const UNIT_LOGISTICS = 5.5 + 1.2 * Math.max(0, BILLABLE_LB - 1) + 2.5 + 0.5 + 0.5 + 0.6
const SPLIT = [
  { name: 'Product cost', color: '#575d66' },
  { name: 'Logistics', color: '#8a9099' },
  { name: 'Marketing', color: '#b7bcc3' },
  { name: 'Vybd', color: '#111316' },
  { name: 'You keep', color: '#1bb59b' },
]
function model(rev: number) {
  const logistics = (rev / AOV) * UNIT_LOGISTICS
  const cogs = rev * 0.15
  const mkt = rev * 0.1
  const vybd = rev * 0.12 + 36000
  const keep = rev - cogs - mkt - logistics - vybd
  const parts = [cogs, logistics, mkt, vybd, Math.max(0, keep)]
  const total = parts.reduce((a, b) => a + b, 0)
  return { keep, shares: parts.map((p) => p / total) }
}
const fmt = (n: number) => n.toLocaleString('en-US')
const CALC_CELLS = 40

export function EnterpriseAndCalc() {
  const [rev, setRev] = useState(250000)
  const { keep, shares } = model(rev)
  // Paint 40 cells by cumulative share so the row reads like a lit board.
  const bounds = shares.map((_, i) => shares.slice(0, i + 1).reduce((a, b) => a + b, 0))
  const colorAt = (k: number) => SPLIT[Math.max(0, bounds.findIndex((b) => (k + 0.5) / CALC_CELLS <= b + 1e-9))].color
  const kept = (keep < 0 ? '-$' : '$') + fmt(Math.abs(Math.round(keep)))

  return (
    <div className="duo">
      <section className="dark" id="ent">
        <div className="inner">
          <h2 className="h2 rv">Vybd Enterprise</h2>
          <span className="who rv">For $50M+ operators</span>
          <p className="lede rv">AI agents for the whole operation.</p>
          <div className="acts rv">
            <a className="plate go" href="/enterprise">Learn more</a>
            <a className="plate line" href="/book">Talk to sales</a>
          </div>
          <div className="panel duties rv" style={{ background: 'var(--cell)' }}>
            <div className="ttl cap"><span>On duty</span><b>Agents + operator</b></div>
            {['Reorders', 'Deductions', 'Reporting'].map((d) => (
              <div className="prow" key={d}><span className="lbl"><Flap text={d} len={10} /></span><span className="st"><Flap text="Running" len={7} className="go" /></span></div>
            ))}
          </div>
        </div>
      </section>
      <section className="hall" id="calc">
        <div className="inner">
          <h2 className="h2 rv">Run your numbers.</h2>
          <p className="lede rv">See what you'd keep after every cost.</p>
          <div className="calc rv">
            <div className="lab"><label htmlFor="rev">Yearly US sales</label><b>${fmt(rev)}</b></div>
            <input id="rev" type="range" min={50000} max={2000000} step={10000} value={rev} onChange={(e) => setRev(+e.target.value)} />
            <div className="res">You'd keep about</div>
            <Flap text={kept} len={9} align="right" className={'big ' + (keep < 0 ? 'rent' : 'go')} />
            <div className="cells" aria-hidden="true">
              {Array.from({ length: CALC_CELLS }, (_, k) => <s key={k} style={{ background: colorAt(k) }} />)}
            </div>
            <div className="legend" aria-hidden="true">{SPLIT.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>)}</div>
            <p className="note">Illustrative model: $40 orders, 15% product cost, 10% marketing. <a className="textlink" href="/test-drop#numbers">Try the full calculator</a></p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- promises, ledger, plan, partners ---------- */

const ICONS = {
  customer: <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="22" cy="14" r="7" /><path d="M8 38c1.5-8 7.5-12 14-12s12.5 4 14 12" /></svg>,
  fee: <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 22 22 6h16v16L22 38z" /><circle cx="31" cy="13" r="2.5" /></svg>,
  leave: <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6H8v32h10" /><path d="M20 22h18M31 15l7 7-7 7" /></svg>,
  check: <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="22" cy="22" r="16" /><path d="M14 22.5l5.5 5.5L31 16" /></svg>,
}
const VOWS: [keyof typeof ICONS, string][] = [
  ['customer', 'You own your customer.'], ['fee', 'Every fee is visible.'], ['leave', 'Leaving is easy.'], ['check', 'Value is checkable.'],
]
const LEDGER: [string, string][] = [
  ['Freight + customs', '−$3.40'], ['3PL + delivery', '−$9.40'], ['Ads + payments', '−$5.20'], ['Vybd, 12%', '−$4.80'],
]
const STAGES = [
  { title: 'Operator', sub: 'Running launches end to end', st: 'Now', tone: 'go' },
  { title: 'Orchestrator', sub: 'Partners work on one shared record', st: 'Next', tone: 'dim' },
  { title: 'Network & capital', sub: 'Our data funds stock and freight', st: 'Then', tone: 'dim' },
]
const PARTNER_SCORES: [string, number][] = [
  ['Customs brokers', 97], ['3PLs', 94], ['Freight', 88], ['Compliance', 99], ['Agencies', 81], ['Financiers', 100],
]

export function Promises() {
  return (
    <section className="sec" id="open">
      <div className="wrap">
        <div className="head">
          <h2 className="h2 rv">Four promises.</h2>
          <p className="lede rv">If we work, we become the middleman. Here's what kind. <a className="textlink" href="#chapters">Read why</a></p>
        </div>
        <div className="signs">
          {VOWS.map(([icon, text]) => <div className="sign rv" key={text}>{ICONS[icon]}<b>{text}</b></div>)}
        </div>
      </div>
    </section>
  )
}

export function Record() {
  return (
    <section className="sec tight" id="plan">
      <div className="wrap trio">
        <div>
          <h3 className="h3 rv">Every cost, on the record.</h3>
          <p className="rv">See what each partner, and we, charged on every order.</p>
          <div className="panel rv">
            <div className="ttl cap"><span>Example order · illustrative</span><b>$40.00</b></div>
            {LEDGER.map(([k, v]) => <div className="lrow" key={k}><span>{k}</span><b>{v}</b></div>)}
            <div className="lrow tot"><span>To the maker</span><b>$17.20</b></div>
          </div>
        </div>
        <div>
          <h3 className="h3 rv">Three stages.</h3>
          <p className="rv">One lane at a time. <a className="textlink" href="#chapters">See the gates</a></p>
          <div className="panel rv">
            <div className="ttl cap"><span>The plan</span><b>Stage 1 of 3</b></div>
            {STAGES.map((s) => (
              <div className="stage" key={s.title}>
                <span className="lbl">{s.title}</span>
                <span className="st"><Flap text={s.st} len={4} className={s.tone} /></span>
                <span className="sub">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
        <div id="partners">
          <h3 className="h3 rv">Earn your place.</h3>
          <p className="rv">Real work, paid visibly, scored openly. <a className="textlink" href="/ecosystem">Join the network</a></p>
          <div className="panel rv">
            <div className="ttl cap"><span>Partner scores · examples</span><b>/100</b></div>
            {PARTNER_SCORES.map(([k, v]) => (
              <div className="score" key={k}><span>{k}</span><span className="bar">{cells(v)}</span><b>{v}</b></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- cases ---------- */

export function Cases() {
  return (
    <section className="cases" id="cases">
      <div className="wrap">
        <div>
          <h2 className="h2 rv">Makers who made it here.</h2>
          <p className="lede rv">From six countries to US shelves and screens.</p>
        </div>
        <a className="plate ink rv" href={CASE_STUDIES_URL}>See all stories <Arrow /></a>
      </div>
    </section>
  )
}

/* ---------- the essay ---------- */

export function Essay() {
  return (
    <section className="sec" id="chapters">
      <div className="wrap">
        <div className="head">
          <h2 className="h2 rv">The essay, in five parts.</h2>
          <p className="lede rv">Why Vybd exists. <a className="textlink" href="/essay">Read it in full</a></p>
        </div>
        <div className="essay">
          {CHAPTERS.map((c, i) => (
            <details key={c.title}>
              <summary>
                <span className="pn">PART {i + 1}</span>
                <span className="h3">{c.title}</span>
                <p>{c.preview}</p>
                <span className="pm" aria-hidden="true" />
              </summary>
              <div className="body">
                <span />
                <div className="q">{c.quote}</div>
                <div>{c.body}</div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- pricing ---------- */

export function Fares() {
  return (
    <section className="sec" id="compare">
      <div className="wrap">
        <div className="head">
          <h2 className="h2 rv">Which Vybd is right for you?</h2>
          <p className="lede rv">Every fee is visible.</p>
        </div>
        <div className="fares">
          {PLANS.map((p, i) => (
            <div className={'fare rv' + (i === 1 ? ' feat' : '')} key={p.name}>
              <h3 className="h3">{p.name}</h3>
              <div className="pr">{p.price}</div>
              <div className="ds">{p.desc}</div>
              <ul>{p.features.map((f) => <li key={f.text} className={f.no ? 'no' : undefined}>{f.no ? <Dash /> : <Check />}{f.no ? <><span className="sr">Not included: </span>{f.text}</> : f.text}</li>)}</ul>
              <div className="acts"><a className={'plate ' + (p.cta.style === 'fill' ? 'go' : 'line')} href={p.cta.href}>{p.cta.label}</a></div>
              {p.aside && <a className="aside" href={p.aside.href}>{p.aside.label}</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
