<script lang="ts">
	export let cooldownValue: number
	export let cooldownUnit: string

	const cooldownUnits = [
		{ value: 'none', label: '제한 없음' },
		{ value: 'second', label: '초' },
		{ value: 'minute', label: '분' },
		{ value: 'hour', label: '시간' },
		{ value: 'day', label: '일' },
		{ value: 'week', label: '주' },
		{ value: 'month', label: '월' },
		{ value: 'year', label: '년' }
	]
</script>

<div class="border rounded-lg p-6">
	<h2 class="text-xl font-semibold mb-4">칭찬 쿨타임</h2>
	
	<div class="space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="cooldownValue" class="block text-sm font-medium mb-2">쿨타임 값</label>
				<input
					id="cooldownValue"
					type="number"
					bind:value={cooldownValue}
					min="0"
					disabled={cooldownUnit === 'none'}
					class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
				/>
			</div>
			<div>
				<label for="cooldownUnit" class="block text-sm font-medium mb-2">단위</label>
				<select
					id="cooldownUnit"
					bind:value={cooldownUnit}
					class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
				>
					{#each cooldownUnits as unit}
						<option value={unit.value}>{unit.label}</option>
					{/each}
				</select>
			</div>
		</div>
		
		<p class="text-sm text-muted-foreground">
			{#if cooldownUnit === 'none'}
				칭찬에 제한이 없습니다.
			{:else}
				같은 사람에게 칭찬을 보낸 후 {cooldownValue} {cooldownUnits.find(u => u.value === cooldownUnit)?.label} 동안 대기해야 합니다.
			{/if}
		</p>
	</div>
</div>
