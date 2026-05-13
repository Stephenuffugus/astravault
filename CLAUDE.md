# CLAUDE.md — Astra Vault / Stephen Furpahs LLC

This file is read by Claude (CLI, Code, web) whenever it opens this repo.
It establishes the founder-operations context so every conversation
continues from where the business actually is, not from scratch.

## Who this is

**Stephen Furpahs** — Director and sole founder of an LLC building in the
SWS Proof of Attention Protocol ecosystem. Astra Vault is the flagship
consumer application, but the LLC owns the underlying protocol as well.

**One issued patent:** SWS Proof of Attention Protocol (the SHA-256 hash
pipeline, 9-field payload, cross-app vault economy). Stephen is sole
inventor. Owned by the LLC.

## What this repo is

This is **both** the Astra Vault product codebase AND the founder-ops
brain. The folder shape:

| Path | Purpose |
|---|---|
| `app/`, `components/`, `services/`, `stores/`, `theme/`, `data/`, `packages/` | The Astra Vault Expo React Native app + the publishable @astravault/alpaca-client open-source library |
| `research/` | 8+ R&D reports — competitive landscape, smart-glasses, moment capture, 3D viz, integrations, emerging tech, meteor networks, Asia-Pacific verification, patent prior-art, glasses overlay design |
| `outreach/` | 5 partnership-email drafts (ZWO, Unistellar, Vaonis, SonotaCo, laysky.com) — ready to send |
| `dealroom/` | Pitch deck, one-pager, patent portfolio summary, retention scenarios, valuation framework |
| `ops/` | **The founder-ops brain.** Revenue tracker, partner pipeline, expense ledger, credit-card planning, SBIR scaffold, zero-budget roadmap. Open `ops/README.md` first when you need to know what's happening with the business. |
| `astra-vault-handoff/` | Original R&D handoff package — the strategic source-of-truth |

## How to work with this repo when Stephen needs business help

When Stephen asks for help with anything LLC-related (credit cards, contracts,
partnerships, financials, applications, outreach, valuations, deal structure):

1. **Read `ops/README.md` first** — it has the current state of the business.
2. **Reference `dealroom/`** for any deal-shape or valuation question.
3. **Reference `research/`** for any market/competitive question.
4. **Reference `outreach/`** for any partnership-conversation question.

When Stephen asks for help with technical work:

1. **Read `BUILD_STATUS.md`** for shipped state.
2. **Read the relevant directory** (`services/`, `app/`, etc).
3. **Follow the existing code patterns** (TypeScript strict + noUncheckedIndexedAccess, no comments unless WHY is non-obvious, default-export components, etc).

## The current real constraint (as of 2026-05-13)

Stephen has **zero working capital available** for new spend. The advice
that requires $5-15k attorney fees or $500 hardware is correct in theory
but not actionable right now.

**The honest zero-budget path is in `ops/zero-budget-roadmap.md`.** Read
that BEFORE recommending anything that costs money.

The single most accessible paid action ($320 USPTO provisional filing fee)
is the highest-leverage early spend. Everything else should be free first.

## Honest about the business

This isn't a venture-backed company. It's a **solo-founder LLC with an
issued patent and a shipping product, trying to bootstrap revenue from
either patent licensing, partnerships, citizen-science grants, or app-store
revenue.** Probabilistic outcomes are honestly assessed in
`dealroom/retention-scenarios.md` and `dealroom/valuation-framework.md` —
roughly 30% chance of a real $300k-$1.5M/year business by year 3,
50% chance of a beloved portfolio piece with modest revenue, 5% chance
of a true breakout, 15% chance of fizzle. The asymmetric upside is real
but not guaranteed.

When advising Stephen, respect the constraint. Don't recommend things that
require money he doesn't have. **When in doubt, prefer zero-budget paths
that compound (open-source publishing, outreach, grant applications,
patent licensing letters) over money-gated paths (attorneys, hardware,
ads, hires).**

## Don't do

- Don't recommend buying hardware to test.
- Don't recommend attorney spend without flagging the pro se option.
- Don't recommend hiring before revenue.
- Don't recommend launching paid ads.
- Don't recommend rebuilding things that work.
- Don't recommend Stripe Atlas / Brex / Mercury until there's $50k+ revenue.
- Don't recommend selling Patent #0 (the floor) — it's the family jewels.

## Do

- Recommend free actions first.
- Recommend the $320 pro se provisional patent filing as the single most
  important early paid action.
- Recommend personal-credit-backed business credit cards (Chase Ink
  Business Unlimited, Amex Blue Business Cash) over funded-startup cards.
- Recommend SBIR Phase I + NASA Citizen Science grants as the realistic
  funded path (free to apply, 6-month decision, $50k-$275k if won).
- Recommend single-vertical non-exclusive patent licenses ($5k-$25k each
  realistic) as the quickest cash path on the issued patent.
- Always continue work in this repo — it IS the founder-ops brain.
