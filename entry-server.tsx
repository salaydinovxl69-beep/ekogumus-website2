/* Пререндер: отрисовка страницы в HTML при сборке (см. scripts/prerender.mjs).
   renderToString не ждёт lazy-страницы под Suspense: первый проход запускает
   их загрузку (в HTML — скелетон), следующий, после загрузки модулей, отдаёт
   полный текст. Потоковый renderToPipeableStream не используем: на стыках
   кусков он портил кириллицу (\0 в тексте). */
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { ru } from "./utils/translations/ru";
import { uz } from "./utils/translations/uz";
import { en } from "./utils/translations/en";
import { langFromPath, stripLang } from "./utils/routing";
import { headTags, pageHead } from "./utils/seo";
import type { TranslationKeys } from "./utils/translations";

export { LANGS, PAGES, SITE_URL, localePath } from "./utils/routing";

// uz/en по структуре совпадают с ru (тип словаря выводится из ru.ts)
const DICTS = { ru, uz, en } as unknown as Record<"ru" | "uz" | "en", TranslationKeys>;
const SKELETON = "animate-pulse";

export async function render(url: string): Promise<{ html: string; head: string; lang: string }> {
  const lang = langFromPath(url);
  const t = DICTS[lang];
  const head = headTags(pageHead(stripLang(url), lang, t));
  const once = () =>
    renderToString(
      <React.StrictMode>
        <StaticRouter location={url}>
          <App initialDicts={{ [lang]: t }} />
        </StaticRouter>
      </React.StrictMode>
    );
  let html = once();
  for (let i = 0; i < 10 && html.includes(SKELETON); i++) {
    await new Promise((r) => setTimeout(r, 20));
    html = once();
  }
  if (html.includes(SKELETON)) throw new Error(`prerender ${url}: страница не загрузилась`);
  return { html, head, lang };
}
