# Competitive Landscape — Astra Vault R&D

**Author:** Claude R&D agent (Opus 4.7, 1M context)
**Date prepared:** 2026-05-13
**Mode:** Memory-only (no WebSearch / WebFetch available in this Codespace)
**Training cutoff:** January 2026

---

## Methodology Note

This document is written in **memory-only mode**. Every claim is confidence-labeled:

- `[HIGH]` — well-known, stable fact unlikely to have changed
- `[MED]` — directionally true but specifics (versions, prices, install counts) may have drifted
- `[LOW]` — uncertain, needs live verification before being cited externally
- `[UNK]` — beyond training cutoff or not in memory

Specific numbers (MAU, install counts, prices, subscription tiers) are flagged "unverified" and re-listed in the **Verify Before Citing** section at the end. Treat that section as the to-do for whoever runs the next live-network pass.

Where I have no useful memory of a category or app, I say so rather than fabricate. Niche apps (especially Asia-Pacific and regional citizen-science portals) get shorter entries than the big planetariums.

---

## Executive Summary

1. The stargazing app market is dominated by **planetarium / point-and-identify apps** — Stellarium Mobile, SkySafari, Star Walk 2, Night Sky, SkyView, Sky Map — all of which are fundamentally the same product with variations in database depth, visual polish, and pricing model. `[HIGH]`

2. **No mainstream app combines** collection mechanics, token economy, education curriculum, citizen-science contribution, cross-referenced event capture, and smart-glasses delivery into a single product. This is Astra Vault's whitespace. `[HIGH]`

3. **SkySafari (Simulation Curriculum)** is the most feature-complete pro tool — telescope control, deep observation logging, large database — but it has zero gamification, zero community layer, and a steep price ladder. It's a tool, not a platform. `[HIGH]`

4. **Stellarium Mobile** is the open-source-derived consumer app from Noctua / Stellarium Labs, with a free tier and a "Plus" paid tier. Strong sky database, weaker on social / event capture. `[HIGH]`

5. **Star Walk 2** (Vito Technology) is the visual-polish leader on iOS — beautiful UI, AR mode, broad consumer appeal. Subscription-heavy monetization in recent versions. `[MED]`

6. **Night Sky** (iCandi Apps) has the strongest Apple-ecosystem integration (Apple Watch, AR, Vision Pro) and a recurring "Sky Tonight" / Live Pulse-style notification feature. Subscription model. `[MED]`

7. **Citizen-science apps are functional but ugly** — Globe at Night, AAVSO VStar, Aurorasaurus, Loss of the Night — they collect valuable data but have zero retention design, no rewards, no game loop. Astra Vault can effectively wrap them. `[HIGH]`

8. **Smart-scope apps (Unistellar, Vaonis Singularity, ZWO ASIAIR, Seestar/ZWO Seestar S50)** own a small but high-margin segment. They are hardware-tied and have no incentive to build broad community or collection layers. Astra Vault should integrate with their data outputs, not compete head-on. `[MED]`

9. **NightCap Camera (iOS only)** is the closest thing to Astra Vault's meteor capture today — it has a "Stars" / meteor mode and long-exposure tools — but it's a single-developer camera utility with no cross-reference layer, no community, no professional-data tie-in. `[MED]`

10. **Heavens-Above / Look4Sat / ISS Detector** own the satellite/ISS-pass niche. Look4Sat is open-source (Android, F-Droid heritage). All three are highly accurate but visually dated. `[HIGH]`

11. **NASA Eyes** and **Solar System Scope** are the strongest free 3D solar-system visualizers. NASA Eyes is non-commercial and not API-accessible in the way developers would want. `[HIGH]`

12. **No app owns the smart-glasses astronomy use case yet.** Ray-Ban Meta has photo/video and voice, but no astronomy-first experience exists on Meta, XREAL, Rokid, or pre-launch Android XR / Apple Glasses. First-mover slot is open. `[MED]`

13. **Asia-Pacific market** is dominated by the same Western apps (Stellarium, Star Walk 2, SkySafari) plus localized Chinese sky apps that I have weaker memory of (see Asia-Pacific section). Japanese gacha/collection culture aligns strongly with Astra Vault's rarity-tiered vault. `[MED]`

14. **The fastest-growing competitive threats** to watch (as of training cutoff) are: ZWO's Seestar consumer smart-scope ecosystem, Vaonis's Singularity app, and any Meta / Google / Apple first-party astronomy app shipped onto smart glasses. `[MED]`

15. **Astra Vault's defensible whitespace** is the *intersection*: collection + ATP economy + cross-referenced event capture (meteor / eclipse / aurora / iridium-flare retrospective) + smart-glasses-first UX + community-without-interaction. Any single piece exists somewhere; the combination is novel. `[HIGH]`

---

## The Gap Analysis

What no single app does today (training cutoff Jan 2026):

| Capability | Best current player | Gap |
|---|---|---|
| Real-time meteor capture with cross-reference to CAMS / AMS / other users | NightCap (capture only), CAMS (pro network only) | No app connects consumer eyewitness capture to professional astronomical data about the same event `[HIGH]` |
| Collection mechanics for the night sky (rarity tiers, gacha-style discovery) | None mainstream; Night Sky / Star Walk have "favorites" but no rarity gradient | Open `[HIGH]` |
| ATP-style attention token economy tied to verified observation | None; some Web3 stargazing experiments existed but none reached scale `[LOW]` | Open `[HIGH]` |
| Smart-glasses-first astronomy UX with HUD constellation overlay | None shipped at scale | Open `[MED]` |
| "I didn't know that happened" retrospective sky monitor | None | Open `[HIGH]` |
| Integrated education curriculum with quizzes + ATP rewards | Star Walk Kids and a few EdTech apps cover narrow slices | No app blends a full Astronomy Academy with attention-token rewards `[HIGH]` |
| Community contribution without forced social interaction | Zooniverse (web, science only); none in stargazing apps | Open `[HIGH]` |
| Cross-user meteor / aurora / eclipse triangulation surfaced to the user | Aurorasaurus does aurora map crowdsourcing but no per-user "you and 3 others saw this" `[MED]` | Mostly open `[MED]` |
| Multi-spectrum (X-ray / UV / IR / radio) visual swap per object via SkyView | None on consumer mobile | Open `[HIGH]` |
| Telescope-history overlay (which telescope discovered/observed this object) | None mainstream | Open `[MED]` |

Astra Vault's unique combination = collection + education + citizen science + token economy + cross-referenced event capture + smart-glasses-first + community-without-interaction. That intersection is the moat.

---

## Apps by Category

### 1. Planetarium Apps — Western

#### Stellarium Mobile (Free + Plus) `[HIGH]`
- **Publisher:** Noctua Software / Stellarium Labs (Stellarium Labs is the commercial steward of the Stellarium project) `[HIGH]`
- **Platforms:** iOS, Android, web (web.stellarium.org runs in-browser, lighter feature set) `[HIGH]`
- **Pricing:** Free tier with limited database; Stellarium Mobile Plus is a paid upgrade — historically a one-time IAP, has reportedly shifted toward subscription tiers in recent versions `[LOW, verify]`
- **Core feature set:** Massive star + DSO database (millions of stars when Plus catalogs are downloaded), accurate sky simulation, telescope control via plugins, time travel, satellite overlays, deep-sky catalog. `[HIGH]`
- **Strengths:** Open-source heritage means deeply accurate sky simulation; respected by amateur astronomers; web version is uniquely accessible. `[HIGH]`
- **Gaps vs. Astra Vault:** No collection mechanics, no education curriculum (just info pages), no community layer, no event capture, no smart-glasses presence, no token economy. Visual style is utilitarian rather than aspirational. `[HIGH]`
- **API / integration posture:** The desktop Stellarium has a scripting interface and an open data model; the mobile apps are more closed. Stellarium-web does have published endpoints but they're not officially documented for third-party use. Integration is **possible but not encouraged** — Stellarium is a likely peer/reference, not a partner. `[MED]`
- **Regional focus:** Global; strong European user base because of French / European open-source community origin. `[MED]`

