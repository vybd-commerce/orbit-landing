# Outside Context hero figure ("energy")

The line drawing in the `/outside-context` hero: scattered shapes that link up and connect through a central node.

- `energy.js`: the figure source (Hairline format). Edit this.
- `make-module.mjs`: bundles the Hairline kernel (`.agents/skills/hairline-create/kernel.js`) and `energy.js` into `public/vendor/hairline-energy.js`, the file the page loads.

After editing `energy.js`:

```sh
node tools/hairline-energy/make-module.mjs
```

To redraw or check the figure with an agent, use the `hairline-create` skill in `.agents/skills/` (`/hairline-create`), which also has `look.mjs` for screenshot checks.

The page drives the figure in a loop (`public/outside-context.html`, the `<script type="module">` at the bottom): rest, then `TOUR[0..2]`. A visitor's mouse takes over on hover.
