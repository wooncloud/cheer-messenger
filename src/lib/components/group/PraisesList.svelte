<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { PraiseMessage } from '$lib/utils/praise'

	export let praises: PraiseMessage[]
	export let currentUserId: string | undefined

	const dispatch = createEventDispatcher<{
		deletePraise: string
	}>()

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString('ko-KR')
	}

	function handleDeletePraise(praiseId: string) {
		dispatch('deletePraise', praiseId)
	}
</script>

<div>
	<h2 class="text-xl font-semibold mb-4">최근 칭찬 ({praises.length}개)</h2>
	{#if praises.length === 0}
		<div class="text-center py-12 border rounded-lg">
			<div class="text-4xl mb-2">🎉</div>
			<p class="text-muted-foreground">아직 칭찬이 없습니다.</p>
			<p class="text-muted-foreground text-sm">
				멤버를 클릭해서 첫 번째 칭찬을 보내보세요!
			</p>
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
						{#if praise.sender_id === currentUserId}
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
