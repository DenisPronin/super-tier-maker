import type { User, Session, AuthError } from '@supabase/supabase-js'

// Auth Request Types
export interface AuthEmailLoginRequest {
  email: string
  password: string
}

export interface AuthRegisterRequest {
  email: string
  password: string
  confirmPassword: string
}

// Auth Response Types (using Supabase types)
export interface AuthResponse {
  user: User | null
  session: Session | null
  error: AuthError | null
}
