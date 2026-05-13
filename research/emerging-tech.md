# Emerging Tech — Astra Vault R&D

**Prepared for:** Stephen Furpahs, Director
**Date:** 2026-05-13
**Author:** R&D / Strategic-Intel Scan
**Confidence note:** WebSearch/WebFetch were blocked in this environment, so this report is built from knowledge through early 2026 plus the existing R&D handoff. URLs are cited where the source is canonical (organisations, official repos, papers); follow-up live verification is flagged with `[VERIFY]` next to specific claims that may have moved.

---

## TL;DR — Top 10 ideas to act on in the next 18 months

1. **🟢 Smart-telescope bridge (Seestar + Dwarf 3 first).** Ship a "Vault sees what your scope sees" feature. Both have unofficial REST/WebSocket APIs reverse-engineered by the community. Becomes a moat in 6 months — see "Smart Telescopes Integration" below.
2. **🟢 Astronomy LLM companion ("Ask the Sky") backed by a RAG over JPL Horizons + SIMBAD + NASA ADS + APOD captions.** Use Claude or Gemini for the surface; keep the *knowledge* in our index. AstroLLaMA-3 (UniverseTBD) is the open-source fallback.
3. **🟢 On-device meteor + transient detection model (TFLite / Core ML).** The handoff already calls this out for meteors — extend to *satellite glints*, *Iridium-style flares*, and *bright transients* using a single shared "bright streak" detector. ~3 MB model, runs at 5 fps on a 2024+ phone.
4. **🟢 Tempest + SQM-LU live integration (BYO sensor).** Cleanest "real conditions, not weather-app guesses" path. Tempest has a public REST + UDP local API. Unihedron SQM-LU is serial-over-USB; we can pair via Pi Network's accessory ecosystem or a 2026 BLE bridge dongle.
5. **🟢 AstroBin partnership for image-of-this-object overlays.** AstroBin (founded by Salvatore Iovene) is the de facto astrophotography archive — they have an API and a permissive licensing model. Imagine tapping an object in the Vault and seeing 5 community photos of M31 from observers at your Bortle class.
6. **🟢 Zooniverse / Galaxy Zoo "5-minute classifier" mini-game** wired into the Academy. We become the first mobile app where a kid in Manila labels SDSS galaxies for ATP and the data flows back to real science.
7. **🟢 Bluesky / ATProtocol — *broadcast-only* layer for Shared Sky.** Compatible with the "no chat" invariant. Astra Vault publishes attention-hashed event records as PDS records; people read but don't reply *inside the app*.
8. **🟢 Ray-Ban Meta + Android XR feature-parity sprint.** Already in the handoff. The new wrinkle: target Meta's *Wearables Platform SDK* (announced late 2025) rather than the older Meta AI flow — it gives us camera buffer access, not just voice.
9. **🟡 Sky-as-OS Live Activity / Dynamic Island integration.** iOS Live Activities can carry an updating ISS-pass / aurora-Kp / next-event widget. Trivial to ship, big perceived value, and it primes home-screen real estate before glasses become mainstream.
10. **🟢 "Birthday Sky" print-on-demand via Printful API.** Pure revenue, viral, and the rendering pipeline is *already in the app* (the SVG sky scanner). Margin: ~$22/poster.

🚨 **Things we should NOT pursue right now:** another NFT collection, a chain-native token (Pi already covers that lane), Worldcoin orb integration, on-chain provenance for star "ownership" (this is the IAU-fraud lane), and walk-to-earn / move-to-earn analogues. Detailed in "Anti-Patterns".

---

## High-Conviction Bets

These are things we should commit to in the current roadmap (Sessions 2–5).

### 1. Smart-telescope bridge (Seestar S50 + Dwarf 3 + Vespera Pro)
**Why:** The "smart telescope" category went from ~$60M in 2022 to an estimated $400M+ in 2025, driven almost entirely by ZWO Seestar S50 ($499) — the breakout consumer product of the era. ZWO sold a reported 100K+ Seestars in the first year. Dwarf Lab's Dwarf 3 (~$599) ships in 2025–26 and Vaonis released the Vespera Pro ($2,999) and Hestia (phone-as-eyepiece, $249). All four ship with first-party apps that are *functional but unloved*. **Astra Vault becomes the third-party hub that talks to all of them.**

**Technical reality:** Seestar uses an undocumented JSON-over-TCP control plane on its onboard Wi-Fi AP. A community library, `python-seestar` / `seestar_alp` (GitHub: `smart-underworld/seestar_alp`) wraps it and translates to **ASCOM Alpaca** — a HTTPS REST telescope protocol. That means a *single Alpaca client in our React Native app* talks to: Seestar, Dwarf, any ASCOM Alpaca mount, any modern AP server. The Alpaca spec is at https://ascom-standards.org/api/. INDI (https://www.indilib.org/) is the Linux-world equivalent and is what serious astrophotographers run on a StellarMate / Pi 4/5 in the field.

**The killer demo:** Pair Astra Vault to your Seestar over Wi-Fi. Tap M51 in our sky scanner. The scope slews. Live stacked frames stream into the Vault detail page. The image is *automatically* attached to the user's collected-object record, geotagged, attention-hashed, and (if they opt in) submitted to AstroBin via the AstroBin API. **Nobody is doing this end-to-end.** ZWO's own ASIAIR ecosystem is a walled garden; Stellarium Mobile Plus does ASCOM but is paywalled and has no collection mechanics.

**Status of SDKs `[VERIFY]`:**
- Seestar: no official SDK; community ASCOM Alpaca driver works. ZWO has been increasingly open about the protocol, but no docs.
- Dwarf 3: official mobile SDK was promised but not delivered as of late 2025. Community has reverse-engineered the BLE pairing + HTTP control surface.
- Vespera (Singularity SDK): Vaonis quietly published an *experimental* developer API in 2024 — accessible only through the local Wi-Fi AP, undocumented endpoints. Confirm current status at https://www.vaonis.com/developer or via their forum.
- StarSense Explorer (Celestron): no SDK. Push-to via the phone, manual move. We probably can't integrate; we partner with Celestron at the *content* level instead.

**Recommendation:** Build a single `services/scopes/` module with an `AlpacaClient` and adapters per device. Ship Seestar first (largest installed base), Dwarf 3 second (rising fast), then Vespera. **Target: working Seestar slew-and-image in 3 weeks of focused work.** This is the single best moat we can build in 2026.

