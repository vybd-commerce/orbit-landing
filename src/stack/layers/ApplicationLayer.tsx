import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Slab, type SlabHandle } from "./Slab";
import { COLORS, D, RISE, W, Y, clamp01 } from "../sceneConstants";
import { stackValues } from "../useStackStore";

/* 03 Application — a plate with ten queue rows that stagger in across its
 * surface. A ranked queue of decisions, not a dashboard.
 *
 * The stagger is carried by per-instance X scale, which wipes each row in from
 * nothing. That reads better than a fade and, unlike opacity, it is available
 * per instance.
 */

const ROWS = 10;

/** Reused for every instance write — see the note in Sources. */
const dummy = new THREE.Object3D();

export default function ApplicationLayer() {
  const plateRef = useRef<SlabHandle>(null);
  const rowsRef = useRef<THREE.InstancedMesh>(null);

  useFrame(() => {
    const v = stackValues();

    plateRef.current?.setFade(v.app);
    plateRef.current?.setPosition(0, Y.appPlate - (1 - v.app) * RISE, 0);

    const mesh = rowsRef.current;
    if (!mesh) return;

    for (let i = 0; i < ROWS; i++) {
      const reveal = clamp01(v.app * 1.6 - i * 0.09);
      dummy.position.set(-0.4, Y.appRows - (1 - v.app) * RISE, -1.15 + i * 0.26);
      dummy.scale.set(3.0 * reveal, 0.03, 0.2);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    (mesh.material as THREE.MeshLambertMaterial).opacity = v.app * 0.8;
  });

  return (
    <group>
      <Slab ref={plateRef} size={[W, 0.16, D]} color={COLORS.application} peak={0.85} />
      <instancedMesh ref={rowsRef} args={[undefined, undefined, ROWS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={COLORS.application} transparent opacity={0} />
      </instancedMesh>
    </group>
  );
}
