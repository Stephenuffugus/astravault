# ASTRA VAULT — BUILD STATUS

**Session 1 (2026-05-13):** Foundation + 5 screens shipped.
46 TypeScript files, 4,553 lines, clean typecheck, clean web export.

---

## How to run

```bash
npm install                 # if you haven't already
npm run web                 # dev server with hot reload, opens at http://localhost:8081
# or
npm run android             # requires Android emulator or device with Expo Go
npm run ios                 # requires iOS Simulator (macOS only)
npx expo export --platform web   # production web bundle into ./dist
npm run typecheck           # tsc --noEmit
```

The dev server hot-reloads on file save. On first launch the app routes through `app/onboarding.tsx`; subsequent launches go straight to the Hub tab. Onboarding state lives in `AsyncStorage` under `astravault:onboarded_v1` — clear it via your browser devtools (Application → Storage) to re-trigger.

---

## What shipped — Session 1

### Foundation
- **Expo SDK 52** + expo-router v4, React Native 0.76, TypeScript strict + `noUncheckedIndexedAccess`
- `app.json` configured: iOS/Android bundle IDs, camera/mic/location usage strings ready for the meteor-capture phase, dark UI lock
- Three Google Font families loaded at root: Crimson Pro, DM Mono, Playfair Display
- React Navigation + safe area + gesture handler wired
- Web, iOS, and Android targets all build (web verified clean this session)

### Design system (`theme/tokens.ts`)
Canonical port of `DESIGN_TOKENS.md` — every color, font family, spacing, radius, and motion value the v5 prototype used. Imported app-wide as `@/theme/tokens`.

### Data layer (`data/`)
- `catalog.ts` — 28 celestial objects with full metadata (RA/Dec, magnitude, spectral color, rarity, lore)
- `academy.ts` — 6 learning paths × 4 lessons = 24 lessons, each with a 4-answer quiz
- `events2026.ts` — 15 celestial events for 2026, with `nextEvent()` helper

### Services (`services/`)
- **`astro/`** — Julian date conversion, Meeus moon-phase, sunrise/twilight, observing-score, Bortle estimator, RA/Dec formatters
- **`attention/`** — full SHA-256 attention-hash pipeline per `ATTENTION_PROTOCOL_SPEC-1.md`:
  - 9-field payload, alphabetic-key serialization, `expo-crypto` SHA-256
  - Registered event types from `ARCHITECTURE.md`
  - Focus-score weighting + hash multipliers per quality tier
  - `vaultSync.ts` persists hashes to AsyncStorage (Firestore sync = future task)
  - `emitAttentionEvent()` is the one-call helper screens use

### State (`stores/` — Zustand)
- `useAtp` — ATP balance with `earn()` that emits attention hashes through the protocol
- `useCollection` — collected-object record; `collect()` auto-earns ATP via the protocol
- `useAcademy` — completed-lesson record; `completeLesson()` auto-earns ATP
- `useEvents` — tracked-event record
- `useToast` — global toast queue
- `hydrateAllStores()` rehydrates from AsyncStorage at app boot

### UI primitives (`components/common/`)
Card, RarityCard, SectionLabel, AtpBadge, Badge, ProgressBar (with gradient mode), Toast (Reanimated slide-down), Pill — all typed, all tokenized.

### Sky rendering (`components/sky/`)
- **`StarField`** — 180-dot animated background, single shared-value driver, web-safe (no canvas)
- **`CelestialCanvas`** — the headline scanner. SVG-based, RA/Dec projection, drag-to-pan, tap-to-select, glow gradients per object, dashed rarity ring on collected items, breathing reticle, live coordinates readout

### Screens (`app/`)
- `_layout.tsx` — root: font loader, store hydration, StarField background, Toast, navigation stack
- `index.tsx` — boot router → onboarding (first run) or hub (returning)
- `onboarding.tsx` — 4-feature intro screen with BEGIN button
- `(tabs)/_layout.tsx` — 5-tab nav with header (logo + ATP badge + academy progress)
- `(tabs)/hub.tsx` — Discovery Hub: conditions, moon, APOD stub, next event, ISS stub, timer
- `(tabs)/scan.tsx` — Sky Scanner host + object inspect modal with collect action
- `(tabs)/vault.tsx` — Collection grid with rarity + category filters and per-category set progress
- `(tabs)/shared-sky.tsx` — Community panel: observers count, discovery feed, missions, regional heatmap, trending, lifetime stats
- `(tabs)/learn.tsx` — Path index, navigates to next uncompleted lesson
- `lesson/[id].tsx` — Lesson body + quiz with check-answer flow
- `object/[id].tsx` — Object detail with coordinates, data table, collect action

