import { create } from 'zustand';

interface ToastState {
  message: string | null;
  variant: 'atp' | 'info' | 'error';
  show: (message: string, variant?: 'atp' | 'info' | 'error') => void;
  dismiss: () => void;
}

let dismissTimer: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>((set) => ({
  message: null,
  variant: 'atp',
  show: (message, variant = 'atp') => {
    set({ message, variant });
    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => set({ message: null }), 2200);
  },
  dismiss: () => {
    if (dismissTimer) clearTimeout(dismissTimer);
    set({ message: null });
  },
}));
