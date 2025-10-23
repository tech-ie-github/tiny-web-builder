export type ThemeName = 'Serene' | 'Bold';

export interface SiteContent {
  id: string;
  header: string;
  body: string;
  footer: string;
  theme: ThemeName;
  published: 0 | 1;
  updated_at: string;
}

export interface Theme {
  name: ThemeName;
  background: string;
  foreground: string;
  accent: string;
  accentForeground: string;
  border: string;
  fontFamily: string;
}
