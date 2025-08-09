<script lang="ts">
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'
	import { signInWithGoogle } from '$lib/utils/auth'

	let googleLoading = false
	let error = ''

	onMount(() => {
		if ($user) {
			goto('/')
		}
	})

	async function handleGoogleLogin() {
		googleLoading = true
		error = ''

		try {
			await signInWithGoogle('/')
		} catch (authError: any) {
			error = authError.message
			googleLoading = false
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Cheer Messenger</h1>
			<p class="text-muted-foreground mt-2">Google 계정으로 시작하세요</p>
		</div>

		<!-- Google 로그인 버튼 -->
		<div class="space-y-4">
			<button
				type="button"
				on:click={handleGoogleLogin}
				disabled={googleLoading}
				class="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-input rounded-lg bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors shadow-sm"
			>
				{#if googleLoading}
					<div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
					<span class="font-medium">Google 로그인 중...</span>
				{:else}
					<svg class="w-6 h-6" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					<span class="font-medium">Google로 로그인</span>
				{/if}
			</button>

			{#if error}
				<div class="text-destructive text-sm text-center p-3 bg-destructive/10 rounded-md border border-destructive/20">
					{error}
				</div>
			{/if}
		</div>

		<div class="text-center text-sm text-muted-foreground">
			<p>Google 계정으로 간편하게 로그인하고</p>
			<p>팀원들과 칭찬을 주고받아보세요! 🎉</p>
		</div>
	</div>
</div>