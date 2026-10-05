import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { buildGlobe } from "./scale/globeWorld";
import { buildLane } from "./scale/laneWorld";
import { seg, type WorldState } from "./scale/common";
import { runLoop } from "./scale/renderLoop";

/* /consulting, "The short version": two worlds on one scroll.
 *
 *   01 the globe: real hubs and lanes, ships, planes, trains, trucks, orders
 *   → dive into the transpacific lane
 *   02 the lane up close, with a data layer revealed beneath it
 *   03 agents over every node and riding the freight
 *   → rise back out to the globe
 *   04 the planet with a data shell, agents on every hub, hundreds of sites
 *
 * Both worlds live in their own scenes. A blend pass renders whichever are
 * visible and cross-zooms between them, then bloom and output run once.
 * Scroll sets the target; the scene eases toward it, so native scroll is
 * untouched. Loaded lazily; three stays out of the main bundle.
 */

type World = { scene: THREE.Scene; camera: THREE.PerspectiveCamera };

class BlendPass extends Pass {
    mix = 0;
    private rtA: THREE.WebGLRenderTarget;
    private rtB: THREE.WebGLRenderTarget;
    private quad: FullScreenQuad;
    private material: THREE.ShaderMaterial;

    private a: World;
    private b: World;

    constructor(a: World, b: World, samples: number) {
        super();
        this.a = a;
        this.b = b;
        const opts = { type: THREE.HalfFloatType, samples };
        this.rtA = new THREE.WebGLRenderTarget(1, 1, opts);
        this.rtB = new THREE.WebGLRenderTarget(1, 1, opts);
        this.material = new THREE.ShaderMaterial({
            uniforms: { tA: { value: null }, tB: { value: null }, uMix: { value: 0 } },
            vertexShader: `
                varying vec2 vUv;
                void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
            fragmentShader: `
                uniform sampler2D tA;
                uniform sampler2D tB;
                uniform float uMix;
                varying vec2 vUv;
                void main() {
                    // The outgoing world keeps pushing in as it fades; the
                    // incoming one settles from slightly wide. Reads as one move.
                    vec2 ca = (vUv - 0.5) * (1.0 - 0.45 * uMix) + 0.5;
                    vec2 cb = (vUv - 0.5) * (1.0 + 0.3 * (1.0 - uMix)) + 0.5;
                    vec4 A = texture2D(tA, ca);
                    vec4 B = texture2D(tB, cb);
                    gl_FragColor = mix(A, B, smoothstep(0.0, 1.0, uMix));
                }`,
            depthTest: false,
            depthWrite: false,
        });
        this.quad = new FullScreenQuad(this.material);
    }

    setSize(w: number, h: number) {
        this.rtA.setSize(w, h);
        this.rtB.setSize(w, h);
    }

    render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget) {
        if (this.mix < 0.999) {
            renderer.setRenderTarget(this.rtA);
            renderer.clear();
            renderer.render(this.a.scene, this.a.camera);
        }
        if (this.mix > 0.001) {
            renderer.setRenderTarget(this.rtB);
            renderer.clear();
            renderer.render(this.b.scene, this.b.camera);
        }
        this.material.uniforms.tA.value = this.rtA.texture;
        this.material.uniforms.tB.value = this.rtB.texture;
        this.material.uniforms.uMix.value = this.mix;
        renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
        this.quad.render(renderer);
    }

    dispose() {
        this.rtA.dispose();
        this.rtB.dispose();
        this.material.dispose();
        this.quad.dispose();
    }
}

interface Props {
    progressRef: MutableRefObject<number>;
    lite: boolean;
    reducedMotion: boolean;
    /* Reduced motion: render one still per entry and hand back data URLs
       instead of running a loop. */
    stills?: number[];
    onStills?: (urls: string[]) => void;
    onReady?: () => void;
    onFail?: () => void;
}

export default function ScaleStoryScene({
    progressRef,
    lite,
    reducedMotion,
    stills,
    onStills,
    onReady,
    onFail,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
        } catch {
            onFail?.();
            return;
        }
        const globe = buildGlobe(lite);
        const lane = buildLane(lite);

        const composer = new EffectComposer(renderer);
        const blend = new BlendPass(globe, lane, lite ? 0 : 4);
        composer.addPass(blend);
        if (!lite) composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.8, 0.45, 0.55));
        composer.addPass(new OutputPass());

        // Size once up front so reduced-motion stills render at the right size;
        // the loop takes over resizing after that.
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false);
        composer.setSize(container.clientWidth || 1, container.clientHeight || 1);
        globe.resize((container.clientWidth || 1) / (container.clientHeight || 1));
        lane.resize((container.clientWidth || 1) / (container.clientHeight || 1));

        const state: WorldState = { t: 0, dt: 0, p: progressRef.current, lite, aspect: 1 };
        const frame = (dt: number) => {
            state.dt = dt;
            state.t += dt;
            // Globe → lane on the way into chapter 02; back out for chapter 04.
            const mix = seg(state.p, 0.18, 0.28) * (1 - seg(state.p, 0.74, 0.84));
            blend.mix = mix;
            globe.update(state, mix < 0.999);
            lane.update(state, mix > 0.001);
            composer.render(dt);
        };

        /* ── Reduced motion: stills only ── */
        if (reducedMotion) {
            const urls: string[] = [];
            state.t = 3.2; // ships mid-crossing, crane mid-lift
            for (const p of stills ?? [1]) {
                state.p = p;
                frame(0);
                urls.push(canvas.toDataURL("image/webp", 0.82));
            }
            onStills?.(urls);
            onReady?.();
        }

        /* ── Loop ── */
        const loop = runLoop({
            container,
            renderer,
            composer,
            paused: reducedMotion,
            onResize: (w, h) => {
                globe.resize(w / h);
                lane.resize(w / h);
            },
            frame: (dt) => {
                // Critically damped ease toward the scroll position.
                state.p += (progressRef.current - state.p) * (1 - Math.exp(-dt * 5));
                frame(dt);
            },
            onFirstFrame: onReady,
        });

        return () => {
            loop.dispose();
            globe.dispose();
            lane.dispose();
            blend.dispose();
            composer.dispose();
            renderer.dispose();
        };
        // Props are fixed for the life of the scene; the parent remounts it
        // (by key) if lite or reduced motion change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={containerRef} className="scale-scene">
            <canvas ref={canvasRef} />
        </div>
    );
}
