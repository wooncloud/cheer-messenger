/**
 * 시간 관련 유틸리티 함수들
 */

/**
 * 주어진 날짜를 상대적 시간으로 포맷팅
 * @param dateString - ISO 날짜 문자열
 * @returns 상대적 시간 표현 (예: "방금", "2시간 전", "3일 전")
 */
export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return "방금";
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}주 전`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}개월 전`;
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param dateString - ISO 날짜 문자열
 * @returns 한국어 날짜 형식
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("ko-KR");
}

/**
 * 날짜만을 한국어 형식으로 포맷팅 (시간 제외)
 * @param dateString - ISO 날짜 문자열
 * @returns 한국어 날짜 형식 (시간 제외)
 */
export function formatDateOnly(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR");
}
