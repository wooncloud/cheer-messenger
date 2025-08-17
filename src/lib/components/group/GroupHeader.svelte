<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { goto } from '$app/navigation'

	export let group: {
		id: string
		name: string
		description?: string | null
		user_role?: string
		invite_code: string
	}

	const dispatch = createEventDispatcher<{
		copyInvite: void
		leaveGroup: void
	}>()

	function handleCopyInvite() {
		dispatch('copyInvite')
	}

	function handleLeaveGroup() {
		dispatch('leaveGroup')
	}
</script>

<div class="flex items-center justify-between mb-6">
	<div class="flex-1 min-w-0 mr-4">
		<h1 class="text-3xl font-bold truncate" title={group.name}>{group.name}</h1>
		{#if group.description}
			<p class="text-muted-foreground mt-1 line-clamp-3 break-words" title={group.description}>{group.description}</p>
		{/if}
	</div>

	<div class="flex gap-2">
		<button
			on:click={handleCopyInvite}
			class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
		>
			초대 링크 복사
		</button>
		{#if group.user_role !== 'admin'}
			<button
				on:click={handleLeaveGroup}
				class="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90"
			>
				모임 나가기
			</button>
		{/if}
	</div>
</div>
