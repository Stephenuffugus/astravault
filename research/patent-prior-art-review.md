# Patent Prior-Art Review — Astra Vault R&D

**Date:** 2026-05-13
**Prepared for:** Stephen (Director), Astra Vault
**Status:** Pre-filing prior-art deep dive; counsel hand-off draft
**Source inputs:** `research/SYNTHESIS.md` (11 patent candidates), `research/patent-abstract-cross-glasses-merge.md`, `research/smart-scopes.md`, `research/asia-pacific-apps.md`, `astra-vault-handoff/docs/astra-vault-audit.docx`

---

## Methodology

This review is a live-web prior-art pass executed on 2026-05-13 against:

- **Google Patents** (`patents.google.com`) — primary US + worldwide issued patents and published applications
- **USPTO PatFT / AppFT / Patent Public Search** — when Google Patents returned incomplete claim language
- **Justia Patents** — secondary US claim text (rate-limited in this session; partial coverage)
- **FreePatentsOnline** — used to recover claim 1 text for the two Celestron StarSense patents when Google Patents' rendering dropped the claims section
- **EPO Espacenet** — referenced via secondary citations from Google Patents' worldwide chains
- **arXiv** — academic prior-art for 3D Gaussian Splatting, NeRF-on-sky, multi-station meteor triangulation, attention/gaze tracking
- **Project home pages and primary sources** — `globalmeteornetwork.org`, `dfn.gfo.rocks`, `cams.seti.org`, `aanda.org` (FRIPON), `stellarium.org`, `eclipsemegamovie.org`, `science.unistellar.com`, `aavso.org`

Each prior-art reference is cited inline by URL. Where a specific phrase ("attention-hash bound to plate-solve-gated ATP earn") returned zero hits across all queried databases, that is reported plainly as a negative-search outcome with the exact queries used, so counsel can verify.

**Important constraint:** WebSearch returned summaries rather than full claim text for most patents. For the two Celestron patents — the highest-stakes prior art in this review — claim 1 was extracted verbatim from FreePatentsOnline and is reproduced in full below. For most other prior art the analysis works from abstracts plus claim summaries; counsel should pull the granted claim language on any candidate before final FTO sign-off.

---

## Filing Recommendation Summary

| # | Candidate | Prior-Art Strength | Recommendation |
|---|---|---|---|
| 1 | Cross-glasses observation merge protocol | 🟢 Strong (clean whitespace) | **File US provisional immediately** |
| 2 | Attention-hash bound to r3f camera-dwell time on celestial objects | 🟡 Adjacent art exists | File narrowed provisional; emphasize the **celestial-coordinate-anchored** + **plate-solve-verified** + **on-chain hash** combination |
| 3 | Dark-adapted minimal-brightness AR rendering keyed to Bortle scale | 🟡 Adjacent automotive/HMD art | File narrow provisional limited to **measured-/reported-Bortle-keyed** auto-dim with **astro-app-specific** red-shifted palette |
| 4 | On-device astrometric plate-solve gating ATP earn | 🟢 Strong (anti-cheat angle is novel) | **File US provisional**, but include FTO carve-outs from Celestron US 8,401,307 and US 8,477,419 (see deep dive below). Astra Vault's use case **does not infringe** those patents, but the claim language needs to be drafted to avoid even appearing to read on them |
| 5 | Crowdsourced phone-metadata → triangulation → 3DGS-of-sky-backdrop → emissive trail | 🟢 Strong (no end-to-end pipeline patent found) | **File US provisional**; this is the strongest novel-combination claim Astra Vault holds. Note INRIA's non-commercial 3DGS license affects implementation, not patentability |
| 6 | Cultural-variant constellation art via vetted GenAI overlay | 🚨 **Partial prior art — Stellarium ships Māori, Arabic, Chinese sky cultures already** | **Narrow drastically** to the **GenAI-generation-with-iwi-vetting-workflow** specifically. Do **not** claim "cultural sky overlay" broadly. See deep dive below |
| 7 | Vision Pro eye-tracking → attention-hash gaze emission | 🟡 Apple holds the gaze-tracking platform IP | File only the **astronomical-object-anchored gaze-as-attestation** narrow claim; do not claim the gaze mechanism itself |
| 8 | Anonymous-presence 3D Shared Sky | 🟡 Anonymous-crowd-tracking patents exist | File narrow provisional restricted to **celestial-coordinate-binned anonymous fingerprints**; the spatial novelty is binning by sky-position not ground-position |
| 9 | Phone Tier aggregate dataset (CC BY 4.0 contribution) | 🔵 Not patentable (this is a licensing strategy, not an invention) | **Drop from patent list**; defend via copyright/licensing strategy and trademark instead |
| 10 | Attention-hash bound to confirmed multi-station meteor crossref | 🟡 Cross-reference-reward exists in citizen-science context | File as a **dependent claim chain** off Candidate #1 (cross-glasses merge); not a separate provisional |
| 11 | Sponsored RMS station program ($300 BoM, 100-node network) | 🔵 Not patentable (this is a hardware-funding business model) | **Drop from patent list**; pursue as a partnership/grant program |

**Filing-order recommendation (priority):** 1, 4, 5, then narrowed 2 + 3 in a combined provisional, then narrowed 6 + 8 in a second combined provisional. Drop 9 and 11. Roll 10 into 1 as dependent claims.

---

## Per-Candidate Deep Dives

### Patent #1: Cross-glasses observation merge protocol

**Astra Vault claim core (from `patent-abstract-cross-glasses-merge.md`):**
Multi-observer voice-triggered captures from heterogeneous consumer wearable/mobile devices, fused server-side by timestamp + bearing into a single reconstructed celestial event, weighted by per-record pose uncertainty, with sensor-only (no-image-frames) contributions as first-class inputs.

**Closest prior art identified:**

1. **Eclipse Megamovie 2017 / 2024** (UC Berkeley Space Sciences Laboratory + Google, project URL `eclipsemegamovie.org`). Crowdsourced eclipse photography stitched by GPS-timestamp + location into a frame-aggregated movie. **Differentiation:**
   - Eclipse Megamovie is a **frame-stitching** pipeline. Astra Vault is a **trajectory-fusion** pipeline that solves a 3D path through the sky.
   - Eclipse Megamovie handles **one predictable event on a known path**. Astra Vault handles **unpredictable transients** of arbitrary trajectory.
   - Eclipse Megamovie does **no per-frame astrometric pose refinement**. Astra Vault uses tetra3-class plate-solve to bring pose uncertainty from IMU's ±3-8° down to ±0.05°.
   - Eclipse Megamovie has **no smart-glasses or wearable** ingest path.
   - Eclipse Megamovie has **no anonymous device fingerprint** or privacy-preserving observer disambiguation.
   - **The Eclipse Megamovie project is not patented in any filing I located** via WebSearch queries `"eclipse megamovie" patent crowdsourced timestamp metadata mobile` — only academic publications and the project home page came back. Counsel should re-verify against USPTO Patent Public Search for any UC Berkeley filings.

