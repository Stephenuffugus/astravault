/**
 * Capture engine — scaffolding only.
 *
 * Public API the rest of the app calls against today. In v0.1 voice / gesture /
 * auto-detect triggers are not wired (no microphone, no frame buffer); they're
 * future milestones that will replace the stub bodies below without changing
 * the surface. The `triggerCapture()` path is real: it builds a Moment Capture
 * Record, appends it to the store, emits an attention event, and earns ATP.
 *
 * Source: research/moment-capture-glasses.md §"Capture triggers"
 *         research/SYNTHESIS.md action #4
 */

import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';

import { emitAttentionEvent } from '@/services/attention';
import { gmnCrossReferenceFor } from '@/services/apis/gmnNetwork';
import { sonotacoCrossReferenceFor } from '@/services/apis/sonotacoNetwork';
import { requestLocation } from '@/services/location';
import { useAtp } from '@/stores/useAtp';
import { useMeteorCaptures } from '@/stores/useMeteorCaptures';

import {
  newCaptureRecord,
  type CaptureMode,
  type CrossReferenceState,
  type MomentCaptureRecord,
  type ObservationLocation,
  type ObserverPose,
} from './captureRecord';

export type CaptureTriggerListener = (mode: CaptureMode) => void | Promise<void>;

export interface CaptureEngineConfig {
  /** Wake word phrases that fire a voice trigger. */
  wakeWords: string[];
  /** Whether voice listening is currently active. */
  voiceEnabled: boolean;
  /** Whether on-device auto-detect is active (phones only). */
  autoDetectEnabled: boolean;
  /** Pre-trigger buffer window in ms. Defaults to 3000 (3 seconds before the trigger). */
  preBufferMs: number;
  /** Post-trigger buffer window in ms. Defaults to 2000. */
  postBufferMs: number;
}

export const DEFAULT_CONFIG: CaptureEngineConfig = {
  wakeWords: ['meteor', 'star'],
  voiceEnabled: false,
  autoDetectEnabled: false,
  preBufferMs: 3000,
  postBufferMs: 2000,
};

/** Active configuration. Mutated by initCaptureEngine(). */
let activeConfig: CaptureEngineConfig = { ...DEFAULT_CONFIG };

/** Subscriber set. Listeners fire whenever a trigger lands, regardless of mode. */
const listeners = new Set<CaptureTriggerListener>();

/** Default ATP award for a manual / voice / gesture capture. */
const CAPTURE_ATP = 10;

