# Hwaiting 🎉

모임 내에서 서로에게 칭찬과 격려를 주고받을 수 있는 웹 애플리케이션

## 기술 스택

- **Frontend**: SvelteKit + TypeScript
- **Backend**: Supabase (Authentication, Database, RLS)
- **UI**: Tailwind CSS + shadcn-svelte
- **Deployment**: Vercel (추천)

## 주요 기능

### ✅ 구현 완료 (Phase 1-5 모든 기능)

- **사용자 관리**
  - 회원가입/로그인 (Supabase Auth)
  - 사용자 프로필 관리

- **모임 관리**
  - 모임 생성 및 목록 표시 (바둑판 형태)
  - 초대 링크 시스템
  - 모임 가입/나가기 ✨
  - 모임 삭제 (관리자) ✨

- **칭찬 시스템**
  - 다양한 이모지 칭찬 지원 (👍, ❤️, 🎉, 💪, 🌟, 🔥, 👏, 🚀, 💯, ✨)
  - 칭찬 메시지 첨부 (최대 500자)
  - 공개/비공개 설정
  - 익명 칭찬 기능
  - 칭찬 삭제 (작성자만)
  - 자기 자신 칭찬 금지
  - 칭찬 쿨타임 시스템 (완전 설정 가능) ✨

- **관리자 기능** ✨
  - 모임 설정 페이지 (기본 정보, 쿨타임 설정)
  - 멤버 관리 (강제 퇴출)
  - 관리자 권한 위임
  - 초대 링크 재생성
  - 모임 삭제

- **UI/UX 개선** ✨
  - 토스트 알림 시스템 (성공/에러/정보/경고)
  - 로딩 상태 표시
  - 빈 상태 UI
  - 반응형 디자인
  - 직관적인 사용자 경험

- **에러 처리**
  - 존재하지 않는 초대 링크 처리
  - 네트워크 오류 대응
  - 권한 검증 및 에러 메시지

## 설정 방법

### 1. 환경 설정

Supabase 프로젝트 설정 후 `.env.local` 파일 생성:

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. 데이터베이스 설정

Supabase SQL 에디터에서 `supabase/schema.sql` 실행:

```sql
-- 파일 내용을 Supabase SQL 에디터에 붙여넣기 실행
```

### 3. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 프로젝트 구조

```
src/
├── lib/
│   ├── supabase.ts              # Supabase 클라이언트
│   ├── database.types.ts        # 데이터베이스 타입 정의
│   ├── components/
│   │   └── Toast.svelte        # 토스트 알림 컴포넌트
│   ├── stores/
│   │   ├── auth.ts             # 인증 상태 관리
│   │   └── toast.ts            # 토스트 알림 상태
│   └── utils/
│       ├── groups.ts           # 모임 관리 유틸리티
│       ├── praise.ts           # 칭찬 시스템 유틸리티
│       └── members.ts          # 멤버 관리 유틸리티
├── routes/
│   ├── +layout.svelte          # 메인 레이아웃 + 토스트
│   ├── +page.svelte            # 홈페이지 (모임 목록)
│   ├── login/                  # 로그인 페이지
│   ├── signup/                 # 회원가입 페이지
│   ├── create-group/           # 모임 생성 페이지
│   ├── group/[id]/             # 모임 상세 페이지
│   │   └── settings/           # 모임 설정 페이지 (관리자)
│   └── invite/[code]/          # 초대 링크 페이지
└── app.css                     # 글로벌 스타일
```

## 데이터베이스 스키마

### 주요 테이블

- `users`: 사용자 정보
- `groups`: 모임 정보
- `group_members`: 모임 멤버십
- `praise_messages`: 칭찬 메시지
- `praise_cooldowns`: 칭찬 쿨타임 추적

### 보안

- Row Level Security (RLS) 정책 적용
- 모임별 데이터 접근 제한
- 사용자별 권한 관리

## 배포

### Vercel 배포 (추천)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
```

### 기타 플랫폼

- Netlify
- Railway
- Render

## 개발 가이드

### 코드 스타일

```bash
# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 타입 체크
npm run check
```

### 디버깅

- Supabase Dashboard에서 실시간 로그 확인
- 브라우저 개발자 도구 Network 탭
- RLS 정책 관련 오류는 Supabase Auth 확인

## 기여

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일 참조

## 주요 기능 상세

### 🏠 모임 관리

- **모임 생성**: 이름(100자), 설명(500자), 최대 인원 설정
- **초대 시스템**: UUID 기반 안전한 초대 링크
- **멤버십**: 가입/나가기, 관리자/멤버 역할 관리
- **설정**: 관리자용 종합 설정 페이지

### 🎉 칭찬 시스템

- **이모지**: 10가지 다양한 칭찬 이모지
- **쿨타임**: 제한 없음 ~ 년 단위까지 세밀한 설정
- **프라이버시**: 공개/비공개, 익명 옵션
- **관리**: 실시간 정렬, 작성자 삭제 권한

### 👑 관리자 권한

- **모임 설정**: 기본 정보, 쿨타임, 최대 인원 관리
- **멤버 관리**: 강제 퇴출, 역할 관리
- **권한 이양**: 안전한 관리자 권한 이전
- **초대 관리**: 링크 재생성, 보안 관리

### 🎨 사용자 경험

- **토스트 알림**: 성공/실패/정보 실시간 피드백
- **반응형**: 모바일/태블릿/데스크톱 최적화
- **에러 핸들링**: 사용자 친화적 에러 메시지
- **빈 상태**: 직관적인 가이드 메시지

## 보안 특징

- **Row Level Security**: 사용자별 데이터 접근 제한
- **권한 검증**: 실시간 역할 기반 접근 제어
- **안전한 삭제**: CASCADE 관계로 일관성 보장
- **쿨타임 보호**: 서버 사이드 검증으로 우회 방지

## 개발 철학

이 프로젝트는 **사용자 경험 우선**, **보안 내재화**, **확장 가능한 아키텍처**를 바탕으로 개발되었습니다. 모든 기능은 실제 사용 시나리오를 고려하여 설계되었으며, 관리자와 일반 사용자 모두에게 직관적이고 안전한 환경을 제공합니다.

## 문의

프로젝트 관련 문의사항이나 버그 리포트는 GitHub Issues를 이용해 주세요.
