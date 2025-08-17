import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { getUser, getSession } }) => {
  // getUser()를 사용하여 보안 강화 (Supabase 권장사항)
  const user = await getUser();

  if (!user) {
    throw redirect(303, "/login?redirect=/profile");
  }

  // 세션도 함께 반환 (하위 페이지에서 필요할 수 있음)
  const session = await getSession();

  return {
    user,
    session
  };
};