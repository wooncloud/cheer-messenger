# 프로젝트 구조

Cheer Messenger의 디렉토리 구조와 각 파일의 역할을 상세히 설명합니다.

## 📁 전체 구조

```
cheer-messenger/
├── 📄 README.md                    # 프로젝트 개요
├── 📄 package.json                 # 의존성 및 스크립트
├── 📄 package-lock.json            # 의존성 잠금 파일
├── 📄 svelte.config.js             # SvelteKit 설정
├── 📄 vite.config.ts               # Vite 빌드 설정
├── 📄 tsconfig.json                # TypeScript 설정
├── 📄 tailwind.config.js           # Tailwind CSS 설정
├── 📄 postcss.config.js            # PostCSS 설정
├── 📄 .env.example                 # 환경 변수 예시
├── 📄 setup-schema.js              # 데이터베이스 설정 스크립트
├── 📄 verify-schema.js             # 스키마 검증 스크립트
├──📁 docs/                        # 📚 프로젝트 문서
├──📁 src/                         # 🎯 소스 코드
├──📁 static/                      # 🎨 정적 파일
├──📁 supabase/                    # 🗄️ 데이터베이스 스키마
└──📁 node_modules/                # 📦 의존성 패키지
```

## 🎯 소스 코드 구조 (`src/`)

### 루트 파일들

```
src/
├── 📄 app.html                     # HTML 템플릿
├── 📄 app.css                      # 글로벌 스타일
├── 📄 app.d.ts                     # 앱 타입 정의
└── 📄 hooks.server.ts              # 서버 훅
```

#### `app.html`

```html
<!-- SvelteKit 앱의 기본 HTML 템플릿 -->
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

#### `hooks.server.ts`

```typescript
// 서버 사이드 요청 처리
import { createServerClient } from "@supabase/ssr";
import { redirect } from "@sveltejs/kit";

export const handle = async ({ event, resolve }) => {
  // Supabase 세션 관리
  // 인증 상태 확인
  // 보호된 라우트 처리
};
```

### 라이브러리 (`src/lib/`)

```
src/lib/
├── 📄 supabase.ts                  # Supabase 클라이언트
├── 📄 database.types.ts            # 데이터베이스 타입
├──📁 components/                  # UI 컴포넌트
├──📁 stores/                     # 상태 관리
└──📁 utils/                      # 유틸리티 함수
```

#### 핵심 파일들

**`supabase.ts`** - Supabase 클라이언트 설정

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const supabase = createClient<Database>(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
);
```

**`database.types.ts`** - 자동 생성된 타입 정의

```typescript
export type Database = {
  public: {
    Tables: {
      users: { ... }
      groups: { ... }
      // 모든 테이블 타입
    }
  }
}
```

### 컴포넌트 구조 (`src/lib/components/`)

```
src/lib/components/
├── 📄 Toast.svelte                 # 알림 토스트
├── 📄 LoadingSpinner.svelte        # 로딩 스피너
├── 📄 GoogleAuthButton.svelte      # 구글 로그인 버튼
├──📁 dashboard/                   # 대시보드 관련
│   ├── 📄 DashboardHeader.svelte   # 대시보드 헤더
│   ├── 📄 EmptyGroupState.svelte   # 빈 모임 상태
│   ├── 📄 GroupCard.svelte         # 모임 카드
│   └── 📄 GroupGrid.svelte         # 모임 그리드
├──📁 create-group/                # 모임 생성 관련
│   ├── 📄 CreateGroupHeader.svelte # 생성 헤더
│   ├── 📄 CreateGroupForm.svelte   # 생성 폼
│   ├── 📄 CreateGroupActions.svelte # 액션 버튼
│   ├── 📄 CreateGroupInfo.svelte   # 정보 표시
│   ├── 📄 GroupNameField.svelte    # 이름 입력
│   ├── 📄 GroupDescriptionField.svelte # 설명 입력
│   └── 📄 GroupMaxMembersField.svelte # 최대 인원 입력
├──📁 group/                       # 모임 상세 관련
│   ├── 📄 GroupHeader.svelte       # 모임 헤더
│   ├── 📄 LoadingState.svelte      # 로딩 상태
│   ├── 📄 MembersList.svelte       # 멤버 목록
│   ├── 📄 PraiseModal.svelte       # 칭찬 모달
│   └── 📄 PraisesList.svelte       # 칭찬 목록
├──📁 invite/                      # 초대 관련
│   ├── 📄 GroupInviteCard.svelte   # 초대 카드
│   ├── 📄 InviteActions.svelte     # 초대 액션
│   └── 📄 InviteSuccessView.svelte # 성공 화면
└──📁 settings/                    # 설정 관련
    ├── 📄 GroupBasicSettings.svelte # 기본 설정
    ├── 📄 MemberManager.svelte     # 멤버 관리
    ├── 📄 InviteLinkManager.svelte # 초대 링크 관리
    ├── 📄 PraiseCooldownSettings.svelte # 쿨타임 설정
    ├── 📄 AdminTransfer.svelte     # 관리자 이양
    ├── 📄 DangerZone.svelte        # 위험 작업
    └── 📄 ConfirmModal.svelte      # 확인 모달
```

#### 컴포넌트 명명 규칙

- **PascalCase**: 모든 컴포넌트 파일명
- **기능별 폴더**: 관련 컴포넌트 그룹화
- **명확한 이름**: 컴포넌트 역할을 명확히 표현

#### 컴포넌트 구조 예시

```svelte
<!-- GroupCard.svelte -->
<script lang="ts">
  // Props 타입 정의
  export let group: Group
  export let userRole: string

  // 내부 상태
  let isLoading = false

  // 이벤트 핸들러
  const handleClick = () => { ... }
</script>

<!-- 템플릿 -->
<div class="group-card">
  <!-- 컨텐츠 -->
</div>

<!-- 스타일 -->
<style>
  .group-card {
    @apply p-4 border rounded-lg;
  }
</style>
```

