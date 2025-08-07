<script lang="ts">
	import { supabase } from '$lib/supabase'
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'

	let email = ''
	let password = ''
	let confirmPassword = ''
	let name = ''
	let loading = false
	let error = ''

	onMount(() => {
		if ($user) {
			goto('/')
		}
	})

	async function handleSignup() {
		if (!email || !password || !name) {
			error = '모든 필드를 입력해주세요.'
			return
		}

		if (password !== confirmPassword) {
			error = '비밀번호가 일치하지 않습니다.'
			return
		}

		if (password.length < 6) {
			error = '비밀번호는 최소 6자 이상이어야 합니다.'
			return
		}

		if (name.length > 50) {
			error = '이름은 50자를 초과할 수 없습니다.'
			return
		}

		loading = true
		error = ''

		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name: name.trim()
				}
			}
		})

		if (authError) {
			error = authError.message === 'User already registered' 
				? '이미 가입된 이메일입니다.' 
				: authError.message
		} else if (data.user) {
			// 회원가입 후 users 테이블에 프로필 정보 추가
			const { error: profileError } = await supabase
				.from('users')
				.insert({
					id: data.user.id,
					email: data.user.email!,
					name: name.trim()
				})

			if (profileError) {
				console.error('Profile creation error:', profileError)
			}

			goto('/')
		}

		loading = false
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSignup()
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md space-y-8 p-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Cheer Messenger</h1>
			<p class="text-muted-foreground mt-2">새 계정을 만드세요</p>
		</div>

		<form on:submit|preventDefault={handleSignup} class="space-y-4">
			<div>
				<label for="name" class="block text-sm font-medium mb-2">이름</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					on:keydown={handleKeydown}
					placeholder="홍길동"
					maxlength="50"
					required
					class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				/>
			</div>

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
					placeholder="최소 6자 이상"
					minlength="6"
					required
					class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				/>
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium mb-2">비밀번호 확인</label>
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					on:keydown={handleKeydown}
					placeholder="비밀번호를 다시 입력하세요"
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
				{loading ? '회원가입 중...' : '회원가입'}
			</button>
		</form>

		<div class="text-center">
			<p class="text-muted-foreground">
				이미 계정이 있으신가요?
				<a href="/login" class="text-primary hover:underline">로그인</a>
			</p>
		</div>
	</div>
</div>