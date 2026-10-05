import * as THREE from "three";
import { isLand } from "../../data/worldLand";
import { C, Kit, clamp01, keyframes, lerp, mulberry, seg, smooth, wrap01, type WorldState } from "./common";

/* The global view: a dot-matrix globe with real hubs and the lanes between
 * them. Ships run the sea lanes, freight flies the air arcs, trains and
 * trucks run inland, and green order pulses flow along all of it. Every hub
 * carries a live stock bar.
 *
 * Chapter 04 adds the scale layer: a data shell around the planet, agents
 * over every hub, and hundreds of sites (with their own lanes) lighting up
 * outward from the hubs.
 */

const R = 10;
export const GLOBE_R = R;
const DEG = Math.PI / 180;
const SHELL = R * 1.16;

export function latLon(lat: number, lon: number, r = R, out = new THREE.Vector3()) {
    const phi = (90 - lat) * DEG;
    const th = (lon + 180) * DEG;
    return out.set(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

export type LL = [number, number];

const HUB: Record<string, LL> = {
    shenzhen: [22.5, 114.1],
    hongkong: [22.3, 114.2],
    hochiminh: [10.8, 106.7],
    dhaka: [23.8, 90.4],
    chittagong: [22.3, 91.8],
    monterrey: [25.7, -100.3],
    shanghai: [31.2, 121.5],
    singapore: [1.3, 103.8],
    busan: [35.1, 129.0],
    rotterdam: [51.9, 4.5],
    la: [33.7, -118.3],
    ny: [40.7, -74.0],
    chicago: [41.9, -87.6],
    dallas: [32.8, -96.8],
    memphis: [35.1, -90.0],
    duisburg: [51.4, 6.8],
    frankfurt: [50.0, 8.6],
    anchorage: [61.2, -149.9],
};

const LABELS: [keyof typeof HUB, string][] = [
    ["shanghai", "SHANGHAI"],
    ["singapore", "SINGAPORE"],
    ["rotterdam", "ROTTERDAM"],
    ["la", "LOS ANGELES"],
    ["chicago", "CHICAGO"],
];

/* Waypoints keep the sea lanes on water: through Malacca, the Red Sea, Suez
   and Gibraltar rather than across continents. */
const SEA: LL[][] = [
    [HUB.shanghai, [31, 125], [33, 145], [38, 180], [36, -150], [34, -125], HUB.la],
    [HUB.busan, [34, 131], [36, 142], [43, 165], [43, -160], [37, -128], HUB.la],
    [
        HUB.shenzhen,
        [20, 115],
        [10, 110],
        HUB.singapore,
        [5, 95],
        [7, 78],
        [12, 55],
        [12.5, 44],
        [20, 38.5],
        [29.5, 32.6],
        [33, 28],
        [36, 14],
        [36, -5.5],
        [43, -10],
        [48, -6],
        [51, 2],
        HUB.rotterdam,
    ],
    [HUB.hochiminh, [8, 108], HUB.singapore],
    [HUB.chittagong, [15, 92], [5, 96], HUB.singapore],
    [HUB.rotterdam, [50, -5], [47, -30], [41, -60], HUB.ny],
];
const AIR: LL[][] = [
    [HUB.hongkong, HUB.anchorage, HUB.chicago],
    [HUB.frankfurt, HUB.ny],
    [HUB.shanghai, HUB.frankfurt],
];
const RAIL: LL[][] = [
    [HUB.la, [34.5, -112], HUB.dallas, HUB.memphis, HUB.chicago],
    [HUB.rotterdam, HUB.duisburg, HUB.frankfurt],
];
const ROAD: LL[][] = [
    [HUB.ny, HUB.chicago],
    [HUB.monterrey, HUB.dallas],
    [HUB.shenzhen, HUB.shanghai],
    [HUB.dhaka, HUB.chittagong],
];

/* Camera keys along scroll. The dive (ch 01 → 02) and the return (ch 04)
   are the only times the globe is on screen. */
const KEYS = [
    { p: 0.0, lat: 24, lon: -178, d: 60, close: 0 },
    { p: 0.12, lat: 27, lon: -172, d: 50, close: 0 },
    { p: 0.28, lat: 34, lon: -163, d: 11.6, close: 1 },
    { p: 0.74, lat: 34, lon: -163, d: 11.6, close: 1 },
    { p: 0.86, lat: 30, lon: -155, d: 38, close: 0.15 },
    { p: 1.0, lat: 24, lon: -165, d: 62, close: 0 },
];

export interface Path {
    pts: THREE.Vector3[];
    cum: number[];
    len: number;
}

export function buildPath(way: LL[], radius: (f: number) => number): Path {
    const dirs = way.map(([la, lo]) => latLon(la, lo, 1));
    const unit: THREE.Vector3[] = [];
    for (let i = 0; i < dirs.length - 1; i++) {
        const a = dirs[i];
        const b = dirs[i + 1];
        const angle = a.angleTo(b);
        const n = Math.max(2, Math.ceil(angle / DEG));
        for (let k = 0; k < n; k++) {
            const t = k / n;
            // Slerp between unit vectors.
            const s = Math.sin(angle);
            const v = s < 1e-6
                ? a.clone()
                : a.clone().multiplyScalar(Math.sin((1 - t) * angle) / s).add(b.clone().multiplyScalar(Math.sin(t * angle) / s));
            unit.push(v.normalize());
        }
    }
    unit.push(dirs[dirs.length - 1].clone());
    const pts = unit.map((v, i) => v.multiplyScalar(radius(i / (unit.length - 1))));
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
    return { pts, cum, len: cum[cum.length - 1] };
}

export function pathAt(path: Path, u: number, out: THREE.Vector3) {
    const d = wrap01(u) * path.len;
    let lo = 0;
    let hi = path.cum.length - 1;
    while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (path.cum[mid] < d) lo = mid;
        else hi = mid;
    }
    const span = path.cum[hi] - path.cum[lo] || 1;
    return out.lerpVectors(path.pts[lo], path.pts[hi], (d - path.cum[lo]) / span);
}

/* The planet itself: dark body, a faint rim, and land as an even dot
   matrix. Shared by every globe on /consulting. */
export function addPlanet(kit: Kit, scene: THREE.Scene, lite: boolean) {
    const body = new THREE.Mesh(
        kit.track(new THREE.SphereGeometry(R * 0.998, 72, 48)),
        kit.track(new THREE.MeshBasicMaterial({ color: 0x0d0f11 }))
    );
    scene.add(body);

    const rimMat = kit.track(
        new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            toneMapped: false,
            uniforms: { uColor: { value: new THREE.Color(C.flow) } },
            vertexShader: `
                varying float vFres;
                void main() {
                    vec3 n = normalize(normalMatrix * normal);
                    vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    vFres = pow(1.0 - abs(dot(n, normalize(-mv.xyz))), 3.0);
                    gl_Position = projectionMatrix * mv;
                }`,
            fragmentShader: `
                uniform vec3 uColor;
                varying float vFres;
                void main() { gl_FragColor = vec4(uColor, vFres * 0.1); }`,
        })
    );
    scene.add(new THREE.Mesh(kit.track(new THREE.SphereGeometry(R * 1.012, 72, 48)), rimMat));

    // Land as a dot matrix, even density at every latitude.
    const land: number[] = [];
    const step = lite ? 1.15 : 0.8;
    for (let lat = -56; lat <= 78; lat += step) {
        const lonStep = step / Math.max(0.2, Math.cos(lat * DEG));
        for (let lon = -180; lon < 180; lon += lonStep) {
            if (!isLand(lat, lon)) continue;
            const v = latLon(lat, lon, R * 1.001);
            land.push(v.x, v.y, v.z);
        }
    }
    const landGeo = kit.track(new THREE.BufferGeometry());
    landGeo.setAttribute("position", new THREE.Float32BufferAttribute(land, 3));
    scene.add(
        new THREE.Points(
            landGeo,
            // Fixed pixel size: the dot matrix has to read at every zoom.
            kit.track(new THREE.PointsMaterial({ color: 0x4d555d, size: 1.8, sizeAttenuation: false }))
        )
    );
}

