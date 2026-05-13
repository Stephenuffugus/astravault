# Integration Opportunities — Astra Vault R&D
## Comprehensive Inventory of Space-Agency, Telescope, Satellite, and Commercial APIs
### Compiled May 2026 | Author: R&D / Stephen Furpahs (Director)

> **Methodology note:** WebSearch / WebFetch were disabled in this environment, so this report is compiled from R&D's working knowledge of these public APIs and the seed material in `ASTRA_VAULT_HIDDEN_RESOURCE_MAP.md`. URLs, auth schemes, and rate limits are accurate to documentation as of the model's training horizon and the project's March 2026 reference doc; any endpoint flagged "verify before integration" should be re-confirmed against the live developer portal during sprint planning. Where 2026-specific milestones (Rubin Observatory first light, Gaia DR4, ESA Plato, NEO Surveyor) are mentioned, assume schedule slips are possible.

---

## TL;DR — Top 10 Highest-Value Integrations (Ranked)

1. 🟢 **JPL Horizons** — `ssd.jpl.nasa.gov/api/horizons.api` — solar-system position truth for every body, no auth.
2. 🟢 **NASA SkyView Virtual Observatory** — `skyview.gsfc.nasa.gov` — real telescope imagery in any wavelength, no auth.
3. 🟢 **NASA Exoplanet Archive TAP** — `exoplanetarchive.ipac.caltech.edu/TAP` — 5,800+ confirmed exoplanets, no auth.
4. 🟢 **MAST (STScI) — Mashup + VO + cloud** — `mast.stsci.edu/api/v0` — HST, JWST, TESS, Kepler observation history. Free, anonymous reads.
5. 🟢 **Celestrak TLEs** — `celestrak.org/NORAD/elements/gp.php` — every catalogued satellite, no auth, hourly updates.
6. 🟢 **ESA Gaia Archive (TAP)** — `gea.esac.esa.int/tap-server/tap` — 1.8B-star astrometric catalog (DR3 live; DR4 scheduled late-2026/early-2027).
7. 🟢 **SIMBAD + VizieR (CDS Strasbourg)** — `simbad.u-strasbg.fr` / `vizier.cds.unistra.fr` — universal object resolver + 23,000 catalogs. No auth.
8. 🟢 **NOAA SWPC Space Weather + Aurora** — `services.swpc.noaa.gov` — Kp index, aurora oval, CME alerts. Free, no auth.
9. 🟢 **The Launch Library 2 (TheSpaceDevs)** — `ll.thespacedevs.com/2.2.0/` — unified launch schedule (SpaceX, RL, ULA, ESA, ISRO, JAXA, CNSA). Free tier 15 req/hr; $5/mo for production.
10. 🟢 **IAU Minor Planet Center** — `minorplanetcenter.net/iau/MPCORB.html` + `web service` — definitive asteroid/comet catalog, citizen-science observation submission.

**Honorable mentions:** Open-Notify ISS, AAVSO VSX, USNO API, NASA APOD, NASA Image & Video Library, JWST API mirror, Heavens-Above (deeplink only), SatNOGS, ESA Sky deeplink, Worldview/GIBS.

---

## Priority Matrix

