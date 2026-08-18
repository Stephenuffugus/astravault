import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

/* The wolfden curtain, same one the games wear while in development.
   A curtain, not a lock: the phrase is in the source of a public file
   and nothing sits behind it but an unfinished app. */
interface DevGateState {
  unlocked: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  tryUnlock: (phrase: string) => boolean;
}

const STORAGE_KEY = 'astravault:dev_unlocked';
const PASSPHRASE = 'wolfden';

export const useDevGate = create<DevGateState>((set, get) => ({
  unlocked: false,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    set({ unlocked: raw === '1', hydrated: true });
  },
  tryUnlock: (phrase) => {
    const ok = phrase.trim().toLowerCase() === PASSPHRASE;
    if (ok) {
      set({ unlocked: true });
      void AsyncStorage.setItem(STORAGE_KEY, '1');
    }
    return ok;
  },
}));
