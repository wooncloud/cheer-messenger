<script lang="ts">
	export let group: {
		name: string
		description?: string | null
		owner?: { name: string } | null
		member_count?: { count: number }[] | null
		max_members: number
		created_at: string
	}
</script>

<div class="border rounded-lg p-6 mb-6">
	<h2 class="text-xl font-semibold mb-2">{group.name}</h2>
	
	{#if group.description}
		<p class="text-muted-foreground mb-4">{group.description}</p>
	{/if}

	<div class="space-y-2 text-sm">
		<div class="flex justify-between">
			<span class="text-muted-foreground">생성자:</span>
			<span>{group.owner?.name}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-muted-foreground">현재 멤버:</span>
			<span>{group.member_count?.[0]?.count || 0}명</span>
		</div>
		<div class="flex justify-between">
			<span class="text-muted-foreground">최대 인원:</span>
			<span>{group.max_members}명</span>
		</div>
		<div class="flex justify-between">
			<span class="text-muted-foreground">생성일:</span>
			<span>{new Date(group.created_at).toLocaleDateString('ko-KR')}</span>
		</div>
	</div>
</div>
