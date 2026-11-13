import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReveal } from './hooks/useReveal'
import { GlobalNav } from './components/GlobalNav'
import { Footer } from './components/Footer'
import { ProfitCalc } from './components/ProfitCalc'
import { StartRoutes } from './components/StartRoutes'
import { AUDIENCES, BOOK_LAUNCH, CAPABILITIES, FOOTNOTES, US_TIERS, WORKSTREAMS, type Audience } from './data/us'
import { CASE_STUDIES_URL } from './data/cases'
import './styles/test-drop.css'
import './styles/us.css'

/* /us in English: "Build your business in America", from a shared design,
   in this site's tiles and type. Order: hero, the problem (a partner for
   every job), what Vybd does, proof, six capabilities, the Control Tower,
   three steps, who we help (each kind of business routed to its own next
   step), pricing (Plan, Test Drop, US Launch, US Scale), a calculator next
   to Enterprise, closing call. Copy in data/us.ts; styles in styles/us.css
   under .usx. The main English landing page: served at / (middleware.ts) and
   /us (vercel.json) from us-en.html. /zh/us and the other locales stay on the
   SPA (src/pages/redesign/UsPage.tsx); the old home is at /borderless. */

const Mark = () => (
  <svg viewBox="4 4 92 84" aria-hidden="true">
    <path d="M4 4 L36 4 L50 46 Z" fill="#5FD6BF" /><path d="M4 4 L50 46 L38 88 Z" fill="#1BB59B" />
    <path d="M96 4 L64 4 L50 46 Z" fill="#7E8AA3" /><path d="M96 4 L50 46 L62 88 Z" fill="#B9C2D3" />
    <path d="M38 88 L50 46 L62 88 Z" fill="#13987F" />
  </svg>
)

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
)

/* Workstreams scattered around "You", each tied in with a dashed line. */
const POS = [[16, 14], [50, 8], [84, 14], [90, 50], [84, 86], [50, 94], [16, 86], [10, 50]]
const POS_NARROW = [[27, 7], [73, 7], [80, 30], [80, 72], [73, 94], [27, 94], [20, 72], [20, 30]]

function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 600)
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 600)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return narrow
}

function Tangle() {
  const P = useNarrow() ? POS_NARROW : POS
  const cx = 450, cy = 198
  const paths: string[] = []
  P.forEach(([px, py], i) => {
    const x = px * 9, y = py * 3.8
    const mx = (x + cx) / 2 + (i % 2 ? 60 : -60), my = (y + cy) / 2 + ((i % 3) - 1) * 50
    paths.push(`M${x} ${y} Q ${mx} ${my} ${cx} ${cy}`)
    if (i % 2 === 0) {
      const [qx, qy] = P[(i + 3) % P.length]
      paths.push(`M${x} ${y} Q ${cx + (i - 4) * 30} ${cy - 80} ${qx * 9} ${qy * 3.8}`)
    }
  })
  return (
    <div className="tangle rv" aria-hidden="true">
      <svg viewBox="0 0 900 380" preserveAspectRatio="none">{paths.map((d) => <path key={d} d={d} />)}</svg>
      {WORKSTREAMS.map(([job, who], i) => (
        <span key={job} className="ws" style={{ left: `${P[i][0]}%`, top: `${P[i][1]}%` }}><small>{who}</small>{job}</span>
      ))}
      <div className="you">You<small>ALONE</small></div>
    </div>
  )
}

