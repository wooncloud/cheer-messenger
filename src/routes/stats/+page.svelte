<script lang="ts">
	import PraiseStatsCard from '$lib/components/profile/PraiseStatsCard.svelte'
	import RecentPraiseCard from '$lib/components/profile/RecentPraiseCard.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: ({ praiseStats, recentPraises, error } = data)
</script>

<svelte:head>
	<title>칭찬 통계 - Cheeract</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-4 space-y-6">
	{#if error}
		<!-- 에러 상태 표시 -->
		<div class="bg-red-50 border border-red-200 rounded-lg p-6">
			<div class="flex items-center space-x-3 mb-4">
				<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
				<h2 class="text-lg font-semibold text-red-800">통계 로드 오류</h2>
			</div>
			<p class="text-red-700 mb-4">다음 오류가 발생했습니다:</p>
			<code class="bg-red-100 text-red-800 p-2 rounded block text-sm">{error}</code>
			<p class="text-red-600 text-sm mt-4">브라우저 개발자 도구 콘솔에서 자세한 로그를 확인하세요.</p>
			<button 
				on:click={() => window.location.reload()} 
				class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
			>
				새로고침
			</button>
		</div>
	{:else}
		<!-- 페이지 헤더 -->
		<div class="bg-white rounded-lg shadow-sm p-6">
			<h1 class="text-2xl font-bold text-gray-900">칭찬 통계</h1>
			<p class="text-gray-600 text-sm mt-1">나의 칭찬 활동을 한눈에 확인해보세요</p>
		</div>

		<!-- 칭찬 통계 -->
		<PraiseStatsCard 
			sentCount={praiseStats?.sentCount || 0} 
			receivedCount={praiseStats?.receivedCount || 0} 
		/>

		<!-- 최근 받은 칭찬 -->
		<RecentPraiseCard recentPraises={recentPraises || []} />
	{/if}
</div>