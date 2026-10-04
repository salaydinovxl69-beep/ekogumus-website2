/* «Земля и Зерно» — scroll reveal, animated counter, focus trap.
   The design prototype used scroll-position polling because IntersectionObserver
   didn't fire in its sandbox; in the real app IO is cleaner and is used here. */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: ElementType;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/* Первая загрузка страницы: всё, что уже видно на экране, показываем сразу,
   без анимации — пререндеренный HTML виден до загрузки JS, и браузер (и
   Lighthouse) не ждёт скрипт, чтобы отрисовать первый экран (LCP).
   Анимируем только то, что ниже экрана, и всё — при переходах внутри сайта. */
let initialLoadDone = false;
if (typeof window !== "undefined") {
  const markDone = () => setTimeout(() => (initialLoadDone = true), 0);
  if (document.readyState === "complete") markDone();
  else window.addEventListener("load", markDone, { once: true });
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Ниже видимой части экрана — значит, можно спрятать и проявить при прокрутке. */
function shouldAnimate(el: HTMLElement) {
  if (initialLoadDone) return true;
  return el.getBoundingClientRect().top > window.innerHeight;
}

function onVisible(el: HTMLElement, cb: () => void, options: IntersectionObserverInit) {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      cb();
      io.disconnect();
    }
  }, options);
  io.observe(el);
  return () => io.disconnect();
}

export function Reveal({ children, delay = 0, as, className = "", ...rest }: RevealProps) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  // static — видно сразу (так и в пререндеренном HTML); pending — спрятано до прокрутки
  const [state, setState] = useState<"static" | "pending" | "in">("static");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate(el)) return;
    setState("pending");
    return onVisible(el, () => requestAnimationFrame(() => setState("in")), {
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.01,
    });
  }, []);

  const cls = state === "static" ? "reveal" : state === "pending" ? "reveal reveal--pending" : "reveal reveal--pending in";
  return (
    <Tag ref={ref} className={`${cls} ${className}`.trim()} data-d={delay || undefined} {...rest}>
      {children}
    </Tag>
  );
}

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function Counter({ end, duration = 1600, suffix = "", className = "" }: CounterProps) {
  // Итоговое число — сразу (в HTML для поисковиков и первого экрана), счёт с нуля —
  // только для счётчиков ниже экрана или при переходе внутри сайта
  const [val, setVal] = useState(end);
  const ref = useRef<HTMLSpanElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate(el)) return;
    setVal(0);
    let raf = 0;
    const stop = onVisible(
      el,
      () => {
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          setVal(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}

/* Focus trap for the drawer / modals — keeps Tab within the panel and Esc closes it. */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onClose?: () => void
) {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const prev = document.activeElement as HTMLElement | null;
    const SEL =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const list = () =>
      Array.from(node.querySelectorAll<HTMLElement>(SEL)).filter(
        (el) => el.offsetParent !== null
      );
    const els = list();
    if (els[0]) els[0].focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose && onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = list();
      if (!f.length) return;
      const first = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
