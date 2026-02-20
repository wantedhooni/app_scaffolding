# E2E 테스트 가이드

`ui-admin-refine`는 Playwright 기반 E2E 테스트를 제공합니다.

## 포함된 시나리오

- `e2e/auth.spec.ts`
  - 로그인 성공 후 `/dashboard` 이동 확인
- `e2e/dashboard.spec.ts`
  - Swagger(`v3/api-docs`) 기반 대시보드 메뉴 맵 렌더링 확인
- `e2e/admins.spec.ts`
  - 사용자 생성 -> 수정 -> 삭제 커맨드 UI 흐름 확인

## 특징

- 테스트는 백엔드를 직접 호출하지 않고 `page.route()`로 API를 모킹합니다.
- 따라서 로컬 백엔드 기동 여부와 무관하게 UI 동작을 안정적으로 검증할 수 있습니다.
- 대상 API 경로는 실제 백엔드 스펙과 동일하게 유지했습니다.

## 실행 방법

```bash
cd frontend/ui-admin-refine
npm run e2e
```

추가 옵션:

```bash
npm run e2e_ui      # Playwright UI 모드
npm run e2e_headed  # 브라우저를 보면서 실행
```

## 파일 위치

- 설정: `playwright.config.ts`
- 공통 모킹: `e2e/helpers.ts`
- Swagger fixture: `e2e/fixtures/openapi.json`
