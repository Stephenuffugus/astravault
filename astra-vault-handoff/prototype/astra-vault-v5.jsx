import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/*
 ASTRA VAULT v5.0 — EDUCATION + SHARED SKY
 ═══════════════════════════════════════════
 
 NEW: ASTRONOMY ACADEMY
   6 learning paths with 24 lessons total
   Interactive quizzes after each lesson
   Progressive unlock system
   ATP rewards per lesson/quiz completion
   Tracks mastery % per topic
   
 NEW: SHARED SKY (Community Without Interaction)
   Design Philosophy: Death Stranding's Social Strand System
   — Users contribute to a shared world
   — They see evidence of others' contributions  
   — But they NEVER directly interact
   
   Features:
   • "Observers Tonight" — live counter of active users
   • Global Discovery Timeline — anonymous feed of what's being collected NOW
   • Collective Missions — community-wide goals everyone contributes to
   • Shared Light Pollution Map — aggregate Bortle data from all users
   • Community Milestones — "We've logged 50,000 hours together"
   • Star Popularity Index — which objects are most collected this week
   • Anonymous Observation Heatmap — where people are observing (city-level only)
   
   What this does NOT have:
   ✗ No usernames visible to others
   ✗ No messaging, chat, or DMs
   ✗ No comments or replies
   ✗ No profiles viewable by others
   ✗ No friend lists or follows
   ✗ No leaderboards with identifiable users
*/

// ═══ ASTRONOMICAL ENGINE ═══
const astro = {
  moonPhase(d) {
    const jd = d.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525;
    const D = (297.85 + 445267.11 * T) % 360;
    const M = (357.53 + 35999.05 * T) % 360;
    const Mp = (134.96 + 477198.87 * T) % 360;
    const i = 180 - D - 6.289 * Math.sin(Mp * Math.PI / 180) + 2.1 * Math.sin(M * Math.PI / 180);
    return { illumination: (1 + Math.cos(i * Math.PI / 180)) / 2, angle: ((i % 360) + 360) % 360 };
  },
  moonName(il) {
    if (il < 0.03) return "New Moon"; if (il < 0.22) return "Waxing Crescent";
    if (il < 0.28) return "First Quarter"; if (il < 0.47) return "Waxing Gibbous";
    if (il < 0.53) return "Full Moon"; if (il < 0.72) return "Waning Gibbous";
    if (il < 0.78) return "Last Quarter"; if (il < 0.97) return "Waning Crescent"; return "New Moon";
  },
  obsScore(moonIl) { return Math.max(0, Math.round(100 - moonIl * 40 - 10)); },
};

// ═══ CATALOG ═══
const CATALOG = [
  {id:"sirius",name:"Sirius",cat:"star",con:"Canis Major",mag:-1.46,ra:101,dec:-17,color:"#A8C8FF",rarity:"common",dist:8.6,desc:"Brightest star. Binary at 25x solar luminosity."},
  {id:"betelgeuse",name:"Betelgeuse",cat:"star",con:"Orion",mag:0.42,ra:89,dec:7,color:"#FF6B4A",rarity:"rare",dist:700,desc:"Dying red supergiant. Will go supernova."},
  {id:"vega",name:"Vega",cat:"star",con:"Lyra",mag:0.03,ra:279,dec:39,color:"#C8DBFF",rarity:"uncommon",dist:25,desc:"Former North Star. Photometry standard."},
  {id:"rigel",name:"Rigel",cat:"star",con:"Orion",mag:0.13,ra:79,dec:-8,color:"#B4D4FF",rarity:"rare",dist:860,desc:"Blue supergiant at 120,000x solar luminosity."},
  {id:"arcturus",name:"Arcturus",cat:"star",con:"Bo\u00f6tes",mag:-0.05,ra:214,dec:19,color:"#FFB86B",rarity:"uncommon",dist:36.7,desc:"Brightest northern star. Ancient thick-disk."},
  {id:"polaris",name:"Polaris",cat:"star",con:"Ursa Minor",mag:1.98,ra:38,dec:89,color:"#FFF4D4",rarity:"epic",dist:433,desc:"North Star. Cepheid variable triple system."},
  {id:"antares",name:"Antares",cat:"star",con:"Scorpius",mag:1.06,ra:247,dec:-26,color:"#FF4444",rarity:"rare",dist:550,desc:"Heart of the Scorpion. Engulfs Mars orbit."},
  {id:"deneb",name:"Deneb",cat:"star",con:"Cygnus",mag:1.25,ra:310,dec:45,color:"#E8F0FF",rarity:"epic",dist:2615,desc:"196,000x solar luminosity from 2,600 ly."},
  {id:"aldebaran",name:"Aldebaran",cat:"star",con:"Taurus",mag:0.86,ra:69,dec:17,color:"#FF9E5E",rarity:"uncommon",dist:65,desc:"Eye of Taurus. 44x Sun diameter."},
  {id:"spica",name:"Spica",cat:"star",con:"Virgo",mag:0.97,ra:201,dec:-11,color:"#B8D8FF",rarity:"uncommon",dist:250,desc:"Egg-shaped binary. Stars distort each other."},
  {id:"capella",name:"Capella",cat:"star",con:"Auriga",mag:0.08,ra:79,dec:46,color:"#FFE4A8",rarity:"uncommon",dist:42.9,desc:"Quadruple system. Two giants + two dwarfs."},
  {id:"procyon",name:"Procyon",cat:"star",con:"Canis Minor",mag:0.34,ra:115,dec:5,color:"#FFF4D0",rarity:"common",dist:11.5,desc:"Binary with white dwarf. Sun's neighbor."},
  {id:"canopus",name:"Canopus",cat:"star",con:"Carina",mag:-0.74,ra:96,dec:-53,color:"#FFF8E0",rarity:"rare",dist:310,desc:"2nd brightest. Spacecraft navigation beacon."},
  {id:"eta_car",name:"Eta Carinae",cat:"star",con:"Carina",mag:4.3,ra:161,dec:-60,color:"#FFD700",rarity:"legendary",dist:7500,desc:"5M solar luminosities. Hypernova candidate."},
  {id:"tabby",name:"Tabby\u2019s Star",cat:"star",con:"Cygnus",mag:11.7,ra:302,dec:44,color:"#E8E0D8",rarity:"legendary",dist:1470,desc:"22% dimming. Alien megastructure?"},
  {id:"trappist",name:"TRAPPIST-1",cat:"star",con:"Aquarius",mag:18.8,ra:347,dec:-5,color:"#FF8888",rarity:"legendary",dist:40.7,desc:"7 Earth-sized planets. 3 habitable."},
  {id:"orion_neb",name:"Orion Nebula",cat:"nebula",con:"Orion",mag:4.0,ra:84,dec:-5,color:"#FF88CC",rarity:"rare",dist:1344,desc:"M42. Closest massive stellar nursery."},
  {id:"crab_neb",name:"Crab Nebula",cat:"nebula",con:"Taurus",mag:8.4,ra:83,dec:22,color:"#44BBFF",rarity:"epic",dist:6523,desc:"M1. 1054 supernova remnant with pulsar."},
  {id:"ring_neb",name:"Ring Nebula",cat:"nebula",con:"Lyra",mag:8.8,ra:284,dec:33,color:"#88DDAA",rarity:"epic",dist:2283,desc:"M57. A dying star\u2019s final exhalation."},
  {id:"andromeda",name:"Andromeda",cat:"galaxy",con:"Andromeda",mag:3.4,ra:11,dec:41,color:"#DDCCFF",rarity:"epic",dist:2537000,desc:"M31. Trillion stars. Colliding with us."},
  {id:"whirlpool",name:"Whirlpool Galaxy",cat:"galaxy",con:"Canes Ven.",mag:8.4,ra:203,dec:47,color:"#BBAAEE",rarity:"rare",dist:23e6,desc:"M51. First recognized spiral galaxy."},
  {id:"jupiter",name:"Jupiter",cat:"planet",con:"\u2014",mag:-2.5,ra:50,dec:18,color:"#FFD4A8",rarity:"common",dist:0.00008,desc:"King of planets. Great Red Spot."},
  {id:"saturn",name:"Saturn",cat:"planet",con:"\u2014",mag:0.7,ra:345,dec:-8,color:"#F4E8C8",rarity:"common",dist:0.00013,desc:"Rings spanning 282,000 km."},
  {id:"mars",name:"Mars",cat:"planet",con:"\u2014",mag:-1.0,ra:120,dec:20,color:"#FF8844",rarity:"common",dist:1e-6,desc:"Olympus Mons. Valles Marineris."},
  {id:"venus",name:"Venus",cat:"planet",con:"\u2014",mag:-4.4,ra:30,dec:15,color:"#FFEEDD",rarity:"common",dist:4e-6,desc:"900\u00b0F. Day longer than year."},
  {id:"pleiades",name:"Pleiades",cat:"cluster",con:"Taurus",mag:1.6,ra:57,dec:24,color:"#AACCFF",rarity:"uncommon",dist:444,desc:"M45. Seven Sisters. Universal myth."},
  {id:"omega_cen",name:"\u03a9 Centauri",cat:"cluster",con:"Centaurus",mag:3.7,ra:202,dec:-47,color:"#FFE8BB",rarity:"epic",dist:17090,desc:"10M stars. Devoured dwarf galaxy."},
  {id:"m13",name:"Hercules Cluster",cat:"cluster",con:"Hercules",mag:5.8,ra:250,dec:36,color:"#DDCCBB",rarity:"uncommon",dist:25100,desc:"M13. 300,000 stars. Best northern GC."},
];

