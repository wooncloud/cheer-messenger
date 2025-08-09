import { supabase } from "$lib/supabase";
import type { Tables } from "$lib/supabase";

export type PraiseMessage = Tables<"praise_messages"> & {
  sender?: Tables<"users"> | null;
  receiver?: Tables<"users"> | null;
};

export type GroupMember = Tables<"group_members"> & {
  user: Tables<"users">;
  received_praise_count?: number;
};

export const EMOJI_OPTIONS = [
  "👍",
  "❤️",
  "🎉",
  "💪",
  "🌟",
  "🔥",
  "👏",
  "🚀",
  "💯",
  "✨",
];

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  // RPC 함수를 사용하거나 간단한 쿼리로 처리
  const { data: members, error: membersError } = await supabase
    .from("group_members")
    .select(
      `
			*,
			user:users(*)
		`,
    )
    .eq("group_id", groupId)
    .eq("is_active", true)
    .order("joined_at", { ascending: true });

  if (membersError) throw membersError;
  if (!members) return [];

  // 전체 그룹의 칭찬 메시지를 한 번에 가져와서 카운트
  const { data: praises } = await supabase
    .from("praise_messages")
    .select("receiver_id")
    .eq("group_id", groupId);

  // 각 멤버별로 칭찬 수 계산
  const praiseCountMap = new Map<string, number>();
  praises?.forEach((praise) => {
    const count = praiseCountMap.get(praise.receiver_id) || 0;
    praiseCountMap.set(praise.receiver_id, count + 1);
  });

  return members.map((member) => ({
    ...member,
    received_praise_count: praiseCountMap.get(member.user_id) || 0,
  }));
}

export async function getGroupPraises(
  groupId: string,
): Promise<PraiseMessage[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("praise_messages")
    .select(
      `
			*,
			sender:users!praise_messages_sender_id_fkey(*),
			receiver:users!praise_messages_receiver_id_fkey(*)
		`,
    )
    .eq("group_id", groupId)
    .or(
      `is_public.eq.true,sender_id.eq.${user.user.id},receiver_id.eq.${user.user.id}`,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((praise) => ({
    ...praise,
    sender: praise.is_anonymous ? null : praise.sender,
    receiver: praise.receiver,
  }));
}

export async function canUserPraise(
  groupId: string,
  senderId: string,
  receiverId: string,
): Promise<{ canPraise: boolean; nextAllowedTime?: Date; message?: string }> {
  // Check if sender and receiver are active members
  const { data: senderMember } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", senderId)
    .eq("is_active", true)
    .single();

  const { data: receiverMember } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", receiverId)
    .eq("is_active", true)
    .single();

  if (!senderMember || !receiverMember) {
    return {
      canPraise: false,
      message: "모임 멤버만 칭찬을 주고받을 수 있습니다.",
    };
  }

  // Get group cooldown settings
  const { data: group } = await supabase
    .from("groups")
    .select("praise_cooldown_value, praise_cooldown_unit")
    .eq("id", groupId)
    .single();

  if (!group) {
    return { canPraise: false, message: "모임 정보를 찾을 수 없습니다." };
  }

  // If no cooldown, always allow
  if (group.praise_cooldown_unit === "none") {
    return { canPraise: true };
  }

  // Check last praise time
  const { data: cooldown } = await supabase
    .from("praise_cooldowns")
    .select("last_praised_at")
    .eq("group_id", groupId)
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .single();

  if (!cooldown) {
    return { canPraise: true };
  }

  // Calculate next allowed time
  const lastPraise = new Date(cooldown.last_praised_at);
  const cooldownMs = getCooldownMs(
    group.praise_cooldown_value,
    group.praise_cooldown_unit,
  );
  const nextAllowedTime = new Date(lastPraise.getTime() + cooldownMs);

  if (new Date() >= nextAllowedTime) {
    return { canPraise: true };
  }

  return {
    canPraise: false,
    nextAllowedTime,
    message: `아직 칭찬 쿨타임이 남아있습니다. ${formatTimeRemaining(nextAllowedTime)} 후에 다시 시도해주세요.`,
  };
}

export async function sendPraise(data: {
  groupId: string;
  receiverId: string;
  emoji: string;
  message?: string;
  isPublic: boolean;
  isAnonymous: boolean;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  // Check if user can praise
  const praiseCheck = await canUserPraise(
    data.groupId,
    user.user.id,
    data.receiverId,
  );
  if (!praiseCheck.canPraise) {
    throw new Error(praiseCheck.message || "칭찬을 보낼 수 없습니다.");
  }

  // Validate message length
  if (data.message && data.message.length > 500) {
    throw new Error("칭찬 메시지는 500자를 초과할 수 없습니다.");
  }

  // Send praise
  const { data: praise, error } = await supabase
    .from("praise_messages")
    .insert({
      group_id: data.groupId,
      sender_id: user.user.id,
      receiver_id: data.receiverId,
      emoji: data.emoji,
      message: data.message?.trim() || null,
      is_public: data.isPublic,
      is_anonymous: data.isAnonymous,
    })
    .select()
    .single();

  if (error) throw error;
  return praise;
}

export async function deletePraise(praiseId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("praise_messages")
    .delete()
    .eq("id", praiseId)
    .eq("sender_id", user.user.id);

  if (error) throw error;
}

function getCooldownMs(value: number, unit: string): number {
  const multipliers = {
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    week: 1000 * 60 * 60 * 24 * 7,
    month: 1000 * 60 * 60 * 24 * 30,
    year: 1000 * 60 * 60 * 24 * 365,
    none: 0,
  };

  return (
    value * (multipliers[unit as keyof typeof multipliers] || multipliers.day)
  );
}

function formatTimeRemaining(nextAllowedTime: Date): string {
  const now = new Date();
  const diff = nextAllowedTime.getTime() - now.getTime();

  if (diff <= 0) return "지금";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 ${hours % 24}시간`;
  if (hours > 0) return `${hours}시간 ${minutes % 60}분`;
  if (minutes > 0) return `${minutes}분`;
  return `${seconds}초`;
}
