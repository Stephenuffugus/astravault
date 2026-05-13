// Astronomy Academy curriculum data — ported from prototype v5.

export interface Quiz {
  question: string;
  answers: [string, string, string, string];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  pathId: string;
  title: string;
  body: string;
  quiz: Quiz;
  atpReward: number;
}

export interface AcademyPath {
  id: string;
  title: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const ACADEMY: AcademyPath[] = [
  {
    id: "nav",
    title: "Night Sky Navigation",
    icon: "🧭",
    color: "#60A5FA",
    lessons: [
      {
        id: "nav1",
        pathId: "nav",
        title: "Finding North with Polaris",
        body: "Polaris sits within 1° of true north. Find it by extending the ‘pointer stars’ of the Big Dipper’s bowl (Dubhe and Merak) five times the distance between them. Polaris is at the tip of the Little Dipper’s handle. Your latitude equals Polaris’s altitude above the horizon.",
        quiz: {
          question: "What two stars point to Polaris?",
          answers: ["Dubhe & Merak", "Rigel & Betelgeuse", "Vega & Deneb", "Sirius & Procyon"],
          correctIndex: 0,
        },
        atpReward: 15,
      },
      {
        id: "nav2",
        pathId: "nav",
        title: "The Celestial Coordinate System",
        body: "Right Ascension (RA) measures east-west position in hours/degrees, like longitude on Earth projected onto the sky. Declination (Dec) measures north-south in degrees, like latitude. RA 0° starts at the March equinox point. Dec +90° is the north celestial pole (near Polaris), Dec -90° is the south pole.",
        quiz: {
          question: "What does Declination measure?",
          answers: ["East-west position", "North-south position", "Distance from Earth", "Star brightness"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "nav3",
        pathId: "nav",
        title: "Magnitude: How Bright Is That?",
        body: "The magnitude scale is inverted and logarithmic. Brighter objects have LOWER numbers. Sirius is -1.46, Polaris is +1.98, the faintest naked-eye stars are about +6. Each magnitude step is 2.512x brightness difference. The Sun is -26.7, the full Moon is -12.7. Negative magnitudes = very bright.",
        quiz: {
          question: "Which magnitude is BRIGHTER?",
          answers: ["+6.0", "+1.0", "+3.5", "+4.2"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "nav4",
        pathId: "nav",
        title: "Seasons of the Sky",
        body: "Earth’s orbit means different constellations are visible in different seasons. Winter: Orion, Taurus, Gemini. Spring: Leo, Virgo, Boötes. Summer: Scorpius, Sagittarius, Lyra. Autumn: Pegasus, Andromeda, Cassiopeia. The Summer Triangle (Vega, Deneb, Altair) dominates June–September. Orion’s Belt is the winter signpost.",
        quiz: {
          question: "Orion is best seen in which season?",
          answers: ["Summer", "Autumn", "Winter", "Spring"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
    ],
  },
  {
    id: "stars",
    title: "Understanding Stars",
    icon: "⭐",
    color: "#FBBF24",
    lessons: [
      {
        id: "st1",
        pathId: "stars",
        title: "What Stars Are Made Of",
        body: "Stars are spheres of plasma sustained by nuclear fusion. Hydrogen fuses into helium in the core, releasing energy that counteracts gravity. A star’s color reveals its surface temperature: blue/white stars (Rigel, 11,000K) are hottest; yellow (Sun, 5,778K) are medium; red (Betelgeuse, 3,500K) are coolest. Spectral types from hot to cool: O, B, A, F, G, K, M.",
        quiz: {
          question: "What spectral type is the HOTTEST?",
          answers: ["M", "G", "O", "K"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
      {
        id: "st2",
        pathId: "stars",
        title: "The Life Cycle of Stars",
        body: "Stars form in nebulae (like the Orion Nebula) when gas clouds collapse. They spend most of their life on the Main Sequence, fusing hydrogen. When hydrogen runs out: low-mass stars become red giants then white dwarfs; high-mass stars become supergiants then explode as supernovae, leaving neutron stars or black holes. Eta Carinae will likely become a hypernova.",
        quiz: {
          question: "What do low-mass stars become at end of life?",
          answers: ["Black holes", "Neutron stars", "White dwarfs", "Supernovae"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
      {
        id: "st3",
        pathId: "stars",
        title: "Binary and Multiple Stars",
        body: "Over half of all stars have companions. Capella is a quadruple system. Sirius has a white dwarf companion (Sirius B). Polaris is a triple system. Binary stars are crucial for measuring stellar masses — the only direct method. Eclipsing binaries (like Algol) dim periodically as one star passes in front of the other.",
        quiz: {
          question: "What fraction of stars have companions?",
          answers: ["About 10%", "About 25%", "Over 50%", "About 75%"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
      {
        id: "st4",
        pathId: "stars",
        title: "Variable Stars & Citizen Science",
        body: "Some stars change brightness over time. Cepheid variables (like Polaris) pulsate with a period proportional to their luminosity — this relationship lets us measure cosmic distances. Irregular variables (like Betelgeuse) change unpredictably. The AAVSO has coordinated amateur brightness estimates since 1911. Your observations have real scientific value.",
        quiz: {
          question: "Why are Cepheid variables important?",
          answers: ["They are the brightest", "They measure distances", "They become supernovae", "They have planets"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
    ],
  },
  {
    id: "deep",
    title: "Deep Sky Objects",
    icon: "🌌",
    color: "#C084FC",
    lessons: [
      {
        id: "ds1",
        pathId: "deep",
        title: "Nebulae: Stellar Nurseries & Graveyards",
        body: "Emission nebulae (Orion Nebula) glow from ionized gas energized by young stars. Reflection nebulae (around the Pleiades) shine by reflected starlight. Planetary nebulae (Ring Nebula) are expelled shells of dying stars. Supernova remnants (Crab Nebula) are the debris of stellar explosions. Dark nebulae block light from objects behind them.",
        quiz: {
          question: "What type is the Ring Nebula?",
          answers: ["Emission", "Reflection", "Planetary", "Dark"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
      {
        id: "ds2",
        pathId: "deep",
        title: "Galaxies: Island Universes",
        body: "Galaxies contain billions of stars bound by gravity. Spirals (Andromeda, Whirlpool) have arms of young stars and dust. Ellipticals are older, rounder, and smoother. Irregulars (Magellanic Clouds) lack defined structure. The Milky Way is a barred spiral — we’re inside it, 26,000 ly from center. Andromeda will merge with us in 4.5 billion years.",
        quiz: {
          question: "What galaxy type is the Milky Way?",
          answers: ["Elliptical", "Irregular", "Barred spiral", "Lenticular"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
      {
        id: "ds3",
        pathId: "deep",
        title: "Star Clusters",
        body: "Open clusters (Pleiades) contain hundreds of young stars loosely bound, found in galaxy’s disk. Globular clusters (Ω Centauri, M13) contain hundreds of thousands of ancient stars in tight spheres orbiting the galaxy’s core. Globulars are among the oldest objects in the universe (10–13 billion years). Ω Centauri may be a captured dwarf galaxy’s core.",
        quiz: {
          question: "Which cluster type is OLDER?",
          answers: ["Open clusters", "Globular clusters", "Both equal", "Neither has stars"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "ds4",
        pathId: "deep",
        title: "The Messier Catalog",
        body: "Charles Messier cataloged 110 objects in the 1700s — not because he was interested in them, but because they confused him while hunting comets. His ‘nuisance list’ became astronomy’s most famous catalog. M1 (Crab Nebula), M13 (Hercules Cluster), M31 (Andromeda), M42 (Orion Nebula), M45 (Pleiades), M51 (Whirlpool), M57 (Ring Nebula) are all in Astra Vault.",
        quiz: {
          question: "Why did Messier create his catalog?",
          answers: ["To study nebulae", "They confused his comet hunting", "For navigation", "To name them"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
    ],
  },
  {
    id: "equip",
    title: "Equipment & Techniques",
    icon: "🔭",
    color: "#4ADE80",
    lessons: [
      {
        id: "eq1",
        pathId: "equip",
        title: "Naked Eye Observing",
        body: "Your eyes are remarkable instruments. Dark adaptation takes 20–30 minutes — use red light only. Averted vision (looking slightly to the side) activates more sensitive rod cells for faint objects. On a clear, dark night you can see ∼4,500 stars, the Milky Way band, Andromeda Galaxy, 5 planets, and meteor showers. No equipment needed.",
        quiz: {
          question: "How long does full dark adaptation take?",
          answers: ["2 minutes", "5 minutes", "20–30 minutes", "2 hours"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
      {
        id: "eq2",
        pathId: "equip",
        title: "Binocular Astronomy",
        body: "7x50 or 10x50 binoculars are ideal for astronomy. They gather 50x more light than your eyes. Through binoculars: Jupiter’s moons appear as dots, the Pleiades reveal dozens more stars, Andromeda shows its extent, and the Milky Way resolves into countless stars. Mount on a tripod for steady views. Binoculars are the best first astronomy investment.",
        quiz: {
          question: "What binocular size is ideal for astronomy?",
          answers: ["3x20", "7x50", "25x100", "2x10"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "eq3",
        pathId: "equip",
        title: "Your First Telescope",
        body: "Aperture (diameter of the main mirror/lens) is the most important spec — it determines light-gathering power and resolution. A 6” (150mm) Dobsonian is the best value for beginners: large aperture, simple mount, under $300. Avoid department-store telescopes that advertise high magnification — magnification without aperture just magnifies blur.",
        quiz: {
          question: "What telescope spec matters most?",
          answers: ["Magnification", "Aperture", "Weight", "Color"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "eq4",
        pathId: "equip",
        title: "Astrophotography Basics",
        body: "Phone astrophotography: use a tripod, set exposure to 15–30 seconds, ISO 1600–3200. Night mode on modern phones can capture Orion and bright constellations. For deeper imaging: a DSLR on a tracking mount can capture nebulae and galaxies in 30-second exposures. Stacking multiple short exposures reduces noise. Free software: DeepSkyStacker, GIMP, Siril.",
        quiz: {
          question: "What exposure time works for phone astrophotography?",
          answers: ["1/500 second", "1 second", "15–30 seconds", "10 minutes"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
    ],
  },
  {
    id: "planet",
    title: "Planets & Solar System",
    icon: "🪐",
    color: "#FF8844",
    lessons: [
      {
        id: "pl1",
        pathId: "planet",
        title: "Finding the Planets",
        body: "Planets wander against the fixed stars (the word ‘planet’ means ‘wanderer’ in Greek). They’re always near the ecliptic — the Sun’s path across the sky. Venus is always near sunrise or sunset (never high at midnight). Jupiter and Saturn are bright and slow-moving. Mars is distinctly red/orange. Mercury is the hardest: always close to the Sun, visible only briefly at twilight.",
        quiz: {
          question: "Which planet is hardest to spot?",
          answers: ["Jupiter", "Mars", "Mercury", "Saturn"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
      {
        id: "pl2",
        pathId: "planet",
        title: "Jupiter & Its Moons",
        body: "Jupiter is the largest planet (318 Earth masses) with 95 known moons. Through binoculars, you can see its four Galilean moons (Io, Europa, Ganymede, Callisto) as tiny dots that change position nightly. Through a small telescope, you can see cloud bands and the Great Red Spot — a storm larger than Earth that has raged for at least 350 years.",
        quiz: {
          question: "How many Galilean moons does Jupiter have?",
          answers: ["2", "4", "12", "95"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "pl3",
        pathId: "planet",
        title: "Saturn’s Rings",
        body: "Saturn’s rings span 282,000 km but are only 10 meters thick. They’re made of ice and rock particles from millimeters to meters across. Through even a small telescope, the rings are visible and breathtaking — often described as the most beautiful sight in a telescope. The rings tilt relative to Earth over a 29.5-year cycle; in 2026 they’re near maximum tilt.",
        quiz: {
          question: "How thick are Saturn’s rings approximately?",
          answers: ["10 meters", "10 kilometers", "1,000 km", "100,000 km"],
          correctIndex: 0,
        },
        atpReward: 15,
      },
      {
        id: "pl4",
        pathId: "planet",
        title: "Meteor Showers",
        body: "Meteor showers occur when Earth passes through debris left by comets. The Perseids (August, from Comet Swift-Tuttle) produce up to 100/hour. The Geminids (December, from asteroid Phaethon) can produce 150/hour of multicolored meteors. Best viewing: after midnight, facing away from the Moon, from a dark location. No equipment needed — just patience and a clear sky.",
        quiz: {
          question: "What causes meteor showers?",
          answers: ["Asteroid impacts", "Comet debris", "Solar flares", "Satellite re-entry"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
    ],
  },
  {
    id: "sci",
    title: "Citizen Science",
    icon: "🔬",
    color: "#FF6B6B",
    lessons: [
      {
        id: "sc1",
        pathId: "sci",
        title: "Why Your Observations Matter",
        body: "Professional astronomers can’t watch the entire sky at once. Citizen scientists fill this gap. The AAVSO coordinates amateur variable star observers whose data appears in professional research papers. Globe at Night maps light pollution worldwide. Amateur astronomers have discovered comets, tracked asteroid occultations, and confirmed exoplanet transits. Your observations have real scientific impact.",
        quiz: {
          question: "What organization coordinates variable star observers?",
          answers: ["NASA", "AAVSO", "ESA", "SpaceX"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "sc2",
        pathId: "sci",
        title: "Measuring Light Pollution (Bortle Scale)",
        body: "The Bortle scale rates sky darkness from 1 (pristine) to 9 (inner city). At Bortle 1, the zodiacal light and gegenschein are visible. At Bortle 4, the Milky Way is impressive but not overwhelming. At Bortle 7, only bright constellations are recognizable. You can contribute Bortle ratings to Globe at Night — just go outside, dark-adapt, and compare your sky to reference charts.",
        quiz: {
          question: "What Bortle class is an inner city?",
          answers: ["1", "3", "6", "9"],
          correctIndex: 3,
        },
        atpReward: 15,
      },
      {
        id: "sc3",
        pathId: "sci",
        title: "Timing Exoplanet Transits",
        body: "When an exoplanet passes in front of its host star, the star dims slightly (typically 0.1–2%). By timing the exact moments of dimming (ingress) and brightening (egress), you constrain the planet’s orbital parameters. NASA’s UNITE program accepts amateur transit observations. Even a small telescope with a CCD camera can detect Hot Jupiter transits.",
        quiz: {
          question: "What happens during a transit?",
          answers: ["Star brightens", "Star dims", "Star moves", "Star changes color"],
          correctIndex: 1,
        },
        atpReward: 15,
      },
      {
        id: "sc4",
        pathId: "sci",
        title: "Reporting Your Observations",
        body: "Good scientific observations need: exact date/time (UTC preferred), your location (lat/long), sky conditions (transparency, seeing, Bortle), equipment used, and the measurement itself with estimated uncertainty. Keep an observation log. Consistency matters more than precision — a regular observer with modest equipment contributes more than an occasional observer with a large telescope.",
        quiz: {
          question: "What time format do scientists prefer?",
          answers: ["Local time", "Eastern Time", "UTC", "Pacific Time"],
          correctIndex: 2,
        },
        atpReward: 15,
      },
    ],
  },
];

export const totalLessons: number = ACADEMY.reduce((sum, p) => sum + p.lessons.length, 0);
export const lessonById = (id: string): Lesson | undefined => ACADEMY.flatMap(p => p.lessons).find(l => l.id === id);
export const pathById = (id: string): AcademyPath | undefined => ACADEMY.find(p => p.id === id);
