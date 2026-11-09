import { BoardNav } from './board/BoardNav'
import { BoardFooter } from './board/BoardFooter'
import { Flap } from './board/Flap'
import { Markdown } from './components/Markdown'
import ashwin from './essays/ashwin.md?raw'
import abhi from './essays/abhi.md?raw'
// Ken's essay goes in essays/ken.md; the section shows "coming soon" while it's empty.
import ken from './essays/ken.md?raw'
import './styles/essay.css'

const ESSAYS = [
  {
    id: 'operator',
    title: 'Why I moved from traditional supply chain to AI',
    dek: 'What two decades in operations, ten minutes on ChatGPT and one real-world experiment taught me about the future of supply chain.',
    author: 'Abhi',
    source: abhi,
  },
  { id: 'motion', title: 'Always in motion is the future', author: 'Ken', source: ken },
  { id: 'middleman', title: 'AI is the only middleman we need', author: 'Ash', source: ashwin },
]

export default function EssayApp() {
  return (
    <>
      <BoardNav base="/" notice={false} />
      <main className="essays" id="top">
        <header className="essays-hd">
          <div className="wrap">
            <a className="back" href="/#chapters">Back to Vybd</a>
            <h1 className="disp">Why Vybd exists<span>.</span></h1>
            <p className="lede">Three essays from the people building Vybd: on two decades of running supply chains, on what comes next, and on the economics of moving goods.</p>
            <nav className="board toc" aria-label="Essays">
              {ESSAYS.map((e, i) => (
                <a key={e.id} href={`#${e.id}`}>
                  <Flap text={`Essay ${i + 1}`} len={7} delay={i * 120} className="go" />
                  <span className="t">{e.title}</span>
                  <Flap text={e.author} len={5} delay={i * 120 + 80} />
                </a>
              ))}
            </nav>
          </div>
        </header>
        {ESSAYS.map((e, i) => (
          <article key={e.id} id={e.id} className="essay-a">
            <div className="wrap">
              <div className="meta">
                <span className="cap">Essay {i + 1}</span>
                <span className="by">By {e.author}</span>
              </div>
              <div className="text">
                <h2 className="h2">{e.title}</h2>
                {e.dek && <p className="dek">{e.dek}</p>}
                {e.source.trim() ? <Markdown source={e.source} /> : <p className="soon">Coming soon.</p>}
              </div>
            </div>
          </article>
        ))}
      </main>
      <BoardFooter base="/" notes={false} />
    </>
  )
}
