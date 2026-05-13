# Astra Vault — Pitch Deck (markdown)

Convert to slides in Keynote / Google Slides / Figma. Each `## Slide N:` is a slide. Speaker notes are below each slide in *italic*.

---

## Slide 1: Title

**ASTRA VAULT**
The first app where every minute looking up is a verified attention event.

Stephen Furpahs — Director
2026

*Speaker note: Open with one line. Don't read the slide. Pause. Wait for them to look up at you.*

---

## Slide 2: The problem

Every minute you spend looking at the sky is currently:
- Unrecorded
- Unrewarded
- Disconnected from professional astronomy data
- Lost the moment it ends

When you see a meteor, you have nothing — no record, no scientific contribution, no way to verify that what you saw matched what NASA's cameras saw. Your attention vanishes.

*Speaker note: Don't rush. The "your attention vanishes" line is the pivot.*

---

## Slide 3: The product

**Astra Vault** turns every minute of sky-watching into a verified, cryptographically-attested attention event.

- Scan the sky — collect 28 real celestial objects across 5 rarity tiers
- Learn real astronomy — 24 lessons, peer-reviewed quizzes
- Rate the sky — Bortle citizen-science submissions
- Capture the moment — say "METEOR" or tap, and Astra Vault saves a GNSS-timestamped, geotagged, bearing-fingerprinted frame
- Cross-reference — your meteor matched against NASA CAMS, Global Meteor Network, SonotaCo Network, AMS
- Earn — every verified moment generates an SWS attention hash, redeemable across the ecosystem

*Speaker note: Show the app on phone if possible. Five-second hover on the captures screen with a matched meteor.*

---

## Slide 4: The unfair advantage — the protocol

Astra Vault runs on the **SWS Proof of Attention Protocol** — patented platform-level technology that converts attention into portable cryptographic proofs.

- One **issued patent** — the underlying SHA-256 hash pipeline + 9-field payload + cross-game vault economy
- Three **application patents drafted and ready to file** in 30 days:
  - Cross-glasses observation merge
  - On-device plate-solve gating attention earn
  - Crowdsourced 3D-Gaussian-Splatting reconstruction
- Comprehensive **prior-art review** (8,287 words) confirms the application patents survive against 41 surveyed competitor apps and the Celestron StarSense patent landscape

Anyone wanting attention-economy + astronomy needs to license through Stephen.

*Speaker note: This is the slide where the buyer realizes they're not buying an app — they're buying a moat.*

---

## Slide 5: What's working today (proof of work)

This isn't slideware. The app is built.

- **10,000+ lines** of TypeScript, ~60 production files, full Expo SDK 52 + react-native-web app
- **5 working tabs** + 5 deep-route screens
- **Live API integrations:** NASA APOD, ISS tracking, NASA SkyView, CDS Aladin Lite (HiPS surveys), Global Meteor Network, SonotaCo Network, Launch Library 2
- **End-to-end moment capture pipeline:** GNSS time + GPS + camera frame + observer pose + observer fingerprint + attention hash + ATP earn + multi-network cross-reference
- **Public commit log** at github.com/Stephenuffugus/astravault — 8 commits since session 1, all working

This is the patent #1 reduction-to-practice. The frame capture is real, today.

*Speaker note: If they ask "can I see it" — show them the captures screen with a real meteor record.*

---

## Slide 6: The open-source authority play

**`@astravault/alpaca-client` v0.1.0** — first TypeScript client for ASCOM Alpaca telescope control. We checked. No one else has built it.

- 5 device adapters (Telescope, Camera, Focuser, FilterWheel, ObservingConditions)
- Zero runtime dependencies
- MIT license
- Ready to publish to npm

This is Astra Vault's free credibility in the astronomy hardware community. When ZWO, Vaonis, Unistellar evaluate us as a partner, this is the first thing they look at.

*Speaker note: Mention this matter-of-factly. It's a "we shipped something useful for everybody" signal, not the headline.*

---

## Slide 7: The market

Stargazing apps: **$100M market in 2024 growing to $250M by 2033 at 10.5% CAGR**.

But that's the wrong frame. The bigger play is:
- **Smart glasses** outsell VR headsets 3:1 today. Ray-Ban Meta has 7M+ units. Astronomy is the perfect smart-glasses use case (look-at-sky vs. look-at-screen).
- **Citizen science** is having a moment. Galaxy Zoo, Zooniverse, AAVSO — but none have gamification + token economy + cross-reference. We do.
- **APAC** is 28% of the global stargazing app market and growing fastest. Our patents cover whitespace where Stellarium and Star Walk have zero prior art in JP/KR/CN.

We've published a **41-app competitive landscape report** + a **25-platform smart-glasses analysis** + a **28-app Asia-Pacific live verification** in our research folder. The work is done.

*Speaker note: Don't overstate the smart glasses thesis. Acknowledge "this is contingent on adoption" and move on.*

---

## Slide 8: The partnership pipeline

Already drafted, ready to send:
- **ZWO Seestar** (Sam Wen, Suzhou) — Alpaca-native compatible-apps listing
- **Unistellar** (Franck Marchis, co-founder) — eVscope observation import
- **Vaonis** (Cyril Dupuy, founder) — Vespera/Hyperia logbook ingest
- **SonotaCo Network** — Japan-region meteor cross-reference license
- **天文通 / Stargazing Hub** (laysky.com) — PRC partnership exploration

Each email is in `outreach/` in the repo, ready to send. The first one (ZWO) is the highest-leverage 2026 move.

*Speaker note: This shows the founder has done the work. Don't over-claim — these are drafts, not signed deals.*

---

## Slide 9: Honest realistic projection

| Scenario | Probability | Year 3 users | Year 3 revenue |
|---|---|---|---|
| Breakout | 5% | 250k+ | $2M+ |
| Real business | 30% | 30-100k | $300k-$1.5M |
| Beloved portfolio piece | 50% | 5-20k | $20-100k |
| Fizzle | 15% | <2k | <$5k |

Asymmetric upside. Recoverable downside. Patents + open-source + research retain standalone value even in the fizzle case.

*Speaker note: This slide builds trust. Founders who project 100x always lose credibility; founders who project honestly win it.*

---

## Slide 10: The ask

Astra Vault is for sale, license, or strategic partnership.

Deal shapes Stephen will entertain:
1. **License the SWS protocol** for one vertical (e.g., a competing fitness-attention app) while Astra Vault continues operating
2. **Sell Astra Vault + the 3 application patents** to a strategic acquirer (smart-glasses maker, hardware company, publisher), Stephen retains the platform-level protocol patent
3. **Acquihire + Director role** — full asset transfer, Stephen joins on a multi-year contract retaining advisory equity
4. **Roll into a NewCo + raise capital** — Stephen brings the patents, a partner brings cash + distribution

What he won't do: full patent-portfolio sale that strips him of the underlying protocol asset. That's the family jewels.

**Contact:** Stephen Furpahs, Director — [email placeholder]
**Repository:** https://github.com/Stephenuffugus/astravault

*Speaker note: End on the ask, then shut up. Let them propose.*

---

## Appendix slides (if asked)

- A1: Patent claim summaries (link to `patent-portfolio.md`)
- A2: Technical architecture (Expo + Firebase + react-native-svg)
- A3: Competitive landscape (link to `research/competitive-landscape.md`)
- A4: Asia-Pacific findings (link to `research/asia-pacific-apps.md`)
- A5: Smart glasses analysis (link to `research/smart-glasses-platforms.md`)
- A6: Comparable transactions (link to `valuation-framework.md`)
