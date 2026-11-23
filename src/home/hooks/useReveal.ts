import { useEffect } from 'react'

/** Fades `.rv` elements in as they enter the viewport (adds `.in`). */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.rv'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' },
    )
    els.forEach((e) => io.observe(e))
    const t = window.setTimeout(() => {
      els.forEach((e) => {
        if (e.getBoundingClientRect().top < window.innerHeight) e.classList.add('in')
      })
    }, 50)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
}
