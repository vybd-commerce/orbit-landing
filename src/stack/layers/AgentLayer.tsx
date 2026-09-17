import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Slab, type SlabHandle } from "./Slab";
import { COLORS, D, RISE, W, Y } from "../sceneConstants";
import { stackValues, useStackStore } from "../useStackStore";

/* 02 Agent — a plate carrying five worker units that pulse in sequence.
 * Separate workers, separate jobs: the stagger is the whole point, so each
 * unit runs on its own phase offset.
 *
 * The units are instanced, so per-unit opacity is not available (one material,
 * one opacity). The pulse is carried by per-instance colour instead — against
 * the near-black background, dimming reads the same as fading.
 */

const WORKERS = 5;

/* Reused every frame — see the note in Sources. */
const dummy = new THREE.Object3D();
const baseColor = new THREE.Color(COLORS.agent);
const scratch = new THREE.Color();

export default function AgentLayer() {
  const plateRef = useRef<SlabHandle>(null);
  const workersRef = useRef<THREE.InstancedMesh>(null);

  useFrame(({ clock }) => {
    const v = stackValues();
    const reduced = useStackStore.getState().reducedMotion;
    const t = clock.getElapsedTime();

    plateRef.current?.setFade(v.agent);
    plateRef.current?.setPosition(0, Y.agentPlate - (1 - v.agent) * RISE, 0);

    const mesh = workersRef.current;
    if (!mesh) return;

    for (let i = 0; i < WORKERS; i++) {
      const wave = reduced ? 0 : Math.sin(t * 1.6 - i * 0.9);
      const pulse = 0.55 + 0.45 * Math.max(0, wave);

      dummy.position.set(
        -2.0 + i * 1.0,
        Y.agentWorkers - (1 - v.agent) * RISE + v.agent * wave * 0.04,
        i % 2 ? 0.5 : -0.5,
      );
      dummy.scale.setScalar(0.62);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, scratch.copy(baseColor).multiplyScalar(reduced ? 1 : pulse));
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    (mesh.material as THREE.MeshLambertMaterial).opacity = v.agent * 0.95;
  });

  return (
    <group>
      <Slab ref={plateRef} size={[W, 0.16, D]} color={COLORS.agent} peak={0.85} />
      <instancedMesh ref={workersRef} args={[undefined, undefined, WORKERS]} frustumCulled={false}>
        <boxGeometry args={[1, 0.55, 1]} />
        <meshLambertMaterial color={COLORS.agent} transparent opacity={0} />
      </instancedMesh>
    </group>
  );
}
