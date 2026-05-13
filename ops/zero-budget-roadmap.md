# Zero-Budget Roadmap — Astra Vault / Stephen Furpahs LLC

How to get from $0 to first revenue without working capital. Honest, no
hype, no VC fairy tale.

## The premise

Stephen has:
- An issued patent (SWS Proof of Attention Protocol)
- A working app on GitHub
- 8 R&D reports + a dealroom + outreach drafts
- His time
- $0 working capital

He needs:
- First revenue (any source) within 60 days
- Enough margin to file 3 provisional patents ($320 each = $960) within 90 days
- A real partnership conversation underway within 30 days

## Week 1 — Zero-cost moves, all this week

### 1. Publish `@astravault/alpaca-client` to npm
**Time:** 10 minutes.
**Cost:** $0.
**Leverage:** instant developer-community credibility marker — appears in npm
download stats, becomes the line in your pitch deck.

Steps:
```bash
cd packages/alpaca-client
npm login              # one-time, free npm account
npm version 0.1.0
npm publish --access public
```

If you don't already have an npm account: create at npmjs.com (free).
If `@astravault` org name is taken: try `@stephenfurpahs/alpaca-client`
or `astravault-alpaca-client` as fallbacks.

After publishing, post on r/Astronomy + Cloudy Nights forum:
"Released the first TypeScript ASCOM Alpaca client. MIT, zero
dependencies. Looking for feedback from anyone running Seestar /
Dwarf / generic Alpaca mounts."

### 2. Send the 5 outreach emails
**Time:** 1-2 hours to personalize + send.
**Cost:** $0.
**Leverage:** zero-cost path to a partnership reply.

Files: `outreach/{zwo-seestar,unistellar,sonotaco,vaonis,laysky-stargazing-hub}.md`

Send order:
- **Day 1:** ZWO Seestar (highest priority — Alpaca-native bridge already
  built, demo-ready)
- **Day 2:** Unistellar (citizen-science alignment)
- **Day 3:** AstroBin (different from the existing drafts — see below;
  smallest deal, highest probability close)
- **Day 4-5:** Vaonis, SonotaCo, laysky.com (after Mandarin / JP reviewer
  if available, or send English-only with a note offering translation)

**AstroBin** isn't in the existing drafts but should be. Salvatore Iovene,
founder, contact via the AstroBin site. Ask: API embed / cross-link, no
financial exchange initially. Smallest commitment, highest probability of
yes, signals a partnership pipeline to other contacts.

### 3. Start a patent-licensing cold-outreach campaign
**Time:** 4-6 hours over the week.
**Cost:** $0.
**Leverage:** the single fastest cash path — any one $5k-$25k non-exclusive
single-vertical license closes your runway concern.

Template + target list: see `ops/patent-licensing-outreach.md`.

Realistic conversion: 1 reply per 10 outreach, 1 close per 5 replies = 1
license per 50 outreach. Send 50 in the first month. If even one closes
at $5k, you have your provisional patent budget covered with margin.

### 4. Apply for SBIR Phase I
**Time:** 3-5 days of focused work; can be spread over 2-4 weeks.
**Cost:** $0 to apply.
**Leverage:** $50k-$275k if won. 6-month decision cycle. NSF + NASA both
have programs.

Scaffold in `ops/sbir-application.md`. The R&D reports already give us
~80% of the technical narrative — repackage for the proposal format.

NSF deadlines: typically March and September. Apply for the next open
window. NASA SBIR: typically October.

## Week 2 — One paid action when you can swing it

### Apply for Chase Ink Business Unlimited (or Amex Blue Business Cash)

**Cost:** $0 fee for either. Possible if your personal credit score is
~680+.
**Leverage:** $5k-$25k credit line that lets you front the provisional
patent filing fee, ASA dev fee, and any small business expenses that
accumulate.

Apply with your LLC EIN. Use your personal credit history. Either card
has 5%+ cash-back categories useful for solo founders. Use the existing
sign-up bonus to fund the patent filings.

Detailed plan: `ops/credit-card-plan.md`.

## Week 3-4 — File the provisional patents

### Three provisional patents at USPTO, filed pro se
**Cost:** $320 each (micro-entity fee) = $960 total.
**Time:** ~4-8 hours to prepare + submit each (provisionals don't need
formal claims — just a complete disclosure of the invention).
**Leverage:** 12 months of priority date on patents #1, #4, #5. Without
this, any partner who sees your work could build it themselves.

Source material:
- Patent #1: `research/patent-abstract-cross-glasses-merge.md` (drafted)
- Patent #4: `services/meteor/plateSolve.ts` + `dealroom/patent-portfolio.md`
- Patent #5: `dealroom/patent-portfolio.md` (sketched)

USPTO portal: patentcenter.uspto.gov. Pro se is allowed. The provisional
just needs to be complete (full description of the invention + drawings if
applicable). Quality of claim language doesn't matter at provisional
stage — that's polished when you convert to utility within 12 months.

**Why pro se is OK here:** the 3 provisionals are about establishing
priority date. The utility patent conversion 11 months later is when
attorney expense becomes essential and the dollars-per-hour matter.

## Month 2-3 — Whatever the partnership replies tell you

If ZWO replies positively → focus everything on the Seestar partnership.
Their interest validates the bridge approach.

If Unistellar replies → focus on citizen-science angle, push toward
their existing science campaigns.

If a patent licensee bites → close the first license fast (don't haggle),
use the proceeds to file the 3 provisionals + apply for a real attorney
opinion on Celestron US 8,401,307.

If nothing replies in 3 weeks → escalate. Send a polite follow-up,
double the outreach volume, broaden to adjacent contacts (forum mods,
podcast hosts, other astronomy app makers).

## What this roadmap deliberately does not do

- Doesn't ask you to spend money you don't have on hardware ($500 Seestar).
- Doesn't ask you to spend money you don't have on attorneys ($5-15k).
- Doesn't ask you to fundraise from investors — that's a 6-month full-time
  job and you can't afford that focus loss right now.
- Doesn't ask you to launch paid ads.
- Doesn't ask you to hire anyone.

## Honest expected outcomes

Best case (top quartile of solo-founder LLC outcomes):
- 1 partnership reply that turns into a relationship by end of month 1
- 1 patent license closing at $5k-$25k by end of month 2
- 3 provisional patents filed by end of month 3
- SBIR Phase I submitted by end of month 2 (decision 6 months later)
- $5k-$30k total revenue by end of month 6

Median case:
- Most outreach gets no response
- 1 partnership reply that's polite-but-non-committal
- No patent licenses close in first 3 months (longer sales cycle than expected)
- 3 provisional patents filed by end of month 3 (slower, financed by your
  Chase Ink card)
- SBIR Phase I submitted
- $0-$2k revenue by end of month 6

Worst case:
- Outreach silence for 8 weeks
- You need to make a call about whether to keep going on this or pivot to
  consulting / contract work to earn while continuing Astra Vault on the side
- The patents still hold value even in this case — they're a long-term asset

## The single most leveraged thing you can do today

1. Publish `@astravault/alpaca-client` to npm (10 min, $0, free credibility)
2. Send the ZWO outreach email (30 min, $0, biggest single-shot upside)

That's 40 minutes of work for the two biggest possible immediate-term
wins. Everything else can come after.
