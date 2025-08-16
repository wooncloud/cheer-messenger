<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import ProfileAvatar from '$lib/components/profile/ProfileAvatar.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: ({ receivedPraises, sentPraises, activeTab } = data)

	function changeTab(tab: 'received' | 'sent') {
		const url = new URL($page.url)
		url.searchParams.set('tab', tab)
		goto(url.toString(), { replaceState: true })
	}

	function goBack() {
		goto('/profile')
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString)
		return date.toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	function formatDateShort(dateString: string): string {
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

<svelte:head>
	<title>칭찬 기록 - Cheeract</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- 헤더 -->
	<div class="bg-white border-b border-gray-200 px-4 py-3">
		<div class="flex items-center">
			<button
				on:click={goBack}
				class="p-2 -ml-2 text-gray-600 hover:text-gray-800 transition-colors"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<h1 class="text-xl font-semibold text-gray-900 ml-2">칭찬 기록</h1>
		</div>
	</div>

	<!-- 탭 네비게이션 -->
	<div class="bg-white border-b border-gray-200">
		<div class="flex">
			<button
				on:click={() => changeTab('received')}
				class="flex-1 px-4 py-3 text-center font-medium border-b-2 transition-colors {activeTab ===
				'received'
					? 'text-blue-600 border-blue-600'
					: 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}"
			>
				받은 칭찬 ({receivedPraises.length})
			</button>
			<button
				on:click={() => changeTab('sent')}
				class="flex-1 px-4 py-3 text-center font-medium border-b-2 transition-colors {activeTab ===
				'sent'
					? 'text-blue-600 border-blue-600'
					: 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}"
			>
				보낸 칭찬 ({sentPraises.length})
			</button>
		</div>
	</div>

	<!-- 칭찬 목록 -->
	<div class="p-4">
		{#if activeTab === 'received'}
			<!-- 받은 칭찬 -->
			{#if receivedPraises.length === 0}
				<div class="text-center py-12">
					<div class="text-gray-400 mb-4">
						<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
							/>
						</svg>
					</div>
					<p class="text-gray-500 text-lg mb-2">아직 받은 칭찬이 없어요</p>
					<p class="text-gray-400 text-sm">그룹에 참여해서 활동해보세요!</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each receivedPraises as praise}
						<div class="bg-white rounded-lg shadow-sm p-4">
							<div class="flex items-start space-x-3">
								<!-- 보낸 사람 아바타 -->
								<ProfileAvatar
									avatarUrl={!praise.is_anonymous ? praise.sender?.avatar_url : null}
									name={praise.sender?.name || '익명'}
									size="sm"
								/>

								<!-- 칭찬 내용 -->
								<div class="flex-1 min-w-0">
									<div class="flex items-center space-x-2 mb-2">
										<span class="font-medium text-gray-900">
											{praise.is_anonymous ? '익명' : praise.sender?.name || '알 수 없음'}
										</span>
										<span class="text-xl">{praise.emoji}</span>
										<span class="text-xs text-gray-500 ml-auto">
											{formatDateShort(praise.created_at)}
										</span>
									</div>

									{#if praise.message}
										<p class="text-gray-700 mb-2">{praise.message}</p>
									{/if}

									<div class="flex items-center justify-between text-xs text-gray-500">
										<span>{praise.group.name}</span>
										<span>{formatDate(praise.created_at)}</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{:else}
			<!-- 보낸 칭찬 -->
			{#if sentPraises.length === 0}
				<div class="text-center py-12">
					<div class="text-gray-400 mb-4">
						<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
					</div>
					<p class="text-gray-500 text-lg mb-2">아직 보낸 칭찬이 없어요</p>
					<p class="text-gray-400 text-sm">동료들에게 칭찬을 보내보세요!</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each sentPraises as praise}
						<div class="bg-white rounded-lg shadow-sm p-4">
							<div class="flex items-start space-x-3">
								<!-- 받은 사람 아바타 -->
								<ProfileAvatar
									avatarUrl={praise.receiver?.avatar_url}
									name={praise.receiver?.name || '알 수 없음'}
									size="sm"
								/>

								<!-- 칭찬 내용 -->
								<div class="flex-1 min-w-0">
									<div class="flex items-center space-x-2 mb-2">
										<span class="font-medium text-gray-900">
											{praise.receiver?.name || '알 수 없음'}
										</span>
										<span class="text-xl">{praise.emoji}</span>
										<span class="text-xs text-gray-500 ml-auto">
											{formatDateShort(praise.created_at)}
										</span>
									</div>

									{#if praise.message}
										<p class="text-gray-700 mb-2">{praise.message}</p>
									{/if}

									<div class="flex items-center justify-between text-xs text-gray-500">
										<span>{praise.group.name}</span>
										<span>{formatDate(praise.created_at)}</span>
									</div>

									{#if praise.is_anonymous}
										<div class="mt-2">
											<span class="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
												익명으로 전송됨
											</span>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>