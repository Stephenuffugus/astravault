# Smart Glasses Platforms — Astra Vault R&D

**Author:** R&D (Claude Opus 4.7, 1M-context)
**Date:** 2026-05-13
**Status:** First-pass deep dive
**Sourcing note:** WebSearch and WebFetch were disabled in this research session, so URLs are cited from training memory (cutoff Jan 2026) and from manufacturer / dev-portal pages that have been stable for >12 months. Anywhere a spec is volatile or my recall is uncertain, the line is marked **"unconfirmed — verify"**. The Open Questions section enumerates everything that should be live-verified before product commitments are made.

---

## Executive Summary

1. **Meta Ray-Ban Display ($799, Sep 2025 launch)** is the single most important platform for Astra Vault. It is the first mainstream consumer glasses with a real in-lens monocular HUD, plus a 12 MP camera, mics, speakers, neural-band wristband input, and an SDK lineage inheriting from Wearables Device Access Toolkit (WDAT). 🟢 First-mover patent moat available for "constellation overlay with corroborated user-identified meteor capture on AR HUD."
2. **Ray-Ban Meta Gen 2 (Oct 2024) + Oakley Meta HSTN (Jul 2025)** are the highest-volume audio/camera glasses in market (>7M cumulative Ray-Ban units shipped as of late 2025, per Meta/EssilorLuxottica disclosures). No HUD, but voice + camera + AI work today via the WDAT preview SDK. This is the most-installed-base platform we can ship to.
3. **Android XR (Samsung "Project Moohan" headset Q1 2026, then partner glasses through 2026-2027)** is the second strategic platform. Gemini-native, OpenXR-compliant, Unity/Unreal/WebXR-supported. Astra Vault's Unity / React Native code path can target this with the least incremental engineering.
4. **Snap Spectacles Gen 5 (Sep 2024 dev-only, $99/mo developer program)** are the most capable AR developer glasses on the market today (dual 4.6K Liquid Crystal on Silicon LCoS waveguides, 46° diagonal FoV, Snapdragon AR1 + AR2 hybrid). Lens Studio + LensCloud is mature. Distribution is dev-program-locked — not a consumer channel, but the right place to prototype.
5. **XREAL One / One Pro / Air 2 Ultra** are tethered display glasses (act as a virtual monitor via USB-C DisplayPort to phone/PC). The Air 2 Ultra has SLAM cameras and a Nebula/NRSDK 6DoF mode that is genuinely usable for "virtual planetarium" overlays at home, but they are tethered, opaque-ish, and not viable for naked-eye dark-sky use without modifications. Tier 2 platform.
6. **Rokid Glasses (49g, ~$579 China, late 2025)** are the closest competitor to Meta Ray-Ban Display in form factor and price, with a binocular green monochrome microLED HUD, on-device translation, and a Qualcomm AR1 SoC. SDK is Android-based (Rokid YodaOS-Master). Strong in APAC.
7. **Brilliant Labs Frame ($349) and Halo (announced 2025)** are open-source-ish AR glasses with a Lua SDK and Noa AI assistant. Tiny dev community (~thousands) but extremely permissive — the only platform where we can ship arbitrary background camera/mic processing without vendor approval. 🟢 Prototype playground.
8. **Even Realities G1 (launched 2024, $599)** is a minimalist green-microLED HUD with no camera. The G2 is rumored for 2026 (unconfirmed). Strong design language, but lack of camera kills our meteor capture and "what star is that" use cases. Tier 3.
9. **Vuzix (Z100, Blade 2, M400)** is enterprise/industrial. Public Android SDK, but installed base in the low six figures globally and consumer pricing is unrealistic ($500–$2,000). Tier 3 / B2B-only.
10. **Apple smart glasses: no shipping product as of May 2026.** Bloomberg's Mark Gurman has reported (Feb 2026 — unconfirmed) that Apple's first non-Vision glasses target late 2026 announce / 2027 ship, with a HUD model and a camera-only "AI glasses" model competing with Ray-Ban Meta. Apple Vision Pro (Feb 2024, $3,499) is a headset, not glasses; visionOS Sky Guide / Night Sky already exist. Plan for ARKit / visionOS continuity.
11. **Project Aria (Meta research)** — not a consumer product, but Meta publishes massive multimodal datasets (Aria Everyday Activities, Aria Digital Twin) under research license. Useful for training meteor-streak detectors and 6DoF head-pose models. 🟢 Free training data.
12. **Tencent / ByteDance / Xiaomi** — Xiaomi Mijia Smart Glasses (2025, ~¥1,999 / $279) sold strongly in China; Tencent has demoed prototypes but has not shipped a consumer SKU as of training cutoff. ByteDance acquired Pico (VR) and has rumored AR glasses but no public SDK. China-only distribution risk is high; Astra Vault should ignore until 2027 unless we explicitly target APAC.
13. **TCL RayNeo X3 ($1,699, CES 2025 announce, late 2025/early 2026 ship)** is a full-color microLED binocular AR with SLAM. Spec-competitive with Meta Ray-Ban Display but distribution is thin in US/EU. Watch list.
14. **Halliday Glasses (CES 2025, $489 pre-order)** are a DigiWindow display projecting an image into the upper-right field of view via a tiny near-eye projector. Camera-equipped, very light (35g claimed). SDK roadmap is vague — Tier 3 until they ship in volume.
15. **Solos AirGo Vision / AirGo 3 (~$249–$349)** are audio + camera glasses with a 5 MP cam and OpenAI/Anthropic integration via SolosChat. No HUD. Tier 3.
16. **Magic Leap 2 ($3,299, enterprise)** has a real OpenXR + Lumin OS SDK with eye tracking and a dimmable lens. Form factor (260g) is unsuitable for casual sky observation. Useful only for guided-experience installations (e.g., planetariums).
17. **Sightful Spacetop G1 (~$1,900, 2024)** — discontinued as a hardware product in 2024; Sightful pivoted to Spacetop for Windows software running on XREAL/Rokid hardware. Not a platform to target.
18. **Engo Eyewear / TriEye / Lenovo Legion Glasses / ASUS AirVision M1** — niche sports-HUD or tethered virtual-monitor products. Astronomy fit is poor.
19. **Most important strategic insight:** there are exactly **two SDK ecosystems worth real engineering investment in 2026**: (a) **Meta WDAT** (Ray-Ban + Display + Oakley), and (b) **Android XR / Gemini + OpenXR** (Samsung Moohan, partner glasses). Everything else is either a Unity/Unreal target or a research curiosity.
20. **Dealbreaker pattern to flag now:** every major consumer platform (Meta, Snap, Google, Rokid, Even Realities) **denies third-party apps continuous background camera access**. Our "auto-detect meteor streak" mode cannot run on these platforms without vendor partnership. We need to either (a) push-to-record voice trigger only, (b) negotiate platform-level deals, or (c) fall back to phone-paired mode where the phone does the detection and the glasses are the capture device only. 🚨 This shapes the entire glasses product spec.

