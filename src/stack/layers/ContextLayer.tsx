import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Slab, type SlabHandle } from "./Slab";
import { COLORS, D, RISE, W, Y, clamp01 } from "../sceneConstants";
import { seeded } from "../rng";
import { stackValues } from "../useStackStore";

/* 01 Context — three bands (raw mirror, resolved model, scoped reads) and the
 * resolved entities glinting across the top band. The bands stagger so the
 * layer builds rather than appearing all at once.
 */

const BANDS = 3;
const NODES = 28;

/** Reused for every instance write — see the note in Sources. */
const dummy = new THREE.Object3D();

export default function ContextLayer() {
  const bandRefs = useRef<(SlabHandle | null)[]>([]);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  const bandColors = useMemo(
    () =>
      Array.from({ length: BANDS }, (_, b) =>
        new THREE.Color(COLORS.context).multiplyScalar(1 - b * 0.24).getHex(),
      ),
    [],
  );

  const nodes = useMemo(() => {
    const rand = seeded(991);
    return Array.from({ length: NODES }, () => ({
      x: (rand() - 0.5) * (W - 0.8),
      z: (rand() - 0.5) * (D - 0.6),
      phase: rand() * 6.28,
    }));
  }, []);

  useFrame(({ clock }) => {
    const v = stackValues();
    const t = clock.getElapsedTime();

    for (let b = 0; b < BANDS; b++) {
      const band = bandRefs.current[b];
      if (!band) continue;
      const reveal = clamp01(v.ctx * 1.2 - b * 0.12);
      band.setFade(reveal);
      band.setPosition(0, Y.contextTop - b * Y.contextStep - (1 - reveal) * (RISE + 0.2), 0);
    }

    const mesh = nodesRef.current;
    if (mesh) {
      for (let i = 0; i < NODES; i++) {
        dummy.position.set(nodes[i].x, Y.contextTop + 0.16, nodes[i].z);
        /* Entities resolve and settle — the glint is the resolution reading. */
        const glint = 0.3 + 0.5 * Math.abs(Math.sin(t + nodes[i].phase));
        dummy.scale.setScalar(v.ctx * glint);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      (mesh.material as THREE.MeshBasicMaterial).opacity = v.ctx * 0.8;
    }
  });

  return (
    <group>
      {bandColors.map((color, b) => (
        <Slab
          key={b}
          ref={(handle) => {
            bandRefs.current[b] = handle;
          }}
          size={[W, 0.28, D]}
          color={color}
          peak={0.92}
        />
      ))}

      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODES]} frustumCulled={false}>
        <sphereGeometry args={[0.042, 6, 6]} />
        <meshBasicMaterial color="#E1F5EE" transparent opacity={0} />
      </instancedMesh>
    </group>
  );
}
