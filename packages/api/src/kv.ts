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

export async function writeSnapshot(kv: KVNamespace, id: string, site: SiteContent): Promise<void> {
  const key = `site:${id}:published`;
  await kv.put(key, JSON.stringify(site), {
    expirationTtl: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function getSnapshot(kv: KVNamespace, id: string): Promise<SiteContent | null> {
  const key = `site:${id}:published`;
  const value = await kv.get(key);
  
  if (!value) {
    return null;
  }
  
  try {
    return JSON.parse(value) as SiteContent;
  } catch (error) {
    console.error('Error parsing KV snapshot:', error);
    return null;
  }
}