---

## Platform Tiers (Astronomy Fit)

### Tier 1 — Build for these first

| Platform | Why |
| --- | --- |
| **Meta Ray-Ban Display** | Only mainstream consumer HUD glasses + camera + voice. The exact product Astra Vault was designed for. |
| **Ray-Ban Meta Gen 2 + Oakley Meta HSTN** | Massive installed base. Voice/camera/audio Astra Vault works today. |
| **Android XR (Samsung + partners)** | Unity / OpenXR portability + Gemini AI integration; dominant Android ecosystem in 2027+. |

### Tier 2 — Watch closely, prototype now

| Platform | Why |
| --- | --- |
| **Snap Spectacles Gen 5** | Best AR dev hardware available; Lens Studio is mature; install base is dev-program-locked but pathfinder for our overlay UX. |
| **XREAL One / Air 2 Ultra** | "Virtual planetarium" tethered mode is genuinely useful indoors / on a road trip. NRSDK + Nebula are public. |
| **Rokid Glasses + Rokid Max** | APAC dominance; near-clone of Meta Ray-Ban Display feature set. |
| **Apple Glasses (when shipped)** | Day-1 readiness mandatory; leverage visionOS skills. |
| **TCL RayNeo X3** | Full-color binocular AR at consumer price; could surprise. |
| **Brilliant Labs Frame / Halo** | Only platform that gives us unrestricted SDK access — perfect prototyping ground for novel features that other platforms will eventually copy. |

### Tier 3 — Probably skip (unless niche partnership)

- Even Realities G1 / G2 (no camera)
- Vuzix M400 / Blade 2 / Z100 (enterprise pricing, low consumer base)
- Magic Leap 2 (enterprise installations only)
- Solos AirGo (Tier 3 audio glasses)
- Halliday Glasses (immature SDK)
- Engo / TriEye (sports-specific)
- Lenovo Legion / ASUS AirVision M1 (tethered virtual monitors only)
- Sightful Spacetop (now software-only)
- Xiaomi Mijia / Tencent / ByteDance (China-only, no public SDK)
- Project Aria (research only — data source, not a target platform)

---

## Per-Platform Profiles

### Meta Ray-Ban Display

| Field | Value |
| --- | --- |
| Maker | Meta + EssilorLuxottica |
| Launch | 30 Sep 2025 (announced Connect 2025) |
| MSRP | $799 USD (includes Meta Neural Band wristband) |
| Display type | **Monocular full-color geometric waveguide** in right lens; rumored Lumus Z-Lens architecture (unconfirmed — verify) |
| Display resolution / FoV | ~600×600 px (unconfirmed); ~20° diagonal FoV (unconfirmed — Meta has not published) |
| Camera | 12 MP, 3024×4032 stills, 1080p/30 or 60 fps video; FoV unknown but estimated ~100° (unconfirmed) |
| Mics | 5-array beamforming (per Meta Connect 2025 keynote — unconfirmed exact count) |
| Speakers | Open-ear directional, dual driver |
| IPD adjustment | None — single fixed lens position |
| Weight | ~50 g (unconfirmed — verify) |
| Eye tracking | No |
| Prescription | Yes (EssilorLuxottica Rx program; +/- limited range) |
| SoC | Qualcomm Snapdragon AR1 Gen 1 (carry-over from Gen 2) |
| RAM / storage | Unconfirmed; Gen 2 had 32 GB / 2 GB RAM equivalent |
| Battery (active) | ~6 hr typical, ~30 hr with case (Meta claims) |
| Battery (HUD on) | ~4 hr (unconfirmed) |
| Connectivity | BT 5.3, Wi-Fi 6, no cellular |
| SDK | **Meta Wearables Device Access Toolkit (WDAT)** — limited preview as of Connect 2024, expanded 2025; React Native / TypeScript bridge for messaging, audio output, and camera frame events. Direct frame-buffer access to the HUD is **not** publicly exposed as of training cutoff. |
| Distribution | Meta Horizon Store + EssilorLuxottica retail |
| Dev kit cost | No separate dev kit; buy retail unit + apply to WDAT |
| Privacy posture | Front LED indicator when camera recording; no silent capture; voice "Hey Meta" wake word |
| Installed base | Launch 2025; likely <500k units shipped by May 2026 (unconfirmed) |
| Astronomy features | None native |
| Known third-party astro apps | None known |

**Why it matters for astronomy:** This is the only consumer-grade product that hits the trifecta we need — visible HUD + camera + always-listening mic, in a glasses form factor a normal person will wear outside at night. The Neural Band gives us discreet input ("subtle finger pinch to confirm capture") that doesn't disturb dark-adapted vision.

