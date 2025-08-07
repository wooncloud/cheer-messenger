<script lang="ts">
	import { createGroup } from '$lib/utils/groups'
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'

	let name = ''
	let description = ''
	let maxMembers = 50
	let loading = false
	let error = ''

	onMount(() => {
		if (!$user) {
			goto('/login')
		}
	})

	async function handleSubmit() {
		if (!name.trim()) {
			error = '모임 이름을 입력해주세요.'
			return
		}

		if (name.length > 100) {
			error = '모임 이름은 100자를 초과할 수 없습니다.'
			return
		}

		if (description.length > 500) {
			error = '모임 설명은 500자를 초과할 수 없습니다.'
			return
		}

		if (maxMembers < 2 || maxMembers > 1000) {
			error = '최대 인원은 2명 이상 1000명 이하여야 합니다.'
			return
		}

		loading = true
		error = ''

		try {
			await createGroup({
				name: name.trim(),
				description: description.trim() || undefined,
				max_members: maxMembers
			})

			goto('/')
		} catch (err) {
			error = err instanceof Error ? err.message : '모임 생성에 실패했습니다.'
		} finally {
			loading = false
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleSubmit()
		}
	}
</script>

<div class="container mx-auto py-8 max-w-2xl">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">새 모임 만들기</h1>
		<p class="text-muted-foreground">서로 칭찬하고 격려할 수 있는 모임을 만들어보세요</p>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label for="name" class="block text-sm font-medium mb-2">모임 이름 *</label>
			<input
				id="name"
				type="text"
				bind:value={name}
				on:keydown={handleKeydown}
				placeholder="예: 우리 팀, 독서 모임, 운동 동호회"
				maxlength="100"
				required
				class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
			/>
			<p class="text-sm text-muted-foreground mt-1">{name.length}/100자</p>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium mb-2">모임 설명</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder="모임에 대한 간단한 설명을 입력하세요 (선택사항)"
				maxlength="500"
				rows="4"
				class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
			></textarea>
			<p class="text-sm text-muted-foreground mt-1">{description.length}/500자</p>
		</div>

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

		{#if error}
			<div class="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>
		{/if}

		<div class="flex gap-4">
			<button
				type="button"
				on:click={() => goto('/')}
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
	</form>

	<div class="mt-8 p-4 bg-muted rounded-lg">
		<h3 class="font-medium mb-2">💡 모임 생성 후 할 수 있는 것들</h3>
		<ul class="text-sm text-muted-foreground space-y-1">
			<li>• 초대 링크를 생성하여 친구들을 초대할 수 있어요</li>
			<li>• 모임원들에게 다양한 이모지와 메시지로 칭찬을 보낼 수 있어요</li>
			<li>• 칭찬 쿨타임을 설정하여 모임을 관리할 수 있어요</li>
			<li>• 관리자 권한을 다른 멤버에게 위임할 수 있어요</li>
		</ul>
	</div>
</div>