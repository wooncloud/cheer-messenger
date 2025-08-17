<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'
	import GoogleAuthButton from '$lib/components/GoogleAuthButton.svelte'

	let redirectUrl = '/dashboard'
	let errorMessage = ''

	const errorMessages: Record<string, string> = {
		oauth_cancelled: '로그인이 취소되었습니다. 다시 시도해주세요.',
		no_code: '인증 코드를 받지 못했습니다. 다시 시도해주세요.',
		exchange_failed: '로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
		no_user_data: '사용자 정보를 가져올 수 없습니다. 다시 시도해주세요.',
		unexpected_error: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
		authentication_failed: '로그인에 실패했습니다. 다시 시도해주세요.',
		timeout: '로그인 처리 시간이 초과되었습니다. 다시 시도해주세요.'
	}

	onMount(() => {
		// URL에서 redirect 파라미터 가져오기
		const redirect = $page.url.searchParams.get('redirect')
		if (redirect) {
			redirectUrl = redirect
		}

		// 에러 메시지 처리
		const error = $page.url.searchParams.get('error')
		if (error) {
			errorMessage = errorMessages[error] || '로그인 중 오류가 발생했습니다.'
			// URL에서 error 파라미터 제거 (선택사항)
			const url = new URL(window.location.href)
			url.searchParams.delete('error')
			window.history.replaceState({}, '', url.toString())
		}

		if ($user) {
			goto(redirectUrl)
		}
	})

	// 사용자 상태 변화 감지
	$: if ($user) {
		goto(redirectUrl)
	}

	// 에러 메시지 닫기
	function clearError() {
		errorMessage = ''
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Let's Cheeract together!</h1>
			<p class="text-muted-foreground mt-2">Google 계정으로 시작하세요</p>
		</div>

		<!-- 에러 메시지 표시 -->
		{#if errorMessage}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<div class="flex items-start">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-800">{errorMessage}</p>
					</div>
					<div class="ml-auto pl-3">
						<button
							on:click={clearError}
							class="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
						>
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Google 로그인 버튼 -->
		<GoogleAuthButton buttonText="Google로 로그인" redirectTo={redirectUrl} />

		<div class="text-center text-sm text-muted-foreground">
			<p>Google 계정으로 간편하게 로그인하고</p>
			<p>팀원들과 칭찬을 주고받아보세요! 🎉</p>
		</div>
	</div>
</div>