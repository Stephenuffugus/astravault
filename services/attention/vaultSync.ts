import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AttentionHashRecord } from './hashPipeline';

const STORAGE_KEY = 'sws_attention_hashes';

/**
 * Local vault storage. Until Firestore is wired, hashes live in AsyncStorage
 * so the offline-first contract holds. The synced flag stays `false` here;
 * a future Cloud Function-backed sync flips it when uploaded to
 * vaults/{uid}/hashes in Firebase project focus-grove-fffa8.
 */

export const loadHashes = async (): Promise<AttentionHashRecord[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AttentionHashRecord[]) : [];
  } catch {
    return [];
  }
};

export const appendHash = async (record: AttentionHashRecord): Promise<void> => {
  const existing = await loadHashes();
  existing.push(record);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const unsyncedHashes = async (): Promise<AttentionHashRecord[]> => {
  const all = await loadHashes();
  return all.filter((r) => !r.synced);
};

export const clearAllHashes = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