#### SkySafari (Simulation Curriculum) `[HIGH]`
- **Publisher:** Simulation Curriculum (US) `[HIGH]`
- **Platforms:** iOS, iPadOS, macOS, Android, Apple Watch companion. `[HIGH]`
- **Pricing:** Tiered — Basic (free or near-free), Plus (mid-tier), Pro (top tier with massive catalog and full telescope control). Has reportedly shifted toward subscription pricing in SkySafari 7/8 era. `[LOW, verify exact tiers and prices]`
- **Core feature set:** Largest mainstream consumer sky database; deep-sky catalog including NGC/IC, professional telescope control (computerized GoTo mounts via Wi-Fi/Bluetooth), observation logging, list-builder for Messier marathons etc. `[HIGH]`
- **Strengths:** The pro amateur's tool. Best-in-class telescope control. Trusted by serious amateur astronomers and astronomy clubs. `[HIGH]`
- **Gaps:** No gamification, no rewards, no education, no community, no event-capture system, no smart-glasses. UX is functional but dated; aimed at expert users, not the curious mass-market. `[HIGH]`
- **API / integration posture:** Closed. The telescope-control protocol is industry-standard (LX200, INDI-adjacent) but SkySafari itself isn't a platform. **Competition, not partner.** `[HIGH]`
- **Regional focus:** North America strongest, global presence. `[MED]`

#### Star Walk 2 (Vito Technology) `[HIGH]`
- **Publisher:** Vito Technology (Ukrainian-origin, global publisher of consumer mobile apps) `[HIGH]`
- **Platforms:** iOS, Android. `[HIGH]`
- **Pricing:** Free with ads + IAP; subscription model for the premium "Star Walk 2 Plus" / "Sky Tonight" tier. `[MED]`
- **Core feature set:** AR sky-pointing, beautifully illustrated constellations, calendar of celestial events, deep-sky object info. The "Sky Tonight" sibling app focuses on event notifications. `[HIGH]`
- **Strengths:** Best-in-class visual polish among consumer planetariums; very approachable for non-astronomers. Big installed base (claimed tens of millions of downloads historically — unverified specific number). `[MED, verify]`
- **Gaps:** No collection mechanics, no token economy, no education curriculum (just info text), no citizen science, no event capture, no smart-glasses integration, no real community. The model is "look up, identify, move on" — no retention loop beyond push notifications about upcoming events. `[HIGH]`
- **API / integration posture:** Closed consumer product. **Competition.** `[HIGH]`
- **Regional focus:** Global; well-distributed in Europe and the Americas. `[MED]`

#### Star Chart (Escapist Games) `[MED]`
- **Publisher:** Escapist Games Limited `[MED]`
- **Platforms:** iOS, Android, has historically had Windows / VR builds. `[MED]`
- **Pricing:** Free with IAP for premium content (deep-sky pack, comets pack, etc.) `[MED]`
- **Core feature set:** AR-style sky pointing, constellation art, basic deep-sky catalog, "infinite zoom" marketing. `[MED]`
- **Strengths:** One of the earliest mass-market AR sky apps; clean, simple UX. `[MED]`
- **Gaps:** Comparatively shallow database vs. Stellarium / SkySafari; no community, no capture, no education curriculum, no smart glasses. `[MED]`
- **API:** Closed. **Not a partner.** `[MED]`

#### Night Sky (iCandi Apps) `[MED]`
- **Publisher:** iCandi Apps (UK) `[MED]`
- **Platforms:** iOS, iPadOS, macOS, Apple Watch, Apple TV, visionOS (Apple Vision Pro). `[MED]`
- **Pricing:** Free tier with significant paid features behind "Night Sky+" subscription. `[MED]`
- **Core feature set:** AR sky pointing, constellation overlays, satellite passes, "Sky Tour" guided experiences, ISS pass notifications, Apple-ecosystem integrations (widgets, complications). Has shipped a visionOS experience. `[MED]`
- **Strengths:** Best Apple-ecosystem coverage of any sky app. Vision Pro support means they understand spatial / AR UX. Strong consumer brand. `[MED]`
- **"Live Pulse" / community feed:** Has shipped a community / social feed feature with photo sharing and reactions. This is the closest mainstream competitor to Astra Vault's Shared Sky concept — but it's broadcasting-style social, not contribution-without-interaction. `[LOW, verify current feature state]`
- **Gaps:** No collection mechanics, no token economy, no rigorous education curriculum, no meteor capture, no cross-referenced event triangulation, no citizen-science contribution path. `[MED]`
- **API:** Closed. Likely **competitor on smart-glasses** if Apple Glasses ships and iCandi gets early access. **Watch closely.** `[MED]`
- **Regional focus:** Strong in Apple-heavy markets (US, UK, Western Europe, Japan). `[MED]`

#### SkyView Lite / SkyView Free (Terminal Eleven) `[MED]`
- **Publisher:** Terminal Eleven `[MED]`
- **Platforms:** iOS, Android. `[MED]`
- **Pricing:** Free Lite + paid full version (one-time IAP historically). `[MED]`
- **Core feature set:** AR sky pointing with playful constellation art; beginner-friendly. `[MED]`
- **Strengths:** Approachable for absolute beginners; charming visual style. `[MED]`
- **Gaps:** Shallow database, no community, no education depth, no capture, no smart glasses. `[MED]`
- **API:** Closed. **Not a partner.** `[MED]`

#### Sky Map (formerly Google Sky Map) `[HIGH]`
- **Publisher:** Originally Google, now community-maintained open-source on F-Droid and Google Play. `[HIGH]`
- **Platforms:** Android only. `[HIGH]`
- **Pricing:** Free, open-source (Apache 2.0). `[HIGH]`
- **Core feature set:** Basic AR-style sky pointing, constellation overlays. `[HIGH]`
- **Strengths:** Free, open-source, no ads, no tracking. Historic credibility as Google's original sky app. `[HIGH]`
- **Gaps:** Hasn't been actively developed at the pace of commercial competitors; database is shallow vs. Stellarium. No community, no capture, no glasses. `[HIGH]`
- **API:** Open-source — could be a code reference, not an integration partner. `[HIGH]`

#### Distant Suns `[MED]`
- **Publisher:** Mike Smithwick / First Light Design `[MED]`
- **Platforms:** Historically iOS, Android. `[MED]`
- **Pricing:** Paid (one-time) and free tier. `[MED]`
- **Core feature set:** Veteran sky app — Mike Smithwick has been doing this since the early Mac days. Strong sky simulation, deep-sky catalog, telescope control in pro version. `[MED]`
- **Strengths:** Long-standing pedigree; respected in amateur astronomy circles. `[MED]`
- **Gaps:** Smaller market share than SkySafari / Stellarium; no community, no capture, no glasses. May be in maintenance mode rather than active development as of training cutoff. `[LOW, verify activity level]`
- **API:** Closed. **Not a meaningful threat or partner.** `[MED]`

#### Mobile Observatory `[MED]`
- **Publisher:** Wolfgang Zima (Austria) `[LOW]`
- **Platforms:** Android historically; iOS situation unclear. `[LOW]`
- **Pricing:** Paid (one-time). `[MED]`
- **Core feature set:** Deep pro-amateur tool — ephemeris, conjunction predictions, observability planning, planet detail. Power user oriented. `[MED]`
- **Strengths:** Loved by serious amateur astronomers for ephemeris depth. `[MED]`
- **Gaps:** Niche; not a consumer threat. Functions Astra Vault could replicate with JPL Horizons integration. `[MED]`
- **API:** Closed. **Not a partner.** `[MED]`

#### SkEye `[MED]`
- **Publisher:** Lavadip Software `[LOW]`
- **Platforms:** Android. `[MED]`
- **Pricing:** Free version + Pro paid. `[MED]`
- **Core feature set:** Lightweight AR sky pointer; sensor-fusion driven; "push-to" alignment for non-GoTo telescopes (use your phone as a finder). `[MED]`
- **Strengths:** Lightweight, fast, sensor-accurate; a tinkerer's favorite. `[MED]`
- **Gaps:** No community, no capture, no education curriculum, no glasses. `[MED]`
- **API:** Closed. **Not a partner.** `[MED]`

