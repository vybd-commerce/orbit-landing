import * as THREE from "three";
import { C, Kit, keyframes, seg, smooth, wrap01 } from "../scale/common";
import { GLOBE_R as R, addPlanet, buildPath, latLon, pathAt, type LL, type Path } from "../scale/globeWorld";

/* The globe for /consulting/journey: three products, each on its own lane
 * from an Asian factory to a city on the other side of the world.
 *
 *   T-shirt    Dhaka → Chittagong → Suez → New York / New Jersey → New York
 *   Coffee     Ho Chi Minh City → Cat Lai → Suez → Felixstowe → London
 *   Cosmetics  Shanghai → Yangshan → Singapore → Nhava Sheva → Mumbai
 *
 * The camera is keyed to the nine scroll steps. Close-ups (the Veo clips)
 * cover the canvas at the end of each dive; the globe sets them up and
 * carries the story between them.
 */

const P: Record<string, LL> = {
    dhaka: [23.8, 90.4],
    hcmc: [10.8, 106.7],
    shanghai: [31.2, 121.5],
    chittagong: [22.3, 91.8],
    catlai: [10.76, 106.8],
    yangshan: [30.6, 122.1],
    singapore: [1.3, 103.8],
    nynj: [40.66, -74.08],
    felixstowe: [51.95, 1.35],
    nhavasheva: [18.95, 72.95],
    newyork: [40.75, -73.99],
    london: [51.51, -0.12],
    mumbai: [19.08, 72.88],
};

const LABELS: [keyof typeof P, string][] = [
    ["dhaka", "DHAKA"],
    ["hcmc", "HO CHI MINH CITY"],
    ["shanghai", "SHANGHAI"],
    ["newyork", "NEW YORK"],
    ["london", "LONDON"],
    ["mumbai", "MUMBAI"],
];

// Suez-bound legs share these waypoints so the lanes stay on water.
const WEST: LL[] = [[6, 82], [12, 55], [12.5, 44], [20, 38.5], [29.5, 32.6], [33, 28], [36, 14], [36, -5.5]];

const SEA: LL[][] = [
    [P.chittagong, [15, 90], ...WEST, [38, -30], [40, -60], P.nynj],
    [P.catlai, [8, 108], P.singapore, [5, 95], ...WEST, [43, -10], [48, -6], [50.5, 0.5], P.felixstowe],
    [P.yangshan, [25, 122.5], [15, 115], [8, 108], P.singapore, [5, 95], [7, 80], P.nhavasheva],
];
const AIR: LL[][] = [[P.shanghai, P.mumbai]];
const ROAD: LL[][] = [
    [P.dhaka, P.chittagong],
    [P.hcmc, P.catlai],
    [P.shanghai, P.yangshan],
    [P.nynj, P.newyork],
    [P.felixstowe, P.london],
    [P.nhavasheva, P.mumbai],
];

/* Camera keys along scroll, in steps of 1/9. `close` tilts the camera and
   aims at the surface instead of the planet's centre. */