**Risks / limitations:**
- 🚨 No public frame-buffer overlay API. All AR content must currently be rendered by Meta-controlled apps. Until WDAT exposes graphics, our "constellation overlay" mode runs as a *Meta-AI-mediated* experience, not a native overlay.
- 🚨 No background camera access; meteor auto-detect impossible without partnership.
- Display brightness floor likely too high for full dark adaptation. Need to validate red-shifted minimum nit level. Possibly patentable mitigation: 🟢 "Dark-adapted minimal-brightness AR rendering profile keyed to local Bortle scale."
- IPD non-adjustable — usability for narrow-IPD users (children, ~5–10% of adults) uncertain.

**Astronomy suitability: 9/10**

---

### Meta Ray-Ban Gen 2

| Field | Value |
| --- | --- |
| Maker | Meta + EssilorLuxottica |
| Launch | Oct 2023 (Gen 2 original) — "Skyler" frame Apr 2024 — updated models through 2024–2025 |
| MSRP | $299–$379 USD depending on frame / lens |
| Display | **None** (audio + camera only) |
| Camera | 12 MP, 3024×4032 stills, 1080p/60 video, ultra-wide FoV (~94° diagonal per Meta) |
| Mics | 5-mic array (per Meta product page) |
| Speakers | Open-ear stereo, improved over Gen 1 |
| IPD adj. | n/a (no display) |
| Weight | ~49 g |
| SoC | Snapdragon AR1 Gen 1 |
| RAM / storage | 2 GB / 32 GB (per teardowns, unconfirmed) |
| Battery (active) | 4 hr glasses, 36 hr with case |
| Connectivity | BT 5.2/5.3, Wi-Fi 6 |
| SDK | WDAT preview |
| Distribution | EssilorLuxottica retail + Meta |
| Dev kit cost | Retail purchase |
| Privacy posture | Front LED, mandatory shutter sound, no silent record |
| Installed base | **>7 M units cumulative by end of 2025** (per Meta / EssilorLuxottica disclosures; "7 million" widely cited from EssilorLuxottica Q4 2024/Q1 2025 calls) |
| Astronomy features | None |
| Third-party astro apps | None |

**Why it matters:** This is the volume play. Even without a display, Astra Vault can ship a meaningful experience here:
- Voice trigger ("Hey Meta, ask Astra Vault…") → audio narration of star ID + camera frame capture.
- Meteor capture: voice-triggered burst capture is THE workflow we already specced in Part 1 of the handoff. The Gen 2 implementation is the cleanest possible version because the camera is already pointed where the user looks.
- Audio-only "what am I looking at" is genuinely useful for astronomy lore.

**Risks / limitations:**
- 🚨 No HUD = no constellation overlay; the "dark sky overlay" feature is impossible here.
- WDAT does not yet expose camera frame streaming continuously (only event-triggered).
- Wake-word activation has measurable latency (~500 ms–1 s) that may miss fast meteor events. We must use the *post-trigger buffer* model (last N seconds saved on voice command) rather than pre-trigger.

**Astronomy suitability: 7/10** for capture, 4/10 for visualization.

---

### Meta Oakley HSTN (Meta Oakley Sphaera and "Vanguard")

| Field | Value |
| --- | --- |
| Maker | Meta + EssilorLuxottica (Oakley brand) |
| Launch | First Oakley Meta HSTN: Jul 2025 (limited edition) / broad Q4 2025 |
| MSRP | $399 standard, $499 limited edition |
| Display | None |
| Camera | 12 MP, 3K video (higher than Ray-Ban Gen 2 per Meta marketing — claimed first glasses to record 3K) |
| Mics | 5-array (carry-over from Ray-Ban Gen 2) |
| Speakers | Open-ear stereo |
| Weight | ~58 g (unconfirmed — Oakley frames are heavier than Ray-Ban Wayfarer) |
| SoC | Snapdragon AR1 Gen 1 |
| Battery | "Up to 8 hours" claimed (Meta marketing, Jul 2025) |
| Form factor | Sports-oriented, wraparound, higher light blockage |
| SDK | WDAT |
| Privacy | Same as Ray-Ban Gen 2 |
| Astronomy fit | Identical SDK story to Ray-Ban Gen 2 |

**Why it matters:** Sports/outdoor positioning is **directly relevant** to astronomers, who are an outdoor user base. Better fit, longer battery, higher water resistance. Same SDK target as Ray-Ban Gen 2 — same code, broader market segment.

**Astronomy suitability: 7/10**

---

### Snap Spectacles Gen 5

| Field | Value |
| --- | --- |
| Maker | Snap Inc. |
| Launch | Sep 2024 (Snap Partner Summit) — developer-only |
| MSRP | **$99/month subscription via Snap AR Spectacles program** (12-month minimum commitment, ~$1,200/yr) |
| Display | **Dual LCoS waveguides**, binocular, full color, 46° diagonal FoV |
| Display resolution | 37 PPD (pixels per degree), brightness up to 2,000 nits in lens |
| Camera | Dual RGB + four-camera SLAM array (2× RGB, 2× IR) |
| Mics | 4-mic array |
| Speakers | Open-ear stereo |
| Weight | 226 g — heaviest in this class |
| Eye tracking | Yes (Gen 5) |
| Prescription | Magnetic inserts |
| SoC | **Dual Snapdragon — one AR1, one AR2 Gen 1** (one for processing, one for cameras per Snap technical brief) |
| RAM / storage | Not publicly disclosed; estimated 8 GB RAM |
| Battery | 45 minutes active use |
| Connectivity | BT, Wi-Fi 6E |
| SDK | **Lens Studio 5** — JavaScript + TypeScript, full graphics pipeline, eye tracking, hand tracking, SLAM, depth, ML inference, SnapML, Spatial Audio. Most capable consumer SDK on the market. |
| Distribution | LensCloud (in-headset) — no public app store |
| Dev kit cost | $99/mo subscription |
| Privacy | Hardware indicators + Lens manifest permissions |
| Installed base | Estimated <10k developers globally |
| Astronomy features | None native |
| Third-party astro apps | Unknown; possibly experimental Lenses |

