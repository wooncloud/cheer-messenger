import { supabase } from "$lib/supabase";
import type { Tables, Updates } from "$lib/supabase";

export type UserProfile = Tables<"users">;
export type UserProfileUpdate = Updates<"users">;

/**
 * 사용자 프로필 정보 조회 (없으면 자동 생성)
 * @param userId - 조회할 사용자 ID
 * @returns 사용자 프로필 정보
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // 사용자가 없는 경우 null 반환 (DB 트리거가 프로필 생성을 담당)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error("사용자 프로필 조회/생성 오류:", error);
    throw new Error("프로필 정보를 불러올 수 없습니다.");
  }
}

/**
 * 사용자 프로필 정보 업데이트
 * @param userId - 업데이트할 사용자 ID
 * @param updates - 업데이트할 필드들
 * @returns 업데이트된 사용자 프로필
 */
export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate,
): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("사용자 프로필 업데이트 오류:", error);
    throw new Error("프로필 업데이트 중 오류가 발생했습니다.");
  }
}

/**
 * 사용자 칭찬 통계 조회
 * @param userId - 통계를 조회할 사용자 ID
 * @returns 보낸 칭찬 수와 받은 칭찬 수
 */
export async function getUserPraiseStats(userId: string): Promise<{
  sentCount: number;
  receivedCount: number;
}> {
  try {
    // 보낸 칭찬 수 조회 (성능 최적화: 불필요한 데이터 제거)
    const { count: sentCount, error: sentError } = await supabase
      .from("praise_messages")
      .select("id", { count: "exact", head: true })
      .eq("sender_id", userId);

    if (sentError) throw sentError;

    // 받은 칭찬 수 조회 (성능 최적화: 불필요한 데이터 제거)
    const { count: receivedCount, error: receivedError } = await supabase
      .from("praise_messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", userId);

    if (receivedError) throw receivedError;

    return {
      sentCount: sentCount || 0,
      receivedCount: receivedCount || 0,
    };
  } catch (error: any) {
    console.error("칭찬 통계 조회 오류:", error);
    throw new Error("칭찬 통계를 불러올 수 없습니다.");
  }
}

/**
 * 최근 받은 칭찬 메시지 조회
 * @param userId - 조회할 사용자 ID
 * @param limit - 조회할 칭찬 수 (기본값: 5)
 * @returns 최근 받은 칭찬 메시지 목록
 */
export async function getRecentReceivedPraise(
  userId: string,
  limit: number = 5,
): Promise<
  Array<{
    id: string;
    message: string | null;
    emoji: string;
    created_at: string;
    is_anonymous: boolean;
    sender: {
      id: string;
      name: string;
      avatar_url: string | null;
    } | null;
    group: {
      id: string;
      name: string;
    };
  }>
> {
  try {
    const { data, error } = await supabase
      .from("praise_messages")
      .select(`
        id,
        message,
        emoji,
        created_at,
        is_anonymous,
        sender:users!sender_id (
          id,
          name,
          avatar_url
        ),
        group:groups!group_id (
          id,
          name
        )
      `)
      .eq("receiver_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("최근 받은 칭찬 조회 오류:", error);
    throw new Error("최근 칭찬을 불러올 수 없습니다.");
  }
}

/**
 * 사용자가 참여 중인 그룹 목록 조회
 * @param userId - 조회할 사용자 ID
 * @returns 사용자가 참여 중인 그룹 목록
 */
export async function getUserGroups(userId: string): Promise<
  Array<{
    group_id: string;
    role: string;
    joined_at: string;
    group: {
      id: string;
      name: string;
      description: string | null;
      member_count: number;
    };
  }>
> {
  try {
    // 단일 RPC 호출로 N+1 쿼리 문제 해결 (타입 임시 우회)
    const { data, error } = await supabase
      .rpc('get_user_groups_with_counts' as any, { p_user_id: userId });

    if (error) throw error;

    // 데이터 형태를 기존 인터페이스에 맞게 변환
    return (data || []).map((item: any) => ({
      group_id: item.group_id,
      role: item.role,
      joined_at: item.joined_at,
      group: {
        id: item.group_id,
        name: item.group_name,
        description: item.group_description,
        member_count: item.member_count,
      },
    }));
  } catch (error: any) {
    console.error("사용자 그룹 목록 조회 오류:", error);
    throw new Error("참여 중인 그룹 목록을 불러올 수 없습니다.");
  }
}