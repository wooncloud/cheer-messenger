import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {
  getUserPraiseStats,
  getRecentReceivedPraise,
} from "$lib/utils/users";

export const load: PageServerLoad = async ({ locals: { getUser, getSession } }) => {
  // getUser()를 사용하여 보안 강화 (Supabase 권장사항)
  const user = await getUser();

  if (!user) {
    throw redirect(303, "/login?redirect=/stats");
  }

  try {
    // 사용자 칭찬 통계와 최근 받은 칭찬을 병렬로 조회
    const praiseStats = await getUserPraiseStats(user.id);
    const recentPraises = await getRecentReceivedPraise(user.id, 10); // 통계 페이지에서는 더 많이 보여줌

    return {
      praiseStats,
      recentPraises,
    };
  } catch (error) {
    console.error("통계 페이지 로드 오류:", {
      error: error instanceof Error ? error.message : error,
      userId: user?.id,
      userEmail: user?.email,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return {
      praiseStats: null,
      recentPraises: null,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    };
  }
};