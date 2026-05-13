/**
 * Right Ascension / Declination utilities.
 * RA is in degrees (0–360) in our storage format; this module formats it
 * to the conventional HH:MM:SS string for display.
 */

export interface EquatorialCoordinate {
  ra: number;   // degrees, 0–360
  dec: number;  // degrees, -90 to +90
}

export const raDegreesToHours = (raDegrees: number): number => {
  const wrapped = ((raDegrees % 360) + 360) % 360;
  return wrapped / 15;
};

export const formatRA = (raDegrees: number): string => {
  const hours = raDegreesToHours(raDegrees);
  const h = Math.floor(hours);
  const minFloat = (hours - h) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
};

export const formatDec = (decDegrees: number): string => {
  const sign = decDegrees >= 0 ? '+' : '-';
  const abs = Math.abs(decDegrees);
  const d = Math.floor(abs);
  const arcminFloat = (abs - d) * 60;
  const m = Math.floor(arcminFloat);
  const s = Math.round((arcminFloat - m) * 60);
  return `${sign}${pad(d)}° ${pad(m)}′ ${pad(s)}″`;
};

export const angularDistance = (a: EquatorialCoordinate, b: EquatorialCoordinate): number => {
  const rad = Math.PI / 180;
  const ra1 = a.ra * rad;
  const dec1 = a.dec * rad;
  const ra2 = b.ra * rad;
  const dec2 = b.dec * rad;
  const cosD =
    Math.sin(dec1) * Math.sin(dec2) +
    Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra1 - ra2);
  return Math.acos(Math.min(1, Math.max(-1, cosD))) / rad;
};

const pad = (n: number): string => n.toString().padStart(2, '0');
