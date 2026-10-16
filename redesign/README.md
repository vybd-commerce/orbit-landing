# Vybd redesign

The new vybd.ai landing site, designed and prototyped in a Claude design canvas. It sits alongside the live React app and does not change it. Use it as the reference for porting each page into `src/`.

## What's here

| Folder | Contents |
| --- | --- |
| `pages/` | The finished pages (`*.dc.html`) plus `canvas.json`, which lays them out as boards in the design canvas. |
| `preview/` | Standalone HTML builds of every page. Open one in a browser to see the design, motion and language switcher. These are quick previews for review, not production code. |
| `source/` | Editable sources: `Main.src.html` (home page), `case_template.html` and `cases_data.py` (the six case study pages). |
| `i18n/` | Translation runtime (`runtime.js`) and dictionaries `tr1.py`–`tr8.py`. Each row is `(en, fr, es, zh, ja, ko)`. |
| `scripts/` | Build scripts. Run `scripts/build_all.sh` to rebuild everything. |
| `concepts/` | Exploration pages: Site of the Day concept, loader ideas and footer motion options. |

## Pages

- **Main**: home page. It includes the parcel tape-peel loader, the hero, the ticker strip, the scroll-pinned "boxes to tick" moment, What we do, How it works, Who we help, the CTA and the footer.
- **Product**: How it works.
- **Lab**
- **CaseStudies** and **Case-\***: the case study index and six detail pages (The Indian Tapas, Emsworth, Flavor Atlas, Karma, Kashida Layone, TanRom Lifesciences).
- **Proof\***: alternative designs for the proof section. These were not used on the home page.

## Design language

- Colours: mint `#1BB59B` (hover `#17A088`), navy `#0f1b33`, cool greys.
- Type: Instrument Serif for headings, DM Sans for body.
- Parcel and shipping metaphor throughout: labels, stamps, tape and routes.
- Section spacing: `--sec: clamp(72px, 8vw, 132px)`.

## Translations

The footer language selector switches the whole site between English, French, Spanish, Simplified Chinese, Japanese and Korean. The choice is remembered in `localStorage` under the `vybd-lang` key.

To change copy:

1. Edit the English text in `source/`.
2. Add or update the matching row in `i18n/tr*.py`.
3. Run `scripts/build_all.sh`.

## Rebuilding

```bash
bash redesign/scripts/build_all.sh   # needs python3
```
