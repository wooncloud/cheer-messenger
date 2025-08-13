# 개발 환경 설정

Cheer Messenger 프로젝트의 상세한 개발 환경 설정 가이드입니다.

## 🛠️ 개발 도구 설치

### 필수 도구

#### Node.js 설정

```bash
# Node.js 18+ 설치 확인
node --version  # v18.0.0+
npm --version   # 8.0.0+

# 권장: nvm 사용
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Git 설정

```bash
# Git 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 한국어 파일명 깨짐 방지
git config --global core.quotepath false
```

### 권장 도구

#### VS Code 확장

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

#### 브라우저 확장

- **React Developer Tools**: 개발자 도구
- **Redux DevTools**: 상태 관리 디버깅
- **Lighthouse**: 성능 측정

## 📁 프로젝트 설정

### 저장소 클론

```bash
git clone <repository-url>
cd cheer-messenger

# 의존성 설치
npm install

# 환경 파일 복사
cp .env.example .env.local
```

### 환경 변수 설정

#### `.env.local` 파일 생성

```bash
# Supabase 설정
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 개발 모드 설정 (선택)
NODE_ENV=development
VITE_DEV_MODE=true

# 디버그 로그 (선택)
DEBUG=hwaiting:*
```

#### 환경별 설정

```bash
# 개발 환경
.env.local          # 로컬 개발용 (git 무시)

# 스테이징 환경
.env.staging        # 스테이징 배포용

# 프로덕션 환경
.env.production     # 프로덕션 배포용
```

## 🗄️ 데이터베이스 설정

### Supabase 프로젝트 생성

1. **프로젝트 생성**

   ```bash
   # Supabase CLI 설치 (선택)
   npm install -g @supabase/cli

   # 프로젝트 초기화
   supabase init
   ```

2. **로컬 개발 환경**

   ```bash
   # Docker 필요
   supabase start

   # 스키마 적용
   supabase db reset
   ```

### 스키마 설정

#### 자동 설정 (권장)

```bash
# 스키마 검증 및 설정
node setup-schema.js
```

#### 수동 설정

```bash
# Supabase SQL Editor에서 실행
cat supabase/schema.sql
# → 내용을 복사하여 SQL Editor에서 실행
```

### 타입 생성

```bash
# Supabase 타입 자동 생성
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts

# 또는 수동으로 스키마 변경 시
npm run generate-types
```

## 🔐 인증 설정

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
   - http://localhost:54321/auth/v1/callback (로컬 개발용)
   ```

#### Supabase 인증 설정

```bash
# Supabase Dashboard → Authentication → Providers
# Google 활성화 후 설정:
Client ID: [Google Console에서 복사]
Client Secret: [Google Console에서 복사]
```

### 로컬 인증 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173
# 로그인 기능 테스트
```

## 🧪 개발 워크플로우

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

## 🔍 디버깅 설정

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

### 브라우저 디버깅

```javascript
// 디버그 로그 활성화
localStorage.setItem("debug", "hwaiting:*");

// Supabase 디버그
localStorage.setItem("supabase.debug", "true");
```

### 서버 로그 확인

```bash
# Supabase 로그
# Dashboard → Logs → Database/Auth/API

# 로컬 개발 로그
npm run dev -- --verbose
```

## 🧪 테스트 환경

### 단위 테스트 (미래 확장)

```bash
# Vitest 설치
npm install -D vitest @testing-library/svelte

# 테스트 실행
npm run test
npm run test:watch
```

### E2E 테스트 (미래 확장)

```bash
# Playwright 설치
npm install -D @playwright/test

# 테스트 실행
npx playwright test
```

## 📊 성능 모니터링

### 개발 중 성능 체크

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Bundle 분석
npm run build -- --analyze
```

### 실시간 성능 모니터링

```javascript
// Web Vitals 측정
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🐛 문제 해결

### 자주 발생하는 문제

#### Port 충돌

```bash
# 포트 변경
npm run dev -- --port 3000

# 사용 중인 포트 확인
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
```

### 로그 수집

```bash
# 전체 로그 수집
npm run dev 2>&1 | tee debug.log

# 특정 에러 추적
DEBUG=hwaiting:* npm run dev
```

## 📚 추가 리소스

### 문서 링크

- [SvelteKit 공식 문서](https://kit.svelte.dev)
- [Supabase 가이드](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 커뮤니티

- [Svelte Discord](https://svelte.dev/chat)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Discussions](../../discussions)

---

환경 설정이 완료되면 [프로젝트 구조 가이드](./project-structure.md)를 참고하여 개발을 시작하세요.
