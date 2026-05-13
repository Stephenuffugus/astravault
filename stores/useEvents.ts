import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { useAtp } from './useAtp';

interface EventsState {
  trackedEventIds: Record<string, number>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  track: (eventId: string) => Promise<boolean>;
  untrack: (eventId: string) => Promise<void>;
  isTracked: (eventId: string) => boolean;
}

const STORAGE_KEY = 'astravault:events_v1';

const persist = async (tracked: Record<string, number>): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tracked));
};

export const useEvents = create<EventsState>((set, get) => ({
  trackedEventIds: {},
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, number>;
        set({ trackedEventIds: parsed });
      } catch {
        // start fresh
      }
    }
    set({ hydrated: true });
  },
  track: async (eventId: string) => {
    if (get().trackedEventIds[eventId] !== undefined) return false;
    const next = { ...get().trackedEventIds, [eventId]: Date.now() };
    set({ trackedEventIds: next });
    await persist(next);
    await useAtp.getState().earn({
      eventType: 'event_track',
      amount: 10,
      durationMs: 0,
      interactionCount: 1,
      qualityTier: 'active',
    });
    return true;
  },
  untrack: async (eventId: string) => {
    const next = { ...get().trackedEventIds };
    delete next[eventId];
    set({ trackedEventIds: next });
    await persist(next);
  },
  isTracked: (eventId: string) => get().trackedEventIds[eventId] !== undefined,
}));
