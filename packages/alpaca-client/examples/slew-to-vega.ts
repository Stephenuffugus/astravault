// End-to-end example — discover, connect, slew to Vega, poll until done.

import { AlpacaClient, TelescopeDevice, discover } from "../src/index.js";

const VEGA_RA_HOURS = 18.61565;
const VEGA_DEC_DEGREES = 38.78369;

async function main(): Promise<void> {
  const servers = await discover({ timeoutMs: 3000 });
  if (servers.length === 0) {
    console.error("No Alpaca devices found on LAN.");
    process.exit(1);
  }

  const server = servers[0];
  if (!server) {
    console.error("No Alpaca server returned.");
    process.exit(1);
  }
  console.log(`Using server ${server.host}:${server.alpacaPort}`);

  const client = new AlpacaClient({ host: server.host, port: server.alpacaPort });
  const devices = await client.getConfiguredDevices();
  const telescopeDev = devices.find(
    (d) => d.DeviceType.toLowerCase() === "telescope",
  );
  if (!telescopeDev) {
    console.error("No telescope device on this server.");
    process.exit(1);
  }

  const scope = new TelescopeDevice(client, telescopeDev.DeviceNumber);

  console.log("Connecting...");
  await scope.setConnected(true);

  console.log("Enabling tracking...");
  await scope.setTracking(true);

  console.log(`Slewing to Vega (RA ${VEGA_RA_HOURS}h, Dec ${VEGA_DEC_DEGREES}°)...`);
  await scope.slewToCoordinatesAsync(VEGA_RA_HOURS, VEGA_DEC_DEGREES);

  while (await scope.getSlewing()) {
    const [ra, dec] = await Promise.all([
      scope.getRightAscension(),
      scope.getDeclination(),
    ]);
    console.log(`  ... slewing — RA=${ra.toFixed(4)}h Dec=${dec.toFixed(4)}°`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const [finalRa, finalDec] = await Promise.all([
    scope.getRightAscension(),
    scope.getDeclination(),
  ]);
  console.log(`Slew complete. Final: RA=${finalRa.toFixed(4)}h Dec=${finalDec.toFixed(4)}°`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
