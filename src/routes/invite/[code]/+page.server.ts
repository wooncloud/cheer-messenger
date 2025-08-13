import { getGroupByInviteCode } from "$lib/utils/groups";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  try {
    const group = await getGroupByInviteCode(params.code);
    return {
      group,
      isAuthenticated: !!locals.session,
      currentUserId: locals.session?.user?.id || null,
    };
  } catch (err) {
    throw error(404, "Invalid invite code");
  }
};
