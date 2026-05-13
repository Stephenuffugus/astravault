/**
 * Julian Date conversions — the lingua franca of astronomical math.
 */

export const toJulianDate = (date: Date): number => date.getTime() / 86400000 + 2440587.5;

export const fromJulianDate = (jd: number): Date => new Date((jd - 2440587.5) * 86400000);

export const J2000 = 2451545.0;

export const julianCenturiesSinceJ2000 = (jd: number): number => (jd - J2000) / 36525;
