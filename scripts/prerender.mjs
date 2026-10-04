/* Пререндер: после `vite build` (клиент) и `vite build --ssr` (entry-server)
   создаёт готовый HTML для каждой страницы на каждом языке:
     /            → dist/index.html        /uz          → dist/uz.html
     /products    → dist/products.html     /uz/products → dist/uz/products.html
   Cloudflare (assets, html_handling по умолчанию) отдаёт /uz/products из
   uz/products.html без редиректа. Плюс sitemap.xml со связями hreflang. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, LANGS, PAGES, SITE_URL, localePath } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
for (const marker of ["<!--app-head-->", "<!--app-html-->", "<!--home-preload-start-->"]) {
  if (!template.includes(marker)) throw new Error(`index.html: нет метки ${marker}`);
}

const outFile = (url) => (url === "/" ? "index.html" : url.slice(1) + ".html");

let count = 0;
for (const lang of LANGS) {
  for (const page of PAGES) {
    const url = localePath(page, lang);
    const { html, head } = await render(url);
    let doc = template
      .replace('<html lang="ru">', `<html lang="${lang}">`)
      .replace("<!--app-head-->", head)
      .replace("<!--app-html-->", html);
    // preload фото первого экрана нужен только на главной
    if (page !== "/") doc = doc.replace(/<!--home-preload-start-->[\s\S]*?<!--home-preload-end-->/, "");
    const file = path.join(dist, outFile(url));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, doc);
    count++;
  }
}

const today = new Date().toISOString().slice(0, 10);
const PRIORITY = { "/": "1.0", "/products": "0.9", "/about": "0.8", "/cooperation": "0.8", "/contacts": "0.8", "/news": "0.7" };
const urls = [];
for (const page of PAGES) {
  const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localePath(page, l)}" />`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath(page, "ru")}" />`)
    .join("\n");
  for (const lang of LANGS) {
    urls.push(`  <url>
    <loc>${SITE_URL}${localePath(page, lang)}</loc>
${alts}
    <lastmod>${today}</lastmod>
    <priority>${PRIORITY[page]}</priority>
  </url>`);
  }
}
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`
);

/* CSP: sha256 встроенного скрипта темы (index.html) — в dist/_headers */
const headersFile = path.join(dist, "_headers");
const inline = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (inline.length !== 1) throw new Error(`prerender: ожидался 1 встроенный <script> в index.html, найдено ${inline.length} — обновите CSP в public/_headers`);
const themeHash = "sha256-" + createHash("sha256").update(inline[0]).digest("base64");
const headers = fs.readFileSync(headersFile, "utf8");
if (!headers.includes("__THEME_SCRIPT_HASH__")) throw new Error("prerender: в _headers нет __THEME_SCRIPT_HASH__");
fs.writeFileSync(headersFile, headers.replace("__THEME_SCRIPT_HASH__", themeHash));

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${count} pages, sitemap with ${urls.length} URLs.`);
