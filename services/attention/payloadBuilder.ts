import Constants from 'expo-constants';
import type { EventType, QualityTier } from './eventRegistry';
import { generateNonce, getSessionId } from './session';

export interface AttentionPayload {
  event_type: EventType | string;
  timestamp: number;
  session_id: string;
  duration_ms: number;
  interaction_count: number;
  quality_tier: QualityTier;
  game_id: string;
  user_uid: string;
  nonce: string;
}

const GAME_ID: string = (Constants.expoConfig?.extra?.gameId as string | undefined) ?? 'astra_vault';

/**
 * Get the current Firebase Auth UID, or `"anonymous"` until auth is wired.
 * The stub here keeps the protocol shape correct so hashes are forward-compatible.
 */
let getCurrentUid: () => string = () => 'anonymous';

export const setUidProvider = (provider: () => string): void => {
  getCurrentUid = provider;
};

export const buildAttentionPayload = (params: {
  eventType: EventType | string;
  durationMs: number;
  interactionCount: number;
  qualityTier: QualityTier;
}): AttentionPayload => ({
  event_type: params.eventType,
  timestamp: Date.now(),
  session_id: getSessionId(),
  duration_ms: params.durationMs,
  interaction_count: params.interactionCount,
  quality_tier: params.qualityTier,
  game_id: GAME_ID,
  user_uid: getCurrentUid(),
  nonce: generateNonce(),
});

/** Canonical alphabetic-key serialization — required for deterministic hashing. */
export const serializePayload = (payload: AttentionPayload): string =>
  JSON.stringify(payload, Object.keys(payload).sort() as (keyof AttentionPayload)[]);
