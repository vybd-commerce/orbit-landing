import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { SCALE_STORY } from "../data/consultingCopy";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { sectionEntry, sectionProgress } from "../lib/sectionProgress";
import "./ScaleStory.css";

/* three is too large for the main bundle; the stage is plain black until it
   lands, which reads as the scene fading up from the dark. */
const ScaleStoryScene = lazy(() => import("./ScaleStoryScene"));

/* Where each chapter starts along the section, and the point inside it the
   rail jumps to (and the reduced-motion still is taken at). Kept in step
   with the chapter weights in ScaleStoryScene. */
const CHAPTER_START = [0, 0.24, 0.48, 0.74];
const CHAPTER_FOCUS = [0.08, 0.4, 0.62, 1];

function chapterAt(p: number) {
    let i = 0;
    while (i < CHAPTER_START.length - 1 && p >= CHAPTER_START[i + 1]) i++;
    return i;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* "The short version": a pinned stage that scrubs one 3D scene through four
   chapters. Native scroll throughout: the stage is position: sticky inside a
   tall section, nothing intercepts the wheel. */
export default function ScaleStory() {
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const phone = useMediaQuery("(max-width: 640px)");
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const [active, setActive] = useState(0);
    const [sceneFailed, setSceneFailed] = useState(false);
    const [stills, setStills] = useState<string[] | null>(null);
    const total = SCALE_STORY.chapters.length;

    useEffect(() => {
        if (reducedMotion) return;
        const section = sectionRef.current;
        const stage = stageRef.current;
        if (!section || !stage) return;

        let frame = 0;
        const measure = () => {
            frame = 0;
            const p = sectionProgress(section);
            progressRef.current = p;
            stage.style.setProperty("--enter", sectionEntry(section).toFixed(3));
            const next = chapterAt(p);
            setActive((prev) => (prev === next ? prev : next));
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };
        measure();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [reducedMotion]);

    const jumpTo = (i: number) => {
        const section = sectionRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const travel = section.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + travel * CHAPTER_FOCUS[i], behavior: "smooth" });
    };

    /* Reduced motion: no pin, no scrub. Four stacked chapters, each over a
       still of the scene at that chapter, rendered once offscreen. */
    if (reducedMotion) {
        return (
            <section className="scale scale--static" id="scale" aria-labelledby="scale-tag">
                <div className="scale-static-inner">
                    <div className="lp-section-tag" id="scale-tag">{SCALE_STORY.tag}</div>
                    <ol className="scale-static-list">
                        {SCALE_STORY.chapters.map((c, i) => (
                            <li key={c.title}>
                                {stills?.[i] && <img src={stills[i]} alt="" className="scale-static-img" />}
                                <span className="scale-index">{pad(i + 1)} / {pad(total)}</span>
                                <h3>{c.title}</h3>
                                <p>{c.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                {!stills && !sceneFailed && (
                    <div className="scale-offscreen" aria-hidden="true">
                        <Suspense fallback={null}>
                            <ScaleStoryScene
                                progressRef={progressRef}
                                lite
                                reducedMotion
                                stills={CHAPTER_FOCUS}
                                onStills={setStills}
                                onFail={() => setSceneFailed(true)}
                            />
                        </Suspense>
                    </div>
                )}
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="scale" id="scale" aria-labelledby="scale-tag">
            <div ref={stageRef} className="scale-stage">
                <div className="scale-canvas" aria-hidden="true">
                    {!sceneFailed && (
                        <Suspense fallback={null}>
                            <ScaleStoryScene
                                key={String(phone)}
                                progressRef={progressRef}
                                lite={phone}
                                reducedMotion={false}
                                onFail={() => setSceneFailed(true)}
                            />
                        </Suspense>
                    )}
                </div>

                <div className="scale-top">
                    <div className="lp-section-tag" id="scale-tag">{SCALE_STORY.tag}</div>
                    <a className="scale-skip" href="#audit">
                        {SCALE_STORY.skip} <ArrowDown size={13} />
                    </a>
                </div>

                <ol className="scale-captions">
                    {SCALE_STORY.chapters.map((c, i) => (
                        <li
                            key={c.title}
                            className={i === active ? "is-active" : ""}
                            aria-current={i === active ? "step" : undefined}
                        >
                            <span className="scale-index">{pad(i + 1)} / {pad(total)}</span>
                            <h3>{c.title}</h3>
                            <p>{c.body}</p>
                        </li>
                    ))}
                </ol>

                <nav className="scale-rail" aria-label="Chapters">
                    {SCALE_STORY.chapters.map((c, i) => (
                        <button
                            key={c.title}
                            type="button"
                            className={i === active ? "is-active" : ""}
                            aria-label={`${pad(i + 1)}: ${c.title}`}
                            aria-current={i === active ? "step" : undefined}
                            onClick={() => jumpTo(i)}
                        >
                            <span>{pad(i + 1)}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </section>
    );
}
