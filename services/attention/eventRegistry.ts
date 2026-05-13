/**
 * Registered Astra Vault attention event types.
 * Source: ARCHITECTURE.md "Astra Vault Event Types (registered with Director)".
 * Cross-game ecosystem types (from ATTENTION_PROTOCOL_SPEC-1.md) are listed
 * here too — they generate the same hashes regardless of game.
 */

export type QualityTier = 'deep' | 'active' | 'passive' | 'background';

export interface EventTypeMeta {
  trigger: string;
  qualityTier: QualityTier;
  atpRange: readonly [number, number];
}

export const EVENT_TYPES = {
  // ─── Astra Vault gameplay
  sky_scan_session: { trigger: '3 min active scanning', qualityTier: 'active', atpRange: [10, 10] },
  object_inspect: { trigger: '10+ sec reading object detail', qualityTier: 'deep', atpRange: [5, 5] },
  collection_bonus: { trigger: 'Collecting an object', qualityTier: 'deep', atpRange: [20, 100] },
  set_complete: { trigger: 'Completing a category/rarity set', qualityTier: 'deep', atpRange: [50, 50] },
  event_track: { trigger: 'Committing to track a future event', qualityTier: 'active', atpRange: [10, 10] },
  event_observe: { trigger: 'Observing during live event window', qualityTier: 'deep', atpRange: [50, 200] },
  lesson_complete: { trigger: 'Passing a quiz', qualityTier: 'deep', atpRange: [15, 15] },
  meteor_capture: { trigger: 'Voice/gesture/auto meteor capture', qualityTier: 'deep', atpRange: [10, 50] },
  meteor_crossref: { trigger: 'Cross-reference match found', qualityTier: 'deep', atpRange: [25, 25] },
  bortle_report: { trigger: 'Submitting light pollution rating', qualityTier: 'deep', atpRange: [30, 30] },
  obs_timer_session: { trigger: 'Completing observation timer', qualityTier: 'deep', atpRange: [2, 2] },

  // ─── Cross-game ambient
  idle_drip: { trigger: '5 min foreground visibility', qualityTier: 'passive', atpRange: [1, 1] },
  tab_return: { trigger: 'Returning to app', qualityTier: 'active', atpRange: [1, 8] },
  ambient_mode: { trigger: '3 min screensaver mode', qualityTier: 'passive', atpRange: [1, 1] },
} as const satisfies Record<string, EventTypeMeta>;

export type EventType = keyof typeof EVENT_TYPES;

export const isRegisteredEventType = (type: string): type is EventType =>
  Object.prototype.hasOwnProperty.call(EVENT_TYPES, type);