#### Heavens-Above (app + chrisp.com / heavens-above.com) `[HIGH]`
- **Publisher:** Chris Peat — independent. `[HIGH]`
- **Platforms:** Web is canonical; Android app exists; iOS situation weaker. `[MED]`
- **Pricing:** Free web; paid Android app (small one-time fee) historically. `[MED]`
- **Core feature set:** The canonical website for satellite pass predictions including ISS, Tiangong, Iridium flares (historical), Starlink trains, and bright satellite passes for your location. Also has good comet ephemerides. `[HIGH]`
- **Strengths:** Trusted reference for satellite predictions for 20+ years; extremely accurate. `[HIGH]`
- **Gaps:** UI is dated; mobile experience is bolted on; no community, no capture, no smart glasses, no education. `[HIGH]`
- **API / integration posture:** Heavens-Above doesn't officially publish an open API. The site is scrape-able but ToS-limited. **Better to use the underlying source data (CelesTrak TLEs) directly** than to integrate with Heavens-Above. `[MED]`
- **Regional focus:** Global. `[HIGH]`

#### Celestia `[HIGH]`
- **Publisher:** Open-source community (originally Chris Laurel) `[HIGH]`
- **Platforms:** Desktop (Win/Mac/Linux) and a mobile variant ("Celestia Mobile") exists for iOS/Android. `[MED]`
- **Pricing:** Free / open-source (desktop); paid mobile. `[MED]`
- **Core feature set:** 3D solar-system and galactic explorer — you can fly to other stars and planets. Pioneered the genre that NASA Eyes later commercialized. `[HIGH]`
- **Strengths:** Spectacular 3D solar-system exploration; deeply educational; open data. `[HIGH]`
- **Gaps:** Desktop-first; mobile is a port. No community, no capture, no glasses, no rewards. Aimed at curious explorers, not casual stargazers. `[HIGH]`
- **API:** Open-source code accessible. **Reference, not partner.** `[HIGH]`

---

### 2. Planetarium Apps — Asia-Pacific

This is where my memory is weakest. I'll be honest about what I do and don't know.

#### General observations `[MED]`
- The dominant planetarium apps in Japan, South Korea, and China are largely the **same Western apps** (Star Walk 2, Stellarium Mobile, SkySafari, Night Sky) with localized language packs.
- Domestic Chinese sky apps exist on Android (sideloaded from local app stores — Huawei AppGallery, Xiaomi GetApps, OPPO, etc.) but I don't have reliable specific names. `[LOW, needs Chinese-market research pass]`
- Japan has a strong amateur astronomy culture (the magazine *Tenmon Guide* / *Hoshi Navi*, the AstroArts brand). AstroArts publishes "Stella Navigator" / "StellaNavigator" — a deep planetarium application for Japanese amateur astronomers (more desktop than mobile). `[MED]`
- Vixen Optics (Japanese telescope manufacturer) has companion apps for their telescope products but they are small-scope utilities. `[LOW]`

#### Stella Navigator / AstroArts (Japan) `[LOW]`
- **Publisher:** AstroArts (Japan) `[MED]`
- **Platforms:** Windows primarily; mobile companion apps exist. `[LOW]`
- **Pricing:** Paid (Japanese-language astronomy software, fairly expensive — historically several thousand yen). `[LOW, verify]`
- **Core feature set:** Detailed Japanese-language planetarium with strong amateur-astronomer focus, observation planning, ephemerides. `[MED]`
- **Strengths:** Trusted Japanese-language brand; deep market penetration in Japanese amateur astronomy. `[MED]`
- **Gaps vs. Astra Vault:** Desktop-first, paid up-front, no community, no glasses, no gamification. Japanese gacha/collection culture is **untapped** by their product. `[MED]`
- **API:** Closed. **Reference, not partner.** `[LOW]`
- **Implication for Astra Vault:** Japan is an underserved market for collection-mechanic stargazing. Localization + gacha-style rarity tiers + Japanese astronomy lore could be highly differentiated. `[MED]`

#### Chinese-market sky apps `[LOW, weak memory]`
I do not have specific named recall of mainstream Chinese-market stargazing apps that I can responsibly cite. This is a research gap. Likely worth dedicated investigation:
- Search Huawei AppGallery, Xiaomi GetApps, OPPO App Market top stargazing apps `[UNK]`
- Look into any apps tied to Chinese space-program education initiatives (CNSA, "Tiangong Watcher" style) `[UNK]`
- Investigate whether ByteDance or Tencent has shipped a casual stargazing experience inside a super-app `[UNK]`

This is a high-priority gap to fill before claiming Asia-Pacific coverage.

---

### 3. Citizen Science Apps

#### Globe at Night `[HIGH]`
- **Publisher:** NOIRLab / NSF (US, with international consortium) `[HIGH]`
- **Platforms:** Web form (mobile-friendly) and historically an Android/iOS companion. `[MED]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Crowdsourced Bortle / limiting-magnitude reports. User compares their local night sky against star-chart templates and submits a brightness estimate, geotagged. `[HIGH]`
- **Strengths:** Long-running scientific dataset on light pollution trends. Internationally recognized. `[HIGH]`
- **Gaps:** Pure data-collection form. No retention, no rewards, no community, no learning curriculum. Astra Vault can effectively **wrap** Globe at Night submission into the ATP economy. `[HIGH]`
- **API / integration posture:** Globe at Night accepts data submissions; their FAQ historically allows aggregated re-use. **Likely partner / wrappable.** `[MED]`

#### AAVSO VStar / AAVSO Observer Tools `[HIGH]`
- **Publisher:** American Association of Variable Star Observers `[HIGH]`
- **Platforms:** Desktop (VStar is Java-based); mobile observer-reporting tools have lagged. `[MED]`
- **Pricing:** Free (AAVSO membership encouraged for full features). `[HIGH]`
- **Core feature set:** Variable star observation logging, light-curve analysis, contribution to AAVSO International Database. `[HIGH]`
- **Strengths:** Authoritative reference dataset in variable-star astronomy; serious amateurs contribute decades of light-curve data. `[HIGH]`
- **Gaps:** Desktop-centric, expert-focused; no consumer-friendly mobile experience. Astra Vault could surface "tonight's variable-star targets at your location" as a beginner-friendly contribution mode that feeds AAVSO. `[HIGH]`
- **API:** AAVSO has documented APIs for light-curve data access. **Strong partner candidate.** `[MED]`

#### Loss of the Night `[MED]`
- **Publisher:** Cosalux / German researcher consortium `[MED]`
- **Platforms:** Android, iOS historically. `[MED]`
- **Pricing:** Free. `[MED]`
- **Core feature set:** Light-pollution / sky-brightness reporting via guided star-counting (you confirm whether you can see specific stars). Result feeds into a global light pollution dataset. `[MED]`
- **Strengths:** Scientific rigor — uses individual-star detection rather than rough Bortle. Linked to the GLOBE at Night network. `[MED]`
- **Gaps:** Visually plain, no retention, no rewards, may be in maintenance mode. `[LOW, verify activity]`
- **API:** Research-led; data published but not API-first. **Wrappable.** `[MED]`

#### NASA Citizen Science Hub (CitizenScience.gov, science.nasa.gov/citizenscience) `[HIGH]`
- **Publisher:** NASA `[HIGH]`
- **Platforms:** Web portal aggregating dozens of projects (some web, some app). `[HIGH]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Catalog of NASA-affiliated citizen-science projects spanning planetary science, exoplanets, astrophysics. `[HIGH]`
- **Strengths:** Authoritative, trusted, broad. `[HIGH]`
- **Gaps:** Aggregator only — each individual project has its own app or web form. Astra Vault is positioned to be the single mobile umbrella that aggregates participation in many of these. `[HIGH]`
- **API:** Each underlying NASA dataset has its own API. **Major integration opportunity surface area.** `[HIGH]`

