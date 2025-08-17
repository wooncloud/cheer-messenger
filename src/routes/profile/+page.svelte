<script lang="ts">
	import { goto } from '$app/navigation'
	import ProfileAvatar from '$lib/components/profile/ProfileAvatar.svelte'
	import SettingsMenu from '$lib/components/profile/SettingsMenu.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: ({ profile, error } = data)

	function goToEditProfile() {
		goto('/profile/edit')
	}
</script>

<svelte:head>
	<title>마이페이지 - Cheeract</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-4 space-y-6">
	{#if error}
		<!-- 에러 상태 표시 -->
		<div class="bg-red-50 border border-red-200 rounded-lg p-6">
			<div class="flex items-center space-x-3 mb-4">
				<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
				<h2 class="text-lg font-semibold text-red-800">프로필 로드 오류</h2>
			</div>
			<p class="text-red-700 mb-4">다음 오류가 발생했습니다:</p>
			<code class="bg-red-100 text-red-800 p-2 rounded block text-sm">{error}</code>
			<p class="text-red-600 text-sm mt-4">브라우저 개발자 도구 콘솔에서 자세한 로그를 확인하세요.</p>
			<button 
				on:click={() => window.location.reload()} 
				class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
			>
				새로고침
			</button>
		</div>
	{:else if !profile}
		<!-- 로딩 상태 -->
		<div class="bg-white rounded-lg shadow-sm p-6 text-center">
			<p class="text-gray-500">프로필을 불러오는 중...</p>
		</div>
	{:else}
	<!-- 프로필 영역 -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<div class="flex items-center space-x-4">
			<!-- 아바타 -->
			<ProfileAvatar avatarUrl={profile.avatar_url} name={profile.name} size="md" />

			<!-- 사용자 정보 -->
			<div class="flex-1">
				<h1 class="text-xl font-semibold text-gray-900">{profile.name}</h1>
				<p class="text-gray-600 text-sm">{profile.email}</p>
			</div>

			<!-- 수정 버튼 -->
			<button
				on:click={goToEditProfile}
				class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
				</svg>
			</button>
		</div>
	</div>

	<!-- 설정 메뉴 -->
	<SettingsMenu />
	{/if}
</div>

