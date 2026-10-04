/* «Земля и Зерно» — Contacts page. */
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Icon } from "../components/eko/Icon";
import { Reveal } from "../components/eko/Reveal";
import { Eyebrow, SectionHead } from "../components/eko/primitives";

import {
  PHONE,
  PHONE2,
  PHONE_RAW,
  EMAIL,
  TELEGRAM,
  TELEGRAM_URL,
  YANDEX_MAP_EMBED_URL,
  YANDEX_MAP_ROUTE_URL,
} from "../utils/contacts";

export function ContactsPage() {
  const { t } = useLanguage();
  usePageMeta();
  const cc = t.contacts.contactCards;
  const ec = t.eko.contacts;
  const [copied, setCopied] = useState("");

  const copy = async (val: string, key: string) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      return;
    }
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
  };

  const cards = [
    {
      key: "addr",
      icon: "pin",
      title: cc.address.title,
      lines: [cc.address.country, cc.address.region, cc.address.city],
      href: null as string | null,
    },
    {
      key: "phone",
      icon: "phone",
      title: cc.phone.title,
      lines: [cc.phone.primary, cc.phone.secondary],
      href: `tel:${PHONE_RAW}`,
    },
    {
      key: "email",
      icon: "mail",
      title: cc.email.title,
      lines: [cc.email.info, cc.email.infoDesc],
      href: `mailto:${EMAIL}`,
    },
    {
      key: "tg",
      icon: "telegram",
      title: cc.email.salesTitle,
      lines: [cc.email.sales, cc.email.salesDesc],
      href: TELEGRAM_URL,
    },
  ];

  const hours = [
    { d: t.eko.hours.weekdays, time: t.eko.hours.workTime, off: false },
    { d: t.eko.hours.saturday, time: t.eko.hours.dayOff, off: true },
    { d: t.eko.hours.sunday, time: t.eko.hours.dayOff, off: true },
  ];

  const persons = [
    { title: ec.salesTitle, role: ec.salesRole, phone: PHONE },
    { title: ec.intakeTitle, role: ec.intakeRole, phone: PHONE2 },
  ];

  return (
    <div className="page eko">
      <section className="phero phero--contacts">
        <div className="container">
          <Reveal>
            <Eyebrow variant="green">{ec.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="display phero__title">
              {ec.title1} <em>{ec.title2}</em>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead" style={{ maxWidth: 540 }}>
              {ec.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="ccards">
            {cards.map((card, i) => (
              <Reveal key={card.key} delay={(i % 4) as 0 | 1 | 2 | 3} className="ccard">
                <span className="ccard__ic">
                  <Icon name={card.icon} size={24} />
                </span>
                <h2>{card.title}</h2>
                {card.lines.map((l, j) => (
                  <span key={j} className={j === 0 ? "ccard__main" : "ccard__sub"}>
                    {l}
                  </span>
                ))}
                <div className="ccard__actions">
                  {card.href && (
                    <a
                      className="ccard__btn"
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      <Icon name="arrow" size={15} /> {t.eko.goto}
                    </a>
                  )}
                  <button className="ccard__btn ccard__btn--ghost" onClick={() => copy(card.lines[0], card.key)}>
                    {copied === card.key ? t.eko.copied : t.eko.copy}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Map + hours */}
      <section className="section section--tight">
        <div className="container map-sec">
          <Reveal className="map-sec__map">
            <iframe
              className="map-sec__frame"
              src={YANDEX_MAP_EMBED_URL}
              title={ec.findUs}
              loading="lazy"
              allowFullScreen
            />
            <a
              className="map-sec__route btn btn--primary btn--sm"
              href={YANDEX_MAP_ROUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="pin" size={16} /> {t.eko.buildRoute}
            </a>
          </Reveal>
          <Reveal delay={1} className="map-sec__side">
            <h2>{ec.findUs}</h2>
            <p className="muted">{ec.findUsText}</p>
            <div className="hours">
              <h3 className="mono">{t.footer.workingHours.title}</h3>
              {hours.map((h, i) => (
                <div className="hours__row" key={i}>
                  <span>{h.d}</span>
                  <strong className={h.off ? "muted" : ""}>{h.time}</strong>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* People */}
      <section className="section section--tight">
        <div className="container">
          <SectionHead eyebrow={ec.teamEyebrow} title={ec.teamTitle} center />
          <div className="people">
            {persons.map((p, i) => (
              <Reveal key={i} delay={(i % 4) as 0 | 1 | 2 | 3} className="person">
                <span className="person__av">
                  <Icon name="phone" size={18} />
                </span>
                <strong>{p.title}</strong>
                <span className="person__role">{p.role}</span>
                <a className="person__phone mono" href={`tel:${p.phone.replace(/\D/g, "")}`}>
                  {p.phone}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
