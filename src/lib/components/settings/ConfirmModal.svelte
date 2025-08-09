<script lang="ts">
	export let show: boolean
	export let title: string
	export let message: string
	export let confirmText: string = '확인'
	export let confirmClass: string = 'bg-primary text-primary-foreground hover:bg-primary/90'
	export let onConfirm: () => void
	export let onCancel: () => void
</script>

{#if show}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<div class="bg-background rounded-lg p-6 w-full max-w-md">
			<h3 class="text-lg font-semibold mb-4 {title.includes('삭제') ? 'text-destructive' : ''}">{title}</h3>
			<p class="text-sm text-muted-foreground mb-6">{message}</p>
			<div class="flex gap-4">
				<button
					on:click={onCancel}
					class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
				>
					취소
				</button>
				<button
					on:click={onConfirm}
					class="flex-1 py-2 px-4 rounded-md {confirmClass}"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
