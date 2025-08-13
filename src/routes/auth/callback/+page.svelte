<script lang="ts">
	import { onMount } from 'svelte'
	import { supabase } from '$lib/supabase'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import type { User } from '@supabase/supabase-js'
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte'

	let loading = true
	let error = ''

	interface TokenData {
		accessToken: string
		refreshToken: string
	}

	function parseHashParams(hash: string): URLSearchParams {
		return new URLSearchParams(hash.substring(1))
	}

	function extractTokens(hashParams: URLSearchParams): TokenData | null {
		const accessToken = hashParams.get('access_token')
		const refreshToken = hashParams.get('refresh_token')
		
		return accessToken && refreshToken ? { accessToken, refreshToken } : null
	}

	function getRedirectPath(): string {
		const next = $page.url.searchParams.get('next') || '/dashboard'
		
		if (!next || next === '/') {
			return '/dashboard'
		}
		
		// 이미 '/'로 시작하는 경우 그대로 사용
		return next.startsWith('/') ? next : `/${next}`
	}

	async function createUserProfile(user: User): Promise<void> {
		const { error: profileError } = await supabase
			.from('users')
			.upsert({
				id: user.id,
				email: user.email!,
				name: user.user_metadata?.full_name || 
					  user.user_metadata?.name || 
					  user.email!.split('@')[0],
				avatar_url: user.user_metadata?.avatar_url
			}, {
				onConflict: 'id'
			})

		if (profileError) {
			console.error('Profile upsert error:', profileError)
			// 프로필 생성 실패해도 로그인은 허용
		}
	}

	async function handleOAuthSuccess(tokens: TokenData): Promise<void> {
		const { data, error } = await supabase.auth.setSession({
			access_token: tokens.accessToken,
			refresh_token: tokens.refreshToken
		})

		if (error) {
			console.error('Session setting error:', error)
			throw error
		}

		if (data.session && data.user) {
			await createUserProfile(data.user)
			
			// URL 정리 및 세션 동기화 대기
			window.history.replaceState(null, '', window.location.pathname)
			await new Promise(resolve => setTimeout(resolve, 200))
			
			goto(getRedirectPath())
		}
	}

	function handleOAuthError(hashParams: URLSearchParams): never {
		const oauthError = hashParams.get('error')
		const oauthErrorDescription = hashParams.get('error_description')
		throw new Error(oauthErrorDescription || oauthError || 'OAuth 인증 오류')
	}

	onMount(async () => {
		try {
			const hash = window.location.hash
			
			if (!hash) {
				throw new Error('인증 정보가 없습니다')
			}

			const hashParams = parseHashParams(hash)

			// OAuth 에러 확인
			if (hash.includes('error')) {
				handleOAuthError(hashParams)
			}

			// 토큰 추출 및 처리
			if (hash.includes('access_token')) {
				const tokens = extractTokens(hashParams)
				if (tokens) {
					await handleOAuthSuccess(tokens)
					return
				}
			}

			// 레거시: 서버 사이드 code 파라미터 (사용 안함)
			const code = $page.url.searchParams.get('code')
			if (code) {
				throw new Error('인증 코드 처리 실패')
			}

			throw new Error('유효한 인증 정보가 없습니다')

		} catch (authError: any) {
			console.error('Auth callback error:', authError)
			error = authError.message || 'Google 로그인 처리 중 오류가 발생했습니다'
			loading = false
			
			// 3초 후 로그인 페이지로 리다이렉트
			setTimeout(() => goto('/login'), 3000)
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