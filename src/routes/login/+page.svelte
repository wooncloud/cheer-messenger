<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'
	import GoogleAuthButton from '$lib/components/GoogleAuthButton.svelte'

	let redirectUrl = '/dashboard'

	onMount(() => {
		// URL에서 redirect 파라미터 가져오기
		const redirect = $page.url.searchParams.get('redirect')
		if (redirect) {
			redirectUrl = redirect
		}

		if ($user) {
			goto(redirectUrl)
		}
	})

	// 사용자 상태 변화 감지
	$: if ($user) {
		goto(redirectUrl)
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Let's Hwaiting together!</h1>
			<p class="text-muted-foreground mt-2">Google 계정으로 시작하세요</p>
		</div>

		<!-- Google 로그인 버튼 -->
		<GoogleAuthButton buttonText="Google로 로그인" redirectTo={redirectUrl} />

		<div class="text-center text-sm text-muted-foreground">
			<p>Google 계정으로 간편하게 로그인하고</p>
			<p>팀원들과 칭찬을 주고받아보세요! 🎉</p>
		</div>
	</div>
</div>