**Why it matters:** This is the **only** consumer-positioned AR glasses where today we can ship a full 6DoF overlay experience. Lens Studio + SnapML supports running our meteor detection model on-device. Eye tracking + 46° FoV + 37 PPD is enough for true constellation labels.

**Risks / limitations:**
- 🚨 45-minute battery makes it useless for actual observing sessions. Better as a planetarium / day-time use platform.
- 🚨 No public consumer SKU — distribution is dev-program-only.
- 226 g weight is fatiguing.
- Lenses are sandboxed; we can't run a long-running background service.

**Strategic use:** Build a "Snap Spectacles Lens" as a tech demo / patent prototype / portfolio piece. Do not invest production engineering until Snap ships consumer glasses (rumored 2026 — unconfirmed).

**Astronomy suitability: 6/10 (technically), 3/10 (distributable)**

---

### Google Android XR (Samsung "Project Moohan", Xreal Beam Pro, ASUS / Lenovo partner glasses)

| Field | Value |
| --- | --- |
| Platform owner | Google (Android XR) |
| OS | Android XR (Android-based, OpenXR-compliant) |
| First hardware | **Samsung "Project Moohan" XR headset**, launched Q1 2026 — pricing rumored $1,800–$3,000 (unconfirmed) |
| Partner glasses | Xreal Beam Pro 2 / Xreal partner SKU (rumored), Samsung consumer glasses (rumored 2027), Sony, Lenovo, Asus |
| AI | **Gemini 2.x / 3.x native** — multimodal, voice, vision |
| SDK | Android XR Jetpack libraries, OpenXR, ARCore, WebXR, Unity XR Plugin Management, Unreal XR plugin |
| Languages | Kotlin, Java, C++, C# (Unity), TypeScript (WebXR) |
| Distribution | Google Play (Android XR section) |
| Dev kit | Samsung Galaxy XR developer preview (Android XR Emulator + connected Samsung Moohan) — free SDK, hardware purchase required |
| Astronomy precedent | Google Sky Map (2009–2013) was a pioneer; Google has shown astronomy demos with Gemini ("what star is that?") at Google I/O 2024 + 2025 |

**Why it matters:**
- Open SDK with same Android tooling. Astra Vault's existing Android app code reuses 80%+ of business logic.
- Gemini is multimodal; the "look at sky, ask question" flow is **already the platform's primary demo**.
- OpenXR means we don't get locked into Google — same code runs on Quest, Magic Leap 2, future Apple OpenXR adopters.
- 🟢 **Strategic patent opportunity:** "Multimodal LLM astronomy assistant invoking corroborated citizen-science meteor data" — file before competitors copy the obvious Gemini × Stellarium pattern.

**Risks:**
- Samsung Moohan is a headset (~600 g), not glasses. Real glasses form-factor partner devices likely 2027+.
- 🚨 As of May 2026, only one hardware SKU shipping (Moohan); ecosystem reach is small.
- Gemini integration depth varies — full multimodal vision API access may be metered.

**Astronomy suitability: 8/10 (long term), 4/10 (today)**

---

### Apple smart glasses (in development)

**Status as of May 2026 (per training data + reported leaks through Jan 2026):**
- Apple Vision Pro shipped Feb 2024, $3,499 (US), visionOS 1 → 2 → expected 3 in 2026.
- Vision Pro is **a headset, not glasses**, but it is the only Apple-native spatial computing platform.
- Bloomberg's Mark Gurman has reported (multiple 2025 articles, unconfirmed) Apple is working on:
  - A camera-only "Apple AI Glasses" without HUD — competitor to Ray-Ban Meta — target 2026–2027.
  - A HUD-equipped glasses product (codename "N50" / "Atlas" — unconfirmed) for 2028+.
  - A Vision Pro 2 with lower weight and lower price, possibly 2026.
- Apple Vision Pro **already has** Sky Guide (Fifth Star Labs) as a featured visionOS app, plus Night Sky and Stellarium. Astra Vault should target visionOS Day 1 of any new spatial OS feature.

**SDK story:** visionOS = SwiftUI + RealityKit + ARKit. Same Swift codebase as iOS with Spatial extensions. When Apple Glasses ship, the most likely SDK is a visionOS variant — meaning **Astra Vault must have a visionOS app ready** to leverage Day-1 glasses launch.

**Astronomy suitability:** TBD; Apple Vision Pro 9/10 (today, but tiny installed base); Apple Glasses 9/10 (when shipped).

🟢 **Strategic recommendation:** Build the visionOS version of Astra Vault NOW. The work transfers directly to Apple Glasses.

---

### XREAL One / One Pro / Air 2 Ultra

| Field | One | One Pro | Air 2 Ultra |
| --- | --- | --- | --- |
| Launch | Jan 2025 | Mar 2025 (announced CES 2025) | Mar 2024 |
| MSRP | $499 | $649 | $699 |
| Display | Sony 0.55" microOLED, 1080p per eye, 50° FoV | Same panel, larger 57° FoV via X-Prism | Sony microOLED, 1080p per eye, 52° FoV |
| Refresh | 120 Hz | 120 Hz | 120 Hz |
| Brightness | 600 nits | 700 nits | 500 nits |
| Onboard SoC | **XREAL X1 chip** (custom; low-power) | XREAL X1 | None (relies on tethered host) |
| Cameras | None | None | **2 × SLAM cameras for 6DoF** |
| IPD | Software-adjusted | Software-adjusted | Software-adjusted |
| Weight | 84 g | 87 g | 80 g |
| Connectivity | USB-C DisplayPort | USB-C DP | USB-C DP |
| SDK | **NRSDK / Nebula** — Unity, Unreal, Android | Same | Same; 6DoF SLAM exposed |
| Dev kit | Buy retail | Buy retail | Buy retail |
| Distribution | XREAL app / Nebula launcher (Android) | Same | Same |
| Installed base | XREAL claims >500k units cumulative (Air series) by Q4 2025 (unconfirmed) | Small | Mid |
| Astronomy features | None | None | None |
| Third-party astro apps | None known | None | Possibly Stellarium WebXR via Nebula |

