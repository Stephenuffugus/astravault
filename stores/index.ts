export { useAtp } from './useAtp';
export { useCollection } from './useCollection';
export { useAcademy } from './useAcademy';
export { useEvents } from './useEvents';
export { useToast } from './useToast';
export { useObservationTimer, endObservationSession } from './useObservationTimer';
export { useBortle, type BortleReport } from './useBortle';
export { useScopes } from './useScopes';
export { useMeteorCaptures, type MeteorCaptureState } from './useMeteorCaptures';
export { useNightVision } from './useNightVision';
export { useDevGate } from './useDevGate';

import { useAcademy } from './useAcademy';
import { useAtp } from './useAtp';
import { useBortle } from './useBortle';
import { useCollection } from './useCollection';
import { useEvents } from './useEvents';
import { useDevGate } from './useDevGate';
import { useMeteorCaptures } from './useMeteorCaptures';
import { useNightVision } from './useNightVision';
import { useScopes } from './useScopes';

/** Hydrate all persisted stores from AsyncStorage. Call once at app start. */
export const hydrateAllStores = async (): Promise<void> => {
  await Promise.all([
    useAtp.getState().hydrate(),
    useCollection.getState().hydrate(),
    useAcademy.getState().hydrate(),
    useEvents.getState().hydrate(),
    useBortle.getState().hydrate(),
    useDevGate.getState().hydrate(),
    useMeteorCaptures.getState().hydrate(),
    useNightVision.getState().hydrate(),
    useScopes.getState().hydrate(),
  ]);
};
