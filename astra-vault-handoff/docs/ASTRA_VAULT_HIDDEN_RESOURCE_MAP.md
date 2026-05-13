# ASTRA VAULT — HIDDEN RESOURCE MAP & UNIQUE EXPERIENCE ENGINEERING
## R&D Team Deep Dive — March 21, 2026
## Classification: INTERNAL — Development Strategy

---

## EXECUTIVE SUMMARY

After deep research into NASA's technical infrastructure, JPL's computational systems, the Space Telescope Science Institute archives, and the broader astronomical virtual observatory network, we've identified **14 free resources** that almost nobody in the consumer app space is using — because they were built for professional astronomers and are technically difficult to interface with. But they're perfectly suited for programmatic access, which is exactly our advantage.

These resources enable **7 unique experiences** that no competing astronomy app offers. Several of these would be world-firsts in a consumer application.

---

## THE HIDDEN RESOURCES

### TIER 1: Immediately Integrable (REST/JSON, no auth or free API key)

**1. JPL Horizons System** — `ssd-api.jpl.nasa.gov/doc/horizons.html`
- What it is: NASA/JPL's definitive solar system ephemeris engine covering 1.47 MILLION asteroids, 4,043 comets, 424 moons, all planets, the Sun, 239 spacecraft, and Lagrange points
- What nobody knows: It has a full REST API that returns JSON. You can query the EXACT position of ANY solar system body from ANY location on Earth at ANY time — past or future
- What we build: **"Where Is It Right Now?"** — Real-time computed positions for every planet, every named asteroid, every active comet, rendered on our sky scanner at their actual RA/Dec coordinates. No other consumer app computes positions live from JPL data. They all use pre-cached approximate positions
- API example: `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='499'&EPHEM_TYPE=OBSERVER&CENTER='coord@399'&COORD_TYPE=GEODETIC&SITE_COORD='long,lat,0'&START_TIME='2026-03-21'&STOP_TIME='2026-03-22'&STEP_SIZE='1h'&QUANTITIES='1,9'`
- ATP integration: Hash for each object the user queries (deep attention — they're choosing what to look up)
- Unique experience: "Track Comet C/2026 A1 in real time" — show its arc across the sky night by night

**2. NASA SkyView Virtual Observatory** — `skyview.gsfc.nasa.gov`
- What it is: NASA's "Internet telescope" — generates images of ANY point in the sky from over 100 surveys spanning radio to gamma-ray wavelengths
- What nobody knows: It has a CGI API that returns JPEG/GIF images on the fly. You give it coordinates, it gives you a real telescope image of that patch of sky from the Digitized Sky Survey, 2MASS infrared, ROSAT X-ray, Fermi gamma-ray, WISE infrared, and dozens more
- What we build: **"See Through Telescopes"** — When a user taps any object in our scanner, we pull the REAL image of that region from SkyView. Not an illustration. Not an artist's conception. The actual survey photograph. Then we let them switch wavelengths — see Eta Carinae in visible light, then infrared, then X-ray. This is what professional astronomers do. No consumer app does it
- API example: `https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl?Position=161.265,-59.685&Survey=DSS&Return=JPEG&Pixels=300&Size=0.5`
- ATP integration: Each wavelength switch is a deep-focus hash. Comparing images across wavelengths is genuine scientific analysis
- Unique experience: "X-Ray Vision" mode — toggle between radio, infrared, visible, UV, X-ray, and gamma-ray views of any object

**3. NASA Exoplanet Archive TAP Service** — `exoplanetarchive.ipac.caltech.edu`
- What it is: The definitive database of every confirmed exoplanet (5,700+) with orbital parameters, discovery methods, host star data, and habitability metrics
- What nobody knows: It has a TAP (Table Access Protocol) API that returns CSV/JSON with SQL-like queries. You can ask "give me every Earth-sized planet in the habitable zone discovered by TESS" and get structured data back
- What we build: **"Exoplanet Explorer"** — A dedicated module where users can browse real exoplanet data, filter by habitability, see which host stars are in our catalog, and "visit" the TRAPPIST-1 system with real orbital diagrams computed from archive data
- API example: `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=SELECT+pl_name,hostname,pl_rade,pl_bmasse,pl_orbper,pl_eqt+FROM+ps+WHERE+pl_rade+<+2+AND+pl_eqt+BETWEEN+200+AND+320&format=json`
- ATP integration: Each exoplanet explored generates a hash. Filtering and comparing planets is evaluative cognition (Hick's Law territory)
- Unique experience: "Could life exist there?" — Real NASA data on surface temperature, radius, mass, orbital period for every known exoplanet

**4. JWST API** — `jwstapi.com`
- What it is: A free, well-structured REST API wrapping all James Webb Space Telescope public observations with image URLs, program info, and instrument data
- What nobody knows: It's been available since 2022 but almost no consumer apps use it because they don't know it exists. It returns direct URLs to JWST images
- What we build: **"Webb Gallery"** — A curated feed of JWST images tied to objects in our catalog. When you collect the Crab Nebula, you unlock the JWST observation of it. Actual telescope data as collectible content
- ATP integration: Viewing JWST images with reading time generates attention hashes. This is the deepest educational content in the app
- Unique experience: Seeing objects through the most powerful telescope ever built, tied to the objects you've collected with your own eyes

**5. NASA APOD API** — `api.nasa.gov/planetary/apod` (already integrated in v4)

**6. Open Notify / Where the ISS At** — `api.wheretheiss.at` (already integrated in v4)

**7. Sunrise-Sunset API** — `api.sunrise-sunset.org/json`
- Free, no auth. Returns sunrise, sunset, and all twilight times for any lat/long
- Powers our observing conditions calculator and the nighttime ATP multiplier

**8. US Naval Observatory API** — `aa.usno.navy.mil/data/api`
- What it is: The US Navy's official astronomical data service
- What nobody knows: It has a REST API returning JSON with moon phases, celestial navigation data, sunrise/sunset, Earth orientation parameters, day length, and selected star transit times — all computed by the same algorithms used for actual naval navigation
- What we build: Moon phase predictions, "optimal observing windows" computed per user location, and historical sky recreation ("what did the sky look like on your birthday?")
- API example: `https://aa.usno.navy.mil/api/moon/phases/year?year=2026`
- Unique experience: "Birthday Sky" — shows exactly what was visible the night you were born

### TIER 2: Moderately Technical (needs data transformation but free)

**9. MAST Portal (Mikulski Archive for Space Telescopes)** — `archive.stsci.edu`
- What it is: The central archive for Hubble, JWST, TESS, Kepler, and 20+ other missions. Over 500 million observations
- What nobody knows: It has a JSON-based web API (the "Mashup API") that can search across all missions and return observation metadata, preview images, and data product URLs. You can query "show me everything Hubble has ever pointed at within 1 arcminute of Eta Carinae" and get results
- What we build: **"Telescope History"** — For each object in our catalog, show what space telescopes have observed it, when, with which instruments. Users can browse actual Hubble observation logs. This is unprecedented in a consumer app
- ATP integration: Deep-focus hashes for research-quality browsing. This is the same data professional astronomers use
- Unique experience: "Hubble looked at your star 47 times since 1993" — real mission history for collected objects

**10. SIMBAD Astronomical Database** — `simbad.u-strasbg.fr/simbad/sim-script`
- What it is: The reference database for astronomical objects outside the solar system. Maintained by the Centre de Données astronomiques de Strasbourg. Contains identifications, bibliography, and basic measurements for 17+ million objects
- What nobody knows: It has a script-based query interface and a TAP endpoint that returns VOTable/JSON. You can resolve any star name to coordinates and get all known identifiers, spectral type, radial velocity, proper motion, and bibliography
- What we build: **"Deep Data"** panel for every object — pulling SIMBAD's full dataset to show everything humanity knows about that star, including how many scientific papers have been published about it
- Unique experience: "42,871 scientists have studied this star" — real bibliographic counts from SIMBAD

**11. VizieR Catalog Service** — `vizier.u-strasbg.fr`
- What it is: The world's largest collection of astronomical catalogs — 23,000+ catalogs, billions of rows. Every star survey, galaxy survey, variable star catalog, and spectroscopic database
- What we build: Cross-match our catalog objects against specialized catalogs to pull unique data: is this star a known binary? Variable? Does it have a debris disk? Known exoplanets? This enriches every object card with discoveries the user didn't expect

### TIER 3: Advanced Integration (powerful but requires data pipeline)

**12. JPL Small-Body Database** — `ssd-api.jpl.nasa.gov/doc/sbdb.html`
- REST API returning orbital elements, physical parameters, and close-approach data for every known asteroid and comet
- What we build: "Near Earth Watch" — show which asteroids are making close approaches this week, with real JPL data. Planetary defense in your pocket

**13. JPL CNEOS (Center for Near Earth Object Studies) Close Approach API** — `ssd-api.jpl.nasa.gov/doc/cad.html`
- Returns upcoming close approaches of asteroids to Earth with distance, velocity, and size estimates
- What we build: "Asteroid Alerts" — push notifications when a notable asteroid is making a close pass. Users observe and log sightings for citizen science ATP

**14. NASA DONKI (Space Weather Database)** — `api.nasa.gov/DONKI`
- Returns coronal mass ejections, geomagnetic storms, solar flares, and solar energetic particle events
- What we build: "Aurora Forecast" — real NASA space weather data predicting geomagnetic storms. Alert users when aurora might be visible at their latitude. This ties to the aurora observation mission in our citizen science module

---

## 7 UNIQUE EXPERIENCES (No Competing App Has These)

### Experience 1: "Multi-Spectrum Vision"
When you tap any object in the scanner, toggle between wavelengths using real SkyView data: visible → infrared → X-ray → radio → gamma-ray. See how the Crab Nebula looks completely different in X-rays vs visible light. This is genuine scientific analysis that professional astronomers do — delivered in one tap.

*Why it's unique:* Stellarium, SkySafari, Star Walk — none of them pull real survey images. They show illustrations or photographs. We show the actual data.

### Experience 2: "JPL Precision Tracking"
Real planet, comet, and asteroid positions computed by the same JPL Horizons system that navigates NASA spacecraft. Not approximate. Not pre-cached. Computed for your location, right now, to arcsecond precision. Watch Comet C/2026 A1 move night by night against the fixed stars.

*Why it's unique:* Other apps use simplified orbital models or static catalogs. We use the same engine that guided Voyager, Cassini, and New Horizons.

### Experience 3: "Birthday Sky"
Enter any date and location. The USNO API computes what the sky looked like that night — moon phase, visible planets, constellation positions. See the stars as they appeared the night you were born. Shareable as a personalized star map.

*Why it's unique:* Star map services charge $30-$100 for printed maps. We generate them dynamically from Navy data. Free. Shareable. Attention-verified.

### Experience 4: "Exoplanet Explorer"
Browse NASA's complete catalog of 5,700+ confirmed exoplanets. Filter by habitability, size, temperature. See which host stars are visible tonight from your location. "TRAPPIST-1e is 40.7 light-years away, 0.92 Earth radii, surface temperature 246K — and its host star is in your collection."

*Why it's unique:* No consumer app ties real exoplanet archive data to a personal collection and observing experience. The data exists in academic tools. We make it human.

### Experience 5: "Telescope History"
For every object you collect, see its history through humanity's greatest instruments. "The Orion Nebula has been observed by Hubble 312 times, by JWST 8 times, by Chandra X-ray 24 times." Browse the observation log. See when each mission pointed at your star. Unlock JWST images as rewards for deep engagement.

*Why it's unique:* MAST data is used by researchers. Nobody has ever surfaced it in a consumer app. We're the bridge between the archive and the public.

### Experience 6: "Near Earth Watch"
Real-time asteroid close-approach tracking from JPL CNEOS. "Asteroid 2026 FD3 will pass 2.1 lunar distances from Earth on April 15 at 14,400 km/h." Users can track approaches, log observations, and contribute to citizen science planetary defense — earning ATP for genuine attention to near-Earth objects.

*Why it's unique:* Planetary defense data is publicly available but buried in technical interfaces. We surface it as a live threat map with real stakes.

### Experience 7: "Aurora Alert"
NASA DONKI space weather data processed into aurora probability forecasts for the user's latitude. When a coronal mass ejection hits Earth's magnetosphere, users get a push notification: "Aurora possible tonight at your latitude. Go outside." Observation + photo submission earns significant ATP.

*Why it's unique:* Aurora forecast apps exist but none are connected to an attention economy. Ours pays you to look up when the sky puts on a show.

---

## ATP INTEGRATION ACROSS ALL RESOURCES

| Resource | Trigger | Quality Tier | ATP |
|----------|---------|-------------|-----|
| JPL Horizons query | User queries specific body | Deep | 10/query |
| SkyView wavelength toggle | Each wavelength examined | Deep | 5/switch |
| Exoplanet Archive browse | Each planet inspected | Active | 3/planet |
| JWST image viewing | Reading time on image | Deep | 15/image |
| Birthday Sky generation | Date input + viewing | Active | 10/map |
| MAST observation log browse | Time spent reading logs | Deep | 5/min |
| Near Earth Watch check-in | Daily asteroid review | Active | 5/day |
| Aurora Alert response | Going outside when notified | Deep | 50/observation |
| Multi-spectrum comparison | Completing all wavelengths | Deep | 25/object |

**Every resource generates attention hashes. Every experience earns ATP. The richer the data, the deeper the engagement, the higher the quality tier.**

---

## IMPLEMENTATION PRIORITY

**Phase 1 (Ship Now):** JPL Horizons planet positions, SkyView image integration, USNO moon phases, Sunrise-Sunset twilight times. All REST/JSON, all free, all no-auth.

**Phase 2 (30 days):** Exoplanet Archive TAP queries, JWST API gallery, CNEOS close approach feed, DONKI space weather.

**Phase 3 (60 days):** MAST cross-mission observation history, SIMBAD deep data panels, VizieR catalog cross-matching, Birthday Sky generator.

**Phase 4 (90 days):** Full multi-spectrum SkyView experience with radio→gamma toggle, real-time comet tracking with JPL Horizons, aurora probability engine from DONKI+geomagnetic models.

---

## THE COMPETITIVE MOAT

After full integration, Astra Vault would be the ONLY consumer astronomy app that:

1. Pulls real-time positions from JPL's spacecraft navigation engine
2. Shows real telescope survey images from NASA's SkyView
3. Displays actual JWST observations tied to collected objects
4. Queries the NASA Exoplanet Archive for habitable worlds
5. Tracks near-Earth asteroids from the planetary defense system
6. Forecasts aurora from NASA space weather data
7. Shows space telescope observation histories from MAST
8. Rewards all of the above with attention-verified cryptocurrency

Stellarium, SkySafari, Star Walk, SkyView (the app), Night Sky — they all show you what's in the sky. **We show you what humanity knows about what's in the sky, and we pay you to learn it.**

---

*Astra Vault R&D Team — March 21, 2026*
*"The data is already free. The experience is what we build."*
