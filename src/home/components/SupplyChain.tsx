const PARTNERS: [string, number, boolean?][] = [
  ['3PL · Reno', 94], ['Customs broker', 97], ['Ocean freight', 88], ['Ads agency', 61, true], ['Supplier · Busan', 91],
]
const AGENTS = [
  { title: 'Reorder 1,200 units, SKU-114', sub: 'Stock runs out in 19 days', warn: false },
  { title: 'Invoice mismatch, $412', sub: '3PL storage, flagged for an operator', warn: true },
  { title: 'Listings synced, 4 channels', sub: 'Amazon, Shopify, Walmart, TikTok', warn: false },
]
const SPARK = 'M0 14 L20 18 L40 16 L60 26 L80 24 L100 34 L120 38 L140 36 L160 46 L180 50 L200 54'

export function SupplyChain() {
  return (
    <section className="tile full dark" id="chain">
      <div className="copy">
        <div className="eyebrow rv" style={{ color: 'var(--mint)' }}>For brands already selling in the US</div>
        <h2 className="prod rv">US Scale</h2>
        <p className="tag big rv">Run it better. <em style={{ color: 'var(--mint)' }}>Pay only for what earns its place.</em></p>
        <div className="links rv"><a className="pill fill" href="/us#pricing">From $3K/mo + 12%</a><a className="pill out" href="/product">How it works</a></div>
      </div>
      <div className="art"><div className="ops-art rv">
        <div className="panel p1">
          <h5>Landed cost / unit <span>● live</span></h5>
          <div className="kpi">$9.42<small>−18% vs Q2</small></div>
          <svg className="spark" viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1BB59B" stopOpacity=".45" /><stop offset="1" stopColor="#1BB59B" stopOpacity="0" /></linearGradient></defs>
            <path d={SPARK + ' L200 70 L0 70Z'} fill="url(#g1)" />
            <path d={SPARK} fill="none" stroke="#1BB59B" strokeWidth="2" />
          </svg>
        </div>
        <div className="panel">
          <h5>Partners, scored <span>6</span></h5>
          <div className="rows">
            {PARTNERS.map(([name, score, low]) => (
              <div className="rw" key={name}><span>{name}</span><span className="bar"><i className={low ? 'lo' : undefined} style={{ width: `${score}%` }} /></span><em>{score}</em></div>
            ))}
          </div>
        </div>
        <div className="panel p3">
          <h5>Agents today <span>3 running</span></h5>
          {AGENTS.map((a) => (
            <div className="agent" key={a.title}><i className={'d' + (a.warn ? ' w' : '')} /><div><b>{a.title}</b><span>{a.sub}</span></div></div>
          ))}
        </div>
      </div></div>
    </section>
  )
}
