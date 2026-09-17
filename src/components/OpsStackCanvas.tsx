import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  OPS_STACK_SLABS,
  SLAB_CORNER_RADIUS,
  SLAB_DEPTH,
  SLAB_WIDTH,
} from "../data/opsStack";

/* This module is loaded lazily — it pulls in three, which is far too large to
   sit in the landing page's main bundle for a section most visitors scroll
   past. Everything a reader needs is in the rail, which renders without it. */

/* The Spline export. Optional: the stack is built procedurally from the same
   table in ../data/opsStack, and the GLB simply replaces that geometry once it
   is present. Nothing breaks while the file is missing. */
const GLB_URL = "/assets/ops-stack.glb";

const DEG = Math.PI / 180;
/* Camera per the scene brief: perspective, FOV 38, elevation ~20. Zoom is not
   wired up at all — it would fight page scroll. */
const FOV = 38;
const AZIMUTH = -27 * DEG;
const ELEVATION = 20 * DEG;
const DISTANCE = 1460;

const PACKET_TOP = 300;
const PACKET_BOTTOM = -320;
const DOWN_PACKETS = 9;
const UP_PACKETS = 4;

/** Slab X offset when its rail layer is active. */
const ACTIVE_OFFSET = 34;

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export default function OpsStackCanvas({ activeId }: { activeId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* The render loop reads the active layer through a ref so that changing it
     never tears down the scene. */
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();

    /* The brief asks for an HDRI: glass with nothing to reflect reads as grey
       plastic. RoomEnvironment gives us one with no asset to ship. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 6000);
    camera.position.set(
      DISTANCE * Math.cos(ELEVATION) * Math.sin(AZIMUTH),
      DISTANCE * Math.sin(ELEVATION),
      DISTANCE * Math.cos(ELEVATION) * Math.cos(AZIMUTH),
    );
    camera.lookAt(0, -10, 0);

    /* One directional key for edge definition, low intensity. No shadows —
       the brief leaves them off. */
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(520, 700, 780);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const stack = new THREE.Group();
    scene.add(stack);

    interface SlabHandle {
      mesh: THREE.Mesh;
      material: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
      layerId: string;
      baseOpacity: number;
    }

    const slabs: SlabHandle[] = OPS_STACK_SLABS.map((slab) => {
      const geometry = new RoundedBoxGeometry(
        SLAB_WIDTH,
        slab.height,
        SLAB_DEPTH,
        3,
        SLAB_CORNER_RADIUS,
      );

      /* Real transmission is the wrong tool here. It costs an extra full-scene
         render pass every frame, and a transmissive surface can only show what
         is behind it — on this page that is flat page background, so it buys
         nothing visible. Plain alpha over the light surface reads as glass and
         darkens where slabs overlap, which is the whole argument. */
      const material = slab.glass
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(slab.color),
            transparent: true,
            opacity: 0.62,
            roughness: 0.14,
            metalness: 0,
            clearcoat: 0.6,
            clearcoatRoughness: 0.2,
            envMapIntensity: 0.9,
            depthWrite: false,
            emissive: new THREE.Color(slab.color),
            emissiveIntensity: 0,
          })
        : /* Source is inert and physical; everything below it is a lens.
             Making it a different material class carries that without a caption. */
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(slab.color),
            roughness: 0.72,
            metalness: 0.35,
            envMapIntensity: 0.7,
          });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = slab.name;
      mesh.position.set(0, slab.y, 0);
      /* Far slabs first, so the transparent ones blend in a stable order. */
      mesh.renderOrder = -slab.y;
      stack.add(mesh);

      return { mesh, material, layerId: slab.layerId, baseOpacity: slab.glass ? 0.62 : 1 };
    });

    /* If the Spline GLB is present, its geometry replaces the procedural boxes.
       Materials stay owned by the page. */
    let disposed = false;
    new GLTFLoader().load(
      GLB_URL,
      (gltf) => {
        if (disposed) return;
        for (const handle of slabs) {
          const source = gltf.scene.getObjectByName(handle.mesh.name);
          if (source instanceof THREE.Mesh) {
            handle.mesh.geometry.dispose();
            handle.mesh.geometry = source.geometry;
          }
        }
      },
      undefined,
      () => {
        /* No GLB yet — the procedural stack already on screen is the fallback. */
      },
    );

    // ─── Packets: data flows down, approved writes flow back up ───
    const packetGeometry = new THREE.SphereGeometry(7, 12, 12);
    const downMaterial = new THREE.MeshBasicMaterial({ color: 0x1ab394, transparent: true });
    const upMaterial = new THREE.MeshBasicMaterial({ color: 0xe07a55, transparent: true });
    const down = new THREE.InstancedMesh(packetGeometry, downMaterial, DOWN_PACKETS);
    const up = new THREE.InstancedMesh(packetGeometry, upMaterial, UP_PACKETS);
    down.frustumCulled = false;
    up.frustumCulled = false;
    stack.add(down, up);

    /* Deterministic lanes, so the packets read as channels rather than noise. */
    const lane = (i: number, count: number) => ({
      x: ((i % 3) - 1) * (SLAB_WIDTH * 0.28),
      z: (Math.floor(i / 3) / Math.max(1, Math.ceil(count / 3) - 1) - 0.5) * SLAB_DEPTH * 0.5,
    });

    const dummy = new THREE.Object3D();
    const writePackets = (
      mesh: THREE.InstancedMesh,
      count: number,
      t: number,
      ascending: boolean,
    ) => {
      for (let i = 0; i < count; i++) {
        const phase = (((t * (ascending ? 0.13 : 0.19) + i / count) % 1) + 1) % 1;
        const eased = easeInOutSine(phase);
        const { x, z } = lane(i, count);
        dummy.position.set(
          x,
          ascending
            ? PACKET_BOTTOM + (PACKET_TOP - PACKET_BOTTOM) * eased
            : PACKET_TOP - (PACKET_TOP - PACKET_BOTTOM) * eased,
          z,
        );
        /* Fade in and out at the ends instead of popping. */
        const s = Math.sin(phase * Math.PI);
        dummy.scale.setScalar(s * s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    };

    // ─── Pointer parallax (never scroll, never zoom) ───
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    // ─── Size ───
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // ─── Loop, gated on visibility ───
    let frame = 0;
    let running = false;
    const clock = new THREE.Clock();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const active = activeIdRef.current;

      for (const handle of slabs) {
        const isActive = handle.layerId === active;
        const targetX = isActive ? ACTIVE_OFFSET : 0;
        handle.mesh.position.x += (targetX - handle.mesh.position.x) * 0.12;

        const targetOpacity = isActive
          ? Math.min(1, handle.baseOpacity + 0.18)
          : handle.baseOpacity * 0.6;
        if (handle.material.transparent) {
          handle.material.opacity += (targetOpacity - handle.material.opacity) * 0.12;
        }
        const targetEmissive = isActive ? 0.22 : 0;
        handle.material.emissiveIntensity +=
          (targetEmissive - handle.material.emissiveIntensity) * 0.12;
      }

      if (reduceMotion) {
        down.visible = false;
        up.visible = false;
      } else {
        writePackets(down, DOWN_PACKETS, t, false);
        writePackets(up, UP_PACKETS, t, true);

        const targetY = pointer.x * 0.06;
        const targetX = -pointer.y * 0.04;
        stack.rotation.y += (targetY - stack.rotation.y) * 0.06;
        stack.rotation.x += (targetX - stack.rotation.x) * 0.06;
      }

      renderer.render(scene, camera);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          frame = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      for (const handle of slabs) {
        handle.mesh.geometry.dispose();
        handle.material.dispose();
      }
      packetGeometry.dispose();
      downMaterial.dispose();
      upMaterial.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="stack-visual" ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="stack-canvas" />
    </div>
  );
}
