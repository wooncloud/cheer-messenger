# 빠른 시작 가이드

Cheer Messenger를 로컬 환경에서 실행하기 위한 단계별 가이드입니다.

## 📋 사전 요구사항

- **Node.js** 18.0.0 이상
- **npm** 또는 **yarn**
- **Git**
- **Supabase 계정** (무료)

## 🚀 1단계: 프로젝트 클론

```bash
git clone <repository-url>
cd cheer-messenger
```

## 📦 2단계: 의존성 설치

```bash
npm install
```

## 🔧 3단계: Supabase 설정

### 3.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. "New project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: cheer-messenger (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: 가까운 지역 선택

### 3.2 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor** 이동
2. `supabase/schema.sql` 파일 내용을 복사하여 실행
3. "Run" 버튼 클릭하여 스키마 생성

### 3.3 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Supabase 설정
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**값 찾기**:

1. Supabase 대시보드 → **Settings** → **API**
2. **Project URL** → `PUBLIC_SUPABASE_URL`
3. **Project API keys** → `anon` `public` → `PUBLIC_SUPABASE_ANON_KEY`

## 🔐 4단계: Google OAuth 설정

### 4.1 Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services** → **Credentials** 이동
4. **CREATE CREDENTIALS** → **OAuth client ID** 클릭
5. 설정값:
   - **Application type**: Web application
   - **Authorized redirect URIs**:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```

### 4.2 Supabase에 Google OAuth 설정

1. Supabase 대시보드 → **Authentication** → **Providers**
2. **Google** 활성화
3. Google Cloud Console에서 받은 값 입력:
   - **Client ID**
   - **Client Secret**

## 🏃‍♂️ 5단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## ✅ 6단계: 설정 확인

### 기본 기능 테스트

1. **로그인**: Google 계정으로 로그인
2. **모임 생성**: 새 모임 만들기
3. **칭찬 전송**: 본인에게 칭찬해보기 (오류 확인용)
4. **초대 링크**: 초대 링크 생성 및 접속

### 스키마 검증 (선택사항)

```bash
node verify-schema.js
```

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 타입 체크
npm run check

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🐛 문제 해결

### 자주 발생하는 오류

#### 1. Supabase 연결 오류

```bash
Error: Invalid API key
```

**해결책**: `.env.local` 파일의 API 키 확인

#### 2. RLS 정책 오류

```bash
permission denied for table users
```

**해결책**: `schema.sql`이 완전히 실행되었는지 확인

#### 3. Google OAuth 오류

```bash
OAuth error: redirect_uri_mismatch
```

**해결책**: Google Cloud Console의 Redirect URI 설정 확인

### 로그 확인 방법

1. **브라우저 개발자 도구**: Network/Console 탭
2. **Supabase 로그**: 대시보드 → Logs
3. **서버 로그**: 터미널 출력

## 📚 다음 단계

설정이 완료되었다면:

1. [개발 가이드](./development.md) - 상세 개발 환경 설정 및 워크플로우
2. [아키텍처](./architecture.md) - 시스템 구조 이해하기  
3. [데이터베이스](./database.md) - 스키마 및 API 참조
4. [개발자 가이드](../CLAUDE.md) - 아키텍처 및 개발 노트

## 🆘 도움 요청

문제가 해결되지 않는다면:

1. [GitHub Issues](../../issues) 검색
2. 새 이슈 생성 시 다음 정보 포함:
   - 오류 메시지
   - 브라우저/OS 정보
   - 재현 단계

---

**참고**: 개발 중 변경사항은 자동으로 브라우저에 반영됩니다. 새로고침이 필요한 경우는 거의 없습니다.
