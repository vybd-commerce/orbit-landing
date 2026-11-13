import { ROUTES } from '@/home/data/routes'

/* "Where are you today?": right under the hero on the landing page (UsApp)
   and /borderless (App), one card per kind of visitor, each with its own next
   step. The /us page has the same picker for its
   three US starting points (src/pages/redesign/home/StartPicker.tsx). */
export function StartRoutes() {
  return (
    <section className="routes-sec" id="start" aria-labelledby="start-h">
      <h2 id="start-h" className="rv">Where are you <em>today?</em></h2>
      <p className="routes-sub rv">Pick the one that fits. Each goes straight to what you need from us.</p>
      <ul className="route-list rv">
        {ROUTES.map((r) => (
          <li key={r.k} className={r.dark ? 'dk' : undefined}>
            <span className="route-k">{r.k}</span>
            <b className="route-t">{r.title}</b>
            <span className="route-b">{r.body}</span>
            <span className="route-offer">{r.offer}</span>
            <a className="pill fill" href={r.cta.href}>{r.cta.label}</a>
            {r.aside && <a className="route-aside" href={r.aside.href}>{r.aside.label}</a>}
          </li>
        ))}
      </ul>
    </section>
  )
}
