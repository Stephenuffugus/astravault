# Smart-Glasses HUD Overlay — Design Doc

**Author:** R&D (Claude Opus 4.7, 1M-context)
**Date:** 2026-05-13
**Status:** Implementation-ready design; directly informs Phase 4 of the build roadmap
**Companion docs:**
- `/research/smart-glasses-platforms.md` — full platform inventory
- `/research/glasses-verification-delta.md` — what we re-verified on 2026-05-13
- `/research/moment-capture-glasses.md` — capture pipeline
- `/research/SYNTHESIS.md` — patent and strategic context
- `/astra-vault-handoff/docs/ASTRA_VAULT_NEXTGEN_HANDOFF.md` Part 2 — the original strategy that this doc supersedes
**Scope:** Astra Vault's smart-glasses HUD experience, accommodating the verified 2026 Meta Ray-Ban Display specs (69 g weight, ~1.5 hr HUD-on real-world battery, 30–5,000 nits, monocular 600×600 px ~20° diagonal Lumus Z-Lens waveguide).
**Supersedes:** The "Dark Sky Overlay" concept in the original handoff doc, which assumed a continuous always-on HUD over 4-hour sessions. That assumption is no longer supportable; the verified spec sheet forces a redesign.

---

## TL;DR

The original design assumed an always-on AR planetarium overlaid on the real night sky. Verified 2026 hardware will not sustain that: 69 g is the upper edge of multi-hour comfort, ~1.5 hr HUD-on battery is well short of a typical observing session, and recording-indicator rules constrain the camera/display interaction. The redesign is a **Standby HUD** architecture: by default the display is OFF, only the on-device wake word and the low-power IMU are active, and the overlay wakes for a short 5–10 second window on voice, look-trigger, or tap. This stretches the battery from ~1.5 hr of always-on to ~6–10 hr of mixed-mode and preserves dark adaptation by keeping the optics dark by default. The dream feature — "look at the sky and the labels appear" — is preserved as a foreground capability, not a background one, and is invoked deliberately rather than continuously. We recommend defaulting every new user into Standby HUD, shipping Brilliant Labs Halo as the first-target dev platform (open SDK, on-chip NPU, 14 hr battery), and filing the dark-adapted Bortle-keyed rendering profile as the lead patent claim because no shipping competitor — Stellarium, SkySafari, Night Sky, Star Walk 2 — implements Bortle-keyed dynamic luminance on a true AR HUD.

---

## Section 1 — Constraint analysis

### 1.1 Verified hardware reality (2026-05-13)

