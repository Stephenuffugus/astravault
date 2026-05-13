# `@astravault/alpaca-client` examples

Each example is a self-contained Node script. Run with `tsx`:

```bash
npx tsx examples/discover.ts
npx tsx examples/slew-to-vega.ts
```

## `discover.ts`

Broadcasts the ASCOM Alpaca discovery packet on UDP port 32227 and prints every
device that responds. Useful as a smoke test for a fresh telescope setup.

## `slew-to-vega.ts`

Discovers the first Alpaca server on the LAN, connects to its telescope device,
enables tracking, and slews to Vega (RA 18h36m56s, Dec +38°47′01″). Polls
`Slewing` every second and reports final coordinates.

> Note: discovery requires a Node.js runtime (uses `dgram`). For browser or
> React Native consumers, run discovery on a server and connect the
> `AlpacaClient` directly to the discovered host.
