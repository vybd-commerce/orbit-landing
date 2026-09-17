import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Slab, type SlabHandle } from "./Slab";
import { COLORS, D, RISE, W, Y } from "../sceneConstants";
import { stackValues, useStackStore } from "../useStackStore";

/* 04 Governance — the slab, the threshold gate, and the micro-moment that
 * makes the layer's job legible: a packet descends, hits the gate, turns coral
 * and dies while the gate flashes. Loops slowly.
 *
 * This is the one place in the scene where something is REFUSED, so it earns
 * the most literal animation on the page.
 */

/** Fraction of the loop spent descending, before the gate stops it. */
const HIT = 0.55;

const contextColor = new THREE.Color(COLORS.context);
const rejectedColor = new THREE.Color(COLORS.review);

export default function GovernanceLayer() {
  const slabRef = useRef<SlabHandle>(null);
  const gateRef = useRef<THREE.Mesh>(null);
  const packetRef = useRef<THREE.Mesh>(null);
  const loop = useRef(0);

  useFrame((_, delta) => {
    const v = stackValues();
    const reduced = useStackStore.getState().reducedMotion;

    slabRef.current?.setFade(v.gov);
    slabRef.current?.setPosition(0, Y.governance - (1 - v.gov) * RISE, 0);

    const gate = gateRef.current?.material as THREE.MeshBasicMaterial | undefined;
    const packet = packetRef.current;
    const packetMaterial = packet?.material as THREE.MeshBasicMaterial | undefined;
    if (!gate || !packet || !packetMaterial) return;

    /* Only run the demonstration once the layer is actually established. */
    if (v.gov <= 0.55 || reduced) {
      packetMaterial.opacity = 0;
      gate.opacity = 0;
      return;
    }

    loop.current += delta * 0.42;
    if (loop.current > 1) loop.current = 0;
    const t = loop.current;

    if (t < HIT) {
      /* Descending, still approved-looking. */
      packet.position.set(0.7, -1.0 - (t / HIT) * 1.55, 0.3);
      packetMaterial.color.copy(contextColor);
      packetMaterial.opacity = 0.95;
      gate.opacity = 0.05 * v.gov;
    } else {
      /* Refused at the threshold: recoloured, fading, gate flaring. */
      const k = (t - HIT) / (1 - HIT);
      packet.position.set(0.7, -2.55, 0.3);
      packetMaterial.color.copy(rejectedColor);
      packetMaterial.opacity = 0.95 * (1 - k);
      gate.opacity = (0.05 + 0.28 * (1 - k)) * v.gov;
    }
  });

  return (
    <group>
      <Slab ref={slabRef} size={[W, 0.42, D]} color={COLORS.governance} peak={0.9} />

      <mesh ref={gateRef} position={[0, Y.gate, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.3, D - 0.3]} />
        <meshBasicMaterial
          color={COLORS.governance}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={packetRef} frustumCulled={false}>
        <sphereGeometry args={[0.085, 10, 10]} />
        <meshBasicMaterial color={COLORS.context} transparent opacity={0} />
      </mesh>
    </group>
  );
}
