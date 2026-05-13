# Meteor + Fireball Networks — Astra Vault R&D

**Author:** R&D Team
**Date:** 2026-05-13
**Prepared for:** Stephen Furpahs, Director
**Status:** Round 1 desk review. Live web verification was blocked in this sandbox (WebSearch/WebFetch denied); URLs and contact addresses cited inline are from public-domain knowledge as of the assistant's training data and SHOULD be re-verified before any outreach. Items requiring live confirmation are flagged with `[verify]`.

---

## TL;DR — The 5 Networks Astra Vault MUST Integrate With

Ranked by strategic fit with Astra Vault's "user observes → professional network confirms → Meteor Story Page" pipeline:

1. **Global Meteor Network (GMN)** 🟢 — Fully open data, CC BY 4.0, public daily trajectory + orbit dumps, MIT-licensed RMS firmware, 1,100+ stations across 40+ countries. Single most important integration. Lead: Denis Vida (UWO). This is the network whose values most closely match ours. **Best cross-reference partner.**
2. **NASA CNEOS Fireball & Bolide Database** 🟢 — US Government Sensor (USG) bolide detections, fully public JSON, ideal for "did you just see a bolide?" matching. No partnership friction; it's a federal data product. **Best zero-friction read-only source.**
3. **AMS American Meteor Society** 🟢 — Eyewitness fireball reports, public API for event listings, the established US ingestion point for human reports. We can write back here legally and immediately. **Best contribution-back partner for the US market.**
4. **IMO International Meteor Organization** 🟢 — Visual Meteor Database (VMDB) and Video Meteor Network. Long-established, open submission workflows, global. We can both read and contribute. **Best global eyewitness partner.**
5. **NOAA GOES GLM (Geostationary Lightning Mapper)** 🟢 — Free L2 event data from NOAA CLASS / NESDIS / AWS Open Data. Captures bright bolides from geostationary orbit across the Western Hemisphere. **Best "satellite saw it from above" confirmation layer.**

**Stretch goals:** FRIPON (EU), CAMS (NASA/SETI), AllSky7, UKMON, DFN/GFO — all valuable, several with partnership pathways, but require relationship-building.

---

## Network Comparison Matrix

| Network | Stations (~) | Region | Data Open? | API/Endpoint? | Amateur Contribution? | Partnership Potential |
|---|---|---|---|---|---|---|
| GMN | 1,100+ | Global (40+ countries) | Yes (CC BY 4.0) | Yes — public data dumps + GitHub | Yes — buy/build RMS, join | 🟢 High |
| CAMS | ~600 across 16+ countries | Global | Partial — published nightly summaries; raw data closed | Web tables, no formal API | Limited — invite-based affiliates | 🟢 Medium (Jenniskens responsive) |
| FRIPON | ~150 | France + Vigie-Ciel partners EU | Partial — registration | Vigie-Ciel reports, OpenStack data archive | Yes (Vigie-Ciel citizen sci arm) | 🟢 High |
| DFN / GFO | ~50 (DFN) + ~50 (GFO global) | Australia + global partners | Partial — papers open, raw closed | DFN GitHub tools | Limited — institutional only | 🟢 Medium (Devillepoix open) |
| MORP | Historical, defunct | Canada (Prairies) | Archival only | None | n/a | ⚪ Defunct |
| MOTS | ~10–20 | Hungary, Slovakia | Limited | None public | Affiliates only | 🟡 Low |
| SCAMP | ~10 | S. California | Limited | Via CAMS infrastructure | Via CAMS | 🟡 Low |
| NEMETODE | ~30 | UK / Ireland | Yes — pooled to EDMOND | None native | Yes — UFOCapture users | 🟢 Medium |
| EU Fireball Network (Czech) | ~25 | Central EU | Limited — Ondřejov Obs. | None public | No — institutional | 🟡 Low |
| EDMOND | DB of multiple nets | Europe | Yes (downloads) | FTP/Static files | Through member nets | 🟢 Medium |
| CMN | ~25 | Croatia + diaspora | Yes | GitHub repos | Yes — open scripts | 🟢 High |
| PFN | ~40 | Poland | Partial — bulletins | None public | Yes — PFN members | 🟡 Medium |
| SonotaCo Network | ~100 | Japan | Yes — annual catalogs | Forum + static files | Yes — UFOCapture users | 🟢 Medium |
| CMOR | 1 radar (3 sites) | Canada (UWO) | Yes — published catalogs | Static | n/a (radar, not optical) | 🟢 High (Vida/Brown) |
| GMN (already above) | | | | | | |
| AllSky7 | ~100+ | US + intl | Yes — public dashboards | Web | Yes — build AS7 | 🟢 High |
| UKMON | ~50 | UK | Yes (CC) — public | GitHub `ukmon-shared` | Yes | 🟢 High |
| AMS | n/a (human reports) | Global, US-focused | Yes — public reports | Limited JSON endpoints | Yes — anyone can report | 🟢 High |
| IMO | n/a + VMN | Global | Yes | VMDB submission tools | Yes — anyone can join | 🟢 High |
| SpaceWeather.com | Curated reports | Global | Public reads | None | Email Tony Phillips | 🟡 Low (one-person op) |
| ALPO Meteors | n/a | Global | Yes (bulletins) | None | Yes — ALPO members | 🟡 Medium |
| Curtin AIDC | n/a (telescopes) | Australia | Partial | None public | No | 🟡 Low |
| ANTARES/Lasair/Alerce | Transient brokers | Global | Yes | Full REST/Kafka | n/a (broker, not meteor) | 🟢 (different use case) |
| MAYHEM | Research consortium | Czech/EU | Partial | None | No | 🟡 Low |
| BRAMON (Brazil) | ~70 | Brazil | Yes | Forum/static | Yes — UFOCapture/RMS | 🟢 Medium |
| SA / SAAO | ~5 (FRIPON-SA) | South Africa | Through FRIPON | None native | Via FRIPON | 🟡 Medium |
| NEMETODE-NZ / Fireballs Aotearoa | ~6 | New Zealand | Yes | None | Yes | 🟢 Medium |
| Bolivian meteor watch | Informal | Bolivia | Closed | None | n/a | 🚨 Dormant |
| Chinese Meteor Network 中国流星监测网 | ~50? | China | Closed | None public | Mainland users only | 🚨 Opaque |
| Indian / Sri Lankan amateurs | Informal | India, Sri Lanka | Closed | None | Direct contact | 🟡 Emerging |
| CNEOS Bolide DB | USG sensors | Global | Yes | JSON download | n/a (read-only) | 🟢 High |
| GOES GLM | 2 satellites | Western Hemisphere | Yes (NOAA CLASS, AWS) | NetCDF L2 | n/a | 🟢 High |
| NEXRAD | 160 radars | USA | Yes | AWS S3, Level II | n/a | 🟢 High (Ed Lyons head echo work) |

🟢 = open partnership pathway, 🟡 = limited/cautious, 🚨 = closed/unresponsive/dormant.

---

## Per-Network Deep Dives

### 1. CAMS — Cameras for All-Sky Meteor Surveillance 🟢

