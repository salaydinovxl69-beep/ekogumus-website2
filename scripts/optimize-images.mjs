import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public', 'images');

const originalsDir = path.join(publicDir, 'originals');
const optimizedOut = path.join(publicDir, 'optimized');

// Логотипы шапки/футера: рендерятся до 70px, поэтому 80 (1x) и 160 (2x).
const logoWidths = [80, 160];
const logoFiles = [
  { src: 'logo.png', out: 'logo' },
  { src: 'Logo_1.png', out: 'logo_1' },
];

/* Контентные изображения: единый источник правды — utils/optimized-images.json.
   Тот же манифест импортируется utils/img.ts для построения srcset,
   поэтому имена/ширины файлов гарантированно совпадают с разметкой. */
const manifest = JSON.parse(
  await readFile(path.join(root, 'utils', 'optimized-images.json'), 'utf8')
);

const QUALITY = { webp: 82, avif: 62 };

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

/* Кэш по содержимому: готовые файлы лежат в репозитории (public/images/optimized),
   а scripts/image-cache.json хранит для каждого отпечаток исходника и параметров.
   Файл пересоздаётся, только если изменился исходник или настройки сжатия, —
   поэтому сборка на Cloudflare не пережимает 150+ картинок каждый раз.
   (mtime для этого не годится: после git clone у всех файлов дата клонирования.) */
const cachePath = path.join(root, 'scripts', 'image-cache.json');
const cache = existsSync(cachePath) ? JSON.parse(await readFile(cachePath, 'utf8')) : {};
const nextCache = {};
const srcHashes = new Map();

async function srcHash(input) {
  if (!srcHashes.has(input)) {
    srcHashes.set(input, createHash('sha1').update(await readFile(input)).digest('hex'));
  }
  return srcHashes.get(input);
}

/** true — файл актуален и пересоздавать не нужно. */
async function isFresh(outFile, input, params) {
  const key = path.relative(optimizedOut, outFile).split(path.sep).join('/');
  const sig = createHash('sha1').update((await srcHash(input)) + JSON.stringify(params)).digest('hex');
  nextCache[key] = sig;
  return cache[key] === sig && existsSync(outFile);
}

async function generateContentImages() {
  await ensureDir(optimizedOut);
  let made = 0;
  for (const [base, def] of Object.entries(manifest)) {
    const input = path.join(originalsDir, def.src);
    if (!existsSync(input)) {
      console.warn('Source not found, skipping:', def.src);
      continue;
    }
    const formats = def.formats ?? ['avif', 'webp'];
    for (const width of def.widths) {
      for (const fmt of formats) {
        const outFile = path.join(optimizedOut, `${base}-${width}.${fmt}`);
        if (await isFresh(outFile, input, { width, fmt, q: QUALITY[fmt] })) continue;
        const pipeline = sharp(input).resize({ width, withoutEnlargement: true });
        if (fmt === 'webp') pipeline.webp({ quality: QUALITY.webp });
        else pipeline.avif({ quality: QUALITY.avif });
        await pipeline.toFile(outFile);
        console.log(`${base}-${width}.${fmt}`);
        made++;
      }
    }
  }
  return made;
}

/* Слайды презентации NANOECOVERM: PNG ~0.5–1.6 МБ каждый → WebP (~70–150 КБ).
   Слайды BIOGUMUS уже в WebP — их не трогаем. */
async function generatePresentationSlides() {
  const slidesIn = path.join(publicDir, 'presentations', 'nanoecoverm');
  const slidesOut = path.join(optimizedOut, 'presentations', 'nanoecoverm');
  if (!existsSync(slidesIn)) {
    console.warn('Presentation dir not found, skipping:', slidesIn);
    return 0;
  }
  await ensureDir(slidesOut);
  let made = 0;
  for (let n = 1; ; n++) {
    const input = path.join(slidesIn, `slide_${n}.png`);
    if (!existsSync(input)) break;
    const outFile = path.join(slidesOut, `slide_${n}.webp`);
    if (await isFresh(outFile, input, { width: 1280, q: QUALITY.webp })) continue;
    await sharp(input)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: QUALITY.webp })
      .toFile(outFile);
    console.log(`presentations/nanoecoverm/slide_${n}.webp`);
    made++;
  }
  return made;
}

async function generateLogos() {
  await ensureDir(optimizedOut);
  let made = 0;
  for (const { src, out } of logoFiles) {
    const input = path.join(originalsDir, src);
    if (!existsSync(input)) {
      console.warn('Logo source not found, skipping:', input);
      continue;
    }
    for (const width of logoWidths) {
      const outFile = path.join(optimizedOut, `${out}-${width}.webp`);
      if (await isFresh(outFile, input, { width, q: 90, logo: true })) continue;
      await sharp(input)
        .resize(width, width, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(outFile);
      console.log(`${out}-${width}.webp`);
      made++;
    }
  }
  return made;
}

/* Картинка для превью ссылок (og:image / twitter:image): 1200×630 JPEG —
   стандартный размер для Telegram, WhatsApp, Facebook; JPEG понимают все. */
async function generateOgImage() {
  await ensureDir(optimizedOut);
  const input = path.join(originalsDir, 'Products.png');
  const outFile = path.join(optimizedOut, 'og-image.jpg');
  if (await isFresh(outFile, input, { og: '1200x630', q: 84 })) return 0;
  await sharp(input)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .flatten({ background: '#F3ECDD' })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outFile);
  console.log('og-image.jpg');
  return 1;
}

const counts = [];
counts.push(await generateOgImage());
counts.push(await generateLogos());
counts.push(await generateContentImages());
counts.push(await generatePresentationSlides());
const total = counts.reduce((a, b) => a + b, 0);
await writeFile(cachePath, JSON.stringify(nextCache, null, 2) + '\n');
console.log(total ? `Image optimization complete: ${total} file(s) generated.` : 'Image optimization: everything up to date.');
