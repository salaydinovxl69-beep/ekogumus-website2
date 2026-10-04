/* «Земля и Зерно» — News page (category filter + article modal). */
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { useScrollLock } from "../hooks/useScrollLock";
import { Language } from "../utils/i18n";
import { Icon } from "../components/eko/Icon";
import { Reveal, useFocusTrap } from "../components/eko/Reveal";
import { Eyebrow, Slot } from "../components/eko/primitives";
import { optimizedSources } from "../utils/img";

const IMG_BY_KEYWORD: Record<string, string> = {
  "factory production line": "/images/originals/news_content_5.jpg",
  "international shipping fertilizers": "/images/originals/news_card_img_1.jpg",
  "certificate quality standards": "/images/originals/news_card_img_2.jpg",
  "cotton field fertilizer": "/images/originals/news_card_img_3.png",
};

const LOCALE: Record<Language, string> = { ru: "ru-RU", uz: "uz-UZ", en: "en-US" };

export function NewsPage() {
  const { t, language, lp } = useLanguage();
  const navigate = useNavigate();
  usePageMeta();
  const en = t.eko.news;

  // ISO dates (YYYY-MM-DD) sort lexicographically; newest first.
  const items = [...t.news.mockNews].sort((a, b) => b.date.localeCompare(a.date));
  const cats = [t.news.categories.all, ...Array.from(new Set(items.map((n) => t.news.categories[n.category as keyof typeof t.news.categories])))];
  const [cat, setCat] = useState(t.news.categories.all);
  const list = cat === t.news.categories.all ? items : items.filter((n) => t.news.categories[n.category as keyof typeof t.news.categories] === cat);
  const [openId, setOpenId] = useState<number | null>(null);
  const open = items.find((n) => n.id === openId);

  const cardRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(cardRef, openId != null, () => setOpenId(null));
  useScrollLock(openId != null);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(LOCALE[language], { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="page eko">
      <section className="phero phero--news">
        <div className="container">
          <Reveal>
            <Eyebrow variant="green">{en.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="display phero__title" style={{ maxWidth: 720 }}>
              {en.title1}
              <br />
              <em>{en.title2}</em>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead" style={{ maxWidth: 560 }}>
              {en.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="newsfilter">
            {cats.map((c) => (
              <button key={c} className={`newsfilter__btn ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </Reveal>

          <div className="newsgrid">
            {list.map((n, i) => (
              <Reveal
                key={n.id}
                delay={(i % 3) as 0 | 1 | 2}
                className={`newscard ${i === 0 ? "newscard--tall" : ""}`}
                onClick={() => setOpenId(n.id)}
              >
                <div className="newscard__media">
                  <Slot
                    src={IMG_BY_KEYWORD[n.image]}
                    alt={n.title}
                    placeholder={en.imagePlaceholder}
                    className="newscard__photo"
                    radius={0}
                    sources={optimizedSources(IMG_BY_KEYWORD[n.image])}
                    sizes="(min-width: 900px) 360px, 92vw"
                    priority={i === 0}
                  />
                  <span className="newscard__cat chip">
                    {t.news.categories[n.category as keyof typeof t.news.categories]}
                  </span>
                </div>
                <div className="newscard__body">
                  <span className="newscard__date mono">{fmtDate(n.date)}</span>
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                  <span className="newscard__more">
                    {t.news.readMore} <Icon name="arrow" size={16} className="arrow" />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Article modal */}
      {open && (
        <div className="eko-modal eko" onClick={() => setOpenId(null)}>
          <div className="modal__card article" ref={cardRef} onClick={(ev) => ev.stopPropagation()} role="dialog" aria-modal="true" aria-label={open.title}>
            <button className="modal__close" aria-label={t.purchaseModal.close} onClick={() => setOpenId(null)}>
              <Icon name="close" size={22} />
            </button>
            <span className="chip" style={{ marginBottom: 14 }}>
              {t.news.categories[open.category as keyof typeof t.news.categories]}
            </span>
            <span className="newscard__date mono" style={{ display: "block", marginBottom: 10 }}>
              {fmtDate(open.date)}
            </span>
            <h3 className="article__title">{open.title}</h3>
            <div className="article__media">
              <Slot src={IMG_BY_KEYWORD[open.image]} alt={open.title} placeholder={en.imagePlaceholder} radius={12} sources={optimizedSources(IMG_BY_KEYWORD[open.image])} sizes="(min-width: 800px) 640px, 90vw" />
            </div>
            <p className="article__text">{open.excerpt}</p>
            <p className="article__text muted">{en.fullTextNote}</p>
            <button
              className="btn btn--primary"
              onClick={() => {
                setOpenId(null);
                navigate(lp("/contacts"));
              }}
            >
              {en.contactUs} <Icon name="arrow" size={17} className="arrow" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
