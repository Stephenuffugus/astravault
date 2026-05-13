// 2026 celestial events calendar for Astra Vault.
// Ported from prototype/astra-vault-v4.jsx (lines 150-167).

export type EventType = 'meteor' | 'eclipse' | 'planetary' | 'comet' | 'conjunction';

export interface CelestialEvent {
  id: string;
  name: string;
  date: string; // ISO 8601 'YYYY-MM-DD'
  type: EventType;
  description: string;
  atpReward: number;
  icon: string;
}

export const EVENT_TYPE_COLOR: Record<EventType, string> = {
  meteor: '#FF8844',
  eclipse: '#C084FC',
  planetary: '#60A5FA',
  comet: '#4ADE80',
  conjunction: '#FBBF24',
};

export const EVENTS_2026: CelestialEvent[] = [
  {
    id: 'e1',
    name: 'Jupiter at Opposition',
    date: '2026-01-10',
    type: 'planetary',
    description: 'Jupiter closest to Earth. Moons visible in binoculars.',
    atpReward: 75,
    icon: '🪐',
  },
  {
    id: 'e2',
    name: 'Annular Solar Eclipse',
    date: '2026-02-17',
    type: 'eclipse',
    description: 'Ring of fire from Antarctica & S. America.',
    atpReward: 120,
    icon: '🌗',
  },
  {
    id: 'e3',
    name: 'Total Lunar Eclipse',
    date: '2026-03-03',
    type: 'eclipse',
    description: 'Blood Moon visible Americas, Europe, Africa.',
    atpReward: 100,
    icon: '🌑',
  },
  {
    id: 'e5',
    name: 'Comet C/2026 A1',
    date: '2026-04-15',
    type: 'comet',
    description: 'New comet at perihelion. Potentially naked-eye.',
    atpReward: 200,
    icon: '💫',
  },
  {
    id: 'e4',
    name: 'Lyrid Meteor Shower',
    date: '2026-04-22',
    type: 'meteor',
    description: '20/hr from Comet Thatcher. Best after midnight.',
    atpReward: 50,
    icon: '☄️',
  },
  {
    id: 'e6',
    name: 'Mercury Greatest Elongation',
    date: '2026-05-31',
    type: 'planetary',
    description: 'Best evening view of Mercury this year.',
    atpReward: 40,
    icon: '🌟',
  },
  {
    id: 'e7',
    name: 'Saturn at Opposition',
    date: '2026-07-18',
    type: 'planetary',
    description: "Rings at max tilt. Decade's best view.",
    atpReward: 75,
    icon: '🪐',
  },
  {
    id: 'e8',
    name: 'Perseid Meteor Shower',
    date: '2026-08-12',
    type: 'meteor',
    description: 'Best annual shower. 100/hr from Swift-Tuttle.',
    atpReward: 50,
    icon: '☄️',
  },
  {
    id: 'e9',
    name: 'Partial Solar Eclipse',
    date: '2026-08-12',
    type: 'eclipse',
    description: 'Partial eclipse northern hemisphere.',
    atpReward: 90,
    icon: '🌗',
  },
  {
    id: 'e15',
    name: 'Total Solar Eclipse',
    date: '2026-08-12',
    type: 'eclipse',
    description: 'Totality across Greenland, Iceland, Spain.',
    atpReward: 150,
    icon: '🌑',
  },
  {
    id: 'e10',
    name: 'Mars-Jupiter Conjunction',
    date: '2026-08-27',
    type: 'conjunction',
    description: '0.3° apart in predawn sky.',
    atpReward: 80,
    icon: '✨',
  },
  {
    id: 'e11',
    name: 'Neptune at Opposition',
    date: '2026-09-23',
    type: 'planetary',
    description: 'Neptune at closest. Telescope required.',
    atpReward: 60,
    icon: '🪐',
  },
  {
    id: 'e12',
    name: 'Orionid Meteor Shower',
    date: '2026-10-21',
    type: 'meteor',
    description: "Halley's debris. Fast with persistent trains.",
    atpReward: 45,
    icon: '☄️',
  },
  {
    id: 'e13',
    name: 'Uranus at Opposition',
    date: '2026-11-25',
    type: 'planetary',
    description: 'Blue-green dot visible in binoculars.',
    atpReward: 55,
    icon: '🪐',
  },
  {
    id: 'e14',
    name: 'Geminid Meteor Shower',
    date: '2026-12-14',
    type: 'meteor',
    description: 'King of showers. 150 multicolored/hr.',
    atpReward: 60,
    icon: '☄️',
  },
];

const startOfDay = (d: Date): Date => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const upcomingEvents = (now: Date = new Date()): CelestialEvent[] =>
  EVENTS_2026.filter((e) => new Date(e.date) >= startOfDay(now));

export const nextEvent = (now: Date = new Date()): CelestialEvent | undefined =>
  upcomingEvents(now)[0];
