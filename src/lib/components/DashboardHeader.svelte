<script lang="ts">
	import type { User } from '@supabase/supabase-js'
	
	export let user: User
	export let onCreateGroup: () => void
	export let onLogout: () => void
</script>

<div class="flex justify-between items-center mb-8">
	<div>
		<h1 class="text-3xl font-bold">내 모임</h1>
		<p class="text-muted-foreground mt-1">{user.user_metadata?.name || user.email}님 환영합니다!</p>
	</div>
	<div class="flex gap-4">
		<button 
			on:click={onCreateGroup}
			class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
		>
			모임 만들기
		</button>
		<button 
			on:click={onLogout}
			class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
		>
			로그아웃
		</button>
	</div>
</div>