# Smart Telescope Ecosystem — Live Verification

## Methodology Note

Live-web pass on **2026-05-13** using WebSearch + WebFetch against maker dev portals,
GitHub repositories, ASCOM standards documentation, community wikis, and astronomy
press. Each maker section cites primary sources. Where a claim from the
session-2 emerging-tech report has been confirmed, falsified, or refined, the new
state is noted. Where a previously-named product has been superseded (e.g. Vespera
Pro → Vespera Pro 2; Vespera II → Vespera 3; S50 → S50 Pro), the 2026 state of the
shelf is used.

This document is written to be the single sourcing reference for a 3-week build of
`services/scopes/` in the Astra Vault React Native app. Every protocol number, port,
endpoint, and SDK URL has been verified once against the live web on 2026-05-13.

---

## Executive Summary

1. **The bridge bet is real and the window is open.** As of mid-2026 every major
   consumer smart-telescope has either *native* ASCOM Alpaca support (ZWO Seestar
   S30/S30 Pro/S50, Vespera via Singularity), an *official-but-unstable* WebSocket
   API (Dwarf 3 / Dwarf Mini), an open AUX-bus protocol (Celestron Origin / SkyPortal
   line), or a SynScan WiFi command set (Sky-Watcher). The only fully-closed major
   ecosystem left is **Unistellar**, whose API has not been re-reverse-engineered
   since 2020 and whose citizen-science pipeline is mobile-app-only.
2. **The single bridge protocol that gets us 80% of the market is ASCOM Alpaca over
   HTTP/JSON on TCP 11111.** Seestar's August 2024 firmware made the S50 (and
   subsequently S30, S30 Pro) speak Alpaca natively in *station mode* — no Pi
   bridge required. This is the single biggest delta from the session-2 brief, which
   assumed `seestar_alp` was the only path.
3. **There is no published TypeScript ASCOM Alpaca client.** The ecosystem is
   Python (`alpyca` 3.1.2, official), C# (`ASCOM.Alpaca.Components` 3.0), Go
   (`alpacascope`, archived May 2025), and MicroPython (`MiPyAlpaca`). Astra Vault
   has a clear "first-mover" opportunity to publish `@astravault/alpaca-client` on
   npm — likely the most-cited deliverable from this build.
4. **Alpaca discovery is UDP broadcast on port 32227.** This is *the* mobile
   gotcha: iOS sandboxes UDP broadcast tightly, Android handles it via
   `MulticastLock`. React Native needs a native module (`react-native-udp` works on
   both, but iOS broadcast requires the `multicast` entitlement and TestFlight
   approval — file the request now).
5. **Dwarf 3 uses WebSocket + binary protobuf, not HTTP.** It is *not* Alpaca-native.
   The `dwarfium` open-source app (MIT, Next.js + TypeScript) is the cleanest
   reference. Wrap, don't recreate.
6. **Unistellar is uniquely partnership-only.** No usable third-party API; the
   2020 jankais3r reverse-engineering work is stale and only covers eVscope 1. We
   will *not* control Unistellar scopes from Astra Vault. We *can* import a user's
   observation history through their *Citizen Science account* once we negotiate it.
   **Recommendation: target the SETI Institute / Unistellar Science team
   (`science.unistellar.com`) for a read-only export agreement.**
7. **Celestron Origin Mark II** (current as of April 2026, firmware 1.4.6084+,
   dithering shipped) has *no* documented developer API. The legacy SkyPortal /
   NexStar Evolution line uses TCP 2000 to a serial bridge — well documented by
   the community. Origin appears to be a closed extension of this; the BLE/WiFi
   handshake hasn't been publicly broken yet. **Defer Origin to Phase 2.**
8. **Patent risk on Celestron StarSense Explorer:** US 8,401,307 B1 and US
   8,477,419 B1 cover the "smartphone plate-solve as finder" claim. Astra Vault
   should not ship a phone-as-finder feature without a freedom-to-operate review,
   but it is *safe* to drive any third-party scope to which we are connected via
   a public protocol — the patents are on the alignment loop, not on Alpaca.
9. **Tariff exposure is non-trivial.** ZWO, Dwarf Lab, and the Synta/Sky-Watcher
   line are Chinese-made and subject to the April 2025 145% tariff. Many partners
   will be in price-rise / channel-thinning mode through 2026 — *good* for us as a
   software differentiator, *bad* for hardware partnerships that need their
   marketing dollars.
10. **The killer demo is unchanged but now reachable in ~2 weeks, not 3.** Native
    Alpaca on Seestar S30/S50 means Astra Vault on the same Wi-Fi can:
    `discover → connect → slew (RA/Dec) → start exposure → poll → fetch JPEG` in
    under 80 lines of TypeScript.
11. **INDI/INDIGO is not the right primary target for a phone-first app.** Both are
    optimised for Linux observatory automation (KStars, Ekos, StellarMate). We
    should support INDI/INDIGO *as a secondary bridge* for users running
    StellarMate or AstroBerry, but the mass market is Alpaca.
12. **AstroBin's API is currently read-only.** Upload-via-API is on their backlog
    but unshipped as of 2026-05. We can *fetch* AstroBin images for object detail
    pages today; we *cannot* push a user's Seestar capture into AstroBin without
    using the user's session (a non-starter). Target Salvatore Iovene for an
    upload-API partnership.

---

## Market Snapshot

Prices verified 2026-05-13 from maker shops, US-channel retailers (High Point,
Agena, B&H), and reviews. "Installed base" is an order-of-magnitude estimate from
press coverage and forum activity; *not* a hard number.

| Maker | Model | MSRP (USD) | Status | API / Control Surface |
|---|---|---|---|---|
| **ZWO Seestar** | S30 | $349 | Shipping | Native ASCOM Alpaca (station mode) + `seestar_alp` |
| | S30 Pro | $599 | Shipping (Jan 2026) | Native Alpaca; 4K dual-vision; Star-tracking improvements |
| | S50 | $549 | Discontinued (S50 Pro replacing) | Native Alpaca |
| | S50 Pro | $749–$999 (rumoured) | Announced, late 2026 | Expected native Alpaca |
| **Vaonis** | Hestia | $249 | Shipping | Phone-as-eyepiece via Gravity app; **no remote API** |
| | Vespera II | $1,499 | Shipping (legacy line) | Singularity app; local Wi-Fi (undocumented) |
| | Vespera 3 | ~$2,499 | Shipping (replaced Vespera II in 2026) | Singularity app |
| | Vespera Pro 2 | $2,999+ | Shipping | Singularity; "multi-night mode" 30 slots |
| | Hyperia | $99,000 | CES 2026 announce; H2 2026 → 2027 ship | Smartphone-app control; Canon optics |
| **Unistellar** | eVscope 2 | $4,000 | Shipping | App-only; ZeroMQ research from 2020 stale |
| | eQuinox 2 | $2,499 | Shipping | App-only; SETI citizen-science pipeline |
| | Odyssey | $2,499 | Shipping | App-only |
| | Odyssey Pro | $3,999 | Shipping | App-only; Nikon OLED eyepiece |
| **Dwarf Lab** | Dwarf II | $499 (discounted from $599) | Legacy | WebSocket+protobuf; community API |
| | Dwarf 3 | $549 | Shipping | WebSocket+protobuf; `dwarfium` reference client |
| | Dwarf Mini | $399 | Shipping (Apr 2026) | Same Dwarf protocol family |
| **Celestron** | StarSense Explorer DX/LT | $200–$800 | Shipping | **No SDK** — phone-finder; patents 8,401,307 + 8,477,419 |
| | Origin Mark II | $3,999 | Shipping | Proprietary; **no public API** |
| **Sky-Watcher** | SynScan + WiFi adapter | varies | Shipping | SynScan App Protocol v2.6.5 (Sep 2025) + ASCOM |
| **iOptron** | HEM / CEM / GEM | varies | Shipping | iOptron Commander (Win) + ASCOM driver; ASCOM v9 |
| **Bresser** | PushTo AR-80/400 | ~$300 | Shipping | "PushTo Navigation" app; Bluetooth; **no public API** |
| **YukonSky** | — | — | **No verifiable product as of 2026-05-13** | — |
| **BoSL** | — | — | **No verifiable product as of 2026-05-13** | — |

