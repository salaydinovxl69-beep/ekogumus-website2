/* Дата новости на языке сайта. Своё форматирование вместо toLocaleDateString:
   у браузеров (и Node при пререндере) разный набор локалей — для uz, например,
   Chromium выдаёт «2025 M09 15», а Node — «15-sentabr, 2025». Из-за этого текст
   расходился с пререндеренным HTML. Здесь результат одинаков везде. */
import type { Language } from "./i18n";

const MONTHS: Record<Language, string[]> = {
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** "2025-09-15" → «15 сентября 2025 г.» / «15-sentabr, 2025» / «September 15, 2025» */
export function formatDate(iso: string, lang: Language): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS[lang][m - 1];
  if (lang === "ru") return `${d} ${month} ${y} г.`;
  if (lang === "uz") return `${d}-${month}, ${y}`;
  return `${month} ${d}, ${y}`;
}