#### Zooniverse / Galaxy Zoo / Planet Hunters TESS `[HIGH]`
- **Publisher:** Citizen Science Alliance / Oxford-led consortium `[HIGH]`
- **Platforms:** Web primary; a mobile companion exists. `[MED]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Crowd-classified astronomical images. Galaxy Zoo asks users to classify galaxy morphology; Planet Hunters TESS asks users to spot transit dips in TESS light curves. `[HIGH]`
- **Strengths:** The flagship citizen-science platform. Authoritative, scientific publications coming out of its data. Strong international user base. `[HIGH]`
- **Gaps:** Web-first; mobile UX is functional, not delightful. No rewards beyond name credit on papers. No retention design beyond the intrinsic-motivation curve, which decays quickly for casual users. `[HIGH]`
- **API / integration posture:** Zooniverse has a documented Panoptes API for project hosting. Building Astra Vault classification tasks **on top of Panoptes** is a strong partnership model. `[MED]`
- **Astra Vault angle:** Wrap Zooniverse tasks (galaxy classification, transit-hunt) with ATP rewards and rarity tiers. Best-of-both: scientific rigor of Zooniverse + retention design of a game. `[HIGH]`

#### Aurorasaurus `[HIGH]`
- **Publisher:** NASA-funded, run by NSF / NASA-affiliated researchers (originally Liz MacDonald). `[HIGH]`
- **Platforms:** Web primary; mobile-responsive; historically an iOS/Android companion. `[MED]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Crowdsourced aurora sighting reports. Users submit "I saw the aurora at X location" geotagged + photos. The system aggregates into a real-time aurora visibility map and validates against NOAA Kp index forecasts. `[HIGH]`
- **Strengths:** Best-in-class crowdsourced aurora data; scientific publications; integrates with social-media scraping for validation. `[HIGH]`
- **Gaps:** Limited retention design, no rewards, no smart-glasses integration, plain visual style. `[MED]`
- **API:** Aurorasaurus has historically published data feeds. **Strong partner candidate** for Astra Vault's aurora-capture extension. `[MED]`

#### CAMS (Cameras for All-Sky Meteor Surveillance) `[HIGH]`
- **Publisher:** NASA / SETI Institute (Peter Jenniskens-led) `[HIGH]`
- **Platforms:** Network of ~600+ professional all-sky cameras globally; data published on a project portal. `[HIGH]`
- **Pricing:** Free (public data). `[HIGH]`
- **Core feature set:** Network of fixed cameras triangulating meteors. Computes orbits, links meteors to parent bodies (comets/asteroids), publishes nightly data. `[HIGH]`
- **Strengths:** Authoritative meteor-orbit catalog. The professional reference network. `[HIGH]`
- **Gaps:** No consumer-facing app. **This is the single biggest integration target for Astra Vault's meteor capture system.** Cross-referencing user-captured meteors against CAMS detections is the defining Astra Vault feature. `[HIGH]`
- **API:** Data is published; API access varies. **Partnership / data-feed conversation worth pursuing directly.** `[MED]`

---

### 4. Astrophotography Apps

#### NightCap Camera `[MED]`
- **Publisher:** Realtime Dreams (independent dev, Chris Wood) `[MED]`
- **Platforms:** iOS only. `[HIGH]`
- **Pricing:** One-time IAP (paid app). `[MED]`
- **Core feature set:** Specialized iPhone camera with long-exposure, star-trail, ISS-pass, **meteor mode** (detects bright streaks and saves frames automatically), and aurora modes. Manual ISO/shutter control. `[MED]`
- **Strengths:** Closest existing analog to Astra Vault's meteor capture concept. Loved by iPhone astrophotographers. Single-dev, focused product. `[MED]`
- **Gaps vs. Astra Vault:** Camera utility only — no social, no cross-reference, no community, no education, no token economy, no smart glasses, no auto-triangulation. Single platform (iOS). `[MED]`
- **API:** Closed (single-dev consumer app). **Not a partner; the capture-method comparison point for our patent claims.** `[MED]`
- **Patent relevance:** NightCap's meteor mode is prior art for "detect bright streak → save buffer." Our patent novelty is in the **cross-reference + community triangulation + ATP-incentivized capture**, not pure detection. Need to document this distinction carefully. `[HIGH]`

#### Photopills `[HIGH]`
- **Publisher:** Photo Pills S.L. (Spain) `[HIGH]`
- **Platforms:** iOS, Android. `[HIGH]`
- **Pricing:** One-time paid app (premium pricing — typically ~$10-$12 historically). `[MED, verify current]`
- **Core feature set:** Planning tool for outdoor / landscape / astrophotography. Calculates sun and moon position, Milky Way arch alignment, golden-hour timing, exposure suggestions. AR overlays for planning where the Milky Way will be visible from a given spot at a given time. `[HIGH]`
- **Strengths:** Industry-standard planning tool for serious landscape astrophotographers. Strong brand, strong community via tutorials. `[HIGH]`
- **Gaps:** Planner, not a capture or community app. Closed to integration. No collection, no education, no glasses. `[HIGH]`
- **API:** Closed. **Adjacent — different user persona than Astra Vault's mass-market consumer.** `[HIGH]`

#### DeepSkyStacker `[HIGH]`
- **Publisher:** Luc Coiffier (independent) `[HIGH]`
- **Platforms:** Windows desktop only. `[HIGH]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Image-stacking tool for astrophotography — aligns and combines many exposures to reduce noise. `[HIGH]`
- **Strengths:** The free standard for astro image stacking. `[HIGH]`
- **Gaps:** Desktop only, single-purpose, no integration, no community. **Out of scope as a direct competitor** but a reference point for stacking algorithms if Astra Vault ever does post-processing. `[HIGH]`

#### Sequator / Sequator Pro `[MED]`
- **Publisher:** Yi-Ruei Wu (Sun) `[LOW]`
- **Platforms:** Windows desktop. `[MED]`
- **Pricing:** Free (Sequator) + Pro tier. `[MED]`
- **Core feature set:** Like DeepSkyStacker but with emphasis on landscape astrophotography (ground + sky stacking with masking). `[MED]`
- **Strengths:** Beloved by landscape astrophotographers for its handling of horizon line. `[MED]`
- **Gaps:** Desktop-only, single-purpose. **Not a direct competitor.** `[MED]`

---

### 5. Meteor / Fireball

#### International Meteor Organization (IMO) Portal `[HIGH]`
- **Publisher:** IMO (volunteer-run international meteor society) `[HIGH]`
- **Platforms:** Web. `[HIGH]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Centralized portal for visual meteor counts, fireball reports, video meteor data submission. Publishes ZHR (zenithal hourly rate) data live during showers. `[HIGH]`
- **Strengths:** The European-centric authoritative meteor data center; long history. `[HIGH]`
- **Gaps:** Web form-based, expert audience. No consumer app. **Wrappable.** `[HIGH]`
- **API:** Some published data, but not API-first. **Partner target.** `[MED]`