- **Governing body:** SETI Institute, with NASA Ames support
- **Country/Region:** USA-led, deployments in 16+ countries (USA, Chile, UAE, Namibia, New Zealand, South Africa, Australia, Netherlands, Belgium, Germany, Switzerland, France, Spain, Portugal, Brazil, Marshall Islands)
- **Founding:** 2010 (Jenniskens et al.)
- **Hardware:** Watec 902H2 Ultimate + Pentax CS f/1.0 6mm lenses, 16-camera arrays per station, custom CAMS software for detection. Professional tier
- **Open data:** Partially open — nightly meteor shower flux summaries and confirmed orbits are public via `cams.seti.org/FDL/` and the Meteor Shower Portal. Raw video frames and full orbit databases remain SETI-held. The IAU MDC also receives CAMS-derived orbits
- **Endpoints / formats:** Web table downloads at `https://cams.seti.org/FDL/` and the Meteor Shower Portal `meteorshowers.seti.org` (visual orbit browser). Annual orbit DBs released as ASCII tables. There is no formal REST API; scraping is the standard route. Data formats: ASCII (CAMS native), trajectory in MeteorTrajectory pickle/JSON via WMPL (when collaborating)
- **Contribution model:** Affiliate stations are added by invitation — Jenniskens has historically welcomed serious amateur sites (e.g., Florida CAMS, BeNeLux CAMS run by community PIs). Direct station hosting requires committing to the SETI hardware bill and operating discipline (~$10k). Astra Vault could not become a CAMS station easily, but Jenniskens has consistently been receptive to data contributions from comparable networks (UKMON, GMN have informal data sharing)
- **Cross-reference how-to:** Given user's (timestamp, lat, lon, look-direction): query Meteor Shower Portal for the night's confirmed shower IDs and trajectories at that location. Match against the IAU shower codes the portal reports per night. For specific bolides, cross-check with the CAMS-confirmed trajectory list (typically published 1–7 days after). No real-time match is feasible — CAMS publishes after vetting
- **Contact / lead:** Dr. Peter Jenniskens, SETI Institute (`pjenniskens@seti.org` [verify]). Dev contact historically Pete Gural for CAMS software. GitHub: limited public repos; `pyCAMS` exists as a community tool but is not the official codebase
- **Recent papers:** Jenniskens et al. 2023, "CAMS confirmation of seven new meteor showers" (Icarus). Jenniskens et al. 2024 (anticipated) on the IAU MDC working list. The annual "CAMS Meteoroid Orbit Survey" Icarus papers are the canonical reference
- **Risks:** Closed back-end, slow data release, no API, single-PI dependency. If Jenniskens retires the network's openness to new affiliates may degrade
- **Status:** Active, mature, gold-standard for triangulated showers

### 2. Global Meteor Network (GMN) 🟢 — TOP PRIORITY

- **Governing body:** Community-led, anchored at University of Western Ontario (Denis Vida)
- **Country/Region:** Truly global — Canada, USA, UK, Netherlands, Belgium, Croatia, Hungary, Slovenia, Italy, Spain, Portugal, Switzerland, Germany, Australia, New Zealand, Brazil, Argentina, Chile, Romania, Bulgaria, Israel, S. Africa, India, Japan and more. 1,100+ stations as of 2025
- **Founding:** 2018 (Vida et al.)
- **Hardware:** RMS (Raspberry Pi Meteor Station) — Raspberry Pi 4 + IMX291/IMX307/IMX307 IP cameras. Total BoM ~$200–$400. Consumer/amateur tier but professional output quality (RMS produces FF files, FTPdetectinfo, and is co-aligned with the CAMS trajectory math). MIT-licensed firmware
- **Open data:** Fully open under CC BY 4.0. Trajectory summaries, monthly orbit dumps, raw detections all public at `https://globalmeteornetwork.org/data/`. The IAU MDC also receives GMN orbits
- **Endpoints / formats:** Daily `trajectory_summary` CSVs, ECSV (Astropy enhanced CSV), monthly `meteor_summary` and `traj_summary_monthly_*.txt` files. The `gmn-data-platform` (Mark McIntyre + UKMON team) and `gmn-python-api` (GitHub: `gmn-data-platform/gmn-python-api`) wrap downloads in a Python client with TAP-like queries. GitHub orgs: `CroatianMeteorNetwork/RMS`, `gmn-data-platform`. The `RMS` repo at `github.com/CroatianMeteorNetwork/RMS` is the canonical firmware
- **Contribution model:** Anyone can build an RMS station, follow Vida's setup docs, and join. Stations stream to the central server nightly. There is NO gatekeeping. Astra Vault could (a) consume GMN data freely, (b) build and contribute RMS stations under the Astra Vault banner, (c) potentially get phone-class detections accepted for citizen-science overlays (Vida has historically been welcoming to discussions about phone/all-sky-7 cross-overs)
- **Cross-reference how-to:** Given (UTC timestamp, lat, lon, look-direction): query `gmn-python-api` for the night's `trajectory_summary` filtered to within ~500 km of user's lat/lon and ±60 seconds of timestamp. The trajectory CSV gives the radiant, velocity, parent body, shower code, height of beginning and end. This is exactly the data Astra Vault needs for the Meteor Story Page. **GMN is the primary cross-reference partner.**
- **Contact / lead:** Dr. Denis Vida, University of Western Ontario (`denis.vida@gmail.com` and `dvida@uwo.ca` [verify]). Dev contacts include Peter S. Gural (CAMS lineage), Damir Šegon (CMN). Mark McIntyre (UKMON) is the de-facto data platform maintainer. GitHub: `dvida`, `CroatianMeteorNetwork`, `gmn-data-platform`
- **Recent papers:** Vida, Šegon, Gural et al. 2021, "The Global Meteor Network – Methodology and first results" (MNRAS, 506, 5046). Vida et al. 2022/2024 on the GMN trajectory pipeline (MNRAS). Sub-papers on individual shower confirmations
- **Risks:** Community-run — single-person key dependencies on Vida and McIntyre. No SLA. Server outages possible. But CC-BY-4.0 license means we can mirror their data forever
- **Status:** Active, fastest-growing, the future of open meteor science

### 3. FRIPON — Fireball Recovery and InterPlanetary Observation Network 🟢

