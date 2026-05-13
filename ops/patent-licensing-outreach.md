# Patent Licensing Outreach — SWS Proof of Attention Protocol

Cold-outreach campaign for non-exclusive single-vertical licenses of the
issued SWS Proof of Attention Protocol patent.

## The premise

Stephen owns one issued patent: the SWS Proof of Attention Protocol (the
SHA-256 hash pipeline, 9-field payload, quality-tier weighting, cross-app
vault economy).

**This patent has standalone licensing value** even if Astra Vault never
ships another user. Any consumer app, web platform, or game that wants to
implement attention-economy mechanics has two choices: license from
Stephen, or design around the claims (which is hard because the claims
are foundational).

Realistic non-exclusive single-vertical license pricing:
- Floor: $5,000 upfront (covers attorney costs on both sides)
- Median: $25,000-$100,000 upfront + 1-3% royalty
- Ceiling: $500,000 upfront for a major vertical (e.g., a Brave alum
  spinning up a competing attention-token project)

## Target list

Categories of companies most likely to license. Cold-email each — the
worst they say is "no."

### Tier 1 — high probability of conversation (immediate outreach)

| Company | Why | Contact |
|---|---|---|
| **Sweat Economy** (post-Sweatcoin) | They productized walk-to-earn; they understand attention-economy IP. Inbound license model. | partnerships@sweat.economy or LinkedIn outreach to leadership |
| **Brave Software** | BAT is attention-bound; they've already faced similar IP questions. | partnerships@brave.com or any BAT engineer on LinkedIn |
| **Pi Network** | 47M users, no real utility yet. Attention-protocol-as-utility is what their token needs. Stephen is already in their broader ecosystem. | Pi Network Core Team — see Pi developer Discord |
| **Decentraland / Sandbox / Roblox** | All have engagement-token economies. None have a rigorous attention-verification layer. | Developer-relations contact per company |
| **TikTok / ByteDance creator economy** | Long shot, but the dollars are immense if it lands. | LinkedIn — TikTok Creator Marketplace partnerships |

### Tier 2 — adjacency (after first wave)

| Company | Why |
|---|---|
| **Duolingo** | Streak mechanics, attention engagement |
| **Headspace / Calm** | Meditation = sustained attention. Tokenizing it would be novel. |
| **Strava** | Activity-attention bridge; competes with Sweat |
| **Audible / Spotify** | Listening-attention quantification |
| **Substack** | Reading-attention quantification |
| **Notion / Roam Research** | Knowledge-work attention |
| **Discord** | Community attention; would need partnership not license |

### Tier 3 — Web3 ecosystem (broader, lower probability)

Any token-economy project at Pre-Seed to Series A stage. Examples:
- Lens Protocol ecosystem
- Farcaster ecosystem
- Solana / Sui ecosystem grant recipients in attention-economy space
- Token Engineering Commons grant recipients

## The cold email template

```
Subject: SWS Proof of Attention Protocol — licensing inquiry for [vertical]

Hi [Name],

I'm Stephen Furpahs, Director of [LLC name] and sole inventor of the SWS
Proof of Attention Protocol — US Patent [number], issued [year]. The
patent covers cryptographically-attested attention events: a SHA-256
hash pipeline that converts verified human attention into portable,
quality-tiered proofs across applications.

[Company]'s [product / token / engagement mechanic] looks like it would
benefit from a rigorous attention-verification layer. I'd like to open a
conversation about a non-exclusive single-vertical license for [their
vertical].

The patent has been built out into a working reference implementation
(github.com/Stephenuffugus/astravault — the astronomy-vertical product).
Application patents for several specific implementations are in process.

Non-exclusive single-vertical licenses are reasonable on price (high
five-figures to low six-figures, depending on vertical scale) and can be
papered in 2-4 weeks. Happy to do a 30-minute call to scope this.

Are you the right person, or can you point me at who is?

Best,

Stephen Furpahs
Director, [LLC name]
[email]
[LinkedIn]
```

**Notes for personalization:**
- Replace `[number]` and `[year]` with your actual patent details
- Replace `[Name]` with the recipient's name (NEVER "Hi there" or "Dear Sir")
- Replace `[Company]` and the bracket phrase with their specific product
- Send Monday-Thursday mornings (9-11am their timezone) for highest open rate
- Don't send Fridays or Sundays

## What to do if they reply positively

1. Schedule the 30-minute call
2. **Send Stephen's dealroom one-pager (dealroom/one-pager.md) BEFORE the call** —
   it answers most of their first-pass diligence questions
3. On the call, anchor the conversation on **shape, not number** — "what
   vertical scope works for you?" before "what price?"
4. After the call, send a short follow-up summary + a draft term sheet
   for a non-exclusive single-vertical license
5. Term sheet template: 5-10 pages, can be drafted from the framework in
   `dealroom/retention-scenarios.md`

## What to do if they decline

1. Reply graciously: "Thanks for the quick read. If your situation
   changes, the patent will still be here — happy to revisit." Keeps the
   door open.
2. Note in `ops/partner-pipeline.md`: declined + reason
3. Move on

## Volume math

Stephen needs ONE close to fund 3 provisional patents + an Apple Developer
account + a small operational reserve. Realistic conversion:

- Send 50 emails → 5 replies → 1 close
- At median price ($25k), that's $25k for ~50 hours of outreach work
- At floor price ($5k), that's still 4x the cost of all 3 provisional patents

The math is favorable. The volume is the constraint.

## Tracking

Add each sent email to `ops/partner-pipeline.md` with status. Update
`ops/revenue-tracker.md` on any close.