function Capabilities() {
  const scroller = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open === null) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => {
    setOpen(null)
    opener.current?.focus()
  }
  const c = open === null ? null : CAPABILITIES[open]

  return (
    <section className="caps" id="solutions">
      <div className="hd">
        <h2 className="rv">Everything your US business needs. <span>One partner.</span></h2>
        <p className="rv">You shouldn't need six companies to run one business. We don't just get you into America. We help you operate here.</p>
      </div>
      <div className="scroller" ref={scroller}>
        {CAPABILITIES.map((cap, i) => (
          <button key={cap.t} type="button" className={'cc' + (cap.dark ? ' dk' : '')} aria-label={`${cap.t}: read more`}
            onClick={(e) => { opener.current = e.currentTarget; setOpen(i) }}>
            <span className="num">0{i + 1}</span>
            <div className="q">{cap.q}</div>
            <h3>{cap.t}</h3>
            <p>{cap.p}</p>
            <div className="tags">{cap.tags.map((t) => <span key={t}>{t}</span>)}</div>
            <span className="plus" aria-hidden="true">+</span>
          </button>
        ))}
      </div>
      <div className="nav">
        <a className="more" href="#pricing">See what it costs</a>
        <span>
          <button type="button" aria-label="Previous" onClick={() => scroller.current?.scrollBy({ left: -360, behavior: 'smooth' })}>‹</button>
          <button type="button" aria-label="Next" onClick={() => scroller.current?.scrollBy({ left: 360, behavior: 'smooth' })}>›</button>
        </span>
      </div>
      <div className={'modal' + (c ? ' open' : '')} role="dialog" aria-modal="true" aria-labelledby="cap-h" onClick={(e) => e.target === e.currentTarget && close()}>
        {c && (
          <div className="mbox">
            <button className="x" type="button" aria-label="Close" ref={closeBtn} onClick={close}>×</button>
            <div className="num">0{open! + 1} · {c.short.toUpperCase()}</div>
            <div className="q">{c.q}</div>
            <h3 id="cap-h">{c.t}</h3>
            <p>{c.p}</p>
            <div className="tags">{c.tags.map((t) => <span key={t}>{t}</span>)}</div>
            <div className="go"><a className="pill fill" href="#start" onClick={close}>Find your starting point</a></div>
          </div>
        )}
      </div>
    </section>
  )
}

function AudienceArt({ art }: { art: Audience['art'] }) {
  if (art === 'factory')
    return (
      <div className="mf rv" aria-hidden="true">
        <svg className="fac" viewBox="0 0 150 110" fill="none">
          <path d="M6 104V58l30-18v18l30-18v18l30-18V22h18v82z" fill="#1a2a52" stroke="#2c3e6b" />
          <rect x="104" y="6" width="10" height="18" fill="#2c3e6b" />
          <g fill="#1BB59B"><rect x="20" y="74" width="12" height="12" rx="2" /><rect x="50" y="74" width="12" height="12" rx="2" /><rect x="80" y="74" width="12" height="12" rx="2" /></g>
          <path d="M0 106h150" stroke="#2c3e6b" strokeWidth="2" />
        </svg>
        <span className="arrow">→</span>
        <div className="mini-box"><b>USA</b></div>
      </div>
    )
  if (art === 'flags')
    return (
      <div className="chips-art rv" aria-hidden="true">
        <span>🇮🇳 India</span><span>🇰🇷 South Korea</span><span>🇨🇳 China</span><span>🇧🇩 Bangladesh</span><span>🇫🇷 France</span>
        <span className="ar">↓</span><span className="us">🇺🇸 United States</span>
      </div>
    )
  if (art === 'growth')
    return <div className="scale-art rv" aria-hidden="true">{[30, 42, 55, 72, 94].map((h) => <i key={h} style={{ height: `${h}%` }} />)}</div>
  return (
    <div className="store rv" aria-hidden="true">
      <div className="top"><i /><i /><i /></div>
      <div className="grid"><i /><i className="on" /><i /><i /><i /><i className="on" /></div>
      <div className="toast"><i />New US order, shipping from a US warehouse</div>
    </div>
  )
}

function Tile({ tone, children }: { tone: Audience['tone']; children: ReactNode }) {
  if (tone === 'mint') return <section className="tile" style={{ background: 'linear-gradient(180deg,#f2faf7,#e3f4ee)' }}>{children}</section>
  return <section className={'tile ' + tone}>{children}</section>
}

