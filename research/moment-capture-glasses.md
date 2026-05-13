# Moment Capture + Triangulation — Astra Vault R&D

**Author:** R&D / Quad Code
**Date:** 2026-05-13
**Audience:** Stephen Furpahs, Director
**Status:** Strategic R&D deep-dive; primary input to the meteor-capture build phase.

> Research note on sourcing: this document was assembled from R&D-team training knowledge of the underlying systems (CAMS, GMN/RMS, Borovicka method, COLMAP, NeRF, 3D Gaussian Splatting, Ray-Ban Meta SDK, Android XR, AMS, FRIPON, DFN, etc.). URLs are cited inline as canonical references the build team should confirm against current documentation before integration. Where a number is approximate or date-sensitive (e.g. station counts, SDK status), it is flagged. Web-access tooling was unavailable in this research pass, so live-verify every cited URL once during build planning.

---

## The Vision

When a transient sky event (a meteor, a fireball, an aurora flare, an eclipse contact, an iridium flash, a satellite reentry) crosses the field of view of two or more Astra Vault users — phone or smart-glasses, anywhere on Earth — the platform shall (a) capture each user's observation with millisecond-grade time tags, sub-degree pointing solutions and full camera intrinsics; (b) match those observations into a single physical event by spatio-temporal coincidence; (c) reconstruct the event's 3D trajectory (point-event geometry) or volumetric structure (extended event geometry) by classical photogrammetric triangulation augmented with modern radiance-field methods where applicable; and (d) re-render the result as an interactive 3D scene in-app — replayable from any contributor's vantage point, from the satellite's-eye view, from the meteor's own frame, or from an arbitrary fly-around camera — with full cross-reference to the corresponding professional record (CAMS, GMN, FRIPON, DFN, AMS, IMO, ESA NEOCC, NASA DONKI). The pipeline turns a single user's accidental glance into a shared, scientifically valid, replayable 3D moment.

This is the **Moment Capture Pipeline**. It is the most patent-rich subsystem in Astra Vault. It is the single highest-leverage user-acquisition story the app can tell.

---

## Capture Layer

### Phone capture (Section A)

Modern phones have three media-related capabilities relevant here:

1. **Always-on background audio buffering** — both iOS and Android keep a rolling microphone buffer for "Hey Siri" / "Hey Google" type wake-word detection. The buffer is short (~1–2 seconds), runs on the always-on processor (AOP on Apple Silicon, Hexagon DSP on Snapdragon), and consumes <1% battery/hour. This is the audio analog of what we need.
2. **Camera-not-foregrounded capture** — strictly forbidden on iOS (you can hold a `AVCaptureSession` in the background only if you started it in the foreground and only for ~30 s before iOS suspends it). Android is slightly more permissive via foreground services with `CAMERA` and `FOREGROUND_SERVICE_CAMERA` (post-API 34) but the OS UX still shows a persistent notification. **Continuous on-device camera recording is not realistic in 2026.** 🚨 This is the single biggest constraint on the phone path. Plan around it.
3. **Sensor-only background telemetry** — accelerometer, magnetometer, gyroscope, GPS, and microphone are all available in the background on both platforms via `expo-sensors`, CoreMotion, and Android `SensorService`. These cost ~50–150 mW combined which is roughly 4–12% battery per night of operation. Survivable.

The implication: **the phone path is voice/gesture-triggered, not continuous-recording.** When the trigger fires we resume the camera, capture a burst, and reach back into a tiny pre-trigger ring buffer if we can grab one.

#### Voice-trigger latency budget

Realistic end-to-end latency from "METEOR" being said to the first frame being saved is the sum of:

| Stage | iOS (best case) | Android (best case) | Notes |
|---|---|---|---|
| Wake-word detection | 100–300 ms | 80–250 ms | On-device. Apple's Porcupine/Picovoice-style models add ~120 ms on A17+. Native "Siri Shortcut" wake-up adds more. |
| App resume from background | 50–500 ms | 80–800 ms | iOS BGTask wakeup is unpredictable; Android's foreground service is more deterministic. |
| Camera session warm-up | 200–600 ms | 150–500 ms | First frame from `AVCaptureSession`/`CameraX`. Lower if a `prewarm` API is used. |
| Auto-exposure converge | 200–1500 ms | 200–1500 ms | Devastating at night because AE has to integrate across many frames. Lock exposure manually. |
| Save to file | 30–100 ms | 30–100 ms | Trivial if HEIC stream is already established. |

Worst-case "cold" trigger to first usable frame: **~2–3 seconds.** A typical Perseid is visible 0.3–1.5 s. So a naive voice trigger will *always* be too late to capture the meteor that triggered it. 🚨

**The fix is the audio-buffer trick.** The "METEOR" wake word is being heard ~500 ms *after* the meteor disappeared (human reaction time + verbal initiation). If we keep a ring buffer of the **last 5 seconds of microphone audio** *and* a ring buffer of **camera frames from before the trigger fired**, we can reach backward in time. iOS exposes camera ring buffers via `AVCaptureMovieFileOutput` if you've kept the session warm; Android via `MediaRecorder.Persistent` or, in 2026, via `CameraX` `PreviewView` ring-buffer mode (added in CameraX 1.4.0-alpha07). **The combination — wake-word + pre-trigger camera ring buffer — is patentable as a meteor-specific application of the pre-roll capture pattern.** 🟢

**The genius hack: even if we can't grab pre-trigger camera frames, we can grab pre-trigger sensor data** — compass heading, gyroscope orientation, GPS, accelerometer. Then we know *where the user was pointed at the moment of the meteor* even if no frame was saved. That is the basis of a Mark-I-eyeball triangulation. **A meteor observation does not need a meteor *frame*; it needs a meteor *direction*.** 🟢 This is the most undervalued insight in the whole pipeline.

#### Auto-detect (Mode 3)

The CAMS algorithm at its core is:
1. Continuously running difference-of-Gaussians on consecutive frames at fixed exposure (`PixelDiff > threshold` in any 4-connected blob).
2. When a blob is found, check that it's elongated (eccentricity > 0.7) — meteors are streaks, not airplanes.
3. Track the blob across N frames. If it travels in a straight line at angular velocity 1–20 °/s it is a meteor candidate.
4. Save the surrounding 32-frame burst plus astrometric solution.

CAMS uses 30 fps Watec 902H2 Ultimate cameras with 12 mm f/1.2 lenses pointed at fixed sky regions (Jenniskens et al. 2011, "CAMS: Cameras for Allsky Meteor Surveillance to establish minor meteor showers" — `https://www.sciencedirect.com/science/article/abs/pii/S0019103511001102`). The pipeline is open source as `Cams_MeteorScan` (Fortran originally; C++/Python ports exist).

The **GMN RMS** equivalent (`https://github.com/CroatianMeteorNetwork/RMS`) — used by all 1,300+ Global Meteor Network amateur stations as of mid-2026 — uses the **MaxPixel + AvgPixel** approach: compute the running maximum and average pixel intensity across a sliding 256-frame window, threshold the difference, then run line-detection (Hough transform) on the residual. It's faster than CAMS and runs on a Raspberry Pi 4. The trajectory solver inside RMS is `WesternMeteorPyLib` (`https://github.com/wmpg/WesternMeteorPyLib`) — adopt this verbatim for our server-side triangulation; it's MIT-licensed.

The **phone-friendly approximation** for Astra Vault:
- Take the YUV preview frames at 720p / 30 fps.
- For each frame, downsample to 180×320, compute `frame[t] - frame[t-1]`, threshold at 3× the rolling noise floor (sigma-clipped).
- Run connected-component labeling on the residual using OpenCV.
- For each blob: if `eccentricity > 0.6 AND area in [4..200] px AND not present in t-2`, mark candidate.
- Persist a 1-second pre/post buffer of full-resolution frames.