---

## What's deferred — next sessions

### Phase 2: Live data
- **APOD** — `services/apis/nasaApod.ts` — NASA Astronomy Picture of the Day fetch + cache
- **ISS Tracker** — `services/apis/issTracker.ts` — Open Notify position + next-pass prediction
- **JPL Horizons** — real-time planet positions, replacing the static RA/Dec in catalog
- **SkyView** — multi-wavelength telescope images on object detail
- **DONKI** — space weather / aurora alerts
- Cache layer in Firestore (`cache/` per ARCHITECTURE.md) to respect NASA rate limits

### Phase 3: Native sensors + meteor capture (the patent-novel feature)
- `services/meteor/captureEngine.ts` — voice trigger ("METEOR"), gesture trigger, auto-detect
- `expo-camera` + `expo-av` permissions wiring (Info.plist strings already set)
- Frame buffer recording in low-power mode
- Geotag + millisecond timestamp + compass bearing + gyroscope angle
- `services/meteor/crossReference.ts` — query CAMS network data, AMS fireball reports, time-synced public photos, other Astra Vault users
- Meteor Story Page composer

### Phase 4: Cloud
- Firebase project wiring (`focus-grove-fffa8`) — Auth, Firestore vault sync, Storage for meteor images
- Cloud Functions for cross-user meteor matching + Shared Sky aggregate updates
- Real `vaults/{uid}/hashes` sync (currently AsyncStorage-only)
- Replace `MOCK_SHARED_SKY` data in `shared-sky.tsx` with live Cloud Function reads

### Phase 5: Smart glasses + Pi
- Ray-Ban Meta SDK exploration (Tier 1: 7M installed base)
- Android XR / Gemini integration
- Pi Network SDK for real token economics

---

## Architectural decisions worth remembering

1. **SVG over Canvas for the sky scanner.** React Native has no canvas; `react-native-svg` is portable to web + iOS + Android and renders the v5 prototype's look with full vector fidelity. If perf becomes an issue at scale (1000+ objects), reach for `@shopify/react-native-skia`.

2. **Attention hashes via `expo-crypto`'s `digestStringAsync`** — works on every platform including web, no JS-SHA polyfill needed.

3. **AsyncStorage as the local vault** — kept the API surface compatible with the future Firestore migration. The `synced: false` flag on every record means cloud sync becomes a one-shot batch upload when Firebase lands.

4. **Tokens are typed-const, not class-based.** Importing `colors.accent.gold` gives literal types — no possibility of accidentally passing a non-token color where one is required.

5. **One ATP earn pathway.** Every store that grants ATP calls `useAtp.earn()`, which always emits an attention hash through the protocol. No back-doors. This is the Director's "hash balance lives in the vault, not the app" invariant in code.

6. **Onboarding routing is intentional.** `app/index.tsx` reads the onboard flag before deciding the destination, so the splash → onboarding → hub flow stays declarative through expo-router redirects rather than imperative navigation.

---

## Known caveats

- **`expo-linear-gradient@^55`** was auto-installed by the UI-primitives subagent. The Expo SDK 52-aligned version is `~14.0.x`. The current install works for web; on native it may complain — run `npx expo install --check` and let it pin to the right version when you set up native simulators.
- **Hub APOD + ISS cards are stubs.** They display "coming soon" placeholders so the visual hierarchy is right, but no real API fetch happens yet.
- **No real Firebase auth.** `user_uid` in every attention hash is currently the literal string `"anonymous"`. Once Auth is wired, call `setUidProvider(() => auth.currentUser.uid)` from `services/attention` at app start.
- **Web only verified.** iOS/Android haven't been simulator-tested this session. Touch responder on `CelestialCanvas` uses cross-platform RN responder system, but a hands-on pass is recommended before shipping.

---

## File layout

```
astra-vault/
├── app/                          (12 route files — expo-router)
├── components/
│   ├── common/    (8 primitives + index barrel)
│   └── sky/       (StarField, CelestialCanvas)
├── data/          (catalog, academy, events2026)
├── services/
│   ├── astro/     (julian, moonPhase, sunTimes, observingScore, coordinates)
│   └── attention/ (eventRegistry, payloadBuilder, hashPipeline, focusScore, vaultSync, session)
├── stores/        (5 Zustand stores + hydrateAllStores)
├── theme/         (tokens — canonical design system)
├── astra-vault-handoff/   (the original R&D handoff — leave untouched, it's our spec)
├── app.json, package.json, tsconfig.json, babel.config.js, metro.config.js
└── BUILD_STATUS.md  (this file)
```

— Built session 1 of N.
