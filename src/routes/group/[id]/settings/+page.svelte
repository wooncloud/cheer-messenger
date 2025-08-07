<script lang="ts">
	import { onMount } from 'svelte'
	import { regenerateInviteCode } from '$lib/utils/groups'
	import { getGroupMembers, type GroupMember } from '$lib/utils/praise'
	import { kickMember, transferAdminRole, deleteGroup } from '$lib/utils/members'
	import { supabase } from '$lib/supabase'
	import { toast } from '$lib/stores/toast'
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'

	export let data

	let members: GroupMember[] = []
	let loading = true
	let error = ''

	// Group settings
	let groupName = data.group.name
	let groupDescription = data.group.description || ''
	let maxMembers = data.group.max_members
	let cooldownValue = data.group.praise_cooldown_value
	let cooldownUnit = data.group.praise_cooldown_unit
	let inviteCode = data.group.invite_code

	// UI states
	let savingSettings = false
	let regeneratingInvite = false
	let showDeleteConfirm = false
	let showTransferConfirm = false
	let selectedNewAdmin = ''

	const cooldownUnits = [
		{ value: 'none', label: '제한 없음' },
		{ value: 'second', label: '초' },
		{ value: 'minute', label: '분' },
		{ value: 'hour', label: '시간' },
		{ value: 'day', label: '일' },
		{ value: 'week', label: '주' },
		{ value: 'month', label: '월' },
		{ value: 'year', label: '년' }
	]

	onMount(() => {
		loadMembers()
	})

	async function loadMembers() {
		try {
			loading = true
			members = await getGroupMembers(data.group.id)
		} catch (err) {
			error = err instanceof Error ? err.message : '멤버 목록을 불러오는데 실패했습니다.'
		} finally {
			loading = false
		}
	}

	async function handleSaveSettings() {
		if (!groupName.trim()) {
			error = '모임 이름을 입력해주세요.'
			return
		}

		if (groupName.length > 100) {
			error = '모임 이름은 100자를 초과할 수 없습니다.'
			return
		}

		if (groupDescription.length > 500) {
			error = '모임 설명은 500자를 초과할 수 없습니다.'
			return
		}

		if (maxMembers < 2 || maxMembers > 1000) {
			error = '최대 인원은 2명 이상 1000명 이하여야 합니다.'
			return
		}

		savingSettings = true
		error = ''

		try {
			const { error: updateError } = await supabase
				.from('groups')
				.update({
					name: groupName.trim(),
					description: groupDescription.trim() || null,
					max_members: maxMembers,
					praise_cooldown_value: cooldownValue,
					praise_cooldown_unit: cooldownUnit
				})
				.eq('id', data.group.id)
				.eq('owner_id', $user?.id)

			if (updateError) throw updateError

			toast.success('설정이 성공적으로 저장되었습니다.')
		} catch (err) {
			error = err instanceof Error ? err.message : '설정 저장에 실패했습니다.'
		} finally {
			savingSettings = false
		}
	}

	async function handleRegenerateInvite() {
		regeneratingInvite = true
		error = ''

		try {
			const newCode = await regenerateInviteCode(data.group.id)
			inviteCode = newCode
			toast.success('초대 링크가 새로 생성되었습니다.')
		} catch (err) {
			error = err instanceof Error ? err.message : '초대 링크 재생성에 실패했습니다.'
		} finally {
			regeneratingInvite = false
		}
	}

	async function handleKickMember(userId: string, userName: string) {
		if (!confirm(`정말로 ${userName}님을 강제 퇴출하시겠습니까?`)) return

		try {
			await kickMember(data.group.id, userId)
			await loadMembers()
			toast.success(`${userName}님이 모임에서 퇴출되었습니다.`)
		} catch (err) {
			error = err instanceof Error ? err.message : '멤버 퇴출에 실패했습니다.'
		}
	}

	async function handleTransferAdmin() {
		if (!selectedNewAdmin) {
			error = '관리자로 임명할 멤버를 선택해주세요.'
			return
		}

		const newAdminMember = members.find(m => m.user_id === selectedNewAdmin)
		if (!newAdminMember) return

		try {
			await transferAdminRole(data.group.id, selectedNewAdmin)
			toast.success(`${newAdminMember.user.name}님에게 관리자 권한을 위임했습니다.`)
			
			setTimeout(() => {
				goto(`/group/${data.group.id}`)
			}, 2000)
		} catch (err) {
			error = err instanceof Error ? err.message : '관리자 권한 위임에 실패했습니다.'
		}

		showTransferConfirm = false
	}

	async function handleDeleteGroup() {
		try {
			await deleteGroup(data.group.id)
			toast.success('모임이 삭제되었습니다.')
			goto('/')
		} catch (err) {
			error = err instanceof Error ? err.message : '모임 삭제에 실패했습니다.'
		}

		showDeleteConfirm = false
	}

	function copyInviteLink() {
		const inviteUrl = `${window.location.origin}/invite/${inviteCode}`
		navigator.clipboard.writeText(inviteUrl)
		toast.success('초대 링크가 복사되었습니다!')
	}
