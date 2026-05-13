# Valuation Framework — Astra Vault

What to anchor against when a number comes up in a conversation. Comp transactions + the math behind the ranges in `retention-scenarios.md` + `patent-portfolio.md`.

## Comparable transactions

These are real transactions in adjacent spaces. They're directional, not predictive — every deal is bespoke.

### Attention-economy
| Company | Deal | Multiple | Notes |
|---|---|---|---|
| Sweatcoin | Acquired/merged with Sweat Economy, 2022 | ~$11M reported | Walk-to-earn, ~120M users globally. Attention-economy adjacent. |
| Brave Software | Series A onward | Various rounds | Attention-token (BAT) market cap peaked ~$700M (2021), settled lower. Token != equity. |
| Pi Network | Pre-revenue, 47M users (2024) | Speculation | No public valuation. Token utility hypothetical. |
| StepN | Token economy collapsed | ~95% drawdown | Cautionary tale — token-as-economy without product-market-fit. |
| Helium | Token economy + hardware | ~$1.2B peak valuation | Decentralized infrastructure + token. Then crashed. |

**Takeaway:** Pure attention-economy plays are valued on token-economy hype, which is volatile and reputation-risky. Astra Vault avoids this trap by leading with the product and treating the protocol as the underlying mechanic.

### Astronomy / sky apps
| Company | Deal | Multiple | Notes |
|---|---|---|---|
| Vito Technology (Star Walk) | Bootstrapped, never disclosed valuation | — | 50M+ installs over 15 years. Family-run. Not for sale that we know of. |
| Stellarium Labs (Stellarium Mobile) | Bootstrapped, partnership with original open-source | — | Premium tier $19.99 one-time. Modest revenue. |
| Simulation Curriculum (SkySafari) | Acquired by Carina Software 2014 | Undisclosed, small | Pro-tier astronomy. Estimated mid-7-figures. |
| iCandi Apps (Night Sky) | Independent | — | Apple Design Award. Modest revenue but premium positioning on visionOS. |
| Distant Suns | Acquired by First Light Design 2016 | Undisclosed | Long-tail planetarium app. |

**Takeaway:** Pure astronomy apps trade at low multiples and rarely sell to strategics. The exit story for Astra Vault is NOT "we're like SkySafari but better." It's "we're the protocol moat for attention-economy AR."

### Smart astronomy hardware
| Company | Last round | Valuation | Notes |
|---|---|---|---|
| Vaonis | Series A + B (~$5M+ disclosed) | $50-100M range | Hardware + Singularity app. France. |
| Unistellar | Series B/C, ~$50M+ raised total | $100M+ peak | Hardware-first. Citizen-science aligned. |
| ZWO | Bootstrapped, private | Unknown but large | Estimated $50-200M revenue, hardware-driven. |
| Dwarf Lab | Series A (China) | Unknown | China market. |

**Takeaway:** Hardware-first astronomy companies trade at 5-15x revenue. Astra Vault is software, so direct comp is limited — but ZWO, Vaonis, Unistellar are realistic strategic acquirer candidates because Astra Vault is the software they don't have.

### Citizen science / observation platforms
| Project | Status | Valuation/funding | Notes |
|---|---|---|---|
| Zooniverse | Non-profit, grant-funded | N/A | Largest citizen-science platform. Free. |
| iNaturalist | Acquired by Cal Academy of Sciences, then independent | Undisclosed | Biodiversity citizen science. ~3M users. |
| AAVSO | Non-profit | N/A | Variable stars. >100 years old. |
| Globe at Night | NSF-funded | N/A | Light pollution. |

**Takeaway:** Citizen science is rarely a commercial exit. The commercial path runs through smart-glasses or hardware adjacency, not through citizen science directly.

