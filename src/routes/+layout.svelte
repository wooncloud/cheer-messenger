<script lang="ts">
	import '../app.css'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { supabase } from '$lib/supabase'
	import { user, session, loading } from '$lib/stores/auth'
	import Toast from '$lib/components/Toast.svelte'

	export let data

	$: $session = data.session
	$: $user = data.session?.user ?? null

	onMount(() => {
		$loading = false

		// OAuth 인증 상태 변화 감지
		const { data: authData } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (event === 'SIGNED_OUT') {
				$session = null
				$user = null
				invalidate('supabase:auth')
			} else if (event === 'SIGNED_IN' && newSession) {
				$session = newSession
				$user = newSession.user
				invalidate('supabase:auth')
			} else if (event === 'TOKEN_REFRESHED' && newSession) {
				$session = newSession
				$user = newSession.user
			}
		})

		return () => authData.subscription.unsubscribe()
	})
</script>

<main class="min-h-screen">
	<slot />
	<Toast />
</main>