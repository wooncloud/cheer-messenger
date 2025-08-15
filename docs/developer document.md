# 개발자 가이드 (Developer Guide)

Cheeract 프로젝트의 아키텍처, 개발 컨텍스트, 그리고 AI 개발 워크플로우를 위한 종합 가이드입니다.

## 🎯 프로젝트 개요

**Cheeract**는 모임 내에서 서로에게 칭찬과 격려를 주고받을 수 있는 웹 애플리케이션으로, SvelteKit과 Supabase를 사용한 현대적인 풀스택 프로젝트입니다.

### 핵심 가치
- **사용자 경험 우선**: 직관적이고 빠른 인터페이스
- **보안 내재화**: 모든 레이어에서 보안 고려
- **확장 가능한 아키텍처**: 미래 성장을 고려한 설계

## 🛠️ 개발 환경

### 필수 명령어

```bash
# 개발 서버 실행
npm run dev          # 개발 서버 (http://localhost:5173)

# 코드 품질 관리
npm run check        # TypeScript 타입 체크
npm run check:watch  # 타입 체크 (실시간)
npm run lint         # ESLint + Prettier 검사
npm run format       # 코드 자동 포맷팅

# 빌드 및 배포
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기

# 데이터베이스 관리
node setup-schema.js    # DB 스키마 설정
node verify-schema.js   # 스키마 검증
```

### 환경 변수

```bash
# .env.local (필수)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 디버깅 (선택)
DEBUG=cheeract:*
NODE_ENV=development
```

## 🏗️ 시스템 아키텍처

### 기술 스택

- **Frontend**: SvelteKit 2.0 + TypeScript
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Database**: PostgreSQL with Row Level Security
- **Styling**: Tailwind CSS + shadcn-svelte
- **Deployment**: Vercel (Node.js 20.x)

### 아키텍처 원칙

1. **Frontend-First**: SvelteKit의 풀스택 기능 최대 활용
2. **Serverless Backend**: Supabase BaaS로 인프라 복잡성 제거
3. **Security by Design**: RLS와 JWT 기반 다층 보안

## 📊 데이터 모델

### 핵심 테이블

```sql
users              -- 사용자 정보 (Supabase Auth 연동)
├── groups         -- 모임 정보 (이름, 설명, 설정)
├── group_members  -- 멤버십 관계 (role: admin/member)
├── praise_messages -- 칭찬 메시지 (emoji, 내용, 공개설정)
└── praise_cooldowns -- 쿨타임 추적 (스팸 방지)
```

### 주요 비즈니스 로직

- **칭찬 쿨타임**: 초~년 단위까지 설정 가능한 유연한 제한
- **자기 칭찬 금지**: DB 제약조건으로 강제
- **익명/공개 칭찬**: 프라이버시 옵션 지원
- **역할 기반 권한**: 관리자/멤버별 차등 기능

## 🏛️ 코드 구조

### 디렉토리 구성

```
src/
├── hooks.server.ts           # 서버 사이드 인증 처리
├── app.html                 # HTML 템플릿
├── app.css                  # 글로벌 스타일
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트
│   ├── database.types.ts    # 자동 생성 DB 타입
│   ├── components/          # UI 컴포넌트 (기능별 분류)
│   ├── stores/              # Svelte 상태 관리
│   └── utils/               # 비즈니스 로직 유틸리티
└── routes/                  # 파일 기반 라우팅
    ├── +layout.svelte       # 공통 레이아웃
    ├── dashboard/           # 메인 대시보드
    ├── create-group/        # 모임 생성
    ├── group/[id]/          # 모임 상세 (동적 라우트)
    └── invite/[code]/       # 초대 링크 처리
```

### 3계층 아키텍처

1. **Presentation Layer** (`components/`): UI 컴포넌트
2. **Business Logic Layer** (`utils/`): 도메인 로직
3. **Data Access Layer** (`supabase.ts`, `stores/`): 데이터 처리

## 🔐 보안 아키텍처

### 인증 흐름

```
Google OAuth → Supabase Auth → JWT Token → RLS Policies
```

### 핵심 보안 기능

- **Row Level Security**: 사용자별 데이터 격리
- **서버-클라이언트 검증 이중화**: 보안과 UX 양립
- **역할 기반 접근 제어**: 관리자/멤버 권한 분리
- **SQL Injection 방지**: Supabase ORM 사용

### RLS 정책 예시

```sql
-- 사용자는 본인 데이터만 조회
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id);

-- 모임 멤버만 칭찬 메시지 조회
CREATE POLICY "Members can view group praises" ON praise_messages
FOR SELECT USING (EXISTS(
  SELECT 1 FROM group_members 
  WHERE group_id = praise_messages.group_id 
  AND user_id = auth.uid()
));
```

## 🔄 실시간 기능

### Supabase Realtime 활용

```typescript
// 실시간 칭찬 메시지 구독
supabase
  .channel('praise_updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'praise_messages'
  }, handlePraiseUpdate)
  .subscribe();
```

### 구현된 실시간 기능

- 새 칭찬 메시지 즉시 반영
- 멤버 가입/탈퇴 알림
- 모임 설정 변경 동기화

## 🎨 컴포넌트 설계

### 명명 규칙

- **컴포넌트**: PascalCase (`GroupCard.svelte`)
- **유틸리티**: camelCase (`groups.ts`)
- **라우트**: kebab-case (`create-group/`)

### 컴포넌트 구조

