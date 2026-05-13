import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { atpFor, CATALOG, type CelestialObject } from '@/data/catalog';
import { useAtp } from './useAtp';

interface CollectedEntry {
  objectId: string;
  collectedAt: number;
}

interface CollectionState {
  collected: Record<string, CollectedEntry>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  collect: (object: CelestialObject) => Promise<boolean>;
  isCollected: (objectId: string) => boolean;
  collectedObjects: () => CelestialObject[];
}

const STORAGE_KEY = 'astravault:collection_v1';

const persist = async (collected: Record<string, CollectedEntry>): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
};

export const useCollection = create<CollectionState>((set, get) => ({
  collected: {},
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, CollectedEntry>;
        set({ collected: parsed });
      } catch {
        // start fresh
      }
    }
    set({ hydrated: true });
  },
  collect: async (object: CelestialObject) => {
    if (get().collected[object.id]) return false;
    const entry: CollectedEntry = { objectId: object.id, collectedAt: Date.now() };
    const next = { ...get().collected, [object.id]: entry };
    set({ collected: next });
    await persist(next);
    await useAtp.getState().earn({
      eventType: 'collection_bonus',
      amount: atpFor(object.rarity),
      durationMs: 0,
      interactionCount: 1,
      qualityTier: 'deep',
    });
    return true;
  },
  isCollected: (objectId: string) => get().collected[objectId] !== undefined,
  collectedObjects: () => {
    const collected = get().collected;
    return CATALOG.filter((o) => collected[o.id] !== undefined);
  },
}));
