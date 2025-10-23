CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  header TEXT,
  body TEXT,
  footer TEXT,
  theme TEXT DEFAULT 'Serene',
  published INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);
