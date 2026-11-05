import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { translate, type LanguageCode, type TranslationKey } from '@/lib/i18n';
import { isLanguageCode, isThemeId, readStoredLanguage, readStoredTheme, storePreferences, type ThemeId } from '@/lib/themes';
import type { User } from '@/types';

interface PreferencesValue {
  theme: ThemeId;
  language: LanguageCode;
  setTheme: (theme: ThemeId) => Promise<void>;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuth();
  const [theme, setThemeState] = useState<ThemeId>(readStoredTheme);
  const [language, setLanguageState] = useState<LanguageCode>(readStoredLanguage);

  useEffect(() => {
    if (!user) return;
    if (isThemeId(user.theme)) setThemeState(user.theme);
    if (isLanguageCode(user.language)) setLanguageState(user.language);
  }, [user]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    storePreferences(theme, language);
  }, [theme, language]);

  const save = useCallback(async (nextTheme: ThemeId, nextLanguage: LanguageCode) => {
    if (!user) return;
    const updated = await apiRequest<User>('/users/me/settings', {
      method: 'PUT',
      body: { theme: nextTheme, language: nextLanguage },
    });
    setUser(updated);
  }, [user, setUser]);

  const setTheme = useCallback(async (next: ThemeId) => {
    setThemeState(next);
    await save(next, language);
  }, [save, language]);

  const setLanguage = useCallback(async (next: LanguageCode) => {
    setLanguageState(next);
    await save(theme, next);
  }, [save, theme]);

  const value = useMemo<PreferencesValue>(() => ({
    theme,
    language,
    setTheme,
    setLanguage,
    t: (key) => translate(language, key),
  }), [theme, language, setTheme, setLanguage]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside PreferencesProvider');
  return context;
}
