import * as Crypto from 'expo-crypto';
import type { EventType, QualityTier } from './eventRegistry';
import {
  buildAttentionPayload,
  serializePayload,
  type AttentionPayload,
} from './payloadBuilder';

export interface AttentionHashRecord {
  hash: string;
  event_type: string;
  timestamp: number;
  game_id: string;
  quality_tier: QualityTier;
  duration_ms: number;
  interaction_count: number;
  session_id: string;
  user_uid: string;
  synced: boolean;
  spent: boolean;
}

export const sha256 = async (input: string): Promise<string> =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input);

export const generateAttentionHash = async (payload: AttentionPayload): Promise<string> =>
  sha256(serializePayload(payload));

export const recordAttentionEvent = async (params: {
  eventType: EventType | string;
  durationMs: number;
  interactionCount: number;
  qualityTier: QualityTier;
}): Promise<AttentionHashRecord> => {
  const payload = buildAttentionPayload(params);
  const hash = await generateAttentionHash(payload);
  return {
    hash,
    event_type: payload.event_type,
    timestamp: payload.timestamp,
    game_id: payload.game_id,
    quality_tier: payload.quality_tier,
    duration_ms: payload.duration_ms,
    interaction_count: payload.interaction_count,
    session_id: payload.session_id,
    user_uid: payload.user_uid,
    synced: false,
    spent: false,
  };
};
