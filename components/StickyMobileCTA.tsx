import { useLanguage } from "../contexts/LanguageContext";
import { Icon } from "./eko/Icon";
import { PHONE_RAW, TELEGRAM_URL } from "../utils/contacts";

export function StickyMobileCTA() {
  const { t } = useLanguage();

  return (
    <aside
      aria-label={t.footer.contact}
      className="fixed right-6 z-50 flex flex-col gap-4 md:hidden"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.a11y.telegram}
        className="w-14 h-14 bg-[#0088cc] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
      >
        <Icon name="telegram" size={28} />
      </a>
      <a
        href={`tel:${PHONE_RAW}`}
        aria-label={t.a11y.phoneCall}
        className="w-14 h-14 bg-ekogumus-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
      >
        <Icon name="phone" size={26} />
      </a>
    </aside>
  );
}