import { getGroupByInviteCode } from "$lib/utils/groups";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
  try {
    const group = await getGroupByInviteCode(params.code);
    const session = await getSession();
    
    return {
      group,
      isAuthenticated: !!session,
      currentUserId: session?.user?.id || null,
    };
  } catch (err) {
    throw error(404, "Invalid invite code");
  }
};