| API | Cost | Auth | Rate Limit | Astra Vault Use Case | Priority |
|---|---|---|---|---|---|
| NASA APOD | Free | DEMO_KEY or API key | 30/hr (DEMO), 1000/hr (key) | Daily hero image, ATP daily check-in | 🟢 P1 |
| NASA NeoWs | Free | API key | 1000/hr | Asteroid feed widget | 🟢 P1 |
| NASA DONKI | Free | API key | 1000/hr | Aurora + space weather alerts | 🟢 P1 |
| NASA EPIC | Free | API key | 1000/hr | Earth-from-DSCOVR live image | 🟢 P1 |
| NASA EONET | Free | none | unlimited (reasonable) | Earth natural events feed | 🟡 P2 |
| NASA Mars Rover Photos | Free | API key | 1000/hr | "What did Curiosity see today?" | 🟢 P1 |
| NASA Image & Video Library | Free | none | unlimited (reasonable) | Hero media for every object | 🟢 P1 |
| NASA TechPort / TechTransfer / Patents | Free | API key | 1000/hr | Low ROI — defer | 🔵 P3 |
| NASA Insight | Free | API key | 1000/hr | **DEAD — mission ended Dec 2022, endpoint legacy only** | ❌ skip |
| NASA Earth (Landsat) | Free | API key | 1000/hr | "Your home from space" — limited resolution | 🟡 P2 |
| NASA Exoplanet Archive TAP | Free | none | fair-use | Exoplanet Explorer module | 🟢 P1 |
| NASA GeneLab / OSDR | Free | none/optional | unlimited | Astrobiology niche content | 🔵 P3 |
| NASA Worldview / GIBS | Free | none | unlimited (tiled) | Earth-observation backdrop | 🟡 P2 |
| NASA Trek WMTS | Free | none | unlimited (tiled) | Moon/Mars/Vesta basemap layers | 🟢 P2 |
| NASA Eyes on Solar System | Free | iframe / WebGL only — no API | n/a | Deeplink, no integration | 🔵 deeplink |
| NASA Open-Source on GitHub | Free | none | n/a | Skyfield, SPICE, Toolkit | 🟢 P1 (dependency) |
| JPL Horizons | Free | none | fair-use | Live planet/asteroid positions | 🟢 P1 |
| JPL SBDB | Free | none | fair-use | Asteroid/comet detail pages | 🟢 P1 |
| JPL CAD (close-approach) | Free | none | fair-use | "Near Earth Watch" | 🟢 P1 |
| JPL Fireball | Free | none | fair-use | Bolide notification feed | 🟡 P2 |
| JPL Sentry | Free | none | fair-use | Impact-risk catalog | 🟡 P2 |
| JPL Scout | Free | none | fair-use | Newly discovered NEO tracker | 🟡 P2 |
| JPL NHATS | Free | none | fair-use | Human-accessible NEOs | 🔵 P3 |
| SkyView Virtual Observatory | Free | none | fair-use | Multi-wavelength imagery toggle | 🟢 P1 |
| MAST Mashup API | Free | none for public | fair-use | Telescope history per object | 🟢 P1 |
| MAST AWS Open Data | Free egress in `us-east-1` | none | unlimited from S3 | Bulk JWST/HST imagery | 🟢 P2 |
| IRSA (Caltech) | Free | none | fair-use | WISE/2MASS/Spitzer imagery | 🟡 P2 |
| NASA ADS API | Free | API key (free) | 5000/day | Publication counts per object | 🟢 P2 |
| Spitzer Heritage Archive | Free | none | fair-use | Legacy IR imagery via IRSA | 🟡 P2 |
| ESA Gaia Archive (TAP) | Free | none (optional account) | fair-use; jobs queued | High-precision stellar catalog | 🟢 P1 |
| ESA Sky | Free | none — embed only | n/a | Deeplink viewer | 🟡 deeplink |
| ESA ESDC archive | Free | mission-dependent | fair-use | XMM, INTEGRAL, Solar Orbiter | 🟡 P2 |
| ESA Datalabs | Free (waitlist) | account | n/a | Pro-user JupyterLab — not for consumer | 🔵 skip |
| Copernicus Sentinel (CDSE) | Free | OAuth2 (free account) | 30k req/30d default | Earth obs imagery | 🟡 P2 |
| ESA Cosmos / Cheops / Plato | Free | mission-dependent | fair-use | Niche light-curve content | 🔵 P3 |
| JAXA G-Portal | Free | account | fair-use | Hayabusa2 / Akatsuki data | 🟡 P2 |
| JAXA DARTS | Free | none | fair-use | Hinode solar imagery | 🟡 P2 |
| ISRO Chandrayaan-3 / PRADAN | Free | account | fair-use | Lunar imagery | 🔵 P3 |
| CSA RADARSAT EODMS | Free (Canadians) / cost (intl) | account | varies | SAR imagery | 🚨 skip |
| CNSA / Roscosmos | Limited public access | varies | varies | Skip | ❌ skip |
| SDSS DR18 SkyServer | Free | none | fair-use | Galaxy spectra + imagery | 🟢 P2 |
| DECaLS / Legacy Survey | Free | none | fair-use | Deep galaxy imagery (deeper than SDSS) | 🟢 P2 |
| Pan-STARRS DR2 | Free | none | fair-use | Northern-sky imagery + photometry | 🟢 P2 |
| 2MASS (via IRSA) | Free | none | fair-use | NIR imagery | 🟡 P2 |
| WISE / NEOWISE (via IRSA) | Free | none | fair-use | MIR imagery | 🟡 P2 |
| ZTF Alert Stream (Kafka) | Free | account | fair-use | Transient event feed | 🚨 P3 (heavy infra) |
| Vera Rubin LSST | Restricted until ~2027 data rights | embargo + account | n/a now | Wait — public alerts via brokers | 🔵 watch |
| ANTARES (NOIRLab broker) | Free | account | fair-use | Filtered LSST/ZTF alerts | 🟡 P2 |
| ALeRCE / Fink / Lasair brokers | Free | account | fair-use | Same as ANTARES — choose one | 🟡 P2 |
| LIGO/Virgo GraceDB + GCN | Free | none | fair-use | GW event push notifications | 🟢 P2 |
| NASA GCN (multi-messenger) | Free | account | fair-use | Notice broker (Kafka/email) | 🟢 P2 |
| ALMA Science Archive | Free | none for queries | fair-use | Sub-mm imagery niche | 🔵 P3 |
| EHT data products | Free static | n/a — flat files | n/a | Curated content only | 🔵 deeplink |
| Celestrak GP/SUPP elements | Free | none | "be reasonable" — TLE feeds hourly | Satellite tracking core | 🟢 P1 |
| Space-Track.org | Free | account + manual approval | 300 req/hr, 1200/min | High-precision orbital data | 🟡 P2 (slow approval) |
| N2YO | Free tier | API key | 1000/hr (key) | Consumer-friendly fallback | 🟡 P2 |
| Heavens-Above | None (HTML only) | n/a | n/a | Deeplink | 🔵 deeplink |
| SatNOGS Network | Free | none | fair-use | Amateur ground station data | 🟡 P2 |
| SkyPiX | Status uncertain | n/a | n/a | Defer | 🔵 watch |
| SpaceX r-SpaceX (community) | Free | none | none | Launch + booster + Starlink | 🚨 unmaintained — verify |
| SpaceX Starlink positions | via Celestrak | none | hourly | Live Starlink map | 🟢 P2 |
| Launch Library 2 (TheSpaceDevs) | Free + paid tier | none (free) / key (PRO) | 15 req/hr free, higher PRO | Unified launch calendar | 🟢 P1 |
| Rocket Launch Live | Paid | API key | tiered | Optional richer launch data | 🚨 paid |
| Rocket Lab | RSS / scraping | n/a | n/a | Deeplink + LL2 covers it | 🔵 LL2 covers |
| Blue Origin | RSS / scraping | n/a | n/a | LL2 covers it | 🔵 LL2 covers |
| ULA / Arianespace | Press release scraping | n/a | n/a | LL2 covers it | 🔵 LL2 covers |
| Astrocast / Iridium / Globalstar | Commercial | account + fees | varies | Skip — niche | 🚨 skip |
| Planet Labs | Education program | account | quota | Cool but gated | 🟡 EDU only |
| Spire | Commercial | API key | paid | Skip for consumer | 🚨 skip |
| Capella Space | Commercial | API key | paid | Skip | 🚨 skip |
| Privateer Wayfinder | Free read | none | fair-use | Orbital debris visualization | 🟢 P2 |
| LeoLabs Vertex | Commercial | account | paid | Skip | 🚨 skip |
| AAVSO API + VSX | Free | account | fair-use | Variable star photometry + submission | 🟢 P2 |
| BAA, ALPO | Web only | n/a | n/a | Deeplink + community feed | 🔵 deeplink |
| AAS Sky | Limited API | n/a | n/a | Deeplink | 🔵 deeplink |
| IAU MPC | Free | none for reads; account for submission | fair-use | Asteroid/comet observation pipeline | 🟢 P1 |
| ALPO observing programs | Web only | n/a | n/a | Deeplink + curated lists | 🔵 deeplink |
| DASCH Harvard | Free | none | fair-use | "Star century" historical plates | 🟡 P3 |
| HEASARC | Free | none | fair-use | X-ray / gamma archive | 🟡 P2 |
| ClearOutside | None (HTML scrape) | n/a | n/a | **Avoid — deeplink only** | 🚨 scrape risk |
| Clear Dark Sky | None — image only | n/a | n/a | Deeplink | 🔵 deeplink |
| Astrospheric | API (paid) | API key | tiered | Paid alternative if needed | 🚨 paid |
| Open-Meteo / Met.no / NWS | Free | none / UA-string | fair-use | Cloud cover, visibility, dew point | 🟢 P1 |
| Globe at Night | Free | optional account | fair-use | Light-pollution citizen science | 🟢 P2 |
| Light Pollution Map / World Atlas | Free / academic | tile server | fair-use | LP overlay on observing planner | 🟢 P2 |
| Skyfield (Python) | OSS | n/a | n/a | Backend ephemeris dep | 🟢 dep |
| Astropy | OSS | n/a | n/a | Backend dep | 🟢 dep |
| pyephem | OSS (legacy) | n/a | n/a | Skip — use Skyfield | 🔵 skip |
| VSOP87 / DE440 | Public-domain | n/a | n/a | Underlying theory — via SPICE/Skyfield | 🟢 dep |
| NAIF SPICE kernels | Free | none | unlimited | Mission geometry — pro feature | 🟢 P3 |

---

## NASA — Per-Endpoint Deep Dives

### `api.nasa.gov` Endpoint Catalog