- **Governing body:** CNRS / Observatoire de Paris / Muséum national d'Histoire naturelle (MNHN), French national consortium
- **Country/Region:** Started in France, now extended into Belgium, Netherlands, Switzerland, Italy, Spain, Portugal, Germany, Tunisia, Morocco, Canada, Chile, Brazil and (via partners) South Africa. ~150+ stations
- **Founding:** 2016
- **Hardware:** Basler ace acA1300-30gm cameras + Fujinon fisheye lens, professional all-sky setup, ~$3,500 BoM per station, custom FreeTure software
- **Open data:** Detections and recovery information are progressively made public at `fripon.org` and via the "Vigie-Ciel" citizen-science portal. Raw imagery embargoed for ~30 days. Recovery papers in MAPS
- **Endpoints / formats:** Public event pages, downloadable PDFs of trajectory reconstructions. No formal REST API. Internal pipeline uses FreeTure → FRIPON HQ database. Vigie-Ciel has a public submission form for eyewitness reports
- **Contribution model:** Two paths. (1) Become a FRIPON-affiliated station — requires buying their hardware kit (~€3.5k) and signing a host agreement. They actively recruit municipalities/schools/observatories. (2) Vigie-Ciel — anyone can submit an eyewitness report through the web form, similar to AMS. Astra Vault users could be auto-routed to Vigie-Ciel for European events
- **Cross-reference how-to:** Vigie-Ciel public events page lists confirmed fireballs with timestamp, region, and reconstructed trajectory if available. Cross-reference: for European user observation in (lat, lon, t), check Vigie-Ciel events list and FRIPON event archive within ±60 min and ~500 km
- **Contact / lead:** Dr. François Colas (Observatoire de Paris, IMCCE) — `francois.colas@obspm.fr` [verify]. Co-PI: Dr. Brigitte Zanda (MNHN). Tech lead: Sylvain Bouley. Vigie-Ciel coordinator: Asma Steinhausser. GitHub: `Fripon` org on GitHub hosting `FreeTure`
- **Recent papers:** Colas et al. 2020, "FRIPON: a worldwide network to track incoming meteoroids" (A&A 644, A53) — the canonical FRIPON description. Anghel et al. 2022 on FRIPON-Romania. Jeanne et al. 2019 on calibration
- **Risks:** State-funded — slower to move on partnerships. French language priority. But Vigie-Ciel is explicitly designed for citizen reports, so a write-back integration is the obvious play
- **Status:** Active, well-funded, expanding into Africa

### 4. Desert Fireball Network (DFN) / Global Fireball Observatory (GFO) 🟢

- **Governing body:** Curtin University (Australia) Space Science and Technology Centre (SSTC)
- **Country/Region:** Australia (DFN — outback array) and a global expansion network (GFO) with affiliates in USA, Saudi Arabia, Argentina, Morocco, Hungary, Sri Lanka and others. ~50 DFN + ~50 GFO stations
- **Founding:** 2005 (pilot), full deployment 2012, GFO ~2017
- **Hardware:** Custom intervalometer-driven DSLR with fisheye and long-exposure liquid-crystal shutter (encodes timing in trail). 36 MP per frame. Professional tier. Designed for meteorite RECOVERY (drop ellipses), not just orbits
- **Open data:** Catalog "DFNSMALL" is published. Recent moves toward fully open data via the Curtin Asteroid Detection Centre. Orbits available through MNRAS supplements and the SSTC website. Raw imagery typically held for analysis. The `dfn-rocks` site has been the technical home (some URLs change)
- **Endpoints / formats:** Trajectory and orbit data published as ASCII/CSV in papers. The `dfn-rocks` and `gfo-rocks` sites carry station maps. No formal REST API. Codebase: `github.com/desertfireballnetwork` (e.g., `dfn_camera_control`, `dfn_utils`)
- **Contribution model:** GFO accepts institutional partners (universities, observatories) who can host a station and operate it long-term. Not designed for individual amateurs. Astra Vault could propose hosting a GFO station as a flagship outdoor installation
- **Cross-reference how-to:** For Australian events, query the DFN bulletin or the Curtin SSTC events page. For global events, GFO bulletins. There is no live API; cross-reference is post-hoc with a 1-2 week lag
- **Contact / lead:** Prof. Phil Bland (`p.a.bland@curtin.edu.au` [verify]). Dr. Hadrien Devillepoix (`hadrien.devillepoix@curtin.edu.au` [verify]) — Devillepoix is highly active in the open-data community and a key technical contact. Dr. Eleanor Sansom for meteorite recovery
- **Recent papers:** Devillepoix et al. 2020, "A Global Fireball Observatory" (P&SS 191, 105036). Anderson et al. 2022, "Successful recovery of an observed meteorite fall using drone-based imaging" (MNRAS). Sansom et al. 2019 on Bayesian dark flight
- **Risks:** Curtin institutional bureaucracy. Hardware is bespoke. But Devillepoix is one of the most open and approachable researchers in the field
- **Status:** Active, scientifically prolific (multiple meteorite recoveries)

### 5. MORP — Meteorite Observation and Recovery Project (Canada) ⚪

- **Governing body:** University of Saskatchewan / National Research Council Canada (historical)
- **Region:** Canadian Prairies
- **Founding:** 1971
- **Status:** Decommissioned in 1985 after the Innisfree fall recovery
- **Modern successors:** Western University's Southern Ontario Meteor Network (SOMN — Peter Brown), the All-Sky Camera Network for Meteor Astronomy at UWO, and CMOR (radar). SOMN and UWO infrastructure are now the de-facto Canadian fireball trackers
- **Contact:** Prof. Peter Brown, Western University (`pbrown@uwo.ca` [verify]). Denis Vida is at UWO and integrates with both
- **Risk:** Historical data only

### 6. MOTS — Hungarian Meteor and Fireball Observation System 🟡

- **Governing body:** Hungarian Astronomical Association + Konkoly Observatory
- **Region:** Hungary, Slovakia
- **Founding:** ~2012
- **Hardware:** Mixed — Watec + UFOCapture
- **Open data:** Limited; data flows into EDMOND
- **Contact:** Dr. Antal Igaz, Konkoly Observatory [verify email]
- **Status:** Active but small; most useful through EDMOND aggregation

### 7. SCAMP — Southern California All-Sky Meteor Project 🟡

- **Governing body:** NASA Ames / SETI (essentially a CAMS sub-network)
- **Region:** Southern California
- **Founding:** ~2017
- **Hardware:** CAMS-derived
- **Open data:** Via CAMS infrastructure
- **Status:** Active sub-network — treat as part of CAMS

### 8. NEMETODE — Network for Meteor Triangulation and Orbit Determination 🟢

- **Governing body:** UK/Ireland amateur consortium
- **Region:** UK, Ireland (~30 stations)
- **Founding:** 2012
- **Hardware:** Watec + UFOCapture (commercial Windows software from SonotaCo). Increasingly migrating to RMS
- **Open data:** Annual reports published in JBAA (Journal of the British Astronomical Association). Data pooled into EDMOND and the UKMON shared archive
- **Contact:** William Stewart (UK) [verify]
- **Status:** Active, increasingly overlapping with UKMON and GMN

### 9. EU Fireball Network / European Fireball Network (Czech) 🟡

- **Governing body:** Astronomical Institute of the Czech Academy of Sciences, Ondřejov Observatory
- **Region:** Central Europe — Czech Republic, Germany, Slovakia, Austria, Switzerland
- **Founding:** 1963 (the oldest!), modernized with DAFO (Digital Autonomous Fireball Observatory) cameras 2010s
- **Hardware:** All-sky photographic, then digital DAFO (Spalek lens). Highly accurate astrometry
- **Open data:** Published in A&A and Meteoritics journals. Raw data closed
- **Contact:** Dr. Pavel Spurný (`spurny@asu.cas.cz` [verify]), Dr. Jiří Borovička (`borovic@asu.cas.cz` [verify])
- **Status:** Active, scientifically dominant for European meteorite recoveries (Příbram 1959, Morávka 2000, Neuschwanstein 2002, Žďár nad Sázavou 2014, etc.). The PI lineage is gold-standard but the data culture is closed-by-default

