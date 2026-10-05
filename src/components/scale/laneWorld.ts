import * as THREE from "three";
import {
    C,
    CONTAINER_COLORS,
    Kit,
    clamp01,
    hide,
    keyframes,
    lerp,
    mulberry,
    pingPong,
    place,
    seg,
    smooth,
    wrap01,
    type WorldState,
} from "./common";

/* One trade lane up close: suppliers → origin terminal → ocean → destination
 * terminal → rail / drayage → distribution centre → stores.
 *
 * Everything runs on one clock so the inventory is consistent: ships load at
 * the origin while the origin yard drains, sail, unload while the destination
 * yard fills, trains and trucks drain it into the DC, vans drain the DC into
 * the stores. Live stock bars at every node read those same levels.
 *
 * Chapter 02 reveals a data layer beneath the whole lane; chapter 03 puts
 * agents over every node and on the moving freight.
 */

const QUAY_W = -20; // origin quay edge (water is x > QUAY_W)
const QUAY_E = 20; // destination quay edge
const LAYER_Y = -4.2;
const SHIP_T = 18; // one ship's full cycle
const SHIPS = 3; // staggered by SHIP_T / SHIPS
const TIERS = 4;

/* Nodes: label, centre x, pad size for the data layer. */
const NODES = [
    { label: "SUPPLIERS", x: -52, pad: [12, 24] },
    { label: "ORIGIN PORT", x: -33, pad: [24, 24] },
    { label: "DESTINATION PORT", x: 33, pad: [24, 24] },
    { label: "DISTRIBUTION", x: 55, pad: [14, 20] },
    { label: "RETAIL", x: 66.5, pad: [6, 24] },
] as const;

const KEYS = [
    { p: 0.2, x: -4, y: 96, z: 44, lx: -2, ly: 0, lz: 0 },
    { p: 0.3, x: -8, y: 38, z: 56, lx: -8, ly: 0, lz: 0 },
    { p: 0.42, x: 2, y: 12, z: 62, lx: 2, ly: -2.2, lz: 0 },
    { p: 0.5, x: 6, y: 22, z: 66, lx: 6, ly: -1.6, lz: 0 },
    { p: 0.66, x: 6, y: 60, z: 96, lx: 6, ly: 0, lz: 0 },
    { p: 0.74, x: 6, y: 78, z: 104, lx: 6, ly: 0, lz: 0 },
    { p: 0.84, x: 0, y: 170, z: 70, lx: 0, ly: 0, lz: 0 },
];

/* A ship's cycle: arrive at origin, load, cross, unload, leave. yaw 0 =
   bow toward -z (alongside the quay); -π/2 = bow toward +x (crossing). */
const SHIP_KEYS = [
    { p: 0, x: -16.5, z: 46, yaw: 0 },
    { p: 2.5, x: -16.5, z: 0, yaw: 0 },
    { p: 6, x: -16.5, z: 0, yaw: 0 },
    { p: 7.6, x: -9, z: -5, yaw: -Math.PI / 2 },
    { p: 10.4, x: 9, z: -5, yaw: -Math.PI / 2 },
    { p: 12, x: 16.5, z: 0, yaw: 0 },
    { p: 16, x: 16.5, z: 0, yaw: 0 },
    { p: 18, x: 16.5, z: -46, yaw: 0 },
];

/* Level of a sawtooth that fills over `up` seconds and drains over `down`
   (or the reverse), on a period of up + down. */
const saw = (t: number, rise: number, fall: number, phase = 0) => {
    const T = rise + fall;
    const w = (((t + phase) % T) + T) % T;
    return w < rise ? w / rise : 1 - (w - rise) / fall;
};