| Endpoint | What it returns | Best Astra Vault use | Auth | Rate | Status |
|---|---|---|---|---|---|
| `/planetary/apod` | Astronomy Picture of the Day | Daily hero card | API key | 1000/hr | 🟢 live |
| `/neo/rest/v1/feed` | Near-Earth Object feed by date | "What's flying by" widget | API key | 1000/hr | 🟢 live |
| `/neo/rest/v1/neo/browse` | Paginated NEO browse | Asteroid catalog seed | API key | 1000/hr | 🟢 live |
| `/neo/rest/v1/neo/{id}` | Per-asteroid detail | NEO detail page | API key | 1000/hr | 🟢 live |
| `/DONKI/CME` | Coronal Mass Ejections | Aurora forecast input | API key | 1000/hr | 🟢 live |
| `/DONKI/CMEAnalysis` | CME impact analysis | Magnetic-storm severity | API key | 1000/hr | 🟢 live |
| `/DONKI/GST` | Geomagnetic Storm | Aurora trigger event | API key | 1000/hr | 🟢 live |
| `/DONKI/IPS` | Interplanetary Shock | Space-weather alert | API key | 1000/hr | 🟢 live |
| `/DONKI/FLR` | Solar Flare | Solar activity feed | API key | 1000/hr | 🟢 live |
| `/DONKI/SEP` | Solar Energetic Particles | Astronaut/space-weather risk | API key | 1000/hr | 🟢 live |
| `/DONKI/MPC` | Magnetopause Crossing | Niche | API key | 1000/hr | 🟡 niche |
| `/DONKI/RBE` | Radiation Belt Enhancement | Niche | API key | 1000/hr | 🟡 niche |
| `/DONKI/HSS` | High-Speed Stream | Aurora precursor | API key | 1000/hr | 🟡 niche |
| `/DONKI/WSAEnlilSimulations` | WSA-Enlil sim runs | Solar-system weather viz | API key | 1000/hr | 🟡 niche |
| `/DONKI/notifications` | Aggregated notification feed | **Single endpoint for all DONKI** | API key | 1000/hr | 🟢 live |
| `/planetary/earth/assets` | Landsat asset locator | "Your home from space" | API key | 1000/hr | 🟡 limited res |
| `/planetary/earth/imagery` | Landsat imagery JPG | Same | API key | 1000/hr | 🟡 limited res |
| `/EPIC/api/natural` | DSCOVR L1 Earth images | Live Earth disk hero | API key | 1000/hr | 🟢 live |
| `/EPIC/api/enhanced` | EPIC enhanced | Same | API key | 1000/hr | 🟢 live |
| `/EPIC/archive/{type}/{yyyy}/{mm}/{dd}/png/{file}` | Image bytes | Direct image fetch | API key | 1000/hr | 🟢 live |
| `/insight_weather/` | InSight Mars weather | **Mission ended Dec 2022 — endpoint legacy only** | API key | n/a | ❌ DEAD |
| `/mars-photos/api/v1/rovers/curiosity` | Curiosity photos | Mars-rover gallery | API key | 1000/hr | 🟢 live |
| `/mars-photos/api/v1/rovers/perseverance` | Perseverance photos | Same | API key | 1000/hr | 🟢 live |
| `/mars-photos/api/v1/rovers/opportunity` | Opportunity (archive) | Historic | API key | 1000/hr | 🟡 archive |
| `/mars-photos/api/v1/rovers/spirit` | Spirit (archive) | Historic | API key | 1000/hr | 🟡 archive |
| `/techtransfer/patent` | NASA patents | Low ROI | API key | 1000/hr | 🔵 niche |
| `/techtransfer/software` | NASA OSS | Low ROI | API key | 1000/hr | 🔵 niche |
| `/techport/api/projects` | Active NASA tech projects | Low ROI | API key | 1000/hr | 🔵 niche |
| `/EONET/v3/events` | Natural events (wildfires, storms, volcanoes) | "Earth tonight" Earth-side feed | none | unlimited | 🟢 live |
| `/EONET/v3/categories` | Event categories | Filter UI | none | unlimited | 🟢 live |
| `/EONET/v3/sources` | Event sources | Provenance | none | unlimited | 🟢 live |
| `/tle/{id}` | NASA TLE wrapper (deprecated since 2022 — prefer Celestrak) | Skip | none | n/a | ❌ retired |
| `/exoplanet` (legacy wrapper) | Returns subset | **Use Exoplanet Archive TAP instead** | API key | 1000/hr | 🟡 stale |

> **Note on TLE API:** `api.nasa.gov/tle` was retired around 2022. NASA recommends Celestrak directly. The handoff doc references the "TLE API" — flag for update.

> **Note on Insight Weather:** Mission ended Dec 21, 2022. The endpoint still serves the final dataset for historical use, but no new sols are added. Frame as "Mars Weather: A History" rather than "live."

### NASA Image and Video Library — `images-api.nasa.gov`
- Auth: none. Rate: fair-use, no published limit.
- Endpoints: `/search`, `/asset/{nasa_id}`, `/metadata/{nasa_id}`, `/captions/{nasa_id}`.
- Use case: every object in our catalog can pull hero imagery, audio (e.g., Apollo loops), and captioned video. 🟢 P1.
- Returns a CollectionV1 schema with `href` URLs to S3-hosted media.

### NASA Open Source on GitHub
- `github.com/nasa`, `github.com/nasa-jpl`, `github.com/spacetelescope`.
- Notables: **SPICE/SpiceyPy** (JPL mission geometry), **Skyfield is third-party but uses JPL ephemerides**, **astroquery** (community wrapper for NASA archives), **healpy**, **ASDF**, **jwst pipeline**, **astropy/astropy**, **stsci/stistools**. 🟢 dependency tier.

### JPL Solar System Dynamics (`ssd-api.jpl.nasa.gov`)

| Endpoint | Path | Returns | Use |
|---|---|---|---|
| Horizons | `/api/horizons.api` | Ephemerides for ~1.4M bodies | 🟢 already in v4 plan |
| SBDB | `/api/sbdb.api` | Small-body database lookup | 🟢 P1 detail pages |
| SBDB Close-Approach (CAD) | `/api/cad.api` | NEO close approaches | 🟢 P1 "Near Earth Watch" |
| SBDB Query | `/api/sbdb_query.api` | Bulk small-body queries | 🟡 catalog seeding |
| Fireball | `/api/fireball.api` | US Govt sensor bolide reports | 🟡 P2 bolide map |
| Sentry | `/api/sentry.api` | Impact-risk asteroids | 🟡 P2 |
| Scout | `/api/scout.api` | Newly discovered NEO triage | 🟡 P2 |
| NHATS | `/api/nhats.api` | Human-accessible NEOs | 🔵 niche |
| Mission Design | `/api/mdesign.api` | Δv to destinations | 🔵 niche |
| PSP (planetary satellite physical) | `/api/psp.api` | Moon physical params | 🟡 P2 |
| JD/Cal calendar | `/api/jd_cal.api` | Date conversion utility | 🔵 internal helper |