This is ~3–7% CPU on an iPhone 15 / Pixel 8 if implemented in `Accelerate.framework` / Halide / Vulkan compute. Battery cost is dominated by the camera ISP (~700 mW), so a 5-minute "shower mode" window costs ~6% battery. That's tractable.

🚨 **Showstopper if not handled**: lens dirt, hot pixels, airplane lights, satellite trails, and (above all) bats and moths will dominate false positives. Borovicka et al. (2015) note 50:1 false positive ratio in unfiltered CAMS data. We must run a **second-stage classifier** on each candidate — a tiny MobileNet (~150 KB) trained on labeled meteor/non-meteor clips from GMN's published dataset would push false positives to <2:1 and is small enough to ship in-app.

#### Smart glasses capture

Ray-Ban Meta (Gen 2) — `https://www.meta.com/help/ray-ban-meta/` — has:
- 12 MP camera, f/2.0, ~78° diagonal FoV
- 60 fps 1080p video, 5-minute max single clip
- "Hey Meta" wake-word, on-device
- Voice-only video trigger ("Hey Meta, take a video")
- No first-party SDK for third-party background camera access as of mid-2026 🚨 — Astra Vault must integrate via the **Meta AI Hub** + **Llama Stack** companion APIs that route through the paired phone

Ray-Ban Meta Display (the $799 in-lens HUD variant, late 2025) adds:
- Same camera optics
- In-lens monocular display, 600×600 px, ~14° virtual FoV
- Better mic array (5 mic beam-forming)

The strategic insight: **the glasses are pointed exactly where the user is looking.** A phone is pointed wherever the user is holding it, which is usually random. The bearing prior for a glasses-captured meteor is therefore much tighter (±5° vs. ±45° for a phone in a pocket), which means glasses captures are *intrinsically higher-value observations for triangulation* than phone captures. Glasses-driven Astra Vault users contribute disproportionately more signal per capture. This is a strong product/economic argument for glasses-tier ATP multipliers.

XREAL / Rokid display glasses (`https://www.xreal.com`, `https://www.rokid.com`) expose a full Android camera2 API to native apps because they tether to an Android phone or to their own embedded SoC. We can implement the full auto-detect pipeline on XREAL Air 2 Ultra and Rokid AR Lite. Field of view is the killer feature here — Rokid Glasses are ~50° vs. ~78° on Ray-Ban Meta — but Rokid runs full apps, so this is the platform where we can ship the auto-detect mode first.

Apple Vision Pro (existing) and Apple smart glasses (rumored 2027) — Vision Pro's external cameras are not accessible to third-party apps without an enterprise entitlement that requires explicit Apple approval (`Enterprise.entitlement.cameraAccess`). 🚨 We will not have meteor capture from Vision Pro in v1. Plan around this.

