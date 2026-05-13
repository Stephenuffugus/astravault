# Provisional Patent Abstract — Cross-Glasses Observation Merge Protocol

**Prepared for**: outside patent counsel
**Author**: Astra Vault R&D
**Status**: pre-filing draft, internal review pending
**Source material**: `research/moment-capture-glasses.md`, `research/SYNTHESIS.md` (patent #1), `astra-vault-handoff/docs/astra-vault-audit.docx`

---

## Title
System and method for crowd-sourced transient-sky-event reconstruction from triggered captures by consumer wearable and mobile devices

(78 characters; alternates: "Cross-observer triangulation of transient sky events from consumer wearables")

## Field of Invention
The invention relates to crowd-sourced scientific observation of transient celestial events, including but not limited to meteors, fireballs, auroras, eclipses, and visible satellite re-entries. More specifically, it relates to systems that ingest user-triggered captures from heterogeneous consumer devices — smartphones, smart glasses, head-worn displays — and fuse them into a single three-dimensionally reconstructable event record.

## Background
The existing art for transient-sky-event reconstruction is dominated by fixed-station all-sky camera networks operated by professional and semi-professional groups (e.g., NASA CAMS, Global Meteor Network, FRIPON, Desert Fireball Network, AMS AllSky7). These networks rely on rigidly mounted, calibrated cameras with known orientation, location, and intrinsics; they do not accept observations from non-stationary consumer devices. Consumer-facing applications, in turn, function only as single-user reporting tools (e.g., the AMS fireball-report web form) and do not fuse multiple users' observations into a triangulated trajectory. No prior system known to the applicants combines (a) user-triggered post-event capture with a pre-trigger ring buffer, (b) hybrid IMU + per-frame astrometric pose estimation on a consumer device, (c) a privacy-preserving anonymous device fingerprint, and (d) a server-side multi-observer fusion stage that ingests these heterogeneous mixed-quality observations into one trajectory solve. The closest prior art — the Eclipse Megamovie 2017/2024 project of UC Berkeley and Google — is a frame-aggregation pipeline for a single predictable event (a solar eclipse along a known path) and does not perform real-time multi-observer trajectory fusion of unpredictable transients.

## Summary
The invention is a system and method comprising the following novel combination, claimed in any of several arrangements:

1. **Multi-modal trigger**: a capture engine running on a consumer wearable or mobile device that listens for any of (a) a wake-word phrase via continuous low-power audio, (b) a gesture (head-tap, back-tap, hand-pinch), (c) an on-device auto-detector for streak-shaped luminous transients, or (d) a manual user input, and on trigger captures into a pre-trigger ring buffer covering the immediately preceding 1-5 seconds plus a post-trigger window.

2. **GNSS-derived timestamping**: capture wall-time is recorded with nanosecond precision anchored to the device's GNSS clock when a fix is available, with explicit reporting of synchronization-source uncertainty.

3. **Hybrid pose estimation**: the observer's instantaneous bearing and elevation are estimated by an inertial-measurement-unit (IMU) sensor-fusion prior and then refined, when star background is present in the frame, by a single-frame astrometric plate-solver running on-device; the resulting pose is annotated with the method actually used and its 1-sigma uncertainty.

4. **Privacy-preserving observer fingerprint**: a cryptographic hash (SHA-256) of device model, operating system, and application version is computed and attached to the observation, permitting the server-side merge stage to disambiguate observations from the same device without storing any personally identifying information.

5. **Merge protocol**: a server-side stage spatio-temporally clusters incoming observations and, for any cluster containing two or more observations whose triggers fall within a configurable time window and whose locations fall within a configurable radius, runs a multi-station trajectory solver (Monte Carlo Plane Intersection or equivalent) weighted by each observation's self-reported pose uncertainty.

6. **Sensor-only contribution**: the system accepts observations that contain pose and time but no image frames, treating them as first-class direction-of-sight inputs to the trajectory solver. This enables casual users without usable camera frames to contribute scientific data.

7. **Cross-network verification**: at the moment a cluster forms, the system queries open scientific feeds (CAMS, GMN, AMS, IMO, FRIPON, DFN) for any concurrent record matching in time and location, and surfaces matches alongside the user observations.

## Brief Description of the Drawings

- **Fig. 1** — System architecture: client devices (smartphone, smart glasses, head-mounted display), the moment-capture record (MCR) traveling over the network, the server-side clustering and trajectory-solver stages, and the persisted reconstructed-event record.
- **Fig. 2** — On-device capture flow: continuous wake-word / gesture / auto-detect listening, ring-buffer maintenance, trigger event, IMU + plate-solve pose pipeline, MCR serialization, upload queue.
- **Fig. 3** — Server-side merge flow: ingestion, spatio-temporal clustering, trajectory solve, cross-network verification, push notification to participating observers, persisted event document.
- **Fig. 4** — Data structure diagram: the Moment Capture Record schema, including time fields, location fields, pose fields with method and uncertainty, frame references with optional plate-solve metadata, and the observer fingerprint.

## Claims Preview

(Drafted as numbered sketches for attorney review; not in final claim form.)

1. **Independent.** A method for crowd-sourced reconstruction of a transient celestial event, comprising: receiving, at a server, a plurality of observation records, each record originating from a distinct consumer mobile or wearable device, each record comprising a trigger time, a geographic location, a pose described by a bearing and elevation each with associated uncertainty, an anonymous device fingerprint, and an optional set of image-frame references; spatio-temporally clustering the records; for each cluster containing two or more records, solving for a single three-dimensional trajectory using a multi-station triangulation method that weights each record's contribution by the inverse of its pose uncertainty; and persisting the solved trajectory.

2. **Dependent on 1.** The method of claim 1, wherein at least one observation record contains no image frames and its pose is contributed solely as a direction-of-sight input to the trajectory solve.

3. **Dependent on 1.** The method of claim 1, wherein at least one observation record contains an image frame and the recorded pose was refined by an on-device astrometric plate-solve over the recorded frame.

4. **Independent.** An apparatus comprising a consumer mobile or wearable device configured to: maintain a continuous pre-trigger ring buffer of audio and/or video; respond to a trigger consisting of one or more of a wake-word phrase, a tap gesture, or an auto-detector for streak-shaped luminous events; on trigger, capture the contents of the ring buffer plus a post-trigger window into a moment capture record; compute a SHA-256-based anonymous device fingerprint and attach it to the record; and transmit the record to a server.

5. **Dependent on 4.** The apparatus of claim 4, further configured to estimate pose via inertial-measurement-unit sensor fusion and to refine the pose by a single-frame astrometric solve when a star-rich background is detected.

6. **Independent.** A data structure stored on a computer-readable medium and comprising: an observation identifier; a trigger time with associated synchronization-source uncertainty; a geographic location with associated horizontal accuracy; a pose specifying bearing, elevation, an explicit estimation-method label, and an angular uncertainty; an anonymous device fingerprint derived as a cryptographic hash of device-and-application metadata; and zero or more frame references each optionally annotated with astrometric plate-solve parameters.

7. **Dependent on 1.** The method of claim 1, further comprising querying one or more public scientific feeds for concurrent records and associating any matched record with the persisted trajectory.

## Notes for the Patent Attorney

Questions Stephen will need to answer before formal filing:

1. **Inventorship.** Which named individuals at Astra Vault contributed to the on-device pose pipeline, the wire-format design, and the server-side merge protocol? Each contributor to a claimed combination must be listed.
2. **Prior-art search depth.** A formal prior-art search has not yet been run. The applicant's own search identified the Eclipse Megamovie project (UC Berkeley / Google, 2017 & 2024) and SonotaCo UFOOrbit (Japan) as the closest candidates. Counsel should run a USPTO and Google Patents pass against keywords {"crowd-sourced meteor", "multi-observer trajectory", "wearable transient capture", "plate-solve pose refinement on mobile"} before filing.
3. **Foreign filing strategy.** Primary markets are US, EU, JP, KR, CN, AU. PCT route is preferred given that meteor-network partners are international.
4. **Provisional vs. non-provisional.** Applicant intends to file a US provisional first ($300 filing fee, 12-month protection) to lock priority date ahead of the public launch of the Astra Vault triangulation feature.
5. **Claim breadth.** Should claim 1 specify "consumer mobile or wearable device" or broaden to "any user-portable computing device"? Trade-off: broader is stronger if granted; narrower is easier to defend against prior art on fixed-station camera networks.
6. **Sensor-only contribution (claim 2)** is believed to be the most independently novel item; counsel should evaluate whether it warrants a separate filing.
7. **Cross-network verification (claim 7)** depends on third-party data feeds whose terms of use vary (CAMS public domain, GMN CC-BY 4.0, FRIPON CC-BY-NC 4.0). The patent claim survives independent of those terms but the commercial product needs separate license review.
8. **Attention-protocol coupling.** The Astra Vault product binds these observations to a separate "attention hash" mechanism (under separate provisional preparation). The two filings should reference each other for full coverage.
9. **Open-source obligations.** The applicant intends to use `tetra3` (Apache 2.0, ESA) for on-device plate-solving and `WesternMeteorPyLib` (MIT, U. Western Ontario) for the server-side trajectory solver. Counsel should confirm these licenses do not impair patentability of the *combination* claimed here.
10. **Disclosure timing.** Public disclosure (press release, App Store listing copy, conference talk) must follow filing date. Coordinate with marketing.

---

*End of pre-filing draft. Approximately 1,500 words including claims preview and attorney notes; the body abstract proper is ~580 words.*
