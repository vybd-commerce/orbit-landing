import type { ReactNode } from 'react'
import { useReveal } from './hooks/useReveal'
import { Lockup } from './components/Logo'
import { GlobalNav } from './components/GlobalNav'
import { Footer } from './components/Footer'
import { Em } from './components/fundraise/Em'
import { Moats } from './components/fundraise/Moats'
import { PositioningMap } from './components/fundraise/PositioningMap'
import {
  BOOK, EMAIL, ESSAY_URL, competition, equity, hero, market, model, problem,
  projections, raise, solution, team, thesis, traction,
} from './data/fundRaise'
import './styles/fund-raise.css'

/* /fundraise (old path /fund-raise redirects here): the seed deck as a page for investors. Reachable by URL only:
   noindex (fund-raise.html + an X-Robots-Tag header in vercel.json), not in
   the sitemap, the nav or any link on the site. It still wears the site's
   global nav and footer so investors can wander into the rest of vybd.ai. Copy and numbers live in
   data/fundRaise.ts; styles in styles/fund-raise.css under .fr. Sections
   alternate white and navy canvases. */

type Canvas = 'white' | 'navy'

function Sec({ id, canvas, children }: { id: string; canvas: Canvas; children: ReactNode }) {
  return (
    <section id={id} className={'fr-sec ' + canvas} aria-labelledby={`${id}-h`}>
      <div className="fr-in">{children}</div>
    </section>
  )
}

function Head({ id, eyebrow, title, sub }: { id: string; eyebrow?: string; title: string; sub?: ReactNode }) {
  return (
    <header className="fr-head">
      {eyebrow && <div className="fr-eyebrow rv">{eyebrow}</div>}
      <h2 id={`${id}-h`} className="rv"><Em text={title} /></h2>
      {sub && <p className="fr-sub rv">{sub}</p>}
    </header>
  )
}

const Chips = ({ items, tone }: { items: string[]; tone?: 'tint' | 'line' }) => (
  <ul className={'fr-chips ' + (tone ?? 'line')}>{items.map((x) => <li key={x}>{x}</li>)}</ul>
)

const Label = ({ children }: { children: ReactNode }) => <h3 className="fr-label">{children}</h3>

