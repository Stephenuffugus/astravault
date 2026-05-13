import { create } from 'zustand';
import { emitAttentionEvent } from '@/services/attention';
import { useAtp } from './useAtp';

const TICK_MS = 30_000;
const ATP_PER_TICK = 1;

interface TimerState {
  isRunning: boolean;
  startedAt: number | null;
  accumulatedMs: number;
  earnedThisSession: number;
  start: () => void;
  pause: () => void;
  stop: () => void;
  _tick: () => Promise<void>;
}

let tickHandle: ReturnType<typeof setInterval> | null = null;

const stopTicker = () => {
  if (tickHandle != null) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
};

export const useObservationTimer = create<TimerState>((set, get) => ({
  isRunning: false,
  startedAt: null,
  accumulatedMs: 0,
  earnedThisSession: 0,
  start: () => {
    if (get().isRunning) return;
    set({ isRunning: true, startedAt: Date.now() });
    stopTicker();
    tickHandle = setInterval(() => {
      void get()._tick();
    }, TICK_MS);
  },
  pause: () => {
    if (!get().isRunning) return;
    const elapsed = Date.now() - (get().startedAt ?? Date.now());
    set({
      isRunning: false,
      startedAt: null,
      accumulatedMs: get().accumulatedMs + elapsed,
    });
    stopTicker();
  },
  stop: () => {
    stopTicker();
    set({
      isRunning: false,
      startedAt: null,
      accumulatedMs: 0,
      earnedThisSession: 0,
    });
  },
  _tick: async () => {
    await useAtp.getState().earn({
      eventType: 'obs_timer_session',
      amount: ATP_PER_TICK,
      durationMs: TICK_MS,
      interactionCount: 0,
      qualityTier: 'deep',
    });
    set({ earnedThisSession: get().earnedThisSession + ATP_PER_TICK });
  },
}));

/**
 * Convenience: a long-running session that emits one summary attention
 * event when stopped, in addition to the per-tick drips. Use when the
 * user explicitly ends the session.
 */
export const endObservationSession = async (): Promise<void> => {
  const state = useObservationTimer.getState();
  const totalMs =
    state.accumulatedMs + (state.startedAt ? Date.now() - state.startedAt : 0);
  if (totalMs > TICK_MS) {
    await emitAttentionEvent({
      eventType: 'obs_timer_session',
      durationMs: totalMs,
      interactionCount: 0,
      qualityTier: 'deep',
    });
  }
  state.stop();
};
