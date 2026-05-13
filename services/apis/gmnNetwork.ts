/**
 * Global Meteor Network (GMN) cross-reference client.
 *
 * GMN runs a Datasette-style REST endpoint exposing the curated `meteor_summary`
 * table from 1,100+ amateur+pro RMS stations worldwide. We use it to confirm
 * whether a user's moment-capture lines up with a triangulated meteor trajectory.
 *
 * Verified live (2026-05-13) at:
 *   https://gmn-python-api.readthedocs.io/en/latest/rest_api.html
 *
 * Endpoints:
 *   - General SQL:     https://explore.globalmeteornetwork.org/gmn_rest_api
 *   - Meteor summary:  https://explore.globalmeteornetwork.org/gmn_rest_api/meteor_summary
 *
 * Meteor summary query params (the ones we use):
 *   - where     SQL WHERE clause (URL-encoded)
 *   - order_by  SQL ORDER BY clause
 *   - data_shape  default `objects` — returns rows as JSON objects
 *   - data_format default `json`
 *   - page      1-indexed pagination
 *
 * Response envelope: `{ ok: boolean, rows: object[], truncated: boolean }`.
 * Server enforces: max 1000 rows per request, 3-second query budget, 1h server
 * cache. No auth. No rate-limit headers documented.
 *
 * LICENSE
 * -------
 * GMN data is published under Creative Commons Attribution 4.0 International
 * (CC BY 4.0). Astra Vault MUST display attribution wherever GMN-derived data
 * is rendered, e.g. "Trajectory data: Global Meteor Network (CC BY 4.0)" with
 * a link to https://globalmeteornetwork.org/. This obligation is non-optional.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  angularSeparationHorizontal,
  radiantToAltAz,
} from '@/services/astro/horizontal';

const GMN_BASE_URL = 'https://explore.globalmeteornetwork.org/gmn_rest_api';
const GMN_METEOR_SUMMARY_URL = `${GMN_BASE_URL}/meteor_summary`;
const GMN_EXPLORER_URL = 'https://explore.globalmeteornetwork.org';

const CACHE_KEY_PREFIX = 'astravault:gmn_cache_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h — trajectory data is post-publication immutable

const DEFAULT_TIME_TOLERANCE_SEC = 60;
const DEFAULT_ANGULAR_TOLERANCE_DEG = 10;

const FETCH_HEADERS: HeadersInit = {
  // GMN is community-funded; identify ourselves so they can spot issues.
  'User-Agent': 'AstraVault/0.1 (+https://astravault.example) gmn-cross-reference',
  Accept: 'application/json',
};

// --------------------------------------------------------------------------
// Public surface
// --------------------------------------------------------------------------

export interface GmnMatch {
  /** GMN's unique trajectory identifier, e.g. "20221214052010_D0GX2" */
  trajectoryId: string;
  /** Begin time of the meteor in UTC ms */
  beginAt: number;
  /** Geocentric radiant RA in degrees */
  radiantRa: number | null;
  /** Geocentric radiant Dec in degrees */
  radiantDec: number | null;
  /** Geocentric velocity in km/s */
  velocityKmS: number | null;
  /** IAU shower code if classified, e.g. "GEM" for Geminids */
  iauShower: string | null;
  /** Shower name, e.g. "Geminids" */
  showerName: string | null;
  /** Parent body if known */
  parentBody: string | null;
  /** Number of stations that observed this meteor */
  stationCount: number;
  /** URL to the GMN detail page for this trajectory, if available */
  detailUrl: string | null;
}

/**
 * Look up GMN trajectories matching a user observation.
 *
 * Match criteria: within ±timeToleranceSec of the observation timestamp AND,
 * if the radiant has equatorial coordinates, within angularToleranceDeg of the
 * observer's pointed direction (after converting radiant equatorial → horizontal
 * coords at the observer's location/time).
 *
 * GMN does not yet expose a server-side spatial/angular filter, so we fetch a
 * time-windowed slice and filter client-side.
 *
 * On any network/auth failure this function resolves to an empty array — never
 * throws — so callers can render "GMN unavailable" without breaking the capture
 * flow.
 */
