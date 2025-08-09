<script lang="ts">
	import type { GroupMember } from '$lib/utils/praise'

	export let members: GroupMember[]
	export let selectedNewAdmin: string
	export let onTransfer: () => void

	$: availableMembers = members.filter(m => m.role !== 'admin')
</script>

<div class="border rounded-lg p-6">
	<h2 class="text-xl font-semibold mb-4">관리자 권한 위임</h2>
	
	<div class="space-y-4">
		<div>
			<label for="newAdmin" class="block text-sm font-medium mb-2">새 관리자 선택</label>
			<select
				id="newAdmin"
				bind:value={selectedNewAdmin}
				class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value="">멤버를 선택하세요</option>
				{#each availableMembers as member}
					<option value={member.user_id}>{member.user.name}</option>
				{/each}
			</select>
		</div>

		<button
			on:click={onTransfer}
			disabled={!selectedNewAdmin}
			class="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 disabled:opacity-50"
		>
			관리자 권한 위임
		</button>
		
		<p class="text-sm text-muted-foreground">
			권한을 위임하면 당신은 일반 멤버가 되며, 새 관리자가 모임을 관리하게 됩니다.
		</p>
	</div>
</div>
