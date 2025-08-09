<script lang="ts">
  import { onMount } from "svelte";
  import { regenerateInviteCode } from "$lib/utils/groups";
  import { getGroupMembers, type GroupMember } from "$lib/utils/praise";
  import {
    kickMember,
    transferAdminRole,
    deleteGroup,
  } from "$lib/utils/members";
  import { supabase } from "$lib/supabase";
  import { toast } from "$lib/stores/toast";
  import { goto } from "$app/navigation";
  import { user } from "$lib/stores/auth";
  import { page } from "$app/stores";

  // 컴포넌트 imports
  import GroupBasicSettings from "$lib/components/settings/GroupBasicSettings.svelte";
  import PraiseCooldownSettings from "$lib/components/settings/PraiseCooldownSettings.svelte";
  import InviteLinkManager from "$lib/components/settings/InviteLinkManager.svelte";
  import MemberManager from "$lib/components/settings/MemberManager.svelte";
  import AdminTransfer from "$lib/components/settings/AdminTransfer.svelte";
  import DangerZone from "$lib/components/settings/DangerZone.svelte";
  import ConfirmModal from "$lib/components/settings/ConfirmModal.svelte";

  export let data;

  let members: GroupMember[] = [];
  let loading = true;
  let error = "";

  // Group settings (초기값은 빈 값으로 설정)
  let groupName = "";
  let groupDescription = "";
  let maxMembers = 50;
  let cooldownValue = 1;
  let cooldownUnit = "day";
  let inviteCode = "";

  let groupDataLoaded = false;

  // UI states
  let savingSettings = false;
  let regeneratingInvite = false;
  let showDeleteConfirm = false;
  let showTransferConfirm = false;
  let selectedNewAdmin = "";

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

    // 정상적인 경우 그룹 데이터 설정
    if (data.group) {
      groupName = data.group.name;
      groupDescription = data.group.description || "";
      maxMembers = data.group.max_members;
      cooldownValue = data.group.praise_cooldown_value;
      cooldownUnit = data.group.praise_cooldown_unit;
      inviteCode = data.group.invite_code;
      groupDataLoaded = true;
    }

    loadMembers();
  });

  async function loadGroupDataClientSide() {
    try {
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

      // 현재 사용자의 멤버십 확인 (관리자 권한 체크)
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

      if (!membership || !membership.is_active || membership.role !== "admin") {
        throw new Error("관리자 권한이 필요합니다.");
      }

      // 그룹 데이터 설정
      (data as any).group = {
        ...groupData,
        user_role: membership.role,
      };

      // UI 변수 설정
      groupName = groupData.name;
      groupDescription = groupData.description || "";
      maxMembers = groupData.max_members;
      cooldownValue = groupData.praise_cooldown_value;
      cooldownUnit = groupData.praise_cooldown_unit;
      inviteCode = groupData.invite_code;
    } catch (err) {
      console.error("Client side group load error:", err);
      error =
        err instanceof Error
          ? err.message
          : "데이터를 불러오는데 실패했습니다.";
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => goto("/"), 3000);
    }
  }

  async function loadMembers() {
    if (!data.group && !groupDataLoaded) return;

    try {
      loading = true;
      const groupId = data.group?.id || data.groupId || $page.params.id;
      if (groupId) {
        members = await getGroupMembers(groupId);
      }
    } catch (err) {
      error =
        err instanceof Error
          ? err.message
          : "멤버 목록을 불러오는데 실패했습니다.";
    } finally {
      loading = false;
    }
  }

  async function handleSaveSettings() {
    if (!groupName.trim()) {
      error = "모임 이름을 입력해주세요.";
      return;
    }

    if (groupName.length > 100) {
      error = "모임 이름은 100자를 초과할 수 없습니다.";
      return;
    }

    if (groupDescription.length > 500) {
      error = "모임 설명은 500자를 초과할 수 없습니다.";
      return;
    }

    if (maxMembers < 2 || maxMembers > 1000) {
      error = "최대 인원은 2명 이상 1000명 이하여야 합니다.";
      return;
    }

    savingSettings = true;
    error = "";

    try {
      const groupId = data.group?.id || data.groupId || $page.params.id;
      if (!groupId) {
        throw new Error("그룹 ID를 찾을 수 없습니다.");
      }

      if (!$user?.id) {
        throw new Error("사용자 인증 정보를 찾을 수 없습니다.");
      }

      const { error: updateError } = await supabase
        .from("groups")
        .update({
          name: groupName.trim(),
          description: groupDescription.trim() || null,
          max_members: maxMembers,
          praise_cooldown_value: cooldownValue,
          praise_cooldown_unit: cooldownUnit,
        })
        .eq("id", groupId)
        .eq("owner_id", $user.id);

      if (updateError) throw updateError;

      toast.success("설정이 성공적으로 저장되었습니다.");
    } catch (err) {
      error = err instanceof Error ? err.message : "설정 저장에 실패했습니다.";
    } finally {
      savingSettings = false;
    }
  }

  async function handleRegenerateInvite() {
    regeneratingInvite = true;
    error = "";

    try {
      const groupId = data.group?.id || data.groupId || $page.params.id;
      if (!groupId) throw new Error("그룹 ID를 찾을 수 없습니다.");

      const newCode = await regenerateInviteCode(groupId);
      inviteCode = newCode;
      toast.success("초대 링크가 새로 생성되었습니다.");
    } catch (err) {
      error =
        err instanceof Error ? err.message : "초대 링크 재생성에 실패했습니다.";
    } finally {
      regeneratingInvite = false;
    }
  }

  async function handleKickMember(userId: string, userName: string) {
    if (!confirm(`정말로 ${userName}님을 강제 퇴출하시겠습니까?`)) return;

    try {
      const groupId = data.group?.id || data.groupId || $page.params.id;
      if (!groupId) throw new Error("그룹 ID를 찾을 수 없습니다.");

      await kickMember(groupId, userId);
      await loadMembers();
      toast.success(`${userName}님이 모임에서 퇴출되었습니다.`);
    } catch (err) {
      error = err instanceof Error ? err.message : "멤버 퇴출에 실패했습니다.";
    }
  }

  async function handleTransferAdmin() {
    if (!selectedNewAdmin) {
      error = "관리자로 임명할 멤버를 선택해주세요.";
      return;
    }

    const newAdminMember = members.find((m) => m.user_id === selectedNewAdmin);
    if (!newAdminMember) return;

    try {
      const groupId = data.group?.id || data.groupId || $page.params.id;
      if (!groupId) throw new Error("그룹 ID를 찾을 수 없습니다.");

      await transferAdminRole(groupId, selectedNewAdmin);
      toast.success(
        `${newAdminMember.user.name}님에게 관리자 권한을 위임했습니다.`
      );

      setTimeout(() => {
        goto(`/group/${groupId}`);
      }, 2000);
    } catch (err) {
      error =
        err instanceof Error ? err.message : "관리자 권한 위임에 실패했습니다.";
    }

    showTransferConfirm = false;
  }

  async function handleDeleteGroup() {
    try {
      const groupId = data.group?.id || data.groupId || $page.params.id;
      if (!groupId) throw new Error("그룹 ID를 찾을 수 없습니다.");

      await deleteGroup(groupId);
      toast.success("모임이 삭제되었습니다.");
      goto("/");
    } catch (err) {
      error = err instanceof Error ? err.message : "모임 삭제에 실패했습니다.";
    }

    showDeleteConfirm = false;
  }