export const findGmnMatches = async (params: {
  observationAt: number;
  observerLocation: { lat: number; lng: number };
  observerPose: { bearing: number; elevation: number };
  timeToleranceSec?: number;
  angularToleranceDeg?: number;
}): Promise<GmnMatch[]> => {
  const {
    observationAt,
    observerLocation,
    observerPose,
    timeToleranceSec = DEFAULT_TIME_TOLERANCE_SEC,
    angularToleranceDeg = DEFAULT_ANGULAR_TOLERANCE_DEG,
  } = params;

  const fromUtcMs = observationAt - timeToleranceSec * 1000;
  const toUtcMs = observationAt + timeToleranceSec * 1000;

  let candidates: GmnMatch[];
  try {
    candidates = await fetchGmnTrajectories({ fromUtcMs, toUtcMs });
  } catch {
    return [];
  }

  return candidates.filter((match) => {
    if (match.beginAt < fromUtcMs || match.beginAt > toUtcMs) return false;
    if (match.radiantRa == null || match.radiantDec == null) {
      // No radiant — fall back to time-only match. We keep the candidate so the
      // caller can still surface "GMN saw a meteor near this time".
      return true;
    }
    const radiantHoriz = radiantToAltAz(
      { ra: match.radiantRa, dec: match.radiantDec },
      observerLocation,
      observationAt,
    );
    const sep = angularSeparationHorizontal(
      radiantHoriz,
      { azimuth: observerPose.bearing, altitude: observerPose.elevation },
    );
    return sep <= angularToleranceDeg;
  });
};

/**
 * Fetch all GMN trajectories whose `beginning_utc_time` falls in [from, to].
 *
 * Cached in AsyncStorage under a per-window key with a 24h TTL — meteor
 * trajectory rows do not change after publication. Returns at most 1000 rows
 * (GMN server cap). Throws if GMN is unreachable; callers that prefer graceful
 * degradation should wrap in try/catch (see `findGmnMatches`).
 */
export const fetchGmnTrajectories = async (params: {
  fromUtcMs: number;
  toUtcMs: number;
  limit?: number;
}): Promise<GmnMatch[]> => {
  const { fromUtcMs, toUtcMs, limit = 1000 } = params;

  const cacheKey = `${CACHE_KEY_PREFIX}:${fromUtcMs}_${toUtcMs}`;
  const cached = await readCache(cacheKey);
  if (cached) return cached;

  const fromIso = utcMsToSqlTimestamp(fromUtcMs);
  const toIso = utcMsToSqlTimestamp(toUtcMs);

  // The GMN docs show `where` clauses can reference `beginning_utc_time`.
  // We bound on the human-readable UTC string column rather than julian date
  // because Datasette's SQLite stringifies the JD with float noise.
  const where = `beginning_utc_time >= '${fromIso}' AND beginning_utc_time <= '${toIso}'`;
  const orderBy = 'beginning_utc_time ASC';

  const qs = new URLSearchParams({
    where,
    order_by: orderBy,
    data_shape: 'objects',
    data_format: 'json',
  });
  // SQL LIMIT goes through `where`? No — Datasette's meteor_summary endpoint
  // doesn't expose LIMIT explicitly, but caps at 1000 rows server-side. We
  // honour the caller's `limit` only for the client-side slice below.

  const url = `${GMN_METEOR_SUMMARY_URL}?${qs.toString()}`;

  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) {
    throw new Error(`GMN fetch failed: ${res.status} ${res.statusText}`);
  }

  const body = (await res.json()) as RawGmnResponse;
  if (!body.ok || !Array.isArray(body.rows)) {
    throw new Error('GMN response missing rows');
  }

  const matches = body.rows
    .map(normaliseRow)
    .filter((m): m is GmnMatch => m !== null)
    .slice(0, limit);

  await writeCache(cacheKey, matches);
  return matches;
};

