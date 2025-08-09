<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { EMOJI_OPTIONS } from '$lib/utils/praise'
	import type { GroupMember } from '$lib/utils/praise'

	export let show = false
	export let selectedMember: GroupMember | null = null
	export let sendingPraise = false
	export let praiseError = ''

	let praiseForm = {
		emoji: '👍',
		message: '',
		isPublic: true,
		isAnonymous: false
	}

	const dispatch = createEventDispatcher<{
		close: void
		send: {
			emoji: string
			message?: string
			isPublic: boolean
			isAnonymous: boolean
		}
	}>()

	function handleClose() {
		dispatch('close')
		resetForm()
	}

	function handleSend() {
		dispatch('send', {
			emoji: praiseForm.emoji,
			message: praiseForm.message || undefined,
			isPublic: praiseForm.isPublic,
			isAnonymous: praiseForm.isAnonymous
		})
	}

	function resetForm() {
		praiseForm = {
			emoji: '👍',
			message: '',
			isPublic: true,
			isAnonymous: false
		}
	}

	// Reset form when modal opens
	$: if (show && selectedMember) {
		resetForm()
	}
</script>

{#if show && selectedMember}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<div class="bg-background rounded-lg p-6 w-full max-w-md">
			<h3 class="text-lg font-semibold mb-4">
				{selectedMember.user.name}님에게 칭찬 보내기
			</h3>

			<div class="space-y-4">
				<!-- Emoji Selection -->
				<fieldset>
					<legend class="block text-sm font-medium mb-2">이모지 선택</legend>
					<div
						class="grid grid-cols-5 gap-2"
						role="radiogroup"
						aria-label="칭찬 이모지 선택"
					>
						{#each EMOJI_OPTIONS as emoji}
							<button
								type="button"
								on:click={() => (praiseForm.emoji = emoji)}
								class="text-2xl p-2 rounded border hover:bg-muted transition-colors"
								class:bg-primary={praiseForm.emoji === emoji}
								class:text-primary-foreground={praiseForm.emoji === emoji}
								role="radio"
								aria-checked={praiseForm.emoji === emoji}
								aria-label={`${emoji} 이모지 선택`}
							>
								{emoji}
							</button>
						{/each}
					</div>
				</fieldset>

				<!-- Message -->
				<div>
					<label for="message" class="block text-sm font-medium mb-2">
						칭찬 메시지 (선택사항)
					</label>
					<textarea
						id="message"
						bind:value={praiseForm.message}
						placeholder="따뜻한 칭찬 메시지를 적어주세요..."
						maxlength="500"
						rows="3"
						class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
					></textarea>
					<p class="text-xs text-muted-foreground mt-1">
						{praiseForm.message.length}/500자
					</p>
				</div>

				<!-- Options -->
				<div class="space-y-2">
					<label class="flex items-center gap-2">
						<input
							id="isPublic"
							type="checkbox"
							bind:checked={praiseForm.isPublic}
							aria-describedby="public-help"
						/>
						<span class="text-sm">모든 멤버에게 공개</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							id="isAnonymous"
							type="checkbox"
							bind:checked={praiseForm.isAnonymous}
							aria-describedby="anonymous-help"
						/>
						<span class="text-sm">익명으로 보내기</span>
					</label>
				</div>

				{#if praiseError}
					<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md">
						{praiseError}
					</div>
				{/if}

				<div class="flex gap-4 pt-4">
					<button
						type="button"
						on:click={handleClose}
						class="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80"
					>
						취소
					</button>
					<button
						type="button"
						on:click={handleSend}
						disabled={sendingPraise}
						class="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
					>
						{sendingPraise ? '전송 중...' : '칭찬 보내기'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
