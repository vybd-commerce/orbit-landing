import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { AnnotationLayer } from "../stack/Annotations";
import StackFallback from "../stack/StackFallback";
import { STAGES } from "../stack/content";
import { useStackStore } from "../stack/useStackStore";
import { useStackTimeline } from "../stack/useStackTimeline";
import "./StackPage.css";

/* three + R3F + drei is a large bundle and this is one route out of twelve.
   The narrative copy below is real DOM text and renders without it. */
const StackScene = lazy(() => import("../stack/StackScene"));

/** Cheap one-shot capability check. A machine without WebGL gets the static
 *  stack instead — the page has to work with the canvas removed entirely. */
function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export default function StackPage() {
  const storyRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);
  const [vizVisible, setVizVisible] = useState(true);
  const [webgl] = useState(detectWebGL);

  const activeIndex = useStackStore((s) => s.activeIndex);
  const sceneReady = useStackStore((s) => s.sceneReady);

  const scrollToStage = useStackTimeline(storyRef);

  /* Gate the render loop on the canvas actually being on screen. */
  useEffect(() => {
    const viz = vizRef.current;
    if (!viz) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVizVisible(entry.isIntersecting),
      { rootMargin: "100% 0px" },
    );
    observer.observe(viz);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stack-page">
      <div className="stack-opener" style={{ opacity: activeIndex === 6 ? 0 : 1 }}>
        <p className="stack-mark">
          Vybd<span>.</span>
        </p>
        <p className="stack-sub">The operating stack</p>
      </div>

      <div
        className="stack-viz"
        ref={vizRef}
        style={{ opacity: webgl && !sceneReady ? 0 : 1 }}
        aria-hidden="true"
      >
        {webgl ? (
          <>
            <Suspense fallback={null}>
              <StackScene visible={vizVisible} />
            </Suspense>
            <AnnotationLayer />
          </>
        ) : (
          <StackFallback />
        )}
      </div>

      <div className="stack-story" ref={storyRef}>
        {STAGES.map((stage, i) => (
          <section
            key={stage.id}
            className={`stack-act x-${stage.anchor.x} y-${stage.anchor.y} ${
              i === activeIndex ? "is-live" : ""
            }`}
            style={{ "--c": stage.accent } as React.CSSProperties}
            aria-labelledby={`stack-heading-${stage.id}`}
          >
            <div className="stack-copy">
              <p className="stack-marker">
                <span className="stack-marker-index">{stage.index}</span>
                <span className="stack-marker-rule" />
                <span className="stack-marker-name">{stage.name}</span>
              </p>
              <h2 id={`stack-heading-${stage.id}`}>{stage.headline}</h2>
              <p className="stack-lede">{stage.lede}</p>
              <ul>
                {stage.points.map((point) => (
                  <li key={point.label}>
                    <b>{point.label}</b> {point.body}
                  </li>
                ))}
              </ul>
              <p className="stack-metrics">{stage.metrics.join(" · ")}</p>
            </div>
          </section>
        ))}
      </div>

      <p className="stack-cue" style={{ opacity: activeIndex === 0 ? 1 : 0 }}>
        Scroll
      </p>

      <nav className="stack-rail" aria-label="Stack sections">
        {STAGES.map((stage, i) => (
          <button
            key={stage.id}
            type="button"
            className={i === activeIndex ? "is-on" : ""}
            aria-current={i === activeIndex ? "true" : undefined}
            onClick={() => scrollToStage(i)}
          >
            <span className="stack-rail-label">
              {stage.index} {stage.name}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