### 상태 관리 (`src/lib/stores/`)

```
src/lib/stores/
├── 📄 auth.ts                      # 인증 상태
└── 📄 toast.ts                     # 토스트 알림 상태
```

#### `auth.ts` - 인증 상태 관리

```typescript
import { writable } from 'svelte/store'
import type { User } from '@supabase/supabase-js'

export const user = writable<User | null>(null)
export const isLoading = writable(true)

export const authStore = {
  signIn: async (email: string, password: string) => { ... },
  signOut: async () => { ... },
  signUp: async (email: string, password: string) => { ... }
}
```

#### `toast.ts` - 알림 상태 관리

```typescript
import { writable } from 'svelte/store'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export const toasts = writable<Toast[]>([])

export const addToast = (toast: Omit<Toast, 'id'>) => { ... }
```

### 유틸리티 함수 (`src/lib/utils/`)

```
src/lib/utils/
├── 📄 auth.ts                      # 인증 관련 함수
├── 📄 groups.ts                    # 모임 관리 함수
├── 📄 members.ts                   # 멤버 관리 함수
└── 📄 praise.ts                    # 칭찬 시스템 함수
```

#### 함수 구조 예시

```typescript
// groups.ts
export interface Group extends Tables<"groups"> {
  member_count?: number;
  praise_count?: number;
  user_role?: string;
}

export async function createGroup(data: CreateGroupData): Promise<Group> {
  // 모임 생성 로직
}

export async function getGroupById(id: string): Promise<Group | null> {
  // 모임 조회 로직
}
```

### 라우트 구조 (`src/routes/`)

```
src/routes/
├── 📄 +layout.svelte               # 메인 레이아웃
├── 📄 +layout.server.ts            # 레이아웃 서버 로드
├── 📄 +page.svelte                 # 홈페이지 (리다이렉트)
├── 📄 +error.svelte                # 에러 페이지
├──📁 auth/                        # 인증 관련
│   ├──📁 callback/                # OAuth 콜백
│   │   └── 📄 +page.svelte
│   └──📁 auth-code-error/         # 인증 오류
│       └── 📄 +page.svelte
├──📁 login/                       # 로그인
│   └── 📄 +page.svelte
├──📁 dashboard/                   # 대시보드
│   └── 📄 +page.svelte
├──📁 create-group/                # 모임 생성
│   └── 📄 +page.svelte
├──📁 group/                       # 모임 상세
│   └──📁 [id]/                    # 동적 라우트
│       ├── 📄 +page.svelte
│       ├── 📄 +page.server.ts
│       └──📁 settings/            # 모임 설정
│           ├── 📄 +page.svelte
│           └── 📄 +page.server.ts
└──📁 invite/                      # 초대 관련
    ├──📁 [code]/                  # 초대 코드
    │   ├── 📄 +page.svelte
    │   └── 📄 +page.server.ts
    └──📁 error/                   # 초대 오류
        └── 📄 +page.svelte
```

#### 라우트 파일 역할

**`+layout.svelte`** - 모든 페이지의 공통 레이아웃

```svelte
<script>
  import '../app.css'
  import Toast from '$lib/components/Toast.svelte'
</script>

<main>
  <slot />
</main>

<Toast />
```

**`+page.server.ts`** - 서버 사이드 데이터 로딩

```typescript
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  // 서버에서 데이터 로드
  return {
    group: await getGroup(params.id),
  };
};
```

## 🗄️ 데이터베이스 (`supabase/`)

```
supabase/
└── 📄 schema.sql                   # 데이터베이스 스키마
```

#### `schema.sql` - 완전한 데이터베이스 설계

```sql
-- 테이블 생성
CREATE TABLE users (...);
CREATE TABLE groups (...);
CREATE TABLE group_members (...);
CREATE TABLE praise_messages (...);
CREATE TABLE praise_cooldowns (...);

-- 인덱스 생성
CREATE INDEX idx_groups_owner_id ON groups(owner_id);

-- RLS 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 함수 생성
CREATE OR REPLACE FUNCTION can_praise_user(...);
```

## 🎨 정적 파일 (`static/`)

```
static/
└── 📄 favicon.png                  # 파비콘
```

## 📦 설정 파일들

### `package.json` - 프로젝트 설정

```json
{
  "name": "cheer-messenger",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": { ... },
  "dependencies": { ... }
}
```

### `svelte.config.js` - SvelteKit 설정

```javascript
import adapter from "@sveltejs/adapter-vercel";

const config = {
  kit: {
    adapter: adapter(),
  },
};
```

### `tailwind.config.js` - Tailwind 설정

```javascript
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 📋 개발 가이드라인

### 파일 명명 규칙

- **컴포넌트**: PascalCase (예: `GroupCard.svelte`)
- **유틸리티**: camelCase (예: `auth.ts`, `groups.ts`)
- **라우트**: kebab-case (예: `create-group/`)

### 폴더 구조 원칙

- **기능별 그룹화**: 관련 컴포넌트를 폴더로 묶음
- **계층적 구조**: 상위-하위 관계를 폴더로 표현
- **명확한 분리**: 역할별로 명확하게 분리

### 의존성 관리

- **상대 경로 최소화**: `$lib` 별칭 사용
- **순환 의존성 방지**: 단방향 의존성 유지
- **타입 안전성**: TypeScript 활용

---

이 구조는 **확장성**, **유지보수성**, **개발자 경험**을 최우선으로 설계되었습니다. 새로운 기능 추가 시 이 구조를 따라 개발하면 일관성 있는 코드베이스를 유지할 수 있습니다.
