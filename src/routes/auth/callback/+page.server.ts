import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code')
	const next = url.searchParams.get('next') ?? '/'
	const error_code = url.searchParams.get('error')
	const error_description = url.searchParams.get('error_description')

	// OAuth 에러가 있는 경우
	if (error_code) {
		console.error('OAuth error:', error_code, error_description)
		throw redirect(303, `/auth/auth-code-error?error=${encodeURIComponent(error_description || error_code)}`)
	}

	if (code) {
		try {
			const { data, error } = await supabase.auth.exchangeCodeForSession(code)
			
			if (error) {
				console.error('Session exchange error:', error)
				throw redirect(303, `/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
			}

			if (data.session && data.user) {
				// OAuth 사용자의 경우 프로필 확인 및 생성 (트리거가 실패했을 경우를 대비)
				const { error: profileError } = await supabase
					.from('users')
					.upsert({
						id: data.user.id,
						email: data.user.email!,
						name: data.user.user_metadata?.full_name || 
							  data.user.user_metadata?.name || 
							  data.user.email!.split('@')[0],
						avatar_url: data.user.user_metadata?.avatar_url
					}, {
						onConflict: 'id'
					})

				if (profileError) {
					console.error('Profile upsert error:', profileError)
					// 프로필 생성 실패해도 로그인은 허용
				}

				// 성공적으로 로그인된 경우 리다이렉트
				const redirectPath = next === '/' ? '/' : `/${next.replace(/^\//, '')}`
				throw redirect(303, redirectPath)
			}
		} catch (authError: any) {
			console.error('Auth callback error:', authError)
			// redirect 에러가 아닌 경우에만 에러 페이지로 이동
			if (!authError.status || authError.status !== 303) {
				throw redirect(303, `/auth/auth-code-error?error=${encodeURIComponent(authError.message || 'Authentication processing error occurred')}`)
			}
			throw authError
		}
	}

	// code가 없는 경우
	throw redirect(303, `/auth/auth-code-error?error=${encodeURIComponent('Authentication code is missing')}`)
}