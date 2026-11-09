import { useEffect, type ReactNode } from "react";
import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { useTx } from "./i18n";
import ClosingCta from "./home/ClosingCta";
import SectionTop from "./enterprise/SectionTop";
import DropCalc from "./testdrop/DropCalc";
import {
    BOOK,
    DROP_MAX_UNITS,
    FAQ,
    FLOW,
    FREIGHT_NOTE,
    INCLUDED,
    NEXT,
    ORIGINS,
    PILLARS,
    PROOF,
    TIERS,
    WE_OWN,
    YOU_COVER,
    YOU_OWN,
} from "./testdrop/data";
import "./HomePage.css";
import "./EnterprisePage.css";
import "./TestDropPage.css";

/* /test-drop: the "Sell in the US" deck as a page we can send to brands
   outside the US instead of a PDF. Order follows the deck: hero, how it
   works, who does what, the Test Drop, the numbers (a calculator in place
   of the static example), after the drop (all four stages), proof, next
   steps, FAQ, closing call. Root carries .rd-ent so it reuses the
   /enterprise section styles (SectionTop, FAQ, next-step cards); its own
   rules are under .rd-td in TestDropPage.css. Copy lives in testdrop/data.ts.
   English only for now. */

const LINKS = [
    { label: "How it works", href: "#how" },
    { label: "The Test Drop", href: "#drop" },
    { label: "Your numbers", href: "#numbers" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

const META = {
    title: "Sell in the US. Start with one drop. | Vybd",
    description:
        "Test the US market with one limited drop of up to 500 units: freight, customs clearance, warehousing and fulfillment handled by Vybd. From $3,000 plus 15% of US sales.",
    og: "Sell in the US. Start with one drop.",
};

const Arrow = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const List = ({ items, className = "ent-ticks" }: { items: string[]; className?: string }) => (
    <ul className={className}>
        {items.map((x) => (
            <li key={x}>{x}</li>
        ))}
    </ul>
);

function Sec({ id, soft, children }: { id: string; soft?: boolean; children: ReactNode }) {
    return (
        <section id={id} className={`wrap ent-sec${soft ? " ent-soft bleed" : ""}`}>
            {children}
        </section>
    );
}

/* Same tab title and description swap as /enterprise; the link preview
   itself comes from pageMeta.ts at build time. */
function usePageMeta() {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = META.title;
        const desc = document.querySelector('meta[name="description"]');
        const og = document.querySelector('meta[property="og:title"]');
        const prevDesc = desc?.getAttribute("content") ?? null;
        const prevOg = og?.getAttribute("content") ?? null;
        desc?.setAttribute("content", META.description);
        og?.setAttribute("content", META.og);
        return () => {
            document.title = prevTitle;
            if (desc && prevDesc !== null) desc.setAttribute("content", prevDesc);
            if (og && prevOg !== null) og.setAttribute("content", prevOg);
        };
    }, []);
}

