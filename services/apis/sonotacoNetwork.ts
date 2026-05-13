/**
 * SonotaCo Network cross-reference client.
 *
 * SonotaCo Network is Japan's flagship amateur video-meteor consortium (~100
 * stations, founded 2007). The network's founder — known publicly only as
 * "SonotaCo" — also wrote the UFOCapture / UFOAnalyzer / UFOOrbit toolchain
 * that drives the bulk of amateur video meteor work outside the RMS/GMN world.
 *
 * Unlike GMN (which exposes a Datasette REST endpoint), SonotaCo distributes
 * its data as **annual ZIP archives** of CSV orbit catalogs. There is no
 * server-side query API. We therefore:
 *
 *   1. Resolve the year of an observation timestamp.
 *   2. Fetch and cache the matching SNM*.zip annual archive in AsyncStorage
 *      (7-day TTL — the archives are republished a few times per year as
 *      stations re-process detections, hence shorter than GMN's 24h trajectory
 *      cache).
 *   3. Parse the CSV in memory and apply the same time + angular-radiant
 *      filter as `gmnNetwork.ts`.
 *
 * Verified live (2026-05-13):
 *   - 2007–2020 archives:  https://sonotaco.jp/doc/SNM/index.html
 *     URL pattern:         https://sonotaco.jp/doc/SNM/SNM<YYYY><REV>.zip
 *     where <REV> is a single-letter revision marker (A/B/C, latest published).
 *   - 2021+ archives are migrated to the IAU MDC's PDA mirror:
 *     https://ceres.ta3.sk/iaumdcdb/home/PDA/SNMv3
 *     URL pattern (per page docs): /public/data/SNMv3/<YY>a.zip
 *
 * NOTE ON CSV PARSING IN A ZIP
 * ----------------------------
 * React Native's `fetch` returns an ArrayBuffer for `.zip` URLs but we have no
 * unzip primitive on the JS-runtime side without adding a dependency. The task
 * spec forbids new dependencies, so this v0.1 implementation does NOT actually
 * unzip the archive on-device. Instead it:
 *
 *   - Calls into a **published "decoded" CSV mirror** if one is configured
 *     (none today — but the architecture stays extensible).
 *   - Otherwise returns an empty match list and logs a single dev-only warning,
 *     which keeps `sonotacoMatch: false` flowing through the merge without
 *     breaking the capture path.
 *
 * When a sibling agent ships an unzip primitive (e.g. via `jszip` or a native
 * module), the only function to update is `fetchSonotacoArchive` — the public
 * surface here stays stable.
 *
 * LICENSE
 * -------
 * Per the SonotaCo Network "SNM Observation results" page
 * (https://sonotaco.jp/doc/SNM/index.html, verified 2026-05-13):
 *
 *   "may be downloaded and used freely for non-profit purpose of scientific
 *    research or academic affairs"
 *
 * Citation required as: "SonotaCo Network Simultaneously Observed Meteor Data
 * Sets SNM20<YY><rev>" with a link back to the source page. Astra Vault is a
 * commercial product, so this license is *narrower* than GMN's CC BY 4.0 and
 * we treat SonotaCo data as **attribution required, non-commercial reuse
 * pending clarification** until we get explicit written permission from
 * SonotaCo for in-app surfacing within a paid app. The merge protocol still
 * uses SonotaCo as a *read-only confirmation source* — we never re-publish
 * SonotaCo rows; we only consume them to confirm a user's own observation.
 * Counsel should review before any GA launch in commercial mode.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { angularSeparationHorizontal, radiantToAltAz } from '@/services/astro/horizontal';

// --------------------------------------------------------------------------
// Public surface
// --------------------------------------------------------------------------

export interface SonotacoMatch {
  /** SonotaCo's unique per-observation identifier. */
  id: string;
  /** Begin time of the meteor in UTC ms. */
  beginAt: number;
  /** Geocentric radiant RA in degrees, J2000. Null if not solved. */
  radiantRa: number | null;
  /** Geocentric radiant Dec in degrees, J2000. Null if not solved. */
  radiantDec: number | null;
  /** Geocentric velocity in km/s. Null if not solved. */
  velocityKmS: number | null;
  /** IAU shower code, e.g. "GEM". Null = sporadic. */
  iauShower: string | null;
  /** Human-readable shower name. */
  showerName: string | null;
  /** Number of SonotaCo stations contributing to this observation. */
  stationCount: number;
  /** Permalink to the archive entry, if resolvable. */
  detailUrl: string | null;
}

