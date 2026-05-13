// Alpaca discovery — UDP broadcast/multicast on port 32227 per ASCOM spec.

import { AlpacaError } from "./errors.js";
import type { DiscoveredServer, DiscoveryOptions } from "./types.js";

const DISCOVERY_PORT = 32227;
const DISCOVERY_QUERY = '{"alpacadiscovery1":1}';
const DEFAULT_TIMEOUT_MS = 3000;
const IPV6_MULTICAST = "ff12::a1:9aca";

interface NetworkInterfaceInfo {
  address: string;
  netmask: string;
  family: string;
  internal: boolean;
}

interface RemoteInfo {
  address: string;
  port: number;
}

interface UdpSocket {
  on(event: "message", cb: (buf: Uint8Array, rinfo: RemoteInfo) => void): void;
  on(event: "error", cb: (err: Error) => void): void;
  bind(port: number, cb?: () => void): void;
  send(
    msg: Uint8Array,
    offset: number,
    length: number,
    port: number,
    address: string,
    cb?: (err: Error | null) => void,
  ): void;
  setBroadcast(flag: boolean): void;
  close(): void;
}

interface DgramModule {
  createSocket(options: { type: "udp4" | "udp6"; reuseAddr?: boolean }): UdpSocket;
}

interface OsModule {
  networkInterfaces(): Record<string, NetworkInterfaceInfo[] | undefined>;
}

function encodeUtf8(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function decodeUtf8(input: Uint8Array): string {
  return new TextDecoder("utf-8").decode(input);
}

async function loadDgram(): Promise<DgramModule> {
  try {
    const mod = (await import("node:dgram")) as unknown;
    return mod as DgramModule;
  } catch {
    throw new AlpacaError(
      "Alpaca discovery requires Node.js dgram (UDP). It is not available in browsers or React Native. Run a server-side proxy for those environments.",
    );
  }
}

async function loadOs(): Promise<OsModule> {
  const mod = (await import("node:os")) as unknown;
  return mod as OsModule;
}

function listBroadcastAddresses(
  os: OsModule,
  allowedInterfaces?: string[],
): string[] {
  const addresses = new Set<string>();
  const ifaces = os.networkInterfaces();
  for (const [name, infos] of Object.entries(ifaces)) {
    if (!infos) continue;
    if (allowedInterfaces && !allowedInterfaces.includes(name)) continue;
    for (const info of infos) {
      if (info.family !== "IPv4" || info.internal) continue;
      const broadcast = computeBroadcast(info.address, info.netmask);
      if (broadcast) addresses.add(broadcast);
    }
  }
  addresses.add("255.255.255.255");
  return Array.from(addresses);
}

function computeBroadcast(address: string, netmask: string): string | undefined {
  const a = address.split(".").map(Number);
  const m = netmask.split(".").map(Number);
  if (a.length !== 4 || m.length !== 4) return undefined;
  const out: number[] = [];
  for (let i = 0; i < 4; i++) {
    const ai = a[i];
    const mi = m[i];
    if (ai === undefined || mi === undefined) return undefined;
    out.push((ai & mi) | (~mi & 0xff));
  }
  return out.join(".");
}

export async function discover(
  options: DiscoveryOptions = {},
): Promise<DiscoveredServer[]> {
  const dgram = await loadDgram();
  const os = await loadOs();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const port = options.port ?? DISCOVERY_PORT;
  const found = new Map<string, DiscoveredServer>();

  const broadcastAddresses = listBroadcastAddresses(os, options.allowedInterfaces);
  const message = encodeUtf8(DISCOVERY_QUERY);

  await new Promise<void>((resolve) => {
    const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      try {
        socket.close();
      } catch {
        // ignore
      }
      resolve();
    };

    socket.on("error", () => finish());

    socket.on("message", (buf, rinfo) => {
      try {
        const payload = JSON.parse(decodeUtf8(buf)) as Record<string, unknown>;
        const alpacaPort =
          typeof payload["AlpacaPort"] === "number"
            ? (payload["AlpacaPort"] as number)
            : typeof payload["alpacaport"] === "number"
              ? (payload["alpacaport"] as number)
              : undefined;
        if (alpacaPort === undefined) return;
        const key = `${rinfo.address}:${alpacaPort}`;
        if (found.has(key)) return;
        found.set(key, {
          host: rinfo.address,
          port: rinfo.port,
          alpacaPort,
          rawResponse: payload,
        });
      } catch {
        // ignore non-JSON / malformed responses
      }
    });

    socket.bind(0, () => {
      try {
        socket.setBroadcast(true);
      } catch {
        // ignore — not all platforms allow this
      }
      for (const addr of broadcastAddresses) {
        socket.send(message, 0, message.length, port, addr, () => {
          // ignore individual send errors; some interfaces may be down
        });
      }
      if (options.includeIpv6) {
        const v6 = dgram.createSocket({ type: "udp6", reuseAddr: true });
        v6.on("message", (buf, rinfo) => {
          try {
            const payload = JSON.parse(decodeUtf8(buf)) as Record<string, unknown>;
            const alpacaPort =
              typeof payload["AlpacaPort"] === "number"
                ? (payload["AlpacaPort"] as number)
                : typeof payload["alpacaport"] === "number"
                  ? (payload["alpacaport"] as number)
                  : undefined;
            if (alpacaPort === undefined) return;
            const key = `[${rinfo.address}]:${alpacaPort}`;
            if (found.has(key)) return;
            found.set(key, {
              host: rinfo.address,
              port: rinfo.port,
              alpacaPort,
              rawResponse: payload,
            });
          } catch {
            // ignore
          }
        });
        v6.bind(0, () => {
          try {
            v6.send(message, 0, message.length, port, IPV6_MULTICAST);
          } catch {
            // ignore
          }
        });
        setTimeout(() => {
          try {
            v6.close();
          } catch {
            // ignore
          }
        }, timeoutMs);
      }
    });

    setTimeout(finish, timeoutMs);
  });

  return Array.from(found.values());
}

export const ALPACA_DISCOVERY_PORT = DISCOVERY_PORT;
export const ALPACA_DISCOVERY_QUERY = DISCOVERY_QUERY;
export const ALPACA_IPV6_MULTICAST = IPV6_MULTICAST;