#### American Meteor Society (AMS) Fireball Reporting `[HIGH]`
- **Publisher:** American Meteor Society `[HIGH]`
- **Platforms:** Web form, mobile-responsive. `[HIGH]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Crowdsourced fireball eyewitness reporting. Users submit time, location, direction, brightness; AMS aggregates and publishes event pages showing all reports of a given fireball with a triangulated track. `[HIGH]`
- **Strengths:** Authoritative source for fireball reports in the Americas; widely cited by mainstream media when big fireballs happen. `[HIGH]`
- **Gaps:** Web form, no real consumer-facing app, no rewards, no glasses. `[HIGH]`
- **API / integration posture:** AMS publishes event data and has historically been receptive to data partnerships. **Strong partner candidate** for Astra Vault's meteor / fireball capture. `[MED]`

#### Global Meteor Network (GMN) `[HIGH]`
- **Publisher:** Volunteer-led global network (Croatian-led core team — Denis Vida et al.) `[HIGH]`
- **Platforms:** Hardware (Raspberry Pi based all-sky cameras called RMS — Raspberry Pi Meteor Station) + web data portal. `[HIGH]`
- **Pricing:** Hardware ~$300-500 to build; data is free. `[MED]`
- **Core feature set:** Distributed network of Raspberry-Pi all-sky meteor cameras. Computes orbits and publishes data globally. Open-source software stack (RMS). `[HIGH]`
- **Strengths:** Growing rapidly; open-source; complements CAMS as the citizen-meteor network. Real scientific output. `[HIGH]`
- **Gaps:** Requires hardware setup; not a consumer app. **Excellent data partner.** `[HIGH]`
- **API:** GMN publishes orbit data openly. **Strong partner candidate alongside CAMS.** `[MED]`

#### Allsky7 / AllSky Network `[MED]`
- **Publisher:** Mike Hankey (US) and partners `[MED]`
- **Platforms:** Custom hardware (Allsky7 fisheye camera systems) feeding to a network. `[MED]`
- **Pricing:** Hardware-based, several thousand dollars. `[LOW]`
- **Core feature set:** Premium all-sky camera network with high-quality fireball detection and AMS integration. `[MED]`
- **Strengths:** Higher quality than GMN's lower-cost approach; well-integrated with AMS. `[MED]`
- **Gaps:** Hardware niche; not a consumer app. **Data partner via AMS.** `[MED]`

---

### 6. Aurora Apps

#### Aurora Forecast 3D `[MED]`
- **Publisher:** "Aurora Forecast" / Geophysical Institute of UAF Alaska or third-party (multiple apps share similar names — there is ambiguity here) `[LOW]`
- **Platforms:** iOS, Android. `[MED]`
- **Pricing:** Free with paid premium. `[MED]`
- **Core feature set:** Kp-index based aurora forecast, alerts, 3D globe view of the auroral oval. `[MED]`
- **Strengths:** Beautiful 3D visualization of the auroral oval; widely used in Nordic / Alaskan markets. `[MED]`
- **Gaps:** Forecast-focused; no capture, no community, no education, no glasses. `[MED]`
- **API:** Closed; underlying NOAA SWPC data is open and should be sourced directly. `[HIGH]`

#### My Aurora Forecast (& Alerts) `[MED]`
- **Publisher:** Jenscom / Jens Heimann `[LOW]`
- **Platforms:** iOS, Android. `[MED]`
- **Pricing:** Free with paid Pro. `[MED]`
- **Core feature set:** Simple Kp / aurora probability per location with push alerts. `[MED]`
- **Strengths:** Best-in-class push-alert UX for aurora hunters. `[MED]`
- **Gaps:** Single-purpose; no community-photo integration, no smart glasses. `[MED]`
- **API:** Closed; **not a partner.** `[MED]`

#### Hello Aurora `[LOW]`
- **Publisher:** Hello Aurora team (Iceland-based) `[LOW]`
- **Platforms:** iOS, Android. `[LOW]`
- **Pricing:** Free with paid premium. `[LOW]`
- **Core feature set:** Aurora forecast + community sighting reports + cloud-cover overlay. Closest existing community-aurora-tracker. `[LOW]`
- **Strengths:** Reasonable community layer for an aurora-niche app; Iceland-focused tourism credibility. `[LOW]`
- **Gaps:** Single-purpose (aurora only), small community, no broader astronomy integration, no smart glasses. `[LOW]`
- **API:** Likely closed. `[LOW]`
- **Watch:** Closest competitor to Astra Vault's community-aurora-tracker design pattern. `[LOW]`

---

### 7. Satellite Tracking

#### Heavens-Above `[HIGH]`
(Covered above under Planetariums — primary use case is satellite tracking, web canonical.)

#### ISS Detector `[MED]`
- **Publisher:** RunaR (Netherlands) `[MED]`
- **Platforms:** iOS, Android. `[MED]`
- **Pricing:** Free with paid extensions (Iridium, comet, radio amateur satellites etc.). `[MED]`
- **Core feature set:** ISS pass predictions, push notifications, weather check for pass time, broader satellite catalog via paid extensions. `[MED]`
- **Strengths:** Highly accurate; long-running; trusted in the satellite-hunter community. Widget support. `[MED]`
- **Gaps:** Single-purpose, no community, no broader astronomy, no glasses. `[MED]`
- **API:** Closed; **not a partner.** Underlying data is CelesTrak TLEs which Astra Vault should source directly. `[HIGH]`

#### GoSatWatch `[MED]`
- **Publisher:** GoSoftWorks (Don Dickenson) `[LOW]`
- **Platforms:** iOS only. `[MED]`
- **Pricing:** Paid (premium one-time price). `[MED]`
- **Core feature set:** Pro-tier satellite tracking with deep catalog. `[MED]`
- **Strengths:** Loved by pro satellite hunters; deep feature set. `[MED]`
- **Gaps:** iOS-only, niche, no community, no glasses. `[MED]`
- **API:** Closed. **Not a partner.** `[MED]`

#### Look4Sat `[HIGH]`
- **Publisher:** Arty Bishop (open-source) `[MED]`
- **Platforms:** Android (Google Play + F-Droid). `[HIGH]`
- **Pricing:** Free, open-source. `[HIGH]`
- **Core feature set:** Open-source satellite tracking — pass predictions, polar plots, doppler tone for radio amateurs. `[MED]`
- **Strengths:** Free, open-source, no ads, well-loved in the ham-radio satellite community. `[HIGH]`
- **Gaps:** Android only; niche; not a consumer threat. `[HIGH]`
- **API / integration:** Open-source reference. `[HIGH]`

---

### 8. Telescope Control / Smart Scopes

This segment is structurally different — it's hardware-anchored. The companion apps exist to control specific telescopes. Direct competition here is **lower priority** for Astra Vault unless we ship our own hardware (which is not currently in scope).

#### SkySafari Pro `[HIGH]`
(Already covered — its telescope-control capability is the pro differentiator over Plus.)

#### Celestron StarSense Explorer `[HIGH]`
- **Publisher:** Celestron `[HIGH]`
- **Platforms:** iOS, Android (free app, hardware-locked features). `[HIGH]`
- **Pricing:** Free app; paid hardware (StarSense Explorer telescopes use plate-solving from a phone camera dock to align). `[HIGH]`
- **Core feature set:** Phone camera plate-solving for manual telescope alignment — point the phone through a dock, the app solves the field of view and directs you where to push the scope. Patented technology for consumer telescopes. `[HIGH]`
- **Strengths:** Cleverly bridges manual scopes with phone alignment; bestselling beginner-friendly telescope line for Celestron. `[HIGH]`
- **Gaps:** Hardware-locked — you need a StarSense Explorer telescope. No community, no glasses, no education curriculum. `[HIGH]`
- **API:** Closed; hardware-tied. **Adjacent, not partner.** `[HIGH]`
- **Patent relevance:** Celestron holds patents on the phone-camera plate-solving alignment technique — Astra Vault should AVOID claims in this exact space. `[HIGH]`

#### Unistellar app (eVscope / eQuinox / Odyssey) `[HIGH]`
- **Publisher:** Unistellar (France) `[HIGH]`
- **Platforms:** iOS, Android. `[HIGH]`
- **Pricing:** Free app; paid hardware (eVscope 2 ~$4000, Odyssey lower price point). `[MED, verify current prices]`
- **Core feature set:** Companion app for Unistellar's digital smart telescopes. Live-stacking, "enhanced vision" mode, citizen-science programs (asteroid occultations, exoplanet transits, comet observations) coordinated through Unistellar's network. `[HIGH]`
- **Strengths:** Strong citizen-science integration (SETI Institute partnership). Premium hardware brand. Sophisticated computational imaging. `[HIGH]`
- **Gaps:** Hardware-locked; expensive; relatively closed ecosystem. No social layer beyond Unistellar-organized campaigns. `[HIGH]`
- **API / integration posture:** Likely closed. But the citizen-science model is **a partnership precedent worth studying** — Astra Vault could pitch Unistellar-equipped users to participate in cross-network campaigns. `[MED]`

#### Vaonis Singularity / Stellina / Vespera `[HIGH]`
- **Publisher:** Vaonis (France) `[HIGH]`
- **Platforms:** iOS, Android. `[HIGH]`
- **Pricing:** Free app; paid hardware (Stellina ~$4000, Vespera lower price). `[MED, verify]`
- **Core feature set:** Smart-telescope companion. Singularity is Vaonis's app brand for controlling and viewing observations from their hardware. Pre-set deep-sky targets, automatic stacking, social sharing of observations. `[HIGH]`
- **Strengths:** Most consumer-design-focused smart-scope brand; strong aesthetics. `[HIGH]`
- **Gaps:** Hardware-locked; expensive; small community. `[HIGH]`
- **API:** Closed. **Adjacent.** `[HIGH]`

#### ZWO ASIAIR `[HIGH]`
- **Publisher:** ZWO Optical (Suzhou, China) `[HIGH]`
- **Platforms:** iOS, Android (controls dedicated ASIAIR hardware unit). `[HIGH]`
- **Pricing:** Free app; paid hardware (ASIAIR Pro / Plus / Mini, varying prices). `[MED, verify]`
- **Core feature set:** Pro-amateur astrophotography control center — runs astrophotography sequences, autoguiding, plate-solving, full image acquisition pipeline on a dedicated mini-computer paired with the user's phone/tablet. `[HIGH]`
- **Strengths:** The de-facto standard for pro-amateur deep-sky astrophotography control. Strong community on Cloudy Nights forum. `[HIGH]`
- **Gaps:** Aimed at serious astrophotographers; steep learning curve; hardware-tied. `[HIGH]`
- **API:** Closed; ZWO is hardware-first. **Adjacent.** `[HIGH]`

#### Seestar (ZWO Seestar S50 / S30) `[HIGH]`
- **Publisher:** ZWO (China) `[HIGH]`
- **Platforms:** iOS, Android (app paired with Seestar S50 / S30 smart telescopes). `[HIGH]`
- **Pricing:** Free app; Seestar S50 hardware was a category-disrupting price point (~$500, well under Unistellar/Vaonis) `[MED]`. S30 is even cheaper at launch `[LOW]`.
- **Core feature set:** Consumer smart telescope — all-in-one auto-tracking, live-stacking, deep-sky and solar observation, mosaic mode. Strong community uptake during 2023-2025. `[HIGH]`
- **Strengths:** Price-disruptive smart-scope; rapidly growing community. The single biggest hardware-driven growth story in amateur astronomy as of training cutoff. `[HIGH]`
- **Gaps:** Hardware-tied; limited social features; closed ecosystem. `[HIGH]`
- **Threat assessment:** **HIGH** — Seestar users represent a fast-growing pool of engaged amateur astronomers. If ZWO ships a richer companion app with social/community, they could absorb part of Astra Vault's serious-user segment. Astra Vault should aim to **integrate** with Seestar (let users import Seestar observations into their Vault) rather than compete on hardware. `[MED]`
- **API:** Closed currently; ZWO has historically not been API-friendly. Could change. `[MED]`

---

### 9. Educational / Pro-Tier

#### NASA Eyes (eyes.nasa.gov) `[HIGH]`
- **Publisher:** NASA Jet Propulsion Laboratory (Visualization Technology Applications and Development) `[HIGH]`
- **Platforms:** Web (browser-based, formerly downloadable desktop). `[HIGH]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Interactive 3D visualizations of the solar system, exoplanets, asteroids, and Earth's climate. Real-time spacecraft positions. Specific "Eyes on the Solar System," "Eyes on Exoplanets," "Eyes on Asteroids" sub-experiences. `[HIGH]`
- **Strengths:** Authoritative NASA-grade visualization; free; uses real JPL ephemeris data; works in browsers. `[HIGH]`
- **Gaps:** Web-only, not mobile-native (works in mobile browsers but not optimized). No community, no rewards, no glasses. `[HIGH]`
- **API:** Not API-accessible directly, but the **underlying JPL Horizons API is public** and is what Astra Vault should use. `[HIGH]`
- **Posture:** **Adjacent reference / data partner via Horizons.** `[HIGH]`

