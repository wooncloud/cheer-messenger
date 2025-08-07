<script lang="ts">
	import { user, loading } from '$lib/stores/auth'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { getUserGroups, type Group } from '$lib/utils/groups'
	import { supabase } from '$lib/supabase'

	let groups: Group[] = []
	let loadingGroups = true
	let error = ''

	onMount(() => {
		if (!$loading && !$user) {
			goto('/login')
		} else if ($user) {
			loadGroups()
		}
	})

	$: if (!$loading && !$user) {
		goto('/login')
	}

	$: if ($user && loadingGroups) {
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
		await supabase.auth.signOut()
		goto('/login')
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('ko-KR')
	}
</script>

{#if $loading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-muted-foreground">로딩 중...</p>
		</div>
	</div>
{:else if $user}
	<div class="container mx-auto py-8">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold">내 모임</h1>
				<p class="text-muted-foreground mt-1">{$user.user_metadata?.name || $user.email}님 환영합니다!</p>
			</div>
			<div class="flex gap-4">
				<button 
					on:click={() => goto('/create-group')}
					class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
				>
					모임 만들기
				</button>
				<button 
					on:click={handleLogout}
					class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
				>
					로그아웃
				</button>
			</div>
		</div>

		{#if error}
			<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-6">{error}</div>
		{/if}
		
		<!-- 모임 목록 바둑판 형태 -->
		{#if loadingGroups}
			<div class="text-center py-12">
				<div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p class="text-muted-foreground">모임을 불러오는 중...</p>
			</div>
		{:else if groups.length === 0}
			<div class="text-center py-16">
				<div class="text-6xl mb-4">🎉</div>
				<h2 class="text-xl font-semibold mb-2">첫 번째 모임을 만들어보세요!</h2>
				<p class="text-muted-foreground mb-6">
					친구들과 함께 서로를 칭찬하고 격려할 수 있는 모임을 시작해보세요.
				</p>
				<button 
					on:click={() => goto('/create-group')}
					class="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
				>
					모임 만들기
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each groups as group (group.id)}
					<button
						on:click={() => goto(`/group/${group.id}`)}
						class="border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 text-left bg-card"
					>
						<div class="flex items-start justify-between mb-3">
							<h3 class="font-semibold text-lg line-clamp-2">{group.name}</h3>
							{#if group.user_role === 'admin'}
								<span class="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">관리자</span>
							{/if}
						</div>
						
						{#if group.description}
							<p class="text-muted-foreground text-sm mb-4 line-clamp-2">{group.description}</p>
						{/if}

						<div class="flex justify-between items-center text-sm">
							<span class="text-muted-foreground">멤버 {group.member_count || 0}명</span>
							<span class="text-muted-foreground">칭찬 {group.praise_count || 0}개</span>
						</div>

						<div class="mt-3 text-xs text-muted-foreground">
							생성일: {formatDate(group.created_at)}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>