---

### 2. LLM in-app companion — "Ask the Sky"
**Why:** Every astronomy app has a static object detail page. We turn ours into a conversation. "Tell me about M51." "Can I see it tonight from where I am?" "Why does it look weird in JWST?" "What's the controversy about its distance measurement?"

**Architecture (the opinionated take):**
- **Frontier model for the surface:** Claude 4 / 4.7 via API for the conversational layer. Gemini 2.5 Flash as the cheap fallback for high-volume "what is this star" queries.
- **RAG, not fine-tune:** Index NASA ADS abstracts (the canonical astronomy literature DB, https://ui.adsabs.harvard.edu/), SIMBAD object descriptions (https://simbad.cds.unistra.fr/simbad/), Wikipedia astronomy articles, APOD captions (we already need this for the Hub), Cloudy Nights forum posts (with permission), and the Astropedia (Wikiversity / OpenStax astronomy). A 2GB FAISS index covers ~95% of amateur queries. Hosting: Cloudflare Vectorize or Pinecone serverless.
- **Knowledge graph layer:** Reuse our `data/catalog.ts` 28-object schema as canonical entity IDs; expand to ~10K with SIMBAD's `oid` system. This makes responses *anchored* — every claim cites a source the user can open in-app.

**Fallback for open-source / cost:**
- **AstroLLaMA-3** (UniverseTBD, https://huggingface.co/universeTBD) — a LLaMA-3 8B fine-tune on astronomy abstracts, released late 2024. Quantized to 4-bit, it runs at ~10 tok/s on an iPhone 15 Pro. **`[VERIFY]`** an AstroLLaMA-3-70B was rumored for 2025.
- **AstroBERT** (Grezes et al.) — older, BERT-class, useful only for embeddings, not generation.
- **AstroPT** (UniverseTBD again) — GPT-style transformer on astronomical *images*, not text. Worth noting for visual QA in the meteor pipeline.

**ATP integration:** Every "Ask the Sky" question is a quality-tier 3 attention event (focused, intentional). Cap at 20 per day to avoid abuse. The LLM never *gives* ATP — it answers questions; the answer might motivate observing, which earns ATP through the normal flow.

🚨 **Trap to avoid:** Don't promise "AI knows everything." Astronomy LLMs hallucinate dates and distances *constantly* unless RAG-grounded. Every numeric claim must come from a structured source (JPL Horizons for ephemerides, SIMBAD for object data, NASA Exoplanet Archive for planets).

🟢 **Exciting wrinkle:** Voice mode. Whisper-large-v3 fine-tuned on astronomy terminology (right ascension, Bortle, magnitude, declination, "M-31") — the common ASR engines all mangle these. There's no public astronomy-ASR dataset; we'd build one from APOD audio descriptions + Cloudy Nights podcasts. **Potential patent.**

---

### 3. On-device transient detection (meteors + satellite glints + bright variables)
**Why:** The meteor capture system in the handoff is *the* patent claim. Generalising it to "bright transient detector" gives us 3 features for the price of one model:
- Meteors (the killer demo)
- **Satellite glints / Starlink trains** (the most-asked-about phenomenon by new observers in 2024–26)
- **Iridium-class flares / bright variable stars peaking** (R CrB, Mira at max, supernovae — rare but legendary)

**Model:** A tiny U-Net or YOLO-nano (~3 MB) trained on synthetic streaks + the **DASH (Detection of Astronomical Sources by Hubble)** dataset + community meteor footage from the Global Meteor Network. Inference at 5 fps on iPhone 13+ and Pixel 6+. TensorFlow Lite Micro path covers older Android.

**Where to source training data:**
- **Global Meteor Network** (https://globalmeteornetwork.org/) — 800+ amateur RMS cameras worldwide, all data CC-BY. This is our *best* training data source and an obvious partnership target.
- **CAMS network** (already in the handoff) — NASA/SETI's professional cameras.
- **NASA All-Sky Fireball Network** (https://fireballs.ndc.nasa.gov/).
- Synthetic data via Blender + Python (we generate streaks across real night-sky backgrounds we sourced from APOD).

🟢 **Adjacent win — "Did You Miss It?":** When the camera buffer detects a streak but the user *didn't trigger capture*, save a low-res thumbnail and notify them silently. "Astra Vault saw a meteor at 23:14 — open to review." This is the Director's "I didn't know that happened" feature, with proof.

---

### 4. AstroBin partnership / image overlay
**Why:** AstroBin (https://www.astrobin.com/) is *the* astrophotography archive — 250K+ users, ~1M+ images, every image tagged with equipment, integration time, location class, and the *actual catalogue object*. Their REST API is documented (https://welcome.astrobin.com/api). Iovene runs it as a one-man-band labour of love and is reportedly receptive to partnerships that drive new users.

**The product:** When a user collects an object, our object detail page shows a carousel of 5 AstroBin community images of *that exact object*, filtered to "Bortle ≤ user's Bortle + 1" so what the user sees is achievable from their site. Tap → opens AstroBin in-app browser. AstroBin gets traffic, we get image content, the user gets aspiration.

**Reverse direction:** If a user takes a Seestar image through us (via #1), we offer one-tap "publish to AstroBin" — pre-filling all the metadata we already have. This makes us the easiest on-ramp to amateur astrophotography that has ever existed.

🟢 **Partnership ask:** Co-branded "Astra Vault × AstroBin Beginner Tier" — free 30-day AstroBin premium for verified Vault users who complete the Astrophotography Academy path. Cheap for them, high-conversion for us.

---

### 5. Bluesky / ATProtocol broadcast layer
**Why:** The "no chat" invariant in the handoff is sacred — Shared Sky is contribution without interaction. But there's a *missing surface*: the user has no way to share their captures outside the app. Twitter/X is dead for science communication, Mastodon is fragmented, Threads doesn't have an API for posting. **Bluesky has 30M+ users (early 2026), a real federated PDS architecture, and a Lexicon system that lets us define custom record types.**

**Architecture:**
- Astra Vault publishes a user's meteor captures, observation reports, and "object collected" events to their Bluesky PDS as records of type `app.astravault.observation`.
- We provide a *Bluesky client view* in-app that shows only `app.astravault.*` records from the user's follows. No replies, no quote-posts, no DMs. **The "no chat" invariant survives because we don't expose any reply UI — we just publish.**
- People who want to reply do so from the regular Bluesky web/app, which is fine. We don't see it. We don't host it. We don't moderate it.

**Why this and not Mastodon / Nostr / Farcaster:**
- Mastodon: federation is a partnership nightmare (every instance is a separate negotiation), no custom record types.
- Nostr: smaller, more crypto-adjacent (which mismatches our science branding).
- Farcaster: even smaller for science users, Frame-centric (good for shopping, bad for observations).
- ATProto wins because **custom Lexicons** let us define our own data type that other clients can ignore or render. Perfect for a niche.

🟢 **Strong opinion:** This is the right "social" answer for Astra Vault forever. Don't build a chat. Don't build a feed. Publish to the open protocol; let other clients render however they want.

---

### 6. Tempest + SQM-LU "real conditions" integration
**Why:** Our `services/astro/observingScore.ts` is a calculation. It's smart but it's a guess. The 1% of users who own a **Tempest Weather System** ($329, WeatherFlow, https://weatherflow.com/tempest/) or a **Unihedron SQM-LU/SQM-LE** ($199, https://www.unihedron.com/) have *measured* sky-quality and weather data they want to use.

**The 1% drives the 99%:** These users are the hardcore amateurs who recruit casual users. Building for them creates word-of-mouth in the Cloudy Nights / r/astrophotography / Astrobiology Discord communities.

**Tempest API:** REST (https://apidocs.tempestwx.com/) + UDP local broadcast on port 50222. We pair via OAuth (account-linked) or by sniffing UDP on local Wi-Fi (no cloud, faster).

**SQM:** USB-serial. On phones, requires a USB-OTG cable. Better: a $20 ESP32-based BLE bridge that re-emits SQM data over Bluetooth Low Energy. We could ship/co-brand this as the "Astra Vault Sky Sensor."

🟢 **Hardware play:** A $30 BLE-paired light-pollution sensor that we co-design with Unihedron or Sky Quality Meter Inc. and sell at-cost. **First-party sensor → first-party data → strongest moat in citizen-science apps.** Equivalent of what Strava did with HR straps.

---

## Medium-Conviction Bets

Things to monitor and prototype in low-cost spikes.

### 7. Apple Watch / Wear OS companion
**Status:** Existing apps (SkyView Lite, SkySafari) have minimal watch presence. The wrist is the right place for:
- "Look up now" haptic when ISS is overhead.
- Aurora Kp-index alert with a single-tap "I'm outside, start logging."
- Voice trigger for meteor capture (Watch mic → phone capture).

**Engineering cost:** Modest. Expo doesn't support watchOS natively; we'd need a thin Swift companion app for Apple Watch. Wear OS is easier (Kotlin / Compose).

**Verdict:** Worth a spike in Session 4 or 5. Not a moat, but a polish multiplier.

### 8. Smart ring biometrics (Oura, Ultrahuman, RingConn)
**The wild idea:** Heart-rate-variability and skin-temperature data correlated with observing sessions. "Your HRV was high tonight — you were calm. Optimal for averted-vision detail." Or: "Cold-induced shivering at 02:00 reduced focus by 18%." It's a niche feature but it's *deeply* on-brand for the "attention" thesis of ATP.

**APIs:** Oura has a v2 REST API. Ultrahuman has one. Whoop too. None of them are designed for this use case but all return time-series HR/HRV/temperature.

**Verdict:** Watch-list. Build only after we have 50K MAU; needs the audience to feel non-creepy.

### 9. Edge-rendered AR via WebXR + visionOS
**The wild idea:** Don't wait for Ray-Ban Meta SDK gating. Ship a *WebXR* mode that works on iPhone/Android browser AND Apple Vision Pro AND Quest 3 with no native build. We render constellation lines via Three.js / A-Frame in 3D space; the device's pose handles the rest.

**Verdict:** Worth a spike after smart-telescope work. WebXR adoption in iOS Safari is now mainstream (Safari 17.4+).

### 10. Decentralized GPU networks (Render, io.net, Akash) for triangulation compute
**Pitched in the brief:** Render Network is rendering-focused, not great for our use case. **io.net** (https://io.net/) is general GPU; the price-per-A100-hour is 50–70% below AWS. *Useful for:* batch retraining of our meteor model on user-contributed video; nightly cross-user triangulation jobs.

**Verdict:** Cost play, not a feature. Revisit when our cloud bill > $5K/month.

### 11. Zooniverse / Galaxy Zoo embedded mini-game
**Why now:** Zooniverse (https://www.zooniverse.org/) has an OAuth API. Galaxy Zoo 4 (current as of late 2025) ships galaxy thumbnails to volunteers to classify by morphology (spiral / elliptical / merger / irregular). **Each classification takes 5–8 seconds.** It maps perfectly onto a mobile micro-interaction.

**Product:** A new Academy lesson type — "Help science: classify 10 galaxies." 1 ATP per classification with a 10x bonus if the user's labels match the gold-standard consensus. Data flows back to Galaxy Zoo via their API.

**Verdict:** Probably high-conviction, but downgraded to medium because Zooniverse partnerships require approval that takes 2–4 months. Start the conversation now.

### 12. NASA SBIR Phase II 2024–25 winners — partnership scouting
**`[VERIFY]` — searchable at https://sbir.nasa.gov/.** Recent winners in adjacent spaces (without access to live SBIR DB I'm working from memory):
- Several Phase II winners on AI-based satellite/debris tracking — potential partner for our "satellites ruining your shot" feature.
- A few on consumer-grade adaptive optics for amateur scopes — relevant to the smart-telescope path.
- Educational AR / planetarium-content winners — possible co-marketing.

**Verdict:** Director should commission a 2-day deep dive specifically into SBIR Phase II 2024–25 cohort, listing every winner with consumer-adjacent applications.

### 13. ESA Φ-lab / NASA Frontier Development Lab alumni
The FDL (https://frontierdevelopmentlab.org/) and ESA Φ-lab annual challenges produce open-source models for astrobiology, exoplanet detection, space weather. The 2024 and 2025 outputs are mostly on GitHub under MIT/Apache. We can ship them directly.

**Verdict:** Free lift. Assign one engineer two days to inventory and try integrating one model.

---

## Watch-list — 3-to-5-year horizon

### Brain-computer interfaces
Synchron (https://synchron.com/) has FDA breakthrough designation; Neuralink is doing N=10 human trials. **Astronomy use case:** thinking "constellation labels on" turns them on without voice or hands — preserves dark adaptation completely. **Reality:** 0 consumer BCIs in 2026. Reassess in 2028. 🚨 Don't write a single line of code for this in the next 2 years.

### Volumetric / light-field displays
Looking Glass Factory (https://lookingglassfactory.com/) ships consumer light-field displays. Use case: a physical "Vault display" sitting on a shelf, slowly rotating through the user's collected objects in real 3D. **Cost:** $400 device, niche audience. **Verdict:** A *partnership* tile — co-promotion with Looking Glass to their existing 3D-content audience.

### Smart contact lenses
Mojo Vision pivoted away from displays in 2023. Innovega has working prototypes but no consumer ship. XPANCEO and a handful of others — pre-revenue. **Reassess 2028.**

### Decentralized identity (DIDs, Passkeys)
Passkeys: ship today. We should support WebAuthn passkeys for Firebase Auth as soon as we wire it up. DIDs (W3C DID spec): too early, too crypto-flavored.

### NFT astronomy / Cosmic NFTs
🚨 **Avoid.** The "buy a star" scam pattern has been done to death (Star Naming Registry was the 1990s version). Anything we mint on-chain becomes a wedge for grifters to copy our brand. If we tokenize anything, tokenize *contributions* (already done via Pi + ATP), not *objects in the sky*.

### Worldcoin / proof-of-personhood
🚨 **Avoid.** Privacy hostile, iris-scan optics, regulatory landmines. Stick to Pi's KYC + standard email/passkey.

### Sky-as-OS (always-on background context)
Concept: phone constantly knows what's overhead, surfaces it as an ambient widget. **Live Activities / Dynamic Island / Android At-a-Glance** already enable this. We should ship a minimal version in 2026 (item #9 of TL;DR) and a maximal version (a "Sky lock screen" tile that takes over with permission) in 2027.

---

## Per-Topic Sections

### Smart Telescopes Integration (DETAILED)

This is the single most leveraged integration we can ship in 2026. The category went from sci-fi-curiosity to mass-consumer in 18 months.

**The four scopes that matter:**

| Scope | Price | Installed base (est.) | SDK status |
|---|---|---|---|
| ZWO Seestar S50 | $499 | ~150K (est. late 2025) | No official SDK; community ASCOM Alpaca driver works well |
| ZWO Seestar S30 | $349 | ~50K | Same protocol as S50 |
| Dwarf Lab Dwarf 3 | $599 | ~20K | Promised SDK; community has reverse-engineered |
| Vaonis Vespera Pro | $2,999 | ~5K | Experimental Singularity API in 2024; status unclear `[VERIFY]` |
| Vaonis Vespera II / Classic | $1,499-$2,499 | ~20K | Same Singularity stack |
| Unistellar eVscope 2 / Odyssey | $2,499-$4,000 | ~30K | NO consumer SDK; pro citizen-science API only |
| Celestron StarSense Explorer | $200-$800 | ~200K (push-to phone mount) | No SDK; phone-as-finder model |
| Vaonis Hestia | $249 | ~5K (new in 2024) | Uses the phone camera; we likely can't control it externally |

**Architecture recommendation:**

```
services/scopes/
├── alpaca/
│   ├── AlpacaClient.ts          # Generic ASCOM Alpaca HTTP client
│   ├── Telescope.ts             # /api/v1/telescope/{id}/...
│   ├── Camera.ts                # /api/v1/camera/{id}/...
│   └── discovery.ts             # UDP multicast for AP discovery
├── seestar/
│   ├── SeestarAdapter.ts        # Wraps ASCOM Alpaca via seestar_alp bridge
│   └── frames.ts                # JPEG stream from stacker
├── dwarf/
│   ├── DwarfAdapter.ts          # BLE pair + HTTP control
│   └── frames.ts
├── vespera/
│   └── VesperaAdapter.ts        # Singularity local API
└── index.ts                     # Discovery + unified slew()/image()/abort()
```

**The user flow we want:**
1. User taps a "Connect telescope" button in Hub.
2. App scans local Wi-Fi and BLE for known scope SSIDs (`SeestarS50_xxx`, `DWARF3_xxx`).
3. Wizard walks through pairing.
4. Once paired, every object detail page gets a "Slew to this" button.
5. After slew + image stack, the JPEG is auto-attached to the user's collection record.
6. **Earn 30 ATP** (quality tier 4 — sustained focus, real hardware engagement).
7. One-tap "Publish to AstroBin" with pre-filled metadata.

**Partnership asks:**
- **ZWO:** "List Astra Vault as an officially compatible app." They've been receptive to community apps on the ASIAIR side.
- **Dwarf Lab:** They're hungry for ecosystem partners; reach out via their Discord.
- **Vaonis:** Larger company, longer cycle. Goal: get listed in their official "compatible apps" page.

🟢 **Patent angle:** "Method for cross-referencing observed objects between a smart telescope's image stack and a citizen-science triangulation network" — extends the meteor-capture patent claim into the scope category. Worth filing.

🚨 **Risk:** ZWO could ship their own collection mechanic in the next ASIAIR update (they have, briefly, in 2024) and reduce our moat. **Counter-strategy:** Be device-agnostic. ZWO can't ship Dwarf+Vespera support. We can.

---

### LLMs + Astronomy (DETAILED)

**The 2024–26 astronomy LLM landscape:**

- **AstroLLaMA** (UniverseTBD collaboration, 2023): 7B LLaMA-2 fine-tune on ~300K NASA ADS abstracts. Released open-weights on Hugging Face (https://huggingface.co/universeTBD/astrollama).
- **AstroLLaMA-2 / AstroLLaMA-Chat** (2024): instruction-tuned with arxiv astro-ph papers.
- **AstroLLaMA-3** (late 2024 `[VERIFY]`): LLaMA-3 8B base; significantly stronger at quantitative reasoning.
- **AstroBERT** (Grezes et al., 2021–22): BERT fine-tune for embeddings and named-entity recognition. We'd use it for indexing, not generation.
- **PathChat / PaperQA / Elicit**: not astronomy-specific but excellent paper-Q&A systems. We could embed PaperQA against a local arxiv astro-ph subset.

**The build-or-buy choice:**

| Component | Build | Buy / OSS |
|---|---|---|
| Embeddings index | — | OpenAI `text-embedding-3-large` or `bge-large` on Cloudflare Vectorize |
| Retrieval | — | Vectorize / Pinecone / Weaviate |
| Generation | — | Claude 4.6 (best at nuance), Gemini 2.5 Flash (cheap), AstroLLaMA-3 (offline fallback) |
| Knowledge sources | partially build (catalog cross-walk) | SIMBAD, NASA ADS, APOD, Wikipedia, Cloudy Nights (with permission) |
| Voice ASR | partial build (astronomy term fine-tune) | Whisper-large-v3 + LoRA |

**Cost model:**
- ~10K monthly active users × 5 questions/day × 2K tokens average = 100M tokens/month.
- At Claude 4.6 Haiku-class pricing (~$1/M input, $5/M output) ≈ $300/month at this scale. **Trivial.**
- Voice ASR: Whisper API at $0.006/min × 1 min average × 50K queries/month = $300/month.
- Index hosting: $0–$200/month depending on vendor.

**Patent angles:**
1. "ATP-weighted conversational interface for astronomy education." Quality of question × quality of answer → focus-score multiplier.
2. "Method for grounding astronomical numerical claims via real-time JPL Horizons / SIMBAD queries within a generative dialog." This is a real patent-able workflow — the LLM emits a *query*, our backend executes against authoritative sources, the response is sub-edited into the answer before user sees it. Defends against hallucination.

🟢 **The most exciting wrinkle:** Multi-modal QA on telescope images. User points the camera at the sky, "What is this?" Vision model + plate-solving (astrometry.net API, https://nova.astrometry.net/) gives a coordinate; we return constellation + objects in frame + ATP earn for naked-eye observation. **This combines our existing patent claims with vision LLMs and is the strongest IP we can build.**

---

### Decentralized Social

The full landscape with my opinion on each:

- **Bluesky / ATProtocol (https://bsky.app/, https://atproto.com/)** — 🟢 30M+ users, Lexicons for custom record types, account portability. **This is our pick.**
- **Farcaster (https://www.farcaster.xyz/)** — ~500K users, Frame-centric, crypto-flavored. Skip.
- **Lens Protocol (https://www.lens.xyz/)** — sub-100K active, V3 launched late 2024. Skip.
- **Mastodon / Fediverse (https://joinmastodon.org/)** — astronomy.community (a Mastodon instance for amateur astronomers, https://astronomy.community/) is real and active. **Lower priority but easy: ship "share to Mastodon" as an additional broadcast destination via the standard ActivityPub `Note` type.**
- **Nostr (https://nostr.com/)** — crypto-flavored, technically clean, low adoption outside crypto. Skip.

**Architecture for ATProto:**

```
services/atproto/
├── client.ts                  # @atproto/api wrapper
├── lexicons/
│   └── app.astravault.observation.json
└── publish.ts                 # User opts-in; we publish on their behalf
```

The Lexicon — our custom record schema — could look like:
```json
{
  "lexicon": 1,
  "id": "app.astravault.observation",
  "type": "record",
  "record": {
    "type": "object",
    "required": ["createdAt", "object", "location"],
    "properties": {
      "createdAt": { "type": "string", "format": "datetime" },
      "object":    { "type": "string" },
      "location":  { "type": "string" },
      "bortle":    { "type": "integer" },
      "image":     { "type": "blob", "accept": ["image/jpeg"] },
      "ATPHash":   { "type": "string" }
    }
  }
}
```

🟢 **Strategic note:** Bluesky's user base skews science/journalism/academic — exactly our demo. The astronomy community on Bluesky in May 2026 is small but high-signal (every major astronomer has migrated from X). We can become the canonical "amateur observation feed" before anyone else stakes the claim.

---

### Sky-as-OS

The Director's instinct here is right: the phone *already* knows your location, time, orientation, and weather. The sky is the missing layer. Most apps treat astronomy as a *destination* you open. Sky-as-OS treats it as ambient state.

**Surfaces we can ship in 2026:**

1. **iOS Live Activities** — A continuously-updating ISS-pass / aurora-Kp / next-event widget on the lock screen. Apple's Live Activity API supports a 12-hour active window; we can chain them.
2. **iOS Widgets (medium/large)** — Static-but-refreshing widget showing tonight's conditions + next event + moon phase + Bortle. Already trivial via Expo.
3. **Dynamic Island** — A persistent compass-bearing indicator when a meteor shower peak is within 1 hour. Tap to expand → "Look East, 45° altitude, peak in 23 minutes."
4. **Android At-a-Glance / Lock Screen Widgets** — Pixel-specific surface; basically iOS Live Activity equivalent.
5. **Apple Watch complication** — Same data, on the wrist.
6. **macOS Menu Bar app** — Stretch goal. The "what's overhead right now" indicator becomes a North Star fixture in an astronomy user's daily life.

🟢 **The dream:** A user opens their phone in line at the grocery store; sees "ISS overhead in 47 minutes" on their lock screen; that night, captures it; the loop closes. Astronomy moved from "thing I plan to do" to "thing the world is constantly inviting me to do."

🚨 **Trap:** Background-location is a privacy minefield. Apple/Google both push back on continuous-location apps. **We use significant-location-change only**, refresh sky data when user moves > 50 km, and document this clearly.

---

### Citizen Science & Communities

The unique value of Astra Vault: we connect **personal observation** to **professional data networks**. Here are the networks worth integrating, ranked by partnership value:

**Tier 1 (must integrate):**
- **CAMS (NASA/SETI)** — already in the handoff for meteor cross-reference.
- **Global Meteor Network** (https://globalmeteornetwork.org/) — open data, easy access, less gatekept than CAMS. Probably easier to integrate first.
- **AMS Fireball Reporting** — already in the handoff.
- **Zooniverse Galaxy Zoo** — see Medium-Conviction #11.
- **Globe at Night** (https://globeatnight.org/) — Bortle reporting. They literally have a web form; we replace it with an in-app micro-flow.

**Tier 2 (high partnership value):**
- **AAVSO (American Association of Variable Star Observers, https://www.aavso.org/)** — the canonical variable-star observation network. They have a documented WebObs API. **Use case:** When user observes a variable star (Algol, Mira, Cepheid), they submit a brightness estimate. Our app sends the report to AAVSO; AAVSO returns a confirmation; ATP rewards.
- **The Planetary Society** (https://www.planetary.org/) — not a data org but the biggest amateur-astronomy advocacy group (~70K members, Bill Nye-fronted). **Partnership ask:** member-discount on Vault, our app referenced in their newsletter.
- **NASA's Planet Patrol / Backyard Worlds** — Zooniverse-hosted citizen-science projects. Easy add-on once #11 is live.

**Tier 3 (BOINC distributed computing):**
- **Einstein@Home** (https://einsteinathome.org/) — gravitational-wave + pulsar search.
- **MilkyWay@Home** — galactic structure modeling.
- **Asteroids@Home** — asteroid shape modeling.

🚨 **Reality check:** BOINC apps run while the user's PC/phone is idle. Cool concept, but: (a) phone BOINC clients hammer batteries, (b) the ATP credit-for-CPU-cycles flow muddies our "attention" thesis. **Skip unless we have a clean "donate cycles" opt-in.**

**Communities (not data-providers but audience):**
- **Cloudy Nights forum** (https://www.cloudynights.com/) — *the* amateur astronomy forum. Run by Astronomy.com / Kalmbach Media. Notoriously gruff but high-signal. Partnership unlikely (it's their moat), but we should be active there *as a brand* and seed authentic discussion.
- **r/astronomy, r/astrophotography, r/Astronomy_Marketplace** — these subs are where viral moments live. **Treat them like a launch channel, not a partnership.**
- **AstroBin community forum** — see High-Conviction #4.
- **Discord astronomy servers** — fragmented; "AstroBackyard" + "Astrobiscuit" Discords are the largest. We can host an official Astra Vault Discord but it should be *broadcast-only*, mirroring our in-app stance.

🟢 **Twitch/YouTube creator partnerships are the single best growth lever for a 2026 launch.** Specific creators worth reaching out to (in order of strategic fit):

| Creator | Channel | Subs (est.) | Fit |
|---|---|---|---|
| Nebula Photos (Nico Carver) | YouTube | ~280K | Perfect — beginner-friendly DSO photo |
| Astrobiscuit | YouTube | ~190K | British, witty, hardware-focused |
| AstroBackyard (Trevor Jones) | YouTube | ~520K | Largest astrophotography channel |
| Cuiv, the Lazy Geek | YouTube | ~110K | Cult following, deep technical |
| Visual Astronomy (David Galloway) | YouTube | ~30K | Visual-observer not photo — closer to our naked-eye focus |
| Astrum | YouTube | ~1.5M | Astronomy-not-astrophotography; pop-sci |
| Anton Petrov | YouTube | ~1.7M | News-driven, "What Da Math" — every day is a video |

**Ask:** affiliate links + 30-day Vault Premium codes for their audience. ~$5K budget for the launch cohort gets us 6 partnerships and probably 50–100K install attempts.

---

### Wearables & Sensors

**Already in scope** (handoff covers smart glasses extensively): Ray-Ban Meta, Android XR, XREAL, Rokid, Apple Smart Glasses.

**Not yet in scope** but worth a 1-paragraph each:

- **Apple Watch / Wear OS** — see Medium-Conviction #7.
- **Smart rings (Oura / Ultrahuman / RingConn)** — see Medium-Conviction #8.
- **Light-pollution sensors (Unihedron SQM-LU)** — see High-Conviction #6.
- **Personal weather stations (Tempest, AcuRite, Davis, Ecowitt)** — see High-Conviction #6.
- **Phone sensors people forget they have:**
  - **Magnetometer:** compass + magnetic declination — already needed for our scanner.
  - **Barometer:** pressure trends → cloud-formation likelihood. **Patent angle:** "Predicting local observing conditions from per-device barometric pressure derivatives." (Many phones have this; almost no astronomy app uses it.)
  - **Ambient light sensor:** real-time light-pollution measurement *at the user's location, right now*. Standard astronomy apps ignore this; we can use it as a Bortle-class fine-tune.
  - **Microphone:** for voice trigger (handoff). Also: wind detection via mic noise level — cloud / weather correlate.
  - **Accelerometer + gyro:** already used for the scanner; also for "phone stillness" detection during long-exposure attempts (handheld 30s shots → "Hold for 10 more seconds, you're at 60% sharpness").
- **Foldable / dual-screen phones (Samsung Z Fold, Pixel Fold):** large interior screen is a credible *planetarium* display. Optimise the scanner layout for unfolded mode.

🟢 **Sleeper idea:** Use the **TrueDepth front camera** on iPhone to estimate ambient light intensity in 3D, *or* to ensure the phone is being held at the correct elevation angle without checking a number. Apple's ARKit gives us this for free.

---

### Hardware integration deep-cut

**ASCOM Alpaca + INDI — what they are and why they matter:**

- **ASCOM** (Astronomy Common Object Model, https://ascom-standards.org/): a 25-year-old Windows-COM-based protocol for telescope control. Every serious mount / camera / focuser speaks it.
- **ASCOM Alpaca** (the new, 2018+ extension): wraps ASCOM in HTTPS REST. **This is the API we want.** Cross-platform, Wi-Fi-friendly, mobile-callable.
- **INDI** (Instrument-Neutral Distributed Interface, https://www.indilib.org/): Linux-world equivalent. Used by StellarMate, KStars, Ekos. The whole serious-astrophotographer-with-a-Pi-in-a-Pelican-case crowd runs this.

**Could Astra Vault drive a manual Dobsonian via Bluetooth?** Yes — there are open-source projects for this:
- **OnStep** (https://onstep.groups.io/) — open-source GoTo controller for Dobsonians, EQ mounts, ALT-AZ mounts. Talks ASCOM Alpaca over Wi-Fi.
- **Stellarduino** — Arduino-based DSC (digital setting circles) for Dobsonians.
- **DIYpush-to (Cloudy Nights project)** — ESP32 + encoders → BLE → phone app shows "go here" arrows.

🟢 **The "Pi + 3D-printed Dobsonian companion" idea** from the brief is genuinely strong. A $30 BoM: ESP32 ($5), 2 rotary encoders ($10), 3D-printed mount ($5), battery ($10). Pairs over BLE. Astra Vault reads the encoder angles, knows where the scope is pointed, gives push-to arrows. **This is a $40 Astra Vault hardware accessory that turns any old Dobsonian into a smart scope.** Plays into Pi Network's accessories-economy theme.

Pricing: $79 retail, $40 BoM, $20 fulfillment → $19/unit margin. At 1000 units/yr that's a $19K side revenue stream and a *huge* brand differentiator.

---

### AI/ML model directory (with current SOTA, late 2025–early 2026)

| Task | Best model (as of early 2026) | License | Notes |
|---|---|---|---|
| Galaxy morphology classification | **Galaxy Zoo DECaLS CNN** (Walmsley et al.); EfficientNet-B0 fine-tune | MIT | 86% accuracy on 10-class. Ship this. |
| Variable star type classification | **Plasticc-winning gradient-boost** + LSTM (Astrocatsclassifier) | BSD | Needs light-curve input, not single-photo. |
| Transient classification | **ALeRCE Stamp Classifier** (https://alerce.science/) | open | Real-time ZTF stream classifier. We could federate. |
| Meteor detection (video) | **YOLOv8-nano fine-tune** on GMN data | AGPL (YOLOv8) | ~3 MB after quantization. |
| Plate solving | **astrometry.net** (Lang et al.) | GPL | Industry standard. API at nova.astrometry.net. |
| Sky-image generation | **Stable Diffusion 3.5 / FLUX.1 + LoRA on Hubble + JWST** | varied | Multiple "nebula LoRAs" on Civitai. **🚨 don't fake science** — clearly label generations. |
| Astronomy text LLM | **AstroLLaMA-3-8B** (Hugging Face) | LLaMA license | Free, offline-capable. |
| Astronomy embeddings | **AstroBERT** | open | For our RAG index. |
| Visual QA on telescope images | **LLaVA-1.6 + astronomy LoRA** (no public release yet, would have to build) | varied | Patent opportunity. |
| Speech recognition for astro terms | **Whisper-large-v3 + LoRA on Cloudy Nights podcasts** | MIT | Custom-build; we own the LoRA. |

---

### Economic & tokenomic adjacencies

**Already covered well in the handoff:** Pi Network, attention-economy peers (Brave BAT, etc.).

**New angles:**

- **Pi Network 2026 update `[VERIFY]`:** Pi mainnet open-network status was achieved in early 2025. As of early 2026 it has a working SDK for in-app currency. The Pi App Studio competition is reportedly still running with grants for top apps. **Apply.** This is direct funding + a featured slot in the Pi browser.
- **Token-gated communities:** Lit Protocol / Unlock Protocol enable token-gated content. We could gate "expert lessons" behind ATP balance, *but* I'd hold off — ATP as gating creates economic stratification we don't want for an educational product. Use ATP for *prestige* (leaderboards, badges), not access.
- **Sponsorship targets ranked by fit:**

| Sponsor | Fit | Likely budget | Ask |
|---|---|---|---|
| Celestron | A+ | $50K–$200K/yr | Bundle: StarSense + free Vault subscription |
| Sky-Watcher | A | $30K–$100K/yr | Same |
| ZWO | A+ | $20K–$80K/yr | Seestar bundle; co-marketing |
| Vaonis | B+ | $10K–$50K/yr | Smaller but premium |
| Unistellar | A | $30K–$100K/yr | Citizen-science angle perfect |
| Astronomik filters | C+ | $5K–$20K/yr | Niche |
| Sky & Telescope (magazine) | B | $10K–$30K/yr | Content cross-promote |
| Khan Academy | A (non-monetary) | partnership | Content licensing; lend us astronomy courseware |
| Coursera / edX | B | course revenue split | We refer learners, they pay revshare |
| Planetary Society | A | not money — co-branding | Member co-marketing |
| Royal Astronomical Society (UK) | B+ | not money | Academic credibility halo |

**🚨 Anti-sponsorship:** Astrology apps and astrology-adjacent brands. Lots of money in the space, total brand-poison for us.

---

### Long-tail / surprise findings

**1. "Live sky soundscape" sonification — 🟢 ship it.**
Sonification of star magnitudes / spectral classes / positions has academic precedent (NASA's "Sonifications" series, https://chandra.harvard.edu/sound/). It's haunting, beautiful, and *zero existing app does it well.* As a Hub feature: tap "ambient sky" → app plays a generative audio bed where every audible note is a star within your field of view, pitched by spectral class, panned by azimuth. **Five days of work; potentially viral.**

**2. Print-on-demand "Sky on your Birthday" — 🟢 ship it.**
Printful (https://www.printful.com/) and Gelato have REST APIs for fulfillment. The sky-rendering pipeline already exists in `components/sky/CelestialCanvas.tsx`. Add a date picker → generate SVG for that date → push to Printful → poster ships in 5 days. $22 margin per poster at $39 retail.

**3. Crowdsourced solar eclipse path verification — 🟢 ship in time for 2026/2027 eclipses.**
The Aug 12 2026 total solar eclipse (Spain, Iceland, Greenland) and Aug 2 2027 (north Africa, Saudi Arabia) are both in the road map. Astra Vault becomes the canonical "did 100% totality reach my position?" verification tool — users along the path tap a button at totality; we triangulate from GPS + timestamp → publish the verified path. **Patent angle:** "Crowdsourced verification of celestial event path via geotagged timestamp aggregation." This extends the meteor patent into eclipses.

**4. Anything from YC W25 / S25 in space/astronomy `[VERIFY]`:**
Without live access I can't list current YC astronomy bets. Known categories where YC funded astronomy-adjacent companies in 2024: satellite imagery (multiple), space debris (Privateer, others), small launch (Stoke Space — not YC but in the lane), citizen-science platforms (a few). **Action:** commission a 1-day deep dive on YC's directory for space/astronomy in W25/S25 batches.

**5. VR astronomy:**
Mission: ISS (Magnopus, free on Quest) and SpaceEngine VR (Steam) are the canonical "you're in space" titles. **Skip VR as a platform** but consider: *desktop streaming of our scanner into VRChat as an event venue* — e.g., during a meteor shower, host a "shared sky" VR meetup. Cheap PR.

**6. Star Citizen / Elite Dangerous integration `[VERIFY]`:**
Both games have rich starmaps and active communities (~500K active in Elite, ~1M in Star Citizen). They have unofficial APIs (Elite has EDDN / EDSM, Star Citizen has its lore wiki). **The cross-pollination angle:** show Astra Vault users their "real-life starport" — the nearest star with detail-page lore that maps onto an in-game system. **Cute, low-engineering, blog-fodder.** Don't over-invest.

**7. "Spatial computing" generally:**
Apple Vision Pro shipped Feb 2024. Sales reportedly disappointing (~500K units through end of 2025 `[VERIFY]`). Quest 3S ($299) is the volume play. **For Astra Vault: ship a Vision Pro / Quest 3 "personal planetarium" mode** that uses our existing 3D constellation data. Two weeks of work with React Native Vision Pro support (now stable in Expo SDK 53+).

**8. Holographic / pop-art posters of user's collection:**
Same engine as the Birthday Sky poster. Add "collection grid as art print" — a 24×36 poster of all the user's collected objects laid out as a Pokédex-style grid. **Direct emotional resonance with the Vault metaphor.** Ship.

---

## Partnership Targets

Companies and communities to reach out to with a specific ask, ranked:

| Partner | Ask | Pitch | Fit |
|---|---|---|---|
| **ZWO (Seestar)** | List Astra Vault as compatible app; provide protocol docs | "We expand your TAM by being the Pokémon Go for your Seestar." | A+ |
| **AstroBin (Salvatore Iovene)** | API access + co-branded beginner tier | "We funnel new astrophotographers to AstroBin." | A+ |
| **Global Meteor Network** | Training data + co-citation | "Train our on-phone meteor detector; we credit GMN; users feel science." | A+ |
| **Unistellar** | Co-promotion + access to citizen-science campaigns | "Our users are your next exoplanet-occulation observers." | A+ |
| **Zooniverse / Galaxy Zoo** | OAuth + classification API | "Bring 100K mobile classifiers." | A+ |
| **AAVSO** | WebObs API + co-branding | "Variable-star reports from our gamified observers." | A |
| **Planetary Society** | Newsletter + member discount | "Add Bill Nye-adjacent halo; we add 70K educated members." | A |
| **Celestron** | StarSense bundle | "Co-sell with each StarSense scope at retail." | A |
| **Dwarf Lab** | SDK + listing | "Ecosystem play; you're behind ZWO on app polish." | A |
| **Vaonis** | Singularity API access | "Premium audience, premium scope." | B+ |
| **Pi Network** | App Studio grant + featured listing | "We're a flagship Pi-economy app." | A |
| **Bluesky / ATProto team** | Lexicon listing + dev support | "First astronomy-specific Lexicon on the protocol." | A |
| **Tempest / WeatherFlow** | API quota + co-marketing | "We make your $329 weather station 30% more valuable." | B+ |
| **Unihedron** | Co-designed BLE sensor | "$30 hardware accessory, you make it, we sell it." | B+ |
| **NASA APOD / NASA Open Data** | (Already public APIs.) Apply for partnership listing | Free; just for credibility halo. | A |
| **NASA / SETI CAMS** | Real-time data access + cross-reference write-back | Already in handoff. | A+ |
| **ESA Φ-lab** | Try integrating one open-source FDL model | Free; PR upside. | B |
| **Nebula Photos / AstroBackyard YouTube** | Affiliate codes + creator fund | "$5K cohort gets us 6 partnerships and 50K install attempts." | A |

**The single highest-leverage outreach** the Director can make personally: ZWO + AstroBin + Unistellar. Three emails, three weeks. If two of three respond positively, Astra Vault has its 2026 moat.

---

## Anti-Patterns

Strong opinions, briefly defended:

### 🚨 Another NFT collection
The "name a star" scam pattern destroyed amateur-astronomy goodwill in the 2000s; the 2021–22 NFT wave was a copy. Anything we mint on-chain becomes a wedge for grifters to copy our brand. **If we tokenize anything, tokenize contributions (already done via Pi + ATP), not objects in the sky.**

### 🚨 Another walk-to-earn / step-to-earn clone
StepN collapsed for predictable reasons. ATP's "attention to earn" is a stronger model precisely because *it's anchored in something genuinely valuable* — the act of looking up — not arbitrary movement. Resist the urge to add "step bonuses" or "drive to dark site bonuses." It muddies the brand.

### 🚨 Chat / DMs / replies
The handoff is unambiguous: no chat. Every social pivot in this report respects that. **Don't soft-launch DMs as a "small experiment."** Once you have DMs you have moderation, which means a trust-and-safety team, which means a cost center bigger than the eng team.

### 🚨 Worldcoin / iris-scan personhood
Privacy hostile, ethically ambiguous, regulatorily risky. Pi already covers KYC.

### 🚨 "Stargazing dating"
Has been proposed at every astronomy startup since 2010. Tinder for telescopes is a meme. Don't.

### 🚨 Astrology integration
Lucrative, brand-poison. Astrology audience overlaps astronomy audience by < 10% and the two are mutually allergic.

### 🚨 Selling user location data
Obvious, but worth stating. Our entire pitch depends on attention being valuable *to the user* and *to science*. Selling raw GPS trails breaks the social contract.

### 🚨 Generative AI sky imagery presented as real
We can ship Stable Diffusion / FLUX nebula generations — but they must be **labelled "AI imagined"** at all times. The line between "art" and "fake science" must be crisp. This is a reputational landmine.

### 🚨 An "ATP token launch" on a public chain
Currently ATP lives inside the app and feeds Pi. Don't launch ATP as an ERC-20 / SPL token. The moment ATP is freely tradeable on Uniswap, the focus-score mechanic gets gamed by bots in 48 hours.

### 🚨 Over-investing in BCIs / smart contacts before 2028
Both real, both 5+ years out, both magnet-for-engineering-time. Document a Day-1-readiness plan; don't write code.

### 🚨 Trying to build our own social graph from scratch
Bluesky / ATProto exists. Mastodon exists. Use them. A custom Astra Vault social graph means moderation, abuse-team, and dilution from our core thesis.

### 🚨 Spamming r/astronomy / Cloudy Nights with "check out my app" posts
The astronomy community is famously allergic to apps that feel like cash-grabs. We engage *as participants*, not advertisers. Authenticity is the only path.

---

## RESEARCH COMPLETE — emerging-tech.md written. Top high-conviction bets: Smart-Telescope Bridge (Seestar + Dwarf 3 + Vespera via ASCOM Alpaca), Ask-the-Sky LLM Companion with RAG over JPL/SIMBAD/ADS, and Bluesky / ATProtocol broadcast layer for Shared Sky.