export default function TestDropPage() {
    const tx = useTx();
    usePageMeta();

    return (
        <RdPage name="home" className="rd-ent rd-td">
            <RdHeader logoHref="/" links={LINKS} mobileLinks={LINKS} ctaHref={BOOK} ctaLabel="Book an intro" />

            {/* hero */}
            <section id="top" className="ent-hero td-hero">
                <div className="hx-bg" aria-hidden="true" />
                <div className="ent-orbit" aria-hidden="true">
                    <i />
                </div>
                <div className="wrap ent-hero-in">
                    <span className="ent-chip ent-in">
                        <i /> For brands outside the US
                    </span>
                    <h1 className="ent-h1 ent-in ent-d1">
                        Sell in the US.
                        <br />
                        Start with <em>one</em> drop.
                    </h1>
                    <p className="lead ent-in ent-d2">
                        From import and storage to fulfillment, reporting and AI-enabled operations, without building your own US team.
                    </p>
                    <div className="ent-cta ent-in ent-d3">
                        <RdLink className="btn btn-dark" href={BOOK}>
                            Book a 30-minute intro
                        </RdLink>
                        <RdLink className="btn btn-text" href="#numbers">
                            Run your numbers
                            <Arrow />
                        </RdLink>
                    </div>
                    <ul className="td-facts ent-in ent-d3" aria-label="Test Drop at a glance">
                        <li>
                            <b>$3,000</b> one time + 15% of US sales
                        </li>
                        <li>
                            <b>Up to {DROP_MAX_UNITS} units</b> with freight on us*
                        </li>
                        <li>
                            <b>4–6 weeks</b> to go live
                        </li>
                    </ul>
                </div>
            </section>

            {/* 1. how it works */}
            <Sec id="how" soft>
                <SectionTop
                    kicker="How it works"
                    title={
                        <>
                            From your factory to a US <em>doorstep.</em>
                        </>
                    }
                >
                    You make it and sell it. We handle everything in between.
                </SectionTop>
                <ol className="td-flow">
                    {FLOW.map((s, n) => (
                        <li key={s.title} className={`rv td-${s.who}`}>
                            <span className="td-n">{n + 1}</span>
                            <small>{s.who === "you" ? "You" : "Vybd"}</small>
                            <h3>{s.title}</h3>
                            <p>{s.body}</p>
                        </li>
                    ))}
                </ol>
                <div className="td-pillars">
                    {PILLARS.map(([h, p]) => (
                        <div key={h} className="rv">
                            <small className="ent-k">{h}</small>
                            <p>{p}</p>
                        </div>
                    ))}
                </div>
            </Sec>

            {/* 2. who does what */}
            <Sec id="split">
                <SectionTop
                    kicker="Who does what"
                    title={
                        <>
                            You own the <em>brand.</em>
                            <br />
                            We own the operations.
                        </>
                    }
                />
                <div className="td-split rv">
                    <div className="td-you">
                        <h3>You</h3>
                        <List items={YOU_OWN} />
                    </div>
                    <div className="td-us">
                        <h3>Vybd</h3>
                        <List items={WE_OWN} />
                    </div>
                </div>
                <p className="ent-fine">*On the Test Drop, Vybd covers freight to the US for up to {DROP_MAX_UNITS} units, depending on dimensions and weight.</p>
            </Sec>

            {/* 3. the offer */}
            <Sec id="drop" soft>
                <SectionTop
                    kicker="The Test Drop"
                    title={
                        <>
                            One limited drop to <em>test</em> the US market.
                        </>
                    }
                />
                <div className="td-offer rv">
                    <div className="td-price">
                        <b>$3,000</b>
                        <span>one time</span>
                        <em>+ 15% of US sales</em>
                        <RdLink className="btn btn-mint" href={BOOK}>
                            Book a 30-minute intro
                        </RdLink>
                    </div>
                    <div>
                        <h3>Included</h3>
                        <List items={INCLUDED} />
                    </div>
                    <div>
                        <h3>You cover</h3>
                        <List items={YOU_COVER} className="ent-ticks td-plain" />
                    </div>
                </div>
                <p className="ent-fine">*{FREIGHT_NOTE}</p>
            </Sec>

            {/* 4. the numbers */}
            <Sec id="numbers">
                <SectionTop
                    kicker="Your numbers"
                    title={
                        <>
                            What a drop <em>leaves you.</em>
                        </>
                    }
                >
                    Start from our example, a sold-out drop of 500 tees at $38, then put in your own product. You also leave with real data: which designs sold, at what price,
                    in which cities, and what it costs to serve a US customer.
                </SectionTop>
                <DropCalc />
                <p className="ent-fine">Illustrative. Duty rates vary by product; postage and card fees are estimates. Not a quote.</p>
            </Sec>

            {/* 5. after the drop */}
            <Sec id="pricing" soft>
                <SectionTop
                    kicker="Pricing"
                    title={
                        <>
                            Start with one drop.
                            <br />
                            Then <em>scale.</em>
                        </>
                    }
                >
                    Grow at the pace your sales justify.
                </SectionTop>
                <div className="td-tiers">
                    {TIERS.map((t) => (
                        <article key={t.name} className={`td-tier td-tier--${t.style} rv`}>
                            <span className="td-badge">{t.badge}</span>
                            <h3>{t.name}</h3>
                            <div className="td-amt">{t.price}</div>
                            <p className="td-terms">{t.terms}</p>
                            {t.line && <p className="td-line">{t.line}</p>}
                            <List items={t.points} />
                            <RdLink className={`btn ${t.style === "drop" ? "btn-mint" : "btn-dark"}`} href={BOOK}>
                                {t.cta}
                            </RdLink>
                        </article>
                    ))}
                </div>
                <p className="ent-fine">*{FREIGHT_NOTE}</p>
            </Sec>

            {/* 6. proof */}
            <Sec id="proof">
                <SectionTop
                    kicker={`Proof: ${PROOF.brand}`}
                    title={
                        <>
                            Real operating results.
                            <br />
                            <em>Not just a promise.</em>
                        </>
                    }
                >
                    {PROOF.about}
                </SectionTop>
                <div className="td-stats">
                    {PROOF.stats.map(([n, l], k) => (
                        <div key={l} className={`rv${k === 2 ? " hi" : ""}`}>
                            <b>{n}</b>
                            <span>{l}</span>
                        </div>
                    ))}
                </div>
                <div className="td-story rv">
                    {PROOF.story.map(([k, p]) => (
                        <div key={k}>
                            <small className="ent-k">{k}</small>
                            <p>{p}</p>
                        </div>
                    ))}
                </div>
                <p className="ent-fine">{PROOF.note}</p>
                <div className="td-origins rv">
                    <span>We work with brands and manufacturers from</span>
                    <ul>
                        {ORIGINS.map((o) => (
                            <li key={o}>{o}</li>
                        ))}
                    </ul>
                    <RdLink className="btn btn-text" href="/case-studies">
                        Read the case studies
                        <Arrow />
                    </RdLink>
                </div>
            </Sec>

            {/* 7. next steps */}
            <Sec id="steps" soft>
                <SectionTop
                    kicker="Next steps"
                    title={
                        <>
                            Your first US drop,
                            <br />
                            in <em>four</em> steps.
                        </>
                    }
                />
                <div className="nx-grid td-next">
                    {NEXT.map(([tag, h, p], n) => (
                        <article key={h} className="nx-card rv">
                            <div className="nx-num">
                                {String(n + 1).padStart(2, "0")} <span>{tag}</span>
                            </div>
                            <h3>{h}</h3>
                            <p>{p}</p>
                        </article>
                    ))}
                </div>
            </Sec>

            {/* 8. FAQ */}
            <Sec id="faq">
                <SectionTop
                    kicker="FAQ"
                    title={
                        <>
                            Questions brands
                            <br />
                            <em>ask us first.</em>
                        </>
                    }
                    center
                />
                <div className="fq-list rv">
                    {FAQ.map(([q, a]) => (
                        <details key={q} className="fq-item">
                            <summary>{q}</summary>
                            <p>{a}</p>
                        </details>
                    ))}
                </div>
            </Sec>

            <ClosingCta
                tx={tx}
                heading={
                    <>
                        Your first US drop
                        <br />
                        <em style={{ color: "var(--mint)" }}>starts with one call.</em>
                    </>
                }
                text="30 minutes on your brand, your audience and your goals. Leave with a clear view of what a Test Drop would look like for you."
                button="Book a 30-minute intro"
                href={BOOK}
            />

            <RdFooter />
        </RdPage>
    );
}
