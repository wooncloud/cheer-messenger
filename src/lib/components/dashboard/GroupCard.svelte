<script lang="ts">
	import type { Group } from '$lib/utils/groups'
	import { formatDateOnly } from '$lib/utils/time'
	
	export let group: Group
	export let onClick: () => void
</script>

<button
	on:click={onClick}
	class="border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 text-left bg-card"
>
	<div class="flex items-start justify-between mb-3">
		<h3 class="font-semibold text-lg line-clamp-2">{group.name}</h3>
		{#if group.user_role === 'admin'}
			<span class="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">관리자</span>
		{/if}
	</div>
	
	{#if group.description}
		<p class="text-muted-foreground text-sm mb-4 line-clamp-2">{group.description}</p>
	{/if}

	<div class="flex justify-between items-center text-sm">
		<span class="text-muted-foreground">멤버 {group.member_count || 0}명</span>
		<span class="text-muted-foreground">칭찬 {group.praise_count || 0}개</span>
	</div>

	<div class="mt-3 text-xs text-muted-foreground">
		생성일: {formatDateOnly(group.created_at)}
	</div>
</button>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>