import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { SiteContent } from '@tiny-builder/shared';
import { getSite, publishSite, saveSite } from './db';
import { writeSnapshot } from './kv';

interface Env {
  Bindings: {
    DB: D1Database;
    KV: KVNamespace;
  };
}

const app = new Hono<Env>();

app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type']
}));

app.get('/api/site/:id', async (c) => {
  const id = c.req.param('id');
  const published = Number(c.req.query('published') ?? '1');
  const flag = published === 0 ? 0 : 1;
  const site = await getSite(c.env.DB, id, flag);

  if (!site) {
    return c.json({ error: 'Not Found' }, 404);
  }

  return c.json(site satisfies SiteContent);
});

app.post('/api/save', async (c) => {
  const body = await c.req.json<SiteContent>();
  if (!body.id) {
    return c.json({ error: 'Missing id' }, 400);
  }

  const saved = await saveSite(c.env.DB, {
    id: body.id,
    header: body.header,
    body: body.body,
    footer: body.footer,
    theme: body.theme,
    published: 0
  });

  return c.json(saved satisfies SiteContent);
});

app.post('/api/publish/:id', async (c) => {
  const id = c.req.param('id');
  const published = await publishSite(c.env.DB, id);
  await writeSnapshot(c.env.KV, published);
  return c.json(published satisfies SiteContent);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

export default app;
