import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, D, PACKET_BOTTOM, PACKET_TOP, W } from "../sceneConstants";
import { seeded } from "../rng";
import { stackValues, useStackStore } from "../useStackStore";

/* Flow particles. Down-bound packets appear with the context layer and carry
 * reads toward review; up-bound packets appear with the loop and carry approved
 * writes back to the systems of record.
 *
 * One instanced mesh per direction — two materials, two colours, no per-instance
 * colour bookkeeping. Count is capped by the perf budget in the store.
 */

/** Allocate for the desktop count; the store's budget decides how many draw. */
const MAX_DOWN = 26;
const MAX_UP = 8;

/** Reused for every instance write — see the note in Sources. */
const dummy = new THREE.Object3D();

interface Packet {
  x: number;
  z: number;
  offset: number;
  speed: number;
}

function makePackets(count: number, seed: number): Packet[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => ({
    x: (rand() - 0.5) * (W - 1.5),
    z: (rand() - 0.5) * (D - 1.2),
    offset: rand(),
    speed: 0.13 + rand() * 0.12,
  }));
}

export default function Packets() {
  const downRef = useRef<THREE.InstancedMesh>(null);
  const upRef = useRef<THREE.InstancedMesh>(null);

  const down = useMemo(() => makePackets(MAX_DOWN, 4242), []);
  const up = useMemo(() => makePackets(MAX_UP, 1337), []);
  const phases = useRef({ down: down.map((p) => p.offset), up: up.map((p) => p.offset) });

  useFrame((_, delta) => {
    const v = stackValues();
    const { reducedMotion, packetBudget } = useStackStore.getState();

    /* The budget is a total; split it in the same ratio the scene was
       designed at, so the up-bound stream never vanishes entirely. */
    const downCount = reducedMotion ? 0 : Math.round(packetBudget * (MAX_DOWN / (MAX_DOWN + MAX_UP)));
    const upCount = reducedMotion ? 0 : packetBudget - downCount;

    const write = (
      mesh: THREE.InstancedMesh | null,
      packets: Packet[],
      phase: number[],
      count: number,
      gate: number,
      ascending: boolean,
    ) => {
      if (!mesh) return;
      mesh.count = count;
      const material = mesh.material as THREE.MeshBasicMaterial;
      if (count === 0 || gate < 0.03) {
        material.opacity = 0;
        return;
      }

      let peak = 0;
      for (let i = 0; i < count; i++) {
        phase[i] += delta * packets[i].speed;
        if (phase[i] > 1) phase[i] -= 1;
        const t = phase[i];

        dummy.position.set(
          packets[i].x + (ascending ? 2.3 : 0),
          ascending
            ? PACKET_BOTTOM + t * (PACKET_TOP - PACKET_BOTTOM)
            : PACKET_TOP - t * (PACKET_TOP - PACKET_BOTTOM),
          packets[i].z,
        );
        /* Fade in and out at the ends rather than popping at the boundary. */
        const a = 0.1 + 0.7 * Math.sin(t * Math.PI);
        dummy.scale.setScalar(a);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        peak = Math.max(peak, a);
      }
      mesh.instanceMatrix.needsUpdate = true;
      material.opacity = gate * peak;
    };

    write(downRef.current, down, phases.current.down, downCount, v.ctx, false);
    write(upRef.current, up, phases.current.up, upCount, v.loop, true);
  });

  return (
    <group>
      <instancedMesh ref={downRef} args={[undefined, undefined, MAX_DOWN]} frustumCulled={false}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={COLORS.context} transparent opacity={0} />
      </instancedMesh>

      <instancedMesh ref={upRef} args={[undefined, undefined, MAX_UP]} frustumCulled={false}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={COLORS.review} transparent opacity={0} />
      </instancedMesh>
    </group>
  );
}