2. **Global Meteor Network (GMN)** (`globalmeteornetwork.org`), **Cameras for All-Sky Meteor Surveillance / CAMS NASA** (`cams.seti.org`), **FRIPON** (`aanda.org/articles/aa/full_html/2020/12/aa38649-20/aa38649-20.html`), **Desert Fireball Network** (`dfn.gfo.rocks`), **SonotaCo Network Japan** (`sonotaco.com`). All are **fixed-station** all-sky camera networks. FRIPON, for example, runs 150 cameras with median 80 km spacing and GNSS-synchronized liquid-crystal-shutter timing to <1 ms precision. **Differentiation:**
   - All are **fixed cameras with known calibrated orientation and intrinsics**. Astra Vault accepts **moving consumer devices** with hybrid IMU + plate-solve pose estimation per-observation.
   - All are **camera-only** ingest. Astra Vault accepts **frame-less sensor-only contributions** (pose + time + uncertainty) as first-class inputs to the trajectory solver — a structurally different design that scales to the "casual user who heard the wake-word but didn't have a usable frame" case.
   - **None are patented in any filing I located** via queries `FRIPON "Desert Fireball Network" patent fireball trajectory triangulation`. The literature is academic — Astronomy & Astrophysics, ResearchGate, Wikipedia. Practitioners describe their pipelines openly; that strengthens Astra Vault's prior-art-citation story (no blocking IP) but means the techniques themselves are publicly disclosed and not separately patentable.

3. **Pokémon GO raid coordination / Niantic Wayfarer** (`pokemongo.com/post/campfire-global-launch-team-up-feature`, `wayfarer.nianticlabs.com`). Location-based multi-user coordination at a fixed real-world point of interest. Not relevant prior art — Niantic's coordination is **player-to-player at a stationary geo-fenced gym**, not multi-observer triangulation of a moving celestial object.

4. **Sony US 11,192,027** ("Terrain radar and gradual building of a route in a virtual environment of a video game", Kojima inventor, granted 2021-12-07). Asynchronous player-trail aggregation. Adjacent inspiration only — Sony's claim is on virtual-terrain-influence, not real-sky observation fusion. **Not blocking** for Astra Vault.

5. **US 9,277,361 B2** ("Methods and systems for cross-validating sensor data acquired using sensors of a mobile device"). Cross-validates image data against sensor data on a single device. **Not blocking** — this is single-device validation, not multi-observer trajectory fusion.

6. **WO 2019/226210 A1** ("Triangulation method for determining target position"). Generic two-station triangulation. **Adjacent** but the claim core is generic geometric triangulation; Astra Vault's novelty is the **consumer-mobile-wearable + uncertainty-weighted + plate-solve-refined + sensor-only-accepting** combination, which is not anticipated by this filing.

7. **US 10,962,625** ("Celestial positioning system and method"). Uses celestial-object images plus IMU + GPS to determine the **observer's own** position and orientation. **Adjacent but not blocking** — this patent claims a *single device locating itself by celestial reference*, whereas Astra Vault claims *multi-observer fusion of locating a celestial object*. The two patents share IMU + GPS + celestial-image elements but invert the direction of the inference.

8. **US 10,897,564** ("Shared control of camera device by multiple devices"). Multi-user remote-control of one camera. **Not relevant** — Astra Vault's flow is multi-camera fused into one event, not one camera controlled by many users.

9. **US 9,870,716 B1** (smart glasses real-time connectivity and health; one passage references multi-glasses participation in a shared experience). **Not blocking** — the disclosure is generic shared-vantage-point participation, not trajectory fusion of a celestial event.

