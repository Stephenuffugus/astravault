/**
 * CDS HiPS (Hierarchical Progressive Survey) catalog mapping.
 *
 * HiPS is the VO-standard tile scheme for zoomable all-sky imagery. Aladin
 * Lite v3 loads any survey by its CDS-registered ID (e.g., `P/DSS2/color`).
 *
 * Survey listing: https://aladin.cds.unistra.fr/hips/list
 *
 * The accent colors mirror the bands already used in `services/apis/skyView.ts`
 * so the WebView Deep Zoom mode is visually continuous with the static-image
 * Multi-Spectrum View.
 */

export interface HipsSurvey {
  /** Canonical CDS HiPS survey identifier. */
  id: string;
  /** Human-readable label for the survey button/pill. */
  label: string;
  /** Electromagnetic band — informational, for the caption row. */
  spectrum:
    | 'Optical'
    | 'Near-IR'
    | 'Mid-IR'
    | 'Far-IR'
    | 'X-Ray'
    | 'Radio';
  /** Hex accent — matches `skyView.ts` SURVEYS for visual continuity. */
  accentColor: string;
  /** Required UI attribution string per CDS / data-provider licenses. */
  attribution: string;
}

export const HIPS_SURVEYS: HipsSurvey[] = [
  {
    id: 'P/DSS2/color',
    label: 'Optical (DSS2 Color)',
    spectrum: 'Optical',
    accentColor: '#FBBF24',
    attribution: 'CDS / DSS2',
  },
  {
    id: 'P/2MASS/color',
    label: 'Near-IR (2MASS Color)',
    spectrum: 'Near-IR',
    accentColor: '#FF6B4A',
    attribution: 'CDS / 2MASS',
  },
  {
    id: 'P/allWISE/color',
    label: 'Mid-IR (AllWISE Color)',
    spectrum: 'Mid-IR',
    accentColor: '#FF8844',
    attribution: 'CDS / NASA WISE',
  },
  {
    id: 'P/AKARI/FIS/Color',
    label: 'Far-IR (AKARI FIS)',
    spectrum: 'Far-IR',
    accentColor: '#A78BFA',
    attribution: 'CDS / JAXA AKARI',
  },
  {
    id: 'P/RASS',
    label: 'X-Ray (RASS)',
    spectrum: 'X-Ray',
    accentColor: '#C084FC',
    attribution: 'CDS / MPE ROSAT',
  },
  {
    id: 'P/NVSS',
    label: 'Radio (NVSS)',
    spectrum: 'Radio',
    accentColor: '#60A5FA',
    attribution: 'CDS / NRAO NVSS',
  },
];

/** Default to DSS2 color — the most visually familiar all-sky survey. */
export const defaultHipsSurvey: HipsSurvey = HIPS_SURVEYS[0] as HipsSurvey;

/**
 * Map a SkyView survey `apiName` (from `services/apis/skyView.ts`) to its
 * closest HiPS-survey equivalent. Falls back to DSS2 Color if no match.
 */
export const hipsSurveyForSkyViewApiName = (apiName: string): HipsSurvey => {
  const lookup: Record<string, string> = {
    'DSS2 Red': 'P/DSS2/color',
    '2MASS-J': 'P/2MASS/color',
    'WISE 3.4': 'P/allWISE/color',
    'RASS-Cnt Broad': 'P/RASS',
    NVSS: 'P/NVSS',
    'Fermi 5': 'P/AKARI/FIS/Color', // Fermi has no widely-served HiPS; fall back to AKARI FIR.
  };
  const id = lookup[apiName] ?? 'P/DSS2/color';
  return HIPS_SURVEYS.find((s) => s.id === id) ?? defaultHipsSurvey;
};
