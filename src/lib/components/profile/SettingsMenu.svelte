<script lang="ts">
	import { goto } from '$app/navigation'
	import { signOut } from '$lib/utils/auth'
	import { toast } from '$lib/stores/toast'

	function goToEditProfile() {
		goto('/profile/edit')
	}

	function goToPraiseHistory() {
		goto('/profile/praises')
	}

	async function handleSignOut() {
		try {
			await signOut()
			toast.success('로그아웃되었습니다.')
		} catch (error) {
			toast.error('로그아웃 중 오류가 발생했습니다.')
		}
	}
</script>

<div class="bg-white rounded-lg shadow-sm">
	<div class="divide-y divide-gray-100">
		<!-- 프로필 수정 -->
		<button
			on:click={goToEditProfile}
			class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
		>
			<div class="flex items-center space-x-3">
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
				<span class="text-gray-900">프로필 수정</span>
			</div>
			<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<!-- 칭찬 기록 -->
		<button
			on:click={goToPraiseHistory}
			class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
		>
			<div class="flex items-center space-x-3">
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
					/>
				</svg>
				<span class="text-gray-900">칭찬 기록</span>
			</div>
			<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<!-- 로그아웃 -->
		<button
			on:click={handleSignOut}
			class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
		>
			<div class="flex items-center space-x-3">
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				<span class="text-gray-900">로그아웃</span>
			</div>
			<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</div>