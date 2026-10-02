import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, defaultLanguage } from '../utils/i18n';
import type { TranslationKeys } from '../utils/translations';

async function loadTranslation(lang: Language): Promise<TranslationKeys> {
  switch (lang) {
    case 'uz':
      return (await import('../utils/translations/uz')).uz;
    case 'en':
      return (await import('../utils/translations/en')).en;
    case 'ru':
    default:
      return (await import('../utils/translations/ru')).ru;
  }
}

function detectInitialLanguage(): Language {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('ekogumus-language');
      if (stored && (stored === 'ru' || stored === 'uz' || stored === 'en')) {
        return stored as Language;
      }
    }
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
  }
  return defaultLanguage;
}

/* Старт загрузки словаря на module-scope — чанк перевода едет параллельно
   инициализации React, а не после первого рендера провайдера.
   import() кэширует модуль, поэтому повторный вызов в эффекте бесплатен. */
const initialLanguage = detectInitialLanguage();
void loadTranslation(initialLanguage).catch(() => {});

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const [t, setT] = useState<TranslationKeys | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadTranslation(language)
      .then((translations) => {
        if (!cancelled) {
          setT(translations);
          setIsLoading(false);
        }
      })
      .then(() => {
        /* Остальные словари — заранее, в простое браузера, чтобы переключение
           языка было мгновенным (import() кэширует модуль) */
        const others = (['ru', 'uz', 'en'] as Language[]).filter((l) => l !== language);
        const prefetch = () => others.forEach((l) => void loadTranslation(l).catch(() => {}));
        if ('requestIdleCallback' in window) window.requestIdleCallback(prefetch);
        else setTimeout(prefetch, 1500);
      })
      .catch((error) => {
        console.error('Failed to load translations:', error);
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('ekogumus-language', lang);
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  /* Спиннер только при первой загрузке. При смене языка показываем прежний
     словарь, пока грузится новый: иначе всё приложение размонтируется —
     мигание, сброс прокрутки и состояния страниц, будто страница перезагрузилась */
  if (!t) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-ekogumus-green/30 border-t-ekogumus-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