const S = 1 / 9;
const KEYS = [
    { p: 0, lat: 20, lon: 100, d: 64, close: 0 },
    { p: 0.8 * S, lat: 26, lon: 86, d: 60, close: 0 },
    // 02 Made: the three Asian factories.
    { p: 1.05 * S, lat: 22, lon: 104, d: 42, close: 0.3 },
    { p: 1.4 * S, lat: 21, lon: 105, d: 27, close: 0.7 },
    { p: 1.9 * S, lat: 21, lon: 105, d: 26, close: 0.7 },
    // 03 Loaded: the port.
    { p: 2.1 * S, lat: 11, lon: 104, d: 22, close: 0.75 },
    { p: 2.4 * S, lat: 1.3, lon: 103.8, d: 12.5, close: 1 },
    { p: 2.9 * S, lat: 1.3, lon: 103.8, d: 12.5, close: 1 },
    // 04 In transit: out to the whole route, swinging west.
    { p: 3.15 * S, lat: 18, lon: 72, d: 50, close: 0.1 },
    { p: 3.5 * S, lat: 26, lon: 32, d: 62, close: 0 },
    { p: 3.9 * S, lat: 34, lon: -28, d: 58, close: 0 },
    // 05 Cleared: New York / New Jersey.
    { p: 4.1 * S, lat: 38, lon: -58, d: 30, close: 0.5 },
    { p: 4.4 * S, lat: 40.66, lon: -74.08, d: 12.5, close: 1 },
    { p: 4.9 * S, lat: 40.66, lon: -74.08, d: 12.5, close: 1 },
    // 06 On the shelf: all three cities.
    { p: 5.1 * S, lat: 36, lon: -32, d: 40, close: 0.3 },
    { p: 5.4 * S, lat: 34, lon: 0, d: 58, close: 0 },
    { p: 5.9 * S, lat: 34, lon: 0, d: 58, close: 0 },
    // 07 In their hands: New York, London, Mumbai.
    { p: 6.1 * S, lat: 40, lon: -48, d: 34, close: 0.4 },
    { p: 6.4 * S, lat: 40.75, lon: -73.99, d: 12, close: 1 },
    { p: 6.9 * S, lat: 40.75, lon: -73.99, d: 12, close: 1 },
    { p: 7.1 * S, lat: 48, lon: -36, d: 30, close: 0.4 },
    { p: 7.4 * S, lat: 51.51, lon: -0.12, d: 12, close: 1 },
    { p: 7.9 * S, lat: 51.51, lon: -0.12, d: 12, close: 1 },
    { p: 8.1 * S, lat: 36, lon: 38, d: 32, close: 0.4 },
    { p: 8.4 * S, lat: 19.08, lon: 72.88, d: 12, close: 1 },
    { p: 1, lat: 19.08, lon: 72.88, d: 12, close: 1 },
];

