import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { usePurchase } from "../contexts/PurchaseContext";
import { Icon } from "./eko/Icon";
import { BrandLogo } from "./eko/BrandLogo";
import { useFocusTrap } from "./eko/Reveal";
import { useScrollLock } from "../hooks/useScrollLock";
import { useTheme } from "../hooks/useTheme";
import type { Language } from "../utils/i18n";

import { PHONE, PHONE_RAW, EMAIL } from "../utils/contacts";
import { NAV_ROUTES } from "../utils/nav";
import { stripLang } from "../utils/routing";

const LANGS: { code: Language; label: string; name: string }[] = [
  { code: "ru", label: "РУ", name: "Русский" },
  { code: "uz", label: "O'Z", name: "O'zbek" },
  { code: "en", label: "EN", name: "English" },
];

export function Header() {
  const { language, setLanguage, t, lp } = useLanguage();
  const { openPurchase } = usePurchase();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  const navItems = NAV_ROUTES.map((r) => ({ path: r.path, label: t.nav[r.key] }));

  const page = stripLang(location.pathname);
  const isActive = (path: string) =>
    page === path || (path !== "/" && page.startsWith(path + "/"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useScrollLock(open);

  // Focus trap + Escape для drawer
  useFocusTrap(panelRef, open, () => setOpen(false));

  return (
    <>
      <header className={`hdr eko ${scrolled ? "hdr--scrolled" : ""}`}>
        <div className="container hdr__inner">
          <Link className="brand" to={lp("/")} aria-label="EKOGUMUS">
            {/* size — размер логотипов в шапке, px */}
            <BrandLogo size={60} />
            <span className="brand__name">EKOGUMUS</span>
          </Link>

          <nav className="hdr__nav" aria-label={t.a11y.navigation}>
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={lp(path)}
                className={`navlink ${isActive(path) ? "navlink--on" : ""}`}
                aria-current={isActive(path) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hdr__right">
            <button
              type="button"
              className="hdr__icon hdr__icon--theme"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t.eko.lightTheme : t.eko.darkTheme}
              title={theme === "dark" ? t.eko.lightTheme : t.eko.darkTheme}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
            </button>
            <a
              className="hdr__icon"
              href={`tel:${PHONE_RAW}`}
              aria-label={t.a11y.phoneCall}
            >
              <Icon name="phone" size={19} />
            </a>
            <div className="langsw" role="group" aria-label="Выбор языка">
              {LANGS.map(({ code, label, name }) => (
                <button
                  key={code}
                  type="button"
                  className={`langsw__btn ${language === code ? "langsw__btn--on" : ""}`}
                  aria-label={name}
                  aria-pressed={language === code}
                  onClick={() => setLanguage(code)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              className="btn btn--primary btn--sm hdr__cta"
              onClick={() => openPurchase()}
            >
              <Icon name="cart" size={17} /> {t.eko.buy}
            </button>
            <button
              className="hdr__burger"
              aria-label={t.a11y.openMenu}
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — вне header, чтобы backdrop-filter не создавал containing block */}
      <div
        className={`drawer eko ${open ? "drawer--open" : ""}`}
        onClick={() => setOpen(false)}
      >
        <div
          className="drawer__panel"
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={t.a11y.navigation}
        >
          <div className="drawer__top">
            <span className="brand__name" style={{ color: "var(--cream)" }}>
              EKOGUMUS
            </span>
            <button
              className="drawer__close"
              aria-label={t.a11y.closeMenu}
              onClick={() => setOpen(false)}
            >
              <Icon name="close" size={24} />
            </button>
          </div>
          <nav className="drawer__nav" aria-label={t.a11y.navigation}>
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={lp(path)}
                className={isActive(path) ? "on" : ""}
                aria-current={isActive(path) ? "page" : undefined}
              >
                {label}
                <Icon name="arrow" size={20} />
              </Link>
            ))}
          </nav>
          <div className="drawer__foot">
            <button
              type="button"
              className="drawer__theme"
              onClick={toggleTheme}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
              {theme === "dark" ? t.eko.lightTheme : t.eko.darkTheme}
            </button>
            <div className="drawer__langsw" role="group" aria-label="Выбор языка">
              {LANGS.map(({ code, label, name }) => (
                <button
                  key={code}
                  type="button"
                  className={language === code ? "on" : ""}
                  aria-label={name}
                  aria-pressed={language === code}
                  onClick={() => setLanguage(code)}
                >
                  {label}
                </button>
              ))}
            </div>
            <a href={`tel:${PHONE_RAW}`}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <button
              className="btn btn--clay btn--block"
              onClick={() => {
                setOpen(false);
                openPurchase();
              }}
            >
              <Icon name="cart" size={18} /> {t.eko.buyProducts}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
