/**
 * Moment Capture Record (MCR) schema.
 *
 * This is the on-device representation of a single transient-sky-event observation
 * (meteor, fireball, aurora, eclipse, ISS pass, ...). It is the data structure the
 * server-side cross-glasses observation merge protocol consumes: many MCRs from
 * many independent observers, coalesced by the trajectory solver into a single
 * triangulated event.
 *
 * The full wire schema (with GNSS nanoseconds, camera intrinsics, plate-solve
 * confidence, consent flags, etc.) is sketched in
 * `research/moment-capture-glasses.md` under "Observation packaging". This file
 * codifies the v0.1 subset the client app actually owns today; later milestones
 * will extend it without breaking the existing fields.
 *
 * Source: research/moment-capture-glasses.md §"Observation packaging"
 *         research/SYNTHESIS.md action #4
 */

import * as Crypto from 'expo-crypto';

import type { PlateSolveResult } from './plateSolve';

/** UTC milliseconds, anchored to GNSS-derived clock when available. */
export type UTCMillis = number;

export interface ObserverPose {
  /** ENU bearing in degrees, 0-360. North = 0, East = 90. */
  bearing: number;
  /** Elevation above horizon in degrees, -90 to +90. */
  elevation: number;
  /** Roll about the boresight in degrees. Often unknown for handheld phones. */
  roll: number | null;
  /** Method used to estimate this pose. */
  source: 'imu' | 'astrometric_solve' | 'manual';
  /** 1-sigma uncertainty in degrees. */
  uncertaintyDegrees: number;
}

export interface ObservationLocation {
  latitude: number;
  longitude: number;
  altitudeMeters: number | null;
  /** GPS horizontal accuracy estimate in meters. */
  hAccuracyMeters: number | null;
  /** "gps_fix" | "network" | "manual" — how we got this fix. */
  source: 'gps_fix' | 'network' | 'manual';
}

export interface FrameRef {
  /** Storage URL or local content:// uri. Empty string = not yet uploaded. */
  uri: string;
  /** Frame capture UTC time. */
  capturedAt: UTCMillis;
  /** Width, height in pixels. */
  width: number;
  height: number;
  /** Optional plate-solved center: RA + Dec in degrees, plus uncertainty. */
  plateSolve?: {
    raDegrees: number;
    decDegrees: number;
    rotationDegrees: number;
    pixelScale: number; // arcsec/pixel
    uncertaintyArcsec: number;
  };
}

export type CaptureMode = 'voice' | 'gesture' | 'auto_detect' | 'manual_tap';

export type MomentEventType =
  | 'meteor'
  | 'fireball'
  | 'aurora'
  | 'eclipse'
  | 'iss_pass'
  | 'unknown';

export interface CrossReferenceState {
  camsMatch: boolean;
  gmnMatch: boolean;
  amsMatch: boolean;
  /** SonotaCo Network (Japan) confirmed this observation. */
  sonotacoMatch: boolean;
  /** Count of other Astra Vault observers that matched this event. */
  matchedObservers: number;
  /** e.g., "Comet Swift-Tuttle". */
  parentBody: string | null;
  /** e.g., "Perseids". */
  showerName: string | null;
  velocityKmS: number | null;
  geocentricRadiantRa: number | null;
  geocentricRadiantDec: number | null;
}

export interface MomentCaptureRecord {
  /** Stable observation ID; client-generated, never mutated. */
  id: string;
  /** What kind of event the user thinks they captured. */
  eventType: MomentEventType;
  /** Trigger time — the instant the user said "METEOR" or the auto-detector fired. */
  triggerAt: UTCMillis;
  /** Optional buffered video window — [start, end] in UTC ms relative to triggerAt. */
  bufferWindow: { start: UTCMillis; end: UTCMillis } | null;
  /** The observation location. */
  location: ObservationLocation;
  /** Best-known pose at triggerAt. */
  pose: ObserverPose;
  /** Captured frames, if any. Empty array when no usable image (still valid as a witness record). */
  frames: FrameRef[];
  /** Capture mode that produced this record. */
  captureMode: CaptureMode;
  /** Free-form note the user attached. */
  note: string | null;
  /**
   * Anonymous device fingerprint — SHA-256 of {deviceModel, OS, appVersion} concatenation.
   * Preserves user privacy (no PII) while letting the merge protocol disambiguate observations.
   */
  observerFingerprint: string;
  /** Hash of the attention event that earned ATP for this capture. */
  attentionHash: string | null;
  /**
   * Plate-solve result — predicted RA/Dec of frame center plus confidence
   * score used to gate ATP earn (patent #4). v0.1 is metadata-based;
   * future versions populate this from pixel-analysis or astrometry.net.
   */
  plateSolve: PlateSolveResult | null;
  /** Cross-reference state — populated by the server when match candidates appear. */
  crossReferences: CrossReferenceState;
  /** When this record was created and last touched. */
  createdAt: UTCMillis;
  updatedAt: UTCMillis;
  /** Whether this record has been synced to the user's vault. */
  synced: boolean;
}

/** Server wire payload for the cross-reference matching endpoint. */
export interface MatchRequest {
  observationId: string;
  triggerAt: UTCMillis;
  location: { lat: number; lng: number; alt: number | null };
  pose: { bearing: number; elevation: number; uncertainty: number };
  observerFingerprint: string;
}

const emptyCrossReferences = (): CrossReferenceState => ({
  camsMatch: false,
  gmnMatch: false,
  amsMatch: false,
  sonotacoMatch: false,
  matchedObservers: 0,
  parentBody: null,
  showerName: null,
  velocityKmS: null,
  geocentricRadiantRa: null,
  geocentricRadiantDec: null,
});

/** Generate an opaque, client-side observation ID (URL-safe, ~144 bits of entropy). */
const generateObservationId = (): string => {
  const bytes = Crypto.getRandomBytes(18);
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i] ?? 0;
    out += b.toString(16).padStart(2, '0');
  }
  return `obs_${Date.now().toString(36)}_${out}`;
};

/** Factory: creates a new record with sensible defaults and a fresh ID. */
export const newCaptureRecord = (params: {
  eventType: MomentEventType;
  triggerAt?: UTCMillis;
  captureMode: CaptureMode;
  location: ObservationLocation;
  pose: ObserverPose;
  observerFingerprint: string;
}): MomentCaptureRecord => {
  const now: UTCMillis = Date.now();
  const triggerAt = params.triggerAt ?? now;
  return {
    id: generateObservationId(),
    eventType: params.eventType,
    triggerAt,
    bufferWindow: null,
    location: params.location,
    pose: params.pose,
    frames: [],
    captureMode: params.captureMode,
    note: null,
    observerFingerprint: params.observerFingerprint,
    attentionHash: null,
    plateSolve: null,
    crossReferences: emptyCrossReferences(),
    createdAt: now,
    updatedAt: now,
    synced: false,
  };
};

/** Compose the wire payload sent for cross-reference matching. */
export const toMatchRequest = (record: MomentCaptureRecord): MatchRequest => ({
  observationId: record.id,
  triggerAt: record.triggerAt,
  location: {
    lat: record.location.latitude,
    lng: record.location.longitude,
    alt: record.location.altitudeMeters,
  },
  pose: {
    bearing: record.pose.bearing,
    elevation: record.pose.elevation,
    uncertainty: record.pose.uncertaintyDegrees,
  },
  observerFingerprint: record.observerFingerprint,
});
