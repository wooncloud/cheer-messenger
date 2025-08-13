import { supabase } from "$lib/supabase";
import type { Tables } from "$lib/supabase";
import type { GroupMember } from "$lib/utils/praise";

export async function leaveGroup(groupId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  // Check if user is the group owner
  const { data: group } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (group?.owner_id === user.user.id) {
    throw new Error(
      "모임 관리자는 모임을 나갈 수 없습니다. 다른 멤버에게 관리자 권한을 위임하거나 모임을 삭제해주세요.",
    );
  }

  // Set is_active to false and update left_at
  const { error } = await supabase
    .from("group_members")
    .update({
      is_active: false,
      left_at: new Date().toISOString(),
    })
    .eq("group_id", groupId)
    .eq("user_id", user.user.id)
    .eq("is_active", true);

  if (error) throw error;
}

export async function kickMember(groupId: string, userId: string) {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error("User not authenticated");

  // Check if current user is admin
  const { data: currentMember } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", currentUser.user.id)
    .eq("is_active", true)
    .single();

  if (!currentMember || currentMember.role !== "admin") {
    throw new Error("관리자만 멤버를 강제 퇴출할 수 있습니다.");
  }

  // Check if target user is also admin
  const { data: targetMember } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (targetMember?.role === "admin") {
    throw new Error("다른 관리자를 강제 퇴출할 수 없습니다.");
  }

  // Set is_active to false and update left_at
  const { error } = await supabase
    .from("group_members")
    .update({
      is_active: false,
      left_at: new Date().toISOString(),
    })
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error) throw error;
}

export async function transferAdminRole(groupId: string, newAdminId: string) {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error("User not authenticated");

  // Check if current user is the group owner/admin
  const { data: group } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (group?.owner_id !== currentUser.user.id) {
    throw new Error("모임 생성자만 관리자 권한을 위임할 수 있습니다.");
  }

  // Check if target user is an active member
  const { data: targetMember } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", newAdminId)
    .eq("is_active", true)
    .single();

  if (!targetMember) {
    throw new Error("해당 사용자는 모임의 활성 멤버가 아닙니다.");
  }

  // Start transaction: update group owner and member roles
  const { error: groupError } = await supabase
    .from("groups")
    .update({ owner_id: newAdminId })
    .eq("id", groupId);

  if (groupError) throw groupError;

  // Update new admin role
  const { error: newAdminError } = await supabase
    .from("group_members")
    .update({ role: "admin" })
    .eq("group_id", groupId)
    .eq("user_id", newAdminId);

  if (newAdminError) throw newAdminError;

  // Update old admin role to member
  const { error: oldAdminError } = await supabase
    .from("group_members")
    .update({ role: "member" })
    .eq("group_id", groupId)
    .eq("user_id", currentUser.user.id);

  if (oldAdminError) throw oldAdminError;
}

export async function deleteGroup(groupId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  // Check if user is the group owner
  const { data: group } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (group?.owner_id !== user.user.id) {
    throw new Error("모임 생성자만 모임을 삭제할 수 있습니다.");
  }

  // Delete group (CASCADE will handle related records)
  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId)
    .eq("owner_id", user.user.id);

  if (error) throw error;
}

/**
 * 현재 사용자를 제외한 멤버 목록을 필터링
 * @param members - 전체 멤버 목록
 * @param currentUserId - 현재 사용자 ID
 * @returns 현재 사용자를 제외한 멤버 목록
 */
export function filterOtherMembers(
  members: GroupMember[],
  currentUserId: string | undefined,
): GroupMember[] {
  if (!currentUserId) return members;
  return members.filter((member) => member.user_id !== currentUserId);
}
