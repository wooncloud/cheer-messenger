<script lang="ts">
	import { goto } from '$app/navigation'
	import { createEventDispatcher } from 'svelte'

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
	<div>
		<button
			on:click={() => goto('/')}
			class="text-muted-foreground hover:text-foreground mb-2"
		>
			← 돌아가기
		</button>
		<h1 class="text-3xl font-bold">{group.name}</h1>
		{#if group.description}
			<p class="text-muted-foreground mt-1">{group.description}</p>
		{/if}
	</div>

	<div class="flex gap-2">
		<button
			on:click={handleCopyInvite}
			class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
		>
			초대 링크 복사
		</button>
		{#if group.user_role === 'admin'}
			<button
				on:click={() => goto(`/group/${group.id}/settings`)}
				class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
			>
				모임 설정
			</button>
		{:else}
			<button
				on:click={handleLeaveGroup}
				class="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90"
			>
				모임 나가기
			</button>
		{/if}
	</div>
</div>
