<script lang="ts">
	export let loading: boolean
	export let onCancel: () => void
	export let onSubmit: () => void
</script>

<div class="flex gap-4">
	<button
		type="button"
		on:click={onCancel}
		class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
	>
		취소
	</button>
	<button
		type="submit"
		disabled={loading}
		class="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
	>
		{loading ? '생성 중...' : '모임 만들기'}
	</button>
</div>