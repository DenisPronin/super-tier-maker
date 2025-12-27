import { supabase } from '@/features/DbClient'
import type {
  AuthEmailLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
} from './Auth.types'

export async function apiAuthSignIn(
  request: AuthEmailLoginRequest
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: request.email,
    password: request.password,
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

export async function apiAuthSignUp(
  request: AuthRegisterRequest
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email: request.email,
    password: request.password,
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

export async function apiAuthSignInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/app/game`,
    },
  })

  if (error) {
    throw error
  }
}

export async function apiAuthSignOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}