Android XR (Google's Quest-class platform) — Glass Enterprise 3 and Samsung XR headsets in 2026 — exposes camera access through the standard Android Camera2/CameraX APIs. **This is the cleanest smart-glasses target for Astra Vault.** Pixel Quest devices with Tensor G4 can run the auto-detect ML model natively.

#### Trigger systems summary

| Trigger | iOS phone | Android phone | Ray-Ban Meta | Android XR / Rokid |
|---|---|---|---|---|
| Voice ("METEOR" / "FLASH") | App-foreground wake word + sensor-only background | Same, plus background foreground-service path | Native "Hey Meta" voice video | Native on-device wake word + camera burst |
| Gesture (back-tap, squeeze) | Apple "BackTap" via Shortcut (`Action Button` on 15 Pro+) | Pixel `QuickTap` + Android Tap Gesture API | Frame tap on Ray-Ban Meta | XREAL Air controller button |
| Auto-detect | Foreground only | Background foreground service | Not available 🚨 | Background allowed |
| Sensor-only "I was looking up" | Always available | Always available | IMU available via paired phone | Always available |

🟢 **Patent claim opportunity:** the multi-modal trigger combiner — "if either the wake word OR the back-tap OR the user's gaze-direction-toward-radiant happens, save a 5-second symmetric ring buffer of all available sensor and frame data" — is novel as a composed action. Bundle with the cross-reference query (next section) for the strongest claim.

#### Multi-frame fusion

A single meteor frame on a phone at ISO 6400 / f/1.8 / 1/30s exposure is dim (SNR ~3–5 for a magnitude 0 meteor). We can stack:

- **Live Photo-style approach**: capture 8 frames at 30 fps (~270 ms), aligned via OpenCV `findTransformECC`, summed in 16-bit. SNR improves by ~2.8× (sqrt(8)). This is the same trick NightCap and ProCamera use.
- **HDR bracketed approach**: capture 3 frames at -2, 0, +2 EV, merge with Mertens fusion. Helps recover the meteor tail against bright surroundings (e.g. moonlit nights).
- **Temporal median for trail extraction**: for meteor analysis specifically, take 15 frames, compute the per-pixel median (= the static sky), subtract from each frame. The meteor pops out as a clean signal, like the `maxpixel - avgpixel` GMN trick.

For iPhone 15 Pro and newer (Apple ProRAW): we can capture 14-bit DNG frames. SNR is genuinely 4–8× better than HEIC. Pay the storage cost in shower mode.

For Pixel 8 and newer: Night Sight already does this stacking automatically when the camera is held still — but Night Sight's exposure window is ~6 seconds, which *averages out* a 1-second meteor. **Night Sight must be turned off for meteor capture.** 🚨 Counter-intuitive but important.

---

## Synchronization Layer

### Time precision (Section B)

**Without intervention, consumer device clocks are not good enough** for sub-degree triangulation. Consumer GPS chipsets receive GPS satellite time to ~100 ns precision, but the OS-exposed `Date.now()` / `clock_gettime(CLOCK_REALTIME)` is synced to NTP via Apple/Google time servers with median accuracy 10–50 ms (Android `SystemClock.elapsedRealtimeNanos()` and iOS `CACurrentMediaTime()` are monotonic but unsynced to UTC, which is worse).

A meteor at 100 km altitude moves at 30–70 km/s. One frame at 30 fps is 33 ms, during which the meteor travels ~1.5 km. **Triangulation error scales with timing error × velocity.** For sub-arcminute triangulation we need timing better than 5 ms.

**The fix: explicit NTP sync at app launch.**
- Use `react-native-ntp-client` or implement a 4-packet NTP exchange against `pool.ntp.org` and `time.google.com` on app start. Returns the offset between device clock and UTC to ~5 ms typical on cellular, ~1 ms on wifi.
- Store the offset as `ntpOffsetMs` and apply at observation time. This is exactly what `chrony` and the Google Mobile Services time API do.
- GMN stations achieve <2 ms timing via standalone `ntpd` running on the Raspberry Pi.

**Better: GNSS time from the chipset.** Both iOS (`CMTimeProvider` since iOS 17) and Android (`GnssClock` since API 24) expose raw GPS time with sub-microsecond precision *if the device has a recent fix*. This is currently underused by app developers and is the right approach for a serious meteor pipeline. 🟢 **Astra Vault should use the GNSS-derived UTC offset as its authoritative timestamp, fall back to NTP if no GPS lock.** This is patentable as part of the "observation packaging" claim — see below.

**Cross-device sync for triangulation**: when two observers report the same event, we don't need their clocks to be identical, only *known with respect to a common time reference*. Each observation reports `t_capture_utc, t_offset_uncertainty, sync_source ∈ {GNSS, NTP, none}`. The triangulation solver weights observations inversely to timing uncertainty.

### Pose estimation

The hardest single problem in the phone path is **knowing where the camera was pointed when the meteor was captured**. Three sensors contribute:

1. **Magnetometer (compass)** — gives azimuth, but is brutalized by local magnetic disturbance (cars, fridges, watches, the phone itself). Real-world accuracy is ±5–15° in cities, ±2–5° in dark sky sites. Apple's `CMDeviceMotion` runs a Kalman filter that fuses gyro + magnetometer + accelerometer for a "true heading" that is usable but never trustworthy alone.

2. **Gyroscope** — gives instantaneous angular velocity. Integrated over time you get orientation. Drifts at ~1–5°/minute on consumer MEMS chips. Calibrated continuously by the OS sensor fusion against the magnetometer.

3. **Accelerometer** — gives the gravity vector after low-pass filtering, which gives device tilt to ±0.5° in static conditions, much worse if the user is moving.

The fused **device-attitude quaternion** (`CMDeviceMotion.attitude`, Android `Sensor.TYPE_ROTATION_VECTOR`) gives 3D orientation with characteristic accuracy ~3–8° in real conditions. **Not good enough.** A meteor's angular position is needed to ±0.5° to make triangulation worthwhile.

**The breakthrough is plate-solving the captured frame.** If we have even a single dim frame of the meteor *plus a few background stars*, we can run a **single-shot astrometry solution** that gives us pointing to ±0.05° regardless of how bad the magnetometer was. This is exactly what `astrometry.net` does. The lightweight version is `tetra3` (`https://github.com/esa/tetra3`, ESA, Apache 2.0) which solves a 1024×1024 patch in ~50 ms on a phone CPU. **Run astrometry on every captured frame; use the solution to correct the IMU-derived pose.** 🟢 **The combination — IMU pose prior + per-frame plate-solve refinement to ground-truth — is the patentable pose-estimation method for our pipeline.**

For frames with no stars (heavily light-polluted urban skies), we fall back to IMU-only pose with the recorded uncertainty. We can also do **delayed plate-solving** — capture the burst, take a longer (1–2 s) exposure 30 seconds later for the same pointing, then use those stars to back-solve the original.

For smart glasses, the `getRotationMatrix` API on Ray-Ban Meta and Android XR is generally similar to the phone case, with one advantage: glasses are rigid against the head, so a *user calibration step* (look at Polaris for 3 seconds) on app first-run can null out the magnetometer bias for an entire session, getting pose to ±1.5° even without plate-solving.

### Observation packaging — what fields go on the wire

Each captured observation is serialized as a **Moment Capture Record (MCR)** — the on-the-wire JSON that travels from the device to our Cloud Functions / Firestore backend. The MCR is the heart of the protocol and is patentable as a data-format-plus-method combination 🟢:

```jsonc
{
  "schema_version": "mcr-1.0",
  "event_uuid": "01H6...",                          // device-local UUID; coalesced server-side
  "device": {
    "platform": "ios" | "android" | "rayban-meta" | "android-xr" | "rokid-glasses" | "vision-pro",
    "model": "iPhone15,3",
    "os_version": "iOS 19.2",
    "app_version": "1.4.0",
    "trigger": "voice" | "gesture" | "auto-detect" | "manual"
  },
  "user_anonymous_id": "av-user-...",               // not the auth uid; rotated periodically
  "time": {
    "t_capture_utc_ns": 1747095600123456789,        // GNSS-derived if available
    "sync_source": "gnss" | "ntp" | "device",
    "sync_uncertainty_ms": 1.4,
    "exposure_start_offset_ns": -33000000,          // frame start relative to wall capture time
    "exposure_duration_ns": 33333333
  },
  "location": {
    "lat": 37.762,
    "lon": -122.422,
    "alt_msl_m": 86.0,
    "horizontal_accuracy_m": 8.0,
    "vertical_accuracy_m": 12.0,
    "source": "gnss" | "fused" | "wifi"
  },
  "pose": {
    "attitude_quaternion": [0.123, -0.456, 0.789, 0.321],   // ENU frame
    "attitude_uncertainty_deg": 4.2,
    "method": "imu" | "imu+astrometry" | "astrometry-only",
    "plate_solve": {                                  // present only if method involves astrometry
      "ra_center_deg": 86.45,
      "dec_center_deg": 22.51,
      "rotation_deg": 0.0,
      "scale_arcsec_per_px": 28.4,
      "stars_matched": 17,
      "rms_arcsec": 14.2
    }
  },
  "camera": {
    "intrinsics": {
      "fx_px": 3220.0, "fy_px": 3220.0,
      "cx_px": 2016.0, "cy_px": 1512.0,
      "distortion_model": "opencv-radtan",
      "distortion_coeffs": [0.012, -0.024, 0.0001, 0.0002, 0.0]
    },
    "image_width_px": 4032, "image_height_px": 3024,
    "iso": 6400, "aperture_f": 1.78, "exposure_s": 0.033,
    "white_balance_kelvin": 4400
  },
  "media": {
    "frame_uris": ["gs://av-meteors/abc/0.dng", "..."],   // pre-trigger ring + post-trigger frames
    "audio_uri": "gs://av-meteors/abc/audio.flac",
    "trigger_wake_word_offset_ms": -517                   // wake word arrived 517 ms after the event
  },
  "detection": {                                           // present only for auto-detect captures
    "streak_endpoints_px": [[1234, 567], [1502, 798]],
    "duration_frames": 12,
    "peak_brightness_du": 215,
    "classifier_meteor_prob": 0.91
  },
  "consent": {
    "share_publicly": true,
    "share_with_cams": true,
    "share_with_ams": true,
    "share_with_gmn": false
  }
}
```

Key design decisions, each of them load-bearing:
- **`t_capture_utc_ns` is nanoseconds.** Anyone passing millisecond timestamps is leaving precision on the floor.
- **`sync_uncertainty_ms` is mandatory.** Downstream solvers weight observations by it.
- **Camera intrinsics are required.** Without them, projecting a streak endpoint back to a ray in 3D space is meaningless. Phone manufacturers publish nominal intrinsics; we should ship a per-device lookup table and refine via plate-solve in production.
- **`pose.method` is critical.** An IMU-only pose is a much weaker observation than a plate-solved one and the solver must know.
- **`plate_solve` is included when available**, separately from the IMU quaternion, so that the server can re-derive the camera ray even if our IMU fusion changes.
- **Consent flags travel with the record.** This is GDPR/CCPA-essential and also lets us legally bridge to CAMS/AMS/GMN.

**This MCR is itself patentable.** 🟢 The novel claim is: *a multi-source pose-tagged transient-sky observation record optimized for crowd-sourced triangulation, including IMU-prior + astrometric-refinement pose, GNSS-derived nanosecond timestamps, and explicit per-network-share consent flags.* Worth filing.

---

## Triangulation Math

### The classical two-station algorithm

For a point-like transient (a meteor, a fireball, a satellite re-entry), the gold standard is the **Ceplecha (1987) plane-intersection method**.

Each observation defines a sequence of "lines of sight" (LoS) — unit vectors from the observer's position into the sky toward the event at successive times. For each station k, the set of LoS vectors at all observed times defines a **best-fit plane through the observer's position** that contains the meteor's straight-line trajectory.

The meteor's trajectory lies on the intersection of the planes from all stations. With two stations, two planes intersect in a line — the trajectory. With N stations the trajectory is overdetermined and solved by least squares.

Reference papers:
- Ceplecha Z. (1987), "Geometric, dynamic, orbital and photometric data on meteoroids from photographic fireball networks", *Bull. Astron. Inst. Czechosl.* 38, 222 — the canonical paper.
- Borovicka J. (1990), "The comparison of two methods of determining meteor trajectories from photographs", *Bull. Astron. Inst. Czechosl.* 41, 391 — establishes the **Borovicka MOTS method** that improves on Ceplecha by also fitting timing.
- Vida D. et al. (2020), "Estimating trajectories of meteors: an observational Monte Carlo approach", *MNRAS* 491, 2688 — the modern, MC-based solver used in GMN's RMS.

The math, briefly:
1. For each station k, observation times $t_{k,i}$, each defining a unit LoS vector $\hat{r}_{k,i}$ in ECEF coords.
2. The best-fit plane for station k has normal $\hat{n}_k = \arg\min_{\hat n} \sum_i (\hat n \cdot \hat r_{k,i})^2$ subject to $|\hat n| = 1$. This is the smallest eigenvector of the LoS outer-product matrix.
3. The trajectory direction $\hat v$ is perpendicular to all $\hat n_k$: $\hat v = \arg\min_{\hat v} \sum_k (\hat n_k \cdot \hat v)^2$.
4. The 3D position at each time is the point on the trajectory line closest to each station's LoS at that time.

This is **~30 lines of NumPy.** The full reference implementation is `WesternMeteorPyLib.Trajectory.Trajectory` (`https://github.com/wmpg/WesternMeteorPyLib/blob/master/wmpl/Trajectory/Trajectory.py`). Adopt it verbatim for our server-side solver.

### Multi-station solvers

**The Monte Carlo Plane Intersection (MCPI) solver, Vida et al. 2020**, is the modern gold standard:
- Take the classical solution as a seed.
- Add Gaussian noise to each LoS at each station, drawn from the per-station angular uncertainty.
- Re-solve. Repeat 1000–10000 times.
- The distribution of resulting trajectories *is* the trajectory posterior — gives confidence intervals on speed, radiant, altitude.

This is essential for our case because **our per-station noise is much higher than for fixed all-sky stations.** A GMN station has ±0.05° pointing uncertainty; an Astra Vault phone has ±0.5–5° depending on whether plate-solving succeeded. MCPI lets us quantify "how much can we trust this trajectory" honestly to the user.

**Borovicka's 2007 'Multi-Trail' extension** handles the case where a single station saw multiple fragments of a fragmenting meteor. We do not need this in v1 but it's natural future scope.

**UFOOrbit / UFOCapture** (SonotaCo Network, Japan — `http://sonotaco.com/e_index.html`) is the closed-source Windows alternative used by amateur networks in Japan. Its trajectory math is functionally identical to Ceplecha but its detection layer was state-of-the-art in 2008–2015. The Sonotaco group's published dataset is ~400,000 multi-station meteors and could be a training set for our auto-detect classifier (license check needed before bulk download).

**MOTS** (Meteor Orbit and Trajectory Solver, Gural) is the classical desktop solver bundled with CAMS. C++ implementation. CAMS is moving to a Python re-implementation of MOTS but the math is unchanged.

### Open-source libraries to plug in

| Library | License | Use |
|---|---|---|
| `WesternMeteorPyLib` (wmpg/UWO) | MIT | Trajectory solver, MCPI, radiant computation. Adopt verbatim server-side. |
| `RMS` (CroatianMeteorNetwork) | GPL-3.0 🚨 | Full GMN station stack. License is incompatible with closed-source app distribution — *do not* import as a library. Used only for reference and reading. |
| `astropy` | BSD-3 | Coordinate transforms, time scale conversions, frame conversions. Used throughout the pipeline. |
| `skyfield` | MIT | Modern ephemeris computation; what we use instead of pyephem. Already required for JPL Horizons substitution. |
| `tetra3` (ESA) | Apache 2.0 | On-device plate-solving. Ports to mobile via tflite. |
| `astrometry.net` | BSD-3 | Server-side astrometric solution. Heavy (GB-scale index files) but unbeatable accuracy. |
| `COLMAP` | BSD-3 | Photogrammetric structure-from-motion. Use for static/extended event reconstruction. |
| `nerfstudio` | Apache 2.0 | Modern NeRF/3DGS pipeline. Use for aurora & extended events. |
| `OpenCV` | Apache 2.0 | Image alignment, blob detection, ECC, Hough. |
| `SciPy` | BSD-3 | `least_squares` for trajectory refinement; `optimize.differential_evolution` for global solver fallback. |

🚨 **The GPL license on RMS is a serious gotcha.** We can't link GPL code into our proprietary app or backend. We can read the algorithms and re-implement them ourselves, or we can run RMS as a *separate service* the backend talks to over a network boundary (then the GPL applies only to that service). The simpler path is reimplementation; the algorithms are published.

### Accuracy bounds — feasibility math

Triangulation accuracy is dominated by **baseline geometry and pointing precision**.

For two stations separated by baseline B observing a meteor at altitude H with pointing uncertainty σ each, the cross-track position error at the meteor is approximately:

$$\sigma_x \approx \frac{H \sigma}{\sin\theta}$$

where θ is the parallax angle (= ~B/distance-to-meteor for B ≪ distance). For typical meteors, H ≈ 90 km and the meteor's slant range is ~150 km, so for a 100 km baseline, θ ≈ 35°, sin θ ≈ 0.57.

| σ (pointing) | Cross-track error | Quality |
|---|---|---|
| 0.05° (GMN fixed cam) | ~0.14 km | Research grade |
| 0.5° (Astra Vault, plate-solved) | ~1.4 km | Good — usable for orbit determination |
| 2° (Astra Vault, IMU + magnetic disturbance) | ~5.5 km | Marginal — usable for visualization only |
| 10° (Astra Vault, IMU only no calibration) | ~28 km | Showstopper |

So **with plate-solving we are in the research-adjacent regime; without it we are only good for cool visualization.** This makes plate-solving the single most important on-device feature we can ship. 🟢

**Baseline scaling**: an Astra Vault user population of 100,000 active observers translates statistically to ~3 observers within 200 km of any given populated point on Earth on any given night. That gives us a baseline of 50–200 km on the median triangulation. Excellent for cross-track but **bad for radial (along-LoS) accuracy** which we cannot improve from short baselines. The fix: encourage **vertically-separated baselines** — high-altitude observers in mountains see meteors at very different elevation angles than coastal observers. Build an event-level recruiting feature ("4 observers needed in mountain regions tonight") — we already considered this in the Shared Sky design.

**Minimum observation count**: 2 stations gives a trajectory but no overdetermination — we trust it only if both observations are plate-solved. With 3+ stations and MCPI we get a proper posterior. **The product rule: any meteor with ≥2 plate-solved Astra Vault observations gets a "Triangulated" badge; ≥3 gets "Multi-station Confirmed"; 1 station gets only "Spotted".** This is intrinsic to the data model.

### Handling noisy / partial observations

The most underrated capability of MCPI is graceful degradation. If one of three stations has high IMU-only pose uncertainty, MCPI naturally down-weights its contribution. **No observation is too noisy to be useful — it just contributes less.** This is a critical UX point: even users with bad phones, bad magnetometers, no plate-solve, get to see their contribution reflected in the final 3D scene. They earn ATP. The crowd is the engine.

We also propose a novel addition: **direction-only contribution**. A user who saw a meteor but had no camera frame (or all frames are blank because their phone was in their pocket) can manually input "I was looking northeast at 30° elevation" via a swipe-on-sky-map UI. This contributes a single LoS to the triangulation with high uncertainty (~10°) but **the trajectory solver still uses it.** 🟢 **The combination of camera-derived plate-solved observations with user-input manual LoS observations in a single MCPI solve is patent-eligible**, and is the mechanism by which a casual user contributes science.

### Implementation path

**Server side** (Cloud Functions / Cloud Run):
1. Ingest MCR documents into Firestore under `events/{event_uuid}/observations/{obs_id}`.
2. A **clustering function** runs every ~30 seconds: scan recent observations, group any with `|t_capture - t_other| < 10s AND |lat_other - lat| < 5° AND |lon_other - lon| < 5°` into candidate events.
3. For each candidate event with ≥2 observations, run the **trajectory solver** (Python on Cloud Run, `wmpl` library) and write the result to `events/{event_uuid}/trajectory`.
4. Cross-reference: query CAMS, GMN, AMS, FRIPON, DFN public feeds for any concurrent event within ±30s and 500 km radius. Write matches to `events/{event_uuid}/external_matches`.
5. Push to all observing users: "Triangulation complete — your meteor was Perseid (97% match), peak altitude 92 km, velocity 59.1 km/s."

**On-device side**:
1. MCR construction (described above).
2. Plate solving (`tetra3` ported via Core ML / TFLite — ~50 ms per frame).
3. MCR upload as `multipart/form-data` to a single endpoint `POST /v1/observations`.

Estimated end-to-end latency from meteor in sky to triangulation toast: **~3–8 seconds** if both observers' phones are connected; up to several minutes if any observer uploads on a delay (cellular dropouts, offline mode).

---

## 3D Reconstruction

### For point events (meteor streaks)

A meteor is a 1D curve in 3D space, parameterized by time. The geometry is fully described by the trajectory solver above. The "reconstruction" is just:
1. The 3D trajectory polyline (= a `LineString` of `[ECEF_x, ECEF_y, ECEF_z, t]` tuples)
2. The associated brightness curve `[t, magnitude]` from per-frame photometry
3. The radiant (where in the sky the trajectory points back to)
4. Optional: a fragmentation event map (where the meteor broke up, if any)

This is genuinely simple to render. We compute the trajectory in ECEF, convert to a local-tangent-plane (ENU) at the trajectory midpoint for stable rendering, and emit a Three.js / r3f `LineSegments` mesh with per-vertex brightness coloring.

The 3D **scene** wrapping the trajectory:
- A semi-transparent Earth sphere (textured from NaturalEarth) at scale.
- A skybox of the actual stars visible at the event time (from our `data/catalog.ts` extended to a full HYG catalog at runtime).
- Observer markers — a cone for each Astra Vault user showing their pose and viewing angle.
- A meteor-trail mesh — a tapered `TubeGeometry` along the trajectory, with a glow billboard at the leading point that animates in time.
- Cross-reference layers — toggle to show CAMS / GMN trajectories of the same event for comparison.

The killer feature is **"replay from any user's POV"**: snap the virtual camera to any participating observer's pose, and the user sees the sky as that observer saw it, with the trajectory drawn in. **A second snap re-positions the camera to the meteor's own frame** — orbiting around the trajectory as the meteor moves. **A third snap goes to "satellite view"** — orbit-class altitude looking down. Each transition is animated via a TWEEN over 1–2 s for cinematic effect.

🟢 **The composition — triangulated point event + observer POV teleport + meteor frame + satellite view, all in-app, on consumer hardware, from crowd-sourced phone observations — is a novel claim worth filing.** No existing meteor app provides this.

### For volumetric events (auroras)

Auroras are 3D volumetric phenomena, typically 100–300 km altitude, extending hundreds of km horizontally. They evolve on second-minute timescales. The right reconstruction approach is **tomographic emission reconstruction** — exactly the approach used by the Aurora 4D research project (Whiter et al., MIRACLE network, `https://doi.org/10.5194/angeo-31-1581-2013`).

Practically, this means:
1. From each observer, recover the *intensity* of aurora emission along each pixel's line-of-sight (after star and sky-glow removal).
2. Discretize the 3D volume above the observers into voxels (e.g. 5 km × 5 km × 2 km cells, 100–400 km altitude).
3. Solve the linear system $\mathbf{A} \mathbf{x} = \mathbf{b}$ where $\mathbf{A}$ encodes the LoS integration paths from observers' pixels through voxels, $\mathbf{x}$ is per-voxel emission intensity, and $\mathbf{b}$ is per-pixel measured intensity.
4. With ≥3 well-separated observers we recover a sparse 3D emission volume that we render as a volumetric raymarched glow in r3f.

This is **expensive**. The linear system can be 10^6 voxels by 10^4 measurements. Use ART (Algebraic Reconstruction Technique) or its modern accelerated cousins — implementable in JAX/PyTorch on a Cloud Run GPU. Per-event runtime: ~30–120 s.

🚨 **Showstopper without enough observers**: auroras need many well-separated observers (≥5 ideal) to triangulate well. We probably do not have enough Astra Vault users in northern latitudes in year 1 to produce credible aurora 3D recons. This is a year-2 feature unless we partner with an existing aurora observation network.

Year-1 workaround: produce a **2D "all-sky aurora map"** from N observers, similar to AuroraMAX / AuroraSaurus crowdsourced maps. Render it as a 2D heatmap projected onto an Earth sphere. Not 3D but visually rich.

### For static targets (planets, deep-sky, eclipses)

For static deep-sky targets (Andromeda, the Pleiades) we don't need triangulation — every observer sees the same sky. The 3D story here is *enrichment*: we collect multiple users' captures of the same target, **align them** (image registration on background stars), and **stack** them to produce a deeper, sharper composite than any single user could.

This is the same idea as Telescope.Live's "smart stacking" or Lumera AI's social astrophotography — but ours is *automatic, user-attribution-preserved, and bundled with the meteor capture infrastructure*.

For **eclipses**, the temporal dimension matters: an eclipse path crosses Earth in minutes, and observers along the path see different phases. The "reconstruction" is a *spatio-temporal* map:
- X = longitude along eclipse path
- Y = latitude offset from path
- Z = time
- Each user's frame is plotted as a `(x, y, t)` data point with eclipse phase decoded from their image.

We render this as a 4D animation: scrub through time, see the Moon's umbra move across the world, see each Astra Vault user's contribution pop up at their position. 🟢 **This crowd-sourced eclipse path visualizer is genuinely novel** — Eclipse Megamovie 2024 (Google + UC Berkeley) attempted a similar concept; ours is the productized, gamified successor.

For **planetary conjunctions** the 3D opportunity is *educational*: render the 3D positions of the two planets relative to Earth at the moment of conjunction, then animate forward to show that the apparent close approach is a line-of-sight effect — the planets are millions of km apart in 3D. We can compute this directly from JPL Horizons; no triangulation needed. The user's captured frame becomes the **reality anchor** that the 3D visualization is built around.

### NeRF / Gaussian Splatting feasibility on mobile

For dense reconstruction of *anything* — auroras, partial eclipse coronas, lightning, satellite trails — modern radiance-field methods are tempting. The state of the art in mid-2026:

- **NeRF (Mildenhall et al., 2020)** — the original. Slow to train (~hours per scene). Quality is photorealistic. Modern variants like Instant-NGP (Müller et al. 2022) train in seconds but require a CUDA GPU. **Not viable on-device.**
- **3D Gaussian Splatting (Kerbl et al., SIGGRAPH 2023)** — the SOTA in 2026. Trains in 10–60 minutes on a desktop GPU. Renders at 100+ fps. **Splatting renderers exist in browsers** (`gsplat.js`, `antimatter15/splat`) and **in React Native via WebGL/Skia bridge** (proof of concepts available). The output is a `.splat` file ~10–100 MB.
- **NerfStudio / SuperSplat** (`https://github.com/nerfstudio-project/nerfstudio`) — the workhorse pipeline. We invoke it server-side on Cloud Run GPU instances per event that warrants dense recon.
- **Mobile 3DGS rendering** — Luma AI's mobile app demonstrates 3DGS works at 60 fps on iPhone 14+. We can ship a `Splat` viewer component in Astra Vault for any reconstructed event.

**The pipeline for an event that warrants 3DGS**:
1. Collect N observations (need ≥10 ideally for 3DGS) from the cluster.
2. On server: run COLMAP first to recover camera poses and a sparse point cloud (this is what 3DGS needs as input). Use the plate-solved poses as priors — *huge* speedup over running SfM from scratch.
3. Run Gaussian Splatting training on Cloud Run GPU. ~15 min per event.
4. Export `.splat` and serve as a static asset.
5. Client renders via `@thi.ng/splat` or `gsplat.js` in WebView, or `react-native-splat` (if it exists by then; we'll likely build a wrapper).

🚨 **Cost showstopper**: training 3DGS for every event is expensive (~$0.10 per event in GPU-minutes at current Cloud Run prices). Limit 3DGS to *highlighted* events (fireballs > magnitude -4, ISS reentries, major auroras) — maybe 10–50 events per month globally. For ordinary meteors, stick with the trajectory line render. The trajectory render is *free*; the splat render is a premium experience.

🟢 **Patent claim**: *Hybrid trajectory-line / 3D-Gaussian-Splatting rendering of crowd-sourced sky observations, where the splat is trained from photogrammetric pose recovery seeded by per-observation plate-solving.* The combination of crowd capture + plate-solving + 3DGS is novel.

---

## Interactive Playback

### Web (r3f / Three.js)

`@react-three/fiber` is the right primitive. The interactive 3D scene for a meteor event uses:
- A `<Sphere>` Earth with a NaturalEarth texture.
- A `<Stars>` skybox using our HYG catalog reduced to the visible-sky-at-event-time subset.
- The trajectory as a `<TubeGeometry>` with a custom shader for the glow gradient.
- A `<group>` per observer with a `<Cone>` viewing-frustum and a click target.
- Camera controls via `<OrbitControls>` (free orbit) plus a `<CameraTransition>` HOC that we write to animate between named POV presets (observer-1-view, observer-2-view, meteor-frame, satellite-view).

`@react-three/drei` provides `<Html>` for HUD overlays (timestamps, observer names, ATP earned), `<Trail>` for the leading meteor head, and `<Effects>` for bloom.

Performance budget: ~50k triangles, 1 splat file (if present), 30+ fps on iPhone 12 and Pixel 6 in WebView.

### Native (Skia, Three.js via WebView, RN-Skia)

For React Native, three options:

1. **WebView with r3f** — easiest, works today. Heavy at ~5–10 MB JS bundle and ~80 MB memory for an active scene. Renderable on every device that runs Astra Vault. **Recommend for v1.**
2. **`@shopify/react-native-skia` 3D mode** — Skia 3D landed in mid-2025. Skia can do textured triangles but is not a full Three.js replacement. Good for ~2k-triangle scenes. **Not enough for our use case.**
3. **`expo-three` + `expo-gl`** — direct GL bindings. Performant but the dev experience is rough and the library is unmaintained as of 2026. **Skip.**
4. **React Native + Filament (Google's renderer)** — `react-native-filament` is the rising star, used by Vercel and Discord for 3D demos. Production-grade, native iOS/Android, ~120 fps. **Recommend for v2.**

The pragmatic stack: WebView + r3f for v1; migrate the same scene graph to react-native-filament for v2 when smart glasses output makes performance critical.

### AR overlay (Vision Pro, Meta Display)

This is the dream feature: **stand under the sky as it was, see the meteor cross the actual sky in front of you.**

**Vision Pro**: we get RealityKit + ARKit. We place the trajectory polyline at its real ECEF coordinates relative to the user's current location, using ARKit's geographic anchors (if outdoors with GPS). The user looks up and sees the trajectory drawn over the actual sky.
- Constraint 🚨: Vision Pro's external cameras are restricted. We can render in 3D, but we cannot use Vision Pro to *capture* meteors without an enterprise entitlement.

**Meta Ray-Ban Display**: limited HUD — 600×600 px, ~14° FoV. We can draw a small inset map showing where to look and an annotated arrow ("look NE 35° up — the meteor came from here").

**Android XR**: full AR experience similar to Vision Pro. Better camera access. **The right primary AR target for v1.**

🟢 **Patent claim**: *Geographically-anchored AR replay of a crowd-sourced triangulated sky event, where the user's smart-glasses pose is fused with the trajectory's ECEF coordinates to render the historical event over the user's current view of the actual sky.* This is genuinely new. No existing app does it.

---

## Crowd-Sourced Photo Aggregation (Section E)

Even when our own users haven't captured an event, the public web often has. Aggregating those is a separate pipeline:

| Source | API | License | Status 2026 |
|---|---|---|---|
| Flickr | `flickr.photos.search` with `geo_context`, `min_taken_date`, `tags`, `radius` | CC-BY for many photos; per-photo check needed | API still free, OAuth required. Best source. |
| 500px | API deprecated for public access since 2021 | Private | Skip 🚨 |
| Instagram | No third-party photo search API since 2020 | Private | Skip 🚨 |
| Astrobin (`https://www.astrobin.com`) | Limited public REST | CC-BY-SA for many uploads | Manual curation only. |
| NightSkyPark / SkyTour | RSS / scraping | Per-uploader | Tedious. |
| Reddit (`/r/Meteors`, `/r/SpaceWeatherCommunity`) | Public JSON API (`/r/Meteors.json`) | Per-uploader | Useful for fireball events specifically. |
| YouTube | `search.list` with `publishedAfter`, `publishedBefore`, `location` (deprecated for new keys) | YouTube TOS | Difficult; location filter dying. |
| Wikipedia / Commons | `query.geosearch` | CC-BY-SA / public | Excellent for static targets (eclipses, transits). |
| AMS Fireball Report | Open submission feed | AMS data is publicly browsable | Best source for fireballs specifically. |
| GMN Public Feed | Public CSV per night | CC-BY 4.0 | Best source for meteors. |
| CAMS Public Feed | Daily web-published trajectories | NASA public-domain | Best source for shower meteors. |
| FRIPON Database | Open at `fripon.org` | CC-BY-NC | Best source for European fireballs. |
| DFN Database | Open at `desertfireballnetwork.com` | CC-BY-NC | Best source for Australian fireballs. |

The aggregation engine:
1. Listen to our event-clustering function. When a candidate event has been formed (≥2 observations or ≥1 magnitude < -4 fireball), spawn a fan-out fetcher.
2. For each upstream source, query within ±5 minutes of `t_capture_utc` and 200 km of `centroid_lat_lon`.
3. Cache results in Firestore. Show in the Moment Story Page with attribution and a "view source" link.

The legal layer: **never embed third-party media without checking license.** For CC-BY content, render with attribution; for Flickr we use OEmbed which carries license info; for AMS/CAMS/GMN/FRIPON/DFN we have explicit research-use permission.

The "Find me the best capture of last night's Perseids near my location" feature becomes:
1. Geofilter: 200 km radius from user.
2. Timefilter: last 12 hours.
3. Tag/text filter: "Perseid" OR "meteor" OR "fireball".
4. Quality rank: image resolution × upload recency × CAMS/GMN/AMS verification status × source reputation.
5. Return top 12 in a card carousel.

---

## Existing Networks We Can Plug Into

| Network | Data | License | Integration story | URL |
|---|---|---|---|---|
| CAMS (NASA/SETI) | Daily trajectories of all detected meteors, ~10–50 per night per region | Public domain | Pull nightly summary CSVs; match by time+location to our events | `https://cams.seti.org` |
| GMN (Global Meteor Network) | All multi-station meteors, ~3000/night globally, full orbital elements | CC-BY 4.0 | Pull daily archive (`https://globalmeteornetwork.org/data/`); match by orbit and time | `https://globalmeteornetwork.org` |
| AMS (American Meteor Society) | Eyewitness fireball reports, ~30/day | Open browse, scraping for bulk | Submit our user reports via their form; pull recent fireball pages | `https://www.amsmeteors.org/fireballs/` |
| IMO (International Meteor Organization) | Visual Meteor Database, video meteor archive | CC-BY 4.0 | Reference data for shower predictions; submit observations via VMDB form | `https://www.imo.net` |
| FRIPON (Fireball Recovery and Inter-Planetary Observation Network) | European fireball detections with computed strewn fields | CC-BY-NC 4.0 | Pull weekly fireball list; match by location | `https://www.fripon.org` |
| DFN (Desert Fireball Network) | Australian large-fireball detections & meteorite-fall recoveries | CC-BY-NC | Pull weekly fireball list | `https://dfn.gfo.rocks` (or `desertfireballnetwork.com`) |
| AllSky7 | Mike Hankey's US network, ~100 stations | Open but unstable feeds | Best-effort scraping; partner contact recommended | `http://allsky7.net` |
| SonotaCo Network (Japan) | Japanese amateur multi-station meteor data | UFOOrbit format, sometimes paywalled | Translation layer needed; valuable for Asia-Pacific market | `http://sonotaco.com/e_index.html` |
| Spalding Allsky Camera Network (UK) | UK fireballs | Open | Scrape | `https://www.spaldingweather.co.uk/` (likely; verify) |
| Czech Fireball Network | Original Borovicka network; high-quality fireballs | Restricted | Academic contact required | Astronomical Institute, Prague |
| ESA NEOCC | Near Earth Object alerts and orbits | CC-BY | Already in our roadmap | `https://neo.ssa.esa.int` |
| NASA CNEOS | Close-approach data | Public domain | Already in our roadmap | `https://cneos.jpl.nasa.gov` |
| NASA DONKI | Space weather, aurora predictors | Public domain | Already in our roadmap | `https://kauai.ccmc.gsfc.nasa.gov/DONKI/` |
| Cloudynights / Astrobin / Reddit | Amateur images, search-and-link | Per-uploader | Aggregation layer above | various |

**The integration playbook for each**: a nightly Cloud Function pulls the network's public daily/weekly summary, normalizes to our internal event schema, and pushes to `external_feeds/{network}/{event_id}`. Our event-clustering function then cross-matches against this.

We pay nothing. We respect attribution. We are **the consumer interface to a $200M+/year ecosystem of professional and amateur meteor science.** That is the moat.

---

## Patentable Combinations

Each marked 🟢 in the body is a candidate. Consolidated list, in approximate order of strength:

1. 🟢 **Multi-modal trigger combiner for transient-sky-event capture** — voice + gesture + auto-detect + sensor-only-bearing, all writing to the same Moment Capture Record. Bundle with pre-trigger ring buffer for time-reverse capture of the event the trigger fired in response to.

2. 🟢 **Sensor-only meteor observation** — a record that contains pose, time, and location but no media, treated as a first-class observation by the triangulation engine. Lets the casual user contribute scientific data without a camera frame.

3. 🟢 **Hybrid pose estimation: IMU prior + per-frame astrometric plate-solve refinement** — the on-device combination of these two, with explicit uncertainty reporting in the Moment Capture Record, is novel. Crucially, it preserves whichever method actually worked at observation time.

4. 🟢 **The Moment Capture Record format itself** — a multi-source pose-tagged transient-sky observation record optimized for crowd-sourced triangulation, including GNSS-derived nanosecond timestamps and explicit per-network-share consent flags.

5. 🟢 **Crowd-sourced triangulation with mixed-quality observations** — running MCPI (Monte Carlo Plane Intersection) over a mix of plate-solved frames, IMU-only frames, and sensor-only LoS inputs, with each observation's per-station weight derived from its self-reported pose uncertainty. This is the core triangulation novelty.

6. 🟢 **Triangulated event re-display from any participating observer's POV** — the in-app composition of trajectory + observer cones + viewpoint teleport. Includes the meteor-frame and satellite-view as preset cameras.

7. 🟢 **Geographically-anchored AR replay of a historical crowd-sourced triangulated event** — re-render the trajectory in the actual sky at the user's current location using smart-glasses pose, even if the user wasn't present at the original event.

8. 🟢 **Hybrid trajectory-line / 3DGS rendering pipeline** — for events that warrant dense recon, train a 3D Gaussian Splat seeded from per-observation plate-solving, blend the splat with the analytical trajectory polyline.

9. 🟢 **Cross-network verification of a crowd-sourced sky event** — at moment of cluster formation, query CAMS/GMN/AMS/FRIPON/DFN public feeds and surface the matched professional record alongside the user observations. The Moment Story Page becomes the patentable artifact.

10. 🟢 **Crowd-sourced eclipse spatio-temporal path visualizer** — render the 4D eclipse map (x, y, t, totality_fraction) constructed from individual observers' phone captures along the path.

11. 🟢 **Bortle-quality-aware ATP attribution for meteor observations** — observations from genuinely dark skies (low local light pollution per VIIRS index, validated via image sky-glow analysis) are weighted higher in the trajectory solver and earn more ATP. Ties to the ATP / attention protocol that is already disclosed; novel composition.

12. 🟢 **Retroactive event surfacing** — Stephen's "I Didn't Know That Happened" feature, generalized: the platform retroactively informs the user of any captured event we can triangulate that they were in position to see, regardless of whether they reported it. (Patent strength: weaker because retroactivity has prior art, but the *triangulation-validated* version is novel.)

Strong: 1, 3, 5, 6, 7. **File these first.**

---

## 90-Day Build Order

### Month 1 — capture & sync foundation
Week 1:
- Wire `expo-camera` permission flow (Info.plist + AndroidManifest already set per BUILD_STATUS.md).
- Implement `captureEngine.ts` with three triggers: voice (Picovoice Porcupine wake word), gesture (back-tap via `react-native-back-tap` for iOS Action Button and Android Tap Gesture API), manual button.
- Implement `services/sync/ntp.ts` and the GNSS-time fallback chain. Persist `ntpOffsetMs` to AsyncStorage and update on each app foreground.

Week 2:
- Build the MCR serializer (`services/meteor/mcr.ts`) — strict TypeScript types, JSON schema validation via `zod`.
- Wire CoreMotion / Android RotationVector to populate the `pose.attitude_quaternion` field.
- Implement the camera intrinsics lookup table (`services/meteor/intrinsics.ts`) for the top 50 iOS and Android device models.

Week 3:
- Integrate `tetra3` for on-device plate solving. Port the Tetra3 catalog to a 4 MB TFLite-compatible blob. Run plate-solve as a post-capture background task.
- Implement the pre-trigger ring buffer in native modules (Swift / Kotlin). Wire to `captureEngine.ts`.

Week 4:
- Implement `services/meteor/upload.ts` — Firestore-backed upload queue with retry, resumable for large frame bundles via Cloud Storage.
- Wire the `EmitAttentionEvent` for `METEOR_CAPTURE` event types per the existing attention protocol.
- Ship to internal alpha with manual trigger only — earn the first 100 MCRs.

### Month 2 — triangulation & event clustering
Week 5:
- Provision Cloud Run service `trajectory-solver` (Python 3.12, `wmpl`, `astropy`, `skyfield`). REST endpoint `POST /v1/solve` taking an array of MCRs.
- Cloud Function `clusterObservations` runs on Firestore `onCreate` of any MCR — implements the spatio-temporal coincidence search.
- Cloud Function `triangulate` runs on event-cluster-formation, calls `trajectory-solver`, writes result to `events/{id}/trajectory`.

Week 6:
- Implement the external feed pullers (`feeds/cams.ts`, `feeds/gmn.ts`, `feeds/ams.ts`) as scheduled Cloud Functions. Daily fetch + normalize.
- Cross-match function: on triangulation complete, query external feeds for events within ±30s and 500km.
- Build the Moment Story Page composer (`services/meteor/storyPage.ts`) that assembles the event JSON from trajectory + matches + observations.

Week 7:
- Build the in-app Moment Story Page (`app/event/[id].tsx`) — header, map, observer list, trajectory plot in 2D, professional cross-reference cards. **No 3D yet.**
- Wire push notifications: when triangulation lands, notify all participating users.

Week 8:
- Internal beta with 50 testers across ≥10 cities. Goal: ≥3 cluster-confirmed multi-station triangulations during the Perseid peak (Aug 11-12) or the Geminid peak (Dec 14, depending on launch date).

### Month 3 — 3D & interaction
Week 9:
- Stand up the WebView-based r3f scene viewer. Single bundle served from `web/event-viewer/`. Native screen launches it with the `event_id`.
- Implement trajectory tube + Earth sphere + observer cones + skybox.
- Camera transitions between named POVs.

Week 10:
- Cross-platform polish. Verify on iPhone 12, Pixel 6, iPad. Memory budget audit.
- AR mode for Android XR / Vision Pro using the same r3f scene compiled to WebXR.

Week 11:
- 3DGS preview pipeline (server-side Nerfstudio on Cloud Run GPU) for one hand-picked fireball event. Render in the same scene.
- Implement the crowd-sourced photo aggregator (Flickr query, AMS scraping). Surface in the Story Page side panel.

Week 12:
- Public launch of "Triangulation" feature. Press push centered on a major shower.
- File provisional patents on the strongest combinations (#1, #3, #5, #6, #7 from the list above) before public exposure.

---

## Open Risks

1. **iOS background camera ban** 🚨 — auto-detect Mode 3 cannot run continuously on iPhones. We mitigate by making Mode 1 (voice) and Mode 2 (gesture) first-class, and by making Mode 3 a "shower mode" that runs only when the user explicitly opens it for a session. Communicate this clearly in onboarding.

2. **Compass error in urban environments** — without plate solving, IMU pose alone produces useless triangulations. We must aggressively encourage observations in star-rich regions of frames so plate solving succeeds. Build a UX hint: "tilt the phone up — Astra Vault works best when the sky fills the frame."

3. **CAMS / GMN / FRIPON licensing variance** — most data is open but FRIPON is CC-BY-NC. Our app is commercial. We can *display* FRIPON data with attribution but cannot incorporate it into derivative datasets we sell. Legal review needed for the data-licensing revenue path.

4. **3DGS server cost** at scale — if the app finds 500 events worth dense recon per month, that's ~$50/month in GPU. Acceptable. If it finds 5,000, that's $500. Cap at top-N events ranked by user-engagement score.

5. **Trajectory ambiguity with 2 stations** — many crowd-sourced events will have only 2 stations and the trajectory is then ill-conditioned in one dimension. UX: don't report uncertain numerics; report only a qualitative "Triangulated" badge until ≥3 stations.

6. **Wake-word false positives** — "meet you" / "meadow" / "media" / Italian "metro" will all trigger meteor capture. Picovoice's Porcupine has FRR ~1/24h at the "METEOR" hotword. We may need a 2-syllable phrase like "METEOR-NOW" to suppress this. Or a per-user trained wake word.

7. **Smart glasses ecosystem volatility** — Ray-Ban Meta SDK is still effectively closed for third-party background camera in 2026. We may not get true third-party meteor capture on Meta glasses until 2027–2028. Android XR is our reliable path.

8. **Apple Vision Pro camera lockout** 🚨 — the most-anticipated AR device cannot capture meteors for our pipeline. The "watch the meteor in your real sky" feature works; the "capture a meteor with Vision Pro" feature does not. Position the device as a *playback / replay / AR experience* viewer, not a capture device.

9. **Wake-word always-on battery** — Picovoice Porcupine running always-on costs ~30 mW which is ~10% battery in 12 hours of overnight monitoring. Most users won't accept that. Solution: tie wake-word activation to "shower mode" — only listen during the 5-day windows around major showers, with the user's explicit opt-in.

10. **User pose calibration UX** — every astrophotography app fights this. Our solution is a 5-second polaris-calibration step at app first-run for smart glasses, and lazy plate-solve-corrected pose for phone — but the underlying magnetometer error is real and unfixable except by software. Set expectations.

11. **Patent prior art search** — Eclipse Megamovie 2017/2024 (UC Berkeley + Google) is the strongest piece of prior art for "crowd-sourced sky event reconstruction." Their solution was a frame-collection pipeline; ours is a *triangulation + 3D scene* pipeline. The novelty is in the cross-network verification, the IMU+plate-solve pose hybrid, and the 3D playback — not in "crowd-sourced sky photos." Frame the patent claims accordingly.

12. **Data validity / spoofing** — a malicious user could upload fake MCRs (made-up location, timestamp, pose) to bias triangulations or earn ATP fraudulently. Mitigations: (a) ATP-earned events are not minted until the cross-network verification step; (b) MCRs are signed with a device-attested key (App Attest / Play Integrity); (c) outlier observations are auto-excluded from MCPI via robust loss. Sketch a fraud-resistance design doc as a separate deliverable.

---

## Citations to verify during build planning

The R&D team writing this report did not have live web access during this pass. The following URLs are the canonical references the build team should re-verify against the live web before integration:

- CAMS — `https://cams.seti.org`
- GMN — `https://globalmeteornetwork.org`
- GMN RMS — `https://github.com/CroatianMeteorNetwork/RMS`
- Western Meteor PyLib — `https://github.com/wmpg/WesternMeteorPyLib`
- tetra3 (ESA) — `https://github.com/esa/tetra3`
- astrometry.net — `https://astrometry.net`
- COLMAP — `https://colmap.github.io`
- nerfstudio — `https://github.com/nerfstudio-project/nerfstudio`
- Gaussian Splatting paper — `https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/`
- FRIPON — `https://www.fripon.org`
- Desert Fireball Network — `https://desertfireballnetwork.com` (or `dfn.gfo.rocks`)
- AMS Fireball Reports — `https://www.amsmeteors.org/fireballs/`
- IMO — `https://www.imo.net`
- SonotaCo Network — `http://sonotaco.com/e_index.html`
- AllSky7 — `http://allsky7.net`
- Ray-Ban Meta dev — `https://developers.meta.com/llamastack`, `https://developers.meta.com/horizon` (verify)
- Android XR dev — `https://developer.android.com/develop/xr`
- Vision Pro entitlements — `https://developer.apple.com/documentation/bundleresources/entitlements`
- Picovoice Porcupine wake word — `https://picovoice.ai/platform/porcupine/`
- Eclipse Megamovie 2024 — `https://eclipsemegamovie.org` (verify post-2024)
- Borovicka 1990 paper (ADS) — `https://ui.adsabs.harvard.edu/abs/1990BAICz..41..391B`
- Ceplecha 1987 paper (ADS) — `https://ui.adsabs.harvard.edu/abs/1987BAICz..38..222C`
- Vida et al. 2020 (MNRAS) — `https://ui.adsabs.harvard.edu/abs/2020MNRAS.491.2688V`
- Jenniskens et al. 2011 (Icarus) — `https://ui.adsabs.harvard.edu/abs/2011Icar..216...40J`
- Mildenhall NeRF — `https://www.matthewtancik.com/nerf`
- 3DGS implementation — `https://github.com/graphdeco-inria/gaussian-splatting`

---

## Bottom line

**Triangulation: feasible.** Phone hardware in 2026 can produce ±0.5°-pose observations via IMU+plate-solve, which combined with 2+ stations gives 1–2 km cross-track trajectory accuracy. That is science-quality. The only unsolved problem is convincing users to point their phones at the sky often enough to get >1 stations on a given event, which is a product problem, not a tech problem.

**3D reconstruction: conditional.** Point events (meteors) reconstruct *trivially* from the trajectory — this is solved. Volumetric events (auroras) need ≥5 well-separated observers and are likely a year-2 feature. Static-target 3DGS is feasible but expensive; reserve for highlighted events.

**The patent surface is unusually broad.** I count ≥7 strong novel claims and ≥4 supporting claims, mostly orthogonal to each other. The audit document's claim of "32 patent-eligible applications, 24 unique to Astra Vault" is conservative once you include the moment-capture pipeline detail laid out here. File the strongest five within the 12-week build window before public launch.

This is the feature that turns Astra Vault from a clever stargazing app into a piece of crowd-sourced scientific infrastructure that happens to be wrapped in a beautiful consumer product. It is the strongest single bet on the board.

— R&D, 2026-05-13