export default function UsApp() {
  useReveal()
  return (
    <div className="usx">
      <GlobalNav />

      <main id="top">
        <section className="tile full hero">
          <div className="copy">
            <h1 className="rv">Build your business in America. <em>Without building everything yourself.</em></h1>
            <p className="body rv">The team, technology and infrastructure to enter the US, run your operations and grow. All through one partner.</p>
            <div className="links rv"><a className="pill fill" href="#start">Find your starting point</a><a className="pill out" href="#how">See how it works</a></div>
          </div>
          <div className="art"><div className="us-art rv" aria-hidden="true">
            <div className="map" />
            <svg className="routes" viewBox="0 0 980 380" preserveAspectRatio="none">
              <path d="M120 290 C 300 120, 440 120, 560 170" /><path d="M110 120 C 300 40, 460 80, 560 165" /><path d="M880 70 C 760 40, 640 90, 590 160" />
            </svg>
            <span className="origin" style={{ left: '3%', top: '68%' }}><i>🇮🇳</i>India</span>
            <span className="origin" style={{ left: '2%', top: '22%' }}><i>🇰🇷</i>South Korea</span>
            <span className="origin" style={{ right: '3%', top: '10%' }}><i>🇨🇳</i>China</span>
            <div className="hq"><div className="box"><div className="lbl">US OPERATION<b>America</b><s /></div></div></div>
            <span className="ops-chip" style={{ left: '66%', top: '68%' }}><i />Warehouse</span>
            <span className="ops-chip" style={{ left: '73%', top: '44%' }}><i />Sales channels</span>
            <span className="ops-chip" style={{ left: '44%', top: '80%' }}><i />Customers</span>
          </div></div>
        </section>

        <StartRoutes />

        <section className="tile full dark" id="problem">
          <div className="copy">
            <div className="eyebrow rv">The US expansion challenge</div>
            <h2 className="prod rv">America is a huge opportunity.</h2>
            <p className="tag rv"><em>Getting there is the hard part.</em></p>
            <p className="body rv">Research, compliance, freight, warehousing, sales, marketing, support. <b>Alone, that's a different partner for every job.</b></p>
          </div>
          <div className="art"><Tangle /></div>
          <div className="copy" style={{ padding: '0 22px 56px' }}><p className="close-line rv">That's where Vybd <em>comes in.</em></p></div>
        </section>

        <section className="tile full gray" id="partner">
          <div className="copy">
            <div className="eyebrow rv">What Vybd does</div>
            <h2 className="prod rv">You don't need to move to America.</h2>
            <p className="tag rv">You need a <em>business presence here.</em></p>
            <p className="body rv">We set up and run your US operation, from compliance and inventory to orders and customers. No local team or office to build.</p>
          </div>
          <div className="art"><div className="hub rv">
            <div className="brand"><small>YOUR BUSINESS · ANYWHERE</small><b>Your product. Your vision.</b><span>You stay where you are.</span></div>
            <div className="core" aria-label="Vybd"><Mark /></div>
            <div className="fns">{CAPABILITIES.map((c) => <div key={c.short} className="fn"><i><Icon d={c.icon} /></i>{c.short}</div>)}</div>
          </div></div>
          <div className="copy" style={{ padding: '0 22px 60px' }}><p className="close-line rv">Your business. Your ambition. <em>Our team on the ground.</em></p></div>
        </section>

        <section className="tile full" id="stories">
          <div className="copy">
            <div className="eyebrow rv">Success stories</div>
            <h2 className="prod rv">Businesses don't just enter America.</h2>
            <p className="tag rv"><em>They grow here.</em></p>
            <p className="body rv">Every business starts somewhere different. Here's where a few of them got to.<sup>1</sup></p>
          </div>
          <div className="art"><div className="proof rv">
            <div className="pc"><small>Bayangrom · India</small><div className="n">$180K<em>/yr</em></div><p>Recovered by fixing inventory and shipping.</p><b>Inventory and shipping</b></div>
            <div className="pc"><small>MIB Industries · India</small><div className="n">$30,000</div><p>In B2B pre-orders.</p><b>Wholesale</b></div>
            <div className="pc"><small>Ollobot · China</small><div className="n">5,000</div><p>Robots delivered to US customers.</p><b>Delivery and support</b></div>
          </div></div>
          <div className="copy" style={{ padding: '0 22px 60px' }}><a className="more rv" href={CASE_STUDIES_URL}>Read the full stories</a></div>
        </section>

        <Capabilities />

        <section className="tile full dark" id="tower" style={{ marginTop: 12 }}>
          <div className="copy">
            <div className="eyebrow rv">The Vybd Control Tower</div>
            <h2 className="prod rv">Your entire US operation.</h2>
            <p className="tag rv"><em>Connected in one place.</em></p>
            <p className="body rv">Technology, AI-powered workflows and experienced people, working from one place.</p>
          </div>
          <div className="benefits rv">
            <div><b>Visibility</b><span>See everything in one view.</span></div>
            <div><b>Coordination</b><span>No juggling partners.</span></div>
            <div><b>Intelligence</b><span>AI workflows that speed things up.</span></div>
          </div>
          <div className="art"><div className="ops-art rv" aria-label="Illustrative Control Tower interface">
            <div className="panel p1">
              <h5>US launch · Skincare brand <span>Week 6</span></h5>
              <div className="flow">
                {([['ok', 'Market research', 'Done'], ['ok', 'Labels & compliance', 'Done'], ['ok', 'Freight & customs', 'Done'], ['now', 'Warehouse receiving', 'In progress'], ['', 'Marketplace listings', 'Next'], ['', 'Launch campaign', 'Next']] as const).map(([k, s, st]) => (
                  <div key={s}><i className={k || undefined} /><span>{s}</span><em>{st}</em></div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h5>Who's handling it <span>One team</span></h5>
              <div className="rows">
                {([['Market research', 'Vybd', false], ['Customs brokerage', 'Partner · coordinated', true], ['Warehousing', 'Partner · coordinated', true], ['Listings & ads', 'Vybd', false], ['Product & pricing calls', 'You', true]] as const).map(([s, who, p]) => (
                  <div className="rw" key={s}><span>{s}</span><em className={p ? 'p' : undefined}>{who}</em></div>
                ))}
              </div>
            </div>
            <div className="panel p3">
              <h5>Needs attention <span>2 open</span></h5>
              <div className="agent"><i className="d" /><div><b>Reorder suggested, SKU-114</b><span>Stock runs low in 19 days</span></div></div>
              <div className="agent"><i className="d w" /><div><b>Freight invoice mismatch</b><span>Flagged for an operator</span></div></div>
              <div className="agent"><i className="d" /><div><b>Listings updated</b><span>Prices and stock in sync</span></div></div>
            </div>
          </div></div>
          <span className="illus">ILLUSTRATIVE INTERFACE</span>
          <div className="copy" style={{ padding: '56px 22px 56px' }}><p className="close-line rv">One operation. One team. <em>One place to manage it all.</em></p></div>
        </section>

        <section className="how" id="how">
          <h2 className="rv">From your first conversation <span>to your first US customer.</span></h2>
          <p className="rv">Three clear steps.</p>
          <div className="steps">
            <div className="step rv">
              <span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg></span>
              <small>01 · DISCOVER</small><h3>Tell us about your business.</h3>
              <p>What you sell, where you are, where you want to go. We size the opportunity.</p>
              <div className="out">You get: <b>a clear read on the opportunity</b></div>
            </div>
            <div className="step rv">
              <span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></svg></span>
              <small>02 · BUILD</small><h3>We put your US operation together.</h3>
              <p>A tailored roadmap. You see who does what, the costs and the timeline before moving forward.</p>
              <div className="out">You get: <b>a roadmap, costs and timeline</b></div>
            </div>
            <div className="step rv">
              <span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></svg></span>
              <small>03 · GROW</small><h3>Start operating. Start growing.</h3>
              <p>We launch and run your US operations. You focus on your vision.</p>
              <div className="out">You get: <b>a running US operation</b></div>
            </div>
          </div>
        </section>

        <div className="usx-who-hd" id="who">
          <div className="eyebrow rv">Who we help</div>
          <h2 className="prod rv">Wherever you're starting, there's a way to grow in America.</h2>
          <p className="body rv">First time in the US or already here, pick the one that fits. Each has its own next step.</p>
        </div>
        <div className="grid2">
          {AUDIENCES.map((a) => (
            <Tile key={a.name} tone={a.tone}>
              <div className="copy">
                <div className="eyebrow rv">{a.kicker}</div>
                <h3 className="prod rv">{a.name}</h3>
                <p className="body rv">{a.body}</p>
                <div className="links rv usx-who-links">
                  <a className="more" href={a.cta.href}>{a.cta.label}</a>
                  {a.aside && <a className="usx-aside" href={a.aside.href}>{a.aside.label}</a>}
                </div>
              </div>
              <div className="art"><AudienceArt art={a.art} /></div>
            </Tile>
          ))}
        </div>

        <section id="pricing" className="td-sec gray usx-pricing">
          <div className="td-in">
            <header className="td-head">
              <div className="eyebrow rv">Pricing</div>
              <h2 className="rv">Start where you are. <em>Grow from there.</em></h2>
              <p className="rv">Plan it yourself, test with one drop, launch with our team, then run it with us month to month.</p>
            </header>
            <div className="td-tiers">
              {US_TIERS.map((t) => (
                <article key={t.name} className={'rv ' + t.style}>
                  <span className="badge">{t.badge}</span>
                  <h3>{t.name}</h3>
                  <div className="amt">{t.price}</div>
                  <p className="terms">{t.terms}</p>
                  <p className="line">{t.line}</p>
                  <ul className="td-ticks">{t.points.map((x) => <li key={x}>{x}</li>)}</ul>
                  <a className={'pill ' + (t.style === 'plain' ? 'out' : 'fill')} href={t.cta.href}>{t.cta.label}</a>
                </article>
              ))}
            </div>
            <p className="td-fine">All prices in US dollars. Shipping and warehousing are charged on what you ship and store. Partner terms (lower fees, a higher revenue share and an equity stake) are by invitation after six months of real numbers.</p>
          </div>
        </section>

        <div className="grid2">
          <ProfitCalc />
          <section className="tile dark ent">
            <div className="copy">
              <div className="eyebrow rv">For $50M+ operators</div>
              <h2 className="prod rv">Vybd Enterprise</h2>
              <p className="tag rv">AI agents across many lanes, on top of the systems you already run.</p>
              <div className="links rv"><a className="more" href="/enterprise">See Enterprise</a><a className="more" href="/book?for=enterprise">Talk to an operator</a></div>
            </div>
          </section>
        </div>

        <section className="final" id="contact">
          <svg className="bg" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-20 480 C 300 300, 520 520, 800 300 S 1100 140, 1240 120" /><path d="M-20 140 C 260 240, 540 80, 820 220 S 1080 420, 1240 380" />
          </svg>
          <div className="eyebrow rv">Your next chapter starts here</div>
          <h2 className="rv">Your business belongs in America. <em>Let's build it.</em></h2>
          <p className="rv">You don't need to figure out America alone. <b>Tell us where you want to go. We'll help you get there.</b></p>
          <div className="links rv"><a className="pill fill" href={BOOK_LAUNCH}>Let's build your US business</a></div>
          <small className="rv">Free consultation. No commitment.</small>
        </section>

        <div className="usx-fn">
          {FOOTNOTES.map((f, i) => <p key={i}>{i + 1}. {f}</p>)}
        </div>
      </main>
      <Footer notes={false} />
    </div>
  )
}
