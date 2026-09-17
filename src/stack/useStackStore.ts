import { create } from "zustand";
import { STAGES } from "./content";

export const STAGE_COUNT = STAGES.length;

/* The scroll timeline writes into this object IN PLACE, every frame. It is
 * deliberately not React state: nothing re-renders when it changes. Layer
 * components read it inside useFrame and mutate refs.
 *
 * Camera values are spherical — the camera sits at (r, th, ph) around the
 * stack and looks at (0, y, 0). Ported from the prototype's authored track.
 */
export interface StackValues {
  progress: number;

  /** Per-layer reveal, 0..1. Layers accumulate; nothing is removed. */
  align: number;
  ctx: number;
  agent: number;
  app: number;
  gov: number;
  rev: number;
  loop: number;
  /** Sources dim once governance arrives, so the lower stack reads. */
  srcDim: number;

  /** Camera track. */
  th: number;
  ph: number;
  r: number;
  y: number;
}

export const INITIAL_VALUES: StackValues = {
  progress: 0,
  align: 0,
  ctx: 0,
  agent: 0,
  app: 0,
  gov: 0,
  rev: 0,
  loop: 0,
  srcDim: 0,
  th: -0.5,
  ph: 1.02,
  r: 11.5,
  y: 3.6,
};

interface StackStore {
  /** Set once at mount. Kills packets, micro-moments and scrub smoothing. */
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  /** Total packets allowed to draw. PerformanceMonitor walks this down. */
  packetBudget: number;
  setPacketBudget: (count: number) => void;
  /** Post FX is desktop-only and the first thing dropped under load. */
  postFx: boolean;
  setPostFx: (enabled: boolean) => void;

  /** Mutated in place by the timeline. Never triggers a render. */
  values: StackValues;
  /** Drives the DOM — panels and rail. This one does trigger a render. */
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  /** True once the canvas has compiled and is ready to be shown. */
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
}

export const useStackStore = create<StackStore>((set) => ({
  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  packetBudget: 0,
  setPacketBudget: (packetBudget) => set({ packetBudget }),
  postFx: false,
  setPostFx: (postFx) => set({ postFx }),
  values: { ...INITIAL_VALUES },
  activeIndex: 0,
  setActiveIndex: (index) =>
    set((state) => (state.activeIndex === index ? state : { activeIndex: index })),
  sceneReady: false,
  setSceneReady: (sceneReady) => set({ sceneReady }),
}));

/** Read the live values without subscribing — the useFrame path. */
export const stackValues = () => useStackStore.getState().values;
