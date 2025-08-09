<script lang="ts">
	export let groupName: string
	export let groupDescription: string
	export let maxMembers: number
	export let membersCount: number
	export let savingSettings: boolean
	export let onSave: () => void
</script>

<div class="border rounded-lg p-6">
	<h2 class="text-xl font-semibold mb-4">기본 정보</h2>
	
	<div class="space-y-4">
		<div>
			<label for="groupName" class="block text-sm font-medium mb-2">모임 이름</label>
			<input
				id="groupName"
				type="text"
				bind:value={groupName}
				maxlength="100"
				class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
			/>
			<p class="text-sm text-muted-foreground mt-1">{groupName.length}/100자</p>
		</div>

		<div>
			<label for="groupDescription" class="block text-sm font-medium mb-2">모임 설명</label>
			<textarea
				id="groupDescription"
				bind:value={groupDescription}
				maxlength="500"
				rows="3"
				class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
			></textarea>
			<p class="text-sm text-muted-foreground mt-1">{groupDescription.length}/500자</p>
		</div>

		<div>
			<label for="maxMembers" class="block text-sm font-medium mb-2">최대 인원</label>
			<input
				id="maxMembers"
				type="number"
				bind:value={maxMembers}
				min="2"
				max="1000"
				class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
			/>
			<p class="text-sm text-muted-foreground mt-1">현재 멤버: {membersCount}명</p>
		</div>

		<button
			on:click={onSave}
			disabled={savingSettings}
			class="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
		>
			{savingSettings ? '저장 중...' : '설정 저장'}
		</button>
	</div>
</div>