</script>

<div class="container mx-auto py-6 max-w-4xl">
  {#if !groupDataLoaded || (!data.group && !data.needsAuth)}
    <!-- 초기 로딩 상태 -->
    <div class="text-center py-12">
      <div
        class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-muted-foreground">설정을 불러오는 중...</p>
    </div>
  {:else}
    <!-- Header -->
    <div class="mb-6">
      <button
        on:click={() =>
          goto(`/group/${data.group?.id || data.groupId || $page.params.id}`)}
        class="text-muted-foreground hover:text-foreground mb-4"
      >
        ← 모임으로 돌아가기
      </button>
      <h1 class="text-3xl font-bold">모임 설정</h1>
      <p class="text-muted-foreground mt-1">
        관리자만 모임 설정을 변경할 수 있습니다
      </p>
    </div>

    {#if error}
      <div
        class="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-6"
      >
        {error}
      </div>
    {/if}

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 기본 설정 -->
      <div class="space-y-6">
        <GroupBasicSettings
          bind:groupName
          bind:groupDescription
          bind:maxMembers
          membersCount={members.length}
          {savingSettings}
          onSave={handleSaveSettings}
        />

        <PraiseCooldownSettings bind:cooldownValue bind:cooldownUnit />

        <InviteLinkManager
          {inviteCode}
          {regeneratingInvite}
          onRegenerate={handleRegenerateInvite}
        />
      </div>

      <!-- 멤버 관리 -->
      <div class="space-y-6">
        <MemberManager
          {members}
          {loading}
          currentUserId={$user?.id}
          onKickMember={handleKickMember}
        />

        {#if data.group?.owner_id === $user?.id}
          <AdminTransfer
            {members}
            bind:selectedNewAdmin
            onTransfer={() => (showTransferConfirm = true)}
          />

          <DangerZone onDelete={() => (showDeleteConfirm = true)} />
        {/if}
      </div>
    </div>
  {/if}
</div>

<!-- 모달들 -->
<ConfirmModal
  show={showTransferConfirm}
  title="관리자 권한 위임 확인"
  message={`정말로 ${members.find((m) => m.user_id === selectedNewAdmin)?.user.name}님에게 관리자 권한을 위임하시겠습니까? 이 작업을 실행하면 당신은 일반 멤버가 되며, 되돌릴 수 없습니다.`}
  confirmText="권한 위임"
  confirmClass="bg-amber-600 text-white hover:bg-amber-700"
  onConfirm={handleTransferAdmin}
  onCancel={() => (showTransferConfirm = false)}
/>

<ConfirmModal
  show={showDeleteConfirm}
  title="모임 삭제 확인"
  message="정말로 이 모임을 삭제하시겠습니까? 모든 멤버, 칭찬 메시지, 설정이 영구적으로 삭제되며 이 작업은 되돌릴 수 없습니다."
  confirmText="모임 삭제"
  confirmClass="bg-destructive text-destructive-foreground hover:bg-destructive/90"
  onConfirm={handleDeleteGroup}
  onCancel={() => (showDeleteConfirm = false)}
/>
