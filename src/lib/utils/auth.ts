import { supabase } from "$lib/supabase";
import { goto } from "$app/navigation";

/**
 * Google OAuth 로그인 함수
 * @param redirectTo - 로그인 성공 후 리다이렉트할 경로 (기본값: '/dashboard')
 */
export async function signInWithGoogle(
  redirectTo: string = "/dashboard",
): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) throw error;
  } catch (error: any) {
    console.error("Google 로그인 오류:", error);
    throw new Error(getKoreanErrorMessage(error.message));
  }
}

/**
 * 로그아웃 함수
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    goto("/login");
  } catch (error: any) {
    console.error("로그아웃 오류:", error);
    throw new Error("로그아웃 중 오류가 발생했습니다.");
  }
}

/**
 * OAuth 관련 에러 메시지를 한국어로 번역
 * @param errorMessage - 영어 에러 메시지
 * @returns 한국어 에러 메시지
 */
export function getKoreanErrorMessage(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    access_denied: "로그인이 취소되었습니다.",
    unauthorized_client: "인증되지 않은 클라이언트입니다.",
    invalid_request: "잘못된 요청입니다.",
    unsupported_response_type: "지원하지 않는 응답 유형입니다.",
    invalid_scope: "유효하지 않은 권한 범위입니다.",
    server_error: "서버 오류가 발생했습니다.",
    temporarily_unavailable: "일시적으로 서비스를 사용할 수 없습니다.",
    popup_blocked:
      "팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.",
    "Network request failed": "네트워크 연결을 확인해주세요.",
    "Too many requests":
      "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  };

  return (
    errorMap[errorMessage] ||
    errorMessage ||
    "Google 로그인 중 오류가 발생했습니다."
  );
}
