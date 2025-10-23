# Tiny Web Builder

Proof-of-concept Cloudflare-based tiny site builder with a React editor, Astro renderer, and shared component library.

## Workspace Layout

- `apps/editor` – React editor for managing content and instant iframe previews (Vite + Tailwind + Wrangler Pages dev).
- `apps/public` – Astro SSR renderer that serves both published and draft preview routes.
- `packages/api` – Cloudflare Workers API (Hono) backed by D1 and KV for persistence and publishing.
- `packages/shared` – Shared React components, themes, and types consumed by both apps.

## Getting Started

```bash
./setup.sh
```

The script installs dependencies, provisions local Miniflare state for D1/KV, runs the schema migration, and seeds the default site content.

Start each service in its own terminal:

```bash
pnpm dev:api      # Cloudflare Worker API on http://127.0.0.1:8787
pnpm dev:public   # Astro renderer on http://127.0.0.1:4321
pnpm dev:editor   # React editor on http://127.0.0.1:5173
```

All development uses local Miniflare resources via `wrangler dev --persist-to`, so no Cloudflare production resources are touched.
