# Cheer Messenger 문서

Cheer Messenger 프로젝트의 종합 문서 모음입니다.

## 📚 문서 목차

### 🚀 시작하기

- [빠른 시작 가이드](./getting-started.md) - 프로젝트 설정 및 실행
- [프로젝트 개요](../README.md) - 프로젝트 소개 및 주요 기능

### 🏗️ 아키텍처

- [시스템 아키텍처](./architecture/system-architecture.md) - 전체 시스템 구조
- [데이터베이스 설계](./architecture/database-design.md) - 데이터 모델 및 관계
- [보안 아키텍처](./architecture/security.md) - 인증 및 권한 관리

### 🛠️ 개발 가이드

- [개발 환경 설정](./development/setup.md) - 로컬 개발 환경 구축
- [프로젝트 구조](./development/project-structure.md) - 디렉토리 구조 및 파일 설명
- [코딩 표준](./development/coding-standards.md) - 코드 스타일 및 컨벤션

### 📊 API 문서

- [Supabase 스키마](./api/supabase-schema.md) - 데이터베이스 테이블 및 함수
- [타입 정의](./api/types.md) - TypeScript 타입 시스템
- [유틸리티 함수](./api/utilities.md) - 공통 헬퍼 함수

### ⚡ 기능 가이드

- [인증 시스템](./features/authentication.md) - 로그인/회원가입 플로우
- [모임 관리](./features/group-management.md) - 모임 생성, 초대, 설정
- [칭찬 시스템](./features/praise-system.md) - 칭찬 메시지 및 쿨타임
- [관리자 기능](./features/admin-features.md) - 모임 관리자 전용 기능

### 🎨 컴포넌트

- [공통 컴포넌트](./components/common.md) - 재사용 가능한 UI 컴포넌트
- [페이지별 컴포넌트](./components/pages.md) - 특정 페이지 전용 컴포넌트
- [폼 컴포넌트](./components/forms.md) - 입력 폼 및 유효성 검사

### 🚀 배포 및 운영

- [배포 가이드](./deployment/vercel.md) - Vercel 배포 설정
- [환경 변수](./deployment/environment.md) - 환경별 설정 관리
- [모니터링](./operations/monitoring.md) - 애플리케이션 모니터링

## 🎯 빠른 링크

### 개발자용

- [로컬 환경 설정](./development/setup.md#로컬-환경-설정)
- [데이터베이스 스키마](./api/supabase-schema.md)
- [컴포넌트 가이드](./components/common.md)

### 기획자/PM용

- [기능 명세서](./features/)
- [사용자 플로우](./architecture/user-flows.md)
- [비즈니스 로직](./features/business-logic.md)

### 운영자용

- [배포 가이드](./deployment/)
- [트러블슈팅](./operations/troubleshooting.md)
- [성능 최적화](./operations/performance.md)

## 📝 문서 작성 가이드

이 문서들은 다음 원칙에 따라 작성되었습니다:

1. **실용성**: 실제 개발에 도움이 되는 내용 중심
2. **최신성**: 코드 변경에 따른 문서 업데이트
3. **완성도**: 예제 코드와 스크린샷 포함
4. **접근성**: 초보자도 이해할 수 있는 설명

## 🤝 기여하기

문서 개선에 기여하고 싶다면:

1. 오타나 오류 발견 시 [Issue 생성](../../../issues)
2. 새로운 문서나 개선 사항은 [PR 제출](../../../pulls)
3. 문서 스타일 가이드는 [여기](./development/documentation-style.md) 참조

---

**마지막 업데이트**: 2024년 8월 10일  
**문서 버전**: 1.0.0
