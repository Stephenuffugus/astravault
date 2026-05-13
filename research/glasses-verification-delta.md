# Smart Glasses Verification Delta — 2026-05-13

**Author:** R&D (Claude Opus 4.7, 1M-context)
**Date:** 2026-05-13
**Source doc:** `/research/smart-glasses-platforms.md` (updated in place during this pass)
**Mode:** WebSearch + WebFetch enabled (second pass; the first pass on the same date populated baseline citations)
**Scope:** Engineering-facing changelog of what was verified, what was wrong in memory, and what is still unconfirmed.

---

## Big picture

The original memory-only draft was ~85% accurate at the platform-list level. Hardware existence, manufacturer, price band, and SDK posture were almost all correct. Where memory failed was on **specific quantitative claims** (weight, FoV, battery hours, ship dates) and on **near-real-time market events** (Air 2 Ultra discontinuation, Rokid Style global SKU change, Halo shipping in Nov 2025 not "late 2025 rumor"). Verification net: doc now carries ~80 inline `[verified 2026-05-13]` citations spanning 11 priority platforms.

The single biggest spec correction is **Meta Ray-Ban Display weight: 69 g (verified), not 50 g (memory).** That changes the comfort math for long observing sessions and re-prioritizes our "comfort-validation flow" patent claim.

The single biggest market correction is **Rokid AI Glasses Style is the global SKU at $299 (screenless), not the HUD model at $499 (China-first).** That changes Phase 1 platform ordering — Rokid joins Meta Ray-Ban Gen 2 / Oakley HSTN as a global audio/camera target rather than being a Meta Ray-Ban Display competitor.

---

## Corrections made (what memory got wrong)

### Quantitative spec corrections

- **Meta Ray-Ban Display weight: 69 g standard, 70 g large** — was "~50 g (unconfirmed)". Source: UploadVR + Engadget hands-on. Display glasses are ~33% heavier than regular Ray-Ban Meta (52 g). Comfort math changes for 4+ hour observing sessions.
- **Meta Ray-Ban Display HUD-on battery: ~1.5 hr observed real-world** — was "~4 hr (unconfirmed)". Tom's Guide testing showed 60% drain after 90 min of moderate use. Meta's "6 hr mixed use" claim is only credible at very light usage. A typical dark-sky session needs case + spare charging strategy.
- **Meta Ray-Ban Display FoV: 14° H × 14° V (20° diagonal)** — original draft had 20° diagonal correct but missed the horizontal/vertical decomposition. Brightness range is 30–5,000 nits, content refresh 30 Hz inside a 90 Hz panel.
- **Oakley Meta HSTN weight: 53 g** — was "~58 g (unconfirmed)". Per Tom's Guide.
- **Halliday weight: 28.5 g** — was 35 g claimed. Per Halliday product page.

### Date / launch-status corrections

- **Even Realities G2 launched 12 Nov 2025**, not "April 2026" as the original draft implied. The Apr 2026 date was the **Even Hub app store** launch — the G2 hardware had been shipping for ~6 months already. Material confusion in the source draft.
- **Brilliant Labs Halo shipped late Nov 2025** at $299 pre-order / $349 post-launch. Original draft called it "rumored late 2025." Halo is now 6 months into general availability.
- **Rokid AI Glasses Style globally available 19 Jan 2026** at $299. Original draft expected a Q1 2026 global rollout of the HUD model — the SKU that actually went global is the screenless one.
- **TCL RayNeo X3 Pro: China launch May 27 2025 at ~¥8,999; US listing $1,299 with trade-in promo Dec 2025–Jan 2026.** Original draft had "late 2025 / 2026 retail (unconfirmed)."
- **Samsung Galaxy XR (Moohan) shipped 31 Oct 2025 at $1,799** — correctly stated in the first pass but reverified in this pass.
- **Apple Vision Pro M5 refresh shipped 22 Oct 2025**, $3,499 unchanged, Dual Knit Band, 120 Hz, ~2.5 hr battery.

