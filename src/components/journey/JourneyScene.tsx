import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { runLoop } from "../scale/renderLoop";
import { buildJourneyGlobe } from "./journeyGlobe";

export interface JourneyState {
    /* Scroll progress through the section, 0 → 1. */
    p: number;
    /* How much of the canvas a close-up clip covers, 0 → 1. Fully covered,
       the globe skips rendering. */
    cover: number;
}

interface Props {
    stateRef: MutableRefObject<JourneyState>;
    lite: boolean;
    reducedMotion: boolean;
    /* Reduced motion: render one still per entry and hand back data URLs. */
    stills?: number[];
    onStills?: (urls: string[]) => void;
    onFail?: () => void;
}

/* The live globe behind the journey story. Loaded lazily. */
export default function JourneyScene({ stateRef, lite, reducedMotion, stills, onStills, onFail }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, powerPreference: "high-performance" });
        } catch {
            onFail?.();
            return;
        }

        const globe = buildJourneyGlobe(lite);
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(globe.scene, globe.camera));
        if (!lite) composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.8, 0.45, 0.55));
        composer.addPass(new OutputPass());

        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        globe.resize(w / h);

        let t = 0;
        let p = stateRef.current.p;

        if (reducedMotion) {
            const urls: string[] = [];
            t = 4;
            for (const sp of stills ?? [0]) {
                globe.update(t, sp);
                composer.render(0);
                urls.push(canvas.toDataURL("image/webp", 0.82));
            }
            onStills?.(urls);
        }

        const loop = runLoop({
            container,
            renderer,
            composer,
            paused: reducedMotion,
            onResize: (cw, ch) => globe.resize(cw / ch),
            frame: (dt) => {
                t += dt;
                // Critically damped ease toward the scroll position.
                p += (stateRef.current.p - p) * (1 - Math.exp(-dt * 5));
                // A close-up fully covers the canvas: skip the render, keep time.
                if (stateRef.current.cover > 0.98) return;
                globe.update(t, p);
                composer.render(dt);
            },
        });

        return () => {
            loop.dispose();
            globe.dispose();
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
