<script lang="ts">
	import { goto } from '$app/navigation';
	
	export let title: string;
	export let showBack: boolean = false;
	export let backUrl: string = '';
	export let onBack: (() => void) | undefined = undefined;
	
	function handleBackClick() {
		if (onBack) {
			onBack();
		} else if (backUrl) {
			goto(backUrl);
		} else {
			history.back();
		}
	}
</script>

<div class="flex items-center mb-6">
	{#if showBack}
		<button
			on:click={handleBackClick}
			class="p-2 -ml-2 text-gray-600 hover:text-gray-800 transition-colors"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
	{/if}
	<h1 class="text-xl font-semibold text-gray-900" class:ml-2={showBack}>
		{title}
	</h1>
</div>