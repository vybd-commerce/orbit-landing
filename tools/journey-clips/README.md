# Journey clips: `/consulting/journey`

Eleven close-ups for the "From factory to customer" story, generated with Veo
(`veo-3.1-generate-001`, 16:9, 8s, no audio, 2 candidates each) and encoded
with `encode.sh`. Raw candidates live in GCS under
`gs://vybd-genmedia-output/veo_outputs/<name>_<n>.mp4`.

```bash
# download the chosen raws into a folder, then:
tools/journey-clips/encode.sh <folder>    # writes public/media/journey/<clip>/
```

Every prompt ends with the shared style line:

> Cinematic, slow push-in, shallow depth of field, muted desaturated palette with deep
> near-black shadows and a subtle teal accent light, premium documentary look. No text,
> no logos, no brand names.

| Clip | Chosen | Scene (prompt head) |
|---|---|---|
| made-dhaka | `_2` | Inside a modern garment factory in Dhaka, Bangladesh: long rows of sewing machines, workers stitching cotton T-shirts, finished shirts folded and stacked into cardboard cartons moving along a line. |
| made-hcmc | `_2` | Inside a specialty coffee roastery in Ho Chi Minh City, Vietnam: freshly roasted beans pour out of a drum roaster into a rotating cooling tray, then are filled into kraft paper coffee bags that are heat-sealed and packed into cartons. |
| made-shanghai | `_2` | Inside a clean cosmetics manufacturing plant in Shanghai: an automated filling line fills small white skincare jars, machines cap them, workers in white coats and hairnets inspect the jars and place them into boxes. |
| loaded | `_1` | At a busy container port at dusk, a ship-to-shore gantry crane lifts a shipping container off a truck and lowers it onto a large container ship; stacked container yard behind, crane work lights glowing, calm water. |
| cleared | `_2` | At a destination port customs gate, a truck carrying a shipping container drives slowly through an X-ray scanning portal; a customs officer in a high-visibility vest reviews documents on a tablet, nods, and waves the truck through the raised barrier. |
| shelf-ny | `_2` | Inside a minimalist apparel store in New York City, a store worker stocks neatly folded cotton T-shirts onto wooden shelves; a busy Manhattan street and yellow taxis blurred through the large window. |
| shelf-london | `_1` | Inside a small specialty coffee shop in London, a barista places bags of coffee beans onto a wooden wall shelf behind the counter; a rainy London street with a red double-decker bus softly blurred through the window. |
| shelf-mumbai | `_2` | Inside a modern beauty store in Mumbai, a store assistant arranges small skincare jars and tubes on glass shelves under warm lighting; a lively Mumbai street softly blurred through the doorway. |
| hand-ny | `_2` | Close-up at the counter of a New York City apparel store: a store worker hands a neatly folded cotton T-shirt across the counter into a smiling customer's hands, warm friendly moment, Manhattan street softly blurred through the window. |
| hand-london | `_2` | Close-up at the counter of a London coffee shop: a barista hands a kraft paper bag of coffee beans over the counter to a smiling customer, warm friendly moment, rainy London street softly blurred through the window. |
| hand-mumbai | `_1` | Close-up at the counter of a modern beauty store in Mumbai: a store assistant hands a small white skincare jar in a paper bag to a smiling customer across the counter, warm friendly moment, warm shop lighting. |

Picks favoured candidates without legible brand marks or signage (e.g. `cleared_1`
shows a truck maker's badge, `shelf-london_2` shows lettering on a bus).

Sizes: full-bleed clips ship at 960 and 1280, triptych panels at 960 only.
Everything is loaded on demand as the story reaches it.
