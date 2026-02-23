# Scaffolding Generic Web

웹 어드민 프로젝트 모노레포입니다.

- `backand`: Spring Boot API 서버
- `frontend/ui-admin`: Next.js + Refine 기반 어드민 UI
- `infra/db`: 로컬 DB 도커 컴포즈
- `script`: 실행 보조 스크립트

## Backend Modules

`backand/settings.gradle.kts` 기준 모듈:

- `:common`
- `:domain:entity-base`
- `:domain:entity`
- `:application:security:jwt`
- `:application:api-admin-server`

## JWT Filter Reuse

JWT 인증 필터는 공통 모듈에서 추상화되어 있습니다.

- 공통 추상 필터: `backand/application/security/jwt/src/main/java/com/revy/security/filter/AbstractJwtAuthenticationFilter.java`
- 서버 구현 필터 예시: `backand/application/api-admin-server/src/main/java/com/revy/api/admin/server/infra/filter/JwtAuthenticationFilter.java`

다른 프로젝트에서 재사용할 때:

1. `:application:security:jwt` 모듈 의존
2. `AbstractJwtAuthenticationFilter<T>` 상속 필터 생성
3. `resolvePrincipal`, `isActivePrincipal`, `toAuthentication` 구현
4. `SecurityConfig`에서 `addFilterBefore(..., UsernamePasswordAuthenticationFilter.class)` 등록

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

- `docs/HELP.md`

## Architecture Diagrams

- 구조 다이어그램: `docs/architecture-overview.png`
- 요청 흐름 다이어그램: `docs/request-flow.png`
- 원본 Mermaid: `docs/architecture-overview.mmd`, `docs/request-flow.mmd`

## Notes

- 2뎁스 메뉴 그룹 리소스(`meta.parent`의 부모)는 `list` 경로를 넣지 않는 것을 권장합니다.
  - 부모에 `list`를 주면 링크 중첩으로 hydration 문제가 발생할 수 있습니다.

## Stop Infra

```bash
./script/stop-infra.sh
```

또는:

```bash
docker compose -f ./infra/db/docker-compose.yml down -v
```
