# `@astravault/alpaca-client`

> The first TypeScript client for the [ASCOM Alpaca](https://www.ascom-standards.org/) telescope-control protocol.

Drives any Alpaca-compliant telescope, camera, focuser, filter wheel, or
observing-conditions sensor over HTTP/JSON on the local network. Zero runtime
dependencies — `fetch` is built-in on Node 18+.

**Status:** alpha. Currently in development by [Astra Vault](https://github.com/astravault). API may shift before 1.0.

## Install

```bash
npm install @astravault/alpaca-client
```

Requires Node.js 18 or later (uses the global `fetch` and `node:dgram`).

## Quickstart: discover devices on the LAN

```ts
import { discover, AlpacaClient } from "@astravault/alpaca-client";

const servers = await discover({ timeoutMs: 3000 });
for (const server of servers) {
  const client = new AlpacaClient({ host: server.host, port: server.alpacaPort });
  const description = await client.getServerDescription();
  const devices = await client.getConfiguredDevices();
  console.log(`${description.ServerName} @ ${server.host}:${server.alpacaPort}`);
  for (const d of devices) {
    console.log(`  [${d.DeviceType}#${d.DeviceNumber}] ${d.DeviceName}`);
  }
}
```

## Quickstart: slew a telescope to Vega

```ts
import { AlpacaClient, TelescopeDevice } from "@astravault/alpaca-client";

const client = new AlpacaClient({ host: "192.168.1.42" });
const scope = new TelescopeDevice(client, 0);

await scope.setConnected(true);
await scope.setTracking(true);
await scope.slewToCoordinatesAsync(18.61565, 38.78369); // Vega (J2000)

while (await scope.getSlewing()) {
  await new Promise((r) => setTimeout(r, 1000));
}
console.log("Slew complete.");
```

## Supported devices

| Device              | Class                         | Coverage                              |
|---------------------|-------------------------------|---------------------------------------|
| Telescope           | `TelescopeDevice`             | slew, sync, park, tracking, position  |
| Camera              | `CameraDevice`                | expose, abort, image array, binning, gain, temperature |
| Focuser             | `FocuserDevice`               | move, halt, position, temperature     |
| Filter wheel        | `FilterWheelDevice`           | position, names, focus offsets        |
| Observing conditions| `ObservingConditionsDevice`   | temperature, humidity, sky brightness, cloud, wind |

The generic `AlpacaClient` can call any other Alpaca device type
(`rotator`, `dome`, `safetymonitor`, `switch`, `covercalibrator`, `video`) via
`client.get(...)` / `client.put(...)`. Typed adapters for these are a
natural follow-up — PRs welcome.

## Discovery

`discover()` performs UDP broadcast on port **32227** with the spec-mandated
payload `{"alpacadiscovery1":1}` and listens for `{"AlpacaPort": N}` responses.
Optional IPv6 multicast on `ff12::a1:9aca` is enabled with `{ includeIpv6: true }`.

Discovery requires Node.js — `dgram` is not available in browsers or React
Native. In those environments, run discovery on a server (or a desktop helper)
and connect the `AlpacaClient` directly to the discovered host. The library
throws a clear `AlpacaError` rather than crashing when `dgram` is missing.

## Errors

```ts
import {
  AlpacaError,
  AlpacaHttpError,    // transport-level failure (status, statusText, url)
  AlpacaDeviceError,  // ASCOM ErrorNumber + ErrorMessage
  AlpacaTimeoutError, // timeoutMs, url
  AlpacaErrorCodes,   // 0x400-0x4FF reserved-error map
} from "@astravault/alpaca-client";

try {
  await scope.slewToCoordinatesAsync(ra, dec);
} catch (err) {
  if (err instanceof AlpacaDeviceError && err.errorNumber === AlpacaErrorCodes.InvalidWhileParked) {
    await scope.unpark();
    await scope.slewToCoordinatesAsync(ra, dec);
  } else {
    throw err;
  }
}
```

## Contributing

This package is open source under MIT. Bug reports, device-adapter expansions,
and conformance-test cases are all welcome. File issues at
<https://github.com/astravault/alpaca-client/issues>.

## Acknowledgements

- The **[ASCOM Initiative](https://www.ascom-standards.org/)** for the Alpaca
  spec and Platform 7. This package implements their public protocol.
- The **[alpyca](https://github.com/ASCOMInitiative/alpyca)** team — Daniel Van
  Noord, Bob Denny, and contributors — whose Python reference shaped the
  TypeScript API surface here.
- The **[seestar_alp](https://github.com/smart-underworld/seestar_alp)**
  community, who proved the Seestar-via-Alpaca path that motivated this work.

## License

MIT © 2026 Astra Vault contributors. See [LICENSE](./LICENSE).

The ASCOM Initiative trademarks and the Alpaca specification remain the
property of their respective owners. This package implements the public
protocol; it is not an official ASCOM Initiative product.
