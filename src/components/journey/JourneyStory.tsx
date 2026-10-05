import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { JOURNEY, type Panel } from "../../data/journeyCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { sectionEntry, sectionProgress } from "../../lib/sectionProgress";
import type { JourneyState } from "./JourneyScene";
import "../ScaleStory.css";
import "./JourneyStory.css";

/* three is too large for the main bundle; the stage is black until it lands. */
const JourneyScene = lazy(() => import("./JourneyScene"));

const STEPS = 9;
/* Which chapter each scroll step belongs to: chapter 07 spans the last three. */
const CHAPTER_OF_STEP = [0, 1, 2, 3, 4, 5, 6, 6, 6];
const FIRST_STEP_OF_CHAPTER = [0, 1, 2, 3, 4, 5, 6];
const MEDIA = "/media/journey";

interface Clip {
    id: string;
    step: number;
    /* One full-bleed clip, or three panels side by side. */
    src?: string;
    panels?: { src: string; label: Panel }[];
}

const CLIPS: Clip[] = [
    {
        id: "made",
        step: 1,
        panels: ["made-dhaka", "made-hcmc", "made-shanghai"].map((src, i) => ({ src, label: JOURNEY.made[i] })),
    },
    { id: "loaded", step: 2, src: "loaded" },
    { id: "cleared", step: 4, src: "cleared" },
    {
        id: "shelf",
        step: 5,
        panels: ["shelf-ny", "shelf-london", "shelf-mumbai"].map((src, i) => ({ src, label: JOURNEY.shelf[i] })),
    },
    { id: "ny", step: 6, src: "hand-ny" },
    { id: "london", step: 7, src: "hand-london" },
    { id: "mumbai", step: 8, src: "hand-mumbai" },
];

/* Local easing: importing the scene helpers would pull three into the main
   bundle. */
const smooth = (t: number) => {
    const c = Math.min(1, Math.max(0, t));
    return c * c * (3 - 2 * c);
};
const seg = (x: number, a: number, b: number) => smooth((x - a) / (b - a));

/* A clip fades up once the globe has finished diving (28–45% into its step)
   and back out as the next move starts (85–100%). The last one stays. */
function clipOpacity(p: number, step: number) {
    const f = p * STEPS - step;
    if (f < 0 || f > 1.001) return 0;
    const out = step === STEPS - 1 ? 1 : 1 - seg(f, 0.85, 1);
    return seg(f, 0.28, 0.45) * out;
}

