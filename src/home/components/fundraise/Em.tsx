import { Fragment } from 'react'

/** Renders a headline string, setting *wrapped* words in italic (<em>). */
export function Em({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2
          ? <em key={i}>{part.slice(1, -1)}</em>
          : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}
