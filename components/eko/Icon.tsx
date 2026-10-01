/* «Земля и Зерно» — line icon set (ported from the Claude Design handoff).
   A small bespoke set keeps the artisanal/lab feel consistent across the redesign. */
import type { CSSProperties } from "react";

export const ICON_PATHS: Record<string, string> = {
  leaf: '<path d="M5 21c0-7 4-14 14-16 0 8-3 15-12 16M5 21c2-4 5-7 9-9" />',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/>',
  spark: '<path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="M7 7l3 3M14 14l3 3M17 7l-3 3M10 14l-3 3"/>',
  heart: '<path d="M12 20s-7-4.4-9.2-9C1.3 8 3 5 6 5c2 0 3.2 1.3 4 2.4C10.8 6.3 12 5 14 5c3 0 4.7 3 3.2 6-2.2 4.6-5.2 9-5.2 9z"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M16 7h5v5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  soil: '<path d="M3 14h18M3 14c2-2 4-2 6 0M3 18h18"/><path d="M12 4v6M9 7l3-3 3 3"/>',
  drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 9h16M8 3v4M16 3v4"/>',
  truck: '<path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
  check: '<path d="M5 12l4.5 4.5L19 7"/>',
  award: '<circle cx="12" cy="9" r="5.5"/><path d="M9 13.5L8 21l4-2 4 2-1-7.5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/>',
  handshake: '<path d="M6 12l3-3 3 2 3-2 3 3M3 10l3-2 3 1M21 10l-3-2-3 1M6 12l2.5 2.5a2 2 0 002.8 0L12 14"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L16 13l5 2v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
  telegram: '<path d="M21 5L3 12l5 2 2 5 3-4 5 3z"/><path d="M8 14l9-7-6 8"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10 9.5l5 2.5-5 2.5z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-1.7 1-3 2.5-3s2.5 1 2.5 3V17"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  chevL: '<path d="M15 6l-6 6 6 6"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  pin: '<path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  quote: '<path d="M9 7c-2.5 0-4 2-4 4.5S6.5 16 9 16v-3H7c0-1.5.8-3 2-3zM18 7c-2.5 0-4 2-4 4.5S15.5 16 18 16v-3h-2c0-1.5.8-3 2-3z"/>',
  sprout: '<path d="M12 21v-8M12 13c0-3-2-5-5-5 0 3 2 5 5 5zM12 13c0-3 2-5 5-5 0 3-2 5-5 5z"/>',
  star: '<path d="M12 4l2.3 4.8 5.2.6-3.8 3.5 1 5.1L12 15.8 7.3 18.6l1-5.1L4.5 10l5.2-.6z"/>',
  cart: '<path d="M4 5h2l2 11h9l2-7H7"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/>',
  moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
};

export type IconName = keyof typeof ICON_PATHS;

interface IconProps {
  name: IconName | string;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 24, stroke = 1.7, className = "", style }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || "" }}
    />
  );
}