const RARITY={common:{l:"COMMON",c:"#8B9BB4"},uncommon:{l:"UNCOMMON",c:"#4ADE80"},rare:{l:"RARE",c:"#60A5FA"},epic:{l:"EPIC",c:"#C084FC"},legendary:{l:"LEGENDARY",c:"#FBBF24"}};
const CAT_IC={star:"\u2726",nebula:"\u25ce",galaxy:"\u25c8",planet:"\u25cf",cluster:"\u2727"};
const atpFor=r=>({legendary:100,epic:50,rare:35,uncommon:25,common:20}[r]||20);

// ═══ ACADEMY CURRICULUM ═══
const ACADEMY = [
  { id:"nav", title:"Night Sky Navigation", icon:"\ud83e\udded", color:"#60A5FA", lessons:[
    {id:"nav1",title:"Finding North with Polaris",body:"Polaris sits within 1\u00b0 of true north. Find it by extending the \u2018pointer stars\u2019 of the Big Dipper\u2019s bowl (Dubhe and Merak) five times the distance between them. Polaris is at the tip of the Little Dipper\u2019s handle. Your latitude equals Polaris\u2019s altitude above the horizon.",quiz:"What two stars point to Polaris?",answers:["Dubhe & Merak","Rigel & Betelgeuse","Vega & Deneb","Sirius & Procyon"],correct:0,atp:15},
    {id:"nav2",title:"The Celestial Coordinate System",body:"Right Ascension (RA) measures east-west position in hours/degrees, like longitude on Earth projected onto the sky. Declination (Dec) measures north-south in degrees, like latitude. RA 0\u00b0 starts at the March equinox point. Dec +90\u00b0 is the north celestial pole (near Polaris), Dec -90\u00b0 is the south pole.",quiz:"What does Declination measure?",answers:["East-west position","North-south position","Distance from Earth","Star brightness"],correct:1,atp:15},
    {id:"nav3",title:"Magnitude: How Bright Is That?",body:"The magnitude scale is inverted and logarithmic. Brighter objects have LOWER numbers. Sirius is -1.46, Polaris is +1.98, the faintest naked-eye stars are about +6. Each magnitude step is 2.512x brightness difference. The Sun is -26.7, the full Moon is -12.7. Negative magnitudes = very bright.",quiz:"Which magnitude is BRIGHTER?",answers:["+6.0","+1.0","+3.5","+4.2"],correct:1,atp:15},
    {id:"nav4",title:"Seasons of the Sky",body:"Earth\u2019s orbit means different constellations are visible in different seasons. Winter: Orion, Taurus, Gemini. Spring: Leo, Virgo, Bo\u00f6tes. Summer: Scorpius, Sagittarius, Lyra. Autumn: Pegasus, Andromeda, Cassiopeia. The Summer Triangle (Vega, Deneb, Altair) dominates June\u2013September. Orion\u2019s Belt is the winter signpost.",quiz:"Orion is best seen in which season?",answers:["Summer","Autumn","Winter","Spring"],correct:2,atp:15},
  ]},
  { id:"stars", title:"Understanding Stars", icon:"\u2b50", color:"#FBBF24", lessons:[
    {id:"st1",title:"What Stars Are Made Of",body:"Stars are spheres of plasma sustained by nuclear fusion. Hydrogen fuses into helium in the core, releasing energy that counteracts gravity. A star\u2019s color reveals its surface temperature: blue/white stars (Rigel, 11,000K) are hottest; yellow (Sun, 5,778K) are medium; red (Betelgeuse, 3,500K) are coolest. Spectral types from hot to cool: O, B, A, F, G, K, M.",quiz:"What spectral type is the HOTTEST?",answers:["M","G","O","K"],correct:2,atp:15},
    {id:"st2",title:"The Life Cycle of Stars",body:"Stars form in nebulae (like the Orion Nebula) when gas clouds collapse. They spend most of their life on the Main Sequence, fusing hydrogen. When hydrogen runs out: low-mass stars become red giants then white dwarfs; high-mass stars become supergiants then explode as supernovae, leaving neutron stars or black holes. Eta Carinae will likely become a hypernova.",quiz:"What do low-mass stars become at end of life?",answers:["Black holes","Neutron stars","White dwarfs","Supernovae"],correct:2,atp:15},
    {id:"st3",title:"Binary and Multiple Stars",body:"Over half of all stars have companions. Capella is a quadruple system. Sirius has a white dwarf companion (Sirius B). Polaris is a triple system. Binary stars are crucial for measuring stellar masses \u2014 the only direct method. Eclipsing binaries (like Algol) dim periodically as one star passes in front of the other.",quiz:"What fraction of stars have companions?",answers:["About 10%","About 25%","Over 50%","About 75%"],correct:2,atp:15},
    {id:"st4",title:"Variable Stars & Citizen Science",body:"Some stars change brightness over time. Cepheid variables (like Polaris) pulsate with a period proportional to their luminosity \u2014 this relationship lets us measure cosmic distances. Irregular variables (like Betelgeuse) change unpredictably. The AAVSO has coordinated amateur brightness estimates since 1911. Your observations have real scientific value.",quiz:"Why are Cepheid variables important?",answers:["They are the brightest","They measure distances","They become supernovae","They have planets"],correct:1,atp:15},
  ]},
  { id:"deep", title:"Deep Sky Objects", icon:"\ud83c\udf0c", color:"#C084FC", lessons:[
    {id:"ds1",title:"Nebulae: Stellar Nurseries & Graveyards",body:"Emission nebulae (Orion Nebula) glow from ionized gas energized by young stars. Reflection nebulae (around the Pleiades) shine by reflected starlight. Planetary nebulae (Ring Nebula) are expelled shells of dying stars. Supernova remnants (Crab Nebula) are the debris of stellar explosions. Dark nebulae block light from objects behind them.",quiz:"What type is the Ring Nebula?",answers:["Emission","Reflection","Planetary","Dark"],correct:2,atp:15},
    {id:"ds2",title:"Galaxies: Island Universes",body:"Galaxies contain billions of stars bound by gravity. Spirals (Andromeda, Whirlpool) have arms of young stars and dust. Ellipticals are older, rounder, and smoother. Irregulars (Magellanic Clouds) lack defined structure. The Milky Way is a barred spiral \u2014 we\u2019re inside it, 26,000 ly from center. Andromeda will merge with us in 4.5 billion years.",quiz:"What galaxy type is the Milky Way?",answers:["Elliptical","Irregular","Barred spiral","Lenticular"],correct:2,atp:15},
    {id:"ds3",title:"Star Clusters",body:"Open clusters (Pleiades) contain hundreds of young stars loosely bound, found in galaxy\u2019s disk. Globular clusters (\u03a9 Centauri, M13) contain hundreds of thousands of ancient stars in tight spheres orbiting the galaxy\u2019s core. Globulars are among the oldest objects in the universe (10\u201313 billion years). \u03a9 Centauri may be a captured dwarf galaxy\u2019s core.",quiz:"Which cluster type is OLDER?",answers:["Open clusters","Globular clusters","Both equal","Neither has stars"],correct:1,atp:15},
    {id:"ds4",title:"The Messier Catalog",body:"Charles Messier cataloged 110 objects in the 1700s \u2014 not because he was interested in them, but because they confused him while hunting comets. His \u2018nuisance list\u2019 became astronomy\u2019s most famous catalog. M1 (Crab Nebula), M13 (Hercules Cluster), M31 (Andromeda), M42 (Orion Nebula), M45 (Pleiades), M51 (Whirlpool), M57 (Ring Nebula) are all in Astra Vault.",quiz:"Why did Messier create his catalog?",answers:["To study nebulae","They confused his comet hunting","For navigation","To name them"],correct:1,atp:15},
  ]},
  { id:"equip", title:"Equipment & Techniques", icon:"\ud83d\udd2d", color:"#4ADE80", lessons:[
    {id:"eq1",title:"Naked Eye Observing",body:"Your eyes are remarkable instruments. Dark adaptation takes 20\u201330 minutes \u2014 use red light only. Averted vision (looking slightly to the side) activates more sensitive rod cells for faint objects. On a clear, dark night you can see \u223c4,500 stars, the Milky Way band, Andromeda Galaxy, 5 planets, and meteor showers. No equipment needed.",quiz:"How long does full dark adaptation take?",answers:["2 minutes","5 minutes","20\u201330 minutes","2 hours"],correct:2,atp:15},
    {id:"eq2",title:"Binocular Astronomy",body:"7x50 or 10x50 binoculars are ideal for astronomy. They gather 50x more light than your eyes. Through binoculars: Jupiter\u2019s moons appear as dots, the Pleiades reveal dozens more stars, Andromeda shows its extent, and the Milky Way resolves into countless stars. Mount on a tripod for steady views. Binoculars are the best first astronomy investment.",quiz:"What binocular size is ideal for astronomy?",answers:["3x20","7x50","25x100","2x10"],correct:1,atp:15},
    {id:"eq3",title:"Your First Telescope",body:"Aperture (diameter of the main mirror/lens) is the most important spec \u2014 it determines light-gathering power and resolution. A 6\u201d (150mm) Dobsonian is the best value for beginners: large aperture, simple mount, under $300. Avoid department-store telescopes that advertise high magnification \u2014 magnification without aperture just magnifies blur.",quiz:"What telescope spec matters most?",answers:["Magnification","Aperture","Weight","Color"],correct:1,atp:15},
    {id:"eq4",title:"Astrophotography Basics",body:"Phone astrophotography: use a tripod, set exposure to 15\u201330 seconds, ISO 1600\u20133200. Night mode on modern phones can capture Orion and bright constellations. For deeper imaging: a DSLR on a tracking mount can capture nebulae and galaxies in 30-second exposures. Stacking multiple short exposures reduces noise. Free software: DeepSkyStacker, GIMP, Siril.",quiz:"What exposure time works for phone astrophotography?",answers:["1/500 second","1 second","15\u201330 seconds","10 minutes"],correct:2,atp:15},
  ]},
  { id:"planet", title:"Planets & Solar System", icon:"\ud83e\ude90", color:"#FF8844", lessons:[
    {id:"pl1",title:"Finding the Planets",body:"Planets wander against the fixed stars (the word \u2018planet\u2019 means \u2018wanderer\u2019 in Greek). They\u2019re always near the ecliptic \u2014 the Sun\u2019s path across the sky. Venus is always near sunrise or sunset (never high at midnight). Jupiter and Saturn are bright and slow-moving. Mars is distinctly red/orange. Mercury is the hardest: always close to the Sun, visible only briefly at twilight.",quiz:"Which planet is hardest to spot?",answers:["Jupiter","Mars","Mercury","Saturn"],correct:2,atp:15},
    {id:"pl2",title:"Jupiter & Its Moons",body:"Jupiter is the largest planet (318 Earth masses) with 95 known moons. Through binoculars, you can see its four Galilean moons (Io, Europa, Ganymede, Callisto) as tiny dots that change position nightly. Through a small telescope, you can see cloud bands and the Great Red Spot \u2014 a storm larger than Earth that has raged for at least 350 years.",quiz:"How many Galilean moons does Jupiter have?",answers:["2","4","12","95"],correct:1,atp:15},
    {id:"pl3",title:"Saturn\u2019s Rings",body:"Saturn\u2019s rings span 282,000 km but are only 10 meters thick. They\u2019re made of ice and rock particles from millimeters to meters across. Through even a small telescope, the rings are visible and breathtaking \u2014 often described as the most beautiful sight in a telescope. The rings tilt relative to Earth over a 29.5-year cycle; in 2026 they\u2019re near maximum tilt.",quiz:"How thick are Saturn\u2019s rings approximately?",answers:["10 meters","10 kilometers","1,000 km","100,000 km"],correct:0,atp:15},
    {id:"pl4",title:"Meteor Showers",body:"Meteor showers occur when Earth passes through debris left by comets. The Perseids (August, from Comet Swift-Tuttle) produce up to 100/hour. The Geminids (December, from asteroid Phaethon) can produce 150/hour of multicolored meteors. Best viewing: after midnight, facing away from the Moon, from a dark location. No equipment needed \u2014 just patience and a clear sky.",quiz:"What causes meteor showers?",answers:["Asteroid impacts","Comet debris","Solar flares","Satellite re-entry"],correct:1,atp:15},
  ]},
  { id:"sci", title:"Citizen Science", icon:"\ud83d\udd2c", color:"#FF6B6B", lessons:[
    {id:"sc1",title:"Why Your Observations Matter",body:"Professional astronomers can\u2019t watch the entire sky at once. Citizen scientists fill this gap. The AAVSO coordinates amateur variable star observers whose data appears in professional research papers. Globe at Night maps light pollution worldwide. Amateur astronomers have discovered comets, tracked asteroid occultations, and confirmed exoplanet transits. Your observations have real scientific impact.",quiz:"What organization coordinates variable star observers?",answers:["NASA","AAVSO","ESA","SpaceX"],correct:1,atp:15},
    {id:"sc2",title:"Measuring Light Pollution (Bortle Scale)",body:"The Bortle scale rates sky darkness from 1 (pristine) to 9 (inner city). At Bortle 1, the zodiacal light and gegenschein are visible. At Bortle 4, the Milky Way is impressive but not overwhelming. At Bortle 7, only bright constellations are recognizable. You can contribute Bortle ratings to Globe at Night \u2014 just go outside, dark-adapt, and compare your sky to reference charts.",quiz:"What Bortle class is an inner city?",answers:["1","3","6","9"],correct:3,atp:15},
    {id:"sc3",title:"Timing Exoplanet Transits",body:"When an exoplanet passes in front of its host star, the star dims slightly (typically 0.1\u20132%). By timing the exact moments of dimming (ingress) and brightening (egress), you constrain the planet\u2019s orbital parameters. NASA\u2019s UNITE program accepts amateur transit observations. Even a small telescope with a CCD camera can detect Hot Jupiter transits.",quiz:"What happens during a transit?",answers:["Star brightens","Star dims","Star moves","Star changes color"],correct:1,atp:15},
    {id:"sc4",title:"Reporting Your Observations",body:"Good scientific observations need: exact date/time (UTC preferred), your location (lat/long), sky conditions (transparency, seeing, Bortle), equipment used, and the measurement itself with estimated uncertainty. Keep an observation log. Consistency matters more than precision \u2014 a regular observer with modest equipment contributes more than an occasional observer with a large telescope.",quiz:"What time format do scientists prefer?",answers:["Local time","Eastern Time","UTC","Pacific Time"],correct:2,atp:15},
  ]},
];

