# ASTRA VAULT — TECHNICAL ARCHITECTURE
## For: Quad Code Production Build

---

## RECOMMENDED STACK

**Framework:** React Native (Expo) or Capacitor + React
- Both support iOS + Android from single codebase
- React Native preferred for native module access (camera, gyroscope, background tasks)
- Expo has excellent camera, location, sensors, notifications packages

**Backend:** Firebase (REQUIRED — shared SWS ecosystem)
- Project: `focus-grove-fffa8`
- Auth: Firebase Anonymous Auth → upgrade to email/Google/Apple
- Database: Firestore at `vaults/{uid}/` (shared vault across all SWS apps)
- Storage: Firebase Storage for meteor capture images
- Functions: Cloud Functions for cross-reference matching, CAMS data sync

**State Management:** Zustand or Jotai (lightweight, React-native friendly)

**Navigation:** React Navigation (tab-based, 4-5 main tabs)

**Animations:** React Native Reanimated + Gesture Handler

**Sky Rendering:** Either:
- React Native Skia (2D canvas, fast, good for star field + scanner)
- Three.js via react-three-fiber (3D celestial sphere, more immersive but heavier)
- GL rendering for the star field, overlay UI in React Native

**APIs:** All REST/JSON, fetched client-side or via Cloud Functions for rate limiting

---

## PROJECT STRUCTURE

```
astra-vault/
├── app/                          # Screens
│   ├── (tabs)/
│   │   ├── hub.tsx              # Discovery Hub (conditions, moon, timer, ISS, APOD)
│   │   ├── scan.tsx             # Sky Scanner (celestial sphere, object interaction)
│   │   ├── vault.tsx            # Collection (rarity filters, set tracking)
│   │   ├── shared-sky.tsx       # Community (observers, feed, goals, heatmap)
│   │   └── learn.tsx            # Academy (paths, lessons, quizzes)
│   ├── onboarding.tsx
│   ├── object/[id].tsx          # Object detail (deep data, MAST history, SkyView images)
│   ├── event/[id].tsx           # Event detail
│   ├── lesson/[id].tsx          # Lesson + quiz
│   └── meteor-capture.tsx       # Meteor capture session
│
├── components/
│   ├── sky/
│   │   ├── StarField.tsx        # Animated background
│   │   ├── CelestialCanvas.tsx  # Main scanner renderer
│   │   ├── Reticle.tsx          # Targeting crosshair
│   │   └── ObjectChip.tsx       # Tappable star label
│   ├── widgets/
│   │   ├── MoonPhase.tsx
│   │   ├── ISSTracker.tsx
│   │   ├── APOD.tsx
│   │   ├── MeteorCounter.tsx
│   │   ├── ObsTimer.tsx
│   │   └── ConditionsDash.tsx
│   ├── shared-sky/
│   │   ├── ObserversCounter.tsx
│   │   ├── DiscoveryFeed.tsx
│   │   ├── CollectiveMissions.tsx
│   │   ├── GlobalHeatmap.tsx
│   │   └── TrendingObjects.tsx
│   ├── academy/
│   │   ├── PathCard.tsx
│   │   ├── LessonView.tsx
│   │   └── QuizView.tsx
│   └── common/
│       ├── Toast.tsx
│       ├── Badge.tsx
│       └── ProgressBar.tsx
│
├── services/
│   ├── attention/
│   │   ├── hashPipeline.ts      # SHA-256 attention hash generation
│   │   ├── payloadBuilder.ts    # 9-field payload construction
│   │   ├── focusScore.ts        # Quality tier classification
│   │   └── vaultSync.ts         # Firestore vault read/write
│   ├── apis/
│   │   ├── jplHorizons.ts       # Planet/asteroid/comet positions
│   │   ├── skyView.ts           # Multi-wavelength sky images
│   │   ├── nasaApod.ts          # Picture of the Day
│   │   ├── issTracker.ts        # Real-time ISS position
│   │   ├── exoplanetArchive.ts  # Exoplanet TAP queries
│   │   ├── jwstApi.ts           # Webb telescope images
│   │   ├── usno.ts              # Moon phases, sun times
│   │   ├── donki.ts             # Space weather / aurora
│   │   ├── cneos.ts             # Near-Earth asteroid approaches
│   │   └── camsNetwork.ts       # Meteor cross-reference
│   ├── meteor/
│   │   ├── captureEngine.ts     # Voice/gesture/auto-detect triggers
│   │   ├── crossReference.ts    # Match against CAMS + other users
│   │   └── storyBuilder.ts      # Compose meteor story page
│   └── astro/
│       ├── moonPhase.ts         # Client-side moon calculation
│       ├── sunTimes.ts          # Sunrise/sunset/twilight
│       ├── coordinates.ts       # RA/Dec conversions
│       └── observingScore.ts    # Bortle + moon + cloud composite
│
├── data/
│   ├── catalog.ts               # 28+ celestial objects with full metadata
│   ├── events2026.ts            # 15 celestial events
│   ├── academy.ts               # 6 paths, 24 lessons, quizzes
│   ├── badges.ts                # 20 achievement definitions
│   └── sharedSky.ts             # Community data models
│
├── stores/
│   ├── useCollection.ts         # Collected objects state
│   ├── useAtp.ts                # Attention token balance
│   ├── useAcademy.ts            # Lesson completion state
│   ├── useEvents.ts             # Tracked events
│   └── useMeteors.ts            # Meteor captures
│
└── theme/
    ├── tokens.ts                # Colors, typography, spacing
    ├── animations.ts            # Shared animation configs
    └── darkMode.ts              # Always dark — this is a night sky app
```

