import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'
import { HOME, PAGES, applyMeta } from './pageMeta'

/* After the build, give each shared page its own HTML with its own title,
   description and link-preview tags (see pageMeta.ts); vercel.json serves
   dist/<name>.html on that route. index.html gets HOME's tags too, so
   pageMeta.ts is the one place to edit. */
function pageMetaHtml(): Plugin {
  let outDir = 'dist'
  return {
    name: 'page-meta-html',
    apply: 'build',
    configResolved(c) {
      outDir = path.resolve(c.root, c.build.outDir)
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html')
      const html = fs.readFileSync(indexPath, 'utf8')
      fs.writeFileSync(indexPath, applyMeta(html, '/', HOME))
      for (const [route, meta] of Object.entries(PAGES)) {
        fs.writeFileSync(path.join(outDir, `${meta.name}.html`), applyMeta(html, route, meta))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pageMetaHtml()],
  build: {
    rollupOptions: {
      // home.html is the "/" landing page (src/home); index.html is the SPA for every other route.
      input: {
        main: path.resolve(__dirname, 'index.html'),
        home: path.resolve(__dirname, 'home.html'),
        essay: path.resolve(__dirname, 'essay.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
