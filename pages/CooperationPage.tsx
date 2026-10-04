/* «Земля и Зерно» — Cooperation / partnership page. */
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Icon } from "../components/eko/Icon";
import { Reveal } from "../components/eko/Reveal";
import { Eyebrow, SectionHead, Slot } from "../components/eko/primitives";
import { optimizedSources } from "../utils/img";

import { PHONE, PHONE_RAW, EMAIL, TELEGRAM, TELEGRAM_URL } from "../utils/contacts";

export function CooperationPage() {
  const { t } = useLanguage();
  usePageMeta();
  const C = t.cooperation;
  const ec = t.eko.coop;

  const [form, setForm] = useState({ name: "", company: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errs, setErrs] = useState<{ name?: string; phone?: string; message?: string }>({});

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: typeof errs = {};
    if (form.name.trim().length < 2) er.name = C.form.fields.name.minLength;
    if (!/^[\d\s()+\-]{7,}$/.test(form.phone)) er.phone = C.form.fields.phone.invalid;
    if (form.message.trim().length < 10) er.message = C.form.fields.message.minLength;
    setErrs(er);
    if (Object.keys(er).length === 0) setSent(true);
  };

  const stats = [
    { v: "35+", l: C.hero.stats.years },
    { v: "500+", l: C.hero.stats.partners },
    { v: "10+", l: C.hero.stats.countries },
  ];

  const conditions = [
    { icon: "truck", ...C.conditions.wholesale },
    { icon: "handshake", ...C.conditions.dealer },
    { icon: "globe", ...C.conditions.export },
  ];

  const process = [C.process.step1, C.process.step2, C.process.step3, C.process.step4];

  const advantages = [
    { icon: "shield", ...C.advantages.quality },
    { icon: "trend", ...C.advantages.supply },
    { icon: "target", ...C.advantages.support },
    { icon: "spark", ...C.advantages.prices },
    { icon: "truck", ...C.advantages.delivery },
    { icon: "heart", ...C.advantages.approach },
  ];

  return (
    <div className="page eko">
      <section className="phero phero--coop">
        <Slot
          src="/images/originals/doroga_trava_pole.jpg"
          alt={C.title}
          placeholder={ec.bgPlaceholder}
          className="phero--coop__bg"
          fit="cover"
          priority
          width={3840}
          height={2160}
          sources={optimizedSources("/images/originals/doroga_trava_pole.jpg")}
          sizes="100vw"
        />
        <div className="container phero__inner">
          <div className="phero__text">
            <Reveal>
              <Eyebrow>{C.hero.badge}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="display phero__title" style={{ color: "var(--cream)" }}>
                {C.title}
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead" style={{ color: "rgba(243,236,221,.82)" }}>
                {C.hero.subtitle}
              </p>
            </Reveal>
            <Reveal delay={3} className="coop__stats">
              {stats.map((s, i) => (
                <div className="coop__stat" key={i}>
                  <strong>{s.v}</strong>
                  <span>{s.l}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={ec.conditionsEyebrow} title={ec.conditionsTitle} center />
          <div className="coop__conds">
            {conditions.map((c, i) => (
              <Reveal key={i} delay={(i % 3) as 0 | 1 | 2} className="cond">
                <span className="cond__ic">
                  <Icon name={c.icon} size={26} />
                </span>
                <h3>{c.title}</h3>
                <ul>
                  {c.items.map((it, j) => (
                    <li key={j}>
                      <span className="cond__check">
                        <Icon name="check" size={14} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section section--tight process">
        <div className="container">
          <SectionHead eyebrow={ec.processEyebrow} title={ec.processTitle} center />
          <div className="process__grid">
            {process.map((p, i) => (
              <Reveal key={i} delay={(i % 4) as 0 | 1 | 2 | 3} className="pstep">
                <span className="pstep__n mono">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section section--tight">
        <div className="container">
          <SectionHead eyebrow={ec.whyEyebrow} title={ec.whyTitle} center />
          <div className="adv">
            {advantages.map((a, i) => (
              <Reveal key={i} delay={(i % 3) as 0 | 1 | 2} className="adv__item">
                <span className="adv__ic">
                  <Icon name={a.icon} size={22} />
                </span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section form-sec">
        <div className="container form-sec__grid">
          <div className="form-sec__intro">
            <Reveal>
              <Eyebrow variant="green">{ec.formEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="h-section">{C.form.title}</h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead">{C.form.subtitle}</p>
            </Reveal>
            <Reveal delay={2} className="form-sec__contacts">
              <a href={`tel:${PHONE_RAW}`}>
                <Icon name="phone" size={18} /> {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`}>
                <Icon name="mail" size={18} /> {EMAIL}
              </a>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Icon name="telegram" size={18} /> {TELEGRAM}
              </a>
            </Reveal>
          </div>

          <Reveal delay={1} className="card form-card">
            {sent ? (
              <div className="form-done">
                <span className="form-done__ic">
                  <Icon name="check" size={34} />
                </span>
                <h3>{C.form.submit.success}</h3>
                <p>{C.form.submit.successDescription}</p>
                <button
                  className="btn btn--ghost"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", company: "", phone: "", message: "" });
                  }}
                >
                  {t.eko.coop.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <label className="field">
                  <span>{C.form.fields.name.label} *</span>
                  <input
                    value={form.name}
                    onChange={(ev) => setForm({ ...form, name: ev.target.value })}
                    placeholder={C.form.fields.name.placeholder}
                    className={errs.name ? "err" : ""}
                  />
                  {errs.name && <em>{errs.name}</em>}
                </label>
                <label className="field">
                  <span>{C.form.fields.company.label}</span>
                  <input
                    value={form.company}
                    onChange={(ev) => setForm({ ...form, company: ev.target.value })}
                    placeholder={C.form.fields.company.placeholder}
                  />
                </label>
                <label className="field">
                  <span>{C.form.fields.phone.label} *</span>
                  <input
                    value={form.phone}
                    onChange={(ev) => setForm({ ...form, phone: ev.target.value })}
                    placeholder={C.form.fields.phone.placeholder}
                    className={errs.phone ? "err" : ""}
                  />
                  {errs.phone && <em>{errs.phone}</em>}
                </label>
                <label className="field">
                  <span>{C.form.fields.message.label} *</span>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(ev) => setForm({ ...form, message: ev.target.value })}
                    placeholder={C.form.fields.message.placeholder}
                    className={errs.message ? "err" : ""}
                  />
                  {errs.message && <em>{errs.message}</em>}
                </label>
                <button type="submit" className="btn btn--primary btn--block btn--lg">
                  {C.form.submit.idle} <Icon name="arrow" size={18} className="arrow" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
