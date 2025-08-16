<script lang="ts">
	import { enhance } from '$app/forms'
	import { toast } from '$lib/stores/toast'
	import ProfileAvatar from '$lib/components/profile/ProfileAvatar.svelte'
	import FormField from '$lib/components/common/FormField.svelte'
	import PageHeader from '$lib/components/common/PageHeader.svelte'
	import type { PageData, ActionData } from './$types'

	export let data: PageData
	export let form: ActionData

	$: ({ profile } = data)

	let isSubmitting = false
	let name = profile?.name || ''
	let avatarUrl = profile?.avatar_url || ''
	
	// 프로필 데이터가 로드되지 않은 경우 처리
	$: if (profile && (name === '' && avatarUrl === '')) {
		name = profile.name || ''
		avatarUrl = profile.avatar_url || ''
	}


	function handleSubmitResult(result: any) {
		if (result.type === 'success') {
			if (result.data?.success) {
				toast.success(result.data.message)
				window.location.href = '/profile'
			}
		} else if (result.type === 'failure') {
			toast.error(result.data?.error || '프로필 업데이트에 실패했습니다.')
		}
		isSubmitting = false
	}

	function validateForm() {
		// 기본 브라우저 검증에 의존하고, 서버에서 상세 검증
		return name.trim().length > 0
	}

	// 폼 에러 처리
	$: if (form?.error) {
		toast.error(form.error)
	}
</script>

<svelte:head>
	<title>프로필 수정 - Cheeract</title>
</svelte:head>

{#if !profile}
	<!-- 로딩 상태 -->
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p class="text-gray-600">프로필 정보를 불러오는 중...</p>
		</div>
	</div>
{:else}
<div class="min-h-screen bg-gray-50 p-4">
	<div class="max-w-md mx-auto">
		<!-- 현재 프로필 미리보기 -->
		<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
			<h2 class="text-sm font-medium text-gray-700 mb-4">현재 프로필</h2>
			<div class="flex items-center space-x-4">
				<ProfileAvatar 
					avatarUrl={avatarUrl.trim() || null} 
					name={name || '이름 없음'} 
					size="md" 
				/>
				<div>
					<p class="font-medium text-gray-900">{name || '이름 없음'}</p>
					<p class="text-sm text-gray-600">{profile?.email || '이메일 없음'}</p>
				</div>
			</div>
		</div>

		<!-- 수정 폼 -->
		<form 
			method="POST" 
			action="?/updateProfile"
			use:enhance={({ formData, cancel }) => {
				if (!validateForm()) {
					cancel()
					return
				}
				
				isSubmitting = true
				
				return async ({ result }) => {
					handleSubmitResult(result)
				}
			}}
			class="space-y-6"
		>
			<!-- 이름 입력 -->
			<FormField
				id="name"
				name="name"
				type="text"
				label="이름"
				placeholder="예: 홍길동"
				maxlength={50}
				required={true}
				bind:value={name}
				error={!!form?.error}
				showCounter={true}
			/>

			<!-- 아바타 URL 입력 -->
			<FormField
				id="avatar_url"
				name="avatar_url"
				type="url"
				label="프로필 이미지 URL (선택사항)"
				placeholder="https://example.com/profile.jpg"
				bind:value={avatarUrl}
				error={!!form?.error}
				helpText="이미지 URL을 입력하면 프로필 사진으로 설정됩니다. 비워두면 기본 아바타가 표시됩니다."
			/>

			<!-- 저장 버튼 -->
			<div class="bg-white rounded-lg shadow-sm p-6">
				<button
					type="submit"
					disabled={isSubmitting}
					class="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isSubmitting ? '저장 중...' : '프로필 저장'}
				</button>
			</div>
		</form>

		<!-- 도움말 -->
		<div class="mt-6 text-center">
			<p class="text-xs text-gray-500">
				이메일은 변경할 수 없습니다. 계정과 관련된 문의사항이 있으시면 고객센터로 문의해주세요.
			</p>
		</div>
	</div>
</div>
{/if}