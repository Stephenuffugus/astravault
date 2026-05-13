# ASTRA VAULT — HANDOFF PACKAGE FOR QUAD CODE
## From: Stephen Furpahs, Director / R&D Team (Claude)
## Date: May 13, 2026

---

## WHAT IS THIS

Astra Vault is a sky-scanning, star-collecting, citizen-science astronomy app in the SWS Proof of Attention Protocol ecosystem. This package contains everything you need to take it from prototype to production.

## WHAT'S IN THIS PACKAGE

```
astra-vault-handoff/
│
├── README.md                          ← YOU ARE HERE
├── ARCHITECTURE.md                    ← Recommended tech stack, project structure, data models
├── DESIGN_TOKENS.md                   ← Every color, font, spacing value, animation
│
├── prototype/
│   ├── astra-vault-v5.jsx            ← CURRENT BUILD — the clickable demo (React artifact)
│   └── astra-vault-v4.jsx            ← Previous version with live API integrations (NASA, ISS)
│
├── docs/
│   ├── ASTRA_VAULT_NEXTGEN_HANDOFF.md     ← Full vision document (meteor capture, smart glasses, everything)
│   ├── ASTRA_VAULT_HIDDEN_RESOURCE_MAP.md ← All 14 free APIs with endpoints and example queries
│   └── astra-vault-audit.docx             ← Patent audit (32 claims, send to attorney)
│
└── specs/
    ├── ATTENTION_PROTOCOL_SPEC-1.md            ← The core protocol (hash generation, payload structure, economy)
    ├── ATTENTION_PROTOCOL_INTEGRATION_GUIDE-1.md ← How to wire ATP into any game
    └── SWS_MASTER_REFERENCE.md                  ← Firebase project, data flow, infrastructure
```

## WHERE TO START

1. **Open `prototype/astra-vault-v5.jsx`** in Claude or any React renderer. Tap through it. This is the visual target — the design, the flows, the feel. It's not production code. It's a living spec.

2. **Read `docs/ASTRA_VAULT_NEXTGEN_HANDOFF.md`** — This is the master strategy document. It covers the meteor capture system, smart glasses integration, global competitive analysis, and the recommended build priority. This is the "what" and "why."

3. **Read `ARCHITECTURE.md`** (this package) — This is the "how." Recommended stack, project structure, data models, API integration patterns.

4. **Reference `docs/ASTRA_VAULT_HIDDEN_RESOURCE_MAP.md`** for all API endpoints. Every free resource is documented with example queries and what experience it powers.

5. **The `specs/` folder** contains the SWS Attention Protocol documentation. Every app in the ecosystem uses this. The hash generation pipeline, payload structure, and economy rules are non-negotiable — they're ecosystem-wide standards set by Stephen.

## THE FIVE-SENTENCE PITCH

Astra Vault lets you scan the sky, collect real astronomical objects across rarity tiers, learn astronomy through interactive lessons, and earn attention tokens for every moment of genuine engagement. When you see a meteor, say "METEOR" — the app captures, geotags, time-syncs, and cross-references your sighting against NASA's professional CAMS network to show you professional photos of the exact meteor you saw with your own eyes. A community of thousands shares the same sky without ever interacting — you see what's being collected, where people are observing, and collective missions you all contribute to, but there are no usernames, no chat, no profiles. The whole thing runs on the SWS Proof of Attention Protocol, generating SHA-256 cryptographic hashes that prove real human engagement, portable across every app in the ecosystem. It's built for phones first, smart glasses second, Pi Network tokenomics, and 14 free NASA/JPL APIs that no consumer app has ever surfaced.

## CONTACT

- **Stephen Furpahs** — Director, all approvals, economy decisions
- **game_id:** `astra_vault` (registered in SWS ecosystem)
- **Firebase project:** `focus-grove-fffa8` (shared across all SWS apps)
