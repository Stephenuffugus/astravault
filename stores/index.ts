export { useAtp } from './useAtp';
export { useCollection } from './useCollection';
export { useAcademy } from './useAcademy';
export { useEvents } from './useEvents';
export { useToast } from './useToast';
export { useObservationTimer, endObservationSession } from './useObservationTimer';
export { useBortle, type BortleReport } from './useBortle';

import { useAcademy } from './useAcademy';
import { useAtp } from './useAtp';
import { useBortle } from './useBortle';
import { useCollection } from './useCollection';
import { useEvents } from './useEvents';

/** Hydrate all persisted stores from AsyncStorage. Call once at app start. */
export const hydrateAllStores = async (): Promise<void> => {
  await Promise.all([
    useAtp.getState().hydrate(),
    useCollection.getState().hydrate(),
    useAcademy.getState().hydrate(),
    useEvents.getState().hydrate(),
    useBortle.getState().hydrate(),
  ]);
};
