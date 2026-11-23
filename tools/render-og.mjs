// Render a 1200x630 link-preview card: node tools/render-og.mjs <in.html> <out.png>
import { chromium } from 'playwright'
import path from 'path'
const [src, out] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1200, height: 630 } })
await p.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' })
await p.evaluate(() => document.fonts.ready)
await p.screenshot({ path: out })
await b.close()
