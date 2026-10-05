import type * as THREE from "three";
import type { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

/**
 * The render loop shared by the pinned 3D stories on /consulting.
 *
 * - Adaptive resolution: starts at up to 1.5x device pixels, steps down 0.25
 *   when frames run long (>22ms for ~30 frames), steps back up after ~3s of
 *   headroom. Fill rate is what these scenes cost.
 * - Runs only while the canvas is on screen and the tab is visible.
 * - dt is clamped: the first rAF timestamp can predate performance.now().
 */
export function runLoop(opts: {
    container: HTMLElement;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    onResize: (width: number, height: number) => void;
    frame: (dt: number) => void;
    onFirstFrame?: () => void;
    paused?: boolean;
}) {
    const { container, renderer, composer } = opts;
    const maxRatio = Math.min(window.devicePixelRatio, 1.5);
    let ratio = maxRatio;

    const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        renderer.setPixelRatio(ratio);
        composer.setPixelRatio(ratio);
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        opts.onResize(w, h);
    };
    resize();

    let slow = 0;
    let fast = 0;
    const adapt = (ms: number) => {
        if (ms > 22) {
            slow++;
            fast = 0;
        } else if (ms < 12) {
            fast++;
            slow = 0;
        } else {
            slow = fast = 0;
        }
        if (slow > 30 && ratio > 0.75) {
            ratio = Math.max(0.75, ratio - 0.25);
            slow = 0;
            resize();
        } else if (fast > 180 && ratio < maxRatio) {
            ratio = Math.min(maxRatio, ratio + 0.25);
            fast = 0;
            resize();
        }
    };

    let raf = 0;
    let last = performance.now();
    let visible = true;
    let running = false;
    let first = true;

    const tick = (now: number) => {
        const raw = (now - last) / 1000;
        const dt = Math.min(0.05, Math.max(0, raw));
        last = now;
        if (!first) adapt(raw * 1000);
        opts.frame(dt);
        if (first) {
            first = false;
            opts.onFirstFrame?.();
        }
        raf = running ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
        if (running || opts.paused) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
    };
    const stop = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
    };
    const sync = () => (visible && !document.hidden ? start() : stop());
    sync();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const io = new IntersectionObserver(
        ([entry]) => {
            visible = entry.isIntersecting;
            sync();
        },
        { threshold: 0 }
    );
    io.observe(container);
    document.addEventListener("visibilitychange", sync);

    return {
        resize,
        dispose() {
            stop();
            resizeObserver.disconnect();
            io.disconnect();
            document.removeEventListener("visibilitychange", sync);
        },
    };
}
