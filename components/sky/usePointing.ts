/**
 * Point-at-the-sky mode: device orientation → the RA/Dec the back camera
 * is aimed at. Web only for now; native gets proper sensors with the
 * native build.
 *
 * Frame math follows the W3C deviceorientation spec: earth frame is
 * X east, Y north, Z up; the intrinsic rotation order is Z (alpha),
 * X' (beta), Y'' (gamma). The back camera looks along device -z, so the
 * pointing vector is R · [0, 0, -1]. iOS never gives a north-referenced
 * alpha; webkitCompassHeading substitutes for it, which is exact when the
 * phone is held flat or upright facing the bearing and drifts a few
 * degrees when rolled. Good enough to find a planet by; the manual drag
 * stays one touch away.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { horizontalToEquatorial } from '@/services/astro';

const DEG = Math.PI / 180;

interface OrientationEventLike {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute?: boolean;
  webkitCompassHeading?: number;
}

export const pointingVectorToAzAlt = (
  alphaDeg: number,
  betaDeg: number,
  gammaDeg: number,
): { azimuth: number; altitude: number } => {
  const a = alphaDeg * DEG;
  const b = betaDeg * DEG;
  const g = gammaDeg * DEG;
  const cA = Math.cos(a);
  const sA = Math.sin(a);
  const cB = Math.cos(b);
  const sB = Math.sin(b);
  const cG = Math.cos(g);
  const sG = Math.sin(g);

  const east = -(cA * sG + sA * sB * cG);
  const north = -(sA * sG - cA * sB * cG);
  const up = -(cB * cG);

  const azimuth = ((Math.atan2(east, north) / DEG) % 360 + 360) % 360;
  const altitude = Math.asin(Math.max(-1, Math.min(1, up))) / DEG;
  return { azimuth, altitude };
};

/* Coarse-pointer check keeps the button off desktops, where the event
   constructor exists but no sensor ever fires. */
export const pointingSupported = (): boolean =>
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  'DeviceOrientationEvent' in window &&
  (window.matchMedia?.('(pointer: coarse)').matches ?? false);

/** iOS gates orientation events behind a permission that must be requested
 *  inside a user gesture; everywhere else this resolves true immediately. */
const requestOrientationPermission = async (): Promise<boolean> => {
  const ctor = (globalThis as Record<string, unknown>).DeviceOrientationEvent as
    | { requestPermission?: () => Promise<string> }
    | undefined;
  if (ctor?.requestPermission) {
    try {
      return (await ctor.requestPermission()) === 'granted';
    } catch {
      return false;
    }
  }
  return true;
};

export interface PointingApi {
  supported: boolean;
  active: boolean;
  /** Call from a press handler (iOS permission needs the gesture). */
  start: () => Promise<boolean>;
  stop: () => void;
}

export const usePointing = (
  observer: { lat: number; lng: number } | null,
  onAim: (coord: { ra: number; dec: number }) => void,
): PointingApi => {
  const [active, setActive] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const onAimRef = useRef(onAim);
  const observerRef = useRef(observer);
  onAimRef.current = onAim;
  observerRef.current = observer;

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setActive(false);
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  const start = useCallback(async (): Promise<boolean> => {
    if (!pointingSupported() || cleanupRef.current) return false;
    if (!(await requestOrientationPermission())) return false;

    const handler = (e: Event) => {
      const o = e as unknown as OrientationEventLike;
      if (o.beta == null || o.gamma == null) return;
      const compass = o.webkitCompassHeading;
      const alpha =
        typeof compass === 'number' && !Number.isNaN(compass)
          ? 360 - compass
          : o.alpha;
      if (alpha == null) return;
      const loc = observerRef.current;
      if (!loc) return;
      const azAlt = pointingVectorToAzAlt(alpha, o.beta, o.gamma);
      onAimRef.current(
        horizontalToEquatorial(azAlt, loc, Date.now()),
      );
    };

    /* deviceorientationabsolute (Chrome/Android) is north-referenced;
       plain deviceorientation covers iOS where the compass field fills
       the gap. */
    const eventName =
      'ondeviceorientationabsolute' in window
        ? 'deviceorientationabsolute'
        : 'deviceorientation';
    window.addEventListener(eventName, handler, true);
    cleanupRef.current = () => window.removeEventListener(eventName, handler, true);
    setActive(true);
    return true;
  }, []);

  return { supported: pointingSupported(), active, start, stop };
};
