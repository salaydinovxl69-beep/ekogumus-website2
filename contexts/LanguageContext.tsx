import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language } from '../utils/i18n';
import type { TranslationKeys } from '../utils/translations';
import { langFromPath, localePath, stripLang } from '../utils/routing';

export async function loadTranslation(lang: Language): Promise<TranslationKeys> {
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

const STORAGE_KEY = 'ekogumus-language';

function readStoredLanguage(): Language | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ru' || stored === 'uz' || stored === 'en') return stored;
  } catch {
    // localStorage недоступен (приватный режим и т.п.)
  }
  return null;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Адрес страницы на текущем языке: lp("/products") → /uz/products */
  lp: (path: string) => string;
  t: TranslationKeys;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  /** Словари, уже загруженные до первого рендера (пререндер и гидратация),
      чтобы первая отрисовка совпала с HTML с сервера без спиннера. */
  initialDicts?: Partial<Record<Language, TranslationKeys>>;
}

/* Язык берётся из адреса (/uz/..., /en/..., без префикса — русский), поэтому
   каждая языковая версия — отдельная индексируемая страница. Провайдер должен
   стоять внутри Router. */
export function LanguageProvider({ children, initialDicts = {} }: LanguageProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const language = langFromPath(location.pathname);

  const dicts = useRef<Partial<Record<Language, TranslationKeys>>>({ ...initialDicts });
  const [t, setT] = useState<TranslationKeys | null>(dicts.current[language] ?? null);
  const [loadedLang, setLoadedLang] = useState<Language | null>(dicts.current[language] ? language : null);

  useEffect(() => {
    if (loadedLang === language) return;
    let cancelled = false;
    const cached = dicts.current[language];
    if (cached) {
      setT(cached);
      setLoadedLang(language);
      return;
    }
    loadTranslation(language)
      .then((dict) => {
        dicts.current[language] = dict;
        if (!cancelled) {
          setT(dict);
          setLoadedLang(language);
        }
      })
      .catch((error) => console.error('Failed to load translations:', error));
    return () => {
      cancelled = true;
    };
  }, [language, loadedLang]);

  /* Остальные словари — заранее, в простое браузера, чтобы переключение
     языка было мгновенным (import() кэширует модуль) */
  useEffect(() => {
    const prefetch = () =>
      (['ru', 'uz', 'en'] as Language[]).forEach((l) => {
        if (!dicts.current[l]) void loadTranslation(l).then((d) => (dicts.current[l] = d)).catch(() => {});
      });
    if ('requestIdleCallback' in window) window.requestIdleCallback(prefetch);
    else setTimeout(prefetch, 1500);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /* Старые ссылки вида /?lang=uz и возврат на главную с ранее выбранным языком */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('lang');
    if (q === 'ru' || q === 'uz' || q === 'en') {
      params.delete('lang');
      const search = params.toString();
      navigate(localePath(stripLang(location.pathname), q) + (search ? `?${search}` : '') + location.hash, { replace: true });
      return;
    }
    const stored = readStoredLanguage();
    if (location.pathname === '/' && stored && stored !== 'ru') {
      navigate(localePath('/', stored), { replace: true });
    }
    // только при первом открытии сайта
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage недоступен
    }
    if (lang === language) return;
    navigate(localePath(stripLang(location.pathname), lang) + location.search + location.hash);
  };

  const lp = (path: string) => localePath(path, language);

  /* Спиннер только если словаря ещё нет совсем. При смене языка показываем
     прежний словарь, пока грузится новый: без размонтирования приложения. */
  if (!t) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-ekogumus-green/30 border-t-ekogumus-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, lp, t, isLoading: loadedLang !== language }}>
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