// ═══ SHARED SKY DATA (simulated community aggregate) ═══
const SHARED_SKY = {
  observersNow: 1847 + Math.floor(Math.random() * 200),
  totalHours: 847293,
  totalObservations: 2341567,
  totalStarsCollected: 892104,
  recentDiscoveries: [
    { what: "Betelgeuse", when: "12s ago", where: "Northern Hemisphere" },
    { what: "Orion Nebula", when: "34s ago", where: "Americas" },
    { what: "Saturn", when: "1m ago", where: "Europe" },
    { what: "Andromeda", when: "2m ago", where: "Asia-Pacific" },
    { what: "Pleiades", when: "2m ago", where: "Northern Hemisphere" },
    { what: "TRAPPIST-1", when: "4m ago", where: "Americas" },
    { what: "Jupiter", when: "5m ago", where: "Europe" },
    { what: "Eta Carinae", when: "7m ago", where: "Southern Hemisphere" },
  ],
  popularThisWeek: [
    { name: "Orion Nebula", pct: 84 }, { name: "Jupiter", pct: 79 },
    { name: "Betelgeuse", pct: 71 }, { name: "Andromeda", pct: 65 },
    { name: "Saturn", pct: 58 },
  ],
  communityGoals: [
    { name: "March Dark Sky Survey", target: 10000, current: 7834, unit: "Bortle reports", reward: "Unlock community badge" },
    { name: "Orionid Watch 2026", target: 50000, current: 23419, unit: "meteors logged", reward: "Everyone gets 50 bonus ATP" },
    { name: "Million Hours", target: 1000000, current: 847293, unit: "observation hours", reward: "Permanent 10% ATP boost" },
  ],
  heatmap: [
    { region: "North America", observers: 612, pct: 33 },
    { region: "Europe", observers: 498, pct: 27 },
    { region: "Asia-Pacific", observers: 384, pct: 21 },
    { region: "South America", observers: 189, pct: 10 },
    { region: "Africa & Middle East", observers: 102, pct: 6 },
    { region: "Oceania", observers: 62, pct: 3 },
  ],
};

