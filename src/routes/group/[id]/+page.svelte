<script lang="ts">
  import { onMount } from "svelte";
  import {
    getGroupMembers,
    getGroupPraises,
    sendPraise,
    deletePraise,
    canUserPraise,
    type GroupMember,
    type PraiseMessage,
  } from "$lib/utils/praise";
  import { leaveGroup } from "$lib/utils/members";
  import { toast } from "$lib/stores/toast";
  import { user } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase";
  import { page } from "$app/stores";
  import LoadingState from "$lib/components/group/LoadingState.svelte";
  import GroupHeader from "$lib/components/group/GroupHeader.svelte";
  import MembersList from "$lib/components/group/MembersList.svelte";
  import PraisesList from "$lib/components/group/PraisesList.svelte";
  import PraiseModal from "$lib/components/group/PraiseModal.svelte";
  import MobileTabs from "$lib/components/group/MobileTabs.svelte";
  import MobileMembersList from "$lib/components/group/MobileMembersList.svelte";
  import MobilePraisesList from "$lib/components/group/MobilePraisesList.svelte";

  export let data;

  let members: GroupMember[] = [];
  let praises: PraiseMessage[] = [];
  let loading = true;
  let error = "";
  let showPraiseModal = false;
  let selectedMember: GroupMember | null = null;
  let sendingPraise = false;
  let praiseError = "";

  let groupDataLoaded = false;
  
  // Mobile tab state
  let activeTab = 'members';

  onMount(async () => {
    // 서버에서 인증이 필요하다고 판단한 경우
    if (data.needsAuth) {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        goto("/login");
        return;
      } else {
        // 클라이언트에서 직접 그룹 데이터를 로드
        await loadGroupDataClientSide();
        groupDataLoaded = true;
        return;
      }
    }

    // 정상적인 경우 그룹 데이터 로드
    groupDataLoaded = true;
    loadGroupData();
  });

  async function loadGroupData() {
    if (!data.group) return;

    try {
      loading = true;
      const [membersData, praisesData] = await Promise.all([
        getGroupMembers(data.group.id),
        getGroupPraises(data.group.id),
      ]);

      members = membersData;
      praises = praisesData;
    } catch (err) {
      error =
        err instanceof Error
          ? err.message
          : "데이터를 불러오는데 실패했습니다.";
    } finally {
      loading = false;
    }
  }

  async function loadGroupDataClientSide() {
    try {
      loading = true;
      const groupId = data.groupId || $page.params.id;

      if (!groupId) {
        throw new Error("그룹 ID를 찾을 수 없습니다.");
      }

      // 클라이언트에서 직접 그룹 정보 가져오기
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .select(
          `
					*,
					owner:users!groups_owner_id_fkey(name, email)
				`
        )
        .eq("id", groupId)
        .single();

      if (groupError) {
        throw new Error("그룹을 찾을 수 없습니다.");
      }

      // 현재 사용자의 멤버십 확인
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("로그인이 필요합니다.");
      }

      const { data: membership } = await supabase
        .from("group_members")
        .select("role, is_active")
        .eq("group_id", groupId)
        .eq("user_id", sessionData.session.user.id)
        .single();

      if (!membership || !membership.is_active) {
        throw new Error("이 모임의 멤버가 아닙니다.");
      }

      // 그룹 데이터 설정 (any 타입으로 우회)
      (data as any).group = {
        ...groupData,
        user_role: membership.role,
      };

      // 멤버와 칭찬 데이터 로드
      const [membersData, praisesData] = await Promise.all([
        getGroupMembers(groupId),
        getGroupPraises(groupId),
      ]);

      members = membersData;
      praises = praisesData;
    } catch (err) {
      console.error("Client side group load error:", err);
      error =
        err instanceof Error
          ? err.message
          : "데이터를 불러오는데 실패했습니다.";
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => goto("/"), 3000);
    } finally {
      loading = false;
    }
  }

  function handleMemberClick(member: GroupMember) {
    selectedMember = member;
    praiseError = "";
    showPraiseModal = true;
  }

  function handleClosePraiseModal() {
    showPraiseModal = false;
    selectedMember = null;
    praiseError = "";
  }

  async function handleSendPraise(event: CustomEvent<{
    emoji: string;
    message?: string;
    isPublic: boolean;
    isAnonymous: boolean;
  }>) {
    if (!selectedMember || !$user || !data.group) return;

    const { emoji, message, isPublic, isAnonymous } = event.detail;

    // Check if user can praise
    const praiseCheck = await canUserPraise(
      data.group.id,
      $user.id,
      selectedMember.user_id
    );
    if (!praiseCheck.canPraise) {
      praiseError = praiseCheck.message || "칭찬을 보낼 수 없습니다.";
      return;
    }

    sendingPraise = true;
    praiseError = "";

    try {
      await sendPraise({
        groupId: data.group.id,
        receiverId: selectedMember.user_id,
        emoji,
        message,
        isPublic,
        isAnonymous,
      });

      toast.success(
        `${selectedMember.user.name}님에게 칭찬을 보냈습니다! ${emoji}`
      );
      handleClosePraiseModal();
      await loadGroupData(); // Refresh data
    } catch (err) {
      praiseError =
        err instanceof Error ? err.message : "칭찬 전송에 실패했습니다.";
    } finally {
      sendingPraise = false;
    }
  }

  async function handleDeletePraise(event: CustomEvent<string>) {
    const praiseId = event.detail;
    if (!confirm("정말로 이 칭찬을 삭제하시겠습니까?")) return;

    try {
      await deletePraise(praiseId);
      await loadGroupData();
      toast.success("칭찬을 삭제했습니다.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "칭찬 삭제에 실패했습니다."
      );
    }
  }

  function handleCopyInvite() {
    if (!data.group) return;
    const inviteUrl = `${window.location.origin}/invite/${data.group.invite_code}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success("초대 링크가 복사되었습니다!");
  }

  async function handleLeaveGroup() {
    if (
      !data.group ||
      !confirm("정말로 이 모임을 나가시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    )
      return;

    try {
      await leaveGroup(data.group.id);
      toast.success("모임에서 나갔습니다.");
      goto("/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "모임 나가기에 실패했습니다."
      );
    }
  }
</script>

<div class="container mx-auto p-4">
  {#if !groupDataLoaded || !data.group}
    <LoadingState message="그룹 정보를 불러오는 중..." />
  {:else}
    <GroupHeader 
      group={data.group} 
      on:copyInvite={handleCopyInvite}
      on:leaveGroup={handleLeaveGroup}
    />

    {#if error}
      <div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-6">
        {error}
      </div>
    {/if}

    {#if loading}
      <LoadingState />
    {:else}
      <!-- Desktop Layout (lg and above) -->
      <div class="hidden lg:grid lg:grid-cols-2 gap-8">
        <MembersList 
          {members} 
          on:memberClick={(e) => handleMemberClick(e.detail)}
        />
        
        <PraisesList 
          {praises} 
          currentUserId={$user?.id}
          on:deletePraise={handleDeletePraise}
        />
      </div>
      
      <!-- Mobile Layout (below lg) -->
      <div class="lg:hidden">
        <MobileTabs 
          tabs={[
            { id: 'members', label: '멤버', count: members.length },
            { id: 'praises', label: '칭찬', count: praises.length }
          ]}
          {activeTab}
          on:tabChange={(e) => activeTab = e.detail}
        >
          <div class="tab-panel {activeTab === 'members' ? 'active' : ''}">
            <MobileMembersList 
              {members} 
              on:memberClick={(e) => handleMemberClick(e.detail)}
            />
          </div>
          
          <div class="tab-panel {activeTab === 'praises' ? 'active' : ''}">
            <MobilePraisesList 
              {praises} 
              currentUserId={$user?.id}
              on:deletePraise={handleDeletePraise}
            />
          </div>
        </MobileTabs>
      </div>
    {/if}
  {/if}

  <PraiseModal 
    show={showPraiseModal}
    {selectedMember}
    {sendingPraise}
    {praiseError}
    on:close={handleClosePraiseModal}
    on:send={handleSendPraise}
  />
</div>
