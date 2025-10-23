import type { FC, FormEvent } from 'react';
import type { SiteContent } from '@tiny-builder/shared';

interface EditorProps {
  content: SiteContent;
  onChange: (value: Partial<SiteContent>) => void;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
  lastSavedAt?: Date | null;
}

export const Editor: FC<EditorProps> = ({
  content,
  onChange,
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  lastSavedAt
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6 overflow-auto p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600" htmlFor="header">
          Header
        </label>
        <input
          id="header"
          value={content.header}
          onChange={(event) => onChange({ header: event.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-slate-400 focus:outline-none"
          placeholder="Enter a headline"
        />
      </div>

      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium text-slate-600" htmlFor="body">
          Body
        </label>
        <textarea
          id="body"
          value={content.body}
          onChange={(event) => onChange({ body: event.target.value })}
          className="h-64 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-slate-400 focus:outline-none"
          placeholder="Write your story..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600" htmlFor="footer">
          Footer
        </label>
        <input
          id="footer"
          value={content.footer}
          onChange={(event) => onChange({ footer: event.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-slate-400 focus:outline-none"
          placeholder="Add a closing message"
        />
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-slate-200 pt-4">
        <div className="text-xs text-slate-500">
          {isSaving
            ? 'Saving draft...'
            : lastSavedAt
            ? `Last saved ${lastSavedAt.toLocaleTimeString()}`
            : 'No saves yet'}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </form>
  );
};
