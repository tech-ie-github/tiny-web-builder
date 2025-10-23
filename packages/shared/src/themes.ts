import type { Theme, ThemeName } from './types';

export const THEMES: Record<ThemeName, Theme> = {
  Serene: {
    name: 'Serene',
    background: '#f8fafc',
    foreground: '#0f172a',
    accent: '#38bdf8',
    accentForeground: '#0f172a',
    border: '#cbd5f5',
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  Bold: {
    name: 'Bold',
    background: '#0f172a',
    foreground: '#f8fafc',
    accent: '#f97316',
    accentForeground: '#0f172a',
    border: '#1e293b',
    fontFamily: '"Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }
};
