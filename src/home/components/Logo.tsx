/** The Folded V. onNavy: the design system's on-navy variant, where the two
    right facets turn navy-2 / navy-3 so the mark reads on a navy ground. */
export function Logo({ onNavy = false }: { onNavy?: boolean }) {
  return (
    <svg viewBox="4 4 92 84" aria-hidden="true">
      <path d="M4 4 L36 4 L50 46 Z" fill="#5FD6BF" />
      <path d="M4 4 L50 46 L38 88 Z" fill="#1BB59B" />
      <path d="M96 4 L64 4 L50 46 Z" fill={onNavy ? '#3a4a6b' : '#7E8AA3'} />
      <path d="M96 4 L50 46 L62 88 Z" fill={onNavy ? '#25324d' : '#B9C2D3'} />
      <path d="M38 88 L50 46 L62 88 Z" fill="#13987F" />
    </svg>
  )
}
