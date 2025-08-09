<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md'
	export let text: string = ''

	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8', 
		lg: 'w-16 h-16'
	}
</script>

<div class="flex flex-col items-center justify-center">
	<div class="{sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
	{#if text}
		<p class="text-muted-foreground mt-2">{text}</p>
	{/if}
</div>