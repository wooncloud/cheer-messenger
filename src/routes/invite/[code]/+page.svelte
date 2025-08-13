<script lang="ts">
	import { joinGroup } from '$lib/utils/groups'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { user } from '$lib/stores/auth'
	import { browser } from '$app/environment'
	import { onMount } from 'svelte'
	import InviteSuccessView from '$lib/components/invite/InviteSuccessView.svelte'
	import GroupInviteCard from '$lib/components/invite/GroupInviteCard.svelte'
	import InviteActions from '$lib/components/invite/InviteActions.svelte'

	export let data

	let loading = false
	let error = ''
	let success = false
	let autoJoinAttempted = false // 중복 자동 가입 방지

	// 로그인 후 자동 가입을 위한 상태 관리
	onMount(() => {
		// URL 파라미터로 자동 가입 체크 (로그인 직후 리디렉션된 경우)
		const autoJoin = $page.url.searchParams.get('autoJoin')
		if (autoJoin === 'true' && $user) {
			autoJoinAttempted = true
			// URL에서 autoJoin 파라미터 제거
			const cleanUrl = $page.url.pathname
			window.history.replaceState({}, '', cleanUrl)
			handleJoinGroup()
			return
		}
		
		checkAutoJoin()
	})

	// 사용자 상태 변화 감지하여 자동 가입 처리
	$: if (browser && $user) {
		checkAutoJoin()
	}

	function checkAutoJoin() {
		if (!browser || !$user || autoJoinAttempted) return
		
		const pendingGroupId = sessionStorage.getItem('pendingJoinGroup')
		
		if (pendingGroupId && pendingGroupId === data.group.id) {
			autoJoinAttempted = true
			sessionStorage.removeItem('pendingJoinGroup')
			handleJoinGroup()
		}
	}

	async function handleJoinGroup() {
		// 로그인하지 않은 경우 로그인 후 자동 가입하도록 설정
		if (!$user) {
			if (browser) {
				sessionStorage.setItem('pendingJoinGroup', data.group.id)
				// URL 파라미터로도 자동 가입 신호 전달
				const redirectUrl = `/invite/${data.group.invite_code}?autoJoin=true`
				goto('/login?redirect=' + encodeURIComponent(redirectUrl))
			}
			return
		}

		// 이미 로딩 중이면 중복 실행 방지
		if (loading) {
			return
		}

		loading = true
		error = ''

		try {
			await joinGroup(data.group.id)
			success = true
			
			setTimeout(() => {
				goto(`/group/${data.group.id}`)
			}, 2000)
		} catch (err) {
			error = err instanceof Error ? err.message : '모임 가입에 실패했습니다.'
			autoJoinAttempted = false // 실패 시 재시도 허용
		} finally {
			loading = false
		}
	}

	function handleCancel() {
		goto('/')
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md p-8">
		{#if success}
			<InviteSuccessView groupName={data.group.name} />
		{:else}
			<div class="text-center mb-8">
				<div class="text-4xl mb-4">🎊</div>
				<h1 class="text-2xl font-bold mb-2">모임 초대</h1>
				<p class="text-muted-foreground">새로운 모임에 초대되었습니다!</p>
			</div>

			<GroupInviteCard group={data.group} />

			<InviteActions 
				{loading} 
				{error}
				isAuthenticated={data.isAuthenticated && !!$user}
				on:cancel={handleCancel}
				on:join={handleJoinGroup}
			/>
		{/if}
	</div>
</div>