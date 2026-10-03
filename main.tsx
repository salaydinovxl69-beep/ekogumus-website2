import React from 'react';
declare module '*.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { loadTranslation } from './contexts/LanguageContext';
import { langFromPath } from './utils/routing';
import './styles/globals.css';
// «Земля и Зерно» earthy redesign — loaded after globals so its (unlayered)
// rules win over the legacy liquid-glass base styles.
import './styles/earthy.css';
import './styles/earthy-pages.css';
import './styles/earthy-dark.css';

// Self-hosted «Земля и Зерно» fonts (Spectral / Manrope / JetBrains Mono) —
// без render-blocking CSS с fonts.googleapis.com и двух внешних соединений.
// Начертания соответствуют прежнему Google Fonts URL; font-display: swap по умолчанию.
import '@fontsource/spectral/500.css';
import '@fontsource/spectral/600.css';
import '@fontsource/spectral/700.css';
import '@fontsource/spectral/500-italic.css';
import '@fontsource/spectral/600-italic.css';
import '@fontsource-variable/manrope'; // 400–800
import '@fontsource-variable/jetbrains-mono'; // 400–500
// Open Sans 400 — используется тостами (класс font-opensans на Toaster).
import '@fontsource/open-sans/400.css';

/* Язык — из адреса. Словарь грузим до первого рендера, чтобы он совпал
   с пререндеренным HTML: тогда React «оживляет» готовую разметку (hydrate),
   а не перерисовывает страницу. Без пререндера (vite dev) — обычный рендер. */
const rootEl = document.getElementById('root')!;
const lang = langFromPath(window.location.pathname);

loadTranslation(lang).then((dict) => {
  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <App initialDicts={{ [lang]: dict }} />
      </BrowserRouter>
    </React.StrictMode>
  );
  if (rootEl.firstElementChild) ReactDOM.hydrateRoot(rootEl, app);
  else ReactDOM.createRoot(rootEl).render(app);
});
