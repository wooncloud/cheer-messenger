import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { supabase } from "$lib/supabase";

export const load: PageServerLoad = async ({ locals: { getSession }, url }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/login");
  }

  const tab = url.searchParams.get("tab") || "received";

  try {
    // 받은 칭찬과 보낸 칭찬을 병렬로 조회
    const [receivedPraises, sentPraises] = await Promise.all([
      // 받은 칭찬 조회
      supabase
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
        .eq("receiver_id", session.user.id)
        .order("created_at", { ascending: false }),

      // 보낸 칭찬 조회
      supabase
        .from("praise_messages")
        .select(`
          id,
          message,
          emoji,
          created_at,
          is_anonymous,
          receiver:users!receiver_id (
            id,
            name,
            avatar_url
          ),
          group:groups!group_id (
            id,
            name
          )
        `)
        .eq("sender_id", session.user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (receivedPraises.error) throw receivedPraises.error;
    if (sentPraises.error) throw sentPraises.error;

    return {
      receivedPraises: receivedPraises.data || [],
      sentPraises: sentPraises.data || [],
      activeTab: tab,
    };
  } catch (error) {
    console.error("칭찬 기록 로드 오류:", error);
    throw redirect(303, "/profile");
  }
};