import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

/* The scene's one repeated primitive: a translucent box with its own edge
 * lines. Every layer is built from these.
 *
 * Fading is imperative on purpose. Layers reveal on scroll, which means the
 * opacity changes every frame — routing that through React state would
 * re-render the tree sixty times a second.
 */

export interface SlabHandle {
  group: THREE.Group;
  /** 0..1 reveal. Drives body and edge opacity together. */
  setFade: (t: number) => void;
  setPosition: (x: number, y: number, z: number) => void;
}

interface SlabProps {
  size: [number, number, number];
  color: THREE.ColorRepresentation;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** Opacity at full reveal. */
  peak?: number;
  edgePeak?: number;
}

export const Slab = forwardRef<SlabHandle, SlabProps>(function Slab(
  { size, color, position = [0, 0, 0], rotation = [0, 0, 0], peak = 0.9, edgePeak = 0.55 },
  ref,
) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);

  /* Built once. These components hold no state, so they never re-render and
     this memo is really just a guard against a future parent re-render. */
  const geometry = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useEffect(
    () => () => {
      geometry.dispose();
      edgeGeometry.dispose();
    },
    [geometry, edgeGeometry],
  );

  useImperativeHandle(
    ref,
    () => ({
      group: groupRef.current!,
      setFade(t) {
        const body = bodyRef.current?.material as THREE.MeshLambertMaterial | undefined;
        const edge = edgeRef.current?.material as THREE.LineBasicMaterial | undefined;
        if (body) body.opacity = t * peak;
        if (edge) edge.opacity = t * edgePeak;
      },
      setPosition(x, y, z) {
        groupRef.current?.position.set(x, y, z);
      },
    }),
    [peak, edgePeak],
  );

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh ref={bodyRef} geometry={geometry}>
        <meshLambertMaterial color={color} transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgeRef} geometry={edgeGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0} />
      </lineSegments>
    </group>
  );
});
