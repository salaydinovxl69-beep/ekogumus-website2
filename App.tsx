import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PurchaseProvider } from "./contexts/PurchaseContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { StickyMobileCTA } from "./components/StickyMobileCTA";
import { PageSkeleton } from "./components/PageSkeleton";
import { Toaster } from "./components/ui/sonner";
import { lazy, Suspense } from "react";
import type { Language } from "./utils/i18n";
import type { TranslationKeys } from "./utils/translations";
// Главная — статически: убирает лишний RTT из цепочки до LCP на самом частом входе.
import { HomePage } from "./pages/HomePage";

// Lazy-loaded pages — уменьшают initial bundle, страницы грузятся по требованию
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProductPage = lazy(() => import("./pages/ProductPage").then(m => ({ default: m.ProductPage })));
const CooperationPage = lazy(() => import("./pages/CooperationPage").then(m => ({ default: m.CooperationPage })));
const ContactsPage = lazy(() => import("./pages/ContactsPage").then(m => ({ default: m.ContactsPage })));
const NewsPage = lazy(() => import("./pages/NewsPage").then(m => ({ default: m.NewsPage })));

/* Языковые префиксы адресов: "" — русский, /uz, /en */
const PREFIXES = ["", "/uz", "/en"];

interface AppProps {
  /** Словари, загруженные до первого рендера (пререндер / гидратация) */
  initialDicts?: Partial<Record<Language, TranslationKeys>>;
}

/* Router задаётся снаружи: BrowserRouter в браузере (main.tsx),
   StaticRouter при пререндере (entry-server.tsx). */
export default function App({ initialDicts }: AppProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialDicts={initialDicts}>
        <ScrollToTop />
        <PurchaseProvider>
          <div className="min-h-screen relative">
            <Header />
            <main className="relative z-10">
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  {PREFIXES.map((pre) => [
                    <Route key={pre + "/"} path={pre || "/"} element={<HomePage />} />,
                    <Route key={pre + "/about"} path={`${pre}/about`} element={<AboutPage />} />,
                    <Route key={pre + "/products"} path={`${pre}/products`} element={<ProductPage />} />,
                    <Route key={pre + "/cooperation"} path={`${pre}/cooperation`} element={<CooperationPage />} />,
                    <Route key={pre + "/news"} path={`${pre}/news`} element={<NewsPage />} />,
                    <Route key={pre + "/contacts"} path={`${pre}/contacts`} element={<ContactsPage />} />,
                  ])}

                  <Route path="/preview_page.html" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <StickyMobileCTA />
            <Toaster
              position="bottom-right"
              toastOptions={{ className: 'font-opensans' }}
              theme="light"
              richColors
            />
          </div>
        </PurchaseProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
