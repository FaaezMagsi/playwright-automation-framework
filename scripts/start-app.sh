#!/usr/bin/env bash
# Starts Toolshop locally and loads its demo data.
set -euo pipefail
compose="docker compose -f docker-compose.app.yml"
$compose up -d --quiet-pull
for attempt in $(seq 1 30); do
  if $compose exec -T laravel-api php artisan migrate:fresh --seed --force; then
    echo "Application database is ready"
    exit 0
  fi
  echo "Database not ready (attempt $attempt), retrying"
  sleep 5
done
$compose logs --tail 50
exit 1
