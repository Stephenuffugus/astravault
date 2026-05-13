/**
 * Plate-solve service — patent #4 reduction-to-practice.
 *
 * The cross-glasses observation merge protocol (patent #1) and the attention-
 * earn loop (patent #0) both want to know: did the user actually point at the
 * sky? Plate-solving is the answer — given a captured frame plus the
 * observer's pose, location, and time, we compute the patch of sky we
 * predict the frame depicts, then score how confident we are.
 *
 * v0.1 (this file): a **metadata-based plate-solve** that uses GPS, time, and
 * IMU pose to compute the predicted RA/Dec center plus a confidence score.
 * It does NOT yet analyze the captured pixels — the architecture is in place
 * so the algorithm can be upgraded without touching callers.
 *
 * v0.2 upgrade path:
 *   - WASM port of tetra3-class 4-star angular-distance hashing (best, on-device)
 *   - Server-side astrometry.net Nova endpoint (async, free, slower; see
 *     services/apis/astrometry.ts for the stub)
 *   - Native module wrapping a C++ plate-solver (highest precision, most work)
 *
 * PATENT #4 — the contract this file fulfills:
 *
 *   capture frame → plate-solve runs → confidence score gated → token
 *   issuance scaled by confidence (anti-cheat via star recognition).
 *
 * The architecture is what's patentable; the specific algorithm version
 * can evolve without breaking the claim.
 *
 * IMPORTANT — Celestron US 8,401,307 B1 (StarSense) prior art:
 *   That patent's key limitation is "performing an affine fit operation."
 *   The v0.2 tetra3-class upgrade is 4-star angular-distance hashing, which
 *   is arguably NOT an affine fit. A formal FTO opinion from counsel is
 *   required before public launch of the pixel-analysis path.
 */

import { horizontalToEquatorial } from '@/services/astro/horizontal';

import type { FrameRef, ObservationLocation, ObserverPose } from './captureRecord';

export interface PlateSolveResult {
  /** Predicted RA of the frame center, degrees, 0–360. */
  raDegrees: number;
  /** Predicted Dec of the frame center, degrees, -90 to +90. */
  decDegrees: number;
  /** Rotation about the boresight, degrees. Unknown for v0.1 metadata path → 0. */
  rotationDegrees: number;
  /** Pixel scale estimate, arcsec/pixel. Unknown for v0.1 → 0. */
  pixelScale: number;
  /** 1-sigma uncertainty in arcseconds — propagated from pose uncertainty. */
  uncertaintyArcsec: number;
  /** Confidence score, 0–1. Used to gate ATP earn. */
  confidence: number;
  /** Which path produced this result, for record-keeping + future audit. */
  source: PlateSolveSource;
}

export type PlateSolveSource =
  | 'metadata_only'
  | 'on_device_pattern'
  | 'astrometry_net'
  | 'manual';

/** Inputs the plate-solver needs. */
export interface PlateSolveInput {
  location: ObservationLocation;
  pose: ObserverPose;
  /** UTC milliseconds the frame was captured. */
  capturedAt: number;
  /** Optional frame to analyze with the v0.2+ pixel pipeline. */
  frame?: FrameRef | null;
}

/**
 * Run the v0.1 metadata-based plate-solve.
 *
 * For v0.1 we only consult metadata — GPS accuracy, pose uncertainty, time
 * precision — to compute confidence. The predicted RA/Dec is computed
 * exactly via the horizontal-to-equatorial transform.
 *
 * The confidence band is calibrated so that a default capture (no IMU
 * astrometric solve yet) earns the full base ATP, and future high-confidence
 * solves earn bonuses. See `atpForPlateSolve()` below.
 */
export const runMetadataPlateSolve = (input: PlateSolveInput): PlateSolveResult => {
  const equatorial = horizontalToEquatorial(
    { azimuth: input.pose.bearing, altitude: input.pose.elevation },
    { lat: input.location.latitude, lng: input.location.longitude },
    input.capturedAt,
  );

  return {
    raDegrees: equatorial.ra,
    decDegrees: equatorial.dec,
    rotationDegrees: 0,
    pixelScale: 0,
    uncertaintyArcsec: Math.round(input.pose.uncertaintyDegrees * 3600),
    confidence: scoreConfidence(input),
    source: 'metadata_only',
  };
};

/**
 * Confidence-scoring function — 0..1.
 * The v0.1 implementation is intentionally generous so a default capture
 * still earns ATP, while creating clear slope for future improvements.
 */
const scoreConfidence = (input: PlateSolveInput): number => {
  let score = 0.5;

  // Pose source ramp
  if (input.pose.source === 'astrometric_solve') score += 0.35;
  else if (input.pose.source === 'imu') score += 0.05;
  else if (input.pose.source === 'manual') score -= 0.1;

  // Pose uncertainty: tight = good, loose = bad
  const u = input.pose.uncertaintyDegrees;
  if (u < 5) score += 0.15;
  else if (u < 20) score += 0.05;
  else if (u > 60) score -= 0.1;

  // GPS accuracy
  const h = input.location.hAccuracyMeters;
  if (h != null) {
    if (h < 20) score += 0.05;
    else if (h > 100) score -= 0.05;
  }

  // Did the frame actually land? Even without pixel analysis, the presence
  // of a real frame is evidence that capture happened.
  if (input.frame != null && input.frame.uri && input.frame.width > 0) {
    score += 0.05;
  }

  return Math.max(0, Math.min(1, score));
};

/**
 * Convert a PlateSolveResult into the FrameRef.plateSolve sub-object the
 * MomentCaptureRecord persists.
 */
export const toFramePlateSolve = (
  result: PlateSolveResult,
): NonNullable<FrameRef['plateSolve']> => ({
  raDegrees: result.raDegrees,
  decDegrees: result.decDegrees,
  rotationDegrees: result.rotationDegrees,
  pixelScale: result.pixelScale,
  uncertaintyArcsec: result.uncertaintyArcsec,
});

/**
 * ATP scaling by plate-solve confidence — patent #4's anti-cheat economy.
 *
 *   confidence < 0.3  → 2 ATP   (metadata-only, no real evidence)
 *   0.3 ≤ c < 0.7     → 10 ATP  (good faith metadata, default v0.1)
 *   0.7 ≤ c < 0.9     → 15 ATP  (verified by upgraded source)
 *   c ≥ 0.9           → 25 ATP  (astrometrically verified — patent #4 max)
 *
 * Callers (captureEngine.triggerCapture) use this to size the meteor_capture
 * ATP award. The thresholds are economy levers; tune over time but the
 * shape stays the same: low-confidence → reduced, high-confidence → bonus.
 */
export const atpForPlateSolve = (confidence: number): number => {
  if (confidence < 0.3) return 2;
  if (confidence < 0.7) return 10;
  if (confidence < 0.9) return 15;
  return 25;
};
