import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface NightVisionState {
  enabled: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggle: () => void;
}

const STORAGE_KEY = 'astravault:night_vision_v1';

export const useNightVision = create<NightVisionState>((set, get) => ({
  enabled: false,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    set({ enabled: raw === '1', hydrated: true });
  },
  toggle: () => {
    const enabled = !get().enabled;
    set({ enabled });
    void AsyncStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
  },
}));
