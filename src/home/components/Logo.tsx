/* The folded V: mint facets on the left, navy on the right, the same
   mark as the SPA header (FACETS in src/pages/redesign/chrome.tsx). */
export function Logo() {
  return (
    <svg viewBox="4 4 92 84" aria-hidden="true">
      <path d="M4 4 L36 4 L50 46 Z" fill="#5FD6BF" />
      <path d="M4 4 L50 46 L38 88 Z" fill="#1BB59B" />
      <path d="M96 4 L64 4 L50 46 Z" fill="#25324D" />
      <path d="M96 4 L50 46 L62 88 Z" fill="#0F1B33" />
      <path d="M38 88 L50 46 L62 88 Z" fill="#13987F" />
    </svg>
  )
}

/* Logo lockup for the home hero: the V standing in for the V of "Vybd",
   "ybd" in Instrument Serif, and "Borderless" letterspaced underneath. */
export function Lockup() {
  return (
    <div className="lockup">
      <span className="lockup-word" aria-label="Vybd">
        <svg className="lockup-v" viewBox="4 4 92 84" aria-hidden="true">
          <path d="M4 4 L36 4 L50 46 Z" fill="#5FD6BF" />
          <path d="M4 4 L50 46 L38 88 Z" fill="#1BB59B" />
          <path d="M96 4 L64 4 L50 46 Z" fill="#25324D" />
          <path d="M96 4 L50 46 L62 88 Z" fill="#0F1B33" />
          <path d="M38 88 L50 46 L62 88 Z" fill="#13987F" />
        </svg>
        <span aria-hidden="true">ybd</span>
      </span>
      <span className="lockup-tag">Borderless</span>
    </div>
  )
}
