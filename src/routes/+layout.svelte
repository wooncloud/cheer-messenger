<script lang="ts">
	import '../app.css'
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { supabase } from '$lib/supabase'
	import { user, session, loading } from '$lib/stores/auth'
	import Toast from '$lib/components/Toast.svelte'
	import AppHeader from '$lib/components/layout/AppHeader.svelte'
	import AppNavigation from '$lib/components/layout/AppNavigation.svelte'

	export let data

	$: $session = data.session
	$: $user = data.session?.user ?? null
	
	// 헤더와 네비게이션을 숨길 페이지들
	$: hideLayout = $page.route?.id === '/login' || 
		$page.route?.id === '/auth/callback' || 
		$page.route?.id === '/auth/auth-code-error' ||
		$page.route?.id === '/invite/error' ||
		!$user
	
	// 페이지별 헤더 설정
	$: headerProps = getHeaderProps($page.route?.id, $page.params)
	
	function getHeaderProps(routeId: string | null, params: Record<string, string>) {
		if (routeId === '/dashboard' || routeId === '/') {
			return { title: 'Cheeract', showSettings: false, showBack: false }
		}
		if (routeId === '/create-group') {
			return { title: '새 그룹 만들기', showSettings: false, showBack: true }
		}
		if (routeId === '/group/[id]') {
			return { title: '그룹', showSettings: true, showBack: true }
		}
		if (routeId === '/group/[id]/settings') {
			return { title: '그룹 설정', showSettings: false, showBack: true }
		}
		if (routeId?.startsWith('/invite/')) {
			return { title: '초대', showSettings: false, showBack: true }
		}
		if (routeId === '/profile') {
			return { title: '마이페이지', showSettings: false, showBack: false }
		}
		if (routeId === '/profile/edit') {
			return { title: '프로필 수정', showSettings: false, showBack: true }
		}
		if (routeId === '/profile/praises') {
			return { title: '칭찬 기록', showSettings: false, showBack: true }
		}
		if (routeId === '/stats') {
			return { title: '통계', showSettings: false, showBack: false }
		}
		return { title: 'Cheeract', showSettings: false, showBack: false }
	}

	onMount(() => {
		$loading = false

		// OAuth 인증 상태 변화 감지
		const { data: authData } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (event === 'SIGNED_OUT') {
				$session = null
				$user = null
				invalidate('supabase:auth')
			} else if (event === 'SIGNED_IN' && newSession) {
				$session = newSession
				$user = newSession.user
				invalidate('supabase:auth')
			} else if (event === 'TOKEN_REFRESHED' && newSession) {
				$session = newSession
				$user = newSession.user
			}
		})

		return () => authData.subscription.unsubscribe()
	})
</script>

{#if hideLayout}
	<!-- 로그인 페이지 등에서는 기본 레이아웃만 표시 -->
	<main class="min-h-screen">
		<slot />
		<Toast />
	</main>
{:else}
	<!-- 앱 레이아웃 (헤더 + 메인 콘텐츠 + 네비게이션) -->
	<div class="min-h-screen bg-gray-50">
		<AppHeader {...headerProps} />
		
		<main class="pt-14 pb-16 min-h-screen bg-gray-50">
			<slot />
		</main>
		
		<AppNavigation />
		<Toast />
	</div>
{/if}