### Open-source dev libraries → company exits
| Project | Path | Valuation | Notes |
|---|---|---|---|
| Tailwind CSS | Adam Wathan, bootstrapped, productized | Reportedly $10M+ ARR | Open-source library + commercial product (Tailwind UI). Reference for `@astravault/alpaca-client`. |
| Strapi | Open-source CMS, $40M Series A 2021 | $200M valuation | Open-source as community/credibility play. |
| Plausible Analytics | Open-source analytics, profitable bootstrap | Reportedly $1.5M+ ARR | Owner-operator scale. |

**Takeaway:** `@astravault/alpaca-client` will not become a Tailwind. But establishing it as the canonical TS Alpaca client provides credibility leverage in every astronomy conversation. Free strategic asset.

## The math behind Astra Vault's indicative ranges

### Patent #0 (SWS Protocol) — single-vertical non-exclusive license

**Anchor:** Typical software-patent licensing in the consumer-app space.
- Floor: $25k-$50k upfront (covers attorney costs on both sides)
- Median: $100k-$300k upfront + 1-3% royalty on attention-economy-derived revenue
- Ceiling: $500k upfront + 5% royalty (only for a vertical with proven revenue)

### Patent #0 — exclusive single-vertical license

**Anchor:** Exclusivity is typically 5-10x non-exclusive pricing.
- Floor: $500k upfront
- Median: $1-3M upfront + 2-5% royalty
- Ceiling: $10M upfront + 5-10% royalty (only for a Brave-scale licensee with confirmed token-economy revenue)

### Astra Vault application patents (#1, #4, #5) + app + LLC

**Anchor:** Acquisitions of pre-revenue / early-revenue companies with strong IP.
- Floor: $1-3M total package (acquihire scenario without big-tech tailwind)
- Median: $5-12M total package (strategic acquirer who wants the astronomy vertical)
- Ceiling: $20-50M total package (strategic with smart-glasses tailwind, e.g., post-Apple-Glasses-launch)

### Full portfolio + LLC acquihire (everything)

**Anchor:** Big-tech acquihires of small teams with strong IP + working product.
- Floor: $3-5M (Stephen + LLC + patents acquihired into a big-tech XR team)
- Median: $10-25M (strategic alignment + smart-glasses tailwind moderate)
- Ceiling: $50-200M (genuine Astra-Vault-as-Niantic-of-the-sky outcome)

The ceiling is improbable. The floor is realistic. The median is the negotiation anchor.

## Anchoring tactics

When a number comes up in a conversation:

1. **Don't drop a number first.** Always let them anchor first. "What's the scope you're thinking about?"
2. **Anchor on retention, not price.** "We're more interested in the deal shape than the headline number. What does control + IP look like in your proposal?"
3. **Cite comps, not multiples.** "Vaonis raised at $50M-ish on hardware. We're a software multiple on a smaller revenue base — what's your reference?"
4. **Always link the headline number to a vesting structure.** A $5M deal with 4-year vesting at acquirer stock price is very different from a $5M cash deal at close.

## What kills a deal

- **No filed provisional patents at the time of conversation.** Buyer asks "have you filed?" and the answer is "drafted but not filed yet" — the conversation slows by 6 months.
- **A single user has filed an infringement claim against the SWS Protocol.** Material adverse change. Get an FTO opinion on Celestron US 8,401,307 BEFORE conversations start.
- **Token-economy framing leads.** Talk product first. The token economy is a footnote.
- **A previous "near-deal" leaked.** If a strategic walks away and the rumor surfaces in trade press, the next strategic anchors lower because they assume something was wrong.

## What lifts a deal

- **A signed partnership.** ZWO or AstroBin saying "we use Astra Vault" doubles the valuation conversation overnight.
- **A paying user count above 1,000.** Pre-revenue → revenue is the single biggest valuation multiplier.
- **A second strategic in conversation.** Even a soft "yes we're interested" from a second buyer doubles negotiation leverage.
- **A granted patent (vs. provisional).** If Stephen waits 18 months for the application patents to grant before talking, the valuation lifts 2-3x. Often worth the wait.
