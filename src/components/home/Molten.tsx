"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/*
 * The hero's object: a liquid alloy.
 *
 * A sphere of chromed copper whose surface never sits still, and seven
 * smaller spheres — silver, gold, steel, brass, nickel, rose, graphite —
 * circling it and slowly drawn in. Many metals, one alloy: the product,
 * rendered rather than illustrated. No texture or model is loaded; the
 * reflections come from a procedural room environment and the surface
 * from vertex displacement recomputed every frame.
 */

const SATELLITES: { color: number; r: number; size: number; speed: number; tilt: number; phase: number }[] = [
  { color: 0xe6e9ee, r: 1.95, size: 0.16, speed: 0.42, tilt: 0.35, phase: 0.0 },
  { color: 0xf2c25c, r: 2.25, size: 0.13, speed: -0.3, tilt: -0.5, phase: 1.1 },
  { color: 0x8fb0d8, r: 1.7, size: 0.11, speed: 0.55, tilt: 0.9, phase: 2.3 },
  { color: 0xcaa35a, r: 2.4, size: 0.1, speed: 0.26, tilt: -0.2, phase: 3.4 },
  { color: 0xb9c0c8, r: 2.05, size: 0.12, speed: -0.48, tilt: 1.2, phase: 4.2 },
  { color: 0xd9a89f, r: 1.85, size: 0.09, speed: 0.38, tilt: -0.85, phase: 5.0 },
  { color: 0x6c7480, r: 2.55, size: 0.14, speed: -0.22, tilt: 0.6, phase: 5.8 },
];

export function Molten({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 0.15, 7.2);
    camera.lookAt(0, 0, 0);

    // Reflections: a procedural studio room, prefiltered once.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    // Lights: one warm key from the upper right (the furnace), one cool rim
    // from the lower left (the cooled edge). The environment does the rest.
    const key = new THREE.DirectionalLight(0xffc38a, 2.2);
    key.position.set(3, 4, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fb0d8, 1.6);
    rim.position.set(-4, -2, -3);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0x1a1410, 0.6));

    const group = new THREE.Group();
    scene.add(group);

    // The alloy.
    // IcosahedronGeometry is non-indexed, so recomputed normals would be
    // flat per triangle and the surface would read as hammered. Merging
    // the vertices gives shared normals and a liquid sheen.
    const detail = 40;
    const geo = mergeVertices(new THREE.IcosahedronGeometry(1.25, detail));
    const base = (geo.attributes.position.array as Float32Array).slice();
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffb37e,
      metalness: 1,
      roughness: 0.14,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.3,
      emissive: 0x7a2a08,
      emissiveIntensity: 0.12,
    });
    const alloy = new THREE.Mesh(geo, mat);
    group.add(alloy);

    // The heat under it: an additive glow that never becomes a rectangle.
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const g = glowCanvas.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,150,70,0.9)");
    grad.addColorStop(0.35, "rgba(255,110,40,0.35)");
    grad.addColorStop(1, "rgba(255,90,30,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    glowTex.colorSpace = THREE.SRGBColorSpace;
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
      }),
    );
    // Kept well inside the frustum: a sprite clipped by the canvas edge
    // draws a visible rectangle on the page.
    glow.scale.set(3.8, 3.8, 1);
    glow.position.set(0.2, -0.6, -1.2);
    scene.add(glow);

    // The satellites.
    const satGeo = new THREE.SphereGeometry(1, 40, 40);
    const sats = SATELLITES.map((s) => {
      const m = new THREE.Mesh(
        satGeo,
        new THREE.MeshPhysicalMaterial({
          color: s.color,
          metalness: 1,
          roughness: 0.18,
          clearcoat: 0.5,
          envMapIntensity: 1.1,
        }),
      );
      m.scale.setScalar(s.size);
      group.add(m);
      return m;
    });

    // Pointer parallax, eased.
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    // Size to the host; the first read is synchronous so headless capture
    // gets a frame.
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Surface: layered sines in three axes, cheap and smooth enough to read
    // as liquid; normals recomputed so the reflections follow the swell.
    const v = new THREE.Vector3();
    const deform = (t: number) => {
      const arr = pos.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i];
        const y = base[i + 1];
        const z = base[i + 2];
        v.set(x, y, z);
        const n = v.length();
        const nx = x / n;
        const ny = y / n;
        const nz = z / n;
        const d =
          0.11 * Math.sin(2.1 * nx + t * 0.9 + 1.7 * ny) * Math.sin(1.9 * nz - t * 0.7) +
          0.07 * Math.sin(3.7 * ny - t * 1.1 + 2.3 * nz) * Math.cos(2.9 * nx + t * 0.5) +
          0.035 * Math.sin(6.2 * nz + t * 1.6 + 4.1 * nx);
        const s = n + d;
        arr[i] = nx * s;
        arr[i + 1] = ny * s;
        arr[i + 2] = nz * s;
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };

    let visible = host.getBoundingClientRect().bottom > 0;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(host);

    let raf = 0;
    let t0 = performance.now();
    let elapsed = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        t0 = now;
        return;
      }
      elapsed += Math.min((now - t0) / 1000, 0.05);
      t0 = now;

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      group.rotation.y = elapsed * 0.12 + current.x * 0.35;
      group.rotation.x = -current.y * 0.25;

      deform(elapsed);
      alloy.rotation.y = -elapsed * 0.06;
      mat.emissiveIntensity = 0.1 + 0.06 * (0.5 + 0.5 * Math.sin(elapsed * 1.3));
      glow.material.opacity = 0.75 + 0.2 * (0.5 + 0.5 * Math.sin(elapsed * 1.3 + 0.4));

      sats.forEach((m, i) => {
        const s = SATELLITES[i];
        // Each metal falls in a little over a long cycle and is reset at
        // the far edge, so something is always being drawn into the alloy.
        const cycle = 24;
        const p = ((elapsed * 0.35 + s.phase * 3) % cycle) / cycle;
        const radius = s.r * (1 - 0.32 * p);
        const a = elapsed * s.speed + s.phase;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;
        const y = Math.sin(a + s.phase) * Math.sin(s.tilt) * radius * 0.55;
        m.position.set(x, y, z);
        m.rotation.y = elapsed * 0.5;
      });

      renderer.render(scene, camera);
    };

    if (reduced) {
      deform(1.5);
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      geo.dispose();
      satGeo.dispose();
      mat.dispose();
      sats.forEach((m) => (m.material as THREE.Material).dispose());
      glowTex.dispose();
      glow.material.dispose();
      envTarget.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden />;
}
