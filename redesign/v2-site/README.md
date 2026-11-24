# Vybd site v2

Static rebuild of the home page and the social-commerce page. Satoshi only, light sections, Motion and anime.js for animation.

- Served at `/v2/` and `/v2/social-commerce` (see `vercel.json`). These routes are `noindex` until v2 replaces the live home page.
- Built files live in `public/v2/`. Source lives here in `src/`.
- The published copies in `public/v2/` use absolute paths (`/v2/img/...`, `/v2/social-commerce`, `/v2`). After a rebuild, apply the same path rewrite (the source keeps relative paths so it also works as a standalone preview).

## Edit and rebuild

```sh
cd redesign/v2-site
mkdir -p dist && cp -r ../../public/v2/img dist/   # images the build expects next to the pages
python3 build.py          # writes dist/index.html and dist/social-commerce.html
cp dist/index.html dist/social-commerce.html ../../public/v2/
```

`python3 build.py --b` also builds `dist/index-b.html` (alternative hero, not published).

## Notes

- `src/analytics.js` posts consented events to `/api/site/track`. That endpoint is not in this repo yet, so events are dropped until it ships.
- Booking links point to `https://www.vybd.ai/book`.
