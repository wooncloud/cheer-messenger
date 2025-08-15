# Cheeract 🎉

모임 내에서 서로에게 칭찬과 격려를 주고받을 수 있는 웹 애플리케이션

## 개발 철학

**사용자 경험 우선**, **보안 내재화**, **확장 가능한 아키텍처**를 바탕으로 개발되었습니다. 모든 기능은 실제 사용 시나리오를 고려하여 설계되었으며, 관리자와 일반 사용자 모두에게 직관적이고 안전한 환경을 제공합니다.

## 주요 기능

- **모임 관리**: 생성, 초대 링크, 멤버십 관리
- **칭찬 시스템**: 10가지 이모지, 공개/비공개/익명 옵션, 설정 가능한 쿨타임
- **관리자 기능**: 종합 설정, 멤버 관리, 권한 위임
- **사용자 경험**: 반응형 디자인, 토스트 알림, 실시간 업데이트

## 기술 스택

- **Frontend**: SvelteKit + TypeScript
- **Backend**: Supabase (Authentication, Database, RLS)
- **UI**: Tailwind CSS + shadcn-svelte
- **Deployment**: Vercel (추천)

## 빠른 시작

```bash
# 프로젝트 클론
git clone <repository-url>
cd cheer-messenger

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local 파일 생성)
# PUBLIC_SUPABASE_URL=your-supabase-url
# PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 개발 서버 실행
npm run dev
```

> 상세한 설정 방법은 [문서](docs/getting-started.md)를 참고하세요.

## 보안 특징

- **Row Level Security**: 사용자별 데이터 접근 제한
- **권한 검증**: 실시간 역할 기반 접근 제어
- **쿨타임 보호**: 서버 사이드 검증으로 우회 방지

## 개발 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run check        # TypeScript 타입 체크
npm run lint         # 코드 린트 검사
npm run format       # 코드 포맷팅
```

## 문서

- [시작 가이드](docs/getting-started.md) - 첫 설정부터 실행까지
- [개발자 가이드](docs/development.md) - 아키텍처, 개발 워크플로우
- [API 문서](docs/) - 데이터베이스 스키마, API 참조

## 라이선스

MIT License