export default function FundRaiseApp() {
  useReveal()
  const arrMax = Math.max(...projections.arr.map((a) => a.m))
  const eqMax = Math.max(...equity.steps.map((s) => s.m))

  return (
    <>
    <GlobalNav base="/" ribbon={false} />
    <div className="fr">
      <main id="top">
        {/* 1. Hero */}
        <section className="fr-sec navy fr-hero" aria-labelledby="hero-h">
          <div className="fr-in">
            <div className="fr-bar rv"><Lockup /></div>
            <div className="fr-hero-meta rv">
              <span className="fr-pill-chip">{hero.round}</span>
              <span className="fr-audience">{hero.audience}</span>
            </div>
            <h1 id="hero-h" className="rv">
              {hero.lines.map((l) => <span key={l}><Em text={l} /></span>)}
            </h1>
            <p className="fr-lead rv">{hero.sub}</p>
            <div className="fr-ctas rv">
              <a className="fr-btn fill" href={BOOK}>{hero.cta}</a>
              <a className="fr-btn out" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
          </div>
        </section>

        {/* 2. Problem */}
        <Sec id="problem" canvas="white">
          <Head id="problem" eyebrow={problem.eyebrow} title={problem.title} />
          <div className="rv"><Chips items={problem.boxes} /></div>
          <p className="fr-foot rv">{problem.footer}</p>
        </Sec>

        {/* 3. Solution (white, set off from the problem by a hairline) */}
        <Sec id="solution" canvas="white">
          <Head id="solution" eyebrow={solution.eyebrow} title={solution.title} />
          <div className="fr-sol">
            <div className="fr-decide rv">
              <Label>{solution.brandLabel}</Label>
              <ol className="fr-steps">
                {solution.decisions.map((d) => (
                  <li key={d.n}><span className="fr-dot">{d.n}</span><div><b>{d.title}</b><span>{d.body}</span></div></li>
                ))}
              </ol>
              <div className="fr-stat">
                <b>{solution.stat.value}</b><span>{solution.stat.label}</span>
              </div>
            </div>
            <div className="fr-layers rv">
              <Label>{solution.layersLabel}</Label>
              {solution.layers.map((l) => (
                <article key={l.name} className="fr-card">
                  <h4>{l.name}</h4>
                  <Chips items={l.items} tone="tint" />
                </article>
              ))}
            </div>
          </div>
        </Sec>

        {/* 4. Thesis */}
        <Sec id="thesis" canvas="navy">
          <Head id="thesis" eyebrow={thesis.eyebrow} title={thesis.title} sub={thesis.line} />
          <div className="fr-flow rv" role="group" aria-label="How goods and work move">
            <div className="fr-node">{thesis.flow.producer}</div>
            <span className="fr-arrow" aria-hidden="true" />
            <div className="fr-node core">
              <span className="fr-core-name">{thesis.flow.vybd}</span>
              <ul>{thesis.flow.vybdLines.map((l) => <li key={l}>{l}</li>)}</ul>
            </div>
            <span className="fr-arrow" aria-hidden="true" />
            <div className="fr-node">{thesis.flow.customer}</div>
          </div>
          <div className="fr-partners rv">
            <span className="fr-drop" aria-hidden="true" />
            <Chips items={thesis.partners} />
            <p>{thesis.partnersCaption}</p>
          </div>

          <Label>{thesis.commitmentsLabel}</Label>
          <ul className="fr-commit">
            {thesis.commitments.map((c) => <li key={c} className="fr-card rv"><span className="fr-tick" aria-hidden="true" />{c}</li>)}
          </ul>

          <Label>{thesis.stagesLabel}</Label>
          <ol className="fr-stages">
            {thesis.stages.map((s) => (
              <li key={s.n} className={'rv' + (s.now ? ' now' : '')}>
                <span className="fr-dot">{s.n}</span>
                <div>
                  <b>{s.name}{s.now && <span className="fr-now">{thesis.nowLabel}</span>}</b>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="fr-more rv"><a href={ESSAY_URL}>{thesis.essayLink}</a></p>
        </Sec>

        {/* 5. Business model */}
        <Sec id="model" canvas="white">
          <Head id="model" eyebrow={model.eyebrow} title={model.title} />
          <table className="fr-table rv">
            <thead><tr>{model.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>
              {model.rows.map((r) => (
                <tr key={r.stream}>
                  <td data-label={model.columns[0]} className="step">{r.step}</td>
                  <th scope="row" data-label={model.columns[1]}>{r.stream}</th>
                  <td data-label={model.columns[2]} className="price">{r.price}</td>
                  <td data-label={model.columns[3]} className="detail">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fr-band rv"><b>{model.band.title}:</b> {model.band.body}</p>
        </Sec>

        {/* 6. Traction */}
        <Sec id="traction" canvas="navy">
          <Head id="traction" eyebrow={traction.eyebrow} title={traction.title} />
          <ul className="fr-stats">
            {traction.stats.map((s) => <li key={s.label} className="fr-card rv"><b>{s.value}</b><span>{s.label}</span></li>)}
          </ul>
          <div className="fr-trac">
            <div className="rv">
              <Label>{traction.customersLabel}</Label>
              <dl className="fr-origins">
                {traction.origins.map((o) => (
                  <div key={o.region}><dt>{o.region}</dt><dd>{o.brands.join(' · ')}</dd></div>
                ))}
              </dl>
            </div>
            <article className="fr-card fr-case rv">
              <div className="fr-case-hd">
                <span className="fr-pill-chip sm">{traction.caseStudy.label}</span>
                <h3>{traction.caseStudy.brand}</h3>
                <p>{traction.caseStudy.about}</p>
              </div>
              <blockquote>
                <p>“{traction.caseStudy.quote}”</p>
                <cite>{traction.caseStudy.by}</cite>
              </blockquote>
              <ul className="fr-results">{traction.caseStudy.results.map((r) => <li key={r}>{r}</li>)}</ul>
            </article>
          </div>
        </Sec>

        {/* 7. Market */}
        <Sec id="market" canvas="white">
          <Head id="market" eyebrow={market.eyebrow} title={market.title} />
          <div className="fr-market">
            <figure className="fr-rings rv" aria-label="TAM, SAM and SOM as nested circles, not to scale">
              <div className="ring r-tam"><div className="ring r-sam"><div className="ring r-som" /></div></div>
              {market.rings.map((r) => (
                <span key={r.key} className={'fr-rtag ' + r.key}><b>{r.value}</b>{r.label}</span>
              ))}
              <figcaption>{market.scaleNote}</figcaption>
            </figure>
            <div className="rv">
              <dl className="fr-mlist">
                {market.rings.map((r) => (
                  <div key={r.key} className={r.key}><dt><i aria-hidden="true" />{r.label}</dt><dd><b>{r.value}</b><span>{r.detail}</span></dd></div>
                ))}
                <div className="today"><dt><i aria-hidden="true" />{market.today.label}</dt><dd><b>{market.today.value}</b><span>{market.today.detail}</span></dd></div>
              </dl>
              <p className="fr-note">{market.note}</p>
              <details className="fr-sizing">
                <summary>{market.sizing.summary}</summary>
                <dl>
                  {market.sizing.rows.map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.body}</dd></div>)}
                </dl>
              </details>
            </div>
          </div>
        </Sec>

        {/* 8. Competition (white, hairline above) */}
        <Sec id="competition" canvas="white">
          <Head id="competition" eyebrow={competition.eyebrow} title={competition.title} />
          <div className="fr-comp">
            <div className="rv"><PositioningMap /></div>
            <ul className="fr-points">
              {competition.points.map((p) => (
                <li key={p.title} className="fr-card rv"><h3>{p.title}</h3><p>{p.body}</p></li>
              ))}
            </ul>
          </div>
        </Sec>

        {/* 9. Moats */}
        <Moats />

        {/* 10. Projections */}
        <Sec id="projections" canvas="white">
          <Head id="projections" eyebrow={projections.eyebrow} title={projections.title} />
          <div className="fr-proj">
            <div className="fr-card rv">
              <Label>{projections.brandsLabel}</Label>
              <ul className="fr-years">
                {projections.brands.map((b) => <li key={b.year}><span>{b.year}</span><b>{b.value}</b></li>)}
              </ul>
              <p className="fr-small">{projections.brandsNote}</p>
            </div>
            <div className="fr-card rv">
              <Label>{projections.perBrandLabel}</Label>
              <ul className="fr-years per">
                {projections.perBrand.map((b) => <li key={b.year}><span>{b.year}</span><b>{b.value}</b><small>{b.calc}</small></li>)}
              </ul>
            </div>
          </div>
          <figure className="fr-arr rv">
            <figcaption><Label>{projections.arrLabel}</Label></figcaption>
            <div className="fr-arr-plot" role="img" aria-label={projections.arr.map((a) => `Q${a.q}: ${a.label}`).join(', ')}>
              {Array.from({ length: projections.quarters }, (_, i) => {
                const pt = projections.arr.find((a) => a.q === i + 1)
                return (
                  <div key={i} className={'col' + (pt ? ' on' : '')}>
                    {pt && <div className="bar" style={{ height: `${(pt.m / arrMax) * 100}%` }}><span>{pt.label}</span></div>}
                    <small>Q{i + 1}</small>
                  </div>
                )
              })}
            </div>
          </figure>
          <p className="fr-foot rv">{projections.footnote}</p>
        </Sec>

        {/* 11. Equity upside */}
        <Sec id="equity" canvas="navy">
          <Head id="equity" eyebrow={equity.eyebrow} title={equity.title} sub={equity.scenario} />
          <ol className="fr-eq rv">
            {equity.steps.map((s) => (
              <li key={s.label} className={s.highlight ? 'hi' : ''}>
                <span className="lab">{s.label}</span>
                <span className="track"><i style={{ width: `${(s.m / eqMax) * 100}%` }} /></span>
                <b>{s.value}</b>
              </li>
            ))}
          </ol>
          <p className="fr-foot rv">{equity.caption}</p>
        </Sec>

        {/* 12. Team */}
        <Sec id="team" canvas="white">
          <Head id="team" title={team.title} />
          <ul className="fr-team">
            {team.founders.map((f) => (
              <li key={f.name} className="fr-card rv">
                {f.photo
                  ? <img className="fr-face" src={f.photo} alt="" width="64" height="64" />
                  : <span className="fr-face" aria-hidden="true">{f.initials}</span>}
                <h3>{f.name}</h3>
                <p className="role">{f.role} <span>· {f.focus}</span></p>
                <p>{f.bio}</p>
              </li>
            ))}
          </ul>
          <div className="fr-behind rv">
            <Label>{team.behindLabel}</Label>
            <ul>{team.behind.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        </Sec>

        {/* 13. The raise */}
        <Sec id="raise" canvas="navy">
          <Head id="raise" eyebrow={raise.eyebrow} title={raise.title} />
          <div className="fr-raise">
            <div className="rv">
              <Label>{raise.fundsLabel}</Label>
              <div className="fr-stack" role="img" aria-label={raise.funds.map((f) => `${f.label} ${f.value} (${f.pct}%)`).join(', ')}>
                {raise.funds.map((f, i) => <i key={f.label} className={'s' + i} style={{ flexBasis: `${f.pct}%` }} />)}
              </div>
              <ul className="fr-legend">
                {raise.funds.map((f, i) => (
                  <li key={f.label}><i className={'s' + i} aria-hidden="true" /><span>{f.label}</span><b>{f.value}</b><em>{f.pct}%</em></li>
                ))}
              </ul>
            </div>
            <div className="rv">
              <Label>{raise.milestonesLabel}</Label>
              <ul className="fr-miles">{raise.milestones.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
          </div>
          <p className="fr-close rv">{raise.closing}</p>
          <div className="fr-ctas center rv">
            <a className="fr-btn fill" href={BOOK}>{raise.cta}</a>
            <a className="fr-btn out" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </Sec>
      </main>

    </div>
    <Footer base="/" notes={false} />
    </>
  )
}
