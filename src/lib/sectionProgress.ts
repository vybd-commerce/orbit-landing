/**
 * How far the viewport has travelled through a tall pinned section, 0 → 1.
 *
 * 0 when the section's top reaches the top of the viewport, 1 when its bottom
 * reaches the bottom, which is exactly the range a `position: sticky` stage
 * inside it stays pinned for.
 */
export function sectionProgress(el: Element): number {
    const rect = el.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 0) return rect.top <= 0 ? 1 : 0;
    return Math.min(1, Math.max(0, -rect.top / travel));
}

/**
 * How far the section's top has risen into the viewport before pinning,
 * 0 (just below the fold) → 1 (top reached). Drives the entry reveal.
 */
export function sectionEntry(el: Element, span = 0.7): number {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    return Math.min(1, Math.max(0, (vh - rect.top) / (vh * span)));
}
