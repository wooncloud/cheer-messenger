# 개발 가이드

Cheeract 프로젝트의 개발 환경 설정, 프로젝트 구조, 워크플로우를 정리한 종합 개발 가이드입니다.

## 📋 목차

1. [개발 환경 설정](#-개발-환경-설정)
2. [프로젝트 구조](#-프로젝트-구조)
3. [개발 워크플로우](#-개발-워크플로우)
4. [문제 해결](#-문제-해결)

## 🛠️ 개발 환경 설정

### 필수 요구사항

- **Node.js 18+** (권장: 20.x)
- **npm 8.0.0+** 또는 pnpm
- **Git** 
- **Supabase 계정**

### 개발 도구 설치

#### Node.js 설정

```bash
# Node.js 버전 확인
node --version  # v18.0.0+
npm --version   # 8.0.0+

# 권장: nvm 사용
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### Git 설정

```bash
# Git 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 한국어 파일명 깨짐 방지
git config --global core.quotepath false
```

#### 권장 VS Code 확장

```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens"
  ]
}
```

### 프로젝트 설정

#### 저장소 클론 및 설정

```bash
git clone <repository-url>
cd cheer-messenger

# 의존성 설치
npm install

# 환경 파일 설정
cp .env.example .env.local
```

#### 환경 변수 설정

**`.env.local` 파일 생성:**

```bash
# Supabase 설정 (필수)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 개발 모드 설정 (선택)
NODE_ENV=development
VITE_DEV_MODE=true

# 디버그 로그 (선택)
DEBUG=cheeract:*
```

#### 데이터베이스 설정

**자동 설정 (권장):**

```bash
# 스키마 검증 및 설정
node setup-schema.js
```

**수동 설정:**

1. Supabase Dashboard → SQL Editor
2. `supabase/schema.sql` 내용을 복사하여 실행

### Google OAuth 설정

#### Google Cloud Console

1. **프로젝트 생성/선택**
2. **APIs & Services → Credentials**
3. **OAuth 2.0 Client IDs 생성**

```
Application type: Web application
Authorized JavaScript origins: http://localhost:5173
Authorized redirect URIs:
- https://your-project.supabase.co/auth/v1/callback
- http://localhost:54321/auth/v1/callback (로컬)
```

#### Supabase 인증 설정

```bash
# Supabase Dashboard → Authentication → Providers
# Google 활성화 후:
Client ID: [Google Console에서 복사]
Client Secret: [Google Console에서 복사]
```

### 개발 명령어

```bash
# 개발 서버 (핫 리로드)
npm run dev

# 타입 체크 (실시간)
npm run check:watch

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 빌드 테스트
npm run build && npm run preview
```

## 📁 프로젝트 구조

### 전체 구조

```
cheer-messenger/
├── 📄 README.md                    # 프로젝트 개요
├── 📄 CLAUDE.md                    # 개발자 가이드
├── 📄 package.json                 # 의존성 및 스크립트
├── 📄 svelte.config.js             # SvelteKit 설정
├── 📄 vite.config.ts               # Vite 빌드 설정
├── 📄 tsconfig.json                # TypeScript 설정
├── 📄 tailwind.config.js           # Tailwind CSS 설정
├── 📄 setup-schema.js              # 데이터베이스 설정 스크립트
├── 📄 verify-schema.js             # 스키마 검증 스크립트
├── 📁 docs/                       # 📚 프로젝트 문서
├── 📁 src/                        # 🎯 소스 코드
├── 📁 static/                     # 🎨 정적 파일
├── 📁 supabase/                   # 🗄️ 데이터베이스 스키마
└── 📁 node_modules/               # 📦 의존성 패키지
```

### 소스 코드 구조 (`src/`)

#### 핵심 파일들

```
src/
├── 📄 app.html                     # HTML 템플릿
├── 📄 app.css                      # 글로벌 스타일
├── 📄 app.d.ts                     # 앱 타입 정의
├── 📄 hooks.server.ts              # 서버 훅 (인증 처리)
└── 📁 lib/                        # 라이브러리 코드
    ├── 📄 supabase.ts              # Supabase 클라이언트
    ├── 📄 database.types.ts        # 데이터베이스 타입
    ├── 📁 components/              # UI 컴포넌트
    ├── 📁 stores/                  # 상태 관리
    └── 📁 utils/                   # 유틸리티 함수
```

#### 컴포넌트 구조 (`src/lib/components/`)

```
src/lib/components/
├── 📄 Toast.svelte                 # 알림 토스트
├── 📄 LoadingSpinner.svelte        # 로딩 스피너
├── 📄 GoogleAuthButton.svelte      # 구글 로그인 버튼
├── 📁 dashboard/                   # 대시보드 관련
│   ├── 📄 DashboardHeader.svelte
│   ├── 📄 GroupCard.svelte
│   └── 📄 GroupGrid.svelte
├── 📁 create-group/                # 모임 생성 관련
│   ├── 📄 CreateGroupForm.svelte
│   └── 📄 GroupNameField.svelte
├── 📁 group/                       # 모임 상세 관련
│   ├── 📄 GroupHeader.svelte
│   ├── 📄 PraiseModal.svelte
│   └── 📄 PraisesList.svelte
├── 📁 invite/                      # 초대 관련
│   └── 📄 GroupInviteCard.svelte
└── 📁 settings/                    # 설정 관련
    ├── 📄 GroupBasicSettings.svelte
    ├── 📄 MemberManager.svelte
    └── 📄 PraiseCooldownSettings.svelte
```

#### 유틸리티 함수 (`src/lib/utils/`)

```
src/lib/utils/
├── 📄 auth.ts                      # 인증 관련 함수
├── 📄 groups.ts                    # 모임 관리 함수
├── 📄 members.ts                   # 멤버 관리 함수
└── 📄 praise.ts                    # 칭찬 시스템 함수
```

#### 라우트 구조 (`src/routes/`)

```
src/routes/
├── 📄 +layout.svelte               # 메인 레이아웃
├── 📄 +page.svelte                 # 홈페이지
├── 📁 auth/                        # 인증 관련
├── 📁 dashboard/                   # 대시보드
├── 📁 create-group/                # 모임 생성
├── 📁 group/                       # 모임 상세
│   └── 📁 [id]/                    # 동적 라우트
│       ├── 📄 +page.svelte
│       └── 📁 settings/            # 모임 설정
└── 📁 invite/                      # 초대 관련
    └── 📁 [code]/                  # 초대 코드
```

### 아키텍처 레이어

#### 1. Presentation Layer (프레젠테이션 층)
- **위치**: `src/lib/components/`
- **역할**: 사용자 인터페이스 렌더링, 사용자 입력 처리

#### 2. Business Logic Layer (비즈니스 로직 층)
- **위치**: `src/lib/utils/`
- **역할**: 비즈니스 규칙 구현, 데이터 변환 및 유효성 검사

#### 3. Data Access Layer (데이터 접근 층)
- **위치**: `src/lib/supabase.ts`, `src/lib/stores/`
- **역할**: 데이터베이스 연결, 타입 안전성 보장, 실시간 구독 관리

#### 4. Database Layer (데이터베이스 층)
- **위치**: `supabase/schema.sql`
- **역할**: 데이터 영속성, 무결성 제약조건, 비즈니스 로직 함수

## 🔄 개발 워크플로우

### 브랜치 전략

```bash
# 기능 개발
git checkout -b feature/new-feature
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/new-feature

# 코드 리뷰 후 병합
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### 커밋 컨벤션

```bash
# 타입: 제목 (50자 이내)
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

### 개발 가이드라인

#### 파일 명명 규칙
- **컴포넌트**: PascalCase (예: `GroupCard.svelte`)
- **유틸리티**: camelCase (예: `auth.ts`, `groups.ts`)
- **라우트**: kebab-case (예: `create-group/`)

#### 코드 스타일
- TypeScript 사용 필수
- Prettier + ESLint 설정 준수
- 컴포넌트 Props에 타입 인터페이스 정의
- 실시간 구독은 적절한 정리(cleanup) 포함

#### 보안 고려사항
- 모든 데이터베이스 변경 시 RLS 정책 업데이트
- 클라이언트-서버 이중 검증 구현
- 민감한 정보 로깅 금지

## 🔍 디버깅 설정

### 브라우저 디버깅

```javascript
// 디버그 로그 활성화
localStorage.setItem("debug", "cheeract:*");

// Supabase 디버그
localStorage.setItem("supabase.debug", "true");
```

### VS Code 디버깅

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### 서버 로그 확인

```bash
# Supabase 로그 확인
# Dashboard → Logs → Database/Auth/API

# 상세 로그 확인
npm run dev -- --verbose

# 환경 디버깅
DEBUG=cheeract:* npm run dev
```

## 🐛 문제 해결

### 자주 발생하는 문제

#### Port 충돌

```bash
# 포트 변경
npm run dev -- --port 3000

# 사용 중인 포트 확인 및 종료
lsof -i :5173
kill -9 <PID>
```

#### 캐시 문제

```bash
# Node modules 재설치
rm -rf node_modules package-lock.json
npm install

# Vite 캐시 삭제
rm -rf .vite
```

#### 타입 오류

```bash
# TypeScript 캐시 삭제
rm -rf .svelte-kit/types

# 타입 재생성
npm run check
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

### 스키마 문제

```bash
# 스키마 검증
node verify-schema.js

# 스키마 재설정
node setup-schema.js
```

### 인증 문제

1. **Google OAuth 설정 확인**
   - Redirect URIs 정확성
   - Client ID/Secret 일치

2. **Supabase 설정 확인**
   - 환경 변수 정확성
   - RLS 정책 활성화

3. **세션 문제**
   ```bash
   # 브라우저 쿠키 삭제
   # 개발자 도구 → Application → Cookies → 모두 삭제
   ```

## 📚 추가 리소스

### 공식 문서
- [SvelteKit 공식 문서](https://kit.svelte.dev)
- [Supabase 가이드](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 프로젝트 문서
- [시작 가이드](./getting-started.md) - 첫 설정부터 실행까지
- [아키텍처](./architecture.md) - 시스템 설계 및 구조
- [데이터베이스](./database.md) - 스키마 및 API 참조

---

이 가이드는 **개발 생산성**, **코드 품질**, **팀 협업**을 최우선으로 작성되었습니다. 궁금한 사항이 있으면 GitHub Issues를 이용해 주세요.