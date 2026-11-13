import { readFileSync, writeFileSync } from "node:fs";
const ROOT = new URL("../../", import.meta.url).pathname;
const SK = ROOT + ".agents/skills/hairline-create";
const OUT = ROOT + "public/vendor/hairline-energy.js";
const kernel = readFileSync(SK + "/kernel.js", "utf8").trimEnd();
const figure = readFileSync(new URL("./energy.js", import.meta.url), "utf8").trim();
const tour = JSON.parse(/tour:\s*(\[\[.*?\]\s*,\s*null\])/.exec(figure)[1]);
const out = `/*
 * hairline-energy: the "energy" Hairline figure as an embeddable ES module.
 * Generated: the Hairline kernel (unchanged, from .agents/skills/hairline-create/kernel.js)
 * plus the figure (energy.js), followed by a small mount API.
 *
 *   import { mountEnergy, TOUR } from "./vendor/hairline-energy.js";
 *   const fig = mountEnergy(el, { label, intensity });
 *   fig.drive([x, y]);   // virtual pointer at a 400 x 320 viewBox point
 *   fig.drive(null);     // pointer left: the forms drift back to scattered
 *   fig.destroy();
 *
 * label: a string (the figure's aria-label), or an element / function that
 * receives the read-out ("rest", "scattered", "talking", "connected").
 * intensity: 0..1, how far the connection reaches (default 0.5).
 * Theme: --hairline-plate/-hi/-edge/-mid/-lo/-stroke on any ancestor.
 */
${kernel}

/* ---- the figure ---- */
const FIGURE = {};
const HOOKS = new WeakMap();
/* The kernel's pointer(), wrapped so drive() can reach the figure's handlers directly. */
const HLE = Object.assign({}, HL, {
  pointer(stage, on) {
    HOOKS.set(stage, on);
    const off = HL.pointer(stage, on);
    return () => { if (HOOKS.get(stage) === on) HOOKS.delete(stage); off(); };
  },
});
((HL, hairline) => {
${figure}
})(HLE, (f) => { Object.assign(FIGURE, f); });

/* ---- the mount API ---- */
export const TOUR = ${JSON.stringify(tour.filter(Boolean))};
export const MEANS = FIGURE.means;
const GHOST = { pointerType: "ghost" };

/** Intensity 0..1 to the figure's own number: two straight lines that meet at 0.5, as in the package. */
function valueAt(i) {
  const [lo, mid, hi] = FIGURE.range, t = Math.min(1, Math.max(0, Number.isFinite(i) ? i : 0.5));
  return t <= 0.5 ? lo + (t / 0.5) * (mid - lo) : mid + ((t - 0.5) / 0.5) * (hi - mid);
}

export function mountEnergy(el, { label, intensity = 0.5 } = {}) {
  const root = el.getRootNode ? el.getRootNode() : document;
  HL.inject(root.nodeType === 11 ? root : el.ownerDocument);
  const stage = el.ownerDocument.createElement("div");
  stage.setAttribute("data-hairline", FIGURE.name);
  stage.setAttribute("role", "img");
  stage.setAttribute("aria-label", typeof label === "string" ? label : FIGURE.means);
  el.appendChild(stage);
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);

  let text = "rest";
  const say = (t) => {
    if (typeof label === "function") label(t);
    else if (label && label.nodeType === 1) label.textContent = t;
  };
  const read = {
    get textContent() { return text; },
    set textContent(v) { text = v == null ? "" : String(v); say(text); },
  };
  const handle = FIGURE.mount({ stage, svg, read }, valueAt(intensity));
  say(text);

  let gone = false;
  return {
    drive(pt) {
      if (gone) return;
      const h = HOOKS.get(stage);
      if (!h) return;
      if (pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1])) h.move([pt[0], pt[1]], GHOST);
      else h.leave(GHOST);
    },
    setIntensity(i) { if (!gone) handle.set(valueAt(i)); },
    get state() { return text; },
    destroy() {
      if (gone) return;
      gone = true;
      handle.destroy();
      stage.remove();
    },
  };
}
`;
writeFileSync(OUT, out);
console.log(OUT, out.length);
