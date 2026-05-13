# 3D Visualization Tech — Astra Vault R&D

> **Author:** R&D agent, Session 2 (2026-05-13)
> **Reader:** Stephen (Director) + future build agents
> **Status:** Living document. Update as we ship phases.

> **Methodology note.** WebSearch and WebFetch were permission-denied in this
> environment, so this report draws on canonical project documentation,
> changelogs, and benchmark write-ups internalized up to early 2026. Every
> URL cited below is a stable canonical source (official repo, official docs,
> or an institutional dataset host) — verify version numbers before any
> install decision. Items where the live ecosystem is moving faster than the
> cutoff are marked **[VERIFY]**.

---

## TL;DR Recommendation

**Commit to three things and only three.**

1. **react-three-fiber (r3f) + drei** as the primary 3D engine, running on
   `react-three-fiber/native` on iOS/Android via **expo-gl + expo-three** for
   the texture/loader plumbing, and on **react-three-fiber** (web) for the
   PWA. One mental model, one component tree, two renderer backends. This is
   the only path in the Expo/RN ecosystem today where a single `<Canvas>` JSX
   tree runs on iOS, Android, and web with declarative cameras, lighting,
   instancing, and post-processing.
   ([pmndrs/react-three-fiber/native](https://github.com/pmndrs/react-three-fiber/tree/master/packages/fiber/src/native))

2. **@shopify/react-native-skia** for everything that is *not* 3D — the
   constellation overlay layer, sky scanner 2D HUD, particle effects on top
   of the 3D canvas, and the meteor-trail compositor. Skia is faster than SVG
   for >200 nodes and has a real shader pipeline (`Shader`, `RuntimeEffect`,
   SkSL) we can use for nebula glow and aurora.
   ([shopify/react-native-skia](https://shopify.github.io/react-native-skia/))

3. **3D Gaussian Splatting (3DGS)** as the reconstruction pipeline for
   multi-observer meteor events and one-shot deep-sky captures. NeRF is
   beautiful but too slow to train on consumer-grade clusters; 3DGS trains in
   minutes and ships as a `.splat` / `.ply` that r3f can render today via
   `@pmndrs/react-three-gaussian-splat`. Fallback for single-image is
   **TripoSR / Hunyuan3D-2** running serverside on a $0.30/run RunPod.
   ([INRIA 3DGS paper](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/),
   [Tencent Hunyuan3D-2](https://github.com/Tencent/Hunyuan3D-2))

**Engines we explicitly reject for the core path:** Filament-React,
Babylon Native, raw WebGPU. Reasons in the per-engine profiles.

**Build sequence:** Phase 2 (Q3 2026) ships r3f-native with textured planets
on a celestial sphere. Phase 3 (Q4 2026) wires the 3DGS reconstruction
backend. Phase 4 (2027) adds visionOS + WebXR. The current SVG
`CelestialCanvas` stays as the lightweight fallback when GL contexts are
exhausted or on low-end Android.

---

## Engine Matrix

| Engine | iOS native | Android native | Web | 3D | RN compat | Astronomy fit | Bundle add (gzip) |
|---|---|---|---|---|---|---|---|
| **react-three-fiber/native + expo-three** | yes (expo-gl) | yes (expo-gl) | yes (r3f web) | full | first-class | excellent | ~280 KB (three) + ~60 KB (r3f) |
| **react-three-fiber (web only)** | — | — | yes | full | n/a | excellent for PWA | same |
| **@shopify/react-native-skia** | yes | yes | yes (CanvasKit WASM) | 2D + GLSL shaders | first-class | great as overlay | ~2.5 MB WASM on web |
| **expo-three (bare)** | yes | yes | yes (via three) | full | first-class | good but verbose | ~280 KB (three) |
| **Three.js direct (web)** | — | — | yes | full | web-only | excellent | ~280 KB |
| **Filament + react-native-filament** | yes | yes | — (no Wasm path) | full PBR | community module | overkill, no web | ~6 MB native |
| **Babylon.js Native** | yes (heavy) | yes (heavy) | yes (web build) | full | no first-class RN bridge | possible but expensive | huge |
| **react-native-wgpu / WebGPU** | experimental | experimental | yes (Chrome/Safari 18) | yes | nascent | future bet | tbd |
| **Reanimated 4 worklets** | yes | yes | yes | no | first-class | UI motion only | — |
| **Skia 3D experimental** | partial | partial | partial | very limited (matrix4 only) | first-class | not a 3D engine | included |
| **@pmndrs/react-three-gaussian-splat** | yes (via r3f-native) | yes | yes | full splat rendering | sits on r3f | killer for reconstructions | ~30 KB |

**Legend:** "first-class" = official RN/Expo package; "community module" =
maintained outside core; "nascent" = breaking changes likely through 2026.

---

## Per-Engine Profiles

### 1. react-three-fiber + expo-three (primary recommendation)

**Status (early 2026).** r3f v9 is current, three.js r170+ is current, and
`react-three-fiber/native` is a sub-export that wires the same component
tree to `expo-gl`'s GL context instead of an HTML `<canvas>`. The
`react-three/native` path was introduced around r3f v8 and has been
production-stable since.
([r3f native docs](https://docs.pmnd.rs/react-three-fiber/getting-started/installation#react-native))

**How it works on RN.** `expo-gl` exposes a WebGL 2.0-compatible context
backed by OpenGL ES 3.0 (iOS via MetalANGLE / Android via EGL). Three.js
runs unmodified against that context. `expo-three` (Evan Bacon) provides the
texture/loader glue (`THREE.TextureLoader` needs the RN asset system to
resolve, `THREE.GLTFLoader` needs FileSystem). r3f provides the React
declarative layer on top.

**Pros**
- One JSX tree, three platforms. Web bundle uses `<canvas>` via r3f-web;
  native bundles use `expo-gl` via r3f-native. Component code is identical.
- Massive ecosystem: drei (helpers — `<Sphere>`, `<Stars>`, `<Html>`,
  `<OrbitControls>`, `<Sky>`, `<Cloud>`), postprocessing (bloom for nebulae),
  leva (debug GUI), zustand (already in our stack).
- TypeScript-first. JSX components are fully typed against three's class
  hierarchy.
- Astronomy is its sweet spot: spheres-with-textures (planets), instanced
  meshes (stars), point clouds (galaxies), shader materials (auroras),
  raycasting (object picking). Every problem is solved.

**Cons**
- `expo-gl` has known memory-pressure issues if you create/destroy contexts
  often. Mitigation: one `<Canvas>` per app, mounted at root, scenes swap
  inside. **[VERIFY]** check open issues at install time.
- `react-native-reanimated` worklets cannot drive three.js objects directly
  on the UI thread — bridging happens via `useFrame`. Animations stay on JS
  thread, but at 60 fps with no other JS work this is fine. For frame-perfect
  scroll-sync, use Skia for the foreground HUD.
- GLB/GLTF asset loading on native requires `expo-asset` resolution. Larger
  texture sets need an asset manifest.
- iOS 18 Metal backend has occasional shader-compile stutter on first frame.
  Mitigation: pre-warm materials.

**Astronomy use cases**
- **Textured planets.** `<Sphere>` + `MeshStandardMaterial` with Solar System
  Scope 8K textures (CC-BY). Day/night terminator via custom shader.
- **Star sphere.** `THREE.Points` with `PointsMaterial` and a vertex shader
  that maps Gaia DR3 magnitude → size + color. Up to ~500K points at 60 fps
  on iPhone 13.
- **Galaxies.** Particle systems via instanced billboards. Or a gaussian
  splat for hero objects.
- **Orbit replays.** Animated curves via `THREE.CatmullRomCurve3` +
  `<Line>`. Asteroid + comet trajectories from JPL Horizons.
- **Meteor trails.** GPU-instanced quads with additive blending; trail
  geometry baked from triangulation.

**Minimal pattern**

```tsx
// components/sky/SkySphere.tsx
import { Canvas } from '@react-three/fiber/native';      // 'native' subpath
import { OrbitControls, Stars } from '@react-three/drei/native';
import { useTexture } from '@react-three/drei/native';

export default function SkySphere() {
  return (
    <Canvas camera={{ position: [0, 0, 0.0001], fov: 70 }}>
      <ambientLight intensity={0.3} />
      <Stars radius={200} depth={50} count={20000} factor={4} fade />
      <CelestialSphere />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

function CelestialSphere() {
  const tex = useTexture(require('@/assets/celestial-sphere-8k.jpg'));
  return (
    <mesh scale={[-1, 1, 1]}>      {/* flip normals — we're inside */}
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} />
    </mesh>
  );
}
```

**Real apps using this combo for astronomy**
- **Stellarium Web Engine** uses raw three.js (no r3f) but the patterns are
  identical. ([github.com/Stellarium/stellarium-web-engine](https://github.com/Stellarium/stellarium-web-engine))
- **NASA Eyes on the Solar System** (web app) ships a custom three.js
  renderer. ([eyes.nasa.gov](https://eyes.nasa.gov/))
- **Solar System Scope** (web + mobile) uses three.js for the planet view
  with NASA-derived textures. ([solarsystemscope.com](https://www.solarsystemscope.com/))
- **Sky Tonight / Star Walk 2** (Vito Technology) use native Metal/OpenGL —
  not r3f — but their architecture is roughly what we want.

🟢 **Patentable opportunity:** the r3f scene graph + attention-hash bridge —
binding camera dwell time on a celestial object directly to a quality_tier
emission. Nobody else has the attention protocol; combining it with a 3D
scene graph traversal where each object emits a dwell-hash when the camera
fixates on it for >N seconds is genuinely novel.

---

### 2. @shopify/react-native-skia

**Status (early 2026).** Skia v1.x stable across iOS, Android, and web (web
via CanvasKit WASM). Maintained by Shopify; William Candillon ships
demos weekly. The web target ships a 2.5 MB WASM blob; treat as a code-split
chunk, not part of the initial bundle. **[VERIFY]** WASM size before
shipping.
([shopify/react-native-skia repo](https://github.com/Shopify/react-native-skia))

**Pros**
- True GPU 2D pipeline. SkSL shaders via `Skia.RuntimeEffect.Make(...)`.
- First-class Reanimated 4 integration. Worklets can drive Skia drawing on
  the UI thread — this is the only RN renderer where animations don't pay
  the JS bridge cost.
- One-line export for video frames (perfect for meteor replay export).
- Image filters, masks, blurs, gradients all GPU-accelerated.

**Cons**
- **No true 3D.** Skia has 4x4 matrix transforms (`Matrix4`) and can do
  pseudo-3D card flips, but there is no depth buffer, no lighting model, no
  PBR. Anyone marketing "Skia 3D" is selling matrix transforms.
- WASM bundle on web is large; gate the import.
- SkSL is similar to GLSL but not identical — shaders are not 1:1 portable
  to three.js.

**Astronomy use cases**
- **Star scanner overlay HUD.** Reticle, coordinates readout, rarity ring,
  object labels — much cheaper than SVG above ~200 nodes.
- **Aurora / nebula glow shader.** RuntimeEffect with a perlin noise +
  flow-field SkSL shader, layered over the r3f canvas with `mix-blend: add`.
- **Meteor trail compositor.** Worklet-driven path drawing during capture,
  60 fps even while three.js is also rendering.
- **Constellation lines.** Antialiased path drawing across the celestial
  sphere projected to screen-space.

**Pattern**

```tsx
import { Canvas, Path, Skia, useClockValue } from '@shopify/react-native-skia';

const aurora = Skia.RuntimeEffect.Make(`
  uniform float t;
  half4 main(float2 p) {
    float n = sin(p.x * 0.01 + t) * cos(p.y * 0.015 - t * 0.7);
    return half4(0.2, 0.7 + n * 0.3, 0.5, 0.6);
  }
`);
```

**Decision:** Skia is our 2D + shader layer. It does *not* replace r3f for
3D. The two coexist: r3f `<Canvas>` underneath, Skia `<Canvas>` on top.

---

### 3. expo-three (bare, no r3f)

**Status.** Maintained but quiet. Evan Bacon (Expo lead) authored it;
updates are infrequent because three.js + expo-gl + a small loader layer is
all it really needs to be.
([expo/expo-three](https://github.com/expo/expo-three))

**When to use it directly:** if you want imperative three.js code (you
already know three.js, prefer `scene.add(mesh)` to JSX). For Astra Vault we
recommend r3f on top — it gives us hooks, suspense for async assets, and
React reconciliation for diffing the celestial catalog into meshes.

**Caveat 🚨:** there have been recurring patches to keep expo-three in sync
with three's breaking releases (r150 → r155 dropped legacy lights; r160
changed Color management). When upgrading Expo SDK, always re-pin three.js
to the exact version expo-three's package.json lists. Don't `latest` it.

---

### 4. Filament + react-native-filament

**Status.** `react-native-filament` is a community wrapper around Google's
Filament PBR engine (used in Google Maps, Sceneform). Active development
2024–2026 but small ecosystem.
([Margelo react-native-filament](https://github.com/margelo/react-native-filament))

**Pros**
- Best mobile PBR on the market. Physically accurate rendering, IBL,
  screen-space reflections, MSAA — Filament outputs better-looking glb/gltf
  than three.js on mobile.
- C++ core, FFI bindings via JSI — very fast.

**Cons 🚨**
- **No web target.** Filament has a wasm build but the React Native wrapper
  doesn't expose it. Web bundle would need an entirely separate renderer →
  doubling our maintenance burden.
- API is imperative, not declarative. Doesn't match r3f's React-first model.
- Smaller community → fewer Stack Overflow answers, fewer drei equivalents.
- Asset pipeline is Filament-specific `.filamesh` / `.filamat`. We'd lose
  the ability to drop glTF files from Sketchfab directly.

**Verdict:** reject for primary, revisit for a *hero render* mode (one
specific high-fidelity planet view in landscape detail screen). Not worth
the dual-renderer cost for the entire app.

---

### 5. Babylon.js Native

**Status.** Babylon Native is a C++ host that runs Babylon.js JavaScript via
a native JS engine, embedded in iOS/Android apps.
([BabylonJS/BabylonNative](https://github.com/BabylonJS/BabylonNative))

**Verdict 🚨:** integration with React Native is community-driven and
unstable. Bundle size is large. Babylon.js itself is excellent on web but on
RN it's a worse fit than r3f. **Reject.**

---

### 6. WebGPU on Expo / RN (`react-native-wgpu`)

**Status (early 2026).** Software Mansion shipped `react-native-wgpu`
(experimental) wrapping Dawn (Chrome's WebGPU implementation) for iOS +
Android. Three.js has a WebGPURenderer (still labeled "experimental" in
r170). Safari 18 ships WebGPU; Chrome ships WebGPU on Android.
**[VERIFY]** ecosystem maturity at install time.
([software-mansion/react-native-wgpu](https://github.com/software-mansion/react-native-wgpu))

**Why we don't pick it as primary in 2026**
- API breakages every minor release.
- Three.js WebGPU path is missing some features (post-processing pipeline
  partial).
- iOS WebGPU on RN ships fine but Dawn binary adds ~8 MB to the IPA.

**Why we track it**
- 2027 it likely becomes the right answer. r3f has a `WebGPURenderer`
  switch — when stable, we flip one prop. Architectural commitment to r3f
  pays dividends here.

---

### 7. Reanimated 4 + Worklets

**Status.** Reanimated 4 ships rewritten worklet runtime + CSS-like
animation API. Worklets run on the UI thread (or the worklet thread on web).
We already use Reanimated 3.16 in CelestialCanvas. Upgrading to 4 is on the
roadmap regardless.
([Software Mansion Reanimated](https://docs.swmansion.com/react-native-reanimated/))

**What it can do:** drive properties on Skia canvases at native speed, drive
RN view transforms at native speed, run pure-JS computations on the UI
thread without bridge cost.

**What it can't do:** drive three.js / r3f scene objects directly. r3f's
`useFrame` runs on the JS thread. So worklets are an *adjacent* tool — they
own UI motion, not 3D motion.

**Limit to know:** worklet code can't import most npm packages (no
filesystem, no `Date.now` quirks fixed but watch the spec). Worklet bundle
size adds to JS load.

---

### 8. "Expo Skia 3D" experimental

**Reality check.** There is no official "Expo Skia 3D" engine. Skia has
matrix4 transforms (`Skia.Matrix.translate(...)`, etc.) and that's marketed
in tutorials as "3D" — it's not. There is no depth buffer, no lighting, no
mesh. Anything that needs a real 3D scene → r3f.

---

## Asset Source Map

What we use for what.

### Planet surface textures
- **Solar System Scope** — 2K/4K/8K texture maps for Sun, Mercury, Venus,
  Earth (day/night/clouds/normal/specular), Moon, Mars, Jupiter, Saturn
  (+rings), Uranus, Neptune, Pluto. **CC-BY 4.0**. Attribution required, in
  the colophon. **This is our default.** ([solarsystemscope.com/textures](https://www.solarsystemscope.com/textures/))
- **NASA 3D Resources** — official NASA mesh + texture library for
  spacecraft (Voyager, JWST, ISS, Curiosity, Perseverance). Public domain.
  Use these for "spacecraft mode" tiles.
  ([nasa3d.arc.nasa.gov](https://nasa3d.arc.nasa.gov/))
- **USGS Astrogeology** — high-res DEMs and texture maps for the Moon and
  Mars from real mission data. Heavy (multi-GB) but downsampled to 4K is
  perfect for hero shots. ([astrogeology.usgs.gov](https://astrogeology.usgs.gov/))

### Deep-sky imagery (for billboarded 2D, sphere-mapped, or splatted)
- **Hubble Legacy Archive (HLA)** — full Hubble back-catalog. Public
  domain. ([hla.stsci.edu](https://hla.stsci.edu/))
- **JWST MAST** — Webb images, public after proprietary period.
  ([mast.stsci.edu](https://mast.stsci.edu/portal/Mashup/Clients/Mast/Portal.html))
- **ESA/Hubble** — same data, sometimes better-processed mosaics.
  ([esahubble.org](https://esahubble.org/))
- **APOD archive** — already in our roadmap. Permission is per-image
  (mostly free with credit, occasionally licensed).

### Star catalog (for the point-cloud sphere)
- **Gaia DR3** — 1.8 billion stars. We will *never* render all of them on a
  phone. Strategy: pre-bake into LOD tiles, ship Mag ≤ 6 (~9,000 stars)
  embedded, stream Mag 6–10 (~2M stars) as compressed tiles.
  ([ESA Gaia Archive](https://gea.esac.esa.int/archive/))
- **Hipparcos / Tycho-2** — older but smaller. Hipparcos = 118K stars,
  fits in ~2 MB binary. Reasonable embedded baseline.
- **YBSC (Yale Bright Star Catalogue)** — 9,110 stars, mag ≤ 6.5, ~200 KB.
  The right embedded default.

### Constellation art
- **Stellarium constellation art** (CC-BY-SA) for classical Western
  figures. ([github.com/Stellarium/stellarium-data](https://github.com/Stellarium/stellarium-data))
- **GenAI for cultural variants.** This is patentable territory 🟢 — we
  could ship Polynesian, Aboriginal Australian, Lakota, Chinese, Inuit
  constellation art rendered consistently with our app aesthetic. Use
  Midjourney/Flux for the hero art, then license-clear it. Caveat: vet for
  cultural appropriation; consult communities.

### 3D models for spacecraft and large telescopes
- **Sketchfab** — many CC-BY models of telescopes, spacecraft, asteroids.
  Filter by license. ([sketchfab.com](https://sketchfab.com/))
- **Poly Haven** for HDRI lighting (skybox lighting for hero planet
  shots). ([polyhaven.com](https://polyhaven.com/))

### GenAI 3D from text/image (when no real asset exists)
| Service | Type | Quality (2026) | Licensing | API |
|---|---|---|---|---|
| **Meshy AI** | text→3D, image→3D | very good, AAA-tier glb output | per-tier, commercial OK on paid plans | REST API |
| **Luma AI Genie** | text→3D | great for stylized | commercial OK on paid | API |
| **Stable Zero123** | image→3D (open) | medium, free | open weights | self-host |
| **Wonder3D** | single image→3D | medium | open weights | self-host |
| **TripoSR** | single image→3D (fast) | medium, sub-second | open, MIT | self-host, runs on 1× T4 |
| **Tencent Hunyuan3D-2** | image→3D | very good, open | open weights, non-commercial caveats — read license | self-host |
| **Polycam / KIRI Engine / RealityScan** | photo capture→3D (mobile) | great for physical objects | per-app | mobile-first |

**Astra Vault picks:**
- **Meshy AI** for ship-ready commercial 3D when budget allows (~$0.20/model).
- **Hunyuan3D-2 self-hosted** as the backup, runs on a single A100 in
  ~30 seconds per model. ([Tencent/Hunyuan3D-2](https://github.com/Tencent/Hunyuan3D-2))
- **TripoSR** for the fast path — when a user submits a sparse capture and
  we need a "preview mesh" in <5 s while the splat pipeline runs in
  background. ([VAST-AI-Research/TripoSR](https://github.com/VAST-AI-Research/TripoSR))

### Specific "this object → use this asset"

| Object | Asset source |
|---|---|
| Sun, Mercury–Neptune | Solar System Scope textures + r3f Sphere |
| Moon | USGS DEM + Solar System Scope textures (PBR shader) |
| Pluto, Ceres, Vesta | NASA 3D Resources mesh |
| ISS, Hubble, JWST, Voyager | NASA 3D Resources mesh |
| Mars rovers | NASA 3D Resources mesh |
| Andromeda, Orion Nebula, Crab Nebula | Hubble Legacy → billboard, then upgrade to 3DGS in Phase 3 |
| Comets (Halley, Bernardinelli-B.) | TripoSR from one good image |
| Asteroids (Bennu, Ryugu) | NASA 3D Resources mesh from OSIRIS-REx/Hayabusa-2 |
| Generic exoplanet renders | Meshy AI text-to-3D, prompted from spectral type |
| Constellation figures | Stellarium constellation art (Western) + GenAI (cultural variants) |

---

## Reconstruction Pipelines

The big ask: **replay a meteor in 3D from multi-observer triangulation.** And
secondary: turn N photos of a deep-sky object into a flythrough.

### Option A: Photogrammetry (RealityScan / RealityCapture / Polycam)

- **What it is.** Structure-from-motion + multi-view stereo. Outputs a
  textured triangle mesh.
- **Pros.** Mature. RealityScan SDK accepts mobile photos. Mesh is easy to
  ship.
- **Cons for meteor capture 🚨.** Meteors are transient, not solid. SfM
  assumes a stationary object photographed from multiple angles. A meteor
  is the opposite. SfM is the wrong tool for the meteor case.

Use photogrammetry for **physical specimens** (recovered meteorite fragments,
museum displays) — secondary content type, not the headline.

### Option B: NeRF (Instant NGP, Nerfstudio)

- **What it is.** Neural radiance field — train an MLP to predict color +
  density at any (x, y, z, view) coord, render via raymarching.
- **Pros.** Beautiful, view-consistent.
- **Cons.** Train time on consumer GPU: 5–30 minutes for Instant NGP. Render
  time: 100ms/frame at 1080p on an A100. **Not realtime on phones without
  baking.**
- **Bake path.** Nerfstudio exports to mesh + texture, but quality drops
  hard. Or export to "MobileNeRF" / "SNeRG" — better but heavyweight.
  ([Nerfstudio](https://docs.nerf.studio/), [Instant NGP](https://github.com/NVlabs/instant-ngp))
- **Verdict.** Educational use; not the production pipeline.

### Option C: 3D Gaussian Splatting (3DGS) — **chosen primary**

- **What it is.** Represents a scene as millions of 3D Gaussians (position,
  covariance, color, alpha), rasterized per-frame. Trains in 5–30 minutes
  for a typical scene; renders at 60+ fps on a mid-range GPU.
  ([INRIA paper site](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/))
- **Why it wins for us**
  - Trains fast enough for Cloud Function jobs (RunPod 1× A100, ~$0.10 per
    meteor reconstruction).
  - Renders fast enough for mobile via `@pmndrs/react-three-gaussian-splat`
    or the WebGPU-based `gsplat.js`.
    ([pmndrs/react-three-gaussian-splat](https://github.com/pmndrs/react-three-gaussian-splat),
    [gsplat.js](https://github.com/huggingface/gsplat.js))
  - Handles transient/glowing objects (meteor trails!) better than NeRF
    because gaussians can be emissive, not just reflective.
  - Output is a `.splat` or `.ply`, ~10–80 MB per scene. CDN-cacheable.
- **Variants to track**
  - **Mip-Splatting** — anti-aliased, ships in r3f via the same renderer.
  - **2D Gaussian Splatting (2DGS)** — better geometry. Trade-off:
    rendering more expensive.
  - **SuperSplat** by PlayCanvas — editor for cleaning up splats.
    ([playcanvas/supersplat](https://github.com/playcanvas/supersplat))
- **Constraint 🚨.** Mobile rendering of 5M+ gaussian splats is heavy. Plan
  for splat decimation (10–30% retention) on phones; full quality on
  desktop web only.

### Option D: Single-image → 3D (sparse-capture path)

When a user submits **one frame** of a meteor or one APOD-style nebula
image, we can't do SfM/NeRF/3DGS. Pipeline:

1. **Hunyuan3D-2** generates a textured mesh from the image. Quality is
   medium but acceptable for the "preview" tile.
2. **TripoSR** runs in parallel for a faster but lower-quality fallback
   (<5 s vs. ~30 s).
3. User sees "preview mesh now, splat coming" — gamified loading.

### The Meteor Reconstruction Algorithm (our 🟢 patentable bit)

This is the headline novel pipeline. Sketch:

1. **Inputs.** N observers, each with: timestamped frames, lat/lng/alt,
   compass bearing, gyro elevation angle (already in our `MeteorEvent`
   schema).
2. **Sync.** Cluster by timestamp (±2 s). At least 2 observers required for
   triangulation; 3+ for height + speed.
3. **Sky → world rays.** For each observer at each frame, convert the
   bearing/elevation into a unit ray in ENU coords, then to ECEF, then to
   a common WGS84 frame.
4. **Closest-point triangulation.** For each timestamp, find the 3D point
   minimizing sum-of-squared distances to observer rays. This is the
   meteor's position at that time. Standard linear least-squares.
5. **Trajectory fit.** Fit a parametric curve (cubic Bezier or piecewise
   linear) through the per-frame points. Now we have a 3D trajectory in
   space.
6. **Visual render.** In r3f: a `<Line>` along the trajectory; a
   `<InstancedMesh>` of glowing quads along the line with additive blending
   for the bright head; a custom emissive shader for the trail. Optionally
   layer 3DGS reconstruction of the *background sky* (using submitted
   frames) so the meteor flies across a real 3DGS-reconstructed sky.
7. **Cross-reference.** Compare derived orbit (Tisserand parameter,
   inclination) against CAMS/AMS catalogs — match to shower.

🟢 **Patentable opportunity:** the combination of (a) crowdsourced phone
captures with compass/gyro/timestamp metadata, (b) least-squares
triangulation to a parametric 3D trajectory, (c) 3DGS reconstruction of the
shared sky backdrop from the same submissions, (d) emissive shader rendering
of the meteor head along the trajectory inside r3f, (e) emission of an
attention hash per multi-observer match. That stack — particularly the
sky-backdrop-from-the-same-submissions piece — is novel.

---

## Star Sphere Rendering — Performance Bounds

How many stars can we draw on a phone?

| Method | iPhone 13 @ 60 fps | Pixel 7 @ 60 fps | Mid-range Android @ 60 fps |
|---|---|---|---|
| SVG circles (current SVG canvas) | ~300 | ~250 | ~150 |
| react-native-skia points | ~5,000 | ~4,000 | ~2,000 |
| three.js Points (BufferGeometry) | ~500,000 | ~400,000 | ~150,000 |
| three.js Points + custom vert shader | ~1,000,000 | ~800,000 | ~300,000 |
| three.js InstancedMesh quads (textured) | ~50,000 | ~40,000 | ~20,000 |

These are estimates from typical three.js benchmarks at the cutoff. **[VERIFY]
in-app once we ship r3f-native to native devices.**

**Strategy: LOD tiles, à la WorldWide Telescope.**

- **L0 (always loaded):** YBSC, 9,110 stars, mag ≤ 6.5. ~200 KB binary.
  Embedded in app bundle.
- **L1 (load on demand):** Tycho-2 down to mag 11, ~2.5M stars. Tiled by
  HEALPix at NSIDE=64 (~50K pixels). Each tile ~10–50 KB compressed
  (Float16 positions, uint8 magnitude, uint8 color index). User downloads
  the ~12 tiles visible at current camera angle.
- **L2 (web only, desktop-class):** Gaia DR3 subset to mag 15, ~100M stars.
  Streamed from CDN.
- **L3 (never):** full Gaia DR3, 1.8B. Reserved for "data view" feature, not
  rendering.

**HEALPix** is the standard for celestial tiling — same scheme as Aladin Lite,
NASA SkyView, Stellarium. ([HEALPix](https://healpix.sourceforge.io/),
[Aladin Lite](https://aladin.cds.unistra.fr/AladinLite/))

**Rendering technique.** GL_POINTS with custom vertex shader that:
- Sizes the point by `1 / max(magnitude, 0.5)` (brighter = bigger).
- Colors by B-V index → RGB via lookup texture.
- Adds twinkling via per-star phase offset (uniform `uTime`).
- Optionally swaps to instanced quads when zoomed in past mag-3 stars (for
  pretty glow halos around bright stars).

Existing OSS to learn from / borrow:
- **Three.js stars example** — basic, no LOD. ([threejs.org/examples](https://threejs.org/examples/?q=stars))
- **A-Frame Stars** — VR-aware. ([github.com/aframevr/aframe](https://github.com/aframevr/aframe))
- **Celestia** desktop app — gold standard for star catalog rendering (C++).
  ([celestiaproject.space](https://celestiaproject.space/))
- **Aladin Lite v3** — HEALPix tile streaming, web-only.
  ([github.com/cds-astro/aladin-lite](https://github.com/cds-astro/aladin-lite))
- **WebGL Earth** — geospatial tiling primitives we can adapt.

**Cesium** is geospatial-Earth-focused (terrain tiling, vector tiling on
spheres). It's overkill for stars and underbuilt for celestial coordinate
systems. **Reject** as primary; cherry-pick the tile-streaming patterns.

---

## Performance Reality Check

### Targets (per device tier)

| Tier | Devices | Scenario | Target |
|---|---|---|---|
| Hero | iPhone 14 Pro+, Pixel 8 Pro, M-series iPad | Full r3f scene, 100K stars + textured planet + bloom | 60 fps |
| Standard | iPhone 12–13, Pixel 6–7 | 30K stars + planet, no bloom | 60 fps |
| Floor | iPhone X, Pixel 4a, $200 Android | YBSC 9K stars, sphere skybox, no PBR | 45 fps minimum |
| Web (PWA) | Chrome desktop | Full scene + post-processing | 60 fps |
| Web (mobile Safari) | Safari iOS | Standard tier | 45–60 fps |

### Memory budgets

- **Texture budget per scene:** 200 MB total GPU memory. Translates to:
  - 1× 8K planet (256 MB uncompressed → ~64 MB BC7) — ship only on Hero.
  - 1× 4K planet (16 MB ASTC) — Standard tier default.
  - 1× 2K planet (4 MB ETC2) — Floor tier.
- **Star catalog memory:** L0+L1 ~30 MB GPU buffer (positions + magnitudes
  + colors for 2.5M stars in Float16/uint8).
- **Splat memory:** budget 80 MB per loaded splat scene. Decimate
  proactively.

### WebGL vs. native GL

PWA performance on iOS Safari is the bottleneck. As of Safari 17.2+ WebGL2
is solid, and Safari 18 ships WebGPU behind a flag. Expect:
- iOS Safari WebGL2: ~70% of native expo-gl perf.
- Android Chrome WebGL2: ~85% of native expo-gl perf.
- Desktop Chrome WebGL2: ~95% of native.
- WebGPU (Chrome desktop, Safari 18 flag): ~110–130% of WebGL2.

**Implication:** the PWA gets the same engine but a Standard-tier
configuration regardless of underlying hardware, until we audit per-device.

### Bundle size pressure

- r3f + three: ~280 KB gzipped → bundle increase from current ~600 KB to
  ~880 KB on web. Acceptable.
- Skia web (CanvasKit WASM): 2.5 MB → **code-split**. Lazy-load only when
  the user hits a Skia-heavy screen.
- Splat viewer: ~30 KB → trivial.

---

## AR / Immersive Roadmap

### Tier 1: WebXR (PWA path)
- **iOS Safari:** WebXR ships limited — `immersive-ar` not supported in
  Safari as of cutoff. Workaround: Mozilla's WebXR Viewer (defunct) or
  WebARonARKit (community). **For iOS AR, fall back to native ARKit.**
- **Android Chrome:** full WebXR `immersive-ar` support. Astra Vault PWA
  could ship AR night-sky overlay on Android out of the box. ✓
- **r3f integration:** `@react-three/xr` package handles WebXR sessions,
  controller events, hit-test. ([pmndrs/xr](https://github.com/pmndrs/xr))

### Tier 2: ARKit via Expo (iOS native)
- **`expo-three-ar`** historically wrapped ARKit; deprecated. Modern path:
  **`react-native-arkit`** community module, or build a thin native module
  with Expo Modules API.
- **Use case:** "point your phone up, see Mars in AR with real position
  overlay." Astra Vault becomes a Sky Guide-style app with our own data
  and the attention protocol.

### Tier 3: visionOS variant
- **Vision Pro shipped Q1 2024.** RN + Expo support is via React Native
  visionOS (Microsoft fork → upstreamed).
  ([react-native-visionos](https://github.com/callstack/react-native-visionos))
- **SwiftUI + RealityKit fallback:** if RN-visionOS feature set is too
  limiting, ship visionOS as a parallel SwiftUI app sharing the Firebase
  vault. Same attention protocol, native RealityKit rendering.
- **Astra Vault on Vision Pro:** "constellation of the night above you,
  pinned to your room" — pinch a star, lore floats out. This is the
  marquee Vision Pro experience for astronomy. 🟢 **Patentable:**
  attention-hash emission per Vision Pro gaze-fixation on a celestial
  object using ARKit's eye-tracking hooks.

### Tier 4: Meta Quest browser
- Quest Browser supports WebXR fully. PWA + WebXR → free Quest support.
- Secondary surface; not a primary investment. Ship via the same PWA build.

### Tier 5: Shared spatial experiences (Hubs / Spatial.io)
- **Mozilla Hubs** is end-of-life; community fork "Hubs Foundation"
  continues. ([hubsfoundation.org](https://hubsfoundation.org/))
- **Spatial.io** has a JS SDK. Could ship Astra Vault as a "world" — but
  Director rule: no DMs / direct user-to-user interaction. Spatial.io
  rooms have voice + presence by default — would violate the privacy
  principle. **Skip.**
- **Our own** "Shared Sky Room" — anonymous presence dots in 3D space,
  no audio, no identifiers. Built on Firestore + r3f. Matches the
  privacy rules. Would-be patentable 🟢 if shipped: anonymous presence
  via attention-hash crowd-fingerprints rather than session IDs.

---

## Build Phases

### Phase 1 (current — already shipped) ✓
- SVG `CelestialCanvas` (2D, drag-pan, 28 objects).
- Reanimated 3 reticle + Star background.
- Web-verified, native-touch-system based.
- **Keep this** as the universal fallback when GL is unavailable or
  the device is on Floor tier.

### Phase 2 — r3f web + native, textured planets (Q3 2026)
- Install `@react-three/fiber`, `@react-three/drei`, `three`, `expo-gl`,
  `expo-three`, `expo-asset`.
- Build `<SkySphere>` component using r3f-native + r3f-web subpaths.
- Wrap behind a feature flag — `gl_renderer: 'r3f' | 'svg'`. Default
  to SVG on Floor-tier device check, r3f otherwise.
- Replace `object/[id].tsx` hero image with a textured planet for
  planets, sphere-mapped Hubble image for nebulae/galaxies.
- Ship `<Sphere>` + Solar System Scope textures for the 9 planets.
- Embedded star catalog: YBSC 9K stars on the celestial sphere.
- Add `<OrbitControls>` for rotate/zoom. Keep SVG scanner for the main
  Scan tab; the 3D view is invoked from object detail.

### Phase 3 — Reconstruction pipeline (Q4 2026)
- Backend: Firebase Cloud Function triggers a RunPod / Modal job on new
  meteor capture batches.
- Job: cluster captures by timestamp, run triangulation, emit
  trajectory JSON + optional 3DGS reconstruction of the sky backdrop.
- Frontend: r3f scene that loads trajectory + splat, plays the meteor
  forward.
- Single-image fallback: TripoSR / Hunyuan3D-2 self-host on the same
  RunPod, emits `.glb` preview meshes.
- Star catalog L1 tile streaming kicks in: HEALPix tile fetcher service.

### Phase 4 — AR + immersive (2027)
- **iOS:** custom Expo Module wrapping ARKit, sharing the r3f scene via
  textured-render-target trick.
- **Android:** WebXR via `@react-three/xr`.
- **visionOS:** parallel app via react-native-visionos OR a SwiftUI sibling.
- **Quest browser:** falls out for free from the PWA WebXR path.

### Phase 5 — WebGPU migration (2027–2028)
- Switch r3f renderer prop to WebGPU once `react-native-wgpu` stabilizes.
- Recompile shaders to WGSL where needed.
- Gain ~30% perf headroom; enable more L1 tiles or higher-density splats.

---

## Open Questions

1. **expo-gl memory leaks on iOS 18?** Need to repro on a real device.
   The community has reported texture-leak issues when destroying scenes.
   Mitigation strategy: single root `<Canvas>`, swap children, never
   unmount the GL context. **Verify when we ship Phase 2.**

2. **Should the SVG `CelestialCanvas` survive Phase 2?** Arguments for
   keeping: PWA on low-end Android, accessibility (SVG is screen-reader
   navigable), faster cold start. Arguments for retiring: maintenance
   cost of two renderers. **Recommendation:** keep for Floor tier only.

3. **Splat licensing.** If a user submits photos and we train a 3DGS,
   who owns the splat? Director rule: **user owns their submissions, we
   own the reconstruction.** Need ToS clause. The attention hash event
   `meteor_capture` should imply consent to reconstruction.

4. **Vision Pro SKU or Vision Pro feature?** Selling a separate
   visionOS app at $4.99 vs. universal free is a business call.
   Recommendation: free, same Firebase vault, monetization via Pi/ATP.

5. **GenAI for cultural constellations — vetting process?** Need an
   advisory board of cultural consultants before shipping non-Western
   constellation art. Budget item.

6. **What's our acceptable cold-start cost on web for r3f?** Currently
   the site is ~600 KB gzipped. Adding three+r3f brings us to ~880 KB.
   Lighthouse threshold for "Good" mobile is ~1.6 MB. We're fine, but
   need to lazy-load the Skia WASM separately.

7. **CAMS / AMS API rate limits + ToS for meteor cross-ref.**
   Architectural assumption is we hit these; need to confirm we can do
   so server-side from a Cloud Function with attribution.

8. **Real-time multi-observer meteor matching: how many users
   simultaneously?** The triangulation math is cheap; the bottleneck is
   *finding the matches*. Need a Firestore query strategy or a Cloud
   Function pub/sub over timestamps.

9. **Patent strategy.** Stephen — should we file provisional patents on
   the items flagged 🟢 above before this code lands in production?
   Especially the meteor reconstruction pipeline and the attention-hash
   ↔ camera-dwell binding. (Both are at most "weeks of work" for a
   competitor to copy if we publicize without filing.)

10. **Reanimated 4 upgrade timing.** Tied to Expo SDK upgrade. Worklet
    rewrites of CelestialCanvas reticle motion should land alongside
    the SDK bump.

---

## Cited references (canonical, stable URLs)

**Engines and bindings**
- react-three-fiber: https://github.com/pmndrs/react-three-fiber
- r3f native docs: https://docs.pmnd.rs/react-three-fiber/getting-started/installation
- expo-three: https://github.com/expo/expo-three
- expo-gl: https://docs.expo.dev/versions/latest/sdk/gl-view/
- @shopify/react-native-skia: https://shopify.github.io/react-native-skia/
- react-native-filament (Margelo): https://github.com/margelo/react-native-filament
- Babylon Native: https://github.com/BabylonJS/BabylonNative
- react-native-wgpu (Software Mansion): https://github.com/software-mansion/react-native-wgpu
- Reanimated: https://docs.swmansion.com/react-native-reanimated/

**Reconstruction**
- INRIA 3DGS paper: https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/
- pmndrs gaussian splat viewer: https://github.com/pmndrs/react-three-gaussian-splat
- gsplat.js: https://github.com/huggingface/gsplat.js
- SuperSplat editor: https://github.com/playcanvas/supersplat
- Nerfstudio: https://docs.nerf.studio/
- Instant NGP: https://github.com/NVlabs/instant-ngp
- TripoSR: https://github.com/VAST-AI-Research/TripoSR
- Tencent Hunyuan3D-2: https://github.com/Tencent/Hunyuan3D-2

**Astronomy data**
- Solar System Scope textures: https://www.solarsystemscope.com/textures/
- NASA 3D Resources: https://nasa3d.arc.nasa.gov/
- USGS Astrogeology: https://astrogeology.usgs.gov/
- ESA Gaia archive: https://gea.esac.esa.int/archive/
- Hubble Legacy Archive: https://hla.stsci.edu/
- ESA/Hubble: https://esahubble.org/
- MAST (JWST): https://mast.stsci.edu/portal/Mashup/Clients/Mast/Portal.html
- HEALPix: https://healpix.sourceforge.io/
- Aladin Lite v3: https://github.com/cds-astro/aladin-lite

**XR / immersive**
- @react-three/xr: https://github.com/pmndrs/xr
- react-native-visionos: https://github.com/callstack/react-native-visionos
- Hubs Foundation: https://hubsfoundation.org/

**Reference astronomy renderers**
- Stellarium Web Engine: https://github.com/Stellarium/stellarium-web-engine
- NASA Eyes: https://eyes.nasa.gov/
- Solar System Scope app: https://www.solarsystemscope.com/
- Celestia: https://celestiaproject.space/
- three.js examples: https://threejs.org/examples/

---

## Summary table for handoff

| Decision | Choice | Reason |
|---|---|---|
| Primary 3D engine | react-three-fiber (`/native` + web) | One JSX tree, three platforms, ecosystem, types |
| 2D / shader layer | @shopify/react-native-skia | GPU-accelerated, Reanimated-bonded, SkSL shaders |
| Asset format | glTF/GLB + KTX2/BasisU textures | Universal, compressed, three-loadable |
| Planet textures | Solar System Scope (CC-BY) | Best free 8K Solar System textures available |
| Star catalog | YBSC embedded, Tycho-2 streamed, Gaia DR3 (desktop) | LOD tiling via HEALPix |
| Reconstruction | 3D Gaussian Splatting (3DGS) | Fast train, fast render, ships to phones via r3f |
| Single-image fallback | Hunyuan3D-2 + TripoSR | Open weights, self-host on RunPod |
| AR (Android) | WebXR via @react-three/xr | Free with PWA |
| AR (iOS) | Native ARKit module | Safari WebXR insufficient |
| visionOS | Phase 4, react-native-visionos | Eye-tracking attention hash novelty |
| Engines rejected | Filament, Babylon Native, raw WebGPU | No web target / immature / dual-renderer cost |

---

RESEARCH COMPLETE — 3d-visualization.md written. Recommended primary engine: react-three-fiber (`/native` + web) backed by expo-gl/expo-three on mobile and react-three-fiber on web, with @shopify/react-native-skia as the 2D/shader overlay layer. Reconstruction path: 3D Gaussian Splatting (3DGS) via @pmndrs/react-three-gaussian-splat, with Hunyuan3D-2 + TripoSR as the single-image fallback.
