<script lang="ts">
	import { user } from '$lib/stores/auth'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	onMount(() => {
		// 이미 로그인한 사용자는 대시보드로 리다이렉트
		if ($user) {
			goto('/dashboard')
		}
	})

	// 로그인 상태 변경 시 자동 리다이렉트
	$: if ($user) {
		goto('/dashboard')
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="container mx-auto px-4 py-16">
		<!-- 헤더 -->
		<header class="text-center mb-16">
			<h1 class="text-5xl font-bold text-gray-900 mb-4">
				🎉 Cheeract
			</h1>
			<p class="text-xl text-gray-600 mb-8">
				Let's Cheeract together!
			</p>
			<p class="text-xl text-gray-600 mb-8">
				팀원들과 서로 칭찬하고 격려하는 소통 플랫폼
			</p>
			<div class="flex gap-4 justify-center">
				{#if $user}
					<button
						on:click={() => goto('/dashboard')}
						class="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
					>
						대시보드로 이동
					</button>
				{:else}
					<button
						on:click={() => goto('/login')}
						class="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
					>
						시작하기
					</button>
				{/if}
			</div>
		</header>

		<!-- 주요 기능 -->
		<section class="grid md:grid-cols-3 gap-8 mb-16">
			<div class="text-center p-6 bg-white rounded-xl shadow-sm">
				<div class="text-4xl mb-4">👥</div>
				<h3 class="text-xl font-semibold mb-3">모임 관리</h3>
				<p class="text-gray-600">팀, 동호회, 스터디 그룹 등 다양한 모임을 만들고 관리하세요</p>
			</div>
			<div class="text-center p-6 bg-white rounded-xl shadow-sm">
				<div class="text-4xl mb-4">👏</div>
				<h3 class="text-xl font-semibold mb-3">칭찬하기</h3>
				<p class="text-gray-600">다양한 이모지와 메시지로 동료들에게 진심 어린 칭찬을 전하세요</p>
			</div>
			<div class="text-center p-6 bg-white rounded-xl shadow-sm">
				<div class="text-4xl mb-4">🔒</div>
				<h3 class="text-xl font-semibold mb-3">안전한 소통</h3>
				<p class="text-gray-600">공개/비공개, 익명 칭찬 등 다양한 설정으로 안전하게 소통하세요</p>
			</div>
		</section>

		<!-- CTA -->
		<section class="text-center bg-white rounded-xl p-12 shadow-sm">
			<h2 class="text-3xl font-bold mb-4">지금 바로 시작해보세요</h2>
			<p class="text-gray-600 mb-8">Google 계정으로 간편하게 가입하고 첫 번째 모임을 만들어보세요</p>
			{#if !$user}
				<button
					on:click={() => goto('/login')}
					class="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
				>
					Google로 시작하기
				</button>
			{/if}
		</section>
	</div>
</div>