// ═══ STAR FIELD ═══
const StarField=()=>{const r=useRef(null);useEffect(()=>{const c=r.current;if(!c)return;const x=c.getContext("2d");const rz=()=>{c.width=window.innerWidth;c.height=window.innerHeight;};rz();window.addEventListener("resize",rz);const s=Array.from({length:180},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1+0.2,sp:Math.random()*0.12+0.02,tw:Math.random()*6.28,ts:Math.random()*0.01+0.003}));let af;const dr=()=>{x.fillStyle="rgba(2,3,11,0.1)";x.fillRect(0,0,c.width,c.height);for(const st of s){st.tw+=st.ts;const a=0.2+Math.sin(st.tw)*0.3+0.3;x.beginPath();x.arc(st.x,st.y,st.r,0,6.28);x.fillStyle=`rgba(190,210,245,${a})`;x.fill();st.y+=st.sp;if(st.y>c.height+2){st.y=-2;st.x=Math.random()*c.width;}}af=requestAnimationFrame(dr);};x.fillStyle="#02030b";x.fillRect(0,0,c.width,c.height);dr();return()=>{cancelAnimationFrame(af);window.removeEventListener("resize",rz);};},[]);return <canvas ref={r} style={{position:"fixed",inset:0,zIndex:0}}/>;};

