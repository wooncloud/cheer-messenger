<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

	$: if ($page.error?.message === 'Invalid invite code') {
		goto('/invite/error')
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md p-8 text-center">
		<div class="text-6xl mb-6">⚠️</div>
		
		<h1 class="text-2xl font-bold mb-4">
			{$page.status === 404 ? '페이지를 찾을 수 없습니다' : '오류가 발생했습니다'}
		</h1>
		
		<p class="text-muted-foreground mb-8">
			{$page.error?.message || '알 수 없는 오류가 발생했습니다.'}
		</p>

		<button
			on:click={() => goto('/')}
			class="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
		>
			홈으로 돌아가기
		</button>
	</div>
</div>