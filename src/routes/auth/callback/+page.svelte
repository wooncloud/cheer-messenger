<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte'

	let loading = true
	let error = ''

	const errorMessages: Record<string, string> = {
		oauth_cancelled: '로그인이 취소되었습니다.',
		no_code: '인증 코드를 받지 못했습니다.',
		exchange_failed: '로그인 처리 중 오류가 발생했습니다.',
		no_user_data: '사용자 정보를 가져올 수 없습니다.',
		unexpected_error: '예상치 못한 오류가 발생했습니다.',
		authentication_failed: 'Google 로그인에 실패했습니다.'
	}

	onMount(() => {
		// 서버에서 콜백 처리가 완료되지 않았거나 에러가 있을 경우
		const urlError = $page.url.searchParams.get('error')
		
		if (urlError) {
			error = errorMessages[urlError] || '로그인 처리 중 문제가 발생했습니다.'
			loading = false
			
			// 3초 후 로그인 페이지로 리다이렉트
			setTimeout(() => goto(`/login?error=${urlError}`), 3000)
		} else {
			// 정상적인 경우 서버 콜백 핸들러가 리다이렉트 처리
			// 하지만 만약 여기에 도달했다면 예상치 못한 상황
			setTimeout(() => {
				if (loading) {
					error = '로그인 처리 중 문제가 발생했습니다.'
					loading = false
					setTimeout(() => goto('/login?error=timeout'), 3000)
				}
			}, 5000) // 5초 타임아웃
		}
	})
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md p-8 text-center">
		{#if loading}
			<div class="space-y-6">
				<div class="text-6xl mb-4">🔄</div>
				<h1 class="text-2xl font-bold">로그인 처리 중...</h1>
				<p class="text-muted-foreground">잠시만 기다려주세요</p>
				
				<div class="flex justify-center">
					<LoadingSpinner size="md" />
				</div>
			</div>
		{:else if error}
			<div class="space-y-6">
				<div class="text-6xl mb-4">⚠️</div>
				<h1 class="text-2xl font-bold text-destructive">로그인 실패</h1>
				
				<div class="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
					<p class="text-destructive text-sm">{error}</p>
				</div>

				<p class="text-muted-foreground text-sm">
					3초 후 자동으로 로그인 페이지로 이동합니다...
				</p>

				<a 
					href="/login" 
					class="inline-block bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
				>
					지금 로그인 페이지로 이동
				</a>
			</div>
		{/if}
	</div>
</div>