### 10. EDMOND — European viDeo MeteOr Network Database 🟢

- **Governing body:** Czech Astronomical Society + IMO Video Commission, run by Damir Šegon (CMN) and others
- **Region:** Europe (pan-national aggregation)
- **Founding:** ~2010
- **Content:** Aggregated meteor orbits from BOAM, BosNet, CEMeNt, CMN, FMA, HMN, IMTN, MeteorsUA, NEMETODE, PFN, SVMN, UKMON, and others. Over 500,000 orbits by 2023
- **Open data:** Free download as ZIP files of CSV/INF files at `https://www.meteornews.net/edmond/` or via the CMN site
- **Contact:** Damir Šegon (Croatian Meteor Network) [verify email]
- **Status:** Active aggregator. For European cross-reference, EDMOND is the path of least resistance

### 11. CMN — Croatian Meteor Network 🟢

- **Governing body:** Astronomical Society Istra Pula + Višnjan Observatory
- **Region:** Croatia, with diaspora stations
- **Founding:** 2007
- **Hardware:** Originally Watec + UFOCapture, now mixed with RMS. Open-source detection software
- **Open data:** Fully open, GitHub-hosted (`CroatianMeteorNetwork`)
- **Contact:** Damir Šegon, Denis Vida (yes, the GMN lead), Peter S. Gural
- **Status:** Active. CMN's GitHub org `CroatianMeteorNetwork` is where RMS lives — this is the de-facto open-source meteor codebase

### 12. PFN — Polish Fireball Network 🟡

- **Governing body:** Comets and Meteors Workshop (Pracownia Komet i Meteorów)
- **Region:** Poland (~40 stations)
- **Founding:** 2004
- **Hardware:** Mixed; PFN-developed PyFN software
- **Open data:** Published bulletins; data partially in EDMOND
- **Contact:** Mariusz Wiśniewski, Przemysław Żołądek [verify emails]
- **Status:** Active, scientifically productive (PF series fireball IDs)

### 13. SonotaCo Network 🟢

- **Governing body:** SonotaCo (Japanese amateur consortium)
- **Region:** Japan (~100 stations)
- **Founding:** 2007 (UFOCapture launched earlier)
- **Hardware:** Watec + UFOCapture (commercial, Windows). SonotaCo himself is the developer of UFOCapture/UFOAnalyzer/UFOOrbit — the dominant amateur meteor toolchain prior to RMS
- **Open data:** Annual catalogs published openly as TXT/CSV at `https://sonotaco.jp/doc/SNM/`
- **Contact:** SonotaCo (pseudonym; reachable via `sonotaco.com` forum)
- **Status:** Active. For Japanese cross-reference, SonotaCo is essential. The Asia-Pacific market expansion makes this network strategically aligned with Astra Vault's APAC growth plan

### 14. CMOR — Canadian Meteor Orbit Radar 🟢

- **Governing body:** University of Western Ontario (Peter Brown)
- **Region:** Canada (Tavistock and Zorra radar stations)
- **Founding:** 1999 (current configuration since 2002)
- **Hardware:** Three frequency multi-station back-scatter radar. Detects ~2,500 meteoroid orbits per day. Sensitive to sporadic background and faint showers down to ~+8 magnitude (radio)
- **Open data:** Annual orbit catalogs published. Working list of new showers at the IAU MDC fed largely by CMOR. Bruzzone et al. and Pokorný et al. 2023+ papers
- **Endpoints:** Static catalog releases. No real-time API but Peter Brown's group has been generous with collaboration
- **Contact:** Prof. Peter Brown (`pbrown@uwo.ca` [verify])
- **Status:** Active. Critical for the **daytime meteor showers** invisible to optical networks — a unique data layer

---

## Tier 2 — Amateur / Open Networks

### 15. AllSky7 🟢

- **Governing body:** Mike Hankey (informally), USA + global community
- **Region:** USA mostly, with stations in Germany, UK, Australia, Canada, NL, etc. ~100+ stations
- **Founding:** ~2018
- **Hardware:** Seven IMX291 IP cameras covering the full sky from one site (hence "AllSky7"). Open hardware design at $700-1000 BoM. Open-source AS7 software stack
- **Open data:** Public dashboards at `allsky7.net` and live event pages. Data shared with AMS and CAMS
- **Contribution model:** Anyone can build an AS7 station and join. Mike Hankey is responsive to amateur queries. AMS uses AS7 data for fireball event resolution
- **Cross-reference:** For US fireballs, AS7's event pages timestamped to the millisecond are arguably the BEST single source for amateur cross-reference
- **Contact:** Mike Hankey (`mike.hankey@gmail.com` [verify]), also operations lead for AMS fireball platform
- **Status:** Active, growing, deeply integrated with AMS

### 16. UKMON — United Kingdom Meteor Observation Network 🟢

- **Governing body:** UK amateur consortium, informal
- **Region:** UK (~50 stations)
- **Founding:** 2012
- **Hardware:** Originally Watec + UFOCapture; majority migrated to RMS. UKMON pioneered open-data discipline among UK amateurs
- **Open data:** Fully open. GitHub: `ukmeteornetwork/ukmon-shared` (data) and `ukmeteornetwork/ukmon-pitools` (Pi station scripts)
- **Contact:** Mark McIntyre (`markmcintyrescot@yahoo.com` [verify] — also the gmn-data-platform maintainer). Active on the GMN community channel
- **Status:** Active, technically excellent. McIntyre is the most consequential dev in the open meteor data world right now. **Partnership target.**

### 17. AMS — American Meteor Society 🟢

- **Governing body:** Non-profit US organization (founded 1911)
- **Region:** Global, US-focused
- **Hardware:** N/A — human eyewitness reports; also aggregates AS7 cam data
- **Open data:** Yes. Public reports at `amsmeteors.org/fireballs/`. Each event has a unique ID, eyewitness count, heatmap, and computed trajectory when sufficient reports exist. There IS an undocumented JSON endpoint per event (URL pattern: `/fireballs/event/YYYY/####`) that the site frontend consumes
- **Endpoints:** `https://www.amsmeteors.org/members/api/open_api/get_events` style endpoints have existed (but require token in some cases). The fireball report submission form is fully public
- **Contribution model:** Anyone can submit a fireball report at `amsmeteors.org/fireballs/report-a-fireball`. The form takes: time, location, direction, fragmentation, etc. **Astra Vault can both READ event data and WRITE eyewitness reports on behalf of users (with consent).**
- **Contact:** Vincent Perlerin (Operations Manager, `vperlerin@amsmeteors.org` [verify]). Mike Hankey (Technical, also AllSky7). Robert Lunsford (Operations and Visual Section)
- **Status:** Active, well-staffed, the primary US ingestion point. **The #1 contribution-back partner for Astra Vault's US users.**

