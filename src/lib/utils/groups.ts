import { supabase } from "$lib/supabase";
import type { Tables } from "$lib/supabase";

export interface Group extends Tables<"groups"> {
  member_count?: number;
  praise_count?: number;
  user_role?: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  max_members?: number;
}

export async function createGroup(
  data: CreateGroupData,
): Promise<Tables<"groups">> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  // Create the group
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: data.name.trim(),
      description: data.description?.trim() || null,
      owner_id: user.user.id,
      max_members: data.max_members || 50,
    })
    .select()
    .single();

  if (groupError) throw groupError;

  // Add the owner as an admin member
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.user.id,
    role: "admin",
  });

  if (memberError) throw memberError;

  return group;
}

export async function getUserGroups(): Promise<Group[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("groups")
    .select(
      `
			*,
			group_members!inner(role),
			member_count:group_members(count),
			praise_count:praise_messages(count)
		`,
    )
    .eq("group_members.user_id", user.user.id)
    .eq("group_members.is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map(
    (group): Group => ({
      ...group,
      member_count: group.member_count?.[0]?.count || 0,
      praise_count: group.praise_count?.[0]?.count || 0,
      user_role: group.group_members[0]?.role,
    }),
  );
}

export async function getGroupByInviteCode(inviteCode: string): Promise<any> {
  const { data, error } = await supabase
    .from("groups")
    .select(
      `
			*,
			owner:users!groups_owner_id_fkey(name),
			member_count:group_members(count)
		`,
    )
    .eq("invite_code", inviteCode)
    .eq("group_members.is_active", true)
    .single();

  if (error) throw error;
  return data;
}

export async function joinGroup(groupId: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  // 기존 멤버십 확인
  const { data: existingMember } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (existingMember) {
    throw new Error("이미 이 모임의 멤버입니다");
  }

  // 모임 인원 제한 확인
  const { data: group } = await supabase
    .from("groups")
    .select(
      `
			max_members,
			member_count:group_members(count)
		`,
    )
    .eq("id", groupId)
    .eq("group_members.is_active", true)
    .single();

  if (group?.member_count?.[0]?.count >= group.max_members) {
    throw new Error("모임 인원이 가득 찼습니다");
  }

  const { error } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: user.user.id,
  });

  if (error) throw error;
}

export function generateNewInviteCode(): string {
  return crypto.randomUUID();
}

export async function regenerateInviteCode(groupId: string): Promise<string> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const newInviteCode = generateNewInviteCode();

  const { data, error } = await supabase
    .from("groups")
    .update({ invite_code: newInviteCode })
    .eq("id", groupId)
    .eq("owner_id", user.user.id)
    .select("invite_code")
    .single();

  if (error) throw error;
  return data.invite_code;
}
