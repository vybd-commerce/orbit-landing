import { Suspense, lazy, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { OPS_STACK_LAYERS, OPS_STACK_SLABS } from "../data/opsStack";
import "./OpsStackDiagram.css";

/* three is ~150kB gzipped — too much for the main bundle for a section most
   visitors scroll past. The rail below carries every word a reader needs, so
   the section is complete before this ever arrives. */
const OpsStackCanvas = lazy(() => import("./OpsStackCanvas"));

export default function OpsStackDiagram({ sectionNumber }: { sectionNumber: string }) {
  const [activeId, setActiveId] = useState<string>(OPS_STACK_LAYERS[0].id);

  /* Narrow screens get a CSS stack instead: WebGL on a phone costs far more
     than this diagram is worth. */
  const isNarrow = useMediaQuery("(max-width: 860px)");

  return (
    <section className="lp-stack-section" id="operating-stack">
      <div className="lp-process-inner">
        <div className="lp-section-tag">{sectionNumber} / THE STACK</div>
        <h2 className="lp-process-h2">Four layers between your systems and your approval.</h2>

        <div className="stack-body">
          {isNarrow ? (
            <div className="stack-visual" aria-hidden="true">
              <div className="stack-css">
                {OPS_STACK_SLABS.map((slab, i) => {
                  /* Keep the brief's proportions: the gaps widen toward the
                     bottom, which groups the three context bands as one layer. */
                  const previous = OPS_STACK_SLABS[i - 1];
                  const gap = previous
                    ? previous.y - previous.height / 2 - (slab.y + slab.height / 2)
                    : 0;
                  return (
                    <span
                      key={slab.name}
                      className={`stack-css-slab ${
                        slab.layerId === activeId ? "is-active" : ""
                      }`}
                      style={{
                        background: slab.color,
                        height: `${slab.height / 3}px`,
                        marginTop: `${gap / 3}px`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <Suspense fallback={<div className="stack-visual" aria-hidden="true" />}>
              <OpsStackCanvas activeId={activeId} />
            </Suspense>
          )}

          <ul className="stack-rail">
            {OPS_STACK_LAYERS.map((layer) => {
              const isActive = layer.id === activeId;
              return (
                <li key={layer.id}>
                  <button
                    type="button"
                    className={`stack-rail-item ${isActive ? "is-active" : ""}`}
                    style={{ "--stack-accent": layer.color } as React.CSSProperties}
                    aria-pressed={isActive}
                    onClick={() => setActiveId(layer.id)}
                    onMouseEnter={() => setActiveId(layer.id)}
                    onFocus={() => setActiveId(layer.id)}
                  >
                    <span className="stack-rail-index">{layer.index}</span>
                    <span className="stack-rail-copy">
                      <span className="stack-rail-title">{layer.title}</span>
                      <span className="stack-rail-summary">{layer.summary}</span>
                      <span className="stack-rail-detail">
                        <span>{layer.detail}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="stack-footnote">
          Data flows down. Approved writes flow back up. The layers are connected, not merely
          adjacent.
        </p>
      </div>
    </section>
  );
}