---

## DATA MODELS

### Celestial Object (catalog item)
```typescript
interface CelestialObject {
  id: string;                    // "sirius", "orion_neb", etc.
  name: string;
  category: "star" | "nebula" | "galaxy" | "planet" | "cluster";
  constellation: string;
  magnitude: number;
  ra: number;                    // Right Ascension in degrees
  dec: number;                   // Declination in degrees
  spectralType: string;
  distance: number;              // Light-years (or AU for planets)
  color: string;                 // Hex for rendering
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  description: string;
  lore: string;                  // Cultural/historical context
  atpReward: number;             // ATP earned on collection
}
```

### Attention Hash Record (per protocol spec)
```typescript
interface AttentionHash {
  hash: string;                  // SHA-256 hex string
  event_type: string;            // "collection_bonus", "lesson_complete", etc.
  timestamp: number;             // Unix ms
  game_id: "astra_vault";
  quality_tier: "deep" | "active" | "passive" | "background";
  duration_ms: number;
  interaction_count: number;
  session_id: string;
  user_uid: string;
  synced: boolean;
}
```

### Meteor Event Record
```typescript
interface MeteorEvent {
  id: string;
  timestamp: number;             // Millisecond precision
  location: { lat: number; lng: number; alt: number };
  bearing: number;               // Compass degrees
  elevationAngle: number;        // Degrees above horizon
  captureMode: "voice" | "gesture" | "auto_detect";
  frames: string[];              // Storage URLs for captured images
  crossReferences: {
    camsMatch: boolean;
    camsData?: { orbit: any; parentBody: string; speed: number };
    otherUsers: number;          // Count of other users who saw same meteor
    publicPhotos: string[];      // URLs to matched photos
  };
  atpEarned: number;
  showerName?: string;           // "Perseid", "Geminid", etc.
}
```

### Academy Lesson
```typescript
interface Lesson {
  id: string;
  pathId: string;
  title: string;
  body: string;                  // The lesson content
  quiz: {
    question: string;
    answers: string[];
    correctIndex: number;
  };
  atpReward: number;
}
```

### Shared Sky (community aggregate — NO individual user data)
```typescript
interface SharedSkyData {
  observersNow: number;          // Live counter
  recentDiscoveries: Array<{     // Anonymous feed
    objectName: string;
    timestamp: number;
    region: string;              // "Americas", "Europe", etc. — NEVER more specific
  }>;
  communityGoals: Array<{
    name: string;
    target: number;
    current: number;
    unit: string;
    reward: string;
  }>;
  regionHeatmap: Array<{
    region: string;
    observers: number;
    percentage: number;
  }>;
  trendingObjects: Array<{
    name: string;
    collectPercentage: number;
  }>;
  lifetimeStats: {
    totalHours: number;
    totalObservations: number;
    totalObjectsCollected: number;
  };
}
```

---

## API INTEGRATION PATTERNS

### Rate Limiting
All NASA APIs are free but rate-limited. Use this pattern:

```typescript
// Cache API responses in Firestore with TTL
async function cachedFetch(key: string, fetcher: () => Promise<any>, ttlMs: number) {
  const cached = await firestore.doc(`cache/${key}`).get();
  if (cached.exists && Date.now() - cached.data().timestamp < ttlMs) {
    return cached.data().value;
  }
  const fresh = await fetcher();
  await firestore.doc(`cache/${key}`).set({ value: fresh, timestamp: Date.now() });
  return fresh;
}
```

### JPL Horizons (planet positions)
```
GET https://ssd.jpl.nasa.gov/api/horizons.api
  ?format=json
  &COMMAND='499'              // Mars
  &EPHEM_TYPE=OBSERVER
  &CENTER='coord@399'
  &COORD_TYPE=GEODETIC
  &SITE_COORD='{lng},{lat},0'
  &START_TIME='2026-05-13'
  &STOP_TIME='2026-05-14'
  &STEP_SIZE='1h'
  &QUANTITIES='1,9'          // RA/Dec, visual magnitude
```