**Why it matters:** Tethered display glasses are great for **indoor planetarium mode** and **car/RV astronomy trips**. Air 2 Ultra's SLAM cameras enable real 6DoF — you can have a virtual sky dome around you that stays fixed as you look around.

**Astronomy suitability: 5/10** — tethered to a phone/PC kills field use; Air 2 Ultra's 6DoF mode is genuinely cool indoors.

---

### Rokid Glasses + Rokid Max + Rokid AR Lite

| Field | Rokid Glasses (2025) | Rokid Max | Rokid AR Lite (Station + Max) |
| --- | --- | --- | --- |
| Launch | Late 2025 China; Q1 2026 global (unconfirmed) | 2023 | 2024 |
| MSRP | ~¥3,999 (~$579) | $399 | $749 |
| Display | Binocular green microLED waveguide | microOLED 1080p, 50° FoV | microOLED 1080p, 50° FoV |
| Camera | 12 MP | None | None |
| Weight | **49 g** (lightest in HUD class) | 75 g | 80 g |
| SoC | Qualcomm Snapdragon AR1 | None (tethered) | Pairs with Rokid Station 2 (MTK Dimensity 1100) |
| Battery | ~4 hr active (unconfirmed) | n/a | n/a |
| SDK | Rokid YodaOS-Master + Unity AR | UXR SDK (Android) | UXR + Rokid Atrix |
| Distribution | Rokid app store (China) | Rokid app store | Same |
| Privacy | LED + voice prompt | n/a | n/a |
| Installed base | Unconfirmed; APAC-skewed | Unconfirmed | Unconfirmed |
| Astronomy fit | High (camera + HUD + light) | Low (no camera) | Low |

**Why it matters:** Rokid Glasses are the **most direct competitor to Meta Ray-Ban Display** in form, price, and feature set. Lighter (49 g vs ~50 g) and cheaper outside the US, with a Qualcomm AR1 SoC. They are the **dominant Tier 1 platform for APAC distribution**.

**Risks:** China-first distribution; SDK approval process opaque; YodaOS doc quality (unconfirmed) may be a barrier.

**Astronomy suitability: 8/10**

---

### Vuzix Z100, Blade 2, M400

| Model | Launch | MSRP | Display | Camera | Weight | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Vuzix Z100 | 2024 | $499 | Monocular microLED green | No | 38 g | Lightweight notification glasses; SDK is Android-based |
| Vuzix Blade 2 | 2022 | $1,299 | Monocular waveguide 480×480 | 8 MP | 90 g | Enterprise/industrial |
| Vuzix M400 | 2020 | $2,000+ | Monocular OLED | 12.8 MP | 200 g | Industrial heads-up; full Android 11 |

**SDK:** Vuzix offers a full Android SDK (their devices are Android-based) — by far the most permissive SDK on this list for an "off-the-shelf glasses Android device" experience. **No vendor gatekeeping for sideloaded apps.**

🟢 **Strategic note:** Vuzix M400 might be the only consumer-purchasable glasses platform where we can ship a continuous-background-camera Astra Vault build without vendor approval. Useful for showcase / patent reduction-to-practice.

**Risks:**
- Enterprise pricing, small consumer base.
- Z100 has no camera (dealbreaker for capture).
- M400 weight (200 g) is uncomfortable for casual use.

**Astronomy suitability: 4/10 consumer, 8/10 for patent prototyping**

---

### Brilliant Labs Frame (and upcoming Halo)

| Field | Value |
| --- | --- |
| Maker | Brilliant Labs (Singapore) |
| Launch | Feb 2024 |
| MSRP | $349 (Frame) |
| Display | Monocular full-color microOLED projected via prism; ~20° FoV; 640×400 px |
| Camera | 1280×720 (720p) |
| Mics | 1 |
| Weight | 39 g |
| SoC | Nordic nRF52840 + low-power MCU; offloads heavy lifting to phone |
| Battery | ~4 hr typical |
| SDK | **noa.brilliant.xyz + Lua / Python SDK** (open source); Frame SDK exposes display, mic, IMU, camera fully. |
| AI | Noa (built-in assistant, OpenAI/Anthropic/Whisper hybrid) |
| Distribution | Direct from Brilliant Labs |
| Privacy | LED indicator |
| Installed base | <50k units (unconfirmed) |
| Astronomy features | None native |
| Third-party astro apps | Unknown; community-built Noa "agents" exist |

**Why it matters:** **The only platform where Astra Vault can do absolutely anything we want.** Open SDK, Lua scripting, direct hardware access. Brilliant Labs **encourages** unauthorized features.

**Halo:** announced late 2025 (unconfirmed), claimed lighter and with binocular display + integrated AI. Spec details thin.

**Risks:** Tiny user base; build quality / battery longevity questionable. Treat as R&D playground, not consumer channel.

🟢 **Use Brilliant Labs to ship "Sky Lab" — an open-source Astra Vault reference implementation. Generates patent / publication assets, recruits dev community, hedges against Meta SDK lockdown.**

**Astronomy suitability: 6/10 product / 10/10 prototyping**

---

### Even Realities G1 (and rumored G2)

