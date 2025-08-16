<script lang="ts">
	import { page } from '$app/stores'
	import { user } from '$lib/stores/auth'
	import { goto } from '$app/navigation'
	
	$: currentPath = $page.url.pathname
	$: isGroupsActive = currentPath === '/dashboard' || currentPath === '/'
	$: isProfileActive = currentPath.startsWith('/profile')
	
	function navigateToGroups() {
		goto('/dashboard')
	}
	
	function navigateToProfile() {
		goto('/profile');
	}
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
	<div class="grid grid-cols-2 h-16">
		<!-- 그룹 탭 -->
		<button
			on:click={navigateToGroups}
			class="flex flex-col items-center justify-center space-y-1 transition-colors {isGroupsActive 
				? 'text-blue-600 bg-blue-50' 
				: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			<span class="text-xs font-medium">그룹</span>
		</button>
		
		<!-- MY 탭 -->
		<button
			on:click={navigateToProfile}
			class="flex flex-col items-center justify-center space-y-1 transition-colors {isProfileActive 
				? 'text-blue-600 bg-blue-50' 
				: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
					d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
			</svg>
			<span class="text-xs font-medium">MY</span>
		</button>
	</div>
</nav>