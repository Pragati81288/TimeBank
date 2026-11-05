import type { LanguageCode } from './i18n';

export type ThemeId =
  | 'strawberry-milk'
  | 'lavender-dreams'
  | 'peach-blossom'
  | 'baby-blue'
  | 'mint-garden'
  | 'cream-minimal'
  | 'midnight-mode';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  swatch: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'strawberry-milk', name: 'Strawberry Milk', swatch: '#F7DDE8' },
  { id: 'lavender-dreams', name: 'Lavender Dreams', swatch: '#DDD5F5' },
  { id: 'peach-blossom', name: 'Peach Blossom', swatch: '#F9DCCB' },
  { id: 'baby-blue', name: 'Baby Blue', swatch: '#DCEBF5' },
  { id: 'mint-garden', name: 'Mint Garden', swatch: '#D6EFE2' },
  { id: 'cream-minimal', name: 'Cream Minimal', swatch: '#FFF9F2' },
  { id: 'midnight-mode', name: 'Midnight Mode', swatch: '#2A2330' },
];

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

export function isThemeId(value: string): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

const THEME_KEY = 'timebank.theme';
const LANGUAGE_KEY = 'timebank.language';

export function readStoredTheme(): ThemeId {
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored && isThemeId(stored) ? stored : 'strawberry-milk';
}

export function readStoredLanguage(): LanguageCode {
  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  return stored && isLanguageCode(stored) ? stored : 'en';
}

export function storePreferences(theme: ThemeId, language: LanguageCode) {
  window.localStorage.setItem(THEME_KEY, theme);
  window.localStorage.setItem(LANGUAGE_KEY, language);
}
