/* «Земля и Зерно» — 4-column informational footer. */
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Icon } from "./eko/Icon";
import { BrandLogo } from "./eko/BrandLogo";

import { PHONE, PHONE_RAW, EMAIL, TELEGRAM_URL, YOUTUBE_URL, LINKEDIN_URL } from "../utils/contacts";
import { NAV_ROUTES } from "../utils/nav";

export function Footer() {
  const { t, lp } = useLanguage();
  const f = t.footer;
  const e = t.eko;

  const navItems = NAV_ROUTES.map((r) => ({ path: r.path, label: t.nav[r.key] }));

  const hours = [
    { d: e.hours.weekdays, time: e.hours.workTime, off: false },
    { d: e.hours.saturday, time: e.hours.dayOff, off: true },
    { d: e.hours.sunday, time: e.hours.dayOff, off: true },
  ];

  return (
    <footer className="ftr eko">
      <div className="container">
        <div className="ftr__grid">
          {/* Brand */}
          <div className="ftr__brand">
            <Link className="brand" to={lp("/")} aria-label="EKOGUMUS">
              {/* size — размер логотипов в футере, px */}
              <BrandLogo size={48} />
              <span className="brand__name">EKOGUMUS</span>
            </Link>
            <p className="ftr__blurb">{f.description}</p>
          </div>

          {/* Quick links */}
          <div className="ftr__col">
            <h4 className="ftr__h">{f.quickLinks}</h4>
            <nav className="ftr__links">
              {navItems.map((n) => (
                <Link key={n.path} to={lp(n.path)}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="ftr__col">
            <h4 className="ftr__h">{f.contact}</h4>
            <div className="ftr__contact">
              <span className="ftr__row">
                <Icon name="pin" size={17} />
                <span>
                  {f.address.country}
                  <br />
                  {f.address.city} {f.address.street}
                </span>
              </span>
              <a className="ftr__row" href={`tel:${PHONE_RAW}`}>
                <Icon name="phone" size={16} />
                <span>{PHONE}</span>
              </a>
              <a className="ftr__row" href={`mailto:${EMAIL}`}>
                <Icon name="mail" size={16} />
                <span>{EMAIL}</span>
              </a>
            </div>
          </div>

          {/* Follow + hours */}
          <div className="ftr__col">
            <h4 className="ftr__h">{f.follow}</h4>
            <div className="ftr__social">
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label={t.a11y.youtube}>
                <Icon name="youtube" size={18} />
              </a>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={t.a11y.telegram}>
                <Icon name="telegram" size={18} />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label={t.a11y.linkedin}>
                <Icon name="linkedin" size={18} />
              </a>
              <a href={`mailto:${EMAIL}`} aria-label={t.a11y.sendEmail}>
                <Icon name="mail" size={18} />
              </a>
            </div>
            <div className="ftr__hours-card">
              <h5 className="mono">{f.workingHours.title}</h5>
              {hours.map((h, i) => (
                <div className="ftr__hrow" key={i}>
                  <span>{h.d}</span>
                  <strong className={h.off ? "ftr__off" : ""}>{h.time}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ftr__rule" />
        <div className="ftr__bottom">
          <span>
            © {new Date().getFullYear()} EKOGUMUS · {f.copyright}
          </span>
          <span className="mono">{e.footerTagline}</span>
        </div>
      </div>
    </footer>
  );
}
