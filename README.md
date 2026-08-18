# Astra Vault

A star gazing and collecting app from Sky Wolf Studios. Scan the cosmos, learn real astronomy, and collect the sky one object at a time. Free, no ads, no accounts.

Live at https://sws-apps-9646d.web.app/astravault/

## Stack

Expo SDK 52, expo-router v4, React Native 0.76, strict TypeScript. Runs on web today; iOS and Android builds come later with the meteor capture features that need real sensors.

## Develop

```bash
npm install
npm run web          # dev server at http://localhost:8081
npm run typecheck    # tsc --noEmit
```

## Ship to the studio suite

```bash
npx expo export --platform web    # builds ./dist with /astravault base paths
```

Copy the contents of `dist/` into `apps/astravault/` in the SWS-apps repo, commit, and deploy hosting from there. The base path is set by `experiments.baseUrl` in app.json, so the export only works at `/astravault/` on the host.

## Studio wiring

`data/studio.ts` holds the tip jar seam (`tipUrl`, empty hides the button), the studio link, and the feedback address. The Shared Sky tab is hidden in `app/(tabs)/_layout.tsx` until it runs on real community data.

The repo also carries the original founder ops and research folders (`ops/`, `dealroom/`, `research/`, `outreach/`, `astra-vault-handoff/`) from the pre-studio era. They are reference material, not part of the app.
