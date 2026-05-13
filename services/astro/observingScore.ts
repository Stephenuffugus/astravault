/**
 * Stargazing quality scoring.
 * Composite of moon illumination, sky darkness (astronomical twilight),
 * and optional cloud cover. Returns a 0–100 rating.
 */

export const observingScore = (
  moonIllumination: number,
  isDark: boolean,
  cloudCover = 0,
): number => {
  let score = 100;
  score -= moonIllumination * 40;
  if (!isDark) score -= 30;
  score -= cloudCover * 30;
  return Math.max(0, Math.round(score));
};

/**
 * Light-pollution Bortle estimate.
 * 1 = pristine dark, 9 = inner city. Without a real measurement,
 * we make a coarse guess from moon + twilight + rural flag.
 */
export const estimateBortle = (
  moonIllumination: number,
  isDark: boolean,
  isRural = false,
): number => {
  let base = isRural ? 3 : 6;
  if (moonIllumination > 0.7) base += 1;
  if (!isDark) base += 2;
  return Math.min(9, Math.max(1, base));
};

export const observingScoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Poor';
  return 'Very Poor';
};
