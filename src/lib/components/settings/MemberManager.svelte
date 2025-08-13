<script lang="ts">
	import type { GroupMember } from '$lib/utils/praise'
	import { formatDateOnly } from '$lib/utils/time'

	export let members: GroupMember[]
	export let loading: boolean
	export let currentUserId: string | undefined
	export let onKickMember: (userId: string, userName: string) => void
</script>

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
								가입일: {formatDateOnly(member.joined_at)}
							</div>
						</div>
					</div>
					
					{#if member.role !== 'admin' && member.user_id !== currentUserId}
						<button
							type="button"
							on:click={() => onKickMember(member.user_id, member.user.name)}
							aria-label={`${member.user.name}님 강제 퇴출`}
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