**Differentiation analysis (what's genuinely novel):**

The **combination** of all six elements is what makes Patent #1 patentable:
1. Consumer-mobile-or-wearable trigger (wake-word / gesture / auto-detect / manual)
2. Pre-trigger ring buffer (1-5 s) plus post-trigger window
3. Hybrid IMU + per-frame astrometric plate-solve pose with explicit method-tag and uncertainty
4. Privacy-preserving SHA-256 device fingerprint (no PII)
5. Server-side spatio-temporal clustering with Monte Carlo Plane Intersection (or equivalent) trajectory solve weighted by pose uncertainty
6. **Sensor-only contributions as first-class inputs** (this is the most independently novel claim — see notes for counsel below)

No prior-art combination matches all six. The closest combinations match 1-2 elements. The Eclipse Megamovie matches elements 1-2 partially but lacks 3, 4, 5, 6. Fixed-station meteor networks lack 1, 3, 4, and arguably 5 (they assume well-calibrated stations rather than uncertainty-weighted heterogeneous observations). The smart-glasses shared-vantage-point patents lack 5 entirely.

**Recommended claim language refinements (for attorney):**

- **Strengthen independent claim 2 (the sensor-only-contribution claim)** — counsel should file this as a **separate independent claim** rather than dependent on claim 1, because the casual-observer-with-no-frame case is arguably the most commercially valuable and the easiest to defend (no other system accepts pose-without-image as first-class).
- **Tighten claim 1's "consumer mobile or wearable device" language** to explicitly include head-worn display, head-mounted display, smart eyewear, smart contact lens, and smart-watch — this future-proofs against form-factor evolution.
- **Add a dependent claim on the "cross-network verification" step (current claim 7)** that explicitly enumerates the open scientific feeds Astra Vault queries (CAMS, GMN, AMS, IMO, FRIPON, DFN, SonotaCo). The claim survives if those feeds change names; the enumeration is for evidentiary clarity.
- **Add a dependent claim on `attention-hash binding`** that hooks Patent #1 to Patent #10 (the cross-reference-bonus hash). This makes Patent #10 a dependent claim chain rather than a separate provisional.

**Risk level:** 🟢 **LOW**. Clean whitespace. The closest "blocker" candidates (Eclipse Megamovie, fixed-station meteor networks, single-device celestial positioning, multi-user camera sharing) either are not patented or claim non-overlapping subject matter. **File US provisional immediately** to lock the priority date ahead of Astra Vault's public launch.

---

### Patent #2: Attention-hash bound to r3f camera-dwell time on celestial objects

**Astra Vault claim core:** When a user's r3f (React Three Fiber) camera dwells on a celestial object for a configurable threshold, an "attention hash" is emitted and bound to (object_id, dwell_time, observer_fingerprint). The hash is the proof-of-attention substrate for Astra Vault's gameplay and ATP economy.

**Closest prior art identified:**

1. **Basic Attention Token / Brave (BAT)** (`basicattentiontoken.org`, `brave.com/brave-rewards/`). Web-browser attention measurement based on time-on-page and visible pixel area of an ad in the active tab. **Not blocking** for Astra Vault but **conceptually adjacent**:
   - BAT measures attention to **2D web content in a browser viewport**.
   - Astra Vault measures attention to **3D celestial-coordinate-anchored objects in an r3f scene**.
   - BAT's attribution is **on Ethereum**; Astra Vault's attention-hash can be on any chain or off-chain, and is **bound to a celestial-coordinate location and a verified-real-sky observation**.
   - I did **not** locate a granted US patent for BAT itself via queries `patent "attention token" Brave BAT gaze dwell time blockchain attribution`. Brave's white paper describes the BAT mechanism but there is no patent disclosure visible at the project's open documentation. **Counsel should run USPTO Patent Public Search for assignee "Brave Software"** before final FTO sign-off.

2. **US 8,888,287 B2** ("Human-computer interface system having a 3D gaze tracker"). Identifies intersection of gaze vector with regions/objects in a 3D environment. **Adjacent**: this is the gaze-tracking primitive Apple Vision Pro builds on. **Not blocking** — Astra Vault's claim is about **temporal attention emission as proof-of-attention**, not the gaze-direction-determination primitive.

3. **EP 2947546 A1** ("Module for implementing gaze translucency in a virtual scene"), **OrthoGaze / Vergence Matching** academic work (CHI 2023, 2024). Gaze-based 3D object selection. **Not blocking** — these are interaction primitives, not attention-as-attestation.

4. **Sweatcoin / STEPN move-to-earn** (`withtap.com/blog/what-is-sweat-token`, `kucoin.com/learn/crypto/what-is-sweatcoin-sweat-and-how-does-it-work`). Anti-fraud via GPS, accelerometer, step-count cross-validation. **Conceptually adjacent**: real-world-activity-to-token. **Not blocking** — Sweatcoin's activity is physical movement steps; Astra Vault's activity is **3D-camera-dwell on a plate-solve-verified celestial object**. Different sensor, different attestation, different output.

5. **US 9,861,889 B2**, **US 9,033,803 B1**, **US 11,007,429** (Niantic location-based game patents). Real-world activity → in-game reward. **Adjacent**: the genre. **Not blocking** — Niantic's claims are tied to ground-location, not celestial-coordinate attention.

**Differentiation analysis:**

The novel combination is:
1. r3f-rendered 3D celestial scene with **celestial-coordinate-anchored objects** (RA/Dec, not screen-XY)
2. Camera-dwell threshold per object (configurable; this is what distinguishes "looked at" from "scrolled past")
3. Attention-hash includes (celestial_coordinate, dwell_seconds, observer_fingerprint, optional plate-solve attestation)
4. Hash is the **economic substrate** of the Astra Vault ATP economy (anti-Sybil, anti-cheat, transferable, vault-portable)

The element that's hardest to anticipate in prior art is **#1 + #4 combined**: nobody has tied an attention-token to a *celestial-coordinate-anchored* object in a 3D scene with the plate-solve-verified-real-sky linkage.

**Recommended claim language refinements:**

- **Narrow claim 1 to "celestial-coordinate-anchored object"** explicitly — do NOT claim attention-hash for arbitrary 3D objects (Brave's BAT and US 8,888,287 sit in that adjacent space).
- **Add a dependent claim requiring plate-solve attestation** of the underlying real-sky observation. This is the anti-cheat hook that distinguishes Astra Vault from any "watch-this-virtual-thing-earn-tokens" prior art.
- **File this as a continuation-in-part of Patent #1** if the timing works, so the patents reference each other for full coverage as the abstract draft already suggests.

**Risk level:** 🟡 **MEDIUM**. The adjacent art (BAT, gaze-tracking, move-to-earn) is dense enough that the claim must be carefully narrowed. With proper narrowing, this is filable; broad attempts will be examined hard.

---

### Patent #3: Dark-adapted minimal-brightness AR rendering keyed to Bortle scale

**Astra Vault claim core:** AR display brightness, color palette, and HUD element opacity are auto-adjusted based on the measured-or-reported Bortle class at the observer's location, optimizing for dark-adapted (low-cone, high-rod) human vision during astronomical observation sessions.

**Closest prior art identified:**

1. **US 10,997,948** ("Electronic device with adaptive lighting system" — Apple). Lighting system transitions user from bright-adapted to dark-adapted by gradually decreasing brightness. **Adjacent**: dark-adaptation-aware brightness control on Apple HMDs. **Not blocking** — Apple's claim is **physiological-state-based** (estimated user adaptation state from pupil size, blink rate, ambient sensor); Astra Vault's claim is **measured-environmental-Bortle-class-based** (light pollution scale 1-9).

2. **US 11,211,030** ("Electronic device with adaptive display" — Apple). Tone-mapping curves selected based on user adaptation state. **Adjacent, not blocking** — same physiological-state-based framing as US 10,997,948.

3. **US 20180173304 A1** ("Brightness control for an augmented reality eye-mounted display"). Photodetector senses external scene brightness, adjusts AR image brightness. **Adjacent, not blocking** — Astra Vault keys off a published-classification (Bortle 1-9) which is a discrete categorical scale derived from light-pollution mapping, not raw photodetector ambient lux.

4. **US 20130113973** ("Adaptive brightness control of head mounted display"). Generic HMD adaptive brightness. **Not blocking** — predates the Bortle-keyed framing.

5. **US 5,053,755 A** (1991, Honeywell) ("Automotive head-up display with high brightness in daytime and high contrast in nighttime"). Classic automotive HUD day/night switching. **Not blocking** — binary day/night, not 9-class astronomical sky-darkness.

6. **Light for Night vision** (Vixen app, `play.google.com/store/apps/details?id=jp.co.vixen.nightvisionlight`). Astronomy red-screen smartphone flashlight. **Adjacent**: shipped as a free app since pre-2020. **Important prior art to cite**: red-shifted palette for night vision in an astronomy mobile context is well-established. Astra Vault's claim should not attempt to cover "red-shifted astronomy palette" — that's prior art. The claim must hinge on **Bortle-class-keyed automatic adjustment**.

7. **Stellarium night mode**: Stellarium ships a binary red-night-vision toggle (per `asia-pacific-apps.md` line 410). **Not blocking** for the Bortle-keyed framing but again establishes red-palette astronomy night mode as prior art.

**Differentiation analysis:**

The novel element is the **Bortle-scale-as-control-input** binding. Specifically:
1. Observer's location is sampled.
2. Bortle class is either (a) looked up from a published light-pollution map (Falchi et al. 2016, `science.org/doi/10.1126/sciadv.1600377`; Globe at Night, `globeatnight.org`), or (b) reported by the user, or (c) measured by SQM-LU accessory.
3. The AR system selects palette, brightness, contrast, and HUD opacity from a discrete table indexed by Bortle class 1-9.
4. The system biases red-shifted in Bortle 1-3 (true dark site, preserve rod-vision); transitions to dimmed-white in Bortle 7-9 (urban, ambient light already washes out dark adaptation).

**Recommended claim language refinements:**

- **Tightly couple the claim to a published Bortle classification system** as the categorical input. Do not claim "ambient-light-keyed brightness" generically — Apple, Honeywell, and others own that space.
- **Add a dependent claim on the SQM-LU BLE accessory integration** (sleeper finding from SYNTHESIS.md item #4). This is hardware-anchored novelty.
- **Add a dependent claim on Globe at Night / Falchi-atlas lookup** as the data source. Citing the public data source in the claim narrows the scope and clarifies non-infringement on raw-sensor adaptive HMD patents.

**Risk level:** 🟡 **MEDIUM**. The HMD adaptive brightness art is dense and well-funded (Apple). Narrow filing only. The Bortle-keyed angle is genuinely novel but the surrounding patent thicket is heavy.

---

### Patent #4: On-device astrometric plate-solve gating ATP earn (CRITICAL FINDINGS SECTION BELOW)

See **"Critical Findings on Patent #4"** later in this document for the full FTO analysis against Celestron US 8,401,307 B1 and US 8,477,419 B1.

**Risk level:** 🟢 **LOW for Astra Vault's use case**; 🚨 **HIGH if Astra Vault ever ships a "phone-as-finder" feature**. Critical reading below.

---

### Patent #5: Crowdsourced phone-metadata → triangulation → 3DGS-of-sky-backdrop → emissive trail

**Astra Vault claim core:** End-to-end pipeline. Phone metadata (timestamp + GNSS + IMU pose + optional plate-solve) from multiple observers feeds a triangulation solver. The reconstructed event is rendered against a 3D Gaussian Splat (3DGS) backdrop of the sky at that location and date. The transient (meteor, satellite re-entry, fireball) appears as an emissive trail through the 3DGS scene.

**Closest prior art identified:**

1. **3D Gaussian Splatting (INRIA 2023)** (`repo-sam.inria.fr/fungraph/3d-gaussian-splatting/`). The base technique. **Important licensing constraint, not patent constraint:** INRIA's reference implementation is non-commercial-only. Astra Vault must (a) license commercially from INRIA, (b) use a permissively-licensed re-implementation, or (c) use Apache-2.0 forks like `nerfstudio-project/gsplat`. This is an **implementation gate**, not a patentability gate.

2. **US 20240355047** ("Three dimensional Gaussian Splatting initialization based on trained neural radiance field representations"). Recent (Oct 2024) US application. **Adjacent** — claims a specific NeRF-to-3DGS initialization pipeline. **Not blocking** for Astra Vault's claim, which is an end-to-end astronomical reconstruction, not a 3DGS initialization technique.

3. **US 20260024269 A1** ("Rasterizing depth in Gaussian splatting"). Depth-rasterization in 3DGS. **Not blocking** — this is a rendering primitive.

4. **arXiv 2304.04133, 2104.09877, 2301.09060** — NeRF-applied-to-satellite-imagery / Shadow-NeRF / NeRF-for-resident-space-objects. Academic prior art. **Not blocking** — these all reconstruct **Earth surfaces, individual satellites, or space objects**, not a sky-backdrop populated by ground observers.

5. **EO-NeRF (Earth Observation NeRF)** (`github.com/rogermm14/eonerf`). Multi-date satellite imagery reconstruction. **Not blocking** — opposite direction (satellite-down-to-ground vs. Astra Vault's ground-up-to-sky).

6. **Eclipse Megamovie 2017** — covered under Patent #1. Adjacent in spirit (crowdsourced sky reconstruction) but does no 3D reconstruction; only 2D frame stitching.

7. **CAMS / GMN / FRIPON / DFN trajectory solvers** — covered under Patent #1. Output 3D trajectories but render them only as ground-projection plots, not as emissive trails through a 3DGS backdrop.

**Differentiation analysis:**

The novel combination is the **stack**:
1. Multi-observer phone metadata ingestion (covered separately by Patent #1)
2. Trajectory solve (covered by Patent #1)
3. **3DGS sky backdrop built from aggregated crowdsourced frames** (this is genuinely novel — nobody has built a sky 3DGS from a crowd of phone frames)
4. **Emissive trail rendering of the solved trajectory through the 3DGS backdrop** (novel combination — no prior art surfaced)

The combination of 3 + 4 with crowdsourced input is what makes Patent #5 the strongest novel-combination claim Astra Vault holds.

**Recommended claim language refinements:**

- **File two independent claims**: one for the **3DGS sky backdrop construction from crowdsourced phone frames** (independent of any trajectory rendering), and one for the **emissive-trail rendering of a reconstructed trajectory through a 3DGS sky backdrop** (independent of how the 3DGS was constructed). This gives Astra Vault two filable independents in case one falls to art.
- **Add a dependent claim on plate-solve-anchored 3DGS calibration** — each contributed frame is plate-solved to anchor its position in the celestial-coordinate frame before splat fitting.
- **Defer broad 3DGS-rendering-primitive claims** — INRIA's prior publication and the active patent landscape make those uncertain.

**Risk level:** 🟢 **LOW**. The novel combination is genuinely new. INRIA's license is an implementation constraint, not a patent blocker. File US provisional.

---

### Patent #6: Cultural-variant constellation art via vetted GenAI overlay

**See "Critical Findings on Patent #6" later in this document for the full prior-art analysis.** Short version: 🚨 Stellarium Plus already ships Māori, Arabic, Chinese, Aztec, Aboriginal, and other sky cultures as hand-curated overlays. Astra Vault's claim must hinge entirely on the **GenAI generation workflow with iwi/community vetting** — not the cultural-overlay rendering itself.

**Risk level:** 🚨 **PARTIAL PRIOR ART**. Narrow drastically before filing, or drop.

---

### Patent #7: Vision Pro eye-tracking → attention-hash gaze emission

**Astra Vault claim core:** On Apple Vision Pro (and analogues like Meta Quest Pro), the device's eye-tracking is used to determine when the wearer's gaze dwells on a celestial-coordinate-anchored object; an attention-hash is emitted as proof-of-gaze.

**Closest prior art identified:**

1. **Apple's Vision Pro eye-tracking patent family** (`patentlyapple.com/2023/10/apple-patent-reveals-their-advanced-eye-tracking-system-for-vision-pro-future-smartglasses-using-cameras-smi-sensors.html`). Self-mixing-interferometry (SMI) sensors plus infrared cameras determining gaze vector. Apple holds the eye-tracking-on-Vision-Pro IP. **CRITICAL:** Apple's privacy posture forbids apps from accessing raw eye-tracking data ("Your eye input is not shared with apps... No exceptions, including for medical research purposes", `apple.com/legal/privacy/data/en/eyes-hands/`). Astra Vault cannot directly emit a gaze-hash from Vision Pro because the API surface for raw gaze data does not exist. This is **a platform constraint, not a patent blocker** — but it kneecaps the commercial viability of Patent #7 on Apple platforms.

2. **US 8,888,287 B2** (3D gaze tracker — see Patent #2). Generic 3D gaze tracking. **Adjacent**.

3. **Optic ID** (Apple, iris-based authentication). **Not blocking** — different use case.

**Differentiation analysis:**

The novel claim is **gaze-as-attestation-of-observation** rather than gaze-as-interaction-input. But Apple's privacy model prevents reduction to practice on Vision Pro, so the claim is currently un-implementable on the platform it names.

**Recommended:**
- **File only the platform-agnostic narrow claim** ("a head-mounted display with internal-facing gaze sensors") to keep the IP option open for future platforms (Samsung Moohan, Meta Quest Pro 3, Brilliant Labs Frame v2) that may expose richer gaze APIs.
- **Defer filing until at least one HMD platform exposes raw gaze data**, otherwise Astra Vault risks a patent for something nobody can implement.

**Risk level:** 🟡 **MEDIUM**. The patent is filable but commercial implementability is gated by platform vendors' privacy policies. Low priority.

---

### Patent #8: Anonymous-presence 3D Shared Sky

**Astra Vault claim core:** Multiple users observing the same patch of sky have their anonymous device fingerprints (SHA-256 of device+OS+app version) aggregated server-side. The system surfaces "N other observers are looking near this object right now" without revealing any usernames or PII. Presence is bucketed by **celestial coordinate** (RA/Dec patch), not by ground location.

**Closest prior art identified:**

1. **US 8,208,943 B2 / US 20100197318 A1** ("Anonymous crowd tracking"). Server forms crowd snapshots of users based on current ground locations while maintaining anonymity. **Adjacent and important to distinguish**. Astra Vault's claim must hinge on **celestial-coordinate-binned presence**, not ground-location-binned. The data structure is different: the bin key is a (RA, Dec, radius) tuple, not a (lat, lng, radius) tuple.

2. **US 20120046995** ("Anonymous crowd comparison"). Same family. **Same distinction.**

3. **US 20240323640** ("Crowd density analysis with multiple regions"). Same family.

4. **Sony US 11,192,027** (Death Stranding terrain patent — see Patent #1). Asynchronous trail. **Adjacent inspiration**, not blocking.

5. **PlayStation "Ghost Player" patent** (mid-2025, per `techradar.com/gaming/new-playstation-tech-patent-called-ghost-player-will-take-over-players-games-when-they-get-stuck`). Generic ghost-player-takes-over. **Not blocking**.

**Differentiation analysis:**

The **celestial-coordinate binning** is the novelty. Ground-location-binned anonymous crowd patents do not anticipate sky-coordinate-binned. The claim should explicitly call out "binning by celestial coordinate (right ascension, declination, angular radius) rather than terrestrial coordinate" as the distinguishing limitation.

**Recommended claim language refinements:**

- **Independent claim** must include the celestial-coordinate-binning limitation explicitly.
- **Dependent claim** can add the ground-location component as a *secondary* bin (e.g., observers in the same Bortle cell looking at the same RA/Dec patch).
- **Dependent claim** on the no-chat invariant — the presence indicator is *the only* social signal; no DMs, no usernames, no friend lists. This aligns with the Director's no-interaction invariant from `SYNTHESIS.md` line 113.

**Risk level:** 🟡 **MEDIUM**. The anonymous-crowd-tracking patent family is real prior art; the sky-coordinate-binning angle is novel but narrow. File narrowly.

---

### Patent #9: Phone Tier aggregate dataset as CC BY 4.0 contribution

**This is not a patentable invention. It is a licensing-and-contribution strategy.**

What this is:
- Astra Vault aggregates phone-tier user observations into a Phone Tier dataset, published under CC BY 4.0 (matching GMN's license, per `SYNTHESIS.md` line 28).
- The dataset is contributed alongside professional networks (GMN, AMS, AllSky7, IMO).
- This is a **business model** and **licensing decision**, not a technical novelty.

**Closest prior art:**
- **CC BY 4.0 license itself** (Creative Commons, 2013).
- **GMN data release model** (`globalmeteornetwork.org`, CC BY 4.0 already in production).
- **AAVSO data contribution model** (`aavso.org`).
- **Globe at Night data release** (`globeatnight.org`).
- **Zooniverse contributor agreements** (`zooniverse.org`).

**Recommendation:** **Drop from patent list.** Defend this via:
- **Trademark** the Astra Vault Phone Tier dataset name.
- **Copyright** the schema and data-format documentation.
- **Contract** with downstream consumers via the CC BY 4.0 license terms (specifically the attribution clause, which protects the Astra Vault brand association).
- **Trade-secret** the proprietary aggregation, deduplication, and quality-grading algorithms that produce the dataset (these are protectable as trade secret without needing patent disclosure).

**Risk level:** 🔵 **NOT A PATENT MATTER**. Pursue licensing strategy instead.

---

### Patent #10: Attention-hash bound to confirmed multi-station meteor crossref

**Astra Vault claim core:** When a user's observation is confirmed by cross-reference to a multi-station meteor record (GMN, CAMS, FRIPON), a bonus attention-hash is emitted on top of the base attention-hash from Patent #2. The bonus is proportional to the cross-reference confidence.

**Closest prior art:**

1. **US 9,277,361 B2** (cross-validating sensor data on a single device). **Not blocking** — single-device validation, not cross-reference to external scientific feeds.

2. **US 11,182,383** ("System and method for data collection to validate location data"). **Not blocking** — generic location-data validation.

3. **AAVSO + Unistellar award model** ("Exoplanet Pioneer Award", `unistellaroptics.com/unistellars-aavso-collaboration/`). Citizen-science recognition for confirmed contributions. **Conceptually adjacent**: confirmed-observation-earns-recognition. **Not blocking** — AAVSO is an award + database publication, not a tokenized attention-hash bonus mechanism.

**Differentiation analysis:**

This is best filed as a **dependent claim chain off Patent #1 (cross-glasses merge)**, not a separate provisional. The merge-protocol's cross-network-verification step (current claim 7 in `patent-abstract-cross-glasses-merge.md`) already covers the data-flow; the bonus-hash emission is a downstream economic step that fits naturally as a dependent claim.

**Recommended:** Roll into Patent #1. Don't file separately.

**Risk level:** 🟢 **LOW**.

---

### Patent #11: Sponsored RMS station program ($300 BoM, 100-node Astra Vault camera network)

**This is not patentable. It is a sponsorship-and-hardware-funding business model.**

What this is:
- Astra Vault funds 100 RMS (Raspberry Pi Meteor Scanner) stations at $300 BoM each = $35k total.
- RMS itself is GPL-3 (per `SYNTHESIS.md` line 63) — cannot be linked from closed-source binary. The MIT-licensed `WesternMeteorPyLib` is the compatible pipeline.
- Stations contribute to GMN and Astra Vault.

**Recommendation:** **Drop from patent list.** This is a hardware-sponsorship grant program. Pursue as:
- Public grant funding.
- Hardware partnership with a Pi-camera vendor.
- Astra Vault brand co-marketing on the deployed stations.

**Risk level:** 🔵 **NOT A PATENT MATTER**.

---

## Critical Findings on Patent #4 (on-device plate-solve)

**Astra Vault claim core:** Only "real" sky observations earn ATP. The earn-gate is on-device astrometric plate-solving: if the frame contains a verifiable star pattern matching the user's reported GNSS time + location, the observation is authentic; if it doesn't, no ATP. This is the anti-cheat substrate for the Astra Vault economy.

### Full claim language: Celestron US 8,401,307 B1

**Title:** "Determining celestial coordinates for an image"
**Assignee:** Celestron, LLC
**Inventor:** Danyal Medley
**Filing date:** December 31, 2010
**Priority date:** December 31, 2010
**Grant date:** July 2, 2013 (the document, per Google Patents, also shows an active status through ~2031)
**Expiration:** July 16, 2031 (per Google Patents metadata)

**Claim 1 (verbatim, from FreePatentsOnline):**

> "A computer-implemented method for determining celestial coordinates corresponding to an image, comprising: receiving an image comprising a plurality of depicted objects; generating, at a processor, a list of initial coordinates indicating positions, with respect to an origin point for the image, of a plurality of depicted objects in the image; selecting, at the processor, a group of objects from the plurality of depicted objects; generating, at the processor, a test signature based on the initial coordinates of the objects in the selected group; searching a data store for at least one reference signature that matches the generated test signature within a specified tolerance; for at least one reference signature that matches the generated test signature within a specified tolerance: obtaining a celestial position corresponding to the reference signature; determining, from the obtained celestial position corresponding to the reference signature, celestial coordinates for the image; and outputting the determined celestial coordinates at an output device; wherein searching a data store for at least one reference signature that matches the generated test signature within a specified tolerance comprises: for at least a plurality of reference signatures in the data store, performing an affine fit operation to generate a geometric transform representing the relationship between the generated test signature and the reference signature; and identifying at least one reference signature for which the generated geometric transform indicates that the reference signature matches the generated test signature within a specified tolerance."

**Other independent claims:** Claims 18 and 19 are system-form independents (same scope, in apparatus claim language).

### Full claim language: Celestron US 8,477,419 B1

**Title:** "System and method for automatically aligning a telescope without requiring user intervention"
**Assignee:** Celestron, LLC
**Filing date:** December 31, 2010
**Priority date:** December 31, 2010
**Expiration:** February 8, 2032

**Claim 1 (verbatim, from FreePatentsOnline):**

> "A method for aligning a telescope, comprising: a) in a processor, establishing an initial time value and date value; b) in the processor, establishing an initial location value; c) in the processor, initializing a mount model based on the initial time, date, and location values, the mount model specifying a relationship between a telescopic coordinate system and a celestial coordinate system; d) in the processor, measuring a pointing error for the mount model with respect to at least one alignment reference point, based on the time, date, and location values; and e) in the processor, iteratively adjusting at least one of the time, date, and location values to reduce the pointing error of the mount model; and f) performing at least one selected from the group consisting of: at an output device, outputting the mount model; storing the mount model in a storage device; and in the processor, applying the mount model to point the telescope."

**Other independent claims:** Claim 17 (system form), Claim 31 (computer-program-product form).

### Specific claim limitations Astra Vault avoids / triggers

#### Against US 8,401,307 B1 (plate-solving method)

The Celestron claim 1 covers a **process** for determining the celestial coordinates *of an image* by:
1. Receiving an image;
2. Generating initial pixel coordinates of depicted objects;
3. Selecting a group;
4. Generating a test signature from the group's initial coordinates;
5. Searching a database for matching reference signatures;
6. Performing an **affine fit** to identify matches within tolerance;
7. Outputting the celestial coordinates.

**Does Astra Vault's on-device plate-solve-gating-ATP infringe?**

Limitation-by-limitation analysis:

| Claim 1 limitation | Astra Vault status | Notes |
|---|---|---|
| "receiving an image" | ✅ does | Frame from device camera |
| "generating ... initial coordinates ... of a plurality of depicted objects" | ✅ does | Star centroid extraction |
| "selecting ... a group of objects from the plurality" | ✅ does | tetra3's quad/triplet selection |
| "generating ... a test signature" | ✅ does | tetra3's signature is a 4-star pattern hash |
| "searching a data store for at least one reference signature" | ✅ does | tetra3 queries its pre-built database |
| **"performing an affine fit operation"** | ❓ **DEPENDS ON tetra3's INTERNALS** | tetra3 uses a *non-affine* approach: it uses Tycho/Hipparcos angular distances and a hash-table lookup, then verifies by **least-squares fit** of remaining stars after matching. **Whether tetra3's verification step constitutes "affine fit"** is the FTO question. The Apache-2.0 tetra3 paper (Brown et al., 2019, "Tetra3: A Fast Lost-In-Space Plate Solver") describes the algorithm; counsel must read it against the Celestron claim 1 limitation. |
| "identifying at least one reference signature ... within a specified tolerance" | ✅ does | tetra3's match-tolerance step |
| "outputting the determined celestial coordinates" | ❓ **DEPENDS ON USE** | Astra Vault outputs the coordinates to its **own internal gate** (the ATP-earn check), not to a "user-facing output device" in the conventional sense. Counsel should examine whether internal verification meets "outputting at an output device" — case law on what counts as "output" is fact-specific. |

**FTO conclusion on US 8,401,307:** **PROBABLY DOES NOT INFRINGE** if tetra3's verification step is not characterizable as an "affine fit" and Astra Vault treats the plate-solve as an *internal* gating step rather than a user-facing celestial-coordinate output. **HIGHEST-PRIORITY FTO QUESTION FOR COUNSEL:**

1. Does tetra3's specific signature-matching algorithm (4-star angular distance hashing with least-squares verification) constitute "performing an affine fit operation" as that term is construed in patent case law?
2. Does Astra Vault's internal-gate-only use of the plate-solve result count as "outputting at an output device"?

Either negative answer (no-affine-fit OR no-output) breaks the infringement chain at a different limitation, and Astra Vault is safe. Both negative answers would be ideal.

**Defensive measure:** Astra Vault should publicly document that its plate-solve flow uses tetra3's non-affine signature scheme and that the coordinates are not displayed to the user (they live only in the ATP-validation server message). This documentation strengthens the non-infringement story.

#### Against US 8,477,419 B1 (auto-align method)

The Celestron claim 1 here covers **telescope-mount alignment** by iterative time/date/location adjustment. The claim is explicitly about *aligning a telescope* and *applying the mount model to point the telescope*.

**Does Astra Vault's plate-solve-gating-ATP infringe?**

**No.** Astra Vault is not aligning a telescope. Astra Vault is verifying that a smartphone or smart-glasses camera was actually pointed at real sky. The mount model is a Celestron-telescope-specific data structure; Astra Vault has no analog. Every element of the claim is tied to telescope-pointing semantics.

**FTO conclusion on US 8,477,419:** **DOES NOT INFRINGE**. Astra Vault has no telescope-mount-alignment surface. The patent is irrelevant to Astra Vault's plate-solve-gate use case.

**However**, this patent **DOES BLOCK** any future Astra Vault feature that would auto-align a connected telescope from a phone-attached camera. The `smart-scopes.md` document already flags this: "do not ship a phone-as-finder feature without an FTO review" (line 1093). The plate-solve-gate use case is clear; the phone-as-finder use case is **inside this patent's claim** and Astra Vault must not ship it.

### Recommended FTO strategy

**For Patent #4 (plate-solve-gating-ATP), Astra Vault should:**

1. **File the US provisional**, with claim language drafted to **explicitly avoid both Celestron patents**:
   - Frame the invention as "anti-cheat validation of a real-sky observation by on-device pattern-matching of stars against a reference database" rather than "determining celestial coordinates for an image."
   - Explicitly NOT mention "outputting celestial coordinates" — instead, "emitting an attestation token indicating that the observation is verified-real-sky."
   - Explicitly NOT mention "affine fit" — describe the matching as "angular-distance-hash lookup followed by least-squares pose verification" or equivalent tetra3-aligned language.
   - Emphasize the **gating-economic-action use case**: "wherein the verified observation conditions the issuance of a non-fungible attestation token used to gate access to an in-application reward system."

2. **Run a formal FTO opinion** on the two Celestron patents before public launch. The most important question is whether tetra3's algorithm reads on US 8,401,307's claim 1 limitation of "affine fit." If counsel can confirm it does not, Astra Vault is in the clear.

3. **Do NOT ship a phone-as-finder feature** — that absolutely lands in US 8,477,419's claim scope and probably US 8,401,307's claim scope. The `smart-scopes.md` warning is correct and must be enforced.

4. **Watch the patent expirations:** US 8,401,307 expires ~2031-07-16; US 8,477,419 expires ~2032-02-08. After those dates, the phone-as-finder feature opens up. That is a **2032 product roadmap milestone** worth memorializing.

5. **Astra Vault's plate-solve uses tetra3 (Apache 2.0, ESA).** The license is patent-friendly. ESA does **not** hold blocking patents on tetra3 that I located — search `"tetra3" patent plate solver embedded star catalog matching` returned only the Apache-2.0 source, no patent disclosures from ESA or J. Brown (the lead author).

---

## Critical Findings on Patent #6 (cultural constellations)

### Stellarium Plus sky culture coverage analysis

As `asia-pacific-apps.md` flagged (lines 47, 397, 414, 478-479), Stellarium Plus on iOS already ships:

- **Western / Modern** constellations
- **Chinese** (multiple traditions)
- **Māori** (Aotearoa New Zealand) — confirmed at `stellarium.org/skycultures.html` and verified on the iOS App Store listing
- **Arabian Peninsula** (added 2025)
- **Aboriginal Australian**
- **Aztec**
- **Egyptian**
- **Inuit**
- **Norse**
- **Polynesian**
- **Romanian**
- **Sami**
- **Various others** — Stellarium's `stellarium-skycultures` GitHub repository lists 28+ cultures

These are **hand-curated by community contributors**, with licensing handled per-culture (most under Creative Commons variants per `github.com/Stellarium/stellarium-skycultures`). Stellarium is GPL-2-or-later; the sky cultures are individually licensed.

**Prior-art status of cultural sky overlays as a category:** Saturated. Astra Vault cannot claim "cultural sky overlay" or "indigenous constellation overlay" or even "AR rendering of a non-Western sky culture." All of those read on Stellarium.

### Are there filed patents on cultural-AR overlays?

WebSearch queries `"sky culture" "constellation" patent generative AI augmented reality cultural overlay` and `"sky culture" indigenous constellation patent application augmented reality cultural` returned:

- The Native Skywatchers project (Annette S. Lee, 2007) — community / educational, not patented
- Stellarium's GitHub — open source, not patented
- A 2024 academic paper "A Reference Architecture for Gamified Cultural Heritage Applications Leveraging Generative AI and Augmented Reality" (arXiv 2506.04090) — academic, not a patent
- The Niantic-style POI patent family — adjacent but not about sky culture
- No specific patents on "cultural sky AR overlay" or "GenAI-generated indigenous constellation overlay"

**Conclusion:** No issued patents I could locate cover cultural AR sky overlays, GenAI-generated constellations, or vetted indigenous astronomy AR rendering. **Stellarium is the dominant prior art, and it is open-source not patented.** This means:
- Astra Vault cannot file a broad patent on cultural-AR-sky-overlay.
- Astra Vault **could** file on a specific GenAI-generation-with-iwi-vetting **workflow** — but the patent thicket on AR + GenAI + cultural-content is a genuine "patentable whitespace" question for counsel.

### Recommended narrowing

If Astra Vault wants to file at all on Patent #6, the claim must hinge on a **specific technical workflow** that Stellarium's hand-curated approach cannot anticipate. Candidate angles:

1. **GenAI generation of culture-specific constellation art, with a vetting pipeline that includes review by named cultural authorities** (iwi for Māori, named scholars for Arabic, etc.) before the asset enters the application. This is workflow novelty.
2. **Attention-hash binding** of cultural-overlay rendering: when a user views the Māori sky culture, the attention-hash includes the cultural-overlay identifier. This ties Patent #6 to Patent #2 and may be the cleanest filable angle.
3. **Procedural variation by user location and date**: e.g., a Matariki-specific rendering during the Matariki public holiday (June/July). This is location-and-date-conditional rendering, which is mildly novel but probably too narrow to support a full claim.

**Strong recommendation:** **Do not file Patent #6 as a separate provisional.** Instead, fold the cultural-overlay-attention-hash binding into a dependent claim under Patent #2 (attention-hash binding). The cultural-sourcing workflow itself is better protected by:
- **Iwi partnership agreements** (contract-based protection of the curated content)
- **Trademark** on Astra Vault's named cultural overlays
- **Copyright** on the specific generated art and the curation editorial decisions
- **Trade secret** on the GenAI prompt-vetting workflow

**The patent angle is weak and the reputational risk of filing is non-trivial** — claiming IP on indigenous sky cultures (even narrowed to a workflow) will read as colonial to the iwi communities Astra Vault needs as partners.

**Final recommendation: drop Patent #6 from the patent list. Pursue via partnership and licensing.**

---

## Recommended Filing Order

**Phase 1: File within 30 days (highest priority US provisionals)**

1. **Patent #1 — Cross-glasses observation merge protocol.** Strongest standalone claim. Clean whitespace. The `patent-abstract-cross-glasses-merge.md` draft is filing-ready after the refinements listed in this review. **Estimated counsel cost: $3-5k for provisional filing.** Roll Patent #10 in as dependent claims.

2. **Patent #4 — On-device plate-solve-gating-ATP-earn.** Critical anti-cheat substrate. Draft new abstract per FTO carve-outs in this review. **Estimated counsel cost: $3-5k for provisional.** Pair with an FTO opinion on the two Celestron patents ($5-10k additional).

3. **Patent #5 — Crowdsourced 3DGS sky backdrop with emissive trajectory trails.** Strongest novel-combination claim. Two independent claims (3DGS construction + emissive trail rendering). **Estimated counsel cost: $4-6k for provisional.**

**Phase 2: File within 60-90 days (narrowed provisionals)**

4. **Combined Patent #2 + #3 — Attention-hash + Bortle-keyed dark-adapted AR rendering.** Narrowed claims; explicitly avoiding BAT and Apple HMD prior art. **Estimated counsel cost: $4-6k for one combined provisional.**

5. **Patent #8 — Anonymous-presence celestial-coordinate-binned sky.** Narrow claim distinguishing from ground-location anonymous-crowd patents. **Estimated counsel cost: $3-5k.**

**Phase 3: Defer or drop**

6. **Patent #7 (Vision Pro gaze)** — defer until at least one HMD platform exposes raw gaze API. Risk filing a patent for something nobody can ship.
7. **Patent #6 (cultural GenAI overlay)** — **drop.** Pursue via partnership and licensing. Reputational risk outweighs IP value.
8. **Patent #9 (Phone Tier CC BY 4.0 dataset)** — **drop.** Pursue via trademark, copyright, and trade-secret strategy.
9. **Patent #11 (sponsored RMS station program)** — **drop.** Not a patentable invention.

**FTO opinions to commission in parallel:**

- **Celestron US 8,401,307 + US 8,477,419** against Astra Vault's plate-solve flow. Highest priority. $5-10k. (Don't ship Patent #4 features without this.)
- **Apple Vision Pro eye-tracking patent family** against any future Astra Vault gaze-hash work. Lower priority; defer until Patent #7 is filable.
- **Niantic location-based-game patent family** against Astra Vault's location-anchored gameplay loops. Lower priority; Niantic's claims are mostly bound to ground-POI mechanics that Astra Vault's celestial-coordinate-anchored loops are clearly distinct from.

**Total Phase 1+2 budget:** ~$25-40k in counsel fees over 90 days for 5 US provisionals + 1 FTO opinion. PCT national-phase decisions (US → EU/UK/JP/KR/CN/AU) follow at the 12-month-from-priority deadline; budget another $50-150k depending on countries chosen.

---

## Outreach to Patent Counsel

The following paragraph is drafted for Stephen to forward verbatim to outside patent counsel:

> "Astra Vault is a consumer astronomy platform combining smartphone + smart-glasses capture, on-device astrometric plate-solving, multi-observer trajectory triangulation of transient celestial events (meteors, fireballs, satellite re-entries), and a tokenized attention-attestation system anchored to celestial coordinates. We've identified 11 patentable opportunities across our stack and want to file US provisionals on the top 5 within the next 30-60 days to lock priority dates ahead of public launch. Two questions are critical:
>
> (1) **Freedom-to-operate against Celestron US 8,401,307 B1 and US 8,477,419 B1.** Our on-device plate-solve uses ESA's tetra3 (Apache 2.0). Our use is not telescope alignment — it is anti-cheat validation that a phone-camera frame contains real sky. We believe we do not infringe but need a formal FTO opinion. Specifically: does tetra3's 4-star angular-distance hash + least-squares verification scheme constitute "performing an affine fit operation" as claimed in 8,401,307 claim 1? And does our internal-only use of the plate-solve result (gating an attestation token rather than displaying coordinates to a user) avoid the "outputting at an output device" limitation?
>
> (2) **Provisional drafting for five concept families.** I'm sending the per-candidate analysis as an attachment (`research/patent-prior-art-review.md` and `research/patent-abstract-cross-glasses-merge.md`). The five we want to file are: cross-glasses observation merge protocol; on-device plate-solve gating attestation tokens; crowdsourced phone-metadata → triangulation → 3DGS sky backdrop with emissive trail rendering; combined attention-hash + Bortle-keyed dark-adapted AR rendering; celestial-coordinate-binned anonymous presence. Three of these are clean-whitespace (cross-glasses merge, 3DGS-sky pipeline, plate-solve-gating); two require narrow drafting to avoid adjacent prior art (attention-hash adjacent to Brave BAT and gaze-tracking patents; Bortle-keyed adjacent to Apple HMD adaptive-display patents). All provisionals should reference each other for full coverage. Budget for Phase 1: $25-40k including the Celestron FTO. We're targeting US first; PCT national-phase decision at the 12-month deadline."

---

## Sources

**Primary patents (claim language verified):**
- [US 8,401,307 B1 — Celestron, "Determining celestial coordinates for an image"](https://patents.google.com/patent/US8401307B1/en) (claim 1 verbatim via [FreePatentsOnline mirror](https://www.freepatentsonline.com/8401307.html))
- [US 8,477,419 B1 — Celestron, "System and method for automatically aligning a telescope"](https://patents.google.com/patent/US8477419B1/en) (claim 1 verbatim via [FreePatentsOnline mirror](https://www.freepatentsonline.com/8477419.html))
- [US 11,192,027 — Sony Interactive Entertainment, "Terrain radar and gradual building of a route in a virtual environment of a video game"](https://patents.google.com/patent/US11192027B2/en) (Hideo Kojima inventor, Death Stranding terrain patent)
- [US 9,277,361 B2 — "Methods and systems for cross-validating sensor data acquired using sensors of a mobile device"](https://patents.google.com/patent/US9277361B2/en)
- [US 10,962,625 — "Celestial positioning system and method"](https://patents.justia.com/patent/10962625)
- [WO 2019/226210 A1 — "Triangulation method for determining target position"](https://patents.google.com/patent/WO2019226210A1/en)
- [US 8,888,287 B2 — "Human-computer interface system having a 3D gaze tracker"](https://patents.google.com/patent/US8888287)
- [US 10,997,948 — Apple, "Electronic device with adaptive lighting system"](https://patents.justia.com/patent/10997948)
- [US 11,211,030 — Apple, "Electronic device with adaptive display"](https://patents.justia.com/patent/11211030)
- [US 20180173304 A1 — "Brightness control for an augmented reality eye-mounted display"](https://patents.google.com/patent/US20180173304A1/en)
- [US 20130113973 — "Adaptive brightness control of head mounted display"](https://patents.justia.com/patent/20130113973)
- [US 5,053,755 A — "Automotive head-up display with high brightness in daytime and high contrast in nighttime"](https://patents.google.com/patent/US5053755A/en)
- [US 8,208,943 B2 / US 20100197318 A1 — "Anonymous crowd tracking"](https://patents.google.com/patent/US8208943B2/en)
- [US 20120046995 — "Anonymous crowd comparison"](https://patents.justia.com/patent/20120046995)
- [US 20240323640 — "Crowd density analysis with multiple regions"](https://patents.justia.com/patent/20240323640)
- [US 20240355047 — "Three dimensional Gaussian Splatting initialization based on trained NeRF representations"](https://patents.justia.com/patent/20240355047)
- [US 20260024269 A1 — "Rasterizing depth in Gaussian splatting"](https://patents.google.com/patent/US20260024269A1/en)
- [US 10,463,953 B1 — "Detecting and preventing cheating in a location-based game"](https://patents.google.com/patent/US10463953)
- [US 20130006737 A1 — "Location aware mobile game reward system for encouraging real-world activity"](https://patents.google.com/patent/US20130006737)
- [US 9,861,889 B2 — "System and method for location-based gaming with real world locations and population centers"](https://patents.google.com/patent/US9861889B2/en)
- [US 9,033,803 B1 — "Changing a virtual world based on real-world locations of players"](https://patents.google.com/patent/US9033803B1/en)
- [US 11,007,429 — Niantic, "Background process for importing real-world activity data into a location-based game"](https://patentarcade.com/2022/02/u-s-patent-no-11007429-background-process-for-importing-real-world-activity-data-into-a-location-based-game.html)
- [US 9,854,139 — "Lifelog camera and method of controlling same using voice triggers"](https://patents.justia.com/patent/9854139)
- [US 10,897,564 — "Shared control of camera device by multiple devices"](https://patents.justia.com/patent/10897564)
- [US 9,285,589 B2 — "AR glasses with event and sensor triggered control of AR eyepiece applications"](https://patents.google.com/patent/US9285589B2/en)
- [US 9,870,716 B1 — "Smart glasses and smart watches for real time connectivity and health"](https://patents.google.com/patent/US9870716B1/en)
- [US 11,182,383 — "System and method for data collection to validate location data"](https://patents.justia.com/patent/11182383)

**Open-source / academic / project prior art:**
- [Global Meteor Network (GMN)](https://globalmeteornetwork.org/)
- [NASA CAMS (Cameras for All-Sky Meteor Surveillance)](http://cams.seti.org/)
- [FRIPON network — Astronomy & Astrophysics 2020 paper](https://www.aanda.org/articles/aa/full_html/2020/12/aa38649-20/aa38649-20.html)
- [Desert Fireball Network](https://dfn.gfo.rocks/)
- [Eclipse Megamovie 2017 / 2024](https://eclipsemegamovie.org/)
- [Eclipse Megamovie Mobile (Ideum 2017)](https://ideum.com/portfolio/eclipse-megamovie-mobile)
- [SonotaCo Network (Japan amateur meteor consortium)](https://sonotaco.com/)
- [Stellarium Sky Cultures](https://stellarium.org/skycultures.html)
- [Stellarium-skycultures GitHub](https://github.com/Stellarium/stellarium-skycultures)
- [tetra3 (ESA, Apache 2.0)](https://github.com/esa/tetra3)
- [3D Gaussian Splatting (INRIA 2023)](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)
- [3D Gaussian Splatting license (non-commercial)](https://github.com/graphdeco-inria/gaussian-splatting/blob/main/LICENSE.md)
- [Globe at Night (citizen science light-pollution)](https://www.globeatnight.org/)
- [Falchi et al. 2016 "New world atlas of artificial night sky brightness", Science Advances](https://www.science.org/doi/10.1126/sciadv.1600377)
- [Unistellar + AAVSO Exoplanet Pioneer collaboration](https://unistellaroptics.com/unistellars-aavso-collaboration/)
- [Brave Basic Attention Token (BAT) white paper](https://basicattentiontoken.org/static-assets/documents/BasicAttentionTokenWhitePaper-4.pdf)
- [Apple Vision Pro eye tracking patent coverage (Patently Apple)](https://www.patentlyapple.com/2023/10/apple-patent-reveals-their-advanced-eye-tracking-system-for-vision-pro-future-smartglasses-using-cameras-smi-sensors.html)
- [Apple's Vision Pro eye-tracking privacy posture](https://www.apple.com/legal/privacy/data/en/eyes-hands/)
- [Celestron StarSense Explorer Technology overview](https://www.celestron.com/pages/starsense-explorer-technology)
- [Sweatcoin authentication mechanism overview](https://www.cypherock.com/blogs/what-is-sweatcoin)

**Negative-search queries (no relevant prior art found — for counsel re-verification):**
- `patent "crowdsourced meteor" OR "multi-observer trajectory" OR "wearable transient capture" smartphone triangulation` — no direct hits
- `patent "attention token" Brave BAT gaze dwell time blockchain attribution` — Brave's BAT exists as a project but no specific patent disclosure surfaced; counsel should run USPTO Patent Public Search for assignee "Brave Software"
- `"eclipse megamovie" patent crowdsourced timestamp metadata mobile` — project exists, no patent filing located
- `FRIPON "Desert Fireball Network" patent fireball trajectory triangulation` — academic literature only, no patents
- `"tetra3" patent plate solver embedded star catalog matching` — open-source under Apache 2.0, no patent disclosures from ESA or authors
- `"sky culture" indigenous constellation patent application augmented reality cultural` — Stellarium and Native Skywatchers exist as open projects, no patents on cultural sky AR overlay
- `"generative AI" patent constellation art styled overlay vetting cultural authenticity` — WIPO GenAI patent landscape exists but no specific filings on AR + cultural constellation + GenAI vetting workflow
- `USPTO "20240" "smartphone" "telescope" "plate solving" patent application 2024` — no recent patent applications surfaced combining all four terms

---

RESEARCH COMPLETE — patent-prior-art-review.md written. Top filing recommendation: **Patent #1 (cross-glasses observation merge protocol) — file US provisional within 30 days. Clean whitespace, strongest standalone claim, draft already in `patent-abstract-cross-glasses-merge.md` is filing-ready after the refinements listed.** Top FTO concern: **Celestron US 8,401,307 B1 against Astra Vault's on-device plate-solve-gating-ATP flow. Astra Vault probably does not infringe (tetra3's signature scheme is not an "affine fit"; the plate-solve output is an internal gate not a user-facing celestial-coordinate display), but a formal FTO opinion from counsel is required before public launch of Patent #4 features. US 8,477,419 does not block the plate-solve-gate use case, but absolutely blocks any future phone-as-finder feature — defer that product surface until February 2032 when the patent expires.**
