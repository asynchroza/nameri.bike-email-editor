/**
 * Maps language codes to country codes
 */
export function inferCountryFromLanguage(language: string): string | null {
  const LANGUAGE_TO_COUNTRY_MAP: Record<string, string> = {
    bg: 'BG', // Bulgaria
    el: 'GR', // Greece
    mk: 'MK', // North Macedonia
    sq: 'AL', // Albania
    tr: 'TR', // Turkey
    ro: 'RO', // Romania
    sr: 'RS', // Serbia
    bs: 'BA', // Bosnia and Herzegovina
    hr: 'HR', // Croatia
    hu: 'HU', // Hungary
    sk: 'SK', // Slovakia
    sl: 'SI', // Slovenia
    de: 'DE', // Germany
    pl: 'PL', // Poland
    cs: 'CZ', // Czechia
    it: 'IT', // Italy
    fr: 'FR', // France
    es: 'ES', // Spain
    pt: 'PT', // Portugal
    nl: 'NL', // Netherlands
    lt: 'LT', // Lithuania
    lv: 'LV', // Latvia
    et: 'EE', // Estonia
  };

  return LANGUAGE_TO_COUNTRY_MAP[language.toLowerCase()] || null;
}

/**
 * Country code to country name mapping
 */
const COUNTRY_NAMES: Record<string, string> = {
  BG: 'Bulgaria',
  GR: 'Greece',
  MK: 'North Macedonia',
  AL: 'Albania',
  TR: 'Turkey',
  RO: 'Romania',
  RS: 'Serbia',
  BA: 'Bosnia and Herzegovina',
  HR: 'Croatia',
  HU: 'Hungary',
  SK: 'Slovakia',
  SI: 'Slovenia',
  DE: 'Germany',
  PL: 'Poland',
  CZ: 'Czechia',
  IT: 'Italy',
  FR: 'France',
  ES: 'Spain',
  PT: 'Portugal',
  NL: 'Netherlands',
  LT: 'Lithuania',
  LV: 'Latvia',
  EE: 'Estonia',
};

/**
 * Get country name from country code
 */
export function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode] || countryCode;
}

/**
 * Available country codes for selection
 */
export const COUNTRY_OPTIONS = Object.keys(COUNTRY_NAMES).map((code) => ({
  code,
  name: COUNTRY_NAMES[code],
}));

/**
 * Available language codes
 */
export const LANGUAGE_OPTIONS = [
  { code: 'bg', name: 'Bulgarian' },
  { code: 'el', name: 'Greek' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'sq', name: 'Albanian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ro', name: 'Romanian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'de', name: 'German' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'it', name: 'Italian' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'et', name: 'Estonian' },
];
