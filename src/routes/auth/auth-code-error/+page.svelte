<script lang="ts">
	import { page } from '$app/stores'
	
	$: errorMessage = $page.url.searchParams.get('error') || 'Google 로그인 중 알 수 없는 오류가 발생했습니다.'
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md p-8 text-center">
		<div class="text-6xl mb-6">⚠️</div>
		<h1 class="text-2xl font-bold mb-4">로그인 오류</h1>
		
		<div class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
			<p class="text-destructive text-sm">
				{errorMessage}
			</p>
		</div>

		<p class="text-muted-foreground mb-6">
			Google 로그인 중 문제가 발생했습니다.<br />
			다시 시도해보세요.
		</p>
		
		<div class="space-y-3">
			<a 
				href="/login" 
				class="block w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
			>
				다시 로그인하기
			</a>
			<a 
				href="/" 
				class="block w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg hover:bg-secondary/80 transition-colors font-medium"
			>
				홈페이지로 이동
			</a>
		</div>

		<div class="mt-8 text-xs text-muted-foreground">
			<p>문제가 지속되면 다음을 확인해주세요:</p>
			<ul class="mt-2 space-y-1 text-left">
				<li>• 팝업 차단기가 비활성화되어 있는지</li>
				<li>• 브라우저 쿠키가 허용되어 있는지</li>
				<li>• 인터넷 연결이 안정적인지</li>
			</ul>
		</div>
	</div>
</div>