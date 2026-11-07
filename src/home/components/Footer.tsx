import { FOOTER_GROUPS } from '@/home/data/nav'

export function Footer({ base = '' }: { base?: string }) {
  return (
    <footer><div className="in">
      <div className="fn">
        1. Dollar figures on this page are illustrative examples to show how Vybd works, not quotes. Real numbers depend on your category, channel and lane.<br />
        2. Partner scores shown are examples of how the network rates performance.
      </div>
      <div className="dir">
        {FOOTER_GROUPS.map((g) => (
          <div key={g.title}>
            <h6>{g.title}</h6>
            {g.links.map(([href, label]) => <a key={label} href={href.startsWith('#') ? base + href : href}>{label}</a>)}
          </div>
        ))}
      </div>
      <div className="bt">
        <span>Copyright © 2026 Vybd. All rights reserved. <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span>
        <span>English · Français · Español · 中文 · 日本語 · 한국어</span>
      </div>
    </div></footer>
  )
}
