import AsyncStorage from '@react-native-async-storage/async-storage';

const LL2_BASE = 'https://lldev.thespacedevs.com/2.2.0';
const CACHE_PREFIX = 'astravault:ll2_upcoming_v1';
const CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_LIMIT = 5;

export interface UpcomingLaunch {
  id: string;
  name: string;
  net: string;
  status: 'go' | 'tbd' | 'tbc' | 'hold' | string;
  windowStart: string;
  windowEnd: string;
  provider: {
    name: string;
    type: string;
    logoUrl: string | null;
  };
  rocket: {
    name: string;
  };
  pad: {
    name: string;
    location: string;
  };
  mission: {
    name: string;
    type: string;
    description: string | null;
  } | null;
  imageUrl: string | null;
}

interface RawLaunch {
  id?: string | null;
  name?: string | null;
  net?: string | null;
  window_start?: string | null;
  window_end?: string | null;
  image?: string | null;
  status?: {
    abbrev?: string | null;
    name?: string | null;
  } | null;
  launch_service_provider?: {
    name?: string | null;
    type?: string | null;
    logo_url?: string | null;
  } | null;
  rocket?: {
    configuration?: {
      name?: string | null;
      full_name?: string | null;
    } | null;
  } | null;
  pad?: {
    name?: string | null;
    location?: {
      name?: string | null;
    } | null;
  } | null;
  mission?: {
    name?: string | null;
    type?: string | null;
    description?: string | null;
  } | null;
}

interface RawResponse {
  count?: number;
  results?: RawLaunch[] | null;
}

interface CacheEnvelope {
  fetchedAt: number;
  data: UpcomingLaunch[];
}

const normalizeStatus = (abbrev?: string | null): UpcomingLaunch['status'] => {
  const key = (abbrev ?? '').toLowerCase().trim();
  if (key === 'go') return 'go';
  if (key === 'tbd') return 'tbd';
  if (key === 'tbc') return 'tbc';
  if (key === 'hold') return 'hold';
  return key || 'tbd';
};

const mapLaunch = (raw: RawLaunch): UpcomingLaunch | null => {
  if (!raw.id || !raw.net) return null;
  const provider = raw.launch_service_provider ?? {};
  const config = raw.rocket?.configuration ?? {};
  const pad = raw.pad ?? {};
  const mission = raw.mission ?? null;
  return {
    id: raw.id,
    name: raw.name ?? 'Untitled launch',
    net: raw.net,
    status: normalizeStatus(raw.status?.abbrev),
    windowStart: raw.window_start ?? raw.net,
    windowEnd: raw.window_end ?? raw.net,
    provider: {
      name: provider.name ?? 'Unknown provider',
      type: provider.type ?? 'Unknown',
      logoUrl: provider.logo_url ?? null,
    },
    rocket: {
      name: config.full_name ?? config.name ?? 'Unknown rocket',
    },
    pad: {
      name: pad.name ?? 'TBD',
      location: pad.location?.name ?? 'TBD',
    },
    mission: mission
      ? {
          name: mission.name ?? 'TBD',
          type: mission.type ?? 'TBD',
          description: mission.description ?? null,
        }
      : null,
    imageUrl: raw.image ?? null,
  };
};

export const fetchUpcomingLaunches = async (
  limit?: number,
): Promise<UpcomingLaunch[]> => {
  const count = limit ?? DEFAULT_LIMIT;
  const cacheKey = `${CACHE_PREFIX}:${count}`;
  const cached = await readCache(cacheKey);
  if (cached) return cached;

  const url = new URL(`${LL2_BASE}/launch/upcoming/`);
  url.searchParams.set('limit', String(count));
  url.searchParams.set('mode', 'detailed');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`LL2 request failed: ${res.status} ${res.statusText}`);
  }
  const raw = (await res.json()) as RawResponse;
  const results = raw.results ?? [];
  const data: UpcomingLaunch[] = [];
  for (const entry of results) {
    const mapped = mapLaunch(entry);
    if (mapped) data.push(mapped);
  }
  await writeCache(cacheKey, data);
  return data;
};

export const nextLaunchInMs = (
  launch: UpcomingLaunch,
  now: Date = new Date(),
): number => new Date(launch.net).getTime() - now.getTime();

const readCache = async (key: string): Promise<UpcomingLaunch[] | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CacheEnvelope;
    if (Date.now() - envelope.fetchedAt > CACHE_TTL_MS) return null;
    return envelope.data;
  } catch {
    return null;
  }
};

const writeCache = async (
  key: string,
  data: UpcomingLaunch[],
): Promise<void> => {
  const envelope: CacheEnvelope = { fetchedAt: Date.now(), data };
  await AsyncStorage.setItem(key, JSON.stringify(envelope));
};
