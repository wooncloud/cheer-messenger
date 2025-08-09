<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let loading = false
	export let error = ''

	const dispatch = createEventDispatcher<{
		cancel: void
		join: void
	}>()

	function handleCancel() {
		dispatch('cancel')
	}

	function handleJoin() {
		dispatch('join')
	}
</script>

{#if error}
	<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-4">{error}</div>
{/if}

<div class="flex gap-4">
	<button
		type="button"
		on:click={handleCancel}
		class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
	>
		취소
	</button>
	<button
		type="button"
		on:click={handleJoin}
		disabled={loading}
		class="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
	>
		{loading ? '가입 중...' : '모임 가입하기'}
	</button>
</div>

<div class="mt-6 text-center text-sm text-muted-foreground">
	이 모임에서 멤버들과 서로 칭찬하고 격려할 수 있어요! 👏
</div>