// ═══ ACADEMY VIEW ═══
const AcademyView = ({ completedLessons, onComplete }) => {
  const [activePath, setActivePath] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  if (activeLesson) {
    const isComplete = completedLessons.includes(activeLesson.id);
    return (<div style={{ padding: "14px 18px", overflowY: "auto", height: "100%" }}>
      <button onClick={() => { setActiveLesson(null); setQuizAnswer(null); setShowResult(false); }} style={{ background: "none", border: "none", color: "rgba(96,165,250,0.6)", fontSize: 11, cursor: "pointer", fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>\u2190 Back to {activePath.title}</button>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#E8ECF4", fontFamily: "'Playfair Display',serif", marginBottom: 14 }}>{activeLesson.title}</h2>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: 18, marginBottom: 16 }}>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(200,210,225,0.7)", fontFamily: "'Crimson Pro',serif" }}>{activeLesson.body}</p>
      </div>
      {/* Quiz */}
      <div style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.1)", borderRadius: 12, padding: 18 }}>
        <div style={{ fontSize: 10, color: "rgba(96,165,250,0.6)", letterSpacing: 2, fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>KNOWLEDGE CHECK</div>
        <p style={{ fontSize: 13, color: "#E0E6F0", fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>{activeLesson.quiz}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {activeLesson.answers.map((a, i) => {
            const isCorrect = i === activeLesson.correct;
            const isSelected = quizAnswer === i;
            const bg = showResult ? (isCorrect ? "rgba(74,222,128,0.1)" : isSelected ? "rgba(255,68,68,0.08)" : "rgba(255,255,255,0.015)") : isSelected ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.02)";
            const border = showResult ? (isCorrect ? "rgba(74,222,128,0.3)" : isSelected ? "rgba(255,68,68,0.2)" : "rgba(255,255,255,0.04)") : isSelected ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.04)";
            const color = showResult ? (isCorrect ? "#4ADE80" : isSelected ? "#FF4444" : "rgba(200,210,225,0.5)") : isSelected ? "#60A5FA" : "rgba(200,210,225,0.6)";
            return (<button key={i} onClick={() => !showResult && setQuizAnswer(i)} style={{ padding: "10px 14px", borderRadius: 8, fontSize: 12, cursor: showResult ? "default" : "pointer", fontFamily: "'DM Mono',monospace", background: bg, border: `1px solid ${border}`, color, textAlign: "left", transition: "all 0.15s" }}>{a}</button>);
          })}
        </div>
        {quizAnswer !== null && !showResult && (
          <button onClick={() => { setShowResult(true); if (quizAnswer === activeLesson.correct) onComplete(activeLesson.id, activeLesson.atp); }} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, fontSize: 11, cursor: "pointer", fontFamily: "'DM Mono',monospace", letterSpacing: 1, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60A5FA", fontWeight: 600 }}>CHECK ANSWER</button>
        )}
        {showResult && (
          <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: quizAnswer === activeLesson.correct ? "rgba(74,222,128,0.06)" : "rgba(255,68,68,0.05)", textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: quizAnswer === activeLesson.correct ? "#4ADE80" : "#FF6B6B", fontFamily: "'DM Mono',monospace" }}>
              {quizAnswer === activeLesson.correct ? `\u2713 Correct! +${activeLesson.atp} ATP earned` : `\u2717 The answer was: ${activeLesson.answers[activeLesson.correct]}`}
            </span>
          </div>
        )}
      </div>
    </div>);
  }

  if (activePath) {
    const pathCompleted = activePath.lessons.filter(l => completedLessons.includes(l.id)).length;
    return (<div style={{ padding: "14px 18px", overflowY: "auto", height: "100%" }}>
      <button onClick={() => setActivePath(null)} style={{ background: "none", border: "none", color: "rgba(96,165,250,0.6)", fontSize: 11, cursor: "pointer", fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>\u2190 All Paths</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 24 }}>{activePath.icon}</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#E8ECF4", fontFamily: "'Playfair Display',serif" }}>{activePath.title}</h2>
      </div>
      <div style={{ fontSize: 10, color: activePath.color, fontFamily: "'DM Mono',monospace", marginBottom: 16 }}>{pathCompleted}/{activePath.lessons.length} COMPLETE \u2022 {pathCompleted * 15} ATP EARNED</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activePath.lessons.map((lesson, i) => {
          const done = completedLessons.includes(lesson.id);
          return (<button key={lesson.id} onClick={() => { setActiveLesson(lesson); setQuizAnswer(null); setShowResult(false); }} style={{ padding: 14, borderRadius: 10, textAlign: "left", cursor: "pointer", background: done ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.02)", border: done ? "1px solid rgba(74,222,128,0.12)" : "1px solid rgba(255,255,255,0.04)", transition: "all 0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: done ? "#4ADE80" : "rgba(160,180,210,0.3)", fontFamily: "'DM Mono',monospace", fontWeight: 700, border: done ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(255,255,255,0.06)" }}>{done ? "\u2713" : i + 1}</div>
                <span style={{ fontSize: 13, color: done ? "#4ADE80" : "#E0E6F0", fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{lesson.title}</span>
              </div>
              <span style={{ fontSize: 9, color: done ? "rgba(74,222,128,0.5)" : "#FBBF24", fontFamily: "'DM Mono',monospace" }}>{done ? "DONE" : `+${lesson.atp} ATP`}</span>
            </div>
          </button>);
        })}
      </div>
    </div>);
  }

  // Path selection
  return (<div style={{ padding: "14px 18px", overflowY: "auto", height: "100%" }}>
    <div style={{ fontSize: 10, color: "rgba(160,180,210,0.5)", letterSpacing: 2, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>ASTRONOMY ACADEMY</div>
    <p style={{ fontSize: 12, color: "rgba(180,195,220,0.45)", fontFamily: "'Crimson Pro',serif", marginBottom: 16, lineHeight: 1.6 }}>Master the night sky. Each lesson teaches real astronomy and rewards you with ATP for demonstrating knowledge.</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {ACADEMY.map(path => {
        const done = path.lessons.filter(l => completedLessons.includes(l.id)).length;
        const pct = Math.round(done / path.lessons.length * 100);
        return (<button key={path.id} onClick={() => setActivePath(path)} style={{ padding: 16, borderRadius: 12, textAlign: "left", cursor: "pointer", background: "rgba(255,255,255,0.02)", border: `1px solid ${path.color}12`, transition: "all 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{path.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#E0E6F0", fontFamily: "'Playfair Display',serif" }}>{path.title}</div>
              <div style={{ fontSize: 10, color: path.color, fontFamily: "'DM Mono',monospace" }}>{done}/{path.lessons.length} lessons \u2022 {done * 15} ATP</div>
            </div>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.025)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: path.color, borderRadius: 2, transition: "width 0.4s" }} />
          </div>
        </button>);
      })}
    </div>
  </div>);
};

// ═══ SHARED SKY VIEW ═══
const SharedSkyView = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 3000); return () => clearInterval(iv); }, []);
  const data = useMemo(() => ({
    ...SHARED_SKY,
    observersNow: SHARED_SKY.observersNow + Math.floor(Math.sin(tick * 0.5) * 30),
  }), [tick]);

  return (<div style={{ padding: "14px 18px", overflowY: "auto", height: "100%" }}>
    {/* Observers Now — the hero element */}
    <div style={{ background: "radial-gradient(ellipse at center, rgba(96,165,250,0.06), rgba(2,3,11,0.01))", border: "1px solid rgba(96,165,250,0.1)", borderRadius: 14, padding: 24, textAlign: "center", marginBottom: 14 }}>
      <div style={{ fontSize: 9, color: "rgba(96,165,250,0.5)", letterSpacing: 3, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>LOOKING UP RIGHT NOW</div>
      <div style={{ fontSize: 48, fontWeight: 700, color: "#60A5FA", fontFamily: "'DM Mono',monospace" }}>{data.observersNow.toLocaleString()}</div>
      <div style={{ fontSize: 11, color: "rgba(96,165,250,0.4)", fontFamily: "'Crimson Pro',serif", marginTop: 4, fontStyle: "italic" }}>observers sharing tonight\u2019s sky with you</div>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", margin: "10px auto 0", animation: "pulse 2s infinite" }} />
    </div>

    {/* Live Discovery Feed */}
    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 9, color: "rgba(160,180,210,0.4)", letterSpacing: 2, fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>LIVE DISCOVERIES</div>
      {data.recentDiscoveries.slice(0, 5).map((d, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.02)" : "none", opacity: 1 - i * 0.12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA", opacity: 0.6 }} />
            <span style={{ fontSize: 12, color: "rgba(200,210,225,0.6)", fontFamily: "'DM Mono',monospace" }}>Someone collected <span style={{ color: "#E0E6F0", fontWeight: 600 }}>{d.what}</span></span>
          </div>
          <span style={{ fontSize: 9, color: "rgba(160,180,210,0.3)", fontFamily: "'DM Mono',monospace" }}>{d.when}</span>
        </div>
      ))}
    </div>

    {/* Community Goals */}
    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 9, color: "rgba(160,180,210,0.4)", letterSpacing: 2, fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>COLLECTIVE MISSIONS</div>
      {data.communityGoals.map((g, i) => {
        const pct = Math.round(g.current / g.target * 100);
        return (<div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "#E0E6F0", fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{g.name}</span>
            <span style={{ fontSize: 10, color: "rgba(160,180,210,0.4)", fontFamily: "'DM Mono',monospace" }}>{g.current.toLocaleString()}/{g.target.toLocaleString()}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.025)", borderRadius: 2, overflow: "hidden", marginBottom: 3 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #60A5FA, #C084FC)", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontSize: 9, color: "rgba(160,180,210,0.3)", fontFamily: "'DM Mono',monospace" }}>{g.unit} \u2022 Reward: {g.reward}</div>
        </div>);
      })}
    </div>

    {/* Global Heatmap */}
    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 9, color: "rgba(160,180,210,0.4)", letterSpacing: 2, fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>WHERE WE\u2019RE OBSERVING</div>
      {data.heatmap.map((h, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "rgba(200,210,225,0.6)", fontFamily: "'DM Mono',monospace", width: 140, flexShrink: 0 }}>{h.region}</span>
          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.025)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${h.pct}%`, background: `rgba(96,165,250,${0.3 + h.pct * 0.01})`, borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 9, color: "rgba(96,165,250,0.5)", fontFamily: "'DM Mono',monospace", width: 30, textAlign: "right" }}>{h.observers}</span>
        </div>
      ))}
    </div>

    {/* Trending Objects */}
    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 9, color: "rgba(160,180,210,0.4)", letterSpacing: 2, fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>TRENDING THIS WEEK</div>
      {data.popularThisWeek.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#FBBF24", fontWeight: 700, fontFamily: "'DM Mono',monospace", width: 18 }}>#{i + 1}</span>
          <span style={{ fontSize: 12, color: "rgba(200,210,225,0.7)", fontFamily: "'DM Mono',monospace", flex: 1 }}>{p.name}</span>
          <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.025)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${p.pct}%`, background: "#FBBF24", borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 9, color: "rgba(251,191,36,0.5)", fontFamily: "'DM Mono',monospace", width: 30, textAlign: "right" }}>{p.pct}%</span>
        </div>
      ))}
    </div>

    {/* Lifetime Stats */}
    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 9, color: "rgba(160,180,210,0.4)", letterSpacing: 2, fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>OUR COMMUNITY</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          [data.totalHours.toLocaleString(), "hours observed"],
          [data.totalObservations.toLocaleString(), "observations"],
          [data.totalStarsCollected.toLocaleString(), "objects collected"],
        ].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#E0E6F0", fontFamily: "'DM Mono',monospace" }}>{v}</div>
            <div style={{ fontSize: 8, color: "rgba(160,180,210,0.35)", fontFamily: "'DM Mono',monospace", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </div>);
};

