import { useEffect, useRef, useState } from 'react'
import { competition, type Side } from '@/home/data/fundRaise'

/* Competitive positioning map, drawn as inline SVG in real pixels (the
   viewBox follows the measured width), so labels stay the same size on a
   phone and a desktop instead of shrinking with the chart. Move a dot by
   editing its x / y (0–100) in data/fundRaise.ts. */

const C = {
  navy: '#0f1b33', navy3: '#3a4a6b', ink: '#111827', muted: '#5b6270',
  line: '#e7e9ed', grid: '#cfd4dc', tint: '#E8F7F3', mint: '#1BB59B', mintDeep: '#13987F',
}

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const set = () => setW(Math.round(el.clientWidth) || fallback)
    set()
    if (!('ResizeObserver' in window)) return
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fallback])
  return [ref, w] as const
}

function labelAt(side: Side, x: number, y: number, gap: number) {
  switch (side) {
    case 'left': return { x: x - gap, y: y + 4.5, anchor: 'end' as const }
    case 'top': return { x, y: y - gap, anchor: 'middle' as const }
    case 'bottom': return { x, y: y + gap + 9, anchor: 'middle' as const }
    default: return { x: x + gap, y: y + 4.5, anchor: 'start' as const }
  }
}

export function PositioningMap() {
  const [ref, W] = useWidth<HTMLDivElement>(560)
  const H = Math.round(Math.max(320, Math.min(W * 0.85, 480)))
  const pad = { l: 12, r: 12, t: 30, b: 30 }
  const L = pad.l, R = W - pad.r, T = pad.t, B = H - pad.b
  const sx = (x: number) => L + (x / 100) * (R - L)
  const sy = (y: number) => B - (y / 100) * (B - T)

  const { players, vybd, target, xAxis, yAxis } = competition
  const vx = sx(vybd.x), vy = sy(vybd.y)
  const tx = sx(target.x), ty = sy(target.y)
  const ringR = 14
  // Arrow stops just outside the dashed ring.
  const dx = tx - vx, dy = ty - vy, len = Math.hypot(dx, dy) || 1
  const ax = tx - (dx / len) * (ringR + 5), ay = ty - (dy / len) * (ringR + 5)
  const ax0 = vx + (dx / len) * 14, ay0 = vy + (dy / len) * 14
  const vl = labelAt(vybd.label, vx, vy, 16)

  const desc = [...players, vybd].map((p) => `${p.name}: breadth ${p.x}, brand keeps value ${p.y}`).join('; ')

  return (
    <figure className="fr-map">
      <figcaption className="fr-map-y">{yAxis.title}</figcaption>
      <div ref={ref} className="fr-map-box">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Positioning map. ${desc}. Target: ${target.name} at breadth ${target.x}, brand keeps value ${target.y}.`}>
          <defs>
            <marker id="fr-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={C.mintDeep} />
            </marker>
          </defs>

          <text x={L} y={T - 10} fontSize="12" fill={C.muted}>{yAxis.high}</text>
          <rect x={L} y={T} width={R - L} height={B - T} fill="#fff" stroke={C.line} />
          <rect x={sx(50)} y={T} width={R - sx(50)} height={sy(50) - T} fill={C.tint} />
          <line x1={sx(50)} y1={T} x2={sx(50)} y2={B} stroke={C.grid} />
          <line x1={L} y1={sy(50)} x2={R} y2={sy(50)} stroke={C.grid} />
          <text x={L + 8} y={B - 10} fontSize="12" fill={C.muted}>{yAxis.low}</text>
          <text x={L} y={B + 20} fontSize="12" fill={C.muted}>{xAxis.low}</text>
          <text x={R} y={B + 20} fontSize="12" fill={C.muted} textAnchor="end">{xAxis.high}</text>

          {players.map((p) => {
            const x = sx(p.x), y = sy(p.y)
            const l = labelAt(p.label, x, y, 11)
            return (
              <g key={p.name}>
                <circle cx={x} cy={y} r="6" fill={C.navy3} />
                <text x={l.x} y={l.y} textAnchor={l.anchor} fontSize="13" fill={C.ink}>{p.name}</text>
              </g>
            )
          })}

          <line x1={ax0} y1={ay0} x2={ax} y2={ay} stroke={C.mintDeep} strokeWidth="1.75" strokeDasharray="5 5" markerEnd="url(#fr-arrow)" />
          <circle cx={tx} cy={ty} r={ringR} fill="none" stroke={C.mintDeep} strokeWidth="1.75" strokeDasharray="4 4" />
          <text x={Math.min(tx + ringR, R - 4)} y={ty + ringR + 15} textAnchor="end" fontSize="13" fill={C.ink}>{target.name}</text>

          <circle cx={vx} cy={vy} r="10" fill={C.mint} stroke={C.navy} strokeWidth="1.5" />
          <text x={vl.x} y={vl.y + 2} textAnchor={vl.anchor} fontSize="21" fill={C.navy} fontFamily="'Instrument Serif', Georgia, serif">{vybd.name}</text>
        </svg>
      </div>
      <figcaption className="fr-map-x">{xAxis.title}</figcaption>
    </figure>
  )
}
