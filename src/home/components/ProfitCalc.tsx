import { useState } from 'react'

/** Same model as the full calculator. Defaults: $40 AOV, 15% COGS, 10% marketing, 1.5lb, 12x9x5in box. */
const AOV = 40
const BILLABLE_LB = Math.ceil(Math.max(1.5, (12 * 9 * 5) / 139))
const UNIT_LOGISTICS = 5.5 + 1.2 * Math.max(0, BILLABLE_LB - 1) + 2.5 + 0.5 + 0.5 + 0.6
const SPLIT_COLORS = ['#0f1b33', '#475569', '#94a3b8', '#9fe3d4', '#1BB59B']

function model(rev: number) {
  const logistics = (rev / AOV) * UNIT_LOGISTICS
  const cogs = rev * 0.15
  const mkt = rev * 0.1
  const vybd = rev * 0.12 + 36000
  const keep = rev - cogs - mkt - logistics - vybd
  const parts = [cogs, logistics, mkt, vybd, Math.max(0, keep)]
  const total = parts.reduce((a, b) => a + b, 0)
  return { keep, shares: parts.map((p) => (p / total) * 100) }
}

const fmt = (n: number) => n.toLocaleString('en-US')

export function ProfitCalc() {
  const [rev, setRev] = useState(250000)
  const { keep, shares } = model(rev)

  return (
    <section className="tile gray" id="calc">
      <div className="copy">
        <div className="eyebrow rv">Profit calculator</div>
        <h2 className="prod rv">Run your numbers.</h2>
        <p className="tag rv">See what you'd keep after every cost.</p>
        <div className="links rv"><a className="more" href="#us">Try the full calculator</a></div>
      </div>
      <div className="art"><div className="calc-art rv">
        <div className="lab"><span>Yearly US sales</span><b>${fmt(rev)}</b></div>
        <input type="range" min={50000} max={2000000} step={10000} value={rev} aria-label="Yearly US sales" onChange={(e) => setRev(+e.target.value)} />
        <div className="res">You'd keep about</div>
        <div className="num" style={keep < 0 ? { color: '#dc2626' } : undefined}>
          {(keep < 0 ? '−$' : '$') + fmt(Math.abs(Math.round(keep)))}
        </div>
        <div className="split" aria-hidden="true">
          {shares.map((s, i) => <i key={i} style={{ background: SPLIT_COLORS[i], flex: `0 0 ${s}%` }} />)}
        </div>
      </div></div>
    </section>
  )
}
