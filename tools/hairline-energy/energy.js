/**
 * Energy: ten rounded solids lie scattered and crooked on a plate, pillars,
 * low blocks, a squat cube and two discs, with one bright dot near the middle:
 * the energy, loose. As the pointer nears the plate's centre the forms nearest
 * it turn square and slide into a ring round a central node, and dashed links
 * draw in from neighbour to neighbour. At the centre the ring closes, the links
 * run through the node, the node rises, and the dot climbs onto it: the bright
 * moves from the loose energy to the shared centre. The slider is the reach of
 * the connection, in world units from the centre.
 *
 * The pattern: discrete items on tweens, chosen by a continuous distance. The
 * pointer is read on the ground plane, which never moves, and the forms are
 * ranked by their rest positions, so the motion spreads out from the pointer.
 */
const {
  Cam, clamp, facing, fit, lerp, prism, proj, rad, rings, unproj, seg,
  tween, tset, tval, tdone, flatDot, mk, place, pointer, put, register, disposer, solid,
} = HL;

const E = 72, PB = 5, RING = 46, STEP = 45, HUB = 9, HUB0 = 1.6, HUB1 = 11, N = 10;
// In ring order, slot i at i × 36°: [width, depth, corner, height, rest x, rest y, rest turn in degrees].
const FORMS = [
  [9, 9, 3, 26, 58, 12, 22],
  [17, 10, 3, 7, 32, 46, -28],
  [12, 12, 6, 4, 2, 60, 0],
  [9, 9, 3, 19, -22, 36, 15],
  [17, 10, 3, 7, -52, 50, 33],
  [12, 12, 3, 13, -38, -10, -18],
  [9, 9, 3, 31, -56, -44, 28],
  [12, 12, 6, 4, -8, -32, 0],
  [17, 10, 3, 7, 16, -60, -14],
  [9, 9, 3, 23, 54, -12, 40],
];
const SPOT = [16, 14]; // where the energy lies at rest

