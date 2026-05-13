// Discovery example — scan the LAN for Alpaca-speaking devices.

import { AlpacaClient, discover } from "../src/index.js";

async function main(): Promise<void> {
  console.log("Scanning LAN for ASCOM Alpaca devices on UDP 32227...");
  const servers = await discover({ timeoutMs: 3000 });

  if (servers.length === 0) {
    console.log("No Alpaca devices found.");
    return;
  }

  for (const server of servers) {
    console.log(`\nFound server at ${server.host}:${server.alpacaPort}`);
    const client = new AlpacaClient({ host: server.host, port: server.alpacaPort });
    try {
      const description = await client.getServerDescription();
      console.log(`  ServerName:    ${description.ServerName}`);
      console.log(`  Manufacturer:  ${description.Manufacturer}`);
      console.log(`  Version:       ${description.ManufacturerVersion}`);
      const devices = await client.getConfiguredDevices();
      console.log(`  Configured devices: ${devices.length}`);
      for (const d of devices) {
        console.log(`    - [${d.DeviceType}#${d.DeviceNumber}] ${d.DeviceName}`);
      }
    } catch (err) {
      console.error(`  Error querying ${server.host}: ${(err as Error).message}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
