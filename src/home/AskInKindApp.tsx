import { useEffect, useRef, useState } from 'react'
import { useReveal } from './hooks/useReveal'
import { BoardNav } from './board/BoardNav'
import { BoardFooter } from './board/BoardFooter'
import { Flap } from './board/Flap'
import { AIK_LINKS, CHECKS, COMPARE, EXAMPLE_PROJECT, FLOW, ROLES, STAGES, STAGE_LABELS } from './data/askInKind'
import './styles/askinkind.css'

/* /askinkind: Ask In Kind, Vybd's social impact logistics lab, introduced in
   the vybd.ai board world. Every action leads to askinkind.org. Copy lives in
   data/askInKind.ts. Served from askinkind.html (vercel.json). */

const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
const STEP_MS = 2600
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ProjectBoard() {
  const [stage, setStage] = useState(() => (reduced() ? STAGES.length - 1 : 0))
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced()) return
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    if (ref.current) io.observe(ref.current)
    const id = window.setInterval(() => {
      if (visible && !document.hidden) setStage((s) => (s + 1) % STAGES.length)
    }, STEP_MS)
    return () => { io.disconnect(); window.clearInterval(id) }
  }, [])
  const done = stage === STAGES.length - 1

  return (
    <div className="board aik-board" ref={ref}>
      <div className="top">
        <span className="cap">Example project · <b>{EXAMPLE_PROJECT.name}</b></span>
        <span className="cap">Goods, not cash</span>
      </div>
      <div className="aik-rows" aria-live="polite">
        {EXAMPLE_PROJECT.items.map((it, i) => (
          <div className="aik-row" key={it.item}>
            <Flap text={it.item} len={21} className="c-l" />
            <Flap text={`${it.qty}/${it.qty}`} len={7} align="right" className="c-a" />
            <Flap text={STAGES[stage]} len={7} delay={i * 160} className={'c-s ' + (done ? 'go' : '')} />
          </div>
        ))}
      </div>
      <ol className="aik-stages" aria-label="Delivery stages">
        {STAGE_LABELS.map((l, i) => (
          <li key={l} className={i <= stage ? 'on' : undefined} aria-current={i === stage ? 'step' : undefined}>{l}</li>
        ))}
      </ol>
    </div>
  )
}

export default function AskInKindApp() {
  useReveal()
  return (
    <div className="aik">
      <BoardNav base="/" notice={false} />
      <main id="top">
        <section className="hero aik-hero">
          <div className="wrap">
            <h1 className="disp">Ask In Kind<span>.</span></h1>
            <div className="copy">
              <p className="lede">Vybd's social impact logistics lab. <b>Community projects, backed by business.</b> Communities share what they need, businesses supply it, and everyone sees it arrive.</p>
              <div className="acts">
                <a className="plate ink" href={AIK_LINKS.home}>Visit Ask In Kind <Arrow /></a>
                <a className="plate line" href={AIK_LINKS.projects}>Browse projects</a>
              </div>
            </div>
            <ProjectBoard />
          </div>
        </section>

        <section className="sec" id="items">
          <div className="wrap">
            <div className="head">
              <h2 className="h2 rv">Needs counted in items, not dollars.</h2>
              <p className="lede rv">Crowdfunding raises cash for individuals. Ask In Kind moves goods to groups, and a project is done when the goods arrive.</p>
            </div>
            <div className="aik-cmp rv" role="table" aria-label="Crowdfunding compared with Ask In Kind">
              <div className="r h" role="row"><span role="columnheader" /><span role="columnheader" className="cap">Crowdfunding</span><span role="columnheader" className="cap">Ask In Kind</span></div>
              {COMPARE.map(([k, a, b]) => (
                <div className="r" role="row" key={k}><span role="rowheader">{k}</span><span role="cell">{a}</span><span role="cell"><b>{b}</b></span></div>
              ))}
            </div>
            <p className="note">Donated inventory is often tax deductible. Check with your tax adviser.</p>
          </div>
        </section>

        <section className="path dark" id="why-vybd">
          <div className="wrap">
            <div className="copy">
              <h2 className="h2 rv">Why Vybd built it.</h2>
              <p className="lede rv">Vybd runs freight, customs and delivery for brands. Ask In Kind puts the same work behind community projects. <b>Customs is usually where donated goods get stuck.</b></p>
              <p className="lede rv">So every route gets a compliance brief before goods move. Food and medicine are not held back just because of where they are going.</p>
              <p className="note rv">The compliance brief is guidance, not legal or customs advice.</p>
            </div>
            <div className="panel rv">
              <div className="ttl cap"><span>Compliance brief · example route</span><b>2 of 4 confirmed</b></div>
              {[
                ['Recipient verified', 'Done', 'go'],
                ['Restricted destination screen', 'Done', 'go'],
                ['Import paperwork', 'Pending', 'rent'],
                ['Carrier assigned', 'Pending', 'rent'],
              ].map(([k, v, t]) => (
                <div className="prow" key={k}><span className="lbl">{k}</span><span className="st"><Flap text={v} len={7} className={t} /></span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="how">
          <div className="wrap">
            <div className="head">
              <h2 className="h2 rv">How a project moves.</h2>
              <p className="lede rv">Three steps, from a listed need to a confirmed delivery. <a className="textlink" href={AIK_LINKS.how}>See how it works for you</a></p>
            </div>
            <ol className="aik-flow">
              {FLOW.map((f, i) => (
                <li className="rv" key={f.title}>
                  <Flap text={String(i + 1)} len={1} className="mid go" />
                  <h3 className="h3">{f.title}</h3>
                  <p>{f.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec tight" id="who">
          <div className="wrap">
            <h2 className="h2 rv aik-who-h">Who it's for.</h2>
            <div className="aik-roles">
              {ROLES.map((r) => (
                <div className="panel rv" key={r.who}>
                  <h3 className="h3">{r.who}</h3>
                  <p className="aik-line">{r.line}</p>
                  <ol>{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                  <p className="note">{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec tight" id="checks">
          <div className="wrap">
            <div className="head">
              <h2 className="h2 rv">Built so that aid reaches the people it was meant for.</h2>
            </div>
            <div className="aik-checks">
              {CHECKS.map((c) => (
                <div className="rv" key={c.title}><h3 className="h3">{c.title}</h3><p>{c.body}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="aik-close dark">
          <div className="wrap">
            <h2 className="h2 rv">Free for everyone while we grow.</h2>
            <p className="lede rv">Communities, companies and carriers all use Ask In Kind at no cost, and we never take a share of donated goods.</p>
            <div className="acts rv">
              <a className="plate go" href={AIK_LINKS.join}>Create an account <Arrow /></a>
              <a className="plate line" href={AIK_LINKS.projects}>Browse projects</a>
              <a className="plate line" href={AIK_LINKS.donations}>See available donations</a>
            </div>
          </div>
        </section>
      </main>
      <BoardFooter base="/" notes={false} />
    </div>
  )
}