/** A ring turned by a radians about its own centre and moved to (x, y), normals turned with it. */
const turned = (ring, x, y, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = null, last = [0, 0];

  const C = Cam(45, 0.5, 1.4);
  fit(C, [[-E, -E, -PB], [E, E, -PB], [E, -E, -PB], [-E, E, -PB], [-60, -48, 32]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-E, -E, E, E, 14, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));
  // The wires lie on the plate's top, painted before every solid that stands on it.
  const wires = mk("g", {}, g), top = mk("g", {}, g);

  const forms = FORMS.map(([w, d, r, h, x, y, t], i) => {
    const a = rad(i * 36 + 18), [ring, inner] = rings(-w / 2, -d / 2, w / 2, d / 2, r, 1.2);
    return { ring, inner, h, x0: x, y0: y, a0: rad(t), x1: RING * Math.cos(a), y1: RING * Math.sin(a), x, y, m: tween(0), el: solid(top), drawn: NaN };
  });
  const wire = () => ({ el: mk("path", { class: "nf dash" }, wires), t: tween(0), d: "" });
  const links = forms.map(wire), spokes = forms.map(wire);

  const [hr, hi] = rings(-HUB, -HUB, HUB, HUB, HUB, 1.6);
  const hub = { el: solid(top), z: tween(HUB0), drawn: NaN };
  const dg = mk("g", {}, top), dot = flatDot(dg, C, 1.5, "dot"), e = tween(0);
  let dk = SPOT[0] + SPOT[1], dz = NaN, dkd = NaN, lit = false;

  // Depth order: by x + y from the far corner; the dot rides just in front of the hub when it is on it.
  const items = forms.map((f) => ({ g: f.el.g, k: () => f.x + f.y })).concat([{ g: hub.el.g, k: () => 0 }, { g: dg, k: () => dk }]);
  let order = [];

  function drawWire(L, a, b, now) {
    const t = tval(L.t, now), A = P(a.x, a.y, 0), B2 = P(b.x, b.y, 0);
    const d = t > 0.002 ? seg(A, [lerp(A[0], B2[0], t), lerp(A[1], B2[1], t)]) : "";
    if (d !== L.d) { L.d = d; L.el.setAttribute("d", d); }
    return !tdone(L.t, now);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const f of forms) {
      const m = tval(f.m, now);
      if (!tdone(f.m, now)) moving = true;
      if (m === f.drawn) continue;
      f.drawn = m; f.x = lerp(f.x0, f.x1, m); f.y = lerp(f.y0, f.y1, m);
      const a = lerp(f.a0, 0, m);
      put(f.el, prism(P, front, turned(f.ring, f.x, f.y, a), turned(f.inner, f.x, f.y, a), 0, f.h));
    }
    const hz = tval(hub.z, now), k = tval(e, now);
    if (!tdone(hub.z, now) || !tdone(e, now)) moving = true;
    if (hz !== hub.drawn) { hub.drawn = hz; put(hub.el, prism(P, front, hr, hi, 0, hz)); }
    const z = k * hz;
    if (z !== dz || k !== dkd) {
      dz = z; dkd = k; const x = lerp(SPOT[0], 0, k), y = lerp(SPOT[1], 0, k);
      dk = k > 0.5 ? 0.5 : x + y;
      place(dot, P(x, y, z));
    }
    // The bright goes to the node only when the dot has reached it: one place lit at a time.
    const on = k > 0.98;
    if (on !== lit) { lit = on; hub.el.sil.classList.toggle("hi", on); }
    forms.forEach((f, i) => {
      if (drawWire(links[i], f, forms[(i + 1) % N], now)) moving = true;
      if (drawWire(spokes[i], f, { x: 0, y: 0 }, now)) moving = true;
    });
    const next = items.slice().sort((p, q) => p.k() - q.k());
    if (next.some((it, i) => it !== order[i])) { order = next; top.append(...order.map((it) => it.g)); }
    return moving;
  });
  bag.add(B.unregister);

  function retarget() {
    const now = performance.now(), p = over || last;
    const c = over ? clamp((R - Math.hypot(over[0], over[1])) / (R - 14), 0, 1) : 0;
    const n = Math.round(c * N), full = n === N;
    // Rank by rest position, which never moves: the nearest the pointer joins first.
    const byNear = forms.map((_, i) => i).sort((a, b) =>
      Math.hypot(forms[a].x0 - p[0], forms[a].y0 - p[1]) - Math.hypot(forms[b].x0 - p[0], forms[b].y0 - p[1]));
    const rank = [];
    byNear.forEach((i, r) => { rank[i] = r; });
    const joined = forms.map((_, i) => rank[i] < n);
    forms.forEach((f, i) => tset(f.m, joined[i] ? 1 : 0, now, rank[i] * STEP + (joined[i] ? 0 : 160)));
    links.forEach((L, i) => {
      const j = (i + 1) % N, both = joined[i] && joined[j], r = Math.max(rank[i], rank[j]);
      tset(L.t, both ? 1 : 0, now, both ? 260 + r * STEP : r * STEP * 0.4);
    });
    spokes.forEach((S, i) => tset(S.t, full ? 1 : 0, now, full ? 620 + rank[i] * STEP : 0));
    tset(hub.z, full ? HUB1 : HUB0, now, full ? 520 : 120);
    tset(e, full ? 1 : 0, now, full ? 900 : 0);
    read.textContent = !over ? "rest" : full ? "connected" : c >= 0.4 ? "talking" : "scattered";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => { over = unproj(C, q[0], q[1], 0); last = over; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "energy",
  means: "Scattered forms straighten and link up as the pointer nears the centre, until they connect through one shared node.",
  rules: [1, 2, 4, 5],
  range: [60, 90, 125],
  tour: [[265, 206], [230, 198], [200, 173], null],
  mount,
});