#### Starry Night Pro `[HIGH]`
- **Publisher:** Simulation Curriculum (same publisher as SkySafari) `[HIGH]`
- **Platforms:** Windows, macOS. `[HIGH]`
- **Pricing:** Paid (premium tier ~$150-300 historically). `[MED, verify]`
- **Core feature set:** Desktop pro planetarium — used by planetaria, classrooms, serious amateurs. Deep catalog, scriptable, beautiful rendering. `[HIGH]`
- **Strengths:** Industry-standard educational planetarium for desktop. `[HIGH]`
- **Gaps:** Desktop only, expensive, no community, no glasses. **Not a consumer threat.** `[HIGH]`

#### TheSkyX (Software Bisque) `[HIGH]`
- **Publisher:** Software Bisque `[HIGH]`
- **Platforms:** Windows, macOS, Linux. `[HIGH]`
- **Pricing:** Tiered paid licensing (Serious Astronomer, Professional, etc.). Top tier is several hundred dollars. `[MED]`
- **Core feature set:** Pro-grade observatory control software — telescope, dome, camera, focuser orchestration. Used in research and serious amateur observatories. `[HIGH]`
- **Strengths:** The pro standard for observatory automation alongside MaxIm DL. `[HIGH]`
- **Gaps:** Desktop, expensive, niche to observatory operators. **Not a consumer competitor.** `[HIGH]`

#### Cartes du Ciel (SkyChart) `[HIGH]`
- **Publisher:** Patrick Chevalley (open-source) `[HIGH]`
- **Platforms:** Windows, macOS, Linux. `[HIGH]`
- **Pricing:** Free, open-source. `[HIGH]`
- **Core feature set:** Free open-source planetarium with deep catalog support and telescope control via INDI. `[HIGH]`
- **Strengths:** Free pro-amateur planetarium; long history; respected. `[HIGH]`
- **Gaps:** Desktop, dated UI, no community, no glasses, niche. **Not a consumer competitor.** `[HIGH]`

---

### 10. Solar Observation

#### Solar System Scope (INOVE) `[HIGH]`
- **Publisher:** INOVE s.r.o. (Slovakia) `[MED]`
- **Platforms:** Web, iOS, Android, Windows. `[HIGH]`
- **Pricing:** Free with paid premium. `[MED]`
- **Core feature set:** 3D solar system explorer, planet info, real-time positions. Lighter than NASA Eyes but works on mobile. `[HIGH]`
- **Strengths:** Approachable 3D solar system; great for education; works across platforms. `[HIGH]`
- **Gaps:** Just a visualizer — no community, no rewards, no capture, no glasses. `[HIGH]`
- **API:** Closed. **Not a partner.** `[HIGH]`

#### Solar Walk 2 (Vito Technology) `[MED]`
- **Publisher:** Vito Technology (same publisher as Star Walk 2) `[HIGH]`
- **Platforms:** iOS, Android. `[HIGH]`
- **Pricing:** Free with paid premium. `[MED]`
- **Core feature set:** Animated 3D solar system, planet info, real-time spacecraft positions, eclipses, mission timelines. `[MED]`
- **Strengths:** Beautiful visuals, mass-market consumer appeal, same publisher polish as Star Walk 2. `[MED]`
- **Gaps:** Visualizer; no community, no capture, no glasses, no rewards. `[MED]`
- **API:** Closed. **Competition (publisher overlap with Star Walk 2 makes Vito Tech a key competitor to monitor).** `[MED]`

#### Helioviewer (helioviewer.org) `[HIGH]`
- **Publisher:** NASA Solar Dynamics Observatory / ESA consortium `[HIGH]`
- **Platforms:** Web; mobile-responsive; an iOS/Android app exists or has existed. `[MED]`
- **Pricing:** Free. `[HIGH]`
- **Core feature set:** Real-time and historical solar imagery from SDO, SOHO, STEREO, and other heliophysics missions. Layer toggling, time-stepping, movie generation. `[HIGH]`
- **Strengths:** Authoritative solar imagery access; open data. `[HIGH]`
- **Gaps:** Web-first, technical audience, no community, no rewards. `[HIGH]`
- **API:** **Yes — Helioviewer has a public, documented JSON API for solar imagery.** Strong integration target for Astra Vault's solar observation features. `[HIGH]`