### Quick "build-priority" ranking
1. **Seestar S30 / S30 Pro / S50** — native Alpaca, large installed base, demo-ready.
2. **Sky-Watcher SynScan mounts** — DIY astrophotographers; SynScan protocol +
   ASCOM is well-documented.
3. **Dwarf 3 / Dwarf Mini** — wrap `dwarfium` rather than re-implement protobuf.
4. **Vaonis Vespera 3 / Pro 2 / II** — protocol is opaque but Singularity app
   uses local Wi-Fi; reverse-engineering is plausible but slow.
5. **iOptron / Sky-Watcher / generic ASCOM mounts via Alpaca** — free win once #1
   is built.
6. **Unistellar** — partnership-only, no direct control.
7. **Celestron Origin / StarSense Explorer** — proprietary, patent-bordered;
   pursue *content partnership* not *control integration*.

---

## Per-Maker Deep Dives

### ZWO Seestar (Suzhou ZWO Company, est. 2011)

**Hardware lineage.** ZWO is the astro-camera maker behind the entire ASI brand
(ASI120, ASI294, ASI2600 etc.) and the ASIAIR controller. The Seestar line is
their consumer push:

- **S30** ($349): 30 mm aperture, 150 mm focal length, IMX462 sensor.
- **S30 Pro** ($599, Jan 2026): "4K Dual Vision" — a second wide-field optical
  path alongside the main 30 mm scope.
- **S50** ($499–$549): 50 mm, 250 mm f/5, IMX462. The breakout 2023–24 product;
  discontinued April 2026 in favour of the S50 Pro.
- **S50 Pro** (rumoured $749–$999, ship date late 2026): replacement for the S50.

**Companion app.** Seestar app (iOS + Android). No Windows app; ZWO has explicitly
said "the Seestar app is specifically designed for mobile devices." Source: ZWO
S30 Pro FAQ at https://www.seestar.com/blogs/faq/seestar-s30-pro-faq.

**SDK / API status.** No published SDK URL exists at zwoastro.com or seestar.com.
**However**, since the late-2024 firmware update Seestar has shipped **native
ASCOM Alpaca support** when paired in *station mode* (joined to the home Wi-Fi
rather than running as an access point). Verified at the official ZWO forum
(`bbs.zwoastro.com`) and ZWO's Facebook group: "Now the Seestar(s) are both
supporting the ASCOM/Alpaca…" (community announcement). NINA 3.1+ natively
discovers them.

> Practical note: when the Seestar's physical arm is closed, *any* Alpaca call
> errors. You have to open the arm via the official mobile app first. This is the
> single most-common support question on Cloudy Nights for the Seestar+NINA
> combo. Our adapter has to detect this state and surface a clear error.

**The community bridge `seestar_alp`** at
https://github.com/smart-underworld/seestar_alp (261 stars, 61 forks, last release
v3.2.2 on 2026-05-06, ~1,870 commits) remains relevant for:
- **Access-point mode** (Seestar as its own SSID, no home Wi-Fi).
- **Scheduling and mosaic features** that the native Seestar Alpaca doesn't expose.
- **Multiple-Seestar orchestration** (the "EAA Array" use case).

Default ports used by `seestar_alp`:
- **5555** — Alpaca API (HTTP/JSON)
- **7556** — Imaging API (RTSP-style stream)
- **5432** — Web UI
- **8090** — Stellarium remote-control bridge

Native Seestar Alpaca (post-firmware update, station mode): standard Alpaca port
**11111** with discovery on **UDP 32227**.

**What an Astra Vault Seestar bridge looks like.**
1. UDP-broadcast discovery on 32227 once on screen load → enumerate Alpaca devices.
2. For each discovered device with the substring `Seestar` in its `ServerName`
   field, instantiate a `SeestarAdapter` backed by the generic `AlpacaClient`.
3. Telescope device endpoints: `/api/v1/telescope/{n}/slewtocoordinatesasync`
   (RA + Dec), `/api/v1/telescope/{n}/abortslew`, etc.
4. Camera device endpoints: `/api/v1/camera/{n}/startexposure`,
   `/imagearray` or new `/imagebytes` for high-speed binary.
5. Poll `/connected` and `/connecting` (Platform 7 async pattern).
6. On image complete, fetch the JPEG, attach to the user's collected-object
   record in the Vault, attention-hash it, push to AstroBin (if user opted in).

**Risks / blockers.**
- ROI mode on the Alpaca camera endpoint reportedly errors. Avoid ROI; use full
  frame.
- Station mode requires user-side Wi-Fi router cooperation. App needs a flow for
  AP mode fallback through `seestar_alp` (Pi or local laptop).
- US tariffs are squeezing ZWO margins; they may not have engineering capacity to
  evolve the Alpaca surface aggressively. Our adapter has to be defensive.

**Sources.**
- https://www.seestar.com/ (model lineup, 2026)
- https://www.seestar.com/blogs/faq/seestar-s30-pro-faq
- https://github.com/smart-underworld/seestar_alp
- https://www.cloudynights.com/forums/topic/978010-seestar-can-be-now-controlled-via-nina-or-any-dso-software/
- https://forums.sharpcap.co.uk/viewtopic.php?t=9039
- https://deepwiki.com/smart-underworld/seestar_alp/5.1-network-configuration

---

### Vaonis (Montpellier, France)

**Hardware lineage.** Founded by Cyril Dupuy in 2016; Stellina ($4,000, 2019)
launched the category. Current line in mid-2026:

- **Hestia** ($249) — phone-as-eyepiece, optical (not motorised).
- **Vespera II** ($1,499) — legacy budget pick.
- **Vespera 3** (~$2,499) — replaced Vespera II, 8.3 MP sensor, 50 mm aperture
  / longer focal length.
- **Vespera Pro 2** ($2,999+) — pro consumer; 30-slot multi-night mode.
- **Hyperia** ($99,000, announced CES 2026 with Canon partnership) —
  observatory-grade, 150 mm aperture, 45 MP full-frame Canon sensor; first
  deliveries late 2026 / 2027.

