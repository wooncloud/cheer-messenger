<script lang="ts">
	export let name: string
	export let onKeydown: (event: KeyboardEvent) => void
</script>

<div>
	<label for="name" class="block text-sm font-medium mb-2">모임 이름 *</label>
	<input
		id="name"
		type="text"
		bind:value={name}
		on:keydown={onKeydown}
		placeholder="예: 우리 팀, 독서 모임, 운동 동호회"
		maxlength="100"
		required
		class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
	/>
	<p class="text-sm text-muted-foreground mt-1">{name.length}/100자</p>
</div>