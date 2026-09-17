import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Slab, type SlabHandle } from "./Slab";
import { COLORS, D, RISE, W, Y, clamp01 } from "../sceneConstants";
import { stackValues, useStackStore } from "../useStackStore";

/* 05 Review — the slab, three proposal cards, and the approved card that lifts
 * off the queue and fires upward out of frame. That exit is the loop starting:
 * an approved write heading back to the systems it came from.
 */

const CARDS = 3;
/** Fraction of the loop spent lifting off the queue before the card departs. */
const LIFT = 0.35;

export default function ReviewLayer() {
  const slabRef = useRef<SlabHandle>(null);
  const cardRefs = useRef<(SlabHandle | null)[]>([]);
  const approvedRef = useRef<SlabHandle>(null);
  const loop = useRef(0);

  useFrame((_, delta) => {
    const v = stackValues();
    const reduced = useStackStore.getState().reducedMotion;

    slabRef.current?.setFade(v.rev);
    slabRef.current?.setPosition(0, Y.review - (1 - v.rev) * RISE, 0);

    for (let i = 0; i < CARDS; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;
      const reveal = clamp01(v.rev * 1.4 - i * 0.14);
      card.setFade(reveal);
      card.setPosition(-1.5 + i * 1.5, Y.cards + i * 0.08 - (1 - reveal) * 0.8, 0.15 - i * 0.15);
    }

    const approved = approvedRef.current;
    if (!approved) return;

    if (v.rev <= 0.6 || reduced) {
      approved.setFade(0);
      return;
    }

    loop.current += delta * 0.3;
    if (loop.current > 1) loop.current = 0;
    const t = loop.current;

    if (t < LIFT) {
      /* Lifting clear of the queue. */
      approved.setPosition(0, Y.cards + (t / LIFT) * 0.5, 0);
      approved.setFade(t / LIFT);
    } else {
      /* Away, back up the stack. */
      const k = (t - LIFT) / (1 - LIFT);
      approved.setPosition(0, -3.7 + k * 8.2, 0);
      approved.setFade((1 - k) * 0.9);
    }
  });

  return (
    <group>
      <Slab ref={slabRef} size={[W, 0.42, D]} color={COLORS.review} peak={0.9} />

      {Array.from({ length: CARDS }, (_, i) => (
        <Slab
          key={i}
          ref={(handle) => {
            cardRefs.current[i] = handle;
          }}
          size={[1.45, 0.05, 0.92]}
          color="#FAECE7"
          rotation={[0, (i - 1) * 0.11, 0]}
          peak={0.95}
        />
      ))}

      <Slab ref={approvedRef} size={[1.45, 0.05, 0.92]} color={COLORS.review} peak={0.95} />
    </group>
  );
}
