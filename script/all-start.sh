#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/common.sh"

PROFILE="$(resolve_profile "${1:-}")"

printf '[info] profile=%s\n' "${PROFILE}"

(
  cd "${ROOT_DIR}"
  docker compose --env-file ./.env -f ./infra/db/docker-compose.yml up -d
)

start_process \
  "api-admin-server" \
  "${LOG_DIR}/api-admin-server.log" \
  bash -lc "cd '${ROOT_DIR}/backand' && export SPRING_PROFILES_ACTIVE='${PROFILE}' && exec ./gradlew :application:api-admin-server:bootRun"

start_process \
  "api-service-server" \
  "${LOG_DIR}/api-service-server.log" \
  bash -lc "cd '${ROOT_DIR}/backand' && export SPRING_PROFILES_ACTIVE='${PROFILE}' && exec ./gradlew :application:api-service-server:bootRun"

start_process \
  "ui-admin" \
  "${LOG_DIR}/ui-admin.log" \
  bash -lc "cd '${ROOT_DIR}/frontend/ui-admin' && export APP_PROFILE='${PROFILE}' && if [[ ! -d node_modules ]]; then npm install; fi && exec npm run dev"

printf '[done] all services started\n'
printf '\n'
printf 'Infra\n'
printf '  MariaDB: localhost:23306\n'
printf '  Database: app\n'
printf '  Username: app\n'
printf '  Password: app\n'
printf '\n'
printf 'Services\n'
printf '  Frontend: http://localhost:3000\n'
printf '  Admin API Swagger: http://localhost:8080/swagger-ui/index.html\n'
printf '  Service API Swagger: http://localhost:9090/swagger-ui/index.html\n'
printf '\n'
printf 'Logs\n'
printf '  ui-admin: %s\n' "${LOG_DIR}/ui-admin.log"
printf '  api-admin-server: %s\n' "${LOG_DIR}/api-admin-server.log"
printf '  api-service-server: %s\n' "${LOG_DIR}/api-service-server.log"
