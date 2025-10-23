import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getSite, saveSite, publishSite, initDatabase } from './db.js';
import { writeSnapshot } from './kv.js';

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for local development
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4321'],
  allowHeaders: ['Content-Type'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Initialize database on startup
app.use('*', async (c, next) => {
  try {
    await initDatabase(c.env.DB);
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw here, let the request continue and handle errors in individual routes
  }
  await next();
});

// GET /api/site/:id?published=0|1
app.get('/api/site/:id', async (c) => {
  const id = c.req.param('id');
  const published = c.req.query('published') === '1' ? 1 : 0;
  
  try {
    // Ensure database is initialized before querying
    await initDatabase(c.env.DB);
    
    const site = await getSite(c.env.DB, id, published);
    if (!site) {
      return c.json({ error: 'Site not found' }, 404);
    }
    return c.json(site);
  } catch (error) {
    console.error('Error fetching site:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/save
app.post('/api/save', async (c) => {
  try {
    const body = await c.req.json();
    const { id, header, body: bodyContent, footer, theme } = body;
    
    if (!id || !header || !bodyContent || !footer || !theme) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const site = await saveSite(c.env.DB, {
      id,
      header,
      body: bodyContent,
      footer,
      theme,
      published: 0,
      updated_at: new Date().toISOString()
    });
    
    return c.json(site);
  } catch (error) {
    console.error('Error saving site:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/publish/:id
app.post('/api/publish/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    // First get the draft site
    const draftSite = await getSite(c.env.DB, id, 0);
    if (!draftSite) {
      return c.json({ error: 'Draft site not found' }, 404);
    }
    
    // Publish the site (set published=1)
    const publishedSite = await publishSite(c.env.DB, id);
    
    // Write snapshot to KV for caching
    await writeSnapshot(c.env.KV, id, publishedSite);
    
    return c.json(publishedSite);
  } catch (error) {
    console.error('Error publishing site:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
