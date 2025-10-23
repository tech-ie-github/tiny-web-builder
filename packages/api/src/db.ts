import type { SiteContent } from '@tiny-builder/shared';

export interface SaveSiteInput {
  id: string;
  header: string;
  body: string;
  footer: string;
  theme: SiteContent['theme'];
  published?: 0 | 1;
}

type D1Row = Record<string, unknown> | null;

const mapSite = (row: D1Row): SiteContent | null => {
  if (!row) return null;

  return {
    id: row.id as string,
    header: (row.header as string) ?? '',
    body: (row.body as string) ?? '',
    footer: (row.footer as string) ?? '',
    theme: (row.theme as SiteContent['theme']) ?? 'Serene',
    published: (row.published as 0 | 1) ?? 0,
    updated_at: (row.updated_at as string) ?? new Date().toISOString()
  };
};

export const getSite = async (
  db: D1Database,
  id: string,
  published: 0 | 1
): Promise<SiteContent | null> => {
  const stmt = await db.prepare(
    `SELECT * FROM sites WHERE id = ? AND published = ? ORDER BY updated_at DESC LIMIT 1`
  );
  const result = await stmt.bind(id, published).first<D1Row>();
  return mapSite(result ?? null);
};

export const saveSite = async (db: D1Database, input: SaveSiteInput): Promise<SiteContent> => {
  const published = input.published ?? 0;
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO sites (id, header, body, footer, theme, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id, published) DO UPDATE SET
         header = excluded.header,
         body = excluded.body,
         footer = excluded.footer,
         theme = excluded.theme,
         updated_at = excluded.updated_at`
    )
    .bind(input.id, input.header, input.body, input.footer, input.theme, published, now)
    .run();

  const saved = await getSite(db, input.id, published);
  if (!saved) {
    throw new Error('Failed to persist site');
  }

  return saved;
};

export const publishSite = async (db: D1Database, id: string): Promise<SiteContent> => {
  const draft = await getSite(db, id, 0);
  if (!draft) {
    throw new Error(`Draft for site ${id} not found`);
  }

  const published = await saveSite(db, { ...draft, published: 1 });
  return published;
};
