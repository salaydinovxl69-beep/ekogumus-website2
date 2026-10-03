/* Мета-теги страницы: title, description, canonical, hreflang, Open Graph.
   Одна функция для пререндера (scripts/prerender.mjs через entry-server)
   и для обновления <head> при переходах внутри сайта (usePageMeta). */
import type { Language } from "./i18n";
import type { TranslationKeys } from "./translations";
import { LANGS, SITE_URL, localePath } from "./routing";

export interface PageHead {
  lang: Language;
  title: string;
  description: string;
  canonical: string;
  alternates: { hreflang: string; href: string }[];
}

const OG_LOCALE: Record<Language, string> = { ru: "ru_RU", uz: "uz_UZ", en: "en_US" };

export function pageHead(page: string, lang: Language, t: TranslationKeys): PageHead {
  const key = (page === "/" ? "home" : page.slice(1)) as keyof TranslationKeys["pageMeta"];
  const meta = t.pageMeta[key] ?? t.pageMeta.home;
  const alternates: PageHead["alternates"] = LANGS.map((l) => ({ hreflang: l, href: SITE_URL + localePath(page, l) }));
  alternates.push({ hreflang: "x-default", href: SITE_URL + localePath(page, "ru") });
  return {
    lang,
    title: meta.title,
    description: meta.description,
    canonical: SITE_URL + localePath(page, lang),
    alternates,
  };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Теги для вставки в <head> пререндеренной страницы. */
export function headTags(h: PageHead): string {
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${h.canonical}" />`,
    ...h.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
    `<meta property="og:url" content="${h.canonical}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[h.lang]}" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
  ].join("\n    ");
}

/** Обновление <head> в браузере при переходе между страницами. */
export function applyHead(h: PageHead) {
  document.title = h.title;
  const setMeta = (sel: string, attr: "name" | "property", key: string, val: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(sel);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = val;
  };
  setMeta('meta[name="description"]', "name", "description", h.description);
  setMeta('meta[property="og:url"]', "property", "og:url", h.canonical);
  setMeta('meta[property="og:title"]', "property", "og:title", h.title);
  setMeta('meta[property="og:description"]', "property", "og:description", h.description);
  setMeta('meta[property="og:locale"]', "property", "og:locale", OG_LOCALE[h.lang]);
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", h.title);
  setMeta('meta[name="twitter:description"]', "name", "twitter:description", h.description);

  let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement("link");
    canon.rel = "canonical";
    document.head.appendChild(canon);
  }
  canon.href = h.canonical;
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  for (const a of h.alternates) {
    const l = document.createElement("link");
    l.rel = "alternate";
    l.hreflang = a.hreflang;
    l.href = a.href;
    document.head.appendChild(l);
  }
}
