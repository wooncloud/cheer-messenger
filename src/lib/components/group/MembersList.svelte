<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { GroupMember } from '$lib/utils/praise'
	import { formatTimeAgo } from '$lib/utils/time'
	import { filterOtherMembers } from '$lib/utils/members'

	export let members: GroupMember[]
	export let currentUserId: string | undefined

	const dispatch = createEventDispatcher<{
		memberClick: GroupMember
	}>()

	// 본인을 제외한 멤버 목록
	$: otherMembers = filterOtherMembers(members, currentUserId)

	function handleMemberClick(member: GroupMember) {
		dispatch('memberClick', member)
	}
</script>

<div>
	<h2 class="text-xl font-semibold mb-4">모임 멤버 ({otherMembers.length}명)</h2>
	<div class="space-y-3">
		{#each otherMembers as member (member.id)}
			<button
				on:click={() => handleMemberClick(member)}
				class="w-full text-left border rounded-lg p-4 hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
							{member.user.name.charAt(0).toUpperCase()}
						</div>
						<div class="flex-1">
							<div class="font-medium flex items-center gap-2 mb-1">
								{member.user.name}
								{#if member.role === 'admin'}
									<span class="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
										관리자
									</span>
								{/if}
							</div>
							{#if member.recent_praises && member.recent_praises.length > 0}
								<div class="flex flex-wrap gap-1 max-w-xs">
									{#each member.recent_praises.slice(0, 8) as praise}
										<div 
											class="flex items-center text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 transition-colors"
											title={praise.message ? `${praise.emoji} "${praise.message}"${praise.is_anonymous ? ' - 익명' : praise.sender_name ? ` - ${praise.sender_name}님` : ''} (${formatTimeAgo(praise.created_at)})` : `${praise.emoji}${praise.is_anonymous ? ' - 익명' : praise.sender_name ? ` - ${praise.sender_name}님` : ''} (${formatTimeAgo(praise.created_at)})`}
										>
											<span class="text-sm">{praise.emoji}</span>
											{#if praise.message}
												<span class="ml-1 text-gray-600 max-w-[60px] truncate">{praise.message}</span>
											{/if}
										</div>
									{/each}
									{#if member.recent_praises.length > 8}
										<span class="text-xs text-gray-500 self-center">+{member.recent_praises.length - 8}개</span>
									{/if}
								</div>
							{:else}
								<div class="text-sm text-muted-foreground">
									아직 받은 칭찬이 없어요
								</div>
							{/if}
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
