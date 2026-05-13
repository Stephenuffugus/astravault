export * from './eventRegistry';
export * from './session';
export * from './payloadBuilder';
export * from './hashPipeline';
export * from './focusScore';
export * from './vaultSync';

import type { EventType, QualityTier } from './eventRegistry';
import { recordAttentionEvent, type AttentionHashRecord } from './hashPipeline';
import { EVENT_TYPES } from './eventRegistry';
import { appendHash } from './vaultSync';

/**
 * High-level helper for screens: emit an attention event, store its hash,
 * and return the record. Quality tier defaults to the event's registered tier.
 */
export const emitAttentionEvent = async (params: {
  eventType: EventType;
  durationMs?: number;
  interactionCount?: number;
  qualityTier?: QualityTier;
}): Promise<AttentionHashRecord> => {
  const meta = EVENT_TYPES[params.eventType];
  const record = await recordAttentionEvent({
    eventType: params.eventType,
    durationMs: params.durationMs ?? 0,
    interactionCount: params.interactionCount ?? 0,
    qualityTier: params.qualityTier ?? meta.qualityTier,
  });
  await appendHash(record);
  return record;
};
