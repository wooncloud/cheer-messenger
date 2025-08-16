<script lang="ts">
	export let avatarUrl: string | null
	export let name: string
	export let size: 'sm' | 'md' | 'lg' = 'md'

	$: sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-16 h-16',
		lg: 'w-24 h-24'
	}

	$: iconSizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12'
	}
</script>

<div
	class="bg-blue-100 rounded-full flex items-center justify-center overflow-hidden {sizeClasses[size]}"
>
	{#if avatarUrl}
		<img src={avatarUrl} alt={name} class="w-full h-full object-cover" />
	{:else}
		<svg
			class="text-blue-600 {iconSizeClasses[size]}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
			/>
		</svg>
	{/if}
</div>