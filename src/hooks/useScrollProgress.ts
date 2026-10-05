import { useEffect, useRef, useState } from "react";

/**
 * 0 → 1 as an element scrolls past a line across the viewport.
 *
 * Progress is 0 while the element's top is below `anchor` (a fraction of the
 * viewport height from the top) and 1 once its bottom has passed it, so a
 * tall element fills in step with the reader's eye rather than all at once.
 *
 * Off (`enabled` false) it does nothing and reports 1. Under
 * prefers-reduced-motion it also reports 1, so the finished state is there on
 * first paint. Scroll work is batched to one read per animation frame and
 * only sets state when the value moves enough to be visible.
 */
export function useScrollProgress<T extends Element>(enabled: boolean, anchor = 0.65) {
    const ref = useRef<T>(null);
    const [progress, setProgress] = useState(0);
    const active =
        enabled && typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    useEffect(() => {
        const el = ref.current;
        if (!active || !el) return;

        let frame = 0;
        const measure = () => {
            frame = 0;
            const rect = el.getBoundingClientRect();
            const line = window.innerHeight * anchor;
            const raw = (line - rect.top) / Math.max(rect.height, 1);
            const next = Math.round(Math.min(1, Math.max(0, raw)) * 200) / 200;
            setProgress((prev) => (prev === next ? prev : next));
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [active, anchor]);

    return { ref, progress: active ? progress : 1 };
}
