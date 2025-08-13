<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	
	export let tabs: { id: string; label: string; count?: number }[]
	export let activeTab = tabs[0]?.id || ''
	
	const dispatch = createEventDispatcher<{
		tabChange: string
	}>()
	
	function handleTabClick(tabId: string) {
		activeTab = tabId
		dispatch('tabChange', tabId)
	}
</script>

<div class="w-full">
	<!-- Tab Navigation -->
	<div class="flex bg-muted rounded-lg p-1 mb-4">
		{#each tabs as tab}
			<button
				class="flex-1 text-center py-2 px-3 rounded-md transition-colors font-medium text-sm
					{activeTab === tab.id 
						? 'bg-background text-foreground shadow-sm' 
						: 'text-muted-foreground hover:text-foreground'}"
				on:click={() => handleTabClick(tab.id)}
			>
				{tab.label}
				{#if tab.count !== undefined}
					<span class="ml-1 text-xs opacity-70">({tab.count})</span>
				{/if}
			</button>
		{/each}
	</div>
	
	<!-- Tab Content -->
	<div class="tab-content">
		<slot />
	</div>
</div>

<style>
	.tab-content :global(.tab-panel) {
		display: none;
	}
	
	.tab-content :global(.tab-panel.active) {
		display: block;
	}
</style>