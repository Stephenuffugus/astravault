import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { ACADEMY, lessonById } from '@/data/academy';
import { useAtp } from './useAtp';

interface AcademyState {
  completedLessonIds: Record<string, number>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  completeLesson: (lessonId: string) => Promise<boolean>;
  isComplete: (lessonId: string) => boolean;
  pathProgress: (pathId: string) => { done: number; total: number };
  totalCompleted: () => number;
}

const STORAGE_KEY = 'astravault:academy_v1';

const persist = async (completed: Record<string, number>): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
};

export const useAcademy = create<AcademyState>((set, get) => ({
  completedLessonIds: {},
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, number>;
        set({ completedLessonIds: parsed });
      } catch {
        // start fresh
      }
    }
    set({ hydrated: true });
  },
  completeLesson: async (lessonId: string) => {
    if (get().completedLessonIds[lessonId] !== undefined) return false;
    const lesson = lessonById(lessonId);
    if (!lesson) return false;
    const next = { ...get().completedLessonIds, [lessonId]: Date.now() };
    set({ completedLessonIds: next });
    await persist(next);
    await useAtp.getState().earn({
      eventType: 'lesson_complete',
      amount: lesson.atpReward,
      durationMs: 0,
      interactionCount: 1,
      qualityTier: 'deep',
    });
    return true;
  },
  isComplete: (lessonId: string) => get().completedLessonIds[lessonId] !== undefined,
  pathProgress: (pathId: string) => {
    const path = ACADEMY.find((p) => p.id === pathId);
    if (!path) return { done: 0, total: 0 };
    const completed = get().completedLessonIds;
    const done = path.lessons.filter((l) => completed[l.id] !== undefined).length;
    return { done, total: path.lessons.length };
  },
  totalCompleted: () => Object.keys(get().completedLessonIds).length,
}));