### Product-status corrections

- **XREAL Air 2 Ultra DISCONTINUED Feb 2026.** Not flagged in the original draft. After-sales support continues. 6DoF use case shifts to XREAL Project Aura (Android XR lead-partner glass, 2026 launch, 70° FoV, X1S chip, split-compute puck).
- **Even Realities G2 has no speakers either, not just no camera.** Original draft only flagged the missing camera. Privacy-by-design: no audio output at all. Even more restrictive Tier-3 case than originally judged.
- **Even Hub SDK documentation is NOT publicly published as of April 2026 launch.** Original draft suggested it was an "open SDK"; the Hub launched with 50 apps and 2,000+ registered developers but creators work under NDA with Even Realities.
- **Halliday has NO camera.** Original draft contained a contradiction — the spec table claimed 5 MP camera while a separate inline note said "no camera." Verified: Halliday is intentionally camera-free as part of its proactive-AI privacy posture. The 5 MP claim originated from third-party trackers conflating Halliday with similarly-named CES 2025 entries.
- **Apple Glasses: timing firmed to Sep–Oct 2026 unveil → 2027 retail.** Original draft had "2026–2027." Gurman now reports four acetate frame designs in testing (black / ocean blue / light brown). HUD model pushed to 2028+. Vision Pro 2 redesign reportedly shelved to prioritize glasses.

### SDK / market structure corrections

- **Rokid Style architecture: dual-chip NXP RT600 + Qualcomm Snapdragon AR1.** Original draft assumed single AR1. The dual-chip design (always-on low-power MCU + heavyweight AI/imaging) is structurally similar to Meta's WDAT-side compute split and is a tell that Rokid is targeting all-day wear at the cost of latency on heavy operations.
- **Rokid open ecosystem ~20,000 registered developers** — original draft assumed YodaOS was relatively closed. Reverse is true: this is now one of the largest non-Meta open ecosystems.
- **Brilliant Labs Halo SDK is Flutter (mobile) + native APIs on GitHub** — original draft assumed Lua/Python continued. The Flutter pivot is significant for Astra Vault because it aligns better with our React-Native mobile codebase via embedded Flutter modules than the Lua-only Frame SDK did.
- **XREAL One series sold 111,000 units in 2025; XREAL crossed 700k lifetime by Jun 2025**, with ~36% global AR-display-glasses share Q2 2025. Original draft had ">500k cumulative (Air series) (unconfirmed)."
- **Project Aria Gen 2 applications open for both academic AND corporate research partners.** Q2 2026 broad rollout. >200 partners already on program. NVIDIA + Aria Gen 2 + FoundationStereo collaboration is announced.

---

## Net-new strategic findings

1. **Apple is now first-party in astronomy environments.** visionOS 26's interactive Jupiter Environment (user stands on Jupiter's moon Amalthea, scrub time-of-day) is the first true interactive astronomy environment on a major XR platform. Astra Vault visionOS port should ride alongside, not compete with, the Environments system — propose downloadable celestial-body environments or user-recorded sky-dome environments.

2. **Rokid Style globalization makes the audio/camera-glasses tier a four-horse race.** Meta Ray-Ban Gen 2 ($379) / Oakley HSTN ($399) / Rokid Style ($299) / Oakley Vanguard ($499). Astra Vault should plan Rokid Style in Phase 1 alongside the Meta family — same architecture, broader global distribution at a lower price point.

3. **Halo is now the cleanest open SDK in the consumer market.** Flutter SDK + GitHub native APIs + Alif B1 on-chip NPU + 14 hr battery + bone-conduction speakers + full-color HUD. The on-device NPU specifically opens the door to on-glasses meteor detection without phone offload — a Phase-1 R&D ticket worth filing.

