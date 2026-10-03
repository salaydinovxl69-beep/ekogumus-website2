import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { stripLang } from '../utils/routing';
import { applyHead, pageHead } from '../utils/seo';

/* title/description/canonical/hreflang текущей страницы и языка.
   В пререндеренном HTML они уже есть; здесь — для переходов внутри сайта. */
export function usePageMeta() {
  const { t, language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    applyHead(pageHead(stripLang(location.pathname), language, t));
  }, [location.pathname, language, t]);
}
