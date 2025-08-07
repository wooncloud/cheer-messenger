<script lang="ts">
	import { fly } from 'svelte/transition'
	import { removeToast, toasts } from '$lib/stores/toast'

	function getToastClasses(type: string) {
		const baseClasses = 'flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-sm'
		
		switch (type) {
			case 'success':
				return `${baseClasses} bg-green-50 border-green-200 text-green-800`
			case 'error':
				return `${baseClasses} bg-red-50 border-red-200 text-red-800`
			case 'warning':
				return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`
			default:
				return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`
		}
	}

	function getIcon(type: string) {
		switch (type) {
			case 'success':
				return '✅'
			case 'error':
				return '❌'
			case 'warning':
				return '⚠️'
			default:
				return 'ℹ️'
		}
	}
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each $toasts as toast (toast.id)}
		<div
			class={getToastClasses(toast.type)}
			transition:fly={{ y: -20, duration: 300 }}
		>
			<span class="text-xl">{getIcon(toast.type)}</span>
			<span class="flex-1">{toast.message}</span>
			<button
				on:click={() => removeToast(toast.id)}
				class="text-current hover:opacity-70 ml-2"
			>
				✕
			</button>
		</div>
	{/each}
</div>