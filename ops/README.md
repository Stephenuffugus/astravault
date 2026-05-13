# ops/ — Founder Operations

This folder is the operating brain for the LLC behind Astra Vault. Every
business decision, every dollar in or out, every partnership reply lands
here. Claude reads this folder whenever Stephen needs help with non-code
work — credit cards, partnerships, financials, applications, deal
conversations.

## Contents

| File | Use |
|---|---|
| [RESTART.md](./RESTART.md) | **🚨 OPEN THIS WHEN STEPHEN COMES BACK FROM A BREAK.** Single file with the next 3 actions, pre-staged, ready to execute. |
| [zero-budget-roadmap.md](./zero-budget-roadmap.md) | The honest longer-arc plan for getting from $0 to first revenue with no working capital. |
| [partner-pipeline.md](./partner-pipeline.md) | Every outreach sent + every reply received. Status tracker. |
| [revenue-tracker.md](./revenue-tracker.md) | Money in. Currently $0; update as licensing / grants / app revenue land. |
| [expense-ledger.md](./expense-ledger.md) | Money out + planned essential spend, prioritized by leverage. |
| [credit-card-plan.md](./credit-card-plan.md) | Which cards to apply for, in what order, and what to spend them on. |
| [sbir-application.md](./sbir-application.md) | NSF / NASA SBIR Phase I scaffold + draft narrative. Free to apply, $50k-$275k if won. |
| [patent-licensing-outreach.md](./patent-licensing-outreach.md) | Cold-outreach template for licensing the SWS Proof of Attention Protocol non-exclusively per vertical. Single-license target: $5k-$25k. |
| [weekly-review.md](./weekly-review.md) | Template Stephen fills out each Sunday — what shipped, what moved, what's blocked, what's the single next action. |

## How to use this with Claude

When you (Stephen) open Claude in this repo and need help with anything
operational, just say what you need. Examples:

- "Help me update the partner-pipeline tracker — ZWO replied yesterday"
- "Draft a follow-up email to Sam Wen using the template in partner-pipeline.md"
- "I just got $500 in patent licensing revenue — update the trackers and tell me what to spend it on"
- "Help me apply for the Chase Ink Business Unlimited card — pull from credit-card-plan.md"
- "Walk me through the SBIR Phase I application this week"

Claude will pull the current state from these files, recommend the next
action, and update the files when you act.

## Updating cadence

- **Daily:** add any reply received to `partner-pipeline.md`.
- **Weekly (Sunday):** fill in `weekly-review.md`.
- **As things happen:** update `revenue-tracker.md` and `expense-ledger.md`
  on every transaction.
- **Quarterly:** revisit `zero-budget-roadmap.md` and prune what's no
  longer real.

## The current snapshot

**As of 2026-05-13:**

- LLC: active (legal name TBD in these docs)
- Working capital: $0
- Revenue (YTD): $0
- Patents issued: 1 (SWS Proof of Attention Protocol)
- Provisionals filed: 0 (need to file 3 — see expense-ledger.md priority #1)
- App shipped to App Store: no (TestFlight: no)
- Active partnership conversations: 0 (5 drafts ready in `outreach/`)
- Open-source published: 0 (`@astravault/alpaca-client` ready to ship to npm — free, see weekly-review.md)
- Grant applications submitted: 0

The pressure points are: file the provisional patents (priority #1 paid
action, $320), publish alpaca-client to npm (priority #1 free action,
zero-cost, instant credibility), send the 5 outreach emails (zero-cost,
biggest single revenue lever).