</script>

<div class="container mx-auto py-6 max-w-4xl">
	<!-- Header -->
	<div class="mb-6">
		<button on:click={() => goto(`/group/${data.group.id}`)} class="text-muted-foreground hover:text-foreground mb-4">
			← 모임으로 돌아가기
		</button>
		<h1 class="text-3xl font-bold">모임 설정</h1>
		<p class="text-muted-foreground mt-1">관리자만 모임 설정을 변경할 수 있습니다</p>
	</div>


	{#if error}
		<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-6">{error}</div>
	{/if}

	<div class="grid lg:grid-cols-2 gap-8">
		<!-- 기본 설정 -->
		<div class="space-y-6">
			<div class="border rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">기본 정보</h2>
				
				<div class="space-y-4">
					<div>
						<label for="groupName" class="block text-sm font-medium mb-2">모임 이름</label>
						<input
							id="groupName"
							type="text"
							bind:value={groupName}
							maxlength="100"
							class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<p class="text-sm text-muted-foreground mt-1">{groupName.length}/100자</p>
					</div>

					<div>
						<label for="groupDescription" class="block text-sm font-medium mb-2">모임 설명</label>
						<textarea
							id="groupDescription"
							bind:value={groupDescription}
							maxlength="500"
							rows="3"
							class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
						></textarea>
						<p class="text-sm text-muted-foreground mt-1">{groupDescription.length}/500자</p>
					</div>

					<div>
						<label for="maxMembers" class="block text-sm font-medium mb-2">최대 인원</label>
						<input
							id="maxMembers"
							type="number"
							bind:value={maxMembers}
							min="2"
							max="1000"
							class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<p class="text-sm text-muted-foreground mt-1">현재 멤버: {members.length}명</p>
					</div>

					<button
						on:click={handleSaveSettings}
						disabled={savingSettings}
						class="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
					>
						{savingSettings ? '저장 중...' : '설정 저장'}
					</button>
				</div>
			</div>

			<!-- 칭찬 쿨타임 설정 -->
			<div class="border rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">칭찬 쿨타임</h2>
				
				<div class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="cooldownValue" class="block text-sm font-medium mb-2">쿨타임 값</label>
							<input
								id="cooldownValue"
								type="number"
								bind:value={cooldownValue}
								min="0"
								disabled={cooldownUnit === 'none'}
								class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
							/>
						</div>
						<div>
							<label for="cooldownUnit" class="block text-sm font-medium mb-2">단위</label>
							<select
								id="cooldownUnit"
								bind:value={cooldownUnit}
								class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
							>
								{#each cooldownUnits as unit}
									<option value={unit.value}>{unit.label}</option>
								{/each}
							</select>
						</div>
					</div>
					
					<p class="text-sm text-muted-foreground">
						{#if cooldownUnit === 'none'}
							칭찬에 제한이 없습니다.
						{:else}
							같은 사람에게 칭찬을 보낸 후 {cooldownValue} {cooldownUnits.find(u => u.value === cooldownUnit)?.label} 동안 대기해야 합니다.
						{/if}
					</p>
				</div>
			</div>

			<!-- 초대 링크 관리 -->
			<div class="border rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">초대 링크</h2>
				
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2">현재 초대 링크</label>
						<div class="flex gap-2">
							<input
								type="text"
								value={`${window.location.origin}/invite/${inviteCode}`}
								readonly
								class="flex-1 px-3 py-2 border border-input rounded-md bg-muted"
							/>
							<button
								on:click={copyInviteLink}
								class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
							>
								복사
							</button>
						</div>
					</div>

					<button
						on:click={handleRegenerateInvite}
						disabled={regeneratingInvite}
						class="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 disabled:opacity-50"
					>
						{regeneratingInvite ? '생성 중...' : '새 초대 링크 생성'}
					</button>
					
					<p class="text-sm text-muted-foreground">
						새 초대 링크를 생성하면 기존 링크는 사용할 수 없게 됩니다.
					</p>
				</div>
			</div>
		</div>

		<!-- 멤버 관리 -->
		<div class="space-y-6">
			<div class="border rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">멤버 관리 ({members.length}명)</h2>
				
				{#if loading}
					<div class="text-center py-4">
						<div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
						<p class="text-muted-foreground text-sm">로딩 중...</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each members as member (member.id)}
							<div class="flex items-center justify-between p-3 border rounded-lg">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
										{member.user.name.charAt(0).toUpperCase()}
									</div>
									<div>
										<div class="font-medium flex items-center gap-2">
											{member.user.name}
											{#if member.role === 'admin'}
												<span class="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">관리자</span>
											{/if}
										</div>
										<div class="text-sm text-muted-foreground">
											가입일: {new Date(member.joined_at).toLocaleDateString('ko-KR')}
										</div>
									</div>
								</div>
								
								{#if member.role !== 'admin' && member.user_id !== $user?.id}
									<button
										on:click={() => handleKickMember(member.user_id, member.user.name)}
										class="text-destructive hover:text-destructive/80 text-sm"
									>
										강제 퇴출
									</button>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- 관리자 권한 위임 -->
			{#if data.group.owner_id === $user?.id}
				<div class="border rounded-lg p-6">
					<h2 class="text-xl font-semibold mb-4">관리자 권한 위임</h2>
					
					<div class="space-y-4">
						<div>
							<label for="newAdmin" class="block text-sm font-medium mb-2">새 관리자 선택</label>
							<select
								id="newAdmin"
								bind:value={selectedNewAdmin}
								class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="">멤버를 선택하세요</option>
								{#each members.filter(m => m.role !== 'admin') as member}
									<option value={member.user_id}>{member.user.name}</option>
								{/each}
							</select>
						</div>

						<button
							on:click={() => showTransferConfirm = true}
							disabled={!selectedNewAdmin}
							class="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 disabled:opacity-50"
						>
							관리자 권한 위임
						</button>
						
						<p class="text-sm text-muted-foreground">
							권한을 위임하면 당신은 일반 멤버가 되며, 새 관리자가 모임을 관리하게 됩니다.
						</p>
					</div>
				</div>

				<!-- 모임 삭제 -->
				<div class="border border-destructive rounded-lg p-6">
					<h2 class="text-xl font-semibold text-destructive mb-4">위험 구역</h2>
					
					<div class="space-y-4">
						<p class="text-sm text-muted-foreground">
							모임을 삭제하면 모든 데이터(멤버, 칭찬 메시지 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
						</p>

						<button
							on:click={() => showDeleteConfirm = true}
							class="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded-md hover:bg-destructive/90"
						>
							모임 삭제
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- 관리자 권한 위임 확인 모달 -->
{#if showTransferConfirm}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<div class="bg-background rounded-lg p-6 w-full max-w-md">
			<h3 class="text-lg font-semibold mb-4">관리자 권한 위임 확인</h3>
			<p class="text-sm text-muted-foreground mb-6">
				정말로 {members.find(m => m.user_id === selectedNewAdmin)?.user.name}님에게 관리자 권한을 위임하시겠습니까? 
				이 작업을 실행하면 당신은 일반 멤버가 되며, 되돌릴 수 없습니다.
			</p>
			<div class="flex gap-4">
				<button
					on:click={() => showTransferConfirm = false}
					class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
				>
					취소
				</button>
				<button
					on:click={handleTransferAdmin}
					class="flex-1 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700"
				>
					권한 위임
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- 모임 삭제 확인 모달 -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<div class="bg-background rounded-lg p-6 w-full max-w-md">
			<h3 class="text-lg font-semibold text-destructive mb-4">모임 삭제 확인</h3>
			<p class="text-sm text-muted-foreground mb-6">
				정말로 이 모임을 삭제하시겠습니까? 모든 멤버, 칭찬 메시지, 설정이 영구적으로 삭제되며 이 작업은 되돌릴 수 없습니다.
			</p>
			<div class="flex gap-4">
				<button
					on:click={() => showDeleteConfirm = false}
					class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
				>
					취소
				</button>
				<button
					on:click={handleDeleteGroup}
					class="flex-1 bg-destructive text-destructive-foreground py-2 px-4 rounded-md hover:bg-destructive/90"
				>
					모임 삭제
				</button>
			</div>
		</div>
	</div>
{/if}