---

## Integration vs. Competition Map

| App | Posture | Confidence | Reason |
|---|---|---|---|
| Stellarium Mobile | Competition | `[HIGH]` | Same consumer planetarium space; closed mobile app despite open desktop heritage |
| SkySafari (Simulation Curriculum) | Competition | `[HIGH]` | Pro-tier sky app overlap; closed |
| Star Walk 2 / Solar Walk 2 (Vito) | Competition | `[HIGH]` | Direct consumer overlap; closed |
| Star Chart (Escapist) | Competition (mild) | `[MED]` | Smaller share, beginner-focused; closed |
| Night Sky (iCandi) | Competition (high concern on Apple platforms) | `[MED]` | Vision Pro + visionOS support means they may own AR glasses first if they get Apple Glasses early access |
| SkyView | Competition (mild) | `[MED]` | Beginner-focused; small share |
| Sky Map (open-source) | Reference | `[HIGH]` | Open-source, not actively competing |
| Distant Suns | Competition (mild) | `[MED]` | Veteran pro app, niche |
| Mobile Observatory / SkEye | Reference | `[MED]` | Niche power-user tools |
| Heavens-Above | Reference / source-only | `[HIGH]` | Use underlying TLE data (CelesTrak), not the site |
| Celestia | Reference | `[HIGH]` | Open-source 3D, desktop |
| AstroArts Stella Navigator | Reference (Japan) | `[LOW]` | Desktop, region-specific |
| Globe at Night | **Partner** | `[MED]` | Likely receptive to data-feed; clear citizen-science alignment |
| AAVSO | **Partner** | `[MED]` | Documented APIs; respected scientific institution |
| Loss of the Night | **Partner / wrappable** | `[MED]` | Research-led; open data |
| NASA Citizen Science Hub | **Partner umbrella** | `[HIGH]` | Aggregator of NASA projects; per-project integration |
| Zooniverse / Panoptes | **Strong partner** | `[MED]` | Documented Panoptes API; could host Astra Vault classification tasks |
| Aurorasaurus | **Partner** | `[MED]` | Open data, NASA-affiliated, aurora-capture alignment |
| CAMS | **Strategic partner** | `[HIGH]` | The crown-jewel data source for meteor cross-reference; pursue direct contact (Peter Jenniskens / SETI) |
| IMO | **Partner** | `[MED]` | European meteor authority |
| AMS | **Strong partner** | `[MED]` | American Meteor Society fireball reports; strong cross-reference candidate |
| GMN (Global Meteor Network) | **Partner** | `[HIGH]` | Open-source, open-data, growing fast |
| Allsky7 | Partner via AMS | `[MED]` | Hardware niche; data feeds into AMS |
| NightCap Camera | Competition (capture); prior-art comparison | `[MED]` | Closest meteor-capture analog; iOS only, single-dev |
| Photopills | Adjacent | `[HIGH]` | Different persona (landscape astrophotographers) |
| DeepSkyStacker / Sequator | Adjacent | `[HIGH]` | Desktop post-processing; not consumer-mobile overlap |
| ISS Detector / GoSatWatch | Competition (mild) | `[MED]` | Satellite tracking niche |
| Look4Sat | Reference | `[HIGH]` | Open-source satellite tracking |
| Celestron StarSense Explorer | Adjacent (hardware-tied) | `[HIGH]` | Patented phone-camera plate-solving; avoid claim overlap |
| Unistellar | Adjacent (hardware-tied) | `[HIGH]` | Citizen-science model worth studying |
| Vaonis Singularity | Adjacent (hardware-tied) | `[HIGH]` | Premium hardware brand |
| ZWO ASIAIR | Adjacent (hardware-tied) | `[HIGH]` | Pro-amateur astrophotography niche |
| ZWO Seestar S50/S30 | **Watch closely** — potential partner, potential competitor | `[MED]` | Fast-growing consumer smart-scope ecosystem |
| NASA Eyes | Reference / data-via-Horizons | `[HIGH]` | NASA visualization; underlying JPL Horizons is the integration target |
| Starry Night Pro / TheSkyX / Cartes du Ciel | Adjacent (desktop pro) | `[HIGH]` | Not consumer-mobile |
| Solar System Scope | Competition (mild) | `[MED]` | Solar/3D visualizer |
| Helioviewer | **Strong data partner** | `[HIGH]` | Documented public API |
| Aurora Forecast 3D / My Aurora / Hello Aurora | Competition (aurora niche) | `[MED]` | Aurora-only apps; Astra Vault's aurora layer can absorb the use case |

---

## Threats to Watch

Apps and ecosystems that were well-funded, rapidly evolving, or strategically positioned as of training cutoff (Jan 2026):

1. **ZWO Seestar ecosystem.** `[MED]` ZWO disrupted the consumer smart-scope segment with the S50 at ~$500 and was rumored to be expanding the line in 2025-2026. A richer Seestar companion app with social and community could erode Astra Vault's serious-user segment. **Mitigation:** Build Seestar import support; let serious users *use* their Seestar but bring observations into the Vault.

2. **Night Sky (iCandi) on Apple Vision Pro / future Apple Glasses.** `[MED]` Their visionOS support means they have a head start if Apple ships consumer smart glasses. **Mitigation:** Don't be Apple-exclusive; cover Ray-Ban Meta + Android XR + XREAL + Rokid first, then Apple Day 1.

3. **Meta first-party astronomy on Ray-Ban Meta / Quest.** `[LOW]` Meta could ship a first-party "Look up at the sky" experience with Meta AI baked into Ray-Ban Meta. They haven't done this as of training cutoff but it's a low-effort move for them. **Mitigation:** First-mover advantage on Ray-Ban Meta SDK; build a depth of features Meta won't match.

4. **Google Gemini on Android XR.** `[LOW]` Android XR launching with Gemini AI means Google could ship a "what star is that" answer experience natively. **Mitigation:** Astra Vault's depth — collection, ATP, education, cross-reference — is beyond what a single AI-answer experience offers.

5. **Apple Glasses (2027-2028).** `[UNK]` When they ship, Night Sky / Star Walk will likely have Day-1 builds. **Mitigation:** Be ready Day 1 too.

6. **Vito Technology (Star Walk 2 / Solar Walk 2 / Sky Tonight).** `[MED]` Multi-app publisher with broad consumer reach. If they ship a community-photo layer with cross-reference, they'd be the closest competitor. **Watch.**

7. **Unistellar's citizen-science program expansion.** `[MED]` Their hardware-tied citizen-science campaigns (occultations, exoplanet transits) are tightening their grip on the serious-amateur segment. **Mitigation:** Build hardware-agnostic citizen-science contribution paths (Zooniverse-wrapped, AAVSO-wrapped, CAMS-cross-referenced).

8. **A Chinese-market entrant.** `[LOW]` Given Chinese space-program enthusiasm and the country's massive mobile-app market, a domestic Chinese stargazing app with collection mechanics could emerge from inside Huawei / Xiaomi / Tencent. **Watch and plan localization early.**

9. **An AI-first chatbot stargazing app.** `[LOW]` Any of OpenAI, Anthropic, Google, or a startup could ship "point your camera at the sky, AI tells you what you see" with no other features. The threat: it captures the casual identification use case. **Mitigation:** Astra Vault has the *layers above* identification (collection, ATP, community, capture, education) that an LLM-only app does not.

---

## Patentable Whitespace

Cross-referenced with the patent claims framework in `astra-vault-audit.docx` (referenced in the handoff) — Astra Vault is positioned to claim combinations not currently owned. Confidence labels here reflect my certainty that **no prior art exists**, not the strength of the claim itself.

1. **Eyewitness-to-professional-network event triangulation.** Capture a consumer event (meteor, fireball, eclipse, aurora) on a phone or smart glasses, then cross-reference against CAMS / AMS / Aurorasaurus / Helioviewer to surface professional-network corroboration to the user, including computed parent body, orbit, and other-observer counts. **No app currently does this end-to-end on consumer mobile.** `[HIGH]`