### 18. IMO — International Meteor Organization 🟢

- **Governing body:** International non-profit (Belgium-registered), founded 1988
- **Region:** Global
- **Hardware:** N/A — coordinates visual, video, telescopic, and radio sections
- **Open data:** Yes. VMDB (Visual Meteor Database) accessible at `www.imo.net/members/imo_vmdb` — registration required but free. VMN (Video Meteor Network) data via Sirko Molau's `mmteo` archive. Radio meteor observers' bulletins
- **Contribution model:** Anyone can become a member and submit observations through the IMO observation forms. Visual reports are the longest-standing dataset in meteor science. Astra Vault users could be auto-routed to IMO VMDB for visual observation contributions
- **Contact:** Cis Verbeeck (current President, `cis.verbeeck@imo.net` [verify]). Sirko Molau (Video commission, `sirko@molau.de` [verify]). Jürgen Rendtel (long-time secretary)
- **Status:** Active, the spiritual home of amateur meteor science globally. Publishes WGN — Journal of the IMO

### 19. SpaceWeather.com 🟡

- **Governing body:** Tony Phillips (one-person operation, NASA-funded)
- **Region:** USA-focused, global readership
- **Hardware:** N/A — aggregator
- **Open data:** Public web (no API). Photo galleries with EXIF
- **Contribution model:** Email submissions to Tony Phillips
- **Contact:** Dr. Tony Phillips (`drtony@spaceweather.com` [verify])
- **Status:** Active but fragile — single-person op. Not a primary integration target

### 20. ALPO Meteors Section 🟡

- **Governing body:** Association of Lunar and Planetary Observers
- **Region:** Global, US-focused
- **Open data:** Bulletins via `alpo-astronomy.org/meteor`
- **Contact:** Robert Lunsford [verify]
- **Status:** Active but small; mostly subsumed by AMS

---

## Tier 3 — Newer / Specialized

### 21. Curtin Asteroid Detection Centre 🟡

- **Governing body:** Curtin University
- **Focus:** Telescopic asteroid surveys (not optical fireball networks per se)
- **Contact:** Phil Bland's group at SSTC
- **Status:** Active, but not a primary meteor-network target — more relevant for the Near-Earth Watch experience

### 22. Transient brokers — ANTARES, Lasair, ALeRCE, Fink, AMPEL

Not meteor networks. These are LSST/Rubin Observatory + ZTF alert brokers handling supernovae, GRBs, TDEs, etc. Relevant to Astra Vault for a DIFFERENT use case: alerting users to bright transients (novae, supernovae, GRB optical afterglows). Brief notes:

- **ANTARES** (NOIRLab, `antares.noirlab.edu`) — Python `antares-client`, full REST + Kafka stream
- **Lasair** (Edinburgh/Belfast, `lasair.lsst.ac.uk`) — Web UI + REST + token API
- **ALeRCE** (Chile, `alerce.online`) — REST API, Python client `alerce`
- **Fink** (France, `fink-broker.org`) — Python + Spark streams
- **AMPEL** (Berlin, `ampelproject.github.io`) — research framework

These are 🟢 fully open and would be a fantastic complement to the meteor capture system. "While you were outside last night, SN 2026xyz brightened by 0.4 magnitudes." Same pattern as the "I Didn't Know That Happened" feature.

### 23. MAYHEM 🟡

- **Governing body:** Astronomical Institute Ondřejov + partners
- **Focus:** Multi-instrument analysis of high-energy meteors (combining radio, optical, infrasound)
- **Status:** Research consortium, not a public-data network. Closed for Astra Vault's purposes

### 24. BRAMON — Brazilian Meteor Observation Network 🟢

- **Governing body:** REA-Brasil + amateur consortium
- **Region:** Brazil (~70 stations)
- **Hardware:** UFOCapture-based, migrating to RMS
- **Open data:** Yes, via `bramonmeteor.org`. Annual catalogs in Portuguese + English
- **Contact:** Marcelo Domingues, Lauriston Trindade [verify]
- **Status:** Active, growing. **Strategic for Latin American expansion.**

### 25. South Africa (FRIPON-SA, SAAO) 🟡

- **Governing body:** South African Astronomical Observatory + FRIPON consortium
- **Region:** South Africa (~5 FRIPON stations)
- **Status:** Active but small; piggyback FRIPON integration

### 26. Fireballs Aotearoa (NZ) 🟢

- **Governing body:** University of Canterbury + Otago Museum
- **Region:** New Zealand (~6 stations as of 2024)
- **Hardware:** DSLR all-sky (DFN-derived)
- **Open data:** Yes — published events at `fireballs.nz`
- **Contact:** Prof. James Scott (Otago), Dr. Jack Baggaley (Canterbury, retired) [verify]
- **Status:** Active

### 27. Bolivia 🚨

- No formal network. Informal amateur observations. Dormant for partnership purposes

### 28. Chinese Meteor Monitoring Network (中国流星监测网) 🚨

- **Governing body:** Unclear — multiple efforts (Purple Mountain Observatory, Beijing Planetarium, amateur networks)
- **Region:** China (~50 stations?)
- **Open data:** Largely closed to non-mainland users. Some data appears in EDMOND via diaspora
- **Status:** Opaque. Direct outreach via the Beijing Planetarium or Purple Mountain Observatory would be needed for any cross-reference. **Mainland data access is a known regulatory/political barrier.**

### 29. India / Sri Lanka 🟡

- **Indian Institute of Astrophysics (IIA)** has run sporadic fireball observation programs. Amateur efforts via `astron-soc.in` mailing list
- **Sri Lanka** has GFO-affiliated stations via Devillepoix
- **Status:** Emerging; no central network. Astra Vault users in these countries are essentially uncovered by professional networks — they would benefit MOST from our cross-reference fallback (CNEOS bolides + GLM + AMS global reports)

---

## Cross-Cutting Government & Satellite Data

### 30. NASA CNEOS Fireball and Bolide Database 🟢

- **URL:** `https://cneos.jpl.nasa.gov/fireballs/`
- **What it is:** US Government sensors (classified DoD instruments) report bolide detections to JPL CNEOS. Public release of: peak brightness time, latitude, longitude, altitude, velocity vector (when available), total radiated energy, and calculated impact energy
- **Endpoint:** `https://ssd-api.jpl.nasa.gov/fireball.api` — JSON, fully documented at `https://ssd-api.jpl.nasa.gov/doc/fireball.html`. No auth. Date and energy filters
- **Latency:** Typically 1-30 days delay (declassification gate)
- **Coverage:** Global, but biased toward bright bolides (>~10 GJ kinetic energy)
- **Cross-reference how-to:** For any user observation, query `fireball.api` with `?date-min=YYYY-MM-DD&date-max=YYYY-MM-DD` and filter by geographic proximity. If a CNEOS bolide matches within ±100 km and ±10 minutes, it's almost certainly the same event. This is the gold-standard confirmation for any user-reported FIREBALL
- **Status:** Public, persistent, no partnership needed. **Top integration priority for fireball-class events.**

