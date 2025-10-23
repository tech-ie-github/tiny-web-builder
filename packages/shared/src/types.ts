export interface SiteContent {
  id: string;
  header: string;
  body: string;
  footer: string;
  theme: 'Serene' | 'Bold';
  published: 0 | 1;
  updated_at: string;
}

export interface SiteMetadata {
  id: string;
  title: string;
  description: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  css: string;
}

export interface RenderOptions {
  id: string;
  header: string;
  body: string;
  footer: string;
  theme: Theme;
}
