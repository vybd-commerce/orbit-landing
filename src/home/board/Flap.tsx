import { useEffect, useRef, useState } from 'react'

/* Split-flap text. Each character sits in its own cell. A row starts blank
   and flips in the first time it scrolls into view; after that, whenever
   `text` changes, every cell cycles through the drum and settles left to
   right after `delay` ms, like a station board updating a row. The real
   text is exposed to screen readers once; the cells are decoration. With
   reduced motion the text is simply shown. */

const DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.%+-'
const STEP_MS = 42

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fit = (text: string, len: number, align: 'left' | 'right') => {
  const t = text.toUpperCase().slice(0, len)
  return align === 'right' ? t.padStart(len) : t.padEnd(len)
}

export function Flap({ text, len, delay = 0, align = 'left', className = '' }: {
  text: string
  len: number
  delay?: number
  align?: 'left' | 'right'
  className?: string
}) {
  const target = fit(text, len, align)
  const still = reduced()
  const [armed, setArmed] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  const [shown, setShown] = useState(() => ' '.repeat(len))
  const el = useRef<HTMLSpanElement>(null)

  // Arm the first time the row comes into view.
  useEffect(() => {
    if (still || !el.current) return
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setArmed(true); io.disconnect() }
    }, { rootMargin: '0px 0px -40px 0px' })
    io.observe(el.current)
    return () => io.disconnect()
  }, [still])

  useEffect(() => {
    if (still || !armed) return
    let raf = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.floor((now - start) / STEP_MS)
      if (t >= 0) {
        let done = true
        const out = Array.from(target, (c, i) => {
          if (t >= 5 + i) return c
          done = false
          return DRUM[(t * 7 + i * 13) % DRUM.length]
        }).join('')
        setShown(out)
        if (done) return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, delay, armed, still])

  return (
    <span className={'flap ' + className} ref={el}>
      <span className="sr">{text}</span>
      {Array.from(still ? target : shown, (c, i) => <i key={i} aria-hidden="true"><b>{c === ' ' ? ' ' : c}</b></i>)}
    </span>
  )
}