| Field | Value |
| --- | --- |
| Maker | Even Realities (Hong Kong / Shenzhen) |
| Launch | Mid 2024 |
| MSRP | $599 |
| Display | Binocular green microLED via Even Realities' proprietary waveguide ("Holo"), ~25° FoV |
| Camera | **None** |
| Mics | Dual |
| Weight | **44 g** |
| SoC | Custom low-power MCU + phone-paired processing |
| Battery | ~1.5 hr active display use; passive (notifications) all day |
| SDK | Limited; published Android/iOS app + recently "Even AI" with translation + transcription |
| Distribution | Direct, retail |
| Privacy | n/a (no camera) |
| Installed base | Unconfirmed; <100k |
| Astronomy fit | Low — no camera kills capture and image-based ID |

**Why it matters:** Beautiful design, near-prescription-frame indistinguishability, the model that proves "glasses people will actually wear can include a HUD." But **no camera = no Astra Vault**.

**Astronomy suitability: 2/10** (could show a star chart but cannot identify what user is looking at)

---

### Halliday Glasses

| Field | Value |
| --- | --- |
| Maker | Halliday |
| Launch | Announced CES 2025; shipping mid-2025 (unconfirmed) |
| MSRP | $489 pre-order |
| Display | "DigiWindow" — a micro-LED projector aiming at the upper-right of the user's vision (not a waveguide). Effective resolution / FoV not publicly specified. |
| Camera | 5 MP claimed |
| Weight | 35 g claimed |
| SDK | Roadmap stated; not yet public as of training cutoff |
| Distribution | Direct + retail (China + selected international) |

**Why it matters:** Design intrigue, but **no SDK = no Astra Vault**. Watch list only.

**Astronomy suitability: 3/10**

---

### Solos AirGo 3 / AirGo Vision

| Field | Value |
| --- | --- |
| Maker | Solos |
| Launch | AirGo 3: 2023; AirGo Vision: 2024 |
| MSRP | $249–$349 |
| Display | None |
| Camera | AirGo Vision: 5 MP front; AirGo 3: none |
| Mics | Dual |
| Speakers | Open-ear |
| Weight | 35–40 g |
| AI | SolosChat (GPT-4o + Anthropic Claude integration) |
| SDK | None public (closed AI ecosystem) |

**Why it matters:** Almost — has camera + AI + voice, but no SDK access. Treat as the consumer answer to Ray-Ban Meta from an audiophile-style brand.

**Astronomy suitability: 3/10**

---

### Lenovo Legion Glasses + ASUS AirVision M1 + TCL Nxtwear S+

These are all **tethered virtual-monitor glasses** (Sony microOLED 1080p, 60Hz/120Hz, USB-C DisplayPort) competing with XREAL Air series. None have cameras. None have public AR SDKs (just monitor mode).

- **Lenovo Legion Glasses Gen 2** (CES 2024, ~$399)
- **ASUS AirVision M1** (CES 2024, ~$699)
- **TCL Nxtwear S+** (~$399)

**Astronomy fit:** Tier 3. Could mirror an Astra Vault PC/phone app but adds nothing unique.

---

### TCL RayNeo X3

| Field | Value |
| --- | --- |
| Maker | TCL RayNeo |
| Launch | CES 2025 announce, late 2025 / 2026 retail (unconfirmed) |
| MSRP | $1,699 (claimed) |
| Display | Full-color microLED binocular waveguide; 1,000 nits in lens |
| Camera | Stereo cameras for SLAM; 12 MP front |
| Weight | ~76 g |
| SoC | Qualcomm Snapdragon AR1 |
| SDK | RayNeo SDK + Unity AR Foundation |
| Distribution | China-first; US/EU TBD |

**Why it matters:** First credibly priced full-color binocular AR glasses with SLAM. Closer in capability to Snap Spectacles than to Meta Ray-Ban Display. If they ship in volume in 2026, this is a **Tier 1 candidate**.

**Astronomy suitability: 8/10 if SDK is open and distribution is broad**

---

### Apple Vision Pro

| Field | Value |
| --- | --- |
| Maker | Apple |
| Launch | 2 Feb 2024 (US); international 2024 |
| MSRP | $3,499 USD |
| Display | Dual 4K micro-OLED, ~3,386 PPI, 23M pixels total |
| Cameras | 12 (including stereo passthrough, ToF, depth) |
| Eye tracking | Yes (best-in-class) |
| Hand tracking | Yes (no controllers) |
| SoC | Apple M2 + R1 |
| Battery | 2–2.5 hr (external pack) |
| SDK | visionOS — Swift, SwiftUI, RealityKit, ARKit |
| Distribution | visionOS App Store |
| Installed base | <500k units globally as of late 2025 (Apple has not disclosed; analyst estimates 350k–500k) |

**Why it matters:** Vision Pro is **the de facto reference platform for spatial astronomy** today. Apps like Sky Guide and Night Sky have already shipped immersive sky-dome experiences. Astra Vault visionOS = Day-1 readiness for any future Apple Glasses.

**Astronomy suitability: 9/10 in headset class** (low installed base is the issue, not capability)

---

### Magic Leap 2

| Field | Value |
| --- | --- |
| Maker | Magic Leap |
| Launch | Sep 2022 |
| MSRP | $3,299 (enterprise edition) |
| Display | Dimmable see-through waveguide, 70° FoV diagonal |
| Eye tracking | Yes |
| SoC | AMD Zen 2 + dedicated GPU (compute puck) |
| SDK | Lumin OS + OpenXR + Unity |
| Use case | Enterprise (surgical, defense, design) |

**Why it matters:** The **dimmable lens** is a unique capability — could enable controlled-luminance constellation overlay in bright environments. Magic Leap 2 has shipped to museums and planetariums in some installations.

**Astronomy suitability: 6/10 for installations, 1/10 for consumer**

---

### Project Aria (Meta Research)

| Field | Value |
| --- | --- |
| Status | Research platform — not for sale |
| Datasets | Aria Everyday Activities, Aria Digital Twin, Aria Pilot Dataset |
| Hardware | Aria Gen 1 (since 2020), Aria Gen 2 (announced 2025, with ET + 8h battery + heart-rate, dispensed only to selected research partners) |
| Access | Research license via projectaria.com (Meta application required) |