4. **Even Hub is gated, not open** — despite the 2,000-developer headcount. Treat similarly to Meta WDAT preview: developer-program approvals required. Combined with no camera and no speakers, the Tier-3 verdict on Even Realities stands firm.

5. **Project Aria Gen 2 application window is open right now**, with Q2 2026 broad rollout. Applying immediately would put hardware in our hands within our Phase-1 timeline. The NVIDIA / FoundationStereo collaboration also signals what Meta is investing in for future Ray-Ban Display generations — research-led visibility ahead of the consumer roadmap.

6. **XREAL Project Aura inherits the 6DoF play from the discontinued Air 2 Ultra**, but as an Android XR partner glass rather than a tethered USB-C display glass. The 70° FoV with X1S split-compute puck is the "lightweight Galaxy XR" product — Astra Vault should keep an Android-XR-Aura test target.

7. **Meta Ray-Ban Display HUD-on real-world battery is ~1.5 hr, not the marketed 6 hr.** This is the single most operationally important spec correction in this pass. Power-aware HUD design (Standby-HUD by default, full overlay only on voice-trigger or gesture) is now load-bearing rather than nice-to-have.

---

## Still unconfirmed (after this pass)

- **Meta WDAT graphics API + Neural Band gesture API roadmap.** Meta has not publicly committed to a date for HUD frame-buffer rendering or gesture-API exposure to third parties. The general-availability publishing target for 2026 covers app submission via the current event-trigger model, not graphics access. Without these, our HUD-overlay UX runs through Meta-AI-mediated text cards only.
- **Voice-trigger latency benchmark (ms) for Ray-Ban Display HUD invocation.** Reviewers describe latency qualitatively ("near real-time," "fairly low") but no numeric benchmarks have been published. Worth instrumenting ourselves once we have a unit.
- **Magic Leap 3 / consumer pivot.** No public news in 2026. Remains enterprise-only.
- **Vuzix Z200 successor.** No public announcement.
- **Xiaomi 2026 smart-glasses SKU specs and SDK openness.** Mijia rumored but unconfirmed publicly.
- **Gemini Android XR astronomy entitlements.** Google I/O 2026 is happening today (13 May 2026) and is the formal Android XR glasses showcase. Re-verify within 48 hours.
- **Dark-sky-mode firmware (red-only LED indicators).** No platform ships this. Partnership / patent gap remains for Astra Vault.
- **RayNeo X3 Pro SDK developer docs.** Claim exists; public docs are thin. Worth direct contact with TCL.
- **iOS / Android background-mic permission lifecycle on glasses-paired apps.** Platform-engineering question — not answerable from journalism. We'll need to instrument this ourselves on iOS 18 / Android XR.

---

## Implications for Phase 1 plan

- **Add Rokid AI Glasses Style as a Phase 1 target** alongside Meta Ray-Ban Gen 2 / Oakley HSTN. Same architecture (voice + camera + audio narration), $299 global price point, 20k-developer ecosystem.
- **Order a Brilliant Labs Halo dev unit immediately.** $299, Flutter SDK, NPU on-chip — perfect prototype playground for the cross-glasses observation merge protocol patent.
- **Apply for Project Aria Gen 2 research kit immediately.** Application window is open, Q2 2026 rollout aligns with our Phase 1 timeline.
- **Engineer for Meta Ray-Ban Display ~1.5 hr HUD-on battery, not the marketed 6 hr.** Standby-HUD default, full overlay on voice / gesture only.
- **Drop XREAL Air 2 Ultra from the build list.** Discontinued. Re-target XREAL Project Aura when it ships in 2026.
- **Ship a visionOS port that integrates with the Environments system** — propose celestial-body environment extensions rather than a standalone immersive app.
- **Re-verify Gemini Android XR astronomy entitlements after Google I/O 2026** (today). If Gemini exposes a multimodal sky-pointing API natively, our patent claim on "gaze-prompted multimodal astronomy assistant invocation" needs to land within 30 days to retain priority.

---

End of delta.
