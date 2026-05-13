import { fromJulianDate, J2000, toJulianDate } from './julian';

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  /** End of astronomical twilight — sky is fully dark after this */
  astroTwilightEnd: Date | null;
  /** Start of astronomical twilight — sky begins brightening */
  astroTwilightBegin: Date | null;
  isDark: boolean;
}

const RAD = Math.PI / 180;

/**
 * Sunrise/sunset/astronomical-twilight times for a location and date.
 * Based on the simplified Meeus algorithm. Accurate to within ~1 minute at mid-latitudes.
 * Returns null for polar conditions where the sun never rises or sets.
 */
export const sunTimes = (lat: number, lng: number, date: Date = new Date()): SunTimes | null => {
  const jd = toJulianDate(date);
  const n = Math.floor(jd - J2000 + 0.0008);
  const Jstar = n - lng / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const Jtransit =
    J2000 + Jstar + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * lambda * RAD);
  const sinDec = Math.sin(lambda * RAD) * Math.sin(23.44 * RAD);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.sin(-0.83 * RAD) - Math.sin(lat * RAD) * sinDec) / (Math.cos(lat * RAD) * cosDec);
  if (Math.abs(cosH) > 1) return null;
  const cosHAstro = (Math.sin(-18 * RAD) - Math.sin(lat * RAD) * sinDec) / (Math.cos(lat * RAD) * cosDec);

  const H = Math.acos(cosH) / RAD;
  const HAstro = Math.abs(cosHAstro) <= 1 ? Math.acos(cosHAstro) / RAD : null;

  const sunrise = fromJulianDate(Jtransit - H / 360);
  const sunset = fromJulianDate(Jtransit + H / 360);
  const astroTwilightBegin = HAstro != null ? fromJulianDate(Jtransit - HAstro / 360) : null;
  const astroTwilightEnd = HAstro != null ? fromJulianDate(Jtransit + HAstro / 360) : null;

  const now = date;
  const isDark =
    astroTwilightBegin != null && astroTwilightEnd != null
      ? now > astroTwilightEnd || now < astroTwilightBegin
      : false;

  return { sunrise, sunset, astroTwilightBegin, astroTwilightEnd, isDark };
};
