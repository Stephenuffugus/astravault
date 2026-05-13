/**
 * Horizontal ↔ equatorial coordinate transforms.
 * Shared between meteor cross-reference (radiant → where to look) and
 * plate-solve (where the user is looking → RA/Dec). Meeus, "Astronomical
 * Algorithms" chapter 13. Accurate to better than 1° in az/alt at
 * mid-latitudes for present epoch — well inside the angular-tolerance
 * budget for phone-pose matching.
 */

import { angularDistance, type EquatorialCoordinate } from './coordinates';
import { J2000, toJulianDate } from './julian';

const RAD = Math.PI / 180;

export interface HorizontalCoordinate {
  /** Compass bearing from true north, degrees east. 0–360. */
  azimuth: number;
  /** Elevation above the horizon, degrees. -90 to +90. */
  altitude: number;
}

const greenwichMeanSiderealTimeDeg = (jd: number): number => {
  const t = (jd - J2000) / 36525;
  const gmstDeg =
    280.46061837 +
    360.98564736629 * (jd - J2000) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;
  return ((gmstDeg % 360) + 360) % 360;
};

const clamp = (n: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, n));

/**
 * Equatorial (RA, Dec) → horizontal (azimuth, altitude) for an observer at
 * a given location and time. Useful for "where in the sky is this object
 * right now from the user's perspective."
 */
export const equatorialToHorizontal = (
  coord: EquatorialCoordinate,
  observer: { lat: number; lng: number },
  whenUtcMs: number,
): HorizontalCoordinate => {
  const jd = toJulianDate(new Date(whenUtcMs));
  const gmst = greenwichMeanSiderealTimeDeg(jd);
  const lst = ((gmst + observer.lng) % 360 + 360) % 360;

  const ha = ((lst - coord.ra) % 360 + 360) % 360;
  const haRad = ha * RAD;
  const decRad = coord.dec * RAD;
  const latRad = observer.lat * RAD;

  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altitude = Math.asin(clamp(sinAlt, -1, 1)) / RAD;

  const cosAlt = Math.cos(Math.asin(clamp(sinAlt, -1, 1)));
  let azimuth = 0;
  if (cosAlt > 1e-9) {
    const sinAz = (-Math.cos(decRad) * Math.sin(haRad)) / cosAlt;
    const cosAz =
      (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * cosAlt);
    azimuth = Math.atan2(sinAz, cosAz) / RAD;
  }
  azimuth = ((azimuth % 360) + 360) % 360;

  return { azimuth, altitude };
};

/**
 * Horizontal (azimuth, altitude) → equatorial (RA, Dec) for an observer at
 * a given location and time. Useful for "given the user pointed their
 * phone at this bearing+elevation, what patch of sky are they looking at."
 *
 * Inverse of `equatorialToHorizontal`.
 */
export const horizontalToEquatorial = (
  horiz: HorizontalCoordinate,
  observer: { lat: number; lng: number },
  whenUtcMs: number,
): EquatorialCoordinate => {
  const jd = toJulianDate(new Date(whenUtcMs));
  const gmst = greenwichMeanSiderealTimeDeg(jd);
  const lst = ((gmst + observer.lng) % 360 + 360) % 360;

  const altRad = horiz.altitude * RAD;
  const azRad = horiz.azimuth * RAD;
  const latRad = observer.lat * RAD;

  const sinDec =
    Math.sin(altRad) * Math.sin(latRad) +
    Math.cos(altRad) * Math.cos(latRad) * Math.cos(azRad);
  const dec = Math.asin(clamp(sinDec, -1, 1)) / RAD;

  const cosDec = Math.cos(Math.asin(clamp(sinDec, -1, 1)));
  let ha = 0;
  if (cosDec > 1e-9) {
    const sinHa = (-Math.sin(azRad) * Math.cos(altRad)) / cosDec;
    const cosHa =
      (Math.sin(altRad) - Math.sin(latRad) * sinDec) / (Math.cos(latRad) * cosDec);
    ha = Math.atan2(sinHa, cosHa) / RAD;
  }
  const ra = ((lst - ha) % 360 + 360) % 360;

  return { ra, dec };
};

/** Backwards-compatible alias — radiantToAltAz used to live in services/apis/gmnNetwork.ts. */
export const radiantToAltAz = equatorialToHorizontal;

/** Great-circle separation in degrees between two horizontal points. */
export const angularSeparationHorizontal = (
  a: HorizontalCoordinate,
  b: HorizontalCoordinate,
): number =>
  angularDistance(
    { ra: a.azimuth, dec: a.altitude },
    { ra: b.azimuth, dec: b.altitude },
  );