```svelte
<script lang="ts">
  // 1. Props 타입 정의
  export let group: Group;
  export let userRole: 'admin' | 'member';
  
  // 2. 내부 상태
  let isLoading = false;
  
  // 3. 리액티브 구문
  $: canManage = userRole === 'admin';
  
  // 4. 이벤트 핸들러
  const handleAction = async () => {
    isLoading = true;
    // 비즈니스 로직
    isLoading = false;
  };
</script>

<!-- 5. 템플릿 -->
<div class="component-wrapper">
  <!-- 내용 -->
</div>

<!-- 6. 스타일 (Tailwind 활용) -->
<style>
  .component-wrapper {
    @apply p-4 border rounded-lg shadow-sm;
  }
</style>
```

## 🧪 개발 워크플로우

### 브랜치 전략

```bash
main              # 프로덕션 브랜치
├── feature/*     # 기능 개발
├── fix/*         # 버그 수정
└── docs/*        # 문서 업데이트
```

### 커밋 컨벤션

```bash
feat: 새로운 기능 추가
fix: 버그 수정  
docs: 문서 변경
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 도구, 패키지 관리
```

### 코드 품질 체크리스트

- [ ] TypeScript 타입 오류 없음
- [ ] ESLint/Prettier 규칙 준수
- [ ] RLS 정책 업데이트 (DB 변경 시)
- [ ] 실시간 구독 정리 코드 포함
- [ ] 한국어 UI 텍스트 일관성

## 🐛 디버깅 가이드

### 개발 도구 활용

```javascript
// 1. 디버그 로그 활성화
localStorage.setItem('debug', 'cheeract:*');

// 2. Supabase 디버그
localStorage.setItem('supabase.debug', 'true');

// 3. 브라우저 개발자 도구
// - Network 탭: API 호출 확인
// - Console 탭: 에러 메시지 확인
// - Application 탭: 쿠키/세션 상태
```

### 자주 발생하는 문제

#### RLS 정책 오류

```bash
# 증상
permission denied for table users

# 해결
1. Supabase Dashboard → Authentication 확인
2. schema.sql의 RLS 정책 재실행
3. 사용자 세션 상태 확인
```

#### OAuth 인증 실패

```bash
# 증상  
redirect_uri_mismatch

# 해결
1. Google Cloud Console → Credentials
2. Authorized redirect URIs 확인
3. Supabase Auth 설정 점검
```

### 로그 모니터링

- **Supabase Dashboard**: Logs → Database/Auth/API
- **브라우저 Console**: 클라이언트 사이드 오류
- **Network Tab**: API 요청/응답 상태

## 📈 성능 최적화

### 현재 적용된 최적화

- **SSR/SPA 하이브리드**: SvelteKit의 적응형 렌더링
- **Database Indexing**: 조회 성능 향상
- **Connection Pooling**: Supabase 자동 관리
- **CDN**: Vercel Edge Network

### 모니터링 지표

- **Core Web Vitals**: LCP, FID, CLS
- **Database Performance**: 쿼리 실행 시간
- **Real-time Connections**: 동시 접속자 수

## 🌐 한국어 지역화

### 현재 적용 사항

- 전체 UI 한국어 번역
- 한국 문화 맞춤 격려 시스템
- 한국어 에러 메시지
- 한국 사용자 행동 패턴 반영

### 주의사항

- 새 UI 텍스트 추가 시 한국어 패턴 유지
- 날짜/시간 표시 한국 표준 준수
- 입력 검증 메시지 한국어화

## 🚀 배포 및 운영

### 배포 전 체크리스트

```bash
# 1. 코드 품질 확인
npm run lint
npm run check

# 2. 빌드 테스트  
npm run build
npm run preview

# 3. 환경 변수 확인
# Vercel Dashboard → Settings → Environment Variables

# 4. 데이터베이스 마이그레이션 (필요시)
# Supabase Dashboard → SQL Editor
```

### 환경별 설정

- **Development**: 로컬 + Supabase Dev
- **Staging**: Vercel Preview + Supabase Staging  
- **Production**: Vercel Production + Supabase Production

## 📋 중요 파일 위치

### 핵심 설정 파일

- `src/hooks.server.ts` - 서버 사이드 인증
- `src/lib/supabase.ts` - DB 클라이언트 설정
- `supabase/schema.sql` - 완전한 DB 스키마
- `src/lib/utils/` - 비즈니스 로직 모음

### 문서 참조

- [시작 가이드](docs/getting-started.md) - 첫 설정
- [개발 워크플로우](docs/development.md) - 상세 개발 가이드
- [아키텍처](docs/architecture.md) - 시스템 설계
- [데이터베이스](docs/database.md) - 스키마 참조

## 💡 개발 철학

### 코드 작성 원칙

1. **타입 안전성**: TypeScript로 런타임 오류 방지
2. **점진적 개선**: 기존 패턴을 따라 일관성 유지  
3. **사용자 중심**: 개발자 편의보다 사용자 경험 우선
4. **보안 우선**: 모든 기능에 보안 고려사항 반영

### AI 개발 컨텍스트

이 문서는 Claude Code와 같은 AI 개발 도구가 프로젝트를 정확히 이해하고 효과적으로 기여할 수 있도록 작성되었습니다. 

코드 수정 시:
- 기존 패턴과 컨벤션 준수
- RLS 정책 영향 고려
- 실시간 기능 정리 코드 포함
- 한국어 UI 일관성 유지

---

**마지막 업데이트**: 2025년 8월 15일