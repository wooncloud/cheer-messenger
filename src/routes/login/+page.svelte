<script lang="ts">
	import { supabase } from '$lib/supabase'
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'

	let email = ''
	let password = ''
	let loading = false
	let error = ''

	onMount(() => {
		if ($user) {
			goto('/')
		}
	})

	async function handleLogin() {
		if (!email || !password) {
			error = '이메일과 비밀번호를 입력해주세요.'
			return
		}

		loading = true
		error = ''

		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		if (authError) {
			error = authError.message === 'Invalid login credentials' 
				? '이메일 또는 비밀번호가 올바르지 않습니다.' 
				: authError.message
		} else {
			goto('/')
		}

		loading = false
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin()
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Cheer Messenger</h1>
			<p class="text-muted-foreground mt-2">로그인하여 시작하세요</p>
		</div>

		<form on:submit|preventDefault={handleLogin} class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium mb-2">이메일</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					on:keydown={handleKeydown}
					placeholder="example@email.com"
					required
					class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium mb-2">비밀번호</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					on:keydown={handleKeydown}
					placeholder="비밀번호를 입력하세요"
					required
					class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				/>
			</div>

			{#if error}
				<div class="text-destructive text-sm">{error}</div>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
			>
				{loading ? '로그인 중...' : '로그인'}
			</button>
		</form>

		<div class="text-center">
			<p class="text-muted-foreground">
				계정이 없으신가요?
				<a href="/signup" class="text-primary hover:underline">회원가입</a>
			</p>
		</div>
	</div>
</div>