import { useEffect, useRef, useState } from "react";

/**
 * Fade-and-rise a section in the first time it scrolls into view.
 *
 * Fires once and disconnects: re-animating on every pass is the thing that
 * makes scroll reveals feel cheap. Under prefers-reduced-motion the element
 * starts revealed and no observer is ever created, so the content is there
 * on first paint rather than depending on JS.
 *
 * Mirrors the pattern already used by OpsComparisonSection, kept here so the
 * rest of the page does not each grow its own copy.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
    const ref = useRef<T>(null);
    const [revealed, setRevealed] = useState(
        () => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    useEffect(() => {
        if (revealed) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setRevealed(true);
                observer.disconnect();
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
        // `revealed` is read once to skip setup; it only ever flips false to
        // true, and the observer is already gone by then.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threshold]);

    return { ref, revealed };
}
