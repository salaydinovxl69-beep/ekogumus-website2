/* «Земля и Зерно» — Home page. */
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { usePurchase } from "../contexts/PurchaseContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Icon } from "../components/eko/Icon";
import { Reveal, Counter } from "../components/eko/Reveal";
import { Eyebrow, SectionHead, Slot } from "../components/eko/primitives";
import { optimizedSources } from "../utils/img";

const IMG = {
  hero: "/images/originals/NanoEco_3.png",
  founder: "/images/originals/Founder.png",
  granule: "/images/originals/Eco_3.png",
  liquid: "/images/originals/Nano_10.png",
  cert: "/images/originals/certificate_8.png",
};

/* sizes hero должен совпадать со строкой imagesizes у <link rel="preload"> в index.html,
   иначе preload и <picture> выберут разные кандидаты srcset. */
const HERO_SIZES = "(min-width: 980px) 60vw, (min-width: 500px) 460px, 92vw";

export function HomePage() {
  const { t, lp } = useLanguage();
  const { openPurchase } = usePurchase();
  usePageMeta();

  const e = t.eko;
  const H = e.hero;

  const benefits = [
    { icon: "shield", ...t.products.productSection.card1 },
    { icon: "trend", ...t.products.productSection.card2 },
    { icon: "clock", ...t.products.productSection.card3 },
    { icon: "soil", ...t.products.productSection.card4 },
    { icon: "drop", ...t.products.productSection.card5 },
  ];

  const values = [
    { icon: "leaf", ...t.about.values.ecology },
    { icon: "target", ...t.about.values.quality },
    { icon: "spark", ...t.about.values.innovation },
    { icon: "heart", ...t.about.values.tradition },
  ];

  const si = t.stats.items;
  const stats = [
    { icon: "calendar", v: "35+", suffix: "", l: si.years, d: si.yearsDesc },
    { icon: "truck", v: "10000", suffix: " т+", l: si.export, d: si.exportDesc },
    { icon: "check", v: "100", suffix: "%", l: si.control, d: si.controlDesc },
    { icon: "award", v: "1", suffix: "", l: si.certificate, d: si.certificateDesc },
    { icon: "trend", v: "40", suffix: "%", l: si.yield, d: si.yieldDesc },
    { icon: "globe", v: "10+", suffix: "", l: si.countries, d: si.countriesDesc },
  ];

  return (
    <div className="page eko">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__left">
            <Reveal>
              <span className="hero__badge mono">
                <Icon name="award" size={15} /> {t.hero.badge}
              </span>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="display hero__title">
                {H.title1}
                <br />
                <em>{H.title2}</em>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead hero__sub">{H.subtitle}</p>
            </Reveal>
            <Reveal delay={3} className="hero__btns">
              <Link className="btn btn--primary btn--lg" to={lp("/products")}>
                {e.viewProducts} <Icon name="arrow" size={18} className="arrow" />
              </Link>
              <Link className="btn btn--ghost btn--lg" to={lp("/about")}>
                {t.nav.about}
              </Link>
            </Reveal>
          </div>

          <Reveal delay={2} className="hero__media">
            <Slot
              src={IMG.hero}
              alt={t.hero.backgroundAlt}
              placeholder={e.placeholders.heroField}
              className="hero__photo"
              radius={22}
              priority
              width={2496}
              height={1664}
              sources={optimizedSources(IMG.hero)}
              sizes={HERO_SIZES}
            />
            <div className="hero__floatcard">
              <span className="mono hero__floatcard-k">BIOGUMUS NANOECOVERM</span>
              <span className="hero__floatcard-v">{H.floatcard}</span>
            </div>
          </Reveal>
        </div>

        <div className="container hero__stats">
          {H.stats.map((s, i) => (
            <Reveal key={i} delay={(i % 5) as 0 | 1 | 2 | 3 | 4} className="hero__stat">
              <span className="hero__stat-v">{s.v}</span>
              <span className="hero__stat-l mono">{s.l}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...e.marquee, ...e.marquee, ...e.marquee].map((m, i) => (
            <span key={i} className="marquee__item">
              <Icon name="sprout" size={16} /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- ABOUT PREVIEW ---------- */}
      <section className="section about-prev">
        <div className="container about-prev__grid">
          <Reveal className="about-prev__media">
            <Slot
              src={IMG.founder}
              alt={t.about.founderAlt}
              placeholder={e.placeholders.founder}
              className="about-prev__photo"
              radius={20}
              sources={optimizedSources(IMG.founder)}
              sizes="(min-width: 980px) 45vw, (min-width: 500px) 460px, 92vw"
            />
            <div className="about-prev__since" style={{ borderRadius: "27px" }}>
              <span className="mono">с</span>
              <strong>1988</strong>
            </div>
          </Reveal>
          <div className="about-prev__body">
            <Reveal>
              <Eyebrow variant="green">{t.nav.about}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="h-section">{t.about.title}</h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead">{t.about.history}</p>
            </Reveal>
            <Reveal delay={2}>
              <p className="muted about-prev__p2">{t.about.development}</p>
            </Reveal>
            <Reveal delay={3} className="about-prev__vals">
              {values.map((v, i) => (
                <div className="about-prev__val" key={i}>
                  <span className="about-prev__val-ic">
                    <Icon name={v.icon} size={20} />
                  </span>
                  <div>
                    <strong>{v.title}</strong>
                    <span>{v.description}</span>
                  </div>
                </div>
              ))}
            </Reveal>
            <Reveal delay={4}>
              <Link className="btn btn--ghost" to={lp("/about")}>
                {e.moreAboutCompany} <Icon name="arrow" size={17} className="arrow" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- PRODUCT SPLIT ---------- */}
      <section className="section product-split">
        <div className="container">
          <SectionHead
            eyebrow={e.home.productsEyebrow}
            title={e.home.twoProductsTitle}
            center
            sub={e.home.twoProductsSub}
          />
          <div className="psplit">
            <Reveal className="psplit__card psplit__card--green">
              <div className="psplit__media">
                <Slot src={IMG.granule} alt="BIOGUMUS" placeholder={e.placeholders.granuleBag} className="psplit__photo" radius={18} sources={optimizedSources(IMG.granule)} sizes="(min-width: 1200px) 520px, (min-width: 640px) 46vw, 92vw" />
              </div>
              <div className="psplit__body">
                <span className="chip">{e.home.dryGranule}</span>
                <h3>BIOGUMUS</h3>
                <p>{e.home.granuleDesc}</p>
                <div className="psplit__from">
                  <span className="mono">{e.fromLabel}</span>
                  <strong>6 500</strong>
                  <span className="mono">{e.currency}</span>
                </div>
                <div className="psplit__btns">
                  <button className="btn btn--primary" onClick={() => openPurchase({ name: "BIOGUMUS", type: "granule" })}>
                    <Icon name="cart" size={17} /> {e.buy}
                  </button>
                  <Link className="btn btn--light" to={lp("/products")}>
                    {e.details}
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1} className="psplit__card psplit__card--clay">
              <div className="psplit__media">
                <Slot src={IMG.liquid} alt="NANOECOVERM" placeholder={e.placeholders.liquidCan} className="psplit__photo" radius={18} sources={optimizedSources(IMG.liquid)} sizes="(min-width: 1200px) 520px, (min-width: 640px) 46vw, 92vw" />
              </div>
              <div className="psplit__body">
                <span className="chip chip--clay">{e.home.liquidNew}</span>
                <h3>NANOECOVERM</h3>
                <p>{e.home.liquidDesc}</p>
                <div className="psplit__from">
                  <span className="mono">{e.fromLabel}</span>
                  <strong>30 000</strong>
                  <span className="mono">{e.currency}</span>
                </div>
                <div className="psplit__btns">
                  <button className="btn btn--clay" onClick={() => openPurchase({ name: "NANOECOVERM", type: "liquid" })}>
                    <Icon name="cart" size={17} /> {e.buy}
                  </button>
                  <Link className="btn btn--light" to={lp("/products")}>
                    {e.details}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- BENEFITS ---------- */}
      <section className="section section--tight benefits">
        <div className="container">
          <SectionHead
            eyebrow={e.home.whyBiogumus}
            title={e.home.whatLandGets}
            center
            maxSub={620}
            sub={e.home.benefitsSub}
          />
          <div className="benefits__grid">
            {benefits.map((b, i) => (
              <Reveal key={i} delay={(i % 3) as 0 | 1 | 2} className="benefit">
                <span className="benefit__ic">
                  <Icon name={b.icon} size={26} />
                </span>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </Reveal>
            ))}
            <Reveal delay={2} className="benefit benefit--cta">
              <h3>{e.home.readyTitle}</h3>
              <p>{e.home.readySub}</p>
              <button className="btn btn--primary btn--sm" onClick={() => openPurchase()}>
                {e.buy} <Icon name="arrow" size={16} className="arrow" />
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- STATS BAND ---------- */}
      <section className="statsband">
        <div className="container">
          <SectionHead eyebrow={t.stats.title} title={e.home.statsBandTitle} center light />
          <div className="statsband__grid">
            {stats.map((s, i) => (
              <Reveal key={i} delay={(i % 3) as 0 | 1 | 2} className="statcard">
                <span className="statcard__ic">
                  <Icon name={s.icon} size={24} />
                </span>
                <span className="statcard__v">
                  {/\d/.test(s.v) && s.suffix ? (
                    <Counter end={parseInt(s.v)} suffix={s.suffix} />
                  ) : (
                    s.v
                  )}
                </span>
                <span className="statcard__l">{s.l}</span>
                <span className="statcard__d">{s.d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CERTIFICATE ---------- */}
      <section className="section cert">
        <div className="container cert__grid">
          <div className="cert__body">
            <Reveal>
              <Eyebrow variant="green">{t.certificates.badge}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="h-section">{t.certificates.title}</h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead">{t.certificates.description}</p>
            </Reveal>
            <Reveal delay={3} className="cert__pts">
              {e.home.certChips.map((c, i) => (
                <span className="chip" key={i}>
                  <Icon name="check" size={14} /> {c}
                </span>
              ))}
            </Reveal>
          </div>
          <Reveal delay={1} className="cert__media">
            <Slot
              src={IMG.cert}
              alt={t.certificates.certificateAlt}
              placeholder={e.placeholders.certA4}
              className="cert__photo"
              radius={10}
              fit="contain"
              style={{ aspectRatio: "350 / 492" }}
              sources={optimizedSources(IMG.cert)}
              sizes="(min-width: 640px) 330px, 80vw"
            />
            <span className="cert__seal">
              <Icon name="award" size={30} />
            </span>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
