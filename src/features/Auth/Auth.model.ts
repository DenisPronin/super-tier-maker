import type { Nullish } from '@/types'

export const FEATURE_NAME = 'auth'

// Email validation only (Supabase standard)
export function validateEmail(value: string): Nullish<string> {
  const isEmailValid = /^\S+@\S+\.\S+$/.test(value)
  if (!isEmailValid) {
    return 'Invalid email address'
  }
  return null
}

// Password validation (Supabase requires min 6 chars by default)
export function validatePassword(value: string): Nullish<string> {
  if (value.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return null
}

// Confirm password validation
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): Nullish<string> {
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return null
}