/**
 * Convenience: given a freshly-created MomentCaptureRecord-shaped object, run a
 * GMN lookup and return the partial `crossReferences` fragment to merge back.
 *
 * Pure over its argument shape — does not import from
 * `@/services/meteor/captureRecord` so it stays buildable while that file is
 * being shipped by a sibling agent.
 *
 * On any failure (network, auth, GMN down) this returns the "no match" shape
 * with `gmnMatch: false` and zeroed counts — never throws.
 */
export const gmnCrossReferenceFor = async (record: {
  triggerAt: number;
  location: { latitude: number; longitude: number };
  pose: { bearing: number; elevation: number };
}): Promise<{
  gmnMatch: boolean;
  matchedObservers: number;
  parentBody: string | null;
  showerName: string | null;
  velocityKmS: number | null;
  geocentricRadiantRa: number | null;
  geocentricRadiantDec: number | null;
}> => {
  let matches: GmnMatch[];
  try {
    matches = await findGmnMatches({
      observationAt: record.triggerAt,
      observerLocation: { lat: record.location.latitude, lng: record.location.longitude },
      observerPose: record.pose,
    });
  } catch {
    matches = [];
  }

  if (matches.length === 0) {
    return {
      gmnMatch: false,
      matchedObservers: 0,
      parentBody: null,
      showerName: null,
      velocityKmS: null,
      geocentricRadiantRa: null,
      geocentricRadiantDec: null,
    };
  }

  // Prefer the candidate closest in time to the user's trigger.
  const best = matches.reduce<GmnMatch>((acc, cur) => {
    const dAcc = Math.abs(acc.beginAt - record.triggerAt);
    const dCur = Math.abs(cur.beginAt - record.triggerAt);
    return dCur < dAcc ? cur : acc;
  }, matches[0] as GmnMatch);

  const matchedObservers = matches.reduce((sum, m) => sum + m.stationCount, 0);

  return {
    gmnMatch: true,
    matchedObservers,
    parentBody: best.parentBody,
    showerName: best.showerName,
    velocityKmS: best.velocityKmS,
    geocentricRadiantRa: best.radiantRa,
    geocentricRadiantDec: best.radiantDec,
  };
};

/** Attribution string callers MUST surface alongside any rendered GMN data. */
export const GMN_ATTRIBUTION =
  'Trajectory data: Global Meteor Network (CC BY 4.0) — https://globalmeteornetwork.org/';

// --------------------------------------------------------------------------
// Internal: response shape + normalisation
// --------------------------------------------------------------------------

/**
 * The verified meteor_summary row shape. GMN's full schema has ~85 columns;
 * we type only the fields we consume. Extra fields are ignored by the index
 * signature.
 */
interface RawGmnRow {
  unique_trajectory_identifier?: string;
  beginning_utc_time?: string;
  beginning_julian_date?: number;
  rageo_deg?: number | null;
  decgeo_deg?: number | null;
  vgeo_km_s?: number | null;
  iau_code?: string | null;
  iau_no?: number | null;
  num_stat?: number | null;
  participating_stations?: string | null;
  [k: string]: unknown;
}

interface RawGmnResponse {
  ok: boolean;
  rows: RawGmnRow[];
  truncated?: boolean;
}

const normaliseRow = (row: RawGmnRow): GmnMatch | null => {
  if (!row.unique_trajectory_identifier) return null;

  const beginAt = parseGmnTimestamp(row.beginning_utc_time, row.beginning_julian_date);
  if (beginAt == null) return null;

  const iau = row.iau_code ?? null;

  return {
    trajectoryId: row.unique_trajectory_identifier,
    beginAt,
    radiantRa: numOrNull(row.rageo_deg),
    radiantDec: numOrNull(row.decgeo_deg),
    velocityKmS: numOrNull(row.vgeo_km_s),
    iauShower: iau,
    showerName: iau ? IAU_SHOWER_NAMES[iau] ?? null : null,
    parentBody: iau ? IAU_PARENT_BODIES[iau] ?? null : null,
    stationCount: typeof row.num_stat === 'number' && row.num_stat > 0
      ? row.num_stat
      : countStations(row.participating_stations),
    detailUrl: `${GMN_EXPLORER_URL}/gmn_rest_api/meteor_summary?where=unique_trajectory_identifier%3D%27${encodeURIComponent(row.unique_trajectory_identifier)}%27`,
  };
};

