/**
 * NASA SkyView Virtual Observatory image URL builder.
 *
 * The SkyView CGI accepts an RA/Dec position plus a survey name and returns
 * imagery (or an HTML wrapper around imagery for some surveys). For v0.1 we
 * build the request URL and hand it to react-native's `<Image>` — the
 * underlying loader (native or `<img>` on web) follows redirects naturally.
 *
 * Reference: https://skyview.gsfc.nasa.gov/current/help/
 */

const SKYVIEW_BASE_URL =
  'https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl';

export interface SkyViewSurvey {
  id: string;
  label: string;
  apiName: string;
  accentColor: string;
  /** Electromagnetic band this survey samples. */
  spectrum: 'Optical' | 'Infrared' | 'X-Ray' | 'Radio' | 'Gamma-Ray';
}

export const SURVEYS: SkyViewSurvey[] = [
  {
    id: 'optical-dss2-red',
    label: 'Optical',
    apiName: 'DSS2 Red',
    accentColor: '#FBBF24',
    spectrum: 'Optical',
  },
  {
    id: 'ir-near-2mass-j',
    label: 'Infrared (Near-IR)',
    apiName: '2MASS-J',
    accentColor: '#FF6B4A',
    spectrum: 'Infrared',
  },
  {
    id: 'ir-mid-wise-3p4',
    label: 'Infrared (Mid-IR)',
    apiName: 'WISE 3.4',
    accentColor: '#FF8844',
    spectrum: 'Infrared',
  },
  {
    id: 'xray-rass-cnt-broad',
    label: 'X-Ray',
    apiName: 'RASS-Cnt Broad',
    accentColor: '#C084FC',
    spectrum: 'X-Ray',
  },
  {
    id: 'radio-nvss',
    label: 'Radio',
    apiName: 'NVSS',
    accentColor: '#60A5FA',
    spectrum: 'Radio',
  },
  {
    id: 'gamma-fermi-5',
    label: 'Gamma-Ray',
    apiName: 'Fermi 5',
    accentColor: '#4ADE80',
    spectrum: 'Gamma-Ray',
  },
];

/** Default to optical DSS2 Red — the most visually familiar of the surveys. */
export const defaultSurvey: SkyViewSurvey = SURVEYS[0] as SkyViewSurvey;

export interface SkyViewImageUrlParams {
  ra: number;
  dec: number;
  surveyApiName: string;
  /** Output image pixel dimensions (square). Default 400. */
  pixels?: number;
  /** Field of view in degrees. Default 0.5. */
  sizeDegrees?: number;
}

/**
 * Build a SkyView image request URL. Pure — does no network I/O.
 *
 * `Position` is `<ra>,<dec>` in degrees. `Return=JPEG` asks SkyView to return
 * a JPEG (either directly, or via an HTML wrapper that the browser/RN Image
 * loader can follow).
 */
export const skyViewImageUrl = (params: SkyViewImageUrlParams): string => {
  const {
    ra,
    dec,
    surveyApiName,
    pixels = 400,
    sizeDegrees = 0.5,
  } = params;

  const qs = new URLSearchParams({
    Position: `${ra},${dec}`,
    Survey: surveyApiName,
    Return: 'JPEG',
    Pixels: String(pixels),
    Size: String(sizeDegrees),
  });

  return `${SKYVIEW_BASE_URL}?${qs.toString()}`;
};
