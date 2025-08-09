<script lang="ts">
	export let maxMembers: number
</script>

<div>
	<label for="maxMembers" class="block text-sm font-medium mb-2">최대 인원</label>
	<input
		id="maxMembers"
		type="number"
		bind:value={maxMembers}
		min="2"
		max="1000"
		class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
	/>
	<p class="text-sm text-muted-foreground mt-1">2명 이상 1000명 이하</p>
</div>