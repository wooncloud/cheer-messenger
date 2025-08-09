<script lang="ts">
	import { goto } from '$app/navigation'
	import GroupNameField from './GroupNameField.svelte'
	import GroupDescriptionField from './GroupDescriptionField.svelte'
	import GroupMaxMembersField from './GroupMaxMembersField.svelte'
	import CreateGroupActions from './CreateGroupActions.svelte'
	
	export let name: string
	export let description: string
	export let maxMembers: number
	export let loading: boolean
	export let error: string
	export let onSubmit: () => void
	export let onKeydown: (event: KeyboardEvent) => void
</script>

<form on:submit|preventDefault={onSubmit} class="space-y-6">
	<GroupNameField bind:name {onKeydown} />
	
	<GroupDescriptionField bind:description />
	
	<GroupMaxMembersField bind:maxMembers />

	{#if error}
		<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>
	{/if}

	<CreateGroupActions 
		{loading} 
		onCancel={() => goto('/')}
		onSubmit={onSubmit}
	/>
</form>