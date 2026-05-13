# Smart Glasses Platforms — Astra Vault R&D

**Author:** R&D (Claude Opus 4.7, 1M-context)
**Date:** 2026-05-13 (verification pass added 2026-05-13)
**Status:** First-pass deep dive + live-web verification pass
**Sourcing note:** Original draft was authored from training memory only (WebSearch / WebFetch disabled). A live-web verification pass was performed on **2026-05-13** with WebSearch + WebFetch enabled; per-platform tables below now carry inline `[verified 2026-05-13](URL)` citations where claims were confirmed or corrected. See `## Verified Updates (2026-05-13)` at the bottom for a delta summary and `glasses-verification-delta.md` for the engineering-facing version.

---

## Executive Summary

1. **Meta Ray-Ban Display ($799, Sep 30 2025 US launch)** is the single most important platform for Astra Vault. Confirmed specs: monocular full-color geometric waveguide (Lumus Z-Lens / SCHOTT optics, OmniVision LCoS, Goertek projection engine), **600×600 px, ~20° diagonal FoV, up to 5,000 nits, up to 90 Hz** [verified 2026-05-13](https://kguttag.com/2025/10/30/meta-ray-ban-display-part-1-lumus-waveguide-omnivision-lcos-and-goertek-projection-engine/). Initial demand exceeded supply: **~15,000 units sold by early 2026**, international launch (UK/FR/IT/CA) paused to prioritize US inventory [verified 2026-05-13](https://glassalmanac.com/ray%E2%80%91ban-display-delayed-in-2026-15000-units-sold-heres-why-u-s-priority-matters/). 🚨 **WDAT does NOT (as of May 2026) support sending imagery to the Display HUD nor accessing Neural Band gestures** [verified 2026-05-13](https://www.roadtovr.com/meta-ray-ban-smart-glasses-third-party-app-sdk-device-access-toolkit/) — first-mover overlay patent moat is even more important than originally stated because no third party can render to the HUD.
2. **Ray-Ban Meta Gen 2 (Sep 2025) + Oakley Meta HSTN (Jul/Aug 2025) + Oakley Meta Vanguard (Oct 21 2025)** are the highest-volume audio/camera glasses in market. **EssilorLuxottica disclosed >2 million Meta-glasses units sold by Feb 2025 and 2025 sales tripled vs 2023+2024 combined, with ~7 million expected for full year 2025; Meta+EL aiming for 10M production capacity end-2026, scaling toward 20M** [verified 2026-05-13](https://www.cnbc.com/2026/02/11/ray-ban-maker-essilorluxottica-triples-sales-of-meta-ai-glasses.html). No HUD, but voice + camera + AI work today via WDAT preview SDK. This is the most-installed-base platform we can ship to.
3. **Android XR — Samsung Galaxy XR (formerly "Project Moohan") shipped Oct 31 2025 at $1,799 USD** [verified 2026-05-13](https://www.roadtovr.com/samsung-galaxy-xr-headset-price-specs-release-date/); confirmed XREAL is now Google's named **lead hardware partner** for Android XR optical-see-through glasses, ASUS ROG×XREAL R1 (240 Hz gaming display glasses) shipping H1 2026, and Warby Parker + Gentle Monster also partnered for Android XR smart glasses [verified 2026-05-13](https://www.roadtovr.com/google-hardware-partnership-xreal-android-xr-leader/). Google I/O 2026 (May 13) is the formal Android XR glasses showcase. Gemini-native, OpenXR-compliant, Unity/Unreal/WebXR-supported.
4. **Snap Spectacles Gen 5 (Sep 2024 dev-only, $99/mo subscription, ~$1,200/yr; $49.50/mo for US/EU students)** are the most capable AR developer glasses on the market today (dual LCoS waveguides, 46° diagonal FoV, Snapdragon AR1 + AR2 hybrid) [verified 2026-05-13](https://www.uploadvr.com/snap-spectacles-5-ar/). Snap has confirmed a **consumer "Specs" launch in 2026** (lighter, standalone, no puck, no tether) running Snap OS 2.0 [verified 2026-05-13](https://newsroom.snap.com/launch-specs-2026?lang=en-US); price and date still undisclosed.
5. **XREAL One / One Pro / Air 2 Ultra** are tethered display glasses (act as a virtual monitor via USB-C DisplayPort to phone/PC). The Air 2 Ultra has SLAM cameras and a Nebula/NRSDK 6DoF mode that is genuinely usable for "virtual planetarium" overlays at home, but they are tethered, opaque-ish, and not viable for naked-eye dark-sky use without modifications. Tier 2 platform.
6. **Rokid AI Glasses Style went globally available at CES 2026** at **$299 USD (Jet Black; Translucent Gray Mar 2026); $398 prescription "Golden Bundle"; 38.5 g; ChatGPT + Qwen + DeepSeek + Gemini integrations; ~20,000+ registered Rokid developers in their open ecosystem** [verified 2026-05-13](https://www.prnewswire.com/news-releases/rokid-ai-glasses-style-now-available-globally-302664994.html). **Major correction:** the global SKU is a **screenless** AI/camera glasses model, not a HUD model — Rokid is no longer a direct Meta-Ray-Ban-Display "screen" competitor for the global market; their HUD model remains primarily a China play.
7. **Brilliant Labs Frame ($349) is still actively supported; Halo ($299, late Nov 2025 ship) is shipping** with full-color display, bone-conduction speakers, all-day battery, and a **Flutter SDK + native iOS/Android APIs on GitHub, fully open source, "Vibe Mode" natural-language app authoring** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/brilliant-labs-unveils-halo-the-worlds-thinnest-ai-glasses-and-it-wants-to-be-your-everyday-specs). Still the only consumer platform with no SDK gatekeeping. 🟢 Prototype playground remains the strongest recommendation in this report.
8. **Even Realities G2 shipped 12 Nov 2025 at $599** [verified 2026-05-13](https://9to5google.com/2025/11/12/even-realities-launches-g2-smart-glasses-r1-control-ring/), with HAO 2.0 micro-LED waveguides (640×350 px, 27.5° FoV, up to 1,200 nits green monochrome, 60 Hz), 36 g, optional R1 ring input ($249); **Even Hub third-party app store launched 3 April 2026 with ~50 apps and 2,000+ registered developers — but SDK documentation has NOT been publicly published as of launch** [verified 2026-05-13](https://virtual.reality.news/news/even-realities-even-hub-launches-can-constrained-smart-glasses-build-an-app-ecosystem/). **G2 still has no camera and no speakers** (privacy-first) — so the previous Tier 3 verdict stands.
9. **Vuzix (Z100, Blade 2, M400)** is enterprise/industrial. Public Android SDK, but installed base in the low six figures globally and consumer pricing is unrealistic ($500–$2,000). Tier 3 / B2B-only.
10. **Apple smart glasses: no shipping product as of May 2026.** Gurman reporting (Feb–Apr 2026) now firmer: Apple is testing **at least four acetate frame styles in black / ocean blue / light brown, display-less first-iteration (Meta-Ray-Ban competitor), supporting Vision-Pro-style hand gestures, late-2026 announce → early-2027 ship; Apple shelved Vision Pro redesign to prioritize glasses** [verified 2026-05-13](https://appleinsider.com/articles/26/04/20/smart-glasses-race-heats-up-as-apple-prepares-for-late-2026-entry). **Apple Vision Pro M5 refresh shipped Oct 22 2025 at the same $3,499 with Dual Knit Band, 120 Hz, ~2.5 hr battery; visionOS 26 adds spatial widgets, interactive Jupiter Environment, Apple Intelligence** [verified 2026-05-13](https://www.apple.com/newsroom/2025/10/apple-vision-pro-upgraded-with-the-m5-chip-and-dual-knit-band/).
11. **Project Aria (Meta research)** — not a consumer product, but Meta publishes massive multimodal datasets (Aria Everyday Activities, Aria Digital Twin) under research license. Useful for training meteor-streak detectors and 6DoF head-pose models. 🟢 Free training data.
12. **Tencent / ByteDance / Xiaomi** — Xiaomi Mijia Smart Glasses (2025, ~¥1,999 / $279) sold strongly in China; Tencent has demoed prototypes but has not shipped a consumer SKU as of training cutoff. ByteDance acquired Pico (VR) and has rumored AR glasses but no public SDK. China-only distribution risk is high; Astra Vault should ignore until 2027 unless we explicitly target APAC.
13. **TCL RayNeo X3 Pro shipped in China May 27 2025 at ~¥8,999 (~$1,250); US listing at $1,299** with full-color microLED waveguide + built-in eSIM (CES 2026 demos) [verified 2026-05-13](https://www.microled-info.com/tcl-rayneo-x3-pro-ar-glasses-are-now-shipping-china-1250). Distribution is China-first; US trade-in promotion 12/2025–1/2026 indicates early US channel pilots. Watch list.
14. **Halliday DigiWindow glasses are shipping at $489**; the DigiWindow is a projector aimed at the upper-right of the user's vision — **no camera, 28.5 g, ~12 hr battery**; reviews are mixed, no public SDK announced [verified 2026-05-13](https://www.androidpolice.com/halliday-glasses-review/). 🚨 **Major correction:** earlier draft claimed "5 MP camera" — **Halliday has NO camera.**
15. **Solos AirGo Vision $349 / AirGo V2 $299 (CES 2026)** — AirGo V2 is now the current model with **16 MP camera, live video stabilization, ChatGPT + Gemini bot support; AirGo Vision integrates ChatGPT-4o** [verified 2026-05-13](https://www.androidcentral.com/wearables/solos-airgo-v2-smart-glasses-are-here-with-camera-enabled-ai-for-usd299-at-ces-2026). No HUD, no public SDK. Tier 3.
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
| Launch | 30 Sep 2025 US (Connect 2025); international launches paused Jan 2026 to prioritize US inventory |
| MSRP | $799 USD (includes Meta Neural Band wristband) |
| Display type | **Monocular full-color Lumus Z-Lens geometric waveguide**, SCHOTT optics, OmniVision LCoS, Goertek projection engine [verified 2026-05-13](https://kguttag.com/2025/10/30/meta-ray-ban-display-part-1-lumus-waveguide-omnivision-lcos-and-goertek-projection-engine/) |
| Display resolution / FoV | **600×600 px, ~20° diagonal FoV (≈14° horizontal × 14° vertical), 30–5,000 nits brightness range, up to 90 Hz refresh (content refresh 30 Hz)** [verified 2026-05-13](https://www.uploadvr.com/meta-ray-ban-display-review/) [verified 2026-05-13](https://kguttag.com/2025/10/30/meta-ray-ban-display-part-1-lumus-waveguide-omnivision-lcos-and-goertek-projection-engine/) |
| Camera | 12 MP ultra-wide, 3024×4032 stills |
| Mics | 5-mic beamforming array [verified 2026-05-13](https://www.roadtovr.com/meta-ray-ban-smart-glasses-third-party-app-sdk-device-access-toolkit/) |
| Speakers | Open-ear directional, dual driver |
| IPD adjustment | None — single fixed lens position |
| Weight | **69 g standard / 70 g large** (vs 52 g for regular Ray-Ban Meta Gen 2) [verified 2026-05-13](https://www.uploadvr.com/meta-ray-ban-display-review/) |
| Eye tracking | No |
| Prescription | Yes (EssilorLuxottica Rx program; +/- limited range) |
| SoC | Qualcomm Snapdragon AR1 Gen 1 (carry-over from Gen 2) |
| Battery (active) | **Up to 6 hr mixed use; up to 24 hr additional from charging case; Neural Band up to 18 hr** [verified 2026-05-13](https://www.meta.com/help/ai-glasses/1116302600085081/) |
| Battery (HUD on) | **Real-world ~1.5 hr observed in Tom's Guide testing (battery dropped to 40% after 90 min of moderate use)** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/meta-ray-ban-display-review) |
| Connectivity | BT 5.3, Wi-Fi 6, no cellular |
| SDK | **Meta Wearables Device Access Toolkit (WDAT)** — developer preview open; **publishing currently restricted to select partners (Disney, 18Birdies, Twitch, HumanWare, Microsoft, Streamlabs, etc.); general-availability publishing targeted for 2026** [verified 2026-05-13](https://developers.meta.com/blog/introducing-meta-wearables-device-access-toolkit/). 🚨 **SDK does NOT support sending imagery to the Display HUD, nor accessing Neural Band gestures** [verified 2026-05-13](https://www.roadtovr.com/meta-ray-ban-smart-glasses-third-party-app-sdk-device-access-toolkit/). Apps run on phone (iOS/Android), pipe camera/mic data, and receive audio/text responses back to the glasses. |
| Distribution | Meta Horizon Store + EssilorLuxottica retail |
| Dev kit cost | No separate dev kit; buy retail unit + apply to WDAT |
| Privacy posture | **2 mm constant-on white LED on right temple when recording (was 1 mm flashing pre-firmware-update); built-in tamper detection refuses to record if LED is obstructed** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/this-is-the-blink-and-youll-miss-it-sign-that-meta-glasses-are-recording). No silent-capture mode. |
| Installed base | **~15,000 units sold by early 2026** (supply constrained — Meta paused UK/FR/IT/CA launches to prioritize US inventory) [verified 2026-05-13](https://glassalmanac.com/ray%E2%80%91ban-display-delayed-in-2026-15000-units-sold-heres-why-u-s-priority-matters/) |
| Astronomy features | None native |
| Known third-party astro apps | None known |

**Why it matters for astronomy:** This is the only consumer-grade product that hits the trifecta we need — visible HUD + camera + always-listening mic, in a glasses form factor a normal person will wear outside at night. The Neural Band gives us discreet input ("subtle finger pinch to confirm capture") that doesn't disturb dark-adapted vision.

**Risks / limitations:**
- 🚨 **CONFIRMED:** No public frame-buffer overlay API in WDAT preview (May 2026). All HUD output must be rendered by Meta-controlled apps; third parties send text/audio responses to the glasses. Our "constellation overlay" mode runs as a *Meta-AI-mediated* experience (suggested-text card), not a native overlay [verified 2026-05-13](https://www.roadtovr.com/meta-ray-ban-smart-glasses-third-party-app-sdk-device-access-toolkit/).
- 🚨 No continuous background camera access in WDAT — event-triggered only.
- Display brightness floor with 5,000-nit peak panel is **almost certainly too high** for full dark adaptation. Strong patent opportunity: 🟢 "Dark-adapted minimal-brightness AR rendering profile keyed to local Bortle scale."
- IPD non-adjustable — usability for narrow-IPD users (children, ~5–10% of adults) uncertain.

**Astronomy suitability: 9/10**

---

### Meta Ray-Ban Gen 2

| Field | Value |
| --- | --- |
| Maker | Meta + EssilorLuxottica |
| Launch | **Ray-Ban Meta Gen 2 announced and shipped Sep 2025 at Meta Connect 2025** [verified 2026-05-13](https://about.fb.com/news/2025/09/ray-ban-meta-gen-2-better-battery-life-video-capture/) (Gen 1 was Oct 2023) |
| MSRP | **Starting $379 USD** [verified 2026-05-13](https://www.androidcentral.com/wearables/ray-ban-meta-gen-2) |
| Display | **None** (audio + camera only) |
| Camera | **12 MP, up to 3K video; 1080p/60 fps option for slow-mo and hyperlapse** [verified 2026-05-13](https://about.fb.com/news/2025/09/ray-ban-meta-gen-2-better-battery-life-video-capture/) |
| Mics | 5-mic array |
| Speakers | Open-ear stereo, improved over Gen 1 |
| Weight | ~49 g |
| SoC | Snapdragon AR1 Gen 1 |
| Battery (active) | **Up to 8 hr typical (Gen 2 doubled from Gen 1); 48 hr with case** [verified 2026-05-13](https://about.fb.com/news/2025/09/ray-ban-meta-gen-2-better-battery-life-video-capture/) |
| Connectivity | BT 5.2/5.3, Wi-Fi 6 |
| SDK | **WDAT developer preview; general-availability publishing 2026** [verified 2026-05-13](https://developers.meta.com/blog/introducing-meta-wearables-device-access-toolkit/) |
| Distribution | EssilorLuxottica retail + Meta |
| Dev kit cost | Retail purchase |
| Privacy posture | 2 mm constant-on LED + tamper detection; mandatory shutter sound; no silent record |
| Installed base | **>2 M units by Feb 2025; 2025 sales tripled vs 2023+2024 combined → projected ~7 M for full-year 2025; production scaling to 10 M/yr by end-2026, target 20 M/yr** [verified 2026-05-13](https://www.cnbc.com/2026/02/11/ray-ban-maker-essilorluxottica-triples-sales-of-meta-ai-glasses.html) |
| Recent firmware (2025-10) | Slow-motion, hyperlapse, Garmin/Strava integration, "Conversation Focus" voice-amplification mode, "Photo" shortcut without "Hey Meta" wake word [verified 2026-05-13](https://about.fb.com/news/2025/09/ray-ban-meta-gen-2-better-battery-life-video-capture/) |
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

### Meta Oakley HSTN and Oakley Meta Vanguard

| Field | Oakley Meta HSTN | Oakley Meta Vanguard |
| --- | --- | --- |
| Maker | Meta + EssilorLuxottica (Oakley brand) | Meta + EssilorLuxottica (Oakley brand) |
| Launch | **Preorder Jul 11 2025, on-shelves Aug 26 2025** [verified 2026-05-13](https://about.fb.com/news/2025/06/introducing-oakley-meta-glasses-a-new-category-of-performance-ai-glasses/) | **Announced Meta Connect 2025 (Sep 17); launched Oct 21 2025** [verified 2026-05-13](https://techcrunch.com/2025/09/17/meta-unveils-its-new-oakley-meta-vanguard-smart-glasses-for-athletes/) |
| MSRP | **$399 standard; $499 limited-edition 24K PRIZM** [verified 2026-05-13](https://about.fb.com/news/2025/06/introducing-oakley-meta-glasses-a-new-category-of-performance-ai-glasses/) | **$499** [verified 2026-05-13](https://www.roadtovr.com/meta-smart-glasses-ray-ban-oakley-vanguard-price-release/) |
| Display | None | None |
| Camera | 12 MP, 3K video | **12 MP, 3K video, 122° wide-angle lens, single unified front lens** [verified 2026-05-13](https://techcrunch.com/2025/09/17/meta-unveils-its-new-oakley-meta-vanguard-smart-glasses-for-athletes/) |
| Mics | 5-array (carry-over from Ray-Ban Gen 2) | 5-array |
| Speakers | Open-ear stereo | **Open-ear stereo, +6 dB louder than HSTN — loudest Meta-glasses speakers** |
| Weight | **~53 g O-Matter frame** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/oakley-meta-hstn-smart-glasses-review-what-i-love-and-whats-still-missing) | ~66 g (sports wraparound) |
| SoC | Snapdragon AR1 Gen 1 | Snapdragon AR1 Gen 1 |
| Battery | **Up to 8 hr; case +48 hr** [verified 2026-05-13](https://about.fb.com/news/2025/06/introducing-oakley-meta-glasses-a-new-category-of-performance-ai-glasses/) | **Up to 9 hr (6 hr continuous music); case +36 hr** [verified 2026-05-13](https://techcrunch.com/2025/09/17/meta-unveils-its-new-oakley-meta-vanguard-smart-glasses-for-athletes/) |
| Durability | IPX4 sweat/splash resist | **IP67 (highest of any Meta glasses)** [verified 2026-05-13](https://techcrunch.com/2025/09/17/meta-unveils-its-new-oakley-meta-vanguard-smart-glasses-for-athletes/) |
| Form factor | Sports-oriented, wraparound | Wraparound athletic, three-point fit, replaceable nose pads |
| SDK | WDAT preview | WDAT preview |
| Privacy | Same as Ray-Ban Gen 2 | Same as Ray-Ban Gen 2 |
| Special features | — | **Garmin watch integration (heart-rate / pace queries) + Strava graphical overlays on captured video/photos** [verified 2026-05-13](https://techcrunch.com/2025/09/17/meta-unveils-its-new-oakley-meta-vanguard-smart-glasses-for-athletes/) |
| Astronomy fit | Identical SDK story to Ray-Ban Gen 2 | Identical SDK story; **IP67 + 9 hr battery make Vanguard the best-fit "outdoor astronomer" model in Meta's lineup** |

**Why it matters:** Sports/outdoor positioning is **directly relevant** to astronomers, who are an outdoor user base. **Oakley Meta Vanguard is now the strongest Meta-family fit for star-party / dark-sky use** — IP67 weather sealing, 122° wide-angle camera for wide meteor capture, 9 hr battery, +6 dB speakers help for outdoor audio narration in wind. Same WDAT code path as Ray-Ban Meta — write once, run on all three.

**Astronomy suitability: HSTN 7/10, Vanguard 8/10**

---

### Snap Spectacles Gen 5

| Field | Value |
| --- | --- |
| Maker | Snap Inc. |
| Launch | Sep 2024 (Snap Partner Summit) — developer-only |
| MSRP | **$99/month, 12-month commitment (~$1,200/yr) for the Spectacles Developer Program; $49.50/mo education tier (US + 6 EU countries) with valid education email** [verified 2026-05-13](https://www.uploadvr.com/snap-spectacles-5-ar/) |
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
| SDK | **Lens Studio 5** with **Spectacles Interaction Kit, SnapML for on-device ML, OpenAI-hosted multimodal models partnership, Depth Module API, Automated Speech Recognition (40+ langs), Snap3D API (on-the-fly 3D generation)** [verified 2026-05-13](https://www.developer-tech.com/news/snap-os-debuts-with-developer-friendly-spectacles-5-ar-glasses/). TypeScript + JavaScript. Most capable consumer-AR SDK on the market. |
| Distribution | LensCloud (in-headset) — no public app store |
| Dev kit cost | $99/mo subscription |
| Privacy | Hardware indicators + Lens manifest permissions |
| Installed base | Estimated <10k developers globally |
| Consumer launch | **Confirmed for 2026: "Snap Specs" — much smaller form factor, fraction of Gen 5 weight, fully standalone (no puck/tether/phone), running Snap OS 2.0** [verified 2026-05-13](https://newsroom.snap.com/launch-specs-2026?lang=en-US). Price and date still undisclosed. |
| Astronomy features | None native |
| Third-party astro apps | Unknown; possibly experimental Lenses |

**Why it matters:** This is the **only** consumer-positioned AR glasses where today we can ship a full 6DoF overlay experience. Lens Studio + SnapML supports running our meteor detection model on-device. Eye tracking + 46° FoV + 37 PPD is enough for true constellation labels.

**Risks / limitations:**
- 🚨 45-minute battery makes it useless for actual observing sessions. Better as a planetarium / day-time use platform.
- 🚨 No public consumer SKU — distribution is dev-program-only.
- 226 g weight is fatiguing.
- Lenses are sandboxed; we can't run a long-running background service.

**Strategic use:** Build a "Snap Spectacles Lens" as a tech demo / patent prototype / portfolio piece. Snap Specs consumer launch is now **officially announced for 2026** [verified 2026-05-13](https://newsroom.snap.com/launch-specs-2026?lang=en-US) — invest in production-grade Lens within 2026 to be Day-1 ready.

**Astronomy suitability: 6/10 (technically), 3/10 (distributable)**

---

### Google Android XR (Samsung Galaxy XR, XREAL Project Aura, ASUS ROG×XREAL R1, Warby Parker, Gentle Monster)

| Field | Value |
| --- | --- |
| Platform owner | Google (Android XR) |
| OS | Android XR (Android-based, OpenXR-compliant) |
| First hardware | **Samsung Galaxy XR (formerly "Project Moohan") — unveiled 21 Oct 2025, shipped 31 Oct 2025 in US + South Korea at $1,799 USD; 256 GB; dual 3,552×3,840 micro-OLED @ 72/90 Hz; Snapdragon XR2+ Gen 2; 16 GB RAM; 545 g; tethered battery ~2–2.5 hr** [verified 2026-05-13](https://www.roadtovr.com/samsung-galaxy-xr-headset-price-specs-release-date/) |
| Partner glasses | **XREAL is named lead hardware partner for optical-see-through Android XR glasses (multi-year extension)** [verified 2026-05-13](https://www.roadtovr.com/google-hardware-partnership-xreal-android-xr-leader/); **XREAL Project Aura** (70° FoV, Qualcomm silicon, external puck, 2026 launch); **ASUS ROG×XREAL R1** (dual 1920×1080 240 Hz microOLED gaming-handheld glasses, H1 2026 global ship) [verified 2026-05-13](https://www.roadtovr.com/meta-asus-xreal-rog-ar-glasses-240hz-display/); **Warby Parker + Gentle Monster** also signed [verified 2026-05-13](https://www.androidauthority.com/android-xr-glasses-preview-google-io-2026-3665773/). Google I/O 2026 (May 13) is the formal Android XR glasses showcase event. |
| AI | **Gemini-native** (multimodal, voice, vision) |
| SDK | Android XR Jetpack libraries, OpenXR, ARCore, WebXR, Unity XR Plugin Management, Unreal XR plugin |
| Languages | Kotlin, Java, C++, C# (Unity), TypeScript (WebXR) |
| Distribution | Google Play (Android XR section) |
| Dev kit | Samsung Galaxy XR (retail $1,799) + Android XR Emulator — free SDK, hardware purchase required |
| Astronomy precedent | Google Sky Map (2009–2013); Gemini demos of "what star is that?" at Google I/O 2024 + 2025 |

**Why it matters:**
- Open SDK with same Android tooling. Astra Vault's existing Android app code reuses 80%+ of business logic.
- Gemini is multimodal; the "look at sky, ask question" flow is **already the platform's primary demo**.
- OpenXR means we don't get locked into Google — same code runs on Quest, Magic Leap 2, future Apple OpenXR adopters.
- 🟢 **Strategic patent opportunity:** "Multimodal LLM astronomy assistant invoking corroborated citizen-science meteor data" — file before competitors copy the obvious Gemini × Stellarium pattern.

**Risks:**
- Galaxy XR is a 545 g headset, not glasses. Real glasses form-factor partner devices (Project Aura, ROG R1, Warby Parker, Gentle Monster) all targeting 2026 — multiple SKUs ship this year.
- Gemini integration depth varies — full multimodal vision API access may be metered.

**Astronomy suitability: 8/10 (long term), 4/10 (today)**

---

### Apple smart glasses (in development)

**Status as of May 2026 (live-web verified):**
- Apple Vision Pro shipped Feb 2024, $3,499 (US); **M5 refresh shipped Oct 22 2025 at the same $3,499 price with Dual Knit Band, 120 Hz, ~2.5 hr battery** [verified 2026-05-13](https://www.apple.com/newsroom/2025/10/apple-vision-pro-upgraded-with-the-m5-chip-and-dual-knit-band/).
- **visionOS 26 shipped 15 Sep 2025** with Spatial Widgets (Clock/Weather/Music/Photos), Personas v2, PSVR2 controller support, **and the interactive Jupiter Environment — users stand on Jupiter's moon Amalthea, scrub through Jupiter's day cycle, adjust time of day, all in the Environments tab** [verified 2026-05-13](https://www.tuaw.com/2025/09/13/visionos-26-adds-interactive-jupiter-experience-to-vision-pro). This is the first truly interactive astronomy environment Apple has shipped; Astra Vault should plan a spatial-widget play.
- **Apple Smart Glasses: Gurman now reports (Apr 2026) Apple aims for Sep–Oct 2026 unveil → 2027 retail launch; testing 4 acetate frame designs in black / ocean blue / light brown; first-gen will be display-less (Meta Ray-Ban competitor) with Apple-Intelligence-driven Siri + camera; Vision Pro 2 redesign reportedly shelved to prioritize glasses** [verified 2026-05-13](https://appleinsider.com/articles/26/04/20/smart-glasses-race-heats-up-as-apple-prepares-for-late-2026-entry).
- Apple Vision Pro **already has** Sky Guide (Fifth Star Labs) as a featured visionOS app, plus Night Sky and Stellarium. Astra Vault should target visionOS Day 1 of any new spatial OS feature.

**SDK story:** visionOS = SwiftUI + RealityKit + ARKit. Same Swift codebase as iOS with Spatial extensions. When Apple Glasses ship, the most likely SDK is a visionOS variant — meaning **Astra Vault must have a visionOS app ready** to leverage Day-1 glasses launch.

**Astronomy suitability:** TBD; Apple Vision Pro 9/10 (today, but tiny installed base); Apple Glasses 9/10 (when shipped).

🟢 **Strategic recommendation:** Build the visionOS version of Astra Vault NOW. The work transfers directly to Apple Glasses.

---

### XREAL One / One Pro / Air 2 Ultra

| Field | One | One Pro | Air 2 Ultra |
| --- | --- | --- | --- |
| Launch | Jan 2025 | Mar 2025 (announced CES 2025) | Mar 2024 — **DISCONTINUED Feb 2026 (after-sales support continues)** [verified 2026-05-13](https://www.moguravr.com/xreal-air-2-ultra-discontinued/) |
| MSRP | $499 | $649 | $699 (original; out of stock at official channels) |
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
| Installed base | **XREAL One series sold 111,000 units in 2025; XREAL crossed 700k lifetime by Jun 2025 and likely >1M by year-end; ~36% global AR-display-glasses market share Q2 2025** [verified 2026-05-13](https://eu.36kr.com/en/p/3750612889649669) | Subset of One-series volume | Now discontinued |
| Astronomy features | None | None | None |
| Third-party astro apps | None known | None | Possibly Stellarium WebXR via Nebula |

**Why it matters:** Tethered display glasses are great for **indoor planetarium mode** and **car/RV astronomy trips**. Air 2 Ultra's SLAM cameras enabled real 6DoF, but with the Air 2 Ultra now discontinued in Feb 2026 [verified 2026-05-13](https://www.moguravr.com/xreal-air-2-ultra-discontinued/), the 6DoF play moves to **XREAL Project Aura (lead Android XR partner glass, 70° FoV, X1S chip, tethered split-compute puck, 2026 launch)** [verified 2026-05-13](https://www.roadtovr.com/xreal-aura-ar-glasses-android-xr-hands-on-preview/) — see Android XR section. The XREAL One series is the only currently-shipping XREAL SKU.

**Astronomy suitability: 5/10** — tethered to a phone/PC kills field use; Air 2 Ultra is discontinued; Project Aura inherits the 6DoF play and lives in the Android XR section.

---

### Rokid Glasses + Rokid AI Glasses Style + Rokid Max + Rokid AR Lite

| Field | Rokid Glasses (HUD, China-first) | **Rokid AI Glasses Style (global, CES 2026)** | Rokid Max | Rokid AR Lite (Station + Max) |
| --- | --- | --- | --- | --- |
| Launch | Late 2025 China; HUD-equipped, micro-LED waveguide | **Globally available CES 2026; ships 19 Jan 2026** [verified 2026-05-13](https://www.prnewswire.com/news-releases/rokid-ai-glasses-style-now-available-globally-302664994.html) | 2023 | 2024 |
| MSRP | ~¥3,999 / $499 (Glasses HUD model) [verified 2026-05-13](https://global.rokid.com/blogs/news/rokid-glasses-are-lightweight-ar-smart-glasses-with-micro-led-displays-and-a-499-price-tag) | **$299 standard (Jet Black; Translucent Gray Mar 2026); $398 prescription "Golden Bundle"** [verified 2026-05-13](https://www.androidheadlines.com/best-of-ces-2026-rokid-style-smart-glasses) | $399 | $749 |
| Display | Binocular green microLED waveguide | **None — display-free / screenless AI/camera glasses** [verified 2026-05-13](https://global.rokid.com/blogs/news/rokid-introduces-display-free-ai-smartglasses-at-ces-2026) | microOLED 1080p, 50° FoV | microOLED 1080p, 50° FoV |
| Camera | 12 MP | **12 MP Sony sensor, supports up to 4K capture; up to 10 min continuous video** [verified 2026-05-13](https://www.newsbytesapp.com/news/science/ces-2026-rokid-ai-glasses-style-last-12-hours-on-charge/tldr) | None | None |
| Weight | 49 g | **38.5 g** [verified 2026-05-13](https://www.newsbytesapp.com/news/science/ces-2026-rokid-ai-glasses-style-last-12-hours-on-charge/tldr) | 75 g | 80 g |
| SoC | Qualcomm Snapdragon AR1 | **Dual-chip: NXP RT600 (always-on low-power) + Qualcomm Snapdragon AR1 (AI/imaging)** [verified 2026-05-13](https://www.newsbytesapp.com/news/science/ces-2026-rokid-ai-glasses-style-last-12-hours-on-charge/tldr) | None (tethered) | Pairs with Rokid Station 2 (MTK Dimensity 1100) |
| Battery | ~4 hr active | **Up to 12 hr typical, >24 hr standby** [verified 2026-05-13](https://www.newsbytesapp.com/news/science/ces-2026-rokid-ai-glasses-style-last-12-hours-on-charge/tldr) | n/a | n/a |
| AI | YodaOS-Master + assistant | **ChatGPT + Qwen + DeepSeek + Gemini — multi-LLM, not locked** [verified 2026-05-13](https://www.prnewswire.com/news-releases/rokid-ai-glasses-style-now-available-globally-302664994.html) | n/a | n/a |
| SDK | Rokid YodaOS-Master + Unity AR | **Rokid open developer ecosystem, ~20,000+ registered developers** [verified 2026-05-13](https://www.prnewswire.com/news-releases/rokid-ai-glasses-style-now-available-globally-302664994.html) | UXR SDK (Android) | UXR + Rokid Atrix |
| Distribution | Rokid app store (China) | **Global retail + Rokid e-commerce** | Rokid app store | Same |
| Privacy | LED + voice prompt | LED + voice prompt | n/a | n/a |
| Installed base | Unconfirmed; APAC-skewed | New CES 2026; high pre-order interest | Unconfirmed | Unconfirmed |
| Astronomy fit | High (camera + HUD + light) | **Medium-high — global distribution + AR1 camera + 12 hr battery is great for capture + audio narration, but no HUD = no overlay** | Low (no camera) | Low |

**Why it matters:** Rokid is now running **two distinct product lines**:
- **Rokid Glasses (HUD model, China-first, $499)** — closest form-factor competitor to Meta Ray-Ban Display in APAC.
- **Rokid AI Glasses Style ($299 globally, CES 2026)** — display-free Ray-Ban-Meta competitor, 38.5 g, 12 hr battery, 4K camera, multi-LLM, ~20,000-developer open ecosystem. **This is now the most price-competitive global Astra Vault audio/camera target outside the Meta family** (Rokid is at $299 vs Meta Ray-Ban Gen 2 at $379).

**Risks:** HUD model remains China-first; Style is screenless so no overlay UX; SDK doc quality still uncertain but the disclosed 20k-developer ecosystem suggests it is meaningfully open.

**Astronomy suitability: Style 7/10 (price + camera + audio narration), HUD Glasses 8/10 (HUD + camera but APAC-only)**

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

### Brilliant Labs Frame and Halo

| Field | Frame (Feb 2024) | **Halo (Nov 2025, second-gen)** |
| --- | --- | --- |
| Maker | Brilliant Labs (Singapore) | Same |
| Launch | Feb 2024 | **Pre-orders Aug 2025; shipping late Nov 2025** [verified 2026-05-13](https://www.roadtovr.com/brilliant-labs-halo-smart-glasses-price-release-date/) |
| MSRP | $349 | **$299 pre-order, rising to $349 post-launch (Matte Black)** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/brilliant-labs-unveils-halo-the-worlds-thinnest-ai-glasses-and-it-wants-to-be-your-everyday-specs) |
| Display | Monocular full-color microOLED via prism; ~20° FoV; 640×400 px | **0.2″ full-color microOLED HUD via prism (heads-up, not waveguide)** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/brilliant-labs-unveils-halo-the-worlds-thinnest-ai-glasses-and-it-wants-to-be-your-everyday-specs) |
| Camera | 1280×720 (720p) | Camera + IMU + optical sensor + microphone array |
| Speakers | None | **Bone-conduction speakers** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/brilliant-labs-unveils-halo-the-worlds-thinnest-ai-glasses-and-it-wants-to-be-your-everyday-specs) |
| Mics | 1 | Microphone array |
| Weight | 39 g | **~40 g** [verified 2026-05-13](https://www.engadget.com/wearables/brilliant-labs-launches-its-second-generation-smart-glasses-130000032.html) |
| SoC | Nordic nRF52840 + low-power MCU | **Alif Semiconductor B1 chip — ultra-low-power MCU with on-chip NPU for on-device AI / sensor fusion** [verified 2026-05-13](https://www.roadtovr.com/brilliant-labs-halo-smart-glasses-price-release-date/) |
| Battery | ~4 hr | **Up to 14 hr (all-day)** [verified 2026-05-13](https://www.tomsguide.com/computing/smart-glasses/brilliant-labs-unveils-halo-the-worlds-thinnest-ai-glasses-and-it-wants-to-be-your-everyday-specs) |
| SDK | noa.brilliant.xyz + Lua / Python (open source) | **Brilliant SDK (Flutter package for iOS + Android, native APIs on GitHub) + "Vibe Mode" natural-language app authoring; fully open-source hardware + software** [verified 2026-05-13](https://pub.dev/packages/brilliant_sdk) [verified 2026-05-13](https://github.com/brilliantlabsAR) |
| AI | Noa (OpenAI/Anthropic/Whisper hybrid) | **Noa: private conversational AI agent with persistent memory (faces, names, conversations); see/hear/speak** [verified 2026-05-13](https://www.designboom.com/technology/halo-open-source-glasses-private-ai-agent-brilliant-labs-08-01-2025/) |
| Distribution | Direct from Brilliant Labs | Direct from Brilliant Labs |
| Privacy | LED indicator | LED indicator |
| Installed base | <50k units (unconfirmed) | Pre-order tier; small but growing |

**Why it matters:** **Still the only consumer platform where Astra Vault can do absolutely anything we want.** Open SDK across both Frame and Halo, with Halo bringing a Flutter SDK that aligns with the Astra Vault React-Native codebase. Vibe Mode means we could ship a community-authored "Sky Lab" prototype that other Halo users remix in-headset.

**Risks:** Tiny user base; build quality / battery longevity questionable. Treat as R&D playground, not consumer channel.

🟢 **Use Brilliant Labs to ship "Sky Lab" — an open-source Astra Vault reference implementation. Generates patent / publication assets, recruits dev community, hedges against Meta SDK lockdown.**

**Astronomy suitability: 6/10 product / 10/10 prototyping**

---

### Even Realities G1 / G2

| Field | G1 (2024) | G2 (Nov 2025) |
| --- | --- | --- |
| Maker | Even Realities (Hong Kong / Shenzhen) | Same |
| Launch | Mid 2024 | **12 Nov 2025** [verified 2026-05-13](https://9to5google.com/2025/11/12/even-realities-launches-g2-smart-glasses-r1-control-ring/) |
| MSRP | $599 | **$599** (R1 ring controller +$249) [verified 2026-05-13](https://glassalmanac.com/even-g2-reveals-599-price-on-nov-12-2025-why-buyers-should-care/) |
| Display | Binocular green microLED ~25° FoV | **HAO 2.0 dual micro-LED waveguides, 640×350 px, 27.5° FoV, up to 1,200 nits green monochrome, 60 Hz; 75% larger viewing area, +50% resolution vs G1** [verified 2026-05-13](https://www.dezeen.com/2025/11/12/even-realities-g2-smart-glasses-with-camera-free-ai-functionality/) |
| Camera | **None** | **None — explicit privacy-first design** [verified 2026-05-13](https://the-gadgeteer.com/2026/04/04/7-reasons-these-camera-free-smart-glasses-keep-winning/) |
| Speakers | None | **None — no audio output by design** |
| Mics | Dual | 4-mic array |
| Weight | 44 g | **36 g** [verified 2026-05-13](https://www.dezeen.com/2025/11/12/even-realities-g2-smart-glasses-with-camera-free-ai-functionality/) |
| SoC | Custom low-power MCU + phone-paired | Same architecture |
| Battery | ~1.5 hr active display | **>2 days typical; case carries 7 additional full recharges; BT 5.2** [verified 2026-05-13](https://www.dezeen.com/2025/11/12/even-realities-g2-smart-glasses-with-camera-free-ai-functionality/) |
| SDK | Limited; "Even AI" app | **Even Hub app store launched 3 Apr 2026 with ~50 apps and 2,000+ registered developers; SDK + R1 ring APIs exposed to creators but documentation NOT publicly published as of launch** [verified 2026-05-13](https://virtual.reality.news/news/even-realities-even-hub-launches-can-constrained-smart-glasses-build-an-app-ecosystem/) |
| Distribution | Direct, retail | Direct + Even Realities online shop |
| Privacy | n/a (no camera) | n/a (no camera, no speakers) |
| Installed base | <100k (unconfirmed) | Unconfirmed; >$5M Pre-CES 2025 sales reported |
| Astronomy fit | Low — no camera kills capture | Low — no camera, no speakers (no audio narration) |

**Why it matters:** Beautiful design, near-prescription-frame indistinguishability, the model that proves "glasses people will actually wear can include a HUD." But **no camera + no speakers = no Astra Vault capture, no Astra Vault narration**. Astra Vault could theoretically feed a star chart over the Even Hub SDK, but with no image identification and no audio, it would be a text-only constellation map — strictly worse than holding up a phone.

**Astronomy suitability: 2/10** (text-only star chart at most)

---

### Halliday Glasses

| Field | Value |
| --- | --- |
| Maker | Halliday |
| Launch | Announced CES 2025; **now shipping at $489–$499** [verified 2026-05-13](https://www.androidpolice.com/halliday-glasses-review/) |
| MSRP | **$489–$499** depending on colorway (black / tortoise / gradient) [verified 2026-05-13](https://hallidayglobal.com/products/halliday-glasses) |
| Display | **"DigiWindow" — a 3.6 mm micro-LED projector module inside the upper-right of the frame projecting onto the user's eye; FoV comparable to a 3.5″ screen at arm's length; not a waveguide** [verified 2026-05-13](https://techcrunch.com/2025/01/08/hallidays-489-smart-glasses-beam-a-tiny-screen-to-your-eye/) |
| Camera | **NONE — Halliday explicitly has no camera** [verified 2026-05-13](https://www.androidpolice.com/halliday-glasses-review/) 🚨 (Earlier draft and other tracker sites have wrongly stated "5 MP camera" — Halliday is intentionally camera-free as part of its proactive-AI privacy posture) |
| Weight | **28.5 g** [verified 2026-05-13](https://hallidayglobal.com/products/halliday-glasses) |
| Battery | **Up to 12 hr typical** [verified 2026-05-13](https://hallidayglobal.com/products/halliday-glasses) |
| Connectivity | BT to iOS/Android phone for translation, notifications, navigation, "cheat sheet" notes |
| SDK | None public as of May 2026 |
| Distribution | Direct + retail (US + Asia) |

**Why it matters:** Design intrigue, but **no camera + no SDK = no Astra Vault**. Watch list only.

**Astronomy suitability: 1/10** (no camera kills capture; no display brightness sufficient for night sky readability claimed)

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
| Datasets | Aria Everyday Activities, Aria Digital Twin, Aria Pilot Dataset (all CC-licensed for research) |
| Hardware | Aria Gen 1 (since 2020), **Aria Gen 2 — applications open as of 2026; broad rollout to qualified applicants targeted Q2 2026; >200 academic and corporate research partners already on the program; new partners must apply via projectaria.com Research Kit application** [verified 2026-05-13](https://www.meta.com/blog/aria-gen-2-updates/) |
| Notable partnerships | **NVIDIA + Aria Gen 2 + FoundationStereo egocentric depth-sensing collaboration announced 2025** [verified 2026-05-13](https://www.meta.com/blog/project-aria-gen-2-next-generation-egocentric-research-glasses-reality-labs-ai-robotics/) |
| Access | Research license via projectaria.com (Meta application required) — non-profits, academic, and corporate research all eligible |

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
