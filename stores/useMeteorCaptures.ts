import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import type { MomentCaptureRecord } from '@/services/meteor/captureRecord';

export interface MeteorCaptureState {
  captures: MomentCaptureRecord[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  append: (record: MomentCaptureRecord) => Promise<void>;
  updateCrossRef: (
    id: string,
    partial: Partial<MomentCaptureRecord['crossReferences']>,
  ) => Promise<void>;
}

const STORAGE_KEY = 'astravault:meteor_captures_v1';
const MAX_RECORDS = 500;

const persist = async (captures: MomentCaptureRecord[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(captures));
};

export const useMeteorCaptures = create<MeteorCaptureState>((set, get) => ({
  captures: [],
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as MomentCaptureRecord[];
        if (Array.isArray(parsed)) {
          set({ captures: parsed });
        }
      } catch {
        // start fresh on corrupted entry
      }
    }
    set({ hydrated: true });
  },
  append: async (record) => {
    const next = [record, ...get().captures].slice(0, MAX_RECORDS);
    set({ captures: next });
    await persist(next);
  },
  updateCrossRef: async (id, partial) => {
    const now = Date.now();
    const next = get().captures.map((r) =>
      r.id === id
        ? { ...r, crossReferences: { ...r.crossReferences, ...partial }, updatedAt: now }
        : r,
    );
    set({ captures: next });
    await persist(next);
  },
}));