export function buildJourneyGlobe(lite: boolean) {
    const kit = new Kit();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(C.ground);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 800);

    addPlanet(kit, scene, lite);

    /* ── Lanes ── */
    const sea = SEA.map((w) => buildPath(w, () => R * 1.003));
    const air = AIR.map((w) => buildPath(w, (f) => R * (1.004 + 0.1 * Math.sin(Math.PI * f))));
    const road = ROAD.map((w) => buildPath(w, () => R * 1.004));

    const seaMat = kit.track(new THREE.LineBasicMaterial({ color: C.flow, transparent: true, opacity: 0.35, toneMapped: false }));
    const airMat = kit.track(
        new THREE.LineDashedMaterial({ color: C.cargoEdge, transparent: true, opacity: 0.5, dashSize: 0.12, gapSize: 0.1 })
    );
    const roadMat = kit.track(new THREE.LineBasicMaterial({ color: C.cargoEdge, transparent: true, opacity: 0.6 }));
    const addLine = (path: Path, mat: THREE.Material) => {
        const l = new THREE.Line(kit.track(new THREE.BufferGeometry().setFromPoints(path.pts)), mat);
        if (mat instanceof THREE.LineDashedMaterial) l.computeLineDistances();
        scene.add(l);
    };
    sea.forEach((p) => addLine(p, seaMat));
    air.forEach((p) => addLine(p, airMat));
    road.forEach((p) => addLine(p, roadMat));

    /* ── Movers ── */
    const mover = (geo: THREE.BufferGeometry, color: number, count: number, glow = false) =>
        kit.instanced(scene, kit.track(geo), kit.track(new THREE.MeshBasicMaterial({ color, toneMapped: !glow })), count);
    const SHIPS = lite ? 4 : 7;
    const ships = mover(new THREE.BoxGeometry(0.08, 0.06, 0.26), 0x9aa1ab, sea.length * SHIPS);
    const PLANES = 2;
    const planes = mover(new THREE.BoxGeometry(0.04, 0.03, 0.13), 0xe8ecef, air.length * PLANES, true);
    const TRUCKS = 3;
    const trucks = mover(new THREE.BoxGeometry(0.04, 0.035, 0.07), 0x9aa1ab, road.length * TRUCKS);
    const allPaths = [...sea, ...air, ...road];
    const ordersPer = allPaths.map((p) => Math.max(3, Math.round(p.len * (lite ? 1 : 1.6))));
    const orders = mover(new THREE.BoxGeometry(0.035, 0.035, 0.035), C.flow, ordersPer.reduce((a, b) => a + b, 0), true);

    /* ── Places ── */
    const places = Object.values(P).map(([la, lo]) => latLon(la, lo, R * 1.002));
    const up = new THREE.Vector3(0, 1, 0);
    const ringGeo = kit.track(new THREE.RingGeometry(0.1, 0.13, 24));
    ringGeo.rotateX(-Math.PI / 2);
    const rings = kit.instanced(scene, ringGeo, kit.glow(0.85), places.length);
    const obj = new THREE.Object3D();
    places.forEach((pos, i) => {
        obj.position.copy(pos);
        obj.quaternion.setFromUnitVectors(up, pos.clone().normalize());
        obj.updateMatrix();
        rings.setMatrixAt(i, obj.matrix);
    });
    rings.instanceMatrix.needsUpdate = true;
    const labelMats = LABELS.map(([k, text]) => {
        const v = latLon(P[k][0], P[k][1], R * 1.05);
        return kit.label(scene, text, [v.x, v.y, v.z], text.length > 10 ? 2.6 : 1.9);
    });

    // Focus: a pulsing ring on the place the camera is diving into.
    const focusGeo = kit.track(new THREE.RingGeometry(0.28, 0.33, 48));
    focusGeo.rotateX(-Math.PI / 2);
    const focusMat = kit.glow(0);
    const focus = new THREE.Mesh(focusGeo, focusMat);
    scene.add(focus);

    /* ── Per frame ── */
    const v = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const orient = (mesh: THREE.InstancedMesh, i: number, path: Path, u: number, s = 1, lift = 0) => {
        pathAt(path, u, v);
        pathAt(path, u + 0.004, v2);
        obj.position.copy(v).addScaledVector(v.clone().normalize(), lift);
        obj.up.copy(v).normalize();
        obj.lookAt(v2);
        obj.scale.setScalar(s);
        obj.updateMatrix();
        mesh.setMatrixAt(i, obj.matrix);
    };

    function update(t: number, p: number) {
        // Chapter 04 ("In transit") is the lanes' moment.
        const transit = seg(p, 3 * S, 3.3 * S) * (1 - seg(p, 3.8 * S, 4.1 * S));
        seaMat.opacity = 0.3 + 0.6 * transit;
        const shipScale = 1 + 0.7 * transit;

        let k = 0;
        sea.forEach((path) => {
            for (let j = 0; j < SHIPS; j++) orient(ships, k++, path, (t * 0.3) / path.len + j / SHIPS, shipScale);
        });
        k = 0;
        air.forEach((path) => {
            for (let j = 0; j < PLANES; j++) orient(planes, k++, path, (t * 1.1) / path.len + j / PLANES, 1 + transit * 0.5);
        });
        k = 0;
        road.forEach((path) => {
            for (let j = 0; j < TRUCKS; j++) {
                const dir = j % 2 === 0 ? 1 : -1;
                orient(trucks, k++, path, wrap01((dir * t * 0.12) / path.len + j / TRUCKS));
            }
        });
        k = 0;
        allPaths.forEach((path, li) => {
            for (let j = 0; j < ordersPer[li]; j++) orient(orders, k++, path, (t * 0.9) / path.len + j / ordersPer[li], 1, 0.03);
        });
        for (const m of [ships, planes, trucks, orders]) m.instanceMatrix.needsUpdate = true;

        const cam = keyframes(KEYS, p, ["lat", "lon", "d", "close"]);
        const drift = Math.sin(t * 0.05) * 2.5 * (1 - cam.close);
        const target = latLon(cam.lat, cam.lon + drift, R, new THREE.Vector3());
        latLon(cam.lat - 11 * cam.close, cam.lon + drift, cam.d, camera.position);
        camera.up.set(0, 1, 0);
        camera.lookAt(v.set(0, 0, 0).lerp(target, smooth(cam.close)));

        focus.position.copy(target).multiplyScalar(1.003);
        focus.quaternion.setFromUnitVectors(up, v2.copy(target).normalize());
        const pulse = 1 + 0.35 * (0.5 + 0.5 * Math.sin(t * 3));
        focus.scale.setScalar(pulse);
        focusMat.opacity = smooth((cam.close - 0.4) / 0.4) * 0.9;

        // Labels fade when the camera is right on top of them.
        labelMats.forEach((m) => (m.opacity = 1 - smooth((cam.close - 0.6) / 0.4) * 0.7));
    }

    function resize(aspect: number) {
        camera.aspect = aspect;
        camera.fov = aspect < 1 ? 32 + 20 * Math.min(1, (1 - aspect) / 0.55) : 32;
        camera.updateProjectionMatrix();
    }

    return { scene, camera, update, resize, dispose: () => kit.dispose() };
}
