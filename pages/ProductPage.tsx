/* «Земля и Зерно» — Products page (tabs: BIOGUMUS granules / NANOECOVERM liquid). */
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { usePurchase } from "../contexts/PurchaseContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { useScrollLock } from "../hooks/useScrollLock";
import { Icon } from "../components/eko/Icon";
import { Reveal, useFocusTrap } from "../components/eko/Reveal";
import { Eyebrow, SectionHead, Slot } from "../components/eko/primitives";
import { optimizedSources, type ImgSource } from "../utils/img";
import { YOUTUBE_URL } from "../utils/contacts";

type Tab = "granule" | "liquid";

const fmt = (p: string) => p.replace(/\s/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/* Фото товаров в карточках. Кладите файлы в public/images/originals/:
   BIOGUMUS:    Eco_{вес}.png   → Eco_1.png, Eco_1.5.png, Eco_2.png … Eco_20.png
   NANOECOVERM: Nano_{объём}.png → Nano_1.png, Nano_5.png, Nano_10.png */
const granuleImg = (w: string) => `/images/originals/Eco_${w}.png`;
const liquidImg = (v: string) => `/images/originals/Nano_${v}.png`;

/* Слайды презентаций. Кладите файлы в public/images/presentations/:
   biogumus/slide_1.webp … slide_9.webp и nanoecoverm/slide_1.png … slide_22.png */
const PRES_SLIDES: Record<Tab, { count: number; ext: string }> = {
  granule: { count: 9, ext: "webp" },
  liquid: { count: 22, ext: "png" },
};
const presSlideImg = (kind: Tab, n: number) =>
  `/images/presentations/${kind === "liquid" ? "nanoecoverm" : "biogumus"}/slide_${n}.${PRES_SLIDES[kind].ext}`;

/* PNG-слайды NANOECOVERM имеют WebP-версии (~10× легче), сгенерированные
   scripts/optimize-images.mjs; слайды BIOGUMUS уже WebP — для них null. */
const presSlideSources = (kind: Tab, n: number): ImgSource[] | null =>
  kind === "liquid"
    ? [{ type: "image/webp", srcSet: `/images/optimized/presentations/nanoecoverm/slide_${n}.webp` }]
    : null;

const PCARD_SIZES = "(min-width: 1100px) 270px, (min-width: 640px) 30vw, 46vw";

/* ---------- Presentation call-to-action bar ---------- */
function PresBar({
  eyebrow,
  title,
  text,
  cta,
  onOpen,
  variant,
}: {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  onOpen: () => void;
  variant: "green" | "clay";
}) {
  return (
    <Reveal className={`presbar presbar--${variant}`}>
      <div className="presbar__text">
        <Eyebrow variant={variant === "clay" ? "clay" : "green"}>{eyebrow}</Eyebrow>
        <h3 className="presbar__title">{title}</h3>
        <p className="presbar__p">{text}</p>
      </div>
      <button className={`btn ${variant === "clay" ? "btn--clay" : "btn--primary"} btn--lg presbar__btn`} onClick={onOpen}>
        <Icon name="play" size={18} /> {cta}
      </button>
    </Reveal>
  );
}

/* ---------- Presentation viewer modal ---------- */
function PresModal({
  kind,
  title,
  eyebrow,
  slideLabel,
  closeLabel,
  onClose,
}: {
  kind: Tab | null;
  title: string;
  eyebrow: string;
  slideLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const total = kind ? PRES_SLIDES[kind].count : 1;
  const [i, setI] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(cardRef, !!kind, onClose);

  useEffect(() => {
    setI(0);
  }, [kind]);

  useScrollLock(!!kind);

  useEffect(() => {
    if (!kind) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowRight") setI((v) => Math.min(v + 1, total - 1));
      else if (ev.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind, total]);

  if (!kind) return null;
  const name = kind === "liquid" ? "NANOECOVERM" : "BIOGUMUS";

  return (
    <div className="eko-modal eko" onClick={onClose}>
      <div
        className="modal__card presmodal"
        ref={cardRef}
        onClick={(ev) => ev.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${title}`}
      >
        <button className="modal__close" aria-label={closeLabel} onClick={onClose}>
          <Icon name="close" size={22} />
        </button>
        <div className="presmodal__head">
          <Eyebrow variant={kind === "liquid" ? "clay" : "green"}>{eyebrow}</Eyebrow>
          <h3 className="presmodal__title">{title}</h3>
        </div>
        <div className="presmodal__stage">
          {Array.from({ length: total }).map((_, s) => (
            <div key={s} className="presmodal__slide" style={{ display: s === i ? "block" : "none" }}>
              <Slot
                src={presSlideImg(kind, s + 1)}
                alt={`${slideLabel} ${s + 1} — ${name}`}
                placeholder={`${slideLabel} ${s + 1} — ${name}`}
                className="presmodal__img"
                radius={14}
                fit="contain"
                sources={presSlideSources(kind, s + 1)}
              />
            </div>
          ))}
          <button
            className="presmodal__nav presmodal__nav--prev"
            aria-label="←"
            disabled={i === 0}
            onClick={() => setI((v) => Math.max(v - 1, 0))}
          >
            <Icon name="arrow" size={22} />
          </button>
          <button
            className="presmodal__nav presmodal__nav--next"
            aria-label="→"
            disabled={i === total - 1}
            onClick={() => setI((v) => Math.min(v + 1, total - 1))}
          >
            <Icon name="arrow" size={22} />
          </button>
        </div>
        <div className="presmodal__foot">
          <span className="mono presmodal__count">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="presmodal__dots">
            {Array.from({ length: total }).map((_, s) => (
              <button
                key={s}
                className={`presmodal__dot ${s === i ? "presmodal__dot--on" : ""}`}
                aria-label={`${slideLabel} ${s + 1}`}
                onClick={() => setI(s)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Production videos modal ---------- */
const PROD_VIDEO_IDS = ["AE9L71IuN7A", "eydxM_NjnLQ"];

function VideoFacade({ id, title }: { id: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button type="button" className="vidframe vidframe--poster" onClick={() => setLoaded(true)} aria-label={title}>
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width={480} height={360} className="vidframe__thumb" />
        <span className="vidframe__play">
          <Icon name="play" size={26} />
        </span>
      </button>
    );
  }

  return (
    <div className="vidframe">
      <iframe
        className="vidframe__iframe"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function VideoModal({
  open,
  eyebrow,
  title,
  text,
  channelLabel,
  closeLabel,
  onClose,
}: {
  open: boolean;
  eyebrow: string;
  title: string;
  text: string;
  channelLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(cardRef, open, onClose);
  useScrollLock(open);

  if (!open) return null;

  return (
    <div className="eko-modal eko" onClick={onClose}>
      <div className="modal__card vidmodal" ref={cardRef} onClick={(ev) => ev.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <button className="modal__close" aria-label={closeLabel} onClick={onClose}>
          <Icon name="close" size={22} />
        </button>
        <div className="presmodal__head">
          <Eyebrow variant="green">{eyebrow}</Eyebrow>
          <h3 className="presmodal__title">{title}</h3>
          <p className="vidmodal__p">{text}</p>
        </div>
        <div className="vidmodal__grid">
          {PROD_VIDEO_IDS.map((id, i) => (
            <VideoFacade key={id} id={id} title={`${title} — ${i + 1}`} />
          ))}
        </div>
        <div className="vidmodal__foot">
          <a className="btn btn--ghost btn--sm" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            <Icon name="youtube" size={16} /> {channelLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProductPage() {
  const { t } = useLanguage();
  const { openPurchase } = usePurchase();
  usePageMeta();
  const [tab, setTab] = useState<Tab>("granule");
  const [pres, setPres] = useState<Tab | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const e = t.eko;
  const ep = e.products;
  const P = t.products;

  const granuleFeatures = [
    P.productCards.features.organicProduct,
    P.productCards.features.certified,
    P.productCards.features.delivery,
  ];
  const liquidFeatures = [
    P.liquidFertilizers.features.fastAction,
    P.liquidFertilizers.features.highConcentration,
    P.liquidFertilizers.features.easyApplication,
  ];

  // BIOGUMUS spec rows (curated, pulled from existing translations)
  const ci = P.compositionData.items;
  const cv = P.compositionData.values;
  const bioRows: [string, string][] = [
    [ci.organicSubstances, cv.organicSubstances],
    [ci.humus, cv.humus],
    [ci.moisture, cv.moisture],
    [ci.ph, cv.ph],
    [ci.nitrogen, cv.nitrogen],
    [ci.phosphorus, cv.phosphorus],
    [ci.potassium, cv.potassium],
    [ci.calcium, cv.calcium],
    [ci.magnesium, cv.magnesium],
    [ci.iron, cv.iron],
    [ci.heavyMetals, cv.heavyMetals],
    [ci.pathogenicMicroflora, cv.pathogenicMicroflora],
  ];

  // NANOECOVERM recipe rows
  const nt = P.nanoecovermComposition.table;
  const nanoRows: [string, string][] = [
    [nt.items.water, nt.unit.one],
    [nt.items.biohumus, nt.unit.two],
    [nt.items.ammoniumNitrate, nt.unit.three],
    [nt.items.ammophos, nt.unit.four],
    [nt.items.potassiumSulfate, nt.unit.five],
    [nt.items.microelements, nt.unit.six],
    [nt.items.aminoAcids, nt.unit.seven],
    [nt.items.copperSulfate, nt.unit.eight],
    [nt.items.gibberellin, nt.unit.nine],
  ];

  const isLiquid = tab === "liquid";
  const compTitle = isLiquid ? P.nanoecovermComposition.title : P.composition.title;
  const compSub = isLiquid ? P.nanoecovermComposition.description : P.composition.description;
  const compNote = isLiquid ? ep.liquidNote : ep.granuleNote;
  const compHead0 = isLiquid ? nt.component : P.composition.indicator;
  const compHead1 = isLiquid ? nt.amount : P.composition.value;
  const compRows = isLiquid ? nanoRows : bioRows;

  const characteristics = P.biohumusInfo.characteristics;
  const charRows: [string, string][] = [
    characteristics.type,
    characteristics.composition,
    characteristics.usage,
    characteristics.form,
    characteristics.package,
    characteristics.storage,
  ].map((s) => {
    const idx = s.indexOf(": ");
    return idx > -1 ? [s.slice(0, idx), s.slice(idx + 2)] : [s, ""];
  });
  const advantages = [
    P.biohumusInfo.advantages.fertility,
    P.biohumusInfo.advantages.structure,
    P.biohumusInfo.advantages.microorganisms,
    P.biohumusInfo.advantages.ecoSafe,
  ];

  const usageSteps = ep.usageSteps;
  const usageIcons = ["drop", "soil", "leaf"];

  return (
    <div className="page eko">
      {/* Sub-hero */}
      <section className="phero phero--bleed">
        <div className="container phero__inner">
          <div className="phero__text">
            <Reveal>
              <Eyebrow variant="green">{ep.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="display phero__title">
                {ep.title1} <em>{ep.title2}</em>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead">{ep.subtitle}</p>
            </Reveal>
            <Reveal delay={3} className="phero__chips">
              <span className="chip">
                <Icon name="leaf" size={14} /> {ep.chipOrganic}
              </span>
              <span className="chip chip--ochre">
                <Icon name="award" size={14} /> {ep.chipCertified}
              </span>
              <span className="chip chip--clay">
                <Icon name="truck" size={14} /> {ep.chipDelivery}
              </span>
            </Reveal>
          </div>
          <Reveal delay={2} className="phero__media">
            <Slot
              src="/images/originals/Products.png"
              alt={P.title}
              placeholder={ep.heroPlaceholder}
              className="phero__photo"
              radius={20}
              priority
              width={2048}
              height={2048}
              sources={optimizedSources("/images/originals/Products.png")}
              sizes="(min-width: 980px) 55vw, (min-width: 500px) 460px, 92vw"
            />
          </Reveal>
        </div>
      </section>

      {/* Tab switch */}
      <section className="section section--tight">
        <div className="container">
          <div className="ptabs">
            <button className={`ptab ${tab === "granule" ? "ptab--on" : ""}`} onClick={() => setTab("granule")}>
              <Icon name="soil" size={20} />{" "}
              <span>
                BIOGUMUS<small>{ep.tabGranuleSmall}</small>
              </span>
            </button>
            <button className={`ptab ptab--liquid ${tab === "liquid" ? "ptab--on" : ""}`} onClick={() => setTab("liquid")}>
              <Icon name="drop" size={20} />{" "}
              <span>
                NANOECOVERM<small>{ep.tabLiquidSmall}</small>
              </span>
            </button>
            <button className="ptab ptab--video" onClick={() => setVideoOpen(true)}>
              <Icon name="play" size={20} />{" "}
              <span>
                {ep.tabVideo}
                <small>{ep.tabVideoSmall}</small>
              </span>
            </button>
          </div>

          {tab === "granule" && (
            <div className="pgroup">
              <div className="pgroup__head">
                <div>
                  <h2 className="h-section">{P.productCards.title}</h2>
                  <p className="lead" style={{ marginTop: 14, maxWidth: 600 }}>
                    {P.productCards.subtitle}
                  </p>
                </div>
                <div className="pgroup__feats">
                  {granuleFeatures.map((f, i) => (
                    <span key={i} className="chip">
                      <Icon name="check" size={13} /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <PresBar
                eyebrow={e.presentationEyebrow}
                title={ep.presGranuleTitle}
                text={ep.presGranuleText}
                cta={e.viewPresentation}
                onOpen={() => setPres("granule")}
                variant="green"
              />
              <div className="pcards" key="gran">
                {P.productCards.products.map((p, i) => (
                  <div key={i} className="pcard">
                    <div className="pcard__media">
                      <Slot src={granuleImg(p.weight)} alt={`BIOGUMUS ${p.weight} ${e.weightUnit}`} placeholder={`${p.weight} ${e.weightUnit}`} className="pcard__photo" radius={12} fit="contain" sources={optimizedSources(granuleImg(p.weight))} sizes={PCARD_SIZES} />
                      <span className="pcard__weight mono">
                        {p.weight} {e.weightUnit}
                      </span>
                    </div>
                    <div className="pcard__body">
                      <span className="pcard__name">BIOGUMUS</span>
                      <p className="pcard__desc">{p.description}</p>
                      <div className="pcard__foot">
                        <div className="pcard__price">
                          <span className="mono">{e.fromLabel}</span>
                          <strong>{fmt(p.price)}</strong>
                          <span className="mono">{e.currency}</span>
                        </div>
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={() => openPurchase({ name: "BIOGUMUS", weight: p.weight, price: fmt(p.price) })}
                        >
                          <Icon name="cart" size={15} /> {e.buy}
                        </button>
                      </div>
                      <p className="pcard__note">{e.priceNote}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "liquid" && (
            <div className="pgroup">
              <div className="pgroup__head">
                <div>
                  <span className="chip chip--clay" style={{ marginBottom: 12 }}>
                    {P.liquidFertilizers.main}
                  </span>
                  <h2 className="h-section">{P.liquidFertilizers.title}</h2>
                  <p className="lead" style={{ marginTop: 14, maxWidth: 600 }}>
                    {P.liquidFertilizers.subtitle}
                  </p>
                </div>
                <div className="pgroup__feats">
                  {liquidFeatures.map((f, i) => (
                    <span key={i} className="chip chip--clay">
                      <Icon name="spark" size={13} /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <PresBar
                eyebrow={e.presentationEyebrow}
                title={ep.presLiquidTitle}
                text={ep.presLiquidText}
                cta={e.viewPresentation}
                onOpen={() => setPres("liquid")}
                variant="clay"
              />
              <div className="pcards pcards--3" key="liq">
                {P.liquidFertilizers.products.map((p, i) => (
                  <div key={i} className="pcard pcard--liquid">
                    <div className="pcard__media">
                      <Slot src={liquidImg(p.volume)} alt={`NANOECOVERM ${p.volume} ${e.volumeUnit}`} placeholder={`${p.volume} ${e.volumeUnit}`} className="pcard__photo" radius={12} fit="contain" sources={optimizedSources(liquidImg(p.volume))} sizes={PCARD_SIZES} />
                      <span className="pcard__weight mono">
                        {p.volume} {e.volumeUnit}
                      </span>
                    </div>
                    <div className="pcard__body">
                      <span className="pcard__name">NANOECOVERM</span>
                      <p className="pcard__desc">{p.description}</p>
                      <div className="pcard__foot">
                        <div className="pcard__price">
                          <span className="mono">{e.fromLabel}</span>
                          <strong>{fmt(p.price)}</strong>
                          <span className="mono">{e.currency}</span>
                        </div>
                        <button
                          className="btn btn--clay btn--sm"
                          onClick={() => openPurchase({ name: "NANOECOVERM", volume: p.volume, price: fmt(p.price) })}
                        >
                          <Icon name="cart" size={15} /> {e.buy}
                        </button>
                      </div>
                      <p className="pcard__note">{e.priceNote}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Composition spec — responds to active tab */}
      <section className="section comp">
        <div className="container comp__grid">
          <div className="comp__left">
            <Reveal>
              <Eyebrow variant="green">{ep.specEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="h-section">{compTitle}</h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="lead">{compSub}</p>
            </Reveal>
            <Reveal delay={2}>
              <div className="comp__note">
                <Icon name={isLiquid ? "drop" : "leaf"} size={20} />
                <p>{compNote}</p>
              </div>
            </Reveal>
          </div>
          <div className="comp__table-wrap">
            <table className="comp__table">
              <thead>
                <tr>
                  <th className="mono">{compHead0}</th>
                  <th className="mono">{compHead1}</th>
                </tr>
              </thead>
              <tbody key={tab}>
                {compRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td>
                    <td className="mono">{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Per-tab description */}
      <section className="section section--tight prodinfo" key={tab + "-info"}>
        <div className="container">
          {tab === "granule" ? (
            <div className="prodinfo__grid">
              <div className="prodinfo__lead">
                <Eyebrow variant="green">{ep.aboutProductEyebrow}</Eyebrow>
                <h2 className="h-section">{P.biohumusInfo.title}</h2>
                <p className="prodinfo__p">{P.biohumusInfo.description1}</p>
                <p className="prodinfo__p">{P.biohumusInfo.description2}</p>
              </div>
              <div className="prodinfo__cards">
                <div className="prodinfo__card">
                  <h4 className="prodinfo__cardh">
                    <Icon name="soil" size={18} /> {P.biohumusInfo.characteristicsTitle}
                  </h4>
                  <dl className="speclist">
                    {charRows.map(([k, v], i) => (
                      <div className="speclist__row" key={i}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="prodinfo__card prodinfo__card--adv">
                  <h4 className="prodinfo__cardh">
                    <Icon name="leaf" size={18} /> {P.biohumusInfo.advantagesTitle}
                  </h4>
                  <ul className="advlist">
                    {advantages.map((a, i) => (
                      <li key={i}>
                        <span className="advlist__ic">
                          <Icon name="check" size={13} />
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="prodinfo__proc">
              <div className="prodinfo__lead prodinfo__lead--center">
                <Eyebrow variant="green">{ep.technologyEyebrow}</Eyebrow>
                <h2 className="h-section">{P.productionProcess.title}</h2>
                <p className="lead">{ep.processSubtitle}</p>
              </div>
              <div className="proc__steps">
                {ep.processSteps.map((s, i) => (
                  <div className="proc__step" key={i}>
                    <span className="proc__n mono">{s.n}</span>
                    <div>
                      <h4>{s.t}</h4>
                      <p>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="proc__adv">
                <h4 className="prodinfo__cardh">
                  <Icon name="spark" size={18} /> {P.productionProcess.advantagesTitle}
                </h4>
                <p>{P.productionProcess.advantagesDescription}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Usage steps */}
      <section className="section section--tight usage">
        <div className="container">
          <SectionHead eyebrow={ep.usageEyebrow} title={ep.usageTitle} center />
          <div className="usage__grid">
            {usageSteps.map((s, i) => (
              <Reveal key={i} delay={(i % 3) as 0 | 1 | 2} className="usage__step">
                <span className="usage__n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="usage__ic">
                  <Icon name={usageIcons[i]} size={26} />
                </span>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={2} className="center" style={{ marginTop: 44 }}>
            <button className="btn btn--primary btn--lg" onClick={() => openPurchase()}>
              <Icon name="cart" size={18} /> {e.choosePackage}
            </button>
          </Reveal>
        </div>
      </section>

      <PresModal
        kind={pres}
        title={pres === "liquid" ? ep.presLiquidTitle : ep.presGranuleTitle}
        eyebrow={e.presentationEyebrow}
        slideLabel={ep.slide}
        closeLabel={t.purchaseModal.close}
        onClose={() => setPres(null)}
      />

      <VideoModal
        open={videoOpen}
        eyebrow={e.videoEyebrow}
        title={P.youtubeSection.title}
        text={P.youtubeSection.description}
        channelLabel={P.youtubeSection.button}
        closeLabel={t.purchaseModal.close}
        onClose={() => setVideoOpen(false)}
      />
    </div>
  );
}
