// Note: Import will be resolved at runtime by the bundler
// import { SiteContent } from '@tiny-web-builder/shared';

export interface SiteContent {
  id: string;
  header: string;
  body: string;
  footer: string;
  theme: 'Serene' | 'Bold';
  published: 0 | 1;
  updated_at: string;
}

export async function initDatabase(db: D1Database): Promise<void> {
  try {
    // Create sites table if it doesn't exist - using single line SQL
    await db.exec("CREATE TABLE IF NOT EXISTS sites (id TEXT PRIMARY KEY, header TEXT, body TEXT, footer TEXT, theme TEXT DEFAULT 'Serene', published INTEGER DEFAULT 0, updated_at TEXT DEFAULT (datetime('now')))");

    // Check if default site exists, if not create it
    const existingSite = await db.prepare('SELECT id FROM sites WHERE id = ?').bind('default').first();
    
    if (!existingSite) {
      // Insert default site
      await db.prepare(`
        INSERT INTO sites (id, header, body, footer, theme, published) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        'default',
        'TheraPages – Tiny Builder POC',
        'Welcome to your micro site! This is a proof of concept for a tiny website builder using Cloudflare\'s stack.\n\n**Features:**\n- Live preview editing\n- Multiple themes (Serene & Bold)\n- Instant publishing\n- Local development with Miniflare\n\nStart editing to see your changes appear instantly in the preview panel.',
        '© 2025 My Practice',
        'Serene',
        0
      ).run();
      
      console.log('✅ Default site created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function getSite(db: D1Database, id: string, published: 0 | 1): Promise<SiteContent | null> {
  const stmt = db.prepare(`SELECT id, header, body, footer, theme, published, updated_at
    FROM sites 
    WHERE id = ? AND published = ?`);
  
  const result = await stmt.bind(id, published).first();
  
  if (!result) {
    return null;
  }
  
  return {
    id: result.id as string,
    header: result.header as string,
    body: result.body as string,
    footer: result.footer as string,
    theme: result.theme as 'Serene' | 'Bold',
    published: result.published as 0 | 1,
    updated_at: result.updated_at as string
  };
}

export async function saveSite(db: D1Database, site: SiteContent): Promise<SiteContent> {
  const stmt = db.prepare(`INSERT OR REPLACE INTO sites (id, header, body, footer, theme, published, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  
  await stmt.bind(
    site.id,
    site.header,
    site.body,
    site.footer,
    site.theme,
    site.published,
    site.updated_at
  ).run();
  
  return site;
}

export async function publishSite(db: D1Database, id: string): Promise<SiteContent> {
  // First get the draft
  const draftSite = await getSite(db, id, 0);
  if (!draftSite) {
    throw new Error('Draft site not found');
  }
  
  // Create published version
  const publishedSite: SiteContent = {
    ...draftSite,
    published: 1,
    updated_at: new Date().toISOString()
  };
  
  // Save as published
  await saveSite(db, publishedSite);
  
  return publishedSite;
}
