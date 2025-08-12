#!/bin/bash
set -e

echo "PWD: $(pwd)"
echo "Listing current dir:"
ls -la

# pnpm store はボリュームに固定されている想定（PNPM_STORE_DIR=/pnpm-store）
echo "Using PNPM store at: ${PNPM_STORE_DIR:-/pnpm-store}"
pnpm config set store-dir "${PNPM_STORE_DIR:-/pnpm-store}"

# 初回や依存追加時に確実に通す
if [ ! -d node_modules ]; then
  echo "node_modules not found. Installing..."
  pnpm install
else
  echo "node_modules exists. Running pnpm install to ensure deps..."
  pnpm install
fi

echo "Starting dev server..."
exec pnpm dev