/** Subscribe to capture triggers. Returns an unsubscribe function. */
export const onCaptureTrigger = (listener: CaptureTriggerListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = async (mode: CaptureMode): Promise<void> => {
  for (const listener of listeners) {
    try {
      await listener(mode);
    } catch {
      // Listener errors must never break the capture path.
    }
  }
};

/** Default observer pose for v0.1 — IMU integration lands in a later milestone. */
const defaultPose = (): ObserverPose => ({
  bearing: 0,
  elevation: 45,
  roll: null,
  source: 'imu',
  uncertaintyDegrees: 90,
});

/** Manually fire a capture trigger (used by the tap-to-capture button and stubbed triggers). */
export const triggerCapture = async (
  mode: CaptureMode,
): Promise<MomentCaptureRecord | null> => {
  const loc = await requestLocation();
  if (!loc) {
    // Without a location fix the observation has no scientific value;
    // bail rather than create a useless record.
    await notifyListeners(mode);
    return null;
  }

  const observerFingerprint = await computeObserverFingerprint();

  const location: ObservationLocation = {
    latitude: loc.latitude,
    longitude: loc.longitude,
    altitudeMeters: loc.altitude,
    hAccuracyMeters: null,
    source: 'gps_fix',
  };

  const record = newCaptureRecord({
    eventType: 'meteor',
    captureMode: mode,
    location,
    pose: defaultPose(),
    observerFingerprint,
  });

  // Emit the attention hash FIRST so we can stamp it onto the record before
  // persisting (the merge protocol pairs observations to ATP events by hash).
  const attention = await emitAttentionEvent({
    eventType: 'meteor_capture',
    durationMs: 0,
    interactionCount: 1,
    qualityTier: 'deep',
  });
  record.attentionHash = attention.hash;

  await useMeteorCaptures.getState().append(record);

  await useAtp.getState().earn({
    eventType: 'meteor_capture',
    amount: CAPTURE_ATP,
    durationMs: 0,
    interactionCount: 1,
    qualityTier: 'deep',
  });

  // Cross-reference is fire-and-forget — the user gets immediate capture feedback
  // and the GMN match (when it lands) materializes via the store update.
  void kickoffCrossReference(record);

  await notifyListeners(mode);
  return record;
};

/**
 * Background cross-reference — queries GMN and SonotaCo in parallel, merges
 * the partial results into a single `crossReferences` patch, and awards the
 * meteor_crossref ATP bonus when either source confirms the observation.
 *
 * Either side failing is non-fatal: the merge simply records that source as
 * "no match" and keeps going. The capture path NEVER throws upward.
 */
const kickoffCrossReference = async (record: MomentCaptureRecord): Promise<void> => {
  try {
    const query = {
      triggerAt: record.triggerAt,
      location: {
        latitude: record.location.latitude,
        longitude: record.location.longitude,
      },
      pose: { bearing: record.pose.bearing, elevation: record.pose.elevation },
    };

    const [gmnResult, sonotacoResult] = await Promise.all([
      gmnCrossReferenceFor(query).catch(() => null),
      sonotacoCrossReferenceFor(query).catch(() => null),
    ]);

    // Merge: gmnMatch and sonotacoMatch are independent booleans; observer
    // counts add; for the headline shower/parent/velocity fields, prefer GMN
    // (CC BY 4.0, larger global station footprint), fall back to SonotaCo.
    const merged: Partial<CrossReferenceState> = {
      gmnMatch: gmnResult?.gmnMatch ?? false,
      sonotacoMatch: sonotacoResult?.sonotacoMatch ?? false,
      matchedObservers:
        (gmnResult?.matchedObservers ?? 0) + (sonotacoResult?.matchedObservers ?? 0),
      parentBody: gmnResult?.parentBody ?? sonotacoResult?.parentBody ?? null,
      showerName: gmnResult?.showerName ?? sonotacoResult?.showerName ?? null,
      velocityKmS: gmnResult?.velocityKmS ?? sonotacoResult?.velocityKmS ?? null,
      geocentricRadiantRa:
        gmnResult?.geocentricRadiantRa ?? sonotacoResult?.geocentricRadiantRa ?? null,
      geocentricRadiantDec:
        gmnResult?.geocentricRadiantDec ?? sonotacoResult?.geocentricRadiantDec ?? null,
    };

    await useMeteorCaptures.getState().updateCrossRef(record.id, merged);

    if (merged.gmnMatch || merged.sonotacoMatch) {
      // Bonus ATP per protocol spec — meteor_crossref event when ANY source
      // confirms the user's observation. We only emit once per capture even
      // if both sources match, since the user only saw one meteor.
      await useAtp.getState().earn({
        eventType: 'meteor_crossref',
        amount: 25,
        durationMs: 0,
        interactionCount: 0,
        qualityTier: 'deep',
      });
    }
  } catch {
    // Cross-reference failures should never break the capture path.
  }
};

/**
 * Initialize the engine — request permissions, start voice listening if enabled, etc.
 * In v0.1 this is a stub that succeeds without doing anything; future versions wire to
 * expo-av (for voice) and expo-camera (for frame buffer).
 */
export const initCaptureEngine = async (
  config?: Partial<CaptureEngineConfig>,
): Promise<void> => {
  activeConfig = { ...DEFAULT_CONFIG, ...(config ?? {}) };
  // TODO(milestone-2): if activeConfig.voiceEnabled, wire Picovoice Porcupine wake-word listener.
  // TODO(milestone-2): if activeConfig.autoDetectEnabled, spin up the streak detector.
  // TODO(milestone-2): allocate the pre/post-buffer ring buffer via expo-camera.
};

/** Inspect the active config. Useful for diagnostics / settings UI. */
export const getCaptureConfig = (): CaptureEngineConfig => ({ ...activeConfig });

/**
 * Generate a stable, privacy-safe observer fingerprint from device + app metadata.
 * Uses SHA-256 over {Constants.platform, expo version, app version}. NO personal data.
 */
export const computeObserverFingerprint = async (): Promise<string> => {
  const platformParts: string[] = [];
  const platform = Constants.platform;
  if (platform) {
    if (platform.ios) {
      const model = (platform.ios as { model?: string }).model ?? 'ios';
      platformParts.push(`ios:${model}`);
      platformParts.push(`v:${platform.ios.platform ?? 'unknown'}`);
    } else if (platform.android) {
      platformParts.push('android');
    } else if (platform.web) {
      platformParts.push('web');
    }
  }
  const expoVersion = Constants.expoVersion ?? 'unknown';
  const appVersion = Constants.expoConfig?.version ?? '0.0.0';
  const bundle = `${platformParts.join('|') || 'unknown'}|expo:${expoVersion}|app:${appVersion}`;
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, bundle);
};
