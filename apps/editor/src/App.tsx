import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SiteContent, ThemeName } from '@tiny-builder/shared';
import { THEMES } from '@tiny-builder/shared';
import { Editor } from './components/Editor';
import { PreviewFrame } from './components/PreviewFrame';
import { useAutoSave } from './hooks/useAutoSave';

const SITE_ID = 'default';
const PREVIEW_BASE = import.meta.env.VITE_PREVIEW_BASE_URL ?? 'http://127.0.0.1:4321';
const DEVICE_OPTIONS = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'mobile', label: 'Mobile' }
] as const;

const createFallbackContent = (): SiteContent => ({
  id: SITE_ID,
  header: 'TheraPages – Tiny Builder POC',
  body: 'Welcome to your micro site. Customize the header, body, and footer to share updates with clients.',
  footer: '© 2025 My Practice',
  theme: 'Serene',
  published: 0,
  updated_at: new Date().toISOString()
});

export default function App() {
  const [content, setContent] = useState<SiteContent>(() => createFallbackContent());
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [device, setDevice] = useState<typeof DEVICE_OPTIONS[number]['id']>('desktop');
  const [refreshToken, setRefreshToken] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const previewUrl = useMemo(() => `${PREVIEW_BASE}/preview/${SITE_ID}`, []);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await fetch(`/api/site/${SITE_ID}?published=0`);
        if (!response.ok) {
          throw new Error(`Failed to load draft (${response.status})`);
        }
        const draft = await response.json();
        setContent({ ...draft, published: 0 });
      } catch (err) {
        console.warn('Falling back to seed content', err);
        setContent(createFallbackContent());
      } finally {
        setIsLoaded(true);
      }
    };

    loadDraft();
  }, []);

  const handleContentChange = useCallback((value: Partial<SiteContent>) => {
    setContent((current) => ({ ...current, ...value, published: 0, id: SITE_ID }));
  }, []);

  const saveDraft = useCallback(
    async (next: SiteContent) => {
      setIsSaving(true);
      setError(null);
      try {
        const response = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...next, published: 0 })
        });

        if (!response.ok) {
          throw new Error('Failed to save draft');
        }

        const saved = await response.json();
        setContent((current) => ({ ...current, updated_at: saved.updated_at, published: 0 }));
        setLastSavedAt(new Date());
        setRefreshToken((token) => token + 1);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const publish = useCallback(async () => {
    setIsPublishing(true);
    setError(null);
    try {
      const response = await fetch(`/api/publish/${SITE_ID}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to publish site');
      }

      const published = await response.json();
      setContent((current) => ({ ...current, updated_at: published.updated_at }));
      setRefreshToken((token) => token + 1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsPublishing(false);
    }
  }, []);

  useAutoSave(content, saveDraft, 3000, isLoaded);

  const themeOptions = useMemo(() => Object.values(THEMES), []);

  const handleThemeChange = useCallback(
    (theme: ThemeName) => {
      handleContentChange({ theme });
    },
    [handleContentChange]
  );

  return (
    <div className="grid h-screen grid-cols-1 bg-slate-100 text-slate-900 md:grid-cols-[420px,1fr]">
      <div className="flex h-full flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <h1 className="text-xl font-semibold">Tiny Web Builder</h1>
          <p className="mt-1 text-sm text-slate-500">Instantly preview your micro site while editing.</p>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <label className="text-sm font-medium text-slate-600">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => handleThemeChange(theme.name)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    content.theme === theme.name
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
            <label className="mt-4 text-sm font-medium text-slate-600">Device</label>
            <div className="grid grid-cols-3 gap-2">
              {DEVICE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDevice(option.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    device === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Editor
            content={content}
            onChange={handleContentChange}
            onSaveDraft={() => saveDraft(content)}
            onPublish={publish}
            isSaving={isSaving}
            isPublishing={isPublishing}
            lastSavedAt={lastSavedAt}
          />
        </div>
        {error && <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      </div>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Live preview</p>
            <p className="text-xs text-slate-500">{previewUrl}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Draft</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <PreviewFrame src={previewUrl} device={device} refreshToken={refreshToken} />
        </div>
      </div>
    </div>
  );
}
