<script lang="ts">
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'
	import GoogleAuthButton from '$lib/components/GoogleAuthButton.svelte'

	onMount(() => {
		if ($user) {
			goto('/dashboard')
		}
	})
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Cheer Messenger</h1>
			<p class="text-muted-foreground mt-2">Google 계정으로 시작하세요</p>
		</div>

		<!-- Google 로그인 버튼 -->
		<GoogleAuthButton buttonText="Google로 로그인" />

		<div class="text-center text-sm text-muted-foreground">
			<p>Google 계정으로 간편하게 로그인하고</p>
			<p>팀원들과 칭찬을 주고받아보세요! 🎉</p>
		</div>
	</div>
</div>