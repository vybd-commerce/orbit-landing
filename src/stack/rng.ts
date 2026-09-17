/** Deterministic pseudo-random. Every scatter in the scene must be identical
 *  on every load, so nothing here may reach for Math.random. */
export function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
