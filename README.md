# Tiny Web Builder - Cloudflare Stack POC

A proof of concept for a tiny website builder using Cloudflare's modern stack, featuring live preview editing, instant publishing, and fully local development with Miniflare.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Editor  │    │  Astro Public   │    │ Cloudflare API  │
│   (Port 5173)   │    │   (Port 4321)   │    │   (Port 8787)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Package                               │
│  • Site.tsx React Component (preview + published)              │
│  • Serene & Bold Themes                                        │
│  • RichText Markdown Renderer                                  │
│  • TypeScript Types (aligned with D1 schema)                    │
└─────────────────────────────────────────────────────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Local Storage (Miniflare)                    │
│  • D1 Database (sites table)                                   │
│  • KV Namespace (published snapshots)                          │
│  • Persistent in .wrangler/state/                             │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

- **Live Preview**: Editor updates trigger instant iframe reload showing draft changes
- **Dual Rendering**: Both `/preview/[id]` and `/[id]` use identical `Site.tsx` React component
- **Theme System**: Serene (calm blues) and Bold (high contrast) themes
- **Local Development**: All data persists locally via Miniflare, no production Cloudflare access
- **Instant Publishing**: Save drafts to D1, publish copies to D1 + KV snapshot
- **Markdown Support**: Ultra-light markdown renderer for body content

## Prerequisites

- **Node.js** 18+ 
- **pnpm** 8+
- **Wrangler** 4+ (Cloudflare CLI)

## Quick Start

1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd tiny-web-builder
   ./setup.sh
   ```

2. **Start development servers**:
   ```bash
   pnpm dev
   ```

3. **Access the applications**:
   - **Editor**: http://localhost:5173/
   - **Preview (draft)**: http://localhost:4321/preview/default
   - **Published site**: http://localhost:4321/default
   - **API**: http://localhost:8787/api/

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **SSR**: Astro 4 with React integration
- **Backend**: Cloudflare Workers with Hono router
- **Database**: Cloudflare D1 (SQLite)
- **Cache**: Cloudflare KV
- **Development**: Miniflare (local Cloudflare simulation)
- **Package Management**: pnpm workspaces

## Project Structure

```
tiny-web-builder/
├── packages/
│   ├── shared/           # React components, types, themes
│   └── api/              # Cloudflare Worker (Hono + D1 + KV)
├── apps/
│   ├── editor/           # React SPA with live preview
│   └── public/           # Astro SSR (preview + published routes)
├── setup.sh              # One-command local setup
└── package.json          # Workspace configuration
```

## Development Workflow

1. **Edit content** in the React editor (left panel)
2. **See changes instantly** in the preview iframe (right panel)
3. **Save draft** to persist changes to D1 (`published=0`)
4. **Publish site** to make live (`published=1` + KV snapshot)
5. **View published site** at `http://localhost:4321/default`

## Data Flow

```
Editor Save → POST /api/save → D1 (published=0)
Preview → GET /preview/default → Astro SSR → GET /api/site/default?published=0 → D1 → Site.tsx
Publish → POST /api/publish/default → D1 (published=1) + KV snapshot
Published → GET /default → Astro SSR → GET /api/site/default?published=1 → D1 → Site.tsx
```

## Local Development Notes

- All development uses **Miniflare** (Wrangler's built-in local simulator)
- D1 database and KV data persist in `.wrangler/state/` directory
- No production Cloudflare resources are accessed during development
- CORS is configured for local development ports (5173, 4321)

## Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm dev:api` - Start API worker only
- `pnpm dev:public` - Start Astro public site only  
- `pnpm dev:editor` - Start React editor only
- `pnpm build` - Build all packages
- `pnpm db:init` - Create local D1 database
- `pnpm db:migrate` - Apply database schema
- `pnpm db:seed` - Insert initial data
- `pnpm kv:init` - Create local KV namespace

## API Endpoints

- `GET /api/site/:id?published=0|1` - Fetch site data
- `POST /api/save` - Save draft (published=0)
- `POST /api/publish/:id` - Publish site (published=1 + KV snapshot)

## Theme Customisation

Themes are defined in `packages/shared/src/themes.ts`:

- **Serene**: Calm blues, soft gradients, rounded corners, clean typography
- **Bold**: High contrast, vibrant colours, strong borders, impactful fonts

Both themes are fully responsive and include mobile optimisations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `./setup.sh && pnpm dev`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
