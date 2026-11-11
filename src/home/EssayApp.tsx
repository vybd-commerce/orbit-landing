import { GlobalNav } from './components/GlobalNav'
import { Footer } from './components/Footer'
import { Markdown } from './components/Markdown'
import ashwin from './essays/ashwin.md?raw'
import abhi from './essays/abhi.md?raw'
// Ken's essay goes in essays/ken.md; the section shows "coming soon" while it's empty.
import ken from './essays/ken.md?raw'
// Author photos: data/photos.ts (shared with /fundraise).
import { PHOTOS } from './data/photos'

const ESSAYS = [
  {
    id: 'operator',
    title: 'Why I moved from traditional supply chain to AI',
    dek: 'What two decades in operations, ten minutes on ChatGPT and one real-world experiment taught me about the future of supply chain.',
    author: 'Abhi',
    photo: PHOTOS.abhi,
    source: abhi,
  },
  // dek: optional one-line summary under the title.
  { id: 'motion', title: 'Always in motion is the future', dek: '', author: 'Ken', photo: PHOTOS.ken, source: ken },
  { id: 'middleman', title: 'AI is the only middleman we need', author: 'Ash', photo: PHOTOS.ashwin, source: ashwin },
]

export default function EssayApp() {
  return (
    <>
      <GlobalNav base="/" ribbon={false} />
      <main className="essays" id="top">
        <header className="essays-hd">
          <a className="back" href="/#chapters">← Back to Vybd</a>
          <h1>Why Vybd <em>exists.</em></h1>
          <p>Three essays from the people building Vybd: on two decades of running supply chains, on what comes next, and on the economics of moving goods.</p>
          <nav aria-label="Essays">
            {ESSAYS.map((e, i) => (
              <a key={e.id} href={`#${e.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{e.title}</a>
            ))}
          </nav>
        </header>
        {ESSAYS.map((e, i) => (
          <article key={e.id} id={e.id} className="essay">
            <div className="num">ESSAY {String(i + 1).padStart(2, '0')}</div>
            <h1>{e.title}</h1>
            {e.dek && <p className="dek">{e.dek}</p>}
            <div className="by">{e.photo && <img src={e.photo} alt="" width="40" height="40" />}By {e.author}</div>
            {e.source.trim() ? <Markdown source={e.source} /> : <p className="soon">Coming soon.</p>}
          </article>
        ))}
      </main>
      <Footer base="/" />
    </>
  )
}