const numOrNull = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

const countStations = (csv: string | null | undefined): number => {
  if (!csv) return 0;
  return csv.split(',').map((s) => s.trim()).filter(Boolean).length;
};

/**
 * GMN's `beginning_utc_time` is a SQLite-formatted string in UTC:
 *   "2022-12-14 05:20:10.123"
 * Date.parse handles that on web and most RN runtimes if we tack a 'T' and 'Z'
 * in. We also accept the Julian Date as a fallback.
 */
const parseGmnTimestamp = (
  utcStr: string | undefined,
  jd: number | undefined,
): number | null => {
  if (utcStr) {
    const isoish = utcStr.includes('T') ? utcStr : utcStr.replace(' ', 'T');
    const withZone = isoish.endsWith('Z') ? isoish : `${isoish}Z`;
    const ms = Date.parse(withZone);
    if (!Number.isNaN(ms)) return ms;
  }
  if (typeof jd === 'number' && Number.isFinite(jd)) {
    return (jd - 2440587.5) * 86400000;
  }
  return null;
};

const utcMsToSqlTimestamp = (ms: number): string => {
  // GMN compares strings, so we emit the exact `YYYY-MM-DD HH:MM:SS` format
  // SQLite produced. Sub-second precision is fine to drop here.
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
};

// --------------------------------------------------------------------------
// Internal: AsyncStorage cache
// --------------------------------------------------------------------------

interface CacheEnvelope {
  fetchedAt: number;
  data: GmnMatch[];
}

const readCache = async (key: string): Promise<GmnMatch[] | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const env = JSON.parse(raw) as CacheEnvelope;
    if (Date.now() - env.fetchedAt > CACHE_TTL_MS) return null;
    return env.data;
  } catch {
    return null;
  }
};

const writeCache = async (key: string, data: GmnMatch[]): Promise<void> => {
  try {
    const env: CacheEnvelope = { fetchedAt: Date.now(), data };
    await AsyncStorage.setItem(key, JSON.stringify(env));
  } catch {
    // Cache write failures should not fail the request.
  }
};

// --------------------------------------------------------------------------
// IAU shower name + parent body lookup
// --------------------------------------------------------------------------

/**
 * Minimal IAU MDC code → human name table. Codes from
 * https://www.ta3.sk/IAUC22DB/MDC2022/Etc/streamfulldata.txt — we ship only
 * the established showers Astra Vault users are likely to encounter; unknown
 * codes degrade to `null`. Extend in lockstep with the IAU MDC working list.
 */
const IAU_SHOWER_NAMES: Record<string, string> = {
  QUA: 'Quadrantids',
  LYR: 'Lyrids',
  ETA: 'Eta Aquariids',
  SDA: 'Southern Delta Aquariids',
  CAP: 'Alpha Capricornids',
  PER: 'Perseids',
  KCG: 'Kappa Cygnids',
  ORI: 'Orionids',
  STA: 'Southern Taurids',
  NTA: 'Northern Taurids',
  LEO: 'Leonids',
  GEM: 'Geminids',
  URS: 'Ursids',
  MON: 'December Monocerotids',
  HYD: 'Sigma Hydrids',
  COM: 'Comae Berenicids',
  AND: 'Andromedids',
  DRA: 'October Draconids',
  SCC: 'Southern Daytime Sextantids',
};

const IAU_PARENT_BODIES: Record<string, string> = {
  QUA: '(196256) 2003 EH1',
  LYR: 'C/1861 G1 (Thatcher)',
  ETA: '1P/Halley',
  SDA: '96P/Machholz',
  CAP: '169P/NEAT',
  PER: '109P/Swift-Tuttle',
  ORI: '1P/Halley',
  STA: '2P/Encke',
  NTA: '2P/Encke',
  LEO: '55P/Tempel-Tuttle',
  GEM: '(3200) Phaethon',
  URS: '8P/Tuttle',
  DRA: '21P/Giacobini-Zinner',
  AND: '3D/Biela',
};
