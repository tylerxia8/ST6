#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
WEB_BASE_URL="${WEB_BASE_URL:-http://localhost:8088}"
OWNER_ID="${DEMO_OWNER_ID:-u-ava}"
WEEK_START="${DEMO_WEEK_START:-2026-06-22}"

wait_for() {
  local url="$1"
  local attempts="$2"

  for _ in $(seq 1 "$attempts"); do
    if curl -fsS "$url" >/dev/null; then
      return 0
    fi
    sleep 2
  done

  curl -fsS "$url" >/dev/null
}

wait_for "$API_BASE_URL/actuator/health" 45
curl -fsS "$API_BASE_URL/api/outcomes" | grep "Win enterprise trust" >/dev/null
curl -fsS "$API_BASE_URL/api/plans/current?ownerId=$OWNER_ID&weekStart=$WEEK_START" \
  | grep "Ava Chen" >/dev/null

wait_for "$WEB_BASE_URL" 30
