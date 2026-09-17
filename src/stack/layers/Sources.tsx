import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SOURCE_SYSTEMS } from "../content";
import { COLORS, Y } from "../sceneConstants";
import { seeded } from "../rng";
import { sourcePositions } from "../sourceState";
import { stackValues } from "../useStackStore";

/* 00 Sources — nine systems, scattered and tumbling, snapping into a 3x3 grid
 * as the context layer rises. The build brief calls this the most important
 * moment on the page.
 *
 * Instanced per the brief's rule for anything appearing more than three times.
 * The trade-off: the other layers carry edge lines via EdgesGeometry, which
 * does not instance, so these nine read as solids.
 */

const COUNT = SOURCE_SYSTEMS.length;

/* Scratch object reused for every instance write. Module scope because React's
   compiler rules treat hook results as immutable, and this is mutated sixty
   times a second by design. Safe: useFrame bodies run synchronously. */
const dummy = new THREE.Object3D();

export default function Sources() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const bob = useRef<number[]>([]);

  const blocks = useMemo(() => {
    const rand = seeded(20260825);
    return Array.from({ length: COUNT }, (_, i) => {
      const w = 0.82 + (i % 3) * 0.15;
      const col = i % 3;
      const row = Math.floor(i / 3);
      return {
        scale: new THREE.Vector3(w, 0.15, w * 0.7),
        chaos: new THREE.Vector3(
          (rand() - 0.5) * 7.6,
          4.3 + (rand() - 0.5) * 2.8,
          (rand() - 0.5) * 5.2,
        ),
        rotation: new THREE.Euler((rand() - 0.5) * 0.9, rand() * Math.PI, (rand() - 0.5) * 0.9),
        order: new THREE.Vector3((col - 1) * 1.62, Y.sources, (row - 1) * 1.14),
        phase: rand() * 6.28,
      };
    });
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const v = stackValues();

    if (bob.current.length === 0) bob.current = blocks.map((b) => b.phase);

    for (let i = 0; i < COUNT; i++) {
      const block = blocks[i];
      bob.current[i] += delta * 0.6;

      dummy.position.lerpVectors(block.chaos, block.order, v.align);
      /* The drift only exists while they are still loose. */
      dummy.position.y += (1 - v.align) * Math.sin(bob.current[i]) * 0.13;
      dummy.rotation.set(
        block.rotation.x * (1 - v.align),
        block.rotation.y * (1 - v.align),
        block.rotation.z * (1 - v.align),
      );
      dummy.scale.copy(block.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      sourcePositions[i].copy(dummy.position);
    }
    mesh.instanceMatrix.needsUpdate = true;

    /* Dim once governance arrives, so the lower stack carries the frame. */
    (mesh.material as THREE.MeshLambertMaterial).opacity = (1 - v.srcDim * 0.55) * 0.92;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color={COLORS.sources} transparent opacity={0} />
    </instancedMesh>
  );
}
