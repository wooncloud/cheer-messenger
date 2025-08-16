import type { PageServerLoad } from "./$types";
import {
  getUserProfile,
  getUserPraiseStats,
  getRecentReceivedPraise,
} from "$lib/utils/users";

export const load: PageServerLoad = async ({ parent }) => {
  // 상위 layout에서 이미 세션을 확인했으므로 parent()에서 가져옴
  const { session } = await parent();

  try {
    // 사용자 기본 정보와 통계를 병렬로 조회
    const profile = await getUserProfile(session.user.id);
    const praiseStats = await getUserPraiseStats(session.user.id);
    const recentPraises = await getRecentReceivedPraise(session.user.id, 3);

    if (!profile) {
      throw new Error("사용자 프로필을 찾을 수 없습니다.");
    }

    return {
      profile,
      praiseStats,
      recentPraises,
    };
  } catch (error) {
    console.error("프로필 페이지 로드 오류:", {
      error: error instanceof Error ? error.message : error,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // 디버깅을 위해 임시로 에러 상태를 반환 (리다이렉트 비활성화)
    return {
      profile: null,
      praiseStats: null,
      recentPraises: null,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    };
  }
};