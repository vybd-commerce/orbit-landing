import { useEffect, useRef, useState } from 'react'

/* Shared motion helpers for the board homepage. Every story plays once when
   its board scrolls into view, then holds; reduced motion skips straight to
   the end state. */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** True once the element has been on screen (stays true). */
export function useInView<T extends Element>(margin = '0px 0px -15% 0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  useEffect(() => {
    if (seen || !ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { rootMargin: margin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen, margin])
  return [ref, seen] as const
}

/** Runs `steps` ([delay ms after the previous step, action]) once `play` is
    true. Returns `cancel`, for when the person takes over; changing `run`
    restarts the sequence (used for replay). */
export function useSequence(steps: [number, () => void][], play: boolean, run = 0) {
  const timers = useRef<number[]>([])
  const cancel = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = [] }
  const latest = useRef(steps)
  // Runs before the effect below (effects run in order), so it sees fresh steps.
  useEffect(() => { latest.current = steps })
  useEffect(() => {
    if (!play || prefersReducedMotion()) return
    let at = 0
    timers.current = latest.current.map(([wait, fn]) => {
      at += wait
      return window.setTimeout(fn, at)
    })
    return cancel
  }, [play, run])
  return cancel
}
