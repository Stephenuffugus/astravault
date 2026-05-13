import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { emitAttentionEvent, type EventType, type QualityTier } from '@/services/attention';

interface AtpState {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  earn: (params: {
    eventType: EventType;
    amount: number;
    durationMs?: number;
    interactionCount?: number;
    qualityTier?: QualityTier;
  }) => Promise<void>;
  spend: (amount: number) => Promise<boolean>;
}

const STORAGE_KEY = 'astravault:atp_v1';

interface PersistShape {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

const persist = async (state: PersistShape): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const useAtp = create<AtpState>((set, get) => ({
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<PersistShape>;
        set({
          balance: parsed.balance ?? 0,
          totalEarned: parsed.totalEarned ?? 0,
          totalSpent: parsed.totalSpent ?? 0,
        });
      } catch {
        // corrupted entry — start fresh
      }
    }
    set({ hydrated: true });
  },
  earn: async ({ eventType, amount, durationMs, interactionCount, qualityTier }) => {
    await emitAttentionEvent({ eventType, durationMs, interactionCount, qualityTier });
    const next = {
      balance: get().balance + amount,
      totalEarned: get().totalEarned + amount,
      totalSpent: get().totalSpent,
    };
    set(next);
    await persist(next);
  },
  spend: async (amount: number) => {
    if (get().balance < amount) return false;
    const next = {
      balance: get().balance - amount,
      totalEarned: get().totalEarned,
      totalSpent: get().totalSpent + amount,
    };
    set(next);
    await persist(next);
    return true;
  },
}));
