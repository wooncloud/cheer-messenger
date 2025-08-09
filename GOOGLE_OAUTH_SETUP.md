# Google OAuth 설정 가이드

Google OAuth 로그인을 사용하기 위해서는 Google Cloud Console과 Supabase에서 설정이 필요합니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 또는 선택

1. [Google Cloud Console](https://console.cloud.google.com/)에 로그인
2. 기존 프로젝트를 선택하거나 새 프로젝트 생성

### 1.2 OAuth 2.0 클라이언트 ID 생성

1. **APIs & Services** > **Credentials**로 이동
2. **+ CREATE CREDENTIALS** > **OAuth client ID** 클릭
3. **Application type**에서 **Web application** 선택
4. **Name**: `Cheer Messenger` (또는 원하는 이름)
5. **Authorized JavaScript origins**에 추가:
   - `http://localhost:5173` (개발 환경)
   - `https://your-domain.com` (배포 환경)
6. **Authorized redirect URIs**에 추가:
   - `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`
   - 예: `https://abcdefghijk.supabase.co/auth/v1/callback`
7. **CREATE** 클릭
8. 생성된 **Client ID**와 **Client Secret**을 복사하여 저장

## 2. Supabase 설정

### 2.1 Authentication 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택 > **Authentication** > **Providers**로 이동
3. **Google** 항목을 찾아 **Enable** 체크
4. Google Cloud Console에서 복사한 정보 입력:
   - **Client ID**: Google OAuth 클라이언트 ID
   - **Client Secret**: Google OAuth 클라이언트 시크릿
5. **Save** 클릭

### 2.2 URL 구성 확인

**Site URL** (Authentication > Settings):

- 개발: `http://localhost:5173`
- 배포: `https://your-domain.com`

**Redirect URLs** (Authentication > Settings):

- 개발: `http://localhost:5173/auth/callback`
- 배포: `https://your-domain.com/auth/callback`

## 3. 사용자 프로필 처리

Google OAuth로 로그인한 사용자의 경우, 자동으로 `users` 테이블에 프로필이 생성됩니다. 이를 위해 다음 트리거를 Supabase SQL 에디터에서 실행하세요:

```sql
-- OAuth 사용자를 위한 프로필 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 기존 트리거가 있다면 삭제 후 새로 생성
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. 테스트

### 4.1 개발 환경에서 테스트

1. `npm run dev`로 개발 서버 실행
2. `/login` 또는 `/signup` 페이지로 이동
3. "Google로 로그인" 버튼 클릭
4. Google 계정으로 로그인 진행
5. 성공 시 홈페이지로 리다이렉트 확인

### 4.2 문제 해결

- **"redirect_uri_mismatch" 오류**: Google Cloud Console의 Authorized redirect URIs에 정확한 Supabase callback URL이 추가되었는지 확인
- **"invalid_client" 오류**: Client ID와 Client Secret이 정확히 입력되었는지 확인
- **로그인 후 리다이렉트되지 않음**: Site URL과 Redirect URLs 설정 확인

## 5. 보안 고려사항

### 5.1 스코프 설정

현재 구현에서는 기본 Google 스코프를 사용합니다:

- `openid`: OpenID Connect 인증
- `email`: 이메일 주소 접근
- `profile`: 기본 프로필 정보 접근

### 5.2 데이터 처리

- Google 프로필 사진은 `users.avatar_url`에 저장됩니다
- Google에서 제공하는 이름은 `users.name`에 저장됩니다
- 이메일은 `users.email`에 저장됩니다

## 6. 배포 시 체크리스트

- [ ] Google Cloud Console의 Authorized JavaScript origins에 배포 도메인 추가
- [ ] Google Cloud Console의 Authorized redirect URIs에 배포 환경의 callback URL 추가
- [ ] Supabase의 Site URL을 배포 도메인으로 설정
- [ ] Supabase의 Redirect URLs에 배포 환경의 callback URL 추가
- [ ] 환경 변수 (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`) 배포 환경에 설정

## 추가 참고 자료

- [Supabase Google OAuth 공식 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 설정 가이드](https://developers.google.com/identity/protocols/oauth2)