**Strategic value:**
- 🟢 Use the Aria datasets for training meteor-detection ML models (massive multimodal data with ground-truth pose).
- 🟢 Apply for the Aria research program — gives Astra Vault privileged early visibility into Meta's next-gen sensor stack and SDK roadmap before Ray-Ban / Display platforms expose them.

**Astronomy suitability: data only, not a platform target**

---

### Tencent / ByteDance / Xiaomi Mijia Smart Glasses

- **Xiaomi Mijia Smart Glasses** (2022 prototype; 2025 consumer model rumored at ~¥1,999/$279, unconfirmed): single-eye microLED display, camera, China-only.
- **Tencent**: demoed prototypes (2023, 2024); no consumer SKU through training cutoff.
- **ByteDance**: owns Pico (VR); rumored AR glasses 2026–2027 (unconfirmed). No public SDK.

**Strategic note:** Massive China market opportunity, but distribution requires Chinese app store relationships and content / data compliance with Chinese regulations. **Defer.**

**Astronomy suitability: TBD; high in theory, low in practice for non-China teams**

---

### Engo Eyewear / TriEye (sports glasses)

- **Engo 2** ($359): cyclist/runner HUD glasses with monocular microLED display, paired with Garmin / Apple Watch / Strava for live performance data.
- **TriEye Mirror Sport Glasses**: rear-view mirror in glasses (not a HUD).

**Astronomy fit:** Marginal. Engo's display could theoretically show a star chart, but no camera, sport-focused SDK, niche.

**Astronomy suitability: 1/10**

---

### Sightful Spacetop

- **Spacetop G1** (2024) discontinued; pivot to **Spacetop for Windows** software that runs on XREAL / Rokid hardware as a virtual-monitor workspace.

**Astronomy fit:** None directly. Skip.

---

## SDK Comparison Matrix

| Platform | Public SDK? | Languages | Camera access? | Mic access? | Display overlay? | Background mode? |
| --- | --- | --- | --- | --- | --- | --- |
| Meta Ray-Ban Display | WDAT preview | TS / RN | Event-triggered only | Event-triggered | **No (Meta-mediated)** | No |
| Meta Ray-Ban Gen 2 / Oakley HSTN | WDAT preview | TS / RN | Event-triggered | Event-triggered | n/a (no display) | No |
| Snap Spectacles Gen 5 | Lens Studio 5 | JS / TS / Lua | Yes within Lens | Yes within Lens | **Yes (full)** | No (sandboxed) |
| Android XR | Android XR SDK | Kotlin / C++ / Unity / WebXR | Yes (with permission) | Yes | **Yes** | Limited |
| visionOS / Apple Vision Pro | visionOS SDK | Swift / RealityKit | Yes (with user permission) | Yes | **Yes** | Background audio yes; camera no |
| XREAL (NRSDK / Nebula) | Public | Unity / Unreal / Android | n/a (no cam on most) / Air 2 Ultra yes | Yes via paired phone | **Yes (via tether)** | Phone-side yes |
| Rokid (YodaOS / UXR) | Public (CN-first) | Android / Unity | Yes | Yes | **Yes** | Limited |
| Vuzix (Android-native) | Public, permissive | Android / Java / Kotlin | **Yes (full)** | Yes | Yes | **Yes** |
| Brilliant Labs Frame | Open source | Lua / Python | **Yes (full)** | Yes | Yes | **Yes** |
| Even Realities G1 | Limited | Even AI app SDK | n/a (no camera) | Yes | Yes (text only) | No |
| Magic Leap 2 | Public | Unity / OpenXR / Lumin | Yes | Yes | **Yes** | Limited |
| Halliday / Solos / Halo | None public | n/a | n/a | n/a | n/a | n/a |
| Project Aria | Research license | Python (data) | Data access | Data access | n/a | n/a |

---

## Build Order Recommendation

Given Astra Vault's roadmap (Part 1 meteor capture as the killer feature; Part 2 constellation overlay as the moonshot; existing React Native + Capacitor stack), the recommended ordering is:

### Phase 1 (Q3 2026 — first glasses shipment of Astra Vault)
1. **Meta Ray-Ban Gen 2 + Oakley HSTN voice integration.**
   - Largest installed base (>7M units).
   - Lowest engineering cost: WDAT bridges into React Native cleanly; voice triggers "Hey Meta, ask Astra Vault" → audio response + frame capture.
   - Astra Vault's existing voice/gesture meteor-capture is a natural fit.
   - Apply for WDAT production access immediately.

### Phase 2 (Q4 2026)
2. **Meta Ray-Ban Display HUD experience.**
   - Same SDK family; incremental work to add the in-lens constellation card UI.
   - 🟢 File patent on "HUD constellation overlay corroborated by cross-referenced citizen-science capture event" — Astra Vault is the obvious flagship for this.

### Phase 3 (Q1 2027)
3. **Android XR (Samsung Moohan + first partner glasses).**
   - Reuse Astra Vault Android code path.
   - Leverage Gemini multimodal API for "what star is that" — no need to ship our own model.
   - Target Day 1 of every partner glasses launch.

### Phase 4 (parallel R&D, ongoing)
4. **Apple visionOS port.**
   - Required to be ready for Apple Glasses Day 1 (rumored 2027).
   - High-end ($3,499) but visible in App Store editorial.
5. **Brilliant Labs Frame open-source Lab build.**
   - Patent reduction-to-practice playground.
   - Developer community recruitment.

### Phase 5 (defer)
6. **Rokid + RayNeo + Snap Spectacles consumer (if/when launched).**
7. **XREAL One/Air 2 Ultra "Virtual Planetarium" companion mode.**
8. **Xiaomi / Tencent / ByteDance** — only with a local partner.

---

## Cross-cutting Strategic Findings