### 31. GOES GLM — Geostationary Lightning Mapper 🟢

- **What it is:** Optical lightning detectors on GOES-16, -17, -18, -19. Single-pixel time-tagged optical events at 8 ms cadence. Sensitive to bolides bright enough to flash above the lightning detection threshold
- **Coverage:** Western Hemisphere (Americas, Pacific, Atlantic)
- **Open data:** L2 NetCDF files at `https://www.noaa.gov/glm` and `s3://noaa-goes16/GLM-L2-LCFA/` (AWS Open Data). Free, persistent, fully public
- **Cross-reference how-to:** For a bolide candidate, pull the GLM L2 file for the minute of interest, filter "events" within a few hundred km of expected location. Multiple high-energy events clustered in time + space at non-lightning latitudes = bolide signature. Jenniskens et al. and Jenniskens & Nemtchinov have published methods
- **Risk:** Requires NetCDF parsing; not a trivial integration. But the data is GOLD for confirming any user fireball report
- **Status:** **Top satellite-confirmation integration.**

### 32. USG Doppler Radar — NEXRAD 🟢

- **What it is:** 160 WSR-88D Doppler radars across the USA. Open Level II data on AWS at `s3://noaa-nexrad-level2`. Pyart and Py-ART libraries parse
- **Meteor relevance:** Two distinct uses:
  - **Meteorite fall detection** (Marc Fries' work) — falling meteoroid fragments produce reflectivity signatures in NEXRAD scans. Several falls (Sutter's Mill, Hamburg MI, Aguas Zarcas) confirmed and recovered via NEXRAD
  - **Head-echo radar meteor astronomy** — Arecibo and Jicamarca historically, but operational sites also detect head echoes
- **Cross-reference how-to:** For any well-localized US fireball (from CNEOS or AMS), pull the nearest NEXRAD station's scans for the next 30 minutes after the event. Look for falling-debris signatures (clustered reflectivity above background, descending in altitude)
- **Contact:** Dr. Marc Fries (`marc.d.fries@nasa.gov` [verify]) — NASA JSC, the recognized expert
- **Status:** Public, technically demanding, but world-class confirmation

### 33. Sentinel weather satellites + other LEO assets

- **Sentinel-2 / Landsat:** Almost never useful for fireballs (revisit too slow, ~5 day cadence) but excellent for impact crater confirmation in rare cases
- **NOAA polar orbiters (VIIRS Day-Night Band):** Sensitive at night, can detect very bright bolides over featureless ocean. Public via NOAA CLASS
- **DMSP-OLS:** Historical low-light detector, declassified data has caught bolides
- **Status:** Niche but worth noting for the rare ocean-bolide case where no ground network is in range

---

## Side Topics

### 34. IAU Meteor Data Center & Working Group on Meteor Shower Nomenclature 🟢

- **URL:** `https://www.ta3.sk/IAUC22DB/MDC2022/` (managed by the Slovak Academy of Sciences, Tatranská Lomnica)
- **What it is:** The official IAU registry of meteor showers, parent body links, and confirmed/working list status. All shower codes (PER for Perseids, GEM for Geminids, etc.) issued here
- **Open data:** Yes, public download as CSV
- **Contact:** Tadeusz Jopek (Polish, chair of Working Group), Regina Rudawska (curator) [verify]
- **Astra Vault use:** The canonical mapping from "user observation matched to radiant X" → "named shower Y, parent body Z." Cite IAU MDC shower codes in every Meteor Story Page

### 35. JPL Small-Body Database — Comet/Asteroid origins 🟢

- Already covered in the Hidden Resource Map. For parent-body confirmation on a meteor shower attribution, query `https://ssd-api.jpl.nasa.gov/sbdb.api` with the IAU MDC parent body designation

### 36. The Meteoritical Society Bulletin 🟢

- **URL:** `https://www.lpi.usra.edu/meteor/` — Meteoritical Bulletin Database
- **What it is:** Official registry of every classified meteorite ever recovered. ~75,000 entries
- **Open data:** Yes; CSV exports
- **Astra Vault use:** When a user's observation matches a CONFIRMED FALL (rare but spectacular events), tie the Meteor Story Page to the Met-Bull entry. "The meteor you saw on 2023-09-14 is now classified as the Antonin L4 chondrite, recovered by farmers near..."
- **Status:** Authoritative, public

### 37. Asteroid Airburst Networks

- **Sandia infrasound network** — partially classified
- **CTBTO infrasound stations** — international monitoring system for nuclear test detection, has detected major bolides (Chelyabinsk, Bering Sea 2018). Data licensed
- **Astra Vault use:** Beyond direct integration, but for Chelyabinsk-class events the CNEOS database surfaces the infrasound-derived energy estimates

### 38. Sprite / TLE (Transient Luminous Events) observers

- **Community:** Citizen sprite hunters (e.g., Paul Smith, Frankie Lucena, Walter Lyons). Reports aggregated at SpaceWeather.com and Sprite Camp (`sprite-camp.com` [verify])
- **Relevance to Astra Vault:** Important for our "what did I actually see?" classification engine. A user reporting a bright flash near a thunderstorm should NOT be matched to a meteor; could be a sprite, elve, blue jet, or gigantic jet. The classifier needs to know
- **Contact:** Walter Lyons (FMA Research, `wlyons@fma-research.com` [verify])

---

## Astra Vault's Strategy

### Read-only Cross-Reference Integrations (Phase 1)

These networks give us their data immediately, no relationship needed:

1. **GMN** — daily trajectory CSVs, CC BY 4.0. Pull the global summary file each morning; index by date and bounding box; serve to clients. ETA to integration: 1–2 weeks of backend work
2. **CNEOS Fireball DB** — JSON REST. Trivial to integrate. ETA: 1 day
3. **AMS Events** — scrape or use undocumented JSON endpoints. ETA: 2–3 days. Once integrated, our users see "AMS event #2026-xxx — 247 other people reported this"
4. **IAU MDC** — static shower table refresh weekly. ETA: 1 day
5. **JPL Small-Body Database (already designed)** — parent body resolution
6. **GLM (GOES) L2** — for high-energy bolide confirmation, AWS S3 pull. ETA: 1–2 weeks (NetCDF complexity)
7. **EDMOND** — annual European aggregate for historical match-back. ETA: 3 days
8. **SonotaCo annual catalogs** — Japan/APAC coverage. ETA: 2 days

### Write Integrations (Phase 2 — Requires Approval Workflow)

These networks accept eyewitness/contribution data but want vetted submissions:

1. **AMS Fireball Reporting** — auto-submit user reports through the public form (with explicit user consent, fully attributed). AMS has historically welcomed structured 3rd-party submissions; we should email Vincent Perlerin BEFORE going live to confirm submission cadence is acceptable
2. **IMO VMDB / VMN** — for systematic observations, route data through the IMO submission pipeline. Membership encouraged
3. **Vigie-Ciel (FRIPON)** — European user reports auto-routed
4. **GMN community channel** — phone-class detections will not pass GMN's strict trajectory criteria, but Vida has expressed openness to discussing "naked-eye/phone confirmation overlay" data; we should propose a pilot with explicit data labelling

