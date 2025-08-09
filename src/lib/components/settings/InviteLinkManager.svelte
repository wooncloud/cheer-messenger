<script lang="ts">
	import { toast } from '$lib/stores/toast'

	export let inviteCode: string
	export let regeneratingInvite: boolean
	export let onRegenerate: () => void

	function copyInviteLink() {
		const inviteUrl = `${window.location.origin}/invite/${inviteCode}`
		navigator.clipboard.writeText(inviteUrl)
		toast.success('초대 링크가 복사되었습니다!')
	}
</script>

<div class="border rounded-lg p-6">
	<h2 class="text-xl font-semibold mb-4">초대 링크</h2>
	
	<div class="space-y-4">
		<div>
			<label for="invite-link-input" class="block text-sm font-medium mb-2">현재 초대 링크</label>
			<div class="flex gap-2">
				<input
					id="invite-link-input"
					type="text"
					value={`${window.location.origin}/invite/${inviteCode}`}
					readonly
					class="flex-1 px-3 py-2 border border-input rounded-md bg-muted"
				/>
				<button
					on:click={copyInviteLink}
					class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
				>
					복사
				</button>
			</div>
		</div>

		<button
			on:click={onRegenerate}
			disabled={regeneratingInvite}
			class="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 disabled:opacity-50"
		>
			{regeneratingInvite ? '생성 중...' : '새 초대 링크 생성'}
		</button>
		
		<p class="text-sm text-muted-foreground">
			새 초대 링크를 생성하면 기존 링크는 사용할 수 없게 됩니다.
		</p>
	</div>
</div>
