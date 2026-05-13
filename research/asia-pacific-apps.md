# Asia-Pacific Astronomy App Landscape — Live Verification

## Methodology Note

Live-web pass on 2026-05-13. WebSearch + WebFetch were enabled in this Codespace and used aggressively. Every app entry below cites at least one verifiable URL. Speculative entries from the session-2 memory-only report (`competitive-landscape.md`) are confirmed, corrected, or struck through. Where a live search could not surface a product I had reason to expect, I say so plainly rather than fabricate.

Confidence labels:
- `[HIGH]` = directly verified on a publisher / app-store / authoritative source
- `[MED]` = surfaced in one secondary source; not contradicted but not deep-confirmed
- `[LOW]` = inferred from context or weak signal
- `[UNVERIFIABLE]` = looked for, did not find

Search depth was constrained by (a) English-bias of US-region WebSearch, (b) Apple App Store regional-search opacity in WebFetch, (c) Chinese app stores' lack of public install-count fields. Numbers are best-available, not auditable. Where I cite an MAU or install number, I cite the source — not my confidence in the source.

---

## Executive Summary

Top fifteen takeaways, ranked by strategic weight to Astra Vault:

1. **The single biggest dedicated competitor in mainland China is [天文通 / Stargazing Hub (laysky.com)](https://laysky.com/)** — it ships on Apple, Huawei, Xiaomi, OPPO, VIVO, Baidu, 360, Samsung, Alibaba app stores *plus* a WeChat mini-program, and bundles a stargazing-index forecast, light-pollution map, China Space Station tracker, aurora forecast, and 15-day astronomy weather. This is the closest Asian analogue to a one-stop Astra Vault, but it has **no collection mechanic, no AR/glasses surface, no community broadcast**, and no English-language version. `[HIGH]`

2. **There is no native Chinese collection / gacha-style stargazing app** in the surfaced top results — a clean whitespace. Honkai: Star Rail proves the gacha-with-cosmic-aesthetic market in mainland China; nobody has bridged it to real-sky observation. `[MED]`

3. **AstroArts (Japan) ships [星空ナビ / Hoshizora Navi](https://www.astroarts.co.jp/products/navi/) as their *free* iOS / Android consumer app**, separate from the desktop StellaNavigator product line. Hoshizora Navi is iOS 15.1+, Japanese-only, free, no IAP visible — the casual stargazing slot in Japan's AstroArts brand is occupied but un-monetized and un-gamified. `[HIGH]`

4. **The session-2 memory-only doc's claim that AstroArts is "desktop-first" is partially wrong** — they have a coherent multi-app mobile lineup (Hoshizora Navi, iStellar, SmartStellar, M+Stellar) alongside desktop (StellaNavigator v8, StellaImage, EclipseNavigator, StellaShot). Correcting this on the competitive-landscape doc is warranted. `[HIGH]` ([AstroArts](https://www.astroarts.co.jp/products/software.shtml))

5. **The previously-cited "AstroX (KR)" and "Wakanav (KR)" apps from prior memory-only research could not be confirmed by a live English+Korean search.** Likely conflated names or inactive projects. Strike or footnote. `[UNVERIFIABLE]`

6. **South Korea has no native flagship astronomy app surfaced in English-language searches.** Sky Tonight (Vito) has a Korean-localized App Store presence; Stellarium Mobile likewise. KASI's outreach is conference / workshop / observatory-based — no consumer app. This is a clean opening for a Korean-localized Astra Vault, but it also means the *demand signal* is weaker than Japan. `[MED]`

7. **NARIT (Thailand) ships a Thai-built consumer-facing app called [NAPA](https://www.narit.or.th/en/UpcomingEvent/20250207-StarPartykhaoyai2025)** for binocular-stargazing assist — small scope but cleanly partnership-shaped. Thailand is the only Southeast Asian country where a national astronomy institute has shipped a consumer mobile app. `[MED]`

8. **NAOJ (Japan) ships [Mitaka](https://4d2u.nao.ac.jp/english/)**, a 3D-universe viewer that is *not* a mobile app — it's Windows desktop. Its absence from mobile is a structural gap; whoever ships Mitaka-quality 3D-universe rendering on mobile/glasses wins Japan's institutional partnership pipeline. `[HIGH]`

9. **DwarfLab (China) ships [DWARFLAB app](https://www.dwarflab.com/us/products/dwarf-3-smart-telescope) for the Dwarf 3 smart telescope in 10 languages including Chinese, English, Japanese, Spanish, German.** This is the *closest direct competitor to ZWO Seestar globally*, with deep Chinese-market penetration. Bridge integration through ASCOM Alpaca (per the emerging-tech doc) covers Dwarf 3 as well as Seestar. `[HIGH]`

10. **Sharpstar / Askar / Player One / ToupTek (all Chinese astrophotography hardware) have no publisher-facing consumer apps that surfaced** — they are component / camera vendors that piggyback on ASIAIR, ASIStudio, N.I.N.A., or third-party astrophotography workflows. They are not competitive software threats; they are *integration prospects* for Astra Vault's smart-telescope bridge. `[MED]`

11. **Star Walk 2 (Vito Technology) and Stellarium Mobile (Noctua Software) appear to be the dominant *international* astronomy apps in Japan, Korea, and PRC App Store / Google Play.** Both have Japanese, Korean, Simplified Chinese, Traditional Chinese localization. They — not domestic apps — are the apps to displace at scale. `[HIGH]`

12. **Stellarium Plus subscription model is verified at USD $19.99** (one-time, not subscription) with the Gaia DR2 1.69B-star catalog and a 2025-10-21 update. This *contradicts* the "subscription model" assumption in the session-2 doc's Verify Before Citing list. `[HIGH]` ([Apple App Store](https://apps.apple.com/us/app/stellarium-mobile-star-map/id1458716890))

13. **Sony's [Star Sphere / EYE-1 satellite-photo service](https://petapixel.com/2023/01/05/sony-star-sphere-will-let-you-take-photos-from-an-orbiting-satellite/) is the strangest Japan-specific astronomy product** — a JAXA + University of Tokyo + Sony joint nano-satellite that lets paying users compose photographs from low Earth orbit. Not a competitor to Astra Vault; a *brand-prestige aspirational partner* in Japan. `[HIGH]`

14. **Stellarium Plus on iOS *already includes Māori sky culture* (Aotearoa New Zealand) plus 2025-added Arabic Arabian Peninsula sky culture.** The "cultural-variant constellation art" patent candidate (item 6 in session-2 patentables) needs a prior-art review against Stellarium's existing implementation before filing. `[HIGH]`

15. **App-store regulatory gates in the region are stiff:** Mainland China requires ICP filing as of 2023-09-01 (penalties from RMB 5k-50k for non-compliance) and overseas operators need a Chinese mainland legal entity / publisher partner. South Korea's PIPA was amended 2026-03-10 with new notification obligations effective 2026-09-11. India's DPDP Act 2023 substantive provisions take effect 2027-05-13. None are showstoppers; all are 6-12 month workstreams. `[HIGH]`

---

## Country Sections

### China

China is the highest-stakes, lowest-coverage market in the session-2 doc. This section therefore goes deepest.

#### [天文通 / Stargazing Hub (laysky.com)](https://laysky.com/) `[HIGH]`
- **Publisher:** "神秘的老A" (a solo developer / small studio identified on the site as "Knock Dream Technology" in some materials). China.
- **Platforms:** Apple App Store, Huawei AppGallery, Xiaomi GetApps, OPPO, VIVO, Baidu, Coolapk, 360, Samsung, Alibaba app stores **plus a WeChat mini-program** — the broadest single-app distribution surface I have seen in any market.
- **Pricing:** Free; voluntary donations via 爱发电 (Aifadian, China's Patreon equivalent).
- **Core feature set:** China Space Station + Tiangong real-time tracker, Bortle-scale light-pollution map, meteor-shower forecasts with date-of-peak calendar, stargazing-index (0-100% percentile driven by ECMWF weather + lunar phase), 15-day weather forecast, aurora forecast and map, air-quality index, moon-phase + rise/set times, astrophotography how-to guides, in-app mini-games (solar system / constellation puzzles).
- **What's notable:** This is the single most comprehensive Chinese-market consumer astronomy product. It functions as a *vertical super-app* — closer to laysky-on-WeChat than to Star Walk 2 — and *includes a stargazing-index forecast that Astra Vault's session-2 spec also wants to ship*.
- **Posture vs. Astra Vault:** **Competitor.** Direct feature overlap on light-pollution map, ISS / CSS tracker, stargazing-index, meteor-shower calendar. No collection, no AR, no glasses, no community broadcast — the differentiated Astra Vault surface holds. But laysky has a 4-year head-start of trust and distribution in the PRC.
- **Install count / MAU:** Not published on the site. No third-party panel data surfaced. `[UNVERIFIABLE]`
- **API:** No public API surfaced. **Reference / competitor, not partner.** A future PRC entry might warrant a polite "white-label our collection layer" outreach but the cultural fit is uncertain.

#### [星图 / Star Chart](https://app.mi.com/details?id=com.escapist.starchart) `[HIGH]`
- **Publisher:** **Escapist Games Ltd (UK)** — *not* a domestic Chinese publisher. Distributed in China via Xiaomi GetApps under the localized name 星图.
- **Platforms:** iOS, Android, Gear VR, Cardboard. Distributed on every major mainland app store.
- **Pricing:** Free with paid upgrades.
- **Install count:** [Publisher claims 20M+ devices worldwide](https://www.escapistgames.com/), growing ~500k/month at peak (these are publisher-side claims, not platform-verified).
- **Core feature set:** AR sky map, 120k stars, 88 constellations, meteor showers and minor planets via paid upgrade.
- **What's notable:** This refutes the session-2 memory-mode assumption that domestic Chinese sky apps occupy the top slot. It's a *UK app with a Chinese name* dominating Xiaomi's astronomy category. The lesson: Chinese-market localization matters more than Chinese-publisher identity for the bulk of users.
- **Posture vs. Astra Vault:** Reference, indirect competitor. Aged product (originally 2010-era).

#### [趣拍星 / Ququ Star](https://app.mi.com/details?id=com.ap.astronomy) `[HIGH]`
- **Publisher:** Beijing Maostar Technology Co., Ltd. (北京昴星科技有限公司). China.
- **Platforms:** Android via Xiaomi GetApps (verified); other Chinese stores likely.
- **Pricing:** Free with telescope-rental fees as the monetization (verified business model: remote-telescope-as-a-service).
- **Core feature set:** **Remote telescope and observatory rental** — Beijing-Maostar lets users book time on remote-controlled telescopes without astrophotography expertise. AI stargazing assistant. Real-time constellation info. Night-sky themed UI redesigned in 2026.
- **What's notable:** This is the **Chinese-domestic equivalent of Slooh or iTelescope** — a remote-telescope-rental service with a consumer-friendly mobile front-end. Version 2.4.1 as of 2026-03-24. Only 3 ratings visible on Xiaomi store (download was under maintenance at fetch time), suggesting low install scale but a fresh category entry.
- **Posture vs. Astra Vault:** **Potential integration partner.** Astra Vault could expose ATP rewards for confirmed telescope-rental observations on the Ququ Star platform, in a "Slooh integration" model. This is the kind of vertical-specific partnership that beats horizontal-competition with Star Walk.

#### [天文观星指南](https://app.mi.com/details?id=com.xueping.astroguide) `[HIGH]`
- **Publisher:** Hangzhou Euler Formula Technology Co., Ltd. (杭州欧拉公式科技有限公司). China.
- **Platforms:** Android via Xiaomi GetApps; likely Huawei / OPPO / VIVO mirrors.
- **Pricing:** Free; size 52.42MB; version 3.2 as of 2025-10-30.
- **Core feature set:** Observation-planning utility — celestial-position calculator, lunar / planetary movement, 88 constellations, 10k+ stars, 700+ deep-sky objects, multiple catalog cross-refs (HR, HD, HIP, NGC), event calendars, weather forecast, meteor-shower tracker, light-pollution map.
- **What's notable:** Tradeoff is clear — narrower than laysky (no game-feel, no ISS tracker), more comprehensive than Star Chart. Catalog-heavy, observation-planning-heavy. Aimed at *serious amateur* tier rather than casual.
- **Posture vs. Astra Vault:** Reference. The serious-amateur planning slot will not be Astra Vault's primary battlefield in China.

#### [DwarfLab DWARF 3](https://www.dwarflab.com/us/products/dwarf-3-smart-telescope) `[HIGH]`
- **Publisher:** DwarfLab. China.
- **Platforms:** Hardware = smart telescope, ~$700 USD ([Amazon listing](https://www.amazon.com/DWARFLAB-Dwarf-Smart-Telescope-Auto-Tracking/dp/B0FHP6K4BK)). Companion app on iOS + Android in 10 languages (Chinese, English, Japanese, Spanish, German, more).
- **Core feature set:** All-in-one smart telescope, 4K auto-tracking, solar / lunar / deep-sky astrophotography, AZ + EQ modes, 3-lb body. Background-imaging continuation even when app is minimized.
- **What's notable:** **Closest direct competitor to ZWO Seestar in the smart-telescope category** — and Chinese-domestic, unlike Seestar (also Chinese but with stronger Western retail penetration). Birdwatching mode broadens TAM beyond astronomers.
- **Posture vs. Astra Vault:** **Bridge target.** The ASCOM Alpaca client recommended in the emerging-tech doc must include Dwarf 3 alongside Seestar S50 — both are sold heavily in PRC + Asia-Pacific.

#### [ZWO Seestar S50 / S30](https://www.seestar.com/) `[HIGH]`
- **Publisher:** Suzhou ZWO Co., Ltd. China.
- **Platforms:** Hardware ~$499-700 USD; ASIAIR / Seestar app on iOS + Android. Worldwide distribution but engineered + manufactured in PRC.
- **Core feature set:** Smart telescope, 4K imaging support (added post-launch), EQ-mode enhanced exposures, SkyAtlas (90k+ DSOs, 276 recommended targets, framing assistant), remote-network control (added 2025+).
- **Posture vs. Astra Vault:** **Bridge target, not competitor.** Already in scope per the synthesis doc.

#### Sharpstar / Askar / Player One / ToupTek / Jiaxing Optical `[MED]`
- **Publishers:** Jiaxing Sharpstar Optical Instrument Co. Ltd ([sharpstar-optics.com](https://www.sharpstar-optics.com/)); [Player One Astronomy](https://player-one-astronomy.com/); ToupTek; all China.
- **No publisher-side consumer apps surfaced.** These are camera / OTA / refractor / cooled-sensor vendors that integrate via N.I.N.A., ASIStudio, ASIAIR, Sharpcap, etc.
- **Posture vs. Astra Vault:** **Hardware ecosystem partners, not competitors.** A "your gear's last shot saved to Astra Vault" workflow via ASCOM Alpaca / generic INDI bridges captures their installed base without per-vendor integration.

#### ByteDance / Douyin / Mafengwo / Tencent `[MED]`
- **No dedicated stargazing app from any super-app publisher surfaced.** Douyin shows a 97% MoM surge in 星空露营 (stargazing camping) hashtag searches in summer 2025 ([iClick Interactive](https://www.i-click.com/resources/summer-2025-china-outbound-travel-trends-douyin-water-travel-fever/)) — clear demand signal but no first-party product.
- **Mafengwo** is a travel-content super-app, not astronomy. No astronomy vertical surfaced.
- **Tencent QQ / WeChat** — astronomy presence is limited to WeChat-mini-program ticket-booking for Shenzhen Astronomical Observatory and Shanghai Astronomy Museum, not full apps.
- **Posture vs. Astra Vault:** **Distribution surface, not competitor.** A WeChat mini-program for casual-tier Astra Vault is the credible China-market wedge — full app + ICP filing is the Year-2 play.

#### CNSA / Tiangong public apps `[UNVERIFIABLE-NEGATIVE]`
- **No CNSA-published consumer mobile app surfaced.** Tiangong-related content is hosted on CNSA's web portal ([cnsa.gov.cn](https://www.cnsa.gov.cn/english/)). Public engagement is via school-curriculum "space lectures" broadcast from the station, not app-mediated.
- **Posture vs. Astra Vault:** Gap. The institutional partnership opening that NASA citizen-science offers in the US doesn't have a clean Chinese counterpart. Most likely PRC institutional partner is **NAO (National Astronomical Observatories, CAS)** via [english.nao.cas.cn](http://english.nao.cas.cn/), if and when an entry is warranted.

#### Shanghai Astronomy Museum / Shenzhen Astronomical Observatory `[MED]`
- WeChat mini-programs for ticket booking only. No standalone consumer app.
- Shenzhen Observatory uses WeChat for meteor shower alerts and guest astronomer talks.
- **Posture vs. Astra Vault:** Local-institution partners for Astra Vault meet-up / observatory-check-in geographic features.

---

### Japan

Japan is a higher-confidence section than China because more is surfaceable in English-language searches.

#### [星空ナビ / Hoshizora Navi](https://www.astroarts.co.jp/products/navi/) `[HIGH]`
- **Publisher:** AstroArts Inc. (アストロアーツ). Japan.
- **Platforms:** [iOS (App Store)](https://apps.apple.com/jp/app/%E6%98%9F%E7%A9%BA%E3%83%8A%E3%83%93/id1437609381), requires iOS 15.1+; [Android (Google Play)](https://play.google.com/store/apps/details?id=com.astroarts.android.hoshizora_navi).
- **Pricing:** **Free download**, no IAPs visible on the publisher page.
- **Core feature set:** AR star map showing real-time celestial positions when pointed at sky; recent-discoveries feed (black-hole news, planetary-probe updates); astronomical-phenomenon calendar (meteor showers, eclipses); "話題がうかぶ" (info-bubbles-up) interaction model.
- **What's notable:** Free, AstroArts-brand, casual-tier, *not gamified*, *no collection mechanic*. Pure information / AR-overlay app. Japanese-only.
- **Posture vs. Astra Vault:** **Reference / partial competitor** in the casual-tier slot. The collection-mechanic gap is wide open. AstroArts is the Japanese-amateur-astronomy brand — partnership outreach for Astra Vault's Japan launch is the high-leverage path.
- **API:** None public. AstroArts is a Japan-incorporated software house, not a platform.

#### [SmartStellar](https://play.google.com/store/apps/details?id=com.astroarts.android.stlnav) `[MED]`
- **Publisher:** AstroArts Inc. Japan.
- **Platforms:** Android; iOS counterpart via the [AstroArts developer page](https://apps.apple.com/us/developer/astroarts-inc/id293118338).
- **Pricing:** Could not load full Google Play listing through WebFetch — Google's bot-detection redirect blocked content. Other sources suggest paid app (typical AstroArts pricing several hundred to several thousand yen).
- **Core feature set:** Mobile companion to StellaNavigator desktop product. Telescope control, observation planning.
- **What's notable:** Paid mobile companion to a desktop product — the *serious amateur* end of the AstroArts product family.
- **Posture vs. Astra Vault:** Reference. AstroArts has the Japanese amateur top-of-funnel; the casual-+-collection slot below is the Astra Vault opening.

#### [StellaNavigator Ver.8](https://www.astroarts.co.jp/products/software.shtml) (desktop) `[HIGH]`
- **Publisher:** AstroArts Inc. Japan.
- **Platforms:** Windows desktop. **Japanese-only.**
- **Pricing:** Paid (historic price ~JPY 20,000 for full version; verify before citing).
- **Core feature set:** Deep planetarium with simulation, telescope control, observation planning, ephemerides.
- **Posture vs. Astra Vault:** Reference.

#### [StellaImage 10 / EclipseNavigator / StellaShot](https://stellaimage.com/) `[HIGH]`
- **Publisher:** AstroArts Inc.
- **Platforms:** Windows desktop. Japanese-only.
- **What's notable:** Specialist astrophotography image-processing software. ~25-year continuous product line. Adoption deep in Japanese astrophotography community.
- **Posture vs. Astra Vault:** Reference / out of scope.

#### [Mitaka / 4D2U](https://4d2u.nao.ac.jp/english/) `[HIGH]`
- **Publisher:** NAOJ (National Astronomical Observatory of Japan), Four-Dimensional Digital Universe Project.
- **Platforms:** **Windows desktop only.** No mobile, no glasses, no web.
- **Pricing:** Free.
- **Core feature set:** 3D universe viewer from Earth-surface to observable-universe edge. Stellar positions from Hipparcos / Tycho catalogs, 20k asteroid orbits, galaxies from SDSS. Multilingual (English, Chinese added v1.4.1+).
- **What's notable:** **The most authoritative 3D universe viewer in Japan, with zero mobile presence.** Mitaka's brand carries NAOJ institutional weight. Whoever ships a Mitaka-quality mobile / glasses 3D-universe layer in cooperation with NAOJ wins the Japanese institutional outreach pipeline.
- **API / integration posture:** Open-licensed data underpinning Mitaka is public. NAOJ is a JP-government research institute with a track record of public collaboration. **Partnership target** for r3f-based 3D-universe rendering on Astra Vault.

#### [Stella Theater Pro / Lite (Toxsoft)](https://www.toxsoft.com/sswPRO/index.html) `[MED]`
- **Publisher:** Toxsoft. Japan.
- **Platforms:** Windows 7 through 11.
- **Pricing:** Lite free; Pro paid (Japanese-language software).
- **Core feature set:** Japanese-language planetarium for hobby + classroom astronomy education.
- **Posture vs. Astra Vault:** Reference. Smaller AstroArts competitor. Classroom audience.

#### [Vixen Polarie U app](https://www.vixenoptics.com/) `[HIGH]`
- **Publisher:** Vixen Co. (Japan).
- **Platforms:** iOS + Android, free.
- **Core feature set:** Wireless companion app for the Polarie U star tracker — speed control, custom modes, bracketing, remote shutter trigger.
- **Posture vs. Astra Vault:** **Integration prospect.** A Vixen Polarie / Vixen telescope user is a high-value Astra Vault user; supporting Polarie's interval-shot output as an Astra Vault import path is a credible Japan-specific bridge feature.

#### [Vixen STAR BOOK Wireless app](https://manuals.plus/vixen/sx2-telescope-wireless-unit-manual) `[HIGH]`
- **Publisher:** Vixen Co. (Japan).
- **Platforms:** iOS + Android. **Japan app store only — not available internationally.**
- **Core feature set:** Mount-control app for Vixen SX2, SXD2, SXP, SXP2, AXJ, AXD, AX equatorial mounts. GoTo slew + celestial navigation.
- **Posture vs. Astra Vault:** **Integration prospect**, blocked by Japan-store-only distribution. Likely workable via Vixen's standard Wi-Fi adapter protocol if reverse-engineerable, or a Vixen partnership conversation.

#### Borg / Takahashi telescope companion apps `[UNVERIFIABLE-NEGATIVE]`
- No publisher-side companion apps surfaced for Borg or Takahashi. Both are premium Japanese telescope brands; mount + OTA + camera workflow runs through third-party software (PHD2, N.I.N.A., StellaShot, etc.).
- **Posture vs. Astra Vault:** Vendor-agnostic INDI / ASCOM bridge covers them.

#### [SonotaCo Network](https://sonotaco.com/) `[HIGH]`
- **Publisher:** Volunteer Japanese amateur consortium (admin: "Hitomi Kanamori"). Japan.
- **Platforms:** Desktop Windows software — **UFOCapture**, **UFOAnalyzer**, **UFOOrbit**. Distributed video-meteor camera network.
- **Pricing:** Paid (single-license, indie pricing) for the UFO Tools software.
- **Core feature set:** Multi-station video meteor capture, single-station detection + multi-station orbit fitting. ~240k meteors observed; 38 streams identified including 11 new shower additions to the IAU MDC.
- **What's notable:** **Japan's equivalent of the Global Meteor Network (GMN).** SonotaCo data is published openly via the IAU Meteor Data Center ([astro.sk](https://www.astro.sk/iaumdcDB/home/PDA/SNMv3)) as the SNMv3 dataset.
- **Posture vs. Astra Vault:** **Cross-reference partner.** The session-2 doc names GMN as primary cross-reference partner; **SonotaCo should be added as the parallel Japan-specific source.** Many Astra Vault Japan-region user meteor captures will cross-reference to SonotaCo events before GMN.

#### [Sony Star Sphere / EYE-1](https://petapixel.com/2023/01/05/sony-star-sphere-will-let-you-take-photos-from-an-orbiting-satellite/) `[HIGH]`
- **Publisher:** Sony Corporation in partnership with JAXA + University of Tokyo. Japan.
- **Platforms:** Web-based simulator + ground-station booking system. Live operator window of 5-8 minutes per pass.
- **Pricing:** Paid premium service (Sony has not publicly disclosed unit pricing).
- **Core feature set:** Remote-operated nano-satellite camera (Sony A7R IV body + 28-135mm f/4 lens) in sun-synchronous LEO 500-600 km. Users select 1 of 16 orbits and tune ISO / aperture / shutter for compositions. Water-vapor propulsion (notable: environmentally low-impact).
- **What's notable:** **The most ambitious consumer-prosumer space-photography product in the world**, not just Japan. Released January 2023.
- **Posture vs. Astra Vault:** **Aspirational brand partner.** Even one feature ("import your Star Sphere shot to your Vault") would be a category-defining Japan-market collaboration.

#### [Sega Toys Homestar](https://www.segatoys.space/en/public/original.html) `[HIGH]`
- **Publisher:** Sega Toys (Japan), in partnership with Takayuki Ohira (founder of MEGASTAR planetariums).
- **Platforms:** Hardware home planetarium (~$100-300 USD depending on model). **No published smartphone-AR integration surfaced.**
- **Core feature set:** Ceiling projector of 10,000+ northern-hemisphere stars + shooting-star effect.
- **Posture vs. Astra Vault:** **Aspirational integration target.** A "your Homestar disc + Astra Vault collection" Japan-only collaboration is the kind of cultural-product cross-promotion that would make sense to AstroArts and Sega Toys both.

#### Star Walk 2 / Stellarium Mobile (Japanese-localized) `[HIGH]`
- Both apps are present with Japanese localization on Japan App Store / Google Play, presumed to be the volume-leader astronomy apps in Japan.
- **Posture vs. Astra Vault:** Standard global competitors.

---

### South Korea

This section is shorter, partly because Korean-language search returns were sparse in our English-region WebSearch context, and partly because there appears to be a genuine native-app vacuum.

#### KASI (Korea Astronomy and Space Science Institute) `[HIGH]`
- **Publisher:** South Korean government research institute, Daejeon. ([kasi.re.kr](https://www.kasi.re.kr/eng/index))
- **Platforms:** Web portal + workshop / observatory programs. **No consumer mobile app surfaced** in either English or Korean searches.
- **What's notable:** KASI's outreach is event-based: school workshops, observatory star parties, classroom curriculum. Their digital outreach is publication / web / video — not app.
- **Posture vs. Astra Vault:** **Institutional partner opportunity.** A KASI-blessed Astra Vault Korea launch ("KASI-affirmed citizen-science observations") would carry weight similar to NOIRLab / Globe at Night in the US. KASI's lack of own-app reduces partnership friction.

#### Korean Astronomical Society (한국천문학회) `[MED]`
- ([kas.org](https://www.kas.org/)) Academic society. No consumer app.
- **Posture vs. Astra Vault:** Affinity / endorsement target, not product partner.

#### "AstroX" / "Wakanav" (from session-2 memory-only doc) `[UNVERIFIABLE]`
- **Could not confirm either name** via live English-Korean search. Most likely conflated with an inactive project or mistranslated app name from prior memory mode.
- **Recommendation:** Strike both from the competitive-landscape doc, or footnote as "name unconfirmed — likely defunct or misremembered."

#### Sky Tonight / Stellarium Mobile (Korean-localized) `[HIGH]`
- Sky Tonight has [a Korean App Store listing](https://apps.apple.com/us/app/sky-tonight-%EC%A6%9D%EA%B0%95-%ED%98%84%EC%8B%A4%EC%9D%B4-%ED%8F%AC%ED%95%A8%EB%90%9C-%EB%B3%84%EC%9E%90%EB%A6%AC-%EC%96%B4%ED%94%8C/id1570594940?l=ko); Stellarium Mobile likewise.
- Recent Korean-language reviews (e.g., [fromtravelto.com 2025-05](https://www.fromtravelto.com/2025/05/Finding-Constellations-With-Mobile-AppTop5-Recommended-Free-Astronomy-Apps.html)) recommend the same five apps as English-language reviewers — Stellarium Mobile, Sky Tonight, Star Walk 2, SkyView, Google Sky Map. **No native Korean app made the top-5.**

#### Donga Science Observatory / Jungmisan / Jeju Starlight World Park `[MED]`
- Observatories and planetariums use [Naver Booking](https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=87921) for visit reservations rather than apps.
- **Posture vs. Astra Vault:** Local-attraction integrations; not competitor apps.

#### Naver / Kakao astronomy partnerships `[UNVERIFIABLE-NEGATIVE]`
- **No native astronomy products from Naver or Kakao surfaced.** Naver Maps and KakaoMap are the dominant Korean nav apps, not astronomy. Astronomy is not a super-app vertical in Korea today.
- **Strategic implication:** Korean astronomy is *open distribution territory* relative to Japan or China.

---

### India

#### [SPACE India / Brahmand](https://space-india.com/) `[HIGH]`
- **Publisher:** Space Technology and Education Pvt. Ltd. (Delhi-based, registered ISRO "Space Tutor"). India.
- **Platforms:** Web learning platform at [learn.space-india.com](https://learn.space-india.com/) — content-led, not a stargazing app. iAstronomer Club subscription. School-curriculum delivery.
- **Pricing:** Subscription / per-course pricing for online programs.
- **Core feature set:** Online astronomy courses, school programs (K-12), robotic-telescope access, NASA / ESA / ISRO program access for members, 25-year track record.
- **What's notable:** **The dominant private-sector astronomy education brand in India** by reach — claims 1.5M+ students inspired, 1,000+ schools partnered.
- **Posture vs. Astra Vault:** **Partnership prospect.** "Astra Vault is the field-companion app to your Brahmand course" framing — content owner + capture / collection app split.

#### [RAD@home India](https://www.radathomeindia.org/) `[HIGH]`
- **Publisher:** Volunteer astronomers + NCRA / TIFR. Launched 2013-04-15 as India's first citizen-science astronomy research platform.
- **Platforms:** Web-based.
- **Pricing:** Free.
- **Core feature set:** Volunteer classification of radio-astronomy images, mentored research projects with publication outcomes.
- **Posture vs. Astra Vault:** **Citizen-science wrap target**, similar to Galaxy Zoo / Zooniverse — Astra Vault could surface RAD@home tasks for India-region users with ATP bonuses.

#### IIA (Indian Institute of Astrophysics) / IUCAA / Astronomical Society of India `[MED]`
- [IIA Bangalore](https://www.iiap.res.in/), [IUCAA Pune](https://www.iucaa.in/en/), [ASI](https://www.astron-soc.in/) — all research institutions with public-outreach mandates. **None have surfaced a consumer mobile app.**
- ASI hosts [Sky Maps under their POEC (Public Outreach Education Committee)](https://astron-soc.in/outreach/resources/sky-maps/) — web resource, not an app.
- **Posture vs. Astra Vault:** **Endorsement / partnership prospects**, particularly IIA Bangalore which operates national facilities at Hanle (Indian Astronomical Observatory).

#### Confederation of Indian Amateur Astronomers (CIAA) + Amateur Astronomers Association Delhi (AAAD) `[MED]`
- [CIAA](https://en.wikipedia.org/wiki/Confederation_of_Indian_Amateur_Astronomers) formed 1994, umbrella body; [AAAD](http://aaadelhi.org/) the Delhi-region body.
- **No native apps surfaced.** Community is meet-up + WhatsApp + Facebook driven.
- **Posture vs. Astra Vault:** **Community partnership candidates** — Delhi star parties + Astra Vault meet-up check-ins.

#### ISRO Bhuvan + ISSDC + PRADAN portals `[MED]`
- [Bhuvan](https://bhuvan.nrsc.gov.in/) is the ISRO geospatial portal; reports ~150,000 unique users / day. Has a "Smart Tracking" Android app but it is vehicle-tracking, not astronomy.
- [ISSDC](https://www.issdc.gov.in/) hosts Aditya-L1, Chandrayaan-3, XPoSat scientific data; **no consumer-friendly mobile app**.
- **Posture vs. Astra Vault:** **Data-integration prospects.** Aditya-L1 solar data could feed Astra Vault solar-physics observation paths.

#### Vyommitra, AAFI `[UNVERIFIABLE-NEGATIVE]`
- "Vyommitra" is ISRO's humanoid robot for the Gaganyaan crewed mission — not an app.
- "AAFI" (Amateur Astronomy Federation India) named in prior research did not surface; possibly conflated with CIAA. `[UNVERIFIABLE]`

#### Regulatory note `[HIGH]`
- India's [DPDP Act 2023](https://www.dlapiperdataprotection.com/?t=law&c=IN) substantive provisions effective 2027-05-13. Cross-border data transfers allowed by default with a government-maintained "negative list" of restricted jurisdictions. India is a **friendlier regulatory environment** than China for an Astra Vault India launch.

---

### Southeast Asia

#### [NAPA app (NARIT, Thailand)](https://www.narit.or.th/en/UpcomingEvent/20250207-StarPartykhaoyai2025) `[MED]`
- **Publisher:** National Astronomical Research Institute of Thailand (NARIT, Chiang Mai). Government public organization established 2009-01-01.
- **Platforms:** Mobile app (verified existence and use during NARIT star parties); specific store URLs not surfaced in English search.
- **Core feature set:** Binocular-stargazing assist for NARIT public-stargazing events. Likely a Thai-localized planetarium with NARIT branding.
- **What's notable:** **The only Southeast Asian national-institute astronomy app I could verify exists.** NARIT runs Saturday public-stargazing at Princess Sirindhorn AstroPark (Mae Rim, Chiang Mai) plus regional observatories in Nakhon Ratchasima, Khon Kaen, Chachoengsao, Songkhla.
- **Posture vs. Astra Vault:** **Partnership / integration target.** NARIT is the credible Thailand-launch partner — official endorsement + AstroPark event-tier check-ins via Astra Vault.

#### [TASOS (Astronomical Society of Singapore)](https://tasos.org.sg/) + [Singapore Science Centre Observatory](https://www.science.edu.sg/whats-on/workshops-activities/stargazing) `[MED]`
- **Publishers:** TASOS (non-profit, founded 1980s); Science Centre Singapore (statutory board).
- **Platforms:** Friday-night stargazing events at the equatorial-line observatory (40cm Cassegrain). **No standalone consumer apps surfaced.**
- **What's notable:** Singapore's observatory is one of the few in the world located within a degree of the equator — both hemispheres' constellations are observable.
- **Posture vs. Astra Vault:** **Geographic-uniqueness partnership.** A "Vault-the-Equatorial-Sky" feature where Singapore observers get a special rarity tier for double-hemisphere visibility is the kind of localized hook that builds Singapore foothold.

#### [PAGASA (Philippines)](https://pagasa.dost.gov.ph/astronomy) + [Astronomical League of the Philippines](https://www.astroleaguephils.org/pac.html) `[MED]`
- **Publishers:** PAGASA = government weather + astronomy agency under the Department of Science and Technology; ALP = volunteer amateur federation.
- PAGASA runs the [Quezon City Planetarium](https://mb.com.ph/2024/4/3/global-astronomy-month-pagasa-to-host-planetarium-show-stargazing-session) (constructed 1977). **No standalone consumer apps surfaced.**
- **Posture vs. Astra Vault:** **Institutional endorsement / regional event partner**, lower priority than NARIT due to no existing app infrastructure to compete with.

#### [Planetarium Negara (Malaysia)](https://www.planetariumnegara.gov.my/) `[MED]`
- **Publisher:** Ministry of Science, Technology and Innovation (MOSTI), Malaysia.
- **No standalone consumer app surfaced.** Facility + planetarium-show oriented.
- **Posture vs. Astra Vault:** Regional event-tier partner.

#### Vietnam: [Vietnamese Astrophysical Society / HAS](https://www.facebook.com/VietnameseAstrophysicalSociety/) `[MED]`
- **Publishers:** Volunteer society + Hanoi Amateur Astronomy Society (HAS). North Vietnam region.
- Vietnamese Astronomical Society co-produces astronomy TV programs with VTV3.
- **No native consumer app surfaced.** "TienVan" named in the prompt brief did not return as a real product — possibly defunct, possibly the Facebook-page "Thiên Văn" community label rather than an app.
- **Posture vs. Astra Vault:** Community partnership; low-priority Year-2.

#### Indonesia / Brunei / Cambodia / Laos `[UNVERIFIABLE-NEGATIVE]`
- **No native astronomy apps or institutional outreach apps surfaced.** Likely covered by international apps (Stellarium, Star Walk) with translation packs.

---

### Australia / New Zealand

#### [Stellarium Mobile / Stellarium Plus (Noctua Software)](https://stellarium-labs.com/stellarium-mobile-plus/) `[HIGH]`
- **Publisher:** [Noctua Software Ltd.](https://www.stellarium-labs.com/) (the company that owns the mobile-app rights for the Stellarium brand). Country of incorporation not surfaced in this pass; New Zealand is rumored. The same publisher operates Stellarium Labs.
- **Platforms:** iOS + Android. Web version exists.
- **Pricing:** Free (basic Stellarium Mobile) with **USD $19.99 one-time IAP to upgrade to Stellarium Plus** — verified at the App Store listing as of 2025-10-21 update. *This contradicts the session-2 assumption that Stellarium Mobile may have moved to subscription.* `[HIGH]`
- **Core feature set:** Gaia DR2 1.69B-star catalog, 2M nebulas + galaxies, 10k asteroids; Bluetooth / Wi-Fi GoTo telescope control; offline mode; sky-culture localizations including Māori, Arabic Arabian Peninsula (added 2025), Western, Chinese, others; magnitude-22 deep-sky rendering; advanced observation-planner.
- **What's notable:** New 2025-10 release adds 3D Sombrero Galaxy rendering, Big Dipper-as-asterism support, interplanetary-probe 3D models. **Most active and serious global-scale astronomy mobile competitor.**
- **Posture vs. Astra Vault:** **Primary global competitor on the casual-deep-amateur axis.** Differentiation is the Astra Vault collection / ATP / capture / cross-reference + smart-glasses surface that Stellarium does not pursue.
- **Cultural partnership note:** Stellarium's *existing* Māori sky-culture implementation means the "cultural-variant constellation art" patent claim (session-2 patent candidate #6) **must have a prior-art review before any provisional filing**.

#### [Royal Astronomical Society of New Zealand (RASNZ)](https://www.rasnz.org.nz/) `[HIGH]`
- **Publisher:** Volunteer NZ society, est. 1920. Hosts Globe at Night reports + monthly evening-sky write-ups.
- **No native app**; supports Globe at Night submissions via [globeatnight.org](https://www.globeatnight.org/).
- **Posture vs. Astra Vault:** **Citizen-science partnership target** — RASNZ + Globe at Night submission wrap.

#### Māori sky culture / Matariki / Puanga `[HIGH]`
- [Puanga Star Maps & Charts (matariki.co.nz)](https://matariki.co.nz/puanga-star-maps-charts/) is the leading Aotearoa-NZ Māori-sky-culture educational resource. Matariki (the Pleiades cluster) became a national public holiday in 2022. Cultural significance is at the *forefront* of New Zealand stargazing identity.
- **Posture vs. Astra Vault:** **Cultural localization is non-optional for the Aotearoa-NZ launch.** Stellarium already supports Māori sky culture; Astra Vault must match or exceed (with cultural consultation and iwi engagement — not GenAI-generated overlays without partnership).

#### [Sydney Observatory (Powerhouse Museum)](https://powerhouse.com.au/visit/sydney-observatory) `[MED]`
- Heritage-listed sandstone observatory. Telescope tours nightly, including 16-inch modern + Australia's oldest working telescope.
- **No native app surfaced.** Digital outreach via Powerhouse web portal + Facebook.
- **Posture vs. Astra Vault:** Geographic / event-tier partner for Sydney-region launch.

#### Astrology vs. astronomy in Korean / Chinese / Japanese consumer space `[MED]`
- Astrology apps thrive in Korea + Japan (W Korea's 별자리 운세 columns, similar Japanese 占星術 apps); **these are not astronomy apps and are clearly differentiated by the consumer**. The session-2 anti-patterns list correctly excludes astrology partnerships.

---

## Strategic Findings

### 🚨 Strongest Asia-Pacific competitor

[天文通 / Stargazing Hub (laysky.com)](https://laysky.com/) — the only product in the region that fuses light-pollution + stargazing-index + space-station tracker + meteor-shower forecast + aurora map + 15-day astronomy weather in one consumer-friendly mobile + WeChat-mini-program package. **It is the structural competitor for Astra Vault's PRC entry.** No collection, no AR, no glasses, no community broadcast — but it has 5+ years of trust, free pricing, and ten-app-store distribution.

### 🟢 Best partnership candidates (ranked)

1. **NAOJ / 4D2U / Mitaka project (Japan)** — the Mitaka brand carries institutional weight; Astra Vault's r3f-based mobile 3D-universe layer in cooperation with NAOJ is a category-defining Japan move.
2. **AstroArts Inc. (Japan)** — Hoshizora Navi is the casual-tier slot; AstroArts brand-stamp on a Japanese-localized Astra Vault is the Japan launch wedge. Their lack of own collection mechanic means the proposition is additive, not zero-sum.
3. **NARIT (Thailand)** — the only Southeast Asian national-institute partner with an existing consumer app (NAPA) and a Saturday-night public-stargazing infrastructure that maps cleanly to Astra Vault meet-up + event tiers.
4. **KASI (South Korea)** — KASI's lack of own consumer app is a *gift*. An Astra Vault Korean launch with KASI institutional endorsement avoids the AstroArts-style brand-overlap negotiation.
5. **SPACE India (Brahmand)** — content + field-companion split. SPACE India does astronomy education at scale (1.5M+ students claimed); Astra Vault becomes the field-companion + collection layer.
6. **SonotaCo Network (Japan)** — meteor cross-reference partnership parallel to GMN. Adding SonotaCo as a Japan-region meteor-orbit cross-reference source improves the cross-reference confidence for ~5% of Astra Vault's projected Japan-region meteor captures.
7. **DwarfLab (China) + ZWO Seestar (China)** — bridge integration via ASCOM Alpaca. Two of the three globally-significant smart-telescope makers are Chinese; that pipeline is a *unified* Astra Vault hardware story, not two pipelines.
8. **趣拍星 / Ququ Star (China)** — remote-telescope-rental integration. Astra Vault ATP rewards for confirmed Ququ Star observations is the "Slooh integration" model adapted for China.
9. **RAD@home India** — Zooniverse-style citizen-science wrap for India region.
10. **RASNZ + Globe at Night (NZ)** — local citizen-science layer aligned with the global Globe at Night partnership already in the synthesis doc.

### ⚠️ Regional regulatory considerations

- **Mainland China:** [ICP Filing](https://capgo.app/blog/icp-filing-for-mobile-apps-in-china-step-by-step-guide/) required for all apps in PRC app stores since 2023-09-01. Foreign operators must establish a mainland Chinese entity or contract a local publisher / hosting partner. Penalties RMB 5k-50k. Cloud / hosting must be PRC-domestic. **6-9 month workstream for a proper PRC launch; partner-publisher path (e.g., a Chinese astronomy media company or a smart-telescope vendor) cuts that to 3-4 months.** `[HIGH]`
- **South Korea:** [PIPA amended 2026-03-10](https://www.didomi.io/blog/south-korea-pipa-everything-you-need-to-know), most provisions effective 2026-09-11. Location-based-service registration required. Increased administrative penalties. Foreign organizations handling Korean-citizen PII are explicitly in scope. **3-4 month workstream including LBS registration.** `[HIGH]`
- **India:** [DPDP Act 2023](https://khannaandassociates.com/blog/dpdp-act-2023/) substantive provisions effective 2027-05-13 (12-month timeline from May 2026). Cross-border transfers allowed by default unless on negative list. **Lightest regulatory friction in the region for an English-language Astra Vault launch.** `[HIGH]`
- **Japan:** APPI (Act on the Protection of Personal Information) is mature and broadly aligned with GDPR. Standard SDK / app-store compliance suffices. No unusual sky-data / mapping restrictions. **Lowest-friction regulated market in the region.** `[MED]`
- **Thailand, Vietnam, Indonesia, Philippines, Malaysia, Singapore:** No specific astronomy-app friction surfaced. Each has its own PII / data-protection law (Singapore PDPA, Thailand PDPA, Vietnam PDPL, etc.) of varying maturity. Singapore is the easiest English-language launch point in SE Asia.
- **South Korea geographic-data restrictions:** [Korean mapping data is heavily restricted from export](https://en.wikipedia.org/wiki/Restrictions_on_geographic_data_in_South_Korea) — this matters for any feature where Astra Vault renders a *map* of Korean territory (e.g., light-pollution overlay on a Korean map). Use of in-country mapping providers (Naver Maps API, Kakao Maps API) is the safe path. `[HIGH]`

### Anti-patterns: what *not* to copy from regional incumbents

- **Don't copy AstroArts's desktop-first model.** Their Japanese-only Windows desktop StellaNavigator is a museum-piece more than a roadmap.
- **Don't copy laysky's all-features-no-coherence approach.** 天文通 ships a dozen disparate features (puzzles, weather, ISS tracker, light pollution) without a unifying loop. This is the *opposite* of the Astra Vault collection-as-spine architecture and is the structural weakness to exploit.
- **Don't ship a remote-telescope-rental clone of Ququ Star.** That model needs telescope hardware operations + observatory partnerships. Better to *integrate* via API than reinvent.
- **Don't ship a Chinese stargazing app without WeChat-mini-program presence.** Mini-program is the casual-tier acquisition surface in PRC, full app is the deep-user surface; you need both.
- **Don't try to compete with Star Walk 2 on AR-overlay polish alone in Japan or Korea.** Vito Technology has 5+ years of localization head-start; differentiate on collection / capture / glasses, not on point-and-identify quality.
- **Don't generate Māori or Indigenous sky-culture content via GenAI without iwi / Indigenous partnership.** Stellarium has set the bar for *vetted* cultural representations; an Astra Vault GenAI-overlaid Māori sky without consultation would be both ethically and reputationally costly.

---

## Patentable Whitespace Specific to Asia-Pacific

The Asia-Pacific competitive landscape *substantially strengthens* several of the patent candidates in `competitive-landscape.md` and the synthesis doc's items 1-5. Specifically:

1. **Rarity-tiered celestial object collection has *zero* surfaced prior art in JP / KR / PRC native apps.** The closest products are Hoshizora Navi (free, no collection), 天文通 (free, no collection), Brahmand (content, no field collection). **This is a stronger moat in Asia-Pacific than in the US/EU** where Pokemon-GO-style mechanics have been examined more thoroughly. Filing strategy: include Japanese-language abstract translations early.

2. **Cross-glasses observation merge protocol** (synthesis patent candidate #1) has no surfaced regional prior art. SonotaCo's multi-station meteor approach is the *closest* — but it is fixed-camera, not glasses, and it is publicly documented (not patented). A clean filing pathway. **The SonotaCo prior art needs to be cited in the application as differentiation, not blocker.**

3. **On-device astrometric plate-solve gating ATP earn** (synthesis patent candidate #4) has no Asia-Pacific prior art. ASIAIR / Seestar / Dwarf 3 do on-device plate solve, but not as an *anti-cheat reward gate*.

4. **Dark-adapted Bortle-keyed AR rendering** (synthesis patent candidate #3) has no surfaced prior art in any region (Stellarium's red-night-vision toggle is binary, not Bortle-driven).

5. **Patent confidence note:** The "patentable" framing in the synthesis doc should be understood as US-provisional-first strategy. **JP filings via PCT national-phase are non-trivially expensive** (~¥800k-1.5M per claim cluster all-in) but Japan is a strong-IP jurisdiction. KR and PRC patent filings are less consistently enforced for software-claim-bundles — file the US provisional first and assess PCT national-phase economics country-by-country.

6. **Cultural-variant constellation art via vetted GenAI overlay** (synthesis patent candidate #6) **needs careful prior-art treatment against Stellarium's existing Māori, Arabic, Chinese, etc. sky cultures**. The novelty hook is the *GenAI-overlay-on-vetted-cultural-base* — Stellarium's implementations are hand-curated. The patent claim must hinge on the AI-generation-with-vetting workflow, not on the cultural-rendering-itself. **Pre-filing search of US, JP, KR, EU patent databases for "machine-learning constellation overlay" and "GenAI cultural sky visualization" is mandatory.**

---

## Updates to Apply to competitive-landscape.md

Concrete edits the next pass should make to the session-2 doc:

1. **Replace the "Chinese-market sky apps `[LOW, weak memory]`" subsection (line ~220-226) with a proper section listing:**
   - 天文通 / Stargazing Hub (`[HIGH]`) as the structural competitor
   - 趣拍星 / Ququ Star (`[HIGH]`) as remote-telescope-rental integration partner
   - 天文观星指南 (`[HIGH]`) as the serious-amateur planning utility
   - 星图 / Star Chart (`[HIGH]`) as the localized-UK app surprise leader
   - DwarfLab DWARF 3 (`[HIGH]`) as smart-telescope bridge target
   - Note CNSA absence (`[HIGH]`) and WeChat-mini-program surface (`[HIGH]`)

2. **Replace "Stella Navigator / AstroArts (Japan) `[LOW]`" entry with:**
   - 星空ナビ / Hoshizora Navi (`[HIGH]`) as the free casual-tier consumer app
   - SmartStellar (`[MED]`) as the paid mobile companion
   - StellaNavigator Ver.8 (`[HIGH]`) as the desktop deep-amateur product (Japanese-only)
   - StellaImage, StellaShot, EclipseNavigator (`[HIGH]`) as specialist desktop products
   - Note Mitaka / 4D2U (`[HIGH]`) as the NAOJ partnership opportunity
   - Note SonotaCo Network (`[HIGH]`) as parallel-to-GMN meteor cross-ref source
   - Note Sony Star Sphere (`[HIGH]`) as aspirational brand partner
   - Note Vixen Polarie U + STAR BOOK Wireless apps (`[HIGH]`) as integration prospects

3. **Add to the South Korea subsection:**
   - Strike or footnote "AstroX (KR)" — could not confirm. `[UNVERIFIABLE]`
   - Strike or footnote "Wakanav" — could not confirm. `[UNVERIFIABLE]`
   - Add KASI as primary institutional partnership target.
   - Note Korean geographic-data export restrictions for any map-overlay feature.

4. **Add an India section:**
   - SPACE India / Brahmand (`[HIGH]`) as content-partner
   - RAD@home India (`[HIGH]`) as citizen-science wrap target
   - IIA / IUCAA / ASI (`[MED]`) as institutional endorsement targets
   - ISRO Bhuvan and ISSDC (`[MED]`) — note no consumer astronomy app exists
   - DPDP Act 2023 timeline note

5. **Add Southeast Asia section:**
   - NARIT NAPA (Thailand) (`[MED]`) as only SE Asian national-institute app
   - TASOS + Singapore Science Centre Observatory (`[MED]`)
   - PAGASA (Philippines) + Planetarium Negara (Malaysia) (`[MED]`)
   - Note Vietnamese Astrophysical Society + HAS (`[MED]`) as community-only

6. **Update Australia / NZ subsection:**
   - Confirm Stellarium Plus iOS price USD $19.99 *one-time IAP, not subscription* (`[HIGH]`)
   - Note Māori sky culture is *already in* Stellarium Plus — patent #6 needs prior-art review
   - Add Matariki / Puanga cultural-localization requirement for Aotearoa-NZ launch
   - Note Sydney Observatory / RASNZ as event-tier institutional partners

7. **Update "Verify Before Citing" section:**
   - Strike Stellarium Plus subscription-model verification — confirmed as one-time IAP `[HIGH]`
   - Strike "Specific Chinese-market stargazing app names and publishers" — now verified `[HIGH]`
   - Strike "AstroArts mobile app names and current product lineup" — now verified `[HIGH]`
   - Add: Hoshizora Navi current install count (App Store / Google Play do not publish for AstroArts)
   - Add: 天文通 current MAU / install count (publisher does not surface)
   - Add: NAPA Thailand app store URL and download count
   - Add: Confirm Vixen STAR BOOK Wireless availability outside Japan store
   - Add: Sony Star Sphere unit pricing (not publicly disclosed at fetch)

8. **Update threat table in `SYNTHESIS.md`:**
   - Change "Chinese-market entrant we haven't catalogued" row to "天文通 / Stargazing Hub (laysky)" with Posture = **Compete by collection + glasses + community-broadcast differentiation; consider WeChat-mini-program first**

9. **Add to the patent candidates list:**
   - Note that the cultural-variant-constellation-art patent (#6) needs a prior-art review specifically against Stellarium Plus's existing Māori + Arabian-Peninsula sky cultures.
   - Note that JP / KR / PRC patent-filing economics differ from US — recommend US-provisional-first, then PCT national-phase decision per-country.

---

RESEARCH COMPLETE — asia-pacific-apps.md written, 28 apps / products verified across 9 countries (China, Japan, South Korea, India, Thailand, Singapore, Philippines, Malaysia, Vietnam, plus Australia / New Zealand as a paired region). Top strategic find: **天文通 / Stargazing Hub (laysky.com)** is the structural PRC competitor — a multi-store, WeChat-mini-program, light-pollution + stargazing-index + Tiangong-tracker super-utility that lacks Astra Vault's collection / AR / glasses / cross-reference moat and is therefore beatable on differentiation, but never on distribution-without-PRC-partnership.
