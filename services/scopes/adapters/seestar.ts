/**
 * ZWO Seestar adapter (S30 / S50 / S55).
 *
 * Per research/smart-scopes.md, late-2024 firmware made Seestar speak Alpaca
 * natively — no `seestar_alp` wrapper required. The default Alpaca port is
 * 11111, telescope device number 0.
 *
 * The interesting RA/Dec hour-vs-degree gotcha: ASCOM Alpaca's
 * RightAscension is in HOURS (0–24), not degrees. This adapter normalizes
 * to degrees on the way out and converts back on the way in.
 */

import { alpacaGet, alpacaPut, fetchServerDescription } from '../alpacaTransport';
import type { MountStatus, ScopeAdapter, ScopeConfig } from '../types';

const TELESCOPE = 'telescope';

const raHoursToDegrees = (hours: number): number => (hours * 15 + 360) % 360;
const raDegreesToHours = (deg: number): number => (((deg % 360) + 360) % 360) / 15;

export const seestarAdapter: ScopeAdapter = {
  vendor: 'seestar',
  displayName: 'ZWO Seestar',
  capabilities: {
    canSlew: true,
    canPark: true,
    canSync: true,
    canImportObservations: false,
    hasSessionHistory: false,
  },

  testConnection: async (config: ScopeConfig): Promise<boolean> => {
    try {
      const desc = await fetchServerDescription(config);
      if (!desc.Manufacturer) return false;
      const connected = await alpacaGet<boolean>(config, TELESCOPE, 'connected');
      if (!connected) {
        await alpacaPut(config, TELESCOPE, 'connected', { Connected: true });
      }
      return true;
    } catch {
      return false;
    }
  },

  getStatus: async (config: ScopeConfig): Promise<MountStatus> => {
    const [connected, raHours, dec, slewing, atPark, tracking, lat, lng] = await Promise.all([
      alpacaGet<boolean>(config, TELESCOPE, 'connected').catch(() => false),
      alpacaGet<number>(config, TELESCOPE, 'rightascension').catch(() => null),
      alpacaGet<number>(config, TELESCOPE, 'declination').catch(() => null),
      alpacaGet<boolean>(config, TELESCOPE, 'slewing').catch(() => false),
      alpacaGet<boolean>(config, TELESCOPE, 'atpark').catch(() => false),
      alpacaGet<boolean>(config, TELESCOPE, 'tracking').catch(() => false),
      alpacaGet<number>(config, TELESCOPE, 'sitelatitude').catch(() => null),
      alpacaGet<number>(config, TELESCOPE, 'sitelongitude').catch(() => null),
    ]);

    return {
      connected,
      rightAscensionDeg: raHours != null ? raHoursToDegrees(raHours) : null,
      declinationDeg: dec,
      slewing,
      parked: atPark,
      tracking,
      siteLatitude: lat,
      siteLongitude: lng,
    };
  },

  slewToCoordinates: async (
    config: ScopeConfig,
    raDegrees: number,
    decDegrees: number,
  ): Promise<void> => {
    await alpacaPut(config, TELESCOPE, 'slewtocoordinatesasync', {
      RightAscension: raDegreesToHours(raDegrees),
      Declination: decDegrees,
    });
  },

  abortSlew: async (config: ScopeConfig): Promise<void> => {
    await alpacaPut(config, TELESCOPE, 'abortslew');
  },

  park: async (config: ScopeConfig): Promise<void> => {
    await alpacaPut(config, TELESCOPE, 'park');
  },

  unpark: async (config: ScopeConfig): Promise<void> => {
    await alpacaPut(config, TELESCOPE, 'unpark');
  },
};
