/** Astra Vault celestial object catalog. */

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Category = 'star' | 'nebula' | 'galaxy' | 'planet' | 'cluster';

export interface CelestialObject {
  id: string;
  name: string;
  category: Category;
  constellation: string;
  magnitude: number;
  ra: number;
  dec: number;
  color: string;
  rarity: Rarity;
  distance: number;
  description: string;
}

export const CATALOG: CelestialObject[] = [
  { id: 'sirius', name: 'Sirius', category: 'star', constellation: 'Canis Major', magnitude: -1.46, ra: 101, dec: -17, color: '#A8C8FF', rarity: 'common', distance: 8.6, description: 'Brightest star. Binary system at 25x solar luminosity.' },
  { id: 'betelgeuse', name: 'Betelgeuse', category: 'star', constellation: 'Orion', magnitude: 0.42, ra: 89, dec: 7, color: '#FF6B4A', rarity: 'rare', distance: 700, description: 'Dying red supergiant, 1000x Sun diameter. Will go supernova.' },
  { id: 'vega', name: 'Vega', category: 'star', constellation: 'Lyra', magnitude: 0.03, ra: 279, dec: 39, color: '#C8DBFF', rarity: 'uncommon', distance: 25, description: 'Former North Star. Photometry standard.' },
  { id: 'rigel', name: 'Rigel', category: 'star', constellation: 'Orion', magnitude: 0.13, ra: 79, dec: -8, color: '#B4D4FF', rarity: 'rare', distance: 860, description: 'Blue supergiant at 120,000x solar luminosity.' },
  { id: 'arcturus', name: 'Arcturus', category: 'star', constellation: 'Boötes', magnitude: -0.05, ra: 214, dec: 19, color: '#FFB86B', rarity: 'uncommon', distance: 36.7, description: 'Brightest northern star. Ancient thick-disk.' },
  { id: 'polaris', name: 'Polaris', category: 'star', constellation: 'Ursa Minor', magnitude: 1.98, ra: 38, dec: 89, color: '#FFF4D4', rarity: 'epic', distance: 433, description: 'North Star. Cepheid variable triple system.' },
  { id: 'antares', name: 'Antares', category: 'star', constellation: 'Scorpius', magnitude: 1.06, ra: 247, dec: -26, color: '#FF4444', rarity: 'rare', distance: 550, description: 'Heart of the Scorpion. Would engulf Mars orbit.' },
  { id: 'deneb', name: 'Deneb', category: 'star', constellation: 'Cygnus', magnitude: 1.25, ra: 310, dec: 45, color: '#E8F0FF', rarity: 'epic', distance: 2615, description: '196,000x solar luminosity from 2,600 ly.' },
  { id: 'aldebaran', name: 'Aldebaran', category: 'star', constellation: 'Taurus', magnitude: 0.86, ra: 69, dec: 17, color: '#FF9E5E', rarity: 'uncommon', distance: 65, description: 'Eye of Taurus. 44x Sun diameter.' },
  { id: 'spica', name: 'Spica', category: 'star', constellation: 'Virgo', magnitude: 0.97, ra: 201, dec: -11, color: '#B8D8FF', rarity: 'uncommon', distance: 250, description: 'Egg-shaped binary. Stars distort each other.' },
  { id: 'capella', name: 'Capella', category: 'star', constellation: 'Auriga', magnitude: 0.08, ra: 79, dec: 46, color: '#FFE4A8', rarity: 'uncommon', distance: 42.9, description: 'Quadruple system. Two giants + two red dwarfs.' },
  { id: 'procyon', name: 'Procyon', category: 'star', constellation: 'Canis Minor', magnitude: 0.34, ra: 115, dec: 5, color: '#FFF4D0', rarity: 'common', distance: 11.5, description: "Binary with white dwarf. Sun's neighbor." },
  { id: 'canopus', name: 'Canopus', category: 'star', constellation: 'Carina', magnitude: -0.74, ra: 96, dec: -53, color: '#FFF8E0', rarity: 'rare', distance: 310, description: '2nd brightest. Spacecraft navigation beacon.' },
  { id: 'eta_car', name: 'Eta Carinae', category: 'star', constellation: 'Carina', magnitude: 4.3, ra: 161, dec: -60, color: '#FFD700', rarity: 'legendary', distance: 7500, description: '5M solar luminosities. Hypernova candidate.' },
  { id: 'tabby', name: 'Tabby’s Star', category: 'star', constellation: 'Cygnus', magnitude: 11.7, ra: 302, dec: 44, color: '#E8E0D8', rarity: 'legendary', distance: 1470, description: 'Inexplicable 22% dimming. Alien megastructure?' },
  { id: 'trappist', name: 'TRAPPIST-1', category: 'star', constellation: 'Aquarius', magnitude: 18.8, ra: 347, dec: -5, color: '#FF8888', rarity: 'legendary', distance: 40.7, description: '7 Earth-sized planets. 3 habitable.' },
  { id: 'orion_neb', name: 'Orion Nebula', category: 'nebula', constellation: 'Orion', magnitude: 4.0, ra: 84, dec: -5, color: '#FF88CC', rarity: 'rare', distance: 1344, description: 'M42. Closest massive stellar nursery.' },
  { id: 'crab_neb', name: 'Crab Nebula', category: 'nebula', constellation: 'Taurus', magnitude: 8.4, ra: 83, dec: 22, color: '#44BBFF', rarity: 'epic', distance: 6523, description: 'M1. 1054 supernova remnant with pulsar.' },
  { id: 'ring_neb', name: 'Ring Nebula', category: 'nebula', constellation: 'Lyra', magnitude: 8.8, ra: 284, dec: 33, color: '#88DDAA', rarity: 'epic', distance: 2283, description: "M57. Dying star's final breath. 20,000 years old." },
  { id: 'andromeda', name: 'Andromeda', category: 'galaxy', constellation: 'Andromeda', magnitude: 3.4, ra: 11, dec: 41, color: '#DDCCFF', rarity: 'epic', distance: 2537000, description: 'M31. Trillion stars. Colliding with us in 4.5B years.' },
  { id: 'whirlpool', name: 'Whirlpool Galaxy', category: 'galaxy', constellation: 'Canes Venatici', magnitude: 8.4, ra: 203, dec: 47, color: '#BBAAEE', rarity: 'rare', distance: 23e6, description: 'M51. Grand-design spiral. First recognized spiral.' },
  { id: 'jupiter', name: 'Jupiter', category: 'planet', constellation: '—', magnitude: -2.5, ra: 50, dec: 18, color: '#FFD4A8', rarity: 'common', distance: 0.00008, description: 'King of planets. 318 Earths. Great Red Spot.' },
  { id: 'saturn', name: 'Saturn', category: 'planet', constellation: '—', magnitude: 0.7, ra: 345, dec: -8, color: '#F4E8C8', rarity: 'common', distance: 0.00013, description: 'Rings span 282,000 km. Less dense than water.' },
  { id: 'mars', name: 'Mars', category: 'planet', constellation: '—', magnitude: -1.0, ra: 120, dec: 20, color: '#FF8844', rarity: 'common', distance: 1e-6, description: 'Olympus Mons. Valles Marineris.' },
  { id: 'venus', name: 'Venus', category: 'planet', constellation: '—', magnitude: -4.4, ra: 30, dec: 15, color: '#FFEEDD', rarity: 'common', distance: 4e-6, description: '900°F. Day longer than year.' },
  { id: 'pleiades', name: 'Pleiades', category: 'cluster', constellation: 'Taurus', magnitude: 1.6, ra: 57, dec: 24, color: '#AACCFF', rarity: 'uncommon', distance: 444, description: 'M45. Seven Sisters. Universal myth.' },
  { id: 'omega_cen', name: 'Ω Centauri', category: 'cluster', constellation: 'Centaurus', magnitude: 3.7, ra: 202, dec: -47, color: '#FFE8BB', rarity: 'epic', distance: 17090, description: 'Largest globular. 10M stars. Devoured dwarf galaxy.' },
  { id: 'm13', name: 'Hercules Cluster', category: 'cluster', constellation: 'Hercules', magnitude: 5.8, ra: 250, dec: 36, color: '#DDCCBB', rarity: 'uncommon', distance: 25100, description: 'M13. 300,000 stars. Best northern GC.' },
];

export const RARITY_META: Record<Rarity, { label: string; color: string }> = {
  common: { label: 'COMMON', color: '#8B9BB4' },
  uncommon: { label: 'UNCOMMON', color: '#4ADE80' },
  rare: { label: 'RARE', color: '#60A5FA' },
  epic: { label: 'EPIC', color: '#C084FC' },
  legendary: { label: 'LEGENDARY', color: '#FBBF24' },
};

export const CATEGORY_ICONS: Record<Category, string> = {
  star: '✦',
  nebula: '◎',
  galaxy: '◈',
  planet: '●',
  cluster: '✧',
};

export const atpFor = (rarity: Rarity): number => {
  const table: Record<Rarity, number> = { legendary: 100, epic: 50, rare: 35, uncommon: 25, common: 20 };
  return table[rarity] ?? 20;
};
