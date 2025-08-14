<script lang="ts">
	import { user } from '$lib/stores/auth'
	import { supabase } from '$lib/supabase'
	import { goto } from '$app/navigation'
	
	export let title = 'Cheeract'
	export let showSettings = true
	export let showBack = false
	export let onBack: (() => void) | undefined = undefined
	
	async function handleSettings() {
		// 현재 페이지에 따라 다른 설정 페이지로 이동
		const currentPath = window.location.pathname
		
		if (currentPath.includes('/group/')) {
			// 그룹 페이지에서는 그룹 설정으로
			const groupId = currentPath.split('/')[2]
			goto(`/group/${groupId}/settings`)
		} else {
			// 기본적으로는 로그아웃 처리
			await handleLogout()
		}
	}
	
	async function handleLogout() {
		try {
			await supabase.auth.signOut()
			goto('/login')
		} catch (err) {
			console.error('Logout error:', err)
			goto('/login')
		}
	}
	
	function handleBackClick() {
		if (onBack) {
			onBack()
		} else {
			window.history.back()
		}
	}
</script>

<header class="sticky top-0 z-50 bg-white border-b border-gray-200">
	<div class="flex items-center justify-between h-14 px-4">
		<!-- 뒤로가기 버튼 또는 로고 영역 -->
		<div class="flex items-center">
			{#if showBack}
				<button 
					on:click={handleBackClick}
					class="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
					aria-label="뒤로가기"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
			{/if}
		</div>
		
		<!-- 제목 -->
		<h1 class="text-lg font-semibold text-gray-900 truncate">
			{title}
		</h1>
		
		<!-- 설정/메뉴 버튼 -->
		<div class="flex items-center">
			{#if showSettings}
				<button 
					on:click={handleSettings}
					class="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
					aria-label="설정"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
</header>