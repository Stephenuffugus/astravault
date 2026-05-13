# R&D Synthesis — Session 2 (2026-05-13)

## What this is
Seven R&D dives ran in parallel this session: competitive landscape, smart-glasses platforms, moment capture + triangulation, 3D visualization, NASA/SpaceX/ESA integration, emerging tech, meteor + fireball networks. ~54,000 words total in `/research/`. This file distills the most actionable findings into a single read.

> All seven reports were authored in **memory-only mode** because WebSearch / WebFetch are denied in this Codespace. Every report flags `[VERIFY]` lines and ends with a "Verify Before Citing" section. Before any external commitment (partnership outreach, public claim, patent filing), do a live-web verification pass.

---

## The strategic shape

Astra Vault's moat is not a single feature — it is the **intersection** that no competitor combines: collection + ATP + capture + cross-reference + smart glasses + community-without-interaction + smart-telescope bridge + 14+ live data feeds.

Three things will make or break this:

1. **The voice-triggered post-event capture pipeline.** Continuous background camera is blocked on every consumer smart-glasses platform shipped through 2026. The legal/architectural moat is the cross-glasses observation merge protocol — multiple users' triggered captures fused by timestamp + bearing into one reconstructed event.

2. **Astrometric plate-solve on-device.** IMU pose alone gives ±3-8° — useless for triangulation. `tetra3`-class per-frame plate-solve brings it to ±0.05°. This is the single most important capture-stack feature.

3. **Game-feel and ATP integrity, not tokenomics theatrics.** Every competitor that died chose tokens over game. The ATP-as-bonus stance from the Director is correct and load-bearing.

---

## The 10 highest-conviction next moves

| # | Action | Effort | Source report |
|---|---|---|---|
| 1 | **Wire GMN as our cross-reference partner first** (CC BY 4.0, mature `gmn-python-api`, 1,100+ stations) | 2-3 weeks | `meteor-networks.md` |
| 2 | **Integrate Launch Library 2 (LL2)** — subsumes every commercial-launch tracker including SpaceX | 1 day | `integration-opportunities.md` |
| 3 | **Smart-telescope bridge (ASCOM Alpaca client)** in `services/scopes/` — covers Seestar S50, Dwarf 3, Vespera, Unistellar via one client | 3 weeks | `emerging-tech.md` |
| 4 | **Build the Moment Capture Record schema + provisional patent draft** for "cross-glasses observation merge protocol" | 1 week + legal | `moment-capture-glasses.md` |
| 5 | **Adopt r3f as the primary 3D engine**, Skia as the 2D shader/HUD overlay layer. Move CelestialCanvas from SVG to r3f when bandwidth permits | 2 weeks | `3d-visualization.md` |
| 6 | **Adopt HiPS (Hierarchical Progressive Surveys) as our sky-tile standard** from day 1 — Aladin / CDS / ESA Sky all use it | 1 week | `integration-opportunities.md` |
| 7 | **Bluesky / ATProtocol broadcast-only Lexicon** (`app.astravault.observation`) — preserves the no-chat invariant while broadcasting observations | 2 weeks | `emerging-tech.md` |
| 8 | **AMS auto-submit pathway** (Mike Hankey / Vincent Perlerin) — closes the contribute-back loop. Requires email coordination first. | 1 week + outreach | `meteor-networks.md` |
| 9 | **AstroBin + ZWO + Unistellar outreach (Director, personally).** Three emails, three weeks. If two land we have 2026's hardware ecosystem. | 1 hour | `emerging-tech.md` |
| 10 | **Brilliant Labs Frame R&D pilot** — only consumer glasses with no SDK gatekeeping. Patent reduction-to-practice playground. | 1 dev-kit + 4 weeks | `smart-glasses-platforms.md` |

---

## Eleven patentable opportunities flagged

Compiled across the 7 reports. Items 1-5 are flagged as the strongest candidates for **immediate provisional filing** (US provisional = $300 fee, 12-month protection).

1. **Cross-glasses observation merge protocol** — multi-observer voice-triggered captures fused by timestamp + bearing into one reconstructed celestial event 🟢
2. **Attention-hash bound to r3f camera-dwell time** on celestial objects (extends SWS protocol into spatial-temporal claims) 🟢
3. **Dark-adapted minimal-brightness AR rendering keyed to Bortle scale** — auto-dims HUD per measured/reported sky class 🟢
4. **On-device astrometric plate-solve gating ATP earn** — only "real" sky observations earn (anti-cheat via star recognition) 🟢
5. **Crowdsourced phone-metadata → triangulation → 3DGS-of-sky-backdrop → emissive trail** end-to-end pipeline 🟢
6. Cultural-variant constellation art via vetted GenAI overlay
7. Vision Pro eye-tracking → attention-hash gaze emission
8. Anonymous-presence 3D Shared Sky via attention-hash crowd fingerprints (no usernames, but spatially-localized presence)
9. Astra Vault "Phone Tier" aggregate dataset as CC BY 4.0 contribution alongside professional networks
10. Attention-hash bound to confirmed multi-station meteor crossref (your observation matched 3 others = bonus hash)
11. Sponsored RMS station program ($300 BoM per node, $35k = 100-station Astra Vault camera network)

---

## Five dealbreakers / showstoppers