**Companion apps.**
- **Singularity** (iOS, Android, also a Windows port that's a wrapped APK) —
  controls Vespera / Stellina / Vespera Pro / Vespera 3.
- **Gravity** — Hestia-only, uses the phone's camera through the Hestia
  optical attachment. **Has no remote control surface** — the phone *is* the
  imaging device.

**SDK / API status.** No public developer portal exists. The
`https://vaonis.com/developer` URL referenced in the session-2 brief returns 404
as of 2026-05-13. The pages-vaonis-apps page mentions only end-user apps; no
SDK section.

The Singularity app communicates with Vespera over the Vespera's onboard Wi-Fi
access point (default SSID `Vespera-XXXXXX`). The protocol is **undocumented**
and not Alpaca. Community reverse-engineering has *not* surfaced a stable client
as of 2026-05 — there's no equivalent of `seestar_alp` for Vespera.

**Hestia.** The QR-code-on-base pairing scans into the Gravity app; the
"telescope" itself is purely optical. There is *no* network surface at all. **We
cannot integrate Hestia** beyond suggesting "use Hestia with the Vault as a logbook,
manually upload your captures."

**What an Astra Vault Vespera bridge looks like.**
- **Short term (2026):** an "import a Vespera capture" flow only — Vespera exports
  JPEG/FITS via the official app; we let users send-to-Vault from the iOS share
  sheet.
- **Medium term:** partnership outreach for SDK access. Vaonis is press-savvy
  and seeks ecosystem credibility — they have *already* partnered with Canon for
  Hyperia.
- **Long term:** if Vaonis publishes an SDK, drop in a `VesperaAdapter` against it.

**Risks / blockers.**
- No protocol. No timeline. Vaonis is small (~50 employees) and Hyperia is
  consuming most of their engineering oxygen.
- Hestia is unbridgeable by design.

**Sources.**
- https://vaonis.com/pages/vaonis-apps
- https://vaonis.com/pages/vespera-new-generation
- https://vaonis.com/hyperia/en/
- https://newatlas.com/technology/vaonis-hyperia-smart-observatory/
- https://petapixel.com/2026/02/02/how-the-99000-vaonis-hyperia-smart-observatory-uses-canon-tech-to-explore-the-cosmos/
- https://www.kickstarter.com/projects/vaonis/hestia-turn-your-smartphone-into-a-smart-telescope

---

### Unistellar (Marseille, France)

**Hardware lineage.** Founded 2015 by Laurent Marfisi, Arnaud Malvache, Franck
Marchis; Marchis is also SETI Institute Senior Astronomer — which is the entire
reason Unistellar's citizen-science pipeline exists.

Lineup as of 2026-05:
- **eVscope 2** ($4,000) — 114 mm, OLED Nikon eyepiece, 7.7 MP.
- **eQuinox 2** ($2,499) — same optics, no eyepiece (app-only).
- **Odyssey** ($2,499) — 85 mm "Discovery" tier, no eyepiece.
- **Odyssey Pro** ($3,999) — 85 mm with OLED Nikon eyepiece.

**Companion app.** "Unistellar app" (iOS + Android). Citizen-science programs
(UNITE for exoplanets, asteroid occultations, planetary defence, comets,
NEOs) are run *through the app*. Recent firmware update history is at
https://help.unistellar.com/hc/en-us/articles/7306522999324.

**SDK / API status.**
- **No public SDK.** Marchis has spoken at conferences about the data pipeline
  but has never published an integration spec.
- **The 2020 jankais3r reverse-engineering** at
  https://github.com/jankais3r/Unistellar-eVscope-research documented:
  - eVscope 1 only.
  - ZeroMQ on TCP **13007** (status), **13009** (camera stream), **13012**
    (control).
  - Last commit March 2020; >5 years stale.
  - Required SSH root access (modified firmware) to fully exercise — not a
    consumer path.
- **No ASCOM/Alpaca translation exists.** A 2020 Cloudy Nights thread floated the
  idea of an "ASCOM server running on the eVscope's Raspberry Pi"; nobody shipped.

**What an Astra Vault Unistellar bridge looks like.**
- **Control: not feasible** without partnership.
- **Observation import: feasible with permission.** Unistellar stores user-submitted
  observations server-side (the SETI pipeline). If a user can authorise an OAuth
  export, we can ingest their citizen-science submissions and credit them as
  Vault collected-objects. This is the *only* realistic Unistellar integration.

**Partnership ask:**
- Email Franck Marchis (`fmarchis@seti.org`) and Laurent Marfisi
  (`laurent@unistellar.com`) jointly with a one-page proposal: *"Vault as
  observation logbook for Unistellar citizen scientists — read-only,
  attribution-preserved."* Reference the AAVSO collaboration model
  (https://www.aavso.org/unistellar-evscope) as precedent.

**Risks / blockers.**
- Closed ecosystem by design.
- The SETI Institute citizen-science branding is a value-add for Unistellar; they
  won't dilute it without a strategic rationale.
- 2020 reverse-engineering is stale and ethically grey territory in 2026.

**Sources.**
- https://science.unistellar.com/
- https://www.seti.org/projects/unistellar-network/
- https://science.unistellar.com/exoplanets/unite/
- https://science.nasa.gov/citizen-science/unite-unistellar-network-investigating-tess-exoplanets/
- https://github.com/jankais3r/Unistellar-eVscope-research (stale)
- https://help.unistellar.com/hc/en-us/articles/7306522999324

---

### Dwarf Lab (Shenzhen, China)

**Hardware lineage.**
- **Dwarf II** ($499, 2022) — original "tabletop telephoto + telescope" form
  factor.
- **Dwarf 3** ($549, 2024–25) — Sony IMX678 STARVIS 2 sensor, 128 GB eMMC,
  AZ/EQ mode, ~1.35 kg, "4K auto-tracking."
- **Dwarf Mini** ($399, April 2026) — Sony IMX662, 30 mm aperture, 64 GB,
  840 g, "world's smallest smart telescope."

**Companion app.** DWARFLAB app (iOS + Android), plus the official DwarfLab
help-centre at https://help.dwarflab.com/en.

**SDK / API status.**
- **No formal OpenAPI / Swagger document.** DwarfLab has not published a
  developer portal.
- **Protocol: WebSocket with binary protobuf messages.** Confirmed via the
  community `dwarfii_api` documentation at https://stevejcl.github.io/dwarfii_api/
  ("The Dwarf API uses websockets with binary protobuf format").
- **Dwarf II API V2** documentation is referenced from the wrapper library; the
  Dwarf 3 reuses much of the same scheme but adds endpoints. The wrapper is
  on npm as `dwarfii_api` (a TypeScript-compatible library — useful for us).
- **`dwarfium`** at https://github.com/stevejcl/dwarfium is the production
  reference client: **MIT-licensed**, **Next.js + TypeScript** (44.7% JS, 22.5% TS).
  It supports both Dwarf II and Dwarf 3. **This is what we wrap.**

The protocol uses either Dwarf-internal Wi-Fi AP (`DWARF_xxx` SSID) or STA mode
(Dwarf joins the home Wi-Fi). Port and exact URL depend on connection mode and
are documented inline in the `dwarfii_api` source.

**What an Astra Vault Dwarf bridge looks like.**
1. BLE discovery scan for `DWARF` device prefix.
2. Pair → derive WebSocket URL (`ws://<ip>:<port>/path`).
3. Use `dwarfii_api` library wrapped in our `DwarfAdapter` for telescope
   commands.
4. Frame stream: separate WebSocket channel; binary protobuf packets containing
   JPEG chunks for live preview.
5. Slew → expose → fetch → attach to collection record (same end of flow as
   Seestar).

**Risks / blockers.**
- Protobuf schema is not officially published; we depend on `dwarfii_api` keeping
  up with firmware. Reasonable risk — `dwarfium` has been active throughout
  2024-25.
- Tariff-exposed. Dwarf Lab has fewer US-channel partners than ZWO.
- The protocol can change between firmware versions; need a "firmware compat
  matrix" page in our adapter.

**Sources.**
- https://github.com/stevejcl/dwarfium
- https://stevejcl.github.io/dwarfii_api/
- https://help.dwarflab.com/en
- https://help.dwarflab.com/en/docs/DWARF-3-Smart-Telescope-User-Manual-Part1-App-Interface-Introduction
- https://petapixel.com/2026/04/28/399-dwarf-mini-is-the-worlds-smallest-smart-telescope/
- https://astrobackyard.com/dwarf-mini/

---

### Celestron (Torrance, CA — owned by Synta)

Celestron occupies the "established American brand" position. Two product
families matter here.

**StarSense Explorer (DX, LT, dobsonian variants).** These are not *smart
telescopes* in the Seestar sense — they are *manual telescopes with a
smartphone-as-finder*. The phone is mounted in a dock, runs the StarSense
Explorer app (iOS/Android), plate-solves through the phone's camera, and shows
the user *where to push*. The scope itself has *no electronics*.

- **Protected by US patents 8,401,307 B1 and 8,477,419 B1** (Celestron itself
  calls these out at https://www.celestron.com/pages/starsense-explorer-technology
  and the StarSense Auto Align page).
- The patents claim *"the first app ever developed that uses plate solving to
  determine the smartphone's current pointing position"* — a process claim.
- **Impact on Astra Vault:** if we ever add a phone-as-finder feature
  (overlay reticle, push-to-guide), we need a freedom-to-operate review.
  Patent #1 expires roughly 2032 (filed 2012); patent #2 around 2033.

**Celestron Origin (Origin Mark II, the current model, $3,999).** Celestron's
flagship smart telescope. 6 inch Rowe-Ackermann Schmidt astrograph,
Sony Starvis 2 sensor, intelligent home observatory positioning.
- App developed *with Simulation Curriculum* (the SkySafari team), iOS +
  Android.
- April 2026 firmware (v.1.4.6084) added dithering.
- **No public SDK; no Alpaca driver shipped by Celestron; no community Alpaca
  bridge has matured.** The legacy SkyPortal protocol (TCP 2000 to a
  serial-over-WiFi bridge) is well documented by reverse-engineers, but Origin's
  control surface is more sophisticated and hasn't been broken open publicly.

**Sky-Watcher / Synta / NexStar Evolution (legacy mounts).** The SkyPortal WiFi
module and Evolution/Astro Fi mounts speak the Celestron AUX bus over TCP port
2000. There are multiple community-built ESP32 replacements
(`Wixely/CelestronESPWifi`, `alex-vg/esp-skyportal-module`). For Astra Vault
purposes, we treat these as "generic NexStar mounts" reachable via Alpaca by
using `alpacascope` or a similar bridge if needed — but in 2026 most users will
have an Alpaca-aware imaging stack already.

**What an Astra Vault Celestron bridge looks like.**
- **Origin:** out of scope for the initial build. Add a "Bring Origin support"
  pre-vote button in the app; engage Celestron product team after we have a
  Seestar+Dwarf install base.
- **StarSense Explorer:** content partnership only — co-promote
  Astra-Vault-collected-objects in-app for Celestron users; the *finder UX* stays
  in Celestron's app to avoid the patent.
- **NexStar / SkyPortal mounts:** support as generic Alpaca mounts via NINA's
  bridge or `alpacascope` (archived but functional).

**Sources.**
- https://www.celestron.com/products/celestron-origin-intelligent-home-observatory
- https://www.celestron.com/pages/celestron-origin-technology
- https://www.celestron.com/pages/starsense-explorer-technology
- https://github.com/Wixely/CelestronESPWifi
- https://github.com/alex-vg/esp-skyportal-module
- https://www.cloudynights.com/forums/topic/997668-celestron-origin-ai

---

### Sky-Watcher (Synta — Suzhou + Taiwan)

Sky-Watcher is the *mount* brand of the same parent that owns Celestron. Their
SynScan ecosystem is fully documented at
https://skywatcher.com/download/manual/application-development/.

**Available developer docs (updates verified 2026-05-13):**
- **SynScan App Protocol** ("formerly known as SynScan Mobile Command Set"),
  updated **2025-09-10**, ~100 KB.
- **SynScan Serial Communication Protocol v3.3** (2018-02-21, 687 KB).
- **SynScanLink iOS** library, v1.0.0, updated **2024-12-14**, 21 MB.
- **Motor Controller Command Set** for GOTO mounts.
- **SynScan App iOS URL API v0.2** (inter-app communication).

The SynScan Pro app (iOS, Android) supports control by **third-party apps over
TCP/UDP** via the SynScan App Protocol — *this is a real, documented developer
surface*. Sky-Watcher *welcomes* third-party integration.

**Connection model.** Sky-Watcher's WiFi adapter ("SynScan WiFi Adapter") makes
the mount discoverable on the local network. Standard protocol negotiation gives
us slew/track/sync commands.

**ASCOM/Alpaca.** Sky-Watcher mounts are routinely controlled through ASCOM
on Windows and increasingly via Alpaca on cross-platform setups. They are *not*
natively Alpaca devices but are wrapped by community bridges.

**What an Astra Vault Sky-Watcher bridge looks like.**
- Direct SynScan App Protocol (TCP/UDP) for serious users — fewer translation
  layers, lower latency.
- Alpaca path via NINA / a Pi running `alpacascope` for plug-in compatibility
  with the rest of our adapter pattern.

**Sources.**
- https://skywatcher.com/download/manual/application-development/
- https://github.com/vsirvent/Open-Synscan

---

### iOptron (Woburn, MA)

iOptron's mount line (HEM15/HEM27/HEM44, CEM26/CEM40/CEM70/CEM120, GEM45, etc.)
is well represented in the precision-astrophotography market.

**Developer docs.**
- **iOptron RS-232 Command Language v3.0** is the current protocol generation.
- **iOptron Commander** for Windows (iOptron's own app) connects via Wi-Fi /
  Ethernet without needing the ASCOM Platform installed.
- **ASCOM Driver v9** is current (update history at
  https://www.ioptron.com/v/ASCOM/ASCOM9_UpdateHistory.txt).
- **No public mobile SDK** at the time of writing.

**What an Astra Vault iOptron bridge looks like.**
- Most easily reached via the ASCOM/Alpaca bridge (Commander on a Windows
  machine + ASCOM Remote / Alpaca exposes the mount).
- Direct Wi-Fi/Ethernet to the mount controller is also possible using the
  RS-232 protocol v3.0 over TCP, but is an "advanced user" feature for
  Astra Vault to expose.

**Sources.**
- https://www.ioptron.com/category-s/138.htm
- https://www.ioptron.com/Articles.asp?ID=295
- https://www.ioptron.com/v/ASCOM/ASCOM9_UpdateHistory.txt

---

### Bresser (Meade Instruments Europe GmbH, Rhede, Germany)

Bresser ships the **PushTo AR-80/400 Smart Telescope** as their entry into the
"smart" category — a manual refractor with integrated angle sensors and a
Bluetooth app ("BRESSER PushTo Navigation").

- The scope provides azimuth/altitude sensing; the app draws a crosshair on a
  star map.
- **No public API**, no Alpaca path.
- This is a "phone-as-finder" product, conceptually similar to StarSense
  Explorer but using integrated optical-axis sensors instead of phone-camera
  plate solving.

**What an Astra Vault Bresser bridge looks like.**
- Out of scope for direct control.
- Possible *content partnership* (e.g., curated targets for Bresser owners).

**Sources.**
- https://www.bresser.com/p/bresser-pushto-ar-80-400-smart-telescope-with-tripod-4780400
- https://www.bresser.com/astronomy/telescopes/

---

### YukonSky / BoSL (speculative entrants)

Searched both terms repeatedly across smart-telescope review sites, Cloudy
Nights forum threads on "future of smart telescopes," and CES 2026 coverage on
2026-05-13. **Neither name produces a verifiable consumer product.** They may
be:
- Stealth-mode 2026 announcements not yet shipping.
- Mis-spellings of regional brands (e.g., Yukon Optics makes binoculars but no
  smart scope as of mid-2026).
- Aspirational placeholder names.

**Verdict: no action.** Re-scan quarterly. If a real product surfaces, slot it
into the adapter pattern when its protocol is known.

---

## Protocols

### ASCOM Alpaca

**Status.** ASCOM Initiative's network-based, cross-platform replacement for
the legacy Windows-only ASCOM COM driver model. Active, modern, growing.

**Current versions (verified 2026-05-13):**
- **ASCOM Platform 7.1.3** (current download as of mid-2026,
  https://www.ascom-standards.org/).
- **ASCOM Master Interfaces 1.0.23** — the canonical API contract document
  (https://ascom-standards.org/newdocs/ascom-interfaces.pdf).
- **ASCOM Remote 6.7.1+4785** (May 2024 release) — the .NET-based bridge between
  legacy COM drivers and Alpaca.
- **`alpyca` 3.1.2** (PyPI, Python client; runs Linux/macOS/Windows, requires
  Python 3.9+).
- **`ASCOM.Alpaca.Components` 3.0.0** (NuGet, .NET client).

**Platform 7 key additions for our work:**
- **`Connect()` / `Disconnect()`** methods are *asynchronous*; the
  `Connecting` property reports completion.
- **`DeviceState`** property returns the entire device's operational state in
  a single call — important for mobile, where minimising round-trips matters.
- **`ImageBytes`** binary high-speed image transfer protocol — supplants the
  base64 JSON `ImageArray` for camera reads, ~5x faster on phones.
- **ClientID / ClientTransactionID** are *optional* parameters now (per the
  spec); we can omit them in early calls but should generate them for
  multi-tab/multi-client correctness.

**Specification URLs:**
- Master spec PDF: `https://ascom-standards.org/newdocs/ascom-interfaces.pdf`
- Release notes: `https://ascom-standards.org/newdocs/relnotes.html`
- Live API reference & test playground: `https://ascom-standards.org/api/`
- Library docs: `https://ascom-standards.org/Documentation/Index.htm`

**Device types** (each exposed at `/api/v1/{devicetype}/{devicenumber}/...`):
- `telescope`, `camera`, `focuser`, `filterwheel`, `rotator`, `dome`,
  `safetymonitor`, `switch`, `observingconditions`, `covercalibrator`, `video`.

For our scope-bridge use case the only critical ones are `telescope` (for
slew/track), `camera` (for exposure + image fetch), `focuser` (auto-focus),
and `filterwheel` (for narrow-band — Dwarf 3 has a built-in filter wheel,
Seestar S30 Pro has filters).

**JSON-over-HTTP example (slew Seestar to RA 13h29m / Dec +47° — that's M51):**

```http
PUT /api/v1/telescope/0/slewtocoordinatesasync HTTP/1.1
Host: 192.168.1.43:11111
Content-Type: application/x-www-form-urlencoded

RightAscension=13.4878&Declination=47.1958&ClientID=42&ClientTransactionID=1
```

Response:

```json
{
  "ClientTransactionID": 1,
  "ServerTransactionID": 873,
  "ErrorNumber": 0,
  "ErrorMessage": ""
}
```

Poll for slew completion:

```http
GET /api/v1/telescope/0/slewing HTTP/1.1
```

```json
{
  "Value": true,
  "ClientTransactionID": 0,
  "ServerTransactionID": 874,
  "ErrorNumber": 0,
  "ErrorMessage": ""
}
```

**Alpaca Discovery Protocol (the gotcha).**
- UDP broadcast/multicast on **port 32227**.
- Client sends `{"alpacadiscovery1":""}` as a UDP packet.
- Devices respond with `{"alpacaport": 11111}` (or whatever port they're
  listening on for HTTP).
- Then client queries `http://<deviceip>:<alpacaport>/management/v1/configureddevices`
  to enumerate devices.

This is *the* mobile-specific implementation issue:
- **iOS:** UDP broadcast requires the `com.apple.developer.networking.multicast`
  entitlement, which requires an Apple review-board approval. Submit the
  entitlement request now — turnaround is 2–4 weeks.
- **Android:** works out of the box, but the app must hold a `MulticastLock`
  via `WifiManager`. React Native handles this through
  `react-native-network-info` or `react-native-udp` (community module).

**TypeScript client status (absence).** Search of npm + GitHub on 2026-05-13:
- No `@ascom-standards/alpaca-client`, no `ascom-alpaca-ts`, no first-class
  TypeScript SDK exists.
- `alpacascope` (Go) is archived (May 2025).
- `dwarfium` builds Alpaca-like behaviour for Dwarf only, on top of Next.js
  + TypeScript, but isn't an Alpaca client.
- **Astra Vault should publish `@astravault/alpaca-client` as open source
  (MIT) on npm.** This becomes a community asset and reduces our maintenance
  burden through PRs from N.I.N.A., SharpCap, and other ecosystem clients.

**Mobile suitability.** Alpaca is well-suited to mobile because:
- HTTP/JSON over LAN is what every mobile platform optimises for.
- Polling-based status (no required WebSocket).
- Discovery is the only "phone-specific" pain point.
- `ImageBytes` binary path keeps image transfer fast on poor Wi-Fi.

The single thing Alpaca *doesn't* give us is a "push" stream of new frames —
we have to poll. For live preview, we either accept ~1 Hz polling, or we
fall back to a maker-specific RTSP/WebSocket stream (Seestar's port 7556,
Dwarf's WebSocket).

### INDI (Instrument Neutral Distributed Interface)

**Status.** XML-over-TCP protocol predominantly used in Linux observatory
software (KStars, Ekos). INDI Library is the canonical open-source
implementation. Active but stagnant relative to Alpaca's growth.

**INDIGO.** A 2017+ fork/successor to INDI by CloudMakers (Peter Polakovic).
- Supports **both XML and JSON** over TCP and WebSocket.
- Cross-platform (Linux, macOS, Windows).
- "Atomic driver" architecture; can run drivers in-process or as a separate
  service.
- Backward-compatible with INDI 1.7 wire protocol.

**Relevance to a phone-first app.**
- Most Astra Vault target users won't run an INDI server themselves.
- The *power users* who do are usually on StellarMate (a paid INDI server
  appliance), AstroBerry (open-source Raspberry Pi distro), or Ekos on Linux.
- An "INDI bridge" feature would be a "for our most-advanced users" surface,
  not the consumer flow.

**Skip / pursue verdict.** **Pursue as a secondary adapter in Phase 2.** The
implementation is straightforward (a TCP socket speaking XML, or INDIGO's
JSON-over-WebSocket variant). It would unlock the 5–10% of our users who run
serious imaging rigs and want their phone to peek at the current frame.

For Phase 1, the energy goes into Alpaca.

**Sources.**
- https://www.indilib.org/
- https://github.com/indilib/indi
- https://www.indigo-astronomy.org/
- https://github.com/indigo-astronomy/indigo/blob/master/indigo_docs/PROTOCOLS.md

### N.I.N.A. (Nighttime Imaging 'N' Astronomy)

**Status.** Windows-only, .NET, MIT-licensed
(https://nighttime-imaging.eu/). The de-facto "free professional" imaging
front-end. Reference implementation for what "good" looks like in this space.

**Why it matters to us.**
- N.I.N.A. is what serious users *replace* their maker's app with the moment
  the maker becomes Alpaca-compatible. The Cloudy Nights thread celebrating
  "Seestar can be now controlled via NINA" hit page 3+ within weeks.
- We're not competing with N.I.N.A. on Windows; we're winning the **mobile**
  equivalent, which is currently empty (SkySafari has Alpaca and is the
  closest competitor, but it's a planetarium-with-control, not a logbook).

### AstroBin (Salvatore Iovene, Switzerland)

**API status.** Documented at
https://welcome.astrobin.com/application-programming-interface.
- **Read-only.** Cannot upload images via API.
- **API-key authentication** (`api_key` + `api_secret`), keys obtained via
  the request form at https://www.astrobin.com/api/request-key/.
- JSON and XML response formats.
- Endpoints: image-by-ID, image search (subject, user, title, description,
  upload date), Image of the Day, Top Picks, user profile.
- Fair-use policy in force; aggressive scraping → key revocation.
- **No platesolve-as-a-service endpoint.** AstroBin's plate-solving is for
  internal use only.

**For Astra Vault:**
- ✅ Use AstroBin's read API to pull "community photos of this object" onto
  object detail pages.
- ❌ Cannot push user captures into AstroBin via API (today).
- 🟡 **Partnership ask:** an upload endpoint or OAuth pass-through, so a
  Seestar user can one-tap "publish my Vault capture to AstroBin."

For **plate solving** we instead recommend:
- **astrometry.net `nova`** — public REST API at https://nova.astrometry.net,
  API-key based, JSON. Slow (seconds–minutes) but free.
- **On-device:** tetra3 (Python), or its C ports. Reduce the search space by
  passing IMU pose; solves in <1 s on a phone.

**Sources.**
- https://welcome.astrobin.com/application-programming-interface
- https://nova.astrometry.net/api_help
- http://astrometry.net/doc/net/api.html

---

## Recommended Architecture for `services/scopes/`

The adapter pattern below is **types and interfaces only** — concrete
implementation is the 3-week build. All types are designed to be
serialisable to/from Firestore (the existing `data/collected.ts` storage layer).

```typescript
// services/scopes/index.ts

/* =========================================================================
 * Top-level identifiers
 * ========================================================================= */

export type ScopeMakerId =
  | "seestar"
  | "dwarf"
  | "vespera"
  | "unistellar"
  | "celestron"
  | "skywatcher"
  | "ioptron"
  | "generic-alpaca"
  | "indi";

export type ScopeModelId = string; // e.g. "S30-Pro", "Dwarf3", "Vespera-Pro-2"

export interface ScopeDevice {
  /** Stable per-session id (UUID v4) */
  id: string;
  maker: ScopeMakerId;
  model: ScopeModelId;
  displayName: string;
  /** Reachability — local IP, BLE peripheral id, etc. */
  transport: ScopeTransport;
  /** Last known status snapshot */
  lastStatus?: ScopeStatus;
  firmwareVersion?: string;
}

export type ScopeTransport =
  | { kind: "alpaca"; host: string; port: number; deviceNumber: number }
  | { kind: "ws-protobuf"; url: string }       // Dwarf
  | { kind: "tcp-zmq"; host: string; ports: { status: number; camera: number; control: number } } // Unistellar
  | { kind: "synscan"; host: string; port: number }
  | { kind: "indi"; host: string; port: number; deviceName: string }
  | { kind: "ble"; peripheralId: string };

/* =========================================================================
 * Capabilities — adapter declares what it can do
 * ========================================================================= */

export interface ScopeCapabilities {
  /** Can the scope slew to (RA, Dec) by command? */
  canSlewToCoordinates: boolean;
  /** Can we get back live preview frames? */
  canStreamFrames: boolean;
  /** Frame stream protocol if any */
  frameStreamKind?: "rtsp" | "ws-protobuf" | "alpaca-poll" | "mjpeg";
  /** Can we start an exposure and pull the final JPEG/FITS? */
  canCaptureFinal: boolean;
  /** Does the scope have a built-in filter wheel? */
  hasFilterWheel: boolean;
  /** Does the scope have an electronic focuser? */
  hasFocuser: boolean;
  /** Can we pull current device state (RA, Dec, slewing, etc.) in one call? */
  hasUnifiedDeviceState: boolean; // Platform 7 only
}

/* =========================================================================
 * Status snapshot — what every adapter must produce
 * ========================================================================= */

export interface ScopeStatus {
  connected: boolean;
  slewing: boolean;
  tracking: boolean;
  rightAscension?: number;  // hours (J2000)
  declination?: number;     // degrees
  altitude?: number;        // degrees
  azimuth?: number;         // degrees
  utc?: string;             // ISO 8601
  exposureStartedAt?: number; // ms epoch
  exposureRemainingSec?: number;
  errors?: string[];
}

/* =========================================================================
 * Image record — what we attach to a Vault collection entry
 * ========================================================================= */

export interface ScopeImageRecord {
  scopeId: string;
  capturedAt: number;
  exposureSeconds: number;
  stackedFrameCount?: number;
  ra?: number;
  dec?: number;
  /** Local path inside the app's sandbox after fetch */
  jpegUri: string;
  /** Optional raw FITS path (Vespera/Dwarf export) */
  fitsUri?: string;
  attentionHash?: string;
}

/* =========================================================================
 * Adapter — every maker implements this
 * ========================================================================= */

export interface MountAdapter {
  readonly device: ScopeDevice;
  readonly capabilities: ScopeCapabilities;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<ScopeStatus>;

  /** Slew to celestial coordinates (J2000). RA in hours, Dec in degrees. */
  slewToCoordinates(raHours: number, decDegrees: number): Promise<void>;
  abortSlew(): Promise<void>;

  /** Start an exposure. Adapter is allowed to ignore filter/binning if not capable. */
  startExposure(opts: ExposureOptions): Promise<void>;
  cancelExposure(): Promise<void>;
  /** Resolves when the final stacked frame is available, providing a local URI. */
  awaitFinalImage(): Promise<ScopeImageRecord>;

  /** Subscribe to status snapshots at ~1 Hz */
  subscribeStatus(cb: (s: ScopeStatus) => void): () => void;

  /** Subscribe to live preview frames (if capability allows) */
  subscribeFrames?(cb: (jpegBase64: string) => void): () => void;
}

export interface ExposureOptions {
  durationSec: number;
  filterIndex?: number;   // 0..N
  binning?: 1 | 2 | 4;
  gainDb?: number;
  saveFits?: boolean;
}

/* =========================================================================
 * Discovery — phone-side, runs on Hub screen mount
 * ========================================================================= */

export interface ScopeDiscovery {
  /** Run all enabled discovery channels for `timeoutMs` and return found devices */
  discover(timeoutMs?: number): Promise<ScopeDevice[]>;
  /** Subscribe to live discoveries (mDNS-style) */
  subscribe(cb: (d: ScopeDevice) => void): () => void;
}

/* =========================================================================
 * Adapter factory — main entrypoint for the rest of the app
 * ========================================================================= */

export interface ScopeAdapterFactory {
  /** Construct a maker-specific adapter for a discovered device */
  createAdapter(device: ScopeDevice): MountAdapter;
  /** Adapter ids currently registered */
  registeredAdapters(): ScopeMakerId[];
}

/* =========================================================================
 * Per-maker adapters (file layout — types only here)
 * ========================================================================= */

// services/scopes/alpaca/AlpacaClient.ts
export interface AlpacaClient {
  baseUrl(): string;
  /** Low-level GET / PUT against /api/v1/{devicetype}/{n}/{method} */
  get<T>(devType: string, devNum: number, method: string): Promise<T>;
  put<T>(devType: string, devNum: number, method: string, params: Record<string, string | number | boolean>): Promise<T>;
  /** Platform 7 unified state */
  deviceState(devType: string, devNum: number): Promise<Record<string, unknown>>;
}

// services/scopes/alpaca/discovery.ts
export interface AlpacaDiscovery extends ScopeDiscovery {
  /** Sends a single UDP broadcast on port 32227, listens for responses */
  scanOnce(timeoutMs: number): Promise<AlpacaDiscoveryResult[]>;
}

export interface AlpacaDiscoveryResult {
  ip: string;
  alpacaPort: number;
  serverName?: string;
  manufacturer?: string;
  serverVersion?: string;
  configuredDevices: AlpacaConfiguredDevice[];
}

export interface AlpacaConfiguredDevice {
  DeviceName: string;
  DeviceType: "Telescope" | "Camera" | "Focuser" | "FilterWheel" | "Rotator" | "Dome" | "SafetyMonitor" | "Switch" | "ObservingConditions" | "CoverCalibrator" | "Video";
  DeviceNumber: number;
  UniqueID: string;
}

// services/scopes/seestar/SeestarAdapter.ts
// Wraps AlpacaClient for native Alpaca-mode Seestars
// Falls back to seestar_alp on Raspberry Pi if user has one configured

// services/scopes/dwarf/DwarfAdapter.ts
// Wraps the dwarfii_api npm library (WebSocket + protobuf)
// Translates messages to the ScopeStatus / ScopeImageRecord shape

// services/scopes/vespera/VesperaAdapter.ts
// Phase-1 stub: import-only adapter; reports !canSlew, !canCapture
// User pulls images via iOS share sheet, we ingest as ScopeImageRecord

// services/scopes/unistellar/UnistellarAdapter.ts
// Phase-1 stub: ScopeImageRecord ingest via OAuth-style account link
// (depends on partnership)

// services/scopes/generic/AlpacaGenericAdapter.ts
// Catches any Alpaca-speaking device that isn't recognised by maker
// (covers iOptron via ASCOM Remote, Sky-Watcher via ASCOM Remote, custom rigs)

// services/scopes/indi/IndiAdapter.ts
// Phase-2: connect to user-provided INDI server URL (StellarMate, Ekos)
```

**Implementation notes for the dev who picks this up:**

- The `AlpacaClient` is a thin fetch wrapper. Plan for 30–60 second timeouts;
  slew commands return immediately but `slewing` polling can run a long time.
- Authentication: Alpaca devices on a trusted LAN typically have no auth, but
  the spec allows for basic auth. Plan to support both.
- All numerics through the wire are floats. Right Ascension is in *hours*,
  not degrees — common bug.
- Frame streaming is the *one* place where a WebSocket helper is justified.
  For native Alpaca camera, use `imagebytes` and poll once per second; for
  Dwarf, wire to the `dwarfium` socket; for Seestar in `seestar_alp` mode, the
  port 7556 RTSP stream is wrapped by `seestar_alp` into a JPEG MJPEG feed.
- Live previews stay in volatile state — only the *final* `ScopeImageRecord`
  is persisted to Firestore.

---

## Partnership Outreach Targets

### ZWO Seestar
- **Sam Wen** (CEO, ZWO) — `sam@zwoastro.com` (general info channel; private
  contact is gated).
- **Suzhou ZWO PR / community team** — `bbs.zwoastro.com` mods, Cloudy Nights
  Seestar subforum.
- **Concrete ask:** *"List Astra Vault as an officially compatible app on
  seestar.com and us.zwoastro.com. We commit to maintaining Alpaca
  compatibility across firmware releases."* Reasonable to bundle with a press
  push (joint blog post, demo at NEAF 2026 or AIC 2026).

### Vaonis
- **Cyril Dupuy** (CEO & Founder) — public LinkedIn; corporate email is via
  `contact@vaonis.com`.
- **Concrete ask:** *"Read-only observation export from Singularity. We'd
  attribute every shared image as 'Captured with Vespera Pro 2 by [user].'"*
  Highlight Vault's collected-object framework as a data narrative for their
  Hyperia launch users.

### Unistellar
- **Franck Marchis** (Co-founder + SETI Institute) — `fmarchis@seti.org`.
- **Laurent Marfisi** (Co-founder + CEO) — `laurent@unistellar.com`.
- **Concrete ask:** *"Vault as a citizen-science logbook for Unistellar
  observers — read-only API for completed observations, attribution preserved,
  no scope-control surface."* Reference AAVSO precedent.

### Dwarf Lab
- **Dwarf Lab Discord** — most active community channel; `dwarflabs` GitHub
  org for technical channel.
- **Concrete ask:** *"Publish an OpenAPI doc for the Dwarf 3 control plane.
  We'll maintain a TypeScript client in the open and credit Dwarf Lab as
  protocol owner."* Their growth is constrained by lack of ecosystem; this is
  cheap goodwill.

### Celestron
- **Corey Lee** (VP Engineering, Celestron) — corporate LinkedIn.
- **Simulation Curriculum** (SkySafari makers, Origin's app partner)
  — `sales@simulationcurriculum.com`.
- **Concrete ask:** *content* partnership. Astra Vault highlights
  Celestron-collected-objects in our discovery flows; Celestron mentions Vault
  as a community sky-log. No protocol access in v1.

### Sky-Watcher
- **Synta Optical Technology, Taipei** — `info@synta.com.tw`.
- **Sky-Watcher USA** — `info@skywatcherusa.com`.
- **Concrete ask:** *"Vault treats SynScan mounts as first-class via your
  documented App Protocol. We'd appreciate a quote / endorsement for our
  press."* Synta is the parent of Celestron and Sky-Watcher; this is an
  upstream relationship.

### iOptron
- **iOptron Technical / Marketing** — `tech@ioptron.com`.
- **Concrete ask:** *"Listing on iOptron Compatible Apps page and
  cross-promotion."* Their ASCOM driver is the bridge, so technically there's
  nothing to negotiate — purely co-marketing.

### AstroBin
- **Salvatore Iovene** (founder) — `iovene@astrobin.com`.
- **Concrete ask:** *"OAuth-style image upload from third-party apps."* If
  declined, fall back to deep-link approach — pre-fill the upload form via
  URL params.

### ASCOM Initiative
- **Daniel Van Noord** (ASCOM Initiative core, alpyca maintainer) — GitHub
  `DanielVanNoord`.
- **Bob Denny** (founder, ASCOM Initiative) — `rdenny@dc3.com`.
- **Concrete ask:** *"List `@astravault/alpaca-client` as the official
  TypeScript Alpaca client on the ASCOM Standards page."* Lifts our SEO,
  signals legitimacy to maker partners.

---

## Risks

### Maker SDKs that explicitly forbid third-party integration

- **Unistellar** TOS implies but doesn't explicitly state. Their hardware EULA
  is on the `help.unistellar.com` site. Out of an abundance of caution, *only*
  pursue Unistellar via partnership.
- **Vaonis Singularity** TOS likewise. Their hardware is unrestricted but the
  app's network protocol is undocumented; *reverse engineering* sits in a grey
  zone in the EU. Pursue Vaonis through partnership.
- **Celestron Origin** firmware contains DMCA-protected encryption (per
  community reports). Do not attempt to break Origin's protocol; pursue
  partnership.

### Regional restrictions

- **Chinese-made scopes in US (ZWO, Dwarf Lab, Synta/Sky-Watcher).** April
  2025 Trump tariffs at 145%. ZWO has publicly indicated price increases are
  pending. US user availability may thin in 2026 H2. **Mitigation:** make
  sure Astra Vault works equally well with second-hand devices, and supports
  the European-made alternatives (Vaonis, Unistellar) prominently.
- **US-made scopes in CN (Celestron).** Reciprocal tariff exposure exists but
  is less acute; Celestron's manufacturing is largely outside the US anyway
  (Suzhou Synta).
- **Vaonis Hyperia** is export-controlled at the high end (>$50K
  observatory-grade telescopes may trigger dual-use review in EU). Not our
  problem at consumer level.

### Patent claims to dodge

- **Celestron US 8,401,307 B1 & US 8,477,419 B1** — "smartphone plate-solve
  as finder." Patents expire ~2032–33. **Do not ship a phone-as-finder
  feature without FTO review.** Driving a connected scope via Alpaca/etc. is
  *outside* these patents (which claim the alignment loop, not the
  protocol).
- **ZWO** has no relevant ASIAIR patent surface affecting our work; they
  protect specific stacker/aligner algorithms, not the protocol.
- **Unistellar** has trademarked "Enhanced Vision" but the patent landscape
  is benign for us — we're not building an EAA stacker.

### Other risks

- **Astra Vault is a *third-party* dependency on protocols we don't own.** If
  ZWO removes Alpaca in a firmware update (unlikely — they've made it a
  marketing point — but possible), our Seestar adapter dies overnight.
  Mitigation: keep `seestar_alp` as a fallback path in our adapter, and own a
  community-relations channel through the Cloudy Nights Smart Telescopes
  subforum.
- **Mobile UDP discovery on iOS** requires the multicast entitlement. **File
  the request now** with Apple — turnaround 2–4 weeks.
- **The "scope's arm is closed" failure mode on Seestar.** Common enough to
  warrant a dedicated error state and onboarding screenshot in our UI.
- **Frame streaming latency on weak Wi-Fi** is the user-perceived "is this
  thing on?" surface. Pre-roll a status indicator from the first
  status-poll response, not the first frame.

---

## What changed since the session-2 brief

1. **Seestar speaks native Alpaca now.** The brief assumed `seestar_alp` was
   mandatory. It isn't — only for AP mode and advanced features. Default flow
   is *direct* Alpaca on TCP 11111 / UDP 32227.
2. **Vespera Pro is now Vespera Pro 2; Vespera II is now Vespera 3; Hyperia
   is a $99K new tier with Canon partnership (CES 2026).** Vaonis is a more
   serious player than the brief implied, but their SDK story is unchanged
   (i.e., still no public SDK).
3. **Dwarf Mini ($399, April 2026)** is new — a third Dwarf SKU we get for
   free because the protocol family is identical.
4. **Tariff context is real and worth tracking.** Hardware-partnership
   conversations should acknowledge maker margin pressure.
5. **`alpacascope` is archived (May 2025).** Don't list it as live tooling.
6. **No TypeScript Alpaca client exists.** This is a publishable open-source
   contribution from Astra Vault.
7. **YukonSky and BoSL have no verifiable products** as of 2026-05-13.
8. **Unistellar's reverse-engineering work is stale** (2020 only, eVscope 1
   only); partnership is the only path.

---

## Build-ready summary for the 3-week sprint

**Week 1: foundations.**
- `services/scopes/index.ts` (interfaces from this doc).
- `services/scopes/alpaca/AlpacaClient.ts` — fetch wrapper, all device-type
  endpoints typed.
- `services/scopes/alpaca/discovery.ts` — UDP broadcast + management API
  enumerator. Native modules: `react-native-udp` (or
  Expo-compatible alternative if needed).
- File iOS multicast entitlement request with Apple.

**Week 2: Seestar.**
- `services/scopes/seestar/SeestarAdapter.ts` against native Alpaca.
- Hub-screen "Connect telescope" UI (discovery → list → select → confirm).
- "Slew to this object" button on object detail page.
- Status-strip overlay (current RA/Dec, slewing/tracking, ATP timer running).
- End-to-end: slew → expose → fetch JPEG → attach to collected-object.

**Week 3: Dwarf, generics, partnership-prep, ship.**
- `services/scopes/dwarf/DwarfAdapter.ts` wrapping `dwarfii_api`.
- Generic ASCOM Alpaca adapter for iOptron / Sky-Watcher / NINA setups.
- Outreach emails sent to ZWO, Vaonis, Unistellar, Dwarf Lab, Celestron,
  AstroBin (template in the previous section).
- Ship a "Smart-scope bridge (beta)" feature flag behind a paywall or premium
  toggle.

**Future (Phase 2):**
- Vespera ingest-only path.
- INDI/INDIGO adapter.
- Unistellar partnership integration (read-only).
- Publish `@astravault/alpaca-client` to npm under MIT.

---

RESEARCH COMPLETE — smart-scopes.md written. Recommended bridge architecture: **a
single TypeScript ASCOM Alpaca client (`AlpacaClient` + UDP `AlpacaDiscovery`)
with per-maker adapters layered on top — Seestar (native Alpaca) and Dwarf
(`dwarfii_api` wrapper) ship in v1; Vespera as ingest-only; Unistellar
partnership-only; INDI/INDIGO as Phase 2.** Highest-priority partnership target:
**ZWO Seestar (Sam Wen / Suzhou team) — largest installed base, native Alpaca
already live, and a public-compatibility listing on seestar.com is the single
biggest legitimacy multiplier we can earn in 2026.**
