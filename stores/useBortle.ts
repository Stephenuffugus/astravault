import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { useAtp } from './useAtp';

export interface BortleReport {
  id: string;
  class: number;
  capturedAt: number;
  latitude: number | null;
  longitude: number | null;
  note: string | null;
}

interface BortleState {
  reports: BortleReport[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  submit: (params: {
    class: number;
    latitude?: number | null;
    longitude?: number | null;
    note?: string | null;
  }) => Promise<BortleReport>;
}

const STORAGE_KEY = 'astravault:bortle_v1';
const BORTLE_ATP = 30;

const persist = async (reports: BortleReport[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const useBortle = create<BortleState>((set, get) => ({
  reports: [],
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as BortleReport[];
        set({ reports: parsed });
      } catch {
        // start fresh
      }
    }
    set({ hydrated: true });
  },
  submit: async (params) => {
    const report: BortleReport = {
      id: `bortle_${Date.now().toString(36)}`,
      class: params.class,
      capturedAt: Date.now(),
      latitude: params.latitude ?? null,
      longitude: params.longitude ?? null,
      note: params.note ?? null,
    };
    const next = [report, ...get().reports].slice(0, 50);
    set({ reports: next });
    await persist(next);
    await useAtp.getState().earn({
      eventType: 'bortle_report',
      amount: BORTLE_ATP,
      durationMs: 0,
      interactionCount: 1,
      qualityTier: 'deep',
    });
    return report;
  },
}));