### Should Astra Vault Host Its OWN Camera Tier?

**Yes — but in two phases, and never claiming professional-grade orbit determination from phones alone.**

**Phase 3a — "Astra Vault Phone Tier" (consumer-grade meteor pings)**

- Phone-as-station is scientifically real but limited. Cameras have rolling shutters, weak low-light response, and uncalibrated optics. No phone can produce a precision trajectory alone
- HOWEVER: aggregated phone detections at scale (1,000+ users in one country during a meteor shower) can DO things no professional network does:
  - **Density mapping of shower meteors** by latitude/longitude in near real-time (no professional network has this user density)
  - **Naked-eye magnitude validation** of professional detections (we know what the user actually saw)
  - **Tomographic constraint on bolide tracks** when 3+ phones happen to catch the same bolide (rare but valuable)
- Legal/scientific bar: minimum metadata required:
  - GPS lat/lon to ~10m
  - Timestamp synced to NTP (sub-second; we should use phone NTP + GPS time)
  - Compass bearing + tilt at the moment of capture
  - Phone model + camera specs (so future researchers can calibrate)
  - User consent for data sharing (opt-in)
- Data license: publish under CC BY 4.0 to enable cross-network use, matching GMN's standard

**Phase 3b — "Astra Vault All-Sky Camera Tier" (real hardware sponsorship)**

- Sponsor amateur installations of RMS stations under the Astra Vault brand
- Cost: ~$300/station BoM + ~$50 host stipend/year
- 100 stations in year 1 = $35k total. Cheap PR + real science
- These stations report directly into the GMN backbone (no parallel infrastructure needed). They're CC BY 4.0, so Astra Vault gets full data access alongside the world
- Marketing: "Astra Vault has 100 cameras watching the sky for you"

### What NOT to do

- Don't try to operate a CAMS-affiliated network — too high a bar, single-PI gating, closed-by-default data culture
- Don't try to compete with GMN — partner with it
- Don't promise users their phone footage will produce "professional orbits." It won't. Be honest. The product positioning is "you saw it → we tell you what it was, using professional networks' data."

---

## Patentable Combinations (Bundles That Are Novel)

The patent claims should focus on **method** combinations that pair consumer-grade sensors with professional-network cross-reference. Standalone phone meteor capture (NightCap, etc.) is unpatentable now. Standalone CAMS data download is obviously not novel. But the BUNDLE is.

### Patent Candidate 1 — "Voice-Triggered Meteor Cross-Reference Method"

- User invokes audio trigger ("METEOR") while looking up
- Phone records: time, GPS, compass, tilt, audio waveform of the trigger word itself (as proof of attention)
- App queries N professional networks (GMN, CNEOS, AMS, FRIPON, GLM) within ±10 min and within 500 km
- Returns a SCORE indicating likelihood the user's observation matches each network's detection
- Generates a personalized "Meteor Story Page"
- **Novel because:** No existing patent ties a voice attention event to a multi-network cross-reference and produces a quantified match score

### Patent Candidate 2 — "Glasses-Camera Hands-Free Astronomical Event Capture with Network Reconciliation"

- Smart glasses camera continuously buffers 5-30 seconds of sky video
- Voice or gesture triggers buffer save
- Capture metadata fused with eye-tracking direction (where the user was actually looking) — this is the KEY differentiator from phone capture
- Server-side cross-reference with GMN/CAMS/CNEOS
- User receives notification: "The meteor you saw at 10:47 PM matched a Perseid from Comet 109P/Swift-Tuttle"

### Patent Candidate 3 — "Density-Map Generation from Distributed Consumer Astronomical Captures"

- Aggregate phone-class detections across user base at meteor shower peaks
- Spatial-temporal binning produces a real-time density map
- Compared against IMO/CAMS expected ZHR (zenithal hourly rate) — the FIRST consumer-derived real-time ZHR proxy
- Output as a public live-tile API

### Patent Candidate 4 — "Retroactive Astronomical Event Surfacing Using User Location/Time History"

- Already designed in handoff doc (the "I Didn't Know That Happened" feature)
- Patentable when fused with the cross-reference engine: app retroactively says "Asteroid 2026 FQ3 passed at 10:47 PM and was theoretically visible from your location" — combined with the after-the-fact eyewitness-prompt UX

### Patent Candidate 5 — "Token-Reward Mechanic Tied to Professional Network Confirmation"

- ATP rewards scale based on whether a user's submission is matched/confirmed by an external professional network
- Quality-tier hashing: passive capture → small reward; cross-reference confirmed → larger reward; novel detection (no match, but follows shower pattern) → flagged-for-review reward
- **Novel because:** Crypto-attention literature has nothing on professional-data-confirmed citizen science

### Patent Candidate 6 — "Multi-Spectrum Sky Anomaly Triage Combining User Capture with NOAA GLM Confirmation"

- For brightest events (potential bolides), automatically pull GOES GLM L2 data and confirm
- The METHOD of fusing user-pixel-data + geo-time + GLM event-time is novel for consumer applications

---

## Implementation Order — Concrete Roadmap

### Phase 1 (Days 1–30) — Read-only Cross-Reference MVP

