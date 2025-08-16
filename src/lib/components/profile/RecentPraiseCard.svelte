<script lang="ts">
	import { goto } from '$app/navigation'

	export let recentPraises: Array<{
		id: string
		message: string | null
		emoji: string
		created_at: string
		is_anonymous: boolean
		sender: {
			id: string
			name: string
			avatar_url: string | null
		} | null
		group: {
			id: string
			name: string
		}
	}>

	function goToPraiseHistory() {
		goto('/profile/praises')
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString)
		const now = new Date()
		const diffTime = Math.abs(now.getTime() - date.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

		if (diffDays === 1) {
			return '오늘'
		} else if (diffDays === 2) {
			return '어제'
		} else if (diffDays <= 7) {
			return `${diffDays - 1}일 전`
		} else {
			return date.toLocaleDateString('ko-KR', {
				month: 'short',
				day: 'numeric'
			})
		}
	}
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-lg font-semibold text-gray-900">최근 받은 칭찬</h2>
		{#if recentPraises.length > 0}
			<button
				on:click={goToPraiseHistory}
				class="text-sm text-blue-600 hover:text-blue-700 transition-colors"
			>
				전체 보기
			</button>
		{/if}
	</div>

	{#if recentPraises.length === 0}
		<div class="text-center py-8">
			<div class="text-gray-400 mb-2">
				<svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
					/>
				</svg>
			</div>
			<p class="text-gray-500 text-sm">아직 받은 칭찬이 없어요</p>
			<p class="text-gray-400 text-xs mt-1">그룹에 참여해서 활동해보세요!</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each recentPraises as praise}
				<div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
					<!-- 보낸 사람 아바타 -->
					<div
						class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
					>
						{#if !praise.is_anonymous && praise.sender?.avatar_url}
							<img
								src={praise.sender.avatar_url}
								alt={praise.sender.name}
								class="w-full h-full object-cover"
							/>
						{:else}
							<svg
								class="w-4 h-4 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						{/if}
					</div>

					<!-- 칭찬 내용 -->
					<div class="flex-1 min-w-0">
						<div class="flex items-center space-x-2 mb-1">
							<span class="text-sm font-medium text-gray-900">
								{praise.is_anonymous ? '익명' : praise.sender?.name || '알 수 없음'}
							</span>
							<span class="text-lg">{praise.emoji}</span>
							<span class="text-xs text-gray-500">{formatDate(praise.created_at)}</span>
						</div>
						{#if praise.message}
							<p class="text-sm text-gray-700 line-clamp-2">{praise.message}</p>
						{/if}
						<p class="text-xs text-gray-500 mt-1">{praise.group.name}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>