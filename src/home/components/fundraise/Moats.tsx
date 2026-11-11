import { moats } from '@/home/data/fundRaise'
import { Em } from './Em'

/* Moats section (navy). All copy is the `moats` object in data/fundRaise.ts,
   so the section can be rewritten without touching this file. */
export function Moats() {
  return (
    <section className="fr-sec navy" id="moats" aria-labelledby="moats-h">
      <div className="fr-in">
        <header className="fr-head">
          <h2 id="moats-h"><Em text={moats.title} /></h2>
        </header>
        <ol className="fr-moats">
          {moats.items.map((m) => (
            <li key={m.n} className="fr-card">
              <span className="fr-num">{m.n}</span>
              <h3>{m.name}</h3>
              <p>{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
