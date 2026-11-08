import { CASE_STUDIES_URL } from '@/home/data/cases'

// Card carousel removed for now; the last version lives in vybd-v2/src/components/Cases.tsx.
export function Cases() {
  return (
    <section className="tile full gray" id="cases" style={{ minHeight: 0, paddingBottom: 52 }}>
      <div className="copy">
        <div className="eyebrow rv">Case studies</div>
        <h2 className="prod rv">Makers who made it here.</h2>
        <p className="tag big rv">From six countries to US shelves and screens.</p>
        <div className="links rv"><a className="more" href={CASE_STUDIES_URL}>See all stories</a></div>
      </div>
    </section>
  )
}
