import { useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useLocalePath } from "../../i18n/context";
import { CASE_DETAILS } from "./caseDetails";
import { CASES } from "./cases";
import { RdFooter, RdHeader, RdLink, RdPage } from "./chrome";
import { useTx } from "./i18n";
import { prefersReducedMotion } from "./motion";
import "./CaseStudyPage.css";

/* One case study, ported from redesign/source/case_template.html (the six
   redesign/pages/Case-*.dc.html pages are that template filled in). */

const SECTIONS: [string, string][] = [
    ["overview", "Overview"],
    ["role", "Our role"],
    ["challenges", "Challenges"],
    ["solutions", "What we did"],
    ["impact", "Impact"],
];

const Tick = () => (
    <span className="tick" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
    </span>
);

/* Calls cb once for each element as it scrolls into view. */
function observeOnce(els: Element[], cb: (el: Element) => void, threshold: number) {
    if (!("IntersectionObserver" in window)) {
        els.forEach(cb);
        return () => {};
    }
    const io = new IntersectionObserver(
        (en) =>
            en.forEach((x) => {
                if (!x.isIntersecting) return;
                cb(x.target);
                io.unobserve(x.target);
            }),
        { threshold, rootMargin: "0px 0px -12% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
}

export default function CaseStudyPage() {
    const { slug = "" } = useParams();
    const tx = useTx();
    const lp = useLocalePath();
    const cmRef = useRef<HTMLDivElement>(null);
    const tocRef = useRef<HTMLOListElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);

    const index = CASES.findIndex((c) => c.slug === slug);
    const c = CASES[index];
    const d = CASE_DETAILS[slug];

    // Metrics count up, challenges and solutions slide in, as they appear.
    useEffect(() => {
        const cm = cmRef.current,
            story = storyRef.current;
        if (!cm || !story) return;
        const timers: number[] = [];
        const reduce = prefersReducedMotion();
        const undo = [
            observeOnce(
                [cm],
                () =>
                    cm.querySelectorAll<HTMLElement>("[data-count]").forEach((el, i) => {
                        const full = el.getAttribute("data-count") ?? "",
                            m = full.match(/^(\D*)(\d+)(.*)$/);
                        if (!m || reduce) return;
                        const target = parseInt(m[2], 10),
                            start = performance.now() + i * 140,
                            dur = 1400;
                        const step = (now: number) => {
                            const t = Math.min(1, Math.max(0, (now - start) / dur)),
                                e = 1 - Math.pow(1 - t, 3);
                            el.textContent = m[1] + Math.round(target * e) + m[3];
                            if (t < 1) requestAnimationFrame(step);
                        };
                        el.textContent = m[1] + "0" + m[3];
                        requestAnimationFrame(step);
                    }),
                0.4
            ),
            observeOnce(
                [...story.querySelectorAll(".chal li")],
                (li) => {
                    const i = [...li.parentNode!.children].indexOf(li);
                    timers.push(window.setTimeout(() => li.classList.add("in"), (i % 2) * 90));
                },
                0.3
            ),
            observeOnce([...story.querySelectorAll(".sol li")], (li) => li.classList.add("in"), 0.6),
        ];
        return () => {
            undo.forEach((u) => u());
            timers.forEach(clearTimeout);
        };
    }, [slug]);

    // Table of contents follows the section being read.
    useEffect(() => {
        let raf = 0;
        const update = () => {
            const toc = tocRef.current,
                story = storyRef.current;
            if (!toc || !story) return;
            const line = window.innerHeight * 0.35;
            let cur: string | null = null;
            story.querySelectorAll(".blk").forEach((b) => {
                if (b.getBoundingClientRect().top < line) cur = b.id;
            });
            cur ??= "overview";
            const bar = toc.querySelector<HTMLElement>(".bar");
            toc.querySelectorAll("a").forEach((a) => {
                const on = a.getAttribute("data-sec") === cur;
                a.classList.toggle("on", on);
                const li = a.parentElement;
                if (on && bar && li) {
                    bar.style.setProperty("--y", li.offsetTop + "px");
                    bar.style.setProperty("--h", li.offsetHeight + "px");
                }
            });
        };
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                update();
            });
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(raf);
        };
    }, [slug, tx]);

    if (!c || !d) return <Navigate to={lp("/case-studies")} replace />;
    const next = CASES[(index + 1) % CASES.length];
    const num = String(index + 1).padStart(2, "0");

    return (
        <RdPage name="case">
            <RdHeader
                logoHref="/"
                links={[
                    { label: "What we do", href: "/us#services" },
                    { label: "How it works", href: "/product" },
                    { label: "Case studies", href: "/case-studies", current: true },
                    { label: "Lab", href: "/lab" },
                ]}
                mobileLinks={[
                    { label: "Home", href: "/" },
                    { label: "Case studies", href: "/case-studies" },
                    { label: "Lab", href: "/lab" },
                ]}
            />

            <section className="ch" aria-labelledby="ch-h1">
                <div className="wrap ch-grid">
                    <div>
                        <RdLink className="ch-back" href="/case-studies">
                            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M11 6l-6 6 6 6" />
                            </svg>
                            {tx("All case studies")}
                        </RdLink>
                        <div className="ch-cat mono">
                            <i></i>
                            {tx(c.category)}
                        </div>
                        <h1 id="ch-h1">
                            <span>
                                <b>{tx(c.title)}</b>
                            </span>
                        </h1>
                        <p className="ch-sum">{tx(c.desc)}</p>
                    </div>
                    <div className="lab" aria-hidden="true">
                        <div className="lab-top">
                            <span>{tx("VYBD POST")}</span>
                            <span>
                                {tx("CASE")} {num}
                            </span>
                        </div>
                        <hr />
                        <div className="lab-brand">{c.brand}</div>
                        <div className="lab-rows">
                            <div>
                                <small>{tx("SECTOR")}</small>
                                <b>{tx(d.sector)}</b>
                            </div>
                            <div>
                                <small>{tx("MARKET")}</small>
                                <b>{tx("United States")}</b>
                            </div>
                        </div>
                        <div className="lab-bars"></div>
                        <div className="lab-trk">
                            <span>VYBD-CS-{num}-US</span>
                        </div>
                        <div className="lab-stamp">
                            <div>
                                {tx("US")}
                                <small>{tx("LAUNCHED")}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cm" aria-label={tx("Results")}>
                <div className="wrap cm-grid" ref={cmRef} key={slug}>
                    {c.metrics.map(([v, l]) => (
                        <div key={l} className="cm-item rv">
                            <b data-count={tx(v)}>{tx(v)}</b>
                            <span>{tx(l)}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="cs">
                <div className="wrap cs-grid">
                    <aside className="toc" aria-label={tx("On this page")}>
                        <p className="mono">{tx("On this page")}</p>
                        <ol ref={tocRef}>
                            <li className="bar" aria-hidden="true"></li>
                            {SECTIONS.map(([id, label]) => (
                                <li key={id}>
                                    <a href={`#${id}`} data-sec={id}>
                                        {tx(label)}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </aside>
                    <div ref={storyRef} key={slug}>
                        <div className="blk rv" id="overview">
                            <h2>{tx("Overview")}</h2>
                            <p className="body">{tx(d.overview)}</p>
                        </div>
                        <div className="blk rv" id="role">
                            <h2>{tx("Our role")}</h2>
                            <p className="body">{tx(d.role)}</p>
                        </div>
                        <div className="blk" id="challenges">
                            <h2 className="rv">{tx("Challenges")}</h2>
                            <ul className="chal">
                                {d.challenges.map((x) => (
                                    <li key={x}>
                                        <i aria-hidden="true">!</i>
                                        <span>{tx(x)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="blk" id="solutions">
                            <h2 className="rv">{tx("What we did")}</h2>
                            <ol className="sol">
                                {d.solutions.map((x) => (
                                    <li key={x}>
                                        <Tick />
                                        <span>{tx(x)}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="blk" id="impact">
                            <h2 className="rv">{tx("Impact")}</h2>
                            <div className="imp rv">
                                <p>{tx(d.impact)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="nx">
                <div className="wrap">
                    <RdLink href={`/case-studies/${next.slug}`}>
                        <div>
                            <small className="mono">{tx("Next case study")}</small>
                            <strong>{next.brand}</strong>
                            <p>{tx(next.title)}</p>
                        </div>
                        <span className="arr" aria-hidden="true">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </span>
                    </RdLink>
                </div>
            </section>

            <section id="contact" className="cta">
                <div className="cta-in">
                    <h2 className="rv">
                        {tx("Let's build your next")} <em>{tx("growth chapter.")}</em>
                    </h2>
                    <p className="rv">{tx("Book a free call and we'll show you how your brand could grow in the US.")}</p>
                    <div className="cta-row rv">
                        <RdLink className="btn btn-mint" href="/book">
                            {tx("Book a free call")}
                        </RdLink>
                        <RdLink className="btn btn-ghost" href="/case-studies">
                            {tx("All case studies")}
                        </RdLink>
                    </div>
                </div>
            </section>

            <RdFooter current="cases" />
        </RdPage>
    );
}
