import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  console.log('OAuth callback received:', {
    fullUrl: url.toString(),
    searchParams: Object.fromEntries(url.searchParams.entries())
  })

  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const errorDescription = url.searchParams.get('error_description')
  const next = url.searchParams.get('next') ?? '/dashboard'

  // OAuth 에러가 있는 경우 (사용자가 로그인을 취소했거나 다른 OAuth 에러)
  if (error) {
    console.error('OAuth provider error:', {
      error,
      errorDescription,
      url: url.toString()
    })
    throw redirect(303, '/login?error=oauth_cancelled')
  }

  // code가 없는 경우
  if (!code) {
    console.error('No authorization code received:', {
      url: url.toString(),
      searchParams: Object.fromEntries(url.searchParams.entries())
    })
    throw redirect(303, '/login?error=no_code')
  }

  try {
    console.log('Attempting to exchange code for session...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Failed to exchange code for session:', {
        error: exchangeError,
        code: code.substring(0, 10) + '...', // 보안을 위해 코드 일부만 로깅
        message: exchangeError.message
      })
      throw redirect(303, '/login?error=exchange_failed')
    }

    if (!data.user) {
      console.error('No user data received after successful code exchange:', data)
      throw redirect(303, '/login?error=no_user_data')
    }

    console.log('OAuth login successful for user:', {
      userId: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.full_name || data.user.user_metadata?.name
    })

    // 사용자 프로필 자동 생성/업데이트
    try {
      console.log('Creating/updating user profile...')
      await supabase
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
      console.log('User profile created/updated successfully')
    } catch (profileError) {
      console.error('Profile upsert error (non-fatal):', profileError)
      // 프로필 생성 실패해도 로그인은 허용
    }
    
    // 인증 성공 - 리다이렉트 경로 결정
    const redirectPath = next.startsWith('/') ? next : `/${next}`
    console.log('Redirecting to:', redirectPath)
    throw redirect(303, redirectPath)

  } catch (error) {
    // redirect 에러는 정상적인 흐름이므로 다시 throw
    if (error instanceof Response && [301, 302, 303, 307, 308].includes(error.status)) {
      throw error
    }
    
    // 예상치 못한 에러
    console.error('Unexpected error in OAuth callback:', error)
    throw redirect(303, '/login?error=unexpected_error')
  }
}