All JPL SSD APIs are anonymous, free, fair-use rate-limited (don't hammer; cache).

### MAST — `mast.stsci.edu/api/v0`
- **Mashup API** is the workhorse: POST JSON service request, get JSON observation list with `dataURL` per product.
- Services: `Mast.Caom.Cone`, `Mast.Caom.Filtered`, `Mast.Name.Lookup`, `Mast.Tic.Crossmatch`, `Mast.HscMatches.Db.v3`, `Mast.GaiaDR3.Crossmatch`, etc.
- Anonymous reads. Auth required only for proprietary / not-yet-public observations (1-year HST/JWST embargo).
- AWS Public Dataset mirror: `s3://stpubdata` (no egress in `us-east-1`). For bulk imagery, hit S3 directly via signed URLs from the Mashup result — Stephen, this is the **trick** for cheap delivery: cache S3 URLs, serve to clients.
- TIC (TESS Input Catalog), GAIA xmatch, HSC (Hubble Source Catalog), CAOM (Common Archive Observation Model) are all queryable. 🟢 P1.

### SkyView Virtual Observatory — `skyview.gsfc.nasa.gov`
- CGI: `/current/cgi/runquery.pl?...` returns image bytes (JPEG/GIF/FITS).
- 100+ surveys: DSS, DSS2, 2MASS J/H/K, SDSS u/g/r/i/z, WISE 3.4/4.6/12/22 µm, GALEX FUV/NUV, ROSAT 0.1–2.4 keV, Chandra, XMM, Fermi LAT, Planck, IRAS, AKARI, Spitzer IRAC. Full list at `/cgi-bin/survey.pl`.
- Caveat: image generation is on-the-fly and slow (1–10s per request). **Cache aggressively per (RA, Dec, survey, size)**. 🟢 P1.

### NASA ADS — `api.adsabs.harvard.edu/v1`
- Auth: free Bearer token (registration at adsabs.harvard.edu/user/account).
- Rate: 5000 queries/day per token.
- Endpoints: `/search/query`, `/biblib`, `/metrics`, `/export`.
- Use: "47 papers published about this star" — pair with SIMBAD identifier resolution. 🟢 P2.

### IRSA (IPAC InfraRed Science Archive) — `irsa.ipac.caltech.edu`
- TAP at `/TAP`, image services at `/applications/finderchart`, ICORE, ATLAS.
- Hosts: 2MASS, WISE/NEOWISE, Spitzer Heritage Archive (SHA), Herschel (NASA mirror), ZTF, Pan-STARRS PS1, etc.
- 🟡 P2 — overlaps SkyView for imagery, but better for catalog cross-match.

### NASA Worldview + GIBS
- Worldview is a UI; **GIBS** is the API: `gibs.earthdata.nasa.gov/wmts/...` WMTS tile server.
- 1000+ Earth-observation layers (MODIS, VIIRS, OMI, SMAP, etc.).
- Use: scrollable "Earth right now" backdrop on the Earth view. 🟡 P2.

### NASA Trek WMTS — `trek.nasa.gov/tiles/...`
- Mars, Moon, Vesta, Ceres, Mercury, Europa, Titan, Enceladus, Iapetus, Phobos, Deimos basemaps as WMTS tiles.
- Use: planetary surface explorer module. 🟢 P2.

### NASA OSDR (Open Science Data Repository, replaced GeneLab in 2023) — `osdr.nasa.gov/bio/repo/`
- API: `/data/glds/files/{id}`. Biology + physical-science space data.
- Use: astrobiology niche cards ("plants in space" content). 🔵 P3.

### NASA Eyes on the Solar System / Exoplanets / Earth — `eyes.nasa.gov`
- **No public API** — WebGL viewers only. Suitable for deeplink iframes if Stephen wants embedded "open in Eyes" buttons.

### NASA GCN (General Coordinates Network) — `gcn.nasa.gov`
- Replaced the legacy GCN Circulars in 2023. Kafka-based notice broker for multimessenger events (GW, GRB, neutrino).
- Free account, fair-use. 🟢 P2 — pairs with LIGO/Virgo events for "Cosmic Alarm."

### USNO Astronomical Applications API — `aa.usno.navy.mil/api`
- Endpoints: `/rstt/oneday`, `/moon/phases/year`, `/celnavtable`, `/sidtime`, `/jdconvert`, `/eclipses/solar/year`, `/eclipses/lunar/year`.
- Auth: none. Rate: fair-use.
- Use: Birthday Sky, moon-phase widget. 🟢 P1 (already in v4 plan).

---

## ESA

### Gaia Archive — `gea.esac.esa.int/tap-server/tap`
- TAP (Table Access Protocol) ADQL queries; sync (small) and async (large) modes.
- **DR3 live since June 2022**: 1.8B sources, astrometry + photometry + RVS spectra subset + variability.
- **Gaia DR4 expected late 2026 / early 2027 (as of mission roadmap)** — will add ~5.5 years of data, epoch photometry, full RVS, non-single-star solutions, exoplanet candidates. Flag for refresh once released.
- Anonymous reads; optional user account for job persistence. 🟢 P1.
- Use case: every star object in our catalog joins to Gaia DR3 source_id for proper-motion-corrected position, parallax → distance, radial velocity, BP-RP color.

### ESA Sky — `sky.esa.int`
- Viewer w/ HiPS (Hierarchical Progressive Surveys) tile layers. Embeddable.
- API: HiPS list at `aladin.cds.unistra.fr/hips/list`. HiPS is the de facto VO image-tiling standard — used by Aladin, ESASky, Astra Vault should adopt it.
- 🟢 P2 — HiPS tiles are the right way to do "zoomable sky" cheaply.

### ESDC (European Space Astronomy Centre) — `archives.esac.esa.int`
- Hosts: XMM-Newton, INTEGRAL, Cluster, Herschel (ESA-side), Planck, Mars Express, Rosetta, Cheops, Solar Orbiter, Smile (when launched), Cassini-Huygens (Huygens probe), SOHO (joint w/ NASA), Hipparcos legacy.
- Per-mission TAP endpoints; common SAS API.
- Use: comet 67P imagery from Rosetta, Mars Express HiRISE-equivalent. 🟡 P2.

### Copernicus Data Space Ecosystem (CDSE) — `dataspace.copernicus.eu`
- Replaced SciHub in 2023.
- Sentinel-1 (SAR), Sentinel-2 (optical), Sentinel-3 (ocean/land), Sentinel-5P (atmosphere).
- Auth: OAuth2 free account. Quota: 30,000 req per 30 days default, can request more.
- Use: cloud cover overlay, fire detection on Earth view. 🟡 P2.

### ESA Datalabs — `datalabs.esa.int`
- JupyterLab hosted compute for scientists. Not consumer-facing. Skip.

---

## Other Agencies

### JAXA
- **G-Portal**: `gportal.jaxa.jp` — GCOM, ALOS, GOSAT Earth obs. Free account.
- **DARTS**: `darts.isas.jaxa.jp` — Hinode (solar), Hayabusa, Hayabusa2, Akatsuki (Venus), Hisaki (planetary UV).
- **JUICE** (joint w/ ESA, launched 2023): data via ESA PSA when public.
- 🟡 P2. Specifically: Hayabusa2 Ryugu imagery and Akatsuki Venus cloud-tracking are unique content nobody else surfaces.

### ISRO
- **PRADAN** + ISSDC Chandrayaan portal: `pradan.issdc.gov.in` — Chandrayaan-1, -2, -3 imagery, Aditya-L1 solar data. Account required, non-Indian access historically limited but improving. 🔵 P3.

### CSA
- RADARSAT-1/2 via NRCan EODMS — SAR imagery, free to Canadians, paid otherwise. 🚨 skip.
- CSA does not run a unique consumer API; Canadian JWST data is in MAST.

### CNSA (China)
- **Lunar and Planetary Data Release System**: `clep.org.cn` and `moon.bao.ac.cn`. Limited English support, account-gated, some Chang'e and Tianwen-1 data public.
- 🚨 skip integration; curate static highlights only.

### Roscosmos
- No meaningful public API. Skip.

---

## Telescope Archives

### SDSS — `skyserver.sdss.org` (DR18 as of Aug 2023, **DR19** expected 2026)
- SQL via SkyServer, CasJobs for big queries. Image cutout service: `/dr18/SkyServerWS/ImgCutout/getjpeg`.
- 🟢 P2. Galaxy spectra + classification.

### DECaLS / Legacy Survey — `legacysurvey.org/viewer`
- Cutout API: `legacysurvey.org/viewer/jpeg-cutout?ra=..&dec=..&size=..&layer=ls-dr10`.
- DR10 covers ~20,000 deg² to ~24 mag — **deeper than SDSS**.
- 🟢 P2. Better imagery for galaxies than DSS.

### Pan-STARRS DR2 — `catalogs.mast.stsci.edu/panstarrs/`
- Northern-sky stacked imagery + photometry. Image cutout: `ps1images.stsci.edu/cgi-bin/ps1cutouts`. Catalog via MAST.
- 🟢 P2.

### 2MASS, WISE / NEOWISE
- Via IRSA finder-chart and SkyView. 2MASS is finished (1997–2001); WISE/NEOWISE continues until **2024 deorbit** (NEOWISE re-entered Nov 2024). Archive remains.
- 🟡 P2 deepening of object pages.

### ZTF (Zwicky Transient Facility) — `irsa.ipac.caltech.edu/Missions/ztf.html`
- Public alert stream via Kafka at UW (`public.alerts.ztf.uw.edu`), avro format. ~1M alerts/night.
- Heavy infra. **Filter via a broker (ANTARES, Lasair, Fink, ALeRCE) — don't drink from firehose.**
- 🚨 P3 direct; 🟡 P2 via broker.

### Vera Rubin Observatory / LSST
- First light **achieved June 2025**, science operations ramp through 2026.
- Data rights: full alert stream is public; image data has proprietary periods for in-kind contributors.
- Brokers: **ANTARES (NOIRLab), ALeRCE, Fink, Lasair, BABAMUL** are the official LSST community brokers.
- Astra Vault should consume **filtered alerts via ANTARES or Fink** — 10M alerts/night raw, but brokers offer object-classified subsets (e.g., "new supernova candidates").
- 🟢 P2 (via broker) — unique "first to know" experience.

### LIGO / Virgo / KAGRA — GraceDB + GCN
- Public alerts in GCN format (Kafka stream). LIGO O4 run ongoing into 2026.
- Astra Vault: "GW event detected — here's the localization map and possible host galaxies." Pair with multimessenger object catalog.
- 🟢 P2.

### ALMA Science Archive — `almascience.eso.org`
- TAP, VO-compliant. Sub-mm interferometry.
- 🔵 P3 — small audience for raw radio data; cherry-pick PR imagery instead.

### EHT (Event Horizon Telescope)
- No live API. Static data releases (M87*, Sgr A* movies) at `eventhorizontelescope.org`.
- Curated content only. 🔵 deeplink.

### HEASARC — `heasarc.gsfc.nasa.gov`
- High-energy archive: Chandra, Swift, NICER, NuSTAR, Fermi, XMM (mirror), legacy.
- VO TAP + Xamin web service. 🟡 P2.

### DASCH (Harvard Digital Access to a Sky Century) — `dasch.cfa.harvard.edu`
- Scanned glass plates 1885–1992; light curves spanning 100+ years.
- API: `/dr/api` per object query.
- Unique experience: "Show me how this star varied over 100 years." 🟡 P3.

---

## Satellite Tracking

### Celestrak — `celestrak.org`
- **Modern GP API** (replaced legacy TLE files in 2021): `https://celestrak.org/NORAD/elements/gp.php?CATNR={id}&FORMAT=JSON`. Group queries: `?GROUP=starlink&FORMAT=JSON`.
- Updated hourly for active sats. Anonymous, no key, fair-use ("be reasonable, cache, don't poll faster than orbital periods change").
- Maintained by Dr. T.S. Kelso. The de-facto consumer-friendly source.
- 🟢 P1.

### Space-Track.org — `space-track.org/basicspacedata/query/...`
- US Space Force 18 SDS authoritative catalog.
- Auth: free account but **manual approval (1–14 days)**, terms of use restrict redistribution.
- Rate: 300 req/hr, 1200 req/min burst. Querying via REST + Predicate syntax.
- 🟡 P2 — get the account but plan around Celestrak as primary; Space-Track for high-precision needs (conjunction analysis, decay).

### N2YO — `n2yo.com/api`
- Consumer-friendly. API key free tier 1000 req/hr.
- Endpoints: `/rest/v1/satellite/{id}/positions`, `/visualpasses`, `/radiopasses`, `/above`.
- 🟡 P2 fallback / sanity check.

### Heavens-Above — `heavens-above.com`
- No public API. HTML-only. Deeplink with `?lat=&lng=&satid=` only. 🔵 deeplink.

### SatNOGS Network — `network.satnogs.org/api`
- Amateur ground-station network. Free, no auth for reads. Token for writes.
- Endpoints: `/api/observations`, `/api/stations`, `/api/satellites`, plus DB at `db.satnogs.org/api`.
- Use: "real amateur radio observations of cubesats" — surface live audio waterfalls. 🟡 P2, unique content.

### SkyPiX
- Status uncertain as of 2026 — last known activity 2023 release. Treat as deferred. 🔵 watch.

---

## SpaceX + Commercial Launches

### Launch Library 2 (TheSpaceDevs) — `ll.thespacedevs.com/2.2.0/`
- **The unified answer** for launch schedules. Covers SpaceX, Rocket Lab, ULA, Arianespace, ISRO, JAXA, CNSA, Blue Origin, RFA, Firefly, ABL, Relativity, Stoke.
- Endpoints: `/launch/upcoming`, `/launch/previous`, `/launcher`, `/pad`, `/agency`, `/event`, `/spacestation`, `/dashboard`.
- Tiers:
  - Free: 15 req/hr.
  - Pro (~$5/mo): unlimited, sub-second update from internal scrapers.
  - LL2 sister: SpaceLaunchNow app uses the same API.
- 🟢 P1. **This is the integration that subsumes SpaceX, RL, BO, ULA, ESA, ISRO, CNSA, JAXA launch tracking in one call.**

### SpaceX Direct
- The community-maintained **r-SpaceX `api.spacexdata.com`** (v4) was deprecated/handed off and is now mirrored at `spacex-data.com` / `api.spacexdata.com/v5` with sporadic updates. **As of 2025/2026 the project is community-maintained with stale data on some endpoints — verify before relying.** 🚨.
- SpaceX itself **does not publish an official launch API** — only RSS feeds (`spacex.com/feed/`) and a Twitter/X account.
- Booster recovery: no API. NASASpaceflight forum + community trackers (next-spaceflight.com) scrape from Twitter/X.
- Starlink tracking: pull TLEs from Celestrak GROUP=starlink (currently ~6,500 active sats), feed into SGP4 propagator client-side (e.g., `satellite.js`).

### Rocket Lab, Blue Origin, ULA, Arianespace
- No first-party APIs. LL2 covers all. 🔵 LL2.

### Twitter / X
- API v1.1 retired (Mar 2023), v2 free tier removed (Feb 2023). Now paid: Basic $200/mo, Pro $5000/mo. **Avoid.** 🚨 ❌.
- Use Bluesky AT Protocol or Mastodon RSS for community launch chatter if needed.

---

## Other Commercial Space

### Astrocast / Iridium / Globalstar
- Commercial IoT satellite networks. Paid APIs for messaging, not pass-prediction. Pass prediction is via Celestrak TLEs anyway. 🚨 skip.

### Planet Labs — `developers.planet.com`
- Education + Research program (NICFI also free): SuperDove daily imagery.
- API: STAC-compliant, GeoJSON queries, asset download.
- Free tier: 5,000 km²/month after vetting. 🟡 EDU-only — apply for partnership.

### Spire — `developers.spire.com`
- GNSS-RO weather, ADS-B aircraft, AIS ships. Paid.
- 🚨 skip for consumer.

### Capella Space, ICEYE
- SAR commercial. Paid. Skip. 🚨.

### Privateer Wayfinder — `wayfinder.privateer.com`
- Orbital debris visualization (Steve Wozniak's company). Free read access via web; backend API is `wayfinder-api.privateer.com` (verify availability).
- Use: "650,000 tracked objects in orbit" Earth-shell visualization. 🟢 P2.

### LeoLabs Vertex — `platform.leolabs.space`
- Commercial conjunction-analysis service. Paid. 🚨 skip.

---

## Citizen + Amateur Networks

### AAVSO (American Association of Variable Star Observers) — `aavso.org`
- VSX (Variable Star Index): API at `/vsx/index.php?view=api.list` returns JSON.
- WebObs / APASS / VPHOT: photometric submission pipelines, account required.
- 🟢 P2. Pair with our citizen science: log variable-star brightness, submit to AAVSO from app.

### BAA — `britastro.org`
- Bulletins, observing programs. No API. 🔵 deeplink, RSS.

### AAS — `aas.org`
- News, journals. ADS handles publications. 🔵 deeplink.

### IAU Minor Planet Center — `minorplanetcenter.net`
- Web service: `web.cgi`, `mpchecker`, `mpcorb.dat` (full asteroid orbital catalog daily download).
- Citizen-science observation submission: requires assigned observatory code (MPC code).
- Astra Vault could partner: users with calibrated photometry submit precovery / followup. 🟢 P1 long-term, **plus** definitive asteroid name resolution and catalog seeding.

### ALPO (Association of Lunar and Planetary Observers) — `alpo-astronomy.org`
- Section coordinators run programs. No API. 🔵 deeplink + curated observing campaigns.

### Solar observing networks
- **AAVSO Solar**, **Helio Network**, **SILSO** (Royal Observatory Belgium): SILSO has CSV daily sunspot numbers at `sidc.be/SILSO/datafiles`. 🟢 P2.

### Asteroid Day partner observatories
- Network of 200+ observatories with annual outreach. No unified API. 🔵 deeplink.

### DASCH
- Covered above under telescope archives.

### HEASARC
- Covered above.

---

## Weather + Observing Conditions

### NOAA SWPC (Space Weather Prediction Center) — `services.swpc.noaa.gov`
- Endpoints: `/products/noaa-planetary-k-index.json`, `/json/ovation_aurora_latest.json`, `/json/solar-cycle/observed-solar-cycle-indices.json`, `/products/alerts.json`.
- Aurora ovation forecast, Kp index now & 3-day, X-ray flux, solar wind from DSCOVR.
- No auth, no key, fair-use. 🟢 P1.

### NWS (US National Weather Service) — `api.weather.gov`
- Endpoints: `/points/{lat},{lon}` → forecast grid; `/gridpoints/{office}/{x},{y}/forecast`.
- Includes cloud cover, dew point, visibility, transparency proxies.
- Free, no auth, requires User-Agent header. **US only.** 🟢 P1 US.

### Open-Meteo — `api.open-meteo.com/v1/forecast`
- Free, no auth, global. Hourly cloud cover, transparency-relevant params, geomagnetic Kp, dew point.
- 🟢 P1 global default.

### Met.no — `api.met.no/weatherapi/locationforecast/2.0/compact`
- Free, no auth, requires User-Agent identification. Norwegian Meteorological Institute, global coverage.
- 🟢 P1 backup.

### ClearOutside (First Light Optics) — `clearoutside.com`
- **No official API. ToS forbids scraping.** Deeplink only.
- 🚨 do not scrape; legal risk.

### Clear Dark Sky (Allan Rahill, Attilla Danko) — `cleardarksky.com`
- Image-only chart. Hot-link OK per long-standing convention but no JSON.
- 🔵 deeplink + image embed (per existing community practice).

### Astrospheric — `astrospheric.com`
- Has a paid API. Free tier limited. 🚨 paid if used.

### Globe at Night — `globeatnight.org`
- Citizen-science magnitude-limit reporting. Submission web form; data download CSV; **API in development per their site**.
- 🟢 P2 — perfect citizen-science fit for Astra Vault's ATP economy.

### Light Pollution Map (David Lorenz) / NASA Black Marble / VIIRS DNB
- LP tile servers: `tiles.lightpollutionmap.info`. Free, fair-use. 🟢 P2 overlay.

### World Atlas of Artificial Night Sky Brightness (Falchi et al. 2016)
- Static dataset; no API. Distribute as offline tile pack. 🟡 P2.

---

## Ephemeris / Compute Libraries

### Skyfield (Brandon Rhodes) — `rhodesmill.org/skyfield`
- Pure Python; uses JPL DE440 ephemeris kernel.
- Drop-in for Horizons-style queries entirely client- or server-side without rate-limit risk.
- 🟢 backend dependency.

### Astropy — `astropy.org`
- Coord transforms, time scales, FITS, WCS, units, SkyCoord, table joins.
- 🟢 backend dependency.

### PyEphem — `rhodesmill.org/pyephem`
- Legacy; superseded by Skyfield. 🔵 skip new use.

### VSOP87 / DE440 / DE441 ephemerides
- DE440 is the current high-precision JPL planetary ephemeris (released 2021), covering 1550–2650. DE441 covers 13201 BCE to 17191 CE for archaeoastronomy. Available as SPK kernels via NAIF.
- 🟢 dep.

### NAIF SPICE — `naif.jpl.nasa.gov`
- Toolkit + kernels for every NASA mission's geometry. SpiceyPy wrapper.
- Use: "Where was Voyager 1 when it photographed the Pale Blue Dot?" — pro-tier feature. 🟢 P3.

### Stellarium-data
- Stellarium publishes its catalogs (HIP/Tycho/Gaia subsets) under GPL.
- 🟢 reference — but for a commercial app, source from Gaia/Hipparcos directly (public domain).

---

## Implementation Order Recommendation

### Phase 1 — Ship Now (Weeks 1–4)
*No auth, REST/JSON, immediate UX wins. All free.*

1. NASA APOD (already in v4)
2. JPL Horizons (already in v4 plan)
3. SkyView Virtual Observatory (already in plan)
4. USNO API (already in plan)
5. **Add: Celestrak GP API** — satellite passes for ISS already, expand to Hubble, Starlink, Tiangong, JWST L2 station-keeping
6. **Add: NASA EONET v3** — Earth natural events on the Earth panel
7. **Add: NASA Image and Video Library** — hero imagery per object, no auth, no rate limit
8. **Add: NOAA SWPC Kp + aurora ovation** — replaces ad-hoc DONKI-only aurora logic
9. **Add: Open-Meteo + NWS** — observing-conditions calculator (cloud cover, transparency proxy)
10. **Add: Launch Library 2 free tier** — universal launch calendar
11. **Add: JPL CAD + SBDB** — "Near Earth Watch" module

### Phase 2 — Depth (Weeks 5–10)
*Anonymous TAP/VO queries, citizen-science write paths, multi-mission archives.*

12. NASA Exoplanet Archive TAP — Exoplanet Explorer module
13. MAST Mashup API — "Telescope History" per object (HST, JWST, TESS, Kepler)
14. SIMBAD + VizieR via CDS — Deep Data panel
15. ESA Gaia DR3 TAP — high-precision astrometric enrichment
16. Pan-STARRS DR2, DECaLS DR10 image cutouts — better galaxy imagery than DSS
17. SDSS SkyServer DR18 — galaxy spectra (when present)
18. NASA ADS API — paper-count widget per object
19. **HiPS tiles via CDS/ESASky** — adopt HiPS as canonical sky-pan rendering layer
20. NOAA SWPC ovation aurora map — aurora oval overlay on Earth panel

### Phase 3 — Differentiators (Weeks 11–16)
*Multi-messenger, citizen-science write paths, advanced features.*

21. NASA GCN Kafka — multi-messenger event notifications
22. LIGO/Virgo GraceDB — GW event localizations
23. ANTARES or Fink LSST/ZTF broker — transient alerts
24. AAVSO VSX + submission — variable-star citizen science with ATP rewards
25. IAU MPC — asteroid observation pipeline (target high-quality observers)
26. Globe at Night — magnitude-limit citizen science
27. JAXA DARTS — Hinode solar imagery (unique content)
28. NASA Trek WMTS — planetary surface explorer (Moon, Mars, Europa, Titan)
29. Privateer Wayfinder — orbital debris shell visualization
30. SatNOGS — amateur ground-station data + audio waterfalls

### Phase 4 — Pro Tier (Months 5–6)
*Heavy/specialist; gated behind subscription or "Astronomer" tier.*

31. NAIF SPICE — mission geometry replays ("ride along with Cassini")
32. Space-Track.org — high-precision conjunction analysis
33. Copernicus Sentinel — Earth-obs imagery for any user location
34. ESDC Mars Express / Rosetta / Solar Orbiter — niche planetary content
35. DASCH — 100-year light curves for variable stars
36. HEASARC Xamin — X-ray history per object
37. ESA Sky HiPS layer mixer — pro-tier multi-survey blending
38. Skyfield + SPICE custom ephemeris jobs — "fly Voyager" feature
39. Vera Rubin LSST broker filtering pipeline — once full operations
40. NASA OSDR — astrobiology niche module (curated only)

---

## What We Will NOT Build (Integrate Instead)

These exist and are better than what we'd build. Hand off via deep links / iframe embeds / API consumption — do not reinvent.

- **Real-time launch schedules** → Launch Library 2 covers every agency. Don't scrape SpaceX/RL/BO ourselves.
- **TLE distribution** → Celestrak is the canonical source. Don't run our own.
- **High-precision ephemeris** → JPL Horizons + DE440 + Skyfield. Don't roll our own VSOP/orbit propagator beyond client-side SGP4 for satellites.
- **Multi-wavelength sky imagery** → NASA SkyView. Don't reprocess survey FITS.
- **Sub-arcsec stellar astrometry** → ESA Gaia DR3/DR4. Don't measure proper motions.
- **Exoplanet catalog** → NASA Exoplanet Archive. Don't curate exoplanet metadata.
- **Asteroid catalog** → IAU MPC. Don't maintain a parallel naming authority.
- **Object name resolution** → SIMBAD. Don't curate alias tables.
- **Bibliographic citations** → NASA ADS. Don't index astronomy papers.
- **Telescope archives** → MAST (HST, JWST, TESS, Kepler), IRSA (Spitzer, WISE), HEASARC (X-ray), ESDC (XMM, Solar Orbiter). Stack them, don't re-host.
- **Aurora forecast** → NOAA SWPC ovation product. Don't model the magnetosphere.
- **Weather** → Open-Meteo + NWS + Met.no. Don't run our own forecasts.
- **Light pollution map** → Light Pollution Map + Falchi. Don't model artificial sky brightness.
- **Cloud cover charts** → Clear Dark Sky image hotlink + Open-Meteo. Don't redraw.
- **Variable-star database** → AAVSO VSX. Don't maintain our own.
- **Sky-pan tile rendering** → HiPS via CDS / ESASky. Adopt the standard, don't invent a tile scheme.
- **Solar imagery** → JAXA Hinode + NASA SDO via Helioviewer.org API. Don't host TBs of solar movies.
- **Multimessenger alert distribution** → NASA GCN. Don't aggregate ourselves.
- **LSST transient classification** → ANTARES, Fink, ALeRCE, Lasair. Pick one broker; don't classify alerts ourselves.
- **3D solar-system viewer** → NASA Eyes (deeplink) or NASA's open-source Solar System Treks WebGL embed. Don't rebuild Eyes.
- **NEO impact-risk modeling** → JPL Sentry. Don't run Monte Carlo orbital integrations.

---

## Things That Have Shut Down, Been Replaced, or Are Dying — Don't Build Against Them

- **NASA InSight Weather endpoint** — mission ended Dec 2022; data is frozen historical.
- **NASA TLE API** — retired ~2022; use Celestrak.
- **NASA GeneLab** — rebranded to **OSDR** in 2023; old URLs may redirect but new dev should target OSDR.
- **Twitter/X API v1.1** — retired Mar 2023; v2 free tier removed Feb 2023; effectively paid-only. **Do not build.** 🚨
- **Instagram Basic Display API** — deprecating; restricted access. Don't build social feeds against it.
- **SciHub (ESA)** — replaced by Copernicus Data Space Ecosystem (CDSE) in 2023.
- **r-SpaceX `api.spacexdata.com`** — community-maintained, partially stale; verify endpoint health before relying. LL2 is the safer choice. 🚨
- **NEOWISE spacecraft** — re-entered Earth's atmosphere Nov 2024; archive remains queryable but no new data.
- **Kepler / K2** — mission ended 2018; data in MAST.
- **Spitzer** — mission ended Jan 2020; data in IRSA / Spitzer Heritage Archive.
- **Cassini** — mission ended Sep 2017; data in PDS.
- **Dawn** — mission ended Nov 2018; data in PDS.
- **WISE Coadder** — folded into IRSA.
- **VOEvent network (`voevent.net`)** — superseded by GCN Kafka. Some endpoints still alive but moribund.
- **Google Sky / Sky in Google Earth** — read-only legacy.
- **Heavens-Above public API** — never had one; HTML deeplink only.
- **JPL Horizons CGI (`/horizons.cgi`)** — still works but JPL recommends the JSON API (`/api/horizons.api`) for programmatic use.

---

## Risk / Compliance Flags

- 🚨 **ToS for redistribution.** Several APIs (Space-Track, AAVSO non-public data, Planet Labs imagery, paid X/Twitter) restrict redistribution. Build with caching-for-display, not caching-for-redistribution, and store originating timestamp + license string per record.
- 🚨 **Rate-limit etiquette.** Celestrak, JPL, NOAA SWPC, USNO, MAST, IRSA, CDS — all are "be reasonable" rather than hard quotas. **Establish a 24-hour edge cache for any non-event data** (object metadata, ephemerides ≥ 1 hour from now, imagery cutouts). Hit live only for time-critical data.
- 🚨 **Citizen-science submission integrity.** Submitting to AAVSO, MPC, Globe at Night attaches our app's reputation. Need observer-quality verification before forwarding upstream. Pair with Astra Vault's attention-verified identity.
- 🚨 **PII / location.** Observing-conditions APIs need lat/lon. Store coarsened location (10km grid) only; never persist precise GPS server-side without opt-in.
- 🚨 **Copernicus and EU agencies** require attribution in UI per CC-BY licenses. Bake into the UI footer template.
- 🚨 **NASA imagery is generally free** but **third-party images on api.nasa.gov endpoints (notably APOD)** are NOT always public domain — APOD images often retain photographer copyright. Display credit string verbatim and surface license in UI.
- 🚨 **Vera Rubin / LSST data rights** — proprietary periods apply for some products until 2027–2030 depending on category. Alerts are public; images aren't all. Verify before redistribution.
- 🚨 **Twitter/X cost** — avoid. Use Bluesky/Mastodon RSS for any social feed needs.
- 🚨 **Scraping is risk.** ClearOutside, SpaceX, Heavens-Above, Astrospheric (free tier) — these have anti-scrape ToS. Deeplink only or use a paid official channel.

---

## Open Questions

1. **JWST API mirror (`jwstapi.com`)** is third-party, not NASA. Should we depend on it or query MAST directly? MAST is canonical but harder to query. Recommendation: build directly against MAST Mashup, keep jwstapi.com as a fallback / cross-validation source.
2. **LL2 free tier (15 req/hr)** is too low for a launch-day push experience with thousands of users. Budget approval needed for Pro ($5–25/mo) or replicate the data into our own cache. Recommend Pro from launch.
3. **Space-Track approval process** is human-mediated and 1–14 days. Should we start the application now even if integration is Phase 2?
4. **HiPS adoption** — do we standardize on HiPS as our sky tile format from day one (additional engineering up front) or build a custom tile scheme first and migrate later? Recommend HiPS from the start; it's a standard, the math is documented, the libraries exist (`hipsclient`, `aladin-lite`).
5. **MPC observatory code** — Astra Vault is a software app, not an observatory. Submitting observations on behalf of users may require either (a) each user gets their own MPC code (slow, requires precovery proof) or (b) we operate as a "service" routing observations from coded users. Need to consult MPC.
6. **AAVSO partnership** — same question, scaled. AAVSO is friendlier to consumer apps; reach out to their tech team directly.
7. **LSST/Rubin broker choice** — ANTARES (NOIRLab, US, generalist), ALeRCE (Chile, ML-classified), Fink (France, ML + multimessenger), Lasair (UK, query-focused). Need product to pick one based on the "transient feed" UX we want.
8. **Privateer Wayfinder** has shifted from open dataset to subscription tiers in late 2025. Verify current access model before committing to a Phase 2 integration.
9. **ESA Gaia DR4 release date** is officially "no earlier than end-2026." Build for DR3 now; design the schema to accept DR4 column additions without breaking changes.
10. **Mobile data costs.** Image cutouts (SkyView, DECaLS, MAST S3) are bandwidth-heavy. Need a "data-saver mode" that defers full-res imagery to Wi-Fi-only; pre-process server-side to mobile-appropriate JPGs (≤200 KB).
11. **Aurora real-time strategy.** NOAA OVATION gives a hemisphere oval; we want a per-user "aurora visible tonight?" boolean. Need to combine OVATION + Kp forecast + user latitude + cloud cover + magnetic-latitude lookup. This is a fusion engine, not a single API call.
12. **CNSA / Chinese assets.** Tianwen-1 imagery exists in restricted portals; some has been released to the public via state media. Curate manually for now; revisit if a Chinese SDP equivalent emerges by 2027.

---

## Appendix: Cost Summary for Production-Scale Deployment

| Service | Free tier suffices? | Paid tier needed at scale | Approx $ /mo |
|---|---|---|---|
| NASA APIs (api.nasa.gov, JPL, MAST, IRSA, GIBS, Trek, ADS, GCN, SkyView, USNO, OSDR) | Yes | No | $0 |
| ESA APIs (Gaia, ESDC, ESA Sky, HiPS, CDSE) | Yes (CDSE quota request if heavy) | No | $0 |
| CDS Strasbourg (SIMBAD, VizieR, Aladin, HiPS) | Yes | No | $0 |
| Celestrak | Yes | No | $0 |
| Space-Track | Yes | No (free with approval) | $0 |
| Launch Library 2 | No (15 req/hr too low) | Pro tier | $5–$25 |
| NOAA SWPC + NWS + Open-Meteo + Met.no | Yes | No | $0 |
| Light Pollution Map tiles | Yes | No | $0 |
| LSST/ZTF brokers (ANTARES/Fink/Lasair/ALeRCE) | Yes | No | $0 |
| AAVSO | Yes (partnership free) | No | $0 |
| IAU MPC | Yes | No | $0 |
| LIGO GraceDB / NASA GCN | Yes | No | $0 |
| Privateer Wayfinder | Verify | Possibly | TBD |
| JAXA / ISRO / CSA / CNSA | Yes (where accessible) | No | $0 |
| SDSS / Pan-STARRS / DECaLS / 2MASS / WISE | Yes (via IRSA / MAST / hosted sites) | No | $0 |
| Privateer / Planet Labs Edu / SatNOGS | Verify each | Edu/Free | $0 |
| (Avoid: Twitter/X, Planet Labs commercial, Spire, Capella, LeoLabs, Astrospheric) | n/a | — | $0 by avoidance |

**Estimated production API spend: $5–$50 / month** for the recommended Phase 1–3 stack. The expensive cost is engineering integration time, not API fees.

---

## Closing Note from R&D

The astronomical-data ecosystem is one of the most open, well-documented, and consumer-friendly scientific datasets on Earth. Every space agency on the planet publishes raw mission data — usually for free, usually anonymously, often with TAP/VO standards that interoperate. The work for Astra Vault is **not** acquiring data. It is:

1. **Aggregation** — pull from 40+ sources into one schema.
2. **Cross-matching** — make a star query Gaia + SIMBAD + MAST + Exoplanet Archive simultaneously.
3. **Caching** — be a good citizen to free public services with edge caching.
4. **UX** — present pro-grade data as one-tap consumer experiences.
5. **Attribution & licensing hygiene** — credit upstream sources visibly.
6. **Citizen-science write paths** — turn passive consumers into observers contributing back to MPC, AAVSO, Globe at Night.

If we execute these six layers, Astra Vault genuinely becomes the one place to access everything astronomical — not because we built it all, but because we federated and ennobled what humanity has already built.

---

RESEARCH COMPLETE — integration-opportunities.md written. Top-priority integrations: JPL Horizons, NASA SkyView, NASA Exoplanet Archive TAP, MAST Mashup API, Celestrak GP, ESA Gaia DR3 TAP, SIMBAD + VizieR (CDS), NOAA SWPC space weather, Launch Library 2 (TheSpaceDevs), IAU Minor Planet Center.
