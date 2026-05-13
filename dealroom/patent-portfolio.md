# Patent Portfolio — Astra Vault / SWS

Reference document for any acquirer / licensee / patent counsel due-diligence. Cross-reference with `research/patent-prior-art-review.md` for the full prior-art search.

## Status table

| # | Title | Status | Action |
|---|---|---|---|
| 0 | **SWS Proof of Attention Protocol** | ✅ **Issued** | Maintain. Sole inventor: Stephen Furpahs. Owned by LLC. |
| 1 | Cross-glasses observation merge protocol | 🟢 Provisional draft ready | File within 30 days (priority date critical) |
| 4 | On-device astrometric plate-solve gating ATP earn | 🟢 Provisional draft ready | File within 30 days |
| 5 | Crowdsourced metadata → triangulation → 3DGS pipeline | 🟢 Provisional draft ready | File within 30 days |
| 2+3 | Attention-hash bound to AR camera dwell + Bortle-keyed luminance | 🟡 Narrowed; file Phase 2 | File within 90 days after #1/#4/#5 |
| 8 | Anonymous celestial-coordinate-binned presence | 🟡 Narrow then file | Phase 2 |
| 6 | Cultural-variant constellation art | 🔴 **Dropped** | Stellarium prior art + reputational risk. Pursue via iwi partnership + trademark instead. |
| 9 | CC BY 4.0 aggregate dataset | 🔴 **Dropped** | Licensing, not invention. |
| 11 | Sponsored RMS station program | 🔴 **Dropped** | Grant program, not patent material. |
| 7 | Vision Pro eye-tracking → attention-hash gaze | ⏸️ Defer | Apple privacy posture blocks reduction-to-practice. Revisit in 2027. |
| 10 | Attention-hash bound to confirmed multi-station cross-ref bonus | 🔗 Rolled into #1 dependent claim | No standalone filing. |

## The portfolio shape: floor + ceiling

The architecture of the portfolio is intentional and load-bearing:

```
            APPLICATION PATENTS (the ceiling)
   ┌──────────────────────────────────────────────┐
   │  #1 Cross-glasses observation merge          │
   │  #4 Plate-solve gating ATP                   │
   │  #5 3DGS reconstruction pipeline             │
   │  (Phase 2: narrowed #2+#3, #8)               │
   └──────────────────────────────────────────────┘
                       ▲
                       │ specific applications
                       │ of the underlying
                       │ attention-economy mechanic
                       │
   ┌──────────────────────────────────────────────┐
   │  #0 SWS Proof of Attention Protocol          │
   │     (issued — the floor)                     │
   └──────────────────────────────────────────────┘
```

**Why this matters for a buyer:** the floor patent is the platform mechanic — useful across many verticals (fitness, reading, music, gaming, social). The ceiling patents are specific Astra Vault applications — useful only in astronomy / AR. **A buyer can acquire the ceiling without the floor**, leaving Stephen with a continuing licensing business on the underlying protocol across non-astronomy verticals.

This is the structural retention path. (See `retention-scenarios.md`.)

## Patent #0 (issued) — the floor

**Title:** SWS Proof of Attention Protocol *(actual title and patent number from issued grant — Stephen fills in)*

**Claims summary:** A method for generating cryptographic proofs of human attention via:
1. Construction of a 9-field attention payload (event_type, timestamp, session_id, duration_ms, interaction_count, quality_tier, game_id, user_uid, nonce)
2. Alphabetic-key serialization
3. SHA-256 hashing
4. Quality-tier weighted scoring (deep / active / passive / background)
5. Cross-application vault storage with portability across game instances
6. Inflation control via per-source daily caps + spend-sink balance requirement

*Stephen — please paste the actual issued claim language here for due-diligence purposes.*

## Patent #1 (provisional draft) — cross-glasses observation merge

**Field of invention:** Methods and systems for combining multi-observer wearable-camera captures of transient celestial events into a single triangulated event record.

**Claim 1 summary (sketch — final language in `research/patent-abstract-cross-glasses-merge.md`):**

