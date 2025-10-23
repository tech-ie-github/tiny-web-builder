import type { FC } from 'react';
import { THEMES } from '../themes';
import type { SiteContent, Theme } from '../types';
import { RichText } from './RichText';

interface SiteProps {
  content: SiteContent;
  theme?: Theme;
}

const formatUpdatedAt = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString();
  } catch (error) {
    console.error('Failed to format timestamp', error);
    return timestamp;
  }
};

export const Site: FC<SiteProps> = ({ content, theme }) => {
  const activeTheme = theme ?? THEMES[content.theme];

  return (
    <div
      style={{
        fontFamily: activeTheme.fontFamily,
        background: activeTheme.background,
        color: activeTheme.foreground
      }}
      className="min-h-screen w-full"
    >
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
        <header className="border-b pb-6" style={{ borderColor: activeTheme.border }}>
          <h1 className="text-4xl font-bold tracking-tight">{content.header}</h1>
          <p className="mt-2 text-sm opacity-80">Last updated {formatUpdatedAt(content.updated_at)}</p>
        </header>

        <main className="flex-1 py-10">
          <RichText content={content.body} />
        </main>

        <footer className="border-t pt-6 text-sm opacity-90" style={{ borderColor: activeTheme.border }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span>{content.footer}</span>
            <a
              href="https://example.com"
              style={{
                background: activeTheme.accent,
                color: activeTheme.accentForeground
              }}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium"
            >
              Contact us
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Site;
