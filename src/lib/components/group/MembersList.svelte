<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { GroupMember } from '$lib/utils/praise'

	export let members: GroupMember[]
	export let currentUserId: string | undefined

	const dispatch = createEventDispatcher<{
		memberClick: GroupMember
	}>()

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString('ko-KR')
	}

	function handleMemberClick(member: GroupMember) {
		if (member.user_id === currentUserId) return
		dispatch('memberClick', member)
	}
</script>

<div>
	<h2 class="text-xl font-semibold mb-4">모임 멤버 ({members.length}명)</h2>
	<div class="space-y-3">
		{#each members as member (member.id)}
			<button
				on:click={() => handleMemberClick(member)}
				disabled={member.user_id === currentUserId}
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
									<span class="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
										관리자
									</span>
								{/if}
							</div>
							<div class="text-sm text-muted-foreground">
								가입일: {formatDate(member.joined_at)}
							</div>
						</div>
					</div>
					<div class="text-right">
						<div class="text-lg font-semibold">
							{member.received_praise_count || 0}
						</div>
						<div class="text-xs text-muted-foreground">받은 칭찬</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
