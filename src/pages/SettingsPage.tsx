import { useState } from 'react';
import { Check } from 'lucide-react';
import Alert from '@/components/Alert';
import { usePreferences } from '@/context/PreferencesContext';
import { ApiError } from '@/lib/api';
import { LANGUAGES, THEMES, type ThemeId } from '@/lib/themes';
import type { LanguageCode } from '@/lib/i18n';

export default function SettingsPage() {
  const { theme, language, setTheme, setLanguage, t } = usePreferences();
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const handleTheme = async (next: ThemeId) => {
    try {
      await setTheme(next);
      setMessage({ tone: 'success', text: t('themeSaved') });
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not save your appearance.' });
    }
  };

  const handleLanguage = async (next: LanguageCode) => {
    try {
      await setLanguage(next);
      setMessage({ tone: 'success', text: t('languageSaved') });
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not save your language.' });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-semibold">{t('theme')} &amp; {t('language')}</h1>
        <p className="mt-2 text-muted">Choose how TimeBank looks and which language it speaks.</p>
      </header>

      {message && <Alert tone={message.tone} message={message.text} />}

      <section className="space-y-5">
        <h2 className="text-2xl">{t('theme')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THEMES.map((option) => {
            const selected = option.id === theme;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleTheme(option.id)}
                aria-pressed={selected}
                className={`group relative overflow-hidden rounded-[1.5rem] border-2 p-4 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lift ${selected ? 'border-ink' : 'border-transparent'}`}
              >
                <span className="block h-20 rounded-2xl" style={{ backgroundColor: option.swatch }} />
                <span className="mt-3 flex items-center justify-between gap-2 text-sm font-bold">
                  {option.name}
                  {selected && <Check className="h-4 w-4" />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl">{t('language')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LANGUAGES.map((option) => {
            const selected = option.code === language;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleLanguage(option.code)}
                aria-pressed={selected}
                className={`flex items-center justify-between rounded-2xl border-2 bg-surface px-5 py-4 font-semibold shadow-soft transition hover:-translate-y-0.5 ${selected ? 'border-ink' : 'border-transparent'}`}
              >
                {option.label}
                {selected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