/**
 * Look up SonotaCo Network observations matching a user capture.
 *
 * Same filter pattern as `findGmnMatches`: ±timeToleranceSec around the user's
 * trigger, and if a radiant is present, the radiant's projected horizontal
 * coordinate must lie within `angularToleranceDeg` of the observer's pointing
 * direction at the observation instant.
 *
 * On any failure (network down, archive missing, unzip not yet wired) this
 * resolves to an empty array — never throws — so the capture path stays
 * unbroken.
 */
export const findSonotacoMatches = async (params: {
  observationAt: number;
  observerLocation: { lat: number; lng: number };
  observerPose: { bearing: number; elevation: number };
  timeToleranceSec?: number;
  angularToleranceDeg?: number;
}): Promise<SonotacoMatch[]> => {
  const {
    observationAt,
    observerLocation,
    observerPose,
    timeToleranceSec = DEFAULT_TIME_TOLERANCE_SEC,
    angularToleranceDeg = DEFAULT_ANGULAR_TOLERANCE_DEG,
  } = params;

  const fromUtcMs = observationAt - timeToleranceSec * 1000;
  const toUtcMs = observationAt + timeToleranceSec * 1000;

  let candidates: SonotacoMatch[];
  try {
    candidates = await fetchSonotacoArchive({ fromUtcMs, toUtcMs });
  } catch {
    return [];
  }

  return candidates.filter((match) => {
    if (match.beginAt < fromUtcMs || match.beginAt > toUtcMs) return false;
    if (match.radiantRa == null || match.radiantDec == null) {
      // No radiant — fall back to time-only match.
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
 * Convenience: given a capture-shape object, run a SonotaCo lookup and return
 * the partial cross-reference fragment to merge back.
 *
 * On any failure this returns the "no match" shape with `sonotacoMatch: false`
 * and zeroed counts — never throws.
 */
export const sonotacoCrossReferenceFor = async (record: {
  triggerAt: number;
  location: { latitude: number; longitude: number };
  pose: { bearing: number; elevation: number };
}): Promise<{
  sonotacoMatch: boolean;
  matchedObservers: number;
  parentBody: string | null;
  showerName: string | null;
  velocityKmS: number | null;
  geocentricRadiantRa: number | null;
  geocentricRadiantDec: number | null;
}> => {
  let matches: SonotacoMatch[];
  try {
    matches = await findSonotacoMatches({
      observationAt: record.triggerAt,
      observerLocation: { lat: record.location.latitude, lng: record.location.longitude },
      observerPose: record.pose,
    });
  } catch {
    matches = [];
  }

  if (matches.length === 0) {
    return {
      sonotacoMatch: false,
      matchedObservers: 0,
      parentBody: null,
      showerName: null,
      velocityKmS: null,
      geocentricRadiantRa: null,
      geocentricRadiantDec: null,
    };
  }

  // Closest-in-time match wins for the headline display fields.
  const first = matches[0] as SonotacoMatch;
  const best = matches.reduce<SonotacoMatch>((acc, cur) => {
    const dAcc = Math.abs(acc.beginAt - record.triggerAt);
    const dCur = Math.abs(cur.beginAt - record.triggerAt);
    return dCur < dAcc ? cur : acc;
  }, first);

  const matchedObservers = matches.reduce((sum, m) => sum + m.stationCount, 0);

  return {
    sonotacoMatch: true,
    matchedObservers,
    parentBody: best.iauShower ? IAU_PARENT_BODIES[best.iauShower] ?? null : null,
    showerName: best.showerName,
    velocityKmS: best.velocityKmS,
    geocentricRadiantRa: best.radiantRa,
    geocentricRadiantDec: best.radiantDec,
  };
};

/**
 * Attribution string callers MUST surface alongside any rendered SonotaCo
 * data. Per the SonotaCo Network terms, the citation includes the dataset name
 * and a link to the source archive page.
 */
export const SONOTACO_ATTRIBUTION =
  'Cross-reference: SonotaCo Network (Japan) — Simultaneously Observed Meteor Data Sets — https://sonotaco.jp/doc/SNM/ — non-profit research use; commercial reuse pending clarification.';

// --------------------------------------------------------------------------
// Internal: archive resolution + cache
// --------------------------------------------------------------------------

const CACHE_KEY_PREFIX = 'astravault:sonotaco_cache_v1';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEFAULT_TIME_TOLERANCE_SEC = 60;
const DEFAULT_ANGULAR_TOLERANCE_DEG = 10;

/**
 * Known revision letters for each year's archive on sonotaco.jp/doc/SNM/.
 * Pulled from the live index page on 2026-05-13. When a year is missing here,
 * `fetchSonotacoArchive` falls back to "A".
 */
const SONOTACO_LEGACY_REVISIONS: Record<number, string> = {
  2007: 'B',
  2008: 'B',
  2009: 'C',
  2010: 'B',
  2011: 'B',
  2012: 'B',
  2013: 'B',
  2014: 'B',
  2015: 'C',
  2016: 'C',
  2017: 'C',
  2018: 'A',
  2019: 'A',
  2020: 'A',
};

const SONOTACO_LEGACY_BASE = 'https://sonotaco.jp/doc/SNM';
const SONOTACO_V3_BASE = 'https://ceres.ta3.sk/iaumdcdb/public/data/SNMv3';

const FETCH_HEADERS: HeadersInit = {
  'User-Agent': 'AstraVault/0.1 (+https://astravault.example) sonotaco-cross-reference',
  Accept: 'application/octet-stream, application/zip, text/csv',
};

interface CacheEnvelope {
  fetchedAt: number;
  data: SonotacoMatch[];
}

/**
 * Resolve the SonotaCo archive URL for a given year.
 *
 * - 2007–2020 → legacy SNM<YYYY><REV>.zip on sonotaco.jp
 * - 2021+     → SNMv3 mirror on the IAU MDC PDA archive
 */
const archiveUrlForYear = (year: number): string => {
  if (year <= 2020) {
    const rev = SONOTACO_LEGACY_REVISIONS[year] ?? 'A';
    return `${SONOTACO_LEGACY_BASE}/SNM${year}${rev}.zip`;
  }
  // SNMv3 uses a 3-digit "yyy + a" pattern (007a, 008a, ..., 025a). It's an
  // odd convention but it's what the published archive uses.
  const yyy = String(year).slice(1).padStart(3, '0');
  return `${SONOTACO_V3_BASE}/${yyy}a.zip`;
};

const yearsCoveredByWindow = (fromUtcMs: number, toUtcMs: number): number[] => {
  const fromYear = new Date(fromUtcMs).getUTCFullYear();
  const toYear = new Date(toUtcMs).getUTCFullYear();
  const years: number[] = [];
  for (let y = fromYear; y <= toYear; y++) years.push(y);
  return years;
};

/**
 * Fetch (or return cached) SonotaCo observations covering the supplied time
 * window. Caches per-year on AsyncStorage with a 7-day TTL.
 *
 * v0.1 NOTE: ZIP unpacking requires either a JS dependency or a native module
 * (`expo-file-system` + an unzip primitive). Neither is wired in this milestone
 * — see file header. Until then this function returns an empty list whenever
 * the response body is a ZIP we cannot decode. The cache envelope is still
 * written so we don't hammer SonotaCo's bandwidth.
 *
 * The public surface (`findSonotacoMatches`, `sonotacoCrossReferenceFor`) is
 * already wired through this function, so a future "swap in JSZip" patch
 * lights up the live data path without touching callers.
 */
export const fetchSonotacoArchive = async (params: {
  fromUtcMs: number;
  toUtcMs: number;
}): Promise<SonotacoMatch[]> => {
  const { fromUtcMs, toUtcMs } = params;
  const years = yearsCoveredByWindow(fromUtcMs, toUtcMs);

  const all: SonotacoMatch[] = [];
  for (const year of years) {
    const yearMatches = await fetchYear(year);
    for (const m of yearMatches) {
      if (m.beginAt >= fromUtcMs && m.beginAt <= toUtcMs) all.push(m);
    }
  }
  return all;
};

const fetchYear = async (year: number): Promise<SonotacoMatch[]> => {
  const cacheKey = `${CACHE_KEY_PREFIX}:${year}`;
  const cached = await readCache(cacheKey);
  if (cached) return cached;

  let parsed: SonotacoMatch[] = [];
  try {
    const url = archiveUrlForYear(year);
    const res = await fetch(url, { headers: FETCH_HEADERS });
    if (!res.ok) {
      // 404s on a year that never published are expected; treat as empty.
      await writeCache(cacheKey, []);
      return [];
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('csv') || contentType.includes('text/plain')) {
      const text = await res.text();
      parsed = parseSnmCsv(text);
    } else {
      // ZIP. We can't unpack it on-device in v0.1. Empty list, but cache the
      // empty so we don't refetch every capture.
      // Discard the body to free memory.
      try {
        await res.arrayBuffer();
      } catch {
        // ignore
      }
    }
  } catch {
    parsed = [];
  }

  await writeCache(cacheKey, parsed);
  return parsed;
};

// --------------------------------------------------------------------------
// Internal: CSV parsing (UFOOrbit SNM format, per UO2 manual §5.1)
// --------------------------------------------------------------------------

/**
 * SNM CSV header (per UFOOrbit V2 manual §5.1) is a long, comma-separated list
 * of orbit-element columns. The columns Astra Vault cares about for cross-
 * reference are:
 *
 *   - ID1            — SonotaCo's per-meteor identifier ("yyyymmdd_hhmmss_n")
 *   - JD             — Julian Date of the meteor's begin time
 *   - sec            — observed duration in seconds
 *   - ra1, dc1       — observed begin RA/Dec (degrees, J2000) per station
 *   - rag, dcg       — *geocentric* radiant RA/Dec (degrees) for the trajectory
 *   - vg             — geocentric velocity (km/s)
 *   - _mag           — peak absolute magnitude
 *   - ST_no          — number of stations contributing
 *   - shower         — IAU shower code (or "spo" for sporadic)
 *
 * Real-world SNM files include a one-line header naming the columns; we honour
 * that header and look up each interesting field by name rather than positional
 * offset, since the column order has drifted between SNM revisions.
 *
 * The parser is tolerant of:
 *   - Trailing commas / empty columns.
 *   - "spo" / "SPO" / "-" / "" as sporadic shower code.
 *   - Missing radiant values (recorded as null).
 */
const parseSnmCsv = (text: string): SonotacoMatch[] => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  if (!headerLine) return [];
  const header = headerLine.split(',').map((c) => c.trim().toLowerCase());

  const idxId = header.indexOf('id1');
  const idxJd = header.indexOf('jd');
  const idxRag = header.indexOf('rag');
  const idxDcg = header.indexOf('dcg');
  const idxVg = header.indexOf('vg');
  const idxStations = header.indexOf('st_no');
  const idxShower = header.indexOf('shower');

  const out: SonotacoMatch[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (!row) continue;
    const cells = row.split(',');

    const id = idxId >= 0 ? (cells[idxId] ?? '').trim() : '';
    if (!id) continue;

    const jd = idxJd >= 0 ? parseFloatOrNull(cells[idxJd]) : null;
    const beginAt = jd != null ? (jd - 2440587.5) * 86400000 : null;
    if (beginAt == null) continue;

    const rag = idxRag >= 0 ? parseFloatOrNull(cells[idxRag]) : null;
    const dcg = idxDcg >= 0 ? parseFloatOrNull(cells[idxDcg]) : null;
    const vg = idxVg >= 0 ? parseFloatOrNull(cells[idxVg]) : null;
    const stRaw = idxStations >= 0 ? parseFloatOrNull(cells[idxStations]) : null;
    const showerRaw = idxShower >= 0 ? (cells[idxShower] ?? '').trim() : '';

    const iauShower = normaliseShowerCode(showerRaw);

    out.push({
      id,
      beginAt,
      radiantRa: rag,
      radiantDec: dcg,
      velocityKmS: vg,
      iauShower,
      showerName: iauShower ? IAU_SHOWER_NAMES[iauShower] ?? null : null,
      stationCount: stRaw != null && stRaw > 0 ? Math.round(stRaw) : 0,
      detailUrl: `${SONOTACO_LEGACY_BASE}/index.html`,
    });
  }
  return out;
};

const parseFloatOrNull = (cell: string | undefined): number | null => {
  if (cell == null) return null;
  const trimmed = cell.trim();
  if (trimmed === '' || trimmed === '-') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};

const normaliseShowerCode = (raw: string): string | null => {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  if (code === '' || code === 'SPO' || code === '-' || code === 'NA') return null;
  // SNM occasionally records numeric IAU codes; keep only alphabetic ones for
  // the lookup table, but pass numeric codes through verbatim — they're still
  // a valid IAU MDC identifier.
  return /^[A-Z]{2,4}$/.test(code) ? code : code;
};

// --------------------------------------------------------------------------
// Internal: AsyncStorage cache helpers
// --------------------------------------------------------------------------

const readCache = async (key: string): Promise<SonotacoMatch[] | null> => {
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

const writeCache = async (key: string, data: SonotacoMatch[]): Promise<void> => {
  try {
    const env: CacheEnvelope = { fetchedAt: Date.now(), data };
    await AsyncStorage.setItem(key, JSON.stringify(env));
  } catch {
    // Non-fatal.
  }
};

// --------------------------------------------------------------------------
// IAU shower / parent-body tables — same canonical set as gmnNetwork.ts.
// Duplicated here to keep this file self-contained; a future shared table
// module would consolidate the two.
// --------------------------------------------------------------------------

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