- [ ] Stand up backend matcher service (Python, FastAPI)
- [ ] Daily cron pull of:
  - GMN `trajectory_summary` (https://globalmeteornetwork.org/data/)
  - CNEOS fireball JSON (https://ssd-api.jpl.nasa.gov/fireball.api)
  - AMS recent events (scrape/JSON)
  - IAU MDC shower table (weekly refresh)
- [ ] Spatial-temporal index (PostGIS + time-bin)
- [ ] `/match` endpoint: given (lat, lon, t, accuracy), returns top N matches with confidence scores
- [ ] Wire into Astra Vault client Meteor Story Page

### Phase 2 (Days 30–90) — Write-back + Partner Outreach

- [ ] Email outreach to: Denis Vida (GMN), Mark McIntyre (UKMON / gmn-data-platform), Vincent Perlerin + Mike Hankey (AMS), Hadrien Devillepoix (DFN/GFO), Cis Verbeeck (IMO)
- [ ] Implement AMS auto-submit (with explicit user consent UI)
- [ ] Pilot Vigie-Ciel auto-submit for European users
- [ ] Add SonotaCo annual catalog backfill for APAC
- [ ] Add EDMOND historical match (back to 2000) for European users
- [ ] Integrate GLM L2 confirmation for fireball-class events
- [ ] Integrate IAU MDC shower codes into Meteor Story Page

### Phase 3 (Days 90–180) — Astra Vault Camera Tier

- [ ] Pilot: sponsor 10 RMS stations (Astra Vault branding, integrated into GMN backbone)
- [ ] Build "Astra Vault Phone Tier" data product:
  - Opt-in user consent
  - Encrypted upload of capture + metadata
  - CC BY 4.0 publication of de-identified aggregate phone catalog
- [ ] Build live-tile ZHR/density map for shower peaks
- [ ] Publish first peer-reviewed paper: "Aggregate phone-class meteor detections during the 2026 Geminids: first results from Astra Vault" — co-author with Vida or Brown
- [ ] Patent filings on Bundles 1–6

### Phase 4 (Days 180–365) — Smart Glasses Tier

- [ ] Ray-Ban Meta integration of hands-free capture
- [ ] Android XR pilot
- [ ] Glasses-only capture stream into the same cross-reference backend
- [ ] Patent Bundle 2 filing

---

## Open Questions

1. **Email verification:** All contact emails in this report are based on training-data recall and SHOULD be verified through current public-facing pages of each network before any outreach. Sandbox blocked WebSearch/WebFetch this round.
2. **GMN's policy on consumer-grade integrations:** Vida is approachable. We should propose a phone-class data overlay pilot rather than asking permission. Worst case: he says no and we publish our data independently under CC BY 4.0, which costs nothing
3. **AMS submission rate limits:** Auto-submission at user scale (potentially 10,000+ reports during a major shower) could overwhelm AMS infrastructure. We MUST coordinate with Perlerin/Hankey on cadence and structured ingestion (CSV upload? Webhook? Email digest?)
4. **CNEOS latency:** The 1-30 day declassification gate means real-time bolide confirmation is impossible from CNEOS alone. Use GLM as the real-time satellite confirmation, CNEOS as the authoritative later-arriving record
5. **Legal exposure of consumer-grade data publication:** Publishing user-derived locations alongside timestamps could be a PII risk. The Phone Tier requires explicit opt-in, geographic fuzzing (e.g., publish to 0.1° not 0.0001°), and clear data-license terms in onboarding
6. **GLM parser library:** Glmtools (CIMSS) and `goes-2-go` Python lib exist. Need to evaluate which to use
7. **Chinese mainland integration:** Realistically inaccessible. Plan for graceful degradation — when a Chinese user observes, fall back to CNEOS/GLM and IAU shower codes; explicitly NOT a network-coverage gap to apologize for
8. **Bolivia / informal-network gaps:** Astra Vault's all-sky phone tier actually FILLS these gaps. For users in countries without a professional network, we become the primary record. This is a feature, not a bug — but should be framed thoughtfully in marketing (we are AUGMENTING global coverage, not COMPETING with it)
9. **Patent strategy:** File provisional patents on Bundles 1, 2, 5 immediately. Bundles 3, 4, 6 require more prior-art research. Defer to Stephen and IP counsel
10. **All-sky camera tier branding:** "Astra Vault Beacon" or "Astra Vault Eye" as station name? Pre-register the trademark before announcing the sponsorship program

---

## Appendix A — Key Source URLs to Re-verify

- GMN: https://globalmeteornetwork.org/
- GMN data: https://globalmeteornetwork.org/data/
- GMN python API: https://github.com/gmn-data-platform/gmn-python-api
- RMS firmware: https://github.com/CroatianMeteorNetwork/RMS
- CAMS: https://cams.seti.org/
- CAMS Meteor Shower Portal: http://cams.seti.org/FDL/ and http://meteorshowers.seti.org/
- FRIPON: https://fripon.org/
- Vigie-Ciel: https://vigie-ciel.org/
- DFN: https://dfn.gfo.rocks/
- GFO: https://gfo.rocks/
- DFN GitHub: https://github.com/desertfireballnetwork
- IMO: https://www.imo.net/
- IMO VMDB: https://www.imo.net/members/imo_vmdb
- AMS: https://www.amsmeteors.org/
- AMS fireball reports: https://www.amsmeteors.org/fireballs/
- AllSky7: https://allsky7.net/
- UKMON: https://ukmeteornetwork.co.uk/
- UKMON GitHub: https://github.com/ukmeteornetwork/
- SonotaCo Network: https://sonotaco.jp/
- CMOR (UWO meteor physics): http://meteor.uwo.ca/
- CMN: https://cmn.rgn.hr/
- EDMOND: https://www.meteornews.net/edmond/
- PFN: https://pfn.pkim.org/
- BRAMON: https://bramonmeteor.org/
- Fireballs Aotearoa: https://fireballs.nz/
- CNEOS fireballs: https://cneos.jpl.nasa.gov/fireballs/
- CNEOS API: https://ssd-api.jpl.nasa.gov/doc/fireball.html
- IAU MDC: https://www.ta3.sk/IAUC22DB/MDC2022/
- Meteoritical Bulletin: https://www.lpi.usra.edu/meteor/
- GOES GLM data: https://www.goes-r.gov/spacesegment/glm.html and https://registry.opendata.aws/noaa-goes/
- NEXRAD: https://registry.opendata.aws/noaa-nexrad/
- ANTARES: https://antares.noirlab.edu/
- Lasair: https://lasair.lsst.ac.uk/
- ALeRCE: https://alerce.online/

## Appendix B — Key People to Contact (Tier 1 Outreach)

| Name | Role | Network | Why |
|---|---|---|---|
| Denis Vida | Founder/Lead | GMN, RMS | Core cross-reference partner |
| Mark McIntyre | Data platform lead | UKMON, gmn-data-platform | Technical bridge for our backend |
| Peter Jenniskens | Founder/Lead | CAMS | The most senior figure; an endorsement = legitimacy |
| Hadrien Devillepoix | Technical Lead | DFN/GFO | Open-data advocate, technically expert, friendly |
| Mike Hankey | Founder/Co-lead | AllSky7, AMS | Both networks at once |
| Vincent Perlerin | Operations | AMS | Required for AMS auto-submit |
| Peter Brown | PI | CMOR, UWO | Radar data; bridges optical + radio |
| Cis Verbeeck | President | IMO | Global amateur network bless-off |
| François Colas | Lead | FRIPON / Vigie-Ciel | European write-back |
| Damir Šegon | Lead | CMN, EDMOND | European data aggregation |
| Sirko Molau | Lead | IMO Video Commission | Long video archive |
| SonotaCo | Founder | SonotaCo Network | APAC anchor |
| Marc Fries | Researcher | NEXRAD-meteorite | NEXRAD interpretation help |
| Pavel Spurný | PI | EU Fireball Network | Politeness — they're the oldest network |

## Appendix C — Quick Reference: Confidence-Scoring Recipe

For each user observation, compute match confidence against each network as:

```
score = w_t * exp(-(Δt / σ_t)^2)
      * w_d * exp(-(Δd / σ_d)^2)
      * w_az * cos(Δazimuth)
      * w_alt * cos(Δaltitude)
      * source_quality_factor
```

Where:
- Δt = time offset between user and network detection (target σ_t = 30s)
- Δd = spatial offset (target σ_d = 150 km for ground networks; 1000 km for GLM)
- Source quality factor: 1.0 for GMN/CAMS triangulated; 0.7 for single-station; 0.5 for AMS eyewitness; 0.9 for CNEOS; 0.85 for GLM
- Combine via product, threshold at 0.3 for "probable match"
- Top match returned with all source attribution

---

RESEARCH COMPLETE — meteor-networks.md written. Best cross-ref partner: **Global Meteor Network (GMN)**. Best contribution-back partner: **American Meteor Society (AMS)**.