### 🟢 Patentable opportunities surfaced by this research

1. **Dark-adapted minimal-brightness AR rendering profile** keyed to local Bortle scale + ambient luminance sensor + user pupil-dilation estimate. Applies to every HUD platform; not a single shipping product does this.
2. **HUD constellation overlay corroborated by citizen-science capture event** — overlay confirms that the constellation/object the user is looking at has just been independently logged by the CAMS / AMS / Astra Vault network. The data-corroboration loop is novel.
3. **Voice-trigger post-event burst capture across heterogeneous glasses platforms** — buffer-on-trigger pattern with timestamp alignment across phone + glasses + remote camera network is patentable as a method.
4. **Gaze-prompted multimodal astronomy assistant invocation on AR glasses** — invokes Gemini/Claude/GPT with the gaze-pointed sky region as input. Anticipates the obvious 2027 product from Google.
5. **Cross-glasses observation merge protocol** — same meteor event captured by two users on different glasses platforms, merged into one canonical event record. Platform-agnostic protocol layer is patentable.

### 🚨 Dealbreakers we must engineer around

1. **No consumer platform allows continuous background camera access.** The Astra Vault "auto-detect meteor" mode from Part 1 of the handoff cannot run on glasses without platform partnership. Workaround: voice/gesture-triggered post-event buffer (the Mode 1 + 2 patterns).
2. **No SDK exposes raw HUD frame buffer on Meta Ray-Ban Display today.** Our overlays must be rendered through Meta-AI mediation until WDAT graphics APIs ship. Until then, all on-HUD content is text + iconography that Meta renders for us.
3. **Recording-indicator LED visible at night.** Every consumer platform has a mandatory front LED when recording. This LED ruins dark adaptation for nearby observers. Possible mitigation: time-domain pulsing rather than continuous; advocate with manufacturers for "dark-sky mode" firmware.
4. **Battery life under HUD use is <4 hr on every shipping platform.** A 4-hour observation session is the lower end of what astronomers do. We need a power-aware design ("standby HUD" most of the time, full overlay only on demand).
5. **Eye-IPD mismatch.** Most consumer glasses are fixed-IPD. Astra Vault audience includes children and elderly users with smaller / larger IPDs. We need a comfort-validation flow before recommending purchase.

### Patentable + research opportunities specific to data integration

- 🟢 **CAMS x glasses pre-position prompt.** Use CAMS-network forecasted radiant positions (Perseids etc.) to pre-position glasses HUD focus before a meteor is even seen.
- 🟢 **Aria-trained meteor detector** on Snap Spectacles SnapML or Vuzix M400 — research-grade dataset + consumer hardware = first true on-device meteor classifier.

---

## Open Questions (Need live verification)

1. **Meta Ray-Ban Display exact display spec** — resolution, FoV, nits floor. Public specs are still vague; Meta has only published "monocular full-color display."
2. **Meta WDAT graphics API roadmap.** When does Meta open frame-buffer overlay to third parties? Required for our overlay mode.
3. **Meta Ray-Ban / Oakley HSTN cumulative units shipped** as of May 2026 (estimated >7M end-of-2025; current figure unknown).
4. **Samsung Moohan retail launch date and price** — Q1 2026 announced but consumer launch specifics shifting.
5. **Apple Glasses status** — Bloomberg coverage updates through May 2026 not in training data.
6. **Snap Spectacles consumer SKU** — rumored 2026, no firm date.
7. **Rokid Glasses global (non-China) availability.**
8. **TCL RayNeo X3 ship date and SDK release.**
9. **Brilliant Labs Halo specs and ship date.**
10. **Project Aria Gen 2 availability for non-academic partners.**
11. **Even Realities G2** — rumored 2026, possibly with camera; if so, jumps from Tier 3 to Tier 2.
12. **Magic Leap consumer story** — has Magic Leap announced a Magic Leap 3 or consumer pivot in 2026?
13. **Vuzix Z200** — rumored successor with camera; unconfirmed.
14. **Xiaomi 2026 smart glasses SKU** specs and SDK openness.
15. **Gemini for Android XR API** — what astronomy-specific entitlements exist? Custom astronomical model adapters?
16. **Whether any platform offers "dark-sky mode" firmware** with red-only LED indicators.
17. **iOS / Android background mic permission lifecycle on glasses** — does the phone-paired model give us continuous-listen for "Hey Astra"?
18. **Snap Lens Studio "AR Spectacles standalone runtime"** — has Snap shipped untethered runtime since 2024?
19. **Privacy regulation update** — EU AI Act + state laws on biometric / face capture from glasses. Affects every camera-equipped platform.
20. **Pricing of all dev kits as of May 2026** — esp. WDAT (free? paid?), Snap Spectacles ($99/mo confirmed through 2025; 2026 status?), Android XR developer hardware bundles.

---

## Closing Strategic View

The single most important decision Astra Vault makes in 2026 is **which 2-platform combination to commit production engineering to first**. The recommendation is:

> **Meta WDAT family (Ray-Ban Gen 2 + Oakley HSTN + Ray-Ban Display) PLUS Android XR (Samsung + partner glasses).**

These two ecosystems together cover:
- The largest current installed base (Meta, >7M units).
- The largest future installed base (Android XR ecosystem, projected dominant 2027+).
- 80%+ of code reuse via React Native and Android-native Astra Vault.
- Both ecosystems support voice-triggered capture, audio narration, and (Meta Display + Android XR) HUD overlay.
- Both have credible 5-year roadmaps.

Snap Spectacles Gen 5, Brilliant Labs Frame, and visionOS / Apple Vision Pro form a **secondary three-platform R&D tier** for patent prototyping, technology demonstration, and Day-1 readiness for Apple Glasses.

Everything else is watch list.

---

RESEARCH COMPLETE — smart-glasses-platforms.md written, 25 platforms profiled.
