CREATE TABLE IF NOT EXISTS sites (
  id TEXT NOT NULL,
  header TEXT,
  body TEXT,
  footer TEXT,
  theme TEXT DEFAULT 'Serene',
  published INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (id, published)
);
