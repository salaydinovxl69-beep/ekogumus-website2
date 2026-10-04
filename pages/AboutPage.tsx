/* «Земля и Зерно» — About / Company page. */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Icon } from "../components/eko/Icon";
import { Reveal } from "../components/eko/Reveal";
import { Eyebrow, SectionHead, Slot } from "../components/eko/primitives";
import { optimizedSources } from "../utils/img";

const CERT_NUMBERS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 15];
const certImg = (n: number) => `/images/originals/certificate_${n}.png`;

/* ---------- Certificates carousel (auto-scrolling, pause on hover) ---------- */
function CertCarousel() {
  const { t } = useLanguage();
  const total = CERT_NUMBERS.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const pausedRef = useRef(false);

  /* Scroll targets must always land exactly on the CSS snap grid (a card
     centred in the viewport, clamped to the scrollable range) — otherwise the
     browser issues a corrective snap that can cancel the next smooth scroll. */
  const snapLeft = (track: HTMLDivElement, i: number) => {
    const card = track.children[Math.max(0, Math.min(i, total - 1))] as HTMLElement;
    const max = track.scrollWidth - track.clientWidth;
    /* Card position in the track's own scroll coordinates (offsetLeft is
       relative to the offsetParent, which is not the track). */
    const cardRect = card.getBoundingClientRect();
    const cardLeft = cardRect.left - track.getBoundingClientRect().left + track.scrollLeft - track.clientLeft;
    const centered = cardLeft - (track.clientWidth - cardRect.width) / 2;
    return Math.max(0, Math.min(centered, max));
  };

  /* Distinct grid positions: near both edges several cards clamp to the same
     spot, so stepping by card index can target the current position. */
  const snapStops = (track: HTMLDivElement) => {
    const stops: number[] = [];
    for (let i = 0; i < total; i++) {
      const s = snapLeft(track, i);
      if (!stops.length || s - stops[stops.length - 1] > 1) stops.push(s);
    }
    return stops;
  };

  const byCard = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const stops = snapStops(track);
    let near = 0;
    let bestD = Infinity;
    stops.forEach((s, i) => {
      const d = Math.abs(s - track.scrollLeft);
      if (d < bestD) {
        bestD = d;
        near = i;
      }
    });
    const target = Math.max(0, Math.min(near + dir, stops.length - 1));
    track.scrollTo({ left: stops[target], behavior: "smooth" });
  };

  const toCard = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: snapLeft(track, i), behavior: "smooth" });
  };

  useEffect(() => {
    const id = setInterval(() => {
      const track = trackRef.current;
      if (pausedRef.current || !track) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 2) track.scrollTo({ left: 0, behavior: "smooth" });
      else byCard(1);
    }, 3500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const start = track.scrollLeft <= 2;
    const end = track.scrollLeft >= max - 2;
    setAtStart(start);
    setAtEnd(end);
    /* At the clamped edges the centre-proximity rule can't reach the first/last
       card (several cards are visible at once), so pin the index there. */
    if (start || end) {
      setIdx(start ? 0 : total - 1);
      return;
    }
    const cards = Array.from(track.children) as HTMLElement[];
    const trackMid = track.getBoundingClientRect().left + track.clientLeft + track.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - trackMid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setIdx(best);
  };

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <section className="section certs">
      <div className="container">
        <div className="certs__head">
          <div>
            <Eyebrow variant="green">{t.eko.about.docsEyebrow}</Eyebrow>
            <h2 className="h-section" style={{ marginTop: 14 }}>
              {t.eko.about.certsTitle}
            </h2>
            <p className="lead" style={{ marginTop: 14, maxWidth: 520 }}>
              {t.eko.about.certsSub}
            </p>
          </div>
          <div className="certs__nav">
            <button className="certs__arrow" aria-label="←" onClick={() => byCard(-1)} disabled={atStart}>
              <Icon name="chevL" size={22} />
            </button>
            <span className="certs__count mono">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button className="certs__arrow" aria-label="→" onClick={() => byCard(1)} disabled={atEnd}>
              <Icon name="chevR" size={22} />
            </button>
          </div>
        </div>

        <div
          className="certs__track"
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label={t.aboutPage.certificates.title}
          onScroll={onScroll}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          {CERT_NUMBERS.map((n, i) => (
            <div className="certcard" key={n}>
              <Slot
                src={certImg(n)}
                alt={`${t.aboutPage.certificates.title} ${i + 1}`}
                placeholder={`${t.aboutPage.certificates.title} ${i + 1}`}
                className="certcard__photo"
                radius={10}
                fit="contain"
                sources={optimizedSources(certImg(n))}
                sizes="(min-width: 1200px) 270px, 26vw"
              />
              <span className="certcard__no mono">№ {String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>

        <div className="certs__dots">
          {CERT_NUMBERS.map((n, i) => (
            <button
              key={n}
              className={`certs__dot ${i === idx ? "on" : ""}`}
              aria-label={`${t.aboutPage.certificates.title} ${i + 1}`}
              onClick={() => toCard(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutPage() {
  const { t, lp } = useLanguage();
  usePageMeta();

  const a = t.about;
  const ea = t.eko.about;

  const values = [
    { icon: "leaf", ...a.values.ecology },
    { icon: "target", ...a.values.quality },
    { icon: "spark", ...a.values.innovation },
    { icon: "heart", ...a.values.tradition },
  ];

  const timeline = [
    { icon: "sprout", ...a.timeline.step1 },
    { icon: "shield", ...a.timeline.step2 },
    { icon: "award", ...a.timeline.step3 },
  ];

  const ach = t.aboutPage.history.achievements;
  const achievements = [ach.customers, ach.laboratory, ach.certification, ach.export];

  return (
    <div className="page eko">
      <section className="phero phero--about">
        <div className="container phero__inner">
          <div className="phero__text">
            <Reveal>
              <Eyebrow variant="green">{t.nav.about}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="display phero__title">
                {ea.title1}
                <br />
                <em>{ea.title2}</em>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead">{a.history}</p>
            </Reveal>
            <Reveal delay={3}>
              <p className="muted" style={{ marginTop: 16 }}>
                {a.development}
              </p>
            </Reveal>
          </div>
          <Reveal delay={2} className="phero__media">
            <Slot
              src="/images/originals/Founder.png"
              alt={a.founderAlt}
              placeholder={t.eko.placeholders.founder}
              className="phero__photo"
              radius={20}
              style={{ aspectRatio: "500 / 700" }}
              priority
              width={880}
              height={1206}
              sources={optimizedSources("/images/originals/Founder.png")}
              sizes="(min-width: 980px) 55vw, (min-width: 500px) 460px, 92vw"
            />
          </Reveal>
        </div>
      </section>

      {/* Founder quote */}
      <section className="section--tight">
        <div className="container">
          <Reveal className="quote">
            <span className="quote__mark">
              <Icon name="quote" size={40} />
            </span>
            <p className="quote__text">{ea.quote}</p>
            <div className="quote__by">
              <strong>{a.founderName}</strong>
              <span className="mono">{a.founderTitle}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline + history */}
      <section className="section timeline" style={{ padding: "13px 0 96px" }}>
        <div className="container">
          <SectionHead eyebrow={a.timeline.title} title={ea.timelineTitle} center />
          <div className="timeline__rail">
            {timeline.map((s, i) => (
              <Reveal key={i} delay={(i % 3) as 0 | 1 | 2} className="tnode">
                <span className="tnode__year">{s.year}</span>
                <span className="tnode__dot">
                  <Icon name={s.icon} size={18} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={2} className="history">
            <p className="history__p">{t.aboutPage.history.content1}</p>
            <p className="history__p">{t.aboutPage.history.content2}</p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section section--tight" style={{ padding: "24px 0 64px" }}>
        <div className="container">
          <SectionHead eyebrow={ea.valuesEyebrow} title={ea.valuesTitle} center />
          <div className="vals">
            {values.map((v, i) => (
              <Reveal key={i} delay={(i % 4) as 0 | 1 | 2 | 3} className="val">
                <span className="val__ic">
                  <Icon name={v.icon} size={26} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates carousel */}
      <CertCarousel />

      {/* Achievements split */}
      <section className="section achieve">
        <div className="container achieve__grid">
          <Reveal className="achieve__media">
            <Slot
              src="/images/originals/EkoGum.png"
              alt={t.aboutPage.history.achievementsTitle}
              placeholder={t.eko.placeholders.production}
              className="achieve__photo"
              radius={20}
              sources={optimizedSources("/images/originals/EkoGum.png")}
              sizes="(min-width: 980px) 45vw, (min-width: 500px) 460px, 92vw"
            />
          </Reveal>
          <div className="achieve__body">
            <Reveal>
              <Eyebrow variant="green">{ea.achievementsEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="h-section">{ea.achievementsTitle}</h2>
            </Reveal>
            <div className="achieve__list">
              {achievements.map((text, i) => (
                <Reveal key={i} delay={(i % 4) as 0 | 1 | 2 | 3} className="achieve__item">
                  <span>{text}</span>
                </Reveal>
              ))}
            </div>
            <Reveal delay={2} style={{ marginTop: 30 }}>
              <Link className="btn btn--primary" to={lp("/cooperation")}>
                {t.eko.becomePartner} <Icon name="arrow" size={17} className="arrow" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
