import type { PageServerLoad } from "./$types";
import {
  getUserProfile,
} from "$lib/utils/users";

export const load: PageServerLoad = async ({ parent }) => {
  // 상위 layout에서 이미 사용자를 확인했으므로 parent()에서 가져옴
  const { user, session } = await parent();

  try {
    // 사용자 기본 정보 조회
    const profile = await getUserProfile(user.id);

    if (!profile) {
      throw new Error("사용자 프로필을 찾을 수 없습니다.");
    }

    return {
      profile,
    };
  } catch (error) {
    console.error("프로필 페이지 로드 오류:", {
      error: error instanceof Error ? error.message : error,
      userId: user?.id,
      userEmail: user?.email,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // 디버깅을 위해 임시로 에러 상태를 반환 (리다이렉트 비활성화)
    return {
      profile: null,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    };
  }
};