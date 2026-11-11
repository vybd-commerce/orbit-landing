import type { ReactNode } from 'react'

/* Minimal renderer for the essays: ## headings, paragraphs, "- " and "1. " lists,
   **bold**, and images on a line of their own: ![caption](/images/essays/ken/photo.jpg)
   (files go in public/; the caption doubles as alt text). No HTML is injected;
   everything becomes React elements. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <b key={i}>{part.slice(2, -2)}</b> : part,
  )
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/)
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        const img = lines.length === 1 && /^!\[([^\]]*)\]\((\S+)\)$/.exec(lines[0])
        if (img) return (
          <figure key={i}>
            <img src={img[2]} alt={img[1]} loading="lazy" />
            {img[1] && <figcaption>{img[1]}</figcaption>}
          </figure>
        )
        if (lines[0].startsWith('## ')) return <h2 key={i}>{inline(lines[0].slice(3))}</h2>
        if (lines.every((l) => l.startsWith('- ')))
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>
        if (lines.every((l) => /^\d+\. /.test(l)))
          return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ''))}</li>)}</ol>
        return <p key={i}>{inline(lines.join(' '))}</p>
      })}
    </>
  )
}
