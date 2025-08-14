<script lang="ts">
	import { user, loading } from '$lib/stores/auth'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { getUserGroups, type Group } from '$lib/utils/groups'
	import { supabase } from '$lib/supabase'
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte'
	import GroupGrid from '$lib/components/dashboard/GroupGrid.svelte'

	let groups: Group[] = []
	let loadingGroups = true
	let error = ''

	let authCheckCompleted = false

	onMount(() => {
		// OAuth 콜백 처리를 위한 초기 지연
		const authTimer = setTimeout(() => {
			authCheckCompleted = true
			handleAuthCheck()
		}, 500)

		return () => clearTimeout(authTimer)
	})

	function handleAuthCheck() {
		if (!$loading && !$user) {
			goto('/login')
		} else if ($user && loadingGroups) {
			loadGroups()
		}
	}

	// 인증 상태 변경 반응
	$: if (authCheckCompleted && !$loading && !$user) {
		goto('/login')
	}

	$: if (authCheckCompleted && $user && loadingGroups) {
		loadGroups()
	}

	async function loadGroups() {
		try {
			loadingGroups = true
			groups = await getUserGroups()
		} catch (err) {
			error = err instanceof Error ? err.message : '모임을 불러오는데 실패했습니다.'
		} finally {
			loadingGroups = false
		}
	}

	async function handleLogout() {
		try {
			await supabase.auth.signOut()
			goto('/login')
		} catch (err) {
			console.error('Logout error:', err)
			// 로그아웃 실패시에도 로그인 페이지로 이동
			goto('/login')
		}
	}

	function handleCreateGroup() {
		goto('/create-group')
	}
</script>

{#if $loading}
	<div class="flex items-center justify-center h-64">
		<LoadingSpinner size="lg" text="로딩 중..." />
	</div>
{:else if $user}
	<div class="container mx-auto p-4">
		{#if error}
			<div class="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">{error}</div>
		{/if}
		
		<GroupGrid 
			{groups} 
			loading={loadingGroups}
			onCreateGroup={handleCreateGroup}
		/>
	</div>
{/if}

