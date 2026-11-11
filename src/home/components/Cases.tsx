import { CASE_STUDIES_URL } from '@/home/data/cases'
import { CASES } from '@/pages/redesign/cases'

/* Three of the six case studies, the ones with the clearest numbers. All
   copy comes from the case-studies index (src/pages/redesign/cases.ts). */
const PICK = ['karma', 'kashida-layone', 'tanrom-lifesciences']
const SHOWN = PICK.map((slug) => CASES.find((c) => c.slug === slug)).filter((c) => c !== undefined)

export function Cases() {
  return (
    <section className="tile full gray" id="cases" style={{ minHeight: 0, paddingBottom: 64 }}>
      <div className="copy">
        <div className="eyebrow rv">Case studies</div>
        <h2 className="prod rv">Makers who made it here.</h2>
        <p className="tag big rv">From six countries to US shelves and screens.</p>
      </div>
      <ul className="cases rv">
        {SHOWN.map((c) => (
          <li key={c.slug}>
            <a className="case" href={`${CASE_STUDIES_URL}/${c.slug}`}>
              <span className="case-cat">{c.category}</span>
              <b className="case-brand">{c.brand}</b>
              <span className="case-title">{c.title}</span>
              <span className="case-metrics">
                {c.metrics.slice(0, 2).map(([v, l]) => (
                  <span key={l}><b>{v}</b>{l}</span>
                ))}
              </span>
              <span className="case-go">Read the case study</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="links rv"><a className="more" href={CASE_STUDIES_URL}>See all six stories</a></div>
    </section>
  )
}