### SkyView (real telescope images)
```
GET https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl
  ?Position={ra},{dec}        // Degrees
  &Survey=DSS                 // or 2MASS-J, WISE3.4, RASS, Fermi5
  &Return=JPEG
  &Pixels=400
  &Size=0.5                   // Degrees field of view
```

### Exoplanet Archive (habitable worlds)
```
GET https://exoplanetarchive.ipac.caltech.edu/TAP/sync
  ?query=SELECT+pl_name,hostname,pl_rade,pl_bmasse,pl_orbper,pl_eqt
         +FROM+ps
         +WHERE+pl_rade+<+2+AND+pl_eqt+BETWEEN+200+AND+320
  &format=json
```

### Full API reference: see `docs/ASTRA_VAULT_HIDDEN_RESOURCE_MAP.md`

---

## ATTENTION PROTOCOL INTEGRATION

The hash pipeline is ecosystem-standard. Do not modify the payload structure or hash function.

```typescript
// From ATTENTION_PROTOCOL_SPEC-1.md
function buildAttentionPayload(
  eventType: string,
  durationMs: number,
  interactionCount: number,
  qualityTier: "deep" | "active" | "passive" | "background"
) {
  return {
    event_type: eventType,
    timestamp: Date.now(),
    session_id: getSessionId(),
    duration_ms: durationMs,
    interaction_count: interactionCount,
    quality_tier: qualityTier,
    game_id: "astra_vault",
    user_uid: getCurrentUserUid(),
    nonce: generateNonce(),
  };
}

// Keys sorted alphabetically, JSON serialized, SHA-256 hashed
function generateHash(payload: object): string {
  const serialized = JSON.stringify(payload, Object.keys(payload).sort());
  return sha256(serialized);
}
```

### Astra Vault Event Types (registered with Director)
| Event Type | Trigger | Quality | ATP |
|---|---|---|---|
| `sky_scan_session` | 3 min active scanning | active | 10 |
| `object_inspect` | 10+ sec reading object detail | deep | 5 |
| `collection_bonus` | Collecting an object | deep | 20-100 |
| `set_complete` | Completing a category/rarity set | deep | 50 |
| `event_track` | Committing to track a future event | active | 10 |
| `event_observe` | Observing during live event window | deep | 50-200 |
| `lesson_complete` | Passing a quiz | deep | 15 |
| `meteor_capture` | Voice/gesture/auto meteor capture | deep | 10-50 |
| `meteor_crossref` | Cross-reference match found | deep | 25 |
| `bortle_report` | Submitting light pollution rating | deep | 30 |
| `obs_timer_session` | Completing observation timer | deep | 2/min |
| `idle_drip` | 5 min foreground visibility | passive | 1 |
| `tab_return` | Returning to app | active | log2(min+1) |
| `ambient_mode` | 3 min screensaver mode | passive | 1 |

---

## FIRESTORE SCHEMA

```
vaults/{uid}/
  ├── hashes/              # Attention hash records (shared across ecosystem)
  ├── balance/             # {total_earned, total_spent, current}
  └── games/
      └── astra_vault/
          ├── collection/  # Collected object IDs + timestamps
          ├── academy/     # Completed lesson IDs
          ├── events/      # Tracked event IDs
          ├── meteors/     # Meteor event records
          ├── journal/     # Observation log entries
          └── badges/      # Earned badge IDs

shared_sky/                # Community aggregate (Cloud Function updates)
  ├── live/                # {observers_now, recent_discoveries}
  ├── goals/               # Community mission progress
  └── stats/               # Lifetime aggregate numbers

cache/                     # API response cache with TTL
  ├── apod_today
  ├── iss_position
  ├── horizons_{body}_{date}
  └── skyview_{ra}_{dec}_{survey}
```

---

## CRITICAL RULES (FROM DIRECTOR)

1. **Privacy is absolute.** Never store URLs, message content, specific location data beyond opt-in features. Hashes prove engagement duration and quality, never content.

2. **Shared Sky has ZERO user interaction.** No usernames visible to others. No messaging. No comments. No profiles. No friend lists. Community is felt through aggregate data only.

3. **Every earning source needs a spending sink.** If you add a way to earn ATP, add a way to spend it. Economy must stay balanced across the ecosystem.

4. **Single-variable testing.** One new hash source at a time. Test. Stabilize. Then add the next.

5. **The game is the soul.** ATP is a bonus. If the app isn't compelling without tokens, fix the app first.

6. **Hash balance lives in the vault, not the app.** The Firestore vault is source of truth. Astra Vault reads balance, proposes spends. Never mint hashes that bypass the pipeline.
