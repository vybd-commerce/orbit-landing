import { useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { AnnotationProjector } from "./Annotations";
import Sources from "./layers/Sources";
import ContextLayer from "./layers/ContextLayer";
import AgentLayer from "./layers/AgentLayer";
import ApplicationLayer from "./layers/ApplicationLayer";
import GovernanceLayer from "./layers/GovernanceLayer";
import ReviewLayer from "./layers/ReviewLayer";
import Packets from "./layers/Packets";
import { PACKETS_DESKTOP, PACKETS_MOBILE } from "./sceneConstants";
import { stackValues, useStackStore } from "./useStackStore";

/* WebGL2 only for v1. The renderer setup is deliberately kept in one place so
 * a WebGPU renderer can be swapped in later without touching the layers.
 */

/** Reads the timeline's values every frame and poses the camera. Never renders. */
function CameraRig() {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const v = stackValues();
    camera.position.set(
      v.r * Math.sin(v.ph) * Math.sin(v.th),
      v.r * Math.cos(v.ph) + v.y,
      v.r * Math.sin(v.ph) * Math.cos(v.th),
    );
    camera.lookAt(0, v.y, 0);
  });

  return null;
}

/** Compiles shaders before the scene is first shown, so the first scroll has
 *  no hitch, then lets the page fade the canvas in. */
function WarmUp() {
  const setSceneReady = useStackStore((s) => s.setSceneReady);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    gl.compile(scene, camera);
    setSceneReady(true);
  }, [gl, scene, camera, setSceneReady]);

  return null;
}

export default function StackScene({ visible }: { visible: boolean }) {
  const [dpr, setDpr] = useState(1.5);
  const [isPortrait] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches,
  );

  const postFx = useStackStore((s) => s.postFx);
  const setPostFx = useStackStore((s) => s.setPostFx);
  const setPacketBudget = useStackStore((s) => s.setPacketBudget);
  const setReducedMotion = useStackStore((s) => s.setReducedMotion);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    setPacketBudget(isPortrait ? PACKETS_MOBILE : PACKETS_DESKTOP);
    /* No postprocessing on mobile at all, per the brief. */
    setPostFx(!isPortrait && !reduced);
  }, [isPortrait, setPostFx, setPacketBudget, setReducedMotion]);

  /* The degradation ladder the brief asks for: resolution first, then packet
     count, then post FX. Each step is cheaper to lose than the one after it. */
  const degrade = () => {
    const store = useStackStore.getState();
    if (dpr > 1) setDpr(1);
    else if (store.packetBudget > PACKETS_MOBILE) setPacketBudget(PACKETS_MOBILE);
    else if (store.postFx) setPostFx(false);
  };

  return (
    <Canvas
      /* Only render while the section is on screen — the page is 700vh and the
         canvas is sticky, so it would otherwise run the whole way down. */
      frameloop={visible ? "always" : "never"}
      dpr={dpr}
      camera={{ fov: 38, near: 0.1, far: 140, position: [0, 4, 12] }}
      gl={{
        antialias: !isPortrait,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <fog attach="fog" args={["#0D1014", 20, 52]} />

      <ambientLight intensity={0.82} />
      <directionalLight position={[6, 11, 7]} intensity={0.6} />
      <directionalLight position={[-8, 3, -6]} intensity={0.32} color="#7f9dc4" />

      <PerformanceMonitor
        onDecline={degrade}
        onFallback={degrade}
        onIncline={() => setDpr((current) => Math.min(2, current + 0.5))}
      />
      <AdaptiveDpr pixelated />

      <CameraRig />

      <Sources />
      <ContextLayer />
      <AgentLayer />
      <ApplicationLayer />
      <GovernanceLayer />
      <ReviewLayer />
      <Packets />

      <AnnotationProjector />
      <WarmUp />

      {postFx && (
        <EffectComposer>
          <Bloom intensity={0.42} luminanceThreshold={0.72} luminanceSmoothing={0.3} mipmapBlur />
          <Vignette offset={0.3} darkness={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
