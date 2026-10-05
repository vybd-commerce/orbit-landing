import * as THREE from "three";

/* Shared palette and helpers for the /consulting scale story. Colours match
   the 2D hero loop (tools/hero-loop/one-order.html, `C`). */
export const C = {
    ground: 0x0a0a0a, // --lp-surface
    fill: 0x0f1011,
    cargo: 0x1a1d1f,
    line: 0x2e2e2e,
    lineHi: 0x5c5c5c,
    cargoEdge: 0x8a909b,
    label: "#8a909b",
    flow: 0x1fc8a3, // --lp-primary: orders and data
    agent: 0xc9fff1, // agents: near-white mint, distinct from orders
    water: 0x0b0e10,
};

/* Muted container liveries. Real stacks are never one colour, and the
   variation is what makes a yard read as a yard at a distance. */
export const CONTAINER_COLORS = [0x3a3f44, 0x2c4a45, 0x4a3a33, 0x33383e, 0x2f3a4a, 0x44403a];

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const smooth = (t: number) => {
    const c = clamp01(t);
    return c * c * (3 - 2 * c);
};
export const seg = (p: number, a: number, b: number) => smooth((p - a) / (b - a));
export const lerp = THREE.MathUtils.lerp;
/* 0 → 1 → 0 over a period of 2, easing at both ends: shuttle motion. */
export const pingPong = (t: number) => smooth(1 - Math.abs((((t % 2) + 2) % 2) - 1));
export const wrap01 = (t: number) => ((t % 1) + 1) % 1;

/* Deterministic PRNG so layouts are identical on every load. */
export function mulberry(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* Piecewise keyframe interpolation with smoothstep between keys. */
export function keyframes<K extends { p: number }>(keys: K[], p: number, fields: (keyof K)[]) {
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].p) i++;
    const a = keys[i];
    const b = keys[i + 1];
    const t = smooth((p - a.p) / (b.p - a.p));
    const out = {} as Record<keyof K, number>;
    for (const f of fields) out[f] = lerp(a[f] as number, b[f] as number, t);
    return out;
}

/**
 * Geometry, materials and disposal for one scene. Boxes are cached by size,
 * so hundreds of identical containers cost one geometry.
 */
export class Kit {
    private disposables: { dispose: () => void }[] = [];
    private boxes = new Map<string, { geo: THREE.BufferGeometry; edges: THREE.BufferGeometry }>();

    readonly fill: THREE.MeshBasicMaterial;
    readonly cargo: THREE.MeshBasicMaterial;
    readonly edge: THREE.LineBasicMaterial;
    readonly edgeLo: THREE.LineBasicMaterial;
    readonly cargoEdge: THREE.LineBasicMaterial;

    constructor() {
        const solidFill = (color: number) =>
            this.track(
                new THREE.MeshBasicMaterial({ color, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
            );
        this.fill = solidFill(C.fill);
        this.cargo = solidFill(C.cargo);
        this.edge = this.track(new THREE.LineBasicMaterial({ color: C.lineHi }));
        this.edgeLo = this.track(new THREE.LineBasicMaterial({ color: C.line }));
        this.cargoEdge = this.track(new THREE.LineBasicMaterial({ color: C.cargoEdge }));
    }

    track<T extends { dispose: () => void }>(item: T): T {
        this.disposables.push(item);
        return item;
    }

    box(w: number, h: number, d: number) {
        const key = `${w}|${h}|${d}`;
        let hit = this.boxes.get(key);
        if (!hit) {
            const geo = this.track(new THREE.BoxGeometry(w, h, d));
            hit = { geo, edges: this.track(new THREE.EdgesGeometry(geo)) };
            this.boxes.set(key, hit);
        }
        return hit;
    }

    /* A wireframe block: dark fill + edges. `kind` picks building or cargo
       tones. Positioned by its base, not its centre. */
    solid(
        parent: THREE.Object3D,
        size: [number, number, number],
        pos: [number, number, number] = [0, 0, 0],
        kind: "building" | "lo" | "cargo" | "hollow" = "building"
    ) {
        const g = this.box(...size);
        const group = new THREE.Group();
        if (kind !== "hollow") group.add(new THREE.Mesh(g.geo, kind === "cargo" ? this.cargo : this.fill));
        const edgeMat = kind === "cargo" ? this.cargoEdge : kind === "lo" ? this.edgeLo : this.edge;
        const lines = new THREE.LineSegments(g.edges, edgeMat);
        group.add(lines);
        group.children.forEach((c) => (c.position.y = size[1] / 2));
        group.position.set(...pos);
        parent.add(group);
        return group;
    }

    glow(opacity: number, color: number = C.flow) {
        return this.track(
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                toneMapped: false,
                depthWrite: false,
                side: THREE.DoubleSide,
            })
        );
    }

    instanced(scene: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, count: number) {
        const m = new THREE.InstancedMesh(geo, mat, Math.max(1, count));
        m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        m.frustumCulled = false;
        scene.add(m);
        this.track(m);
        return m;
    }

    label(scene: THREE.Object3D, text: string, pos: [number, number, number], width = 9) {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 64;
        const ctx = c.getContext("2d");
        if (ctx) {
            ctx.fillStyle = C.label;
            ctx.font = "500 28px 'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text.split("").join(" "), 256, 32);
        }
        const tex = this.track(new THREE.CanvasTexture(c));
        tex.colorSpace = THREE.SRGBColorSpace;
        const mat = this.track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(width, width / 8, 1);
        sprite.position.set(...pos);
        scene.add(sprite);
        return mat;
    }

    dispose() {
        this.disposables.forEach((d) => d.dispose());
        this.disposables = [];
    }
}

/* Instance placement with a shared scratch object. */
const scratch = new THREE.Object3D();
export function place(
    mesh: THREE.InstancedMesh,
    i: number,
    x: number,
    y: number,
    z: number,
    s = 1,
    sy = s,
    ry = 0
) {
    scratch.position.set(x, y, z);
    scratch.rotation.set(0, ry, 0);
    scratch.scale.set(s, sy, s);
    scratch.updateMatrix();
    mesh.setMatrixAt(i, scratch.matrix);
}
export function hide(mesh: THREE.InstancedMesh, i: number) {
    place(mesh, i, 0, -9999, 0, 0);
}
export function placeObject(mesh: THREE.InstancedMesh, i: number, obj: THREE.Object3D) {
    obj.updateMatrix();
    mesh.setMatrixAt(i, obj.matrix);
}

/* Per-frame state both worlds read. */
export interface WorldState {
    t: number; // seconds, real time
    dt: number;
    p: number; // eased scroll progress
    lite: boolean;
    aspect: number;
}
