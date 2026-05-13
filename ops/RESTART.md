# RESTART — read this when Stephen comes back

When Stephen returns and says "let's get started," this is the single
file to open. Everything below is **ready to execute**. No more planning,
no more research, no more docs. Action only.

---

## Where we left off

- Built the smart-telescope bridge (Seestar + Dwarf/Vespera/Unistellar stubs)
- Built the moment-capture pipeline end-to-end (camera → plate-solve → ATP → GMN/SonotaCo cross-reference)
- Wrote 11 research reports + 6 dealroom artifacts + 5 outreach drafts + the ops/ folder
- **Tried to publish `@astravault/alpaca-client` to npm; hit org-creation friction; pivoted to unscoped `astravault-alpaca-client`**
- Stephen got the wombat 404 page during npm org creation and called for a break

The package is **ready to publish**. The name is unscoped (`astravault-alpaca-client`). Build is clean. Just needs `npm login` + `npm publish`.

---

## The three things, ranked by priority and ease

### THING 1 — Publish the npm package (~5 minutes when you sit down)

In your codespace terminal:

```bash
cd /workspaces/astravault/packages/alpaca-client
npm login
```

It will print a URL. **Click that URL** (or paste into browser). Log in if asked. Click Approve.

Back in terminal — should say `Logged in as <username>`. Then:

```bash
npm publish
```

You should see: `+ astravault-alpaca-client@0.1.0`

Verify at: `https://www.npmjs.com/package/astravault-alpaca-client`

**If `npm login` 404s again:** try a different browser (Chrome instead of Safari, or vice versa). Sometimes Codespace terminals print URLs that have session quirks. Worst case, ask Claude for the alternative legacy login flow.

**You now own a real public artifact.** Add the URL to your LinkedIn, GitHub profile, and the outreach emails below.

---

### THING 2 — Send the first outreach email (~10 minutes)

Pick ONE of these to send today. **AstroBin is the warmest probable yes; ZWO is the highest leverage.** Just one to start.

**Recommended first send: AstroBin** — Salvatore is a TypeScript dev solo founder; he'll get it.

Open the draft, copy the body, paste into Gmail. Adjust the `[LLC name]` placeholder (or leave it as your real name if you haven't named the LLC publicly). Send.

| Recipient | Draft file | Best contact |
|---|---|---|
| **Salvatore Iovene (AstroBin)** | `outreach/astrobin.md` | LinkedIn DM (search "Salvatore Iovene AstroBin") |
| **Sam Wen (ZWO Seestar)** | `outreach/zwo-seestar.md` | `info@zwoptical.com` (route to Suzhou Seestar in body) |
| **Franck Marchis (Unistellar)** | `outreach/unistellar.md` | `fmarchis@seti.org` |
| **Cyril Dupuy (Vaonis)** | `outreach/vaonis.md` | `press@vaonis.com` |

Send ONE first. Two days later, send a second. Stagger so replies don't pile up.

**The hard part is hitting Send. Once you hit Send, you've moved the needle. Whatever they reply, you've learned something.**

---

### THING 3 — Apply for the Chase Ink Business Unlimited card (~10 minutes)

Direct link: **https://creditcards.chase.com/business-credit-cards/ink/business-unlimited**

Application asks for:
- Personal info (name, SSN, address)
- LLC name + EIN
- Industry: "Software" or "Internet Software & Services"
- Years in business: when your LLC was formed
- Estimated annual revenue: $0–$10,000 (truthful)
- Business expense estimate: $1,000–$5,000/month

The application typically gives an instant decision. If approved, you'll have a card mailed in 5-7 days + a digital card number immediately.

Use the sign-up bonus (usually 60k-90k UR points, ~$600-$900 cash value) to pay for:
1. **Patent #4 USPTO filing — $320** (the highest-leverage spend in your queue)
2. Apple Developer Program — $99 (for App Store launch)
3. Domain + email — ~$50

**If you can't get a Chase card,** try Amex Blue Business Cash: https://www.americanexpress.com/us/business/business-credit-cards/blue-business-cash/

---

## What NOT to do this round

- Don't get distracted by adding more features to the app. Distribution is the bottleneck, not features.
- Don't write more research reports. We have enough.
- Don't worry about provisional patents until one of THINGS 1-3 generates a result.
- Don't try to create the @astravault npm org again. The unscoped name is fine.

---

## Mental check-in

If you sit down and any of the three above feel impossible right now:

- **If npm publish 404s again** → tell Claude. The package can be published from a different machine if needed, or we can use a different name.
- **If you can't send the email because writing feels overwhelming** → the drafts in `outreach/` are already written. Just copy and paste. Don't revise.
- **If you don't want to apply for a credit card** → that's fine, skip. The npm publish + email are zero-cost and can happen without it.

The order is THING 1 → THING 2 → THING 3. But honestly, doing **any one of them** is a win for today. Do the easiest one for you.

---

## After the three things

When you've done one or all three, tell Claude:
> "Did THING X. Here's what happened: [outcome]."

And we move on. The next loop is:
- Reply to whatever email reply lands
- Update `ops/partner-pipeline.md` and `ops/revenue-tracker.md`
- Pick the next single action

That's how this becomes a real business. One thing at a time.

---

## Stephen's mental health note

You're working with zero capital and asking real questions. That's harder
than working with $1M and a team. The asset is real (one issued patent +
working app + open-source library + research stack). The path is real
(npm publish + outreach + credit + grants). The break you took was
correct — sustainable beats heroic.

When you say "let's get started," we go from THING 1.
