<script lang="ts">
	import { joinGroup } from '$lib/utils/groups'
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'

	export let data

	let loading = false
	let error = ''
	let success = false

	onMount(() => {
		if (!$user) {
			goto('/login?redirect=' + encodeURIComponent(`/invite/${data.group.invite_code}`))
		}
	})

	$: if (!$user) {
		goto('/login?redirect=' + encodeURIComponent(`/invite/${data.group.invite_code}`))
	}

	async function handleJoinGroup() {
		if (!$user) return

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
		} finally {
			loading = false
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md p-8">
		{#if success}
			<div class="text-center">
				<div class="text-6xl mb-4">🎉</div>
				<h1 class="text-2xl font-bold mb-2">모임 가입 완료!</h1>
				<p class="text-muted-foreground mb-4">
					<span class="font-semibold">{data.group.name}</span> 모임에 성공적으로 가입했습니다.
				</p>
				<p class="text-sm text-muted-foreground">잠시 후 모임 페이지로 이동합니다...</p>
			</div>
		{:else}
			<div class="text-center mb-8">
				<div class="text-4xl mb-4">🎊</div>
				<h1 class="text-2xl font-bold mb-2">모임 초대</h1>
				<p class="text-muted-foreground">새로운 모임에 초대되었습니다!</p>
			</div>

			<div class="border rounded-lg p-6 mb-6">
				<h2 class="text-xl font-semibold mb-2">{data.group.name}</h2>
				
				{#if data.group.description}
					<p class="text-muted-foreground mb-4">{data.group.description}</p>
				{/if}

				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-muted-foreground">생성자:</span>
						<span>{data.group.owner?.name}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">현재 멤버:</span>
						<span>{data.group.member_count?.[0]?.count || 0}명</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">최대 인원:</span>
						<span>{data.group.max_members}명</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">생성일:</span>
						<span>{new Date(data.group.created_at).toLocaleDateString('ko-KR')}</span>
					</div>
				</div>
			</div>

			{#if error}
				<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-4">{error}</div>
			{/if}

			<div class="flex gap-4">
				<button
					type="button"
					on:click={() => goto('/')}
					class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
				>
					취소
				</button>
				<button
					type="button"
					on:click={handleJoinGroup}
					disabled={loading}
					class="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
				>
					{loading ? '가입 중...' : '모임 가입하기'}
				</button>
			</div>

			<div class="mt-6 text-center text-sm text-muted-foreground">
				이 모임에서 멤버들과 서로 칭찬하고 격려할 수 있어요! 👏
			</div>
		{/if}
	</div>
</div>