// ═══ SKY SCANNER (compact from v4) ═══
const SkyScanner=({onCollect,collection:col})=>{const cv=useRef(null);const [ang,setAng]=useState({ra:90,dec:15});const [sel,setSel]=useState(null);const [p,setP]=useState(0);const dr=useRef({d:false,lx:0,ly:0});const F=65;
const vis=useMemo(()=>CATALOG.filter(s=>Math.abs(s.ra-ang.ra)<F&&Math.abs(s.dec-ang.dec)<F/2).map(s=>({...s,sx:(s.ra-ang.ra+F)/(F*2),sy:(s.dec-ang.dec+F/2)/F,cl:col.some(c=>c.id===s.id)})),[ang,col]);
useEffect(()=>{let f=0;const t=()=>{f++;setP(f);requestAnimationFrame(t);};t();},[]);
useEffect(()=>{const c=cv.current;if(!c)return;const x=c.getContext("2d");const w=c.width=c.offsetWidth*2,h=c.height=c.offsetHeight*2;x.fillStyle="rgba(2,3,10,0.97)";x.fillRect(0,0,w,h);
for(let i=0;i<180;i++){const px=(Math.sin(i*137.5+ang.ra*0.01)*0.5+0.5)*w,py=(Math.cos(i*97.3+ang.dec*0.01)*0.5+0.5)*h;x.beginPath();x.arc(px,py,Math.random()*0.5+0.15,0,6.28);x.fillStyle=`rgba(180,200,240,${Math.random()*0.2+0.05})`;x.fill();}
for(const o of vis){const ox=o.sx*w,oy=(1-o.sy)*h;const br=o.cat==="nebula"?6:o.cat==="galaxy"?5:Math.max(2,(2-o.mag)*2);
if(o.cat==="nebula"){const g=x.createRadialGradient(ox,oy,0,ox,oy,br*4);g.addColorStop(0,o.color+"30");g.addColorStop(1,"transparent");x.beginPath();x.arc(ox,oy,br*4,0,6.28);x.fillStyle=g;x.fill();}
const g=x.createRadialGradient(ox,oy,0,ox,oy,br*3.5);g.addColorStop(0,o.color+"30");g.addColorStop(1,"transparent");x.beginPath();x.arc(ox,oy,br*3.5,0,6.28);x.fillStyle=g;x.fill();
x.beginPath();x.arc(ox,oy,Math.max(br,1.5),0,6.28);x.fillStyle=o.color;x.fill();
if(o.cl){x.strokeStyle=RARITY[o.rarity].c+"40";x.lineWidth=1;x.setLineDash([2,2]);x.beginPath();x.arc(ox,oy,br+6,0,6.28);x.stroke();x.setLineDash([]);}
x.font="bold 14px 'DM Mono',monospace";x.fillStyle="rgba(200,210,230,0.55)";x.textAlign="left";x.fillText(o.name,ox+br+7,oy+4);}
const cx=w/2,cy=h/2;x.strokeStyle=`rgba(100,200,255,${0.18+Math.sin(p*0.04)*0.08})`;x.lineWidth=1;x.beginPath();x.arc(cx,cy,36,0,6.28);x.stroke();
x.font="10px 'DM Mono',monospace";x.fillStyle="rgba(100,200,255,0.3)";x.textAlign="right";x.fillText(`RA ${ang.ra.toFixed(1)}\u00b0 DEC ${ang.dec.toFixed(1)}\u00b0`,w-12,h-12);
},[ang,vis,p]);
return(<div style={{position:"relative",width:"100%",height:"100%"}}>
<canvas ref={cv} onClick={e=>{const c=cv.current;const rc=c.getBoundingClientRect();const mx=(e.clientX-rc.left)/rc.width,my=1-(e.clientY-rc.top)/rc.height;let best=null,bd=0.06;for(const s of vis){const d=Math.hypot(s.sx-mx,s.sy-my);if(d<bd){bd=d;best=s;}}if(best)setSel(best);}} onPointerDown={e=>{dr.current={d:true,lx:e.clientX,ly:e.clientY};}} onPointerMove={e=>{if(!dr.current.d)return;setAng(a=>({ra:(a.ra-(e.clientX-dr.current.lx)*0.5+360)%360,dec:Math.max(-90,Math.min(90,a.dec+(e.clientY-dr.current.ly)*0.3))}));dr.current.lx=e.clientX;dr.current.ly=e.clientY;}} onPointerUp={()=>{dr.current.d=false;}} onPointerLeave={()=>{dr.current.d=false;}} style={{width:"100%",height:"100%",cursor:"crosshair",touchAction:"none"}}/>
<div style={{position:"absolute",bottom:10,left:10,fontSize:9,color:"rgba(100,180,255,0.25)",fontFamily:"'DM Mono',monospace"}}>DRAG TO PAN \u2022 TAP TO COLLECT</div>
{sel&&<div onClick={e=>e.target===e.currentTarget&&setSel(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
<div style={{background:"linear-gradient(145deg,rgba(8,12,25,0.98),rgba(4,6,16,0.98))",border:`1px solid ${RARITY[sel.rarity].c}18`,borderRadius:14,padding:22,maxWidth:380,width:"92%"}}>
<div style={{fontSize:9,color:RARITY[sel.rarity].c,letterSpacing:3,fontFamily:"'DM Mono',monospace"}}>{CAT_IC[sel.cat]} {RARITY[sel.rarity].l}</div>
<h2 style={{fontSize:22,fontWeight:700,color:"#E8ECF4",margin:"3px 0 6px",fontFamily:"'Playfair Display',serif"}}>{sel.name}</h2>
<p style={{fontSize:12,color:"rgba(180,195,220,0.6)",margin:"0 0 14px",lineHeight:1.6,fontFamily:"'Crimson Pro',serif"}}>{sel.desc}</p>
<div style={{display:"flex",gap:8}}>
{!sel.cl?<button onClick={()=>{onCollect(sel);setSel({...sel,cl:true});}} style={{flex:1,padding:"10px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace",background:`${RARITY[sel.rarity].c}15`,border:`1px solid ${RARITY[sel.rarity].c}35`,color:RARITY[sel.rarity].c}}>+ COLLECT \u2022 {atpFor(sel.rarity)} ATP</button>
:<div style={{flex:1,padding:"10px",textAlign:"center",borderRadius:8,fontSize:11,fontFamily:"'DM Mono',monospace",background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.1)",color:"#4ADE80"}}>\u2713 IN VAULT</div>}
<button onClick={()=>setSel(null)} style={{padding:"10px 14px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",color:"rgba(180,190,210,0.4)"}}>\u2715</button>
</div></div></div>}
</div>);};

// ═══ COLLECTION VIEW (compact) ═══
const CollView=({collection:col})=>{const pct=Math.round(col.length/CATALOG.length*100);
return(<div style={{padding:"14px 18px",overflowY:"auto",height:"100%"}}>
<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:9,color:"rgba(160,180,210,0.4)",fontFamily:"'DM Mono',monospace",letterSpacing:2}}>VAULT</span><span style={{fontSize:11,color:"#E8ECF4",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{col.length}/{CATALOG.length}</span></div><div style={{height:4,background:"rgba(255,255,255,0.02)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#60A5FA,#C084FC,#FBBF24)",borderRadius:2,transition:"width 0.5s"}}/></div></div>
{col.length===0?<div style={{textAlign:"center",padding:40,color:"rgba(160,180,210,0.2)",fontFamily:"'DM Mono',monospace",fontSize:11}}>Scan the sky to collect objects</div>
:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>{col.map(s=><div key={s.id} style={{background:"rgba(255,255,255,0.015)",border:`1px solid ${RARITY[s.rarity].c}0d`,borderRadius:9,padding:11}}>
<div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:20,height:20,borderRadius:"50%",background:`radial-gradient(circle,${s.color},transparent)`,flexShrink:0}}/><div><div style={{fontSize:12,fontWeight:700,color:"#E0E6F0",fontFamily:"'Playfair Display',serif"}}>{s.name}</div><div style={{fontSize:8,color:RARITY[s.rarity].c,fontFamily:"'DM Mono',monospace"}}>{RARITY[s.rarity].l}</div></div></div>
</div>)}</div>}
</div>);};

// ═══ MAIN APP ═══
export default function AstraVault() {
  const [view, setView] = useState("sky");
  const [col, setCol] = useState([]);
  const [atp, setAtp] = useState(200);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [notif, setNotif] = useState(null);
  const [onboard, setOnboard] = useState(true);

  const notify = useCallback(m => { setNotif(m); setTimeout(() => setNotif(null), 2200); }, []);
  const collect = useCallback(s => { setCol(p => { if (p.find(x => x.id === s.id)) return p; return [...p, s]; }); const a = atpFor(s.rarity); setAtp(p => p + a); notify(`+${a} ATP \u2014 ${s.name}`); }, [notify]);
  const completeLesson = useCallback((id, a) => { if (completedLessons.includes(id)) return; setCompletedLessons(p => [...p, id]); setAtp(p => p + a); notify(`+${a} ATP \u2014 Lesson complete!`); }, [completedLessons, notify]);

  const totalAtp = atp + col.reduce((s, c) => s + atpFor(c.rarity), 0);
  const moon = astro.moonPhase(new Date());

  const NAV = [
    { id: "shared", l: "SHARED SKY", i: "\ud83c\udf0d" },
    { id: "sky", l: "SCAN", i: "\u25ce" },
    { id: "vault", l: "VAULT", i: "\u25c6" },
    { id: "academy", l: "LEARN", i: "\ud83c\udf93" },
  ];

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}body{background:#02030b;color:#E8ECF4;overflow:hidden;}
      ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.04);border-radius:2px;}
      @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
      @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
      @keyframes glow{0%,100%{box-shadow:0 0 12px rgba(96,165,250,.08)}50%{box-shadow:0 0 20px rgba(192,132,252,.15)}}
    `}</style>
    <StarField />
    {notif && <div style={{ position: "fixed", top: 50, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "rgba(8,12,25,0.95)", border: "1px solid rgba(251,191,36,0.18)", borderRadius: 8, padding: "7px 16px", color: "#FBBF24", fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 600, backdropFilter: "blur(12px)", animation: "slideDown 0.2s ease" }}>{notif}</div>}

    <div style={{ position: "fixed", inset: 0, zIndex: 1, display: "flex", flexDirection: "column", maxWidth: 840, margin: "0 auto", background: "rgba(2,3,11,0.5)", borderLeft: "1px solid rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.02)" }}>
      {/* Header */}
      <header style={{ padding: "7px 14px", borderBottom: "1px solid rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(14px)", background: "rgba(2,3,11,0.85)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#60A5FA,#C084FC)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, animation: "glow 4s ease-in-out infinite" }}>{"\u2726"}</div>
          <div>
            <h1 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, fontFamily: "'DM Mono',monospace", background: "linear-gradient(90deg,#E8ECF4,#60A5FA,#C084FC,#FBBF24)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 8s linear infinite" }}>ASTRA VAULT</h1>
            <div style={{ fontSize: 6, color: "rgba(160,180,210,0.2)", letterSpacing: 2, fontFamily: "'DM Mono',monospace" }}>v5 \u2022 {astro.moonName(moon.illumination)} \u2022 {Math.round(moon.illumination * 100)}% moon</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ padding: "2px 7px", borderRadius: 10, background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.08)", fontSize: 10, color: "#FBBF24", fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{totalAtp.toLocaleString()} ATP</div>
          <div style={{ padding: "2px 7px", borderRadius: 10, background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.08)", fontSize: 10, color: "#C084FC", fontFamily: "'DM Mono',monospace" }}>{completedLessons.length}/{ACADEMY.reduce((s, p) => s + p.lessons.length, 0)}</div>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {onboard ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{"\u2726"}</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 5 }}>Astra Vault</h2>
            <p style={{ fontSize: 12, color: "rgba(180,195,220,0.5)", maxWidth: 340, lineHeight: 1.7, fontFamily: "'Crimson Pro',serif", marginBottom: 20 }}>
              Scan the cosmos. Learn real astronomy. Join {SHARED_SKY.observersNow.toLocaleString()} observers sharing tonight's sky. No accounts needed. No chat. Just the stars and everyone looking up at them.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, width: "100%", maxWidth: 340, marginBottom: 20 }}>
              {[{ i: "\ud83c\udf0d", l: "Shared Sky", d: "See the community" }, { i: "\u25ce", l: "Scan", d: "Explore & collect" }, { i: "\u25c6", l: "Vault", d: "Your collection" }, { i: "\ud83c\udf93", l: "Learn", d: "24 lessons" }].map(f => <div key={f.l} style={{ background: "rgba(255,255,255,0.015)", borderRadius: 8, padding: "10px 5px", border: "1px solid rgba(255,255,255,0.025)" }}><div style={{ fontSize: 16, marginBottom: 2 }}>{f.i}</div><div style={{ fontSize: 9, color: "#E0E6F0", fontFamily: "'DM Mono',monospace" }}>{f.l}</div><div style={{ fontSize: 7, color: "rgba(160,180,210,0.3)", fontFamily: "'DM Mono',monospace" }}>{f.d}</div></div>)}
            </div>
            <button onClick={() => setOnboard(false)} style={{ padding: "10px 32px", background: "linear-gradient(135deg,rgba(96,165,250,0.1),rgba(192,132,252,0.1))", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 8, color: "#E8ECF4", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Mono',monospace", letterSpacing: 3 }}>BEGIN</button>
          </div>
        ) : (
          <div style={{ height: "100%", animation: "fadeIn 0.2s ease" }}>
            {view === "shared" && <SharedSkyView />}
            {view === "sky" && <SkyScanner onCollect={collect} collection={col} />}
            {view === "vault" && <CollView collection={col} />}
            {view === "academy" && <AcademyView completedLessons={completedLessons} onComplete={completeLesson} />}
          </div>
        )}
      </div>

      {/* Nav */}
      {!onboard && <nav style={{ display: "flex", justifyContent: "space-around", padding: "4px 0 8px", borderTop: "1px solid rgba(255,255,255,0.02)", backdropFilter: "blur(14px)", background: "rgba(2,3,11,0.9)", flexShrink: 0 }}>
        {NAV.map(n => <button key={n.id} onClick={() => setView(n.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "3px 8px", borderRadius: 6, minWidth: 44, minHeight: 44, justifyContent: "center" }}>
          <span style={{ fontSize: 16, color: view === n.id ? "#60A5FA" : "rgba(160,180,210,0.2)", transition: "color 0.15s" }}>{n.i}</span>
          <span style={{ fontSize: 7, letterSpacing: 1, fontFamily: "'DM Mono',monospace", color: view === n.id ? "#60A5FA" : "rgba(160,180,210,0.15)", fontWeight: view === n.id ? 700 : 400 }}>{n.l}</span>
        </button>)}
      </nav>}
    </div>
  </>);
}