A method comprising:
- Receiving, from a plurality of independent observer devices (smart glasses or phones), capture records of a transient celestial event
- Each capture record comprising: a GNSS-derived UTC timestamp, an observer geolocation, an observer pose (bearing + elevation + uncertainty), an observer-device fingerprint, and at least one camera frame
- Identifying co-temporal capture records (within a configurable time tolerance)
- Computing a triangulated trajectory from the co-temporal capture records via plane-intersection (Borovicka / Ceplecha / Vida methods)
- Returning, to each contributing observer device, an enriched cross-reference record comprising: the triangulated trajectory, the IAU shower designation (if applicable), the parent body (if known), and the count of other observers who captured the same event
- Wherein the enriched record optionally triggers a token-economy bonus event redeemable in a cryptographic vault (relates to issued patent #0)

**Closest prior art (no anticipation):** CAMS network (NASA/SETI) uses fixed all-sky cameras; FRIPON uses fixed ground stations; the integration of consumer-grade phone+glasses captures into a single triangulation method has no prior art across USPTO, Google Patents, EPO, or arXiv searches.

**FTO blocker:** None identified.

## Patent #4 (provisional draft) — plate-solve gating ATP

**Field of invention:** Anti-cheat verification methods for attention-economy token systems wherein attention events tied to physical observation are validated against celestial-coordinate ground truth before token issuance.

**Claim 1 summary:**

A method comprising:
- Receiving, at a user device, a request to generate an attention event of type "celestial-observation"
- Capturing one or more camera frames from the user device's image sensor
- Performing on-device astrometric plate-solving (star-pattern recognition) against a known star catalog
- Computing a confidence score for the plate-solve result
- Conditionally generating an attention event hash (per issued patent #0) only when the plate-solve confidence exceeds a threshold
- Wherein the unsolved-frame case results in no token issuance or a reduced-tier token issuance

**Closest prior art (Celestron US 8,401,307 B1) — FTO ANALYSIS REQUIRED:** Celestron's StarSense Auto-Align patent covers plate-solving for telescope mount alignment via an "affine fit operation." Astra Vault's plate-solve gates token issuance, not telescope alignment, AND uses 4-star angular-distance hashing (per tetra3-class algorithms) which is arguably NOT an affine fit. **Formal FTO opinion from counsel required before public launch.** The report at `research/patent-prior-art-review.md` includes the full Celestron claim 1 text.

## Patent #5 (provisional draft) — 3DGS reconstruction pipeline

**Field of invention:** Server-side methods for converting crowdsourced consumer-device capture records into 3D-renderable reconstructed event scenes via 3D Gaussian Splatting.

**Claim 1 summary:**

A method comprising:
- Receiving a plurality of moment capture records (per patent #1's record format) tagged to a single triangulated celestial event
- Extracting per-frame astrometric solutions, observer pose, and observer location
- Constructing a sparse multi-view dataset suitable for 3D-Gaussian-Splatting reconstruction
- Generating a 3D Gaussian Splat representation of the event with the meteor / aurora / eclipse trajectory rendered as an emissive feature
- Serving the reconstructed scene to participating observer devices for AR replay

**Closest prior art:** 3DGS publications cover the reconstruction technique but not its application to crowdsourced consumer-grade celestial event capture. No competing app or patent surfaces.

## Valuation framework for the portfolio

See `valuation-framework.md` for comp transactions. Brief:

| Bundle | Indicative range (USD) |
|---|---|
| Patent #0 alone, non-exclusive single-vertical license | $50k - $500k per vertical |
| Patent #0 alone, exclusive | $1M - $10M |
| Patents #1 + #4 + #5 bundle to a strategic acquirer (with the app) | $3M - $15M |
| Full portfolio + app + LLC acquihire | $5M - $50M (smart glasses tailwind dependent) |

These are **directional** — actual numbers depend on:
1. Whether the provisionals have been filed (priority date secured)
2. Whether Astra Vault has shipped publicly with users
3. Whether smart glasses adoption is real by the time of the conversation
4. Strategic-fit of the buyer (a hardware company values it more than a software company)

## Action required from Stephen

1. **Paste the actual issued claim language for Patent #0** into this document. Without that, due diligence stalls.
2. **Engage a USPTO-registered patent attorney** with software / AR / citizen-science background. Quote ranges: $5-15k for provisional filing of #1, $5-12k each for #4 and #5. Plan for ~$20-40k total for the Phase 1 filings.
3. **Get a formal FTO opinion on Celestron US 8,401,307** before any public launch of plate-solve features. ~$3-8k.
4. **Update this document quarterly** as filings progress (provisional → utility → granted).