1. 🚨 **No consumer platform allows continuous background camera access on glasses** — drop "Auto-Detect Mode 3" from the handoff doc for glasses, keep it for phones with caveats
2. 🚨 **Meta Ray-Ban Display has no public frame-buffer API** as of 2026 — overlay mode must run through Meta-AI-mediated text/icon cards until WDAT graphics APIs ship
3. 🚨 **RMS itself is GPL-3** — don't link from any Astra Vault closed-source binary. `WesternMeteorPyLib` (MIT) is the right pipeline component
4. 🚨 **iOS 17+ background camera is essentially impossible** without enterprise entitlements — the phone-side meteor capture must be foreground-with-screen-on, or use the new app-controlled buffered audio trigger
5. 🚨 **3DGS rendering on mobile** needs aggressive decimation to stay performant — plan for desktop-quality fidelity on web/desktop, decimated splat counts on phones

---

## The competitive shape

41 apps surveyed in `competitive-landscape.md`. No mainstream app does what Astra Vault does — but threats are real and rising:

| Threat | Why it matters | Posture |
|---|---|---|
| **ZWO Seestar** | Hardware-led smart-scope ecosystem growing fast | **Integrate** (import their observations into the Vault) — don't compete head-on |
| **Night Sky (iCandi) on visionOS** | Apple-platform foothold = Apple-Glasses Day-1 lead | Watch closely; consider visionOS variant |
| **Meta first-party astronomy app on Ray-Ban Display** | Strategic risk if Meta ships first | Beat them to market |
| **Google Gemini astronomy mode on Android XR** | Google's ML horsepower vs. our specialized vertical | Differentiate on data depth + game loop |
| **Chinese-market entrant we haven't catalogued** | Asia-Pacific is 28% of global market; we have zero coverage in our research | **Priority research gap** — need live-web verification pass |

---

## What we won't build (integrate instead)

21 items in `integration-opportunities.md`. Highest-leverage:
- **Launch tracking** → Launch Library 2 (not r-SpaceX which is stale)
- **Sky tiles** → CDS HiPS / Aladin Lite
- **Light pollution** → Globe at Night + Light Pollution Map (Falchi et al.)
- **All-sky cameras** → AllSky7 (Mike Hankey runs both AMS and AllSky7)
- **Variable stars** → AAVSO VSX + AAVSO API
- **Asteroid orbits** → IAU Minor Planet Center
- **Comet ephemeris** → JPL Horizons (already in scope)
- **Aurora forecasts** → NOAA SWPC + Aurorasaurus

---

## Sleeper findings

1. **NOAA GOES GLM** detects bright bolides from geostationary orbit. Federal, free, real-time. The "satellite saw it too" layer that no consumer app surfaces.
2. **Project Aria datasets are free training data** for our meteor-streak detector and head-pose models (Meta's research platform).
3. **Galaxy Zoo / Zooniverse classifier as an Academy mini-game** — 5-second micro-interactions with real scientific value. Drop into the Learn tab as a path.
4. **Tempest + Unihedron SQM-LU BLE accessory** ($79 retail, $19 margin) is a plausible Astra Vault hardware product line, not just a software integration.
5. **Hubble Source Catalog + DASCH** (a century of Harvard glass plates digitized) — every collected object can show "what it looked like in 1923".

---

## Anti-patterns called out

The emerging-tech report named these explicitly. Worth memorializing:
- Another NFT collection (don't)
- Walk-to-earn analogues (StepN died for a reason)
- In-app chat / DMs (violates the Director's no-interaction invariant)
- Worldcoin (privacy red flag, regulator risk)
- Launching ATP as a public chain token (vault-based portability is the moat)
- Any astrology partnership (collapses scientific credibility)

---

## What needs WebSearch / WebFetch to finish

A live-web verification pass would harden these items in particular:
1. **Asia-Pacific competitive coverage** (Chinese / Korean / Japanese apps) — biggest research gap right now
2. **Meta Ray-Ban Display shipped-unit count** + WDAT graphics API roadmap
3. **Samsung Moohan retail launch + Android XR partner list** (Samsung / Lenovo / ASUS / Xreal)
4. **Gaia DR4 release date** (matters for our star-catalog build)
5. **Vera Rubin / LSST operations status** + alert broker availability
6. **Privateer current access tier** for orbital-debris data
7. **GMN, AMS, AllSky7 lead email confirmations** before outreach
8. **Current SDK status** of Brilliant Labs Frame + Halo + Even Realities G2
9. **Smart-telescope SDK URLs** (Seestar, Dwarf 3, Vespera Pro)
10. **Bluesky Lexicon adoption status** + recent AT Protocol changes

Recommended: ask Stephen to grant WebSearch / WebFetch via `update-config` (or `.claude/settings.json` `permissions.allow: ["WebSearch", "WebFetch"]`) and run a verification-pass agent before any of the top-10 next-moves go public-facing.

---

## Source documents
- `research/competitive-landscape.md` (8,733 words, 41 apps)
- `research/smart-glasses-platforms.md` (7,226 words, 25 platforms)
- `research/moment-capture-glasses.md` (9,326 words, 11 patent claims, 12-week build order)
- `research/3d-visualization.md` (5,835 words, r3f + 3DGS recommended)
- `research/integration-opportunities.md` (7,891 words, 80+ APIs catalogued)
- `research/emerging-tech.md` (7,449 words, smart-telescope + LLM + Bluesky)
- `research/meteor-networks.md` (7,714 words, GMN + AMS partnership path)

— Synthesized session 2, 2026-05-13.
