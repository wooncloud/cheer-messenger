import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { getUserProfile, updateUserProfile } from "$lib/utils/users";

export const load: PageServerLoad = async ({ parent }) => {
  // 상위 layout에서 이미 세션을 확인했으므로 parent()에서 가져옴
  const { session } = await parent();

  try {
    const profile = await getUserProfile(session.user.id);

    if (!profile) {
      throw new Error("사용자 프로필을 찾을 수 없습니다.");
    }

    return {
      profile,
    };
  } catch (error) {
    console.error("프로필 수정 페이지 로드 오류:", error);
    throw redirect(303, "/profile");
  }
};

export const actions: Actions = {
  updateProfile: async ({ request, locals: { getSession } }) => {
    const session = await getSession();

    if (!session) {
      return fail(401, {
        error: "로그인이 필요합니다.",
      });
    }

    try {
      const formData = await request.formData();
      const name = formData.get("name") as string;
      const avatarUrl = formData.get("avatar_url") as string;

      // 입력값 검증
      if (!name || name.trim().length === 0) {
        return fail(400, {
          error: "이름을 입력해주세요.",
          name,
          avatarUrl,
        });
      }

      if (name.trim().length > 50) {
        return fail(400, {
          error: "이름은 50자 이하로 입력해주세요.",
          name,
          avatarUrl,
        });
      }

      // 아바타 URL 검증 (선택사항)
      if (avatarUrl && avatarUrl.trim().length > 0) {
        try {
          new URL(avatarUrl);
        } catch {
          return fail(400, {
            error: "올바른 이미지 URL을 입력해주세요.",
            name,
            avatarUrl,
          });
        }
      }

      // 프로필 업데이트
      await updateUserProfile(session.user.id, {
        name: name.trim(),
        avatar_url: avatarUrl && avatarUrl.trim().length > 0 ? avatarUrl.trim() : null,
      });

      return {
        success: true,
        message: "프로필이 성공적으로 업데이트되었습니다.",
      };
    } catch (error: any) {
      console.error("프로필 업데이트 오류:", error);
      return fail(500, {
        error: "프로필 업데이트 중 오류가 발생했습니다.",
      });
    }
  },
};