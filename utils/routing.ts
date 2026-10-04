/* Языковые адреса сайта: русский — без префикса (/products),
   узбекский и английский — с префиксом (/uz/products, /en/products).
   Один и тот же список используется приложением, пререндером и sitemap. */
import type { Language } from "./i18n";

export const SITE_URL = "https://ecogumus.com";

export const LANGS: Language[] = ["ru", "uz", "en"];

/** Страницы сайта без языкового префикса. */
export const PAGES = ["/", "/products", "/about", "/cooperation", "/news", "/contacts"] as const;

/** Язык по адресу: /uz/... → uz, /en/... → en, всё остальное → ru. */
export function langFromPath(pathname: string): Language {
  const seg = pathname.split("/")[1];
  return seg === "uz" || seg === "en" ? seg : "ru";
}

/** Адрес без языкового префикса: /uz/products → /products, /en → /. */
export function stripLang(pathname: string): string {
  const lang = langFromPath(pathname);
  if (lang === "ru") return pathname || "/";
  const rest = pathname.slice(lang.length + 1);
  return rest === "" ? "/" : rest;
}

/** Адрес страницы на нужном языке: ("/products", "uz") → /uz/products. */
export function localePath(path: string, lang: Language): string {
  // Обратные и повторные слэши в начале («/\\evil.com», «//evil.com») браузер
  // может понять как адрес другого сайта — сводим к одному «/» (защита от
  // открытого редиректа: путь берётся в том числе из адресной строки)
  const clean = "/" + path.replace(/\\/g, "/").replace(/^\/+/, "");
  if (lang === "ru") return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}
