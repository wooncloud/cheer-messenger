<script lang="ts">
	import { createGroup } from '$lib/utils/groups'
	import { goto } from '$app/navigation'
	import { user } from '$lib/stores/auth'
	import { onMount } from 'svelte'
	import CreateGroupHeader from '$lib/components/create-group/CreateGroupHeader.svelte'
	import CreateGroupForm from '$lib/components/create-group/CreateGroupForm.svelte'
	import CreateGroupInfo from '$lib/components/create-group/CreateGroupInfo.svelte'

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
	<CreateGroupHeader />

	<CreateGroupForm 
		bind:name
		bind:description
		bind:maxMembers
		{loading}
		{error}
		onSubmit={handleSubmit}
		onKeydown={handleKeydown}
	/>

	<CreateGroupInfo />
</div>