/**
 * Astra Vault design tokens.
 * Source of truth: astra-vault-handoff/DESIGN_TOKENS.md.
 * The values here are canonical — match the v5 prototype's pixel-for-pixel feel.
 */

export const colors = {
  appBg: '#02030b',
  cardBg: 'rgba(255,255,255,0.02)',
  cardBgHover: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.04)',
  headerBg: 'rgba(2,3,11,0.85)',
  navBg: 'rgba(2,3,11,0.90)',
  modalOverlay: 'rgba(0,0,0,0.70)',
  scannerClear: 'rgba(2,3,10,0.97)',
  starFieldFade: 'rgba(2,3,11,0.1)',

  text: {
    primary: '#E8ECF4',
    secondary: '#E0E6F0',
    muted: 'rgba(200,210,225,0.7)',
    dim: 'rgba(180,195,220,0.5)',
    ghost: 'rgba(160,180,210,0.4)',
    whisper: 'rgba(160,180,210,0.25)',
    label: 'rgba(160,180,210,0.5)',
  },

  accent: {
    blue: '#60A5FA',
    blueGlow: 'rgba(96,165,250,0.4)',
    purple: '#C084FC',
    purpleGlow: 'rgba(192,132,252,0.35)',
    gold: '#FBBF24',
    goldGlow: 'rgba(251,191,36,0.4)',
    green: '#4ADE80',
    greenGlow: 'rgba(74,222,128,0.3)',
    red: '#FF4444',
    redSoft: '#FF6B6B',
    orange: '#FF8844',
    piPurple: '#A78BFA',
    piBlue: '#3B82F6',
  },
} as const;

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const rarity: Record<Rarity, { color: string; glow: string; bg: string; label: string }> = {
  common: {
    color: '#8B9BB4',
    glow: 'rgba(139,155,180,0.25)',
    bg: 'rgba(139,155,180,0.06)',
    label: 'COMMON',
  },
  uncommon: {
    color: '#4ADE80',
    glow: 'rgba(74,222,128,0.25)',
    bg: 'rgba(74,222,128,0.06)',
    label: 'UNCOMMON',
  },
  rare: {
    color: '#60A5FA',
    glow: 'rgba(96,165,250,0.30)',
    bg: 'rgba(96,165,250,0.07)',
    label: 'RARE',
  },
  epic: {
    color: '#C084FC',
    glow: 'rgba(192,132,252,0.35)',
    bg: 'rgba(192,132,252,0.07)',
    label: 'EPIC',
  },
  legendary: {
    color: '#FBBF24',
    glow: 'rgba(251,191,36,0.40)',
    bg: 'rgba(251,191,36,0.08)',
    label: 'LEGENDARY',
  },
};

export const starColors = {
  sirius: '#A8C8FF',
  betelgeuse: '#FF6B4A',
  vega: '#C8DBFF',
  rigel: '#B4D4FF',
  arcturus: '#FFB86B',
  polaris: '#FFF4D4',
  antares: '#FF4444',
  deneb: '#E8F0FF',
  aldebaran: '#FF9E5E',
  etaCarinae: '#FFD700',
} as const;

export const typography = {
  fonts: {
    heading: 'PlayfairDisplay_700Bold',
    headingDisplay: 'PlayfairDisplay_900Black',
    body: 'CrimsonPro_400Regular',
    bodyBold: 'CrimsonPro_600SemiBold',
    bodyItalic: 'CrimsonPro_400Regular_Italic',
    mono: 'DMMono_400Regular',
    monoMedium: 'DMMono_500Medium',
    monoLight: 'DMMono_300Light',
  },
  webFallback: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Crimson Pro', Georgia, serif",
    mono: "'DM Mono', ui-monospace, monospace",
  },
  size: {
    appTitle: 12,
    sectionHeader: 22,
    objectName: 18,
    body: 13,
    lore: 12,
    label: 10,
    tiny: 9,
    micro: 7,
    dataLarge: 48,
    dataMedium: 22,
    dataSmall: 13,
    button: 11,
  },
  letterSpacing: {
    title: 4,
    label: 2,
    button: 1,
  },
  lineHeight: {
    body: 1.7,
    lore: 1.8,
  },
} as const;

export const spacing = {
  pageX: 16,
  pageY: 14,
  cardPadding: 16,
  cardGap: 10,
  sectionGap: 14,
  buttonX: 14,
  buttonY: 10,
  pillX: 10,
  pillY: 4,
  headerHeight: 44,
  navHeight: 52,
  minTouchTarget: 44,
} as const;

export const radii = {
  card: 12,
  cardLarge: 14,
  button: 8,
  pill: 16,
  pillLarge: 20,
  badge: 10,
  progressBar: 2,
} as const;

export const motion = {
  duration: {
    fast: 150,
    base: 200,
    slow: 400,
    transition: 250,
    progressBar: 500,
  },
  toast: {
    dismissAfter: 2200,
  },
  observerCounter: {
    intervalMs: 3000,
    variance: 30,
  },
  starField: {
    starCount: 180,
    trailAlpha: 0.1,
  },
} as const;

export const shadow = {
  cardHover: (rarityColor: string) => ({
    shadowColor: rarityColor,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  }),
  logo: {
    shadowColor: colors.accent.blue,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
} as const;