export function buildGlobe(lite: boolean) {
    const kit = new Kit();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(C.ground);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 800);
    const rand = mulberry(11);

    addPlanet(kit, scene, lite);

    /* ── Lanes ── */
    const sea = SEA.map((w) => buildPath(w, () => R * 1.003));
    const air = AIR.map((w) => buildPath(w, (f) => R * (1.004 + 0.09 * Math.sin(Math.PI * f))));
    const rail = RAIL.map((w) => buildPath(w, () => R * 1.004));
    const road = ROAD.map((w) => buildPath(w, () => R * 1.004));

    const lineOf = (path: Path, mat: THREE.Material) => {
        const g = kit.track(new THREE.BufferGeometry().setFromPoints(path.pts));
        const l = new THREE.Line(g, mat);
        if (mat instanceof THREE.LineDashedMaterial) l.computeLineDistances();
        scene.add(l);
    };
    const seaMat = kit.track(new THREE.LineBasicMaterial({ color: C.lineHi, transparent: true, opacity: 0.8 }));
    const airMat = kit.track(
        new THREE.LineDashedMaterial({ color: C.cargoEdge, transparent: true, opacity: 0.45, dashSize: 0.12, gapSize: 0.1 })
    );
    const landMat = kit.track(new THREE.LineBasicMaterial({ color: C.cargoEdge, transparent: true, opacity: 0.55 }));
    sea.forEach((p) => lineOf(p, seaMat));
    air.forEach((p) => lineOf(p, airMat));
    [...rail, ...road].forEach((p) => lineOf(p, landMat));

    /* ── Movers ── */
    const mover = (geo: THREE.BufferGeometry, color: number, count: number, glow = false) =>
        kit.instanced(
            scene,
            kit.track(geo),
            kit.track(new THREE.MeshBasicMaterial({ color, toneMapped: !glow })),
            count
        );
    const shipsPer = sea.map((p) => Math.min(lite ? 5 : 9, Math.max(2, Math.round(p.len / 2.2))));
    const ships = mover(new THREE.BoxGeometry(0.07, 0.05, 0.24), 0x8a929b, shipsPer.reduce((a, b) => a + b, 0));
    const planesPer = air.map((p) => Math.max(1, Math.round(p.len / 6)));
    const planes = mover(new THREE.BoxGeometry(0.035, 0.03, 0.12), 0xe8ecef, planesPer.reduce((a, b) => a + b, 0), true);
    const CARS = 6;
    const trains = mover(new THREE.BoxGeometry(0.045, 0.04, 0.1), 0x8a929b, rail.length * 2 * CARS);
    const trucksPer = road.map((p) => Math.max(2, Math.round(p.len / 0.6)));
    const trucks = mover(new THREE.BoxGeometry(0.04, 0.035, 0.07), 0x8a929b, trucksPer.reduce((a, b) => a + b, 0));
    const allPaths = [...sea, ...air, ...rail, ...road];
    const ordersPer = allPaths.map((p) => Math.max(3, Math.round(p.len * (lite ? 0.8 : 1.4))));
    const orders = mover(new THREE.BoxGeometry(0.035, 0.035, 0.035), C.flow, ordersPer.reduce((a, b) => a + b, 0), true);

    /* ── Hubs: marker ring + live stock bar ── */
    const hubList = Object.values(HUB);
    const hubPos = hubList.map(([la, lo]) => latLon(la, lo, R * 1.002));
    const hubN = hubPos.map((v) => v.clone().normalize());
    const ringGeo = kit.track(new THREE.RingGeometry(0.1, 0.13, 24));
    ringGeo.rotateX(-Math.PI / 2);
    const rings = kit.instanced(scene, ringGeo, kit.glow(0.9), hubList.length);
    const barGeo = kit.track(new THREE.BoxGeometry(0.06, 1, 0.06));
    barGeo.translate(0, 0.5, 0);
    const barTrack = kit.instanced(scene, barGeo, kit.glow(0.18, C.cargoEdge), hubList.length);
    const barFill = kit.instanced(scene, barGeo, kit.glow(0.95), hubList.length);
    const labelMats = LABELS.map(([k, text]) => {
        const v = latLon(HUB[k][0], HUB[k][1], R * 1.06);
        return kit.label(scene, text, [v.x, v.y, v.z], 1.9);
    });

    const up = new THREE.Vector3(0, 1, 0);
    const hubQuat = hubN.map((n) => new THREE.Quaternion().setFromUnitVectors(up, n));
    const hubEast = hubN.map((n) => new THREE.Vector3().crossVectors(up, n).normalize());
    const obj = new THREE.Object3D();
    hubPos.forEach((p, i) => {
        obj.position.copy(p);
        obj.quaternion.copy(hubQuat[i]);
        obj.scale.setScalar(1);
        obj.updateMatrix();
        rings.setMatrixAt(i, obj.matrix);
    });
    rings.instanceMatrix.needsUpdate = true;

    /* ── Scale layer (chapter 04) ── */
    const shellMat = kit.track(
        new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            toneMapped: false,
            uniforms: { uShell: { value: 0 }, uColor: { value: new THREE.Color(C.flow) } },
            vertexShader: `
                varying vec2 vUv;
                varying float vFres;
                void main() {
                    vUv = uv;
                    vec3 n = normalize(normalMatrix * normal);
                    vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    vFres = 1.0 - abs(dot(n, normalize(-mv.xyz)));
                    gl_Position = projectionMatrix * mv;
                }`,
            fragmentShader: `
                uniform float uShell;
                uniform vec3 uColor;
                varying vec2 vUv;
                varying float vFres;
                void main() {
                    vec2 g = vec2(vUv.x * 36.0, vUv.y * 18.0);
                    vec2 w = fwidth(g);
                    vec2 c = abs(fract(g - 0.5) - 0.5) / w;
                    float line = 1.0 - min(min(c.x, c.y), 1.0);
                    float a = uShell * (0.01 + 0.11 * line) * (0.3 + 0.7 * vFres);
                    gl_FragColor = vec4(uColor, a);
                }`,
        })
    );
    const shell = new THREE.Mesh(kit.track(new THREE.SphereGeometry(SHELL, 96, 64)), shellMat);
    scene.add(shell);

    const riserMat = kit.glow(0.6);
    const risers = kit.instanced(scene, barGeo, riserMat, hubList.length);
    const pulseGeo = kit.track(new THREE.BoxGeometry(0.07, 0.16, 0.07));
    const riserPulses = kit.instanced(scene, pulseGeo, kit.glow(1), hubList.length * 2);

    const AGENTS_PER_HUB = 3;
    const agentGeo = kit.track(new THREE.OctahedronGeometry(0.075, 0));
    const agents = kit.instanced(scene, agentGeo, kit.glow(1, C.agent), hubList.length * AGENTS_PER_HUB);
    const beamGeo = kit.track(new THREE.BoxGeometry(0.012, 1, 0.012));
    beamGeo.translate(0, -0.5, 0);
    const agentBeams = kit.instanced(scene, beamGeo, kit.glow(0.4, C.agent), hubList.length * AGENTS_PER_HUB);

    // Sites: land cells, ranked by distance to the nearest hub, so the
    // network visibly grows outward from where the operation already is.
    const siteCount = lite ? 320 : 760;
    const sitePos: number[] = [];
    const siteRank: number[] = [];
    const siteDirs: THREE.Vector3[] = [];
    let guard = 0;
    while (siteDirs.length < siteCount && guard++ < 200000) {
        const lat = -40 + rand() * 105;
        const lon = -180 + rand() * 360;
        if (!isLand(lat, lon)) continue;
        const d = latLon(lat, lon, 1);
        let near = Infinity;
        for (const n of hubN) near = Math.min(near, d.angleTo(n));
        siteDirs.push(d);
        siteRank.push(near + rand() * 0.25);
    }
    const maxRank = Math.max(...siteRank);
    siteDirs.forEach((d, i) => {
        const v = d.clone().multiplyScalar(R * 1.004);
        sitePos.push(v.x, v.y, v.z);
        siteRank[i] = siteRank[i] / maxRank;
    });
    const revealU = { value: 0 };
    const pointsMat = (color: number, size: number, alpha: number) =>
        kit.track(
            new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                toneMapped: false,
                uniforms: {
                    uReveal: revealU,
                    uColor: { value: new THREE.Color(color) },
                    uSize: { value: size },
                    uAlpha: { value: alpha },
                },
                vertexShader: `
                    attribute float aRank;
                    uniform float uReveal;
                    uniform float uSize;
                    varying float vA;
                    void main() {
                        vA = clamp((uReveal - aRank) / 0.06, 0.0, 1.0);
                        vec4 mv = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = uSize * vA * (60.0 / -mv.z);
                        gl_Position = projectionMatrix * mv;
                    }`,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uAlpha;
                    varying float vA;
                    void main() {
                        float d = length(gl_PointCoord - 0.5);
                        if (d > 0.5 || vA <= 0.0) discard;
                        gl_FragColor = vec4(uColor, uAlpha * vA * (1.0 - smoothstep(0.25, 0.5, d)));
                    }`,
            })
        );
    const siteGeo = kit.track(new THREE.BufferGeometry());
    siteGeo.setAttribute("position", new THREE.Float32BufferAttribute(sitePos, 3));
    siteGeo.setAttribute("aRank", new THREE.Float32BufferAttribute(siteRank, 1));
    const sites = new THREE.Points(siteGeo, pointsMat(C.flow, 4.5, 0.95));
    sites.frustumCulled = false;
    scene.add(sites);

    // Agents over a subset of sites, hovering just above them.
    const siteAgentPos: number[] = [];
    const siteAgentRank: number[] = [];
    siteDirs.forEach((d, i) => {
        if (i % 3 !== 0) return;
        const v = d.clone().multiplyScalar(R * 1.045);
        siteAgentPos.push(v.x, v.y, v.z);
        siteAgentRank.push(siteRank[i] + 0.04);
    });
    const siteAgentGeo = kit.track(new THREE.BufferGeometry());
    siteAgentGeo.setAttribute("position", new THREE.Float32BufferAttribute(siteAgentPos, 3));
    siteAgentGeo.setAttribute("aRank", new THREE.Float32BufferAttribute(siteAgentRank, 1));
    const siteAgentMat = pointsMat(C.agent, 3.2, 0.9);
    const siteAgents = new THREE.Points(siteAgentGeo, siteAgentMat);
    siteAgents.frustumCulled = false;
    scene.add(siteAgents);

    // Short lanes between nearby sites: the network's own traffic.
    const linkCount = lite ? 110 : 260;
    const links: { a: THREE.Vector3; b: THREE.Vector3; rank: number; angle: number }[] = [];
    guard = 0;
    while (links.length < linkCount && guard++ < 50000) {
        const i = Math.floor(rand() * siteDirs.length);
        const j = Math.floor(rand() * siteDirs.length);
        const angle = siteDirs[i].angleTo(siteDirs[j]);
        if (angle < 6 * DEG || angle > 38 * DEG) continue;
        links.push({ a: siteDirs[i], b: siteDirs[j], rank: Math.max(siteRank[i], siteRank[j]), angle });
    }
    const arcPoint = (l: (typeof links)[number], f: number, out: THREE.Vector3) => {
        const s = Math.sin(l.angle);
        out
            .copy(l.a)
            .multiplyScalar(Math.sin((1 - f) * l.angle) / s)
            .addScaledVector(l.b, Math.sin(f * l.angle) / s)
            .normalize();
        return out.multiplyScalar(R * (1.004 + 0.035 * (l.angle / (38 * DEG)) * Math.sin(Math.PI * f)));
    };
    const linkPts: THREE.Vector3[] = [];
    const linkRanks: number[] = [];
    const SEG = 16;
    for (const l of links) {
        for (let k = 0; k < SEG; k++) {
            linkPts.push(arcPoint(l, k / SEG, new THREE.Vector3()), arcPoint(l, (k + 1) / SEG, new THREE.Vector3()));
            linkRanks.push(l.rank, l.rank);
        }
    }
    const linkGeo = kit.track(new THREE.BufferGeometry().setFromPoints(linkPts));
    linkGeo.setAttribute("aRank", new THREE.Float32BufferAttribute(linkRanks, 1));
    const linkMat = kit.track(
        new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            toneMapped: false,
            uniforms: { uReveal: revealU, uColor: { value: new THREE.Color(C.flow) } },
            vertexShader: `
                attribute float aRank;
                uniform float uReveal;
                varying float vA;
                void main() {
                    vA = clamp((uReveal - aRank) / 0.08, 0.0, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `
                uniform vec3 uColor;
                varying float vA;
                void main() { if (vA <= 0.0) discard; gl_FragColor = vec4(uColor, 0.22 * vA); }`,
        })
    );
    const linkLines = new THREE.LineSegments(linkGeo, linkMat);
    linkLines.frustumCulled = false;
    scene.add(linkLines);
    const linkPulses = kit.instanced(scene, kit.track(new THREE.BoxGeometry(0.03, 0.03, 0.03)), kit.glow(1), links.length);

    /* ── Per frame ── */
    const v = new THREE.Vector3();
    const v2 = new THREE.Vector3();

    const orient = (mesh: THREE.InstancedMesh, i: number, path: Path, u: number, lift = 0) => {
        pathAt(path, u, v);
        pathAt(path, u + 0.004, v2);
        obj.position.copy(v).addScaledVector(v.clone().normalize(), lift);
        obj.up.copy(v).normalize();
        obj.lookAt(v2);
        obj.scale.setScalar(1);
        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);
    };

    function update(s: WorldState, visible: boolean) {
        if (!visible) return;
        const { t, p } = s;

        const shellW = seg(p, 0.8, 0.9);
        const agentW = seg(p, 0.83, 0.94);
        const reveal = seg(p, 0.82, 1) * 1.08;
        shellMat.uniforms.uShell.value = shellW;
        shell.visible = shellW > 0.001;
        revealU.value = reveal;
        sites.visible = siteAgents.visible = linkLines.visible = linkPulses.visible = reveal > 0.001;
        siteAgentMat.uniforms.uAlpha.value = 0.9 * agentW;

        // Ships: evenly spaced on each lane, slow.
        let k = 0;
        sea.forEach((path, li) => {
            for (let j = 0; j < shipsPer[li]; j++) orient(ships, k++, path, (t * 0.28) / path.len + j / shipsPer[li]);
        });
        k = 0;
        air.forEach((path, li) => {
            for (let j = 0; j < planesPer[li]; j++) orient(planes, k++, path, (t * 1.1) / path.len + j / planesPer[li]);
        });
        k = 0;
        rail.forEach((path, li) => {
            for (let tr = 0; tr < 2; tr++) {
                const head = (t * 0.5) / path.len + tr * 0.5 + li * 0.3;
                for (let c = 0; c < CARS; c++) orient(trains, k++, path, head - (c * 0.11) / path.len);
            }
        });
        k = 0;
        road.forEach((path, li) => {
            for (let j = 0; j < trucksPer[li]; j++) {
                // Half the trucks run each way.
                const dir = j % 2 === 0 ? 1 : -1;
                orient(trucks, k++, path, (dir * t * 0.35) / path.len + j / trucksPer[li]);
            }
        });
        k = 0;
        allPaths.forEach((path, li) => {
            for (let j = 0; j < ordersPer[li]; j++) orient(orders, k++, path, (t * 0.9) / path.len + j / ordersPer[li], 0.03);
        });

        // Stock bars: each hub's level breathes as goods arrive and leave.
        hubPos.forEach((pos, i) => {
            const level = clamp01(0.5 + 0.3 * Math.sin(t * 0.45 + i * 1.3) + 0.15 * Math.sin(t * 1.3 + i * 2.1));
            obj.quaternion.copy(hubQuat[i]);
            obj.position.copy(pos).addScaledVector(hubEast[i], 0.2);
            obj.scale.set(1, 0.7, 1);
            obj.updateMatrix();
            barTrack.setMatrixAt(i, obj.matrix);
            obj.scale.set(1.3, Math.max(0.02, 0.7 * level), 1.3);
            obj.updateMatrix();
            barFill.setMatrixAt(i, obj.matrix);

            // Riser from hub to shell, with a pulse each way.
            obj.position.copy(pos);
            obj.scale.set(0.35, Math.max(0.001, (SHELL - R) * shellW), 0.35);
            obj.updateMatrix();
            risers.setMatrixAt(i, obj.matrix);
            for (let d = 0; d < 2; d++) {
                const f = wrap01(t * 0.5 + i * 0.17 + d * 0.5);
                const h = (SHELL - R) * shellW * (d === 0 ? f : 1 - f);
                obj.position.copy(pos).addScaledVector(hubN[i], h);
                obj.scale.setScalar(shellW > 0.01 ? 1 : 0);
                obj.updateMatrix();
                riserPulses.setMatrixAt(i * 2 + d, obj.matrix);
            }

            // Agents circling above each hub, beams down to it.
            for (let a = 0; a < AGENTS_PER_HUB; a++) {
                const ang = t * (0.6 + a * 0.15) + a * 2.1 + i;
                const tangentA = hubEast[i];
                const tangentB = v2.crossVectors(hubN[i], tangentA);
                obj.position
                    .copy(hubN[i])
                    .multiplyScalar(R * 1.075 + Math.sin(t * 1.5 + a) * 0.03)
                    .addScaledVector(tangentA, Math.cos(ang) * 0.32)
                    .addScaledVector(tangentB, Math.sin(ang) * 0.32);
                obj.quaternion.copy(hubQuat[i]);
                obj.scale.setScalar(Math.max(0.001, agentW));
                obj.updateMatrix();
                agents.setMatrixAt(i * AGENTS_PER_HUB + a, obj.matrix);
                obj.scale.set(agentW, Math.max(0.001, R * 0.073 * agentW), agentW);
                obj.updateMatrix();
                agentBeams.setMatrixAt(i * AGENTS_PER_HUB + a, obj.matrix);
            }
        });

        // Pulses along the network's own lanes.
        if (reveal > 0.001) {
            links.forEach((l, i) => {
                if (l.rank > reveal) {
                    obj.scale.setScalar(0);
                } else {
                    arcPoint(l, wrap01(t * 0.35 + i * 0.37), obj.position);
                    obj.scale.setScalar(1);
                }
                obj.quaternion.identity();
                obj.updateMatrix();
                linkPulses.setMatrixAt(i, obj.matrix);
            });
        }

        for (const m of [ships, planes, trains, trucks, orders, barTrack, barFill, risers, riserPulses, agents, agentBeams, linkPulses]) {
            m.instanceMatrix.needsUpdate = true;
        }
        const labelA = 1 - seg(p, 0.86, 0.94);
        labelMats.forEach((m) => (m.opacity = labelA));

        /* Camera: orbit the planet; when close, tilt so the lane is seen
           at an angle rather than straight down. */
        const cam = keyframes(KEYS, p, ["lat", "lon", "d", "close"]);
        const drift = Math.sin(t * 0.05) * 3 * (1 - cam.close);
        const target = latLon(cam.lat, cam.lon + drift, R, new THREE.Vector3());
        latLon(cam.lat - 10 * cam.close, cam.lon + drift, cam.d, camera.position);
        camera.up.set(0, 1, 0);
        camera.lookAt(v.set(0, 0, 0).lerp(target, smooth(cam.close)));
    }

    function resize(aspect: number) {
        camera.aspect = aspect;
        // Portrait screens need a wider vertical field to keep the planet in.
        camera.fov = aspect < 1 ? lerp(32, 52, clamp01((1 - aspect) / 0.55)) : 32;
        camera.updateProjectionMatrix();
    }

    return { scene, camera, update, resize, dispose: () => kit.dispose() };
}
