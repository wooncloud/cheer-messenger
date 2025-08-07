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
		const { data: authData } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (event === 'SIGNED_OUT' || (event === 'SIGNED_IN' && newSession)) {
				invalidate('supabase:auth')
			}
		})

		return () => authData.subscription.unsubscribe()
	})
</script>

<main class="min-h-screen">
	<slot />
	<Toast />
</main>