# _dummy-page 사용 가이드

이 문서는 `src/app/_dummy-page`를 복사해서 신규 도메인 페이지를 빠르게 만드는 방법을 설명합니다.

## 1. 폴더 복사
원하는 리소스 이름으로 `_dummy-page`를 복사합니다.

```bash
cd frontend/ui-admin
cp -R src/app/_dummy-page src/app/domain/products
```

예시에서는 `products`를 사용합니다.

## 2. 파일 구조 확인
복사 후 아래 구조가 있어야 합니다.

- `src/app/domain/products/layout.tsx`
- `src/app/domain/products/page.tsx`
- `src/app/domain/products/create/page.tsx`
- `src/app/domain/products/edit/[id]/page.tsx`
- `src/app/domain/products/show/[id]/page.tsx`

## 3. 템플릿 상수 변경
`_dummy-page` 템플릿은 상수를 한 파일에서 관리합니다.

### `src/app/domain/products/constants.ts`
- `RESOURCE = "products"`
- `ENTITY_LABEL = "Product"`
- `PRIMARY_FIELD = "name"`
- `PRIMARY_LABEL = "Name"`
- `SEARCH_PLACEHOLDER = "Search products"`
- `SEARCH_FIELDS = ["keyword", "name"]`

## 3-1. 템플릿 상수의 용도 및 설명
템플릿의 핵심은 아래 6개 상수입니다.

- `RESOURCE`
  - 의미: Refine 리소스 이름(데이터 소스 식별자)
  - 사용 위치: `useDataGrid`, `useModalForm`, `useForm`, `useShow`
  - 반드시 일치해야 하는 곳:
    - `src/app/layout.tsx`의 `resources[].name`
    - 필요 시 `src/providers/data-provider/index.ts`의 `resourcePathMap` 키
  - 예:
    - `RESOURCE = "products"`이면 `resources`에도 `name: "products"`가 있어야 함
  - 잘못 설정 시 증상:
    - 목록/상세/생성 요청이 다른 API로 가거나 404 발생
    - 메뉴 이동은 되는데 데이터가 비어 보임

- `ENTITY_LABEL`
  - 의미: UI에서 엔티티를 사람 친화적으로 보여주는 이름
  - 사용 위치: 목록 페이지 버튼/다이얼로그 제목 (`Create Product` 같은 텍스트)
  - 예:
    - `ENTITY_LABEL = "Product"`
  - 주의:
    - API 동작과 직접 관련 없음(표시 텍스트 전용)

- `PRIMARY_FIELD`
  - 의미: 가장 기본이 되는 대표 입력/출력 필드의 키 이름
  - 사용 위치:
    - list: 컬럼 field
    - create/edit: `register(PRIMARY_FIELD)`
    - show: `record?.[PRIMARY_FIELD]`
  - 예:
    - `PRIMARY_FIELD = "name"` 또는 `PRIMARY_FIELD = "title"`
  - 반드시 확인할 것:
    - 백엔드 DTO/응답 JSON 필드명과 동일해야 함
  - 잘못 설정 시 증상:
    - 입력값이 저장되지 않음
    - show 페이지에 값이 비어 보임

- `PRIMARY_LABEL`
  - 의미: `PRIMARY_FIELD`를 화면에 표시할 라벨 텍스트
  - 사용 위치: 텍스트필드 라벨, 데이터그리드 컬럼 헤더, show 제목
  - 예:
    - `PRIMARY_LABEL = "Name"`
  - 주의:
    - API에는 영향 없음(표시 텍스트 전용)

- `SEARCH_PLACEHOLDER`
  - 의미: 목록 검색 입력창 placeholder 텍스트
  - 사용 위치: list 페이지 상단 검색 input
  - 예:
    - `SEARCH_PLACEHOLDER = "Search products"`

- `SEARCH_FIELDS`
  - 의미: 검색어를 `contains` 필터로 적용할 대상 필드 목록
  - 사용 위치: list 페이지 `useDataGrid().onSearch`
  - 예:
    - `SEARCH_FIELDS = ["keyword", "name"]`
  - 주의:
    - 백엔드에서 해석 가능한 필드명만 넣어야 함
    - 잘못 넣으면 검색이 동작하지 않거나 결과가 비어 보일 수 있음

### 상수 빠른 매핑 예시
- 상품 리소스
  - `RESOURCE = "products"`
  - `ENTITY_LABEL = "Product"`
  - `PRIMARY_FIELD = "name"`
  - `PRIMARY_LABEL = "Name"`
  - `SEARCH_PLACEHOLDER = "Search products"`
  - `SEARCH_FIELDS = ["keyword", "name"]`
- 카테고리 리소스
  - `RESOURCE = "categories"`
  - `ENTITY_LABEL = "Category"`
  - `PRIMARY_FIELD = "title"`
  - `PRIMARY_LABEL = "Title"`
  - `SEARCH_PLACEHOLDER = "Search categories"`
  - `SEARCH_FIELDS = ["keyword", "title"]`

## 4. 필드 추가/변경
기본 템플릿은 `PRIMARY_FIELD` 하나만 사용합니다.
필드가 더 필요하면 `create/edit/show/page.tsx`에서 `TextField` 블록을 추가합니다.

예: `description` 필드 추가

```tsx
<TextField
  {...register("description")}
  error={!!(errors as any)?.description}
  helperText={(errors as any)?.description?.message}
  margin="normal"
  fullWidth
  label="Description"
/>
```

## 5. 메뉴(리소스) 등록
`src/app/layout.tsx`의 `resources` 배열에 신규 리소스를 추가해야 메뉴와 라우팅이 연결됩니다.

```tsx
{
  name: "products",
  list: "/domain/products",
  create: "/domain/products/create",
  edit: "/domain/products/edit/:id",
  show: "/domain/products/show/:id",
  meta: {
    canDelete: true,
  },
}
```

## 6. 2뎁스 메뉴로 넣기(선택)
부모 메뉴 아래 넣으려면 `meta.parent`를 사용합니다.

```tsx
{
  name: "products",
  list: "/domain/products",
  create: "/domain/products/create",
  edit: "/domain/products/edit/:id",
  show: "/domain/products/show/:id",
  meta: {
    parent: "domain-group",
    label: "Products",
    canDelete: true,
  },
}
```

## 7. API 경로 확인
`RESOURCE` 이름과 백엔드 경로가 다르면 `src/providers/data-provider/index.ts`의 `resourcePathMap`에 매핑을 추가합니다.

예:

```ts
const resourcePathMap: Record<string, string> = {
  products: "/api/product",
};
```

## 8. 검증
아래 명령으로 타입/빌드를 확인합니다.

```bash
cd frontend/ui-admin
npx tsc --noEmit
npm run build
```

## 9. 빠른 체크리스트
- 폴더 복사 완료
- `constants.ts`의 `RESOURCE`, `PRIMARY_*`, `SEARCH_*` 값 설정
- `layout.tsx` resources 등록
- 필요 시 `resourcePathMap` 등록
- 타입체크/빌드 통과
