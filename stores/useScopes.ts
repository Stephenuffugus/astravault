import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { ScopeConfig } from '@/services/scopes/types';

interface ScopesState {
  scopes: ScopeConfig[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  add: (scope: ScopeConfig) => Promise<void>;
  remove: (id: string) => Promise<void>;
  rename: (id: string, label: string) => Promise<void>;
}

const STORAGE_KEY = 'astravault:scopes_v1';

const persist = async (scopes: ScopeConfig[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scopes));
};

export const useScopes = create<ScopesState>((set, get) => ({
  scopes: [],
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ScopeConfig[];
        if (Array.isArray(parsed)) set({ scopes: parsed });
      } catch {
        // start fresh
      }
    }
    set({ hydrated: true });
  },
  add: async (scope) => {
    const next = [scope, ...get().scopes.filter((s) => s.id !== scope.id)];
    set({ scopes: next });
    await persist(next);
  },
  remove: async (id) => {
    const next = get().scopes.filter((s) => s.id !== id);
    set({ scopes: next });
    await persist(next);
  },
  rename: async (id, label) => {
    const next = get().scopes.map((s) => (s.id === id ? { ...s, label } : s));
    set({ scopes: next });
    await persist(next);
  },
}));
