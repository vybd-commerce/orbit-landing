// Minimal Plausible helper. Uses Plausible's own documented queuing
// pattern so events fired before the async script tag (index.html) has
// finished loading aren't lost — they queue on window.plausible.q and
// drain automatically once the real script initializes.

declare global {
  interface Window {
    plausible?: {
      (event: string, options?: { props?: Record<string, unknown> }): void;
      q?: unknown[][];
    };
  }
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const plausible =
    window.plausible ||
    (window.plausible = function (...args: unknown[]) {
      (window.plausible!.q = window.plausible!.q || []).push(args);
    } as Window["plausible"]);

  plausible!(event, props ? { props } : undefined);
}
