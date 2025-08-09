<script lang="ts">
	import { joinGroup } from '$lib/utils/groups'
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'
	import InviteSuccessView from '$lib/components/invite/InviteSuccessView.svelte'
	import GroupInviteCard from '$lib/components/invite/GroupInviteCard.svelte'
	import InviteActions from '$lib/components/invite/InviteActions.svelte'

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
				on:cancel={handleCancel}
				on:join={handleJoinGroup}
			/>
		{/if}
	</div>
</div>