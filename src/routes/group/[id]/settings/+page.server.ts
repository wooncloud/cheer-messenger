import { supabase } from "$lib/supabase";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  params,
  locals: { getSession },
}) => {
  const session = await getSession();

  // 세션이 없으면 클라이언트에서 처리하도록 플래그 전달
  if (!session) {
    return {
      needsAuth: true,
      groupId: params.id,
    };
  }

  // Get group information and check if user is admin
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select(
      `
			*,
			owner:users!groups_owner_id_fkey(name, email)
		`,
    )
    .eq("id", params.id)
    .single();

  if (groupError) {
    throw error(404, "Group not found");
  }

  // Check if current user is admin
  const { data: membership } = await supabase
    .from("group_members")
    .select("role, is_active")
    .eq("group_id", params.id)
    .eq("user_id", session.user.id)
    .single();

  if (!membership || !membership.is_active || membership.role !== "admin") {
    throw error(403, "Admin access required");
  }

  return {
    group,
  };
};
