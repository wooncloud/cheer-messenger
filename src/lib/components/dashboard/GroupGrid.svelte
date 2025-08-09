<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Group } from '$lib/utils/groups'
	import GroupCard from './GroupCard.svelte'
	import EmptyGroupState from './EmptyGroupState.svelte'
	import LoadingSpinner from '../LoadingSpinner.svelte'
	
	export let groups: Group[]
	export let loading: boolean
	export let onCreateGroup: () => void
</script>

{#if loading}
	<div class="py-12">
		<LoadingSpinner size="md" text="모임을 불러오는 중..." />
	</div>
{:else if groups.length === 0}
	<EmptyGroupState {onCreateGroup} />
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each groups as group (group.id)}
			<GroupCard {group} onClick={() => goto(`/group/${group.id}`)} />
		{/each}
	</div>
{/if}