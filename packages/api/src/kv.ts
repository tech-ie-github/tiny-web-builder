import type { SiteContent } from '@tiny-builder/shared';

export interface KVBindings {
  KV: KVNamespace;
}

const SNAPSHOT_PREFIX = 'site:';

export const writeSnapshot = async (kv: KVNamespace, site: SiteContent) => {
  const key = `${SNAPSHOT_PREFIX}${site.id}`;
  await kv.put(key, JSON.stringify(site), { metadata: { updated_at: site.updated_at } });
};
