import { julianCenturiesSinceJ2000, toJulianDate } from './julian';

export interface MoonPhase {
  /** 0 = new, 0.5 = first/last quarter (per direction), 1 = full */
  illumination: number;
  /** Phase angle in degrees, 0–360 */
  angle: number;
}

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

const RAD = Math.PI / 180;

export const moonPhase = (date: Date): MoonPhase => {
  const jd = toJulianDate(date);
  const T = julianCenturiesSinceJ2000(jd);
  const D = (297.8502042 + 445267.1115168 * T) % 360;
  const M = (357.5291092 + 35999.0502909 * T) % 360;
  const Mp = (134.9634114 + 477198.8676313 * T) % 360;
  const i =
    180 -
    D -
    6.289 * Math.sin(Mp * RAD) +
    2.1 * Math.sin(M * RAD) -
    1.274 * Math.sin((2 * D - Mp) * RAD);
  return {
    illumination: (1 + Math.cos(i * RAD)) / 2,
    angle: ((i % 360) + 360) % 360,
  };
};

export const moonPhaseName = (illumination: number): MoonPhaseName => {
  if (illumination < 0.03) return 'New Moon';
  if (illumination < 0.22) return 'Waxing Crescent';
  if (illumination < 0.28) return 'First Quarter';
  if (illumination < 0.47) return 'Waxing Gibbous';
  if (illumination < 0.53) return 'Full Moon';
  if (illumination < 0.72) return 'Waning Gibbous';
  if (illumination < 0.78) return 'Last Quarter';
  if (illumination < 0.97) return 'Waning Crescent';
  return 'New Moon';
};

export const moonObservingTip = (illumination: number): string => {
  const pct = Math.round(illumination * 100);
  if (pct < 20) return 'Excellent for deep sky objects.';
  if (pct < 50) return 'Good for most targets. Avoid faint nebulae.';
  if (pct < 80) return 'Bright moon. Best for planets and double stars.';
  return 'Very bright. Focus on planets and lunar features.';
};
