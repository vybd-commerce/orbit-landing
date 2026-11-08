import { PLANS, type Plan } from '@/home/data/pricing'

function PlanIcon({ kind }: { kind: Plan['icon'] }) {
  if (kind === 'chain')
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 18V9M10 18V5M16 18v-7M22 18H2" /></svg>
  if (kind === 'us')
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></svg>
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  )
}

export function Compare() {
  return (
    <section className="cmp" id="compare">
      <h2>Which Vybd is right for you?</h2>
      <div className="cols">
        {PLANS.map((p) => (
          <div className="col" key={p.name}>
            <span className="ico" style={{ background: p.iconBg, color: p.iconFg }}><PlanIcon kind={p.icon} /></span>
            <h3>{p.name}</h3>
            <div className="pr">{p.price}</div>
            <div className="ds">{p.desc}</div>
            <ul>{p.features.map((f) => <li key={f.text} className={f.no ? 'no' : undefined}>{f.text}</li>)}</ul>
            <div className="links"><a className={'pill ' + p.cta.style} href={p.cta.href}>{p.cta.label}</a></div>
            {p.aside && <a className="more aside" href={p.aside.href}>{p.aside.label}</a>}
          </div>
        ))}
      </div>
    </section>
  )
}
