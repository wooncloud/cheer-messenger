<script lang="ts">
	export let onCreateGroup: () => void
</script>

<div class="text-center py-16">
	<div class="text-6xl mb-4">🎉</div>
	<h2 class="text-xl font-semibold mb-2">첫 번째 모임을 만들어보세요!</h2>
	<p class="text-muted-foreground mb-6">
		친구들과 함께 서로를 칭찬하고 격려할 수 있는 모임을 시작해보세요.
	</p>
	<button 
		on:click={onCreateGroup}
		class="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
	>
		모임 만들기
	</button>
</div>