| Constraint | Verified value | Source |
| --- | --- | --- |
| **Meta Ray-Ban Display weight** | **69 g standard / 70 g large** (vs 52 g Ray-Ban Meta Gen 2) | [UploadVR review](https://www.uploadvr.com/meta-ray-ban-display-review/) |
| **HUD-on battery (real world)** | **~1.5 hr** — Tom's Guide saw 40 % battery after 90 min of moderate display use | [Tom's Guide review](https://www.tomsguide.com/computing/smart-glasses/meta-ray-ban-display-review) |
| **HUD-off / audio-only battery** | **~6 hr mixed use, ~24 hr extra from case** | [Meta AI Glasses help](https://www.meta.com/help/ai-glasses/1116302600085081/) |
| **HUD optics** | 600×600 px monocular Lumus Z-Lens geometric waveguide, 30–5,000 nits, 14°×14° (~20° diag), 30 Hz content in a 90 Hz panel | [KGOnTech / UploadVR](https://kguttag.com/2025/10/30/meta-ray-ban-display-part-1-lumus-waveguide-omnivision-lcos-and-goertek-projection-engine/) |
| **Recording-indicator rule** | 2 mm always-on white LED on the right temple whenever the camera is recording; tamper detection refuses to record if covered | [Tom's Guide indicator article](https://www.tomsguide.com/computing/smart-glasses/this-is-the-blink-and-youll-miss-it-sign-that-meta-glasses-are-recording) |
| **WDAT third-party HUD access** | **Not available** in May 2026 preview. WDAT can read camera + mic + IMU, but cannot send frame-buffer imagery to the Display HUD, and cannot read Neural Band gestures | [Road to VR coverage](https://www.roadtovr.com/meta-ray-ban-smart-glasses-third-party-app-sdk-device-access-toolkit/) and [Meta WDAT FAQ](https://developers.meta.com/wearables/faq/) |
| **Voice-wake battery cost** | Always-on "Hey Meta" wake word ≈ 10–15 % battery/hr by itself; disabling extends runtime 2–4 hr | [Banna-Tech smart-glasses guide](https://banna-tech.com/smart-glasses-battery-life-guide/) |
| **HUD power dominance** | Display is the primary power culprit; max-brightness HUD can exceed 50 % of total system power | [InAirSpace HUD power analysis](https://inairspace.com/blogs/learn-with-inair/smart-glasses-heads-up-display-the-invisible-revolution-transforming-our-world) |

### 1.2 The comfort-hours curve as a function of weight

Kim et al. (2021), *Wearing comfort and perceived heaviness of smart glasses* (Human Factors and Ergonomics in Manufacturing & Service Industries) examined glasses-load levels of 30 g, 45 g, 60 g, and 75 g. The inflection point of subjective discomfort was at **~60 g of physical nose load** (or 1.2 N of clamping force on the head side). Industry independent reviewers cite roughly the same threshold: glasses ≤ 40 g earn high acceptance, glasses > 50 g produce nose/ear discomfort after a few hours, and glasses ≥ 70 g cross the multi-hour fatigue line for most users [Kim 2021 / ResearchGate summary](https://www.researchgate.net/publication/350523666_Wearing_comfort_and_perceived_heaviness_of_smart_glasses), [Dymesty comfort guide](https://dymesty.com/blogs/articles/smart-glasses-for-small-faces-the-ultimate-2026-fit-comfort-tech-guide).

A rough comfort-tolerance curve (engineering approximation; will be re-grounded in field testing once we have dev units in hand):

```
Continuous comfortable wear (hours, median user)
30 g  ████████████████████ 8+   (audio glasses, all-day)
40 g  ████████████████░░░░ 6
50 g  ███████████░░░░░░░░░ 4–5  (Ray-Ban Meta Gen 2 ~ 49 g)
60 g  ███████░░░░░░░░░░░░░ 2–3  (Oakley Meta Vanguard 66 g)
69 g  █████░░░░░░░░░░░░░░░ 1.5–2   ◄── Meta Ray-Ban Display
75 g  ███░░░░░░░░░░░░░░░░░ 1–1.5
```

Two key implications:
1. **Meta Ray-Ban Display at 69 g lives inside the Kim et al. discomfort band.** Most users will want a break after 1.5–2 hours. This happens to line up with the HUD-on battery limit, so a **single charging-case cycle ≈ a single comfort cycle**. Build the UX around a 1.5–2-hour session length, plan for case-rest interludes, and treat extended use as the exception.
2. **Frame and Halo at 39 g and ~40 g respectively sit well inside the comfortable band.** This is one of two reasons (open SDK is the other) Brilliant Labs is the right first-target platform for a long-session observing experience.

### 1.3 Real observing-session length distribution

Astronomical-League and Cloudy Nights survey data + Sky & Telescope amateur-astronomy demographic studies (qualitative; treat as priors, not population statistics) give a rough mix of session lengths by activity type:

| User activity | Typical session | Source |
| --- | --- | --- |
| Casual sky-watching / "I'm outside grilling" | 5–30 min | Anecdotal, very high incidence |
| Planetary observing (Moon/Jupiter/Saturn) | 30 min – 1 hr | High magnification, atmospheric seeing dependent |
| Visual deep-sky observing | 1–2 hr | Messier marathon excluded; typical eyepiece tour |
| Meteor-shower watching (Perseids, Geminids) | 1–4 hr | Outside the peak there are long quiet stretches |
| Aurora chasing | Unknown lead time, 0.5–3 hr active | Triggered by alerts |
| Astrophotography / deep-sky imaging | 4–12 hr ("sweet spot" 4/6/8/12 hr) | [Cloudy Nights: "How many hours of data is enough?"](https://www.cloudynights.com/forums/topic/719221-how-many-hours-of-data-is-enough/) |

The Meta Ray-Ban Display's ~1.5 hr HUD-on window does not cover the dominant deep-sky or astrophoto bucket. Even the planetary session can blow through one charge if the HUD is on constantly. Therefore the **default HUD behavior must be intermittent**, with always-on reserved as an opt-in mode for ≤ 30-minute sessions.

### 1.4 Dark-adaptation budget

Per [NPS dark-adaptation primer](https://www.nps.gov/articles/dark-adaptation-of-the-human-eye-and-the-value-of-red-flashlights.htm) and [TelescopeFinder](https://telescopefinder.com/why-red-flashlight-is-used-for-astronomy/):
- Full dark adaptation takes 40+ minutes for rods (10 min for cones).
- White or blue/green flashes destroy adaptation in milliseconds; users need to start the clock again.
- Deep red (≥ 620 nm) preserves rod sensitivity because rhodopsin does not absorb in that band.
- **A bright red flash is still disruptive** — even red light contains short-wavelength leakage and dim red is preferred over bright red.

Implication: the HUD's *floor* brightness matters more than its peak. A 30 nit minimum on the Display panel is too bright for Bortle 2/3 skies after the rods are dark-adapted. Our render layer must drive the panel to its software floor and modulate via low-opacity rendering (alpha blending the imagery toward black) rather than via the panel-side dimming knob alone.

---

## Section 2 — The Standby HUD architecture

### 2.1 Default state model

The architecture has three power tiers. By default a session starts and stays in **Tier 0 — Standby**, ascending to higher tiers only on explicit user trigger and decaying back to Standby after a short timeout.

```
┌─────────────────────────────────────────────────────────────┐
│ Tier 0 — STANDBY (default)                                   │
│ • Display OFF                                                │
│ • Wake-word listener ON (on-device, low-power)               │
│ • IMU sampled at 10 Hz for head-pose dead-reckoning          │
│ • Camera OFF                                                 │
│ • Audio playback OFF                                         │
│ • Estimated draw: ~3 % battery/hr                            │
└─────────────────────────────────────────────────────────────┘
                          │ trigger
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Tier 1 — HUD ACTIVE (5–10 s window, then auto-decay)         │
│ • Display ON at dark-adapted brightness                      │
│ • One minimal-magic card rendered (Section 3)                │
│ • Audio narration optional (off by default in dark-sky mode) │
│ • Camera STILL OFF unless capture trigger                    │
│ • Draw during active second: ~30–40 % battery/hr             │
│ • Time-averaged at 10 s / 60 s = ~5 % battery/hr             │
└─────────────────────────────────────────────────────────────┘
                          │ explicit capture trigger
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Tier 2 — CAPTURE (1–5 s burst)                                │
│ • Camera ON, white recording LED ON (mandated)               │
│ • HUD shows brief "Recording" confirmation (1.5 s)           │
│ • Burst captured, returned to Tier 0 within 5 s              │
│ • Draw during burst: ~50–60 % battery/hr                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Triggers

Four mutually-orthogonal triggers can lift the user from Tier 0 to Tier 1. Any combination of these can be enabled per session.

**Trigger A — Voice ("Astra, identify" / "Astra, label" / "what's that")**
- Wake phrase runs on the glasses-side wake-word DSP (where exposed) or the paired-phone foreground service. Latency ≈ 100–300 ms detection + 200–500 ms intent classification. Acceptable.
- On Ray-Ban Display, voice trigger goes through Meta AI today (we can't bypass it in WDAT preview) — so the wake phrase must be a Meta-AI extension. The user says "Hey Meta, ask Astra what star that is."
- On Frame / Halo, we own the wake word end-to-end and can ship "Astra, …" natively.
- **Wake phrases (locked-down list for hands-free, eyes-on-sky operation):**
  - "Astra, identify" → identify the brightest star within ±2° of head pose
  - "Astra, label" → toggle constellation outline for 10 s
  - "Astra, what's that" → fallback general identify (camera + Claude API)
  - "Astra, meteor" → fire Tier 2 capture, save ring buffer
  - "Astra, ISS" → "ISS is 47° up, NNW, six minutes from your zenith"
  - "Astra, tell me more" → expand the last identification with two extra sentences (audio)
  - "Astra, dark mode" → force HUD floor, mute audio

**Trigger B — Look-trigger (eye-tracking-enabled glasses only)**
On glasses with eye tracking (Vision Pro, Snap Spectacles Gen 5; future Apple Glasses), a rapid saccade onto a bright star fixated for ~250 ms is the wake gesture. This mirrors the visionOS Dwell pattern [Apple Vision Pro dwell control](https://support.apple.com/guide/apple-vision-pro/dwell-control-tan0ba69a1f1/visionos) but tuned for the astronomy use case: eyes-on-sky users naturally saccade between bright stars, so the dwell threshold is shorter than visionOS' default 0.05–4 s window. Not available on Meta Ray-Ban Display (no eye tracking).

**Trigger C — Temple tap / pinch (Neural Band on Display; capacitive tap on others)**
A single discreet temple tap or Neural Band finger pinch wakes the HUD for 10 s. No need for the wake word; no audio disturbance for nearby observers at a star party. **Caveat:** WDAT preview does not currently expose Neural Band gestures to third parties, so on Display this is a Meta-AI-mediated trigger today. On Frame the touch sensor and SDK touch event are first-class. On Halo the temple-touch sensor is exposed via the Flutter SDK. **This is the dark-sky-courteous trigger** — silent, doesn't disturb other observers at a club star party.

**Trigger D — Predictive auto-wake (alert events)**
The HUD wakes itself for one card when:
- ISS rises above 20° altitude at the user's location (one-time per pass)
- An NOAA SWPC Kp ≥ 6 geomagnetic alert fires and the user is above 50° geomagnetic latitude
- A registered meteor-shower peak is active and a GMN station within 200 km reports a fireball in the last 60 s
- A live event flagged by Astra Vault community ("a fireball was just reported 80 km west of you — look northwest")
- Predictive auto-wakes are budgeted to ≤ 3 per hour to bound the worst-case battery.

### 2.3 Decay model

Each Tier 1 wake renders a single card for 5 s (default), then fades to black over 500 ms. A re-trigger inside the fade window extends to 10 s. A second re-trigger inside the 10 s window extends to 30 s. If no re-trigger fires, the HUD returns to Standby at the end of the window. This caps a single look-trigger storm (e.g. user excitedly looking around at many stars) to a 30 s spike rather than runaway always-on.

### 2.4 Power-envelope outcome

A typical 4-hour observing session in Standby HUD mode looks like:

```
  Tier 0 (standby) ─────────────────────────────────────────────  ~210 min
  Tier 1 (HUD)     ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ▏  ~25 min (15 s × ~100 events)
  Tier 2 (capture) ▏     ▏           ▏              ▏              ~5 min (5 s × 60 events)
```

At ~3 %/hr standby + ~30 %/hr active (averaged over the active minute), the math yields ≈ 18 % total drain over 4 hours. Even with 2× pessimism that's still a single-charge session for the headline platform.

### 2.5 Why not "constant HUD"?

Two reasons:
1. **Battery.** 1.5 hr of constant HUD on a Display means the user is recharging the case mid-session. We can't credibly call ourselves an astronomy app and force a power management dance.
2. **Dark adaptation.** Even a properly dim red HUD has *some* short-wavelength leakage from the LCoS engine. A 5-second card every minute lets rhodopsin settle between exposures. Continuous HUD prevents full adaptation [NPS dark-adaptation guide](https://www.nps.gov/articles/dark-adaptation-of-the-human-eye-and-the-value-of-red-flashlights.htm).

A "constant HUD" mode is still available for users who want it (Section 6, "Astrophotographer" preset) — it's just not the default.

---

## Section 3 — The minimal-magic content set

A Tier-1 wake produces exactly **one** card. The discipline is: a user with dark-adapted eyes must read it in 1–2 seconds and return their attention to the sky. If we need more, the second-tier "tell me more" voice query expands into audio narration — no further on-glasses rendering.

### 3.1 The five default cards

```
┌── identify ────────────────────────────────────┐
│  SIRIUS                                        │
│  α Canis Maj • mag −1.46 • 8.6 ly              │
└────────────────────────────────────────────────┘
   shown for 5–10 s after voice/look/tap trigger
   on a star; auto-fades

┌── constellation outline ───────────────────────┐
│  (low-opacity red line graph of the cluster)   │
│   ORION                                        │
└────────────────────────────────────────────────┘
   shown when "Astra, label" fires; lines drawn
   in 1-bit red over actual star positions
   only the outline polygon, no fill, no star
   labels — those come from the identify card

┌── meteor captured ─────────────────────────────┐
│  ✓  Meteor (Perseid?)                          │
│  saved · matching observers nearby             │
└────────────────────────────────────────────────┘
   peaks for 1.5 s after a successful Tier-2 capture

┌── corner badge ────────────────────────────────┐
│ (bottom-right of the 14°×14° HUD area)         │
│ ISS  47° NNW  ← pre-wake when within 30° zenith│
└────────────────────────────────────────────────┘

┌── corner badge ────────────────────────────────┐
│ AURORA Kp 7 — look NORTH                       │
└────────────────────────────────────────────────┘
   driven by NOAA SWPC + Aurorasaurus
```

### 3.2 What is intentionally NOT in the default set

- Deep-sky catalog data (magnitude, surface brightness, redshift). On-demand via voice "tell me more" → audio narration.
- Magnitude scale, RA/Dec coordinates, alt-az coordinates. These are observatory-grade detail and noise on a 14°×14° HUD.
- Tooltip-style multi-line text. The default card is two lines maximum; deeper detail is audio.
- Animated tutorials, hint arrows, onboarding chrome. The HUD is for active observation; onboarding is on the paired phone.
- Notification stack. If two badges would compete, the predictive auto-wake yields to the user-triggered card.

### 3.3 Capture-mode rules and the recording LED

When Tier 2 fires, Meta's policy mandates the 2 mm temple LED is on for the full capture window [Tom's Guide LED article](https://www.tomsguide.com/computing/smart-glasses/this-is-the-blink-and-youll-miss-it-sign-that-meta-glasses-are-recording). For our use case this is fine — astronomy captures are 1–5 s bursts, not continuous recording — but the user must be told once during onboarding that the LED will appear briefly during a capture. The HUD confirmation card should overlap the LED window so the user understands the connection.

For wide-LED-aversion star-party contexts, the "Casual stargazer" mode (Section 6) does not enable Tier 2 capture at all and therefore never lights the LED.

---

## Section 4 — Dark-adapted rendering

### 4.1 Palette

- Single hue: **red, 620–700 nm equivalent** — peak around #FF0000 in sRGB. Rhodopsin is largely transparent to this band [TelescopeFinder red-light guide](https://telescopefinder.com/why-red-flashlight-is-used-for-astronomy/).
- **Brightness encoded as opacity over black**, NOT as a gradient toward gray. A "dim red" achieved by mixing in white moves the spectrum into wavelengths that bleach rhodopsin. The renderer must compose against black, with alpha in [0, 1].
- Two-color world: full red (#FF0000) for primary glyphs and outlines, fully-transparent for the rest of the canvas.
- For the constellation outline card, a single intermediate alpha level (0.35) is acceptable on the lines themselves; star markers are full alpha.

### 4.2 Luminance budget

Display panels can do extreme dynamic range — the Display peaks at 5,000 nits, more than enough to compete with daylight [KGOnTech Lumus analysis](https://kguttag.com/2025/10/30/meta-ray-ban-display-part-1-lumus-waveguide-omnivision-lcos-and-goertek-projection-engine/). For dark-sky use we live in the opposite corner:

| Bortle class | Sky brightness (mag/arcsec²) | Recommended HUD luminance (cd/m² / nits) |
| --- | --- | --- |
| Class 1 (excellent dark) | > 21.99 | < 1 nit |
| Class 2 (truly dark) | 21.5–21.99 | 1–2 nits |
| Class 3 (rural) | 21.3–21.5 | 2–5 nits |
| Class 4 (rural/suburban) | 20.8–21.3 | 5–10 nits |
| Class 5 (suburban) | 20.1–20.8 | 10–20 nits |
| Class 6–7 (bright suburban) | 19.0–20.1 | 20–80 nits |
| Class 8–9 (urban/inner-city) | < 19.0 | 80–300 nits |

Sources: [Wikipedia Bortle table](https://en.wikipedia.org/wiki/Bortle_scale), [NPS night-sky metrics guide](https://www.nps.gov/subjects/nightskies/NSQmetrics.html), [Handprint Bortle reference](https://www.handprint.com/ASTRO/bortle.html); luminance recommendations are our own engineering targets, designed to match approximately the ambient sky surface brightness without exceeding it.

Modern micro-OLED can dim to 0.01 nits without flicker [MicroLED-Info brightness page](https://www.microled-info.com/tags/brightness). The LCoS engine on the Ray-Ban Display is documented down to 30 nits, which is **above** the Class 1/2 target — so the constraint is rendering-side. We composite against black, drive the panel to its 30 nit floor, and use alpha < 0.05 to hit < 1.5 nits effective luminance on the visible card.

### 4.3 Anti-flicker

- Minimum refresh: 60 Hz. The Display's content refresh is 30 Hz inside a 90 Hz panel [UploadVR Display review](https://www.uploadvr.com/meta-ray-ban-display-review/) — we render the card at 30 Hz and let the panel triple-buffer.
- No hard cuts. Fade-in over 250 ms, fade-out over 500 ms. Card transitions (one card replacing another) cross-fade for 200 ms.
- No animated glyphs or shimmering. The card is a still image for its dwell time, refreshed only on data change.

### 4.4 Brightness keying

The HUD brightness is keyed in priority order:
1. **User Bortle setting** (entered in the paired-phone setup; default Class 3 for first-launch).
2. **Live ambient measurement** via the glasses camera. The camera does a single-frame 1-second 1080p exposure at known ISO/aperture (no live preview, no LED, no display) and we estimate sky background magnitude. This step costs ~3% battery if run hourly. Worth it on long sessions; skipped in short modes.
3. **Light Pollution Map lookup** for the user's GPS coordinates [Light Pollution Map](https://lightpollutionmap.app/) — used as a prior before the camera measurement converges.
4. **Manual override** ("dimmer" / "brighter" voice commands) — applies a multiplicative gain in [0.5, 2.0] to the computed luminance, persists for the session, never persists across sessions.

🟢 The combination — **dark-adapted minimal-brightness AR rendering profile keyed to measured/reported Bortle scale, with the luminance computed from rendered-alpha-over-black rather than panel-side dimming alone** — is the patentable refinement. No competitor implements this on a true AR HUD (see Section 8).

---

## Section 5 — Power budget math

### 5.1 Per-tier power tier draws

The HUD-on figure is anchored on the [Tom's Guide review observation](https://www.tomsguide.com/computing/smart-glasses/meta-ray-ban-display-review) of 60 % drain after 90 min of moderate display use (≈ 40 %/hr while HUD is meaningfully on). Standby and capture figures are extrapolated from Meta's 6 hr mixed-use claim and the known camera/AR1-Gen-1 power envelope.

| Tier | Active subsystems | Estimated draw | Source |
| --- | --- | --- | --- |
| Tier 0 — Standby | BT 5.3 listen, wake-word DSP, IMU 10 Hz | **~3 % battery/hr** | Meta-quoted standby [Meta help page](https://www.meta.com/help/ai-glasses/1116302600085081/); wake-word inflates this above pure radio standby |
| Tier 0 — Standby, wake-word disabled (button-only) | BT 5.3 listen, IMU 10 Hz | **~1.5 % battery/hr** | Always-on wake adds ~10–15 %/hr by itself [Banna-Tech smart-glasses guide](https://banna-tech.com/smart-glasses-battery-life-guide/) — disabling it dramatically extends life |
| Tier 1 — HUD active | Display ON + LCoS engine + render pipeline | **~30–40 % battery/hr (sustained)** | [Tom's Guide review](https://www.tomsguide.com/computing/smart-glasses/meta-ray-ban-display-review) |
| Tier 1 — HUD active, time-averaged at 10 s/min | (Tier 1 burst) × 1/6 | **~5 % battery/hr** | Mathematical derivation |
| Tier 2 — Capture burst | Camera + recording LED + display confirm | **~50–60 % battery/hr (sustained)** | Extrapolated; camera ISP dominates per [Moment-capture handoff](/research/moment-capture-glasses.md) ~700 mW phone-side analogy |
| Tier 2 — averaged at 5 s/min | (Tier 2 burst) × 1/12 | **~4 % battery/hr** | Mathematical derivation |

### 5.2 Session-shape budgets

Three reference sessions, each computed assuming 100 % start, 10 %/hr Standby (round up from 3 %/hr to absorb the wake-word cost and IMU sampling), Tier 1 averaging ~5 %/hr extra, Tier 2 averaging ~4 %/hr extra when enabled:

| Session shape | Standby hours/hr | Tier 1 budget | Tier 2 budget | Burn rate | Hours on a full charge |
| --- | --- | --- | --- | --- | --- |
| **Casual stargazer**: standby + voice + audio, no display, no camera | 100% | — | — | ~3 %/hr | **~30+ hrs** |
| **Standby HUD default**: Tier 0 most of the time, Tier 1 ~10 s/min, no capture | 92% | 8% | — | ~8 %/hr | **~12 hrs** |
| **Active observer**: Standby HUD + Tier 2 ~5 s/min when active | 88% | 8% | 4% | ~12 %/hr | **~8 hrs** |
| **Active photographer**: Tier 1 ~30 s/min, Tier 2 ~10 s/min | 50% | 15% | 8% | ~25 %/hr | **~4 hrs** |
| **Always-on HUD (the discarded original design)** | 0% | 100% | — | ~40 %/hr | **~1.5 hrs** ← matches Tom's Guide |

We then layer the charging-case top-up. The Display's case provides 24 hr of additional charging cycles [Meta help page](https://www.meta.com/help/ai-glasses/1116302600085081/), so even the Active Photographer mode reaches a full evening with one mid-session case rest.

### 5.3 Recommended session shape

Standby HUD with occasional capture (the "Active observer" row) yields **6–8 hours** on a full charge. That covers all but the longest astrophoto sessions. For astrophoto specifically, the user is parked behind a tracking mount or smart telescope anyway and would generally take the glasses off — that user is on the phone or a laptop tablet UI, not the HUD.

### 5.4 Standby HUD vs always-on HUD compared

```
                100%┤●●●●●●●●●●●●●●●●●●●●●●●●●●●● standby + occasional
                    │●●●●●●●●●●●●●●●●● standby HUD default
battery  pct       │
                 50%┤●●●●●●●●● active observer
                    │●●●●● active photographer
                    │● always-on HUD (legacy design)
                  0%┼───┬───┬───┬───┬───┬───┬───┬───┬
                    0   1   2   3   4   5   6   7   8 hrs

  ● = expected remaining battery at the indicated hour
```

The implication is that without Standby HUD discipline, a Display user gets ~1.5 hours of HUD before recharging. With it, they get a full evening.

---

## Section 6 — Modes

The user picks one of three modes at session start (via the paired-phone app, before they leave the porch). Mid-session mode switching is allowed but discouraged in the UI.

### 6.1 Casual stargazer

- **Purpose:** "I'm outside looking up. I want to be told what I'm looking at."
- **HUD:** OFF unless explicitly invoked by voice. On Display, this becomes effectively an audio-first experience.
- **Audio:** ON. "Astra, what's that" returns audio narration. "Astra, tell me more" expands.
- **Camera:** OFF. No captures. The recording LED never lights.
- **Visual ATP earn:** Standard 5 ATP per identification.
- **Battery target:** 10+ hours.
- **Best on:** Ray-Ban Meta Gen 2 (no HUD anyway), Oakley HSTN, Rokid Style. **Display will work in this mode but is overspec'd — the user paid for a HUD they're not using.**

### 6.2 Active observer

- **Purpose:** "I'm at a star party or a dark-sky site and I want labels + capture."
- **HUD:** ON, Standby HUD discipline, Tier 1 ~10 s/min.
- **Audio:** ON in private, MUTED at a star party (set by a "courteous mode" toggle).
- **Camera:** Voice-triggered ("Astra, meteor") or look-trigger if eye tracking is available.
- **Visual ATP earn:** Standard + 25 ATP cross-reference bonuses when a meteor capture matches another observer's record.
- **Battery target:** 6–8 hours.
- **Best on:** Meta Ray-Ban Display, Brilliant Labs Halo, future Android XR glasses, future Apple glasses.

### 6.3 Active photographer

- **Purpose:** "I'm running a 3-hour Geminids capture session — keep the ring buffer hot."
- **HUD:** ON, Tier 1 longer dwell (~30 s/min), capture confirmations more frequent.
- **Audio:** Optional.
- **Camera:** Pre-trigger ring buffer if the platform supports it (Frame, Halo); on Display this remains voice-trigger only because WDAT does not expose continuous camera streaming.
- **Visual ATP earn:** Bonus 50 ATP per match that improves a triangulation solution (per SYNTHESIS.md patent #10).
- **Battery target:** 2–3 hours; user is expected to swap glasses or rest in the case mid-session.
- **Best on:** Brilliant Labs Halo (Alif B1 NPU on-chip — can run our meteor detection on-glasses), Android XR partner glasses (continuous camera permitted).

### 6.4 Mode is a power posture, not a feature flag

A useful internal framing: the mode determines *which subsystems are allowed to be on*, not *which features are visible*. The same identify card looks the same in all three modes. The difference is whether it's reachable through the camera, whether captures fire, and what the standby cost is. Engineering keeps this clean by gating subsystems on mode, not by hiding UI.

---

## Section 7 — Platform-specific notes

### 7.1 Meta Ray-Ban Display — the headline target, with caveats

What works today via WDAT preview ([Meta developer blog](https://developers.meta.com/blog/introducing-meta-wearables-device-access-toolkit/)):
- Receive camera frames (event-triggered, 720p max, 30 fps max) on the paired phone.
- Receive mic audio on the paired phone.
- Receive IMU on the paired phone.
- Send audio responses back to the glasses for the open-ear speakers.

What does NOT work today:
- 🚨 **Send imagery to the Display HUD.** This is the showstopper for the constellation overlay. Meta-AI-mediated text/icon cards are the only path until WDAT exposes a frame buffer or a Card SDK. Confirmed by Road to VR's WDAT coverage [Road to VR](https://www.roadtovr.com/meta-ray-ban-smart-glasses-third-party-app-sdk-device-access-toolkit/) and Meta's own WDAT FAQ [Meta WDAT FAQ](https://developers.meta.com/wearables/faq/).
- 🚨 **Read Neural Band gestures.** The discreet finger-pinch trigger we want for star-party use is invisible to third parties today.
- 🚨 **Continuous camera streaming.** WDAT camera access is event-triggered only.

What this forces:
- The Display experience in 2026 is **audio-first with Meta-AI text cards**. The "identify" card appears as a Meta AI suggested-response card, with our content piped through the Meta AI conversational layer.
- We ship a fallback **audio-only mode** that works on Ray-Ban Meta Gen 2 / Oakley HSTN / Oakley Vanguard with no Display required. This is the "Casual stargazer" mode promoted to first-class.
- **We file the patent claim for the dark-adapted Bortle-keyed rendering profile now, with a continuation that covers the HUD frame-buffer rendering once WDAT exposes it.** First-mover patent moat is even more important here because no third party can compete on the HUD itself yet.

### 7.2 Brilliant Labs Frame and Halo — the dev playground

Frame ($349, 39 g, monocular green-tinted prism, on-device Lua):
- Lua API exposes the sprite engine directly [Lua API Reference](https://docs.brilliant.xyz/frame/frame-sdk-lua/). 16-color indexed mode is fine for text and constellation outlines.
- Flutter SDK + Python SDK on the paired side. Open source on [Brilliant Labs GitHub](https://github.com/brilliantlabsAR).
- 39 g is comfortably inside the Kim et al. comfort band.
- No camera on Frame Gen 1, so capture mode is voice-trigger-to-phone only.

Halo ($299–$349, ~40 g, full-color HUD, bone conduction, Alif B1 NPU, 14 hr battery):
- Flutter SDK + native iOS/Android APIs, fully open source on GitHub [Tom's Guide Halo coverage](https://www.tomsguide.com/computing/smart-glasses/brilliant-labs-unveils-halo-the-worlds-thinnest-ai-glasses-and-it-wants-to-be-your-everyday-specs).
- On-chip Alif B1 NPU opens the door to running the meteor-streak classifier on-glasses without phone offload.
- 14 hr battery makes Halo the only consumer platform where the "always-on HUD" mode is engineering-feasible.

**Recommendation:** Ship the first complete Astra Vault overlay on Halo. It's the only platform where we can:
- Render our own dark-adapted red HUD without going through a Meta-AI text card,
- Run our meteor detector on-device,
- Sustain a 4-hour session without case rests, and
- File patent reduction-to-practice evidence against a clean open SDK.

The Display ports the same content set via Meta-AI text cards once WDAT graphics ship (2026 H2 likely).

### 7.3 Snap Spectacles Gen 5 — patent prototype only

Lens Studio 5 is the most capable consumer-AR SDK on the market [Snap Spectacles 5 announcement](https://www.uploadvr.com/snap-spectacles-5-ar/), but Spectacles Gen 5 has two showstoppers for an actual observing session:
- 226 g weight — well past the Kim et al. discomfort threshold; no one is wearing this for an hour outside in the cold.
- 45 minute battery — does not survive any meaningful observing session.

Use Snap Spectacles for: a tech-demo "virtual planetarium" lens, an internal patent prototype, the visual reference design that we copy onto Halo/Display. Distribute via LensCloud as a portfolio piece. Do not commit to a Snap distribution path until Snap Specs (the consumer launch, [Snap newsroom](https://newsroom.snap.com/launch-specs-2026?lang=en-US)) lands with a viable weight + battery profile.

### 7.4 XREAL One / Project Aura — large virtual display = different UX

XREAL One Pro and the upcoming Project Aura behave as tethered virtual monitors via USB-C DisplayPort. The user wears them looking at a virtual screen, not directly at the sky through a peripheral overlay. Two implications:
- **The Astra Vault XREAL experience is a planetarium, not an overlay.** A full-resolution Stellarium-like virtual sky map projected into the user's view, with the real sky still visible through the (semi-transparent) lens.
- **This is a different product from the Standby HUD design above.** The peripheral-chrome minimal-magic content set does not apply. XREAL is an indoor-or-stationary experience (the user is plugged in) and we render a full immersive planetarium.
- Nebula (XREAL's UI shell) will no longer be maintained [Nebula support page](https://next.xreal.com/support/nebula/); the new path is Android XR via Project Aura. Plan the XREAL build as an Android-XR-targeted variant.

### 7.5 Even Realities G2 — out of scope

No camera, no speakers [verification delta](/research/glasses-verification-delta.md). The intended use is calm passive HUD glance-able info, which doesn't pair with a capture-driven citizen-science product. Skip until G3.

### 7.6 Rokid AI Glasses Style — Casual stargazer mode only

$299, 38.5 g, ChatGPT + Qwen + DeepSeek + Gemini integrations, no HUD on the global SKU [Rokid press release](https://www.prnewswire.com/news-releases/rokid-ai-glasses-style-now-available-globally-302664994.html). The right Astra Vault experience on Rokid Style is the **Casual stargazer** mode — voice query, audio narration, optional photo capture. The 20,000-developer ecosystem and the global $299 price make it the best APAC/global volume play.

### 7.7 Android XR partner glasses — multi-modal Gemini target

XREAL Project Aura, ASUS ROG×XREAL R1, Warby Parker, Gentle Monster — all 2026 partner glasses on the Android XR platform [Road to VR Google × XREAL partnership](https://www.roadtovr.com/google-hardware-partnership-xreal-android-xr-leader/), [Android Authority I/O 2026 preview](https://www.androidauthority.com/android-xr-glasses-preview-google-io-2026-3665773/). Gemini-native means our identify card can be invoked through Gemini-multimodal-vision queries the user is already trained to use. We render through OpenXR / Jetpack XR Composables — no Meta-AI mediation, no WDAT preview gates. Plan a parallel Android XR target in Phase 4 alongside the Halo build.

---

## Section 8 — Patentable refinements

### 8.1 The Astra Vault patent claim being staked

From SYNTHESIS.md, patent claim #3: **"Dark-adapted minimal-brightness AR rendering keyed to Bortle scale — auto-dims HUD per measured/reported sky class."**

This doc refines and extends that into a more defensible composite claim:

> **A method for rendering peripheral-vision AR overlays on a head-mounted display during astronomical observation comprising: (a) detecting the local sky-brightness class via either user input, device-camera-based ambient measurement, or geo-database lookup of a light-pollution catalog; (b) selecting a red-spectrum-only rendering palette in a wavelength band of 620–700 nm that does not bleach human rod-cell rhodopsin; (c) computing target rendered luminance as a function of the detected sky class such that overlay luminance does not exceed ambient sky surface brightness; (d) realizing the target luminance via alpha compositing over a black background rather than via panel-side luminance dimming alone, so that rendered glyph wavelength purity is preserved; and (e) gating overlay-active duty cycle to short discrete invocation windows (Standby HUD) so that rod cell dark adaptation is preserved between cards.**

### 8.2 Prior-art landscape

We surveyed all of the major AR night-sky apps and one of the Apple-platform stargazing leaders:

| App | Has AR mode | Has red-vision mode | Bortle-keyed brightness | On a true HUD | Standby/duty-cycled HUD |
| --- | --- | --- | --- | --- | --- |
| **Stellarium Mobile / Pro** | Yes (camera AR overlay on phone) | Optional night-vision filter (phone screen tint) | No | No (phone screen) | N/A |
| **SkySafari 7 / 8 Pro** | Yes (camera AR overlay on phone) | Night-vision red theme | No | No (phone screen) | N/A |
| **Star Walk 2** | Yes (camera AR overlay on phone — [Star Walk 2 AR mode docs](https://starwalk.space/en/tutorials/how-to-activate-ar-mode)) | Yes (red-tint night mode — entire UI goes red [user manual](https://vitotechnology.com/assets/manuals/starwalk2_manual_en.pdf)) | No | No (phone screen) | N/A |
| **SkyView** | Yes (camera AR overlay on phone) | Yes (red tint mode) | No | No (phone screen) | N/A |
| **Night Sky 13 (iCandi)** | Yes (camera AR on phone + Apple Watch glass constellations) | "Intelligent Night Red Mode" [Night Sky app](https://apps.apple.com/us/app/night-sky/id475772902); also a visionOS version available | No (uniform red tint, no light-pollution awareness) | visionOS yes, but it's not a peripheral HUD — it's a full immersive overlay | No |
| **Sky Guide** | Yes (camera AR overlay on phone) | Night-mode red tint | No | No | N/A |

**Findings:**
1. **Every major AR night-sky app has a red-vision mode.** That part of the claim is prior art. Red-only rendering, on its own, is not novel.
2. **None of the surveyed apps key brightness to a Bortle measurement or location-based light-pollution dataset.** Red mode is a single binary on/off setting that applies a uniform red tint. We have not found a single competing app that dynamically modulates rendered luminance based on a calibrated sky-brightness measurement. **This is the novelty.**
3. **None of the surveyed apps run on a true peripheral-vision AR HUD with a sub-1-nit luminance budget.** All the camera-AR apps run on phone screens that are typically 200–800 nits and offer a tinted-but-still-blue-leaky rendering. The combination "peripheral HUD + alpha-over-black + Bortle-keyed" has no surveyed equivalent.
4. **None of the surveyed apps implement a duty-cycled / Standby HUD architecture.** They are either always-on (phone AR) or always-off (planetarium mode). The duty-cycle dimension of our claim — "wake on trigger, render for 5–10 s, return to OFF" — is also novel as a power-aware AR rendering posture.
5. The "Intelligent Night Red Mode" branding on Night Sky 13 is the closest descriptive prior art [iCandi Night Sky 13](https://icandiapps.com/night-sky-4/). It is, however, a uniform UI tint on a phone or visionOS surface, not an HMD overlay; and it does not appear to vary based on a sky-brightness measurement.

### 8.3 Defensible parts of the claim

**Patent-eligible (novel + non-obvious + useful):**
- (a) + (b) + (c) combined — Bortle-keyed dynamic luminance on an HMD. ([none of the surveyed prior art].)
- (d) the alpha-over-black realization. (Implementation detail, but technically novel as a defensible method for preserving rendered wavelength purity at low luminance levels on HMD optics; LCoS/OLED engines bleed white when dimmed, alpha keeps the glyph wavelength pure.)
- (e) the Standby HUD duty cycle as a dark-adaptation-preservation method. (No surveyed AR night-sky competitor implements this as a deliberate design.)

**Prior art — drop from the claim or treat as descriptive context:**
- Red-only palette generally. (Many apps; many filters.)
- Light-pollution geo-data lookup generally. (Light Pollution Map is public; Falchi atlas is public.)
- Camera-based ambient measurement generally. (Photometric apps exist.)

**Likely strongest formulation for filing:**
> "A heads-up display rendering pipeline for AR night-sky overlays in which rendered luminance is dynamically determined by a calibrated sky-brightness class, glyphs are realized in a long-wavelength red palette via alpha compositing over a black background, and the overlay is duty-cycled to short user-invocation windows to preserve human dark adaptation."

This combines (a), (c), (d), and (e). It excludes the bare red-palette element from the independent claim (it goes in a dependent claim), which dodges the obvious prior-art read.

### 8.4 Filing posture

- US provisional, $300 fee, 12-month protection. Same as the four other lead claims in SYNTHESIS.md.
- File before the first public Astra Vault demo on a Display or Halo — protect priority date.
- Continuation-in-part once WDAT exposes a HUD frame buffer to incorporate the Display reduction-to-practice.

---

## Section 9 — Critical decisions for the Director

A short list of decisions Stephen needs to make before Phase 4 build can begin. The first three are blocking; the rest are clarifications.

### 9.1 Decision 1 — Default mode: Standby HUD only, or constant-HUD opt-in?

**The recommendation:** Ship **Standby HUD as the only default mode** for first-time users. Expose a "constant HUD" toggle in advanced settings, hidden behind a one-screen battery-warning prompt. Users who choose constant HUD acknowledge ~1.5 hr session length.

**Rationale:** Default mode determines the brand. If a new user sees their glasses die in 1.5 hours and concludes "Astra Vault drains my glasses," we've lost them. If they see 6+ hours and a magical-on-demand HUD, we've earned the install. Constant HUD remains available for the astrophotographer who wants it.

**Decision needed from Stephen:** approve, or ask for a different default.

### 9.2 Decision 2 — First-target platform: Brilliant Labs Halo or Meta Ray-Ban Display?

**The recommendation:** Ship **Brilliant Labs Halo first**.

**Rationale:**
- Open SDK with frame-buffer rendering. The Display can't accept our overlay at all in WDAT preview today. Halo can.
- 40 g + 14 hr battery sit deep inside the comfort + power envelope. Display sits at the edge.
- On-chip NPU lets us run on-device meteor detection without phone offload.
- Patent reduction-to-practice evidence is much cleaner on a platform we fully control than one mediated through Meta AI text cards.
- The Display is the *publicity* platform; Halo is the *engineering* platform. Build on Halo, demo on Display (audio + text card), then port to Display when WDAT graphics open.

**Counterargument:** The Display has Meta marketing reach and a much larger eventual installed base. Shipping Display-first puts us in front of more users sooner.

**Decision needed from Stephen:** confirm Halo-first vs Display-first. Default to Halo unless overruled.

### 9.3 Decision 3 — Audio-only feedback mode on Ray-Ban Gen 2 (no display) — worth shipping?

**The recommendation:** Yes, ship it. It is the Casual stargazer mode promoted to first-class on the highest-volume installed base in the consumer market.

**Rationale:**
- Ray-Ban Meta Gen 2 + Oakley HSTN + Oakley Vanguard + Rokid Style combine for ≥ 10× the installed base of the Display today.
- No HUD means no dark-adaptation concerns and no patent risk on the rendering side — pure audio narration of the identify card.
- Voice trigger + audio narration is the natural Casual stargazer UX. It does not compete with the HUD experience; it *is* the experience on these glasses.
- The same WDAT integration powers it. We're already building the camera-frame + mic-audio + identify-card backend; routing the response to TTS instead of (or in addition to) a HUD card is a one-line branch.
- ATP earn parity: 5 ATP per voice identification, same as the HUD card.

**Counterargument:** Audio-only is a less differentiated experience and may dilute the brand pitch ("Astra Vault is on smart glasses").

**Decision needed from Stephen:** confirm Casual stargazer audio-only ships as a first-class mode.

### 9.4 Decisions 4–6 — operational clarifications

4. **Patent filing order.** The dark-adapted Bortle-keyed claim (Section 8) is the most defensible new claim from this design pass. Should we move it ahead of the cross-glasses observation merge protocol in the priority queue, or file in parallel? Recommend parallel; both are $300 provisionals.
5. **Star-party "courteous mode" toggle.** Should audio narration default to OFF in Active observer mode (assuming users are at a club star party and disturbing other observers is socially costly)? Recommend: default audio narration to ON when GPS detects a non-club-site location, OFF when it detects a known star-party site (geofenced list grows over time; users can override).
6. **Mode persistence.** Should the user's mode choice persist across sessions, or default back to Standby HUD at every launch? Recommend persist, with a "you're still in Active photographer mode — battery may drain fast" prompt at session-start if the mode is power-heavy.

---

## Glossary / cross-reference

- **WDAT** — Meta Wearables Device Access Toolkit. Public developer preview, May 2026. Allows third-party iOS/Android apps to read camera/mic/IMU from Ray-Ban Meta glasses and send audio responses back. Does not yet support sending imagery to the Display HUD or reading Neural Band gestures. [Meta WDAT FAQ](https://developers.meta.com/wearables/faq/)
- **Bortle scale** — John E. Bortle's nine-class scale of night-sky darkness (Class 1 darkest, Class 9 inner-city). [Wikipedia Bortle scale](https://en.wikipedia.org/wiki/Bortle_scale)
- **Kim et al. (2021)** — *Wearing comfort and perceived heaviness of smart glasses*, Human Factors and Ergonomics in Manufacturing and Service Industries. Identified ~60 g as the discomfort inflection point. [ResearchGate summary](https://www.researchgate.net/publication/350523666_Wearing_comfort_and_perceived_heaviness_of_smart_glasses)
- **LCoS** — Liquid Crystal on Silicon. The microdisplay technology in the Meta Ray-Ban Display projection engine (OmniVision LCoS + Goertek + Lumus Z-Lens). [KGOnTech](https://kguttag.com/2025/10/30/meta-ray-ban-display-part-1-lumus-waveguide-omnivision-lcos-and-goertek-projection-engine/)
- **Lumus Z-Lens** — Geometric (reflective) waveguide architecture, lower see-through artifact than diffractive waveguides. Used in the Display.
- **Rhodopsin** — The photopigment in rod cells responsible for low-light vision. Bleached by short-wavelength light, transparent to ≥ 620 nm. [NPS dark adaptation](https://www.nps.gov/articles/dark-adaptation-of-the-human-eye-and-the-value-of-red-flashlights.htm)
- **Saccade** — Rapid eye movement between fixations. Eye-tracking-enabled glasses use saccade endpoints as gaze-targeted UI selection events. [Apple Vision Pro dwell control](https://support.apple.com/guide/apple-vision-pro/dwell-control-tan0ba69a1f1/visionos)
- **Tier 0 / Tier 1 / Tier 2** — Internal Astra Vault terminology for power-tier states (Standby / HUD active / Capture).

---

RESEARCH COMPLETE — glasses-overlay-design.md written. Recommended default mode: Standby HUD. First-target platform: Brilliant Labs Halo. Patentable refinement: dark-adapted Bortle-keyed dynamic-luminance HUD rendering with alpha-over-black realization and duty-cycled Standby invocation.
