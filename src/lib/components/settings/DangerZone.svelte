<script lang="ts">
	export let onDelete: () => void
</script>

<div class="border border-destructive rounded-lg p-6">
	<h2 class="text-xl font-semibold text-destructive mb-4">위험 구역</h2>
	
	<div class="space-y-4">
		<p class="text-sm text-muted-foreground">
			모임을 삭제하면 모든 데이터(멤버, 칭찬 메시지 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
		</p>

		<button
			on:click={onDelete}
			class="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded-md hover:bg-destructive/90"
		>
			모임 삭제
		</button>
	</div>
</div>