export function buildLane(lite: boolean) {
    const kit = new Kit();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(C.ground);
    scene.fog = new THREE.Fog(C.ground, 80, 320);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 1200);
    const rand = mulberry(23);
    let aspectK = 1;

    /* ── Water and land ── */
    const waterMat = kit.track(
        new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            fog: false,
            uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
            vertexShader: `
                varying vec2 vXZ;
                void main() {
                    vec4 w = modelMatrix * vec4(position, 1.0);
                    vXZ = w.xz;
                    gl_Position = projectionMatrix * viewMatrix * w;
                }`,
            fragmentShader: `
                uniform float uTime;
                uniform float uOpacity;
                varying vec2 vXZ;
                void main() {
                    // Faint swell lines drifting across the water.
                    float s = sin(vXZ.y * 1.3 + sin(vXZ.x * 0.12 + uTime * 0.4) * 1.5 + uTime * 0.6);
                    // Linear values: the output pass encodes to sRGB, so
                    // these land near #0b0e10 on screen.
                    float line = smoothstep(0.96, 1.0, s) * 0.006;
                    float fade = 1.0 - smoothstep(60.0, 200.0, length(vXZ));
                    gl_FragColor = vec4(vec3(0.0034, 0.0045, 0.0052) + line, uOpacity * fade);
                }`,
        })
    );
    const water = new THREE.Mesh(kit.track(new THREE.PlaneGeometry(700, 700)), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.5;
    water.renderOrder = -1;
    scene.add(water);

    // Land slabs are edges plus a translucent fill, so the data layer can
    // show through them in chapter 02.
    const landFill = kit.track(new THREE.MeshBasicMaterial({ color: 0x0e1012, transparent: true, opacity: 0.95 }));
    const slab = (x0: number, x1: number) => {
        const w = x1 - x0;
        const g = kit.box(w, 0.5, 30);
        const m = new THREE.Mesh(g.geo, landFill);
        m.position.set((x0 + x1) / 2, -0.25, 0);
        scene.add(m);
        const e = new THREE.LineSegments(g.edges, kit.edgeLo);
        e.position.copy(m.position);
        scene.add(e);
    };
    slab(-64, QUAY_W);
    slab(QUAY_E, 74);
    const grid = new THREE.GridHelper(300, 100, C.line, C.line);
    const gridMat = grid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.08;
    grid.position.y = 0.01;
    kit.track(grid.geometry);
    kit.track(gridMat);
    scene.add(grid);

    /* ── Suppliers ── */
    const prismGeo = (() => {
        const g = kit.track(new THREE.CylinderGeometry(1, 1, 1, 3, 1));
        g.rotateX(Math.PI / 2);
        g.rotateZ(Math.PI);
        return { geo: g, edges: kit.track(new THREE.EdgesGeometry(g)) };
    })();
    const stripMat = kit.glow(0.35);
    for (const z of [-7, 5]) {
        kit.solid(scene, [7, 2.4, 4.6], [-54, 0, z]);
        for (let i = 0; i < 4; i++) {
            const m = new THREE.Mesh(prismGeo.geo, kit.fill);
            const e = new THREE.LineSegments(prismGeo.edges, kit.edge);
            for (const o of [m, e]) {
                o.position.set(-56.6 + i * 1.75, 2.85, z);
                o.scale.set(0.88, 0.9, 4.6);
                scene.add(o);
            }
        }
        kit.solid(scene, [0.5, 4.8, 0.5], [-51, 0, z - 1.6]);
        const strip = new THREE.Mesh(kit.box(6, 0.28, 0.02).geo, stripMat);
        strip.position.set(-54, 1.4, z + 2.32);
        scene.add(strip);
    }

    /* ── Container yards (stacks rise and fall with inventory) ── */
    const containerGeo = kit.track(new THREE.BoxGeometry(2.4, 0.9, 1.0));
    const makeYard = (x0: number) => {
        const stacks: [number, number][] = [];
        for (let c = 0; c < 6; c++) {
            for (let r = 0; r < 16; r++) {
                const z = r < 8 ? -10 + r * 1.15 : 1.2 + (r - 8) * 1.15;
                stacks.push([x0 + c * 2.65, z]);
            }
        }
        // Stacks fill one at a time in a shuffled order, like a real yard.
        const order = stacks.map((_, i) => i).sort(() => rand() - 0.5);
        const rankOf = new Array<number>(stacks.length);
        order.forEach((s, i) => (rankOf[s] = i));
        const mesh = kit.instanced(scene, containerGeo, kit.track(new THREE.MeshBasicMaterial({ color: 0xffffff })), stacks.length * TIERS);
        stacks.forEach((_, s) => {
            for (let tier = 0; tier < TIERS; tier++) {
                mesh.setColorAt(s * TIERS + tier, new THREE.Color(CONTAINER_COLORS[Math.floor(rand() * CONTAINER_COLORS.length)]));
            }
        });
        const setLevel = (level: number) => {
            const count = Math.round(clamp01(level) * stacks.length * TIERS);
            stacks.forEach(([x, z], s) => {
                for (let tier = 0; tier < TIERS; tier++) {
                    const k = s * TIERS + tier;
                    if (rankOf[s] * TIERS + tier < count) place(mesh, k, x, 0.45 + tier * 0.92, z);
                    else hide(mesh, k);
                }
            });
            mesh.instanceMatrix.needsUpdate = true;
        };
        return { setLevel };
    };
    const originYard = makeYard(-45);
    const destYard = makeYard(26.5);

    /* ── Ship-to-shore cranes ── */
    const CRANE_Z = [-5.5, 0, 5.5];
    const makeCranes = (quay: number, dir: 1 | -1) => {
        // dir: +1 when water is toward +x (origin), -1 toward -x (destination).
        const legs = [quay - dir * 1.2, quay - dir * 3.6];
        return CRANE_Z.map((z) => {
            for (const lx of legs) for (const lz of [z - 1.1, z + 1.1]) kit.solid(scene, [0.3, 6.4, 0.3], [lx, 0, lz]);
            kit.solid(scene, [15, 0.4, 0.5], [quay + dir * 2.4, 6.4, z]);
            kit.solid(scene, [2.6, 0.3, 2.4], [quay - dir * 2.4, 6.1, z], "lo");
            const trolley = kit.solid(scene, [0.9, 0.35, 0.9], [0, 6.05, z]);
            const load = kit.solid(scene, [2.4, 0.9, 1], [0, 0, z], "cargo");
            const cableGeo = kit.track(
                new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0)])
            );
            const cable = new THREE.Line(cableGeo, kit.edge);
            scene.add(cable);
            return { trolley, load, cable, z };
        });
    };
    const originCranes = makeCranes(QUAY_W, 1);
    const destCranes = makeCranes(QUAY_E, -1);

    const runCranes = (
        cranes: ReturnType<typeof makeCranes>,
        t: number,
        active: boolean,
        yardX: number,
        shipX: number,
        toShip: boolean
    ) => {
        cranes.forEach((c, i) => {
            if (!active) {
                c.trolley.position.x = lerp(yardX, shipX, 0.5);
                c.load.visible = false;
                c.cable.position.set(c.trolley.position.x, 6.05, c.z);
                c.cable.scale.y = 1.2;
                return;
            }
            // 2.2s per move: pick, lift, traverse, lower; return empty.
            const f = wrap01(t / 2.2 + i * 0.31);
            const out = f < 0.5;
            const g = out ? f / 0.5 : (f - 0.5) / 0.5;
            const travel = smooth((g - 0.2) / 0.6);
            const from = toShip ? yardX : shipX;
            const to = toShip ? shipX : yardX;
            const x = out ? lerp(from, to, travel) : lerp(to, from, travel);
            const lift = out ? Math.min(smooth(g / 0.2), smooth((1 - g) / 0.2)) : 0;
            const y = lerp(1.2, 4.4, lift);
            c.trolley.position.x = x;
            c.load.visible = out;
            c.load.position.set(x, y - 0.45, c.z);
            c.cable.position.set(x, 6.05, c.z);
            c.cable.scale.y = Math.max(0.05, 6.05 - (out ? y + 0.45 : 4.8));
        });
    };

    /* ── Straddle carriers: yard ↔ quay ── */
    const straddles = CRANE_Z.map((z, i) => {
        const g = new THREE.Group();
        kit.solid(g, [2.8, 1.8, 1.4], [0, 0, 0], "hollow");
        const box = kit.solid(g, [2.4, 0.9, 1], [0, 0.35, 0], "cargo");
        g.position.set(0, 0, z + 2.8);
        g.userData = { box, phase: i * 0.37 };
        scene.add(g);
        return g;
    });
    const destStraddles = CRANE_Z.map((z, i) => {
        const g = new THREE.Group();
        kit.solid(g, [2.8, 1.8, 1.4], [0, 0, 0], "hollow");
        const box = kit.solid(g, [2.4, 0.9, 1], [0, 0.35, 0], "cargo");
        g.position.set(0, 0, z + 2.8);
        g.userData = { box, phase: i * 0.41 + 0.2 };
        scene.add(g);
        return g;
    });

    /* ── Ships ── */
    const DECK = { bays: 5, rows: 2, tiers: 3 };
    const deckSlots = DECK.bays * DECK.rows * DECK.tiers;
    const deckGeo = kit.track(new THREE.BoxGeometry(1.0, 0.8, 2.0));
    const ships = Array.from({ length: SHIPS }, () => {
        const g = new THREE.Group();
        kit.solid(g, [2.8, 1.2, 12.5], [0, -0.7, 0]);
        kit.solid(g, [2.6, 2.4, 1.6], [0, 0.5, 5.2]);
        kit.solid(g, [1.2, 0.8, 0.8], [0, 2.9, 5.2], "lo");
        const deck = kit.instanced(g, deckGeo, kit.track(new THREE.MeshBasicMaterial({ color: 0xffffff })), deckSlots);
        for (let i = 0; i < deckSlots; i++) {
            deck.setColorAt(i, new THREE.Color(CONTAINER_COLORS[Math.floor(rand() * CONTAINER_COLORS.length)]));
        }
        scene.add(g);
        return { g, deck };
    });
    // Wake behind a sailing ship.
    const wakeMat = kit.track(new THREE.LineBasicMaterial({ color: C.cargoEdge, transparent: true, opacity: 0.35 }));
    const wakes = ships.map(() => {
        const geo = kit.track(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-1.2, 0, 6.5),
                new THREE.Vector3(-3.2, 0, 14),
                new THREE.Vector3(1.2, 0, 6.5),
                new THREE.Vector3(3.2, 0, 14),
            ])
        );
        const l = new THREE.LineSegments(geo, wakeMat);
        scene.add(l);
        return l;
    });

    const shipState = (tc: number) => {
        let i = 0;
        while (i < SHIP_KEYS.length - 2 && tc > SHIP_KEYS[i + 1].p) i++;
        const a = SHIP_KEYS[i];
        const b = SHIP_KEYS[i + 1];
        const f = smooth((tc - a.p) / (b.p - a.p));
        const load = tc < 2.5 ? 0 : tc < 6 ? (tc - 2.5) / 3.5 : tc < 12 ? 1 : tc < 16 ? 1 - (tc - 12) / 4 : 0;
        return {
            x: lerp(a.x, b.x, f),
            z: lerp(a.z, b.z, f),
            yaw: lerp(a.yaw, b.yaw, f),
            load,
            loading: tc >= 2.5 && tc < 6,
            unloading: tc >= 12 && tc < 16,
            sailing: (tc > 6 && tc < 12) || tc < 2.5 || tc > 16,
        };
    };

    /* ── Rail: container train port → DC ── */
    const RAIL_Z = -13;
    const railGeo = kit.track(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(24, 0.03, RAIL_Z - 0.4),
            new THREE.Vector3(62, 0.03, RAIL_Z - 0.4),
            new THREE.Vector3(24, 0.03, RAIL_Z + 0.4),
            new THREE.Vector3(62, 0.03, RAIL_Z + 0.4),
        ])
    );
    scene.add(new THREE.LineSegments(railGeo, kit.edge));
    const CARS = 7;
    const train = new THREE.Group();
    kit.solid(train, [2.4, 1.3, 1.1], [0, 0, 0]);
    const cars = Array.from({ length: CARS }, (_, i) => {
        kit.solid(train, [2.5, 0.25, 1.0], [-(i + 1) * 2.75, 0.1, 0], "lo");
        return kit.solid(train, [2.4, 0.9, 1.0], [-(i + 1) * 2.75, 0.35, 0], "cargo");
    });
    scene.add(train);
    const TRAIN_T = 18;

    /* ── Drayage trucks: destination yard → DC dock doors ── */
    const DOORS = [50, 52.5, 55, 57.5, 60];
    const DOCK_Z = 4.2;
    const truck = (parent: THREE.Object3D) => {
        const g = new THREE.Group();
        kit.solid(g, [0.9, 1, 1], [1.5, 0, 0]);
        const box = kit.solid(g, [2.4, 1, 1], [0, 0.1, 0], "cargo");
        kit.solid(g, [2.5, 0.12, 1], [0, 0, 0], "lo");
        parent.add(g);
        return { g, box };
    };
    const drays = Array.from({ length: lite ? 4 : 6 }, (_, i) => ({ ...truck(scene), door: DOORS[i % DOORS.length], phase: i / (lite ? 4 : 6) }));
    const roadGeo = kit.track(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(26, 0.02, 11.5),
            new THREE.Vector3(64, 0.02, 11.5),
            new THREE.Vector3(-58, 0.02, 11.5),
            new THREE.Vector3(-26, 0.02, 11.5),
        ])
    );
    scene.add(new THREE.LineSegments(roadGeo, kit.edgeLo));
    // Gate booth.
    kit.solid(scene, [1, 1.6, 1], [44, 0, 13]);
    kit.solid(scene, [0.12, 0.12, 3], [44, 1.5, 11.5], "lo");

    /* ── Supplier trucks: factories → origin yard ── */
    const feeders = Array.from({ length: lite ? 3 : 4 }, (_, i) => ({ ...truck(scene), phase: i / (lite ? 3 : 4) }));

    /* ── Distribution centre ── */
    kit.solid(scene, [13, 3.2, 12], [55, 0, -2.2], "hollow");
    const rackRows = [-6.5, -4.3, -2.1, 0.1];
    for (const z of rackRows) kit.solid(scene, [10, 2.4, 0.9], [55, 0, z], "lo");
    for (const x of DOORS) kit.solid(scene, [1.6, 1.8, 0.2], [x, 0, 3.75]);
    const palletGeo = kit.track(new THREE.BoxGeometry(0.8, 0.5, 0.7));
    const PALLET_SLOTS = rackRows.length * 11 * 3;
    const pallets = kit.instanced(scene, palletGeo, kit.track(new THREE.MeshBasicMaterial({ color: 0x5a6068 })), PALLET_SLOTS);
    const palletOrder = Array.from({ length: PALLET_SLOTS }, (_, i) => i).sort(() => rand() - 0.5);
    const forklifts = Array.from({ length: lite ? 3 : 5 }, (_, i) => {
        const g = new THREE.Group();
        kit.solid(g, [0.9, 0.6, 0.6], [0, 0, 0]);
        const load = kit.solid(g, [0.8, 0.5, 0.7], [0.9, 0.1, 0], "cargo");
        g.userData = { lane: [-5.4, -3.2, -1.0, 1.4][i % 4], speed: 0.13 + i * 0.03, phase: i * 0.6, load };
        scene.add(g);
        return g;
    });

    /* ── Stores and vans ── */
    const STORES = [-8, -1, 6];
    for (const z of STORES) {
        kit.solid(scene, [3.2, 1.8, 3], [67, 0, z]);
        const sign = new THREE.Mesh(kit.box(2.6, 0.25, 0.02).geo, stripMat);
        sign.position.set(67, 1.5, z + 1.52);
        scene.add(sign);
    }
    const vans = STORES.map((z, i) => {
        const g = new THREE.Group();
        kit.solid(g, [1.4, 0.9, 0.8], [0, 0, 0], "cargo");
        g.userData = { z, phase: i * 0.33 };
        scene.add(g);
        return g;
    });

    /* ── Orders: green pulses riding the whole lane ── */
    const orderPath = new THREE.CatmullRomCurve3(
        [
            [-56, 9],
            [-44, 11.5],
            [-30, 9],
            [-16.5, 4],
            [0, -5],
            [16.5, 4],
            [30, 9],
            [44, 11.5],
            [55, 7],
            [62, 9],
            [67, 4],
        ].map(([x, z]) => new THREE.Vector3(x, 0.35, z))
    );
    const orderPts = orderPath.getSpacedPoints(400);
    const ORDERS = lite ? 30 : 60;
    const orderMesh = kit.instanced(scene, kit.track(new THREE.BoxGeometry(0.4, 0.25, 0.4)), kit.glow(1), ORDERS);
    const orderLine = new THREE.Line(
        kit.track(new THREE.BufferGeometry().setFromPoints(orderPts)),
        kit.track(new THREE.LineBasicMaterial({ color: C.flow, transparent: true, opacity: 0.18 }))
    );
    scene.add(orderLine);

    /* ── Labels and live stock bars ── */
    const labelMats = NODES.map((n) => kit.label(scene, n.label, [n.x, 0.3, 16.5], n.label.length > 12 ? 13 : 10));
    const barGeo = kit.track(new THREE.BoxGeometry(0.5, 1, 0.5));
    barGeo.translate(0, 0.5, 0);
    const barTrack = kit.instanced(scene, barGeo, kit.glow(0.12, C.cargoEdge), NODES.length);
    const barFill = kit.instanced(scene, barGeo, kit.glow(0.9), NODES.length);
    const BAR_H = 4;

    /* ── Data layer ── */
    const layerMat = kit.track(
        new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            toneMapped: false,
            uniforms: { uLayer: { value: 0 }, uColor: { value: new THREE.Color(C.flow) } },
            vertexShader: `
                varying vec2 vXZ;
                void main() {
                    vec4 w = modelMatrix * vec4(position, 1.0);
                    vXZ = w.xz;
                    gl_Position = projectionMatrix * viewMatrix * w;
                }`,
            fragmentShader: `
                uniform float uLayer;
                uniform vec3 uColor;
                varying vec2 vXZ;
                void main() {
                    vec2 g = vXZ / 4.0;
                    vec2 w = fwidth(g);
                    vec2 c = abs(fract(g - 0.5) - 0.5) / w;
                    float line = (1.0 - min(min(c.x, c.y), 1.0)) * (1.0 - smoothstep(0.25, 0.6, max(w.x, w.y)));
                    float fall = 1.0 - smoothstep(30.0, 90.0, length(vXZ * vec2(0.55, 1.6) - vec2(3.0, 0.0)));
                    gl_FragColor = vec4(uColor, uLayer * fall * (0.012 + 0.14 * line));
                }`,
        })
    );
    const layerGeo = kit.track(new THREE.PlaneGeometry(400, 400));
    layerGeo.rotateX(-Math.PI / 2);
    const layer = new THREE.Mesh(layerGeo, layerMat);
    layer.position.y = LAYER_Y;
    layer.renderOrder = -2;
    scene.add(layer);

    const padMat = kit.glow(0.14);
    const padEdgeMat = kit.track(new THREE.LineBasicMaterial({ color: C.flow, transparent: true, opacity: 0, toneMapped: false }));
    const pads = NODES.map((n) => {
        const g = kit.track(new THREE.PlaneGeometry(n.pad[0], n.pad[1]));
        g.rotateX(-Math.PI / 2);
        const m = new THREE.Mesh(g, padMat);
        m.position.set(n.x, LAYER_Y + 0.02, 0);
        const e = new THREE.LineSegments(kit.track(new THREE.EdgesGeometry(g)), padEdgeMat);
        e.position.copy(m.position);
        scene.add(m, e);
        return m;
    });
    const busMat = kit.glow(0.7);
    const bus = new THREE.Mesh(kit.box(122, 0.1, 0.1).geo, busMat);
    bus.position.set(7, LAYER_Y + 0.05, 0);
    scene.add(bus);

    const RISERS_PER = 3;
    const riserGeo = kit.track(new THREE.BoxGeometry(0.08, 1, 0.08));
    const riserMat = kit.glow(0.5);
    const risers = kit.instanced(scene, riserGeo, riserMat, NODES.length * RISERS_PER);
    const pulseMat = kit.glow(1);
    const pulseGeo = kit.track(new THREE.BoxGeometry(0.28, 0.5, 0.28));
    const riserPulses = kit.instanced(scene, pulseGeo, pulseMat, NODES.length * RISERS_PER);
    const BUS_PULSES = lite ? 8 : 14;
    const busPulses = kit.instanced(scene, kit.track(new THREE.BoxGeometry(1, 0.18, 0.18)), pulseMat, BUS_PULSES);

    /* ── Agents ── */
    const NODE_AGENTS = 2;
    const COURIERS = 3; // on the sailing ship, the train, a dray truck
    const AGENTS = NODES.length * NODE_AGENTS + COURIERS;
    const agentGeo = kit.track(new THREE.OctahedronGeometry(0.75, 0));
    const agentMat = kit.glow(1, C.agent);
    const agents = kit.instanced(scene, agentGeo, agentMat, AGENTS);
    const beamGeo = kit.track(new THREE.BoxGeometry(0.06, 1, 0.06));
    const beams = kit.instanced(scene, beamGeo, kit.glow(0.35, C.agent), AGENTS);
    const haloGeo = kit.track(new THREE.RingGeometry(1.0, 1.12, 40));
    haloGeo.rotateX(-Math.PI / 2);
    const halos = kit.instanced(scene, haloGeo, kit.glow(0.45, C.agent), AGENTS);

    /* ── Per frame ── */
    const v = new THREE.Vector3();
    const tmp = new THREE.Object3D();

    function update(s: WorldState, visible: boolean) {
        if (!visible) return;
        const { t, p } = s;

        const layerW = seg(p, 0.3, 0.42);
        const agentW = seg(p, 0.5, 0.6);
        const flow = 1 + agentW * 0.35; // agents take the waits out
        const tf = t * flow;

        waterMat.uniforms.uTime.value = t;
        waterMat.uniforms.uOpacity.value = 1 - layerW * 0.45;
        landFill.opacity = 0.95 - layerW * 0.55;
        gridMat.opacity = 0.08 * (1 - layerW * 0.6);

        /* Ships and cranes */
        let originLoading = false;
        let destUnloading = false;
        let sailing = -1;
        ships.forEach((ship, i) => {
            const tc = (((tf + (i * SHIP_T) / SHIPS) % SHIP_T) + SHIP_T) % SHIP_T;
            const st = shipState(tc);
            ship.g.position.set(st.x, 0, st.z);
            ship.g.rotation.y = st.yaw;
            wakes[i].position.copy(ship.g.position);
            wakes[i].rotation.y = st.yaw;
            wakes[i].visible = st.sailing;
            const n = Math.round(st.load * deckSlots);
            let k = 0;
            for (let tier = 0; tier < DECK.tiers; tier++) {
                for (let bay = 0; bay < DECK.bays; bay++) {
                    for (let row = 0; row < DECK.rows; row++) {
                        if (k < n) place(ship.deck, k, (row - 0.5) * 1.05, 0.9 + tier * 0.82, -4.4 + bay * 2.1);
                        else hide(ship.deck, k);
                        k++;
                    }
                }
            }
            ship.deck.instanceMatrix.needsUpdate = true;
            if (st.loading) originLoading = true;
            if (st.unloading) destUnloading = true;
            if (tc > 6.5 && tc < 11.5) sailing = i;
        });
        runCranes(originCranes, tf, originLoading, QUAY_W - 3.6, -16.5, true);
        runCranes(destCranes, tf, destUnloading, QUAY_E + 3.6, 16.5, false);

        // Straddle carriers shuttle between the yard and the crane backreach.
        const straddleRun = (list: THREE.Group[], yardX: number, quayX: number, toQuay: boolean) => {
            list.forEach((g) => {
                const { box, phase } = g.userData as { box: THREE.Object3D; phase: number };
                const f = pingPong(tf * 0.32 + phase);
                g.position.x = lerp(yardX, quayX, f);
                const outbound = Math.sin((tf * 0.32 + phase) * Math.PI) > 0;
                box.visible = toQuay ? outbound : !outbound;
            });
        };
        straddleRun(straddles, -30, QUAY_W - 5.5, true);
        straddleRun(destStraddles, 42, QUAY_E + 5.5, false);

        /* Inventory levels, all on the same clock */
        const originLevel = 0.42 + 0.3 * saw(tf, 2.5, 3.5, 3.5); // refills, then drains while loading
        const destLevel = 0.3 + 0.35 * saw(tf, 4, 2, 0); // fills while unloading, drains to rail/trucks
        const dcLevel = 0.45 + 0.3 * saw(tf, 9, 9, 6);
        const retailLevel = 0.5 + 0.3 * Math.sin(tf * 0.9);
        const supplierLevel = 0.55 + 0.25 * Math.sin(tf * 0.5 + 1);
        originYard.setLevel(originLevel);
        destYard.setLevel(destLevel);
        const palletCount = Math.round(dcLevel * PALLET_SLOTS);
        for (let i = 0; i < PALLET_SLOTS; i++) {
            const slot = palletOrder[i];
            const row = Math.floor(slot / 33);
            const rest = slot % 33;
            const col = rest % 11;
            const level = Math.floor(rest / 11);
            if (i < palletCount) place(pallets, slot, 50.3 + col * 0.94, 0.3 + level * 0.78, rackRows[row]);
            else hide(pallets, slot);
        }
        pallets.instanceMatrix.needsUpdate = true;
        const levels = [supplierLevel, originLevel, destLevel, dcLevel, retailLevel];
        NODES.forEach((n, i) => {
            const bx = n.x + (n.label.length > 12 ? 8 : 6.5);
            place(barTrack, i, bx, 0, 16.5, 1, BAR_H);
            place(barFill, i, bx, 0, 16.5, 1.25, Math.max(0.02, BAR_H * levels[i]));
        });
        barTrack.instanceMatrix.needsUpdate = true;
        barFill.instanceMatrix.needsUpdate = true;

        /* Train: load at the port, run to the DC, unload, return */
        {
            const c = ((tf % TRAIN_T) + TRAIN_T) % TRAIN_T;
            const k = (a: number, b: number) => smooth((c - a) / (b - a));
            const x = lerp(30, 64, k(3, 8)) - lerp(0, 34, k(11, 16));
            train.position.set(x, 0, RAIL_Z);
            const loaded = c < 3 ? c / 3 : c < 8 ? 1 : c < 11 ? 1 - (c - 8) / 3 : 0;
            cars.forEach((car, i) => (car.visible = i < Math.round(loaded * CARS)));
            // Hide the train's tail inside the DC end rather than past the land edge.
            train.visible = x < 70;
        }

        /* Drayage: yard → gate (they bunch up there) → dock door → back */
        drays.forEach((d) => {
            const c = wrap01(tf / 16 + d.phase);
            let x: number;
            let z: number;
            let yaw = 0;
            let loaded = true;
            if (c < 0.3) {
                // Yard to gate, slowing into the gate queue.
                const f = smooth(c / 0.3);
                x = lerp(34, 44, f);
                z = 11.5;
            } else if (c < 0.5) {
                const f = smooth((c - 0.3) / 0.2);
                x = lerp(44, d.door, f);
                z = lerp(11.5, 8, f);
            } else if (c < 0.6) {
                // Back into the door.
                const f = smooth((c - 0.5) / 0.1);
                x = d.door;
                z = lerp(8, DOCK_Z + 1.4, f);
                yaw = Math.PI / 2;
            } else if (c < 0.72) {
                x = d.door;
                z = DOCK_Z + 1.4;
                yaw = Math.PI / 2;
                loaded = c < 0.66;
            } else {
                const f = smooth((c - 0.72) / 0.28);
                x = lerp(d.door, 34, f);
                z = lerp(DOCK_Z + 1.4, 12.6, Math.min(1, f * 3));
                yaw = Math.PI;
                loaded = false;
            }
            d.g.position.set(x, 0, z);
            d.g.rotation.y = yaw;
            d.box.visible = loaded;
        });

        feeders.forEach((f) => {
            const c = pingPong(tf * 0.12 + f.phase * 2);
            const outbound = Math.sin((tf * 0.12 + f.phase * 2) * Math.PI) > 0;
            f.g.position.set(lerp(-54, -46, c), 0, 11.5 + (outbound ? -0.6 : 0.6));
            f.g.rotation.y = outbound ? 0 : Math.PI;
            f.box.visible = outbound;
        });

        forklifts.forEach((g) => {
            const { lane, speed, phase, load } = g.userData as { lane: number; speed: number; phase: number; load: THREE.Object3D };
            const f = pingPong(tf * speed * 2 + phase);
            g.position.set(lerp(50, 60, f), 0, lane);
            load.visible = Math.sin((tf * speed * 2 + phase) * Math.PI) > 0;
        });

        vans.forEach((g) => {
            const { z, phase } = g.userData as { z: number; phase: number };
            const f = pingPong(tf * 0.2 + phase * 2);
            g.position.set(lerp(61.5, 64.8, f), 0, lerp(8.5, z + 2.2, smooth(f)));
        });

        for (let i = 0; i < ORDERS; i++) {
            const u = wrap01(tf * 0.012 + i / ORDERS);
            const f = u * (orderPts.length - 1);
            const a = orderPts[Math.floor(f)];
            const b = orderPts[Math.min(orderPts.length - 1, Math.floor(f) + 1)];
            v.lerpVectors(a, b, f - Math.floor(f));
            place(orderMesh, i, v.x, v.y, v.z);
        }
        orderMesh.instanceMatrix.needsUpdate = true;

        /* Data layer */
        layerMat.uniforms.uLayer.value = layerW;
        padMat.opacity = 0.08 * layerW;
        padEdgeMat.opacity = 0.8 * layerW;
        busMat.opacity = 0.7 * layerW;
        pads.forEach((m) => (m.visible = layerW > 0.001));
        bus.visible = layerW > 0.001;
        riserMat.opacity = 0.5 * layerW;
        pulseMat.opacity = layerW;
        const h = -LAYER_Y * layerW;
        NODES.forEach((n, ni) => {
            for (let r = 0; r < RISERS_PER; r++) {
                const k = ni * RISERS_PER + r;
                const rx = n.x + (r - 1) * Math.min(4, n.pad[0] / 3);
                if (layerW < 0.001) {
                    hide(risers, k);
                    hide(riserPulses, k);
                    continue;
                }
                place(risers, k, rx, -h / 2, 7, 1, Math.max(0.001, h));
                const f = wrap01(t * 0.5 + r * 0.33 + ni * 0.2);
                place(riserPulses, k, rx, r % 2 === 0 ? -h * f : -h * (1 - f), 7);
            }
        });
        for (let j = 0; j < BUS_PULSES; j++) {
            const f = wrap01(t * 0.06 + j / BUS_PULSES);
            const x = j % 2 === 0 ? lerp(-54, 68, f) : lerp(68, -54, f);
            if (layerW < 0.001) hide(busPulses, j);
            else place(busPulses, j, x, LAYER_Y + 0.08, 0);
        }
        for (const m of [risers, riserPulses, busPulses]) m.instanceMatrix.needsUpdate = true;

        /* Agents: two over each node, and couriers riding the freight */
        const floor = LAYER_Y * layerW;
        const putAgent = (k: number, x: number, y: number, z: number) => {
            const sc = Math.max(0.001, agentW);
            tmp.position.set(x, y, z);
            tmp.rotation.set(0, t * 1.1 + k, 0);
            tmp.scale.setScalar(sc);
            tmp.updateMatrix();
            agents.setMatrixAt(k, tmp.matrix);
            const len = y - floor;
            place(beams, k, x, floor + len / 2, z, sc, Math.max(0.001, len * sc));
            place(halos, k, x, 0.05, z, sc);
        };
        let k = 0;
        NODES.forEach((n, ni) => {
            for (let a = 0; a < NODE_AGENTS; a++) {
                const ang = t * (0.45 + a * 0.12) + a * Math.PI + ni;
                const rx = Math.min(5, n.pad[0] / 2.6);
                putAgent(k++, n.x + Math.cos(ang) * rx, 8.5 + Math.sin(t * 1.4 + a + ni) * 0.4, Math.sin(ang) * 5);
            }
        });
        if (sailing >= 0) {
            const sp = ships[sailing].g.position;
            putAgent(k++, sp.x, 7, sp.z);
        } else {
            putAgent(k++, 0, 7, -5);
        }
        putAgent(k++, train.position.x - 6, 5.5, RAIL_Z);
        putAgent(k++, drays[0].g.position.x, 5, drays[0].g.position.z);
        for (const m of [agents, beams, halos]) m.instanceMatrix.needsUpdate = true;

        labelMats.forEach((m) => (m.opacity = 1 - seg(p, 0.62, 0.72) * 0.6));

        /* Camera */
        const cam = keyframes(KEYS, clamp01(p), ["x", "y", "z", "lx", "ly", "lz"]);
        camera.position.set(
            cam.lx + (cam.x - cam.lx) * aspectK,
            cam.ly + (cam.y - cam.ly) * aspectK,
            cam.lz + (cam.z - cam.lz) * aspectK
        );
        camera.lookAt(cam.lx, cam.ly, cam.lz);
        const fog = scene.fog as THREE.Fog;
        const d = camera.position.distanceTo(v.set(cam.lx, cam.ly, cam.lz));
        fog.near = d * 0.9;
        fog.far = d * 2.6;
    }

    function resize(aspect: number) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        // Keep the lane's width in frame on narrow screens.
        aspectK = Math.max(1, Math.sqrt(1.78 / aspect));
    }

    return { scene, camera, update, resize, dispose: () => kit.dispose() };
}
