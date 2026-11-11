const ORIGINS = [
  { flag: '🇮🇳', label: 'Spices · India', style: { left: '3%', top: '68%' } },
  { flag: '🇰🇷', label: 'Skincare · Korea', style: { left: '2%', top: '22%' } },
  { flag: '🇨🇳', label: 'Electronics · China', style: { right: '3%', top: '10%' } },
]

export function ForTheUS() {
  return (
    <section className="tile full us" id="us">
      <div className="copy">
        <div className="eyebrow rv">For makers outside the US</div>
        <h2 className="prod rv">Vybd for the US</h2>
        <p className="tag big rv">Made anywhere. <em style={{ color: 'var(--mint-text)' }}>Sold in the US.</em></p>
        <div className="links rv"><a className="pill fill" href="/us">Plan my launch</a><a className="pill out" href="/test-drop">Start with a Test Drop</a></div>
      </div>
      <div className="art"><div className="us-art rv">
        <div className="map" />
        <svg className="routes" viewBox="0 0 980 380" preserveAspectRatio="none" aria-hidden="true">
          <path d="M120 290 C 300 120, 440 120, 560 170" />
          <path d="M110 120 C 300 40, 460 80, 560 165" />
          <path d="M880 70 C 760 40, 640 90, 590 160" />
        </svg>
        {ORIGINS.map((o) => (
          <span key={o.label} className="origin" style={o.style}><i>{o.flag}</i>{o.label}</span>
        ))}
        <div className="parcel"><div className="lbl">SHIP TO<b>USA</b><s /></div></div>
      </div></div>
    </section>
  )
}