2. **Attention-token economy tied to verified observation hash with on-device focus scoring.** The ATP economy with attention-hash payload (per ATTENTION_PROTOCOL_SPEC-1.md) is structurally different from Web3 stargazing experiments and from gamification systems like Duolingo's. The combination of (a) verified-observation requirement + (b) hash-stored attention proof + (c) token redemption path is unique. `[HIGH]`

3. **Rarity-tiered celestial collection.** Five-tier rarity (common → legendary) for celestial objects, with collection requiring real observation rather than purchase, is unprecedented in stargazing. Pokemon GO has rarity-tiered creature collection on a real-world map; no one has applied the gacha/collection pattern to actual astronomical objects gated by real observability. `[HIGH]`

4. **"I didn't know that happened" retrospective sky monitor.** Knowing what *could* have been visible from a user's location based on time + location + sensor history, and surfacing missed events post-hoc with "did you see this?" prompts. The combination of (a) passive sensor monitoring + (b) ephemeris cross-reference + (c) retrospective UX is novel. `[HIGH]`

5. **Hands-free voice-triggered event capture with millisecond audio-waveform timestamp.** The voice trigger ("METEOR" / "STAR") whose waveform itself is timestamped to the millisecond, then synced to a buffered camera capture. This is a specific patentable combination. `[HIGH]`

6. **Smart-glasses constellation HUD overlay with night-vision-preservation red tint and minimum brightness.** Specifically the dark-adaptation-preserving design pattern for smart-glasses constellation overlay. `[MED]` — possibly prior art in military / aviation HUDs, needs prior-art search.

7. **Cross-user meteor / eclipse / aurora triangulation with anonymous distance reveal.** "3 other Astra Vault users saw this meteor within 127 miles" without exposing identities or social interaction. The community-without-interaction primitive applied to astronomical events. `[HIGH]`

8. **Multi-spectrum visual swap (X-ray / UV / IR / radio) per cataloged object via SkyView API.** As a consumer mobile feature for any object the user has collected. `[MED]` — SkyView is the existing data source, novelty is the consumer-mobile collection-layer wrapping.

9. **Telescope-history overlay** — annotating each celestial object with the history of which telescopes have observed it (Hubble, JWST, Spitzer, etc.) with linked imagery via MAST API. `[MED]` — this is novel as a consumer feature even though the data is public.

10. **Birthday Sky / Lifetime Sky** — generating the precise sky map at the user's birth time and location, rendered with personalized celestial context. `[LOW]` — astrology apps do something thematically similar; Astra Vault's novelty is the *scientifically-accurate* version with proper proper-motion correction. Patent likely weak; trademark / brand claim stronger.

11. **Pi Network integration with attention-hash economics.** `[LOW]` — Pi Network integration is permissive; the novelty is the specific ATP↔Pi conversion mechanic with attention-hash verification. May be patentable as a method claim. Worth coordination with Pi Network's own IP positions.

---

## Asia-Pacific Specific Notes

(Repeating from the Asia-Pacific section above with strategic framing.)

- **Japan:** Trading-card / gacha culture aligns strongly with Astra Vault's rarity-tier collection model. AstroArts (Stella Navigator) owns the desktop amateur segment; the mobile collection-mechanic slot is open. Localization (Japanese-language constellation lore — the Japanese / Chinese asterisms differ significantly from Western 88 constellations) is a real opportunity. `[MED]`

- **South Korea:** Strong mobile-gaming culture; similar collection-mechanic alignment. Native astronomy app market less well-known to me. `[LOW]`

- **China:** Largely served by domestic apps that I can't responsibly name from memory. Localization barriers (Mandarin, Simplified Chinese, domestic app store distribution via Huawei AppGallery / Xiaomi / OPPO / Vivo / Tencent) and regulatory considerations (data residency, real-name verification) are nontrivial. Direct partnership with a Chinese publisher is likely the right entry path. `[LOW]`

- **India:** Strong amateur astronomy community (ISRO public engagement); largely served by Western apps. Hindi / Tamil / regional language localization untapped. `[LOW]`

- **Australia / New Zealand:** Strong amateur astronomy culture due to dark skies; well-served by SkySafari and Stellarium. Astra Vault's meteor capture and aurora (Aurora Australis) angles map well. `[MED]`

---

## Verify Before Citing

Every figure and feature claim below should be re-verified against a live web source before public citation. This is the to-do for the next live-network pass.

### Pricing (all "as of 2026" — confirm currency, tier names, regional variance)
- Stellarium Mobile Plus subscription model and current price (was historically a one-time IAP; may now be subscription)
- SkySafari Basic / Plus / Pro current price tiers — and whether they have moved fully to subscription
- Star Walk 2 / Star Walk 2 Plus / Sky Tonight current subscription prices
- Night Sky / Night Sky+ current subscription model
- SkyView Free / Paid current pricing
- Photopills current price
- NightCap Camera current price
- Mobile Observatory current price
- Distant Suns current price
- Vaonis Stellina / Vespera / Singularity hardware prices
- Unistellar eVscope 2 / Odyssey current prices
- ZWO Seestar S50 / S30 / ASIAIR Pro / Mini current prices
- AstroArts Stella Navigator current price (in JPY)

### Install / user counts
- Stellarium Mobile combined install count
- SkySafari combined install count across versions
- Star Walk 2 install count (historically claimed 100M+ over the franchise's life — needs verification)
- Night Sky install count
- Ray-Ban Meta installed base (handoff doc cites 7M in 2025 — verify current)
- ZWO Seestar units sold
- Unistellar units sold (citizen-science network size)

### Feature claims requiring verification
- Whether Stellarium Mobile has a "Live Pulse" / community feature equivalent
- Whether Night Sky's social feed / community photo sharing is still live and the exact feature name
- Current state of NightCap Camera's meteor mode and whether it has any cloud / community layer
- Whether ISS Detector, GoSatWatch, or any other satellite app has shipped a smart-glasses companion
- Current activity status of Loss of the Night, Distant Suns, Mobile Observatory (alive vs. abandoned)
- AstroArts mobile app names and current product lineup
- Specific Chinese-market stargazing app names and publishers (full gap — research needed)
- Whether AMS / IMO / GMN have published consumer-facing APIs (vs. data feeds requiring scraping)
- Current state of Aurorasaurus mobile app (live vs. retired)
- Current Helioviewer API endpoints and rate limits
- Whether NASA Eyes has shipped any mobile-native app (vs. web only)
- Current Apple Vision Pro stargazing app landscape (Night Sky and competitors)
- Whether Meta has shipped first-party astronomy on Ray-Ban Meta
- Android XR launch date and any first-party astronomy app
- Whether Pi Network has shipped real Pi → fiat conversion (training cutoff still had it in testnet/mainnet-transition)
- Whether Celestron StarSense Explorer's phone-camera plate-solving patent extends to any operations Astra Vault might claim

### Patent / IP claims requiring search before filing
- Prior art search on smart-glasses constellation HUD with red-tint dark-adaptation overlay
- Prior art on "I didn't know that happened" retrospective sky monitor (aviation / drone-flight-log-style retrospectives may exist)
- Prior art on rarity-tiered celestial object collection (Pokemon GO and similar may be cited in examiner pushback)
- Prior art on voice-trigger waveform-timestamped capture
- Celestron StarSense plate-solving patent claims (what they cover precisely)

### Market sizing
- The stargazing app market size ($100M in 2024 → $250M by 2033 at 10.5% CAGR) cited in the handoff — verify source and confirm figures
- Asia-Pacific share (28% claimed in handoff)
- Wearable-stargazing CAGR (14% claimed)
- Smart-glasses market size and Ray-Ban Meta vs. VR-headset ratio (3:1 claimed)

### Regional / cultural claims
- Japanese gacha-culture penetration with stargazing apps (qualitative, but verify if there's quantitative data)
- Hello Aurora's user base and Iceland tourism integration
- Globe at Night submission counts and country distribution

---

RESEARCH COMPLETE (memory-only) — competitive-landscape.md written, 41 apps surveyed. 40 items flagged for Verify Before Citing.
