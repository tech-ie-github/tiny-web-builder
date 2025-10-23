#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required. Install pnpm before running this script." >&2
  exit 1
fi

if ! command -v wrangler >/dev/null 2>&1; then
  echo "Wrangler CLI (v4+) is required. Install it from https://developers.cloudflare.com/workers/wrangler/install-and-update/." >&2
  exit 1
fi

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$ROOT_DIR"

pnpm install

wrangler d1 create tiny-builder-db --local >/dev/null 2>&1 || true
wrangler kv:namespace create SITE_CACHE --local >/dev/null 2>&1 || true

if [ ! -f packages/api/schema.sql ]; then
  echo "Missing D1 schema file." >&2
  exit 1
fi

wrangler d1 execute tiny-builder-db --local --file=./packages/api/schema.sql >/dev/null 2>&1 || true

if [ -f packages/api/seed.sql ]; then
  wrangler d1 execute tiny-builder-db --local --file=./packages/api/seed.sql || true
fi

echo "Setup complete. Use separate terminals to run pnpm dev:api, pnpm dev:public, and pnpm dev:editor."
