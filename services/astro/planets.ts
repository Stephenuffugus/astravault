/**
 * Geocentric planet positions from Keplerian elements.
 *
 * Method and element table: JPL SSD "Approximate Positions of the Planets"
 * (Standish), 1800 AD to 2050 AD fit. Accuracy is arcminutes across that
 * whole window, far inside one canvas pixel. Elements are referenced to
 * the J2000 ecliptic, so the RA/Dec that falls out is J2000, matching the
 * fixed-star coordinates in the catalog.
 */

import { J2000, julianCenturiesSinceJ2000, toJulianDate } from './julian';
import type { EquatorialCoordinate } from './coordinates';

const DEG = Math.PI / 180;
const OBLIQUITY_J2000 = 23.43928 * DEG;

/** a (au), e, I (deg), L (deg), longPeri ϖ (deg), longNode Ω (deg); each with per-century rate. */
type Elements = readonly [number, number, number, number, number, number];

const PLANET_IDS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn'] as const;
export type EphemerisPlanet = (typeof PLANET_IDS)[number];

const AT_EPOCH: Record<EphemerisPlanet, Elements> = {
  mercury: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593],
  venus: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255],
  earth: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
  mars: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
  jupiter: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
  saturn: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
};

const PER_CENTURY: Record<EphemerisPlanet, Elements> = {
  mercury: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  venus: [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
  earth: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
  mars: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  jupiter: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
  saturn: [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
};

export const isEphemerisPlanet = (id: string): id is EphemerisPlanet =>
  (PLANET_IDS as readonly string[]).includes(id);

const solveKepler = (meanAnomalyRad: number, e: number): number => {
  let E = meanAnomalyRad + e * Math.sin(meanAnomalyRad);
  for (let i = 0; i < 8; i += 1) {
    const dE = (E - e * Math.sin(E) - meanAnomalyRad) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
};

/** Heliocentric position in J2000 ecliptic coordinates, au. */
const heliocentric = (planet: EphemerisPlanet, T: number): [number, number, number] => {
  const el = AT_EPOCH[planet];
  const rate = PER_CENTURY[planet];
  const a = el[0] + rate[0] * T;
  const e = el[1] + rate[1] * T;
  const I = (el[2] + rate[2] * T) * DEG;
  const L = el[3] + rate[3] * T;
  const longPeri = el[4] + rate[4] * T;
  const longNode = (el[5] + rate[5] * T) * DEG;

  const argPeri = longPeri * DEG - longNode;
  const M = (((L - longPeri) % 360) + 360) % 360;
  const E = solveKepler(M * DEG, e);

  const xOrb = a * (Math.cos(E) - e);
  const yOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cosW = Math.cos(argPeri);
  const sinW = Math.sin(argPeri);
  const cosO = Math.cos(longNode);
  const sinO = Math.sin(longNode);
  const cosI = Math.cos(I);
  const sinI = Math.sin(I);

  return [
    (cosW * cosO - sinW * sinO * cosI) * xOrb + (-sinW * cosO - cosW * sinO * cosI) * yOrb,
    (cosW * sinO + sinW * cosO * cosI) * xOrb + (-sinW * sinO + cosW * cosO * cosI) * yOrb,
    sinW * sinI * xOrb + cosW * sinI * yOrb,
  ];
};

export interface PlanetPosition extends EquatorialCoordinate {
  /** Geocentric distance in au. */
  distanceAu: number;
}

export const planetEquatorial = (planet: EphemerisPlanet, date: Date): PlanetPosition => {
  const T = julianCenturiesSinceJ2000(toJulianDate(date));
  const [px, py, pz] = heliocentric(planet, T);
  const [ex, ey, ez] = heliocentric('earth', T);

  const gx = px - ex;
  const gy = py - ey;
  const gz = pz - ez;

  const eqY = gy * Math.cos(OBLIQUITY_J2000) - gz * Math.sin(OBLIQUITY_J2000);
  const eqZ = gy * Math.sin(OBLIQUITY_J2000) + gz * Math.cos(OBLIQUITY_J2000);

  const distanceAu = Math.sqrt(gx * gx + gy * gy + gz * gz);
  const ra = ((Math.atan2(eqY, gx) / DEG) % 360 + 360) % 360;
  const dec = Math.asin(eqZ / distanceAu) / DEG;

  return { ra, dec, distanceAu };
};

export const AU_IN_LIGHT_YEARS = 1.58125e-5;
