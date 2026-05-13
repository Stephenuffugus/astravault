# SonotaCo Network — data partnership outreach

**Recipient:** SonotaCo (network maintainer; pen name)
**Optional secondary:** Jun-ichi Watanabe (NAOJ — National Astronomical Observatory of Japan, public-outreach + meteor astronomy lead)
**Channel:** SonotaCo Forum (`https://sonotaco.com/forum/`) DM if direct email unavailable; or Twitter/X
**Status:** DRAFT
**Goal:** Permission to query + surface SonotaCo Network meteor data with proper attribution; offer contribute-back of Astra Vault aggregate data.

---

## Subject

SonotaCo Network cross-reference partnership — Astra Vault citizen-science app

## Body

Dear SonotaCo,

I'm Stephen Furpahs, Director of Astra Vault — a citizen-science astronomy app shipping in 2026. Our app gives users a way to record meteor observations from their phones (and, soon, smart glasses), and we cross-reference each observation against professional meteor-monitoring networks worldwide so the user can see "your meteor was also captured by 3 GMN stations."

We've integrated the Global Meteor Network (GMN) as our primary cross-reference source under CC BY 4.0. For our Japan-region users, the SonotaCo Network is the natural complement — it has the longest continuous video-meteor record in Japan and the data quality is exceptional.

**The ask:** We'd like permission to:

1. Query the SonotaCo Network data archive periodically and surface matches in our app, with prominent attribution to SonotaCo Network on every record.
2. (Optional, second phase) Contribute Astra Vault user observations back to your network in whatever format would be most useful — phone metadata, timestamp, location, bearing. We can do this under any license SonotaCo prefers (CC BY 4.0, public domain, attribution-only, or restricted).

To clarify one license question: from our research we understand SonotaCo's published archives are available for non-commercial research use with attribution. Astra Vault is a commercial product (the user-facing app is free, but it operates a token economy and we'll have premium tiers). **Could we discuss the licensing terms under which surfacing SonotaCo cross-reference matches inside our app would be acceptable to you?** We're open to any structure — formal license fee, attribution-only with a community contribution back, exclusivity carve-outs, etc.

We deeply respect that SonotaCo Network was built by and for the Japanese amateur meteor community, and we have no interest in disrupting that. Our role would be a downstream consumer (and possibly upstream contributor) that strengthens the network's reach and visibility.

If you'd prefer that we use the data only through bulk yearly archives (rather than any live API), please let us know — we can build either pattern.

I'd be grateful for any guidance on the right path forward. If there's a more appropriate point of contact at the network or at NAOJ for this kind of partnership, please point us there.

With respect,

**Stephen Furpahs**
Director, Astra Vault
[email contact placeholder]

## Notes for the Director
- This email should ideally be reviewed by a Japanese-fluent reader for tone — Japanese amateur-astronomy community is small, relationships matter, and the wrong tone reads as Silicon Valley extraction. The current draft errs toward formal-respectful but a native reviewer should confirm.
- A separate Japanese-language version may be welcome if the recipient prefers — we should be ready to deliver one if asked.
- If SonotaCo points us to NAOJ instead, that's a stronger institutional contact (Jun-ichi Watanabe) but a longer cycle. Worth pursuing in parallel.
- The "we'd like to contribute back" framing is important — it's the difference between an extraction request and a collaboration request.
- **License status from our research:** SonotaCo archives are published for non-commercial research use with attribution. Astra Vault is a commercial product. The commercial-license question is NOT optional — we cannot ship the SonotaCo integration to users until this is resolved. The draft surfaces this directly; the alternative would be quietly building the integration and getting a cease-and-desist later.
- The technical integration is already implemented in `services/apis/sonotacoNetwork.ts` (CSV-archive based, downloads + caches yearly drops). The integration is gated on the license conversation — code is ready to ship the moment we have written permission.
