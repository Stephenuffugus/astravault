import type { QualityTier } from './eventRegistry';

export const TIER_WEIGHT: Record<QualityTier, number> = {
  deep: 1.0,
  active: 0.7,
  passive: 0.3,
  background: 0.1,
};

export const TIER_HASH_MULTIPLIER: Record<QualityTier, number> = {
  deep: 2.0,
  active: 1.0,
  passive: 0.5,
  background: 0.25,
};

export interface TierMinutes {
  deep: number;
  active: number;
  passive: number;
  background: number;
}

/**
 * Per the protocol spec: weighted minutes / total minutes × 100, on a 0–100 scale.
 * 100 = pure deep focus, 10 = entirely background presence.
 */
export const focusScore = (minutes: TierMinutes): number => {
  const total = minutes.deep + minutes.active + minutes.passive + minutes.background;
  if (total === 0) return 0;
  const weighted =
    minutes.deep * TIER_WEIGHT.deep +
    minutes.active * TIER_WEIGHT.active +
    minutes.passive * TIER_WEIGHT.passive +
    minutes.background * TIER_WEIGHT.background;
  return Math.round((weighted / total) * 100);
};

export const focusScoreLabel = (score: number): string => {
  if (score >= 75) return 'Deep Focus';
  if (score >= 55) return 'Active Engagement';
  if (score >= 25) return 'Passive Presence';
  return 'Background';
};
