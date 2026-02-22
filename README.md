# Scaffolding Generic Web

웹 어드민 프로젝트 모노레포입니다.

- `backand`: Spring Boot API 서버
- `frontend/ui-admin`: Next.js + Refine 기반 어드민 UI
- `infra/db`: 로컬 DB 도커 컴포즈
- `script`: 실행 보조 스크립트

## Prerequisites

- Node.js 20+
- npm
- Docker / Docker Compose
- JDK 21

## Quick Start

### 1) DB 실행

```bash
./script/run-infra.sh
```

또는:

```bash
docker compose -f ./infra/db/docker-compose.yml up -d
```

### 2) Backend 실행

```bash
cd backand
./gradlew :application:api-admin-server:bootRun
```

### 3) Frontend 실행

```bash
./script/run-front.sh
```

또는:

```bash
cd frontend/ui-admin
npm run dev
```

## URLs

- Frontend: `http://localhost:3000`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Frontend Validation

```bash
cd frontend/ui-admin
npm run build
npm run test:e2e
```

## Template Docs

`_dummy-page` 복사 후 도메인 생성 가이드:

- `frontend/ui-admin/docs/help.md`

## Stop Infra

```bash
./script/stop-infra.sh
```

또는:

```bash
docker compose -f ./infra/db/docker-compose.yml down -v
```
