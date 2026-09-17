import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SOURCE_SYSTEMS, STAGES } from "./content";
import { sourcePositions } from "./sourceState";
import { stackValues, type StackValues } from "./useStackStore";
import "./Annotations.css";

/* Projected HTML labels — the one place where DOM text is pinned to geometry.
 *
 * Desktop only. Below 900px the brief hands this job to the metrics strip in
 * the narrative copy, because there is no room for leader lines beside a
 * phone-width canvas.
 *
 * The split here is forced by R3F: a component inside <Canvas> can only return
 * three.js objects, so the divs are rendered by AnnotationLayer in the page and
 * positioned by AnnotationProjector inside the canvas. They meet at this
 * module-level registry, which keeps the per-frame writes out of React
 * entirely — same reasoning as the timeline's values object.
 */

/** Reused for every projection — see the note in Sources. */
const projected = new THREE.Vector3();

const registry = {
  labels: [] as (HTMLDivElement | null)[],
  chips: [] as (HTMLDivElement | null)[],
};

/** Which timeline value reveals a stage's annotations, and which supersedes
 *  them as the next layer takes the frame. */
const REVEAL: Record<string, { on: keyof StackValues; next?: keyof StackValues }> = {
  context: { on: "ctx", next: "agent" },
  agent: { on: "agent", next: "app" },
  application: { on: "app", next: "gov" },
  governance: { on: "gov", next: "rev" },
  review: { on: "rev", next: "loop" },
};

/** Flattened once, and the DOM order below matches this exactly. */
const ANNOTATIONS = STAGES.flatMap((stage) =>
  stage.annotations.map((annotation) => ({
    key: `${stage.id}-${annotation.text}`,
    accent: stage.accent,
    position: new THREE.Vector3(...annotation.at),
    side: annotation.side,
    text: annotation.text,
    on: REVEAL[stage.id]?.on ?? ("ctx" as keyof StackValues),
    next: REVEAL[stage.id]?.next,
  })),
);

/** The DOM half. Render inside the sticky canvas container. */
export function AnnotationLayer() {
  return (
    <>
      {ANNOTATIONS.map((annotation, i) => (
        <div
          key={annotation.key}
          className={`stack-anno ${annotation.side === "left" ? "is-left" : ""}`}
          style={{ "--c": annotation.accent } as React.CSSProperties}
          ref={(el) => {
            registry.labels[i] = el;
          }}
        >
          <span>{annotation.text}</span>
        </div>
      ))}

      {SOURCE_SYSTEMS.map((system, i) => (
        <div
          key={system}
          className="stack-chip"
          ref={(el) => {
            registry.chips[i] = el;
          }}
        >
          {system}
        </div>
      ))}
    </>
  );
}

/** The scene half. Renders nothing; projects and writes style every frame. */
export function AnnotationProjector() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useFrame(() => {
    const v = stackValues();
    const { width, height } = size;

    for (let i = 0; i < ANNOTATIONS.length; i++) {
      const el = registry.labels[i];
      if (!el) continue;
      const annotation = ANNOTATIONS[i];
      const on = v[annotation.on];
      const next = annotation.next ? v[annotation.next] : 0;
      /* Fade out as the following layer arrives, so labels never pile up. */
      const opacity = Math.max(0, on - next * 0.9);

      if (opacity < 0.04) {
        el.style.opacity = "0";
        continue;
      }

      projected.copy(annotation.position).project(camera);
      el.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
      el.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
      el.style.opacity = projected.z > 1 ? "0" : `${opacity}`;
    }

    /* Chips leave as the agent layer arrives — by then the systems have done
       their job and the frame belongs further down the stack. */
    const chipOpacity = 1 - Math.min(1, v.agent * 1.4);
    for (let i = 0; i < registry.chips.length; i++) {
      const chip = registry.chips[i];
      if (!chip) continue;
      if (chipOpacity < 0.04) {
        chip.style.opacity = "0";
        continue;
      }
      projected.copy(sourcePositions[i]);
      projected.y += 0.28;
      projected.project(camera);
      chip.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
      chip.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
      chip.style.opacity = projected.z > 1 ? "0" : `${chipOpacity}`;
    }
  });

  return null;
}
