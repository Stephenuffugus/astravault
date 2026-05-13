# SWS DATA INFRASTRUCTURE — MASTER REFERENCE
## Director: Stephen Furpahs
## Date: March 20, 2026
## Status: ALL SYSTEMS OPERATIONAL

---

## HOW TO ACCESS YOUR DATA IN FIRESTORE

The Firebase Console does NOT show all collections automatically. Use the pencil icon method every time:

1. Go to Firestore (left sidebar → Firestore)
2. Click the **pencil icon** (✏️) next to the house icon
3. Type the collection name and press Enter

| Type This | What You'll See |
|---|---|
| `vaults` | Attention hashes from every visitor |
| `poc_data` | Detailed behavioral snapshots |
| `friendCodes` | Focus Grove game data (separate) |

---

## WHERE YOUR DATA LIVES

### 1. Firestore — Cloud Database
**Project:** focus-grove-fffa8

**vaults/{uid}/hashes** — Every attention hash record contains:
- `hash` — SHA-256 proof of attention
- `event_type` — page_visit, scroll_depth_50, tab_return, idle_drip, content_read
- `quality_tier` — deep, active, background
- `duration_ms` — how long the attention event lasted
- `interaction_count` — clicks, scrolls, taps during the event
- `page_id` — which page generated the hash
- `session_id` — unique per browser session
- `sws_ref` — ref number if visitor arrived via ?ref= link
- `timestamp` — when the hash was generated
- `synced` — true means it reached Firestore

### 2. Google Analytics (GA4)
**Property:** G-5JFFYEJ6XP (stevieweedseed.com ONLY)

**Events being tracked:**
- `attention_proof` — every hash generated (hash, event type, quality tier, ref, page, session)
- `page_view_ref` — every page view with ref attribution
- `ref_arrival` — first landing with a new ref number
- `climate_oracle` — weather engagement on 21plus.html
- `stevie_vision_scan` — photo plant analysis
- `stevie_voice_start` — voice input usage
- `email_signup` — newsletter signups with ref
- `vision_gate_shown` — paywall impressions

**How to check:** GA4 → Reports → Realtime

### 3. BigQuery — Data Warehouse
Connected to Firestore. Data flows automatically. Use for SQL queries across all collected data.

### 4. Microsoft Clarity
**Project ID:** vyb3q3gk5h
Session recordings and heatmaps for every visitor on all 8 pages.

### 5. localStorage — Browser-Side Backup
- `sws_attention_hashes` — full array of hashes (last 500)
- `sws_hash_balance` — running count
- `sws_ref` — current ref number
- `sws_visitor_id` — persistent anonymous ID

---

## THE DATA FLOW

```
Visitor lands on stevieweedseed.com
    |
    |-- sws-auth.js → Signs in anonymously (Firebase Auth)
    |   |-- Backfills any unsynced hashes from previous visits
    |
    |-- GA4 Ref Bridge → Captures ?ref= parameter
    |   |-- Fires page_view_ref and ref_arrival events
    |
    |-- Microsoft Clarity → Records session
    |
    |-- sws-attention.js → Monitors behavior silently
        |
        |-- Scroll depth → hash
        |-- Time on page → hash
        |-- Tab return → hash
        |-- Idle presence → hash
        |
        |-- Each hash goes to:
            |-- localStorage (instant backup)
            |-- Firestore vaults/{uid}/hashes
            |-- Firestore poc_data/{uid}/events
            |-- GA4 as attention_proof event
            |-- BigQuery (automatic from Firestore)
```

---

## FILES ON HOSTINGER (stevieweedseed.com)

| File | Purpose |
|---|---|
| index.html | Homepage — hero, weather, email capture, Stevie widget |
| stevie.html | Full Stevie AI chat |
| 21plus.html | 21+ manifesto, seedbank buttons, Climate Oracle |
| seeds.html | Food & Flowers, Burpee affiliate, Stevie Vision |
| partners.html | Partner onboarding form |
| grow-room.html | Grow Room v4, gear registry, autopilot |
| growlog.html | Garden Planner |
| directory.html | Seed Directory with Leaflet map |
| sws-auth.js | Anonymous Firebase auth + hash backfill |
| sws-attention.js | Proof of Attention silent collection engine |

### Script Load Order (every page, in head):
1. Microsoft Clarity
2. GA4 config
3. SWS Ref Bridge (own script tag)

### Script Load Order (every page, before closing body):
4. Firebase SDK + init
5. sws-auth.js
6. sws-attention.js

---

## HOW TO RUN THE FULL SYSTEM AUDIT

1. Open any stevieweedseed.com page in incognito with ?ref=99
2. Right-click → Inspect → Console
3. Paste the contents of sws-audit.js
4. Press Enter
5. It tests all 15 systems and reports PASS/FAIL

---

## FIREWALL — NEVER CROSS THESE

| SWS (stevieweedseed.com) | Focus Grove / Petal Walk |
|---|---|
| GA4: G-5JFFYEJ6XP | Separate GA4 property |
| Firestore: vaults, poc_data | Firestore: friendCodes, contentRegistry |
| No cannabis in game | No game mechanics on SWS |
| Ref bridge uses parameter: ref | Game uses different tracking |

---

## VERIFIED MARCH 20, 2026

- Clarity loading on all 8 pages
- GA4 firing on all 8 pages
- Ref bridge capturing on all 8 pages
- Firebase Anonymous Auth working
- Attention hashes generating (multiple event types)
- Quality tier classification working (deep, active, background)
- Hashes syncing to Firestore vaults collection
- GA4 attention_proof events firing
- Ref attribution flowing through all systems
- seeds.html broken script tags fixed
- BigQuery connected to Firestore
- Microsoft Clarity recording sessions
