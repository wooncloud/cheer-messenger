<script lang="ts">
	import { goto } from '$app/navigation'
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="w-full max-w-md p-8 text-center">
		<div class="text-6xl mb-6">😢</div>
		
		<h1 class="text-2xl font-bold mb-4">초대 링크를 찾을 수 없습니다</h1>
		
		<div class="space-y-2 text-muted-foreground mb-8">
			<p>다음과 같은 이유로 초대 링크가 유효하지 않을 수 있습니다:</p>
			<ul class="text-left space-y-1 mt-4">
				<li>• 링크가 만료되었거나 잘못된 링크입니다</li>
				<li>• 모임이 삭제되었을 수 있습니다</li>
				<li>• 초대 링크가 새로 생성되어 기존 링크가 무효화되었습니다</li>
			</ul>
		</div>

		<div class="space-y-4">
			<button
				on:click={() => goto('/')}
				class="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
			>
				홈으로 돌아가기
			</button>
			
			<p class="text-sm text-muted-foreground">
				모임 관리자에게 새로운 초대 링크를 요청해보세요.
			</p>
		</div>
	</div>
</div>