function videoSrc(name: string, full: boolean, video: HTMLVideoElement) {
    const webm = video.canPlayType('video/webm; codecs="vp9"') !== "";
    const size = full && window.innerWidth > 900 ? 1280 : 960;
    return `${MEDIA}/${name}/${size}.${webm ? "webm" : "mp4"}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* "From factory to customer": a pinned stage where a live globe carries three
   products from Asian factories to customers in New York, London and Mumbai,
   diving into cinematic close-ups at each stage. Native scroll throughout. */
export default function JourneyStory() {
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const phone = useMediaQuery("(max-width: 640px)");
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const clipRefs = useRef<(HTMLElement | null)[]>([]);
    const stateRef = useRef<JourneyState>({ p: 0, cover: 0 });
    const [step, setStep] = useState(0);
    const [sceneFailed, setSceneFailed] = useState(false);
    const [stills, setStills] = useState<string[] | null>(null);
    const chapter = CHAPTER_OF_STEP[step];
    const total = JOURNEY.chapters.length;

    useEffect(() => {
        if (reducedMotion) return;
        const section = sectionRef.current;
        const stage = stageRef.current;
        if (!section || !stage) return;

        let frame = 0;
        const measure = () => {
            frame = 0;
            const p = sectionProgress(section);
            const current = Math.min(STEPS - 1, Math.floor(p * STEPS));
            stateRef.current.p = p;
            stage.style.setProperty("--enter", sectionEntry(section).toFixed(3));
            let cover = 0;
            CLIPS.forEach((clip, i) => {
                const el = clipRefs.current[i];
                if (!el) return;
                const o = clipOpacity(p, clip.step);
                cover = Math.max(cover, o);
                el.style.setProperty("--o", o.toFixed(3));
                el.style.visibility = o > 0.001 ? "visible" : "hidden";
                const near = Math.abs(current - clip.step) <= 1;
                el.querySelectorAll("video").forEach((video) => {
                    // Load only what is about to be seen.
                    if (near && !video.getAttribute("src")) {
                        video.src = videoSrc(video.dataset.clip ?? "", !clip.panels, video);
                    }
                    if (o > 0.02 && video.paused && video.getAttribute("src")) {
                        video.play().catch(() => undefined);
                    } else if (o <= 0.02 && !video.paused) {
                        video.pause();
                    }
                });
            });
            stateRef.current.cover = cover;
            setStep((prev) => (prev === current ? prev : current));
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

    const jumpTo = (ch: number) => {
        const section = sectionRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const travel = section.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + (travel * (FIRST_STEP_OF_CHAPTER[ch] + 0.6)) / STEPS, behavior: "smooth" });
    };

    const poster = (name: string) => `${MEDIA}/${name}/poster.webp`;

    /* Reduced motion: seven stacked chapters, posters and two globe stills,
       nothing autoplays. */
    if (reducedMotion) {
        const staticVisual = (ch: number) => {
            if (ch === 0 || ch === 3) {
                const url = stills?.[ch === 0 ? 0 : 1];
                return url ? <img src={url} alt="" className="scale-static-img" /> : null;
            }
            const clip = ch === 6 ? null : CLIPS.find((c) => CHAPTER_OF_STEP[c.step] === ch);
            const names = ch === 6 ? ["hand-ny", "hand-london", "hand-mumbai"] : clip?.panels?.map((x) => x.src) ?? [clip?.src ?? ""];
            return (
                <div className={names.length > 1 ? "jr-static-tri" : ""}>
                    {names.map((n) => (
                        <img key={n} src={poster(n)} alt="" className="scale-static-img" loading="lazy" />
                    ))}
                </div>
            );
        };
        return (
            <section className="scale scale--static" id="journey" aria-labelledby="journey-tag">
                <div className="scale-static-inner">
                    <div className="lp-section-tag" id="journey-tag">{JOURNEY.tag}</div>
                    <ol className="scale-static-list">
                        {JOURNEY.chapters.map((c, i) => (
                            <li key={c.title}>
                                {staticVisual(i)}
                                <span className="scale-index">{pad(i + 1)} / {pad(total)}</span>
                                <h3>{c.title}</h3>
                                <p>{i === total - 1 ? JOURNEY.endings.join(" ") : c.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                {!stills && !sceneFailed && (
                    <div className="scale-offscreen" aria-hidden="true">
                        <Suspense fallback={null}>
                            <JourneyScene
                                stateRef={stateRef}
                                lite
                                reducedMotion
                                stills={[0.5 / STEPS, 3.5 / STEPS]}
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
        <section ref={sectionRef} className="scale journey" id="journey" aria-labelledby="journey-tag">
            <div ref={stageRef} className="scale-stage">
                <div className="scale-canvas" aria-hidden="true">
                    {!sceneFailed && (
                        <Suspense fallback={null}>
                            <JourneyScene
                                key={String(phone)}
                                stateRef={stateRef}
                                lite={phone}
                                reducedMotion={false}
                                onFail={() => setSceneFailed(true)}
                            />
                        </Suspense>
                    )}
                </div>

                <div className="jr-clips" aria-hidden="true">
                    {CLIPS.map((clip, i) => (
                        <figure
                            key={clip.id}
                            ref={(el) => {
                                clipRefs.current[i] = el;
                            }}
                            className={`jr-clip${clip.panels ? " jr-clip--tri" : ""}`}
                        >
                            {clip.panels ? (
                                clip.panels.map((panel) => (
                                    <div className="jr-panel" key={panel.src}>
                                        <video
                                            data-clip={panel.src}
                                            poster={poster(panel.src)}
                                            muted
                                            loop
                                            playsInline
                                            preload="none"
                                        />
                                        <figcaption>
                                            <span>{panel.label.city}</span> {panel.label.label}
                                        </figcaption>
                                    </div>
                                ))
                            ) : (
                                <video
                                    data-clip={clip.src}
                                    poster={poster(clip.src ?? "")}
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                />
                            )}
                        </figure>
                    ))}
                </div>

                <div className="scale-top">
                    <div className="lp-section-tag" id="journey-tag">{JOURNEY.tag}</div>
                    <a className="scale-skip" href="#audit">
                        {JOURNEY.skip} <ArrowDown size={13} />
                    </a>
                </div>

                <ol className="scale-captions">
                    {JOURNEY.chapters.map((c, i) => (
                        <li
                            key={c.title}
                            className={i === chapter ? "is-active" : ""}
                            aria-current={i === chapter ? "step" : undefined}
                        >
                            <span className="scale-index">{pad(i + 1)} / {pad(total)}</span>
                            <h3>{c.title}</h3>
                            {i === total - 1 ? (
                                <p className="jr-endings">
                                    {JOURNEY.endings.map((e, k) => (
                                        <span key={e} className={step - 6 === k ? "is-active" : ""}>
                                            {e}
                                        </span>
                                    ))}
                                </p>
                            ) : (
                                <p>{c.body}</p>
                            )}
                        </li>
                    ))}
                </ol>

                <nav className="scale-rail" aria-label="Chapters">
                    {JOURNEY.chapters.map((c, i) => (
                        <button
                            key={c.title}
                            type="button"
                            className={i === chapter ? "is-active" : ""}
                            aria-label={`${pad(i + 1)}: ${c.title}`}
                            aria-current={i === chapter ? "step" : undefined}
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
