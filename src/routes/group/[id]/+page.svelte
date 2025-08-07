<script lang="ts">
	import { onMount } from 'svelte'
	import { getGroupMembers, getGroupPraises, sendPraise, deletePraise, canUserPraise, EMOJI_OPTIONS, type GroupMember, type PraiseMessage } from '$lib/utils/praise'
	import { leaveGroup } from '$lib/utils/members'
	import { toast } from '$lib/stores/toast'
	import { user } from '$lib/stores/auth'
	import { goto } from '$app/navigation'

	export let data

	let members: GroupMember[] = []
	let praises: PraiseMessage[] = []
	let loading = true
	let error = ''
	let showPraiseModal = false
	let selectedMember: GroupMember | null = null
	let praiseForm = {
		emoji: '👍',
		message: '',
		isPublic: true,
		isAnonymous: false
	}
	let sendingPraise = false
	let praiseError = ''

	onMount(() => {
		loadGroupData()
	})

	async function loadGroupData() {
		try {
			loading = true
			const [membersData, praisesData] = await Promise.all([
				getGroupMembers(data.group.id),
				getGroupPraises(data.group.id)
			])
			
			members = membersData
			praises = praisesData
		} catch (err) {
			error = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
		} finally {
			loading = false
		}
	}

	function openPraiseModal(member: GroupMember) {
		if (member.user_id === $user?.id) return
		
		selectedMember = member
		praiseForm = {
			emoji: '👍',
			message: '',
			isPublic: true,
			isAnonymous: false
		}
		praiseError = ''
		showPraiseModal = true
	}

	function closePraiseModal() {
		showPraiseModal = false
		selectedMember = null
		praiseError = ''
	}

	async function handleSendPraise() {
		if (!selectedMember || !$user) return

		// Check if user can praise
		const praiseCheck = await canUserPraise(data.group.id, $user.id, selectedMember.user_id)
		if (!praiseCheck.canPraise) {
			praiseError = praiseCheck.message || '칭찬을 보낼 수 없습니다.'
			return
		}

		sendingPraise = true
		praiseError = ''

		try {
			await sendPraise({
				groupId: data.group.id,
				receiverId: selectedMember.user_id,
				emoji: praiseForm.emoji,
				message: praiseForm.message || undefined,
				isPublic: praiseForm.isPublic,
				isAnonymous: praiseForm.isAnonymous
			})

			toast.success(`${selectedMember.user.name}님에게 칭찬을 보냈습니다! ${praiseForm.emoji}`)
			closePraiseModal()
			await loadGroupData() // Refresh data
		} catch (err) {
			praiseError = err instanceof Error ? err.message : '칭찬 전송에 실패했습니다.'
		} finally {
			sendingPraise = false
		}
	}

	async function handleDeletePraise(praiseId: string) {
		if (!confirm('정말로 이 칭찬을 삭제하시겠습니까?')) return

		try {
			await deletePraise(praiseId)
			await loadGroupData()
			toast.success('칭찬을 삭제했습니다.')
		} catch (err) {
			toast.error(err instanceof Error ? err.message : '칭찬 삭제에 실패했습니다.')
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString('ko-KR')
	}

	function copyInviteLink() {
		const inviteUrl = `${window.location.origin}/invite/${data.group.invite_code}`
		navigator.clipboard.writeText(inviteUrl)
		toast.success('초대 링크가 복사되었습니다!')
	}

	async function handleLeaveGroup() {
		if (!confirm('정말로 이 모임을 나가시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return

		try {
			await leaveGroup(data.group.id)
			toast.success('모임에서 나갔습니다.')
			goto('/')
		} catch (err) {
			toast.error(err instanceof Error ? err.message : '모임 나가기에 실패했습니다.')
		}
	}
</script>

<div class="container mx-auto py-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<button on:click={() => goto('/')} class="text-muted-foreground hover:text-foreground mb-2">
				← 돌아가기
			</button>
			<h1 class="text-3xl font-bold">{data.group.name}</h1>
			{#if data.group.description}
				<p class="text-muted-foreground mt-1">{data.group.description}</p>
			{/if}
		</div>
		
		<div class="flex gap-2">
			<button 
				on:click={copyInviteLink}
				class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
			>
				초대 링크 복사
			</button>
			{#if data.group.user_role === 'admin'}
				<button 
					on:click={() => goto(`/group/${data.group.id}/settings`)}
					class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
				>
					모임 설정
				</button>
			{:else}
				<button 
					on:click={handleLeaveGroup}
					class="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90"
				>
					모임 나가기
				</button>
			{/if}
		</div>
	</div>

	{#if error}
		<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-6">{error}</div>
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-muted-foreground">로딩 중...</p>
		</div>
	{:else}
		<div class="grid lg:grid-cols-2 gap-8">
			<!-- Members Section -->
			<div>
				<h2 class="text-xl font-semibold mb-4">모임 멤버 ({members.length}명)</h2>
				<div class="space-y-3">
					{#each members as member (member.id)}
						<button
							on:click={() => openPraiseModal(member)}
							disabled={member.user_id === $user?.id}
							class="w-full text-left border rounded-lg p-4 hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
											가입일: {formatDate(member.joined_at)}
										</div>
									</div>
								</div>
								<div class="text-right">
									<div class="text-lg font-semibold">{member.received_praise_count || 0}</div>
									<div class="text-xs text-muted-foreground">받은 칭찬</div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Praises Section -->
			<div>
				<h2 class="text-xl font-semibold mb-4">최근 칭찬 ({praises.length}개)</h2>
				{#if praises.length === 0}
					<div class="text-center py-12 border rounded-lg">
						<div class="text-4xl mb-2">🎉</div>
						<p class="text-muted-foreground">아직 칭찬이 없습니다.</p>
						<p class="text-muted-foreground text-sm">멤버를 클릭해서 첫 번째 칭찬을 보내보세요!</p>
					</div>
				{:else}
					<div class="space-y-4 max-h-96 overflow-y-auto">
						{#each praises as praise (praise.id)}
							<div class="border rounded-lg p-4">
								<div class="flex items-start justify-between mb-2">
									<div class="flex items-center gap-2">
										<span class="text-2xl">{praise.emoji}</span>
										<div>
											<div class="font-medium">
												{praise.is_anonymous ? '익명' : praise.sender?.name || '알 수 없음'} 
												→ {praise.receiver?.name}
											</div>
											<div class="text-xs text-muted-foreground">
												{formatDate(praise.created_at)}
												{#if !praise.is_public}
													<span class="ml-2 text-xs bg-muted px-2 py-1 rounded">비공개</span>
												{/if}
											</div>
										</div>
									</div>
									{#if praise.sender_id === $user?.id}
										<button
											on:click={() => handleDeletePraise(praise.id)}
											class="text-muted-foreground hover:text-destructive text-sm"
										>
											삭제
										</button>
									{/if}
								</div>
								{#if praise.message}
									<p class="text-sm mt-2">{praise.message}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- Praise Modal -->
{#if showPraiseModal && selectedMember}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<div class="bg-background rounded-lg p-6 w-full max-w-md">
			<h3 class="text-lg font-semibold mb-4">
				{selectedMember.user.name}님에게 칭찬 보내기
			</h3>

			<div class="space-y-4">
				<!-- Emoji Selection -->
				<fieldset>
					<legend class="block text-sm font-medium mb-2">이모지 선택</legend>
					<div class="grid grid-cols-5 gap-2" role="radiogroup" aria-label="칭찬 이모지 선택">
						{#each EMOJI_OPTIONS as emoji}
							<button
								type="button"
								on:click={() => praiseForm.emoji = emoji}
								class="text-2xl p-2 rounded border hover:bg-muted transition-colors"
								class:bg-primary={praiseForm.emoji === emoji}
								class:text-primary-foreground={praiseForm.emoji === emoji}
								role="radio"
								aria-checked={praiseForm.emoji === emoji}
								aria-label={`${emoji} 이모지 선택`}
							>
								{emoji}
							</button>
						{/each}
					</div>
				</fieldset>

				<!-- Message -->
				<div>
					<label for="message" class="block text-sm font-medium mb-2">
						칭찬 메시지 (선택사항)
					</label>
					<textarea
						id="message"
						bind:value={praiseForm.message}
						placeholder="따뜻한 칭찬 메시지를 적어주세요..."
						maxlength="500"
						rows="3"
						class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
					></textarea>
					<p class="text-xs text-muted-foreground mt-1">{praiseForm.message.length}/500자</p>
				</div>

				<!-- Options -->
				<div class="space-y-2">
					<label class="flex items-center gap-2">
						<input 
							id="isPublic"
							type="checkbox" 
							bind:checked={praiseForm.isPublic} 
							aria-describedby="public-help"
						/>
						<span class="text-sm">모든 멤버에게 공개</span>
					</label>
					<label class="flex items-center gap-2">
						<input 
							id="isAnonymous"
							type="checkbox" 
							bind:checked={praiseForm.isAnonymous} 
							aria-describedby="anonymous-help"
						/>
						<span class="text-sm">익명으로 보내기</span>
					</label>
				</div>

				{#if praiseError}
					<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{praiseError}</div>
				{/if}

				<div class="flex gap-4 pt-4">
					<button
						type="button"
						on:click={closePraiseModal}
						class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
					>
						취소
					</button>
					<button
						type="button"
						on:click={handleSendPraise}
						disabled={sendingPraise}
						class="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
					>
						{sendingPraise ? '전송 중...' : '칭찬 보내기'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}