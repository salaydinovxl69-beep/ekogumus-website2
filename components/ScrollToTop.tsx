import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { stripLang } from "../utils/routing";

export function ScrollToTop() {
  /* Без языкового префикса: смена языка — та же страница, прокрутку не сбрасываем */
  const page = stripLang(useLocation().pathname);

  useEffect(() => {
    // Прокрутка страницы в начало при каждой смене URL
    window.scrollTo(0, 0);
  }, [page]);

  return null;
}